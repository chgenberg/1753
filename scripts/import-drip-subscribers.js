#!/usr/bin/env node
/**
 * import-drip-subscribers.js
 *
 * Imports subscribers from a Drip CSV export into the subscribers table.
 * Handles active/unsubscribed status and deduplication (upsert).
 *
 * Usage:
 *   DATABASE_URL="postgres://..." node scripts/import-drip-subscribers.js path/to/drip-export.csv
 *   node scripts/import-drip-subscribers.js path/to/drip-export.csv  (uses .env)
 *
 * Expected CSV columns (Drip export format):
 *   email, first_name (or name), status, created_at, tags, ...
 *
 * The script auto-detects column names and handles common Drip formats.
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const db = require("../db");

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Användning: node scripts/import-drip-subscribers.js <drip-export.csv>");
  process.exit(1);
}

const fullPath = path.resolve(csvPath);
if (!fs.existsSync(fullPath)) {
  console.error(`Filen hittades inte: ${fullPath}`);
  process.exit(1);
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = (values[idx] || "").trim();
    });
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

function detectColumns(headers) {
  const emailCol = headers.find((h) => /^e-?mail/.test(h)) || "email";
  const nameCol = headers.find((h) => /first.?name/i.test(h))
    || headers.find((h) => /^name$/i.test(h))
    || "first_name";
  const statusCol = headers.find((h) => /status/i.test(h)) || "status";
  const tagsCol = headers.find((h) => /tags/i.test(h)) || "tags";

  return { emailCol, nameCol, statusCol, tagsCol };
}

async function main() {
  console.log("=== Drip-prenumerant-import ===\n");

  const text = fs.readFileSync(fullPath, "utf-8");
  const rows = parseCSV(text);
  console.log(`Läste ${rows.length} rader från ${path.basename(fullPath)}\n`);

  if (rows.length === 0) {
    console.log("Inga rader att importera.");
    process.exit(0);
  }

  const headers = Object.keys(rows[0]);
  const { emailCol, nameCol, statusCol, tagsCol } = detectColumns(headers);
  console.log(`Kolumner: email="${emailCol}", namn="${nameCol}", status="${statusCol}", taggar="${tagsCol}"\n`);

  let imported = 0;
  let skipped = 0;
  let unsubscribed = 0;
  let errors = 0;

  for (const row of rows) {
    const email = (row[emailCol] || "").toLowerCase().trim();
    if (!email || !email.includes("@")) {
      skipped++;
      continue;
    }

    const firstName = row[nameCol] || "";
    const status = (row[statusCol] || "active").toLowerCase();
    const isUnsubscribed = status.includes("unsub") || status.includes("removed") || status === "inactive";

    try {
      const unsubscribeToken = crypto.randomBytes(32).toString("hex");

      const existing = await db.findSubscriberByEmail(email);

      if (existing) {
        if (isUnsubscribed && existing.status === "active") {
          await db.unsubscribe(existing.unsubscribe_token);
          unsubscribed++;
        } else {
          skipped++;
        }
        continue;
      }

      await db.createSubscriber({
        email,
        firstName: firstName.split(" ")[0],
        source: "drip-import",
        unsubscribeToken,
      });

      if (isUnsubscribed) {
        const sub = await db.findSubscriberByEmail(email);
        if (sub) await db.unsubscribe(sub.unsubscribe_token);
        unsubscribed++;
      } else {
        imported++;
      }
    } catch (err) {
      console.error(`  Fel för ${email}: ${err.message}`);
      errors++;
    }
  }

  console.log("\n--- Resultat ---");
  console.log(`Importerade (aktiva): ${imported}`);
  console.log(`Avprenumererade:      ${unsubscribed}`);
  console.log(`Överhoppade:          ${skipped}`);
  console.log(`Fel:                  ${errors}`);
  console.log(`Totalt bearbetade:    ${rows.length}`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Fel:", err);
  process.exit(1);
});
