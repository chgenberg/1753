#!/usr/bin/env node
/**
 * prepare-training-dataset.js
 *
 * Prepares a balanced training dataset for the skin classifier ONNX model.
 * Exports existing training uploads from the DB and organises them by condition.
 * Creates directory structure ready for PyTorch ImageFolder training.
 *
 * Usage:
 *   node scripts/prepare-training-dataset.js                    # export from DB
 *   node scripts/prepare-training-dataset.js --scrape-normal    # also download normal skin images
 *   node scripts/prepare-training-dataset.js --stats            # show stats only
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "..", "data", "training-dataset");

const TARGET_LABELS = [
  "acne", "dermatitis", "dryness", "eczema", "fungal",
  "hyperpigmentation", "psoriasis", "rosacea", "sun_damage", "normal"
];

const isStatsOnly = process.argv.includes("--stats");
const shouldScrapeNormal = process.argv.includes("--scrape-normal");

async function exportFromDB() {
  const db = require("../db");
  await db.initSchema();

  const stats = await db.getTrainingUploadStats();
  console.log("\n=== Training data stats ===");
  console.log(`Total uploads: ${stats.total}`);
  for (const c of stats.conditions) {
    console.log(`  ${c.top_condition}: ${c.count} (avg confidence: ${c.avg_confidence})`);
  }

  if (isStatsOnly) {
    process.exit(0);
  }

  for (const label of TARGET_LABELS) {
    const dir = path.join(OUTPUT_DIR, label);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  let offset = 0;
  const batchSize = 50;
  let totalExported = 0;

  while (true) {
    const rows = await db.exportTrainingUploads({ limit: batchSize, offset });
    if (rows.length === 0) break;

    for (const row of rows) {
      const condition = row.top_condition || "unknown";
      if (!TARGET_LABELS.includes(condition)) continue;

      const imageRow = await db.exportTrainingUploadImage(row.id);
      if (!imageRow?.image_data) continue;

      const base64Match = imageRow.image_data.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!base64Match) continue;

      const ext = base64Match[1] === "jpeg" ? "jpg" : base64Match[1];
      const buffer = Buffer.from(base64Match[2], "base64");
      const filename = `upload_${row.id}_${Math.round((row.confidence || 0) * 100)}.${ext}`;
      const filePath = path.join(OUTPUT_DIR, condition, filename);

      fs.writeFileSync(filePath, buffer);
      totalExported++;
    }

    offset += batchSize;
    process.stdout.write(`\r  Exported ${totalExported} images...`);
  }

  console.log(`\n  Done: ${totalExported} images exported to ${OUTPUT_DIR}`);
}

function showDatasetSummary() {
  console.log("\n=== Dataset summary ===");
  let total = 0;
  for (const label of TARGET_LABELS) {
    const dir = path.join(OUTPUT_DIR, label);
    const count = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)).length : 0;
    total += count;
    const bar = "#".repeat(Math.min(count, 50));
    console.log(`  ${label.padEnd(20)} ${String(count).padStart(5)} ${bar}`);
  }
  console.log(`  ${"TOTAL".padEnd(20)} ${String(total).padStart(5)}`);

  const normalCount = fs.existsSync(path.join(OUTPUT_DIR, "normal"))
    ? fs.readdirSync(path.join(OUTPUT_DIR, "normal")).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)).length
    : 0;

  if (normalCount < 100) {
    console.log(`\n  WARNING: Only ${normalCount} normal skin images.`);
    console.log("  For a balanced model, aim for at least 500 images per class.");
    console.log("  Run with --scrape-normal to download from open sources,");
    console.log("  or manually add face images of healthy skin to:");
    console.log(`  ${path.join(OUTPUT_DIR, "normal")}/`);
  }

  console.log("\n=== Next steps ===");
  console.log("  1. Balance the dataset (aim for ~500 images per class)");
  console.log("  2. Split into train/val (80/20)");
  console.log("  3. Retrain with: python scripts/train_skin_classifier.py");
  console.log("  4. Export to ONNX and replace frontend/public/models/skin_classifier_q8.onnx");
  console.log("  5. Update frontend/public/models/model_meta.json with 'normal' label");
}

async function main() {
  console.log("=== Skin classifier training dataset preparation ===");

  try {
    await exportFromDB();
  } catch (err) {
    console.log("\n  DB export skipped:", err.message);
  }

  if (shouldScrapeNormal) {
    console.log("\n=== Downloading normal skin references ===");
    console.log("  For copyright-safe normal skin images, use these open datasets:");
    console.log("  - FFHQ (Flickr-Faces-HQ): https://github.com/NVlabs/ffhq-dataset");
    console.log("  - CelebA: https://mmlab.ie.cuhk.edu.hk/projects/CelebA.html");
    console.log("  - UTKFace: https://susanqq.github.io/UTKFace/");
    console.log("");
    console.log("  Download face images and place in:");
    console.log(`  ${path.join(OUTPUT_DIR, "normal")}/`);
    console.log("");
    console.log("  These datasets contain diverse faces with normal/healthy skin");
    console.log("  that can be used as the 'normal' class for retraining.");
  }

  showDatasetSummary();
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
