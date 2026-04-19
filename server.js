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

app.get("/robots.txt", (_req, res) => {
  res.type("text/plain").send("User-agent: *\nDisallow: /\n");
});

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

// ---- EMAIL i18n HELPER ----
function emailT(locale, texts) {
  return texts[locale] || texts.en || texts.sv || Object.values(texts)[0] || "";
}

/** Avsändare för nyhetsbrev, kontakt, interna notifieringar m.m. (aldrig orders@) */
function emailFromInfo() {
  if (process.env.EMAIL_FROM_INFO) return process.env.EMAIL_FROM_INFO;
  const legacy = process.env.EMAIL_FROM;
  if (legacy && !/^orders?@1753skin\.com$/i.test(String(legacy).trim())) return legacy;
  return "info@1753skin.com";
}

/** Avsändare för orderrelaterade transaktionsmejl till kund (bekräftelse, leverans, makulering, prenumeration på order) */
function emailFromOrders() {
  if (process.env.EMAIL_FROM_ORDERS) return process.env.EMAIL_FROM_ORDERS;
  const legacy = process.env.EMAIL_FROM;
  if (legacy && /^orders?@1753skin\.com$/i.test(String(legacy).trim())) return legacy;
  return "orders@1753skin.com";
}

const EMAIL_SEGMENTS = {
  account:      { sv: "mitt-konto", en: "my-account", es: "mi-cuenta", de: "mein-konto", fr: "mon-compte" },
  products:     { sv: "produkter", en: "products", es: "productos", de: "produkte", fr: "produits" },
  about:        { sv: "om-oss", en: "about", es: "sobre-nosotros", de: "ueber-uns", fr: "a-propos" },
  skinAnalysis: { sv: "hudanalys", en: "skin-analysis", es: "analisis-piel", de: "hautanalyse", fr: "analyse-peau" },
  checkout:     { sv: "kassa", en: "checkout", es: "pago", de: "kasse", fr: "caisse" },
  login:        { sv: "logga-in", en: "login", es: "iniciar-sesion", de: "anmelden", fr: "connexion" },
};

function emailPath(locale, route) {
  const seg = EMAIL_SEGMENTS[route];
  return `${locale}/${seg ? (seg[locale] || seg.sv) : route}`;
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

function reqLocale(req) {
  const l = req.body?.locale || req.query?.locale || req.headers["accept-language"]?.slice(0, 2) || "sv";
  return ["sv","en","es","de","fr"].includes(l) ? l : "sv";
}

const API_MSG = {
  notLoggedIn:        { sv: "Ej inloggad", en: "Not logged in", es: "No has iniciado sesión", de: "Nicht eingeloggt", fr: "Non connecté" },
  invalidSession:     { sv: "Ogiltig eller utgången session", en: "Invalid or expired session", es: "Sesión inválida o expirada", de: "Ungültige oder abgelaufene Sitzung", fr: "Session invalide ou expirée" },
  userNotFound:       { sv: "Användare hittades inte", en: "User not found", es: "Usuario no encontrado", de: "Benutzer nicht gefunden", fr: "Utilisateur introuvable" },
  unknownProduct:     { sv: "Okänd produkt", en: "Unknown product", es: "Producto desconocido", de: "Unbekanntes Produkt", fr: "Produit inconnu" },
  subNotFound:        { sv: "Prenumeration hittades inte", en: "Subscription not found", es: "Suscripción no encontrada", de: "Abo nicht gefunden", fr: "Abonnement introuvable" },
  subCreateFail:      { sv: "Prenumerationen kunde inte skapas", en: "Could not create subscription", es: "No se pudo crear la suscripción", de: "Abo konnte nicht erstellt werden", fr: "L'abonnement n'a pas pu être créé" },
  subFetchFail:       { sv: "Kunde inte hämta prenumerationer", en: "Could not fetch subscriptions", es: "No se pudieron obtener las suscripciones", de: "Abos konnten nicht abgerufen werden", fr: "Impossible de récupérer les abonnements" },
  subPauseOnly:       { sv: "Kan bara pausa aktiva prenumerationer", en: "Can only pause active subscriptions", es: "Solo se pueden pausar suscripciones activas", de: "Nur aktive Abos können pausiert werden", fr: "Seuls les abonnements actifs peuvent être mis en pause" },
  subPauseFail:       { sv: "Kunde inte pausa prenumerationen", en: "Could not pause subscription", es: "No se pudo pausar la suscripción", de: "Abo konnte nicht pausiert werden", fr: "Impossible de mettre l'abonnement en pause" },
  subResumeOnly:      { sv: "Kan bara återuppta pausade prenumerationer", en: "Can only resume paused subscriptions", es: "Solo se pueden reanudar suscripciones pausadas", de: "Nur pausierte Abos können fortgesetzt werden", fr: "Seuls les abonnements en pause peuvent être repris" },
  subResumeFail:      { sv: "Kunde inte återuppta prenumerationen", en: "Could not resume subscription", es: "No se pudo reanudar la suscripción", de: "Abo konnte nicht fortgesetzt werden", fr: "Impossible de reprendre l'abonnement" },
  subCancelledNoEdit: { sv: "Kan inte ändra avbruten prenumeration", en: "Cannot modify a cancelled subscription", es: "No se puede modificar una suscripción cancelada", de: "Gekündigtes Abo kann nicht geändert werden", fr: "Impossible de modifier un abonnement annulé" },
  subInvalidInterval: { sv: "Ogiltigt intervall. Välj 30, 60 eller 90 dagar.", en: "Invalid interval. Choose 30, 60 or 90 days.", es: "Intervalo inválido. Elige 30, 60 o 90 días.", de: "Ungültiges Intervall. Wähle 30, 60 oder 90 Tage.", fr: "Intervalle invalide. Choisissez 30, 60 ou 90 jours." },
  subNothingToChange: { sv: "Inget att ändra", en: "Nothing to change", es: "Nada que cambiar", de: "Nichts zu ändern", fr: "Rien à modifier" },
  subUpdateFail:      { sv: "Kunde inte uppdatera prenumerationen", en: "Could not update subscription", es: "No se pudo actualizar la suscripción", de: "Abo konnte nicht aktualisiert werden", fr: "Impossible de mettre à jour l'abonnement" },
  subCancelFail:      { sv: "Kunde inte avbryta prenumerationen", en: "Could not cancel subscription", es: "No se pudo cancelar la suscripción", de: "Abo konnte nicht gekündigt werden", fr: "Impossible d'annuler l'abonnement" },
  orderNotFound:      { sv: "Order hittades inte", en: "Order not found", es: "Pedido no encontrado", de: "Bestellung nicht gefunden", fr: "Commande introuvable" },
  ordersFetchFail:    { sv: "Kunde inte hämta ordrar", en: "Could not fetch orders", es: "No se pudieron obtener los pedidos", de: "Bestellungen konnten nicht abgerufen werden", fr: "Impossible de récupérer les commandes" },
  statsFetchFail:     { sv: "Kunde inte hämta statistik", en: "Could not fetch statistics", es: "No se pudieron obtener las estadísticas", de: "Statistiken konnten nicht abgerufen werden", fr: "Impossible de récupérer les statistiques" },
  discountEnter:      { sv: "Ange en rabattkod", en: "Enter a discount code", es: "Introduce un código de descuento", de: "Gib einen Rabattcode ein", fr: "Saisissez un code de réduction" },
  discountInvalid:    { sv: "Ogiltig rabattkod", en: "Invalid discount code", es: "Código de descuento inválido", de: "Ungültiger Rabattcode", fr: "Code de réduction invalide" },
  discountWrongProducts: { sv: "Rabattkoden gäller inte för dessa produkter", en: "Discount code does not apply to these products", es: "El código no aplica a estos productos", de: "Der Rabattcode gilt nicht für diese Produkte", fr: "Le code ne s'applique pas à ces produits" },
  discountMinOrder:   { sv: "Ordervärdet är för lågt för denna rabattkod", en: "Order value is too low for this discount code", es: "El valor del pedido es demasiado bajo para este código", de: "Der Bestellwert ist zu niedrig für diesen Rabattcode", fr: "Le montant de la commande est trop bas pour ce code" },
  analysisNoKey:      { sv: "AI-tjänsten är inte konfigurerad.", en: "AI service is not configured.", es: "El servicio de IA no está configurado.", de: "Der KI-Dienst ist nicht konfiguriert.", fr: "Le service IA n'est pas configuré." },
  analysisFailed:     { sv: "Analysen kunde inte genomföras just nu.", en: "The analysis could not be completed right now.", es: "El análisis no pudo completarse ahora.", de: "Die Analyse konnte gerade nicht durchgeführt werden.", fr: "L'analyse n'a pas pu être effectuée pour le moment." },
  analysisNoResult:   { sv: "Analysen gav inget resultat. Försök igen.", en: "Analysis produced no result. Try again.", es: "El análisis no produjo resultado. Inténtalo de nuevo.", de: "Die Analyse hat kein Ergebnis geliefert. Versuche es erneut.", fr: "L'analyse n'a donné aucun résultat. Réessayez." },
  imageTooBig:        { sv: "Bilden är för stor (max 10 MB).", en: "Image is too large (max 10 MB).", es: "La imagen es demasiado grande (máx. 10 MB).", de: "Das Bild ist zu groß (max. 10 MB).", fr: "L'image est trop grande (max. 10 Mo)." },
  noValidPhoto:       { sv: "Inget giltigt foto bifogat.", en: "No valid photo attached.", es: "No se adjuntó una foto válida.", de: "Kein gültiges Foto angehängt.", fr: "Aucune photo valide jointe." },
  historyFetchFail:   { sv: "Kunde inte hämta analyshistorik.", en: "Could not fetch analysis history.", es: "No se pudo obtener el historial.", de: "Analyseverlauf konnte nicht abgerufen werden.", fr: "Impossible de récupérer l'historique." },
  tokenAndPwRequired: { sv: "Token och lösenord krävs", en: "Token and password are required", es: "Se requieren token y contraseña", de: "Token und Passwort sind erforderlich", fr: "Le jeton et le mot de passe sont requis" },
  pwMinLength:        { sv: "Lösenordet måste vara minst 6 tecken", en: "Password must be at least 6 characters", es: "La contraseña debe tener al menos 6 caracteres", de: "Das Passwort muss mindestens 6 Zeichen lang sein", fr: "Le mot de passe doit comporter au moins 6 caractères" },
  linkInvalid:        { sv: "Ogiltig eller utgången länk", en: "Invalid or expired link", es: "Enlace inválido o expirado", de: "Ungültiger oder abgelaufener Link", fr: "Lien invalide ou expiré" },
  linkExpired:        { sv: "Länken har gått ut. Begär en ny via inloggningssidan.", en: "Link has expired. Request a new one from the login page.", es: "El enlace ha expirado. Solicita uno nuevo desde la página de inicio de sesión.", de: "Der Link ist abgelaufen. Fordere einen neuen über die Anmeldeseite an.", fr: "Le lien a expiré. Demandez-en un nouveau depuis la page de connexion." },
  pwSaved:            { sv: "Lösenord sparat!", en: "Password saved!", es: "¡Contraseña guardada!", de: "Passwort gespeichert!", fr: "Mot de passe enregistré !" },
  pwSaveFail:         { sv: "Kunde inte spara lösenordet", en: "Could not save password", es: "No se pudo guardar la contraseña", de: "Passwort konnte nicht gespeichert werden", fr: "Impossible d'enregistrer le mot de passe" },
  rateLimited:        { sv: "Du har nått gränsen. Försök igen om en stund.", en: "Rate limit reached. Please try again later.", es: "Has alcanzado el límite. Inténtalo más tarde.", de: "Limit erreicht. Bitte versuche es später erneut.", fr: "Limite atteinte. Veuillez réessayer plus tard." },
  allFieldsRequired:  { sv: "Alla fält krävs.", en: "All fields are required.", es: "Todos los campos son obligatorios.", de: "Alle Felder sind erforderlich.", fr: "Tous les champs sont requis." },
  emailNotConfigured: { sv: "E-posttjänsten är inte konfigurerad.", en: "Email service is not configured.", es: "El servicio de correo no está configurado.", de: "Der E-Mail-Dienst ist nicht konfiguriert.", fr: "Le service e-mail n'est pas configuré." },
  messageSendFail:    { sv: "Kunde inte skicka meddelandet. Försök igen.", en: "Could not send message. Please try again.", es: "No se pudo enviar el mensaje. Inténtalo de nuevo.", de: "Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.", fr: "Impossible d'envoyer le message. Veuillez réessayer." },
  notEnoughPoints:    { sv: "Inte tillräckligt med poäng", en: "Not enough points", es: "No tienes suficientes puntos", de: "Nicht genügend Punkte", fr: "Pas assez de points" },
  pointsMin100:       { sv: "Minst 100 poäng krävs", en: "At least 100 points required", es: "Se requieren al menos 100 puntos", de: "Mindestens 100 Punkte erforderlich", fr: "Au moins 100 points requis" },
  pointsStep100:      { sv: "Poäng måste vara i steg om 100", en: "Points must be in steps of 100", es: "Los puntos deben ser en pasos de 100", de: "Punkte müssen in 100er-Schritten sein", fr: "Les points doivent être par tranches de 100" },
};

function apiMsg(key, locale) {
  const texts = API_MSG[key];
  if (!texts) return key;
  return texts[locale] || texts.en || texts.sv || key;
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: emailT(reqLocale(req), API_MSG.notLoggedIn) });
  }
  const payload = verifyToken(header.split(" ")[1]);
  if (!payload) {
    return res.status(401).json({ message: emailT(reqLocale(req), API_MSG.invalidSession) });
  }
  req.userId = payload.id;
  req.userEmail = payload.email;
  req.user = payload;
  next();
}

// ---- AUTH ROUTES ----

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password, locale: reqLocale } = req.body;
    const locale = ["sv","en","es","de","fr"].includes(reqLocale) ? reqLocale : "sv";
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "auth-register", 10)) {
      return res.status(429).json({ message: emailT(locale, { sv: "För många registreringsförsök. Försök igen om en stund.", en: "Too many registration attempts. Please try again later.", es: "Demasiados intentos de registro. Inténtalo más tarde.", de: "Zu viele Registrierungsversuche. Bitte versuche es später.", fr: "Trop de tentatives d'inscription. Veuillez réessayer plus tard." }) });
    }
    if (!name || !email || !password) {
      return res.status(400).json({ message: emailT(locale, { sv: "Namn, e-post och lösenord krävs", en: "Name, email and password are required", es: "Nombre, correo y contraseña son obligatorios", de: "Name, E-Mail und Passwort sind erforderlich", fr: "Nom, e-mail et mot de passe sont requis" }) });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: emailT(locale, { sv: "Lösenordet måste vara minst 6 tecken", en: "Password must be at least 6 characters", es: "La contraseña debe tener al menos 6 caracteres", de: "Das Passwort muss mindestens 6 Zeichen lang sein", fr: "Le mot de passe doit comporter au moins 6 caractères" }) });
    }
    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: emailT(locale, { sv: "E-postadressen är redan registrerad", en: "This email is already registered", es: "Este correo ya está registrado", de: "Diese E-Mail-Adresse ist bereits registriert", fr: "Cet e-mail est déjà enregistré" }) });
    }

    const passwordHash = bcrypt ? await bcrypt.hash(password, 10) : password;
    const user = await db.createUser({
      id: crypto.randomUUID(),
      name,
      email,
      phone: phone || "",
      passwordHash,
      locale
    });

    // Self-heal: link any orphan skin analyses (user_id IS NULL) saved earlier
    // under this email so "Min hudresa" shows them immediately. Soft-fails so
    // registration is never blocked by this auxiliary step.
    try {
      const linked = await db.reclaimOrphanAnalyses(user.id, user.email);
      if (linked) console.log(`[Auth] Linked ${linked} orphan analyses to ${user.email}`);
    } catch (err) {
      console.warn("[Auth] reclaimOrphanAnalyses (register) failed:", err.message);
    }

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
      return res.status(429).json({ message: "Too many login attempts. Please wait a moment." });
    }
    const { email, password, locale: reqLocale } = req.body;
    const locale = ["sv","en","es","de","fr"].includes(reqLocale) ? reqLocale : "sv";
    if (!email || !password) {
      return res.status(400).json({ message: emailT(locale, { sv: "E-post och lösenord krävs", en: "Email and password are required", es: "Correo y contraseña son obligatorios", de: "E-Mail und Passwort sind erforderlich", fr: "E-mail et mot de passe sont requis" }) });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: emailT(locale, { sv: "Fel e-post eller lösenord", en: "Wrong email or password", es: "Correo o contraseña incorrectos", de: "Falsche E-Mail oder falsches Passwort", fr: "E-mail ou mot de passe incorrect" }) });
    }

    const valid = bcrypt ? await bcrypt.compare(password, user.password_hash) : password === user.password_hash;
    if (!valid) {
      return res.status(401).json({ message: emailT(locale, { sv: "Fel e-post eller lösenord", en: "Wrong email or password", es: "Correo o contraseña incorrectos", de: "Falsche E-Mail oder falsches Passwort", fr: "E-mail ou mot de passe incorrect" }) });
    }

    if (locale && locale !== (user.locale || "sv")) {
      try { await db.pool.query("UPDATE users SET locale = $1 WHERE id = $2", [locale, user.id]); } catch {}
    }

    // Self-heal: claim orphan skin analyses saved under this email before the
    // account was coupled. Soft-fails so login is never blocked.
    try {
      const linked = await db.reclaimOrphanAnalyses(user.id, user.email);
      if (linked) console.log(`[Auth] Linked ${linked} orphan analyses to ${user.email}`);
    } catch (err) {
      console.warn("[Auth] reclaimOrphanAnalyses (login) failed:", err.message);
    }

    const token = generateToken(user);
    const { password_hash: _, ...safeUser } = user;
    res.json({ token, user: { ...safeUser, locale: locale || safeUser.locale || "sv" } });
  } catch (err) {
    res.status(500).json({ message: err.message || "Login failed" });
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

const FREE_SHIPPING_THRESHOLD = { SEK: 600, EUR: 60 };
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
    const l = reqLocale(req);
    if (!product) return res.status(400).json({ message: apiMsg("unknownProduct", l) });

    const user = await db.findUserById(req.userId);
    if (!user) return res.status(404).json({ message: apiMsg("userNotFound", l) });

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
    const checkoutUrl = `https://${env}.vivapayments.com/web/checkout?ref=${vivaData.orderCode}&color=108474`;

    console.log(`[Subscription] Created for ${user.email}, product=${productId}, vivaOrderCode=${vivaData.orderCode}`);
    res.json({ orderCode: vivaData.orderCode, checkoutUrl });
  } catch (err) {
    console.error("[Subscription Create Error]", err);
    res.status(err.status || 500).json({ message: err.message || apiMsg("subCreateFail", reqLocale(req)) });
  }
});

app.get("/api/subscriptions", authMiddleware, async (req, res) => {
  try {
    const subs = await db.findSubscriptionsByUser(req.userId);
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message || apiMsg("subFetchFail", reqLocale(req)) });
  }
});

app.put("/api/subscriptions/:id/pause", authMiddleware, async (req, res) => {
  try {
    const sub = await db.findSubscriptionById(parseInt(req.params.id, 10));
    const l = reqLocale(req);
    if (!sub || sub.user_id !== req.userId) return res.status(404).json({ message: apiMsg("subNotFound", l) });
    if (sub.status !== "active") return res.status(400).json({ message: apiMsg("subPauseOnly", l) });

    const updated = await db.updateSubscription(sub.id, {
      status: "paused",
      paused_at: new Date().toISOString()
    });
    sendSubscriptionChangeEmail(sub, "paused").catch(err => console.error("[Email] Sub pause email error:", err.message));
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || apiMsg("subPauseFail", reqLocale(req)) });
  }
});

app.put("/api/subscriptions/:id/resume", authMiddleware, async (req, res) => {
  try {
    const sub = await db.findSubscriptionById(parseInt(req.params.id, 10));
    const l = reqLocale(req);
    if (!sub || sub.user_id !== req.userId) return res.status(404).json({ message: apiMsg("subNotFound", l) });
    if (sub.status !== "paused") return res.status(400).json({ message: apiMsg("subResumeOnly", l) });

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
    res.status(500).json({ message: err.message || apiMsg("subResumeFail", reqLocale(req)) });
  }
});

app.put("/api/subscriptions/:id", authMiddleware, async (req, res) => {
  try {
    const sub = await db.findSubscriptionById(parseInt(req.params.id, 10));
    const l = reqLocale(req);
    if (!sub || sub.user_id !== req.userId) return res.status(404).json({ message: apiMsg("subNotFound", l) });
    if (sub.status === "cancelled") return res.status(400).json({ message: apiMsg("subCancelledNoEdit", l) });

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
        return res.status(400).json({ message: apiMsg("subInvalidInterval", l) });
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
      return res.status(400).json({ message: apiMsg("subNothingToChange", l) });
    }

    const updated = await db.updateSubscription(sub.id, fields);
    sendSubscriptionChangeEmail(sub, "updated", {
      intervalDays: fields.interval_days,
      quantity: fields.quantity,
    }).catch(err => console.error("[Email] Sub update email error:", err.message));
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || apiMsg("subUpdateFail", reqLocale(req)) });
  }
});

app.delete("/api/subscriptions/:id", authMiddleware, async (req, res) => {
  try {
    const sub = await db.findSubscriptionById(parseInt(req.params.id, 10));
    if (!sub || sub.user_id !== req.userId) return res.status(404).json({ message: apiMsg("subNotFound", reqLocale(req)) });

    const updated = await db.updateSubscription(sub.id, {
      status: "cancelled",
      cancelled_at: new Date().toISOString()
    });
    sendSubscriptionChangeEmail(sub, "cancelled").catch(err => console.error("[Email] Sub cancel email error:", err.message));
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || apiMsg("subCancelFail", reqLocale(req)) });
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
      const cl = order.locale || "sv";
      const localeMap = { sv: "sv-SE", en: "en-US", es: "es-ES", de: "de-DE", fr: "fr-FR" };
      const totalKr = (order.total_amount + (order.shipping_cost || 0)).toLocaleString(localeMap[cl] || "sv-SE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      const currencyLabel = (order.currency || "SEK") === "EUR" ? "\u20ac" : "kr";

      const apiKey = process.env.RESEND_API_KEY;
      const fromEmail = emailFromOrders();
      if (apiKey) {
        const { Resend } = require("resend");
        const resend = new Resend(apiKey);
        const firstName = order.customer_name?.split(" ")[0] || "";
        const hi = emailT(cl, { sv: "Hej", en: "Hi", es: "Hola", de: "Hallo", fr: "Bonjour" });
        const refundNote = order.viva_transaction_id
          ? ` ${emailT(cl, {
              sv: `Återbetalningen på <strong>${totalKr} ${currencyLabel}</strong> kommer att synas på ditt konto inom 3–5 bankdagar.`,
              en: `The refund of <strong>${totalKr} ${currencyLabel}</strong> will appear in your account within 3–5 business days.`,
              es: `El reembolso de <strong>${totalKr} ${currencyLabel}</strong> aparecerá en tu cuenta en 3–5 días hábiles.`,
              de: `Die Rückerstattung von <strong>${totalKr} ${currencyLabel}</strong> wird innerhalb von 3–5 Werktagen auf deinem Konto erscheinen.`,
              fr: `Le remboursement de <strong>${totalKr} ${currencyLabel}</strong> apparaîtra sur votre compte sous 3 à 5 jours ouvrés.`
            })}` : "";
        await resend.emails.send({
          from: fromEmail,
          replyTo: "info@1753skin.com",
          to: order.customer_email,
          subject: emailT(cl, { sv: `Order #${order.order_number} har makulerats`, en: `Order #${order.order_number} has been cancelled`, es: `Pedido #${order.order_number} ha sido cancelado`, de: `Bestellung #${order.order_number} wurde storniert`, fr: `Commande #${order.order_number} a été annulée` }),
          html: emailWrapper(`
            <div style="text-align:center;padding:32px 0 8px">
              <img src="https://www.1753skin.com/1753.png" alt="1753 SKINCARE" width="48" height="48" style="border-radius:12px"/>
            </div>
            <h1 style="font-size:24px;font-weight:600;color:#1d1d1f;letter-spacing:-0.02em;margin:16px 0;">
              ${emailT(cl, { sv: "Din order har makulerats", en: "Your order has been cancelled", es: "Tu pedido ha sido cancelado", de: "Deine Bestellung wurde storniert", fr: "Votre commande a été annulée" })}
            </h1>
            <p style="color:#515151;font-size:15px;line-height:1.6;margin:0 0 24px;">
              ${hi} ${firstName}${firstName ? ", " : ""}${emailT(cl, { sv: "din beställning", en: "your order", es: "tu pedido", de: "deine Bestellung", fr: "votre commande" })} <strong>#${order.order_number}</strong> ${emailT(cl, { sv: "har makulerats.", en: "has been cancelled.", es: "ha sido cancelado.", de: "wurde storniert.", fr: "a été annulée." })}${refundNote}
            </p>
            <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#766a62;font-size:14px;">${emailT(cl, { sv: "Ordernummer", en: "Order number", es: "Número de pedido", de: "Bestellnummer", fr: "Numéro de commande" })}</td>
                  <td style="padding:8px 0;text-align:right;font-weight:600;color:#1d1d1f;font-size:14px;">#${order.order_number}</td>
                </tr>
                ${order.viva_transaction_id ? `
                <tr>
                  <td style="padding:8px 0;color:#766a62;font-size:14px;">${emailT(cl, { sv: "Återbetalat belopp", en: "Refunded amount", es: "Monto reembolsado", de: "Erstatteter Betrag", fr: "Montant remboursé" })}</td>
                  <td style="padding:8px 0;text-align:right;font-weight:600;color:#108474;font-size:14px;">${totalKr} ${currencyLabel}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding:8px 0;color:#766a62;font-size:14px;">${emailT(cl, { sv: "Status", en: "Status", es: "Estado", de: "Status", fr: "Statut" })}</td>
                  <td style="padding:8px 0;text-align:right;font-weight:600;color:#1d1d1f;font-size:14px;">${order.viva_transaction_id ? emailT(cl, { sv: "Återbetalning påbörjad", en: "Refund initiated", es: "Reembolso iniciado", de: "Rückerstattung eingeleitet", fr: "Remboursement initié" }) : emailT(cl, { sv: "Makulerad", en: "Cancelled", es: "Cancelado", de: "Storniert", fr: "Annulée" })}</td>
                </tr>
              </table>
            </div>
            <p style="color:#515151;font-size:14px;line-height:1.6;margin:24px 0 0;">
              ${emailT(cl, { sv: "Har du frågor om din återbetalning? Svara på detta mejl eller kontakta oss på", en: "Questions about your refund? Reply to this email or contact us at", es: "¿Preguntas sobre tu reembolso? Responde a este email o contáctanos en", de: "Fragen zu deiner Rückerstattung? Antworte auf diese E-Mail oder kontaktiere uns unter", fr: "Des questions sur votre remboursement ? Répondez à cet email ou contactez-nous à" })}
              <a href="mailto:info@1753skin.com" style="color:#108474"> info@1753skin.com</a>.
            </p>
          `, null, cl)
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

== SOLSKYDD – EVOLUTIONÄR BALANS ==
Solen är INTE en fiende – den är livsviktig. Människans hud har formats under miljontals år i samspel med UV-strålning. Vår position om solskydd:

1. EVOLUTIONÄR ANPASSNING: Hudtyp (Fitzpatrick) speglar en evolutionär anpassning till UV-nivåer. Ljus hud (typ I-II) utvecklades i solfattiga områden för att maximera D-vitaminproduktion; mörk hud (typ V-VI) utvecklades nära ekvatorn som skydd mot intensiv UV. Det finns ingen "universell" solskyddsrekommendation.

2. NÄR SOLSKYDD BEHÖVS: Rekommendera solskydd ENBART när UV-miljön överstiger vad personens hud evolutionärt är anpassad för. Exempel: ljushyad person i tropikerna – ja. Mörkhyad person i Norden – oftast nej, de riskerar snarare D-vitaminbrist. Anpassa alltid rådet efter kundens Fitzpatrick-typ, bostadsort/latitud och solvanor.

3. D-VITAMIN ÄR LIVSVIKTIGT: Överdriven solrädsla och generella "använd SPF varje dag"-råd kan orsaka kronisk D-vitaminbrist. Särskilt allvarligt för mörkhyade i solfattiga länder och för barn. D-vitamin stödjer skelett, immunförsvar och en rad kroppsprocesser.

4. OM SOLSKYDD REKOMMENDERAS:
   - Mineraliskt solskydd (zinkoxid/titandioxid) framför kemiskt – skonsammare mot hud och mikrobiom
   - Kläder, hatt och skugga i stark sol framför kemiska produkter
   - Undvik ALDRIG det generiska rådet "använd alltid SPF 50" – individanpassa
   - CBD/CBG ger antioxidantskydd men ersätter INTE solskydd vid stark UV-exponering

5. I RUTINFÖRSLAG: Skriv ALDRIG "använd solskydd dagligen" som ett standardsteg. Formulera istället: "Använd mineraliskt solskydd om du vistas i starkare UV-miljö än din hud är anpassad för" – och förklara varför baserat på kundens Fitzpatrick-typ.

== ANALYSTYP ==
Kunden har besvarat en quiz om hudtyp, besvär, rutin och livsstil. Om skanningsdata finns inkluderat, integrera det i analysen (zoner med detekterade hudtillstånd och konfidensgrader).

== VISUELL BEDÖMNING + ONNX-MODELL (DUBBEL ANALYS) ==
Analysen har TVÅ AI-lager som samverkar:

1. LOKAL ONNX-MODELL (MobileNetV3, tränad på 88 000+ dermatologiska bilder):
   - Klassificerar 9 tillstånd: akne, dermatit, torrhet, eksem, hyperpigmentering, NORMAL/FRISK HUD, psoriasis, rosacea, solskada
   - Graderar allvarlighet: ingen, mild, måttlig, svår
   - Analyserar per ansiktszon (panna, kinder, näsa, haka, ögonparti)
   - Beräknar 15 hudmetriker (hydrering, elasticitet, porer, textur, jämnhet, känslighet m.fl.)

2. DIN VISUELLA BEDÖMNING (GPT-5.4 Vision):
   - Du ser bilden själv och gör en oberoende bedömning
   - Du bekräftar, fördjupar eller korrigerar ONNX-modellens resultat

Prioriteringsordning:
1. DIN VISUELLA BEDÖMNING av bilden (om bild bifogas) – 40% vikt
2. ONNX-modellens per-zon-analys och metriker – 25% vikt (modellen har "normal"-klass och kan korrekt identifiera frisk hud)
3. Kundens egna quiz-svar (hudtyp, besvär) – 20% vikt
4. Livsstilsfaktorer – 15% vikt

SAMSPEL MELLAN MODELLERNA:
- Om ONNX och din visuella bedömning ÖVERENSSTÄMMER: hög konfidens, presentera som säker bedömning
- Om de AVVIKER: lita mer på din visuella bedömning men nämn att AI-skanningen visade annorlunda
- Om ONNX säger "normal" med hög konfidens: detta är trovärdigt, modellen har tränats på frisk hud
- Konfidensgrader under 50% från ONNX bör behandlas försiktigt
- Severity-graderingen (mild/måttlig/svår) från ONNX är användbar för att anpassa rekommendationsintensitet

VIKTIGT OM NORMAL HUD: Många har i grunden FRISK HUD. Om ONNX-modellen klassificerar som "normal" med hög konfidens OCH din visuella bedömning bekräftar det – ge en positiv bedömning och fokusera på förebyggande vård istället för att hitta problem.

HUDMETRIKER: ONNX-modellen beräknar 15 metriker (0-100, högre = friskare). Dessa ska INTEGRERAS i din analys och presenteras i resultatets "score"-sektion. Justera dem om din visuella bedömning avviker markant.

== BIOLOGISK HUDÅLDER ==
Om kundens kronologiska ålder anges: uppskatta den BIOLOGISKA HUDÅLDERN baserat på:
- Din visuella bedömning av bilden (rynkor, linjer, elasticitet, pigmentering, hudtextur)
- ONNX-metriker (hydration, elasticity, wrinkles, sunDamage) om tillgängliga
- Livsstilsfaktorer (sömn, stress, kost, solvanor, träning)
- Hudtillstånd och allvarlighetsgrad

Biologisk hudålder ska reflektera hur gammal HUDEN SER UT, INTE vara samma som kundens kronologiska ålder.
VIKTIGT: skinAge får ALDRIG avvika mer än ±5 år från kundens kronologiska ålder. Exempel: om kunden är 32 år ska skinAge vara mellan 27 och 37.
Presentera som "skinAge" i JSON-svaret (heltal, OBLIGATORISKT). Om ingen bild finns, gör en uppskattning baserat på livsstil och hudtyp.
Var ärlig men uppmuntrande: om huden är yngre än åldern, lyft det som en styrka. Om äldre, ge hopp genom att förklara att det går att vända.
OBS: Kundens ålder anges nu som exakt siffra (t.ex. 32), inte ett spann.

== SOLKÄNSLIGHET (Fitzpatrick) ==
Uppskatta kundens solkänslighet baserat på Fitzpatrick-skalan (I-VI) utifrån bilden och eventuella quiz-svar. Presentera som "fitzpatrick" i JSON-svaret (sträng: "I", "II", "III", "IV", "V" eller "VI"). Typ I = mycket solkänslig/bränns alltid, Typ VI = mycket soltålig/bränns aldrig. Om du inte kan bedöma, gör din bästa uppskattning.

== HUDMETRIKER (metrics) ==
Returnera ALLTID ett "metrics"-objekt i JSON med 10 metriker. Varje metrik har score (0-100, högre = friskare), grade (heltal 1-5 där 1 = utmärkt, 2 = bra, 3 = medel, 4 = under medel, 5 = behöver åtgärd) och detail (1 mening som förklarar bedömningen):
- hydration, texture, pores, elasticity, radiance, barrier_health, sensitivity, acne, sun_damage, skin_tone
Om ONNX-metriker finns tillgängliga, använd dem som utgångspunkt men justera baserat på din visuella bedömning. Om ingen bild finns, uppskatta baserat på quiz-svar och livsstil.

== SCORE ==
Beräkna score (0-100) INDIVIDUELLT baserat på ALLA faktorer:
- Din egen visuella bedömning av bilden, om bild finns (35%)
- Livsstilsfaktorer: sömn, stress, kost, vatten, träning (30%)
- Hudtyp och angivna besvär (20%)
- Nuvarande rutin och dess lämplighet (15%)
Skanningsresultat påverkar INTE poängen direkt – de kan bekräfta din visuella bedömning men aldrig sänka poängen på egen hand.
Varje kund ska få ett UNIKT score. Kopiera aldrig exempelvärden. score ska vara ett HELTAL (number), inte en sträng.

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
  "score": 78,
  "scoreLabel": "Bra grund att bygga vidare på",
  "skinAge": 34,
  "fitzpatrick": "III",
  "summary": "4-6 meningar som sammanfattar hudens tillstånd, styrkor, problemområden och vad som bör prioriteras. Var specifik och personlig – referera till kundens svar och vad du ser i bilden.",
  "metrics": {
    "hydration": { "score": 72, "grade": 2, "detail": "Kort förklaring av hydreringsnivån" },
    "texture": { "score": 68, "grade": 3, "detail": "Kort förklaring av hudtexturen" },
    "pores": { "score": 75, "grade": 2, "detail": "Kort förklaring av porernas tillstånd" },
    "elasticity": { "score": 80, "grade": 2, "detail": "Kort förklaring av elasticiteten" },
    "radiance": { "score": 65, "grade": 3, "detail": "Kort förklaring av lyster" },
    "barrier_health": { "score": 70, "grade": 2, "detail": "Kort förklaring av barriärens tillstånd" },
    "sensitivity": { "score": 60, "grade": 3, "detail": "Kort förklaring av känslighetsnivå" },
    "acne": { "score": 85, "grade": 1, "detail": "Kort förklaring av aknetillstånd" },
    "sun_damage": { "score": 78, "grade": 2, "detail": "Kort förklaring av solskador" },
    "skin_tone": { "score": 74, "grade": 2, "detail": "Kort förklaring av hudton/jämnhet" }
  },
  "skinAnalysis": {
    "overview": "Utförlig beskrivning (400-600 ord) av kundens hudtillstånd. Beskriv vad du ser/förstår baserat på quiz-svar och eventuell skanningsdata. Förklara hur hudtyp, besvär och livsstil hänger ihop. Koppla till mikrobiom och ECS. Var specifik – referera till kundens egna svar. Skriv som löptext med stycken (använd \\n\\n för styckebrytning). Ge utförliga förklaringar, inte bara konstateranden.",
    "strengths": ["Specifik styrka med kort förklaring (1-2 meningar)", "Ytterligare styrka"],
    "concerns": [
      { "issue": "Specifikt problem med utförlig förklaring (2-3 meningar) om orsak och hur det påverkar huden", "severity": "mild | moderate | severe" }
    ],
    "microbiome": "Analys (4-5 meningar) av hur kundens livsstil och rutin påverkar mikrobiomets balans. Koppla specifikt till kundens svar om kost, rengöring och produktanvändning.",
    "ecs": "Analys (4-5 meningar) av hur ECS-aktivitet relaterar till kundens hudtillstånd. Förklara hur CBD/CBG kan stödja hudens system baserat på just denna persons besvär."
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
      "why": "Vetenskaplig motivering: varför detta påverkar huden (2-3 meningar)",
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
    },
    {
      "area": "Tarmhälsa",
      "tip": "...",
      "why": "...",
      "impact": "medel",
      "source": "..."
    }
  ],
  "routine": {
    "morning": [
      { "step": "Skölj ansiktet med ljummet vatten", "why": "Bevarar mikrobiomets balans – undvik tvål som stör pH. Varmt vatten löser tillräckligt med talg utan att skada lipidbarriären." },
      { "step": "3-4 droppar The ONE Facial Oil", "why": "CBD skyddar barriären och reglerar sebum via ECS. Facial oil på fuktig hud skapar en skyddande film som håller kvar fukten hela dagen." },
      { "step": "1-2 pump TA-DA Serum", "why": "CBG låser in fukt och ger antioxidantskydd. Serumets jojobaolja-bas absorberas snabbt och lämnar en matt, smidig finish." }
    ],
    "evening": [
      { "step": "Rengör med Au Naturel Makeup Remover", "why": "MCT löser smuts, SPF och oxiderad talg utan att störa mikrobiomets mångfald. Oljebaserad rengöring är det skonsammaste sättet att ta bort dagens föroreningar." },
      { "step": "3-4 droppar I LOVE Facial Oil", "why": "5% CBG stödjer nattlig reparation via ECS. Under sömnen accelererar cellförnyelsen och CBG hjälper huden att optimera denna process." },
      { "step": "1-2 pump TA-DA Serum", "why": "Förstärker oljans absorption och regenerering. Serumet skapar ett fuktlager som förhindrar transepidermal vattenförlust under natten." }
    ]
  },
  "primaryCondition": {
    "condition": "normal | acne | dermatitis | dryness | eczema | fungal | hyperpigmentation | psoriasis | rosacea | sun_damage",
    "confidence": "low | medium | high",
    "reasoning": "1-2 meningar som motiverar valet. Om huden är frisk, skriv det tydligt."
  },
  "avoid": ["Specifik sak att undvika med kort förklaring varför (1-2 meningar)"],
  "nextAnalysis": "4 veckor",
  "faceZones": [
    {
      "zone": "forehead",
      "label": "Panna",
      "x": 50,
      "y": 18,
      "condition": "dermatitis",
      "confidence": "medium",
      "description": "Tydlig rodnad och vidgade blodkärl synliga, karaktäristiskt för lätt barriärstörning."
    }
  ]
}
\`\`\`

== ANSIKTSZONER (faceZones) ==
FACE ZONES: Baserat på din FULLSTÄNDIGA analys (inte bara ONNX), placera 3-8 markers på ansiktet där du identifierar specifika tillstånd eller observationer. Varje marker ska ha:
- zone: tekniskt id (forehead, left_cheek, right_cheek, nose, chin, left_eye, right_eye)
- label: lokaliserat namn på zonen
- x, y: position i procent (0-100) RELATIVT HELA BILDEN (övre vänstra hörnet = 0,0; nedre högra = 100,100)
- condition: detekterat tillstånd
- confidence: "low", "medium" eller "high"
- description: 1-2 meningar som beskriver vad du ser i just den zonen (synlig observation, inte generell)

KRITISKT FÖR x,y-POSITIONERING:
- x och y ska peka på EXAKT den pixel i BILDEN där problemet finns.
- Titta noga på var ansiktet FAKTISKT befinner sig i bilden. Ansiktet är INTE alltid centrerat eller fyller hela bilden.
- Om ansiktet bara tar upp 60% av bildens höjd och börjar vid 20% uppifrån, ska pannans y-värde vara ca 25-30, INTE 15-18.
- Om ansiktet är förskjutet till vänster, ska x-värdena vara lägre (20-40), inte centrerade (50).
- Kontrollera: om du ritar en prick vid (x%, y%) på originalbilden – hamnar den PÅ rätt hudområde? Justera tills den gör det.
- Vanliga misstag: att anta att ansiktet alltid börjar vid y=10 och slutar vid y=90. Titta på bilden!

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
Basera på kundens specifika svar om sömn, stress, kost, vatten och träning. Ge EXAKT 5 konkreta, personliga tips – ett för varje kategori: "Sömn", "Stress", "Kost", "Rörelse", "Tarmhälsa". Varje tip ska ha:
- "area": kategorinamn (exakt en av: "Sömn", "Stress", "Kost", "Rörelse", "Tarmhälsa")
- "tip": det konkreta rådet (2-3 meningar)
- "why": vetenskaplig motivering med koppling till hud (2-3 meningar, referera till tarm-hud-axeln, ECS, mikrobiom, kortisol etc.)
- "impact": förväntad effekt – använd GEMENER: "hög", "medel" eller "låg"
- "source": kort referens till forskning, bok eller vetenskapligt koncept
Skriv aldrig generiska råd som "drick mer vatten". Var specifik utifrån kundens svar.

== RUTINFÖRSLAG ==
Anpassa morgon- och kvällsrutin till kundens hudtyp och besvär. Ge MINST 3 steg per rutin (morgon och kväll). Varje steg ska ha:
- "step": vad kunden ska göra (1 mening)
- "why": utförlig förklaring (2-3 meningar) av VARFÖR det stöder hudens egna system, kopplat till ECS/mikrobiom och kundens specifika behov
OBS SOLSKYDD I RUTIN: Inkludera ALDRIG "använd solskydd" som standardsteg. Om kundens Fitzpatrick-typ och livssituation motiverar solskydd, formulera det som "Mineraliskt solskydd vid stark UV-exponering" med en why som förklarar den evolutionära logiken (se == SOLSKYDD – EVOLUTIONÄR BALANS ==).

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
    if (questions.age) parts.push(`Ålder: ${questions.age} år (exakt kronologisk ålder)`);
    if (questions.gender) parts.push(`Kön: ${questions.gender}`);
    if (questions.sunProtection) parts.push(`Solskydd: ${questions.sunProtection}`);
    if (questions.hormonal) parts.push(`Hormonell påverkan: ${questions.hormonal}`);
  }

  if (imageScan) {
    parts.push("\n== ONNX SKANNINGSDATA (MobileNetV3, tränad på 88k+ bilder, 9 klasser inkl. normal) ==");
    if (imageScan.overall?.length) {
      parts.push("Helhetsbild (topp-3 klassificeringar):");
      imageScan.overall.forEach(o => {
        parts.push(`  - ${o.conditionSv || o.condition}: ${o.confidence}% konfidens`);
      });
    }
    if (imageScan.overallSeverity) {
      parts.push(`Övergripande allvarlighetsgrad: ${imageScan.overallSeverity.level} (${imageScan.overallSeverity.confidence}% konfidens)`);
    }
    if (imageScan.zones?.length) {
      parts.push("Per-zon-analys:");
      imageScan.zones.forEach(z => {
        const sevStr = z.severity ? ` | svårighetsgrad: ${z.severity}` : "";
        parts.push(`  - ${z.zone}: ${z.conditionSv || z.condition} (${z.confidence}%)${sevStr}`);
      });
    }
    if (imageScan.skinMetrics) {
      const m = imageScan.skinMetrics;
      parts.push(`Hudmetriker (0-100, högre = friskare): hydrering ${m.hydration}, elasticitet ${m.elasticity}, porer ${m.pores}, textur ${m.texture}, jämnhet ${m.evenness}, känslighet ${m.sensitivity}, oljighet ${m.oiliness}, rynkor ${m.wrinkles}, mörka ringar ${m.darkCircles}, rodnad ${m.redness}, akne-poäng ${m.acneScore}, pigmentering ${m.pigmentation}, solskada ${m.sunDamage}, barriär ${m.barrier}, TOTALT ${m.overall}`);
    }
    parts.push("MODELLEN HAR 'normal/frisk hud'-klass: om modellen klassificerar som 'normal' med hög konfidens är detta trovärdigt. Jämför med din egen visuella bedömning.");
  }

  if (!questions && !imageScan) {
    return "Ge mig en holistisk hudanalys baserat på din expertis.";
  }

  parts.push("\nGe en djup, personlig hudanalys. Om en bild bifogas, basera din bedömning PRIMÄRT på vad du ser i bilden. Svara ENBART med JSON-blocket enligt formatet i instruktionerna.");
  return parts.join("\n");
}

app.post("/api/analysis", async (req, res) => {
  try {
    const { imageBase64, regions, fullImage, questions, imageScan } = req.body;
    const locale = req.body.questions?.locale || "sv";

    const rateLimitMsg = { sv: "Du har nått gränsen. Försök igen om en stund.", en: "You've reached the limit. Please try again later.", es: "Has alcanzado el límite. Inténtalo de nuevo más tarde.", de: "Du hast das Limit erreicht. Bitte versuche es später erneut.", fr: "Vous avez atteint la limite. Veuillez réessayer plus tard." };
    const validationMsg = { sv: "Besvara frågorna eller bifoga ett foto.", en: "Please answer the questions or attach a photo.", es: "Responde las preguntas o adjunta una foto.", de: "Bitte beantworte die Fragen oder füge ein Foto hinzu.", fr: "Répondez aux questions ou joignez une photo." };

    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "analysis", 10)) {
      return res.status(429).json({ message: rateLimitMsg[locale] || rateLimitMsg.en });
    }

    const mainImage = fullImage || imageBase64;
    const hasImage = mainImage && mainImage.startsWith("data:image/");
    const hasQuestions = questions && (questions.skinType || questions.concerns?.length);
    const hasScan = imageScan && (imageScan.overall?.length || imageScan.zones?.length);

    if (!hasImage && !hasQuestions && !hasScan) {
      return res.status(400).json({ message: validationMsg[locale] || validationMsg.en });
    }

    const promptText = buildAnalysisPrompt(questions, imageScan);
    const bookKnowledge = loadAnalysisBookKnowledge();

    const concerns = questions?.concerns || [];
    const scanConditions = (imageScan?.overall || []).map(o => o.condition || o.conditionSv).filter(Boolean);
    const allConcerns = [...new Set([...concerns, ...scanConditions])];
    const researchSnippets = await searchVayu(allConcerns);

    // Determine userId: from JWT, existing account, or auto-created account
    let userId = null;
    try {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        try {
          const decoded = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET);
          userId = decoded.id || null;
        } catch { /* not logged in, ok */ }
      }
    } catch {}

    let analysisPassword = null;
    if (!userId && req.body.questions?.email) {
      const email = req.body.questions.email.toLowerCase().trim();
      try {
        let existingUser = await db.findUserByEmail(email);
        if (!existingUser) {
          const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
          analysisPassword = Array.from(crypto.randomBytes(8), b => chars[b % chars.length]).join("");
          const passwordHash = bcrypt ? await bcrypt.hash(analysisPassword, 10) : analysisPassword;
          const namePart = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
          existingUser = await db.createUser({
            id: crypto.randomUUID(),
            name: namePart,
            email,
            phone: "",
            passwordHash,
          });
          console.log(`[Analysis] Auto-created account for ${email} (id: ${existingUser.id})`);
        }
        userId = existingUser.id;
      } catch (err) {
        console.error("[Analysis] Auto-account error:", err.message);
      }
    }

    // Rate limit: 1 analysis per 14 days per user
    if (userId) {
      try {
        const recent = await db.pool.query(
          "SELECT id, created_at FROM skin_analyses WHERE user_id = $1 AND created_at > NOW() - INTERVAL '14 days' ORDER BY created_at DESC LIMIT 1",
          [userId]
        );
        if (recent.rows.length > 0) {
          const lastDate = new Date(recent.rows[0].created_at);
          const nextDate = new Date(lastDate.getTime() + 14 * 24 * 60 * 60 * 1000);
          const daysLeft = Math.ceil((nextDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
          if (daysLeft > 0) {
            const msgs = {
              sv: `Du kan göra en ny analys om ${daysLeft} dagar. Nästa analys: ${nextDate.toLocaleDateString("sv-SE")}.`,
              en: `You can run a new analysis in ${daysLeft} days. Next analysis: ${nextDate.toLocaleDateString("en-GB")}.`,
              es: `Puedes hacer un nuevo análisis en ${daysLeft} días. Próximo análisis: ${nextDate.toLocaleDateString("es-ES")}.`,
              de: `Du kannst eine neue Analyse in ${daysLeft} Tagen machen. Nächste Analyse: ${nextDate.toLocaleDateString("de-DE")}.`,
              fr: `Vous pouvez faire une nouvelle analyse dans ${daysLeft} jours. Prochaine analyse : ${nextDate.toLocaleDateString("fr-FR")}.`,
            };
            return res.status(429).json({
              message: msgs[locale] || msgs.sv,
              nextAnalysisDate: nextDate.toISOString(),
              daysLeft,
            });
          }
        }
      } catch (err) {
        console.error("[Analysis] Rate limit check error:", err.message);
      }
    }

    let systemPromptFull = ANALYSIS_SYSTEM_PROMPT;
    const langMap = { en: "English", es: "Spanish", de: "German", fr: "French" };
    if (locale && langMap[locale]) {
      systemPromptFull += `\n\n== LANGUAGE ==\nThe user is browsing in ${langMap[locale]}. You MUST write your ENTIRE response in ${langMap[locale]} – all field values in the JSON (summary, details, tips, routine labels, product recommendations text, etc.). Keep JSON keys in English.`;
    }
    if (bookKnowledge) systemPromptFull += "\n\n== BOKKUNSKAP (Christopher Genbergs bok om holistisk hudvård) ==\n" + bookKnowledge;
    if (researchSnippets) systemPromptFull += researchSnippets;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: apiMsg("analysisNoKey", reqLocale(req)) });
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

    const imageCount = contentParts.filter(p => p.type === "input_image").length;
    const payloadEstimate = JSON.stringify(contentParts).length;
    console.log(`[Analysis] Sending ${imageCount} image(s), payload ~${(payloadEstimate / 1024 / 1024).toFixed(1)}MB, questions=${!!hasQuestions}, scan=${!!hasScan}, research=${!!researchSnippets}, model=${OPENAI_MODEL}`);

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
        max_output_tokens: 16384,
        store: true
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("[Analysis] OpenAI error:", response.status, JSON.stringify(data).slice(0, 500));
      const msg = data.error?.message || apiMsg("analysisFailed", reqLocale(req));
      throw { status: response.status, message: msg };
    }

    console.log("[Analysis] Response keys:", Object.keys(data));

    const outputText = extractOutputText(data);
    if (!outputText) {
      console.error("[Analysis] Empty output. Full response:", JSON.stringify(data).slice(0, 2000));
      throw { status: 500, message: apiMsg("analysisNoResult", reqLocale(req)) };
    }

    console.log("[Analysis] Success, output length:", outputText.length);

    let analysisId = null;
    try {
      const jsonMatch = outputText.match(/```json\s*([\s\S]*?)```/);
      const parsedResult = jsonMatch ? JSON.parse(jsonMatch[1]) : null;
      const saved = await db.createSkinAnalysis({
        userId,
        email: req.body.questions?.email,
        answers: questions || null,
        result: parsedResult,
        fullText: outputText,
        score: parsedResult?.score || null,
      });
      analysisId = saved?.id || null;
      console.log(`[Analysis] Saved to DB: id=${analysisId}, userId=${userId}, score=${parsedResult?.score}`);
      if (!userId) {
        console.warn("[Analysis] Saved with NULL user_id", {
          email: req.body.questions?.email || "(none)",
          hadAuthHeader: !!req.headers.authorization,
          analysisId,
        });
      }

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

    // Send analysis report email (async, non-blocking)
    if (req.body.questions?.email) {
      sendAnalysisReport(req.body.questions.email, outputText, req.body.questions?.locale || "sv", analysisPassword).catch(err => {
        console.error("[Analysis] Report email error:", err.message);
      });
    }
  } catch (err) {
    const errMsg = err.message || err.toString?.() || "Analysen misslyckades";
    console.error("[Analysis Error]", err.status || 500, errMsg);
    res.status(err.status || 500).json({ message: errMsg });
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
      return res.status(400).json({ message: apiMsg("noValidPhoto", reqLocale(req)) });
    }

    if (imageBase64.length > 15 * 1024 * 1024) {
      return res.status(413).json({ message: apiMsg("imageTooBig", reqLocale(req)) });
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
    const analyses = await db.getSkinAnalyses(req.user.id, req.user.email);
    res.json(analyses);
  } catch (err) {
    console.error("[Analysis History]", err);
    res.status(500).json({ message: apiMsg("historyFetchFail", reqLocale(req)) });
  }
});

app.delete("/api/analysis/:id", authMiddleware, async (req, res) => {
  try {
    const analysisId = parseInt(req.params.id, 10);
    if (isNaN(analysisId)) return res.status(400).json({ message: "Ogiltigt id" });
    const deleted = await db.deleteSkinAnalysis(req.user.id, analysisId);
    if (!deleted) return res.status(404).json({ message: "Analys ej hittad" });
    res.json({ ok: true });
  } catch (err) {
    console.error("[Analysis Delete]", err);
    res.status(500).json({ message: "Kunde inte radera analys" });
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
    const analyses = await db.getSkinAnalyses(req.user.id, req.user.email);
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
      return res.status(429).json({ message: apiMsg("rateLimited", reqLocale(req)) });
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
  if (!code) return res.status(400).json({ message: apiMsg("discountEnter", reqLocale(req)) });

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
          minOrderAmount: dbCode.min_order_amount || 0,
          productIds: dbCode.product_ids,
          description: dbCode.description
        };
      }
    }
  }

  if (!discount) return res.status(404).json({ message: apiMsg("discountInvalid", reqLocale(req)) });

  const applicableItems = (items || []).filter(i => !discount.productIds || discount.productIds.includes(i.id));
  if (applicableItems.length === 0) {
    return res.status(400).json({ message: apiMsg("discountWrongProducts", reqLocale(req)) });
  }

  const itemsTotal = applicableItems.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0);
  if (discount.minOrderAmount && itemsTotal < discount.minOrderAmount) {
    return res.status(400).json({ message: apiMsg("discountMinOrder", reqLocale(req)), minOrderAmount: discount.minOrderAmount });
  }

  res.json({
    code: key,
    percent: discount.percent || 0,
    fixedAmount: discount.fixedAmount || 0,
    minOrderAmount: discount.minOrderAmount || 0,
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
    const { customer, deliveryAddress, items, discountCode, currency: reqCurrency, createAccount, locale: reqLocale } = req.body;
    const currency = reqCurrency === "EUR" ? "EUR" : "SEK";
    const supportedLocales = ["sv", "en", "es", "de", "fr"];
    const locale = supportedLocales.includes(reqLocale) ? reqLocale : "sv";

    const orderMsg = (sv, en, es, de, fr) => ({ sv, en, es, de, fr }[locale] || en);

    if (!checkRateLimit(clientIp, "orders-create", 20)) {
      return res.status(429).json({ message: orderMsg("För många beställningar. Försök igen om en stund.", "Too many orders. Please try again later.", "Demasiados pedidos. Inténtalo más tarde.", "Zu viele Bestellungen. Bitte versuche es später erneut.", "Trop de commandes. Veuillez réessayer plus tard.") });
    }

    if (!customer?.name || !customer?.email) {
      return res.status(400).json({ message: orderMsg("Namn och e-post krävs", "Name and email are required", "Se requiere nombre y correo electrónico", "Name und E-Mail sind erforderlich", "Nom et e-mail requis") });
    }
    if (!deliveryAddress?.address || !deliveryAddress?.zip || !deliveryAddress?.city) {
      return res.status(400).json({ message: orderMsg("Leveransadress krävs", "Delivery address is required", "Se requiere dirección de entrega", "Lieferadresse erforderlich", "Adresse de livraison requise") });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ message: orderMsg("Varukorgen är tom", "Your cart is empty", "El carrito está vacío", "Dein Warenkorb ist leer", "Votre panier est vide") });
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
            minOrderAmount: dbCode.min_order_amount || 0,
            productIds: dbCode.product_ids,
            description: dbCode.description
          };
          await db.incrementDiscountUsage(discountCode);
        }
      }
    }

    if (discount && discount.minOrderAmount) {
      const cartTotal = items.reduce((sum, i) => {
        const p = PRODUCTS_MAP[i.id];
        return sum + (p ? (currency === "EUR" ? (p.priceEur || p.price) : p.price) * (i.qty || 1) : 0);
      }, 0);
      if (cartTotal < discount.minOrderAmount) {
        discount = null;
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

        sendPasswordSetupEmail(customer.email, customer.name, resetToken, locale).catch(err => {
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
        phone: (customer.phone || "").replace(/^0/, "")
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
      customerPhone: (customer.phone || "").replace(/^0/, ""),
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
    const checkoutUrl = `https://${env}.vivapayments.com/web/checkout?ref=${vivaData.orderCode}&color=108474`;

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
  // Atomic lock: only one process can claim an unprocessed order
  const lockResult = await db.pool.query(
    `UPDATE orders SET processed_at = NOW()
     WHERE id = $1 AND processed_at IS NULL
     RETURNING order_number`,
    [orderId]
  );

  if (lockResult.rowCount === 0) {
    const existing = await db.pool.query("SELECT order_number, processed_at FROM orders WHERE id = $1", [orderId]);
    const row = existing.rows[0];
    if (!row) throw new Error(`Order ${orderId} not found`);
    console.log(`[Order] ${row.order_number} already processed at ${row.processed_at} (skipped by lock)`);
    return { alreadyProcessed: true };
  }

  const order = await db.findOrderByNumber(lockResult.rows[0].order_number);
  if (!order) throw new Error(`Order ${orderId} not found after lock`);

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

      if (order.shipping_cost > 0) {
        orderRows.push({
          Description: "Frakt",
          OrderedQuantity: 1,
          DeliveredQuantity: 1,
          Price: 44,
          VAT: 25
        });
      }

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
          Freight: 0,
          OrderRows: orderRows,
          Remarks: `Order ${sharedOrderNumber} – betald via Viva Wallet`
        }
      });
      fortnoxOrderNumber = fxOrder?.Order?.DocumentNumber;
      const fxTotal = fxOrder?.Order?.Total;
      console.log(`[Fortnox] Order ${fortnoxOrderNumber}: Total=${fxTotal} (frakt som artikelrad)`);
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

  // 6. Update DB with all references (processed_at already set by atomic lock above)
  const fortnoxDone = !!fortnoxInvoiceNumber;
  const ongoingDone = !!ongoingOrderId;
  const allSucceeded = fortnoxDone && ongoingDone;
  const updateFields = {
    fortnox_customer_number: fortnoxCustomerNumber || null,
    fortnox_order_number: fortnoxOrderNumber ? String(fortnoxOrderNumber) : null,
    fortnox_invoice_number: fortnoxInvoiceNumber ? String(fortnoxInvoiceNumber) : null,
    ongoing_order_id: ongoingOrderId ? String(ongoingOrderId) : null,
    status: allSucceeded ? "fulfilled" : (fortnoxDone || ongoingDone ? "partial" : "confirmed"),
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
              locale: order.locale || "sv",
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

  // 8b. Notify team about new order
  try {
    await sendTeamOrderNotification(order, items);
  } catch (err) {
    console.error("[Order] Team notification error:", err.message);
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

// ---- TEAM NOTIFICATIONS ----

const TEAM_EMAILS = ["christopher@1753skincare.com", "torbjorn@1753skincare.com"];

async function sendTeamOrderNotification(order, items) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const { Resend } = require("resend");
  const resend = new Resend(apiKey);
  const fromAddr = emailFromInfo();
  const currencyLabel = (order.currency || "SEK") === "EUR" ? "\u20ac" : "kr";

  const itemRows = items.map(i =>
    `<tr><td style="padding:6px 12px;border-bottom:1px solid #f0f0f0">${i.name || i.product_name || i.productId || "–"}</td><td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;text-align:center">${i.quantity || i.qty || 1}</td><td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;text-align:right">${i.price ?? i.unit_price ?? "–"} ${currencyLabel}</td></tr>`
  ).join("");

  await resend.emails.send({
    from: `1753 SKINCARE <${fromAddr}>`,
    to: TEAM_EMAILS,
    subject: `Ny order: ${order.order_number} — ${order.total_amount} ${currencyLabel}`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto">
        <h2 style="color:#1d1d1f;font-size:20px;margin-bottom:8px">Ny order inkommit</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#515151;margin:16px 0">
          <tr><td style="padding:4px 0;font-weight:600;width:120px">Ordernr</td><td>${order.order_number}</td></tr>
          <tr><td style="padding:4px 0;font-weight:600">Kund</td><td>${order.customer_name}</td></tr>
          <tr><td style="padding:4px 0;font-weight:600">E-post</td><td><a href="mailto:${order.customer_email}" style="color:#108474">${order.customer_email}</a></td></tr>
          <tr><td style="padding:4px 0;font-weight:600">Totalt</td><td style="font-size:18px;font-weight:700;color:#1d1d1f">${order.total_amount} ${currencyLabel}</td></tr>
        </table>
        <table style="width:100%;border-collapse:collapse;font-size:13px;color:#515151;margin:16px 0">
          <tr style="background:#f5f5f7"><th style="padding:8px 12px;text-align:left;font-weight:600">Produkt</th><th style="padding:8px 12px;text-align:center;font-weight:600">Antal</th><th style="padding:8px 12px;text-align:right;font-weight:600">Pris</th></tr>
          ${itemRows}
        </table>
        <p style="margin-top:20px"><a href="https://www.1753skin.com/admin" style="display:inline-block;background:#108474;color:#fff;padding:10px 24px;border-radius:980px;text-decoration:none;font-weight:600;font-size:14px">Visa i admin</a></p>
      </div>
    `
  });
  console.log(`[Order] Team notification sent for ${order.order_number}`);
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
  const fromEmail = emailFromOrders();
  const baseUrl = process.env.FRONTEND_URL || "https://www.1753skin.com";
  const currency = order.currency || "SEK";
  const isSEK = currency === "SEK";
  const fmt = (amount) => isSEK ? `${Math.round(amount).toLocaleString("sv-SE")} kr` : `€${Number(amount).toFixed(2)}`;
  const l = order.locale || "sv";
  const localePath = l;
  const hasSubscription = items.some(i => i.subscription || i.intervalDays);
  const firstNameFallback = { sv: "du", en: "there", es: "amigo/a", de: "du", fr: "vous" };
  const firstName = (order.customer_name || "").split(" ")[0] || (firstNameFallback[l] || "du");

  const itemRows = items.map(i => {
    const isSubItem = i.subscription || i.intervalDays;
    const intervalDays = i.subscription?.intervalDays || i.intervalDays;
    const subBadge = isSubItem
      ? `<br><span style="display:inline-block;margin-top:4px;background:#108474;color:#fff;font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px">${emailT(l, { sv: `Prenumeration var ${intervalDays}:e dag`, en: `Subscription every ${intervalDays} days`, es: `Suscripción cada ${intervalDays} días`, de: `Abo alle ${intervalDays} Tage`, fr: `Abonnement tous les ${intervalDays} jours` })}</span>`
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
  summaryRows.push(`<tr><td style="padding:4px 0;color:#515151">${emailT(l, { sv: "Delsumma", en: "Subtotal", es: "Subtotal", de: "Zwischensumme", fr: "Sous-total" })}</td><td style="padding:4px 0;text-align:right">${fmt(subtotal)}</td></tr>`);
  if (discountAmount > 0) {
    summaryRows.push(`<tr><td style="padding:4px 0;color:#108474">${emailT(l, { sv: "Rabatt", en: "Discount", es: "Descuento", de: "Rabatt", fr: "Remise" })}</td><td style="padding:4px 0;text-align:right;color:#108474">-${fmt(discountAmount)}</td></tr>`);
  }
  summaryRows.push(`<tr><td style="padding:4px 0;color:#515151">${emailT(l, { sv: "Frakt", en: "Shipping", es: "Envío", de: "Versand", fr: "Livraison" })}</td><td style="padding:4px 0;text-align:right">${shippingCost > 0 ? fmt(shippingCost) : emailT(l, { sv: "Fri frakt", en: "Free shipping", es: "Envío gratis", de: "Kostenloser Versand", fr: "Livraison gratuite" })}</td></tr>`);
  summaryRows.push(`<tr><td style="padding:8px 0 0;font-weight:700;font-size:16px;border-top:2px solid #1d1d1f">${emailT(l, { sv: "Totalt", en: "Total", es: "Total", de: "Gesamt", fr: "Total" })}</td><td style="padding:8px 0 0;text-align:right;font-weight:700;font-size:16px;border-top:2px solid #1d1d1f">${fmt(totalAmount + shippingCost)}</td></tr>`);

  const subscriptionBlock = hasSubscription ? `
    <div style="background:#108474;border-radius:12px;padding:20px 24px;margin:24px 0;color:#fff">
      <p style="margin:0;font-size:15px;font-weight:700">${emailT(l, { sv: "Din prenumeration är aktiverad", en: "Your subscription is active", es: "Tu suscripción está activa", de: "Dein Abo ist aktiv", fr: "Votre abonnement est actif" })}</p>
      <p style="margin:8px 0 0;font-size:13px;line-height:1.6;opacity:0.9">
        ${emailT(l, {
          sv: "Nästa leverans skickas automatiskt enligt ditt valda intervall med 15% rabatt. Du kan när som helst pausa, ändra intervall eller avbryta via Mitt konto.",
          en: "Your next delivery will be sent automatically at your chosen interval with a 15% discount. You can pause, change or cancel anytime from My Account.",
          es: "Tu próxima entrega se enviará automáticamente según el intervalo elegido con un 15% de descuento. Puedes pausar, cambiar o cancelar en cualquier momento desde Mi Cuenta.",
          de: "Deine nächste Lieferung wird automatisch im gewählten Intervall mit 15% Rabatt versendet. Du kannst jederzeit pausieren, ändern oder kündigen über Mein Konto.",
          fr: "Votre prochaine livraison sera envoyée automatiquement à l'intervalle choisi avec 15% de réduction. Vous pouvez suspendre, modifier ou annuler à tout moment depuis Mon Compte."
        })}
      </p>
      <a href="${baseUrl}/${emailPath(l, "account")}" style="display:inline-block;margin-top:14px;background:#fff;color:#108474;padding:10px 24px;border-radius:980px;font-size:13px;font-weight:600;text-decoration:none">
        ${emailT(l, { sv: "Hantera prenumeration", en: "Manage subscription", es: "Gestionar suscripción", de: "Abo verwalten", fr: "Gérer l'abonnement" })} →
      </a>
    </div>
  ` : "";

  const accountBlock = order.user_id ? `
    <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0;text-align:center">
      <p style="margin:0;font-size:13px;color:#766a62">${emailT(l, { sv: "Ditt konto", en: "Your account", es: "Tu cuenta", de: "Dein Konto", fr: "Votre compte" })}</p>
      <p style="margin:6px 0 0;font-size:14px;line-height:1.6;color:#515151">
        ${emailT(l, {
          sv: "Logga in på Mitt konto för att följa din order, se leveransstatus och hantera dina inställningar.",
          en: "Sign in to My Account to track your order, view delivery status and manage your settings.",
          es: "Inicia sesión en Mi Cuenta para seguir tu pedido, ver el estado de envío y gestionar tu configuración.",
          de: "Melde dich in Mein Konto an, um deine Bestellung zu verfolgen, den Lieferstatus zu sehen und deine Einstellungen zu verwalten.",
          fr: "Connectez-vous à Mon Compte pour suivre votre commande, voir le statut de livraison et gérer vos paramètres."
        })}
      </p>
      <a href="${baseUrl}/${emailPath(l, "account")}" style="display:inline-block;margin-top:12px;background:#1d1d1f;color:#fff;padding:10px 28px;border-radius:980px;font-size:13px;font-weight:600;text-decoration:none">
        ${emailT(l, { sv: "Mitt konto", en: "My Account", es: "Mi Cuenta", de: "Mein Konto", fr: "Mon Compte" })}
      </a>
    </div>
  ` : "";

  const subject = hasSubscription
    ? emailT(l, { sv: `Orderbekräftelse & prenumeration – ${order.order_number}`, en: `Order confirmation & subscription – ${order.order_number}`, es: `Confirmación de pedido y suscripción – ${order.order_number}`, de: `Bestellbestätigung & Abo – ${order.order_number}`, fr: `Confirmation de commande & abonnement – ${order.order_number}` })
    : emailT(l, { sv: `Orderbekräftelse – ${order.order_number}`, en: `Order confirmation – ${order.order_number}`, es: `Confirmación de pedido – ${order.order_number}`, de: `Bestellbestätigung – ${order.order_number}`, fr: `Confirmation de commande – ${order.order_number}` });

  const { data: sendResult, error: sendError } = await resend.emails.send({
    from: fromEmail,
    to: order.customer_email,
    replyTo: "info@1753skin.com",
    subject,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1d1d1f;padding:0 16px">
        <div style="text-align:center;padding:32px 0 8px">
          <img src="https://www.1753skin.com/1753.png" alt="1753 SKINCARE" width="48" height="48" style="border-radius:12px"/>
        </div>
        <div style="text-align:center;padding:16px 0 24px">
          <h1 style="font-size:24px;font-weight:700;margin:0;letter-spacing:-0.02em">${emailT(l, { sv: "Tack för din beställning!", en: "Thank you for your order!", es: "¡Gracias por tu pedido!", de: "Danke für deine Bestellung!", fr: "Merci pour votre commande !" })}</h1>
        </div>
        <p style="font-size:15px;line-height:1.7;color:#515151">
          ${emailT(l, {
            sv: `Hej ${firstName}, vi har mottagit din betalning och din order behandlas nu. Du får ett separat mejl med spårningsinformation när din order skickats.`,
            en: `Hi ${firstName}, we have received your payment and your order is now being processed. You will receive a separate email with tracking information once your order has shipped.`,
            es: `Hola ${firstName}, hemos recibido tu pago y tu pedido está siendo procesado. Recibirás un email aparte con la información de seguimiento cuando tu pedido haya sido enviado.`,
            de: `Hallo ${firstName}, wir haben deine Zahlung erhalten und deine Bestellung wird jetzt bearbeitet. Du erhältst eine separate E-Mail mit Tracking-Informationen, sobald deine Bestellung versendet wurde.`,
            fr: `Bonjour ${firstName}, nous avons reçu votre paiement et votre commande est en cours de traitement. Vous recevrez un email séparé avec les informations de suivi lorsque votre commande aura été expédiée.`
          })}
        </p>
        <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0">
          <p style="margin:0;font-size:13px;color:#766a62">${emailT(l, { sv: "Ordernummer", en: "Order number", es: "Número de pedido", de: "Bestellnummer", fr: "Numéro de commande" })}</p>
          <p style="margin:4px 0 0;font-size:17px;font-weight:600">${order.order_number}</p>
        </div>
        ${subscriptionBlock}
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:20px 0">
          <thead>
            <tr style="border-bottom:2px solid #1d1d1f">
              <th style="text-align:left;padding:8px 0;font-weight:600">${emailT(l, { sv: "Produkt", en: "Product", es: "Producto", de: "Produkt", fr: "Produit" })}</th>
              <th style="text-align:center;padding:8px 0;font-weight:600">${emailT(l, { sv: "Antal", en: "Qty", es: "Cant.", de: "Anz.", fr: "Qté" })}</th>
              <th style="text-align:right;padding:8px 0;font-weight:600">${emailT(l, { sv: "Pris", en: "Price", es: "Precio", de: "Preis", fr: "Prix" })}</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 20px">
          ${summaryRows.join("")}
        </table>
        <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0">
          <p style="margin:0;font-size:13px;color:#766a62">${emailT(l, { sv: "Leveransadress", en: "Delivery address", es: "Dirección de envío", de: "Lieferadresse", fr: "Adresse de livraison" })}</p>
          <p style="margin:4px 0 0;font-size:14px">${order.customer_name}<br>${order.address}<br>${order.zip} ${order.city}</p>
        </div>
        ${accountBlock}
        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e6e6e6;text-align:center">
          <p style="font-size:13px;color:#766a62;line-height:1.6;margin:0">
            ${emailT(l, { sv: "Har du frågor? Svara på detta mejl eller kontakta oss på", en: "Questions? Reply to this email or contact us at", es: "¿Preguntas? Responde a este email o contáctanos en", de: "Fragen? Antworte auf diese E-Mail oder kontaktiere uns unter", fr: "Des questions ? Répondez à cet email ou contactez-nous à" })}
            <a href="mailto:info@1753skin.com" style="color:#108474">info@1753skin.com</a>
          </p>
          <p style="font-size:12px;color:#766a62;line-height:1.6;margin:16px 0 0">
            ${emailT(l, { sv: "1753 SKINCARE – Holistisk hudvård med CBD och CBG", en: "1753 SKINCARE – Holistic skincare with CBD and CBG", es: "1753 SKINCARE – Cuidado holístico con CBD y CBG", de: "1753 SKINCARE – Ganzheitliche Hautpflege mit CBD und CBG", fr: "1753 SKINCARE – Soins holistiques au CBD et CBG" })}<br>
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

// ---- ANALYSIS REPORT EMAIL ----

async function sendAnalysisReport(email, analysisContent, locale, accountPassword) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const { Resend } = require("resend");
  const resend = new Resend(apiKey);
  const fromAddr = emailFromInfo();
  const baseUrl = process.env.FRONTEND_URL || "https://www.1753skin.com";

  let parsed;
  try {
    const match = analysisContent.match(/```json\s*([\s\S]*?)```/);
    if (match) parsed = JSON.parse(match[1]);
  } catch { return; }
  if (!parsed) return;

  const isSv = locale === "sv";
  const isEs = locale === "es";
  const isDe = locale === "de";
  const isFr = locale === "fr";

  const subject = isSv ? `Din hudanalys — ${parsed.score}/100 poäng`
    : isEs ? `Tu análisis de piel — ${parsed.score}/100 puntos`
    : isDe ? `Deine Hautanalyse — ${parsed.score}/100 Punkte`
    : isFr ? `Votre analyse de peau — ${parsed.score}/100 points`
    : `Your skin analysis — ${parsed.score}/100 score`;

  const skinAgeHtml = parsed.skinAge ? `
    <div style="text-align:center;margin:24px 0;padding:16px;background:#f5f5f7;border-radius:16px">
      <p style="font-size:13px;color:#766a62;margin:0">${isSv ? "Biologisk hudålder" : isEs ? "Edad biológica de la piel" : isDe ? "Biologisches Hautalter" : isFr ? "Âge biologique de la peau" : "Biological skin age"}</p>
      <p style="font-size:32px;font-weight:700;color:#1d1d1f;margin:4px 0">${parsed.skinAge} ${isSv ? "år" : isEs ? "años" : isDe ? "Jahre" : isFr ? "ans" : "years"}</p>
    </div>
  ` : "";

  const concernsHtml = parsed.skinAnalysis?.concerns?.length ? parsed.skinAnalysis.concerns.slice(0, 3).map(c => {
    const issue = typeof c === "string" ? c : c.issue;
    const sev = typeof c === "string" ? "" : c.severity || "";
    const sevColor = sev === "severe" ? "#c44" : sev === "moderate" ? "#e8a020" : "#108474";
    return `<tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;width:24px;vertical-align:top;padding-top:17px">
        ${sev ? `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${sevColor}"></span>` : ""}
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#1d1d1f;line-height:1.5">${issue}</td>
    </tr>`;
  }).join("") : "";

  const productsHtml = parsed.products?.slice(0, 3).map(p => {
    const productName = (p.id && PRODUCTS_MAP[p.id]?.name) || p.name || p.id || "";
    const reasonParagraphs = (p.reason || "").split(/\n\n|\n/).filter(Boolean).map(para =>
      `<p style="font-size:13px;color:#515151;line-height:1.6;margin:6px 0 0">${para.trim()}</p>`
    ).join("");
    return `<div style="padding:16px 0;border-bottom:1px solid #f0f0f0">
      <p style="font-size:15px;font-weight:600;color:#1d1d1f;margin:0">${productName}</p>
      ${reasonParagraphs}
    </div>`;
  }).join("") || "";

  const lifestyleHtml = parsed.lifestyle?.slice(0, 3).map(l => {
    const tipParagraphs = (l.tip || "").split(/\n\n|\n/).filter(Boolean).map(para =>
      `<p style="font-size:13px;color:#515151;line-height:1.6;margin:4px 0 0">${para.trim()}</p>`
    ).join("");
    return `<div style="padding:14px 0;border-bottom:1px solid #f0f0f0">
      <p style="font-size:14px;font-weight:600;color:#1d1d1f;margin:0">${l.area}</p>
      ${tipParagraphs}
    </div>`;
  }).join("") || "";

  const routineHtml = parsed.routine ? `
    <div style="margin:28px 0">
      <h3 style="font-size:16px;font-weight:600;color:#1d1d1f;margin:0 0 14px">${isSv ? "Din rutin" : isEs ? "Tu rutina" : isDe ? "Deine Routine" : isFr ? "Votre routine" : "Your routine"}</h3>
      <div style="display:flex;gap:16px">
        <div style="flex:1">
          <p style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#766a62;margin:0 0 8px">${isSv ? "Morgon" : isEs ? "Mañana" : isDe ? "Morgen" : isFr ? "Matin" : "Morning"}</p>
          ${(parsed.routine.morning || []).map(s => `<p style="font-size:12px;color:#515151;margin:4px 0">• ${typeof s === "string" ? s : s.step}</p>`).join("")}
        </div>
        <div style="flex:1">
          <p style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#766a62;margin:0 0 8px">${isSv ? "Kväll" : isEs ? "Noche" : isDe ? "Abend" : isFr ? "Soir" : "Evening"}</p>
          ${(parsed.routine.evening || []).map(s => `<p style="font-size:12px;color:#515151;margin:4px 0">• ${typeof s === "string" ? s : s.step}</p>`).join("")}
        </div>
      </div>
    </div>
  ` : "";

  const ctaLabel = isSv ? "Logga in och se din analys" : isEs ? "Inicia sesión y ve tu análisis" : isDe ? "Einloggen und Analyse ansehen" : isFr ? "Connectez-vous pour voir votre analyse" : "Log in to view your analysis";
  const loginSlug = { sv: "logga-in", en: "login", es: "iniciar-sesion", de: "anmelden", fr: "connexion" };
  const ctaUrl = `${baseUrl}/${locale}/${loginSlug[locale] || loginSlug.en}`;

  const accountBlockHtml = accountPassword ? `
    <div style="background:#f5f5f7;border-radius:16px;padding:20px 24px;margin-bottom:28px;border:1px solid #e6e6e6">
      <p style="font-size:14px;font-weight:600;color:#1d1d1f;margin:0 0 8px">
        ${isSv ? "Ditt konto har skapats" : isEs ? "Tu cuenta ha sido creada" : isDe ? "Dein Konto wurde erstellt" : isFr ? "Votre compte a été créé" : "Your account has been created"}
      </p>
      <p style="font-size:13px;color:#515151;line-height:1.6;margin:0 0 14px">
        ${isSv ? "Vi har skapat ett konto åt dig så att du kan följa din hudresa och göra nya analyser." : isEs ? "Hemos creado una cuenta para ti para que puedas seguir tu viaje cutáneo y hacer nuevos análisis." : isDe ? "Wir haben ein Konto für dich erstellt, damit du deine Hautreise verfolgen und neue Analysen durchführen kannst." : isFr ? "Nous avons créé un compte pour vous afin que vous puissiez suivre votre parcours cutané et effectuer de nouvelles analyses." : "We've created an account for you so you can track your skin journey and run new analyses."}
      </p>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:8px 12px;background:#fff;border-radius:8px 8px 0 0;border-bottom:1px solid #eee">
            <span style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#766a62">${isSv ? "E-post" : isEs ? "Correo" : isDe ? "E-Mail" : isFr ? "E-mail" : "Email"}</span><br>
            <span style="font-size:14px;font-weight:500;color:#1d1d1f">${email}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#fff;border-radius:0 0 8px 8px">
            <span style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#766a62">${isSv ? "Lösenord" : isEs ? "Contraseña" : isDe ? "Passwort" : isFr ? "Mot de passe" : "Password"}</span><br>
            <span style="font-size:16px;font-weight:600;color:#108474;font-family:monospace;letter-spacing:1px">${accountPassword}</span>
          </td>
        </tr>
      </table>
      <p style="font-size:11px;color:#766a62;margin:12px 0 0">
        ${isSv ? "Du kan byta lösenord i dina kontoinställningar efter inloggning." : isEs ? "Puedes cambiar tu contraseña en la configuración de tu cuenta después de iniciar sesión." : isDe ? "Du kannst dein Passwort in den Kontoeinstellungen nach dem Einloggen ändern." : isFr ? "Vous pouvez changer votre mot de passe dans les paramètres de votre compte après connexion." : "You can change your password in your account settings after logging in."}
      </p>
    </div>
  ` : "";

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1d1d1f;padding:0 16px">
      <div style="text-align:center;padding:32px 0 24px">
        <img src="https://www.1753skin.com/1753.png" alt="1753 SKINCARE" width="80" height="80" style="border-radius:16px;display:inline-block" />
      </div>

      ${accountBlockHtml}

      <div style="text-align:center;margin-bottom:24px">
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" style="height:120px;width:120px;v-text-anchor:middle;" arcsize="50%" fillcolor="#108474" stroke="f">
          <v:textbox inset="0,0,0,0"><center style="font-size:36px;font-weight:700;color:#ffffff;font-family:Arial,sans-serif;">${parsed.score}</center></v:textbox>
        </v:roundrect>
        <![endif]-->
        <!--[if !mso]><!-->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto">
          <tr>
            <td align="center" valign="middle" width="120" height="120" style="width:120px;height:120px;border-radius:60px;background-color:#108474;text-align:center;vertical-align:middle;">
              <span style="font-size:36px;font-weight:700;color:#ffffff;font-family:Arial,sans-serif;line-height:120px">${parsed.score}</span>
            </td>
          </tr>
        </table>
        <!--<![endif]-->
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#766a62;margin:12px 0 0">${isSv ? "Din hudpoäng" : isEs ? "Tu puntuación" : isDe ? "Dein Hautscore" : isFr ? "Votre score" : "Your skin score"}</p>
      </div>

      ${skinAgeHtml}

      <div style="margin:24px 0">
        ${(() => {
          const raw = parsed.summary || "";
          let paragraphs = raw.split(/\n\n|\n/).filter(Boolean);
          if (paragraphs.length <= 1 && raw.length > 200) {
            const sentences = raw.match(/[^.!?]+[.!?]+/g) || [raw];
            const mid = Math.ceil(sentences.length / 2);
            paragraphs = [
              sentences.slice(0, mid).join(" ").trim(),
              sentences.slice(mid).join(" ").trim(),
            ].filter(Boolean);
          }
          return paragraphs.map(para =>
            `<p style="font-size:14px;line-height:1.7;color:#515151;margin:0 0 14px">${para.trim()}</p>`
          ).join("");
        })()}
      </div>

      ${concernsHtml ? `
        <div style="margin:28px 0">
          <h3 style="font-size:16px;font-weight:600;color:#1d1d1f;margin:0 0 14px">${isSv ? "Fokusområden" : isEs ? "Áreas de enfoque" : isDe ? "Fokusgebiete" : isFr ? "Domaines d'attention" : "Focus areas"}</h3>
          <table style="width:100%;border-collapse:collapse">${concernsHtml}</table>
        </div>
      ` : ""}

      ${productsHtml ? `
        <div style="margin:28px 0">
          <h3 style="font-size:16px;font-weight:600;color:#1d1d1f;margin:0 0 14px">${isSv ? "Rekommenderade produkter" : isEs ? "Productos recomendados" : isDe ? "Empfohlene Produkte" : isFr ? "Produits recommandés" : "Recommended products"}</h3>
          ${productsHtml}
        </div>
      ` : ""}

      ${lifestyleHtml ? `
        <div style="margin:28px 0">
          <h3 style="font-size:16px;font-weight:600;color:#1d1d1f;margin:0 0 14px">${isSv ? "Livsstilsråd" : isEs ? "Consejos de estilo de vida" : isDe ? "Lifestyle-Tipps" : isFr ? "Conseils mode de vie" : "Lifestyle tips"}</h3>
          ${lifestyleHtml}
        </div>
      ` : ""}

      ${routineHtml}

      <div style="text-align:center;margin:32px 0">
        <a href="${ctaUrl}" style="display:inline-block;background:#108474;color:#fff;padding:14px 32px;border-radius:980px;text-decoration:none;font-weight:600;font-size:14px">${ctaLabel}</a>
      </div>

      <div style="border-top:1px solid #e6e6e6;padding:24px 0;text-align:center">
        <p style="font-size:12px;color:#766a62;line-height:1.5;margin:0">
          1753 SKINCARE<br>
          <a href="${baseUrl}" style="color:#108474">www.1753skin.com</a>
        </p>
        <p style="margin-top:8px;font-size:10px;color:#999">
          ${isSv ? "Denna analys är framtagen med hjälp av AI och utgör inte medicinsk rådgivning." : isEs ? "Este análisis fue generado con IA y no constituye asesoramiento médico." : isDe ? "Diese Analyse wurde mit KI erstellt und stellt keine medizinische Beratung dar." : isFr ? "Cette analyse a été générée par IA et ne constitue pas un avis médical." : "This analysis was generated using AI and does not constitute medical advice."}
        </p>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: `1753 SKINCARE <${fromAddr}>`,
    to: email,
    subject,
    html,
  });
  console.log(`[Analysis] Report email sent to ${email}`);
}

// ---- SHIPPING CONFIRMATION EMAIL ----

async function sendShippingConfirmation(order, items, trackingNumber, trackingUrl) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, skipReason: "no_api_key" };

  const { Resend } = require("resend");
  const resend = new Resend(apiKey);
  const fromEmail = emailFromOrders();
  const baseUrl = process.env.FRONTEND_URL || "https://www.1753skin.com";
  const l = order.locale || "sv";
  const localePath = l;
  const currency = order.currency || "SEK";
  const isSEK = currency === "SEK";
  const fmt = (amount) => isSEK ? `${Math.round(amount).toLocaleString("sv-SE")} kr` : `€${Number(amount).toFixed(2)}`;
  const firstNameFallback = { sv: "du", en: "there", es: "amigo/a", de: "du", fr: "vous" };
  const firstName = (order.customer_name || "").split(" ")[0] || (firstNameFallback[l] || "du");

  const itemRows = items.map(i => `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #eee">${i.name}</td>
    <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
    <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${fmt(i.price * i.quantity)}</td>
  </tr>`).join("");

  const trackingBlock = trackingNumber ? `
    <div style="background:#108474;border-radius:12px;padding:20px 24px;margin:24px 0;color:#fff;text-align:center">
      <p style="margin:0;font-size:13px;opacity:0.9">${emailT(l, { sv: "Spårningsnummer", en: "Tracking number", es: "Número de seguimiento", de: "Sendungsnummer", fr: "Numéro de suivi" })}</p>
      <p style="margin:8px 0 0;font-size:20px;font-weight:700;letter-spacing:0.5px">${trackingNumber}</p>
      ${trackingUrl ? `<a href="${trackingUrl}" style="display:inline-block;margin-top:14px;background:#fff;color:#108474;padding:10px 24px;border-radius:980px;font-size:13px;font-weight:600;text-decoration:none">
        ${emailT(l, { sv: "Spåra ditt paket", en: "Track your package", es: "Rastrear tu paquete", de: "Paket verfolgen", fr: "Suivre votre colis" })} →
      </a>` : ""}
    </div>
  ` : `
    <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0;text-align:center">
      <p style="margin:0;font-size:14px;color:#515151">
        ${emailT(l, { sv: "Spårningsinformation blir tillgänglig inom kort.", en: "Tracking information will be available shortly.", es: "La información de seguimiento estará disponible en breve.", de: "Tracking-Informationen werden in Kürze verfügbar sein.", fr: "Les informations de suivi seront bientôt disponibles." })}
      </p>
    </div>
  `;

  const subject = emailT(l, { sv: `Din order är på väg! – ${order.order_number}`, en: `Your order is on its way! – ${order.order_number}`, es: `¡Tu pedido está en camino! – ${order.order_number}`, de: `Deine Bestellung ist unterwegs! – ${order.order_number}`, fr: `Votre commande est en route ! – ${order.order_number}` });

  const { data: sendResult, error: sendError } = await resend.emails.send({
    from: fromEmail,
    to: order.customer_email,
    replyTo: "info@1753skin.com",
    subject,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1d1d1f;padding:0 16px">
        <div style="text-align:center;padding:32px 0 8px">
          <img src="https://www.1753skin.com/1753.png" alt="1753 SKINCARE" width="48" height="48" style="border-radius:12px"/>
        </div>
        <div style="text-align:center;padding:16px 0 24px">
          <h1 style="font-size:24px;font-weight:700;margin:0;letter-spacing:-0.02em">${emailT(l, { sv: "Din order är på väg!", en: "Your order is on its way!", es: "¡Tu pedido está en camino!", de: "Deine Bestellung ist unterwegs!", fr: "Votre commande est en route !" })}</h1>
        </div>
        <p style="font-size:15px;line-height:1.7;color:#515151">
          ${emailT(l, {
            sv: `Hej ${firstName}, goda nyheter! Din order har packats och skickats. ${trackingNumber ? "Du kan spåra ditt paket via länken nedan." : "Vi skickar spårningsdetaljer så snart de finns tillgängliga."}`,
            en: `Hi ${firstName}, great news! Your order has been packed and shipped. ${trackingNumber ? "You can track your package using the link below." : "We'll send tracking details as soon as they're available."}`,
            es: `Hola ${firstName}, ¡buenas noticias! Tu pedido ha sido empaquetado y enviado. ${trackingNumber ? "Puedes rastrear tu paquete con el enlace de abajo." : "Te enviaremos los detalles de seguimiento en cuanto estén disponibles."}`,
            de: `Hallo ${firstName}, tolle Nachrichten! Deine Bestellung wurde verpackt und versendet. ${trackingNumber ? "Du kannst dein Paket über den Link unten verfolgen." : "Wir senden dir die Tracking-Daten, sobald sie verfügbar sind."}`,
            fr: `Bonjour ${firstName}, bonne nouvelle ! Votre commande a été emballée et expédiée. ${trackingNumber ? "Vous pouvez suivre votre colis via le lien ci-dessous." : "Nous vous enverrons les détails de suivi dès qu'ils seront disponibles."}`
          })}
        </p>
        <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0">
          <p style="margin:0;font-size:13px;color:#766a62">${emailT(l, { sv: "Ordernummer", en: "Order number", es: "Número de pedido", de: "Bestellnummer", fr: "Numéro de commande" })}</p>
          <p style="margin:4px 0 0;font-size:17px;font-weight:600">${order.order_number}</p>
        </div>
        ${trackingBlock}
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:20px 0">
          <thead>
            <tr style="border-bottom:2px solid #1d1d1f">
              <th style="text-align:left;padding:8px 0;font-weight:600">${emailT(l, { sv: "Produkt", en: "Product", es: "Producto", de: "Produkt", fr: "Produit" })}</th>
              <th style="text-align:center;padding:8px 0;font-weight:600">${emailT(l, { sv: "Antal", en: "Qty", es: "Cant.", de: "Anz.", fr: "Qté" })}</th>
              <th style="text-align:right;padding:8px 0;font-weight:600">${emailT(l, { sv: "Pris", en: "Price", es: "Precio", de: "Preis", fr: "Prix" })}</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0">
          <p style="margin:0;font-size:13px;color:#766a62">${emailT(l, { sv: "Leveransadress", en: "Delivery address", es: "Dirección de envío", de: "Lieferadresse", fr: "Adresse de livraison" })}</p>
          <p style="margin:4px 0 0;font-size:14px">${order.customer_name}<br>${order.address}<br>${order.zip} ${order.city}</p>
        </div>
        ${order.user_id ? `
        <div style="text-align:center;margin:20px 0">
          <a href="${baseUrl}/${emailPath(l, "account")}" style="display:inline-block;background:#1d1d1f;color:#fff;padding:12px 32px;border-radius:980px;font-size:14px;font-weight:600;text-decoration:none">
            ${emailT(l, { sv: "Mitt konto", en: "My Account", es: "Mi Cuenta", de: "Mein Konto", fr: "Mon Compte" })}
          </a>
        </div>` : ""}
        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e6e6e6;text-align:center">
          <p style="font-size:13px;color:#766a62;line-height:1.6;margin:0">
            ${emailT(l, { sv: "Har du frågor? Svara på detta mejl eller kontakta oss på", en: "Questions? Reply to this email or contact us at", es: "¿Preguntas? Responde a este email o contáctanos en", de: "Fragen? Antworte auf diese E-Mail oder kontaktiere uns unter", fr: "Des questions ? Répondez à cet email ou contactez-nous à" })}
            <a href="mailto:info@1753skin.com" style="color:#108474">info@1753skin.com</a>
          </p>
          <p style="font-size:12px;color:#766a62;line-height:1.6;margin:16px 0 0">
            ${emailT(l, { sv: "1753 SKINCARE – Holistisk hudvård med CBD och CBG", en: "1753 SKINCARE – Holistic skincare with CBD and CBG", es: "1753 SKINCARE – Cuidado holístico con CBD y CBG", de: "1753 SKINCARE – Ganzheitliche Hautpflege mit CBD und CBG", fr: "1753 SKINCARE – Soins holistiques au CBD et CBG" })}<br>
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
  const fromEmail = emailFromOrders();
  const baseUrl = process.env.FRONTEND_URL || "https://www.1753skin.com";

  const email = sub.customer_email;
  if (!email) return { sent: false, skipReason: "no_email" };

  const user = sub.user_id ? await db.findUserById(sub.user_id) : null;
  const l = sub.locale || user?.locale || "sv";
  const localePath = l;
  const firstNameFallback = { sv: "du", en: "there", es: "amigo/a", de: "du", fr: "vous" };
  const firstName = (user?.name || sub.customer_name || "").split(" ")[0] || (firstNameFallback[l] || "du");
  const pn = sub.product_name;
  const hi = emailT(l, { sv: "Hej", en: "Hi", es: "Hola", de: "Hallo", fr: "Bonjour" });

  const actionTexts = {
    paused: {
      subject: emailT(l, { sv: "Din prenumeration är pausad", en: "Your subscription has been paused", es: "Tu suscripción ha sido pausada", de: "Dein Abo wurde pausiert", fr: "Votre abonnement a été mis en pause" }),
      heading: emailT(l, { sv: "Prenumeration pausad", en: "Subscription paused", es: "Suscripción pausada", de: "Abo pausiert", fr: "Abonnement en pause" }),
      body: emailT(l, {
        sv: `${hi} ${firstName}, din prenumeration på <strong>${pn}</strong> har pausats. Du debiteras inte förrän du återupptar den. Du kan återuppta den när som helst via Mitt konto.`,
        en: `${hi} ${firstName}, your subscription for <strong>${pn}</strong> has been paused. You won't be charged until you resume it. You can resume at any time from My Account.`,
        es: `${hi} ${firstName}, tu suscripción de <strong>${pn}</strong> ha sido pausada. No se te cobrará hasta que la reanudes. Puedes reanudarla en cualquier momento desde Mi Cuenta.`,
        de: `${hi} ${firstName}, dein Abo für <strong>${pn}</strong> wurde pausiert. Du wirst erst wieder belastet, wenn du es fortsetzt. Du kannst es jederzeit über Mein Konto fortsetzen.`,
        fr: `${hi} ${firstName}, votre abonnement pour <strong>${pn}</strong> a été mis en pause. Vous ne serez pas facturé(e) jusqu'à sa reprise. Vous pouvez le reprendre à tout moment depuis Mon Compte.`
      }),
    },
    resumed: {
      subject: emailT(l, { sv: "Din prenumeration är aktiv igen", en: "Your subscription is active again", es: "Tu suscripción está activa de nuevo", de: "Dein Abo ist wieder aktiv", fr: "Votre abonnement est de nouveau actif" }),
      heading: emailT(l, { sv: "Prenumeration återupptagen", en: "Subscription resumed", es: "Suscripción reanudada", de: "Abo fortgesetzt", fr: "Abonnement repris" }),
      body: emailT(l, {
        sv: `${hi} ${firstName}, din prenumeration på <strong>${pn}</strong> är aktiv igen. Nästa leverans är planerad till <strong>${details?.nextCharge || "snart"}</strong>.`,
        en: `${hi} ${firstName}, your subscription for <strong>${pn}</strong> is active again. Your next delivery is scheduled for <strong>${details?.nextCharge || "soon"}</strong>.`,
        es: `${hi} ${firstName}, tu suscripción de <strong>${pn}</strong> está activa de nuevo. Tu próxima entrega está programada para <strong>${details?.nextCharge || "pronto"}</strong>.`,
        de: `${hi} ${firstName}, dein Abo für <strong>${pn}</strong> ist wieder aktiv. Deine nächste Lieferung ist geplant für <strong>${details?.nextCharge || "bald"}</strong>.`,
        fr: `${hi} ${firstName}, votre abonnement pour <strong>${pn}</strong> est de nouveau actif. Votre prochaine livraison est prévue pour le <strong>${details?.nextCharge || "bientôt"}</strong>.`
      }),
    },
    cancelled: {
      subject: emailT(l, { sv: "Din prenumeration är avbruten", en: "Your subscription has been cancelled", es: "Tu suscripción ha sido cancelada", de: "Dein Abo wurde gekündigt", fr: "Votre abonnement a été annulé" }),
      heading: emailT(l, { sv: "Prenumeration avbruten", en: "Subscription cancelled", es: "Suscripción cancelada", de: "Abo gekündigt", fr: "Abonnement annulé" }),
      body: emailT(l, {
        sv: `${hi} ${firstName}, din prenumeration på <strong>${pn}</strong> har avbrutits. Du kommer inte debiteras igen. Vi hoppas att du kommer tillbaka — du kan alltid starta en ny prenumeration via våra produktsidor.`,
        en: `${hi} ${firstName}, your subscription for <strong>${pn}</strong> has been cancelled. You won't be charged again. We're sorry to see you go — you can always start a new subscription from our product pages.`,
        es: `${hi} ${firstName}, tu suscripción de <strong>${pn}</strong> ha sido cancelada. No se te cobrará de nuevo. Esperamos verte pronto — siempre puedes iniciar una nueva suscripción desde nuestras páginas de productos.`,
        de: `${hi} ${firstName}, dein Abo für <strong>${pn}</strong> wurde gekündigt. Du wirst nicht mehr belastet. Wir hoffen, dich wiederzusehen — du kannst jederzeit ein neues Abo über unsere Produktseiten starten.`,
        fr: `${hi} ${firstName}, votre abonnement pour <strong>${pn}</strong> a été annulé. Vous ne serez plus facturé(e). Nous espérons vous revoir — vous pouvez toujours démarrer un nouvel abonnement depuis nos pages produits.`
      }),
    },
    updated: {
      subject: emailT(l, { sv: "Din prenumeration har uppdaterats", en: "Your subscription has been updated", es: "Tu suscripción ha sido actualizada", de: "Dein Abo wurde aktualisiert", fr: "Votre abonnement a été mis à jour" }),
      heading: emailT(l, { sv: "Prenumeration uppdaterad", en: "Subscription updated", es: "Suscripción actualizada", de: "Abo aktualisiert", fr: "Abonnement mis à jour" }),
      body: emailT(l, {
        sv: `${hi} ${firstName}, din prenumeration på <strong>${pn}</strong> har uppdaterats.${details?.intervalDays ? ` Nytt leveransintervall: var <strong>${details.intervalDays}:e dag</strong>.` : ""}${details?.quantity ? ` Ny mängd: <strong>${details.quantity}</strong>.` : ""}`,
        en: `${hi} ${firstName}, your subscription for <strong>${pn}</strong> has been updated.${details?.intervalDays ? ` New delivery interval: every <strong>${details.intervalDays} days</strong>.` : ""}${details?.quantity ? ` New quantity: <strong>${details.quantity}</strong>.` : ""}`,
        es: `${hi} ${firstName}, tu suscripción de <strong>${pn}</strong> ha sido actualizada.${details?.intervalDays ? ` Nuevo intervalo de entrega: cada <strong>${details.intervalDays} días</strong>.` : ""}${details?.quantity ? ` Nueva cantidad: <strong>${details.quantity}</strong>.` : ""}`,
        de: `${hi} ${firstName}, dein Abo für <strong>${pn}</strong> wurde aktualisiert.${details?.intervalDays ? ` Neues Lieferintervall: alle <strong>${details.intervalDays} Tage</strong>.` : ""}${details?.quantity ? ` Neue Menge: <strong>${details.quantity}</strong>.` : ""}`,
        fr: `${hi} ${firstName}, votre abonnement pour <strong>${pn}</strong> a été mis à jour.${details?.intervalDays ? ` Nouvel intervalle de livraison : tous les <strong>${details.intervalDays} jours</strong>.` : ""}${details?.quantity ? ` Nouvelle quantité : <strong>${details.quantity}</strong>.` : ""}`
      }),
    },
  };

  const tt = actionTexts[action];
  if (!tt) return { sent: false, skipReason: "unknown_action" };

  const { data: sendResult, error: sendError } = await resend.emails.send({
    from: fromEmail,
    to: email,
    replyTo: "info@1753skin.com",
    subject: tt.subject,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1d1d1f;padding:0 16px">
        <div style="text-align:center;padding:32px 0 8px">
          <img src="https://www.1753skin.com/1753.png" alt="1753 SKINCARE" width="48" height="48" style="border-radius:12px"/>
        </div>
        <div style="text-align:center;padding:16px 0 24px">
          <h1 style="font-size:24px;font-weight:700;margin:0;letter-spacing:-0.02em">${tt.heading}</h1>
        </div>
        <p style="font-size:15px;line-height:1.7;color:#515151">${tt.body}</p>
        <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:24px 0">
          <p style="margin:0;font-size:13px;color:#766a62">${emailT(l, { sv: "Produkt", en: "Product", es: "Producto", de: "Produkt", fr: "Produit" })}</p>
          <p style="margin:4px 0 0;font-size:15px;font-weight:600">${pn}</p>
        </div>
        <div style="text-align:center;margin:28px 0">
          <a href="${baseUrl}/${emailPath(l, "account")}"
             style="display:inline-block;padding:14px 32px;background:#1d1d1f;color:#fff;font-size:15px;font-weight:600;border-radius:980px;text-decoration:none">
            ${emailT(l, { sv: "Mitt konto", en: "My Account", es: "Mi Cuenta", de: "Mein Konto", fr: "Mon Compte" })}
          </a>
        </div>
        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e6e6e6;text-align:center">
          <p style="font-size:13px;color:#766a62;line-height:1.6;margin:0">
            ${emailT(l, { sv: "Har du frågor? Svara på detta mejl eller kontakta oss på", en: "Questions? Reply to this email or contact us at", es: "¿Preguntas? Responde a este email o contáctanos en", de: "Fragen? Antworte auf diese E-Mail oder kontaktiere uns unter", fr: "Des questions ? Répondez à cet email ou contactez-nous à" })}
            <a href="mailto:info@1753skin.com" style="color:#108474">info@1753skin.com</a>
          </p>
          <p style="font-size:12px;color:#766a62;line-height:1.6;margin:16px 0 0">
            ${emailT(l, { sv: "1753 SKINCARE – Holistisk hudvård med CBD och CBG", en: "1753 SKINCARE – Holistic skincare with CBD and CBG", es: "1753 SKINCARE – Cuidado holístico con CBD y CBG", de: "1753 SKINCARE – Ganzheitliche Hautpflege mit CBD und CBG", fr: "1753 SKINCARE – Soins holistiques au CBD et CBG" })}<br>
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

async function sendPasswordSetupEmail(email, name, resetToken, locale) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not set – password setup email NOT sent");
    return { sent: false, skipReason: "no_api_key" };
  }

  const { Resend } = require("resend");
  const resend = new Resend(apiKey);
  const fromEmail = emailFromInfo();
  const baseUrl = process.env.FRONTEND_URL || "https://www.1753skin.com";
  const l = locale || "sv";

  const setPasswordSegments = {
    sv: "valj-losenord", en: "set-password", es: "establecer-contrasena",
    de: "passwort-setzen", fr: "choisir-mot-de-passe"
  };
  const resetUrl = `${baseUrl}/${l}/${setPasswordSegments[l] || setPasswordSegments.en}?token=${resetToken}`;
  const firstNameFallback = { sv: "du", en: "there", es: "amigo/a", de: "du", fr: "vous" };
  const firstName = (name || "").split(" ")[0] || (firstNameFallback[l] || "du");

  const subjects = {
    sv: "Välkommen till 1753 SKINCARE – Välj ditt lösenord",
    en: "Welcome to 1753 SKINCARE – Set your password",
    es: "Bienvenido a 1753 SKINCARE – Establece tu contraseña",
    de: "Willkommen bei 1753 SKINCARE – Passwort festlegen",
    fr: "Bienvenue chez 1753 SKINCARE – Définir votre mot de passe"
  };
  const greetings = {
    sv: `Välkommen, ${firstName}!`, en: `Welcome, ${firstName}!`,
    es: `Bienvenido/a, ${firstName}!`, de: `Willkommen, ${firstName}!`,
    fr: `Bienvenue, ${firstName} !`
  };
  const bodyTexts = {
    sv: "Vi har skapat ett konto åt dig i vårt lojalitetsprogram. Du tjänar poäng på varje köp och får tillgång till exklusiva förmåner och rabatter.",
    en: "We've created an account for you in our loyalty programme. You earn points on every purchase and get access to exclusive perks and discounts.",
    es: "Hemos creado una cuenta para ti en nuestro programa de fidelización. Ganas puntos en cada compra y accedes a ventajas y descuentos exclusivos.",
    de: "Wir haben ein Konto für dich in unserem Treueprogramm erstellt. Du sammelst Punkte bei jedem Einkauf und erhältst Zugang zu exklusiven Vorteilen und Rabatten.",
    fr: "Nous avons créé un compte pour vous dans notre programme de fidélité. Vous gagnez des points à chaque achat et accédez à des avantages et réductions exclusifs."
  };
  const ctaTexts = {
    sv: "Klicka på knappen nedan för att välja ditt lösenord och aktivera ditt konto:",
    en: "Click the button below to set your password and activate your account:",
    es: "Haz clic en el botón de abajo para establecer tu contraseña y activar tu cuenta:",
    de: "Klicke auf den Button unten, um dein Passwort festzulegen und dein Konto zu aktivieren:",
    fr: "Cliquez sur le bouton ci-dessous pour définir votre mot de passe et activer votre compte :"
  };
  const btnTexts = {
    sv: "Välj lösenord", en: "Set password",
    es: "Establecer contraseña", de: "Passwort festlegen",
    fr: "Définir le mot de passe"
  };
  const expiryTexts = {
    sv: "Länken är giltig i 72 timmar. Om den har gått ut kan du alltid begära en ny via inloggningssidan.",
    en: "The link is valid for 72 hours. If it has expired, you can request a new one from the login page.",
    es: "El enlace es válido durante 72 horas. Si ha expirado, puedes solicitar uno nuevo desde la página de inicio de sesión.",
    de: "Der Link ist 72 Stunden gültig. Falls er abgelaufen ist, kannst du über die Anmeldeseite einen neuen anfordern.",
    fr: "Le lien est valide pendant 72 heures. S'il a expiré, vous pouvez en demander un nouveau depuis la page de connexion."
  };

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: subjects[l] || subjects.en,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1d1d1f;padding:0 16px">
        <div style="text-align:center;padding:32px 0 8px">
          <img src="https://www.1753skin.com/1753.png" alt="1753 SKINCARE" width="48" height="48" style="border-radius:12px"/>
        </div>
        <div style="text-align:center;padding:16px 0 24px">
          <h1 style="font-size:24px;font-weight:700;margin:0;letter-spacing:-0.02em">${greetings[l] || greetings.en}</h1>
        </div>
        <p style="font-size:15px;line-height:1.7;color:#515151">${bodyTexts[l] || bodyTexts.en}</p>
        <p style="font-size:15px;line-height:1.7;color:#515151">${ctaTexts[l] || ctaTexts.en}</p>
        <div style="text-align:center;margin:28px 0">
          <a href="${resetUrl}"
             style="display:inline-block;padding:14px 32px;background:#108474;color:#fff;font-size:15px;font-weight:600;border-radius:980px;text-decoration:none">
            ${btnTexts[l] || btnTexts.en}
          </a>
        </div>
        <p style="font-size:13px;color:#766a62;line-height:1.7">${expiryTexts[l] || expiryTexts.en}</p>
        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e6e6e6;text-align:center">
          <p style="font-size:12px;color:#766a62;line-height:1.6;margin:0">
            1753 SKINCARE<br>
            <a href="https://www.1753skin.com" style="color:#108474">www.1753skin.com</a>
          </p>
        </div>
      </div>
    `
  });

  console.log(`[Email] Password setup email sent to ${email} (locale: ${l})`);
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
    const fromAddr = emailFromInfo();

    await resend.emails.send({
      from: `1753 SKINCARE <${fromAddr}>`,
      to: TEAM_EMAILS,
      subject: `Nytt kundmeddelande: ${subject}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto">
          <h3 style="color:#1d1d1f;margin-bottom:8px">Nytt inkommande meddelande</h3>
          <p style="color:#515151"><strong>Fran:</strong> ${fromName || "Okant"} &lt;${fromEmail}&gt;</p>
          <p style="color:#515151"><strong>Amne:</strong> ${subject}</p>
          <p style="color:#515151">Ett AI-genererat svarsutkast vantar pa godkannande i admin-panelen.</p>
          <p style="margin-top:16px"><a href="https://www.1753skin.com/admin/inkorg" style="display:inline-block;background:#108474;color:#fff;padding:10px 24px;border-radius:980px;text-decoration:none;font-weight:600;font-size:14px">Oppna inkorg</a></p>
        </div>
      `
    });
  } catch (err) {
    console.error("[EmailAI] Notification send failed:", err.message);
  }
}

// ---- AUTO-UNSUBSCRIBE DETECTION ----

const UNSUB_PATTERNS = [
  /avprenumer/i,
  /avanmäl/i,
  /unsubscri/i,
  /sluta\s+skicka/i,
  /ta\s+bort\s+m(ig|ej)/i,
  /vill\s+inte\s+(ha|få)\s+(mer|fler|nyhetsbrev|mail|mejl|utskick)/i,
  /inte\s+längre\s+(få|ha|prenumerer)/i,
  /remove\s+me/i,
  /opt\s*out/i,
  /stop\s+(sending|emails)/i,
];

function isUnsubscribeRequest(text) {
  if (!text) return false;
  return UNSUB_PATTERNS.some(p => p.test(text));
}

async function handleAutoUnsubscribe(email, name) {
  try {
    const subscriber = await db.findSubscriberByEmail(email);
    if (!subscriber || subscriber.status !== "active") {
      console.log(`[AutoUnsub] ${email} not an active subscriber, skipping`);
      return { handled: false, wasActive: false };
    }

    await db.unsubscribeByEmail(email);
    await db.cancelAutomationsForSubscriber(subscriber.id);
    syncResendUnsubscribe(email).catch(() => {});
    console.log(`[AutoUnsub] ${email} automatically unsubscribed from newsletter`);

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const { Resend } = require("resend");
      const resend = new Resend(apiKey);
      const fromAddr = emailFromInfo();
      const firstName = name?.split(" ")[0] || "";

      const subLocale = subscriber.locale || "sv";
      const hiName = firstName ? ` ${firstName}` : "";
      await resend.emails.send({
        from: `1753 SKINCARE <${fromAddr}>`,
        to: email,
        subject: emailT(subLocale, { sv: "Bekräftelse: du är avprenumererad", en: "Confirmation: you have been unsubscribed", es: "Confirmación: te has dado de baja", de: "Bestätigung: du bist abgemeldet", fr: "Confirmation : vous êtes désabonné(e)" }),
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;color:#1d1d1f">
            <h2 style="font-size:20px;margin-bottom:8px">${emailT(subLocale, { sv: `Hej${hiName},`, en: `Hi${hiName},`, es: `Hola${hiName},`, de: `Hallo${hiName},`, fr: `Bonjour${hiName},` })}</h2>
            <p style="color:#515151;line-height:1.6">${emailT(subLocale, {
              sv: "Vi har tagit bort dig från vårt nyhetsbrev. Du kommer inte längre att få utskick från oss.",
              en: "We have removed you from our newsletter. You will no longer receive emails from us.",
              es: "Te hemos eliminado de nuestro boletín. Ya no recibirás correos de nuestra parte.",
              de: "Wir haben dich von unserem Newsletter abgemeldet. Du wirst keine weiteren E-Mails von uns erhalten.",
              fr: "Nous vous avons retiré(e) de notre newsletter. Vous ne recevrez plus d'emails de notre part."
            })}</p>
            <p style="color:#515151;line-height:1.6">${emailT(subLocale, {
              sv: "Om du ångrar dig är du alltid välkommen tillbaka – du kan prenumerera igen via vår hemsida.",
              en: "If you change your mind, you're always welcome back — you can subscribe again via our website.",
              es: "Si cambias de opinión, siempre eres bienvenido/a — puedes suscribirte de nuevo en nuestra web.",
              de: "Falls du es dir anders überlegst, bist du jederzeit willkommen zurück — du kannst dich über unsere Webseite erneut anmelden.",
              fr: "Si vous changez d'avis, vous êtes toujours le/la bienvenu(e) — vous pouvez vous réabonner via notre site."
            })}</p>
            <p style="color:#515151;line-height:1.6;margin-top:24px">${emailT(subLocale, { sv: "Varma hälsningar", en: "Warm regards", es: "Saludos cordiales", de: "Herzliche Grüße", fr: "Cordialement" })},<br>Christopher & ${emailT(subLocale, { sv: "teamet", en: "the team", es: "el equipo", de: "das Team", fr: "l'équipe" })}<br>1753 SKINCARE<br>info@1753skin.com</p>
          </div>
        `
      });
    }

    return { handled: true, wasActive: true };
  } catch (err) {
    console.error("[AutoUnsub] Error:", err.message);
    return { handled: false, error: err.message };
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

    // Auto-unsubscribe if the message is about newsletter opt-out
    const combinedText = `${subject} ${bodyText}`;
    if (isUnsubscribeRequest(combinedText)) {
      const unsub = await handleAutoUnsubscribe(fromEmail, fromName);
      if (unsub.handled) {
        const conversation = await db.createEmailConversation({
          fromEmail, fromName, subject, bodyText, bodyHtml,
          aiDraft: `Personen har automatiskt avprenumererats från nyhetsbrevet. Bekräftelsemejl har skickats.`,
          category: "unsubscribe", customerContext: await fetchCustomerContext(fromEmail)
        });
        await sendAdminNotification(fromEmail, fromName, `[Auto-avprenumererad] ${subject}`);
        console.log(`[EmailAI] Auto-unsubscribed ${fromEmail}, conversation #${conversation.id}`);
        return res.json({ ok: true, id: conversation.id, autoUnsubscribed: true });
      }
    }

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

    if (isUnsubscribeRequest(message)) {
      const unsub = await handleAutoUnsubscribe(email, name);
      if (unsub.handled) {
        const conversation = await db.createEmailConversation({
          fromEmail: email, fromName: name, subject: "Kontaktformulär (avprenumerering)",
          bodyText: message,
          aiDraft: `Personen har automatiskt avprenumererats från nyhetsbrevet. Bekräftelsemejl har skickats.`,
          category: "unsubscribe", customerContext: await fetchCustomerContext(email)
        });
        await sendAdminNotification(email, name, "[Auto-avprenumererad] Kontaktformulär");
        return res.json({ ok: true, id: conversation.id, autoUnsubscribed: true });
      }
    }

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
    const fromAddr = emailFromInfo();

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
      return res.status(400).json({ message: apiMsg("allFieldsRequired", reqLocale(req)) });
    }

    // Auto-unsubscribe if message is about newsletter opt-out
    if (isUnsubscribeRequest(message)) {
      const unsub = await handleAutoUnsubscribe(email, name);
      if (unsub.handled) {
        console.log(`[Contact] Auto-unsubscribed ${email} via contact form`);
        // Still log it in inbox for visibility
        (async () => {
          try {
            await db.createEmailConversation({
              fromEmail: email, fromName: name, subject: "Kontaktformulär (avprenumerering)",
              bodyText: message,
              aiDraft: `Personen har automatiskt avprenumererats från nyhetsbrevet. Bekräftelsemejl har skickats till ${email}.`,
              category: "unsubscribe", customerContext: await fetchCustomerContext(email)
            });
            await sendAdminNotification(email, name, "[Auto-avprenumererad] Kontaktformulär");
          } catch (err) { console.error("[Contact] Unsub conversation log error:", err.message); }
        })();
        return res.json({ ok: true, autoUnsubscribed: true });
      }
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[Contact] RESEND_API_KEY not set");
      return res.status(500).json({ message: apiMsg("emailNotConfigured", reqLocale(req)) });
    }

    const { Resend } = require("resend");
    const resend = new Resend(apiKey);
    const fromEmail = emailFromInfo();

    await resend.emails.send({
      from: `1753 SKINCARE <${fromEmail}>`,
      to: ["info@1753skin.com", ...TEAM_EMAILS],
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

    console.log(`[Contact] Message from ${email} (${name}) forwarded to info + team`);

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
    res.status(500).json({ message: apiMsg("messageSendFail", reqLocale(req)) });
  }
});

// ---- PASSWORD RESET / SET ----

app.post("/api/auth/set-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: apiMsg("tokenAndPwRequired", reqLocale(req)) });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: apiMsg("pwMinLength", reqLocale(req)) });
    }

    const { rows } = await db.pool.query(
      "SELECT * FROM users WHERE password_reset_token = $1 LIMIT 1",
      [token]
    );
    const user = rows[0];
    if (!user) {
      return res.status(400).json({ message: apiMsg("linkInvalid", reqLocale(req)) });
    }
    if (user.password_reset_expires && new Date(user.password_reset_expires) < new Date()) {
      return res.status(400).json({ message: apiMsg("linkExpired", reqLocale(req)) });
    }

    const passwordHash = bcrypt ? await bcrypt.hash(password, 10) : password;
    await db.updateUser(user.id, {
      password_hash: passwordHash,
      password_reset_token: null,
      password_reset_expires: null
    });

    const authToken = generateToken(user);
    res.json({ token: authToken, message: apiMsg("pwSaved", reqLocale(req)) });
  } catch (err) {
    res.status(500).json({ message: err.message || apiMsg("pwSaveFail", reqLocale(req)) });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email, locale } = req.body;
    const fpl = ["sv","en","es","de","fr"].includes(locale) ? locale : "sv";
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: emailT(fpl, { sv: "Ange en giltig e-postadress", en: "Please enter a valid email address", es: "Introduce un correo electrónico válido", de: "Bitte gib eine gültige E-Mail-Adresse ein", fr: "Veuillez saisir une adresse e-mail valide" }) });
    }

    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "forgot-pw", 5)) {
      return res.status(429).json({ message: emailT(fpl, { sv: "För många försök. Vänta en stund.", en: "Too many attempts. Please wait.", es: "Demasiados intentos. Espera un momento.", de: "Zu viele Versuche. Bitte warte.", fr: "Trop de tentatives. Veuillez patienter." }) });
    }

    const user = await db.findUserByEmail(email.toLowerCase().trim());
    if (!user) {
      // Don't reveal whether the account exists
      return res.json({ ok: true });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    await db.pool.query(
      "UPDATE users SET password_reset_token = $1, password_reset_expires = NOW() + INTERVAL '1 hour' WHERE id = $2",
      [resetToken, user.id]
    );

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const { Resend } = require("resend");
      const resend = new Resend(apiKey);
      const fromAddr = emailFromInfo();
      const baseUrl = process.env.FRONTEND_URL || "https://www.1753skin.com";
      const l = locale || "sv";

      const setPasswordSegments = {
        sv: "valj-losenord", en: "set-password", es: "establecer-contrasena",
        de: "passwort-setzen", fr: "choisir-mot-de-passe"
      };
      const resetUrl = `${baseUrl}/${l}/${setPasswordSegments[l] || setPasswordSegments.en}?token=${resetToken}`;

      const subjects = {
        sv: "Återställ ditt lösenord — 1753 SKINCARE",
        en: "Reset your password — 1753 SKINCARE",
        es: "Restablece tu contraseña — 1753 SKINCARE",
        de: "Passwort zurücksetzen — 1753 SKINCARE",
        fr: "Réinitialisez votre mot de passe — 1753 SKINCARE"
      };
      const greetings = {
        sv: `Hej ${user.name || ""},`, en: `Hi ${user.name || ""},`,
        es: `Hola ${user.name || ""},`, de: `Hallo ${user.name || ""},`,
        fr: `Bonjour ${user.name || ""},`
      };
      const bodyTexts = {
        sv: "Vi fick en begäran om att återställa ditt lösenord. Klicka på knappen nedan för att välja ett nytt lösenord. Om du inte begärde detta kan du ignorera detta meddelande.",
        en: "We received a request to reset your password. Click the button below to choose a new password. If you didn't request this, you can safely ignore this message.",
        es: "Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para elegir una nueva contraseña. Si no solicitaste esto, puedes ignorar este mensaje.",
        de: "Wir haben eine Anfrage zum Zurücksetzen deines Passworts erhalten. Klicke auf den Button unten, um ein neues Passwort zu wählen. Wenn du dies nicht angefordert hast, kannst du diese Nachricht ignorieren.",
        fr: "Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe. Si vous n'avez pas fait cette demande, ignorez ce message."
      };
      const btnTexts = {
        sv: "Välj nytt lösenord", en: "Choose new password",
        es: "Elegir nueva contraseña", de: "Neues Passwort wählen",
        fr: "Choisir un nouveau mot de passe"
      };
      const expiryTexts = {
        sv: "Länken är giltig i 1 timme.", en: "The link is valid for 1 hour.",
        es: "El enlace es válido durante 1 hora.", de: "Der Link ist 1 Stunde gültig.",
        fr: "Le lien est valide pendant 1 heure."
      };

      await resend.emails.send({
        from: `1753 SKINCARE <${fromAddr}>`,
        to: user.email,
        subject: subjects[l] || subjects.en,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;color:#1d1d1f">
            <div style="text-align:center;padding:32px 0 8px">
              <img src="https://www.1753skin.com/1753.png" alt="1753 SKINCARE" width="48" height="48" style="border-radius:12px"/>
            </div>
            <h2 style="font-size:20px;margin-bottom:8px">${greetings[l] || greetings.en}</h2>
            <p style="color:#515151;line-height:1.6">${bodyTexts[l] || bodyTexts.en}</p>
            <p style="margin-top:20px;text-align:center">
              <a href="${resetUrl}" style="display:inline-block;background:#108474;color:#fff;padding:14px 32px;border-radius:980px;text-decoration:none;font-weight:600;font-size:14px">${btnTexts[l] || btnTexts.en}</a>
            </p>
            <p style="margin-top:16px;color:#766a62;font-size:12px;text-align:center">${expiryTexts[l] || expiryTexts.en}</p>
            <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e6e6e6;text-align:center">
              <p style="font-size:11px;color:#766a62">1753 SKINCARE<br><a href="${baseUrl}" style="color:#108474">www.1753skin.com</a></p>
            </div>
          </div>
        `
      });
      console.log(`[Auth] Password reset email sent to ${user.email} (locale: ${l})`);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("[Auth] Forgot password error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// ---- NEWSLETTER COMPLIANCE HELPERS ----

// RFC 2369 + RFC 8058: required by Gmail/Yahoo/Apple for bulk senders since 2024.
// The one-click POST endpoint is registered further down as POST /api/newsletter/unsubscribe/:token.
function newsletterHeaders(unsubscribeUrl) {
  if (!unsubscribeUrl) return undefined;
  return {
    "List-Unsubscribe": `<${unsubscribeUrl}>, <mailto:info@1753skin.com?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

// Reverse-sync to Resend Audience so broadcasts sent via Resend Dashboard
// don't reach users who clicked unsubscribe on our side.
async function syncResendUnsubscribe(email) {
  const resendKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID || "efd080df-d556-4b81-a6f4-bbece8017cb9";
  if (!resendKey || !email) return;
  try {
    const { Resend } = require("resend");
    const client = new Resend(resendKey);
    await client.contacts.update({
      audienceId,
      email: email.toLowerCase(),
      unsubscribed: true,
    });
    console.log(`[Newsletter] Marked ${email} unsubscribed in Resend Audience`);
  } catch (err) {
    console.error(`[Newsletter] Resend unsubscribe sync failed for ${email}:`, err?.message || err);
  }
}

// ---- EMAIL TEMPLATES (shared style) ----

function emailWrapper(content, unsubscribeUrl, locale) {
  const wl = locale || "sv";
  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1d1d1f;padding:0 16px">
    <div style="text-align:center;padding:32px 0 8px">
      <img src="https://www.1753skin.com/1753.png" alt="1753 SKINCARE" width="48" height="48" style="border-radius:12px"/>
    </div>
    ${content}
    <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e6e6e6;text-align:center">
      <p style="font-size:12px;color:#766a62;line-height:1.6;margin:0">
        ${emailT(wl, { sv: "1753 SKINCARE – Holistisk hudvård med CBD och CBG", en: "1753 SKINCARE – Holistic skincare with CBD and CBG", es: "1753 SKINCARE – Cuidado holístico con CBD y CBG", de: "1753 SKINCARE – Ganzheitliche Hautpflege mit CBD und CBG", fr: "1753 SKINCARE – Soins holistiques au CBD et CBG" })}<br>
        <a href="https://www.1753skin.com" style="color:#108474">www.1753skin.com</a>
      </p>
      ${unsubscribeUrl ? `<p style="margin-top:12px;font-size:11px"><a href="${unsubscribeUrl}" style="color:#999;text-decoration:underline">${emailT(wl, { sv: "Avprenumerera", en: "Unsubscribe", es: "Darse de baja", de: "Abmelden", fr: "Se désabonner" })}</a></p>` : ""}
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
        model: "gpt-5.4-mini",
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
        const fromAddr = emailFromInfo();
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
    const analyses = await db.getSkinAnalyses(req.user.id, req.user.email);
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
    if (!amount || amount < 100) return res.status(400).json({ message: apiMsg("pointsMin100", reqLocale(req)) });
    if (amount % 100 !== 0) return res.status(400).json({ message: apiMsg("pointsStep100", reqLocale(req)) });

    const user = await db.findUserByEmail(req.user.email);
    if (!user || (user.loyalty_points || 0) < amount) {
      return res.status(400).json({ message: apiMsg("notEnoughPoints", reqLocale(req)) });
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
    const { email, firstName, skinCondition, source, locale: reqLocale } = req.body;
    const nlLocales = ["sv", "en", "es", "de", "fr"];
    const locale = nlLocales.includes(reqLocale) ? reqLocale : "sv";
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: emailT(locale, { sv: "Ange en giltig e-postadress", en: "Please enter a valid email address", es: "Introduce un correo electrónico válido", de: "Bitte gib eine gültige E-Mail-Adresse ein", fr: "Veuillez saisir une adresse e-mail valide" }) });
    }

    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp, "newsletter", 10)) {
      return res.status(429).json({ message: emailT(locale, { sv: "För många försök. Vänta en stund.", en: "Too many attempts. Please wait a moment.", es: "Demasiados intentos. Espera un momento.", de: "Zu viele Versuche. Bitte warte einen Moment.", fr: "Trop de tentatives. Veuillez patienter." }) });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const subscriber = await db.createSubscriber({
      email, firstName: firstName || "", source: source || "footer", unsubscribeToken: token, locale
    });

    if (skinCondition) {
      await db.updateSubscriberSkinCondition(email, skinCondition);
    }

    // Enqueue welcome flow (delay 2h if from analysis since analysis report email is sent immediately)
    const welcomeDelay = source === "analysis" ? 2 * 3600000 : 0;
    const welcomeFlows = await db.findFlowByTrigger("subscribe");
    for (const flow of welcomeFlows) {
      await db.enqueueAutomation({
        subscriberId: subscriber.id, flowId: flow.id,
        context: { firstName: subscriber.first_name },
        nextSendAt: new Date(Date.now() + welcomeDelay)
      });
    }

    // Sync to Resend Audience (non-blocking)
    const audienceId = process.env.RESEND_AUDIENCE_ID || "efd080df-d556-4b81-a6f4-bbece8017cb9";
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const { Resend } = require("resend");
      const resendClient = new Resend(resendKey);
      resendClient.contacts.create({
        audienceId,
        email: subscriber.email,
        firstName: subscriber.first_name || "",
        unsubscribed: false,
      }).then(() => {
        console.log(`[Newsletter] Synced ${subscriber.email} to Resend Audience`);
      }).catch((err) => {
        console.error(`[Newsletter] Resend Audience sync failed for ${subscriber.email}:`, err.message);
      });
    }

    console.log(`[Newsletter] ${email} subscribed (id=${subscriber.id}, skin=${skinCondition || "none"})`);
    res.json({ ok: true, message: emailT(locale, { sv: "Tack! Du är nu prenumerant.", en: "Thanks! You are now subscribed.", es: "Gracias! Ya estás suscrito/a.", de: "Danke! Du bist jetzt abonniert.", fr: "Merci ! Vous êtes maintenant abonné(e)." }) });
  } catch (err) {
    console.error("[Newsletter] Subscribe error:", err);
    res.status(500).json({ message: emailT(reqLocale || "sv", { sv: "Något gick fel. Försök igen.", en: "Something went wrong. Please try again.", es: "Algo salió mal. Inténtalo de nuevo.", de: "Etwas ist schiefgelaufen. Bitte versuche es erneut.", fr: "Une erreur s'est produite. Veuillez réessayer." }) });
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
    const locale = subscriber?.locale || "sv";
    if (subscriber) {
      await db.cancelAutomationsForSubscriber(subscriber.id);
      syncResendUnsubscribe(subscriber.email).catch(() => {});
      console.log(`[Newsletter] ${subscriber.email} unsubscribed`);
    }
    res.redirect(`https://www.1753skin.com/${locale}?unsubscribed=1`);
  } catch (err) {
    console.error("[Newsletter] Unsubscribe error:", err);
    res.redirect("https://www.1753skin.com/");
  }
});

// RFC 8058 one-click unsubscribe (triggered by Gmail/Apple/Yahoo mail clients).
// Same behaviour as the GET, but must respond 200 without redirect.
app.post("/api/newsletter/unsubscribe/:token", async (req, res) => {
  try {
    const subscriber = await db.unsubscribe(req.params.token);
    if (subscriber) {
      await db.cancelAutomationsForSubscriber(subscriber.id);
      syncResendUnsubscribe(subscriber.email).catch(() => {});
      console.log(`[Newsletter] ${subscriber.email} unsubscribed (one-click)`);
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[Newsletter] One-click unsubscribe error:", err);
    res.status(200).json({ ok: true });
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
    const fromEmail = emailFromInfo();

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
        const subLocale = item.locale || "sv";
        const firstNameFallback = { sv: "du", en: "there", es: "amigo/a", de: "du", fr: "vous" };
        const resolvedSubject = typeof step.subject === "object" ? emailT(subLocale, step.subject) : step.subject;
        const resolvedHtml = typeof step.html === "object" ? emailT(subLocale, step.html) : step.html;
        const html = emailWrapper(
          resolvedHtml
            .replace(/\{\{firstName\}\}/g, item.first_name || (firstNameFallback[subLocale] || "du"))
            .replace(/\{\{email\}\}/g, item.email)
            .replace(/\{\{reviewToken\}\}/g, ctx.reviewToken || "")
            .replace(/\{\{context\.(\w+)\}\}/g, (_, key) => ctx[key] || ""),
          unsubUrl,
          subLocale
        );

        const canSend = await db.canEmailSubscriber(item.subscriber_id, 20);
        if (!canSend) {
          const retryAt = new Date(Date.now() + 24 * 3600000);
          await db.advanceAutomation(item.id, { nextStep: item.current_step, nextSendAt: retryAt });
          console.log(`[Automation] Deferred "${resolvedSubject}" to ${item.email} – emailed too recently, retry ${retryAt.toISOString()}`);
          continue;
        }

        await resend.emails.send({
          from: fromEmail,
          to: item.email,
          subject: resolvedSubject.replace(/\{\{firstName\}\}/g, item.first_name || (firstNameFallback[subLocale] || "du")),
          html,
          headers: newsletterHeaders(unsubUrl),
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
        console.log(`[Automation] Sent "${resolvedSubject}" to ${item.email} (flow: ${item.flow_slug}, step ${item.current_step})`);
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

// ---- PERSONAL NEWSLETTER GENERATE (per-individual, LLM+ebook+PubMed) ----
// Defaults to DRY-RUN. Set body.send=true (or query ?send=1) to actually send.
app.post("/api/newsletter/generate-personal", async (req, res) => {
  try {
    const adminKey = req.body.adminKey || req.headers["x-admin-key"];
    const expectedKey = process.env.ADMIN_API_KEY || "1753-admin-key";
    if (adminKey !== expectedKey) {
      return res.status(403).json({ message: "Ogiltig admin-nyckel" });
    }

    const send = req.body.send === true || req.query.send === "1";
    const limit = Number(req.body.limit) || (send ? 100 : 10);
    const days = Number(req.body.days) || 180;
    const cooldown = Number(req.body.cooldown) || 6;
    const onlyEmail = typeof req.body.email === "string" ? req.body.email : null;

    const { execFile } = require("child_process");
    const scriptPath = require("path").join(__dirname, "scripts", "generate-personal-newsletters.js");
    const args = [
      `--limit=${limit}`,
      `--days=${days}`,
      `--cooldown=${cooldown}`,
    ];
    if (send) args.push("--send");
    if (onlyEmail) args.push(`--email=${onlyEmail}`);

    res.json({
      ok: true,
      message: send
        ? "Personaliserad utskickning startad (skarpt)"
        : "Personaliserad utskickning startad (dry-run)",
      limit, days, cooldown, send, onlyEmail,
    });

    execFile("node", [scriptPath, ...args], { env: process.env, timeout: 900_000 }, (err, stdout, stderr) => {
      if (err) {
        console.error("[PersonalNewsletter] Misslyckades:", err.message);
        if (stderr) console.error(stderr);
      } else {
        console.log("[PersonalNewsletter] Klar:", stdout.trim().split("\n").slice(-5).join(" | "));
      }
    });
  } catch (err) {
    console.error("[PersonalNewsletter] Error:", err);
    res.status(500).json({ message: "Kunde inte starta personaliserad utskickning" });
  }
});

app.get("/api/newsletter/personal/recent", async (req, res) => {
  try {
    const adminKey = req.query.adminKey || req.headers["x-admin-key"];
    const expectedKey = process.env.ADMIN_API_KEY || "1753-admin-key";
    if (adminKey !== expectedKey) {
      return res.status(403).json({ message: "Ogiltig admin-nyckel" });
    }
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const rows = await db.getRecentPersonalNewsletters(limit);
    res.json({ ok: true, count: rows.length, newsletters: rows });
  } catch (err) {
    console.error("[PersonalNewsletter] list error:", err);
    res.status(500).json({ message: "Kunde inte hamta listan" });
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
    const fromEmail = emailFromInfo();

    const subscribers = await db.findActiveSubscribers();
    const baseUrl = process.env.BASE_URL || "https://api.1753skin.com";
    let sent = 0;

    for (const sub of subscribers) {
      try {
        const subL = sub.locale || "sv";
        const fnFallback = { sv: "du", en: "there", es: "amigo/a", de: "du", fr: "vous" };
        const unsubUrl = `${baseUrl}/api/newsletter/unsubscribe/${sub.unsubscribe_token}`;
        await resend.emails.send({
          from: fromEmail,
          to: sub.email,
          subject,
          html: emailWrapper(
            html.replace(/\{\{firstName\}\}/g, sub.first_name || (fnFallback[subL] || "du")),
            unsubUrl,
            subL
          ),
          headers: newsletterHeaders(unsubUrl),
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
    const fromEmail = emailFromInfo();
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

          const subL = sub.locale || "sv";
          const fnFallback2 = { sv: "du", en: "there", es: "amigo/a", de: "du", fr: "vous" };
          const unsubUrl = `${baseUrl}/api/newsletter/unsubscribe/${sub.unsubscribe_token}`;
          await resend.emails.send({
            from: fromEmail,
            to: sub.email,
            subject,
            html: emailWrapper(
              html.replace(/\{\{firstName\}\}/g, sub.first_name || (fnFallback2[subL] || "du")),
              unsubUrl,
              subL
            ),
            headers: newsletterHeaders(unsubUrl),
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
  const p = (l, route) => `${siteUrl}/${emailPath(l, route)}`;
  const btn = (texts, route) => {
    const o = {};
    for (const l of ["sv","en","es","de","fr"]) o[l] = greenButton(texts[l], p(l, route));
    return o;
  };
  const h2 = (t) => `<h2 style="font-size:22px;font-weight:700;margin:24px 0 12px">${t}</h2>`;
  const pp = (t) => `<p style="font-size:15px;line-height:1.7;color:#515151">${t}</p>`;
  const quote = (text, attr) => `<div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:20px 0"><p style="font-size:15px;line-height:1.7;color:#515151;font-style:italic;margin:0">${text}</p><p style="font-size:13px;color:#766a62;margin:8px 0 0">${attr}</p></div>`;

  await db.upsertFlow({
    slug: "welcome",
    name: "Välkomstserie",
    triggerEvent: "subscribe",
    steps: [
      {
        delay_hours: 0,
        subject: { sv: "Välkommen till 1753 SKINCARE, {{firstName}}!", en: "Welcome to 1753 SKINCARE, {{firstName}}!", es: "Bienvenido/a a 1753 SKINCARE, {{firstName}}!", de: "Willkommen bei 1753 SKINCARE, {{firstName}}!", fr: "Bienvenue chez 1753 SKINCARE, {{firstName}} !" },
        html: {
          sv: `${h2("Välkommen till familjen!")}${pp("Vi är så glada att du är här. 1753 SKINCARE är mer än hudvård – det är en filosofi. Vi tror på att jobba med kroppen, inte mot den. Våra produkter bygger på CBD, CBG och noga utvalda naturliga ingredienser.")}${pp("Utforska vårt sortiment och hitta din favorit. Vi finns här om du har frågor.")}${greenButton("Utforska produkterna", p("sv","products"))}`,
          en: `${h2("Welcome to the family!")}${pp("We're so happy you're here. 1753 SKINCARE is more than skincare – it's a philosophy. We believe in working with the body, not against it. Our products are built on CBD, CBG and carefully selected natural ingredients.")}${pp("Explore our range and find your favourite. We're here if you have questions.")}${greenButton("Explore products", p("en","products"))}`,
          es: `${h2("Bienvenido/a a la familia!")}${pp("Estamos muy contentos de que estés aquí. 1753 SKINCARE es más que cuidado de la piel – es una filosofía. Creemos en trabajar con el cuerpo, no en su contra. Nuestros productos están basados en CBD, CBG e ingredientes naturales cuidadosamente seleccionados.")}${pp("Explora nuestra gama y encuentra tu favorito. Estamos aquí si tienes preguntas.")}${greenButton("Explorar productos", p("es","products"))}`,
          de: `${h2("Willkommen in der Familie!")}${pp("Wir freuen uns, dass du hier bist. 1753 SKINCARE ist mehr als Hautpflege – es ist eine Philosophie. Wir glauben daran, mit dem Körper zu arbeiten, nicht gegen ihn. Unsere Produkte basieren auf CBD, CBG und sorgfältig ausgewählten natürlichen Inhaltsstoffen.")}${pp("Entdecke unser Sortiment und finde deinen Favoriten. Wir sind für dich da.")}${greenButton("Produkte entdecken", p("de","products"))}`,
          fr: `${h2("Bienvenue dans la famille !")}${pp("Nous sommes ravis que vous soyez là. 1753 SKINCARE est plus que du soin – c'est une philosophie. Nous croyons qu'il faut travailler avec le corps, pas contre lui. Nos produits sont à base de CBD, CBG et d'ingrédients naturels soigneusement sélectionnés.")}${pp("Explorez notre gamme et trouvez votre favori. Nous sommes là pour vous.")}${greenButton("Explorer les produits", p("fr","products"))}`
        }
      },
      {
        delay_hours: 48,
        subject: { sv: "Vår filosofi – hudvård som faktiskt fungerar", en: "Our philosophy – skincare that actually works", es: "Nuestra filosofía – cuidado que realmente funciona", de: "Unsere Philosophie – Hautpflege die wirklich wirkt", fr: "Notre philosophie – des soins qui fonctionnent vraiment" },
        html: {
          sv: `${h2("Holistisk hudvård")}${pp("De flesta hudvårdsprodukter löser symtom. Vi vill lösa orsaken.")}${pp("Våra CBD- och CBG-baserade oljor jobbar med hudens egna endocannabinoidsystem för att återställa balans. Ingen onaturlig kemi, inga tomma löften.")}${pp("Men produkter är bara en del. Sömn, kost, stresshantering och rörelse – allt spelar roll för din hud. Det är därför vi tar ett holistiskt grepp.")}${greenButton("Läs mer om oss", p("sv","about"))}`,
          en: `${h2("Holistic skincare")}${pp("Most skincare products treat symptoms. We want to address the cause.")}${pp("Our CBD- and CBG-based oils work with your skin's own endocannabinoid system to restore balance. No unnatural chemistry, no empty promises.")}${pp("But products are only part of it. Sleep, diet, stress management and movement – everything matters for your skin. That's why we take a holistic approach.")}${greenButton("Read more about us", p("en","about"))}`,
          es: `${h2("Cuidado holístico")}${pp("La mayoría de los productos para la piel tratan los síntomas. Nosotros queremos abordar la causa.")}${pp("Nuestros aceites a base de CBD y CBG trabajan con el sistema endocannabinoide de tu piel para restaurar el equilibrio. Sin química artificial, sin promesas vacías.")}${pp("Pero los productos son solo una parte. Sueño, alimentación, manejo del estrés y movimiento – todo importa para tu piel.")}${greenButton("Más sobre nosotros", p("es","about"))}`,
          de: `${h2("Ganzheitliche Hautpflege")}${pp("Die meisten Hautpflegeprodukte behandeln Symptome. Wir wollen die Ursache angehen.")}${pp("Unsere CBD- und CBG-basierten Öle arbeiten mit dem körpereigenen Endocannabinoid-System deiner Haut, um das Gleichgewicht wiederherzustellen. Keine künstliche Chemie, keine leeren Versprechen.")}${pp("Aber Produkte sind nur ein Teil. Schlaf, Ernährung, Stressbewältigung und Bewegung – alles spielt eine Rolle für deine Haut.")}${greenButton("Mehr über uns", p("de","about"))}`,
          fr: `${h2("Soins holistiques")}${pp("La plupart des produits de soin traitent les symptômes. Nous voulons traiter la cause.")}${pp("Nos huiles à base de CBD et CBG travaillent avec le système endocannabinoïde de votre peau pour restaurer l'équilibre. Pas de chimie artificielle, pas de promesses vides.")}${pp("Mais les produits ne sont qu'une partie. Sommeil, alimentation, gestion du stress et mouvement – tout compte pour votre peau.")}${greenButton("En savoir plus", p("fr","about"))}`
        }
      },
      {
        delay_hours: 72,
        subject: { sv: "Vilken produkt passar dig?", en: "Which product is right for you?", es: "¿Qué producto es ideal para ti?", de: "Welches Produkt passt zu dir?", fr: "Quel produit vous convient ?" },
        html: {
          sv: `${h2("Hitta din match")}${pp("<strong>The ONE Facial Oil</strong> – Vår allround-olja. Perfekt om du vill börja enkelt med en produkt som balanserar, återfuktar och ger lyster. Funkar för alla hudtyper.")}${pp("<strong>I LOVE Facial Oil</strong> – Extra näringsrik med CBG. Bäst för torr eller mogen hud som behöver djupgående återfuktning.")}${pp("<strong>DUO-kit</strong> – Båda oljorna i ett kit. The ONE på morgonen, I LOVE på kvällen. Vår mest populära produkt.")}${pp("Osäker? Prova vår <strong>AI-hudanalys</strong> – ladda upp ett foto och få personliga rekommendationer.")}${greenButton("Gör hudanalys", p("sv","skinAnalysis"))}`,
          en: `${h2("Find your match")}${pp("<strong>The ONE Facial Oil</strong> – Our all-round oil. Perfect if you want to start simple with a product that balances, moisturises and adds radiance. Works for all skin types.")}${pp("<strong>I LOVE Facial Oil</strong> – Extra nourishing with CBG. Best for dry or mature skin that needs deep hydration.")}${pp("<strong>DUO kit</strong> – Both oils in one kit. The ONE in the morning, I LOVE in the evening. Our most popular product.")}${pp("Not sure? Try our <strong>AI skin analysis</strong> – upload a photo and get personalised recommendations.")}${greenButton("Try skin analysis", p("en","skinAnalysis"))}`,
          es: `${h2("Encuentra tu producto ideal")}${pp("<strong>The ONE Facial Oil</strong> – Nuestro aceite todo en uno. Perfecto para empezar con un producto que equilibra, hidrata y da luminosidad. Funciona para todos los tipos de piel.")}${pp("<strong>I LOVE Facial Oil</strong> – Extra nutritivo con CBG. Ideal para piel seca o madura que necesita hidratación profunda.")}${pp("<strong>DUO kit</strong> – Ambos aceites en un kit. The ONE por la mañana, I LOVE por la noche.")}${pp("¿No estás seguro/a? Prueba nuestro <strong>análisis de piel con IA</strong>.")}${greenButton("Análisis de piel", p("es","skinAnalysis"))}`,
          de: `${h2("Finde dein Match")}${pp("<strong>The ONE Facial Oil</strong> – Unser Allround-Öl. Perfekt, wenn du einfach anfangen willst mit einem Produkt, das ausgleicht, pflegt und Strahlkraft verleiht. Für alle Hauttypen.")}${pp("<strong>I LOVE Facial Oil</strong> – Extra nährend mit CBG. Am besten für trockene oder reife Haut, die tiefe Feuchtigkeit braucht.")}${pp("<strong>DUO-Kit</strong> – Beide Öle in einem Kit. The ONE am Morgen, I LOVE am Abend.")}${pp("Unsicher? Probiere unsere <strong>KI-Hautanalyse</strong> – lade ein Foto hoch und erhalte persönliche Empfehlungen.")}${greenButton("Hautanalyse starten", p("de","skinAnalysis"))}`,
          fr: `${h2("Trouvez votre match")}${pp("<strong>The ONE Facial Oil</strong> – Notre huile polyvalente. Parfaite pour commencer simplement avec un produit qui équilibre, hydrate et donne de l'éclat. Convient à tous les types de peau.")}${pp("<strong>I LOVE Facial Oil</strong> – Extra nourrissante au CBG. Idéale pour les peaux sèches ou matures qui ont besoin d'une hydratation profonde.")}${pp("<strong>DUO kit</strong> – Les deux huiles dans un kit. The ONE le matin, I LOVE le soir.")}${pp("Pas sûr(e) ? Essayez notre <strong>analyse de peau IA</strong>.")}${greenButton("Analyse de peau", p("fr","skinAnalysis"))}`
        }
      },
      {
        delay_hours: 96,
        subject: { sv: "\"Min hud har aldrig varit bättre\"", en: "\"My skin has never been better\"", es: "\"Mi piel nunca ha estado mejor\"", de: "\"Meine Haut war noch nie so gut\"", fr: "\"Ma peau n'a jamais été aussi belle\"" },
        html: {
          sv: `${h2("Riktig feedback från riktiga människor")}${pp("Vi behöver inte hitta på berättelser. Våra kunder talar för sig själva.")}${quote("\"Jag har provat allt – dyr hudvård, billig hudvård, ingenting. The ONE är den enda produkten som verkligen gjort skillnad. Lugnar, balanserar, ger lyster.\"", "– Sandra, 34 år")}${quote("\"DUO-kitet har blivit min morgon- och kvällsrutin. Så enkelt, så bra. Huden är mjukare och jämnare än någonsin.\"", "– Mikael, 41 år")}${greenButton("Se alla produkter", p("sv","products"))}`,
          en: `${h2("Real feedback from real people")}${pp("We don't need to make up stories. Our customers speak for themselves.")}${quote("\"I've tried everything – expensive skincare, cheap skincare, nothing at all. The ONE is the only product that truly made a difference. Calms, balances, gives radiance.\"", "– Sandra, 34")}${quote("\"The DUO kit has become my morning and evening routine. So simple, so good. My skin is softer and smoother than ever.\"", "– Mikael, 41")}${greenButton("See all products", p("en","products"))}`,
          es: `${h2("Opiniones reales de personas reales")}${pp("No necesitamos inventar historias. Nuestros clientes hablan por sí mismos.")}${quote("\"He probado de todo. The ONE es el único producto que realmente marcó la diferencia. Calma, equilibra, da luminosidad.\"", "– Sandra, 34")}${quote("\"El DUO kit se ha convertido en mi rutina de mañana y noche. Tan simple, tan bueno.\"", "– Mikael, 41")}${greenButton("Ver todos los productos", p("es","products"))}`,
          de: `${h2("Echtes Feedback von echten Menschen")}${pp("Wir müssen keine Geschichten erfinden. Unsere Kunden sprechen für sich.")}${quote("\"Ich habe alles ausprobiert. The ONE ist das einzige Produkt, das wirklich einen Unterschied gemacht hat. Beruhigt, gleicht aus, gibt Strahlkraft.\"", "– Sandra, 34")}${quote("\"Das DUO-Kit ist meine Morgen- und Abendroutine geworden. So einfach, so gut.\"", "– Mikael, 41")}${greenButton("Alle Produkte ansehen", p("de","products"))}`,
          fr: `${h2("De vrais avis de vraies personnes")}${pp("Nous n'avons pas besoin d'inventer des histoires. Nos clients parlent d'eux-mêmes.")}${quote("\"J'ai tout essayé. The ONE est le seul produit qui a vraiment fait la différence. Apaise, équilibre, donne de l'éclat.\"", "– Sandra, 34")}${quote("\"Le DUO kit est devenu ma routine matin et soir. Si simple, si efficace.\"", "– Mikael, 41")}${greenButton("Voir tous les produits", p("fr","products"))}`
        }
      },
      {
        delay_hours: 120,
        subject: { sv: "Ditt exklusiva erbjudande väntar, {{firstName}}", en: "Your exclusive offer awaits, {{firstName}}", es: "Tu oferta exclusiva te espera, {{firstName}}", de: "Dein exklusives Angebot wartet, {{firstName}}", fr: "Votre offre exclusive vous attend, {{firstName}}" },
        html: {
          sv: `${h2("Bara för dig")}${pp("Du har följt med oss i två veckor nu – tack för det! Vi hoppas att du lärt dig något nytt om holistisk hudvård.")}${pp("Som tack vill vi ge dig ett exklusivt erbjudande: <strong>fri frakt + 15% rabatt</strong> på hela sortimentet.")}<p style="font-size:17px;font-weight:700;color:#108474;text-align:center;margin:20px 0">Kod: INSIDER15</p><p style="font-size:13px;color:#766a62;text-align:center">Giltig i 7 dagar. Kan inte kombineras med andra erbjudanden.</p>${greenButton("Handla nu", p("sv","products"))}`,
          en: `${h2("Just for you")}${pp("You've been with us for two weeks now – thank you! We hope you've learned something new about holistic skincare.")}${pp("As a thank you, we'd like to offer you: <strong>free shipping + 15% off</strong> the entire range.")}<p style="font-size:17px;font-weight:700;color:#108474;text-align:center;margin:20px 0">Code: INSIDER15</p><p style="font-size:13px;color:#766a62;text-align:center">Valid for 7 days. Cannot be combined with other offers.</p>${greenButton("Shop now", p("en","products"))}`,
          es: `${h2("Solo para ti")}${pp("Llevas dos semanas con nosotros – ¡gracias! Esperamos que hayas aprendido algo nuevo sobre el cuidado holístico.")}${pp("Como agradecimiento, te ofrecemos: <strong>envío gratis + 15% de descuento</strong> en toda la gama.")}<p style="font-size:17px;font-weight:700;color:#108474;text-align:center;margin:20px 0">Código: INSIDER15</p><p style="font-size:13px;color:#766a62;text-align:center">Válido por 7 días. No combinable con otras ofertas.</p>${greenButton("Comprar ahora", p("es","products"))}`,
          de: `${h2("Nur für dich")}${pp("Du bist jetzt seit zwei Wochen bei uns – danke dafür! Wir hoffen, du hast etwas Neues über ganzheitliche Hautpflege gelernt.")}${pp("Als Dankeschön möchten wir dir ein exklusives Angebot machen: <strong>kostenloser Versand + 15% Rabatt</strong> auf das gesamte Sortiment.")}<p style="font-size:17px;font-weight:700;color:#108474;text-align:center;margin:20px 0">Code: INSIDER15</p><p style="font-size:13px;color:#766a62;text-align:center">Gültig für 7 Tage. Nicht mit anderen Angeboten kombinierbar.</p>${greenButton("Jetzt shoppen", p("de","products"))}`,
          fr: `${h2("Rien que pour vous")}${pp("Cela fait deux semaines que vous êtes avec nous – merci ! Nous espérons que vous avez appris de nouvelles choses sur les soins holistiques.")}${pp("Pour vous remercier, nous vous offrons : <strong>livraison gratuite + 15% de réduction</strong> sur toute la gamme.")}<p style="font-size:17px;font-weight:700;color:#108474;text-align:center;margin:20px 0">Code : INSIDER15</p><p style="font-size:13px;color:#766a62;text-align:center">Valable 7 jours. Non cumulable avec d'autres offres.</p>${greenButton("Acheter maintenant", p("fr","products"))}`
        }
      }
    ]
  });

  await db.upsertFlow({
    slug: "post-purchase",
    name: "Efter köp",
    triggerEvent: "purchase",
    steps: [
      {
        delay_hours: 24,
        subject: { sv: "Tack för ditt köp, {{firstName}} – här är dina tips!", en: "Thanks for your purchase, {{firstName}} – here are your tips!", es: "Gracias por tu compra, {{firstName}} – aquí van tus consejos!", de: "Danke für deinen Kauf, {{firstName}} – hier sind deine Tipps!", fr: "Merci pour votre achat, {{firstName}} – voici vos conseils !" },
        html: {
          sv: `${h2("Så får du bäst resultat")}${pp("Grattis till ditt köp! Här är några tips för att få ut maximalt av dina produkter:")}<ul style="font-size:15px;line-height:2;color:#515151;padding-left:20px"><li>Applicera på ren, fuktad hud för bäst absorption</li><li>2–3 droppar räcker – värm oljan mellan handflatorna först</li><li>Ge huden tid – CBD och CBG bygger effekt över tid (2–4 veckor)</li><li>Kombinera med bra sömn och vatten för synergieffekt</li></ul>${greenButton("Läs mer om våra ingredienser", p("sv","about"))}`,
          en: `${h2("How to get the best results")}${pp("Congratulations on your purchase! Here are some tips to get the most out of your products:")}<ul style="font-size:15px;line-height:2;color:#515151;padding-left:20px"><li>Apply to clean, damp skin for best absorption</li><li>2–3 drops is enough – warm the oil between your palms first</li><li>Give your skin time – CBD and CBG build effect over time (2–4 weeks)</li><li>Combine with good sleep and water for synergy</li></ul>${greenButton("Read more about our ingredients", p("en","about"))}`,
          es: `${h2("Cómo obtener los mejores resultados")}${pp("¡Felicidades por tu compra! Aquí tienes algunos consejos para aprovechar al máximo tus productos:")}<ul style="font-size:15px;line-height:2;color:#515151;padding-left:20px"><li>Aplica sobre piel limpia y húmeda para mejor absorción</li><li>2–3 gotas son suficientes – calienta el aceite entre las palmas primero</li><li>Dale tiempo a tu piel – CBD y CBG construyen efecto con el tiempo (2–4 semanas)</li><li>Combina con buen sueño y agua para sinergia</li></ul>${greenButton("Más sobre nuestros ingredientes", p("es","about"))}`,
          de: `${h2("So erzielst du die besten Ergebnisse")}${pp("Herzlichen Glückwunsch zu deinem Kauf! Hier sind einige Tipps, um das Beste aus deinen Produkten herauszuholen:")}<ul style="font-size:15px;line-height:2;color:#515151;padding-left:20px"><li>Auf saubere, feuchte Haut auftragen für beste Aufnahme</li><li>2–3 Tropfen genügen – erwärme das Öl zuerst zwischen den Handflächen</li><li>Gib deiner Haut Zeit – CBD und CBG bauen Wirkung über Zeit auf (2–4 Wochen)</li><li>Kombiniere mit gutem Schlaf und Wasser für Synergieeffekte</li></ul>${greenButton("Mehr über unsere Inhaltsstoffe", p("de","about"))}`,
          fr: `${h2("Comment obtenir les meilleurs résultats")}${pp("Félicitations pour votre achat ! Voici quelques conseils pour tirer le meilleur parti de vos produits :")}<ul style="font-size:15px;line-height:2;color:#515151;padding-left:20px"><li>Appliquez sur peau propre et humide pour une meilleure absorption</li><li>2–3 gouttes suffisent – réchauffez l'huile entre vos paumes d'abord</li><li>Donnez du temps à votre peau – CBD et CBG construisent leur effet avec le temps (2–4 semaines)</li><li>Combinez avec un bon sommeil et de l'eau pour un effet de synergie</li></ul>${greenButton("En savoir plus sur nos ingrédients", p("fr","about"))}`
        }
      },
      {
        delay_hours: 168,
        subject: { sv: "Din hudvårdsrutin – enklare än du tror", en: "Your skincare routine – simpler than you think", es: "Tu rutina de cuidado – más simple de lo que crees", de: "Deine Hautpflegeroutine – einfacher als du denkst", fr: "Votre routine de soin – plus simple que vous ne le pensez" },
        html: {
          sv: `${h2("Morgon och kväll")}${pp("En bra rutin behöver inte vara komplicerad. Här är vårt förslag:")}<div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:16px 0"><p style="font-size:13px;font-weight:700;color:#108474;margin:0">MORGON</p><p style="font-size:14px;line-height:1.7;color:#515151;margin:8px 0 0">1. Skölj ansiktet med ljummet vatten<br>2. The ONE Facial Oil – 2–3 droppar<br>3. SPF (om du går ut)</p></div><div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:16px 0"><p style="font-size:13px;font-weight:700;color:#108474;margin:0">KVÄLL</p><p style="font-size:14px;line-height:1.7;color:#515151;margin:8px 0 0">1. Au Naturel Makeup Remover<br>2. I LOVE Facial Oil – 3–4 droppar<br>3. Sov gott!</p></div>${greenButton("Se alla produkter", p("sv","products"))}`,
          en: `${h2("Morning and evening")}${pp("A good routine doesn't have to be complicated. Here's our suggestion:")}<div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:16px 0"><p style="font-size:13px;font-weight:700;color:#108474;margin:0">MORNING</p><p style="font-size:14px;line-height:1.7;color:#515151;margin:8px 0 0">1. Rinse face with lukewarm water<br>2. The ONE Facial Oil – 2–3 drops<br>3. SPF (if going out)</p></div><div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:16px 0"><p style="font-size:13px;font-weight:700;color:#108474;margin:0">EVENING</p><p style="font-size:14px;line-height:1.7;color:#515151;margin:8px 0 0">1. Au Naturel Makeup Remover<br>2. I LOVE Facial Oil – 3–4 drops<br>3. Sleep well!</p></div>${greenButton("See all products", p("en","products"))}`,
          es: `${h2("Mañana y noche")}${pp("Una buena rutina no tiene que ser complicada. Aquí va nuestra sugerencia:")}<div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:16px 0"><p style="font-size:13px;font-weight:700;color:#108474;margin:0">MAÑANA</p><p style="font-size:14px;line-height:1.7;color:#515151;margin:8px 0 0">1. Enjuaga el rostro con agua tibia<br>2. The ONE Facial Oil – 2–3 gotas<br>3. SPF (si sales)</p></div><div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:16px 0"><p style="font-size:13px;font-weight:700;color:#108474;margin:0">NOCHE</p><p style="font-size:14px;line-height:1.7;color:#515151;margin:8px 0 0">1. Au Naturel Makeup Remover<br>2. I LOVE Facial Oil – 3–4 gotas<br>3. ¡Buenas noches!</p></div>${greenButton("Ver todos los productos", p("es","products"))}`,
          de: `${h2("Morgen und Abend")}${pp("Eine gute Routine muss nicht kompliziert sein. Hier ist unser Vorschlag:")}<div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:16px 0"><p style="font-size:13px;font-weight:700;color:#108474;margin:0">MORGEN</p><p style="font-size:14px;line-height:1.7;color:#515151;margin:8px 0 0">1. Gesicht mit lauwarmem Wasser abspülen<br>2. The ONE Facial Oil – 2–3 Tropfen<br>3. SPF (wenn du rausgehst)</p></div><div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:16px 0"><p style="font-size:13px;font-weight:700;color:#108474;margin:0">ABEND</p><p style="font-size:14px;line-height:1.7;color:#515151;margin:8px 0 0">1. Au Naturel Makeup Remover<br>2. I LOVE Facial Oil – 3–4 Tropfen<br>3. Schlaf gut!</p></div>${greenButton("Alle Produkte ansehen", p("de","products"))}`,
          fr: `${h2("Matin et soir")}${pp("Une bonne routine n'a pas besoin d'être compliquée. Voici notre suggestion :")}<div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:16px 0"><p style="font-size:13px;font-weight:700;color:#108474;margin:0">MATIN</p><p style="font-size:14px;line-height:1.7;color:#515151;margin:8px 0 0">1. Rincez le visage à l'eau tiède<br>2. The ONE Facial Oil – 2–3 gouttes<br>3. SPF (si vous sortez)</p></div><div style="background:#f5f5f7;border-radius:12px;padding:20px;margin:16px 0"><p style="font-size:13px;font-weight:700;color:#108474;margin:0">SOIR</p><p style="font-size:14px;line-height:1.7;color:#515151;margin:8px 0 0">1. Au Naturel Makeup Remover<br>2. I LOVE Facial Oil – 3–4 gouttes<br>3. Bonne nuit !</p></div>${greenButton("Voir tous les produits", p("fr","products"))}`
        }
      },
      {
        delay_hours: 504,
        subject: { sv: "Hur mår din hud, {{firstName}}?", en: "How's your skin doing, {{firstName}}?", es: "¿Cómo va tu piel, {{firstName}}?", de: "Wie geht es deiner Haut, {{firstName}}?", fr: "Comment va votre peau, {{firstName}} ?" },
        html: {
          sv: `${h2("Vi vill höra från dig")}${pp("Det har nu gått tre veckor sedan ditt köp. Förhoppningsvis börjar du se skillnad – CBD och CBG bygger effekt över tid.")}${pp("Vill du se hur din hud utvecklas? Vår AI-hudanalys ger dig en objektiv bedömning och personliga råd.")}${greenButton("Gör en gratis hudanalys", p("sv","skinAnalysis"))}${pp("Har du frågor? Svara på detta mejl så återkommer vi inom 24 timmar.")}`,
          en: `${h2("We'd love to hear from you")}${pp("It's been three weeks since your purchase. Hopefully you're starting to see a difference – CBD and CBG build effect over time.")}${pp("Want to see how your skin is progressing? Our AI skin analysis gives you an objective assessment and personalised advice.")}${greenButton("Try free skin analysis", p("en","skinAnalysis"))}${pp("Questions? Reply to this email and we'll get back to you within 24 hours.")}`,
          es: `${h2("Queremos saber de ti")}${pp("Han pasado tres semanas desde tu compra. Esperamos que empieces a notar la diferencia – CBD y CBG construyen su efecto con el tiempo.")}${pp("¿Quieres ver cómo progresa tu piel? Nuestro análisis de piel con IA te da una evaluación objetiva y consejos personalizados.")}${greenButton("Análisis de piel gratis", p("es","skinAnalysis"))}${pp("¿Preguntas? Responde a este email y te responderemos en 24 horas.")}`,
          de: `${h2("Wir möchten von dir hören")}${pp("Es sind jetzt drei Wochen seit deinem Kauf vergangen. Hoffentlich siehst du langsam einen Unterschied – CBD und CBG bauen ihre Wirkung über Zeit auf.")}${pp("Möchtest du sehen, wie sich deine Haut entwickelt? Unsere KI-Hautanalyse gibt dir eine objektive Bewertung und persönliche Tipps.")}${greenButton("Kostenlose Hautanalyse", p("de","skinAnalysis"))}${pp("Fragen? Antworte auf diese E-Mail und wir melden uns innerhalb von 24 Stunden.")}`,
          fr: `${h2("Nous aimerions avoir de vos nouvelles")}${pp("Cela fait trois semaines depuis votre achat. Nous espérons que vous commencez à voir une différence – CBD et CBG construisent leur effet avec le temps.")}${pp("Envie de voir comment votre peau progresse ? Notre analyse de peau IA vous donne une évaluation objective et des conseils personnalisés.")}${greenButton("Analyse de peau gratuite", p("fr","skinAnalysis"))}${pp("Des questions ? Répondez à cet email et nous vous répondrons sous 24 heures.")}`
        }
      },
      {
        delay_hours: 1080,
        subject: { sv: "Dags att fylla på? Spara med prenumeration", en: "Time to restock? Save with a subscription", es: "¿Hora de reponer? Ahorra con una suscripción", de: "Zeit zum Nachfüllen? Spare mit einem Abo", fr: "Il est temps de réapprovisionner ? Économisez avec un abonnement" },
        html: {
          sv: `${h2("Slipp att ta slut")}${pp("Beroende på hur mycket du använder borde det snart vara dags för påfyllning.")}${pp("Med våra prenumerationer får du <strong>15% rabatt</strong> på varje leverans, och du väljer själv intervall (30, 60 eller 90 dagar). Avbryt när du vill.")}${greenButton("Beställ igen", p("sv","products"))}`,
          en: `${h2("Never run out")}${pp("Depending on how much you use, it might be time to restock soon.")}${pp("With our subscriptions, you get <strong>15% off</strong> every delivery, and you choose your own interval (30, 60 or 90 days). Cancel anytime.")}${greenButton("Order again", p("en","products"))}`,
          es: `${h2("Que no se te acabe")}${pp("Dependiendo de cuánto uses, pronto podría ser hora de reponer.")}${pp("Con nuestras suscripciones, obtienes un <strong>15% de descuento</strong> en cada entrega, y eliges tu propio intervalo (30, 60 o 90 días). Cancela cuando quieras.")}${greenButton("Pedir de nuevo", p("es","products"))}`,
          de: `${h2("Nie wieder leer")}${pp("Je nachdem wie viel du verwendest, könnte es bald Zeit zum Nachfüllen sein.")}${pp("Mit unseren Abos bekommst du <strong>15% Rabatt</strong> auf jede Lieferung, und du wählst dein eigenes Intervall (30, 60 oder 90 Tage). Jederzeit kündbar.")}${greenButton("Nachbestellen", p("de","products"))}`,
          fr: `${h2("Ne soyez jamais à court")}${pp("Selon votre utilisation, il est peut-être bientôt temps de réapprovisionner.")}${pp("Avec nos abonnements, vous bénéficiez de <strong>15% de réduction</strong> sur chaque livraison, et vous choisissez votre intervalle (30, 60 ou 90 jours). Annulable à tout moment.")}${greenButton("Commander à nouveau", p("fr","products"))}`
        }
      }
    ]
  });

  await db.upsertFlow({
    slug: "cart-abandoned",
    name: "Övergiven varukorg",
    triggerEvent: "cart_abandoned",
    steps: [
      {
        delay_hours: 1,
        subject: { sv: "Du glömde något i varukorgen", en: "You left something in your cart", es: "Olvidaste algo en tu carrito", de: "Du hast etwas im Warenkorb vergessen", fr: "Vous avez oublié quelque chose dans votre panier" },
        html: {
          sv: `${h2("Din varukorg väntar")}${pp("Vi såg att du var nära att slutföra din beställning. Dina produkter väntar fortfarande på dig!")}${greenButton("Slutför din beställning", p("sv","checkout"))}<p style="font-size:13px;color:#766a62;text-align:center">Fri frakt på ordrar över 600 kr.</p>`,
          en: `${h2("Your cart is waiting")}${pp("We noticed you were close to completing your order. Your products are still waiting for you!")}${greenButton("Complete your order", p("en","checkout"))}<p style="font-size:13px;color:#766a62;text-align:center">Free shipping on orders over 600 SEK.</p>`,
          es: `${h2("Tu carrito te espera")}${pp("Notamos que estuviste a punto de completar tu pedido. ¡Tus productos todavía te están esperando!")}${greenButton("Completar tu pedido", p("es","checkout"))}<p style="font-size:13px;color:#766a62;text-align:center">Envío gratis en pedidos superiores a 600 SEK.</p>`,
          de: `${h2("Dein Warenkorb wartet")}${pp("Wir haben gesehen, dass du kurz davor warst, deine Bestellung abzuschließen. Deine Produkte warten noch auf dich!")}${greenButton("Bestellung abschließen", p("de","checkout"))}<p style="font-size:13px;color:#766a62;text-align:center">Kostenloser Versand bei Bestellungen über 600 SEK.</p>`,
          fr: `${h2("Votre panier vous attend")}${pp("Nous avons remarqué que vous étiez sur le point de finaliser votre commande. Vos produits vous attendent toujours !")}${greenButton("Finaliser votre commande", p("fr","checkout"))}<p style="font-size:13px;color:#766a62;text-align:center">Livraison gratuite à partir de 600 SEK.</p>`
        }
      },
      {
        delay_hours: 24,
        subject: { sv: "Fortfarande intresserad? Fri frakt på oss", en: "Still interested? Free shipping on us", es: "¿Sigues interesado/a? Envío gratis por nuestra cuenta", de: "Noch interessiert? Versandkostenfrei auf uns", fr: "Toujours intéressé(e) ? Livraison offerte" },
        html: {
          sv: `${h2("Vi bjuder på frakten")}${pp("Vi vill göra det enkelt för dig. Slutför din beställning idag så står vi för fraktkostnaden – oavsett ordervärde.")}${greenButton("Handla med fri frakt", p("sv","checkout"))}`,
          en: `${h2("Shipping's on us")}${pp("We want to make it easy for you. Complete your order today and we'll cover the shipping cost – regardless of order value.")}${greenButton("Shop with free shipping", p("en","checkout"))}`,
          es: `${h2("El envío corre por nuestra cuenta")}${pp("Queremos hacértelo fácil. Completa tu pedido hoy y cubrimos el costo de envío – sin importar el valor del pedido.")}${greenButton("Comprar con envío gratis", p("es","checkout"))}`,
          de: `${h2("Versand geht auf uns")}${pp("Wir möchten es dir einfach machen. Schließe deine Bestellung heute ab und wir übernehmen die Versandkosten – unabhängig vom Bestellwert.")}${greenButton("Mit kostenlosem Versand bestellen", p("de","checkout"))}`,
          fr: `${h2("La livraison est pour nous")}${pp("Nous voulons vous faciliter la tâche. Finalisez votre commande aujourd'hui et nous prenons en charge les frais de livraison – quel que soit le montant.")}${greenButton("Acheter avec livraison gratuite", p("fr","checkout"))}`
        }
      },
      {
        delay_hours: 72,
        subject: { sv: "Sista chansen – 5% extra rabatt", en: "Last chance – 5% extra off", es: "Última oportunidad – 5% de descuento extra", de: "Letzte Chance – 5% Extra-Rabatt", fr: "Dernière chance – 5% de réduction supplémentaire" },
        html: {
          sv: `${h2("Sista knuffen")}${pp("Vi ger inte upp så lätt! Här är <strong>5% extra rabatt</strong> på hela din varukorg. Använd koden:")}<p style="font-size:17px;font-weight:700;color:#108474;text-align:center;margin:20px 0">KOMTILLBAKA5</p>${greenButton("Slutför ditt köp", p("sv","checkout"))}<p style="font-size:13px;color:#766a62;text-align:center">Erbjudandet är giltigt i 48 timmar.</p>`,
          en: `${h2("One last nudge")}${pp("We don't give up easily! Here's <strong>5% extra off</strong> your entire cart. Use the code:")}<p style="font-size:17px;font-weight:700;color:#108474;text-align:center;margin:20px 0">COMEBACK5</p>${greenButton("Complete your purchase", p("en","checkout"))}<p style="font-size:13px;color:#766a62;text-align:center">Offer valid for 48 hours.</p>`,
          es: `${h2("Último empujón")}${pp("¡No nos rendimos fácilmente! Aquí tienes un <strong>5% de descuento extra</strong> en todo tu carrito. Usa el código:")}<p style="font-size:17px;font-weight:700;color:#108474;text-align:center;margin:20px 0">VUELVE5</p>${greenButton("Completar tu compra", p("es","checkout"))}<p style="font-size:13px;color:#766a62;text-align:center">Oferta válida por 48 horas.</p>`,
          de: `${h2("Ein letzter Anstoß")}${pp("Wir geben nicht so leicht auf! Hier sind <strong>5% Extra-Rabatt</strong> auf deinen gesamten Warenkorb. Nutze den Code:")}<p style="font-size:17px;font-weight:700;color:#108474;text-align:center;margin:20px 0">COMEBACK5</p>${greenButton("Kauf abschließen", p("de","checkout"))}<p style="font-size:13px;color:#766a62;text-align:center">Angebot gültig für 48 Stunden.</p>`,
          fr: `${h2("Un dernier coup de pouce")}${pp("Nous n'abandonnons pas facilement ! Voici <strong>5% de réduction supplémentaire</strong> sur tout votre panier. Utilisez le code :")}<p style="font-size:17px;font-weight:700;color:#108474;text-align:center;margin:20px 0">RETOUR5</p>${greenButton("Finaliser votre achat", p("fr","checkout"))}<p style="font-size:13px;color:#766a62;text-align:center">Offre valable 48 heures.</p>`
        }
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
        totalAmount: (Number(order.total_amount || 0) + Number(order.shipping_cost || 0)) / 100,
        currency: order.currency || "SEK",
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
            totalAmount: (Number(order.total_amount || 0) + Number(order.shipping_cost || 0)) / 100,
            currency: order.currency || "SEK",
            firstPurchase: true,
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
    const wasJustProcessed = !order.processed_at && updated.processed_at;
    res.json({
      success: true,
      orderNumber: updated.order_number,
      status: updated.status,
      paymentStatus: updated.payment_status,
      totalAmount: (Number(updated.total_amount || 0) + Number(updated.shipping_cost || 0)) / 100,
      currency: updated.currency || "SEK",
      firstPurchase: wasJustProcessed,
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
- Fri frakt över 600 kr
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

    const analyses = await db.getSkinAnalyses(userId, user.email).catch(() => []);
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
      return res.status(429).json({ message: apiMsg("rateLimited", reqLocale(req)) });
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