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

// Plockar ut ett rent FÖRNAMN ur ett ostädat namnfält.
// Källdatan är blandad: "Angelica Svärd" (ok), "Emelie Rick91" (siffror),
// "Tovarobertsson"/"Martinacarlson2" (för+efternamn ihopklistrat utan mellanslag).
// Går namnet inte att dela säkert → returnera "" så agenten hälsar varmt utan namn
// istället för att skriva fel ("Hej Tovarobertsson").
function firstNameOf(name) {
  const raw = String(name || "").trim();
  if (!raw) return "";
  const hadSpace = /\s/.test(raw);
  let first = raw.split(/\s+/)[0].replace(/[0-9]+/g, "").trim();
  if (!first) return "";
  // Ett enda ord utan mellanslag och ovanligt långt = troligen ihopklistrat för+efternamn.
  if (!hadSpace && first.length >= 12) return "";
  // Snygga till versalisering om allt är gemener/versaler ("anna" -> "Anna").
  if (first === first.toLowerCase() || first === first.toUpperCase()) {
    first = first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  }
  return first;
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
//
// Anti-spam-pacing: agenten skickar ALDRIG hela dagskvoten på en gång (det ser ut
// som massutskick och triggar skräppostfilter). Istället skickas max ETT första-mejl
// per tick, bara inom sändfönstret (svensk dagtid) och med 18-40 min slumpat
// mellanrum. Dagskvoten (daily_cap) sätter taket per rullande 24 h.

const SEND_WINDOW_START = 8;   // 08:00 svensk tid
const SEND_WINDOW_END = 21;    // skickar t.o.m. 20:59
const PACE_BASE_MIN = 18;      // minst så här många minuter mellan första-mejl
const PACE_JITTER_MIN = 22;    // + 0-22 min slump → 18-40 min, mänskligt oregelbundet

function stockholmHour() {
  try {
    return parseInt(
      new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Stockholm", hour: "numeric", hour12: false }).format(new Date()),
      10
    );
  } catch (_) {
    return new Date().getHours();
  }
}

async function runOutreachBatch() {
  const settings = await db.getOutreachSettings();
  if (!settings) return { skipped: "no-settings" };
  if (settings.paused) return { skipped: "paused" };

  const canSend = settings.autonomous && send.emailConfigured();
  if (!canSend) return { skipped: "not-autonomous-or-unconfigured" };

  // Sändfönster: bara dagtid – inga mejl mitt i natten.
  const hour = stockholmHour();
  if (hour < SEND_WINDOW_START || hour >= SEND_WINDOW_END) return { skipped: "outside-window", hour };

  const cap = settings.daily_cap || 15;
  const sent24 = await db.countOutreachFirstTouchLast24h();
  if (sent24 >= cap) return { skipped: "daily-cap-reached", sent24, cap };

  // Pacing: håll minst 18-40 min mellan proaktiva utskick så det sprids över dagen.
  const lastAt = await db.getLastCampaignSendAt();
  if (lastAt) {
    const gapMs = (PACE_BASE_MIN + Math.random() * PACE_JITTER_MIN) * 60000;
    if (Date.now() - new Date(lastAt).getTime() < gapMs) return { skipped: "pacing" };
  }

  const campaignActive = await isCampaignCodeActive();
  const contacts = await db.findDueOutreachFirstTouch(1); // exakt ETT per tick
  if (!contacts.length) return { skipped: "empty-queue", sent24, cap };

  const row = contacts[0];
  const contact = ctxFromContact(row);
  try {
    const email = await agent.composeFirstEmail(contact, { campaignActive });
    if (!email) {
      await db.updateOutreachContact(row.id, { status: "error", last_error: "compose_failed" });
      return { sent: 0, errors: 1, sent24, cap };
    }
    const attachImage = campaignActive && contact.segment !== "buyer_duotada";
    await send.sendOutreachEmail({ contact, subject: email.subject, body: email.body, firstTouch: true, attachImage });
    await db.updateOutreachContact(row.id, { status: "awaiting_reply", last_error: "" });
    return { sent: 1, errors: 0, sent24: sent24 + 1, cap, campaignActive };
  } catch (err) {
    console.error(`[Outreach][run] first-touch failed for ${row.email}:`, err.message);
    try { await db.updateOutreachContact(row.id, { status: "error", last_error: String(err.message).slice(0, 400) }); } catch (_) {}
    return { sent: 0, errors: 1, sent24, cap };
  }
}

// ---- 1b. Uppföljning (en enda, efter ~3,5 dygn utan svar) ----
//
// Samma anti-spam-regler som första-mejlet: sändfönster, pacing (delad rytm via
// getLastCampaignSendAt) och ett per tick. Egen 24h-kvot. Efter utskick markeras
// kontakten 'followed_up' → vi hör aldrig av oss proaktivt igen.

const FOLLOWUP_AFTER_HOURS = 84; // ~3,5 dygn

async function runFollowupBatch() {
  const settings = await db.getOutreachSettings();
  if (!settings) return { skipped: "no-settings" };
  if (settings.paused) return { skipped: "paused" };

  const canSend = settings.autonomous && send.emailConfigured();
  if (!canSend) return { skipped: "not-autonomous-or-unconfigured" };

  const hour = stockholmHour();
  if (hour < SEND_WINDOW_START || hour >= SEND_WINDOW_END) return { skipped: "outside-window", hour };

  const cap = settings.daily_cap || 15;
  const sent24 = await db.countOutreachFollowupsLast24h();
  if (sent24 >= cap) return { skipped: "followup-cap-reached", sent24, cap };

  const lastAt = await db.getLastCampaignSendAt();
  if (lastAt) {
    const gapMs = (PACE_BASE_MIN + Math.random() * PACE_JITTER_MIN) * 60000;
    if (Date.now() - new Date(lastAt).getTime() < gapMs) return { skipped: "pacing" };
  }

  const contacts = await db.findDueOutreachFollowups(1, FOLLOWUP_AFTER_HOURS);
  if (!contacts.length) return { skipped: "empty-queue" };

  const row = contacts[0];
  const contact = ctxFromContact(row);
  try {
    const campaignActive = await isCampaignCodeActive();
    const email = await agent.composeFollowup(contact, { campaignActive });
    if (!email) {
      // Misslyckad compose ska inte fastna i loop – markera som uppföljd ändå.
      await db.updateOutreachContact(row.id, { followup_count: 1 });
      return { sent: 0, errors: 1 };
    }
    const attachImage = campaignActive && contact.segment !== "buyer_duotada";
    await send.sendOutreachEmail({ contact, subject: email.subject, body: email.body, firstTouch: false, attachImage, intent: "followup" });
    await db.updateOutreachContact(row.id, { followup_count: 1, status: "followed_up", last_error: "" });
    return { sent: 1, errors: 0, followup: true };
  } catch (err) {
    console.error(`[Outreach][run] followup failed for ${row.email}:`, err.message);
    try { await db.updateOutreachContact(row.id, { followup_count: 1, last_error: String(err.message).slice(0, 400) }); } catch (_) {}
    return { sent: 0, errors: 1 };
  }
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

module.exports = { runOutreachBatch, runFollowupBatch, handleInboundEmail, processScheduledReplies };
