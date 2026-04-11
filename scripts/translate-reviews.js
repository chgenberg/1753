#!/usr/bin/env node
/**
 * Translates all Swedish reviews to English using OpenAI.
 * Adds title_en, body_en, reply_en to the reviews table.
 *
 * Usage:
 *   DATABASE_URL=... OPENAI_API_KEY=... node scripts/translate-reviews.js
 *
 * Or via Railway:
 *   railway run node scripts/translate-reviews.js
 */

require("dotenv").config();
const { Pool } = require("pg");

const DATABASE_URL = process.env.DATABASE_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BATCH_SIZE = 20;
const MODEL = "gpt-4o-mini";

if (!DATABASE_URL) { console.error("Missing DATABASE_URL"); process.exit(1); }
if (!OPENAI_API_KEY) { console.error("Missing OPENAI_API_KEY"); process.exit(1); }

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
});

async function translateBatch(reviews) {
  const items = reviews.map((r) => ({
    id: r.id,
    title: r.title || "",
    body: r.body || "",
    reply: r.reply || "",
  }));

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You translate Swedish skincare product reviews into natural, warm English.
Keep the reviewer's personal tone and emotion. Do not over-polish — these are real customer voices.
Keep brand names (1753 SKINCARE, The ONE, I LOVE, TA-DA, DUO, Au Naturel, Fungtastic) exactly as-is.
Swedish place names (e.g. "Skellefteå", "Hägersten") stay unchanged.
For company replies: keep the warm, personal customer-service tone. "<3" can stay as-is.
If a field is empty, return an empty string.
Return a JSON object: { "translations": [ { "id": <number>, "title_en": "...", "body_en": "...", "reply_en": "..." }, ... ] }`,
        },
        {
          role: "user",
          content: JSON.stringify(items),
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const content = data.choices[0].message.content;
  const parsed = JSON.parse(content);
  return parsed.translations;
}

async function updateReview(id, titleEn, bodyEn, replyEn) {
  await pool.query(
    `UPDATE reviews SET title_en = $1, body_en = $2, reply_en = $3 WHERE id = $4`,
    [titleEn || "", bodyEn || "", replyEn || "", id]
  );
}

async function main() {
  // Ensure columns exist
  await pool.query(`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS title_en VARCHAR(500) DEFAULT ''`);
  await pool.query(`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS body_en TEXT DEFAULT ''`);
  await pool.query(`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply_en TEXT DEFAULT ''`);

  const { rows: allReviews } = await pool.query(
    `SELECT id, title, body, reply FROM reviews
     WHERE (title_en IS NULL OR title_en = '') AND (COALESCE(title,'') != '' OR COALESCE(body,'') != '')
     ORDER BY id`
  );

  console.log(`Found ${allReviews.length} reviews to translate`);

  let translated = 0;
  let errors = 0;

  for (let i = 0; i < allReviews.length; i += BATCH_SIZE) {
    const batch = allReviews.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allReviews.length / BATCH_SIZE);

    try {
      const translations = await translateBatch(batch);

      for (const t of translations) {
        await updateReview(t.id, t.title_en, t.body_en, t.reply_en);
        translated++;
      }

      console.log(`Batch ${batchNum}/${totalBatches} done (${translated}/${allReviews.length})`);
    } catch (err) {
      console.error(`Batch ${batchNum} failed:`, err.message);
      errors++;

      // Retry individually
      for (const review of batch) {
        try {
          const [t] = await translateBatch([review]);
          await updateReview(t.id, t.title_en, t.body_en, t.reply_en);
          translated++;
        } catch (e2) {
          console.error(`  Review ${review.id} failed:`, e2.message);
          errors++;
        }
      }
    }

    // Rate limit: ~50ms between batches
    if (i + BATCH_SIZE < allReviews.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  console.log(`\nDone! Translated: ${translated}, Errors: ${errors}`);
  await pool.end();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
