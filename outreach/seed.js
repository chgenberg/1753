// outreach/seed.js
//
// Seedar kö-listan för den autonoma mejlagenten från befintlig kunddata.
// Bulk-version: läser all relevant data i några få queries och klassificerar
// i minnet med EXAKT samma regler som outreach/segment.js (live-agenten).
// Skickar INGET – agenten styrs av outreach_settings.paused (default true).
//
// Körning:  node outreach/seed.js "<DATABASE_URL>" [--limit=N] [--dry]
//
// Endast additivt: skapar outreach-tabellerna (IF NOT EXISTS) och INSERT:ar i
// outreach_contacts (ON CONFLICT DO NOTHING). Rör inga befintliga tabeller.

const crypto = require("crypto");

const args = process.argv.slice(2);
const conn = args.find((a) => a.startsWith("postgres"));
if (conn) process.env.DATABASE_URL = conn;
const dry = args.includes("--dry");
const limitArg = args.find((a) => a.startsWith("--limit="));
const LIMIT = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;

const db = require("../db");

async function ensureTables() {
  await db.pool.query(`
    CREATE TABLE IF NOT EXISTS outreach_contacts (
      id               SERIAL PRIMARY KEY,
      email            VARCHAR(255) NOT NULL,
      name             VARCHAR(255) DEFAULT '',
      segment          VARCHAR(32) DEFAULT 'newsletter',
      locale           VARCHAR(5) DEFAULT 'sv',
      status           VARCHAR(24) DEFAULT 'queued',
      reply_token      VARCHAR(64) UNIQUE NOT NULL,
      context_summary  TEXT DEFAULT '',
      campaign         VARCHAR(64) DEFAULT '',
      bought_duo_tada  BOOLEAN DEFAULT false,
      auto_replies     INTEGER DEFAULT 0,
      next_action_at   TIMESTAMPTZ,
      last_inbound_at  TIMESTAMPTZ,
      last_outbound_at TIMESTAMPTZ,
      last_error       TEXT DEFAULT '',
      created_at       TIMESTAMPTZ DEFAULT NOW(),
      updated_at       TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_outreach_contacts_email_campaign
      ON outreach_contacts (LOWER(email), campaign);
    CREATE INDEX IF NOT EXISTS idx_outreach_contacts_status
      ON outreach_contacts (status, next_action_at);

    CREATE TABLE IF NOT EXISTS outreach_messages (
      id            SERIAL PRIMARY KEY,
      contact_id    INTEGER REFERENCES outreach_contacts(id) ON DELETE CASCADE,
      direction     VARCHAR(10) NOT NULL,
      subject       TEXT DEFAULT '',
      body          TEXT DEFAULT '',
      from_email    VARCHAR(255) DEFAULT '',
      to_email      VARCHAR(255) DEFAULT '',
      provider_id   VARCHAR(255) DEFAULT '',
      status        VARCHAR(20) DEFAULT 'sent',
      first_touch   BOOLEAN DEFAULT false,
      intent        VARCHAR(40) DEFAULT '',
      scheduled_at  TIMESTAMPTZ,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      sent_at       TIMESTAMPTZ
    );
    CREATE INDEX IF NOT EXISTS idx_outreach_messages_contact
      ON outreach_messages (contact_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_outreach_messages_scheduled
      ON outreach_messages (status, scheduled_at);

    CREATE TABLE IF NOT EXISTS outreach_settings (
      id              VARCHAR(20) PRIMARY KEY DEFAULT 'default',
      paused          BOOLEAN DEFAULT true,
      autonomous      BOOLEAN DEFAULT true,
      daily_cap       INTEGER DEFAULT 15,
      from_name       VARCHAR(120) DEFAULT 'Christopher Genberg',
      from_email      VARCHAR(255) DEFAULT '',
      reply_email     VARCHAR(255) DEFAULT '',
      handoff_emails  JSONB DEFAULT '[]',
      campaign        VARCHAR(64) DEFAULT 'sparre',
      updated_at      TIMESTAMPTZ DEFAULT NOW()
    );
    INSERT INTO outreach_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;
  `);
}

// Speglar orderMentionsDuoTada() i outreach/segment.js
function itemsMentionDuoTada(items) {
  try {
    const blob = JSON.stringify(items || "").toLowerCase();
    return blob.includes("duo-ta-da") || blob.includes("duo+ta-da") || blob.includes('"4004"');
  } catch (_) {
    return false;
  }
}

async function loadData() {
  const paidMap = new Map();   // email -> { count, duo }
  const analysisSet = new Set();
  const subMap = new Map();    // email -> { firstName, locale, status }
  const userMap = new Map();   // email -> { name, locale }

  const paid = await db.pool.query(
    `SELECT LOWER(customer_email) AS email, items
       FROM orders
      WHERE payment_status='paid' AND customer_email IS NOT NULL AND customer_email <> ''`
  );
  for (const r of paid.rows) {
    const e = r.email.trim();
    if (!e) continue;
    const cur = paidMap.get(e) || { count: 0, duo: false };
    cur.count += 1;
    if (itemsMentionDuoTada(r.items)) cur.duo = true;
    paidMap.set(e, cur);
  }

  const anaDirect = await db.pool.query(
    `SELECT DISTINCT LOWER(email) AS email FROM skin_analyses
      WHERE email IS NOT NULL AND email <> ''`
  );
  for (const r of anaDirect.rows) if (r.email) analysisSet.add(r.email.trim());

  const anaUser = await db.pool.query(
    `SELECT DISTINCT LOWER(u.email) AS email
       FROM skin_analyses sa JOIN users u ON u.id = sa.user_id
      WHERE u.email IS NOT NULL AND u.email <> ''`
  );
  for (const r of anaUser.rows) if (r.email) analysisSet.add(r.email.trim());

  const subs = await db.pool.query(
    `SELECT LOWER(email) AS email, first_name, locale, status FROM subscribers
      WHERE email IS NOT NULL AND email <> ''`
  );
  for (const r of subs.rows) {
    subMap.set(r.email.trim(), { firstName: r.first_name || "", locale: r.locale || "", status: r.status || "" });
  }

  const users = await db.pool.query(
    `SELECT LOWER(email) AS email, name, locale FROM users
      WHERE email IS NOT NULL AND email <> ''`
  );
  for (const r of users.rows) {
    userMap.set(r.email.trim(), { name: r.name || "", locale: r.locale || "" });
  }

  return { paidMap, analysisSet, subMap, userMap };
}

// Speglar buildContactContext() i outreach/segment.js
function classify(email, { paidMap, analysisSet, subMap, userMap }) {
  const sub = subMap.get(email);
  const user = userMap.get(email);
  const paid = paidMap.get(email);

  const suppressed = !!(sub && sub.status === "unsubscribed");
  const hasPaid = !!(paid && paid.count > 0);
  const boughtDuoTada = !!(paid && paid.duo);
  const hasAnalysis = analysisSet.has(email);

  let segment;
  if (boughtDuoTada) segment = "buyer_duotada";
  else if (hasPaid) segment = "buyer_other";
  else if (hasAnalysis) segment = "analysis";
  else segment = "newsletter";

  const name = (user?.name || sub?.firstName || "").trim();
  const locale = user?.locale || sub?.locale || "sv";

  const facts = [];
  if (hasPaid) facts.push(`Har handlat hos oss (${paid.count} betald order).`);
  if (boughtDuoTada) facts.push("Har köpt DUO-kit + TA-DA Serum.");
  if (hasAnalysis) facts.push("Har gjort hudanalysen.");
  if (sub && sub.status === "active") facts.push("Prenumererar på nyhetsbrevet.");
  if (!facts.length) facts.push("Vi har ingen tidigare köp- eller analyshistorik registrerad.");

  return { email, name, locale, segment, boughtDuoTada, suppressed, contextSummary: facts.join(" ") };
}

async function insertBatch(rows, campaign) {
  if (!rows.length) return 0;
  const cols = ["email", "name", "segment", "locale", "campaign", "bought_duo_tada", "context_summary", "reply_token", "status"];
  const values = [];
  const tuples = rows.map((r, i) => {
    const b = i * 8;
    values.push(r.email, r.name, r.segment, r.locale, campaign, r.boughtDuoTada, r.contextSummary, crypto.randomBytes(16).toString("hex"));
    return `($${b + 1},$${b + 2},$${b + 3},$${b + 4},$${b + 5},$${b + 6},$${b + 7},$${b + 8},'queued')`;
  });
  const res = await db.pool.query(
    `INSERT INTO outreach_contacts (${cols.join(",")}) VALUES ${tuples.join(",")}
     ON CONFLICT (LOWER(email), campaign) DO NOTHING
     RETURNING id`,
    values
  );
  return res.rowCount;
}

(async () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL saknas (skicka som första argument).");
    process.exit(1);
  }
  await ensureTables();

  const settings = await db.getOutreachSettings();
  const campaign = settings?.campaign || "sparre";

  console.log("Laddar kunddata (bulk)...");
  const data = await loadData();

  const candidates = new Set();
  for (const e of data.paidMap.keys()) candidates.add(e);
  for (const e of data.analysisSet) candidates.add(e);
  for (const [e, s] of data.subMap) if (s.status === "active") candidates.add(e);

  const all = [...candidates].filter((e) => e && e.includes("@"));

  // Sänd-ordning = insättningsordning (agenten plockar äldsta queued först).
  // Relationsprioritet: engagerade/varma kontakter först, breda nyhetsbrevet sist.
  const SEGMENT_PRIORITY = { analysis: 0, buyer_other: 1, buyer_duotada: 2, newsletter: 3 };
  const ordered = all
    .map((email) => ({ email, c: classify(email, data) }))
    .filter((x) => !x.c.suppressed)
    .sort((a, b) => {
      const pa = SEGMENT_PRIORITY[a.c.segment] ?? 9;
      const pb = SEGMENT_PRIORITY[b.c.segment] ?? 9;
      if (pa !== pb) return pa - pb;
      return Math.random() - 0.5; // blanda inom segment (särskilt nyhetsbrevet)
    })
    .map((x) => x.email);

  const targets = LIMIT !== Infinity ? ordered.slice(0, LIMIT) : ordered;

  console.log(`Köpare (unika paid-emails): ${data.paidMap.size}`);
  console.log(`Hudanalys (unika emails): ${data.analysisSet.size}`);
  console.log(`Prenumeranter totalt: ${data.subMap.size}`);
  console.log(`Unika kandidater: ${all.length}${LIMIT !== Infinity ? ` (begränsar till ${targets.length})` : ""}`);
  console.log(`Kampanj: ${campaign} | Paused: ${settings?.paused} | Dry-run: ${dry}\n`);

  const tally = { queued: 0, suppressed: all.length - ordered.length, existing: 0 };
  const bySegment = {};
  const toInsert = [];

  for (const email of targets) {
    const c = classify(email, data);
    bySegment[c.segment] = (bySegment[c.segment] || 0) + 1;
    toInsert.push(c);
  }

  if (dry) {
    tally.queued = toInsert.length;
  } else {
    const BATCH = 500;
    for (let i = 0; i < toInsert.length; i += BATCH) {
      const slice = toInsert.slice(i, i + BATCH);
      const inserted = await insertBatch(slice, campaign);
      tally.queued += inserted;
      tally.existing += slice.length - inserted;
      console.log(`  ...${Math.min(i + BATCH, toInsert.length)}/${toInsert.length} (köade hittills: ${tally.queued})`);
    }
  }

  console.log("\n===== SEED KLAR =====");
  console.log(`Köade (nya): ${tally.queued}`);
  console.log(`Fanns redan: ${tally.existing}`);
  console.log(`Avprenumererade (hoppade): ${tally.suppressed}`);
  console.log(`Per segment (av behandlade): ${JSON.stringify(bySegment)}`);
  console.log(`\nAgenten är ${settings?.paused ? "PAUSAD" : "LIVE"} – inget skickas förrän paused=false i admin.`);

  await db.pool.end();
  process.exit(0);
})().catch(async (err) => {
  console.error("SEED FEL:", err.message);
  try { await db.pool.end(); } catch (_) {}
  process.exit(1);
});
