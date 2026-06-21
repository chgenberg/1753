// outreach/run.js
//
// Orchestratorn (state machine). Pollar tabellerna – inga jobbköer.
//   runOutreachBatch()      – skickar första-mejl (paus + dagskvot + segment)
//   handleInboundEmail()    – tar emot svar, klassificerar, svarar/eskalerar
//   processScheduledReplies() – levererar schemalagda (fördröjda) svar
//
// Säkerhetsräls: master-paus, dagskvot, autosvar-filter, eskalering av känsligt,
// suppression/unsubscribe, atomisk leverans, prompt-injection (inbound=data i agent.js).

const db = require("./../db");
const agent = require("./agent");
const send = require("./send");
const { isCampaignCodeActive } = require("./campaign");

// "Obegränsade svar" men med skyddsnät: efter detta antal egna svar lämnar vi
// över till en människa istället för att riskera en oändlig bot-loop.
const MAX_AUTO_REPLIES = 12;

const UNSUB_PATTERNS = [
  /avprenumer/i, /avanmäl/i, /unsubscri/i, /sluta\s+(skicka|mejla|maila)/i,
  /\bsluta\b/i, /\bstopp?\b/i, /ta\s+bort\s+m(ig|ej)/i,
  /vill\s+inte\s+(ha|få)\s+(mer|fler|nyhetsbrev|mail|mejl|utskick)/i,
  /remove\s+me/i, /opt\s*out/i, /stop\s+(sending|emails)/i, /\bstop\b/i,
];
function isUnsub(text) { return !!text && UNSUB_PATTERNS.some(p => p.test(text)); }

function isAutoReply({ subject, text, headers }) {
  const h = headers || {};
  const auto = h["auto-submitted"] || h["Auto-Submitted"] || "";
  const prec = h["precedence"] || h["Precedence"] || "";
  if (/auto-(generated|replied)/i.test(auto)) return true;
  if (/bulk|auto_reply|junk/i.test(prec)) return true;
  const blob = `${subject || ""} ${text || ""}`;
  return /out of office|autosvar|frånvaro|automatiskt svar|automatic reply|vacation/i.test(blob);
}

function humanDelayMs() {
  // 4-10 minuter slumpad fördröjning så det aldrig ser ut som en bot.
  return (4 * 60 + Math.floor(Math.random() * 6 * 60)) * 1000;
}

function firstNameOf(name) {
  return String(name || "").trim().split(/\s+/)[0] || "";
}

function ctxFromContact(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    firstName: firstNameOf(row.name),
    segment: row.segment,
    locale: row.locale || "sv",
    contextSummary: row.context_summary || "",
    context_summary: row.context_summary || "",
  };
}

// ---- 1. Första-mejl ----

async function runOutreachBatch() {
  const settings = await db.getOutreachSettings();
  if (!settings) return { skipped: "no-settings" };
  if (settings.paused) return { skipped: "paused" };

  const canSend = settings.autonomous && send.emailConfigured();
  if (!canSend) return { skipped: "not-autonomous-or-unconfigured" };

  const cap = settings.daily_cap || 15;
  const sent24 = await db.countOutreachFirstTouchLast24h();
  const remaining = cap - sent24;
  if (remaining <= 0) return { skipped: "daily-cap-reached", sent24, cap };

  const campaignActive = await isCampaignCodeActive();
  const contacts = await db.findDueOutreachFirstTouch(remaining);

  let sent = 0, errors = 0;
  for (const row of contacts) {
    const contact = ctxFromContact(row);
    try {
      const email = await agent.composeFirstEmail(contact, { campaignActive });
      if (!email) {
        errors++;
        await db.updateOutreachContact(row.id, { status: "error", last_error: "compose_failed" });
        continue;
      }
      const attachImage = campaignActive && contact.segment !== "buyer_duotada";
      await send.sendOutreachEmail({ contact, subject: email.subject, body: email.body, firstTouch: true, attachImage });
      await db.updateOutreachContact(row.id, { status: "awaiting_reply", last_error: "" });
      sent++;
    } catch (err) {
      errors++;
      console.error(`[Outreach][run] first-touch failed for ${row.email}:`, err.message);
      try { await db.updateOutreachContact(row.id, { status: "error", last_error: String(err.message).slice(0, 400) }); } catch (_) {}
    }
  }
  return { sent, errors, remaining, campaignActive };
}

// ---- 2. Inkommande svar ----

async function handleInboundEmail({ fromEmail, toEmail, subject, text, replyToken, headers }) {
  // Autosvar/frånvaro ignoreras helt.
  if (isAutoReply({ subject, text, headers })) return { matched: false, ignored: "auto-reply" };

  // Matcha kontakt via reply_token eller avsändaradress.
  let row = null;
  if (replyToken) row = await db.findOutreachContactByToken(replyToken);
  if (!row && fromEmail) row = await db.findOutreachContactByEmail(fromEmail);
  if (!row) return { matched: false }; // inte vår kontakt – lämnas till support-inkorgen

  // Spegla inkommande + uppdatera kontakt.
  await db.createOutreachMessage({
    contactId: row.id,
    direction: "inbound",
    subject: subject || "",
    body: text || "",
    fromEmail: fromEmail || row.email,
    toEmail: toEmail || send.fromEmail(),
    status: "received",
  });
  await db.updateOutreachContact(row.id, { last_inbound_at: new Date(), status: "replied" });

  // Avprenumerera direkt om kunden ber om det.
  if (isUnsub(`${subject || ""} ${text || ""}`)) {
    await db.cancelScheduledOutreachForContact(row.id);
    await db.updateOutreachContact(row.id, { status: "unsubscribed" });
    try { await db.unsubscribeByEmail(row.email); } catch (_) {}
    return { matched: true, unsubscribed: true };
  }

  const settings = await db.getOutreachSettings();
  const campaignActive = await isCampaignCodeActive();
  const contact = ctxFromContact(row);
  const threadData = await db.getOutreachThread(row.id);
  const thread = threadData ? threadData.messages : [];

  // Skyddsnät mot oändlig loop → eskalera till människa (stoppar inte tråden hårt).
  const overLimit = (row.auto_replies || 0) >= MAX_AUTO_REPLIES;

  const result = await agent.composeReply(contact, thread, text, { campaignActive });

  // Eskalering: känsligt/klagomål/osäkert/limit → människa.
  if (!result || result.escalate || overLimit) {
    try {
      const summary = await agent.summarizeForHandoff(contact, thread);
      await send.forwardHandoff({
        contact: row,
        thread,
        summary,
        handoffEmails: parseHandoff(settings),
      });
    } catch (err) {
      console.error("[Outreach][run] handoff failed:", err.message);
    }
    // Skicka ändå ett kort, varmt mellansvar om vi har ett.
    if (result && result.reply) {
      await db.cancelScheduledOutreachForContact(row.id);
      await send.scheduleReply({
        contact,
        subject: replySubject(subject),
        body: result.reply,
        scheduledAt: new Date(Date.now() + humanDelayMs()),
      });
    }
    await db.updateOutreachContact(row.id, { status: "handed_off" });
    return { matched: true, escalated: true, intent: result?.intent || "unknown" };
  }

  if (result.intent === "not_interested") {
    await db.cancelScheduledOutreachForContact(row.id);
    await db.updateOutreachContact(row.id, { status: "not_interested" });
    return { matched: true, intent: "not_interested" };
  }

  // Vanligt svar: schemalägg med mänsklig fördröjning (ersätt ev. tidigare schemalagt).
  await db.cancelScheduledOutreachForContact(row.id);
  await send.scheduleReply({
    contact,
    subject: replySubject(subject),
    body: result.reply,
    scheduledAt: new Date(Date.now() + humanDelayMs()),
  });
  await db.updateOutreachContact(row.id, {
    status: "awaiting_reply",
    auto_replies: (row.auto_replies || 0) + 1,
  });
  return { matched: true, intent: result.intent, scheduled: true };
}

function replySubject(subject) {
  const s = String(subject || "").trim();
  if (!s) return "Re: ditt mejl";
  return /^re:/i.test(s) ? s : `Re: ${s}`;
}

function parseHandoff(settings) {
  if (!settings) return [];
  try {
    const raw = settings.handoff_emails;
    if (Array.isArray(raw)) return raw;
    return JSON.parse(raw || "[]");
  } catch (_) { return []; }
}

// ---- 3. Leverera schemalagda svar ----

async function processScheduledReplies() {
  const due = await db.findDueScheduledOutreach(10);
  let delivered = 0;
  for (const msg of due) {
    const threadData = await db.getOutreachThread(msg.contact_id);
    if (!threadData) continue;
    const contact = ctxFromContact(threadData.contact);
    const res = await send.deliverScheduledMessage(msg, contact);
    if (res.ok) delivered++;
  }
  return { delivered };
}

module.exports = { runOutreachBatch, handleInboundEmail, processScheduledReplies };
