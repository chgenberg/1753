// outreach/seed-reviews.js
//
// Fyller recensionskampanjens kö: kunder med en BETALD order 14-45 dagar gammal
// (2 veckor - 1,5 månad sedan). En kontakt per e-post (senaste ordern i fönstret).
// Exkluderar avprenumeranter och dem som redan ligger i kampanjen 'recension'.
//
//   node outreach/seed-reviews.js            (dry-run: visar bara antal + exempel)
//   node outreach/seed-reviews.js --apply    (skriver kontakter till kön)
//   node outreach/seed-reviews.js --enable    (öppnar kampanjen: paused=false, cap=20)
//
// DATABASE_URL måste vara satt.

const db = require("../db");

// Giltiga produkt-id:n som har en produktsida med omdömen.
const REVIEW_PRODUCT_IDS = new Set([
  "duo-ta-da",
  "ta-da-serum",
  "duo-kit",
  "au-naturel-makeup-remover",
  "fungtastic-mushroom-extract",
]);

function productsFromItems(items) {
  let arr = [];
  try { arr = Array.isArray(items) ? items : JSON.parse(items || "[]"); } catch (_) { arr = []; }
  const seen = new Set();
  const out = [];
  for (const it of arr) {
    const id = it && (it.productId || it.id);
    const name = it && it.name;
    if (!id || !name) continue;
    if (!REVIEW_PRODUCT_IDS.has(id)) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ id, name });
  }
  return out;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const enable = process.argv.includes("--enable");

  if (enable) {
    const s = await db.updateReviewSettings({ paused: false, autonomous: true, daily_cap: 20 });
    console.log("Recensionskampanjen ÖPPNAD:", { paused: s.paused, daily_cap: s.daily_cap, autonomous: s.autonomous });
    await db.pool.end();
    return;
  }

  // 1) Senaste betalda ordern per e-post i fönstret 14-45 dagar.
  const { rows: candidates } = await db.pool.query(`
    SELECT DISTINCT ON (LOWER(o.customer_email))
      o.customer_email AS email, o.customer_name AS name,
      COALESCE(o.locale,'sv') AS locale, o.order_number, o.items,
      o.created_at::date AS bought_at
    FROM orders o
    WHERE o.payment_status = 'paid'
      AND o.created_at <= NOW() - INTERVAL '14 days'
      AND o.created_at >= NOW() - INTERVAL '45 days'
    ORDER BY LOWER(o.customer_email), o.created_at DESC
  `);

  // 2) Avprenumeranter (exkluderas helt).
  const { rows: unsubRows } = await db.pool.query(
    "SELECT LOWER(email) AS email FROM subscribers WHERE status = 'unsubscribed'"
  );
  const unsub = new Set(unsubRows.map(r => r.email));

  // 3) Redan i kampanjen 'recension'.
  const { rows: existRows } = await db.pool.query(
    "SELECT LOWER(email) AS email FROM outreach_contacts WHERE campaign = 'recension'"
  );
  const already = new Set(existRows.map(r => r.email));

  let eligible = 0, skippedUnsub = 0, skippedExisting = 0, skippedNoProduct = 0;
  const toEnqueue = [];
  for (const c of candidates) {
    const email = String(c.email || "").toLowerCase().trim();
    if (!email) continue;
    if (unsub.has(email)) { skippedUnsub++; continue; }
    if (already.has(email)) { skippedExisting++; continue; }
    const products = productsFromItems(c.items);
    if (!products.length) { skippedNoProduct++; continue; }
    eligible++;
    toEnqueue.push({
      email,
      name: c.name || "",
      locale: ["sv","en","es","de","fr"].includes(c.locale) ? c.locale : "sv",
      contextSummary: JSON.stringify({
        orderNumber: c.order_number,
        products,
        boughtAt: c.bought_at instanceof Date ? c.bought_at.toISOString().slice(0,10) : String(c.bought_at),
      }),
    });
  }

  console.log("KANDIDATER (senaste betalda order/e-post, 14-45 d):", candidates.length);
  console.log("  - avprenumererade (exkl):", skippedUnsub);
  console.log("  - redan i kampanjen (exkl):", skippedExisting);
  console.log("  - ingen giltig recensionsprodukt (exkl):", skippedNoProduct);
  console.log("ATT LÄGGA TILL:", eligible);
  if (toEnqueue[0]) {
    const ex = toEnqueue[0];
    console.log("EXEMPEL:", { email: ex.email.replace(/(.{2}).*(@.*)/, "$1***$2"), name: ex.name, locale: ex.locale, context: ex.contextSummary });
  }

  if (!apply) {
    console.log("\n(dry-run – kör med --apply för att skriva till kön)");
    await db.pool.end();
    return;
  }

  let created = 0, existed = 0;
  for (const c of toEnqueue) {
    const { contact, created: wasNew } = await db.enqueueOutreachContact({
      email: c.email,
      name: c.name,
      segment: "review",
      locale: c.locale,
      campaign: "recension",
      contextSummary: c.contextSummary,
    });
    if (wasNew) created++; else existed++;
    void contact;
  }
  console.log(`\nKLART. Skapade ${created} nya kontakter, ${existed} fanns redan.`);
  await db.pool.end();
}

main().catch(err => { console.error("FEL:", err.message); process.exit(1); });
