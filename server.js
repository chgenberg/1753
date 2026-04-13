// Backend Proxy – 1753 SKINCARE
//
// Express-server som proxar API-anrop till Fortnox, Ongoing WMS, Viva Wallet
// samt autentisering och kunddashboard.
//
// Starta: node server.js
// Kräver: npm install express cors dotenv node-fetch bcryptjs jsonwebtoken
//
// .env-fil krävs i projektroten (se integrations/config.js för alla variabler)

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const db = require("./db");

let bcrypt, jwt;
try { bcrypt = require("bcryptjs"); } catch { bcrypt = null; }
try { jwt = require("jsonwebtoken"); } catch { jwt = null; }

const app = express();
app.set("trust proxy", 1);
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    /\.up\.railway\.app$/,
    /1753skincare\.com$/,
    /1753skin\.com$/,
  ],
  credentials: true,
}));
app.use(express.json({
  limit: "20mb",
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

/** Publik butiks-URL (Next.js). Viva-källkod kan fortfarande peka på *.railway.app – vi skickar vidare hit. */
const PUBLIC_STORE_URL = (process.env.FRONTEND_URL || "https://www.1753skin.com").replace(/\/$/, "");

app.get("/payment-fail.html", (req, res) => {
  const qs = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  res.redirect(302, `${PUBLIC_STORE_URL}/betalning/misslyckad${qs}`);
});

app.get("/payment-success.html", (req, res) => {
  const qs = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  res.redirect(302, `${PUBLIC_STORE_URL}/betalning/lyckad${qs}`);
});

app.use((req, res, next) => {
  const host = req.get("host") || "";
  const onBackendHost =
    host.includes(".up.railway.app") || /^api\.1753skin\.com$/i.test(host);
  if (
    req.method === "GET" &&
    onBackendHost &&
    (req.path === "/" || req.path === "/index.html")
  ) {
    return res.redirect(302, `${PUBLIC_STORE_URL}/`);
  }
  next();
});

app.use(express.static("."));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || process.env.BACKEND_PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "1753skincare_dev_secret_change_in_production";

async function fetchWithRetry(url, options, maxAttempts = 3) {
  const fetch = (await import("node-fetch")).default;
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.status >= 500 && res.status < 600 && attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, 350 * attempt));
        continue;
      }
      return res;
    } catch (e) {
      lastErr = e;
      if (attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, 350 * attempt));
      }
    }
  }
  throw lastErr || new Error("Nätverksfel");
}

// ---- USER STORE (PostgreSQL) ----

function generateToken(user) {
  if (!jwt) {
    return Buffer.from(JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + 86400000 })).toString("base64");
  }
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });
}

function verifyToken(token) {
  try {
    if (!jwt) {
      const payload = JSON.parse(Buffer.from(token, "base64").toString());
      if (payload.exp < Date.now()) return null;
      return payload;
    }
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Ej inloggad" });
  }
  const payload = verifyToken(header.split(" ")[1]);
  if (!payload) {
    return res.status(401).json({ message: "Ogiltig eller utgången session" });
  }
  req.userId = payload.id;
  req.userEmail = payload.email;
  next();
}

// ---- AUTH ROUTES ----

app.post("/api/auth/register", async (req, res) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "auth-register", 10)) {
      return res.status(429).json({ message: "För många registreringsförsök. Försök igen om en stund." });
    }
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Namn, e-post och lösenord krävs" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Lösenordet måste vara minst 6 tecken" });
    }
    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "E-postadressen är redan registrerad" });
    }

    const passwordHash = bcrypt ? await bcrypt.hash(password, 10) : password;
    const user = await db.createUser({
      id: crypto.randomUUID(),
      name,
      email,
      phone: phone || "",
      passwordHash
    });

    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message || "Registreringen misslyckades" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "auth-login", 20)) {
      return res.status(429).json({ message: "För många inloggningsförsök. Försök igen om en stund." });
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "E-post och lösenord krävs" });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Fel e-post eller lösenord" });
    }

    const valid = bcrypt ? await bcrypt.compare(password, user.password_hash) : password === user.password_hash;
    if (!valid) {
      return res.status(401).json({ message: "Fel e-post eller lösenord" });
    }

    const token = generateToken(user);
    const { password_hash: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ message: err.message || "Inloggningen misslyckades" });
  }
});

app.get("/api/auth/profile", authMiddleware, async (req, res) => {
  const user = await db.findUserById(req.userId);
  if (!user) return res.status(404).json({ message: "Användare hittades inte" });
  const { password_hash: _, ...safeUser } = user;
  res.json(safeUser);
});

app.put("/api/auth/profile", authMiddleware, async (req, res) => {
  const { name, phone, notifications } = req.body;
  const fields = {};
  if (name) fields.name = name;
  if (phone !== undefined) fields.phone = phone;
  if (notifications) fields.notifications = JSON.stringify(notifications);

  const user = await db.updateUser(req.userId, fields);
  if (!user) return res.status(404).json({ message: "Användare hittades inte" });
  res.json(user);
});

app.put("/api/auth/password", authMiddleware, async (req, res) => {
  const user = await db.findUserById(req.userId);
  if (!user) return res.status(404).json({ message: "Användare hittades inte" });

  const { currentPassword, newPassword } = req.body;
  const valid = bcrypt ? await bcrypt.compare(currentPassword, user.password_hash) : currentPassword === user.password_hash;
  if (!valid) {
    return res.status(401).json({ message: "Nuvarande lösenord är felaktigt" });
  }
  if (!newPassword || newPassword.length < 6 || !/\d/.test(newPassword)) {
    return res.status(400).json({ message: "Nytt lösenord måste vara minst 6 tecken och innehålla minst en siffra" });
  }

  const newHash = bcrypt ? await bcrypt.hash(newPassword, 10) : newPassword;
  await db.updateUser(req.userId, { password_hash: newHash });
  res.json({ message: "Lösenordet har ändrats" });
});

// ---- DASHBOARD DATA ROUTES ----

app.get("/api/dashboard/orders", authMiddleware, async (req, res) => {
  try {
    const user = await db.findUserById(req.userId);
    if (!user) return res.status(404).json({ message: "Användare hittades inte" });
    const orders = await db.findOrdersByEmail(user.email);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message || "Kunde inte hämta ordrar" });
  }
});

app.get("/api/dashboard/stats", authMiddleware, async (req, res) => {
  try {
    const user = await db.findUserById(req.userId);
    if (!user) return res.status(404).json({ message: "Användare hittades inte" });
    const orderCount = await db.countOrdersByEmail(user.email);
    res.json({
      loyaltyPoints: user.loyalty_points || 0,
      tier: user.tier || "Brons",
      orderCount,
      memberSince: user.created_at
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Kunde inte hämta statistik" });
  }
});

// ---- PRODUCT CATALOGUE (server-side price source of truth) ----

const PRODUCTS_MAP = {
  "duo-ta-da":                  { name: "DUO-kit + TA-DA Serum", price: 1495, priceEur: 129, articleNumber: "4004", vatRate: 0.25 },
  "ta-da-serum":                { name: "TA-DA Serum", price: 699, priceEur: 59, articleNumber: "1005", vatRate: 0.25 },
  "duo-kit":                    { name: "DUO-kit", price: 1099, priceEur: 95, articleNumber: "1003", vatRate: 0.25 },
  "au-naturel-makeup-remover":  { name: "Au Naturel Makeup Remover", price: 399, priceEur: 34, articleNumber: "1004", vatRate: 0.25 },
  "fungtastic-mushroom-extract":{ name: "Fungtastic Mushroom Extract", price: 399, priceEur: 32, articleNumber: "4001", vatRate: 0.06 }
};

const FREE_SHIPPING_THRESHOLD = { SEK: 700, EUR: 60 };
const SHIPPING_COST = { SEK: 55, EUR: 6 };
const VIVA_CURRENCY_CODE = { SEK: 752, EUR: 978 };

const DISCOUNT_CODES = {
  test: {
    percent: 97,
    productIds: null,
    description: "97% testrabatt",
  },
  valkomst10: {
    percent: 10,
    productIds: null,
    description: "10% valkomstrabatt",
  },
  insider15: {
    percent: 15,
    productIds: null,
    description: "15% Insider-rabatt",
  },
  komtillbaka5: {
    percent: 5,
    productIds: null,
    description: "5% rabatt -- valkommen tillbaka",
  },
  hudanalys15: {
    percent: 15,
    productIds: null,
    description: "15% rabatt -- tack for din hudanalys",
  },
};

async function generateOrderNumber() {
  return await db.nextSharedOrderNumber();
}

// ---- SUBSCRIPTION ROUTES ----

app.post("/api/subscriptions/create", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity, intervalDays, currency: reqCurrency } = req.body;
    const currency = reqCurrency === "EUR" ? "EUR" : "SEK";
    const product = PRODUCTS_MAP[productId];
    if (!product) return res.status(400).json({ message: "Okänd produkt" });

    const user = await db.findUserById(req.userId);
    if (!user) return res.status(404).json({ message: "Användare hittades inte" });

    const qty = quantity || 1;
    const allowedIntervals = [30, 60, 90];
    const interval = allowedIntervals.includes(intervalDays) ? intervalDays : 60;
    const discountPercent = 15;
    const basePrice = currency === "EUR" ? (product.priceEur || product.price) : product.price;
    const originalPrice = basePrice * qty;
    const recurringPrice = Math.round(originalPrice * (1 - discountPercent / 100));
    const vivaAmount = recurringPrice * 100;

    const orderNumber = await generateOrderNumber();

    const vivaData = await vivaFetch("/checkout/v2/orders", "POST", {
      amount: vivaAmount,
      currencyCode: VIVA_CURRENCY_CODE[currency],
      customerTrns: `1753 SKINCARE prenumeration – ${orderNumber}`,
      merchantTrns: `SUB-${orderNumber}`,
      sourceCode: process.env.VIVA_SOURCE_CODE,
      allowRecurring: true,
      customer: {
        email: user.email,
        fullName: user.name,
        phone: (user.phone || "").replace(/^0/, "")
      }
    });

    await db.createSubscription({
      userId: req.userId,
      productId,
      productName: product.name,
      quantity: qty,
      intervalDays: interval,
      discountPercent,
      originalPrice,
      recurringPrice,
      vivaInitialOrderCode: vivaData.orderCode
    });

    const env = process.env.VIVA_ENVIRONMENT === "production" ? "www" : "demo";
    const checkoutUrl = `https://${env}.vivapayments.com/web/checkout?ref=${vivaData.orderCode}`;

    console.log(`[Subscription] Created for ${user.email}, product=${productId}, vivaOrderCode=${vivaData.orderCode}`);
    res.json({ orderCode: vivaData.orderCode, checkoutUrl });
  } catch (err) {
    console.error("[Subscription Create Error]", err);
    res.status(err.status || 500).json({ message: err.message || "Prenumerationen kunde inte skapas" });
  }
});

app.get("/api/subscriptions", authMiddleware, async (req, res) => {
  try {
    const subs = await db.findSubscriptionsByUser(req.userId);
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message || "Kunde inte hämta prenumerationer" });
  }
});

app.put("/api/subscriptions/:id/pause", authMiddleware, async (req, res) => {
  try {
    const sub = await db.findSubscriptionById(parseInt(req.params.id, 10));
    if (!sub || sub.user_id !== req.userId) return res.status(404).json({ message: "Prenumeration hittades inte" });
    if (sub.status !== "active") return res.status(400).json({ message: "Kan bara pausa aktiva prenumerationer" });

    const updated = await db.updateSubscription(sub.id, {
      status: "paused",
      paused_at: new Date().toISOString()
    });
    sendSubscriptionChangeEmail(sub, "paused").catch(err => console.error("[Email] Sub pause email error:", err.message));
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Kunde inte pausa prenumerationen" });
  }
});

app.put("/api/subscriptions/:id/resume", authMiddleware, async (req, res) => {
  try {
    const sub = await db.findSubscriptionById(parseInt(req.params.id, 10));
    if (!sub || sub.user_id !== req.userId) return res.status(404).json({ message: "Prenumeration hittades inte" });
    if (sub.status !== "paused") return res.status(400).json({ message: "Kan bara återuppta pausade prenumerationer" });

    const nextCharge = new Date();
    nextCharge.setDate(nextCharge.getDate() + sub.interval_days);

    const updated = await db.updateSubscription(sub.id, {
      status: "active",
      paused_at: null,
      next_charge_date: nextCharge.toISOString().split("T")[0]
    });
    sendSubscriptionChangeEmail(sub, "resumed", { nextCharge: nextCharge.toISOString().split("T")[0] }).catch(err => console.error("[Email] Sub resume email error:", err.message));
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Kunde inte återuppta prenumerationen" });
  }
});

app.put("/api/subscriptions/:id", authMiddleware, async (req, res) => {
  try {
    const sub = await db.findSubscriptionById(parseInt(req.params.id, 10));
    if (!sub || sub.user_id !== req.userId) return res.status(404).json({ message: "Prenumeration hittades inte" });
    if (sub.status === "cancelled") return res.status(400).json({ message: "Kan inte ändra avbruten prenumeration" });

    const { quantity, intervalDays } = req.body;
    const fields = {};

    if (quantity !== undefined) {
      const qty = Math.max(1, Math.min(10, parseInt(quantity)));
      const product = Object.values(PRODUCTS_MAP).find(p => p.articleNumber === sub.product_id) ||
                       Object.entries(PRODUCTS_MAP).find(([k]) => k === sub.product_id)?.[1];
      const unitPrice = product?.price || Math.round(sub.original_price / sub.quantity);
      const discountPercent = sub.discount_percent || 15;
      fields.quantity = qty;
      fields.original_price = unitPrice * qty;
      fields.recurring_price = Math.round(unitPrice * qty * (1 - discountPercent / 100));
    }

    if (intervalDays !== undefined) {
      const allowedIntervals = [30, 60, 90];
      if (!allowedIntervals.includes(intervalDays)) {
        return res.status(400).json({ message: "Ogiltigt intervall. Välj 30, 60 eller 90 dagar." });
      }
      fields.interval_days = intervalDays;
      if (sub.status === "active" && sub.next_charge_date) {
        const lastCharge = sub.last_charge_date ? new Date(sub.last_charge_date) : new Date();
        const nextCharge = new Date(lastCharge);
        nextCharge.setDate(nextCharge.getDate() + intervalDays);
        fields.next_charge_date = nextCharge.toISOString().split("T")[0];
      }
    }

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ message: "Inget att ändra" });
    }

    const updated = await db.updateSubscription(sub.id, fields);
    sendSubscriptionChangeEmail(sub, "updated", {
      intervalDays: fields.interval_days,
      quantity: fields.quantity,
    }).catch(err => console.error("[Email] Sub update email error:", err.message));
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Kunde inte uppdatera prenumerationen" });
  }
});

app.delete("/api/subscriptions/:id", authMiddleware, async (req, res) => {
  try {
    const sub = await db.findSubscriptionById(parseInt(req.params.id, 10));
    if (!sub || sub.user_id !== req.userId) return res.status(404).json({ message: "Prenumeration hittades inte" });

    const updated = await db.updateSubscription(sub.id, {
      status: "cancelled",
      cancelled_at: new Date().toISOString()
    });
    sendSubscriptionChangeEmail(sub, "cancelled").catch(err => console.error("[Email] Sub cancel email error:", err.message));
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Kunde inte avbryta prenumerationen" });
  }
});

// ---- API HELPERS ----

// Fortnox token state -- loaded from DB on startup, refreshed automatically.
// Tokens are persisted to PostgreSQL (system_config table) to survive deploys
// without triggering Railway redeploys (which caused race conditions with
// single-use refresh tokens).
const fortnoxTokens = {
  accessToken: "",
  refreshToken: "",
  expiresAt: 0
};

let _fortnoxRefreshLock = null;

async function loadFortnoxTokensFromDB() {
  try {
    const dbTokens = await db.getFortnoxTokensFromDB();
    if (dbTokens.refreshToken) {
      fortnoxTokens.accessToken = dbTokens.accessToken;
      fortnoxTokens.refreshToken = dbTokens.refreshToken;
      fortnoxTokens.expiresAt = dbTokens.expiresAt;
      console.log("[Fortnox] Tokens loaded from DB");
      return true;
    }
  } catch (err) {
    console.warn("[Fortnox] Could not load tokens from DB:", err.message);
  }

  // Fallback: env vars (first-time setup or migration)
  if (process.env.FORTNOX_REFRESH_TOKEN) {
    fortnoxTokens.accessToken = process.env.FORTNOX_ACCESS_TOKEN || "";
    fortnoxTokens.refreshToken = process.env.FORTNOX_REFRESH_TOKEN || "";
    console.log("[Fortnox] Tokens loaded from env vars (will migrate to DB on next refresh)");
    return true;
  }
  return false;
}

async function refreshFortnoxToken() {
  if (_fortnoxRefreshLock) return _fortnoxRefreshLock;

  _fortnoxRefreshLock = (async () => {
    try {
      const fetch = (await import("node-fetch")).default;
      const oldRefresh = fortnoxTokens.refreshToken;
      if (!oldRefresh) throw { status: 400, message: "Ingen refresh token -- kor /api/fortnox/auth" };

      const res = await fetch("https://apps.fortnox.se/oauth-v1/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: oldRefresh,
          client_id: process.env.FORTNOX_CLIENT_ID || "",
          client_secret: process.env.FORTNOX_CLIENT_SECRET || ""
        })
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("[Fortnox] Token refresh failed:", JSON.stringify(data));
        if (data.error === "invalid_grant") {
          console.error("[Fortnox] Refresh token forbrukad/utgangen. Ny OAuth kravs: /api/fortnox/auth");
          fortnoxTokens.refreshToken = "";
          try { await db.setConfig("fortnox_refresh_token", ""); } catch {}
        }
        throw { status: res.status, message: data.error_description || "Fortnox token refresh misslyckades" };
      }

      const newAccessToken = data.access_token;
      const newRefreshToken = data.refresh_token || oldRefresh;
      const expiresAt = Date.now() + (data.expires_in || 3600) * 1000;

      // Persist to DB FIRST (atomic, no deploys triggered)
      try {
        await db.saveFortnoxTokensToDB(newAccessToken, newRefreshToken, expiresAt);
        console.log("[Fortnox] Tokens persisted to DB");
      } catch (dbErr) {
        console.error("[Fortnox] CRITICAL: Could not save tokens to DB:", dbErr.message);
      }

      // Then update in-memory state
      fortnoxTokens.accessToken = newAccessToken;
      fortnoxTokens.refreshToken = newRefreshToken;
      fortnoxTokens.expiresAt = expiresAt;

      const expiresMin = Math.round((data.expires_in || 3600) / 60);
      console.log(`[Fortnox] Token refreshed OK -- access expires in ${expiresMin} min, new refresh token: ${!!data.refresh_token}`);
    } finally {
      _fortnoxRefreshLock = null;
    }
  })();

  return _fortnoxRefreshLock;
}

let _fortnoxInitialized = false;

async function ensureFortnoxToken() {
  if (!_fortnoxInitialized) {
    await loadFortnoxTokensFromDB();
    _fortnoxInitialized = true;
  }
  if (!fortnoxTokens.refreshToken) return;
  if (!fortnoxTokens.expiresAt || fortnoxTokens.expiresAt - Date.now() < 300_000) {
    await refreshFortnoxToken();
  }
}

// Proactive refresh every 45 min (Fortnox access tokens live ~60 min).
// Less aggressive than before -- no need to hammer since DB persistence is reliable.
const FORTNOX_PROACTIVE_REFRESH_MS = 45 * 60 * 1000;
setInterval(async () => {
  if (!fortnoxTokens.refreshToken) return;
  try {
    await refreshFortnoxToken();
  } catch (err) {
    console.error("[Fortnox] Proactive refresh failed:", err.message || err);
  }
}, FORTNOX_PROACTIVE_REFRESH_MS);

// Load tokens from DB on startup, then do initial refresh
setTimeout(async () => {
  const loaded = await loadFortnoxTokensFromDB();
  if (!loaded) {
    console.log("[Fortnox] Ingen refresh token -- ga till /api/fortnox/auth for att ansluta");
    return;
  }
  try {
    await refreshFortnoxToken();
    console.log("[Fortnox] Startup refresh OK -- anslutning verifierad");
  } catch (err) {
    console.error("[Fortnox] Startup refresh FAILED:", err.message || err);
  }
}, 5_000);

async function fortnoxFetch(path, method, body, _retried) {
  const fetch = (await import("node-fetch")).default;
  await ensureFortnoxToken();
  const url = `https://api.fortnox.se/3${path}`;
  const opts = {
    method: method || "GET",
    headers: {
      "Authorization": `Bearer ${fortnoxTokens.accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (res.status === 401 && !_retried && fortnoxTokens.refreshToken) {
    console.log("[Fortnox] 401 – attempting token refresh");
    await refreshFortnoxToken();
    return fortnoxFetch(path, method, body, true);
  }
  const data = await res.json();
  if (!res.ok) throw { status: res.status, message: data?.ErrorInformation?.message || "Fortnox API error" };
  return data;
}

async function ongoingFetch(path, method, body) {
  const fetch = (await import("node-fetch")).default;
  const baseUrl = process.env.ONGOING_BASE_URL;
  const goodsOwnerId = process.env.ONGOING_GOODS_OWNER_ID;
  const separator = path.includes("?") ? "&" : "?";
  const url = `${baseUrl}${path}${goodsOwnerId ? `${separator}goodsOwnerId=${goodsOwnerId}` : ""}`;
  const auth = Buffer.from(`${process.env.ONGOING_USERNAME}:${process.env.ONGOING_PASSWORD}`).toString("base64");

  if (body && goodsOwnerId && !body.goodsOwnerId) {
    body.goodsOwnerId = parseInt(goodsOwnerId, 10);
  }

  const opts = {
    method: method || "GET",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => null);
  if (!res.ok) throw { status: res.status, message: data?.message || `Ongoing API error: ${res.status}` };
  return data;
}

async function vivaGetToken() {
  const fetch = (await import("node-fetch")).default;
  const env = process.env.VIVA_ENVIRONMENT === "production" ? "" : "demo-";
  const url = `https://${env}accounts.vivapayments.com/connect/token`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.VIVA_CLIENT_ID,
      client_secret: process.env.VIVA_CLIENT_SECRET
    })
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("[Viva Auth Error]", res.status, JSON.stringify(data));
    throw { status: res.status, message: "Viva auth error" };
  }
  return data.access_token;
}

/** Viva returnerar orderCode som JSON-nummer; värden > MAX_SAFE_INTEGER korrumperas av JSON.parse. */
function fixVivaOrderCodeFromRawJson(rawText, data) {
  if (!data || typeof data !== "object") return;
  const m = rawText.match(/"orderCode"\s*:\s*(\d+)/);
  if (m) data.orderCode = m[1];
}

async function vivaFetch(path, method, body) {
  const fetch = (await import("node-fetch")).default;
  const env = process.env.VIVA_ENVIRONMENT === "production" ? "" : "demo-";
  const token = await vivaGetToken();
  const url = `https://${env}api.vivapayments.com${path}`;
  const opts = {
    method: method || "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const rawText = await res.text();
  let data = null;
  try {
    data = JSON.parse(rawText);
  } catch {
    data = null;
  }
  fixVivaOrderCodeFromRawJson(rawText, data);
  if (!res.ok) {
    console.error("[Viva API Error]", res.status, url, rawText.slice(0, 800));
    throw { status: res.status, message: data?.message || "Viva API error" };
  }
  return data;
}

// ---- FORTNOX ROUTES ----

const ADMIN_KEY = process.env.ADMIN_API_KEY || "";
function adminOnly(req, res, next) {
  if (!ADMIN_KEY) return next();
  const provided = req.headers["x-admin-key"] || req.query.adminKey;
  if (provided === ADMIN_KEY) return next();
  return res.status(403).json({ message: "Åtkomst nekad" });
}

app.get("/api/fortnox/status", adminOnly, async (req, res) => {
  try {
    await ensureFortnoxToken();
    const hasToken = !!fortnoxTokens.accessToken;
    const hasRefresh = !!fortnoxTokens.refreshToken;
    const expiresIn = fortnoxTokens.expiresAt ? Math.round((fortnoxTokens.expiresAt - Date.now()) / 1000) : 0;

    let apiOk = false;
    let apiError = null;
    if (hasToken) {
      try {
        await fortnoxFetch("/companyinformation");
        apiOk = true;
      } catch (err) {
        apiError = err.message || "Unknown error";
      }
    }

    const recentOrders = await db.pool.query(
      `SELECT id, order_number, status, payment_status, fortnox_invoice_number, ongoing_order_id, internal_notes, processed_at, created_at
       FROM orders ORDER BY created_at DESC LIMIT 5`
    );

    res.json({
      fortnox: {
        connected: hasToken && apiOk,
        hasAccessToken: hasToken,
        hasRefreshToken: hasRefresh,
        tokenExpiresInSeconds: expiresIn,
        apiTest: apiOk ? "OK" : (apiError || "No token"),
      },
      resend: { configured: !!process.env.RESEND_API_KEY },
      ongoing: { configured: !!process.env.ONGOING_BASE_URL },
      recentOrders: recentOrders.rows.map(o => ({
        id: o.id,
        orderNumber: o.order_number,
        status: o.status,
        paymentStatus: o.payment_status,
        fortnoxInvoice: o.fortnox_invoice_number,
        ongoingOrder: o.ongoing_order_id,
        processedAt: o.processed_at,
        createdAt: o.created_at,
        notes: o.internal_notes
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/fortnox/customers", adminOnly, async (req, res) => {
  try {
    const data = await fortnoxFetch("/customers", "POST", req.body);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get("/api/fortnox/customers/:id", adminOnly, async (req, res) => {
  try {
    const data = await fortnoxFetch(`/customers/${req.params.id}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.post("/api/fortnox/orders", adminOnly, async (req, res) => {
  try {
    const data = await fortnoxFetch("/orders", "POST", req.body);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get("/api/fortnox/orders/:id", adminOnly, async (req, res) => {
  try {
    const data = await fortnoxFetch(`/orders/${req.params.id}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.post("/api/fortnox/invoices", adminOnly, async (req, res) => {
  try {
    const data = await fortnoxFetch("/invoices", "POST", req.body);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.post("/api/fortnox/articles/sync", adminOnly, async (req, res) => {
  try {
    const results = [];
    for (const article of req.body.articles) {
      try {
        const existing = await fortnoxFetch(`/articles/${article.ArticleNumber}`).catch(() => null);
        if (existing) {
          const data = await fortnoxFetch(`/articles/${article.ArticleNumber}`, "PUT", { Article: article });
          results.push({ id: article.ArticleNumber, action: "updated", data });
        } else {
          const data = await fortnoxFetch("/articles", "POST", { Article: article });
          results.push({ id: article.ArticleNumber, action: "created", data });
        }
      } catch (err) {
        results.push({ id: article.ArticleNumber, action: "error", error: err.message });
      }
    }
    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/fortnox/invoicepayments", adminOnly, async (req, res) => {
  try {
    const data = await fortnoxFetch("/invoicepayments", "POST", req.body);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

// ---- ONGOING ROUTES ----

app.get("/api/ongoing/stock", adminOnly, async (req, res) => {
  try {
    const data = await ongoingFetch("/inventoryBalances");
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get("/api/ongoing/stock/:articleNumber", adminOnly, async (req, res) => {
  try {
    const data = await ongoingFetch(`/inventoryBalances?articleNumber=${req.params.articleNumber}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.post("/api/ongoing/articles/sync", adminOnly, async (req, res) => {
  try {
    const results = [];
    for (const article of req.body.articles) {
      try {
        const payload = {
          articleNumber: article.articleNumber,
          articleName: article.articleName || article.name,
          unitCode: article.unitCode || "St",
          weight: article.weight || 0,
          ...(article.barCode && { barCodeInfo: { barCode: article.barCode } }),
          ...(article.purchasePrice && { purchasePrice: article.purchasePrice }),
          ...(article.stockValuationPrice && { stockValuationPrice: article.stockValuationPrice })
        };
        const data = await ongoingFetch("/articles", "PUT", payload);
        results.push({ id: article.articleNumber, action: "synced", data });
      } catch (err) {
        results.push({ id: article.articleNumber, action: "error", error: err.message });
      }
    }
    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/ongoing/orders", adminOnly, async (req, res) => {
  try {
    const data = await ongoingFetch("/orders", "PUT", req.body);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get("/api/ongoing/orders/:orderNumber", adminOnly, async (req, res) => {
  try {
    const data = await ongoingFetch(`/orders?goodsOwnerOrderId=${req.params.orderNumber}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get("/api/ongoing/shipping-methods", adminOnly, async (req, res) => {
  try {
    const data = await ongoingFetch("/transporterContracts");
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

// ---- ADMIN AUTH MIDDLEWARE ----

async function adminAuthMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Ej inloggad" });
  }
  const payload = verifyToken(header.split(" ")[1]);
  if (!payload) {
    return res.status(401).json({ message: "Ogiltig eller utgången session" });
  }
  const role = await db.findUserRole(payload.id);
  if (role !== "admin") {
    return res.status(403).json({ message: "Adminbehörighet krävs" });
  }
  req.userId = payload.id;
  req.userEmail = payload.email;
  next();
}

// ---- ADMIN: STATS ----

app.get("/api/admin/stats", adminAuthMiddleware, async (req, res) => {
  try {
    const stats = await db.adminGetStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/admin/stats/chart", adminAuthMiddleware, async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 30, 90);
    const chartData = await db.adminChartData(days);
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/admin/stats/top-products", adminAuthMiddleware, async (req, res) => {
  try {
    const topProducts = await db.adminTopProducts();
    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/admin/orders/export", adminAuthMiddleware, async (req, res) => {
  try {
    const { status, search } = req.query;
    const data = await db.adminListOrders({ page: 1, perPage: 10000, status, search });
    const header = "Order,Kund,E-post,Belopp,Frakt,Status,Betalning,Fortnox,Ongoing,Datum\n";
    const rows = data.orders.map(o =>
      [o.order_number, `"${(o.customer_name||'').replace(/"/g,'""')}"`, o.customer_email,
       o.total_amount, o.shipping_cost, o.status, o.payment_status,
       o.fortnox_invoice_number||'', o.ongoing_order_id||'',
       new Date(o.created_at).toISOString().split("T")[0]].join(",")
    ).join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=ordrar-${new Date().toISOString().split("T")[0]}.csv`);
    res.send("\uFEFF" + header + rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/admin/customers/export", adminAuthMiddleware, async (req, res) => {
  try {
    const data = await db.adminListCustomers({ page: 1, perPage: 10000 });
    const header = "Namn,E-post,Telefon,Antal ordrar,Totalt spenderat,Senaste order\n";
    const rows = data.customers.map(c =>
      [`"${(c.customer_name||'').replace(/"/g,'""')}"`, c.customer_email, c.customer_phone||'',
       c.order_count, c.total_spent,
       new Date(c.last_order).toISOString().split("T")[0]].join(",")
    ).join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=kunder-${new Date().toISOString().split("T")[0]}.csv`);
    res.send("\uFEFF" + header + rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- ADMIN: ORDERS ----

app.get("/api/admin/orders", adminAuthMiddleware, async (req, res) => {
  try {
    const { page, status, search } = req.query;
    const data = await db.adminListOrders({
      page: parseInt(page) || 1,
      status: status || undefined,
      search: search || undefined
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/admin/orders/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const order = await db.adminGetOrder(parseInt(req.params.id));
    if (!order) return res.status(404).json({ message: "Order hittades inte" });
    const returns = await db.findReturnsByOrder(order.id);
    res.json({ ...order, returns });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/admin/orders/:id/status", adminAuthMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await db.updateOrder(parseInt(req.params.id), { status });
    if (!updated) return res.status(404).json({ message: "Order hittades inte" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/admin/orders/:id/retry", adminAuthMiddleware, async (req, res) => {
  try {
    const result = await handleOrderCompletion(parseInt(req.params.id));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/orders/:id/retry", adminOnly, async (req, res) => {
  try {
    const result = await handleOrderCompletion(parseInt(req.params.id));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/orders/:id/reprocess", adminOnly, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    await db.pool.query("UPDATE orders SET processed_at = NULL WHERE id = $1", [orderId]);
    const result = await handleOrderCompletion(orderId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/orders/:id/resend-email", adminOnly, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await db.findOrderByNumber(
      (await db.pool.query("SELECT order_number FROM orders WHERE id = $1", [orderId])).rows[0]?.order_number
    );
    if (!order) return res.status(404).json({ message: "Order hittades inte" });
    const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
    const result = await sendOrderConfirmation(order, items);
    res.json(result);
  } catch (err) {
    console.error("[Resend-email] Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ---- ADMIN: CANCEL ORDER ----

async function vivaRefund(transactionId, amountInCents) {
  const fetch = (await import("node-fetch")).default;
  const env = process.env.VIVA_ENVIRONMENT === "production" ? "" : "demo-";
  const merchantId = process.env.VIVA_MERCHANT_ID;
  const apiKey = process.env.VIVA_API_KEY;

  if (!merchantId || !apiKey) {
    throw new Error("VIVA_MERCHANT_ID / VIVA_API_KEY not configured");
  }

  const basicAuth = Buffer.from(`${merchantId}:${apiKey}`).toString("base64");
  const baseHost = env ? `demo.vivapayments.com` : `www.vivapayments.com`;
  const url = `https://${baseHost}/api/transactions/${transactionId}?amount=${amountInCents}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Authorization": `Basic ${basicAuth}` }
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    console.error("[Viva Refund] Error:", res.status, data);
    throw new Error(data?.message || `Viva refund failed (${res.status})`);
  }
  return data;
}

app.post("/api/admin/orders/:id/cancel", adminAuthMiddleware, async (req, res) => {
  const orderId = parseInt(req.params.id);
  console.log(`[Cancel] Cancelling order ${orderId}`);
  try {
    const order = await db.adminGetOrder(orderId);
    if (!order) return res.status(404).json({ message: "Order hittades inte" });

    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Ordern \u00e4r redan makulerad" });
    }
    // Levererade ordrar kan nu makuleras/krediteras via admin

    const notes = [];

    // 1. Viva Wallet refund
    if (order.viva_transaction_id) {
      try {
        const refundAmountCents = (order.total_amount + (order.shipping_cost || 0)) * 100;
        const refundData = await vivaRefund(order.viva_transaction_id, refundAmountCents);
        const refundTxId = refundData?.transactionId || refundData?.TransactionId || null;
        notes.push(`Viva \u00e5terbetalning: ${refundTxId || "OK"}`);
        console.log(`[Cancel] Viva refund OK for order ${orderId}:`, refundTxId);
      } catch (err) {
        notes.push(`Viva \u00e5terbetalning FEL: ${err.message}`);
        console.error("[Cancel] Viva refund error:", err);
      }
    } else {
      notes.push("Viva: inget transaction-id, \u00e5terbetalning hoppades \u00f6ver");
    }

    // 2. Fortnox: credit invoice + register payments to zero out balances
    if (order.fortnox_invoice_number) {
      try {
        const creditRes = await fortnoxFetch(
          `/invoices/${order.fortnox_invoice_number}/credit`, "PUT"
        );
        const creditNum = creditRes?.Invoice?.DocumentNumber ?? creditRes?.Invoice?.CreditInvoiceReference ?? null;
        if (creditNum) {
          notes.push(`Fortnox kreditfaktura: ${creditNum}`);
        } else {
          notes.push("Fortnox kredit: svar saknade dokumentnummer");
        }
      } catch (err) {
        notes.push(`Fortnox kredit FEL: ${err.message}`);
        console.error("[Cancel] Fortnox credit error:", err);
      }
    }

    // 3. Ongoing: cancel the delivery order via DELETE /orders/{orderId}
    if (order.ongoing_order_id) {
      try {
        let ongoingInternalId = null;
        const candidates = [order.ongoing_order_id, order.order_number];
        for (const candidate of candidates) {
          try {
            const results = await ongoingFetch(`/orders?orderNumber=${encodeURIComponent(candidate)}`);
            if (Array.isArray(results) && results.length > 0) {
              ongoingInternalId = results[0]?.orderInfo?.orderId;
              break;
            }
          } catch (_) {}
        }
        if (!ongoingInternalId) {
          ongoingInternalId = order.ongoing_order_id;
        }
        await ongoingFetch(`/orders/${ongoingInternalId}`, "DELETE");
        notes.push(`Ongoing order ${ongoingInternalId} makulerad`);
      } catch (err) {
        notes.push(`Ongoing makulering FEL: ${err.message} (kan behöva makuleras manuellt)`);
        console.error("[Cancel] Ongoing cancel error:", err);
      }
    }

    // 4. Update DB
    await db.updateOrder(orderId, {
      status: "cancelled",
      payment_status: order.viva_transaction_id ? "refunded" : order.payment_status
    });
    await db.appendNotes(orderId, `MAKULERAD: ${notes.join(" | ")}`);

    // 5. Send cancellation email
    try {
      const locale = order.locale || "sv";
      const isSv = locale.startsWith("sv");
      const totalKr = (order.total_amount + (order.shipping_cost || 0)).toLocaleString(isSv ? "sv-SE" : "en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      const currencyLabel = (order.currency || "SEK") === "EUR" ? "\u20ac" : "kr";

      const apiKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.EMAIL_FROM || "info@1753skin.com";
      if (apiKey) {
        const { Resend } = require("resend");
        const resend = new Resend(apiKey);
        const firstName = order.customer_name?.split(" ")[0] || "";
        await resend.emails.send({
          from: fromEmail,
          replyTo: "info@1753skin.com",
          to: order.customer_email,
          subject: isSv
            ? `Order #${order.order_number} har makulerats`
            : `Order #${order.order_number} has been cancelled`,
          html: emailWrapper(`
            <div style="text-align:center;padding:32px 0 8px">
              <img src="https://www.1753skin.com/1753.webp" alt="1753 SKINCARE" width="48" height="48" style="border-radius:12px"/>
            </div>
            <h1 style="font-size:24px;font-weight:600;color:#1d1d1f;letter-spacing:-0.02em;margin:16px 0;">
              ${isSv ? "Din order har makulerats" : "Your order has been cancelled"}
            </h1>
            <p style="color:#515151;font-size:15px;line-height:1.6;margin:0 0 24px;">
              ${isSv
                ? `Hej ${firstName}${firstName ? ", " : ""}order <strong>#${order.order_number}</strong> har makulerats.${order.viva_transaction_id ? " Återbetalningen på <strong>" + totalKr + " " + currencyLabel + "</strong> kommer att synas på ditt konto inom 3–5 bankdagar." : ""}`
                : `Hi ${firstName}${firstName ? ", " : ""}order <strong>#${order.order_number}</strong> has been cancelled.${order.viva_transaction_id ? " The refund of <strong>" + totalKr + " " + currencyLabel + "</strong> will appear in your account within 3–5 business days." : ""}`
              }
            </p>
            <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#766a62;font-size:14px;">${isSv ? "Ordernummer" : "Order number"}</td>
                  <td style="padding:8px 0;text-align:right;font-weight:600;color:#1d1d1f;font-size:14px;">#${order.order_number}</td>
                </tr>
                ${order.viva_transaction_id ? `
                <tr>
                  <td style="padding:8px 0;color:#766a62;font-size:14px;">${isSv ? "Återbetalat belopp" : "Refunded amount"}</td>
                  <td style="padding:8px 0;text-align:right;font-weight:600;color:#108474;font-size:14px;">${totalKr} ${currencyLabel}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding:8px 0;color:#766a62;font-size:14px;">${isSv ? "Status" : "Status"}</td>
                  <td style="padding:8px 0;text-align:right;font-weight:600;color:#1d1d1f;font-size:14px;">${isSv ? (order.viva_transaction_id ? "Återbetalning påbörjad" : "Makulerad") : (order.viva_transaction_id ? "Refund initiated" : "Cancelled")}</td>
                </tr>
              </table>
            </div>
            <p style="color:#515151;font-size:14px;line-height:1.6;margin:24px 0 0;">
              ${isSv
                ? "Har du frågor om din återbetalning? Svara på detta mejl eller kontakta oss på"
                : "Questions about your refund? Reply to this email or contact us at"}
              <a href="mailto:info@1753skin.com" style="color:#108474"> info@1753skin.com</a>.
            </p>
          `)
        });
        notes.push("Makuleringsbekräftelse skickad");
      }
    } catch (emailErr) {
      notes.push(`E-post FEL: ${emailErr.message}`);
      console.error("[Cancel] Email error:", emailErr);
    }

    console.log(`[Cancel] Order ${orderId} cancelled: ${notes.join(", ")}`);
    res.json({ success: true, notes });
  } catch (err) {
    console.error("[Cancel] Fatal error:", err);
    res.status(500).json({ message: err.message || "Kunde inte makulera ordern" });
  }
});

// ---- ADMIN: RETURNS ----

app.post("/api/admin/orders/:id/return", adminAuthMiddleware, async (req, res) => {
  console.log(`[Return] Creating return for order ${req.params.id}`);
  try {
    const order = await db.adminGetOrder(parseInt(req.params.id));
    if (!order) return res.status(404).json({ message: "Order hittades inte" });

    const { items, refundAmount, reason } = req.body;
    console.log(`[Return] Items: ${JSON.stringify(items)}, refund: ${refundAmount}, reason: ${reason}`);
    if (!items || items.length === 0) return res.status(400).json({ message: "Inga artiklar att returnera" });

    const orderItems = typeof order.items === "string" ? JSON.parse(order.items) : (order.items || []);

    const enrichedItems = items.map(item => {
      const match = orderItems.find(oi => oi.articleNumber === item.articleNumber);
      return {
        ...item,
        name: item.name || match?.name || item.articleNumber,
        price: item.price ?? match?.price ?? 0,
        vatRate: item.vatRate ?? match?.vatRate ?? 0.25
      };
    });

    const notes = [];
    let fortnoxCreditNumber = null;
    let ongoingReturnId = null;

    // Viva Wallet: refund the specified amount
    if (order.viva_transaction_id && refundAmount > 0) {
      try {
        const refundCents = Math.round(refundAmount * 100);
        const refundData = await vivaRefund(order.viva_transaction_id, refundCents);
        const refundTxId = refundData?.transactionId || refundData?.TransactionId || null;
        notes.push(`Viva \u00e5terbetalning: ${refundTxId || "OK"} (${refundAmount} ${order.currency || "SEK"})`);
        console.log(`[Return] Viva refund OK:`, refundTxId);
      } catch (err) {
        notes.push(`Viva \u00e5terbetalning FEL: ${err.message}`);
        console.error("[Return] Viva refund error:", err);
      }
    }

    // Fortnox: credit invoice + register payments to zero out balances
    if (order.fortnox_invoice_number) {
      try {
        const creditRes = await fortnoxFetch(
          `/invoices/${order.fortnox_invoice_number}/credit`,
          "PUT"
        );
        fortnoxCreditNumber =
          creditRes?.Invoice?.DocumentNumber ??
          creditRes?.Invoice?.CreditInvoiceReference ??
          null;

        if (fortnoxCreditNumber) {
          notes.push(`Fortnox kreditfaktura: ${fortnoxCreditNumber}`);
        } else {
          notes.push("Fortnox kredit: svar saknade dokumentnummer");
        }
      } catch (err) {
        notes.push(`Fortnox kredit FEL: ${err.message}`);
        console.error("[Return] Fortnox credit error:", err);
      }
    }

    // Ongoing: create return order
    try {
      const returnSeqNumber = await db.nextOngoingOrderNumber();
      const ogReturn = await ongoingFetch("/orders", "PUT", {
        orderNumber: `RET-${returnSeqNumber}`,
        deliveryDate: new Date().toISOString().split("T")[0],
        referenceNumber: `Retur ${order.order_number}`,
        orderRemark: reason || "Kundretur",
        orderType: { code: "Return", name: "Retur" },
        consignee: {
          customerNumber: order.customer_email,
          name: order.customer_name,
          address1: order.address || "",
          postCode: order.zip || "",
          city: order.city || "",
          countryCode: order.country_code || "SE"
        },
        orderLines: enrichedItems.map((item, i) => ({
          rowNumber: String(i + 1),
          articleNumber: item.articleNumber,
          numberOfItems: item.quantity,
          comment: `Retur: ${item.name || item.articleNumber}`,
          shouldBePicked: true
        }))
      });
      ongoingReturnId = ogReturn?.orderId || ogReturn?.orderInfo?.orderId;
      notes.push(`Ongoing retur: ${ongoingReturnId}`);
    } catch (err) {
      notes.push(`Ongoing retur FEL: ${err.message}`);
      console.error("[Return] Ongoing return error:", err);
    }

    const allReturned = items.length >= orderItems.length;
    const newStatus = allReturned ? "returned" : "partially_returned";

    console.log(`[Return] Creating DB record: orderId=${order.id}, refund=${refundAmount}, status=${newStatus}`);
    const returnRecord = await db.createReturn({
      orderId: order.id, items: enrichedItems, refundAmount: refundAmount || 0,
      reason, fortnoxCreditNumber: fortnoxCreditNumber ? String(fortnoxCreditNumber) : null,
      ongoingReturnId: ongoingReturnId ? String(ongoingReturnId) : null,
      status: (fortnoxCreditNumber || ongoingReturnId) ? "processed" : "pending"
    });

    await db.updateOrder(order.id, { status: newStatus });
    await db.appendNotes(order.id, `RETUR: ${notes.join(" | ")}`);

    console.log(`[Return] Success: return #${returnRecord.id}`);
    res.json({ return: returnRecord, notes });
  } catch (err) {
    console.error("[Return] Fatal error:", err);
    res.status(500).json({ message: err.message || "Ett oväntat fel uppstod vid returskapande" });
  }
});

// ---- ADMIN: DISCOUNT CODES ----

app.get("/api/admin/discounts", adminAuthMiddleware, async (req, res) => {
  try {
    const codes = await db.listDiscountCodes();
    res.json(codes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/admin/discounts", adminAuthMiddleware, async (req, res) => {
  try {
    const code = await db.createDiscountCode(req.body);
    res.json(code);
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ message: "Koden finns redan" });
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/admin/discounts/:code", adminAuthMiddleware, async (req, res) => {
  try {
    const updated = await db.updateDiscountCode(req.params.code, req.body);
    if (!updated) return res.status(404).json({ message: "Rabattkod hittades inte" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/admin/discounts/:code", adminAuthMiddleware, async (req, res) => {
  try {
    const deleted = await db.deleteDiscountCode(req.params.code);
    if (!deleted) return res.status(404).json({ message: "Rabattkod hittades inte" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- ADMIN: PRODUCTS ----

app.get("/api/admin/products", adminAuthMiddleware, async (req, res) => {
  try {
    const products = Object.entries(PRODUCTS_MAP).map(([id, p]) => ({ id, ...p }));
    let stockData = [];
    try {
      stockData = await ongoingFetch("/inventoryBalances");
    } catch (_) {}

    const enriched = products.map(p => {
      const stock = Array.isArray(stockData)
        ? stockData.find(s => String(s.articleNumber || s.articleSystemId) === p.articleNumber)
        : null;
      return { ...p, stock: stock?.numberOfItems ?? stock?.inStockNumberOfItems ?? null };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/admin/products/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const product = PRODUCTS_MAP[req.params.id];
    if (!product) return res.status(404).json({ message: "Produkt hittades inte" });

    const { price, name } = req.body;
    if (price !== undefined) product.price = price;
    if (name !== undefined) product.name = name;

    if (product.articleNumber) {
      try {
        await fortnoxFetch(`/articles/${product.articleNumber}`, "PUT", {
          Article: {
            Description: product.name,
            SalesPrice: product.price
          }
        });
      } catch (err) {
        console.warn("[Admin] Fortnox article update failed:", err.message);
      }
    }

    res.json({ id: req.params.id, ...product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/admin/products/sync", adminAuthMiddleware, async (req, res) => {
  try {
    const results = [];
    for (const [id, product] of Object.entries(PRODUCTS_MAP)) {
      try {
        await ongoingFetch("/articles", "PUT", {
          articleNumber: product.articleNumber,
          articleName: product.name,
          unitCode: "St"
        });
        results.push({ id, status: "synced" });
      } catch (err) {
        results.push({ id, status: "error", error: err.message });
      }
    }
    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- ADMIN: CUSTOMERS ----

app.get("/api/admin/customers", adminAuthMiddleware, async (req, res) => {
  try {
    const { page, search } = req.query;
    const data = await db.adminListCustomers({
      page: parseInt(page) || 1,
      search: search || undefined
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/admin/customers/:email", adminAuthMiddleware, async (req, res) => {
  try {
    const data = await db.adminGetCustomer(req.params.email);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- ADMIN: SUBSCRIPTIONS ----

app.get("/api/admin/subscriptions", adminAuthMiddleware, async (req, res) => {
  try {
    const { page, status } = req.query;
    const data = await db.adminListSubscriptions({
      page: parseInt(page) || 1,
      status: status || undefined
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/admin/subscriptions/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const { action } = req.body;
    const sub = await db.findSubscriptionById(parseInt(req.params.id));
    if (!sub) return res.status(404).json({ message: "Prenumeration hittades inte" });

    let fields = {};
    if (action === "pause") fields = { status: "paused", paused_at: new Date().toISOString() };
    else if (action === "resume") {
      const nextCharge = new Date();
      nextCharge.setDate(nextCharge.getDate() + (sub.interval_days || 60));
      fields = { status: "active", paused_at: null, next_charge_date: nextCharge.toISOString().split("T")[0] };
    }
    else if (action === "cancel") fields = { status: "cancelled", cancelled_at: new Date().toISOString() };
    else return res.status(400).json({ message: "Ogiltig åtgärd" });

    const updated = await db.updateSubscription(sub.id, fields);

    try {
      if (action === "pause") await sendSubscriptionChangeEmail(sub, "paused");
      else if (action === "resume") await sendSubscriptionChangeEmail(sub, "resumed", { nextCharge: fields.next_charge_date });
      else if (action === "cancel") await sendSubscriptionChangeEmail(sub, "cancelled");
    } catch (emailErr) {
      console.error("[Admin Sub] Email error:", emailErr.message);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- ADMIN: NEWSLETTER ----

app.get("/api/admin/newsletter/stats", adminAuthMiddleware, async (req, res) => {
  try {
    const stats = await db.adminNewsletterStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/admin/newsletter/subscribers", adminAuthMiddleware, async (req, res) => {
  try {
    const { page, status } = req.query;
    const data = await db.adminListSubscribers({
      page: parseInt(page) || 1,
      status: status || undefined
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- ADMIN: AUTH CHECK ----

app.get("/api/admin/me", adminAuthMiddleware, async (req, res) => {
  try {
    const user = await db.findUserById(req.userId);
    if (!user) return res.status(404).json({ message: "Användare hittades inte" });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role || "customer" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- RATE LIMITING ----

const rateLimits = new Map();

function checkRateLimit(ip, endpoint, maxPerHour) {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const timestamps = rateLimits.get(key) || [];
  const recent = timestamps.filter(t => now - t < 3600000);
  if (recent.length >= maxPerHour) return false;
  recent.push(now);
  rateLimits.set(key, recent);
  return true;
}

// ---- HUDANALYS SYSTEM PROMPT (server-side, skickas aldrig från klienten) ----

function loadAnalysisBookKnowledge() {
  try {
    const p = path.join(__dirname, "data", "book-knowledge.md");
    if (fs.existsSync(p)) return fs.readFileSync(p, "utf8");
  } catch (_) { /* ignore */ }
  return "";
}

async function searchVayu(concerns) {
  if (!process.env.VALYU_API_KEY || !concerns || concerns.length === 0) return "";
  try {
    const { Valyu } = require("valyu-js");
    const client = new Valyu({ apiKey: process.env.VALYU_API_KEY });
    const query = `skin health ${concerns.join(" ")} CBD CBG endocannabinoid microbiome lifestyle PubMed`;
    const response = await client.search({ query, searchType: "all", maxNumResults: 4 });
    if (!response?.results?.length) return "";
    const snippets = response.results.map(r =>
      `- ${r.title || "Utan titel"}: ${(r.content || r.snippet || "").slice(0, 300)} [${r.url || ""}]`
    );
    return "\n\n== VETENSKAPLIG FORSKNING (Valyu/PubMed) ==\nAnvänd dessa som inspiration för livsstilsrådens vetenskapliga motiveringar:\n" + snippets.join("\n");
  } catch (err) {
    console.log(`[Analysis] Valyu search failed (non-fatal): ${err.message}`);
    return "";
  }
}

const ANALYSIS_SYSTEM_PROMPT = `Du är 1753 SKINCAREs holistiska hudvårdsrådgivare – världens mest kunniga hudterapeut inom hudens mikrobiom och endocannabinoidsystem (ECS).

== EXPERTIS ==

HUDENS MIKROBIOM:
Huden bär ett rikt ekosystem av bakterier, svampar och virus. Balans = frisk hud. Dysbios kopplas till akne, eksem, rosacea m.m. Konventionell hudvård (aggressiv rengöring, antibakteriella medel, starka syror) stör ofta denna balans.

ENDOCANNABINOIDSYSTEMET (ECS):
CB1/CB2-receptorer i huden reglerar sebum, inflammation, celltillväxt, smärta/klåda och keratinocytproliferation. CBD och CBG modulerar dessa receptorer. ECS agerar lokalt – finjustering av homeostas.

TARM-HUD-AXELN:
Immunologiska och hormonella kopplingar mellan tarmflora och hud. Stress/dysbios påverkar huden via denna axel. Kost, fiber, fermenterat och probiotika spelar roll.

== FILOSOFI ==
- Huden är ett intelligent organ format av evolution – stöd dess system, ersätt dem aldrig
- Skeptisk till konventionell hudvård: 10-stegsrutiner, starka syror, retinol och kemiska peelingar stör mikrobiomets balans
- Livsstil (sömn, kost, stress, rörelse, tarm) är minst lika viktigt som produkter
- Enkelhet framför allt: rekommendera aldrig fler produkter än nödvändigt
- Rebellisk mot hudvårdsindustrin men aldrig nedlåtande mot kunden
- Varm, personlig ton – som en kunnig vän

== ANALYSTYP ==
Kunden har besvarat en quiz om hudtyp, besvär, rutin och livsstil. Om skanningsdata finns inkluderat, integrera det i analysen (zoner med detekterade hudtillstånd och konfidensgrader).

== VISUELL BEDÖMNING (DIN VIKTIGASTE UPPGIFT NÄR BILD FINNS) ==
Om en ansiktsbild bifogas: DU SKA ANVÄNDA DIN EGEN VISUELLA BEDÖMNING SOM PRIMÄRKÄLLA. Titta noggrant på bilden och bedöm huden själv. Din visuella analys väger MYCKET tyngre än skanningsdata.

KRITISKT: Det lokala ONNX-modellen har INGEN "normal/frisk hud"-klass och MÅSTE alltid klassificera som en hudåkomma (akne, dermatit etc.) även om huden är helt frisk. Detta betyder att skanningsdata SYSTEMATISKT överrapporterar problem. ONNX-data ska i princip IGNORERAS som diagnostisk källa.

Prioriteringsordning (viktigast först):
1. DIN VISUELLA BEDÖMNING av bilden (om bild bifogas) – 60% vikt
2. Kundens egna quiz-svar (hudtyp, besvär) – 25% vikt
3. Livsstilsfaktorer – 10% vikt
4. Skanningsdata från ONNX-modellen – max 5% vikt, och ENBART om konfidens >70% OCH din visuella bedömning bekräftar samma sak

VIKTIGT OM NORMAL HUD: De flesta människor som gör en hudanalys har i grunden FRISK HUD med kanske milda, normala variationer. Det är INTE ett problem att ha lätt torrhet på vintern, enstaka porer eller minimal rodnad. Behandla detta som normal variation, inte som en diagnos.

VIKTIGT OM SKANNINGSDATA: AI-skanningen använder en begränsad bildklassificeringsmodell (~80% accuracy) som SAKNAR "normal"-klass:
- Modellen TVINGAS välja en åkomma även för helt frisk hud – detta är en känd brist
- Konfidensgrader under 60% bör IGNORERAS helt
- "normal" i skanningsdata betyder att vår filtrering bedömt att ingen åkomma detekterades tillförlitligt – behandla det som frisk hud
- Om din visuella bedömning av bilden visar frisk hud men skanningen säger "akne" eller "dermatit" – LITA PÅ DIN BEDÖMNING
- Om flera zoner visar samma tillstånd med låg konfidens är det sannolikt en felklassificering
- Psoriasis, fungal och sun_damage har högst felprocent – var EXTREMT försiktig med dessa
- Nämn ALDRIG skanningsresultat som fakta – om du nämner dem, var tydlig med att det är en indikation med låg tillförlitlighet

== SCORE ==
Beräkna score (0-100) INDIVIDUELLT baserat på ALLA faktorer:
- Din egen visuella bedömning av bilden, om bild finns (35%)
- Livsstilsfaktorer: sömn, stress, kost, vatten, träning (30%)
- Hudtyp och angivna besvär (20%)
- Nuvarande rutin och dess lämplighet (15%)
Skanningsresultat påverkar INTE poängen direkt – de kan bekräfta din visuella bedömning men aldrig sänka poängen på egen hand.
Varje kund ska få ett UNIKT score. Kopiera aldrig exempelvärden.

KRITISKT OM SCORE-FÖRDELNING:
- 85-100: Frisk hud + bra livsstil. DE FLESTA kunder med normal hud och hyfsad livsstil hamnar här.
- 70-84: Bra grund med utrymme för förbättring. Normal hud men livsstilsfaktorer kan förbättras.
- 55-69: Tydliga besvär eller bristfällig livsstil som påverkar huden.
- Under 55: Allvarliga hudproblem eller flera bristande livsstilsfaktorer.
Sänk ALDRIG poängen bara för att skanningen rapporterar åkommor. En person med frisk hud i bilden och OK livsstil ska ALLTID få minst 75+.

== SVARFORMAT ==
Svara ENBART med ett JSON-block (inget annat). JSON-blocket ska vara markerat med trippla backticks och "json":

\`\`\`json
{
  "score": "<BERÄKNA 0-100 baserat på kundens svar: hudtyp, besvär, rutin, livsstil. 90+ = utmärkt hud+vanor, 70-89 = bra grund, 50-69 = utrymme för förbättring, <50 = behöver uppmärksamhet. Kopiera ALDRIG exempelvärden.>",
  "scoreLabel": "<Kort etikett som sammanfattar poängen, t.ex. 'Bra grund att bygga vidare på' eller 'Stark hudbarriär, livsstil kan förbättras'>",
  "summary": "2-3 meningars personlig sammanfattning av hudens tillstånd",
  "skinAnalysis": {
    "overview": "Utförlig beskrivning (250-400 ord) av kundens hudtillstånd. Beskriv vad du ser/förstår baserat på quiz-svar och eventuell skanningsdata. Förklara hur hudtyp, besvär och livsstil hänger ihop. Koppla till mikrobiom och ECS. Var specifik – referera till kundens egna svar. Skriv som löptext med stycken (använd \\n\\n för styckebrytning).",
    "strengths": ["Specifik styrka 1", "Specifik styrka 2"],
    "concerns": [
      { "issue": "Specifikt problem med kort förklaring", "severity": "mild | moderate | severe" }
    ],
    "microbiome": "Kort analys (2-3 meningar) av hur kundens livsstil och rutin påverkar mikrobiomets balans",
    "ecs": "Kort analys (2-3 meningar) av hur ECS-aktivitet relaterar till kundens hudtillstånd"
  },
  "products": [
    {
      "id": "au-naturel-makeup-remover",
      "reason": "Personlig motivering (3-4 meningar) kopplad till just denna kunds hudtillstånd, livsstil och mål. Förklara specifikt VARFÖR denna produkt passar ur ECS/mikrobiom-perspektiv.",
      "usage": "Kort användningstips anpassat till kunden"
    },
    {
      "id": "duo-kit",
      "reason": "Personlig motivering...",
      "usage": "..."
    },
    {
      "id": "ta-da-serum",
      "reason": "Personlig motivering...",
      "usage": "..."
    }
  ],
  "lifestyle": [
    {
      "area": "Sömn",
      "tip": "Konkret, personligt tips kopplat till kundens svar (2-3 meningar)",
      "why": "Vetenskaplig motivering: varför detta påverkar huden (1-2 meningar)",
      "impact": "hög",
      "source": "Kort referens till forskning eller bokkunskap"
    },
    {
      "area": "Stress",
      "tip": "...",
      "why": "...",
      "impact": "hög",
      "source": "..."
    },
    {
      "area": "Kost",
      "tip": "...",
      "why": "...",
      "impact": "medel",
      "source": "..."
    },
    {
      "area": "Rörelse",
      "tip": "...",
      "why": "...",
      "impact": "medel",
      "source": "..."
    }
  ],
  "routine": {
    "morning": [
      { "step": "Skölj ansiktet med ljummet vatten", "why": "Bevarar mikrobiomets balans – undvik tvål som stör pH" },
      { "step": "3-4 droppar The ONE Facial Oil", "why": "CBD skyddar barriären och reglerar sebum via ECS" },
      { "step": "1-2 pump TA-DA Serum", "why": "CBG låser in fukt och ger antioxidantskydd" }
    ],
    "evening": [
      { "step": "Rengör med Au Naturel Makeup Remover", "why": "MCT löser smuts utan att störa mikrobiomets mångfald" },
      { "step": "3-4 droppar I LOVE Facial Oil", "why": "5% CBG stödjer nattlig reparation via ECS" },
      { "step": "1-2 pump TA-DA Serum", "why": "Förstärker oljans absorption och regenerering" }
    ]
  },
  "primaryCondition": {
    "condition": "normal | acne | dermatitis | dryness | eczema | fungal | hyperpigmentation | psoriasis | rosacea | sun_damage",
    "confidence": "low | medium | high",
    "reasoning": "1-2 meningar som motiverar valet. Om huden ar frisk, skriv det tydligt."
  },
  "avoid": ["Specifik sak att undvika med kort förklaring"],
  "nextAnalysis": "4 veckor",
  "faceZones": [
    {
      "zone": "forehead",
      "label": "Panna",
      "x": 50,
      "y": 18,
      "condition": "dermatitis",
      "confidence": "medium"
    }
  ]
}
\`\`\`

== ANSIKTSZONER (faceZones) ==
Om en ansiktsbild bifogas: TITTA NOGGRANT på bilden och gör din EGEN visuella bedömning av varje zon.
Returnera faceZones-arrayen med en post per synlig zon (panna, näsa, vänster kind, höger kind, haka, t-zon).
- "zone": ett av forehead, nose, left_cheek, right_cheek, chin, t_zone
- "label": zonens svenska namn
- "x" och "y": zonens VISUELLA centrum i bilden, angivet som procenttal (0-100) av bildens bredd och höjd. 0,0 = övre vänstra hörnet, 100,100 = nedre högra hörnet.
- "condition": det hudtillstånd du SJÄLV bedömer finns i zonen baserat på bilden. Använd "normal" om zonen ser frisk ut. IGNORERA skannermodellens resultat helt – lita på vad DU ser.
- "confidence": din egen bedömning av säkerheten: "low", "medium" eller "high"
VIKTIGT: De flesta människor har mestadels frisk hud. Det är HELT NORMALT att de flesta zoner bedöms som "normal". Rapportera ett problem ENBART om du tydligt kan se det i bilden.
Returnera BARA zoner som syns i bilden. Om ingen bild bifogades, returnera en tom array [].

== PRODUKTREKOMMENDATIONER ==
Du ska ALLTID rekommendera dessa tre produkter (i denna ordning):
1. "au-naturel-makeup-remover" – Au Naturel Makeup Remover (399 kr) – rengöringsolja med MCT + CBD, varsam mot mikrobiom
2. "duo-kit" – DUO-kit (1 099 kr) – The ONE Facial Oil (morgon, 10% CBD) + I LOVE Facial Oil (kväll, 10% CBD + 5% CBG)
3. "ta-da-serum" – TA-DA Serum (699 kr) – 3% CBG i ekologisk jojobaolja, fukt och lyster

Dessa tre bildar grundrutinen. Men skriv UNIKA, PERSONLIGA motiveringar för VARJE produkt kopplat till just denna kunds hudtyp, besvär, livsstil och mål. Förklara ur ECS/mikrobiom-perspektiv.

Valfritt tillägg om relevant:
- "fungtastic-mushroom-extract" – Fungtastic Mushroom Extract (377 kr) – Chaga, Lion's Mane, Cordyceps, Reishi. Rekommendera vid hög stress, dålig sömn eller om kunden vill jobba inifrån.

Övriga kit-ID:n (om priseffektivt):
- "duo-ta-da" (1 495 kr) – DUO + TA-DA (spar 302 kr)
- "the-one-i-love-ta-da" (1 795 kr) – komplett 3-produkt

== LIVSSTILSRÅD ==
Basera på kundens specifika svar om sömn, stress, kost, vatten och träning. Ge konkreta, personliga tips. Motivera vetenskapligt (kortfattat). Referera gärna till kopplingar mellan tarm-hud-axeln, ECS, mikrobiom, stress-kortisol-hud etc.

== RUTINFÖRSLAG ==
Anpassa morgon- och kvällsrutin till kundens hudtyp och besvär. Varje steg ska ha en kort förklaring av VARFÖR det stöder hudens egna system.

== PRIMARYCONDITION (KRITISKT FOR KORREKT TAGGNING) ==
Fältet "primaryCondition" avgör hur kunden taggas i vårt system. Felaktig taggning gör att kunden får irrelevanta nyhetsbrev. VAR EXTREMT KONSERVATIV:
- Sätt "normal" om huden i stort sett är frisk och du inte ser tydliga tecken på en specifik åkomma
- DE FLESTA MÄNNISKOR HAR NORMAL HUD. Det är det vanligaste tillståndet. "normal" ska vara ditt standardval.
- Sätt en specifik åkomma (acne, dermatitis, etc.) ENBART om du ser tydliga, obestridliga tecken i bilden ELLER om kunden själv uppger det i quiz-svaren
- "confidence" ska vara "high" bara om du är helt säker. Vid minsta tvekan: "medium" eller "low"
- Om du är osäker mellan "normal" och en mild åkomma: VÄLJ ALLTID "normal"
- IGNORERA skanningsdata helt för detta fält – basera ENBART på din visuella bedömning + quiz-svar

== REGLER ==
- Svara på svenska som standard. Om locale skickas med: "en" → svara på engelska, "es" → svara på spanska, "de" → svara på tyska, "fr" → svara på franska
- Använd ALDRIG emojis
- Var specifik och personlig – referera till kundens egna svar genomgående
- JSON-blocket ska vara det ENDA du svarar med (ingen löptext utanför JSON)
- FÖRBJUDET: medicinsk diagnos, receptbelagda läkemedel, påhittade ingredienser, generisk rådgivning
- ÖVERDIAGNOSTISERA ALDRIG: Frisk hud är det vanligaste. Om bilden visar balanserad hud utan synliga problem, ge högt score (80+) och primaryCondition "normal". Att hitta problem som inte finns skadar kundens förtroende.

Vid allvarliga hudtillstånd: rekommendera dermatolog som komplement.`;

// ---- OPENAI HUDANALYS (Responses API) ----

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.4";

function extractOutputText(data) {
  // 1. SDK-style helper (if present)
  if (data.output_text) return data.output_text;

  // 2. Responses API: parse output array
  if (Array.isArray(data.output)) {
    for (const item of data.output) {
      if (item.type === "message" && Array.isArray(item.content)) {
        const textParts = item.content
          .filter(c => c.type === "output_text")
          .map(c => c.text);
        if (textParts.length > 0) return textParts.join("\n");
      }
    }
  }

  // 3. Chat Completions fallback
  if (data.choices?.[0]?.message?.content) {
    return data.choices[0].message.content;
  }

  return "";
}

function buildAnalysisPrompt(questions, imageScan) {
  const parts = [];

  if (questions) {
    parts.push("== KUNDENS QUIZ-SVAR ==");
    if (questions.skinType) parts.push(`Hudtyp: ${questions.skinType}`);
    if (questions.concerns?.length) parts.push(`Huvudbesvär: ${questions.concerns.join(", ")}`);
    if (questions.routine) parts.push(`Nuvarande rutin: ${questions.routine}`);
    if (questions.lifestyle) {
      const ls = questions.lifestyle;
      if (ls.sleep) parts.push(`Sömn: ${ls.sleep} timmar per natt`);
      if (ls.stress) parts.push(`Stressnivå: ${ls.stress}`);
      if (ls.diet) parts.push(`Kost: ${ls.diet}`);
      if (ls.water) parts.push(`Vattenintag: ${ls.water}`);
      if (ls.activity) parts.push(`Träning: ${ls.activity}`);
    }
    if (questions.goals?.length) parts.push(`Mål: ${questions.goals.join(", ")}`);
    if (questions.goalFreeText) parts.push(`Övrigt: ${questions.goalFreeText}`);
  }

  if (imageScan) {
    parts.push("\n== SKANNINGSDATA (AI-hudskanning, lokal analys i webbläsaren) ==");
    if (imageScan.overall?.length) {
      parts.push("Helhetsbild:");
      imageScan.overall.forEach(o => {
        parts.push(`  - ${o.conditionSv || o.condition}: ${o.confidence}% konfidens`);
      });
    }
    if (imageScan.zones?.length) {
      parts.push("Zon-analys:");
      imageScan.zones.forEach(z => {
        parts.push(`  - ${z.zone}: ${z.conditionSv || z.condition} (${z.confidence}%)`);
      });
    }
    parts.push("OBS: Skanningen utfördes lokalt med en begränsad AI-modell som SAKNAR 'normal'-klass (dvs den tvingas alltid ange en hudåkomma). 'normal' i datan ovan innebär att vårt filter bedömt att ingen åkomma detekterades tillförlitligt. Konfidensgrader under 60% bör IGNORERAS. LITA PÅ DIN EGEN VISUELLA BEDÖMNING av bilden istället.");
  }

  if (!questions && !imageScan) {
    return "Ge mig en holistisk hudanalys baserat på din expertis.";
  }

  parts.push("\nGe en djup, personlig hudanalys. Om en bild bifogas, basera din bedömning PRIMÄRT på vad du ser i bilden. Svara ENBART med JSON-blocket enligt formatet i instruktionerna.");
  return parts.join("\n");
}

app.post("/api/analysis", async (req, res) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "analysis", 10)) {
      return res.status(429).json({ message: "Du har nått gränsen. Försök igen om en stund." });
    }

    const { imageBase64, regions, fullImage, questions, imageScan } = req.body;
    const locale = req.body.questions?.locale || "sv";

    const mainImage = fullImage || imageBase64;
    const hasImage = mainImage && mainImage.startsWith("data:image/");
    const hasQuestions = questions && (questions.skinType || questions.concerns?.length);
    const hasScan = imageScan && (imageScan.overall?.length || imageScan.zones?.length);

    if (!hasImage && !hasQuestions && !hasScan) {
      return res.status(400).json({ message: "Besvara frågorna eller bifoga ett foto." });
    }

    const promptText = buildAnalysisPrompt(questions, imageScan);
    const bookKnowledge = loadAnalysisBookKnowledge();

    const concerns = questions?.concerns || [];
    const scanConditions = (imageScan?.overall || []).map(o => o.condition || o.conditionSv).filter(Boolean);
    const allConcerns = [...new Set([...concerns, ...scanConditions])];
    const researchSnippets = await searchVayu(allConcerns);

    let systemPromptFull = ANALYSIS_SYSTEM_PROMPT;
    const langMap = { en: "English", es: "Spanish", de: "German", fr: "French" };
    if (locale && langMap[locale]) {
      systemPromptFull += `\n\n== LANGUAGE ==\nThe user is browsing in ${langMap[locale]}. You MUST write your ENTIRE response in ${langMap[locale]} – all field values in the JSON (summary, details, tips, routine labels, product recommendations text, etc.). Keep JSON keys in English.`;
    }
    if (bookKnowledge) systemPromptFull += "\n\n== BOKKUNSKAP (Christopher Genbergs bok om holistisk hudvård) ==\n" + bookKnowledge;
    if (researchSnippets) systemPromptFull += researchSnippets;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: "OpenAI API-nyckel saknas i serverkonfigurationen." });
    }

    const contentParts = [
      { type: "input_text", text: promptText }
    ];

    if (hasImage) {
      contentParts.push({ type: "input_image", image_url: mainImage });
    }

    if (regions && Array.isArray(regions) && regions.length > 0) {
      const regionLabels = regions.map(r => r.label).join(", ");
      contentParts.push({
        type: "input_text",
        text: `The following images show cropped facial regions: ${regionLabels}. Analyze each region specifically and compare with the ONNX model's per-zone results above.`
      });
      for (const region of regions) {
        if (region.imageBase64 && region.imageBase64.startsWith("data:image/")) {
          contentParts.push({ type: "input_image", image_url: region.imageBase64 });
        }
      }
    }

    if (imageScan?.skinMetrics) {
      contentParts.push({
        type: "input_text",
        text: `== CLIENT-SIDE SKIN METRICS (computed from ONNX model) ==\n${JSON.stringify(imageScan.skinMetrics, null, 2)}\n\nUse these metrics as a starting point for your analysis. You may adjust them based on your visual assessment. The overall score should be 0-100 (higher = healthier).`
      });
    }

    if (imageScan?.overallSeverity) {
      contentParts.push({
        type: "input_text",
        text: `== ONNX SEVERITY ASSESSMENT == Level: ${imageScan.overallSeverity.level}, Confidence: ${imageScan.overallSeverity.confidence}%`
      });
    }

    console.log(`[Analysis] Sending ${contentParts.filter(p => p.type === "input_image").length} image(s), questions=${!!hasQuestions}, scan=${!!hasScan}, research=${!!researchSnippets}, model=${OPENAI_MODEL}`);

    const response = await fetchWithRetry("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        instructions: systemPromptFull,
        input: [
          { role: "user", content: contentParts }
        ],
        store: true
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("[Analysis] OpenAI error:", response.status, JSON.stringify(data).slice(0, 500));
      const msg = data.error?.message || "Analysen kunde inte genomföras just nu.";
      throw { status: response.status, message: msg };
    }

    console.log("[Analysis] Response keys:", Object.keys(data));

    const outputText = extractOutputText(data);
    if (!outputText) {
      console.error("[Analysis] Empty output. Full response:", JSON.stringify(data).slice(0, 2000));
      throw { status: 500, message: "Analysen gav inget resultat. Försök igen." };
    }

    console.log("[Analysis] Success, output length:", outputText.length);

    let analysisId = null;
    try {
      let userId = null;
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        try {
          const decoded = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET);
          userId = decoded.id || null;
        } catch { /* not logged in, ok */ }
      }

      const jsonMatch = outputText.match(/```json\s*([\s\S]*?)```/);
      const parsedResult = jsonMatch ? JSON.parse(jsonMatch[1]) : null;
      const saved = await db.createSkinAnalysis({
        userId,
        answers: questions || null,
        result: parsedResult,
        fullText: outputText,
        score: parsedResult?.score || null,
      });
      analysisId = saved?.id || null;
      console.log(`[Analysis] Saved to DB: id=${analysisId}, userId=${userId}, score=${parsedResult?.score}`);

      // Auto-tag subscriber using GPT's primaryCondition (not raw ONNX)
      try {
        const pc = parsedResult?.primaryCondition;
        const gptCondition = pc?.condition || null;
        const gptConfidence = pc?.confidence || "low";

        const shouldTag = gptCondition
          && gptCondition !== "normal"
          && gptConfidence !== "low"
          && userId;

        if (shouldTag) {
          const user = await db.findUserById(userId);
          if (user?.email) {
            const existing = await db.findSubscriberByEmail(user.email);
            if (existing && !existing.skin_condition) {
              await db.updateSubscriberSkinCondition(user.email, gptCondition);
              console.log(`[Analysis] Auto-tagged subscriber ${user.email} → ${gptCondition} (confidence: ${gptConfidence})`);
            }
          }
        } else if (userId) {
          console.log(`[Analysis] No auto-tag: condition=${gptCondition}, confidence=${gptConfidence}`);
        }
      } catch (tagErr) {
        console.error("[Analysis] Auto-tag failed (non-fatal):", tagErr.message);
      }
    } catch (saveErr) {
      console.error("[Analysis] DB save failed (non-fatal):", saveErr.message);
    }

    res.json({
      content: outputText,
      responseId: data.id || null,
      analysisId,
      usage: data.usage
    });
  } catch (err) {
    console.error("[Analysis Error]", err);
    res.status(err.status || 500).json({ message: err.message || "Analysen misslyckades" });
  }
});

app.post("/api/training-data", async (req, res) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "training-upload", 5)) {
      return res.status(429).json({ message: "For manga uppladdningar. Forsok igen senare." });
    }

    const { imageBase64, scanResults, quizAnswers, topCondition, confidence } = req.body;

    if (!imageBase64 || !imageBase64.startsWith("data:image/")) {
      return res.status(400).json({ message: "Ingen giltig bild bifogad." });
    }

    if (imageBase64.length > 15 * 1024 * 1024) {
      return res.status(413).json({ message: "Bilden ar for stor (max 10 MB)." });
    }

    const saved = await db.createTrainingUpload({
      imageData: imageBase64,
      scanResults: scanResults || null,
      quizAnswers: quizAnswers || null,
      topCondition: topCondition || null,
      confidence: confidence || null,
    });

    console.log(`[Training] Upload saved: id=${saved.id}, condition=${saved.top_condition}, confidence=${saved.confidence}`);

    const totalCount = await db.countTrainingUploads();

    res.json({ id: saved.id, totalContributions: totalCount });
  } catch (err) {
    console.error("[Training] Upload error:", err.message);
    res.status(500).json({ message: "Kunde inte spara traningsdata." });
  }
});

// ---- ADMIN: TRAINING DATA EXPORT ----

app.get("/api/admin/training-data/stats", adminAuthMiddleware, async (req, res) => {
  try {
    const stats = await db.getTrainingUploadStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/admin/training-data/export", adminAuthMiddleware, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 500);
    const offset = parseInt(req.query.offset) || 0;
    const condition = req.query.condition || null;
    const rows = await db.exportTrainingUploads({ limit, offset, condition });
    res.json({ count: rows.length, offset, rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/admin/training-data/:id/image", adminAuthMiddleware, async (req, res) => {
  try {
    const row = await db.exportTrainingUploadImage(parseInt(req.params.id));
    if (!row) return res.status(404).json({ message: "Inte hittad" });
    res.json({ id: row.id, topCondition: row.top_condition, confidence: row.confidence, imageData: row.image_data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/analysis/classify", async (req, res) => {
  try {
    const classifierUrl = process.env.SKIN_CLASSIFIER_URL;
    if (!classifierUrl) {
      return res.status(501).json({ message: "Bildanalys är inte konfigurerad ännu." });
    }

    const { imageBase64 } = req.body;
    if (!imageBase64 || !imageBase64.startsWith("data:image/")) {
      return res.status(400).json({ message: "Inget giltigt foto bifogat" });
    }

    const base64Data = imageBase64.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    const blob = new Blob([buffer], { type: "image/jpeg" });
    const form = new FormData();
    form.append("file", blob, "skin.jpg");

    const response = await fetch(`${classifierUrl}/classify`, {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw { status: response.status, message: errData.detail || "Classification failed" };
    }

    const data = await response.json();
    console.log("[Skin Classifier] Result:", JSON.stringify(data));
    res.json(data);
  } catch (err) {
    console.error("[Skin Classifier Error]", err);
    res.status(err.status || 500).json({ message: err.message || "Bildanalys misslyckades" });
  }
});

app.get("/api/analysis/history", authMiddleware, async (req, res) => {
  try {
    const analyses = await db.getSkinAnalyses(req.user.id);
    res.json(analyses);
  } catch (err) {
    console.error("[Analysis History]", err);
    res.status(500).json({ message: "Kunde inte hämta analyshistorik" });
  }
});

/* ─── Multimodal Fusion Scoring ─── */

const QUIZ_CONCERN_MAP = {
  acne: ["acne", "breakouts", "pimples", "oily"],
  dryness: ["dry", "flaky", "tight", "dehydrated"],
  rosacea: ["redness", "flushing", "sensitive"],
  hyperpigmentation: ["dark spots", "uneven tone", "pigmentation", "melasma"],
  wrinkles: ["aging", "fine lines", "wrinkles", "sagging"],
  enlarged_pores: ["large pores", "oily", "blackheads"],
  eczema: ["itchy", "eczema", "atopic"],
  sun_damage: ["sun damage", "sun spots"],
};

function computeFusionScore(imageScan, quizAnswers, aiResult) {
  const weights = { image: 0.50, quiz: 0.20, ai: 0.30 };
  const conditionScores = {};

  if (imageScan?.overall?.length) {
    for (const pred of imageScan.overall) {
      const cond = pred.condition || pred.label;
      if (!cond) continue;
      conditionScores[cond] = conditionScores[cond] || { image: 0, quiz: 0, ai: 0 };
      conditionScores[cond].image = Math.max(conditionScores[cond].image, pred.probability || pred.confidence || 0);
    }
  }

  if (imageScan?.zones?.length) {
    for (const zone of imageScan.zones) {
      if (!zone.predictions?.length) continue;
      for (const pred of zone.predictions) {
        const cond = pred.condition || pred.label;
        if (!cond) continue;
        conditionScores[cond] = conditionScores[cond] || { image: 0, quiz: 0, ai: 0 };
        conditionScores[cond].image = Math.max(conditionScores[cond].image, (pred.probability || 0) * 0.8);
      }
    }
  }

  if (quizAnswers?.concerns?.length) {
    const userConcerns = quizAnswers.concerns.map(c => c.toLowerCase());
    for (const [condition, keywords] of Object.entries(QUIZ_CONCERN_MAP)) {
      const match = keywords.some(kw => userConcerns.some(uc => uc.includes(kw)));
      if (match) {
        conditionScores[condition] = conditionScores[condition] || { image: 0, quiz: 0, ai: 0 };
        conditionScores[condition].quiz = 0.7;
      }
    }
  }

  if (aiResult?.conditions?.length) {
    for (const c of aiResult.conditions) {
      const cond = c.name || c.condition;
      if (!cond) continue;
      conditionScores[cond] = conditionScores[cond] || { image: 0, quiz: 0, ai: 0 };
      const severity = { mild: 0.3, moderate: 0.6, severe: 0.9 };
      conditionScores[cond].ai = severity[c.severity?.toLowerCase()] || 0.5;
    }
  }

  const fused = Object.entries(conditionScores).map(([condition, scores]) => ({
    condition,
    confidence: Math.min(1,
      scores.image * weights.image +
      scores.quiz * weights.quiz +
      scores.ai * weights.ai
    ),
    sources: {
      image: Math.round(scores.image * 100),
      quiz: Math.round(scores.quiz * 100),
      ai: Math.round(scores.ai * 100),
    },
  })).filter(c => c.confidence > 0.1)
    .sort((a, b) => b.confidence - a.confidence);

  const normalScore = fused.find(c => c.condition === "normal");
  const issueScore = fused.filter(c => c.condition !== "normal")
    .reduce((sum, c) => sum + c.confidence, 0);

  let overallScore = 100;
  if (issueScore > 0) {
    overallScore = Math.max(10, Math.round(100 - issueScore * 40));
  }
  if (normalScore && normalScore.confidence > 0.6) {
    overallScore = Math.max(overallScore, 75);
  }

  return { conditions: fused, overallScore };
}

app.post("/api/analysis/fusion", async (req, res) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "fusion", 20)) {
      return res.status(429).json({ message: "For manga forfragan. Forsok igen om en stund." });
    }

    const { imageScan, quizAnswers, aiResult } = req.body;
    const fusion = computeFusionScore(imageScan, quizAnswers, aiResult);

    res.json(fusion);
  } catch (err) {
    console.error("[Fusion Error]", err);
    res.status(500).json({ message: "Fusionsanalysen misslyckades." });
  }
});

/* ─── Temporal Diff ─── */

app.get("/api/analysis/diff", authMiddleware, async (req, res) => {
  try {
    const analyses = await db.getSkinAnalyses(req.user.id);
    if (analyses.length < 2) {
      return res.json({ hasDiff: false, message: "Minst tva analyser behovs for jamforelse." });
    }

    const latest = analyses[0];
    const previous = analyses[1];

    const latestResult = latest.result || {};
    const previousResult = previous.result || {};

    const scoreDiff = (latest.score ?? 0) - (previous.score ?? 0);
    const daysBetween = Math.round(
      (new Date(latest.created_at) - new Date(previous.created_at)) / (1000 * 60 * 60 * 24)
    );

    const latestConditions = new Set((latestResult.conditions || []).map(c => c.name || c.condition));
    const previousConditions = new Set((previousResult.conditions || []).map(c => c.name || c.condition));

    const improved = [...previousConditions].filter(c => !latestConditions.has(c));
    const newConcerns = [...latestConditions].filter(c => !previousConditions.has(c));
    const persistent = [...latestConditions].filter(c => previousConditions.has(c));

    res.json({
      hasDiff: true,
      scoreDiff,
      daysBetween,
      latestScore: latest.score,
      previousScore: previous.score,
      improved,
      newConcerns,
      persistent,
      latestDate: latest.created_at,
      previousDate: previous.created_at,
    });
  } catch (err) {
    console.error("[Diff Error]", err);
    res.status(500).json({ message: "Kunde inte berakna forandring." });
  }
});

app.post("/api/analysis/chat", async (req, res) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "analysis-chat", 50)) {
      return res.status(429).json({ message: "Du har nått gränsen. Försök igen om en stund." });
    }

    const { message, previousResponseId } = req.body;

    if (!message || !previousResponseId) {
      return res.status(400).json({ message: "Meddelande och tidigare analys-ID krävs." });
    }

    const response = await fetchWithRetry("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: message,
        previous_response_id: previousResponseId,
        store: true
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const status = response.status;
      if (status === 404) {
        throw { status: 404, message: "Sessionen har löpt ut. Gör en ny analys." };
      }
      throw { status, message: err.error?.message || "Chatten kunde inte svara just nu." };
    }

    const data = await response.json();
    const outputText = extractOutputText(data);

    res.json({
      content: outputText,
      responseId: data.id || previousResponseId
    });
  } catch (err) {
    console.error("[Analysis Chat Error]", err);
    res.status(err.status || 500).json({ message: err.message || "Chatten misslyckades" });
  }
});

// ---- DISCOUNT CODE VALIDATION ----

app.post("/api/discount/validate", async (req, res) => {
  const { code, items } = req.body;
  if (!code) return res.status(400).json({ message: "Ange en rabattkod" });

  const key = code.toLowerCase().trim();
  let discount = DISCOUNT_CODES[key];

  if (!discount) {
    const dbCode = await db.findDiscountCode(key);
    if (dbCode && dbCode.active) {
      const now = new Date();
      if (dbCode.valid_from && new Date(dbCode.valid_from) > now) { discount = null; }
      else if (dbCode.valid_until && new Date(dbCode.valid_until) < now) { discount = null; }
      else if (dbCode.max_uses && dbCode.used_count >= dbCode.max_uses) { discount = null; }
      else {
        discount = {
          percent: dbCode.percent || 0,
          fixedAmount: dbCode.fixed_amount || 0,
          productIds: dbCode.product_ids,
          description: dbCode.description
        };
      }
    }
  }

  if (!discount) return res.status(404).json({ message: "Ogiltig rabattkod" });

  const applicableItems = (items || []).filter(i => !discount.productIds || discount.productIds.includes(i.id));
  if (applicableItems.length === 0) {
    return res.status(400).json({ message: "Rabattkoden gäller inte för dessa produkter" });
  }

  res.json({
    code: key,
    percent: discount.percent || 0,
    fixedAmount: discount.fixedAmount || 0,
    description: discount.description,
    applicableProductIds: discount.productIds || null,
  });
});

// ---- EMAIL ACCOUNT CHECK (checkout helper) ----

app.post("/api/account/check-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ exists: false });
    const user = await db.findUserByEmail(email.trim().toLowerCase());
    res.json({ exists: !!user, name: user ? (user.name || "").split(" ")[0] : null });
  } catch (err) {
    res.json({ exists: false });
  }
});

// ---- ORDER CREATION (checkout → DB → Viva payment order) ----

app.post("/api/orders/create", async (req, res) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "orders-create", 20)) {
      return res.status(429).json({ message: "För många beställningar. Försök igen om en stund." });
    }
    const { customer, deliveryAddress, items, discountCode, currency: reqCurrency, createAccount, locale: reqLocale } = req.body;
    const currency = reqCurrency === "EUR" ? "EUR" : "SEK";
    const locale = reqLocale === "en" ? "en" : "sv";

    if (!customer?.name || !customer?.email) {
      return res.status(400).json({ message: "Namn och e-post krävs" });
    }
    if (!deliveryAddress?.address || !deliveryAddress?.zip || !deliveryAddress?.city) {
      return res.status(400).json({ message: "Leveransadress krävs" });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Varukorgen är tom" });
    }

    const hasSubscription = items.some(
      (i) =>
        i &&
        i.subscription &&
        typeof i.subscription === "object" &&
        typeof i.subscription.intervalDays === "number"
    );

    let discount = discountCode ? DISCOUNT_CODES[discountCode.toLowerCase().trim()] : null;
    if (!discount && discountCode) {
      const dbCode = await db.findDiscountCode(discountCode);
      if (dbCode && dbCode.active) {
        const now = new Date();
        const valid = (!dbCode.valid_from || new Date(dbCode.valid_from) <= now)
          && (!dbCode.valid_until || new Date(dbCode.valid_until) >= now)
          && (!dbCode.max_uses || dbCode.used_count < dbCode.max_uses);
        if (valid) {
          discount = {
            percent: dbCode.percent || 0,
            fixedAmount: dbCode.fixed_amount || 0,
            productIds: dbCode.product_ids,
            description: dbCode.description
          };
          await db.incrementDiscountUsage(discountCode);
        }
      }
    }

    const orderItems = items.map(item => {
      const product = PRODUCTS_MAP[item.id];
      if (!product) throw { status: 400, message: `Okänd produkt: ${item.id}` };
      let price = currency === "EUR" ? (product.priceEur || product.price) : product.price;
      const originalPrice = price;
      const isSubscription = item.subscription && typeof item.subscription === "object" && typeof item.subscription.intervalDays === "number";
      if (isSubscription) {
        price = Math.round(price * 0.85);
      }
      if (discount && (!discount.productIds || discount.productIds.includes(item.id))) {
        if (discount.percent) {
          price = Math.round(price * (1 - discount.percent / 100));
        }
      }
      return {
        articleNumber: product.articleNumber || item.id,
        productId: item.id,
        name: product.name,
        quantity: item.qty || 1,
        price,
        originalPrice,
        vatRate: product.vatRate || 0.25,
        ...(isSubscription && { subscription: true, intervalDays: item.subscription.intervalDays })
      };
    });

    let totalAmount = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    if (discount && discount.fixedAmount) {
      totalAmount = Math.max(0, totalAmount - discount.fixedAmount);
    }
    const shippingAmount = currency === "EUR" ? SHIPPING_COST.EUR : SHIPPING_COST.SEK;
    const threshold = currency === "EUR" ? FREE_SHIPPING_THRESHOLD.EUR : FREE_SHIPPING_THRESHOLD.SEK;
    const shippingCost = totalAmount >= threshold ? 0 : shippingAmount;
    const vivaAmount = (totalAmount + shippingCost) * 100;

    const orderNumber = await generateOrderNumber();

    // Always look up existing user by email so orders are linked to their account.
    // Force account creation for subscription orders (user needs login to manage it).
    const shouldCreateAccount = createAccount || hasSubscription;
    let checkoutUserId = null;
    const existingUser = await db.findUserByEmail(customer.email);
    if (existingUser) {
      checkoutUserId = existingUser.id;
    } else if (shouldCreateAccount) {
      try {
        const resetToken = crypto.randomBytes(48).toString("hex");
        const resetExpires = new Date(Date.now() + 72 * 3600_000).toISOString();
        const tempHash = bcrypt ? await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10) : "temp";
        const newUser = await db.createUser({
          id: crypto.randomUUID(),
          name: customer.name,
          email: customer.email,
          phone: customer.phone || "",
          passwordHash: tempHash
        });
        await db.updateUser(newUser.id, {
          password_reset_token: resetToken,
          password_reset_expires: resetExpires
        });
        checkoutUserId = newUser.id;
        console.log(`[Checkout] Account created for ${customer.email}, reset token generated`);

        sendPasswordSetupEmail(customer.email, customer.name, resetToken).catch(err => {
          console.error("[Checkout] Password email error:", err.message);
        });
      } catch (err) {
        console.error("[Checkout] Auto-create account error:", err.message);
      }
    }

    const vivaOrderBody = {
      amount: vivaAmount,
      currencyCode: VIVA_CURRENCY_CODE[currency],
      customerTrns: `1753 SKINCARE – ${orderNumber}`,
      merchantTrns: orderNumber,
      sourceCode: process.env.VIVA_SOURCE_CODE,
      customer: {
        email: customer.email,
        fullName: customer.name,
        phone: customer.phone || ""
      }
    };
    if (hasSubscription) {
      vivaOrderBody.allowRecurring = true;
    }

    const vivaData = await vivaFetch("/checkout/v2/orders", "POST", vivaOrderBody);

    await db.createOrder({
      orderNumber,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone || "",
      address: deliveryAddress.address,
      zip: deliveryAddress.zip,
      city: deliveryAddress.city,
      vivaOrderCode: vivaData.orderCode,
      merchantTrns: orderNumber,
      items: orderItems,
      totalAmount,
      shippingCost,
      currency,
      userId: checkoutUserId,
      locale
    });

    console.log(`[Order] Created ${orderNumber} (${currency}), vivaOrderCode=${vivaData.orderCode}${checkoutUserId ? `, userId=${checkoutUserId}` : ""}`);

    const env = process.env.VIVA_ENVIRONMENT === "production" ? "www" : "demo";
    const checkoutUrl = `https://${env}.vivapayments.com/web/checkout?ref=${vivaData.orderCode}`;

    res.json({ orderCode: vivaData.orderCode, orderNumber, checkoutUrl });
  } catch (err) {
    console.error("[Order Create Error]", err);
    res.status(err.status || 500).json({ message: err.message || "Ordern kunde inte skapas" });
  }
});

// ---- VIVA WALLET ROUTES ----

app.get("/api/vivawallet/verify/:transactionId", async (req, res) => {
  try {
    const data = await vivaFetch(`/checkout/v2/transactions/${req.params.transactionId}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

// Webhook verification (GET) – Viva sends a GET to verify the URL
app.get("/api/vivawallet/webhook", (req, res) => {
  const key = process.env.VIVA_VERIFICATION_KEY;
  if (key) {
    return res.json({ Key: key });
  }
  res.status(200).send("OK");
});

// Webhook handler (POST) – called by Viva after payment
app.post("/api/vivawallet/webhook", async (req, res) => {
  const event = req.body;
  const rawStr = req.rawBody ? req.rawBody.toString("utf8") : JSON.stringify(req.body);
  // OrderCode i JSON kan vara > MAX_SAFE_INTEGER — återställ exakt siffersträng från rå body
  if (event.EventData) {
    const oc = rawStr.match(/"OrderCode"\s*:\s*(\d+)/);
    if (oc) event.EventData.OrderCode = oc[1];
  }
  console.log("[Viva Webhook]", event.EventTypeId, JSON.stringify(event.EventData || {}).slice(0, 200));

  const vivaKey = process.env.VIVA_VERIFICATION_KEY;
  if (vivaKey) {
    const sig256 = req.headers["viva-signature-256"] || "";
    const sig1 = req.headers["viva-signature"] || "";
    const rawBody = rawStr;
    if (sig256) {
      const expected = crypto.createHmac("sha256", vivaKey).update(rawBody).digest("hex");
      if (sig256 !== expected) {
        console.error("[Webhook] Invalid SHA-256 signature");
        return res.status(403).json({ message: "Invalid signature" });
      }
    } else if (sig1) {
      const expected = crypto.createHmac("sha1", vivaKey).update(rawBody).digest("hex");
      if (sig1 !== expected) {
        console.error("[Webhook] Invalid SHA-1 signature");
        return res.status(403).json({ message: "Invalid signature" });
      }
    }
  }

  res.json({ status: "ok" });

  if (event.EventTypeId === 1796 || event.EventTypeId === 1797) {
    try {
      const transactionId = event.EventData?.TransactionId;
      const merchantTrns = event.EventData?.MerchantTrns;
      const orderCode = event.EventData?.OrderCode;

      // Check if this is a subscription payment (merchantTrns starts with SUB-)
      if (merchantTrns && merchantTrns.startsWith("SUB-")) {
        const sub = orderCode ? await db.findSubscriptionByVivaCode(orderCode) : null;
        if (sub) {
          const nextCharge = new Date();
          nextCharge.setDate(nextCharge.getDate() + sub.interval_days);
          await db.updateSubscription(sub.id, {
            status: "active",
            viva_initial_tx_id: transactionId || null,
            next_charge_date: nextCharge.toISOString().split("T")[0],
            last_charge_date: new Date().toISOString().split("T")[0]
          });
          console.log(`[Webhook] Subscription ${sub.id} activated, next charge: ${nextCharge.toISOString().split("T")[0]}`);
          return;
        }
        console.warn("[Webhook] Subscription not found for orderCode:", orderCode);
      }

      let order = merchantTrns ? await db.findOrderByMerchantTrns(merchantTrns) : null;
      if (!order && orderCode) order = await db.findOrderByVivaCode(orderCode);

      if (!order) {
        console.error("[Webhook] Order not found:", merchantTrns, orderCode);
        return;
      }

      await db.updateOrder(order.id, {
        payment_status: "paid",
        status: "confirmed",
        viva_transaction_id: transactionId || null
      });

      console.log(`[Webhook] Order ${order.order_number} confirmed, starting fulfilment`);
      await handleOrderCompletion(order.id);
    } catch (err) {
      console.error("[Webhook] Fulfilment error:", err);
    }
  }
});

// ---- ORDER COMPLETION (Fortnox + Ongoing orchestration) ----

async function handleOrderCompletion(orderId) {
  const order = await db.findOrderByNumber(
    (await db.pool.query("SELECT order_number FROM orders WHERE id = $1", [orderId])).rows[0]?.order_number
  );
  if (!order) throw new Error(`Order ${orderId} not found`);

  if (order.processed_at) {
    console.log(`[Order] ${order.order_number} already processed at ${order.processed_at}`);
    return { alreadyProcessed: true };
  }

  const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
  const notes = [];
  let fortnoxInvoiceNumber = null;
  let fortnoxCustomerNumber = null;
  let ongoingOrderId = null;

  // 1. Fortnox: find or create customer
  try {
    const existing = await fortnoxFetch(`/customers?filter=email&email=${encodeURIComponent(order.customer_email)}`);
    fortnoxCustomerNumber = existing?.Customers?.[0]?.CustomerNumber;
  } catch (_) { /* not found */ }

  if (!fortnoxCustomerNumber) {
    try {
      const created = await fortnoxFetch("/customers", "POST", {
        Customer: {
          Name: order.customer_name,
          Email: order.customer_email,
          Phone1: order.customer_phone || "",
          Address1: order.address || "",
          ZipCode: order.zip || "",
          City: order.city || "",
          CountryCode: order.country_code || "SE"
        }
      });
      fortnoxCustomerNumber = created?.Customer?.CustomerNumber;
      notes.push(`Fortnox kund skapad: ${fortnoxCustomerNumber}`);
    } catch (err) {
      notes.push(`Fortnox kund FEL: ${err.message}`);
      console.error("[Order] Fortnox customer error:", err);
    }
  } else {
    notes.push(`Fortnox kund hittad: ${fortnoxCustomerNumber}`);
  }

  // 2. Use the order's own number for Fortnox + Ongoing (generated at checkout)
  const sharedOrderNumber = order.order_number;
  let fortnoxOrderNumber = null;
  if (fortnoxCustomerNumber) {
    try {
      const orderRows = items.map(i => {
        const vat = i.vatRate || 0.25;
        const priceExVat = Math.round((i.price / (1 + vat)) * 100) / 100;
        return {
          ArticleNumber: i.articleNumber,
          Description: i.name,
          OrderedQuantity: i.quantity,
          DeliveredQuantity: i.quantity,
          Price: priceExVat,
          VAT: Math.round(vat * 100)
        };
      });

      const today = new Date().toISOString().split("T")[0];
      const fxOrder = await fortnoxFetch("/orders", "POST", {
        Order: {
          CustomerNumber: fortnoxCustomerNumber,
          OrderDate: today,
          DeliveryDate: today,
          DeliveryAddress1: order.address || "",
          DeliveryZipCode: order.zip || "",
          DeliveryCity: order.city || "",
          DeliveryCountry: (order.currency || "SEK") === "EUR" ? "" : "Sverige",
          YourReference: order.customer_name,
          YourOrderNumber: sharedOrderNumber,
          ExternalInvoiceReference1: sharedOrderNumber,
          Currency: order.currency || "SEK",
          Freight: order.shipping_cost > 0 ? order.shipping_cost : 0,
          OrderRows: orderRows,
          Remarks: `Order ${sharedOrderNumber} – betald via Viva Wallet`
        }
      });
      fortnoxOrderNumber = fxOrder?.Order?.DocumentNumber;
      const fxFreight = fxOrder?.Order?.Freight;
      const fxFreightVAT = fxOrder?.Order?.FreightVAT;
      const fxTotal = fxOrder?.Order?.Total;
      console.log(`[Fortnox] Order ${fortnoxOrderNumber}: Freight=${fxFreight}, FreightVAT=${fxFreightVAT}%, Total=${fxTotal}`);
      notes.push(`Fortnox order: ${fortnoxOrderNumber} (ordernr ${sharedOrderNumber})`);
    } catch (err) {
      notes.push(`Fortnox order FEL: ${err.message}`);
      console.error("[Order] Fortnox order error:", err);
    }
  }

  // 2b. Fortnox: create invoice from the order
  if (fortnoxOrderNumber) {
    try {
      const fxInvoiceResult = await fortnoxFetch(`/orders/${fortnoxOrderNumber}/createinvoice`, "PUT");
      const invKeys = Object.keys(fxInvoiceResult || {});
      const innerObj = fxInvoiceResult?.Order || fxInvoiceResult?.Invoice || {};
      console.log(`[Order] Fortnox createinvoice keys: ${invKeys}, InvoiceReference=${innerObj.InvoiceReference}, DocumentNumber=${innerObj.DocumentNumber}, InvoiceNumber=${innerObj.InvoiceNumber}`);

      // Fortnox returns either an Invoice object or an Order object with InvoiceReference
      fortnoxInvoiceNumber = fxInvoiceResult?.Invoice?.DocumentNumber
        || fxInvoiceResult?.DocumentNumber
        || fxInvoiceResult?.invoice?.DocumentNumber
        || fxInvoiceResult?.Invoice?.InvoiceNumber
        || fxInvoiceResult?.Order?.InvoiceReference
        || fxInvoiceResult?.Order?.DocumentNumber;

      // Last resort: search all top-level keys for anything that looks like an invoice number
      if (!fortnoxInvoiceNumber && fxInvoiceResult) {
        const flat = fxInvoiceResult.Invoice || fxInvoiceResult.Order || fxInvoiceResult;
        for (const key of ["InvoiceReference", "InvoiceNumber", "DocumentNumber"]) {
          if (flat[key] && typeof flat[key] === "number") {
            fortnoxInvoiceNumber = flat[key];
            break;
          }
        }
      }

      // Fallback: if we still don't have it, fetch the order to get InvoiceReference
      if (!fortnoxInvoiceNumber) {
        try {
          const orderCheck = await fortnoxFetch(`/orders/${fortnoxOrderNumber}`);
          fortnoxInvoiceNumber = orderCheck?.Order?.InvoiceReference;
          if (fortnoxInvoiceNumber) {
            console.log(`[Order] Got invoice number ${fortnoxInvoiceNumber} from order lookup`);
          }
        } catch { /* non-critical */ }
      }

      if (fortnoxInvoiceNumber) {
        notes.push(`Fortnox faktura: ${fortnoxInvoiceNumber}`);
      } else {
        console.error("[Order] Fortnox createinvoice could not find invoice number in:", JSON.stringify(fxInvoiceResult).slice(0, 1000));
        notes.push("Fortnox faktura: kunde ej parsas");
      }
    } catch (err) {
      notes.push(`Fortnox faktura FEL: ${err.message}`);
      console.error("[Order] Fortnox invoice error:", err);
    }
  }

  // 3. Fortnox: bookkeep invoice so it becomes "sent"
  if (fortnoxInvoiceNumber) {
    try {
      await fortnoxFetch(`/invoices/${fortnoxInvoiceNumber}/bookkeep`, "PUT");
      notes.push("Fortnox faktura bokford");
    } catch (err) {
      notes.push(`Fortnox bokforing FEL: ${err.message}`);
      console.error("[Order] Fortnox bookkeep error:", err);
    }
  }

  // 4. Fortnox: register payment on invoice (requires 'payment' scope)
  if (fortnoxInvoiceNumber) {
    try {
      const paymentAmount = order.total_amount + (order.shipping_cost || 0);
      await fortnoxFetch("/invoicepayments", "POST", {
        InvoicePayment: {
          InvoiceNumber: fortnoxInvoiceNumber,
          Amount: paymentAmount,
          AmountCurrency: paymentAmount,
          PaymentDate: new Date().toISOString().split("T")[0]
        }
      });
      notes.push("Fortnox betalning registrerad");
    } catch (err) {
      const isScope = err.message?.includes("scope") || err.message?.includes("behörighet");
      if (isScope) {
        notes.push("Fortnox betalning hoppades over (payment scope saknas i OAuth-appen)");
        console.warn(`[Order] Fortnox payment scope missing -- add 'payment' scope in Fortnox developer portal to auto-register payments`);
      } else {
        notes.push(`Fortnox betalning FEL: ${err.message}`);
        console.error("[Order] Fortnox payment error:", err);
      }
    }
  }

  // 5. Ongoing: create delivery order (skip if already exists from previous attempt)
  if (order.ongoing_order_id) {
    ongoingOrderId = order.ongoing_order_id;
    notes.push(`Ongoing order redan skapad: ${ongoingOrderId}`);
  } else try {
    const deliveryDate = new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0];
    const ogOrder = await ongoingFetch("/orders", "PUT", {
      orderNumber: sharedOrderNumber,
      deliveryDate,
      referenceNumber: "1753 Skincare",
      orderRemark: `Webborder ${order.order_number} – ${order.customer_email}`,
      orderType: { code: "B2C", name: "B2C" },
      transporter: { transporterCode: "PBREV", transporterServiceCode: "PUA" },
      consignee: {
        customerNumber: order.customer_email,
        name: order.customer_name,
        address1: order.address || "",
        postCode: order.zip || "",
        city: order.city || "",
        countryCode: order.country_code || "SE"
      },
      emailNotification: { toBeNotified: true, value: order.customer_email },
      smsNotification: { toBeNotified: !!order.customer_phone, value: order.customer_phone || "" },
      orderLines: items.map((item, i) => ({
        rowNumber: String(i + 1),
        articleNumber: item.articleNumber,
        numberOfItems: item.quantity,
        comment: item.name,
        shouldBePicked: true
      }))
    });
    const ongoingInternalId = ogOrder?.orderId || ogOrder?.orderInfo?.orderId;
    ongoingOrderId = sharedOrderNumber;
    notes.push(`Ongoing order: ${sharedOrderNumber} (internt: ${ongoingInternalId})`);
  } catch (err) {
    notes.push(`Ongoing order FEL: ${err.message}`);
    console.error("[Order] Ongoing order error:", err);
  }

  // 6. Update DB with all references
  const fortnoxDone = !!fortnoxInvoiceNumber;
  const ongoingDone = !!ongoingOrderId;
  const allSucceeded = fortnoxDone && ongoingDone;
  const updateFields = {
    fortnox_customer_number: fortnoxCustomerNumber || null,
    fortnox_order_number: fortnoxOrderNumber ? String(fortnoxOrderNumber) : null,
    fortnox_invoice_number: fortnoxInvoiceNumber ? String(fortnoxInvoiceNumber) : null,
    ongoing_order_id: ongoingOrderId ? String(ongoingOrderId) : null,
    status: allSucceeded ? "fulfilled" : (fortnoxDone || ongoingDone ? "partial" : "confirmed"),
    processed_at: new Date().toISOString()
  };

  await db.updateOrder(order.id, updateFields);
  await db.appendNotes(order.id, notes.join(" | "));

  console.log(`[Order] ${order.order_number} completion: ${allSucceeded ? "FULL" : "PARTIAL"}`);
  console.log(`[Order] Notes: ${notes.join(" | ")}`);

  const notesAfterFulfillment = notes.length;

  // 7. Award loyalty points if customer has an account
  try {
    const loyaltyUser = await db.findUserByEmail(order.customer_email);
    if (loyaltyUser) {
      const orderCurrency = order.currency || "SEK";
      const pointsToAward = orderCurrency === "EUR"
        ? Math.round(order.total_amount * 11)
        : order.total_amount;
      const result = await db.addLoyaltyPoints(loyaltyUser.id, pointsToAward);
      if (result) {
        notes.push(`Lojalitetspoäng: +${pointsToAward} (${result.tier})`);
        console.log(`[Loyalty] ${order.customer_email}: +${pointsToAward} pts → ${result.loyaltyPoints} total (${result.tier})`);
      }
    }
  } catch (err) {
    notes.push(`Lojalitetspoäng FEL: ${err.message}`);
    console.error("[Order] Loyalty points error:", err);
  }

  // 7b. Create subscriptions for subscription items
  try {
    const subItems = items.filter(i => i.subscription || i.intervalDays);
    if (subItems.length > 0) {
      const subUser = await db.findUserByEmail(order.customer_email);
      if (subUser) {
        for (const item of subItems) {
          const intervalDays = item.intervalDays || item.subscription?.intervalDays || 30;
          const product = PRODUCTS_MAP[item.articleNumber] || PRODUCTS_MAP[item.id];
          const originalPrice = item.price || (product ? (order.currency === "EUR" ? product.priceEUR : product.price) : 0);
          const discountPercent = 15;
          const recurringPrice = Math.round(originalPrice * (1 - discountPercent / 100));

          const existingSubs = await db.findSubscriptionsByUser(subUser.id);
          const alreadyExists = existingSubs.some(s =>
            s.product_id === (item.articleNumber || item.id) &&
            s.status === "active"
          );

          if (!alreadyExists) {
            await db.createSubscription({
              userId: subUser.id,
              productId: item.articleNumber || item.id,
              productName: item.name || (product ? product.name : "Produkt"),
              quantity: item.quantity || 1,
              intervalDays,
              discountPercent,
              originalPrice,
              recurringPrice,
              vivaInitialOrderCode: order.viva_order_code || null,
            });
            notes.push(`Prenumeration skapad: ${item.name || item.articleNumber} (var ${intervalDays}:e dag)`);
            console.log(`[Subscription] Created for ${order.customer_email}: ${item.articleNumber || item.id} every ${intervalDays} days`);
          }
        }
      } else {
        notes.push("Prenumeration ej skapad: inget konto kopplat");
        console.warn(`[Subscription] No user account for ${order.customer_email} — subscription items not saved`);
      }
    }
  } catch (err) {
    notes.push(`Prenumeration FEL: ${err.message}`);
    console.error("[Order] Subscription creation error:", err);
  }

  // 8. Send confirmation email (kräver RESEND_API_KEY + verifierad avsändardomän i Resend)
  try {
    const emailResult = await sendOrderConfirmation(order, items);
    if (emailResult.sent) {
      notes.push("Bekräftelsemail skickat (Resend)");
    } else if (emailResult.skipReason === "no_api_key") {
      notes.push("Bekräftelsemail ej skickat: RESEND_API_KEY saknas i backend");
      console.warn(`[Order] ${order.order_number}: ingen orderbekräftelse via Resend – sätt RESEND_API_KEY`);
    } else {
      notes.push("Bekräftelsemail ej skickat (se logg)");
    }
  } catch (err) {
    notes.push(`Email FEL: ${err.message}`);
    console.error("[Order] Email error:", err);
  }

  // 9. Trigger post-purchase automation + mark abandoned cart as recovered
  try {
    const purchaseFlows = await db.findFlowByTrigger("purchase");
    if (purchaseFlows.length > 0) {
      let subscriber = await db.findSubscriberByEmail(order.customer_email);
      if (!subscriber) {
        const token = crypto.randomBytes(32).toString("hex");
        subscriber = await db.createSubscriber({
          email: order.customer_email,
          firstName: order.customer_name?.split(" ")[0] || "",
          source: "purchase",
          unsubscribeToken: token
        });
      }
      for (const flow of purchaseFlows) {
        await db.enqueueAutomation({
          subscriberId: subscriber.id, flowId: flow.id,
          context: { firstName: subscriber.first_name, orderNumber: order.order_number },
          nextSendAt: new Date(Date.now() + (flow.steps?.[0]?.delay_hours || 24) * 3600000)
        });
      }
      notes.push("Post-purchase automation triggered");
    }
    await db.markCartRecovered(order.customer_email);
  } catch (err) {
    console.error("[Order] Automation trigger error:", err.message);
  }

  if (notes.length > notesAfterFulfillment) {
    await db.appendNotes(order.id, notes.slice(notesAfterFulfillment).join(" | "));
  }

  return { fortnoxInvoiceNumber, ongoingOrderId, notes };
}

// ---- ORDER CONFIRMATION EMAIL ----

/** @returns {{ sent: boolean, skipReason?: string }} */
async function sendOrderConfirmation(order, items) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not set – order confirmation email is NOT sent");
    return { sent: false, skipReason: "no_api_key" };
  }

  const { Resend } = require("resend");
  const resend = new Resend(apiKey);
  const fromEmail = process.env.EMAIL_FROM || "order@1753skin.com";
  const baseUrl = process.env.FRONTEND_URL || "https://www.1753skin.com";
  const currency = order.currency || "SEK";
  const isSEK = currency === "SEK";
  const fmt = (amount) => isSEK ? `${Math.round(amount).toLocaleString("sv-SE")} kr` : `€${Number(amount).toFixed(2)}`;
  const en = (order.locale || "sv") === "en";
  const localePath = en ? "en" : "sv";

  const hasSubscription = items.some(i => i.subscription || i.intervalDays);
  const firstName = (order.customer_name || "").split(" ")[0] || (en ? "there" : "du");

  const itemRows = items.map(i => {
    const isSubItem = i.subscription || i.intervalDays;
    const intervalDays = i.subscription?.intervalDays || i.intervalDays;
    const subBadge = isSubItem
      ? `<br><span style="display:inline-block;margin-top:4px;background:#108474;color:#fff;font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px">${en ? `Subscription every ${intervalDays} days` : `Prenumeration var ${intervalDays}:e dag`}</span>`
      : "";
    return `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #eee">${i.name}${subBadge}</td>
      <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right">${fmt(i.price * i.quantity)}</td>
    </tr>`;
  }).join("");

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = order.shipping_cost || 0;
  const totalAmount = order.total_amount || subtotal;
  const discountAmount = subtotal > totalAmount ? subtotal - totalAmount : 0;

  const summaryRows = [];
  summaryRows.push(`<tr><td style="padding:4px 0;color:#515151">${en ? "Subtotal" : "Delsumma"}</td><td style="padding:4px 0;text-align:right">${fmt(subtotal)}</td></tr>`);
  if (discountAmount > 0) {
    summaryRows.push(`<tr><td style="padding:4px 0;color:#108474">${en ? "Discount" : "Rabatt"}</td><td style="padding:4px 0;text-align:right;color:#108474">-${fmt(discountAmount)}</td></tr>`);
  }
  summaryRows.push(`<tr><td style="padding:4px 0;color:#515151">${en ? "Shipping" : "Frakt"}</td><td style="padding:4px 0;text-align:right">${shippingCost > 0 ? fmt(shippingCost) : (en ? "Free shipping" : "Fri frakt")}</td></tr>`);
  summaryRows.push(`<tr><td style="padding:8px 0 0;font-weight:700;font-size:16px;border-top:2px solid #1d1d1f">${en ? "Total" : "Totalt"}</td><td style="padding:8px 0 0;text-align:right;font-weight:700;font-size:16px;border-top:2px solid #1d1d1f">${fmt(totalAmount + shippingCost)}</td></tr>`);

  const subscriptionBlock = hasSubscription ? `
    <div style="background:#108474;border-radius:12px;padding:20px 24px;margin:24px 0;color:#fff">
      <p style="margin:0;font-size:15px;font-weight:700">${en ? "Your subscription is active" : "Din prenumeration är aktiverad"}</p>
      <p style="margin:8px 0 0;font-size:13px;line-height:1.6;opacity:0.9">
        ${en
          ? "Your next delivery will be sent automatically at your chosen interval with a 15% discount. You can pause, change or cancel anytime from My Account."
          : "Nästa leverans skickas automatiskt enligt ditt valda intervall med 15% rabatt. Du kan när som helst pausa, ändra intervall eller avbryta via Mitt konto."}
      </p>
      <a href="${baseUrl}/${localePath}/mitt-konto" style="display:inline-block;margin-top:14px;background:#fff;color:#108474;padding:10px 24px;border-radius:980px;font-size:13px;font-weight:600;text-decoration:none">
        ${en ? "Manage subscription" : "Hantera prenumeration"} →
      </a>
    </div>
  ` : "";

  const accountBlock = order.user_id ? `
    <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0;text-align:center">
      <p style="margin:0;font-size:13px;color:#766a62">${en ? "Your account" : "Ditt konto"}</p>
      <p style="margin:6px 0 0;font-size:14px;line-height:1.6;color:#515151">
        ${en
          ? "Sign in to My Account to track your order, view delivery status and manage your settings."
          : "Logga in på Mitt konto för att följa din order, se leveransstatus och hantera dina inställningar."}
      </p>
      <a href="${baseUrl}/${localePath}/mitt-konto" style="display:inline-block;margin-top:12px;background:#1d1d1f;color:#fff;padding:10px 28px;border-radius:980px;font-size:13px;font-weight:600;text-decoration:none">
        ${en ? "My Account" : "Mitt konto"}
      </a>
    </div>
  ` : "";

  const subject = hasSubscription
    ? (en ? `Order confirmation & subscription – ${order.order_number}` : `Orderbekräftelse & prenumeration – ${order.order_number}`)
    : (en ? `Order confirmation – ${order.order_number}` : `Orderbekräftelse – ${order.order_number}`);

  const { data: sendResult, error: sendError } = await resend.emails.send({
    from: fromEmail,
    to: order.customer_email,
    replyTo: "info@1753skin.com",
    subject,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1d1d1f;padding:0 16px">
        <div style="text-align:center;padding:32px 0 8px">
          <img src="https://www.1753skin.com/1753.webp" alt="1753 SKINCARE" width="48" height="48" style="border-radius:12px"/>
        </div>
        <div style="text-align:center;padding:16px 0 24px">
          <h1 style="font-size:24px;font-weight:700;margin:0;letter-spacing:-0.02em">${en ? "Thank you for your order!" : "Tack för din beställning!"}</h1>
        </div>
        <p style="font-size:15px;line-height:1.7;color:#515151">
          ${en
            ? `Hi ${firstName}, we have received your payment and your order is now being processed. You will receive a separate email with tracking information once your order has shipped.`
            : `Hej ${firstName}, vi har mottagit din betalning och din order behandlas nu. Du får ett separat mejl med spårningsinformation när din order skickats.`}
        </p>
        <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0">
          <p style="margin:0;font-size:13px;color:#766a62">${en ? "Order number" : "Ordernummer"}</p>
          <p style="margin:4px 0 0;font-size:17px;font-weight:600">${order.order_number}</p>
        </div>
        ${subscriptionBlock}
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:20px 0">
          <thead>
            <tr style="border-bottom:2px solid #1d1d1f">
              <th style="text-align:left;padding:8px 0;font-weight:600">${en ? "Product" : "Produkt"}</th>
              <th style="text-align:center;padding:8px 0;font-weight:600">${en ? "Qty" : "Antal"}</th>
              <th style="text-align:right;padding:8px 0;font-weight:600">${en ? "Price" : "Pris"}</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 20px">
          ${summaryRows.join("")}
        </table>
        <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0">
          <p style="margin:0;font-size:13px;color:#766a62">${en ? "Delivery address" : "Leveransadress"}</p>
          <p style="margin:4px 0 0;font-size:14px">${order.customer_name}<br>${order.address}<br>${order.zip} ${order.city}</p>
        </div>
        ${accountBlock}
        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e6e6e6;text-align:center">
          <p style="font-size:13px;color:#766a62;line-height:1.6;margin:0">
            ${en
              ? `Questions? Reply to this email or contact us at`
              : `Har du frågor? Svara på detta mejl eller kontakta oss på`}
            <a href="mailto:info@1753skin.com" style="color:#108474">info@1753skin.com</a>
          </p>
          <p style="font-size:12px;color:#766a62;line-height:1.6;margin:16px 0 0">
            ${en
              ? "1753 SKINCARE – Holistic skincare with CBD and CBG"
              : "1753 SKINCARE – Holistisk hudvård med CBD och CBG"}<br>
            <a href="https://www.1753skin.com" style="color:#108474">www.1753skin.com</a>
          </p>
        </div>
      </div>
    `
  });

  if (sendError) {
    console.error(`[Email] Resend API error for ${order.customer_email}:`, JSON.stringify(sendError));
    throw new Error(`Resend: ${sendError.message || JSON.stringify(sendError)}`);
  }

  console.log(`[Email] Order confirmation sent to ${order.customer_email} (id: ${sendResult?.id}) for ${order.order_number} [${order.locale || "sv"}]${hasSubscription ? " (subscription)" : ""}`);

  try {
    const sub = await db.findSubscriberByEmail(order.customer_email);
    if (sub) await db.touchSubscriberEmailed(sub.id);
  } catch (_) { /* non-critical */ }

  return { sent: true };
}

// ---- SHIPPING CONFIRMATION EMAIL ----

async function sendShippingConfirmation(order, items, trackingNumber, trackingUrl) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, skipReason: "no_api_key" };

  const { Resend } = require("resend");
  const resend = new Resend(apiKey);
  const fromEmail = process.env.EMAIL_FROM || "order@1753skin.com";
  const baseUrl = process.env.FRONTEND_URL || "https://www.1753skin.com";
  const en = (order.locale || "sv") === "en";
  const localePath = en ? "en" : "sv";
  const currency = order.currency || "SEK";
  const isSEK = currency === "SEK";
  const fmt = (amount) => isSEK ? `${Math.round(amount).toLocaleString("sv-SE")} kr` : `€${Number(amount).toFixed(2)}`;
  const firstName = (order.customer_name || "").split(" ")[0] || (en ? "there" : "du");

  const itemRows = items.map(i => `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #eee">${i.name}</td>
    <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
    <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${fmt(i.price * i.quantity)}</td>
  </tr>`).join("");

  const trackingBlock = trackingNumber ? `
    <div style="background:#108474;border-radius:12px;padding:20px 24px;margin:24px 0;color:#fff;text-align:center">
      <p style="margin:0;font-size:13px;opacity:0.9">${en ? "Tracking number" : "Spårningsnummer"}</p>
      <p style="margin:8px 0 0;font-size:20px;font-weight:700;letter-spacing:0.5px">${trackingNumber}</p>
      ${trackingUrl ? `<a href="${trackingUrl}" style="display:inline-block;margin-top:14px;background:#fff;color:#108474;padding:10px 24px;border-radius:980px;font-size:13px;font-weight:600;text-decoration:none">
        ${en ? "Track your package" : "Spåra ditt paket"} →
      </a>` : ""}
    </div>
  ` : `
    <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0;text-align:center">
      <p style="margin:0;font-size:14px;color:#515151">
        ${en ? "Tracking information will be available shortly." : "Spårningsinformation blir tillgänglig inom kort."}
      </p>
    </div>
  `;

  const subject = en
    ? `Your order is on its way! – ${order.order_number}`
    : `Din order är på väg! – ${order.order_number}`;

  const { data: sendResult, error: sendError } = await resend.emails.send({
    from: fromEmail,
    to: order.customer_email,
    replyTo: "info@1753skin.com",
    subject,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1d1d1f;padding:0 16px">
        <div style="text-align:center;padding:32px 0 8px">
          <img src="https://www.1753skin.com/1753.webp" alt="1753 SKINCARE" width="48" height="48" style="border-radius:12px"/>
        </div>
        <div style="text-align:center;padding:16px 0 24px">
          <h1 style="font-size:24px;font-weight:700;margin:0;letter-spacing:-0.02em">${en ? "Your order is on its way!" : "Din order är på väg!"}</h1>
        </div>
        <p style="font-size:15px;line-height:1.7;color:#515151">
          ${en
            ? `Hi ${firstName}, great news! Your order has been packed and shipped. ${trackingNumber ? "You can track your package using the link below." : "We'll send tracking details as soon as they're available."}`
            : `Hej ${firstName}, goda nyheter! Din order har packats och skickats. ${trackingNumber ? "Du kan spåra ditt paket via länken nedan." : "Vi skickar spårningsdetaljer så snart de finns tillgängliga."}`}
        </p>
        <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0">
          <p style="margin:0;font-size:13px;color:#766a62">${en ? "Order number" : "Ordernummer"}</p>
          <p style="margin:4px 0 0;font-size:17px;font-weight:600">${order.order_number}</p>
        </div>
        ${trackingBlock}
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:20px 0">
          <thead>
            <tr style="border-bottom:2px solid #1d1d1f">
              <th style="text-align:left;padding:8px 0;font-weight:600">${en ? "Product" : "Produkt"}</th>
              <th style="text-align:center;padding:8px 0;font-weight:600">${en ? "Qty" : "Antal"}</th>
              <th style="text-align:right;padding:8px 0;font-weight:600">${en ? "Price" : "Pris"}</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0">
          <p style="margin:0;font-size:13px;color:#766a62">${en ? "Delivery address" : "Leveransadress"}</p>
          <p style="margin:4px 0 0;font-size:14px">${order.customer_name}<br>${order.address}<br>${order.zip} ${order.city}</p>
        </div>
        ${order.user_id ? `
        <div style="text-align:center;margin:20px 0">
          <a href="${baseUrl}/${localePath}/mitt-konto" style="display:inline-block;background:#1d1d1f;color:#fff;padding:12px 32px;border-radius:980px;font-size:14px;font-weight:600;text-decoration:none">
            ${en ? "My Account" : "Mitt konto"}
          </a>
        </div>` : ""}
        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e6e6e6;text-align:center">
          <p style="font-size:13px;color:#766a62;line-height:1.6;margin:0">
            ${en ? "Questions? Reply to this email or contact us at" : "Har du frågor? Svara på detta mejl eller kontakta oss på"}
            <a href="mailto:info@1753skin.com" style="color:#108474">info@1753skin.com</a>
          </p>
          <p style="font-size:12px;color:#766a62;line-height:1.6;margin:16px 0 0">
            ${en ? "1753 SKINCARE – Holistic skincare with CBD and CBG" : "1753 SKINCARE – Holistisk hudvård med CBD och CBG"}<br>
            <a href="https://www.1753skin.com" style="color:#108474">www.1753skin.com</a>
          </p>
        </div>
      </div>
    `
  });

  if (sendError) {
    console.error(`[Email] Shipping email error for ${order.customer_email}:`, JSON.stringify(sendError));
    throw new Error(`Resend: ${sendError.message || JSON.stringify(sendError)}`);
  }

  console.log(`[Email] Shipping confirmation sent to ${order.customer_email} (id: ${sendResult?.id}) for ${order.order_number} [${order.locale || "sv"}]`);

  try {
    const sub = await db.findSubscriberByEmail(order.customer_email);
    if (sub) await db.touchSubscriberEmailed(sub.id);
  } catch (_) { /* non-critical */ }

  return { sent: true };
}

// ---- SUBSCRIPTION CHANGE EMAIL ----

async function sendSubscriptionChangeEmail(sub, action, details) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, skipReason: "no_api_key" };

  const { Resend } = require("resend");
  const resend = new Resend(apiKey);
  const fromEmail = process.env.EMAIL_FROM || "order@1753skin.com";
  const baseUrl = process.env.FRONTEND_URL || "https://www.1753skin.com";

  const email = sub.customer_email;
  if (!email) return { sent: false, skipReason: "no_email" };

  const user = sub.user_id ? await db.findUserById(sub.user_id) : null;
  const locale = user?.locale || "sv";
  const en = locale === "en";
  const localePath = en ? "en" : "sv";
  const firstName = (user?.name || sub.customer_name || "").split(" ")[0] || (en ? "there" : "du");

  const actionTexts = {
    paused: {
      subject: en ? "Your subscription has been paused" : "Din prenumeration är pausad",
      heading: en ? "Subscription paused" : "Prenumeration pausad",
      body: en
        ? `Hi ${firstName}, your subscription for <strong>${sub.product_name}</strong> has been paused. You won't be charged until you resume it. You can resume at any time from My Account.`
        : `Hej ${firstName}, din prenumeration på <strong>${sub.product_name}</strong> har pausats. Du debiteras inte förrän du återupptar den. Du kan återuppta den när som helst via Mitt konto.`,
    },
    resumed: {
      subject: en ? "Your subscription is active again" : "Din prenumeration är aktiv igen",
      heading: en ? "Subscription resumed" : "Prenumeration återupptagen",
      body: en
        ? `Hi ${firstName}, your subscription for <strong>${sub.product_name}</strong> is active again. Your next delivery is scheduled for <strong>${details?.nextCharge || "soon"}</strong>.`
        : `Hej ${firstName}, din prenumeration på <strong>${sub.product_name}</strong> är aktiv igen. Nästa leverans är planerad till <strong>${details?.nextCharge || "snart"}</strong>.`,
    },
    cancelled: {
      subject: en ? "Your subscription has been cancelled" : "Din prenumeration är avbruten",
      heading: en ? "Subscription cancelled" : "Prenumeration avbruten",
      body: en
        ? `Hi ${firstName}, your subscription for <strong>${sub.product_name}</strong> has been cancelled. You won't be charged again. We're sorry to see you go — you can always start a new subscription from our product pages.`
        : `Hej ${firstName}, din prenumeration på <strong>${sub.product_name}</strong> har avbrutits. Du kommer inte debiteras igen. Vi hoppas att du kommer tillbaka — du kan alltid starta en ny prenumeration via våra produktsidor.`,
    },
    updated: {
      subject: en ? "Your subscription has been updated" : "Din prenumeration har uppdaterats",
      heading: en ? "Subscription updated" : "Prenumeration uppdaterad",
      body: en
        ? `Hi ${firstName}, your subscription for <strong>${sub.product_name}</strong> has been updated.${details?.intervalDays ? ` New delivery interval: every <strong>${details.intervalDays} days</strong>.` : ""}${details?.quantity ? ` New quantity: <strong>${details.quantity}</strong>.` : ""}`
        : `Hej ${firstName}, din prenumeration på <strong>${sub.product_name}</strong> har uppdaterats.${details?.intervalDays ? ` Nytt leveransintervall: var <strong>${details.intervalDays}:e dag</strong>.` : ""}${details?.quantity ? ` Ny mängd: <strong>${details.quantity}</strong>.` : ""}`,
    },
  };

  const t = actionTexts[action];
  if (!t) return { sent: false, skipReason: "unknown_action" };

  const { data: sendResult, error: sendError } = await resend.emails.send({
    from: fromEmail,
    to: email,
    replyTo: "info@1753skin.com",
    subject: t.subject,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1d1d1f;padding:0 16px">
        <div style="text-align:center;padding:32px 0 8px">
          <img src="https://www.1753skin.com/1753.webp" alt="1753 SKINCARE" width="48" height="48" style="border-radius:12px"/>
        </div>
        <div style="text-align:center;padding:16px 0 24px">
          <h1 style="font-size:24px;font-weight:700;margin:0;letter-spacing:-0.02em">${t.heading}</h1>
        </div>
        <p style="font-size:15px;line-height:1.7;color:#515151">${t.body}</p>
        <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:24px 0">
          <p style="margin:0;font-size:13px;color:#766a62">${en ? "Product" : "Produkt"}</p>
          <p style="margin:4px 0 0;font-size:15px;font-weight:600">${sub.product_name}</p>
        </div>
        <div style="text-align:center;margin:28px 0">
          <a href="${baseUrl}/${localePath}/mitt-konto"
             style="display:inline-block;padding:14px 32px;background:#1d1d1f;color:#fff;font-size:15px;font-weight:600;border-radius:980px;text-decoration:none">
            ${en ? "My Account" : "Mitt konto"}
          </a>
        </div>
        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e6e6e6;text-align:center">
          <p style="font-size:13px;color:#766a62;line-height:1.6;margin:0">
            ${en ? "Questions? Reply to this email or contact us at" : "Har du frågor? Svara på detta mejl eller kontakta oss på"}
            <a href="mailto:info@1753skin.com" style="color:#108474">info@1753skin.com</a>
          </p>
          <p style="font-size:12px;color:#766a62;line-height:1.6;margin:16px 0 0">
            ${en ? "1753 SKINCARE – Holistic skincare with CBD and CBG" : "1753 SKINCARE – Holistisk hudvård med CBD och CBG"}<br>
            <a href="https://www.1753skin.com" style="color:#108474">www.1753skin.com</a>
          </p>
        </div>
      </div>
    `
  });

  if (sendError) {
    console.error(`[Email] Subscription change error for ${email}:`, JSON.stringify(sendError));
    return { sent: false, error: sendError.message };
  }

  console.log(`[Email] Subscription ${action} email sent to ${email} (id: ${sendResult?.id})`);
  return { sent: true };
}

// ---- PASSWORD SETUP EMAIL ----

async function sendPasswordSetupEmail(email, name, resetToken) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not set – password setup email NOT sent");
    return { sent: false, skipReason: "no_api_key" };
  }

  const { Resend } = require("resend");
  const resend = new Resend(apiKey);
  const fromEmail = process.env.EMAIL_FROM || "noreply@1753skin.com";
  const baseUrl = process.env.FRONTEND_URL || "https://www.1753skin.com";
  const resetUrl = `${baseUrl}/sv/valj-losenord?token=${resetToken}`;
  const firstName = (name || "").split(" ")[0] || "du";

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Välkommen till 1753 SKINCARE – Välj ditt lösenord",
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1d1d1f;padding:0 16px">
        <div style="text-align:center;padding:32px 0 8px">
          <img src="https://www.1753skin.com/1753.webp" alt="1753 SKINCARE" width="48" height="48" style="border-radius:12px"/>
        </div>
        <div style="text-align:center;padding:16px 0 24px">
          <h1 style="font-size:24px;font-weight:700;margin:0;letter-spacing:-0.02em">Välkommen, ${firstName}!</h1>
        </div>
        <p style="font-size:15px;line-height:1.7;color:#515151">
          Vi har skapat ett konto åt dig i vårt lojalitetsprogram. Du tjänar poäng på varje köp
          och får tillgång till exklusiva förmåner och rabatter.
        </p>
        <p style="font-size:15px;line-height:1.7;color:#515151">
          Klicka på knappen nedan för att välja ditt lösenord och aktivera ditt konto:
        </p>
        <div style="text-align:center;margin:28px 0">
          <a href="${resetUrl}"
             style="display:inline-block;padding:14px 32px;background:#108474;color:#fff;font-size:15px;font-weight:600;border-radius:980px;text-decoration:none">
            Välj lösenord
          </a>
        </div>
        <p style="font-size:13px;color:#766a62;line-height:1.7">
          Länken är giltig i 72 timmar. Om den har gått ut kan du alltid begära en ny
          via inloggningssidan.
        </p>
        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e6e6e6;text-align:center">
          <p style="font-size:12px;color:#766a62;line-height:1.6;margin:0">
            1753 SKINCARE – Holistisk hudvård med CBD och CBG<br>
            <a href="https://www.1753skin.com" style="color:#108474">www.1753skin.com</a>
          </p>
        </div>
      </div>
    `
  });

  console.log(`[Email] Password setup email sent to ${email}`);
  return { sent: true };
}

// ---- AI EMAIL ASSISTANT ----

const EMAIL_AI_MODEL = "gpt-5.4";

const EMAIL_SYSTEM_PROMPT = `Du är 1753 SKINCAREs kundtjänst-assistent. Du skriver mejlsvar åt teamet.

DITT UPPDRAG:
- Skriv ett vänligt, personligt och professionellt mejlsvar på kundens meddelande
- Svara på det språk kunden skriver (svenska eller engelska)
- Tonen: varm, ärlig, lite rebellisk men alltid hjälpsam. Aldrig korporativ eller klinisk
- Använd ALDRIG emojis
- Signera alltid med:

Varma hälsningar,
Christopher & teamet
1753 SKINCARE
info@1753skin.com | 0732-30 55 21

KUNSKAP:
- 1753 SKINCARE är ett svenskt familjeföretag grundat av Christopher och Ebba Genberg
- Adress: Södra Skjutbanevägen 10, 439 55 Åsa
- Fri frakt (0 kr)
- Produkter: CBD/CBG-baserad hudvård (ansiktsoljor, serum, makeup remover, svamptillskott)
- Prenumeration ger 15% rabatt
- Vi har AI-driven hudanalys på sajten (gratis)
- Hemsida: www.1753skin.com

PRODUKTER:
1. DUO-kit + TA-DA Serum (1 495 kr) – The ONE + I LOVE ansiktsoljor + TA-DA Serum
2. TA-DA Serum (699 kr, 30 ml) – CBG 3% i ekologisk jojobaolja
3. DUO-kit (1 099 kr) – The ONE (10% CBD) + I LOVE (10% CBD, 5% CBG) ansiktsoljor
4. Au Naturel Makeup Remover (399 kr, 100 ml) – MCT-olja + CBD
5. Fungtastic Mushroom Extract (399 kr, 60 kapslar) – Chaga, Lion's Mane, Cordyceps, Reishi

REGLER:
- Om kunden frågar om specifik order: ange ordernummer och status om du har kontexten, annars be om ordernummer
- Ge aldrig medicinsk rådgivning
- Gör inga löften om resultat – formulera försiktigt ("många upplever", "de flesta märker skillnad")
- Om du saknar info för att svara korrekt: skriv ett vänligt svar som förklarar att teamet kollar upp det och återkommer
- Var generös med att hjälpa men aldrig säljig eller pushig`;

async function generateEmailDraft(customerEmail, customerName, subject, bodyText, customerContext) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return "";

  let contextBlock = "";
  if (customerContext) {
    if (customerContext.orders?.length) {
      contextBlock += `\n\nKUNDENS ORDERHISTORIK:\n${customerContext.orders.map(o => `- ${o.order_number}: ${o.status}, ${o.total_amount} kr (${new Date(o.created_at).toLocaleDateString("sv-SE")})`).join("\n")}`;
    }
    if (customerContext.subscriptions?.length) {
      contextBlock += `\n\nKUNDENS PRENUMERATIONER:\n${customerContext.subscriptions.map(s => `- ${s.product_name}: ${s.status}, var ${s.interval_days}:e dag, ${s.recurring_price} kr`).join("\n")}`;
    }
    if (customerContext.loyaltyPoints) {
      contextBlock += `\n\nLOJALITETSPOÄNG: ${customerContext.loyaltyPoints} (${customerContext.tier})`;
    }
  }

  const userMessage = `Skriv ett mejlsvar till denna kund:

Från: ${customerName} <${customerEmail}>
Ämne: ${subject}

Meddelande:
${bodyText}
${contextBlock}`;

  try {
    const res = await fetchWithRetry("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: EMAIL_AI_MODEL,
        instructions: EMAIL_SYSTEM_PROMPT,
        input: userMessage
      })
    });

    const data = await res.json();
    return extractOutputText(data) || "";
  } catch (err) {
    console.error("[EmailAI] GPT draft generation failed:", err.message);
    return "";
  }
}

async function fetchCustomerContext(email) {
  const context = {};
  try {
    const user = await db.findUserByEmail(email);
    if (user) {
      context.name = user.name;
      context.loyaltyPoints = user.loyalty_points;
      context.tier = user.tier;
      const orders = await db.findOrdersByEmail(email);
      if (orders?.length) context.orders = orders.slice(0, 10);
      const subs = await db.findSubscriptionsByUser(user.id);
      if (subs?.length) context.subscriptions = subs;
    }
  } catch (err) {
    console.error("[EmailAI] Context fetch error:", err.message);
  }
  return context;
}

async function sendAdminNotification(fromEmail, fromName, subject) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return;
    const { Resend } = require("resend");
    const resend = new Resend(apiKey);
    const fromAddr = process.env.EMAIL_FROM || "info@1753skin.com";

    await resend.emails.send({
      from: `1753 SKINCARE <${fromAddr}>`,
      to: "christopher@1753skin.com",
      subject: `Nytt kundmeddelande: ${subject}`,
      html: `
        <h3>Nytt inkommande meddelande</h3>
        <p><strong>Från:</strong> ${fromName || "Okänt"} &lt;${fromEmail}&gt;</p>
        <p><strong>Ämne:</strong> ${subject}</p>
        <p>Ett AI-genererat svarsutkast väntar på godkännande i <a href="https://www.1753skin.com/admin/inkorg">admin-panelen</a>.</p>
      `
    });
  } catch (err) {
    console.error("[EmailAI] Notification send failed:", err.message);
  }
}

// Resend Inbound Webhook – receives forwarded emails
app.post("/api/email/inbound", async (req, res) => {
  try {
    const payload = req.body;
    const fromEmail = payload.from || payload.From || "";
    const fromName = payload.from_name || payload.FromName || "";
    const subject = payload.subject || payload.Subject || "(inget ämne)";
    const bodyText = payload.text || payload.TextBody || payload.text_body || "";
    const bodyHtml = payload.html || payload.HtmlBody || payload.html_body || "";

    if (!fromEmail) {
      return res.status(400).json({ message: "No sender email" });
    }

    console.log(`[EmailAI] Inbound from ${fromEmail}: "${subject}"`);

    const customerContext = await fetchCustomerContext(fromEmail);
    const aiDraft = await generateEmailDraft(fromEmail, fromName, subject, bodyText, customerContext);

    const conversation = await db.createEmailConversation({
      fromEmail,
      fromName,
      subject,
      bodyText,
      bodyHtml,
      aiDraft,
      category: "general",
      customerContext
    });

    await sendAdminNotification(fromEmail, fromName, subject);

    console.log(`[EmailAI] Conversation #${conversation.id} created with AI draft`);
    res.json({ ok: true, id: conversation.id });
  } catch (err) {
    console.error("[EmailAI] Inbound error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Also hook into contact form → generate AI draft
app.post("/api/email/from-contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!email || !message) return res.status(400).json({ message: "Email and message required" });

    const customerContext = await fetchCustomerContext(email);
    const aiDraft = await generateEmailDraft(email, name, "Kontaktformulär", message, customerContext);

    const conversation = await db.createEmailConversation({
      fromEmail: email,
      fromName: name,
      subject: "Kontaktformulär",
      bodyText: message,
      aiDraft,
      category: "contact_form",
      customerContext
    });

    await sendAdminNotification(email, name, "Kontaktformulär");
    res.json({ ok: true, id: conversation.id });
  } catch (err) {
    console.error("[EmailAI] Contact form error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Admin: List email conversations
app.get("/api/admin/inbox", adminAuthMiddleware, async (req, res) => {
  try {
    const { status, page } = req.query;
    const data = await db.listEmailConversations({
      status: status || undefined,
      page: parseInt(page) || 1
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get single conversation
app.get("/api/admin/inbox/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const conv = await db.getEmailConversation(req.params.id);
    if (!conv) return res.status(404).json({ message: "Hittades inte" });
    res.json(conv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Regenerate AI draft
app.post("/api/admin/inbox/:id/regenerate", adminAuthMiddleware, async (req, res) => {
  try {
    const conv = await db.getEmailConversation(req.params.id);
    if (!conv) return res.status(404).json({ message: "Hittades inte" });

    const customerContext = await fetchCustomerContext(conv.from_email);
    const aiDraft = await generateEmailDraft(conv.from_email, conv.from_name, conv.subject, conv.body_text, customerContext);

    await db.updateEmailConversation(conv.id, { ai_draft: aiDraft });
    res.json({ ok: true, aiDraft });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Approve and send reply
app.post("/api/admin/inbox/:id/send", adminAuthMiddleware, async (req, res) => {
  try {
    const conv = await db.getEmailConversation(req.params.id);
    if (!conv) return res.status(404).json({ message: "Hittades inte" });

    const { reply } = req.body;
    if (!reply) return res.status(400).json({ message: "Svar krävs" });

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return res.status(500).json({ message: "RESEND_API_KEY saknas" });

    const { Resend } = require("resend");
    const resend = new Resend(apiKey);
    const fromAddr = process.env.EMAIL_FROM || "info@1753skin.com";

    await resend.emails.send({
      from: `1753 SKINCARE <${fromAddr}>`,
      to: conv.from_email,
      replyTo: "info@1753skin.com",
      subject: `Re: ${conv.subject}`,
      html: reply.replace(/\n/g, "<br>")
    });

    await db.updateEmailConversation(conv.id, {
      admin_reply: reply,
      status: "sent",
      sent_at: new Date().toISOString()
    });

    console.log(`[EmailAI] Reply sent to ${conv.from_email} for conversation #${conv.id}`);
    res.json({ ok: true });
  } catch (err) {
    console.error("[EmailAI] Send error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Admin: Dismiss/archive conversation
app.post("/api/admin/inbox/:id/dismiss", adminAuthMiddleware, async (req, res) => {
  try {
    await db.updateEmailConversation(req.params.id, { status: "dismissed" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- CONTACT FORM ----

app.post("/api/contact", async (req, res) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "contact", 5)) {
      return res.status(429).json({ message: "För många meddelanden. Försök igen om en stund." });
    }
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Alla fält krävs." });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[Contact] RESEND_API_KEY not set");
      return res.status(500).json({ message: "E-posttjänsten är inte konfigurerad." });
    }

    const { Resend } = require("resend");
    const resend = new Resend(apiKey);
    const fromEmail = process.env.EMAIL_FROM || "info@1753skin.com";

    await resend.emails.send({
      from: `1753 SKINCARE <${fromEmail}>`,
      to: "info@1753skin.com",
      replyTo: email,
      subject: `Kontaktformulär: ${name}`,
      html: `
        <h2>Nytt meddelande från kontaktformuläret</h2>
        <p><strong>Namn:</strong> ${name}</p>
        <p><strong>E-post:</strong> <a href="mailto:${email}">${email}</a></p>
        <hr />
        <p style="white-space:pre-wrap;">${message}</p>
      `
    });

    console.log(`[Contact] Message from ${email} (${name}) forwarded to info@1753skin.com`);

    // Generate AI draft in background
    (async () => {
      try {
        const customerContext = await fetchCustomerContext(email);
        const aiDraft = await generateEmailDraft(email, name, "Kontaktformulär", message, customerContext);
        await db.createEmailConversation({
          fromEmail: email, fromName: name, subject: "Kontaktformulär",
          bodyText: message, aiDraft, category: "contact_form", customerContext
        });
        await sendAdminNotification(email, name, "Kontaktformulär");
      } catch (err) { console.error("[Contact] AI draft error:", err.message); }
    })();

    res.json({ ok: true });
  } catch (err) {
    console.error("[Contact] Error:", err);
    res.status(500).json({ message: "Kunde inte skicka meddelandet. Försök igen." });
  }
});

// ---- PASSWORD RESET / SET ----

app.post("/api/auth/set-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: "Token och lösenord krävs" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Lösenordet måste vara minst 6 tecken" });
    }

    const { rows } = await db.pool.query(
      "SELECT * FROM users WHERE password_reset_token = $1 LIMIT 1",
      [token]
    );
    const user = rows[0];
    if (!user) {
      return res.status(400).json({ message: "Ogiltig eller utgången länk" });
    }
    if (user.password_reset_expires && new Date(user.password_reset_expires) < new Date()) {
      return res.status(400).json({ message: "Länken har gått ut. Begär en ny via inloggningssidan." });
    }

    const passwordHash = bcrypt ? await bcrypt.hash(password, 10) : password;
    await db.updateUser(user.id, {
      password_hash: passwordHash,
      password_reset_token: null,
      password_reset_expires: null
    });

    const authToken = generateToken(user);
    res.json({ token: authToken, message: "Lösenord sparat!" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Kunde inte spara lösenordet" });
  }
});

// ---- EMAIL TEMPLATES (shared style) ----

function emailWrapper(content, unsubscribeUrl) {
  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1d1d1f;padding:0 16px">
    <div style="text-align:center;padding:32px 0 8px">
      <img src="https://www.1753skin.com/1753.webp" alt="1753 SKINCARE" width="48" height="48" style="border-radius:12px"/>
    </div>
    ${content}
    <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e6e6e6;text-align:center">
      <p style="font-size:12px;color:#766a62;line-height:1.6;margin:0">
        1753 SKINCARE – Holistisk hudvård med CBD och CBG<br>
        <a href="https://www.1753skin.com" style="color:#108474">www.1753skin.com</a>
      </p>
      ${unsubscribeUrl ? `<p style="margin-top:12px;font-size:11px"><a href="${unsubscribeUrl}" style="color:#999;text-decoration:underline">Avprenumerera</a></p>` : ""}
    </div>
  </div>`;
}

function greenButton(text, href) {
  return `<div style="text-align:center;margin:28px 0">
    <a href="${href}" style="display:inline-block;background:#108474;color:#fff;padding:14px 32px;border-radius:980px;font-size:15px;font-weight:600;text-decoration:none">${text}</a>
  </div>`;
}

// ---- REVIEW AUTO-REPLY (GPT-5.4) ----

const REVIEW_REPLY_PROMPT = `Du skriver svar på kundrecensioner för 1753 SKINCARE. Du är Christopher.

REGLER:
- Skriv på svenska
- Korta svar (2-4 meningar)
- Personligt, varmt och kärleksfullt
- Nämn kundens namn (förnamnet)
- Referera gärna till produkten de recenserat
- Aldrig emojis
- Aldrig generiskt -- varje svar ska kännas unikt
- Aldrig "Vi uppskattar din feedback" eller liknande korporativa fraser
- Signera alltid med: / Christopher, 1753 SKINCARE

FÖR 4-5 STJÄRNOR:
- Uttryck genuin glädje och tacksamhet
- Lyft gärna något specifikt kunden nämnde
- Kort uppmuntran att fortsätta

FÖR 1-3 STJÄRNOR:
- Visa empati och förståelse
- Be om ursäkt om något gått fel
- Erbjud hjälp: "Hör av dig direkt till oss på info@1753skin.com eller 0732-30 55 21 så löser vi det"
- Var aldrig defensiv`;

async function generateReviewReply(reviewerName, rating, title, body, productName) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return "";

  const userMessage = `Skriv ett svar på denna recension:

Produkt: ${productName}
Kund: ${reviewerName}
Betyg: ${rating}/5
Rubrik: ${title || "(ingen)"}
Omdöme: ${body || "(inget)"}`;

  try {
    const res = await fetchWithRetry("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: EMAIL_AI_MODEL,
        instructions: REVIEW_REPLY_PROMPT,
        input: userMessage
      })
    });
    const data = await res.json();
    return extractOutputText(data) || "";
  } catch (err) {
    console.error("[ReviewAI] GPT generation failed:", err.message);
    return "";
  }
}

async function translateReviewToAllLanguages(reviewId) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return;

  try {
    const { rows } = await db.pool.query(
      "SELECT id, title, body, reply FROM reviews WHERE id = $1",
      [reviewId]
    );
    if (!rows.length) return;
    const r = rows[0];
    if (!r.title && !r.body && !r.reply) return;

    const resp = await fetchWithRetry("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `Translate this Swedish skincare review into English, Spanish, German, and French.
Keep reviewer tone. Brand names stay as-is: 1753 SKINCARE, The ONE, I LOVE, TA-DA, DUO, Au Naturel, Fungtastic.
Swedish place names stay unchanged. Empty fields return "".
Return JSON: {"title_en":"...","body_en":"...","reply_en":"...","title_es":"...","body_es":"...","reply_es":"...","title_de":"...","body_de":"...","reply_de":"...","title_fr":"...","body_fr":"...","reply_fr":"..."}`
          },
          {
            role: "user",
            content: JSON.stringify({ title: r.title || "", body: r.body || "", reply: r.reply || "" }),
          },
        ],
      }),
    });

    if (!resp.ok) {
      console.error(`[ReviewTranslate] API error ${resp.status} for review #${reviewId}`);
      return;
    }

    const data = await resp.json();
    const t = JSON.parse(data.choices[0].message.content);
    await db.updateReview(reviewId, {
      title_en: t.title_en || "", body_en: t.body_en || "", reply_en: t.reply_en || "",
      title_es: t.title_es || "", body_es: t.body_es || "", reply_es: t.reply_es || "",
      title_de: t.title_de || "", body_de: t.body_de || "", reply_de: t.reply_de || "",
      title_fr: t.title_fr || "", body_fr: t.body_fr || "", reply_fr: t.reply_fr || "",
    });
    console.log(`[ReviewTranslate] Review #${reviewId} translated to en/es/de/fr`);
  } catch (err) {
    console.error(`[ReviewTranslate] Failed for review #${reviewId}:`, err.message);
  }
}

async function processReviewReply(review, productName, reviewerName) {
  const rating = review.rating;
  const reply = await generateReviewReply(
    reviewerName, rating, review.title, review.body, productName
  );

  if (!reply) {
    console.warn(`[ReviewAI] No reply generated for review #${review.id}`);
    translateReviewToAllLanguages(review.id).catch(e => console.error("[ReviewTranslate]", e.message));
    return;
  }

  if (rating >= 4) {
    await db.updateReview(review.id, { reply });
    console.log(`[ReviewAI] Auto-replied to ${rating}-star review #${review.id} from ${reviewerName}`);
    translateReviewToAllLanguages(review.id).catch(e => console.error("[ReviewTranslate]", e.message));
  } else {
    await db.updateReview(review.id, { reply: `[UTKAST] ${reply}` });
    console.log(`[ReviewAI] Draft reply for ${rating}-star review #${review.id}, notifying admin`);
    translateReviewToAllLanguages(review.id).catch(e => console.error("[ReviewTranslate]", e.message));

    // Notify admin
    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey) {
        const { Resend } = require("resend");
        const resend = new Resend(apiKey);
        const fromAddr = process.env.EMAIL_FROM || "info@1753skin.com";
        await resend.emails.send({
          from: `1753 SKINCARE <${fromAddr}>`,
          to: "christopher@1753skin.com",
          subject: `Ny recension: ${rating} stjärnor från ${reviewerName}`,
          html: `
            <h3>Ny recension kräver ditt svar</h3>
            <p><strong>Produkt:</strong> ${productName}</p>
            <p><strong>Kund:</strong> ${reviewerName}</p>
            <p><strong>Betyg:</strong> ${"★".repeat(rating)}${"☆".repeat(5 - rating)}</p>
            ${review.title ? `<p><strong>Rubrik:</strong> ${review.title}</p>` : ""}
            <p><strong>Omdöme:</strong></p>
            <blockquote style="border-left:3px solid #108474;padding-left:12px;color:#515151;">${review.body || "(inget omdöme)"}</blockquote>
            <hr/>
            <p><strong>AI-förslag på svar:</strong></p>
            <blockquote style="border-left:3px solid #766a62;padding-left:12px;color:#1d1d1f;">${reply.replace(/\n/g, "<br>")}</blockquote>
            <p style="margin-top:16px;">
              <a href="https://www.1753skin.com/admin/recensioner" style="background:#108474;color:#fff;padding:10px 20px;border-radius:12px;text-decoration:none;font-weight:600;">
                Granska i admin
              </a>
            </p>
          `
        });
      }
    } catch (err) {
      console.error("[ReviewAI] Notification failed:", err.message);
    }
  }
}

// ---- REVIEWS API (public) ----

app.get("/api/reviews/stats/all", async (req, res) => {
  try { res.json(await db.getAllReviewStats()); }
  catch (err) { res.status(500).json({ message: "Kunde inte hämta statistik" }); }
});

app.get("/api/reviews/:productId", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const offset = parseInt(req.query.offset) || 0;
    const supportedLocales = ["sv", "en", "es", "de", "fr"];
    const locale = supportedLocales.includes(req.query.locale) ? req.query.locale : "sv";
    const [reviews, stats] = await Promise.all([
      db.findReviewsByProduct(req.params.productId, limit, offset, locale),
      db.getReviewStats(req.params.productId),
    ]);
    res.json({ reviews, stats });
  } catch (err) { res.status(500).json({ message: "Kunde inte hämta recensioner" }); }
});

app.get("/api/reviews/verify-token/:token", async (req, res) => {
  try {
    const decoded = require("jsonwebtoken").verify(req.params.token, JWT_SECRET);
    if (decoded.purpose !== "review") return res.status(400).json({ message: "Ogiltig token" });
    res.json({
      customerName: decoded.customerName,
      customerEmail: decoded.customerEmail,
      orderNumber: decoded.orderNumber,
      products: decoded.products,
    });
  } catch { res.status(400).json({ message: "Länken har gått ut eller är ogiltig" }); }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const { token, productId, rating, title, body } = req.body;
    if (!token || !productId || !rating) return res.status(400).json({ message: "Saknar obligatoriska fält" });
    let decoded;
    try {
      decoded = require("jsonwebtoken").verify(token, JWT_SECRET);
      if (decoded.purpose !== "review") throw new Error();
    } catch { return res.status(400).json({ message: "Länken har gått ut eller är ogiltig" }); }

    const existing = await db.pool.query(
      "SELECT id FROM reviews WHERE product_id = $1 AND reviewer_name = $2 AND rating = $3 AND body = $4 LIMIT 1",
      [productId, decoded.customerName, rating, body || ""]
    );
    if (existing.rows.length > 0) return res.status(409).json({ message: "Du har redan lämnat ett omdöme för denna produkt" });

    const parsedRating = Math.min(5, Math.max(1, parseInt(rating)));
    const review = await db.createReview({
      product_id: productId,
      reviewer_name: decoded.customerName,
      rating: parsedRating,
      title: title || "", body: body || "", reply: "",
      verified: true, review_date: new Date().toISOString(), location: "",
    });

    // Auto-reply for 4-5 stars, notify admin for 1-3 stars
    if (review) {
      const productName = PRODUCTS_MAP[productId]?.name || productId;
      processReviewReply(review, productName, decoded.customerName).catch(err =>
        console.error("[ReviewAI] Error:", err.message)
      );
    }

    res.json({ success: true, review });
  } catch (err) { res.status(500).json({ message: "Kunde inte spara omdömet" }); }
});

// ---- REVIEWS API (admin) ----

app.get("/api/admin/reviews", adminAuthMiddleware, async (req, res) => {
  try {
    const { limit, offset, productId, rating, search } = req.query;
    const data = await db.adminListReviews({
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0,
      productId: productId || undefined,
      rating: rating || undefined,
      search: search || undefined,
    });
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get("/api/admin/reviews/stats", adminAuthMiddleware, async (req, res) => {
  try {
    const [allStats, totalCount] = await Promise.all([
      db.getAllReviewStats(),
      db.countReviews(),
    ]);
    res.json({ totalCount, perProduct: allStats });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put("/api/admin/reviews/:id/reply", adminAuthMiddleware, async (req, res) => {
  try {
    const { reply } = req.body;
    const reviewId = parseInt(req.params.id);
    const updated = await db.updateReview(reviewId, { reply: reply || "" });
    if (!updated) return res.status(404).json({ message: "Recension hittades inte" });
    translateReviewToAllLanguages(reviewId).catch(e => console.error("[ReviewTranslate]", e.message));
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete("/api/admin/reviews/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const deleted = await db.deleteReview(parseInt(req.params.id));
    if (!deleted) return res.status(404).json({ message: "Recension hittades inte" });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ---- WISHLIST ROUTES ----

app.get("/api/wishlist", authMiddleware, async (req, res) => {
  try {
    const items = await db.getWishlist(req.user.id);
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post("/api/wishlist", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "productId krävs" });
    await db.addToWishlist(req.user.id, productId);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete("/api/wishlist/:productId", authMiddleware, async (req, res) => {
  try {
    await db.removeFromWishlist(req.user.id, req.params.productId);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ---- SKIN ANALYSIS SAVE/LIST ----

app.post("/api/skin-analyses", authMiddleware, async (req, res) => {
  try {
    const { score, summary, recommendations, fullResponse } = req.body;
    const result = await db.saveSkinAnalysis({
      userId: req.user.id,
      score,
      summary,
      recommendations,
      fullResponse,
    });
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get("/api/skin-analyses", authMiddleware, async (req, res) => {
  try {
    const analyses = await db.getSkinAnalyses(req.user.id);
    res.json(analyses);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ---- FACE SNAPSHOTS (encrypted photo storage) ----

app.post("/api/face-snapshots", authMiddleware, async (req, res) => {
  try {
    const { image, analysisId } = req.body;
    if (!image) return res.status(400).json({ message: "No image provided" });
    if (!process.env.FACE_ENCRYPTION_KEY) return res.status(503).json({ message: "Image storage not configured" });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    if (imageBuffer.length > 500_000) return res.status(413).json({ message: "Image too large (max 500 KB)" });

    const snapshot = await db.saveFaceSnapshot({
      userId: req.user.id,
      analysisId: analysisId || null,
      imageBuffer,
    });
    res.json(snapshot);
  } catch (err) {
    console.error("[FaceSnapshot] Save error:", err.message);
    res.status(500).json({ message: "Could not save image" });
  }
});

app.get("/api/face-snapshots", authMiddleware, async (req, res) => {
  try {
    const list = await db.listFaceSnapshots(req.user.id);
    res.json(list);
  } catch (err) { res.status(500).json({ message: "Could not load snapshots" }); }
});

app.get("/api/face-snapshots/:id/image", authMiddleware, async (req, res) => {
  try {
    const imageBuffer = await db.getFaceSnapshot(parseInt(req.params.id), req.user.id);
    if (!imageBuffer) return res.status(404).json({ message: "Not found" });
    res.set("Content-Type", "image/jpeg");
    res.set("Cache-Control", "private, max-age=3600");
    res.send(imageBuffer);
  } catch (err) {
    console.error("[FaceSnapshot] Decrypt error:", err.message);
    res.status(500).json({ message: "Could not load image" });
  }
});

app.delete("/api/face-snapshots/:id", authMiddleware, async (req, res) => {
  try {
    const ok = await db.deleteFaceSnapshot(parseInt(req.params.id), req.user.id);
    if (!ok) return res.status(404).json({ message: "Not found" });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: "Could not delete" }); }
});

app.delete("/api/face-snapshots", authMiddleware, async (req, res) => {
  try {
    const count = await db.deleteAllFaceSnapshots(req.user.id);
    res.json({ deleted: count });
  } catch (err) { res.status(500).json({ message: "Could not delete" }); }
});

// ---- ADDRESS ROUTES ----

app.get("/api/addresses", authMiddleware, async (req, res) => {
  try {
    const addresses = await db.getAddresses(req.user.id);
    res.json(addresses);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post("/api/addresses", authMiddleware, async (req, res) => {
  try {
    const { label, address, zip, city, isDefault } = req.body;
    if (!address || !zip || !city) return res.status(400).json({ message: "Adress, postnummer och stad krävs" });
    const result = await db.createAddress({ userId: req.user.id, label, address, zip, city, isDefault });
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put("/api/addresses/:id", authMiddleware, async (req, res) => {
  try {
    const fields = {};
    for (const key of ["label", "address", "zip", "city", "is_default"]) {
      if (req.body[key] !== undefined) fields[key] = req.body[key];
    }
    const result = await db.updateAddress(parseInt(req.params.id), req.user.id, fields);
    if (!result) return res.status(404).json({ message: "Adress hittades inte" });
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete("/api/addresses/:id", authMiddleware, async (req, res) => {
  try {
    const ok = await db.deleteAddress(parseInt(req.params.id), req.user.id);
    if (!ok) return res.status(404).json({ message: "Adress hittades inte" });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ---- LOYALTY ROUTES ----

app.post("/api/loyalty/redeem", authMiddleware, async (req, res) => {
  try {
    const { points } = req.body;
    const amount = parseInt(points);
    if (!amount || amount < 100) return res.status(400).json({ message: "Minst 100 poäng krävs" });
    if (amount % 100 !== 0) return res.status(400).json({ message: "Poäng måste vara i steg om 100" });

    const user = await db.findUserByEmail(req.user.email);
    if (!user || (user.loyalty_points || 0) < amount) {
      return res.status(400).json({ message: "Inte tillräckligt med poäng" });
    }

    const remaining = await db.deductLoyaltyPoints(user.id, amount);
    const discountKr = Math.round(amount / 10);
    const code = `LOYAL${discountKr}-${Date.now().toString(36).toUpperCase()}`;

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    await db.createDiscountCode({
      code,
      percent: 0,
      fixedAmount: discountKr,
      description: `Lojalitetsrabatt ${discountKr} kr (${amount} poäng)`,
      maxUses: 1,
      validUntil: validUntil.toISOString()
    });

    console.log(`[Loyalty] ${user.email} redeemed ${amount} pts → ${code} (${discountKr} kr off)`);
    res.json({ code, discountKr, remainingPoints: remaining });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ---- RECOMMENDATIONS ----

app.get("/api/recommendations", authMiddleware, async (req, res) => {
  try {
    const orders = await db.listOrders({ limit: 100, offset: 0 });
    const userOrders = orders.rows.filter(o => o.customer_email === req.user.email && o.payment_status === "paid");
    const boughtIds = new Set();
    for (const o of userOrders) {
      const items = typeof o.items === "string" ? JSON.parse(o.items) : (o.items || []);
      for (const item of items) boughtIds.add(item.id || item.articleNumber);
    }

    const allProducts = [
      { id: "duo-kit", name: "DUO-kit: The ONE + I LOVE", shortDesc: "Komplett ansiktsoljekit", price: 1098 },
      { id: "duo-ta-da", name: "DUO + TA-DA Serum", shortDesc: "Oljor + serum i ett paket", price: 1647 },
      { id: "ta-da-serum", name: "TA-DA Serum", shortDesc: "CBD/CBG-boostserum", price: 549 },
      { id: "au-naturel", name: "Au Naturel Makeup Remover", shortDesc: "Naturlig rengöring", price: 349 },
      { id: "lip-balm", name: "Le Baume Lip Balm", shortDesc: "Återfuktande läppbalsam", price: 149 },
    ];

    const recommendations = allProducts.filter(p => !boughtIds.has(p.id)).slice(0, 3);
    res.json(recommendations);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ---- NEWSLETTER / SUBSCRIBER ROUTES ----

app.post("/api/newsletter/subscribe", async (req, res) => {
  try {
    const { email, firstName, skinCondition } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Ange en giltig e-postadress" });
    }

    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "newsletter", 10)) {
      return res.status(429).json({ message: "For manga forsok. Vanta en stund." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const subscriber = await db.createSubscriber({
      email, firstName: firstName || "", source: "footer", unsubscribeToken: token
    });

    if (skinCondition) {
      await db.updateSubscriberSkinCondition(email, skinCondition);
    }

    // Enqueue welcome flow
    const welcomeFlows = await db.findFlowByTrigger("subscribe");
    for (const flow of welcomeFlows) {
      await db.enqueueAutomation({
        subscriberId: subscriber.id, flowId: flow.id,
        context: { firstName: subscriber.first_name },
        nextSendAt: new Date()
      });
    }

    console.log(`[Newsletter] ${email} subscribed (id=${subscriber.id}, skin=${skinCondition || "none"})`);
    res.json({ ok: true, message: "Tack! Du ar nu prenumerant." });
  } catch (err) {
    console.error("[Newsletter] Subscribe error:", err);
    res.status(500).json({ message: "Nagonting gick fel. Forsok igen." });
  }
});

app.post("/api/newsletter/tag-skin-condition", async (req, res) => {
  try {
    const { email, skinCondition } = req.body;
    if (!email || !skinCondition) {
      return res.status(400).json({ message: "email och skinCondition kravs" });
    }
    const updated = await db.updateSubscriberSkinCondition(email, skinCondition);
    if (!updated) {
      return res.status(404).json({ message: "Prenumerant hittades inte" });
    }
    console.log(`[Newsletter] Tagged ${email} with skin_condition=${skinCondition}`);
    res.json({ ok: true });
  } catch (err) {
    console.error("[Newsletter] Tag error:", err);
    res.status(500).json({ message: "Kunde inte uppdatera" });
  }
});

app.get("/api/newsletter/skin-segments", async (req, res) => {
  try {
    const adminKey = req.headers["x-admin-key"] || req.query.adminKey;
    const expectedKey = process.env.ADMIN_API_KEY || "1753-admin-key";
    if (adminKey !== expectedKey) {
      return res.status(403).json({ message: "Ogiltig admin-nyckel" });
    }
    const segments = await db.getSubscriberSkinSegments();
    const total = await db.findActiveSubscribers();
    const tagged = segments.reduce((sum, s) => sum + s.count, 0);
    res.json({ segments, totalActive: total.length, tagged, untagged: total.length - tagged });
  } catch (err) {
    console.error("[Newsletter] Segments error:", err);
    res.status(500).json({ message: "Fel" });
  }
});

app.get("/api/newsletter/status", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.json({ subscribed: false });
    const subscriber = await db.findSubscriberByEmail(email);
    res.json({ subscribed: !!(subscriber && subscriber.status === "active") });
  } catch (err) {
    console.error("[Newsletter] Status check error:", err);
    res.json({ subscribed: false });
  }
});

app.get("/api/newsletter/unsubscribe/:token", async (req, res) => {
  try {
    const subscriber = await db.unsubscribe(req.params.token);
    if (subscriber) {
      await db.cancelAutomationsForSubscriber(subscriber.id);
      console.log(`[Newsletter] ${subscriber.email} unsubscribed`);
    }
    res.redirect("https://www.1753skin.com/?unsubscribed=1");
  } catch (err) {
    console.error("[Newsletter] Unsubscribe error:", err);
    res.redirect("https://www.1753skin.com/");
  }
});

// ---- AUTOMATION EVENT ENDPOINT ----

app.post("/api/automation/event", async (req, res) => {
  try {
    const { event, email, context } = req.body;
    if (!event || !email) {
      return res.status(400).json({ message: "event och email kravs" });
    }

    let subscriber = await db.findSubscriberByEmail(email);
    if (!subscriber) {
      const token = crypto.randomBytes(32).toString("hex");
      subscriber = await db.createSubscriber({
        email, firstName: context?.firstName || "", source: event, unsubscribeToken: token
      });
    }

    if (subscriber.status !== "active") {
      return res.json({ ok: true, message: "Subscriber inactive, skipping" });
    }

    const flows = await db.findFlowByTrigger(event);
    for (const flow of flows) {
      await db.enqueueAutomation({
        subscriberId: subscriber.id, flowId: flow.id,
        context: context || {},
        nextSendAt: new Date()
      });
    }

    // Handle cart_abandoned specifically
    if (event === "cart_abandoned" && context?.items) {
      await db.createAbandonedCart({ email, items: context.items });
    }

    // Mark cart as recovered on purchase
    if (event === "purchase") {
      await db.markCartRecovered(email);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("[Automation] Event error:", err);
    res.status(500).json({ message: "Fel vid event-hantering" });
  }
});

// ---- AUTOMATION ENGINE (processes queued emails) ----

async function processAutomationQueue() {
  try {
    const due = await db.findDueAutomations();
    if (due.length === 0) return;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log("[Automation] RESEND_API_KEY not set, skipping");
      return;
    }

    const { Resend } = require("resend");
    const resend = new Resend(apiKey);
    const fromEmail = process.env.EMAIL_FROM || "info@1753skin.com";

    for (const item of due) {
      try {
        if (item.subscriber_status !== "active") {
          await db.advanceAutomation(item.id, { nextStep: item.current_step });
          continue;
        }

        const steps = typeof item.steps === "string" ? JSON.parse(item.steps) : item.steps;
        const step = steps[item.current_step];

        if (!step) {
          await db.advanceAutomation(item.id, { nextStep: item.current_step });
          continue;
        }

        const baseUrl = process.env.BASE_URL || "https://api.1753skin.com";
        const unsubUrl = `${baseUrl}/api/newsletter/unsubscribe/${item.unsubscribe_token}`;

        const ctx = typeof item.context === "string" ? JSON.parse(item.context) : (item.context || {});
        const html = emailWrapper(
          step.html
            .replace(/\{\{firstName\}\}/g, item.first_name || "du")
            .replace(/\{\{email\}\}/g, item.email)
            .replace(/\{\{reviewToken\}\}/g, ctx.reviewToken || "")
            .replace(/\{\{context\.(\w+)\}\}/g, (_, key) => ctx[key] || ""),
          unsubUrl
        );

        const canSend = await db.canEmailSubscriber(item.subscriber_id, 20);
        if (!canSend) {
          const retryAt = new Date(Date.now() + 24 * 3600000);
          await db.advanceAutomation(item.id, { nextStep: item.current_step, nextSendAt: retryAt });
          console.log(`[Automation] Deferred "${step.subject}" to ${item.email} – emailed too recently, retry ${retryAt.toISOString()}`);
          continue;
        }

        await resend.emails.send({
          from: fromEmail,
          to: item.email,
          subject: step.subject.replace(/\{\{firstName\}\}/g, item.first_name || "du"),
          html
        });

        await db.touchSubscriberEmailed(item.subscriber_id);

        const nextStepIdx = item.current_step + 1;
        const nextStep = steps[nextStepIdx];
        let nextSendAt = null;

        if (nextStep) {
          const delayMs = (nextStep.delay_hours || 0) * 60 * 60 * 1000;
          nextSendAt = new Date(Date.now() + delayMs);
        }

        await db.advanceAutomation(item.id, { nextStep: nextStepIdx, nextSendAt });
        console.log(`[Automation] Sent "${step.subject}" to ${item.email} (flow: ${item.flow_slug}, step ${item.current_step})`);
      } catch (err) {
        console.error(`[Automation] Error sending to ${item.email}:`, err.message);
      }
    }
  } catch (err) {
    console.error("[Automation] Queue processing error:", err);
  }
}

// ---- NEWSLETTER GENERATE ENDPOINT (cron-job.org trigger) ----

app.post("/api/newsletter/generate", async (req, res) => {
  try {
    const adminKey = req.body.adminKey || req.headers["x-admin-key"];
    const expectedKey = process.env.ADMIN_API_KEY || "1753-admin-key";
    if (adminKey !== expectedKey) {
      return res.status(403).json({ message: "Ogiltig admin-nyckel" });
    }

    const dryRun = req.body.dryRun === true;
    const { execFile } = require("child_process");
    const scriptPath = require("path").join(__dirname, "scripts", "generate-newsletter.js");
    const args = dryRun ? [scriptPath, "--dry-run"] : [scriptPath];

    res.json({ ok: true, message: "Generering startad", dryRun });

    execFile("node", [scriptPath], { env: process.env, timeout: 120_000 }, (err, stdout, stderr) => {
      if (err) {
        console.error("[Newsletter] Generering misslyckades:", err.message);
        if (stderr) console.error(stderr);
      } else {
        console.log("[Newsletter] Generering klar:", stdout.trim().split("\n").pop());
      }
    });
  } catch (err) {
    console.error("[Newsletter] Generate error:", err);
    res.status(500).json({ message: "Kunde inte starta generering" });
  }
});

// ---- CONTENT REFRESH (cron-job.org trigger, every 30 days) ----

app.post("/api/content/refresh", async (req, res) => {
  try {
    const adminKey = req.body.adminKey || req.headers["x-admin-key"];
    const expectedKey = process.env.ADMIN_API_KEY || "1753-admin-key";
    if (adminKey !== expectedKey) {
      return res.status(403).json({ message: "Ogiltig admin-nyckel" });
    }

    const force = req.body.force === true;
    const { execFile } = require("child_process");
    const scriptPath = require("path").join(__dirname, "scripts", "refresh-landing-content.js");
    const args = force ? ["--force"] : [];

    res.json({ ok: true, message: "Content refresh startad", force });

    execFile("node", [scriptPath, ...args], { env: process.env, timeout: 600_000 }, (err, stdout, stderr) => {
      if (err) {
        console.error("[ContentRefresh] Misslyckades:", err.message);
        if (stderr) console.error(stderr);
      } else {
        console.log("[ContentRefresh] Klar:", stdout.trim().split("\n").slice(-3).join(" | "));
      }
    });
  } catch (err) {
    console.error("[ContentRefresh] Error:", err);
    res.status(500).json({ message: "Kunde inte starta content refresh" });
  }
});

// ---- AUTO-GENERATE NEW GUIDE PAGES (cron or manual trigger) ----

app.post("/api/content/generate-guides", async (req, res) => {
  try {
    const adminKey = req.body.adminKey || req.headers["x-admin-key"];
    const expectedKey = process.env.ADMIN_API_KEY || "1753-admin-key";
    if (adminKey !== expectedKey) {
      return res.status(403).json({ message: "Ogiltig admin-nyckel" });
    }

    const max = req.body.max || 3;
    const category = req.body.category || null;
    const { execFile } = require("child_process");
    const scriptPath = require("path").join(__dirname, "scripts", "generate-new-guides.js");
    const args = ["--max", String(max)];
    if (category) args.push("--category", category);

    res.json({ ok: true, message: "Guide-generering startad", max, category });

    execFile("node", [scriptPath, ...args], { env: process.env, timeout: 900_000 }, (err, stdout, stderr) => {
      if (err) {
        console.error("[GuideGen] Misslyckades:", err.message);
        if (stderr) console.error(stderr);
      } else {
        console.log("[GuideGen] Klar:", stdout.trim().split("\n").slice(-3).join(" | "));
      }
    });
  } catch (err) {
    console.error("[GuideGen] Error:", err);
    res.status(500).json({ message: "Kunde inte starta guide-generering" });
  }
});

// ---- SKIN CONDITION NEWSLETTER GENERATE (cron-job.org trigger, Sundays 18:00) ----

app.post("/api/newsletter/generate-skin", async (req, res) => {
  try {
    const adminKey = req.body.adminKey || req.headers["x-admin-key"];
    const expectedKey = process.env.ADMIN_API_KEY || "1753-admin-key";
    if (adminKey !== expectedKey) {
      return res.status(403).json({ message: "Ogiltig admin-nyckel" });
    }

    const dryRun = req.body.dryRun === true;
    const { execFile } = require("child_process");
    const scriptPath = require("path").join(__dirname, "scripts", "generate-skin-newsletters.js");
    const args = dryRun ? ["--dry-run"] : [];

    res.json({ ok: true, message: "Segmenterad generering startad", dryRun });

    execFile("node", [scriptPath, ...args], { env: process.env, timeout: 300_000 }, (err, stdout, stderr) => {
      if (err) {
        console.error("[SkinNewsletter] Generering misslyckades:", err.message);
        if (stderr) console.error(stderr);
      } else {
        console.log("[SkinNewsletter] Klar:", stdout.trim().split("\n").slice(-5).join(" | "));
      }
    });
  } catch (err) {
    console.error("[SkinNewsletter] Generate error:", err);
    res.status(500).json({ message: "Kunde inte starta generering" });
  }
});

// ---- SHIPMENT TRACKING CHECK (cron-job.org trigger, every 15 min) ----

app.post("/api/cron/check-shipments", async (req, res) => {
  try {
    const adminKey = req.body.adminKey || req.headers["x-admin-key"];
    const expectedKey = process.env.ADMIN_API_KEY || "1753-admin-key";
    if (adminKey !== expectedKey) {
      return res.status(403).json({ message: "Ogiltig admin-nyckel" });
    }

    const { rows: pendingOrders } = await db.pool.query(`
      SELECT id, order_number, ongoing_order_id, customer_email, customer_name, locale
      FROM orders
      WHERE payment_status = 'paid'
        AND shipped_at IS NULL
        AND ongoing_order_id IS NOT NULL
    `);

    if (pendingOrders.length === 0) {
      return res.json({ checked: 0, shipped: 0 });
    }

    let shipped = 0;
    for (const row of pendingOrders) {
      try {
        const ogData = await ongoingFetch(`/orders?goodsOwnerOrderId=${encodeURIComponent(row.ongoing_order_id)}`);
        const ogOrder = Array.isArray(ogData) ? ogData[0] : ogData;
        if (!ogOrder) continue;

        const orderInfo = ogOrder.orderInfo || ogOrder;
        const orderStatus = (orderInfo.orderStatusText || orderInfo.currentOrderStatus || "").toLowerCase();
        const isSent = orderStatus.includes("sent") || orderStatus.includes("shipped") || orderStatus.includes("skickad");
        if (!isSent) continue;

        const tracking = orderInfo.tracking || orderInfo.shipmentInfo || {};
        const trackingNumber = tracking.shipmentId || tracking.trackingNumber || tracking.waybillNumber || null;
        const trackingUrl = trackingNumber
          ? `https://tracking.postnord.com/tracking.html?id=${trackingNumber}`
          : null;

        await db.pool.query(
          `UPDATE orders SET tracking_number = $1, tracking_url = $2, shipped_at = NOW(), status = 'shipped'
           WHERE id = $3`,
          [trackingNumber, trackingUrl, row.id]
        );

        const fullOrder = await db.findOrderByNumber(row.order_number);
        if (fullOrder) {
          const items = typeof fullOrder.items === "string" ? JSON.parse(fullOrder.items) : fullOrder.items;
          await sendShippingConfirmation(fullOrder, items, trackingNumber, trackingUrl);
          await db.appendNotes(row.id, `Leveransbekräftelse skickad${trackingNumber ? ` (${trackingNumber})` : ""}`);
        }

        shipped++;
        console.log(`[Shipment] Order ${row.order_number} shipped, tracking: ${trackingNumber || "n/a"}`);
      } catch (err) {
        console.error(`[Shipment] Error checking ${row.order_number}:`, err.message);
      }
    }

    res.json({ checked: pendingOrders.length, shipped });
  } catch (err) {
    console.error("[Shipment] Cron error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ---- BROADCAST ENDPOINT (admin) ----

app.post("/api/newsletter/broadcast", async (req, res) => {
  try {
    const { subject, html, adminKey } = req.body;
    const expectedKey = process.env.ADMIN_API_KEY || "1753-admin-key";
    if (adminKey !== expectedKey) {
      return res.status(403).json({ message: "Ogiltig admin-nyckel" });
    }
    if (!subject || !html) {
      return res.status(400).json({ message: "subject och html kravs" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return res.status(500).json({ message: "RESEND_API_KEY saknas" });

    const { Resend } = require("resend");
    const resend = new Resend(apiKey);
    const fromEmail = process.env.EMAIL_FROM || "info@1753skin.com";

    const subscribers = await db.findActiveSubscribers();
    const baseUrl = process.env.BASE_URL || "https://api.1753skin.com";
    let sent = 0;

    for (const sub of subscribers) {
      try {
        const unsubUrl = `${baseUrl}/api/newsletter/unsubscribe/${sub.unsubscribe_token}`;
        await resend.emails.send({
          from: fromEmail,
          to: sub.email,
          subject,
          html: emailWrapper(
            html.replace(/\{\{firstName\}\}/g, sub.first_name || "du"),
            unsubUrl
          )
        });
        sent++;
      } catch (err) {
        console.error(`[Broadcast] Failed to send to ${sub.email}:`, err.message);
      }
    }

    console.log(`[Broadcast] Sent "${subject}" to ${sent}/${subscribers.length} subscribers`);
    res.json({ ok: true, sent, total: subscribers.length });
  } catch (err) {
    console.error("[Broadcast] Error:", err);
    res.status(500).json({ message: "Broadcast misslyckades" });
  }
});

// ---- SEGMENTED BROADCAST (skin condition newsletters) ----

app.post("/api/newsletter/broadcast-segmented", async (req, res) => {
  try {
    const { newsletters, adminKey } = req.body;
    const expectedKey = process.env.ADMIN_API_KEY || "1753-admin-key";
    if (adminKey !== expectedKey) {
      return res.status(403).json({ message: "Ogiltig admin-nyckel" });
    }
    if (!newsletters || !Array.isArray(newsletters)) {
      return res.status(400).json({ message: "newsletters array kravs" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return res.status(500).json({ message: "RESEND_API_KEY saknas" });

    const { Resend } = require("resend");
    const resend = new Resend(apiKey);
    const fromEmail = process.env.EMAIL_FROM || "info@1753skin.com";
    const baseUrl = process.env.BASE_URL || "https://api.1753skin.com";

    const results = [];

    for (const nl of newsletters) {
      const { skinCondition, subject, html } = nl;
      if (!skinCondition || !subject || !html) continue;

      let subscribers;
      if (skinCondition === "general") {
        const all = await db.findActiveSubscribers();
        subscribers = all.filter(s => !s.skin_condition);
      } else {
        subscribers = await db.findSubscribersBySkinCondition(skinCondition);
      }

      let sent = 0;
      let skipped = 0;
      for (const sub of subscribers) {
        try {
          const canSend = await db.canEmailSubscriber(sub.id, 24);
          if (!canSend) {
            skipped++;
            continue;
          }

          const unsubUrl = `${baseUrl}/api/newsletter/unsubscribe/${sub.unsubscribe_token}`;
          await resend.emails.send({
            from: fromEmail,
            to: sub.email,
            subject,
            html: emailWrapper(
              html.replace(/\{\{firstName\}\}/g, sub.first_name || "du"),
              unsubUrl
            )
          });
          await db.touchSubscriberEmailed(sub.id);
          sent++;

          if (sent % 5 === 0) await new Promise(r => setTimeout(r, 1000));
        } catch (err) {
          console.error(`[SegBroadcast] Failed ${sub.email}:`, err.message);
        }
      }

      console.log(`[SegBroadcast] ${skinCondition}: ${sent}/${subscribers.length} sent, ${skipped} skipped (cooldown)`);
      results.push({ skinCondition, sent, total: subscribers.length, skipped });
    }

    res.json({ ok: true, results });
  } catch (err) {
    console.error("[SegBroadcast] Error:", err);
    res.status(500).json({ message: "Segmenterad broadcast misslyckades" });
  }
});

// ---- SEED AUTOMATION FLOWS ----

async function seedAutomationFlows() {
  const siteUrl = "https://www.1753skin.com";

  // Welcome flow (5 emails over 14 days)
  await db.upsertFlow({
    slug: "welcome",
    name: "Välkomstserie",
    triggerEvent: "subscribe",
    steps: [
      {
        delay_hours: 0,
        subject: "Välkommen till 1753 SKINCARE, {{firstName}}!",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Välkommen till familjen!</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Vi är så glada att du är här. 1753 SKINCARE är mer än hudvård – det är en filosofi.
            Vi tror på att jobba med kroppen, inte mot den. Våra produkter bygger på CBD, CBG
            och noga utvalda naturliga ingredienser.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Som tack för att du gått med får du <strong>10% rabatt</strong> på din första beställning
            med koden <strong style="color:#108474;font-size:17px">VÄLKOMST10</strong>.
          </p>
          ${greenButton("Utforska produkterna", siteUrl + "/produkter")}
        `
      },
      {
        delay_hours: 48,
        subject: "Vår filosofi – hudvård som faktiskt fungerar",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Holistisk hudvård</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            De flesta hudvårdsprodukter löser symtom. Vi vill lösa orsaken.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Våra CBD- och CBG-baserade oljor jobbar med hudens egna endocannabinoidsystem
            för att återställa balans. Ingen onaturlig kemi, inga tomma löften.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Men produkter är bara en del. Sömn, kost, stresshantering och rörelse – allt spelar
            roll för din hud. Det är därför vi tar ett holistiskt grepp.
          </p>
          ${greenButton("Läs mer om oss", siteUrl + "/om-oss")}
        `
      },
      {
        delay_hours: 72,
        subject: "Vilken produkt passar dig?",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Hitta din match</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            <strong>The ONE Facial Oil</strong> – Vår allround-olja. Perfekt om du vill börja enkelt
            med en produkt som balanserar, återfuktar och ger lyster. Funkar för alla hudtyper.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            <strong>I LOVE Facial Oil</strong> – Extra näringsrik med CBG. Bäst för torr eller mogen hud
            som behöver djupgående återfuktning.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            <strong>DUO-kit</strong> – Båda oljorna i ett kit. The ONE på morgonen, I LOVE på kvällen.
            Vår mest populära produkt.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Osäker? Prova vår <strong>AI-hudanalys</strong> – ladda upp ett foto och få personliga rekommendationer.
          </p>
          ${greenButton("Gör hudanalys", siteUrl + "/hudanalys")}
        `
      },
      {
        delay_hours: 96,
        subject: "\"Min hud har aldrig varit bättre\"",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Riktig feedback från riktiga människor</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Vi behöver inte hitta på berättelser. Våra kunder talar för sig själva.
          </p>
          <div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:20px 0">
            <p style="font-size:15px;line-height:1.7;color:#515151;font-style:italic;margin:0">
              "Jag har provat allt – dyr hudvård, billig hudvård, ingenting. The ONE är den
              enda produkten som verkligen gjort skillnad. Lugnar, balanserar, ger lyster."
            </p>
            <p style="font-size:13px;color:#766a62;margin:8px 0 0">– Sandra, 34 år</p>
          </div>
          <div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:20px 0">
            <p style="font-size:15px;line-height:1.7;color:#515151;font-style:italic;margin:0">
              "DUO-kitet har blivit min morgon- och kvällsrutin. Så enkelt, så bra. Huden
              är mjukare och jämnare än någonsin."
            </p>
            <p style="font-size:13px;color:#766a62;margin:8px 0 0">– Mikael, 41 år</p>
          </div>
          ${greenButton("Se alla produkter", siteUrl + "/produkter")}
        `
      },
      {
        delay_hours: 120,
        subject: "Ditt exklusiva erbjudande väntar, {{firstName}}",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Bara för dig</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Du har följt med oss i två veckor nu – tack för det! Vi hoppas att du lärt dig
            något nytt om holistisk hudvård.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Som tack vill vi ge dig ett exklusivt erbjudande:
            <strong>fri frakt + 15% rabatt</strong> på hela sortimentet.
          </p>
          <p style="font-size:17px;font-weight:700;color:#108474;text-align:center;margin:20px 0">
            Kod: INSIDER15
          </p>
          <p style="font-size:13px;color:#766a62;text-align:center">
            Giltig i 7 dagar. Kan inte kombineras med andra erbjudanden.
          </p>
          ${greenButton("Handla nu", siteUrl + "/produkter")}
        `
      }
    ]
  });

  // Post-purchase flow (4 emails)
  await db.upsertFlow({
    slug: "post-purchase",
    name: "Efter köp",
    triggerEvent: "purchase",
    steps: [
      {
        delay_hours: 24,
        subject: "Tack för ditt köp, {{firstName}} – här är dina tips!",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Så får du bäst resultat</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Grattis till ditt köp! Här är några tips för att få ut maximalt av dina produkter:
          </p>
          <ul style="font-size:15px;line-height:2;color:#515151;padding-left:20px">
            <li>Applicera på ren, fuktad hud för bäst absorption</li>
            <li>2–3 droppar räcker – värm oljan mellan handflatorna först</li>
            <li>Ge huden tid – CBD och CBG bygger effekt över tid (2–4 veckor)</li>
            <li>Kombinera med bra sömn och vatten för synergieffekt</li>
          </ul>
          ${greenButton("Läs mer om våra ingredienser", siteUrl + "/om-oss")}
        `
      },
      {
        delay_hours: 168,
        subject: "Din hudvårdsrutin – enklare än du tror",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Morgon och kväll</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            En bra rutin behöver inte vara komplicerad. Här är vårt förslag:
          </p>
          <div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:16px 0">
            <p style="font-size:13px;font-weight:700;color:#108474;margin:0">MORGON</p>
            <p style="font-size:14px;line-height:1.7;color:#515151;margin:8px 0 0">
              1. Skölj ansiktet med ljummet vatten<br>
              2. The ONE Facial Oil – 2–3 droppar<br>
              3. SPF (om du går ut)
            </p>
          </div>
          <div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:16px 0">
            <p style="font-size:13px;font-weight:700;color:#108474;margin:0">KVÄLL</p>
            <p style="font-size:14px;line-height:1.7;color:#515151;margin:8px 0 0">
              1. Au Naturel Makeup Remover<br>
              2. I LOVE Facial Oil – 3–4 droppar<br>
              3. Sov gott!
            </p>
          </div>
          ${greenButton("Se alla produkter", siteUrl + "/produkter")}
        `
      },
      {
        delay_hours: 504,
        subject: "Hur mår din hud, {{firstName}}?",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Vi vill höra från dig</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Det har nu gått tre veckor sedan ditt köp. Förhoppningsvis börjar du se
            skillnad – CBD och CBG bygger effekt över tid.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Vill du se hur din hud utvecklas? Vår AI-hudanalys ger dig en objektiv
            bedömning och personliga råd.
          </p>
          ${greenButton("Gör en gratis hudanalys", siteUrl + "/hudanalys")}
          <p style="font-size:14px;line-height:1.7;color:#515151;margin-top:16px">
            Har du frågor? Svara på detta mejl så återkommer vi inom 24 timmar.
          </p>
        `
      },
      {
        delay_hours: 1080,
        subject: "Dags att fylla på? Spara med prenumeration",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Slipp att ta slut</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Beroende på hur mycket du använder borde det snart vara dags för påfyllning.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Med våra prenumerationer får du <strong>15% rabatt</strong> på varje leverans,
            och du väljer själv intervall (30, 60 eller 90 dagar). Avbryt när du vill.
          </p>
          ${greenButton("Beställ igen", siteUrl + "/produkter")}
        `
      }
    ]
  });

  // Cart abandonment flow (3 emails)
  await db.upsertFlow({
    slug: "cart-abandoned",
    name: "Övergiven varukorg",
    triggerEvent: "cart_abandoned",
    steps: [
      {
        delay_hours: 1,
        subject: "Du glömde något i varukorgen",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Din varukorg väntar</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Vi såg att du var nära att slutföra din beställning. Dina produkter
            väntar fortfarande på dig!
          </p>
          ${greenButton("Slutför din beställning", siteUrl + "/kassa")}
          <p style="font-size:13px;color:#766a62;text-align:center">
            Fri frakt på ordrar över 700 kr.
          </p>
        `
      },
      {
        delay_hours: 24,
        subject: "Fortfarande intresserad? Fri frakt på oss",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Vi bjuder på frakten</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Vi vill göra det enkelt för dig. Slutför din beställning idag
            så står vi för fraktkostnaden – oavsett ordervärde.
          </p>
          ${greenButton("Handla med fri frakt", siteUrl + "/kassa")}
        `
      },
      {
        delay_hours: 72,
        subject: "Sista chansen – 5% extra rabatt",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Sista knuffen</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Vi ger inte upp så lätt! Här är <strong>5% extra rabatt</strong>
            på hela din varukorg. Använd koden:
          </p>
          <p style="font-size:17px;font-weight:700;color:#108474;text-align:center;margin:20px 0">
            KOMTILLBAKA5
          </p>
          ${greenButton("Slutför ditt köp", siteUrl + "/kassa")}
          <p style="font-size:13px;color:#766a62;text-align:center">
            Erbjudandet är giltigt i 48 timmar.
          </p>
        `
      }
    ]
  });

  console.log("[Automation] Flows seeded (welcome, post-purchase, cart-abandoned)");
}

// ---- ORDER VERIFICATION (backup from success page) ----

app.post("/api/orders/verify", async (req, res) => {
  try {
    const { orderNumber, transactionId } = req.body;

    let order = orderNumber ? await db.findOrderByNumber(orderNumber) : null;

    if (!order && transactionId) {
      const { rows } = await db.pool.query(
        "SELECT * FROM orders WHERE viva_transaction_id = $1 LIMIT 1",
        [transactionId]
      );
      order = rows[0] || null;
    }

    if (!order) {
      return res.status(404).json({ message: "Order hittades inte" });
    }

    if (order.processed_at) {
      return res.json({
        success: true,
        orderNumber: order.order_number,
        status: order.status,
        message: "Ordern är redan behandlad"
      });
    }

    if (transactionId && order.payment_status !== "paid") {
      try {
        const vivaData = await vivaFetch(`/checkout/v2/transactions/${transactionId}`);
        if (vivaData && (vivaData.statusId === "F" || vivaData.StatusId === "F")) {
          await db.updateOrder(order.id, {
            payment_status: "paid",
            status: "confirmed",
            viva_transaction_id: transactionId
          });
          console.log(`[Verify] Order ${order.order_number} confirmed via success page`);
          const result = await handleOrderCompletion(order.id);
          return res.json({
            success: true,
            orderNumber: order.order_number,
            status: "fulfilled",
            message: "Beställningen har behandlats"
          });
        }
      } catch (err) {
        console.error("[Verify] Viva verification failed:", err);
      }
    }

    if (order.payment_status === "paid" && !order.processed_at) {
      await handleOrderCompletion(order.id);
    }

    const updated = await db.findOrderByNumber(order.order_number);
    res.json({
      success: true,
      orderNumber: updated.order_number,
      status: updated.status,
      paymentStatus: updated.payment_status,
      message: updated.processed_at ? "Beställningen har behandlats" : "Beställningen väntar på behandling"
    });
  } catch (err) {
    console.error("[Verify Error]", err);
    res.status(500).json({ message: err.message || "Verifieringen misslyckades" });
  }
});

// ---- CHAT WIDGET (site-wide) ----

function loadChatBookKnowledge() {
  const names = ["book-knowledge.md", "book-knowledge-extended.md"];
  let out = "";
  for (const name of names) {
    try {
      const p = path.join(__dirname, "data", name);
      if (fs.existsSync(p)) {
        out += "\n\n" + fs.readFileSync(p, "utf8");
      }
    } catch (_) { /* ignore */ }
  }
  return out;
}

const CHAT_WIDGET_PROMPT = `Du är 1753 SKINCAREs virtuella hudvårdsrådgivare – tänk dig en kunnig vän som brinner för holistisk hudvård, med en gnutta humor och mycket värme.

GRUNDREGEL – ENDAST VERIFIERAD KUNSKAP (VIKTIGAST):
- Nederst följer två bokfiler: \`book-knowledge.md\` (sammanfattningar) och \`book-knowledge-extended.md\` (längre maskinutdrag ur Christopher Genbergs bok: inledning, slutord, ~1800 tecken från varje kapitel). Använd dem för ton, filosofi och helhetssyn. Där boken skriver kraftfullt om effekter eller sjukdomar ska du ändå följa reglerna nedan: ingen diagnos, inga garanterade botande löften för produkter – formulera försiktigt ("många upplever", "viss forskning är preliminär").
- Du får ALDRIG hitta på ingredienser, formuleringar eller "typiska" råvaror som inte uttryckligen finns i avsnittet VERIFIERADE PRODUKTER & INCI nedan.
- Om kunden frågar vad ni använder: svara ENDAST utifrån den listan + filosofi från bokkunskapsavsnittet längst ner (Christopher Genbergs bok). Nämn inte avokado-, camellia-, sacha inchi-olja, fermenterade extrakt, havtorn, ringblomma eller liknande som 1753-ingredienser – de ingår inte i vårt officiella sortiment enligt dokumentationen här.
- Om något saknas i listan (t.ex. fullständig INCI-lista för ansiktsoljorna): säg ärligt att exakta övriga innehåll finns på förpackningen och produktsidan, och hänvisa till kundtjänst – gissa inte.
- Allmän hudbiologi (mikrobiom, ECS, stress, sömn) får du koppla till vår filosofi enligt bokkunskapen – men koppla inte påhittade råvaror till våra flaskor.

DITT SÄTT:
- Alltid svenska. Aldrig emojis.
- Varm, personlig, lite rebellisk mot hudvårdsindustrin
- Holistisk syn: hud, livsstil, endocannabinoidsystem (ECS), mikrobiom
- Håll svaren koncisa som standard (runt 50-150 ord) men skriv gärna längre och mer utförligt när frågan kräver det – detaljerade ingrediensfrågor, hudvårdsrutiner, jämförelser eller djupare förklaringar kan kräva 300-500 ord. Anpassa längden efter frågans komplexitet
- Humor är välkommet – du får gärna vara lite cheeky
- ALDRIG säljig eller pushig. Rekommendera bara produkter om det är relevant
- Om du inte kan svara: "Det ligger utanför mitt expertområde – men hör av dig direkt till oss på info@1753skin.com eller ring 0732-30 55 21 så löser vi det!"

DU KAN HJÄLPA MED:
- Produktfrågor (ingredienser, användning, val av produkt) – enligt VERIFIERADE listan
- Hudvård, hudhälsa, hudtyper – i linje med bokens filosofi där det är relevant
- Livsstilstips (sömn, kost, stress, tarmhälsa)
- Endocannabinoidsystemet och CBD/CBG för huden – försiktigt, inga sjukdomslöften
- Hudens mikrobiom
- Orderfrågor (hänvisa till kontakt för specifika ordrar)
- Lägga produkter i varukorgen åt kunden

VERIFIERADE PRODUKTER & INCI (enda tillåtna källan för "vad innehåller era produkter"):
1. The ONE Facial Oil (ingår i DUO-kit / DUO+TA-DA): 10 % CBD, 0,2 % CBG. Övriga ingredienser enligt förpackning och produktsida – ange inte detaljer du inte ser här.
2. I LOVE Facial Oil (ingår i DUO-kit / DUO+TA-DA): 10 % CBD, 5 % CBG. Övriga enligt förpackning/produktsida.
3. TA-DA Serum (id: ta-da-serum, 699 kr, 30 ml): Ekologisk jojobaolja (INCI: Simmondsia chinensis Seed Oil) + Cannabigerol (CBG) 3 % (1500 mg per flaska).
4. Au Naturel Makeup Remover (id: au-naturel-makeup-remover, 399 kr, 100 ml): Caprylic/Capric Triglyceride (MCT) + Cannabidiol (CBD) 0,2 %.
5. Fungtastic Mushroom Extract (id: fungtastic-mushroom-extract, 377 kr, 60 kapslar): Chaga 25 %, Lion's Mane 25 %, Cordyceps 25 %, Reishi 25 % – 400 mg per kapsel (15:1 extrakt), minst 20 % betaglukaner, 100 % ekologiskt. Kosttillskott – inte ansiktsprodukt.

PRODUKTKATALOG (priser & id):
1. "DUO-kit" (id: duo-kit, 1 099 kr) – The ONE + I LOVE. 2 x 10 ml.
2. "DUO-kit + TA-DA Serum" (id: duo-ta-da, 1 495 kr) – Komplett rutin: DUO + TA-DA Serum.
3. "TA-DA Serum" (id: ta-da-serum, 699 kr) – se INCI ovan.
4. "Au Naturel Makeup Remover" (id: au-naturel-makeup-remover, 399 kr) – se INCI ovan.
5. "Fungtastic Mushroom Extract" (id: fungtastic-mushroom-extract, 377 kr) – se INCI ovan.

PRODUKTMATCHNING:
- Torr/känslig hud → DUO-kit + TA-DA
- Akne/fet hud → TA-DA (CBG via ECS – försiktigt formulerat)
- Åldrande/fina linjer → DUO-kit (nattlig reparation med I LOVE)
- Rodnad/rosacea → DUO-kit (lugnande – ingen medicinsk claim)
- Dålig rengöring → Au Naturel (varsam mot mikrobiom)
- Inifrån/hälsa → Fungtastic
- Komplett rutin → DUO-kit + TA-DA

Om kunden vill ha en produkt, använd add_to_cart-funktionen.

OM 1753 SKINCARE:
- Svenskt familjeföretag, grundat av Christopher och Ebba Genberg
- Adress: Södra Skjutbanevägen 10, 439 55 Åsa
- Telefon: 0732-30 55 21
- E-post: info@1753skin.com
- Fri frakt över 700 kr
- Personlig rådgivning före och efter köp

ABSOLUT FÖRBJUDET:
- Medicinsk rådgivning eller diagnos
- Rekommendera receptbelagda läkemedel
- Prata om konkurrenter
- Engelska ord (utom produktnamn)
- Emojis
- Påhittade ingredienser eller att påstå att vi har produkter vi inte listar ovan` + loadChatBookKnowledge();

const CHAT_WIDGET_TOOLS = [
  {
    type: "function",
    name: "add_to_cart",
    description: "Lägg till en produkt i kundens varukorg. Använd när kunden vill köpa eller testa en produkt.",
    parameters: {
      type: "object",
      properties: {
        product_id: {
          type: "string",
          enum: ["duo-ta-da", "ta-da-serum", "duo-kit", "au-naturel-makeup-remover", "fungtastic-mushroom-extract"],
          description: "Produktens ID"
        }
      },
      required: ["product_id"]
    }
  }
];

const VALID_PRODUCT_IDS = ["duo-ta-da", "ta-da-serum", "duo-kit", "au-naturel-makeup-remover", "fungtastic-mushroom-extract"];

async function buildCustomerContext(userId) {
  try {
    const user = await db.findUserById(userId);
    if (!user) return "";

    const parts = [`\n\nKUNDKONTEXT (inloggad kund – använd för att personalisera svaret):`];
    parts.push(`Namn: ${user.name || "Okänt"}`);

    const orders = await db.findOrdersByEmail(user.email).catch(() => []);
    if (orders && orders.length > 0) {
      parts.push(`\nOrderhistorik (${orders.length} ordrar):`);
      for (const o of orders.slice(0, 5)) {
        const items = (o.items || []).map(i => i.name || i.product_id).join(", ");
        const date = o.created_at ? new Date(o.created_at).toLocaleDateString("sv-SE") : "okänt datum";
        parts.push(`  - ${date}: ${items || "inga produkter"} (${o.status || "okänd status"})`);
      }
      if (orders.length > 5) parts.push(`  ... och ${orders.length - 5} äldre ordrar`);
    } else {
      parts.push("Ordrar: Inga tidigare ordrar.");
    }

    const analyses = await db.getSkinAnalyses(userId).catch(() => []);
    if (analyses && analyses.length > 0) {
      const latest = analyses[0];
      parts.push(`\nHudanalyser (${analyses.length} st):`);
      parts.push(`  Senaste: ${latest.created_at ? new Date(latest.created_at).toLocaleDateString("sv-SE") : "okänt datum"}, poäng ${latest.score || "ej betygsatt"}`);
      if (latest.result) {
        const r = typeof latest.result === "string" ? JSON.parse(latest.result) : latest.result;
        if (r.summary) parts.push(`  Sammanfattning: ${r.summary.substring(0, 300)}`);
        if (r.recommendations) {
          const recs = Array.isArray(r.recommendations) ? r.recommendations : [];
          if (recs.length > 0) parts.push(`  Rekommendationer: ${recs.slice(0, 3).join("; ")}`);
        }
      }
      if (analyses.length > 1) {
        const oldest = analyses[analyses.length - 1];
        parts.push(`  Första analys: ${oldest.created_at ? new Date(oldest.created_at).toLocaleDateString("sv-SE") : ""}, poäng ${oldest.score || "?"}`);
        if (latest.score && oldest.score) {
          const diff = latest.score - oldest.score;
          parts.push(`  Utveckling: ${diff > 0 ? "+" : ""}${diff} poäng sedan start`);
        }
      }
    }

    const wishlist = await db.getWishlist(userId).catch(() => []);
    if (wishlist && wishlist.length > 0) {
      parts.push(`\nÖnskelista: ${wishlist.map(w => w.product_id).join(", ")}`);
    }

    const subs = await db.findSubscriptionsByUser(userId).catch(() => []);
    if (subs && subs.length > 0) {
      const active = subs.filter(s => s.status === "active");
      if (active.length > 0) {
        parts.push(`\nAktiva prenumerationer: ${active.map(s => s.product_id).join(", ")}`);
      }
    }

    parts.push(`\nAnvänd denna information för att ge personaliserade svar. Nämn kundens namn ibland. Om de frågar om sin hudanalys, referera till deras senaste resultat. Om de redan köpt en produkt, föreslå inte samma igen utan fokusera på komplement.`);

    return parts.join("\n");
  } catch (err) {
    console.error("[Chat Widget] Customer context error:", err.message);
    return "";
  }
}

app.post("/api/chat", async (req, res) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "chat-widget", 60)) {
      return res.status(429).json({ message: "Du har nått gränsen. Försök igen om en stund." });
    }

    const { message, previousResponseId, locale } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Meddelande saknas." });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw { status: 503, message: "Chatten är tillfälligt otillgänglig." };
    }

    let customerContext = "";
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const payload = verifyToken(authHeader.split(" ")[1]);
      if (payload && payload.id) {
        customerContext = await buildCustomerContext(payload.id);
      }
    }

    let instructions = CHAT_WIDGET_PROMPT + customerContext;
    if (locale === "en") {
      instructions += "\n\nSPRÅK: Kunden surfar på engelska. Svara på engelska istället för svenska. Behåll samma ton och personlighet.";
    }

    const body = {
      model: "gpt-5.4-mini",
      instructions,
      input: message,
      max_output_tokens: 4096,
      tools: CHAT_WIDGET_TOOLS,
      tool_choice: "auto",
      ...(previousResponseId && { previous_response_id: previousResponseId }),
    };

    const response = await fetchWithRetry("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("[Chat Widget] OpenAI error:", err);
      throw { status: response.status, message: "Chatten kunde inte svara just nu." };
    }

    const data = await response.json();
    const actions = [];
    let outputText = "";

    for (const item of data.output || []) {
      if (item.type === "function_call" && item.name === "add_to_cart") {
        try {
          const args = JSON.parse(item.arguments || "{}");
          if (VALID_PRODUCT_IDS.includes(args.product_id)) {
            actions.push({ type: "add_to_cart", productId: args.product_id });
          }
        } catch (_) { /* ignore bad JSON */ }
      }
      if (item.type === "message") {
        for (const c of item.content || []) {
          if (c.type === "output_text") outputText += c.text;
        }
      }
    }

    res.json({
      content: outputText.trim(),
      responseId: data.id || null,
      actions,
    });
  } catch (err) {
    console.error("[Chat Widget Error]", err);
    res.status(err.status || 500).json({ message: err.message || "Chatten misslyckades." });
  }
});

// ---- FORTNOX OAUTH FLOW ----

function getFortnoxRedirectUri(req) {
  if (process.env.FORTNOX_REDIRECT_URI) return process.env.FORTNOX_REDIRECT_URI;
  const proto = req.get("x-forwarded-proto") || req.protocol;
  return `${proto}://${req.get("host")}/api/fortnox/callback`;
}

app.get("/api/fortnox/auth", (req, res) => {
  const clientId = process.env.FORTNOX_CLIENT_ID;
  if (!clientId) return res.status(500).json({ message: "FORTNOX_CLIENT_ID saknas" });

  const redirectUri = getFortnoxRedirectUri(req);
  const state = crypto.randomBytes(16).toString("hex");

  const authUrl = new URL("https://apps.fortnox.se/oauth-v1/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("scope", "companyinformation customer article order invoice payment");
  authUrl.searchParams.set("access_type", "offline");

  console.log("[Fortnox OAuth] redirect_uri:", redirectUri);
  console.log("[Fortnox OAuth] Full auth URL:", authUrl.toString());

  if (req.query.debug) {
    return res.send(`<h1>Fortnox OAuth Debug</h1>
      <p><strong>redirect_uri:</strong> ${redirectUri}</p>
      <p><strong>client_id:</strong> ${clientId}</p>
      <p><strong>scope:</strong> companyinformation customer article order invoice payment</p>
      <p><strong>Full URL:</strong></p>
      <pre style="word-break:break-all">${authUrl.toString()}</pre>
      <p><a href="${authUrl.toString()}">Klicka här för att auktorisera</a></p>`);
  }

  res.redirect(authUrl.toString());
});

app.get("/api/fortnox/callback", async (req, res) => {
  console.log("[Fortnox OAuth] Callback query:", JSON.stringify(req.query));
  const { code, error, error_description } = req.query;
  if (error || !code) {
    const msg = error_description || error || "Ingen kod mottagen";
    return res.status(400).send(`<h1>Fortnox-auktorisering misslyckades</h1><p>${msg}</p><pre>Query: ${JSON.stringify(req.query, null, 2)}</pre><p><a href="/api/fortnox/auth">Försök igen</a></p>`);
  }

  try {
    const fetch = (await import("node-fetch")).default;
    const redirectUri = getFortnoxRedirectUri(req);

    const tokenRes = await fetch("https://apps.fortnox.se/oauth-v1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: process.env.FORTNOX_CLIENT_ID || "",
        client_secret: process.env.FORTNOX_CLIENT_SECRET || ""
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error("[Fortnox OAuth] Token exchange failed:", tokenData);
      return res.status(400).send(`<h1>Token-utbyte misslyckades</h1><pre>${JSON.stringify(tokenData, null, 2)}</pre>`);
    }

    const newAccessToken = tokenData.access_token;
    const newRefreshToken = tokenData.refresh_token || "";
    const expiresAt = Date.now() + (tokenData.expires_in || 3600) * 1000;

    fortnoxTokens.accessToken = newAccessToken;
    fortnoxTokens.refreshToken = newRefreshToken;
    fortnoxTokens.expiresAt = expiresAt;

    console.log("[Fortnox OAuth] Tokens received! Access token expires in", tokenData.expires_in, "s");

    try {
      await db.saveFortnoxTokensToDB(newAccessToken, newRefreshToken, expiresAt);
      console.log("[Fortnox OAuth] Tokens saved to DB -- will survive deploys");
    } catch (dbErr) {
      console.error("[Fortnox OAuth] DB save failed:", dbErr.message);
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="sv">
      <head><meta charset="utf-8"><title>Fortnox – Ansluten</title>
      <style>body{font-family:-apple-system,sans-serif;max-width:600px;margin:60px auto;padding:20px;color:#1d1d1f}
      h1{color:#108474}</style></head>
      <body>
        <h1>Fortnox ansluten!</h1>
        <p>Tokens har hämtats, aktiverats och sparats automatiskt.</p>
        <p>Du kan stänga denna sida.</p>
        <p><a href="/">Tillbaka till startsidan</a></p>
      </body></html>
    `);
  } catch (err) {
    console.error("[Fortnox OAuth] Error:", err);
    res.status(500).send(`<h1>Serverfel</h1><p>${err.message}</p>`);
  }
});

// ---- ADMIN: FORTNOX ARTIKLAR ----

app.get("/api/fortnox/articles", adminOnly, async (req, res) => {
  try {
    const data = await fortnoxFetch("/articles?limit=100");
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get("/api/fortnox/customers", adminOnly, async (req, res) => {
  try {
    const data = await fortnoxFetch("/customers?limit=100");
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get("/api/fortnox/company", adminOnly, async (req, res) => {
  try {
    const data = await fortnoxFetch("/companyinformation");
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

// ---- HEALTH CHECK ----

app.get("/health", async (req, res) => {
  try {
    await db.pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected", uptime: process.uptime() });
  } catch {
    res.status(503).json({ status: "degraded", db: "disconnected" });
  }
});


// ---- RECURRING SUBSCRIPTION CHARGES (runs every 6 hours) ----

const SIX_HOURS = 6 * 60 * 60 * 1000;

async function processRecurringCharges() {
  try {
    const due = await db.findDueSubscriptions();
    if (due.length === 0) return;
    console.log(`[Recurring] ${due.length} subscription(s) due for charge`);

    const fetch = (await import("node-fetch")).default;
    const env = process.env.VIVA_ENVIRONMENT === "production" ? "" : "demo-";
    const merchantId = process.env.VIVA_MERCHANT_ID;
    const apiKey = process.env.VIVA_API_KEY;

    if (!merchantId || !apiKey) {
      console.error("[Recurring] VIVA_MERCHANT_ID / VIVA_API_KEY not set, skipping");
      return;
    }

    const basicAuth = Buffer.from(`${merchantId}:${apiKey}`).toString("base64");

    for (const sub of due) {
      try {
        if (!sub.viva_initial_tx_id) {
          console.warn(`[Recurring] Sub ${sub.id} has no initial tx id, skipping`);
          continue;
        }

        const vivaAmount = sub.recurring_price * 100;
        const subCurrency = sub.currency || "SEK";
        const chargeUrl = `https://${env}api.vivapayments.com/api/transactions/${sub.viva_initial_tx_id}`;

        const chargeRes = await fetch(chargeUrl, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${basicAuth}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount: vivaAmount,
            currencyCode: String(VIVA_CURRENCY_CODE[subCurrency] || 752)
          })
        });

        const chargeData = await chargeRes.json().catch(() => null);

        if (!chargeRes.ok) {
          console.error(`[Recurring] Charge failed for sub ${sub.id}:`, chargeData);
          await db.updateSubscription(sub.id, { status: "payment_failed" });
          await db.createSubscriptionCharge({
            subscriptionId: sub.id,
            amount: sub.recurring_price,
            status: "failed"
          });
          continue;
        }

        const newTxId = chargeData?.TransactionId || chargeData?.transactionId;
        const orderNumber = await generateOrderNumber();

        const user = await db.findUserById(sub.user_id);
        const lastOrder = user ? (await db.pool.query(
          "SELECT address, zip, city, country_code, customer_phone FROM orders WHERE customer_email = $1 AND address IS NOT NULL AND address != '' ORDER BY created_at DESC LIMIT 1",
          [user.email]
        )).rows[0] : null;

        const product = Object.values(PRODUCTS_MAP).find(p => p.articleNumber === sub.product_id) ||
                         Object.entries(PRODUCTS_MAP).find(([k]) => k === sub.product_id)?.[1];

        const newOrder = await db.createOrder({
          orderNumber,
          customerName: user?.name || sub.product_name,
          customerEmail: user?.email || "",
          customerPhone: user?.phone || lastOrder?.customer_phone || "",
          address: lastOrder?.address || "",
          zip: lastOrder?.zip || "",
          city: lastOrder?.city || "",
          vivaOrderCode: null,
          merchantTrns: `RSUB-${orderNumber}`,
          items: [{
            id: sub.product_id,
            name: sub.product_name,
            qty: sub.quantity,
            price: sub.recurring_price,
            articleNumber: product?.articleNumber || sub.product_id,
            vatRate: product?.vatRate || 0.25
          }],
          totalAmount: sub.recurring_price,
          shippingCost: 0
        });

        await db.updateOrder(newOrder.id, {
          payment_status: "paid",
          status: "confirmed",
          viva_transaction_id: newTxId || null
        });

        await db.createSubscriptionCharge({
          subscriptionId: sub.id,
          orderId: newOrder.id,
          vivaTxId: newTxId || null,
          amount: sub.recurring_price,
          status: "charged"
        });

        const nextCharge = new Date();
        nextCharge.setDate(nextCharge.getDate() + sub.interval_days);

        await db.updateSubscription(sub.id, {
          next_charge_date: nextCharge.toISOString().split("T")[0],
          last_charge_date: new Date().toISOString().split("T")[0]
        });

        console.log(`[Recurring] Sub ${sub.id} charged ${sub.recurring_price} kr, new order ${orderNumber}, next: ${nextCharge.toISOString().split("T")[0]}`);

        try {
          await handleOrderCompletion(newOrder.id);
        } catch (err) {
          console.error(`[Recurring] Fulfilment error for order ${orderNumber}:`, err.message);
        }
      } catch (err) {
        console.error(`[Recurring] Error processing sub ${sub.id}:`, err);
      }
    }
  } catch (err) {
    console.error("[Recurring] Top-level error:", err);
  }
}

// ---- WIN-BACK CHECKER ----

async function checkWinbackEligibility() {
  try {
    const winbackFlows = await db.findFlowByTrigger("win_back");
    if (winbackFlows.length === 0) return;

    const cutoffDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
    const { rows: candidates } = await db.pool.query(`
      SELECT customer_email, MAX(customer_name) as customer_name, MAX(created_at) as last_order
      FROM orders
      WHERE payment_status = 'paid' AND created_at < $1
      GROUP BY customer_email
      HAVING MAX(created_at) < $1
    `, [cutoffDate]);

    let queued = 0;
    for (const c of candidates) {
      let subscriber = await db.findSubscriberByEmail(c.customer_email);
      if (!subscriber) continue;
      if (subscriber.status !== "active") continue;

      const alreadyQueued = await db.pool.query(
        `SELECT 1 FROM automation_queue aq
         JOIN automation_flows af ON af.id = aq.flow_id
         WHERE aq.subscriber_id = $1 AND af.trigger_event = 'win_back' AND aq.status IN ('pending','active')
         LIMIT 1`,
        [subscriber.id]
      );
      if (alreadyQueued.rows.length > 0) continue;

      for (const flow of winbackFlows) {
        await db.enqueueAutomation({
          subscriberId: subscriber.id, flowId: flow.id,
          context: { firstName: subscriber.first_name },
          nextSendAt: new Date()
        });
      }
      queued++;
    }

    if (queued > 0) console.log(`[Win-back] Queued ${queued} customers for win-back`);
  } catch (err) {
    console.error("[Win-back] Error:", err.message);
  }
}

// ---- SEED ADMIN ACCOUNTS ----

async function seedAdminAccounts() {
  const admins = [
    { email: "torbjorn@1753skin.com", name: "Torbjörn" },
    { email: "christopher@1753skin.com", name: "Christopher" },
  ];

  for (const admin of admins) {
    const existing = await db.findUserByEmail(admin.email);
    if (existing) {
      if (existing.role !== "admin") {
        await db.updateUser(existing.id, { role: "admin" });
        console.log(`[Admin] ${admin.email}: role upgraded to admin`);
      }
      continue;
    }

    const tempPassword = "1753Admin!";
    const hash = bcrypt ? await bcrypt.hash(tempPassword, 10) : tempPassword;
    await db.createUser({
      id: crypto.randomUUID(),
      name: admin.name,
      email: admin.email,
      phone: "",
      passwordHash: hash,
    });

    const user = await db.findUserByEmail(admin.email);
    if (user) {
      await db.updateUser(user.id, { role: "admin" });
    }
    console.log(`[Admin] ${admin.email}: account created with role admin`);
  }
}

// ---- MEDIA GALLERY (public) ----

app.get("/api/gallery", async (req, res) => {
  try {
    const fs = require("fs");
    const galleryDir = path.join(__dirname, "public", "social-media");
    if (!fs.existsSync(galleryDir)) return res.json({ images: [] });

    const files = fs.readdirSync(galleryDir)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f) && !f.startsWith("."))
      .map(f => {
        const stat = fs.statSync(path.join(galleryDir, f));
        const parts = f.replace(/\.\w+$/, "").split("-");
        const type = parts[0] || "other";
        const product = parts.length > 2 ? parts.slice(1, -1).join("-") : parts[1] || "";
        return {
          filename: f,
          url: `/social-media/${f}`,
          type,
          product,
          size: stat.size,
          created: stat.mtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    res.json({ images: files });
  } catch (err) {
    res.status(500).json({ message: "Kunde inte hämta galleri" });
  }
});

// ---- SOCIAL MEDIA ----

const socialGen = require("./scripts/social-media-generator");

app.get("/api/admin/social/accounts", adminAuthMiddleware, async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;
    const apiKey = process.env.PUBLER_API_KEY;
    const workspaceId = process.env.PUBLER_WORKSPACE_ID;
    if (!apiKey || !workspaceId) {
      return res.json({ connected: false, accounts: [], message: "PUBLER_API_KEY eller PUBLER_WORKSPACE_ID saknas" });
    }
    const headers = {
      Authorization: `Bearer-API ${apiKey}`,
      "Publer-Workspace-Id": workspaceId,
    };
    const acctRes = await fetch("https://app.publer.com/api/v1/accounts", { headers });
    const acctData = await acctRes.json();
    const accounts = (Array.isArray(acctData) ? acctData : []).map((a) => ({
      id: a.id,
      name: a.name,
      provider: a.provider,
      type: a.type,
      avatar: a.picture,
    }));
    const wsRes = await fetch("https://app.publer.com/api/v1/workspaces", { headers });
    const workspaces = await wsRes.json();
    const wsName = Array.isArray(workspaces) ? workspaces[0]?.name : "Unknown";
    res.json({ connected: accounts.length > 0, accounts, workspace: wsName });
  } catch (err) {
    res.status(500).json({ connected: false, accounts: [], message: err.message });
  }
});

app.get("/api/admin/social", adminAuthMiddleware, async (req, res) => {
  try {
    const { status, limit, offset } = req.query;
    const posts = await db.listSocialPosts({ status, limit: parseInt(limit) || 50, offset: parseInt(offset) || 0 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/admin/social/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const post = await db.getSocialPost(parseInt(req.params.id));
    if (!post) return res.status(404).json({ message: "Post hittades inte" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/admin/social/generate", adminAuthMiddleware, async (req, res) => {
  try {
    const { type, productKey, customPrompt } = req.body;
    console.log(`[Social] Generating ${type || "product"} post${productKey ? ` for ${productKey}` : ""}...`);

    const result = await socialGen.generatePost({ type, productKey, customPrompt });

    const post = await db.createSocialPost({
      platform: "all",
      post_type: result.type,
      image_path: result.imagePath,
      caption_sv: result.captionSv,
      caption_en: result.captionEn,
      caption_linkedin_sv: result.linkedinSv || null,
      caption_linkedin_en: result.linkedinEn || null,
      hashtags: result.hashtags,
      reference_images: result.referenceImages,
      prompt_used: result.promptUsed,
      product_ids: result.productIds,
      status: "draft",
    });

    console.log(`[Social] Post #${post.id} generated successfully`);
    res.json(post);
  } catch (err) {
    console.error("[Social] Generation error:", err);
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/admin/social/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const updated = await db.updateSocialPost(parseInt(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: "Post hittades inte" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/admin/social/:id", adminAuthMiddleware, async (req, res) => {
  try {
    await db.deleteSocialPost(parseInt(req.params.id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/admin/social/:id/schedule", adminAuthMiddleware, async (req, res) => {
  try {
    const { scheduled_at, push_to_publer } = req.body;
    const scheduledTime = scheduled_at || new Date(Date.now() + 3600_000).toISOString();

    if (push_to_publer && process.env.PUBLER_API_KEY) {
      const post = await db.getSocialPost(parseInt(req.params.id));
      if (!post) return res.status(404).json({ message: "Post hittades inte" });
      const results = await publishToPubler(post, { scheduled_at: scheduledTime });
      if (results.error) {
        return res.status(400).json({ message: results.error });
      }
    }

    const updated = await db.updateSocialPost(parseInt(req.params.id), {
      status: "scheduled",
      scheduled_at: scheduledTime,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/admin/social/:id/publish", adminAuthMiddleware, async (req, res) => {
  try {
    const post = await db.getSocialPost(parseInt(req.params.id));
    if (!post) return res.status(404).json({ message: "Post hittades inte" });

    const results = await publishToPubler(post);
    const updateFields = { status: "published", published_at: new Date().toISOString() };
    if (results.ig) updateFields.ig_post_id = results.ig;
    if (results.fb) updateFields.fb_post_id = results.fb;
    if (results.li) updateFields.li_post_id = results.li;
    if (results.error) {
      updateFields.error_message = results.error;
      updateFields.status = "failed";
    }

    const updated = await db.updateSocialPost(post.id, updateFields);
    console.log(`[Social] Post #${post.id}: ${updateFields.status}`);
    res.json(updated);
  } catch (err) {
    console.error("[Social] Publish error:", err);
    res.status(500).json({ message: err.message });
  }
});

async function publishToPubler(post, options = {}) {
  const fetch = (await import("node-fetch")).default;
  const FormData = (await import("form-data")).default;
  const fs = require("fs");
  const path = require("path");

  const apiKey = process.env.PUBLER_API_KEY;
  const workspaceId = process.env.PUBLER_WORKSPACE_ID;
  if (!apiKey) return { error: "PUBLER_API_KEY not configured" };
  if (!workspaceId) return { error: "PUBLER_WORKSPACE_ID not configured" };

  const headers = {
    Authorization: `Bearer-API ${apiKey}`,
    "Publer-Workspace-Id": workspaceId,
  };

  const results = {};

  // 1. Upload image
  let mediaId;
  const imagePath = post.image_path
    ? path.join(__dirname, "public", post.image_path.replace(/^\//, ""))
    : null;

  if (imagePath && fs.existsSync(imagePath)) {
    const form = new FormData();
    form.append("file", fs.createReadStream(imagePath));
    const uploadRes = await fetch("https://app.publer.com/api/v1/media", {
      method: "POST",
      headers: { ...headers, ...form.getHeaders() },
      body: form,
    });
    const media = await uploadRes.json();
    if (media.id) {
      mediaId = media.id;
    } else {
      results.error = `Media upload failed: ${JSON.stringify(media.errors || media)}`;
      return results;
    }
  } else {
    results.error = `Image file not found: ${imagePath}`;
    return results;
  }

  // 2. Get connected accounts
  const acctRes = await fetch("https://app.publer.com/api/v1/accounts", { headers });
  const acctData = await acctRes.json();
  const accounts = Array.isArray(acctData) ? acctData : [];

  if (accounts.length === 0) {
    results.error = "No social accounts connected in Publer. Connect Instagram/Facebook/LinkedIn first.";
    return results;
  }

  const SUPPORTED_PROVIDERS = ["instagram", "facebook", "linkedin"];
  const targetAccounts = accounts.filter((a) => {
    if (post.platform === "all" || post.platform === "both") return SUPPORTED_PROVIDERS.includes(a.provider);
    return a.provider === post.platform;
  });

  if (targetAccounts.length === 0) {
    results.error = `No ${post.platform} accounts connected in Publer`;
    return results;
  }

  const igFbCaption = `${post.caption_sv || ""}\n\n${post.hashtags || ""}`.trim();
  const linkedinCaption = `${post.caption_linkedin_sv || post.caption_sv || ""}\n\n${post.hashtags || ""}`.trim();

  // 3. Build post payload with per-network content
  const networks = {};
  for (const acc of targetAccounts) {
    const text = acc.provider === "linkedin" ? linkedinCaption : igFbCaption;
    networks[acc.provider] = {
      type: "photo",
      text,
      media: [{ id: mediaId, type: "image" }],
    };
  }

  const accountsList = targetAccounts.map((a) => {
    const entry = { id: a.id };
    if (options.scheduled_at) entry.scheduled_at = options.scheduled_at;
    return entry;
  });

  const isScheduled = !!options.scheduled_at;
  const endpoint = isScheduled
    ? "https://app.publer.com/api/v1/posts/schedule"
    : "https://app.publer.com/api/v1/posts/schedule/publish";

  const payload = {
    bulk: {
      state: "scheduled",
      posts: [{ networks, accounts: accountsList }],
    },
  };

  const postRes = await fetch(endpoint, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const postResult = await postRes.json();

  if (!postResult.job_id) {
    results.error = `Publer post failed: ${JSON.stringify(postResult.errors || postResult)}`;
    return results;
  }

  // 4. Poll job status
  let jobComplete = false;
  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const statusRes = await fetch(
      `https://app.publer.com/api/v1/job_status/${postResult.job_id}`,
      { headers }
    );
    const status = await statusRes.json();
    if (status.status === "complete" || status.data?.status === "complete") {
      jobComplete = true;
      const failures = status.payload?.failures || status.data?.result?.payload?.failures || {};
      if (Object.keys(failures).length > 0) {
        results.error = `Partial failures: ${JSON.stringify(failures)}`;
      }
      break;
    }
    if (status.status === "failed" || status.data?.status === "failed") {
      results.error = `Publer job failed: ${JSON.stringify(status)}`;
      return results;
    }
  }

  if (!jobComplete) {
    results.error = "Publer job timeout – check Publer dashboard";
  }

  for (const acc of targetAccounts) {
    if (acc.provider === "instagram") results.ig = postResult.job_id;
    if (acc.provider === "facebook") results.fb = postResult.job_id;
    if (acc.provider === "linkedin") results.li = postResult.job_id;
  }

  console.log(`[Social] Published via Publer to ${targetAccounts.map(a => a.provider).join(", ")} (job: ${postResult.job_id})`);
  return results;
}

async function processSocialMediaQueue() {
  try {
    const duePosts = await db.getDueSocialPosts();
    if (duePosts.length === 0) return;
    console.log(`[Social] Processing ${duePosts.length} scheduled posts...`);
    for (const post of duePosts) {
      try {
        const results = await publishToPubler(post);
        const updateFields = { status: "published", published_at: new Date().toISOString() };
        if (results.ig) updateFields.ig_post_id = results.ig;
        if (results.fb) updateFields.fb_post_id = results.fb;
        if (results.li) updateFields.li_post_id = results.li;
        if (results.error) {
          updateFields.error_message = results.error;
          updateFields.status = "failed";
        }
        await db.updateSocialPost(post.id, updateFields);
        console.log(`[Social] Post #${post.id}: ${updateFields.status}`);
      } catch (err) {
        await db.updateSocialPost(post.id, { status: "failed", error_message: err.message });
        console.error(`[Social] Post #${post.id} failed:`, err.message);
      }
    }
  } catch (err) {
    console.error("[Social] Queue processing error:", err.message);
  }
}

// ---- DAILY SOCIAL MEDIA AUTO-GENERATION ----

const POST_TYPES = ["product", "lifestyle", "mood"];

async function dailySocialMediaGeneration() {
  const hasImageGen = process.env.FAL_KEY || process.env.NANOBANANA_API_KEY;
  if (!process.env.GEMINI_API_KEY || !hasImageGen) {
    console.log("[Social] Daily generation skipped – GEMINI_API_KEY or image gen key not configured");
    return;
  }
  if (!process.env.PUBLER_API_KEY) {
    console.log("[Social] Daily generation skipped – PUBLER_API_KEY not configured");
    return;
  }

  try {
    const type = POST_TYPES[Math.floor(Math.random() * POST_TYPES.length)];
    console.log(`[Social] Daily auto-generation starting (type: ${type})...`);

    const result = await socialGen.generatePost({ type });

    const post = await db.createSocialPost({
      platform: "all",
      post_type: result.type,
      image_path: result.imagePath,
      caption_sv: result.captionSv,
      caption_en: result.captionEn,
      caption_linkedin_sv: result.linkedinSv || "",
      caption_linkedin_en: result.linkedinEn || "",
      hashtags: result.hashtags,
      reference_images: result.referenceImages || [],
      prompt_used: result.promptUsed,
      product_ids: result.productIds || [],
      status: "draft",
    });

    console.log(`[Social] Daily post #${post.id} generated. Publishing to Publer...`);

    const results = await publishToPubler(post);
    const updateFields = { status: "published", published_at: new Date().toISOString() };
    if (results.ig) updateFields.ig_post_id = results.ig;
    if (results.fb) updateFields.fb_post_id = results.fb;
    if (results.li) updateFields.li_post_id = results.li;
    if (results.error) {
      updateFields.status = "failed";
      updateFields.error_message = results.error;
      console.error(`[Social] Daily post #${post.id} publish failed:`, results.error);
    }

    await db.updateSocialPost(post.id, updateFields);
    console.log(`[Social] Daily post #${post.id}: ${updateFields.status}`);
  } catch (err) {
    console.error("[Social] Daily generation error:", err.message);
  }
}

function scheduleDailyAt(hour, minute, fn) {
  function scheduleNext() {
    const now = new Date();
    const target = new Date(now);
    target.setHours(hour, minute, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const ms = target - now;
    console.log(`[Social] Next daily generation scheduled for ${target.toISOString()} (in ${Math.round(ms / 60000)} min)`);
    setTimeout(() => {
      fn();
      scheduleNext();
    }, ms);
  }
  scheduleNext();
}

app.post("/api/admin/social/daily-generate", adminAuthMiddleware, async (req, res) => {
  try {
    await dailySocialMediaGeneration();
    res.json({ message: "Daglig generering körd manuellt" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- START ----

(async () => {
  try {
    await db.initSchema();
    await seedAutomationFlows();
    await seedAdminAccounts();
  } catch (err) {
    console.error("[DB] Schema init failed – running without database:", err.message);
  }
  app.listen(PORT, () => {
    console.log(`1753 SKINCARE backend kör på port ${PORT}`);
    if (!process.env.OPENAI_API_KEY) console.warn("[WARN] OPENAI_API_KEY saknas – hudanalys och chatt fungerar inte!");
    else console.log("[OK] OPENAI_API_KEY konfigurerad");
    if (!process.env.FORTNOX_ACCESS_TOKEN) console.log("[INFO] Fortnox ej ansluten – gå till /api/fortnox/auth för att auktorisera");
    else console.log("[OK] Fortnox-tokens konfigurerade");
    if (process.env.FAL_KEY) console.log("[OK] fal.ai (Nano Banana Pro) konfigurerad");
    else if (process.env.NANOBANANA_API_KEY) console.log("[OK] Nano Banana Pro konfigurerad");
    else console.log("[INFO] Ingen bildgenererings-API konfigurerad (FAL_KEY)");
    if (process.env.PUBLER_API_KEY) console.log("[OK] Publer konfigurerad");

    setInterval(processRecurringCharges, SIX_HOURS);
    setTimeout(processRecurringCharges, 60_000);
    console.log("[OK] Recurring subscription scheduler started (every 6h)");

    setInterval(processAutomationQueue, 60_000);
    setTimeout(processAutomationQueue, 30_000);
    console.log("[OK] Email automation engine started (every 60s)");

    setInterval(processSocialMediaQueue, 5 * 60_000);
    setTimeout(processSocialMediaQueue, 120_000);
    console.log("[OK] Social media scheduler started (every 5min)");

    scheduleDailyAt(10, 0, dailySocialMediaGeneration);
    console.log("[OK] Daily social media auto-generation scheduled (10:00 CET)");
  });
})();