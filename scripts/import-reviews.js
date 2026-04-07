#!/usr/bin/env node
//
// Import Judge.me reviews from XLSX into PostgreSQL.
// Usage: node scripts/import-reviews.js [path-to-xlsx]
//
// Defaults to public/Reviews-export-2026.xlsx

require("dotenv").config();
const XLSX = require("xlsx");
const db = require("../db");

const HANDLE_MAP = {
  "facialoil":                         "duo-kit",
  "duo-kit-the-one-i-love-facial-oil": "duo-kit",
  "i-love-facial-oil":                 "duo-kit",
  "the-one-facial-oil":                "duo-kit",
  "duo-ta-da":                         "duo-ta-da",
  "ta-da-serum":                       "ta-da-serum",
  "makeup-remover-au-naturel":         "au-naturel-makeup-remover",
  "fungtastic-extract":                "fungtastic-mushroom-extract",
  "arets-cannabinoid-julpaket-2023":   "duo-ta-da",
  "arets-black-week-kampanj":          "duo-ta-da",
  "mellandagsrea-2024":                "duo-kit",
  "torr-hud":                          "duo-kit",
  "kanslig-paketet":                   "duo-kit",
  "rosacea-paketet":                   "duo-kit",
  "obalans-paketet":                   "duo-kit",
};

const DEFAULT_PRODUCT = "duo-kit";

async function main() {
  const filePath = process.argv[2] || "public/Reviews-export-2026.xlsx";

  console.log(`Reading ${filePath}...`);
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const allRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  const headers = allRows[0].map(h => String(h).trim().toLowerCase());
  const dataRows = allRows.slice(1);

  const col = {};
  headers.forEach((h, i) => { col[h] = i; });

  console.log(`Found ${dataRows.length} rows. Headers: ${headers.join(", ")}`);

  await db.initSchema();

  const existing = await db.countReviews();
  if (existing > 0) {
    console.log(`Database already has ${existing} reviews. Clearing and re-importing...`);
    await db.pool.query("DELETE FROM reviews");
  }

  const stats = {};
  let imported = 0;
  let skipped = 0;

  for (const row of dataRows) {
    const rating = parseInt(row[col["rating"]], 10);
    if (!rating || rating < 1 || rating > 5) { skipped++; continue; }

    const handle = String(row[col["product_handle"]] || "").trim().toLowerCase();
    const productId = HANDLE_MAP[handle] || (handle ? null : DEFAULT_PRODUCT);

    if (!productId) {
      skipped++;
      continue;
    }

    const reviewerName = String(row[col["reviewer_name"]] || "").trim();
    if (!reviewerName || reviewerName === "Customer") {
      // Anonymous, use first name initial
    }

    const title = String(row[col["title"]] || "").trim();
    const body = String(row[col["body"]] || "").trim();
    const reply = String(row[col["reply"]] || "").trim();
    const reviewDate = row[col["review_date"]] ? String(row[col["review_date"]]).trim() : null;
    const location = String(row[col["location"]] || "").trim()
      .replace(/, Sweden$/, "")
      .replace(/ County$/, "")
      .replace(/ County,/, ",");
    const curated = String(row[col["curated"]] || "").trim().toLowerCase();

    await db.createReview({
      product_id: productId,
      reviewer_name: reviewerName || "Anonym",
      rating,
      title,
      body,
      reply,
      verified: curated === "ok",
      review_date: reviewDate,
      location,
    });

    stats[productId] = (stats[productId] || 0) + 1;
    imported++;
  }

  console.log(`\nImport done!`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`\nPer product:`);
  for (const [id, count] of Object.entries(stats).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${id}: ${count}`);
  }

  await db.pool.end();
}

main().catch(err => {
  console.error("Import failed:", err);
  process.exit(1);
});
