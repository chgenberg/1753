/**
 * Personligt prenumerationsmejl till kunder med minst ett betalt köp som
 * är aktiva i nyhetsbrevet men saknar produktprenumeration. Texten anpassas
 * efter den produkt kunden köpt mest av och efter antal köp.
 *
 * Kör:
 *   railway run -- node scripts/send-subscription-invite.js --dry-run
 *   railway run -- node scripts/send-subscription-invite.js --preview   (en per produkt till ägaren)
 *   railway run -- node scripts/send-subscription-invite.js             (skarpt)
 *
 * Skarpa utskick loggas i logs/subscription-invite-sent.json; adresser där
 * hoppas över vid omkörning.
 */
const fs = require("fs");
const path = require("path");
const db = require("../db");

const FROM = "1753 SKINCARE <info@1753skin.com>";
const REPLY_TO = "info@1753skin.com";
const SITE = "https://www.1753skin.com";
const PREVIEW_TO = "ch.genberg@gmail.com";
const EXCLUDE = new Set(["ch.genberg@gmail.com", "christopher@1753skincare.com"]);
const SENT_LOG = path.join(__dirname, "..", "logs", "subscription-invite-sent.json");
const SEND_DELAY_MS = 400;
const EXAMPLE_INTERVAL_DAYS = 60;

const PRODUCTS = {
  "duo-kit": { name: "DUO-kit", phrase: "DUO-kitet", list: 1099 },
  "duo-ta-da": { name: "DUO-kit + TA-DA Serum", phrase: "DUO-kitet och TA-DA Serum", list: 1495 },
  "fungtastic-mushroom-extract": { name: "Fungtastic Mushroom Extract", phrase: "Fungtastic Mushroom Extract", list: 377 },
  "au-naturel-makeup-remover": { name: "Au Naturel Makeup Remover", phrase: "Au Naturel Makeup Remover", list: 399 },
  "ta-da-serum": { name: "TA-DA Serum", phrase: "TA-DA Serum", list: 699 },
};

function subPrice(list) {
  return Math.round(list * 0.85);
}

function kr(n) {
  return n.toLocaleString("sv-SE").replace(/\s/g, "&nbsp;");
}

function krText(n) {
  return n.toLocaleString("sv-SE").replace(/\s/g, " ");
}

function firstName(full) {
  const raw = (full || "").trim().split(/\s+/)[0] || "";
  if (!raw || raw.includes("@")) return "";
  return raw
    .toLowerCase()
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");
}

function wrapper(content, unsubUrl) {
  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1d1d1f;padding:0 16px">
    <div style="text-align:center;padding:32px 0 8px">
      <img src="https://www.1753skin.com/1753.png" alt="1753 SKINCARE" width="48" height="48" style="border-radius:12px"/>
    </div>
    ${content}
    <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e6e6e6;text-align:center">
      <p style="font-size:12px;color:#766a62;line-height:1.6;margin:0">
        1753 SKINCARE – Holistisk hudvård med CBD och CBG<br>
        <a href="https://www.1753skin.com" style="color:#108474">www.1753skin.com</a>
      </p>
      ${unsubUrl ? `<p style="margin-top:12px;font-size:11px"><a href="${unsubUrl}" style="color:#999;text-decoration:underline">Avprenumerera</a></p>` : ""}
    </div>
  </div>`;
}

function btn(text, href) {
  return `<div style="text-align:center;margin:28px 0">
    <a href="${href}" style="display:inline-block;background:#108474;color:#fff;padding:14px 32px;border-radius:980px;font-size:15px;font-weight:600;text-decoration:none">${text}</a>
  </div>`;
}

const P = "font-size:15px;line-height:1.7;color:#515151;margin:0 0 14px";

function buildEmail({ name, productId, orderCount, unsubUrl }) {
  const p = PRODUCTS[productId];
  const fn = firstName(name);
  const sub = subPrice(p.list);
  const saving = p.list - sub;
  const yearly = saving * Math.round(365 / EXAMPLE_INTERVAL_DAYS);
  const url = `${SITE}/sv/produkter/${productId}`;
  const repeat = orderCount >= 2;

  const subject = fn ? `${fn}, en sak om ${p.phrase}` : `En sak om ${p.phrase}`;
  const greeting = fn ? `Hej ${fn},` : "Hej,";

  const intro = repeat
    ? `Vi ser att du har handlat hos oss flera gånger, och att ${p.phrase} är det du oftast väljer. Det gör oss glada. Det säger oss att du har hittat något som fungerar för dig.`
    : `Vi ser att du har köpt ${p.phrase} hos oss. Tack för det, på riktigt.`;

  const subStrong = `<strong style="color:#1d1d1f">${kr(sub)}&nbsp;kr</strong>`;
  const pitch = repeat
    ? `Då tycker vi inte att du ska betala fullpris varje gång. Som prenumerant betalar du ${subStrong} i stället för ${kr(p.list)}&nbsp;kr. Det blir ${kr(saving)}&nbsp;kr mindre per leverans.`
    : `Visste du att du kan få det billigare? Som prenumerant betalar du ${subStrong} i stället för ${kr(p.list)}&nbsp;kr, varje gång. Det blir ${kr(saving)}&nbsp;kr mindre per leverans.`;

  const pitchText = repeat
    ? `Då tycker vi inte att du ska betala fullpris varje gång. Som prenumerant betalar du ${krText(sub)} kr i stället för ${krText(p.list)} kr. Det blir ${krText(saving)} kr mindre per leverans.`
    : `Visste du att du kan få det billigare? Som prenumerant betalar du ${krText(sub)} kr i stället för ${krText(p.list)} kr, varje gång. Det blir ${krText(saving)} kr mindre per leverans.`;

  const yearLine = `Väljer du leverans var ${EXAMPLE_INTERVAL_DAYS}:e dag blir det ungefär ${kr(yearly)}&nbsp;kr kvar i plånboken på ett år.`;
  const yearLineText = `Väljer du leverans var ${EXAMPLE_INTERVAL_DAYS}:e dag blir det ungefär ${krText(yearly)} kr kvar i plånboken på ett år.`;

  const how = "Du väljer själv om det ska komma var 30:e, 60:e eller 90:e dag, och du slipper komma ihåg att beställa. Ingen bindningstid. Du kan ändra intervall, pausa eller avsluta när du vill under Mitt konto.";
  const card = "En sak att veta: prenumerationen betalas med kort, eftersom Swish inte klarar automatiska dragningar. Första leveransen betalar du direkt, sedan dras resten automatiskt.";
  const cta = `Prenumerera på ${p.name}`;

  const html = wrapper(`
    <p style="font-size:16px;line-height:1.7;margin:24px 0 12px">${greeting}</p>
    <p style="${P}">${intro}</p>
    <p style="${P}">${pitch}</p>
    <p style="${P}">${yearLine}</p>
    <p style="${P}">${how}</p>
    <p style="${P}">${card}</p>
    ${btn(cta, url)}
    <p style="font-size:15px;line-height:1.7;color:#515151;margin:0">
      Hör av dig om du undrar något. Svara bara på det här mejlet, jag läser själv.<br><br>
      / Christopher<br>
      <span style="color:#766a62">1753 SKINCARE</span>
    </p>
  `, unsubUrl);

  const text = [
    greeting,
    "",
    intro,
    "",
    pitchText,
    "",
    yearLineText,
    "",
    how,
    "",
    card,
    "",
    `${cta}: ${url}`,
    "",
    "Hör av dig om du undrar något. Svara bara på det här mejlet, jag läser själv.",
    "",
    "/ Christopher",
    "1753 SKINCARE",
    "",
    unsubUrl ? `Avprenumerera: ${unsubUrl}` : "",
  ].join("\n");

  return { subject, html, text };
}

function readSentLog() {
  try {
    return JSON.parse(fs.readFileSync(SENT_LOG, "utf8"));
  } catch {
    return {};
  }
}

function writeSentLog(log) {
  fs.mkdirSync(path.dirname(SENT_LOG), { recursive: true });
  fs.writeFileSync(SENT_LOG, JSON.stringify(log, null, 2));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const previewOnly = process.argv.includes("--preview");
  const { Resend } = require("resend");
  const apiKey = process.env.RESEND_API_KEY;
  if (!dryRun && !apiKey) throw new Error("RESEND_API_KEY saknas");
  const resend = apiKey ? new Resend(apiKey) : null;
  const apiBase = process.env.BASE_URL || "https://api.1753skin.com";

  const { rows: targets } = await db.pool.query(`
    WITH buyers AS (
      SELECT LOWER(customer_email) AS email,
             MAX(customer_name) AS name,
             COUNT(*) AS orders
      FROM orders
      WHERE payment_status = 'paid'
        AND customer_email IS NOT NULL AND customer_email != ''
      GROUP BY 1
    ),
    product_subs AS (
      SELECT DISTINCT LOWER(COALESCE(NULLIF(s.customer_email,''), u.email)) AS email
      FROM subscriptions s
      LEFT JOIN users u ON u.id = s.user_id
      WHERE s.cancelled_at IS NULL
        AND s.status IN ('active','payment_failed','paused','pending')
    ),
    top_product AS (
      SELECT LOWER(o.customer_email) AS email,
             COALESCE(i->>'productId', i->>'id') AS product_id,
             SUM(COALESCE((i->>'quantity')::int, 1)) AS qty,
             MAX(o.created_at) AS last_bought
      FROM orders o
      CROSS JOIN LATERAL jsonb_array_elements(
        CASE WHEN jsonb_typeof(o.items::jsonb) = 'array' THEN o.items::jsonb ELSE '[]'::jsonb END
      ) i
      WHERE o.payment_status = 'paid'
      GROUP BY 1, 2
    ),
    ranked AS (
      SELECT DISTINCT ON (email) email, product_id
      FROM top_product
      ORDER BY email, qty DESC, last_bought DESC
    )
    SELECT b.email, b.name, b.orders::int AS orders, s.id AS subscriber_id, s.unsubscribe_token,
           r.product_id AS top_product_id
    FROM buyers b
    JOIN subscribers s ON LOWER(s.email) = b.email
    LEFT JOIN product_subs ps ON ps.email = b.email
    LEFT JOIN ranked r ON r.email = b.email
    WHERE s.status = 'active'
      AND ps.email IS NULL
    ORDER BY b.orders DESC, b.email
  `);

  const sentLog = readSentLog();
  const toSend = targets
    .filter((t) => !EXCLUDE.has(t.email.toLowerCase()))
    .filter((t) => !sentLog[t.email.toLowerCase()])
    .map((t) => ({ ...t, productId: PRODUCTS[t.top_product_id] ? t.top_product_id : "duo-kit" }));

  const byProduct = {};
  for (const t of toSend) byProduct[t.productId] = (byProduct[t.productId] || 0) + 1;
  console.log(`[SubInvite] ${toSend.length} mottagare (exkl. interna och redan skickade)${dryRun ? " [dry-run]" : ""}${previewOnly ? " [preview]" : ""}`);
  console.log(`[SubInvite] Per produkt: ${JSON.stringify(byProduct)}`);

  if (dryRun) {
    console.log(JSON.stringify(toSend.map((t) => ({
      email: t.email, name: firstName(t.name) || "(inget namn)", orders: t.orders, product: PRODUCTS[t.productId].name,
    })), null, 2));
    await db.pool.end();
    return;
  }

  let sendList;
  if (previewOnly) {
    const onlySingle = process.argv.includes("--single");
    const samples = onlySingle
      ? [toSend.find((t) => t.orders === 1)]
      : Object.keys(PRODUCTS).map((pid) => toSend.find((t) => t.productId === pid));
    sendList = samples
      .filter(Boolean)
      .map((t) => ({ ...t, email: PREVIEW_TO, subscriber_id: null }));
  } else {
    sendList = toSend;
  }
  if (sendList.length === 0) {
    console.log("[SubInvite] Inga mottagare");
    await db.pool.end();
    return;
  }

  const results = [];
  for (const t of sendList) {
    const unsubUrl = t.unsubscribe_token ? `${apiBase}/api/newsletter/unsubscribe/${t.unsubscribe_token}` : null;
    const built = buildEmail({ name: t.name, productId: t.productId, orderCount: t.orders, unsubUrl });
    const subject = previewOnly
      ? `[TEST ${PRODUCTS[t.productId].name}, ${t.orders} köp] ${built.subject}`
      : built.subject;

    try {
      const payload = { from: FROM, to: t.email, replyTo: REPLY_TO, subject, html: built.html, text: built.text };
      if (!previewOnly && unsubUrl) {
        payload.headers = {
          "List-Unsubscribe": `<${unsubUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        };
      }
      const { data, error } = await resend.emails.send(payload);
      if (error) throw new Error(error.message || JSON.stringify(error));
      if (!previewOnly) {
        if (t.subscriber_id) await db.touchSubscriberEmailed(t.subscriber_id);
        sentLog[t.email.toLowerCase()] = { at: new Date().toISOString(), product: t.productId, id: data?.id || null };
        writeSentLog(sentLog);
      }
      console.log(`[SubInvite] OK → ${t.email} (${firstName(t.name) || "-"}, ${PRODUCTS[t.productId].name}, ${t.orders} köp) id=${data?.id || "?"}`);
      results.push({ email: t.email, ok: true });
    } catch (err) {
      console.error(`[SubInvite] FEL → ${t.email}:`, err.message);
      results.push({ email: t.email, ok: false, error: err.message });
    }
    await sleep(SEND_DELAY_MS);
  }

  const ok = results.filter((r) => r.ok).length;
  console.log(`[SubInvite] Klart: ${ok}/${results.length}`);
  const failed = results.filter((r) => !r.ok);
  if (failed.length) console.log(JSON.stringify(failed, null, 2));
  await db.pool.end();
  process.exit(ok === results.length ? 0 : 1);
}

main().catch(async (e) => {
  console.error(e);
  try { await db.pool.end(); } catch { /* */ }
  process.exit(1);
});
