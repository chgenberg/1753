// outreach/review.js
//
// Recensionskampanjen. Egen, fristående batch som lever vid sidan av sälj-agenten
// (sparre) men återanvänder samma sändlager (Resend), samma kontakt-/meddelandetabeller
// och samma svarslogik (agenten svarar på inkommande svar via run.js).
//
// Mål: påminn kunder som köpt för 2-6 veckor sedan att lämna ett omdöme. Personligt,
// lätt att svara, och en 15 %-belöning som mejlas AUTOMATISKT när omdömet är inskickat
// (se issueReviewReward i server.js). Recensioner 4-5 stjärnor publiceras direkt på
// produktsidan; 1-3 blir utkast för granskning (befintlig logik).
//
// Anti-spam: bara vardagar, dagtid, en (1) per tick, 18-40 min mellanrum (delad rytm
// med sälj-agenten via getLastCampaignSendAt), egen dagskvot.

const jwt = require("jsonwebtoken");
const db = require("../db");
const agent = require("./agent");
const send = require("./send");

const JWT_SECRET = process.env.JWT_SECRET || "1753skincare_dev_secret_change_in_production";
const SITE_BASE = process.env.FRONTEND_URL || "https://www.1753skin.com";

const REVIEW_WINDOW_START = 9;  // 09:00 svensk tid
const REVIEW_WINDOW_END = 18;   // skickar t.o.m. 17:59
const PACE_BASE_MIN = 18;
const PACE_JITTER_MIN = 22;     // 18-40 min mellan utskick

// Lokaliserade URL-segment för recensionssidan (matchar frontendens routing).
const REVIEW_PATH = {
  sv: "skriv-omdome",
  en: "write-review",
  es: "escribir-resena",
  de: "bewertung-schreiben",
  fr: "ecrire-avis",
};

function stockholmParts() {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Stockholm", hour: "numeric", hour12: false, weekday: "short",
    });
    const parts = fmt.formatToParts(new Date());
    const hour = parseInt(parts.find(p => p.type === "hour")?.value || "0", 10);
    const wd = parts.find(p => p.type === "weekday")?.value || "";
    // Mån-fre = vardag
    const weekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(wd);
    return { hour, weekday };
  } catch (_) {
    const d = new Date();
    return { hour: d.getHours(), weekday: d.getDay() >= 1 && d.getDay() <= 5 };
  }
}

// Samma försiktiga förnamns-extraktion som run.js (ostädad källdata).
function firstNameOf(name) {
  const raw = String(name || "").trim();
  if (!raw) return "";
  const hadSpace = /\s/.test(raw);
  let first = raw.split(/\s+/)[0].replace(/[0-9]+/g, "").trim();
  if (!first) return "";
  if (!hadSpace && first.length >= 12) return "";
  if (first === first.toLowerCase() || first === first.toUpperCase()) {
    first = first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  }
  return first;
}

// context_summary lagras som JSON: { orderNumber, products:[{id,name}], boughtAt }.
// Fail-soft: returnerar tomma fält om något saknas.
function parseContext(row) {
  let data = {};
  try { data = JSON.parse(row.context_summary || "{}"); } catch (_) { data = {}; }
  const products = Array.isArray(data.products) ? data.products.filter(p => p && p.id && p.name) : [];
  return {
    orderNumber: data.orderNumber || "",
    products,
    boughtAt: data.boughtAt || "",
  };
}

function buildReviewUrl(contact, products) {
  const locale = contact.locale || "sv";
  const token = jwt.sign(
    {
      purpose: "review",
      customerName: contact.name || "",
      customerEmail: contact.email,
      orderNumber: contact.orderNumber || "",
      products,
      locale,
    },
    JWT_SECRET,
    { expiresIn: "60d" }
  );
  const seg = REVIEW_PATH[locale] || REVIEW_PATH.sv;
  return `${SITE_BASE}/${locale}/${seg}?token=${encodeURIComponent(token)}`;
}

function productNamesOf(products) {
  const names = products.map(p => p.name);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  return names.slice(0, -1).join(", ") + " och " + names[names.length - 1];
}

async function runReviewBatch() {
  const settings = await db.getReviewSettings();
  if (!settings) return { skipped: "no-settings" };
  if (settings.paused) return { skipped: "paused" };

  const canSend = settings.autonomous && send.emailConfigured();
  if (!canSend) return { skipped: "not-autonomous-or-unconfigured" };

  // Bara vardagar, dagtid – aldrig helg eller kväll/natt.
  const { hour, weekday } = stockholmParts();
  if (!weekday) return { skipped: "weekend" };
  if (hour < REVIEW_WINDOW_START || hour >= REVIEW_WINDOW_END) return { skipped: "outside-window", hour };

  const cap = settings.daily_cap || 20;
  const sent24 = await db.countReviewSendsLast24h();
  if (sent24 >= cap) return { skipped: "daily-cap-reached", sent24, cap };

  // Delad pacing-rytm med sälj-agenten så hela den utgående strömmen sprids jämnt.
  const lastAt = await db.getLastCampaignSendAt();
  if (lastAt) {
    const gapMs = (PACE_BASE_MIN + Math.random() * PACE_JITTER_MIN) * 60000;
    if (Date.now() - new Date(lastAt).getTime() < gapMs) return { skipped: "pacing" };
  }

  const contacts = await db.findDueOutreachFirstTouch(1, "recension");
  if (!contacts.length) return { skipped: "empty-queue", sent24, cap };

  const row = contacts[0];
  const ctx = parseContext(row);
  const contact = {
    id: row.id,
    email: row.email,
    name: row.name,
    firstName: firstNameOf(row.name),
    segment: "review",
    locale: row.locale || "sv",
    orderNumber: ctx.orderNumber,
    contextSummary: "",
  };

  try {
    const reviewUrl = buildReviewUrl(contact, ctx.products);
    const productNames = productNamesOf(ctx.products);
    const email = await agent.composeReviewEmail(contact, { reviewUrl, productNames });
    if (!email) {
      await db.updateOutreachContact(row.id, { status: "error", last_error: "review_compose_failed" });
      return { sent: 0, errors: 1, sent24, cap };
    }
    await send.sendOutreachEmail({ contact, subject: email.subject, body: email.body, firstTouch: false, intent: "review" });
    await db.updateOutreachContact(row.id, { status: "awaiting_reply", last_error: "" });
    return { sent: 1, errors: 0, sent24: sent24 + 1, cap };
  } catch (err) {
    console.error(`[Review][run] failed for ${row.email}:`, err.message);
    try { await db.updateOutreachContact(row.id, { status: "error", last_error: String(err.message).slice(0, 400) }); } catch (_) {}
    return { sent: 0, errors: 1, sent24, cap };
  }
}

module.exports = { runReviewBatch, buildReviewUrl, parseContext, productNamesOf };
