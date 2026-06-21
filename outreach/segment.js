// outreach/segment.js
//
// Klassificerar en mottagare utifrån befintlig kunddata och bygger en kort,
// faktabaserad kontext som agenten grundar sitt första mejl på. Ingen LLM här –
// bara verifierad data ur DB.

const db = require("../db");

/** Segment som styr tonen i första-mejlet. */
const SEGMENTS = ["buyer_duotada", "buyer_other", "analysis", "newsletter"];

function firstName(name) {
  return String(name || "").trim().split(/\s+/)[0] || "";
}

function orderMentionsDuoTada(orders) {
  if (!orders || !orders.length) return false;
  for (const o of orders) {
    try {
      const blob = JSON.stringify(o.items || "").toLowerCase();
      if (blob.includes("duo-ta-da") || blob.includes("duo+ta-da") || blob.includes('"4004"')) {
        return true;
      }
    } catch (_) { /* ignore */ }
  }
  return false;
}

/**
 * buildContactContext(email) → {
 *   email, name, firstName, locale, segment, boughtDuoTada,
 *   contextSummary, suppressed, suppressionReason
 * }
 * Returnerar null endast vid grovt fel (kallande kod hanterar då skip).
 */
async function buildContactContext(rawEmail) {
  const email = String(rawEmail || "").toLowerCase().trim();
  if (!email) return null;

  let user = null, orders = [], paidCount = 0, analyses = [], subscriber = null;
  try { user = await db.findUserByEmail(email); } catch (_) {}
  try { orders = await db.findOrdersByEmail(email); } catch (_) {}
  try { paidCount = await db.countOrdersByEmail(email); } catch (_) {}
  try { analyses = await db.getSkinAnalyses(user?.id || null, email); } catch (_) {}
  try { subscriber = await db.findSubscriberByEmail(email); } catch (_) {}

  const paidOrders = (orders || []).filter(o => o.payment_status === "paid");
  const hasPaid = paidCount > 0 || paidOrders.length > 0;
  const boughtDuoTada = orderMentionsDuoTada(paidOrders.length ? paidOrders : orders);
  const hasAnalysis = (analyses || []).length > 0;

  // Suppression: avprenumererade mailas aldrig.
  const suppressed = !!(subscriber && subscriber.status === "unsubscribed");
  const suppressionReason = suppressed ? "newsletter_unsubscribed" : "";

  // Segmentprioritet: duo-tada-köpare → övriga köpare → hudanalys → nyhetsbrev.
  let segment;
  if (boughtDuoTada) segment = "buyer_duotada";
  else if (hasPaid) segment = "buyer_other";
  else if (hasAnalysis) segment = "analysis";
  else segment = "newsletter";

  const name = (user?.name || subscriber?.name || "").trim();
  const locale = user?.locale || subscriber?.locale || "sv";

  // Kort, faktabaserad sammanfattning (matas in som DATA till agenten).
  const facts = [];
  if (hasPaid) facts.push(`Har handlat hos oss (${paidOrders.length || paidCount} betald order).`);
  if (boughtDuoTada) facts.push("Har köpt DUO-kit + TA-DA Serum.");
  if (hasAnalysis) facts.push(`Har gjort hudanalysen (${analyses.length} st).`);
  if (subscriber && subscriber.status === "active") facts.push("Prenumererar på nyhetsbrevet.");
  if (!facts.length) facts.push("Vi har ingen tidigare köp- eller analyshistorik registrerad.");

  return {
    email,
    name,
    firstName: firstName(name),
    locale,
    segment,
    boughtDuoTada,
    contextSummary: facts.join(" "),
    suppressed,
    suppressionReason,
  };
}

module.exports = { SEGMENTS, buildContactContext };
