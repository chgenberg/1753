/**
 * Generate and schedule a full week of social media posts via Publer.
 * Usage: node scripts/schedule-week.js
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const https = require("https");
const { generatePost, PRODUCTS } = require("./social-media-generator");

const PUBLER_API_KEY = process.env.PUBLER_API_KEY;
const PUBLER_WORKSPACE_ID = process.env.PUBLER_WORKSPACE_ID;

const WEEK_PLAN = [
  { date: "2026-04-13", type: "product",   product: "TheONE",     label: "Son 13/4 – The ONE" },
  { date: "2026-04-14", type: "lifestyle",  product: "ILOVE",      label: "Mon 14/4 – I LOVE lifestyle" },
  { date: "2026-04-15", type: "mood",       product: null,         label: "Tis 15/4 – Stamningsbild" },
  { date: "2026-04-16", type: "product",   product: "TA-DA",      label: "Ons 16/4 – TA-DA" },
  { date: "2026-04-17", type: "lifestyle",  product: "Fungtastic", label: "Tor 17/4 – Fungtastic lifestyle" },
  { date: "2026-04-18", type: "product",   product: "DUO",        label: "Fre 18/4 – DUO-kit" },
  { date: "2026-04-19", type: "mood",       product: null,         label: "Lor 19/4 – Stamningsbild" },
  { date: "2026-04-20", type: "product",   product: "MR",         label: "Son 20/4 – Makeup Remover" },
];

async function fetchJSON(url, options = {}) {
  const fetch = (await import("node-fetch")).default;
  const res = await fetch(url, options);
  return res.json();
}

async function publerHeaders() {
  return {
    Authorization: `Bearer-API ${PUBLER_API_KEY}`,
    "Publer-Workspace-Id": PUBLER_WORKSPACE_ID,
  };
}

async function uploadToPubler(imagePath) {
  const fetch = (await import("node-fetch")).default;
  const FormData = (await import("form-data")).default;
  const headers = await publerHeaders();
  const form = new FormData();
  form.append("file", fs.createReadStream(imagePath));
  const res = await fetch("https://app.publer.com/api/v1/media", {
    method: "POST",
    headers: { ...headers, ...form.getHeaders() },
    body: form,
  });
  return res.json();
}

async function scheduleToPubler({ mediaId, captionIG, captionLI, scheduledAt, accounts }) {
  const headers = await publerHeaders();
  const networks = {};
  for (const acc of accounts) {
    const text = acc.provider === "linkedin" ? captionLI : captionIG;
    networks[acc.provider] = {
      type: "photo",
      text,
      media: [{ id: mediaId, type: "image" }],
    };
  }

  const accountsList = accounts.map((a) => ({
    id: a.id,
    scheduled_at: scheduledAt,
  }));

  const payload = {
    bulk: {
      state: "scheduled",
      posts: [{ networks, accounts: accountsList }],
    },
  };

  return fetchJSON("https://app.publer.com/api/v1/posts/schedule", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function main() {
  if (!PUBLER_API_KEY || !PUBLER_WORKSPACE_ID) {
    console.error("PUBLER_API_KEY and PUBLER_WORKSPACE_ID required");
    process.exit(1);
  }
  if (!process.env.FAL_KEY && !process.env.GEMINI_API_KEY) {
    console.error("FAL_KEY or GEMINI_API_KEY required for image generation");
    process.exit(1);
  }

  const headers = await publerHeaders();
  const accountsData = await fetchJSON("https://app.publer.com/api/v1/accounts", { headers });
  const accounts = accountsData.filter((a) =>
    ["facebook", "instagram", "linkedin"].includes(a.provider)
  );
  console.log(`Connected accounts: ${accounts.map((a) => `${a.name} (${a.provider})`).join(", ")}\n`);

  const results = [];

  for (let i = 0; i < WEEK_PLAN.length; i++) {
    const plan = WEEK_PLAN[i];
    const scheduledAt = `${plan.date}T08:00:00.000Z`; // 10:00 CET = 08:00 UTC

    console.log(`\n[${ i + 1}/${WEEK_PLAN.length}] ${plan.label}`);
    console.log(`    Type: ${plan.type}, Product: ${plan.product || "none"}, Scheduled: ${plan.date} 10:00 CET`);

    try {
      // 1. Generate image + captions
      console.log("    Generating image + captions...");
      const t0 = Date.now();
      const result = await generatePost({
        type: plan.type,
        productKey: plan.product,
      });
      const genSec = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`    Generated in ${genSec}s: ${result.imagePath}`);

      // 2. Upload to Publer
      const fullImagePath = path.join(__dirname, "..", "public", result.imagePath.replace(/^\//, ""));
      console.log("    Uploading to Publer...");
      const media = await uploadToPubler(fullImagePath);
      if (!media.id) {
        console.error("    Upload failed:", JSON.stringify(media));
        results.push({ ...plan, status: "upload_failed" });
        continue;
      }

      // 3. Schedule
      const captionIG = `${result.captionSv}\n\n${result.hashtags}`.trim();
      const captionLI = `${result.linkedinSv}\n\n${result.hashtags}`.trim();

      console.log("    Scheduling via Publer...");
      const schedResult = await scheduleToPubler({
        mediaId: media.id,
        captionIG,
        captionLI,
        scheduledAt,
        accounts,
      });

      if (schedResult.job_id) {
        // Wait and check status
        await new Promise((r) => setTimeout(r, 3000));
        const statusData = await fetchJSON(
          `https://app.publer.com/api/v1/job_status/${schedResult.job_id}`,
          { headers }
        );
        const failures = statusData.payload?.failures || {};
        const hasFailures = Object.keys(failures).length > 0 &&
          Object.values(failures).some((f) => Array.isArray(f) && f.length > 0);

        if (hasFailures) {
          console.log(`    PARTIAL: ${JSON.stringify(failures)}`);
          results.push({ ...plan, status: "partial", jobId: schedResult.job_id });
        } else {
          console.log(`    OK – Scheduled for ${plan.date} 10:00 CET`);
          results.push({ ...plan, status: "scheduled", jobId: schedResult.job_id });
        }
      } else {
        console.error("    Schedule failed:", JSON.stringify(schedResult));
        results.push({ ...plan, status: "schedule_failed" });
      }

      // Caption preview
      console.log(`    Caption (SV): ${result.captionSv?.slice(0, 80)}...`);

    } catch (err) {
      console.error(`    ERROR: ${err.message}`);
      results.push({ ...plan, status: "error", error: err.message });
    }
  }

  // Summary
  console.log("\n\n========== VECKOSAMMANFATTNING ==========\n");
  for (const r of results) {
    const icon = r.status === "scheduled" ? "OK" : "!!";
    console.log(`  [${icon}] ${r.label} – ${r.status}`);
  }

  const ok = results.filter((r) => r.status === "scheduled").length;
  console.log(`\n  ${ok}/${results.length} inlagg schemalagda.\n`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
