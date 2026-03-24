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

let bcrypt, jwt;
try { bcrypt = require("bcryptjs"); } catch { bcrypt = null; }
try { jwt = require("jsonwebtoken"); } catch { jwt = null; }

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static("."));

const PORT = process.env.BACKEND_PORT || 3001;
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

// ---- USER STORE (in-memory, ersätt med databas i produktion) ----

const users = [];

function findUserByEmail(email) {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

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
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Namn, e-post och lösenord krävs" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Lösenordet måste vara minst 6 tecken" });
    }
    if (findUserByEmail(email)) {
      return res.status(409).json({ message: "E-postadressen är redan registrerad" });
    }

    const hashedPassword = bcrypt ? await bcrypt.hash(password, 10) : password;
    const user = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      phone: phone || "",
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      loyaltyPoints: 0,
      tier: "Brons",
      orders: [],
      analyses: [],
      wishlist: [],
      subscriptions: [],
      routine: null,
      notifications: { email: true, sms: false, offers: true }
    };

    users.push(user);
    const token = generateToken(user);
    const { password: _, ...safeUser } = user;

    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ message: err.message || "Registreringen misslyckades" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "E-post och lösenord krävs" });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Fel e-post eller lösenord" });
    }

    const valid = bcrypt ? await bcrypt.compare(password, user.password) : password === user.password;
    if (!valid) {
      return res.status(401).json({ message: "Fel e-post eller lösenord" });
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;

    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ message: err.message || "Inloggningen misslyckades" });
  }
});

app.get("/api/auth/profile", authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: "Användare hittades inte" });
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

app.put("/api/auth/profile", authMiddleware, async (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: "Användare hittades inte" });

  const { name, phone, notifications } = req.body;
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (notifications) user.notifications = { ...user.notifications, ...notifications };

  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

app.put("/api/auth/password", authMiddleware, async (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: "Användare hittades inte" });

  const { currentPassword, newPassword } = req.body;
  const valid = bcrypt ? await bcrypt.compare(currentPassword, user.password) : currentPassword === user.password;
  if (!valid) {
    return res.status(401).json({ message: "Nuvarande lösenord är felaktigt" });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "Nytt lösenord måste vara minst 6 tecken" });
  }

  user.password = bcrypt ? await bcrypt.hash(newPassword, 10) : newPassword;
  res.json({ message: "Lösenordet har ändrats" });
});

// ---- DASHBOARD DATA ROUTES ----

app.get("/api/dashboard/orders", authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: "Användare hittades inte" });
  res.json(user.orders || []);
});

app.get("/api/dashboard/stats", authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: "Användare hittades inte" });

  res.json({
    loyaltyPoints: user.loyaltyPoints || 0,
    tier: user.tier || "Brons",
    orderCount: (user.orders || []).length,
    analysisCount: (user.analyses || []).length,
    wishlistCount: (user.wishlist || []).length,
    memberSince: user.createdAt
  });
});

app.post("/api/dashboard/wishlist", authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: "Användare hittades inte" });

  const { productId, action } = req.body;
  if (!user.wishlist) user.wishlist = [];

  if (action === "add" && !user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
  } else if (action === "remove") {
    user.wishlist = user.wishlist.filter(id => id !== productId);
  }

  res.json(user.wishlist);
});

// ---- API HELPERS ----

async function fortnoxFetch(path, method, body) {
  const fetch = (await import("node-fetch")).default;
  const url = `https://api.fortnox.se/3${path}`;
  const opts = {
    method: method || "GET",
    headers: {
      "Authorization": `Bearer ${process.env.FORTNOX_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const data = await res.json();
  if (!res.ok) throw { status: res.status, message: data?.ErrorInformation?.message || "Fortnox API error" };
  return data;
}

async function ongoingFetch(path, method, body) {
  const fetch = (await import("node-fetch")).default;
  const baseUrl = process.env.ONGOING_BASE_URL;
  const url = `${baseUrl}${path}`;
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
  const data = await res.json();
  if (!res.ok) throw { status: res.status, message: data?.message || "Ongoing API error" };
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
  if (!res.ok) throw { status: res.status, message: "Viva auth error" };
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
  const data = await res.json();
  if (!res.ok) throw { status: res.status, message: data?.message || "Viva API error" };
  return data;
}

// ---- FORTNOX ROUTES ----

app.post("/api/fortnox/customers", async (req, res) => {
  try {
    const data = await fortnoxFetch("/customers", "POST", req.body);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get("/api/fortnox/customers/:id", async (req, res) => {
  try {
    const data = await fortnoxFetch(`/customers/${req.params.id}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.post("/api/fortnox/orders", async (req, res) => {
  try {
    const data = await fortnoxFetch("/orders", "POST", req.body);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get("/api/fortnox/orders/:id", async (req, res) => {
  try {
    const data = await fortnoxFetch(`/orders/${req.params.id}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.post("/api/fortnox/invoices", async (req, res) => {
  try {
    const data = await fortnoxFetch("/invoices", "POST", req.body);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.post("/api/fortnox/articles/sync", async (req, res) => {
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

app.post("/api/fortnox/invoicepayments", async (req, res) => {
  try {
    const data = await fortnoxFetch("/invoicepayments", "POST", req.body);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

// ---- ONGOING ROUTES ----

app.get("/api/ongoing/stock", async (req, res) => {
  try {
    const data = await ongoingFetch("/inventoryBalances");
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get("/api/ongoing/stock/:articleNumber", async (req, res) => {
  try {
    const data = await ongoingFetch(`/inventoryBalances?articleNumber=${req.params.articleNumber}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.post("/api/ongoing/articles/sync", async (req, res) => {
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

app.post("/api/ongoing/orders", async (req, res) => {
  try {
    const data = await ongoingFetch("/orders", "PUT", req.body);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get("/api/ongoing/orders/:orderNumber", async (req, res) => {
  try {
    const data = await ongoingFetch(`/orders?goodsOwnerOrderId=${req.params.orderNumber}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get("/api/ongoing/shipping-methods", async (req, res) => {
  try {
    const data = await ongoingFetch("/transporterContracts");
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

// ---- OPENAI (HUDANALYS) ROUTE ----

app.post("/api/analysis", async (req, res) => {
  try {
    const { imageBase64, prompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ message: "Inget foto bifogat" });
    }

    const response = await fetchWithRetry("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 1500,
        messages: [
          {
            role: "system",
            content: req.body.systemPrompt || ""
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt || "Analysera min hud baserat på detta foto."
              },
              {
                type: "image_url",
                image_url: { url: imageBase64, detail: "high" }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw { status: response.status, message: err.error?.message || "OpenAI API error" };
    }

    const data = await response.json();
    res.json({
      content: data.choices?.[0]?.message?.content || "Analysen kunde inte slutföras.",
      usage: data.usage
    });
  } catch (err) {
    console.error("[Analysis Error]", err);
    res.status(err.status || 500).json({ message: err.message || "Analysen misslyckades" });
  }
});

// ---- VIVA WALLET ROUTES ----

app.post("/api/vivawallet/payment-order", async (req, res) => {
  try {
    const data = await vivaFetch("/checkout/v2/orders", "POST", {
      amount: req.body.amount,
      currencyCode: 752, // SEK
      customerTrns: req.body.customerTrns,
      merchantTrns: req.body.merchantTrns,
      sourceCode: process.env.VIVA_SOURCE_CODE,
      customer: {
        email: req.body.customerEmail,
        fullName: req.body.customerName,
        phone: req.body.customerPhone
      }
    });
    res.json({ orderCode: data.orderCode });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get("/api/vivawallet/verify/:transactionId", async (req, res) => {
  try {
    const data = await vivaFetch(`/checkout/v2/transactions/${req.params.transactionId}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

// Webhook endpoint for Viva Wallet
app.post("/api/vivawallet/webhook", async (req, res) => {
  const event = req.body;
  console.log("[Viva Webhook]", event.EventTypeId, event.EventData?.TransactionId);

  // EventTypeId 1796 = Transaction Payment Created
  if (event.EventTypeId === 1796) {
    const transactionId = event.EventData?.TransactionId;
    const merchantTrns = event.EventData?.MerchantTrns;

    // Här triggas orderflödet:
    // 1. Skapa order i Fortnox
    // 2. Skapa order i Ongoing WMS
    // 3. Skapa faktura i Fortnox
    // 4. Registrera betalning i Fortnox
    console.log(`[Order] Betalning mottagen: ${transactionId}, ref: ${merchantTrns}`);
  }

  res.json({ status: "ok" });
});

// ---- ORDER FLOW (komplett) ----

app.post("/api/checkout/complete", async (req, res) => {
  // Komplett kassaflöde: kund → Fortnox + Ongoing + betalning
  try {
    const { customer, items, deliveryAddress, transactionId } = req.body;

    // 1. Skapa/hämta kund i Fortnox
    let fortnoxCustomer;
    try {
      fortnoxCustomer = await fortnoxFetch(`/customers?filter=email&email=${encodeURIComponent(customer.email)}`);
    } catch {
      fortnoxCustomer = await fortnoxFetch("/customers", "POST", {
        Customer: {
          Name: customer.name,
          Email: customer.email,
          Phone: customer.phone || "",
          Address1: deliveryAddress.address,
          ZipCode: deliveryAddress.zip,
          City: deliveryAddress.city,
          CountryCode: "SE"
        }
      });
    }

    const customerNumber = fortnoxCustomer?.Customer?.CustomerNumber ||
                           fortnoxCustomer?.Customers?.[0]?.CustomerNumber;

    // 2. Skapa order i Fortnox
    const fortnoxOrder = await fortnoxFetch("/orders", "POST", {
      Order: {
        CustomerNumber: customerNumber,
        OrderDate: new Date().toISOString().split("T")[0],
        Currency: "SEK",
        OrderRows: items.map(i => ({
          ArticleNumber: i.articleNumber,
          OrderedQuantity: i.quantity,
          Price: i.price
        }))
      }
    });

    const orderNumber = fortnoxOrder?.Order?.OrderNumber;

    // 3. Skapa order i Ongoing WMS
    await ongoingFetch("/orders", "PUT", {
      orderNumber: String(orderNumber),
      goodsOwnerOrderId: String(orderNumber),
      consignee: {
        name: customer.name,
        address1: deliveryAddress.address,
        postCode: deliveryAddress.zip,
        city: deliveryAddress.city,
        countryCode: "SE",
        email: customer.email,
        mobilePhone: customer.phone || ""
      },
      orderLines: items.map((item, i) => ({
        rowNumber: i + 1,
        articleNumber: item.articleNumber,
        numberOfItems: item.quantity
      }))
    });

    // 4. Skapa faktura från order i Fortnox
    const invoice = await fortnoxFetch(`/orders/${orderNumber}/createinvoice`, "PUT");
    const invoiceNumber = invoice?.Invoice?.InvoiceNumber;

    // 5. Registrera betalning i Fortnox
    if (invoiceNumber) {
      const totalAmount = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      await fortnoxFetch("/invoicepayments", "POST", {
        InvoicePayment: {
          InvoiceNumber: invoiceNumber,
          Amount: totalAmount,
          AmountCurrency: totalAmount,
          CurrencyCode: "SEK",
          PaymentDate: new Date().toISOString().split("T")[0]
        }
      });
    }

    res.json({
      success: true,
      orderNumber,
      invoiceNumber,
      message: "Beställningen är registrerad"
    });

  } catch (err) {
    console.error("[Checkout Error]", err);
    res.status(500).json({ message: err.message || "Beställningen kunde inte slutföras" });
  }
});

// ---- START ----

app.listen(PORT, () => {
  console.log(`1753 SKINCARE backend kör på port ${PORT}`);
});
