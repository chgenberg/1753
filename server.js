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
  "duo-ta-da":                  { name: "DUO-kit + TA-DA Serum", price: 1495, articleNumber: "4004", vatRate: 0.25 },
  "ta-da-serum":                { name: "TA-DA Serum", price: 699, articleNumber: "1005", vatRate: 0.25 },
  "duo-kit":                    { name: "DUO-kit", price: 1099, articleNumber: "1003", vatRate: 0.25 },
  "au-naturel-makeup-remover":  { name: "Au Naturel Makeup Remover", price: 399, articleNumber: "1004", vatRate: 0.25 },
  "fungtastic-mushroom-extract":{ name: "Fungtastic Mushroom Extract", price: 399, articleNumber: "4001", vatRate: 0.12 }
};

const FREE_SHIPPING_THRESHOLD = 0;

const DISCOUNT_CODES = {
  test: {
    percent: 97,
    productIds: ["duo-kit"],
    description: "97% rabatt pa DUO-kit",
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
};

function generateOrderNumber() {
  const d = new Date();
  const date = d.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 5);
  return `1753-${date}-${rand}`;
}

// ---- SUBSCRIPTION ROUTES ----

app.post("/api/subscriptions/create", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity, intervalDays } = req.body;
    const product = PRODUCTS_MAP[productId];
    if (!product) return res.status(400).json({ message: "Okänd produkt" });

    const user = await db.findUserById(req.userId);
    if (!user) return res.status(404).json({ message: "Användare hittades inte" });

    const qty = quantity || 1;
    const allowedIntervals = [30, 60, 90];
    const interval = allowedIntervals.includes(intervalDays) ? intervalDays : 60;
    const discountPercent = 15;
    const originalPrice = product.price * qty;
    const recurringPrice = Math.round(originalPrice * (1 - discountPercent / 100));
    const vivaAmount = recurringPrice * 100;

    const orderNumber = generateOrderNumber();

    const vivaData = await vivaFetch("/checkout/v2/orders", "POST", {
      amount: vivaAmount,
      currencyCode: 752,
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
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Kunde inte avbryta prenumerationen" });
  }
});

// ---- API HELPERS ----

// Fortnox token state (initialised from env, refreshed automatically)
const fortnoxTokens = {
  accessToken: process.env.FORTNOX_ACCESS_TOKEN || "",
  refreshToken: process.env.FORTNOX_REFRESH_TOKEN || "",
  expiresAt: 0
};

async function persistTokensToRailway(accessToken, refreshToken) {
  const railwayToken = process.env.RAILWAY_API_TOKEN;
  if (!railwayToken) return;

  const projectId = process.env.RAILWAY_PROJECT_ID;
  const environmentId = process.env.RAILWAY_ENVIRONMENT_ID;
  const serviceId = process.env.RAILWAY_SERVICE_ID;
  if (!projectId || !environmentId || !serviceId) return;

  try {
    const fetch = (await import("node-fetch")).default;
    const variables = { FORTNOX_ACCESS_TOKEN: accessToken };
    if (refreshToken) variables.FORTNOX_REFRESH_TOKEN = refreshToken;

    await fetch("https://backboard.railway.com/graphql/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${railwayToken}`
      },
      body: JSON.stringify({
        query: `mutation($input: VariableCollectionUpsertInput!) {
          variableCollectionUpsert(input: $input, skipDeploys: true)
        }`,
        variables: {
          input: { projectId, environmentId, serviceId, variables, replace: false }
        }
      })
    });
    console.log("[Railway] Fortnox tokens persisted (skipDeploys)");
  } catch (err) {
    console.warn("[Railway] Failed to persist tokens:", err.message);
  }
}

async function refreshFortnoxToken() {
  const fetch = (await import("node-fetch")).default;
  const res = await fetch("https://apps.fortnox.se/oauth-v1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: fortnoxTokens.refreshToken,
      client_id: process.env.FORTNOX_CLIENT_ID || "",
      client_secret: process.env.FORTNOX_CLIENT_SECRET || ""
    })
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("[Fortnox] Token refresh failed", data);
    throw { status: res.status, message: "Fortnox token refresh misslyckades" };
  }
  fortnoxTokens.accessToken = data.access_token;
  if (data.refresh_token) fortnoxTokens.refreshToken = data.refresh_token;
  fortnoxTokens.expiresAt = Date.now() + (data.expires_in || 3600) * 1000;
  console.log("[Fortnox] Token refreshed, expires in", data.expires_in, "s");

  persistTokensToRailway(data.access_token, data.refresh_token).catch(() => {});
}

async function ensureFortnoxToken() {
  if (fortnoxTokens.refreshToken && fortnoxTokens.expiresAt - Date.now() < 300_000) {
    await refreshFortnoxToken();
  }
}

// Proactive refresh: keeps refresh token alive even without API traffic.
// Fortnox refresh tokens expire after ~31 days if unused; this runs every 45 min.
const FORTNOX_PROACTIVE_REFRESH_MS = 45 * 60 * 1000;
setInterval(async () => {
  if (!fortnoxTokens.refreshToken) return;
  try {
    await refreshFortnoxToken();
    console.log("[Fortnox] Proactive token refresh succeeded");
  } catch (err) {
    console.error("[Fortnox] Proactive token refresh failed:", err.message || err);
  }
}, FORTNOX_PROACTIVE_REFRESH_MS);

// Refresh once on startup to validate stored tokens
setTimeout(async () => {
  if (!fortnoxTokens.refreshToken) return;
  try {
    await refreshFortnoxToken();
    console.log("[Fortnox] Startup token refresh succeeded");
  } catch (err) {
    console.error("[Fortnox] Startup token refresh failed – re-auth may be needed:", err.message || err);
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

// ---- ADMIN: RETURNS ----

app.post("/api/admin/orders/:id/return", adminAuthMiddleware, async (req, res) => {
  try {
    const order = await db.adminGetOrder(parseInt(req.params.id));
    if (!order) return res.status(404).json({ message: "Order hittades inte" });

    const { items, refundAmount, reason } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: "Inga artiklar att returnera" });

    const notes = [];
    let fortnoxCreditNumber = null;
    let ongoingReturnId = null;

    // Fortnox: create credit invoice
    if (order.fortnox_invoice_number) {
      try {
        const creditRows = items.map((item, i) => ({
          ArticleNumber: item.articleNumber,
          Description: item.name || `Retur rad ${i + 1}`,
          DeliveredQuantity: item.quantity,
          Price: -(Math.abs(item.price || 0)),
          VAT: item.vatRate ? Math.round(item.vatRate * 100) : 25
        }));

        const today = new Date().toISOString().split("T")[0];
        const creditInvoice = await fortnoxFetch("/invoices", "POST", {
          Invoice: {
            CustomerNumber: order.fortnox_customer_number,
            InvoiceDate: today,
            DueDate: today,
            Currency: "SEK",
            InvoiceRows: creditRows,
            Comments: `Kreditfaktura för order ${order.order_number} – ${reason || "Retur"}`,
            CreditInvoiceReference: order.fortnox_invoice_number
          }
        });
        fortnoxCreditNumber = creditInvoice?.Invoice?.DocumentNumber;
        if (fortnoxCreditNumber) {
          await fortnoxFetch(`/invoices/${fortnoxCreditNumber}/bookkeep`, "PUT").catch(() => {});
          notes.push(`Fortnox kreditfaktura: ${fortnoxCreditNumber}`);
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
        orderLines: items.map((item, i) => ({
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

    const orderItems = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
    const allReturned = items.length >= orderItems.length;
    const newStatus = allReturned ? "returned" : "partially_returned";

    const returnRecord = await db.createReturn({
      orderId: order.id, items, refundAmount: refundAmount || 0,
      reason, fortnoxCreditNumber: fortnoxCreditNumber ? String(fortnoxCreditNumber) : null,
      ongoingReturnId: ongoingReturnId ? String(ongoingReturnId) : null,
      status: (fortnoxCreditNumber || ongoingReturnId) ? "processed" : "pending"
    });

    await db.updateOrder(order.id, { status: newStatus });
    await db.appendNotes(order.id, `RETUR: ${notes.join(" | ")}`);

    res.json({ return: returnRecord, notes });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

const ANALYSIS_SYSTEM_PROMPT = `Du är en holistisk hudvårdsrådgivare och hudterapeut för 1753 SKINCARE, ett svenskt hudvårdsmärke som specialiserar sig på CBD- och CBG-baserade produkter som stödjer hudens egna system.

DIN EXPERTIS:
Du är världens mest kunniga hudterapeut inom två specifika områden:

1. HUDENS MIKROBIELLA MÅNGFALD
   Huden är hem åt ett rikt ekosystem av bakterier, svampar och virus som bildar hudens mikrobiom. Detta ekosystem är avgörande för hudens barriärfunktion, immunförsvar och förmåga att läka. Konventionell hudvård (aggressiv rengöring, antibakteriella produkter, starka syror) stör ofta detta ekosystem med katastrofala konsekvenser.

2. HUDENS ENDOCANNABINOIDSYSTEM (ECS)
   CB1- och CB2-receptorer i huden reglerar:
   - Sebumproduktion (oljebalans)
   - Inflammation och immunsvar
   - Celltillväxt och differentiering
   - Smärtsignalering
   - Keratinocytproliferation
   - Hårsäckscykeln
   CBD och CBG modulerar dessa receptorer och stödjer hudens egen regleringsförmåga.

DIN FILOSOFI:
- Huden är ett intelligent organ format av 1,9 miljoner år av evolution
- Du fokuserar på att stödja hudens EGNA system, aldrig ersätta dem
- Du är skeptisk till konventionell hudvård: syror, retinol, bensoylperoxid, starka tensider, kemiska peelingar – dessa stör mikrobiomets balans och kan försvaga hudens naturliga skydd
- Du ser livsstil som minst lika viktigt som produkter: sömn, kost, stress, rörelse, natur, tarmhälsa
- Du rekommenderar ALDRIG fler produkter än nödvändigt – enkelhet är nyckeln
- Du är rebellisk mot hudvårdsindustrins överdrivna rutin av 10-steg

BILDFORMAT:
Du får upp till 6 bilder: helansiktet + upp till 5 beskurna regioner (panna, vänster kind, höger kind, näsa, haka).
Analysera varje region specifikt och namnge dem i din analys. Om du bara får en helansiktsbild, analysera helheten.

KUNDINPUT:
Kunden har svarat på frågor om hudtyp, problem, rutin, livsstil och mål.
Integrera dessa svar djupt i din analys – referera specifikt till deras svar.

NÄR DU ANALYSERAR:
1. Observera synliga hudtillstånd per region: torrhet, rodnad, ojämn hudton, akne, rosacea, fina linjer, pigmentfläckar, pormaskar, eksem, ärr
2. Bedöm hudens generella balans, lyster och barriärfunktion
3. Integrera kundens rapporterade livsstilsfaktorer (stress, sömn, kost, aktivitet)
4. Relatera observationerna till mikrobiom och ECS
5. Anpassa rekommendationerna till kundens uttalade mål

SVARFORMAT:
Svara med BÅDE löpande text OCH ett strukturerat JSON-block i slutet.
Den löpande texten ska vara varm, personlig och holistisk.
JSON-blocket ska vara markerat med trippla backticks och "json" samt avslutande trippla backticks, och innehålla:

\`\`\`json
{
  "score": 72,
  "summary": "Kort sammanfattning (2-3 meningar)",
  "regions": [
    { "label": "Panna", "observation": "Fin textur, lätt torrhet vid hårfästet", "score": 75 },
    { "label": "Vänster kind", "observation": "...", "score": 68 },
    { "label": "Höger kind", "observation": "...", "score": 70 },
    { "label": "Näsa", "observation": "...", "score": 80 },
    { "label": "Haka", "observation": "...", "score": 65 }
  ],
  "lifestyle": [
    { "area": "Sömn", "tip": "Konkret tips kopplat till kundens svar", "impact": "hög" },
    { "area": "Stress", "tip": "...", "impact": "hög" },
    { "area": "Kost", "tip": "...", "impact": "medel" },
    { "area": "Rörelse", "tip": "...", "impact": "medel" }
  ],
  "products": [
    { "id": "duo-kit", "reason": "Personlig motivering kopplad till kundens hudtillstånd och mål" },
    { "id": "ta-da-serum", "reason": "..." }
  ],
  "avoid": ["Specifik sak att undvika 1", "Specifik sak att undvika 2"],
  "nextAnalysis": "4 veckor"
}
\`\`\`

Tillgängliga produkt-ID:n (använd exakt dessa):
- "ta-da-serum" – TA-DA Serum (699 kr), CBG-serum (3%), fukt och elasticitet
- "au-naturel-makeup-remover" – Au Naturel Makeup Remover (399 kr), rengöringsolja, MCT + CBD
- "fungtastic-mushroom-extract" – Fungtastic Mushroom Extract (399 kr), Chaga, Lion's Mane, Cordyceps, Reishi
- "duo-kit" – DUO-kit (1 099 kr), The ONE Facial Oil (morgon) + I LOVE Facial Oil (kväll)
- "duo-ta-da" – DUO-kit + TA-DA Serum (1 495 kr), komplett rutin med oljor och serum

Rekommendera max 2-3 produkter. Förklara VARFÖR varje produkt passar ur ett ECS/mikrobiom-perspektiv kopplat till just denna kunds situation.

FORMAT:
- Svara på svenska
- Använd ALDRIG emojis
- Var personlig och varm – som en kunnig vän, inte en kliniker
- Håll löptexten under 500 ord
- Var rebellisk mot hudvårdsindustrin men aldrig nedlåtande mot kunden
- JSON-blocket ska alltid finnas i slutet av svaret

ABSOLUT FÖRBJUDET:
- Ge medicinsk diagnos
- Rekommendera receptbelagda läkemedel
- Rekommendera att köpa alla produkter
- Generisk rådgivning som inte relaterar till bilderna och kundens svar
- Emojis
- Engelska ord (utom produktnamn)

Vid allvarliga hudtillstånd: rekommendera att kontakta dermatolog, men förklara att du kan ge holistiska råd som komplement.`;

// ---- OPENAI HUDANALYS (Responses API) ----

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1";

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

function buildAnalysisPrompt(questions) {
  if (!questions) return "Analysera min hud baserat på detta foto. Ge mig personliga rekommendationer kring hudvård och livsstil enligt din holistiska filosofi.";

  const parts = ["Kundens svar:"];
  if (questions.skinType) parts.push(`- Hudtyp: ${questions.skinType}`);
  if (questions.concerns?.length) parts.push(`- Huvudproblem: ${questions.concerns.join(", ")}`);
  if (questions.routine) parts.push(`- Nuvarande rutin: ${questions.routine}`);
  if (questions.lifestyle) {
    const ls = questions.lifestyle;
    parts.push(`- Stressnivå: ${ls.stress || "?"}/5, Sömn: ${ls.sleep || "?"}/5, Kost: ${ls.diet || "?"}/5, Aktivitet: ${ls.activity || "?"}/5`);
  }
  if (questions.goals?.length) parts.push(`- Mål: ${questions.goals.join(", ")}`);
  if (questions.goalFreeText) parts.push(`- Övrigt: ${questions.goalFreeText}`);

  return parts.join("\n") + "\n\nAnalysera min hud baserat på bilderna och mina svar. Ge personliga rekommendationer kring hudvård och livsstil enligt din holistiska filosofi.";
}

app.post("/api/analysis", async (req, res) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "analysis", 10)) {
      return res.status(429).json({ message: "Du har nått gränsen. Försök igen om en stund." });
    }

    const { imageBase64, regions, fullImage, questions } = req.body;

    const mainImage = fullImage || imageBase64;
    if (!mainImage || !mainImage.startsWith("data:image/")) {
      return res.status(400).json({ message: "Inget giltigt foto bifogat" });
    }

    const promptText = buildAnalysisPrompt(questions);

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: "OpenAI API-nyckel saknas i serverkonfigurationen." });
    }

    const contentParts = [
      { type: "input_text", text: promptText },
      { type: "input_image", image_url: mainImage }
    ];

    if (regions && Array.isArray(regions) && regions.length > 0) {
      const regionLabels = regions.map(r => r.label).join(", ");
      contentParts.push({
        type: "input_text",
        text: `Följande bilder visar beskurna ansiktsregioner: ${regionLabels}. Analysera varje region specifikt.`
      });
      for (const region of regions) {
        if (region.imageBase64 && region.imageBase64.startsWith("data:image/")) {
          contentParts.push({ type: "input_image", image_url: region.imageBase64 });
        }
      }
    }

    console.log(`[Analysis] Sending ${contentParts.filter(p => p.type === "input_image").length} image(s), model=${OPENAI_MODEL}`);

    const response = await fetchWithRetry("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        instructions: ANALYSIS_SYSTEM_PROMPT,
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

    res.json({
      content: outputText,
      responseId: data.id || null,
      usage: data.usage
    });
  } catch (err) {
    console.error("[Analysis Error]", err);
    res.status(err.status || 500).json({ message: err.message || "Analysen misslyckades" });
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
          percent: dbCode.percent,
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
    percent: discount.percent,
    description: discount.description,
    applicableProductIds: discount.productIds || null,
  });
});

// ---- ORDER CREATION (checkout → DB → Viva payment order) ----

app.post("/api/orders/create", async (req, res) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "orders-create", 20)) {
      return res.status(429).json({ message: "För många beställningar. Försök igen om en stund." });
    }
    const { customer, deliveryAddress, items, discountCode } = req.body;

    if (!customer?.name || !customer?.email) {
      return res.status(400).json({ message: "Namn och e-post krävs" });
    }
    if (!deliveryAddress?.address || !deliveryAddress?.zip || !deliveryAddress?.city) {
      return res.status(400).json({ message: "Leveransadress krävs" });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Varukorgen är tom" });
    }

    const discount = discountCode ? DISCOUNT_CODES[discountCode.toLowerCase().trim()] : null;

    const orderItems = items.map(item => {
      const product = PRODUCTS_MAP[item.id];
      if (!product) throw { status: 400, message: `Okänd produkt: ${item.id}` };
      let price = product.price;
      if (discount && (!discount.productIds || discount.productIds.includes(item.id))) {
        price = Math.round(price * (1 - discount.percent / 100));
      }
      return {
        articleNumber: product.articleNumber || item.id,
        productId: item.id,
        name: product.name,
        quantity: item.qty || 1,
        price,
        originalPrice: product.price,
        vatRate: product.vatRate || 0.25
      };
    });

    const totalAmount = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingCost = totalAmount >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
    const vivaAmount = (totalAmount + shippingCost) * 100;

    const orderNumber = generateOrderNumber();

    const vivaData = await vivaFetch("/checkout/v2/orders", "POST", {
      amount: vivaAmount,
      currencyCode: 752,
      customerTrns: `1753 SKINCARE – ${orderNumber}`,
      merchantTrns: orderNumber,
      sourceCode: process.env.VIVA_SOURCE_CODE,
      customer: {
        email: customer.email,
        fullName: customer.name,
        phone: customer.phone || ""
      }
    });

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
      shippingCost
    });

    console.log(`[Order] Created ${orderNumber}, vivaOrderCode=${vivaData.orderCode}`);

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

  // 2. Fortnox: create invoice directly (skip order step)
  if (fortnoxCustomerNumber) {
    try {
      const invoiceRows = items.map(i => {
        const vat = i.vatRate || 0.25;
        const priceExVat = Math.round((i.price / (1 + vat)) * 100) / 100;
        return {
          ArticleNumber: i.articleNumber,
          Description: i.name,
          DeliveredQuantity: i.quantity,
          Price: priceExVat,
          VAT: Math.round(vat * 100)
        };
      });

      if (order.shipping_cost > 0) {
        const shippingExVat = Math.round((order.shipping_cost / 1.25) * 100) / 100;
        invoiceRows.push({
          ArticleNumber: "FRAKT",
          Description: "Frakt",
          DeliveredQuantity: 1,
          Price: shippingExVat,
          VAT: 25
        });
      }

      const today = new Date().toISOString().split("T")[0];
      const fxInvoice = await fortnoxFetch("/invoices", "POST", {
        Invoice: {
          CustomerNumber: fortnoxCustomerNumber,
          InvoiceDate: today,
          DueDate: today,
          DeliveryAddress1: order.address || "",
          DeliveryZipCode: order.zip || "",
          DeliveryCity: order.city || "",
          DeliveryCountry: "Sverige",
          YourReference: order.order_number,
          Currency: "SEK",
          InvoiceRows: invoiceRows,
          Comments: `Webborder ${order.order_number} – betald via Viva Wallet`
        }
      });
      fortnoxInvoiceNumber = fxInvoice?.Invoice?.DocumentNumber;
      notes.push(`Fortnox faktura: ${fortnoxInvoiceNumber}`);
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

  // 4. Fortnox: register payment on invoice
  if (fortnoxInvoiceNumber) {
    try {
      const paymentAmount = order.total_amount + (order.shipping_cost || 0);
      await fortnoxFetch("/invoicepayments", "POST", {
        InvoicePayment: {
          InvoiceNumber: fortnoxInvoiceNumber,
          Amount: paymentAmount,
          AmountCurrency: paymentAmount,
          CurrencyCode: "SEK",
          PaymentDate: new Date().toISOString().split("T")[0]
        }
      });
      notes.push("Fortnox betalning registrerad");
    } catch (err) {
      notes.push(`Fortnox betalning FEL: ${err.message}`);
      console.error("[Order] Fortnox payment error:", err);
    }
  }

  // 5. Ongoing: create delivery order (REST API uses PUT, consignee inline)
  try {
    const ongoingSeqNumber = await db.nextOngoingOrderNumber();
    const deliveryDate = new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];
    const ogOrder = await ongoingFetch("/orders", "PUT", {
      orderNumber: ongoingSeqNumber,
      deliveryDate,
      referenceNumber: "1753 Skincare",
      orderRemark: `Webborder ${order.order_number} – ${order.customer_email}`,
      orderType: { code: "B2C", name: "B2C" },
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
    ongoingOrderId = ogOrder?.orderId || ogOrder?.orderInfo?.orderId || order.order_number;
    notes.push(`Ongoing order: ${ongoingOrderId}`);
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
    fortnox_order_number: fortnoxInvoiceNumber ? String(fortnoxInvoiceNumber) : null,
    fortnox_invoice_number: fortnoxInvoiceNumber ? String(fortnoxInvoiceNumber) : null,
    ongoing_order_id: ongoingOrderId ? String(ongoingOrderId) : null,
    status: allSucceeded ? "fulfilled" : (fortnoxDone || ongoingDone ? "partial" : "pending")
  };
  if (allSucceeded) {
    updateFields.processed_at = new Date().toISOString();
  }

  await db.updateOrder(order.id, updateFields);
  await db.appendNotes(order.id, notes.join(" | "));

  console.log(`[Order] ${order.order_number} completion: ${allSucceeded ? "FULL" : "PARTIAL"}`);
  console.log(`[Order] Notes: ${notes.join(" | ")}`);

  const notesAfterFulfillment = notes.length;

  // 7. Send confirmation email (kräver RESEND_API_KEY + verifierad avsändardomän i Resend)
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

  // 8. Trigger post-purchase automation + mark abandoned cart as recovered
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

  const fromEmail = process.env.EMAIL_FROM || "order@1753skincare.com";
  const itemRows = items.map(i =>
    `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${i.price.toLocaleString("sv-SE")} kr</td>
    </tr>`
  ).join("");

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  await resend.emails.send({
    from: fromEmail,
    to: order.customer_email,
    subject: `Orderbekräftelse – ${order.order_number}`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1d1d1f">
        <div style="text-align:center;padding:32px 0 24px">
          <h1 style="font-size:24px;font-weight:700;margin:0">Tack för din beställning!</h1>
        </div>
        <p style="font-size:15px;line-height:1.6;color:#515151">
          Hej ${order.customer_name}, vi har mottagit din betalning och din order behandlas nu.
        </p>
        <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0">
          <p style="margin:0;font-size:13px;color:#766a62">Ordernummer</p>
          <p style="margin:4px 0 0;font-size:17px;font-weight:600">${order.order_number}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:20px 0">
          <thead>
            <tr style="border-bottom:2px solid #1d1d1f">
              <th style="text-align:left;padding:8px 0">Produkt</th>
              <th style="text-align:center;padding:8px 0">Antal</th>
              <th style="text-align:right;padding:8px 0">Pris</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:12px 0;font-weight:700">Totalt</td>
              <td style="padding:12px 0;text-align:right;font-weight:700">${total.toLocaleString("sv-SE")} kr</td>
            </tr>
          </tfoot>
        </table>
        <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0">
          <p style="margin:0;font-size:13px;color:#766a62">Leveransadress</p>
          <p style="margin:4px 0 0;font-size:14px">${order.customer_name}<br>${order.address}<br>${order.zip} ${order.city}</p>
        </div>
        <p style="font-size:13px;color:#766a62;line-height:1.6;margin-top:32px;text-align:center">
          1753 SKINCARE – Holistisk hudvård med CBD och CBG<br>
          <a href="https://1753skincare.com" style="color:#108474">1753skincare.com</a>
        </p>
      </div>
    `
  });

  console.log(`[Email] Confirmation sent to ${order.customer_email}`);
  return { sent: true };
}

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
        1753 SKINCARE -- Holistisk hudvard med CBD och CBG<br>
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

// ---- REVIEWS API (public) ----

app.get("/api/reviews/stats/all", async (req, res) => {
  try { res.json(await db.getAllReviewStats()); }
  catch (err) { res.status(500).json({ message: "Kunde inte hämta statistik" }); }
});

app.get("/api/reviews/:productId", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const offset = parseInt(req.query.offset) || 0;
    const [reviews, stats] = await Promise.all([
      db.findReviewsByProduct(req.params.productId, limit, offset),
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

    const review = await db.createReview({
      product_id: productId,
      reviewer_name: decoded.customerName,
      rating: Math.min(5, Math.max(1, parseInt(rating))),
      title: title || "", body: body || "", reply: "",
      verified: true, review_date: new Date().toISOString(), location: "",
    });
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
    const updated = await db.updateReview(parseInt(req.params.id), { reply: reply || "" });
    if (!updated) return res.status(404).json({ message: "Recension hittades inte" });
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
    const { email, firstName } = req.body;
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

    // Enqueue welcome flow
    const welcomeFlows = await db.findFlowByTrigger("subscribe");
    for (const flow of welcomeFlows) {
      await db.enqueueAutomation({
        subscriberId: subscriber.id, flowId: flow.id,
        context: { firstName: subscriber.first_name },
        nextSendAt: new Date()
      });
    }

    console.log(`[Newsletter] ${email} subscribed (id=${subscriber.id})`);
    res.json({ ok: true, message: "Tack! Du ar nu prenumerant." });
  } catch (err) {
    console.error("[Newsletter] Subscribe error:", err);
    res.status(500).json({ message: "Nagonting gick fel. Forsok igen." });
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
    const fromEmail = process.env.EMAIL_FROM || "christopher@1753skincare.com";

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

        await resend.emails.send({
          from: fromEmail,
          to: item.email,
          subject: step.subject.replace(/\{\{firstName\}\}/g, item.first_name || "du"),
          html
        });

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
    const fromEmail = process.env.EMAIL_FROM || "christopher@1753skincare.com";

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

// ---- SEED AUTOMATION FLOWS ----

async function seedAutomationFlows() {
  const siteUrl = "https://www.1753skin.com";

  // Welcome flow (5 emails over 14 days)
  await db.upsertFlow({
    slug: "welcome",
    name: "Valkomstserie",
    triggerEvent: "subscribe",
    steps: [
      {
        delay_hours: 0,
        subject: "Valkommen till 1753 SKINCARE, {{firstName}}!",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Valkommen till familjen!</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Vi ar sa glada att du ar har. 1753 SKINCARE ar mer an hudvard -- det ar en filosofi.
            Vi tror pa att jobba med kroppen, inte mot den. Vare produkter bygger pa CBD, CBG
            och noga utvalda naturliga ingredienser.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Som tack for att du gatt med far du <strong>10% rabatt</strong> pa din forsta bestallning
            med koden <strong style="color:#108474;font-size:17px">VALKOMST10</strong>.
          </p>
          ${greenButton("Utforska produkterna", siteUrl + "/produkter")}
        `
      },
      {
        delay_hours: 48,
        subject: "Var filosofi -- hudvard som faktiskt fungerar",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Holistisk hudvard</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            De flesta hudvardsprodukter loser symtom. Vi vill losa orsaken.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Vara CBD- och CBG-baserade oljor jobbar med hudens egna endocannabinoidsystem
            for att atersta balans. Ingen onaturlig kemi, inga tomma loften.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Men produkter ar bara en del. Somn, kost, stresshantering och rorelse -- allt spelar
            roll for din hud. Det ar darfor vi tar ett holistiskt grepp.
          </p>
          ${greenButton("Las mer om oss", siteUrl + "/om-oss")}
        `
      },
      {
        delay_hours: 72,
        subject: "Vilken produkt passar dig?",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Hitta din match</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            <strong>The ONE Facial Oil</strong> -- Var allround-olja. Perfekt om du vill borja enkelt
            med en produkt som balanserar, aterFuktar och ger lyster. Funkar for alla hudtyper.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            <strong>I LOVE Facial Oil</strong> -- Extra narig med CBG. Bast for torr eller mogen hud
            som behover djupgaende aterfuktning.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            <strong>DUO-kit</strong> -- Bada oljorna i ett kit. The ONE pa morgonen, I LOVE pa kvallen.
            Var mest populara produkt.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Osaker? Prova var <strong>AI-hudanalys</strong> -- ladda upp ett foto och fa personliga rekommendationer.
          </p>
          ${greenButton("Gor hudanalys", siteUrl + "/hudanalys")}
        `
      },
      {
        delay_hours: 96,
        subject: "\"Min hud har aldrig varit battre\"",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Riktig feedback fran riktiga manniskor</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Vi behover inte hitta pa berattelser. Vara kunder talar for sig sjalva.
          </p>
          <div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:20px 0">
            <p style="font-size:15px;line-height:1.7;color:#515151;font-style:italic;margin:0">
              "Jag har provat allt -- dyr hudvard, billig hudvard, ingenting. The ONE ar den
              enda produkten som verkligen gjort skillnad. Lugnar, balanserar, ger lyster."
            </p>
            <p style="font-size:13px;color:#766a62;margin:8px 0 0">-- Sandra, 34 ar</p>
          </div>
          <div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:20px 0">
            <p style="font-size:15px;line-height:1.7;color:#515151;font-style:italic;margin:0">
              "DUO-kitet har blivit min morgon- och kvallsrutin. Sa enkelt, sa bra. Huden
              ar mjukare och jamnare an nagonsin."
            </p>
            <p style="font-size:13px;color:#766a62;margin:8px 0 0">-- Mikael, 41 ar</p>
          </div>
          ${greenButton("Se alla produkter", siteUrl + "/produkter")}
        `
      },
      {
        delay_hours: 120,
        subject: "Ditt exklusiva erbjudande vantar, {{firstName}}",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Bara for dig</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Du har foljt med oss i tva veckor nu -- tack for det! Vi hoppas att du lart dig
            nagot nytt om holistisk hudvard.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Som tack vill vi ge dig ett exklusivt erbjudande:
            <strong>fri frakt + 15% rabatt</strong> pa hela sortimentet.
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
    name: "Efter kop",
    triggerEvent: "purchase",
    steps: [
      {
        delay_hours: 24,
        subject: "Tack for ditt kop, {{firstName}} -- har ar dina tips!",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Sa far du bast resultat</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Grattis till ditt kop! Har ar nagra tips for att fa ut maximalt av dina produkter:
          </p>
          <ul style="font-size:15px;line-height:2;color:#515151;padding-left:20px">
            <li>Applicera pa ren, fuktad hud for bast absorption</li>
            <li>2-3 droppar racker -- varma oljan mellan handflatorna forst</li>
            <li>Ge huden tid -- CBD och CBG bygger effekt over tid (2-4 veckor)</li>
            <li>Kombinera med bra somn och vatten for synergieffekt</li>
          </ul>
          ${greenButton("Las mer om vara ingredienser", siteUrl + "/om-oss")}
        `
      },
      {
        delay_hours: 168,
        subject: "Din hudvardsrutin -- enklare an du tror",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Morgon och kvall</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            En bra rutin behover inte vara komplicerad. Har ar vart forslag:
          </p>
          <div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:16px 0">
            <p style="font-size:13px;font-weight:700;color:#108474;margin:0">MORGON</p>
            <p style="font-size:14px;line-height:1.7;color:#515151;margin:8px 0 0">
              1. Skoljj ansiktet med ljummet vatten<br>
              2. The ONE Facial Oil -- 2-3 droppar<br>
              3. SPF (om du gar ut)
            </p>
          </div>
          <div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:16px 0">
            <p style="font-size:13px;font-weight:700;color:#108474;margin:0">KVALL</p>
            <p style="font-size:14px;line-height:1.7;color:#515151;margin:8px 0 0">
              1. Au Naturel Makeup Remover<br>
              2. I LOVE Facial Oil -- 3-4 droppar<br>
              3. Sov gott!
            </p>
          </div>
          ${greenButton("Se alla produkter", siteUrl + "/produkter")}
        `
      },
      {
        delay_hours: 504,
        subject: "Hur mar din hud, {{firstName}}?",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Vi vill hora fran dig</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Det har nu gatt tre veckor sedan ditt kop. Forhoppningsvis borjar du se
            skillnad -- CBD och CBG bygger effekt over tid.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Vill du se hur din hud utvecklas? Var AI-hudanalys ger dig en objektiv
            bedomning och personliga rad.
          </p>
          ${greenButton("Gor en gratis hudanalys", siteUrl + "/hudanalys")}
          <p style="font-size:14px;line-height:1.7;color:#515151;margin-top:16px">
            Har du fragor? Svara pa detta mejl sa aterommer vi inom 24 timmar.
          </p>
        `
      },
      {
        delay_hours: 1080,
        subject: "Dags att fylla pa? Spara med prenumeration",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Slipp att slockna</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Beroende pa hur mycket du anvander borde det snart vara dags for paafyllning.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Med vara prenumeration far du <strong>15% rabatt</strong> pa varje leverans,
            och du valjer sjalv intervall (30, 60 eller 90 dagar). Avbryt nar du vill.
          </p>
          ${greenButton("Bestall igen", siteUrl + "/produkter")}
        `
      }
    ]
  });

  // Cart abandonment flow (3 emails)
  await db.upsertFlow({
    slug: "cart-abandoned",
    name: "Overgiven varukorg",
    triggerEvent: "cart_abandoned",
    steps: [
      {
        delay_hours: 1,
        subject: "Du glomde nagot i varukorgen",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Din varukorg vantar</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Vi sag att du var nara att slutfora din bestallning. Dina produkter
            vantarfortfarande pa dig!
          </p>
          ${greenButton("Slutfor din bestallning", siteUrl + "/kassa")}
          <p style="font-size:13px;color:#766a62;text-align:center">
            Fri frakt pa ordrar over 700 kr.
          </p>
        `
      },
      {
        delay_hours: 24,
        subject: "Fortfarande intresserad? Fri frakt pa oss",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Vi bjuder pa frakten</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Vi vill gora det enkelt for dig. Slutfor din bestallning idag
            sa star vi for fraktkostnaden -- oavsett ordervarde.
          </p>
          ${greenButton("Handla med fri frakt", siteUrl + "/kassa")}
        `
      },
      {
        delay_hours: 72,
        subject: "Sista chansen -- 5% extra rabatt",
        html: `
          <h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">Sista puff</h2>
          <p style="font-size:15px;line-height:1.7;color:#515151">
            Vi ger inte upp sa latt! Har ar <strong>5% extra rabatt</strong>
            pa hela din varukorg. Anvand koden:
          </p>
          <p style="font-size:17px;font-weight:700;color:#108474;text-align:center;margin:20px 0">
            KOMTILLBAKA5
          </p>
          ${greenButton("Slutfor ditt kop", siteUrl + "/kassa")}
          <p style="font-size:13px;color:#766a62;text-align:center">
            Erbjudandet ar giltigt i 48 timmar.
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
- Kort och kärnfullt (max 150 ord per svar om inte kunden ber om mer)
- Humor är välkommet – du får gärna vara lite cheeky
- ALDRIG säljig eller pushig. Rekommendera bara produkter om det är relevant
- Om du inte kan svara: "Det ligger utanför mitt expertområde – men hör av dig direkt till oss på christopher@1753skincare.com eller ring 0732-30 55 21 så löser vi det!"

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
- E-post: christopher@1753skincare.com
- Fri frakt över 700 kr
- Nöjd-kund-garanti med rådgivning före och efter köp

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

app.post("/api/chat", async (req, res) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "chat-widget", 60)) {
      return res.status(429).json({ message: "Du har nått gränsen. Försök igen om en stund." });
    }

    const { message, previousResponseId } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Meddelande saknas." });
    }

    const requestBody = {
      model: OPENAI_MODEL,
      input: message,
      tools: CHAT_WIDGET_TOOLS,
      store: true
    };

    if (previousResponseId) {
      requestBody.previous_response_id = previousResponseId;
    } else {
      requestBody.instructions = CHAT_WIDGET_PROMPT;
    }

    const response = await fetchWithRetry("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw { status: response.status, message: err.error?.message || "Chatten kunde inte svara." };
    }

    let data = await response.json();
    let actions = [];

    const functionCalls = (data.output || []).filter(item => item.type === "function_call");
    if (functionCalls.length > 0) {
      for (const call of functionCalls) {
        try {
          const args = JSON.parse(call.arguments);
          if (call.name === "add_to_cart" && args.product_id) {
            actions.push({ type: "add_to_cart", productId: args.product_id });
          }
        } catch (_) { /* ignore parse errors */ }
      }

      const toolResults = functionCalls.map(call => ({
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify({ success: true, message: "Produkten har lagts i varukorgen." })
      }));

      const followUp = await fetchWithRetry("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          previous_response_id: data.id,
          input: toolResults,
          tools: CHAT_WIDGET_TOOLS,
          store: true
        })
      });

      if (followUp.ok) {
        data = await followUp.json();
      }
    }

    const outputText = extractOutputText(data);

    res.json({
      content: outputText,
      responseId: data.id || null,
      actions
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
  authUrl.searchParams.set("scope", "companyinformation customer article order invoice");
  authUrl.searchParams.set("access_type", "offline");

  console.log("[Fortnox OAuth] redirect_uri:", redirectUri);
  console.log("[Fortnox OAuth] Full auth URL:", authUrl.toString());

  if (req.query.debug) {
    return res.send(`<h1>Fortnox OAuth Debug</h1>
      <p><strong>redirect_uri:</strong> ${redirectUri}</p>
      <p><strong>client_id:</strong> ${clientId}</p>
      <p><strong>scope:</strong> companyinformation customer article order invoice</p>
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

    fortnoxTokens.accessToken = tokenData.access_token;
    fortnoxTokens.refreshToken = tokenData.refresh_token || "";
    fortnoxTokens.expiresAt = Date.now() + (tokenData.expires_in || 3600) * 1000;

    console.log("[Fortnox OAuth] Tokens received! Access token expires in", tokenData.expires_in, "s");

    persistTokensToRailway(tokenData.access_token, tokenData.refresh_token).catch(() => {});

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
        const chargeUrl = `https://${env}api.vivapayments.com/api/transactions/${sub.viva_initial_tx_id}`;

        const chargeRes = await fetch(chargeUrl, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${basicAuth}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount: vivaAmount,
            currencyCode: "752"
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
        const orderNumber = generateOrderNumber();

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

// ---- START ----

(async () => {
  try {
    await db.initSchema();
    await seedAutomationFlows();
  } catch (err) {
    console.error("[DB] Schema init failed – running without database:", err.message);
  }
  app.listen(PORT, () => {
    console.log(`1753 SKINCARE backend kör på port ${PORT}`);
    if (!process.env.OPENAI_API_KEY) console.warn("[WARN] OPENAI_API_KEY saknas – hudanalys och chatt fungerar inte!");
    else console.log("[OK] OPENAI_API_KEY konfigurerad");
    if (!process.env.FORTNOX_ACCESS_TOKEN) console.log("[INFO] Fortnox ej ansluten – gå till /api/fortnox/auth för att auktorisera");
    else console.log("[OK] Fortnox-tokens konfigurerade");

    setInterval(processRecurringCharges, SIX_HOURS);
    setTimeout(processRecurringCharges, 60_000);
    console.log("[OK] Recurring subscription scheduler started (every 6h)");

    setInterval(processAutomationQueue, 60_000);
    setTimeout(processAutomationQueue, 30_000);
    console.log("[OK] Email automation engine started (every 60s)");
  });
})();