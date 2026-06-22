// outreach/send.js
//
// Sänd-/persistenslagret. Plain text (ser mänskligt ut, landar i Primary).
// Speglar varje mejl till outreach_messages (chatt-vyns sanning), sätter
// List-Unsubscribe, stödjer schemalagd + atomisk leverans, och handoff.

const db = require("../db");
const { CAMPAIGN } = require("./campaign");

function fromEmail() { return process.env.OUTREACH_FROM_EMAIL || ""; }
function replyEmail() { return process.env.OUTREACH_REPLY_EMAIL || fromEmail(); }
function senderName() { return process.env.OUTREACH_SENDER_NAME || "Christopher Genberg"; }

/** Utan dessa kan inget skickas (schemaläggning/spegling rör aldrig Resend). */
function emailConfigured() {
  return !!(process.env.RESEND_API_KEY && fromEmail());
}

function getResend() {
  const { Resend } = require("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

const UNSUB_LINE = {
  sv: "\n\nVill du inte få fler mejl från mig? Svara bara \"sluta\" så tar jag bort dig direkt.",
  en: "\n\nDon't want more emails from me? Just reply \"stop\" and I'll remove you right away.",
  es: "\n\n¿No quieres más correos míos? Responde \"stop\" y te quito de la lista enseguida.",
  de: "\n\nKeine weiteren Mails von mir? Antworte einfach mit \"stop\" und ich entferne dich sofort.",
  fr: "\n\nVous ne voulez plus de mes e-mails ? Répondez simplement \"stop\" et je vous retire aussitôt.",
};

function withUnsubLine(body, locale) {
  return String(body || "").trimEnd() + (UNSUB_LINE[locale] || UNSUB_LINE.sv);
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Bygger en enkel, personlig HTML-version av brödtexten med KLICKBARA länkar.
// Multipart text+html är best practice och ger bättre leverans än ren text.
// Ingen marknadsföringslayout – bara text, systemfont och länkar (känns som ett vanligt mejl).
function bodyToHtml(text) {
  const escaped = escapeHtml(text);
  const linked = escaped.replace(
    /(https?:\/\/[^\s<]+[^\s<.,;:!?)\]])/g,
    '<a href="$1" style="color:#108474;text-decoration:underline">$1</a>'
  );
  const html = linked.replace(/\r?\n/g, "<br>");
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1d1d1f">${html}</div>`;
}

function unsubscribeHeaders() {
  const addr = replyEmail();
  if (!addr) return {};
  return {
    "List-Unsubscribe": `<mailto:${addr}?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

// ---- SSRF-skyddad bild-bilaga (valfri) ----

const ALLOWED_IMAGE_HOSTS = ["www.1753skin.com", "1753skin.com", "api.1753skin.com"];
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

async function buildCampaignAttachment() {
  const url = process.env.OUTREACH_CAMPAIGN_IMAGE_URL;
  if (!url) return [];
  let parsed;
  try { parsed = new URL(url); } catch (_) { return []; }
  if (parsed.protocol !== "https:" || !ALLOWED_IMAGE_HOSTS.includes(parsed.hostname)) return [];
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX_IMAGE_BYTES) return [];
    const filename = decodeURIComponent(parsed.pathname.split("/").pop() || "produkt.jpg");
    return [{ filename, content: buf.toString("base64") }];
  } catch (_) {
    return [];
  }
}

/**
 * Skickar ett mejl direkt via Resend och speglar det i outreach_messages.
 * Returnerar { ok, providerId, message }.
 */
async function sendOutreachEmail({ contact, subject, body, firstTouch = false, attachImage = false }) {
  const locale = contact.locale || "sv";
  const finalBody = withUnsubLine(body, locale);
  let providerId = "";
  let attachments = [];
  if (attachImage) attachments = await buildCampaignAttachment();

  if (emailConfigured()) {
    const resend = getResend();
    const payload = {
      from: `${senderName()} <${fromEmail()}>`,
      to: contact.email,
      replyTo: replyEmail(),
      subject,
      text: finalBody,
      html: bodyToHtml(finalBody),
      headers: unsubscribeHeaders(),
    };
    if (attachments.length) payload.attachments = attachments;
    const result = await resend.emails.send(payload);
    providerId = result?.data?.id || result?.id || "";
  }

  const message = await db.createOutreachMessage({
    contactId: contact.id,
    direction: "outbound",
    subject,
    body: finalBody,
    fromEmail: fromEmail(),
    toEmail: contact.email,
    providerId,
    status: "sent",
    firstTouch,
    sentAt: new Date(),
  });

  await db.updateOutreachContact(contact.id, { last_outbound_at: new Date() });
  return { ok: true, providerId, message };
}

/** Skapar ett schemalagt svar (skickas senare av processScheduledReplies). */
async function scheduleReply({ contact, subject, body, scheduledAt }) {
  const locale = contact.locale || "sv";
  return db.createOutreachMessage({
    contactId: contact.id,
    direction: "outbound",
    subject,
    body: withUnsubLine(body, locale),
    fromEmail: fromEmail(),
    toEmail: contact.email,
    status: "scheduled",
    scheduledAt,
  });
}

/**
 * Levererar en schemalagd rad. Atomisk reservation (scheduled->sending) så två
 * tickar aldrig dubbelskickar. Body innehåller redan unsub-raden.
 */
async function deliverScheduledMessage(messageRow, contact) {
  const reserved = await db.reserveScheduledOutreach(messageRow.id);
  if (!reserved) return { ok: false, skipped: true };

  let providerId = "";
  try {
    if (emailConfigured()) {
      const resend = getResend();
      const result = await resend.emails.send({
        from: `${senderName()} <${fromEmail()}>`,
        to: contact.email,
        replyTo: replyEmail(),
        subject: reserved.subject,
        text: reserved.body,
        html: bodyToHtml(reserved.body),
        headers: unsubscribeHeaders(),
      });
      providerId = result?.data?.id || result?.id || "";
    }
    await db.markOutreachMessageSent(reserved.id, providerId);
    await db.updateOutreachContact(contact.id, { last_outbound_at: new Date() });
    return { ok: true, providerId };
  } catch (err) {
    // Lägg tillbaka som scheduled så den kan retrias nästa tick.
    await db.createOutreachMessage({
      contactId: contact.id,
      direction: "outbound",
      subject: reserved.subject,
      body: reserved.body,
      fromEmail: fromEmail(),
      toEmail: contact.email,
      status: "scheduled",
      scheduledAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    console.error("[Outreach][send] deliverScheduled failed, re-queued:", err.message);
    return { ok: false, error: err.message };
  }
}

/** Mejlar hela tråden + AI-summering till människa-teamet. */
async function forwardHandoff({ contact, thread, summary, handoffEmails }) {
  if (!emailConfigured()) return { ok: false };
  const to = (Array.isArray(handoffEmails) && handoffEmails.length)
    ? handoffEmails
    : ["info@1753skin.com"];
  const transcript = (thread || [])
    .map(m => `[${m.direction === "inbound" ? "KUND" : "AGENT"}] ${new Date(m.created_at).toLocaleString("sv-SE")}\n${m.body}`)
    .join("\n\n----\n\n");
  const resend = getResend();
  await resend.emails.send({
    from: `1753 Outreach <${fromEmail()}>`,
    to,
    replyTo: contact.email,
    subject: `[Outreach – behöver människa] ${contact.email}`,
    text: `Den autonoma mejlagenten har eskalerat en konversation.

Kund: ${contact.name || "(okänt namn)"} <${contact.email}>
Segment: ${contact.segment}
Kontext: ${contact.context_summary || contact.contextSummary || ""}

SAMMANFATTNING:
${summary}

FULL KONVERSATION:
${transcript}

Svara kunden direkt (Reply-To är kundens adress).`,
  });
  return { ok: true };
}

module.exports = {
  emailConfigured,
  fromEmail,
  replyEmail,
  senderName,
  sendOutreachEmail,
  scheduleReply,
  deliverScheduledMessage,
  forwardHandoff,
  CAMPAIGN,
};
