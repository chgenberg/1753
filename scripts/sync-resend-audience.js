#!/usr/bin/env node
/**
 * sync-resend-audience.js
 *
 * Syncs all active subscribers from the database to a Resend Audience.
 * Uses controlled concurrency (3 parallel) with delay to stay under
 * Resend's 5 req/s rate limit. Retries on 429.
 */

require("dotenv").config();
const { Pool } = require("pg");
const { Resend } = require("resend");

const AUDIENCE_ID = "efd080df-d556-4b81-a6f4-bbece8017cb9";
const CONCURRENCY = 3;
const DELAY_BETWEEN_BATCHES_MS = 700;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});

const resend = new Resend(process.env.RESEND_API_KEY);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function createContact(sub, maxRetries = 4) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await resend.contacts.create({
        audienceId: AUDIENCE_ID,
        email: sub.email,
        firstName: sub.first_name || "",
        unsubscribed: false,
      });
      if (result.error) {
        if (result.error.statusCode === 429) {
          await sleep(attempt * 2000);
          continue;
        }
        return { ok: false, error: result.error.message };
      }
      return { ok: true };
    } catch (err) {
      if (attempt === maxRetries) return { ok: false, error: err.message };
      await sleep(attempt * 1000);
    }
  }
}

async function main() {
  console.log("=== Synka prenumeranter till Resend Audience ===\n");
  console.log(`Concurrency: ${CONCURRENCY} | Delay: ${DELAY_BETWEEN_BATCHES_MS}ms\n`);

  const { rows } = await pool.query(
    "SELECT email, first_name FROM subscribers WHERE status = 'active' ORDER BY id"
  );
  console.log(`Aktiva i databas: ${rows.length}`);

  const { data: existing } = await resend.contacts.list({ audienceId: AUDIENCE_ID });
  const existingEmails = new Set((existing?.data || []).map((c) => c.email?.toLowerCase()));
  console.log(`Redan i Resend:   ${existingEmails.size}`);

  const toSync = rows.filter((r) => !existingEmails.has(r.email.toLowerCase()));
  console.log(`Att synka:        ${toSync.length}\n`);

  if (toSync.length === 0) {
    console.log("Alla finns redan i Resend.");
    await pool.end();
    return;
  }

  const estMin = Math.ceil((toSync.length / CONCURRENCY * DELAY_BETWEEN_BATCHES_MS) / 60000);
  console.log(`Beraknad tid: ~${estMin} min\n`);

  let synced = 0;
  let errors = 0;
  const startTime = Date.now();

  for (let i = 0; i < toSync.length; i += CONCURRENCY) {
    const batch = toSync.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map((sub) => createContact(sub)));

    for (const r of results) {
      if (r.ok) synced++;
      else {
        errors++;
        if (errors <= 5) console.error(`\n  Fel: ${r.error}`);
      }
    }

    if ((i + CONCURRENCY) % 300 < CONCURRENCY || i + CONCURRENCY >= toSync.length) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const done = Math.min(i + CONCURRENCY, toSync.length);
      const pct = Math.round((done / toSync.length) * 100);
      const rate = (done / ((Date.now() - startTime) / 1000)).toFixed(1);
      process.stdout.write(`\r  ${done}/${toSync.length} (${pct}%) -- ${synced} ok, ${errors} fel -- ${elapsed}s (${rate}/s)`);
    }

    await sleep(DELAY_BETWEEN_BATCHES_MS);
  }

  console.log("\n\n--- Resultat ---");
  console.log(`Nya i Resend:     ${synced}`);
  console.log(`Fel:              ${errors}`);
  console.log(`Redan fanns:      ${existingEmails.size}`);
  console.log(`Totalt i databas: ${rows.length}`);
  console.log(`Tid: ${((Date.now() - startTime) / 60000).toFixed(1)} min`);

  await pool.end();
}

main().catch((err) => {
  console.error("Fel:", err);
  process.exit(1);
});
