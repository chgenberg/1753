/**
 * Engångsutskick: personligt prenumerationsmejl till kunder med ≥3 köp
 * som är aktiva i nyhetsbrevet men saknar produktprenumeration.
 *
 * Kör: railway run -- node scripts/send-subscription-invite.js
 */
const db = require("../db");

const FROM = "1753 SKINCARE <info@1753skin.com>";
const SITE = "https://www.1753skin.com";
const EXCLUDE = new Set(["ch.genberg@gmail.com", "christopher@1753skincare.com"]);

const PRODUCT_URL = {
  "duo-kit": `${SITE}/sv/produkter/duo-kit`,
  "duo-ta-da": `${SITE}/sv/produkter/duo-ta-da`,
  "fungtastic-mushroom-extract": `${SITE}/sv/produkter/fungtastic-mushroom-extract`,
  "au-naturel-makeup-remover": `${SITE}/sv/produkter/au-naturel-makeup-remover`,
  "ta-da-serum": `${SITE}/sv/produkter/ta-da-serum`,
};

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

function firstName(full) {
  return (full || "").trim().split(/\s+/)[0] || "du";
}

function buildEmail({ name, topProductId, topProductName, orderCount, subPrice, listPrice, unsubUrl }) {
  const fn = firstName(name);
  const url = PRODUCT_URL[topProductId] || `${SITE}/sv/produkter`;
  const subject = `${fn}, du handlar redan – då ska du ha bättre pris`;

  const html = wrapper(`
    <p style="font-size:16px;line-height:1.7;margin:24px 0 12px">Hej ${fn},</p>
    <p style="font-size:15px;line-height:1.7;color:#515151;margin:0 0 14px">
      Du har handlat hos oss ${orderCount} gånger nu. Det märks – och det betyder att du redan har hittat något som funkar.
      Då tycker vi att du ska betala mindre för det, inte samma pris om och om igen.
    </p>
    <p style="font-size:15px;line-height:1.7;color:#515151;margin:0 0 14px">
      Med en prenumeration får du <strong style="color:#1d1d1f">15&nbsp;% rabatt</strong> på varje leverans.
      På ${topProductName} betyder det <strong style="color:#1d1d1f">${subPrice}&nbsp;kr</strong> i stället för ${listPrice}&nbsp;kr – och du slipper komma ihåg att beställa.
    </p>
    <p style="font-size:15px;line-height:1.7;color:#515151;margin:0 0 8px">
      Så här gör du:
    </p>
    <ol style="font-size:15px;line-height:1.8;color:#515151;padding-left:20px;margin:0 0 14px">
      <li>Gå in på produktsidan för ${topProductName}.</li>
      <li>Klicka på <em>Prenumerera &amp; spara 15&nbsp;%</em>.</li>
      <li>Välj om du vill ha leverans var 30:e eller var 60:e dag.</li>
      <li>Slutför köpet – sen sköter vi resten. Du kan pausa eller avsluta när du vill under Mitt konto.</li>
    </ol>
    ${btn(`Prenumerera på ${topProductName}`, url)}
    <p style="font-size:15px;line-height:1.7;color:#515151;margin:0 0 14px">
      Inget krångel, ingen bindningstid. Bara ett ärligare pris för dig som redan är med oss.
    </p>
    <p style="font-size:15px;line-height:1.7;color:#515151;margin:0">
      Hör gärna av dig om du undrar något.<br><br>
      / Christopher<br>
      <span style="color:#766a62">1753 SKINCARE</span>
    </p>
  `, unsubUrl);

  return { subject, html, url };
}

const PRICE = {
  "duo-kit": { name: "DUO-kit", list: 1099, sub: 934 },
  "duo-ta-da": { name: "DUO-kit + TA-DA Serum", list: 1495, sub: 1271 },
  "fungtastic-mushroom-extract": { name: "Fungtastic Mushroom Extract", list: 377, sub: 320 },
  "au-naturel-makeup-remover": { name: "Au Naturel Makeup Remover", list: 399, sub: 339 },
  "ta-da-serum": { name: "TA-DA Serum", list: 699, sub: 594 },
};

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const previewOnly = process.argv.includes("--preview");
  const fetch = (await import("node-fetch")).default;
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
      HAVING COUNT(*) >= 3
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
             SUM(COALESCE((i->>'quantity')::int, 1)) AS qty
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
      ORDER BY email, qty DESC
    )
    SELECT b.email, b.name, b.orders, s.id AS subscriber_id, s.unsubscribe_token,
           r.product_id AS top_product_id
    FROM buyers b
    JOIN subscribers s ON LOWER(s.email) = b.email
    LEFT JOIN product_subs ps ON ps.email = b.email
    LEFT JOIN ranked r ON r.email = b.email
    WHERE s.status = 'active'
      AND ps.email IS NULL
    ORDER BY b.orders DESC, b.email
  `);

  const toSend = targets.filter((t) => !EXCLUDE.has(t.email.toLowerCase()));
  console.log(`[SubInvite] ${toSend.length} mottagare (exkl. interna)${dryRun ? " [dry-run]" : ""}${previewOnly ? " [preview]" : ""}`);

  if (dryRun) {
    console.log(JSON.stringify(toSend.map((t) => ({ email: t.email, name: t.name, orders: t.orders })), null, 2));
    await db.pool.end();
    return;
  }

  const results = [];
  const sendList = previewOnly
    ? [{ ...toSend[0], email: "ch.genberg@gmail.com", name: toSend[0]?.name || "Christopher Genberg" }]
    : toSend;
  if (previewOnly && !toSend[0]) {
    console.log("[SubInvite] Ingen mottagare att förhandsvisa");
    await db.pool.end();
    return;
  }
  if (!resend) throw new Error("RESEND_API_KEY saknas");
  for (const t of sendList) {
    const pid = t.top_product_id && PRICE[t.top_product_id] ? t.top_product_id : "duo-kit";
    const p = PRICE[pid];
    const unsubUrl = `${apiBase}/api/newsletter/unsubscribe/${t.unsubscribe_token}`;
    const built = buildEmail({
      name: t.name,
      topProductId: pid,
      topProductName: p.name,
      orderCount: t.orders,
      subPrice: p.sub,
      listPrice: p.list,
      unsubUrl,
    });
    const subject = previewOnly ? `[PREVIEW] ${built.subject}` : built.subject;
    const html = built.html;

    try {
      const payload = { from: FROM, to: t.email, subject, html };
      if (!previewOnly && unsubUrl) {
        payload.headers = {
          "List-Unsubscribe": `<${unsubUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        };
      }
      const { data, error } = await resend.emails.send(payload);
      if (error) throw new Error(error.message || JSON.stringify(error));
      if (!previewOnly && t.subscriber_id) await db.touchSubscriberEmailed(t.subscriber_id);
      console.log(`[SubInvite] OK → ${t.email} (${firstName(t.name)}, ${p.name}) id=${data?.id || "?"}`);
      results.push({ email: t.email, ok: true, product: p.name, subject });
    } catch (err) {
      console.error(`[SubInvite] FEL → ${t.email}:`, err.message);
      results.push({ email: t.email, ok: false, error: err.message });
    }
  }

  const ok = results.filter((r) => r.ok).length;
  console.log(`[SubInvite] Klart: ${ok}/${results.length}`);
  console.log(JSON.stringify(results, null, 2));
  await db.pool.end();
  process.exit(ok === results.length ? 0 : 1);
}

main().catch(async (e) => {
  console.error(e);
  try { await db.pool.end(); } catch { /* */ }
  process.exit(1);
});
