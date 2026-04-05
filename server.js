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
app.use(express.json({ limit: "20mb" }));
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
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "Nytt lösenord måste vara minst 6 tecken" });
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
  "duo-kit":                    { name: "DUO-kit (The ONE + I LOVE Facial Oil)", price: 1099, articleNumber: "1003", vatRate: 0.25 },
  "i-love-facial-oil":          { name: "I LOVE Facial Oil", price: 849, articleNumber: "3001", vatRate: 0.25 },
  "the-one-facial-oil":         { name: "The ONE Facial Oil", price: 649, articleNumber: "1001", vatRate: 0.25 },
  "au-naturel-makeup-remover":  { name: "Au Naturel Makeup Remover", price: 399, articleNumber: "1004", vatRate: 0.25 },
  "fungtastic-mushroom-extract":{ name: "Fungtastic Mushroom Extract", price: 399, articleNumber: "4001", vatRate: 0.12 }
};

const FREE_SHIPPING_THRESHOLD = 0;

const DISCOUNT_CODES = {
  test: {
    percent: 97,
    productIds: ["duo-kit"],
    description: "97% rabatt på DUO-kit",
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
    const { productId, quantity } = req.body;
    const product = PRODUCTS_MAP[productId];
    if (!product) return res.status(400).json({ message: "Okänd produkt" });

    const user = await db.findUserById(req.userId);
    if (!user) return res.status(404).json({ message: "Användare hittades inte" });

    const qty = quantity || 1;
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
        phone: user.phone || ""
      }
    });

    await db.createSubscription({
      userId: req.userId,
      productId,
      productName: product.name,
      quantity: qty,
      intervalDays: 60,
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
  expiresAt: Date.now() + 3600_000
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
          variableCollectionUpsert(input: $input)
        }`,
        variables: {
          input: { projectId, environmentId, serviceId, variables, replace: false }
        }
      })
    });
    console.log("[Railway] Fortnox tokens persisted to env vars");
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
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    console.error("[Viva API Error]", res.status, url, JSON.stringify(data));
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
        const data = await ongoingFetch("/articles", "PUT", article);
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
    { "id": "the-one-facial-oil", "reason": "Personlig motivering kopplad till kundens hudtillstånd och mål" },
    { "id": "ta-da-serum", "reason": "..." }
  ],
  "avoid": ["Specifik sak att undvika 1", "Specifik sak att undvika 2"],
  "nextAnalysis": "4 veckor"
}
\`\`\`

Tillgängliga produkt-ID:n (använd exakt dessa):
- "the-one-facial-oil" – The ONE Facial Oil (649 kr), daglig ansiktsolja, 10% CBD, 0.2% CBG
- "i-love-facial-oil" – I LOVE Facial Oil (849 kr), nattolja, 5% CBG, 10% CBD
- "ta-da-serum" – TA-DA Serum (699 kr), CBG-serum (3%), fukt och elasticitet
- "au-naturel-makeup-remover" – Au Naturel Makeup Remover (399 kr), rengöringsolja, MCT + CBD
- "fungtastic-mushroom-extract" – Fungtastic Mushroom Extract (399 kr), Chaga, Lion's Mane, Cordyceps, Reishi
- "duo-kit" – DUO-kit (1 099 kr), The ONE + I LOVE tillsammans
- "duo-ta-da" – DUO-kit + TA-DA Serum (1 495 kr), komplett rutin

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

app.post("/api/discount/validate", (req, res) => {
  const { code, items } = req.body;
  if (!code) return res.status(400).json({ message: "Ange en rabattkod" });

  const discount = DISCOUNT_CODES[code.toLowerCase().trim()];
  if (!discount) return res.status(404).json({ message: "Ogiltig rabattkod" });

  const applicableItems = (items || []).filter(i => !discount.productIds || discount.productIds.includes(i.id));
  if (applicableItems.length === 0) {
    return res.status(400).json({ message: "Rabattkoden gäller inte för dessa produkter" });
  }

  res.json({
    code: code.toLowerCase().trim(),
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
  console.log("[Viva Webhook]", event.EventTypeId, JSON.stringify(event.EventData || {}).slice(0, 200));

  const vivaKey = process.env.VIVA_VERIFICATION_KEY;
  if (vivaKey) {
    const sig256 = req.headers["viva-signature-256"] || "";
    const sig1 = req.headers["viva-signature"] || "";
    const rawBody = JSON.stringify(req.body);
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

  // 5. Ongoing: create delivery order
  try {
    const ogOrder = await ongoingFetch("/orders", "PUT", {
      orderNumber: order.order_number,
      goodsOwnerOrderId: order.order_number,
      consignee: {
        name: order.customer_name,
        address1: order.address || "",
        postCode: order.zip || "",
        city: order.city || "",
        countryCode: order.country_code || "SE",
        email: order.customer_email,
        mobilePhone: order.customer_phone || ""
      },
      orderLines: items.map((item, i) => ({
        rowNumber: i + 1,
        articleNumber: item.articleNumber,
        numberOfItems: item.quantity
      }))
    });
    ongoingOrderId = ogOrder?.orderInfo?.orderId || ogOrder?.orderId || order.order_number;
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

  // 7. Send confirmation email
  try {
    await sendOrderConfirmation(order, items);
    notes.push("Bekräftelsemail skickat");
  } catch (err) {
    notes.push(`Email FEL: ${err.message}`);
    console.error("[Order] Email error:", err);
  }

  return { fortnoxInvoiceNumber, ongoingOrderId, notes };
}

// ---- ORDER CONFIRMATION EMAIL ----

async function sendOrderConfirmation(order, items) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[Email] RESEND_API_KEY not set, skipping");
    return;
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

const CHAT_WIDGET_PROMPT = `Du är 1753 SKINCAREs virtuella hudvårdsrådgivare – tänk dig en kunnig vän som brinner för holistisk hudvård, med en gnutta humor och mycket värme.

DITT SÄTT:
- Alltid svenska. Aldrig emojis.
- Varm, personlig, lite rebellisk mot hudvårdsindustrin
- Holistisk syn: hud, livsstil, endocannabinoidsystem (ECS), mikrobiom
- Kort och kärnfullt (max 150 ord per svar om inte kunden ber om mer)
- Humor är välkommet – du får gärna vara lite cheeky
- ALDRIG säljig eller pushig. Rekommendera bara produkter om det är relevant
- Om du inte kan svara: "Det ligger utanför mitt expertområde – men hör av dig direkt till oss på hej@1753skincare.com eller ring 0732-30 55 21 så löser vi det!"

DU KAN HJÄLPA MED:
- Produktfrågor (ingredienser, användning, val av produkt)
- Hudvård, hudhälsa, hudtyper
- Livsstilstips (sömn, kost, stress, tarmhälsa)
- Endocannabinoidsystemet och CBD/CBG för huden
- Hudens mikrobiom
- Orderfrågor (hänvisa till kontakt för specifika ordrar)
- Lägga produkter i varukorgen åt kunden

PRODUKTKATALOG:
1. "The ONE Facial Oil" (id: the-one-facial-oil, 649 kr) – Daglig ansiktsolja, 10% CBD, 0.2% CBG. Skyddar och återfuktar. 10 ml.
2. "I LOVE Facial Oil" (id: i-love-facial-oil, 849 kr) – Nattolja, 5% CBG, 10% CBD. Reparerar och djupåterfuktar. 10 ml.
3. "TA-DA Serum" (id: ta-da-serum, 699 kr) – CBG-serum (3%). Boostar fukt och elasticitet. 30 ml.
4. "Au Naturel Makeup Remover" (id: au-naturel-makeup-remover, 399 kr) – Rengöringsolja, MCT + CBD. 100 ml.
5. "Fungtastic Mushroom Extract" (id: fungtastic-mushroom-extract, 399 kr) – Chaga, Lion's Mane, Cordyceps, Reishi. 60 kapslar.
6. "DUO-kit" (id: duo-kit, 1 099 kr) – The ONE + I LOVE Facial Oil tillsammans.
7. "DUO-kit + TA-DA Serum" (id: duo-ta-da, 1 495 kr) – Komplett rutin: dag, natt, serum.

PRODUKTMATCHNING:
- Torr/känslig hud → The ONE + TA-DA
- Akne/fet hud → TA-DA (CBG reglerar sebum via ECS)
- Åldrande/fina linjer → I LOVE (nattlig reparation)
- Rodnad/rosacea → The ONE (CBD lugnar inflammation)
- Dålig rengöring → Au Naturel (bevarar mikrobiom)
- Generell hälsa → Fungtastic
- Komplett rutin → DUO-kit + TA-DA

Om kunden vill ha en produkt, använd add_to_cart-funktionen.

OM 1753 SKINCARE:
- Svenskt familjeföretag, grundat av Christopher och Ebba Genberg
- Adress: Södra Skjutbanevägen 10, 439 55 Åsa
- Telefon: 0732-30 55 21
- E-post: hej@1753skincare.com
- Fri frakt över 700 kr
- Nöjd-kund-garanti med rådgivning före och efter köp

ABSOLUT FÖRBJUDET:
- Medicinsk rådgivning eller diagnos
- Rekommendera receptbelagda läkemedel
- Prata om konkurrenter
- Engelska ord (utom produktnamn)
- Emojis`;

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
          enum: ["duo-ta-da", "ta-da-serum", "duo-kit", "i-love-facial-oil", "the-one-facial-oil", "au-naturel-makeup-remover", "fungtastic-mushroom-extract"],
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

        const newOrder = await db.createOrder({
          orderNumber,
          customerName: sub.product_name,
          customerEmail: (await db.findUserById(sub.user_id))?.email || "",
          customerPhone: "",
          address: "",
          zip: "",
          city: "",
          vivaOrderCode: null,
          merchantTrns: `RSUB-${orderNumber}`,
          items: [{ id: sub.product_id, name: sub.product_name, qty: sub.quantity, price: sub.recurring_price }],
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

// ---- START ----

(async () => {
  try {
    await db.initSchema();
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
  });
})();
