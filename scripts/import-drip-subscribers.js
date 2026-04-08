#!/usr/bin/env node
/**
 * import-drip-subscribers.js
 *
 * Batch-imports subscribers from a Drip CSV export into the subscribers table.
 * Uses multi-row INSERT with ON CONFLICT for speed (~12k rows in seconds).
 *
 * Usage:
 *   DATABASE_URL="postgres://..." node scripts/import-drip-subscribers.js path/to/drip-export.csv
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Pool } = require("pg");

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

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});

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

async function main() {
  console.log("=== Drip-prenumerant-import (batch) ===\n");

  const text = fs.readFileSync(fullPath, "utf-8");
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) {
    console.log("Inga rader att importera.");
    process.exit(0);
  }

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
  const emailIdx = headers.indexOf("email");
  const nameIdx = headers.findIndex((h) => /first.?name/i.test(h));
  const statusIdx = headers.indexOf("status");

  console.log(`Rader: ${lines.length - 1}`);
  console.log(`Kolumner: email=${emailIdx}, first_name=${nameIdx}, status=${statusIdx}\n`);

  const rows = [];
  let skippedNoEmail = 0;

  for (let i = 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i]);
    const email = (vals[emailIdx] || "").toLowerCase().trim();
    if (!email || !email.includes("@")) {
      skippedNoEmail++;
      continue;
    }

    const firstName = nameIdx >= 0 ? (vals[nameIdx] || "").trim().split(" ")[0] : "";
    const rawStatus = (vals[statusIdx] || "active").toLowerCase();
    const isUnsub = rawStatus.includes("unsub") || rawStatus.includes("removed") || rawStatus === "inactive";

    rows.push({
      email,
      first_name: firstName,
      status: isUnsub ? "unsubscribed" : "active",
      source: "drip-import",
      unsubscribe_token: crypto.randomBytes(32).toString("hex"),
    });
  }

  console.log(`Giltiga e-poster: ${rows.length}`);
  console.log(`Utan e-post (hoppades over): ${skippedNoEmail}\n`);

  const BATCH_SIZE = 500;
  let inserted = 0;
  let unchanged = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    const values = [];
    const params = [];
    let paramIdx = 1;

    for (const row of batch) {
      values.push(`($${paramIdx}, $${paramIdx + 1}, $${paramIdx + 2}, $${paramIdx + 3}, $${paramIdx + 4})`);
      params.push(row.email, row.first_name, row.status, row.source, row.unsubscribe_token);
      paramIdx += 5;
    }

    const sql = `
      INSERT INTO subscribers (email, first_name, status, source, unsubscribe_token)
      VALUES ${values.join(", ")}
      ON CONFLICT (email) DO NOTHING
    `;

    const result = await pool.query(sql, params);
    inserted += result.rowCount;
    unchanged += batch.length - result.rowCount;

    const pct = Math.min(100, Math.round(((i + batch.length) / rows.length) * 100));
    process.stdout.write(`\r  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(rows.length / BATCH_SIZE)} — ${pct}% klar`);
  }

  console.log("\n\n--- Resultat ---");
  console.log(`Nya prenumeranter:    ${inserted}`);
  console.log(`Redan existerande:    ${unchanged}`);
  console.log(`Utan e-post:          ${skippedNoEmail}`);
  console.log(`Totalt i CSV:         ${lines.length - 1}`);

  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Fel:", err);
  process.exit(1);
});
