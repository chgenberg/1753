#!/usr/bin/env node
/**
 * Translates all Swedish reviews to English, Spanish, German, and French
 * using GPT-4o-mini. All 4 languages in a single API call per batch = cost-effective.
 *
 * Cost: ~$0.0003 per review (all 4 languages), ~$0.30 for 1000 reviews.
 *
 * Usage:
 *   DATABASE_URL=... OPENAI_API_KEY=... node scripts/translate-reviews.js
 *   node scripts/translate-reviews.js --lang es        # only Spanish
 *   node scripts/translate-reviews.js --retranslate     # redo all
 */

require("dotenv").config();
const { Pool } = require("pg");

const DATABASE_URL = process.env.DATABASE_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BATCH_SIZE = 15;
const MODEL = "gpt-5.4-mini";

const LANGUAGES = {
  en: { name: "English", col_prefix: "en" },
  es: { name: "Spanish", col_prefix: "es" },
  de: { name: "German", col_prefix: "de" },
  fr: { name: "French", col_prefix: "fr" },
};

if (!DATABASE_URL) { console.error("Missing DATABASE_URL"); process.exit(1); }
if (!OPENAI_API_KEY) { console.error("Missing OPENAI_API_KEY"); process.exit(1); }

const args = process.argv.slice(2);
const langFilter = args.includes("--lang") ? args[args.indexOf("--lang") + 1] : null;
const retranslate = args.includes("--retranslate");

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
});

const targetLangs = langFilter
  ? { [langFilter]: LANGUAGES[langFilter] }
  : LANGUAGES;

async function translateBatch(reviews, langs) {
  const items = reviews.map((r) => ({
    id: r.id,
    title: r.title || "",
    body: r.body || "",
    reply: r.reply || "",
  }));

  const langList = Object.entries(langs)
    .map(([code, info]) => `${info.name} (suffix: _${code})`)
    .join(", ");

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
          content: `You translate Swedish skincare product reviews into multiple languages in one pass.
Target languages: ${langList}.

Keep the reviewer's personal tone and emotion. Do not over-polish — these are real customer voices.
Brand names stay exactly as-is: 1753 SKINCARE, The ONE, I LOVE, TA-DA, DUO, Au Naturel, Fungtastic.
Swedish place names (e.g. "Skellefteå", "Hägersten") stay unchanged.
For company replies: keep the warm, personal customer-service tone. "<3" can stay as-is.
If a field is empty, return an empty string for that field.

Return JSON: { "translations": [ { "id": <number>, "title_en": "...", "body_en": "...", "reply_en": "...", "title_es": "...", "body_es": "...", "reply_es": "...", "title_de": "...", "body_de": "...", "reply_de": "...", "title_fr": "...", "body_fr": "...", "reply_fr": "..." }, ... ] }
Only include the language suffixes you were asked to translate.`,
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
  return JSON.parse(content).translations;
}

async function updateReview(id, fields) {
  const sets = [];
  const vals = [];
  let idx = 1;
  for (const [key, val] of Object.entries(fields)) {
    sets.push(`${key} = $${idx++}`);
    vals.push(val || "");
  }
  vals.push(id);
  await pool.query(`UPDATE reviews SET ${sets.join(", ")} WHERE id = $${idx}`, vals);
}

async function main() {
  for (const code of Object.keys(targetLangs)) {
    await pool.query(`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS title_${code} VARCHAR(500) DEFAULT ''`);
    await pool.query(`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS body_${code} TEXT DEFAULT ''`);
    await pool.query(`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply_${code} TEXT DEFAULT ''`);
  }

  const langCodes = Object.keys(targetLangs);
  const emptyConditions = retranslate
    ? "TRUE"
    : langCodes.map((c) => `(COALESCE(title_${c},'') = '' AND COALESCE(body_${c},'') = '')`).join(" OR ");

  const { rows: allReviews } = await pool.query(
    `SELECT id, title, body, reply FROM reviews
     WHERE (COALESCE(title,'') != '' OR COALESCE(body,'') != '')
       AND (${emptyConditions})
     ORDER BY id`
  );

  console.log(`\n  REVIEW TRANSLATOR — ${langCodes.map(c => targetLangs[c].name).join(", ")}`);
  console.log(`  Found ${allReviews.length} reviews to translate`);
  console.log(`  Model: ${MODEL} | Batch size: ${BATCH_SIZE}\n`);

  let translated = 0;
  let errors = 0;

  for (let i = 0; i < allReviews.length; i += BATCH_SIZE) {
    const batch = allReviews.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allReviews.length / BATCH_SIZE);

    try {
      const translations = await translateBatch(batch, targetLangs);

      for (const t of translations) {
        const fields = {};
        for (const code of langCodes) {
          if (t[`title_${code}`] !== undefined) fields[`title_${code}`] = t[`title_${code}`];
          if (t[`body_${code}`] !== undefined) fields[`body_${code}`] = t[`body_${code}`];
          if (t[`reply_${code}`] !== undefined) fields[`reply_${code}`] = t[`reply_${code}`];
        }
        if (Object.keys(fields).length > 0) {
          await updateReview(t.id, fields);
          translated++;
        }
      }

      console.log(`  Batch ${batchNum}/${totalBatches} done (${translated}/${allReviews.length})`);
    } catch (err) {
      console.error(`  Batch ${batchNum} failed:`, err.message);
      errors++;

      for (const review of batch) {
        try {
          const [t] = await translateBatch([review], targetLangs);
          const fields = {};
          for (const code of langCodes) {
            if (t[`title_${code}`] !== undefined) fields[`title_${code}`] = t[`title_${code}`];
            if (t[`body_${code}`] !== undefined) fields[`body_${code}`] = t[`body_${code}`];
            if (t[`reply_${code}`] !== undefined) fields[`reply_${code}`] = t[`reply_${code}`];
          }
          if (Object.keys(fields).length > 0) {
            await updateReview(t.id, fields);
            translated++;
          }
        } catch (e2) {
          console.error(`    Review ${review.id} failed:`, e2.message);
          errors++;
        }
      }
    }

    if (i + BATCH_SIZE < allReviews.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  console.log(`\n  Done! Translated: ${translated}, Errors: ${errors}`);
  await pool.end();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
