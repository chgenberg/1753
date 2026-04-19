#!/usr/bin/env node
/**
 * Generate frontend/public/llms-guides.txt — a machine-readable index of
 * every guide landing page grouped by category, with a one-sentence lead
 * in English so LLMs can decide which URL to fetch next.
 *
 * Usage:  node scripts/generate-llms-guides.js
 *
 * We intentionally avoid touching any runtime logic: the output file is a
 * static text artefact referenced from robots/llms.txt; regenerate on
 * demand (e.g. after a bulk landing-page run) and commit the result.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const SEO_DIR = path.join(ROOT, "frontend", "src", "lib", "seo");
const OUT = path.join(ROOT, "frontend", "public", "llms-guides.txt");

const FILES = [
  "pages-tier1.ts",
  "pages-cbd.ts",
  "pages-cbg.ts",
  "pages-ingredients.ts",
  "pages-comparisons.ts",
  "pages-myths.ts",
  "pages-trends.ts",
  "pages-science.ts",
  "pages-symptoms.ts",
  "pages-conditions.ts",
  "pages-bodyparts.ts",
  "pages-lifecycle.ts",
  "pages-audience.ts",
  "pages-wellness.ts",
  "pages-lifestyle.ts",
  "pages-seasonal.ts",
  "pages-profession.ts",
  "pages-howto.ts",
  "pages-cities.ts",
  "pages-cities-v2.ts",
  "pages-cities-eu.ts",
  "pages-general.ts",
];

const CATEGORY_LABELS = {
  tier1: "Tier 1 hub pages",
  cbd: "CBD",
  cbg: "CBG",
  ingredient: "Ingredients",
  comparison: "Comparisons (CBD vs CBG, oil vs cream, etc.)",
  myth: "Myths, fact-checked",
  trend: "Trends, evidence-scored",
  science: "Science deep-dives (ECS, microbiome, barrier)",
  symptom: "Symptoms (acne, eczema, redness, dryness, sensitivity)",
  condition: "Chronic skin conditions",
  bodypart: "Body parts (face, neck, chest, back, hands)",
  lifecycle: "Life stages (teen, 20s, 30s, 40s, menopause, postpartum)",
  audience: "Audiences (men, women, parents, athletes)",
  wellness: "Wellness (sleep, stress, gut-skin axis, nutrition)",
  lifestyle: "Lifestyle habits",
  seasonal: "Seasonal (winter barrier, summer, dry indoor air)",
  profession: "Professions (nurses, chefs, office, outdoor work)",
  howto: "How-to routines",
  stad: "Swedish cities",
  stad_v2: "Swedish cities (pollution + climate context)",
  stad_eu: "EU cities",
  general: "General skincare education",
};

/**
 * Parse a pages-*.ts file with a tolerant regex-based extractor. We don't
 * execute the TypeScript; we only need the structured fields that are
 * stable across every generated page (slug + category + sv.metaDescription).
 */
function extractPages(src) {
  const out = [];
  // Each page block starts with `{ "svSlug": "..."` and ends at the matching `},`.
  const blockRe = /\{\s*"svSlug":\s*"([^"]+)"[\s\S]*?\n  \},/g;
  let m;
  while ((m = blockRe.exec(src))) {
    const block = m[0];
    const svSlug = m[1];
    const enSlug = (block.match(/"enSlug":\s*"([^"]+)"/) || [])[1] || svSlug;
    const category = (block.match(/"category":\s*"([^"]+)"/) || [])[1] || "general";
    // Prefer SV meta description (canonical); fall back to lead or H1.
    const svBlock = (block.match(/"sv":\s*\{([\s\S]*?)\n    \}/) || [])[1] || "";
    const lead =
      (svBlock.match(/"metaDescription":\s*"([^"]+)"/) || [])[1] ||
      (svBlock.match(/"lead":\s*"([^"]+)"/) || [])[1] ||
      "";
    const h1 = (svBlock.match(/"h1":\s*"([^"]+)"/) || [])[1] || svSlug;
    out.push({ svSlug, enSlug, category, h1, lead: lead.replace(/\s+/g, " ").trim() });
  }
  return out;
}

function main() {
  const all = [];
  for (const f of FILES) {
    const p = path.join(SEO_DIR, f);
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, "utf8");
    const pages = extractPages(src);
    all.push(...pages);
  }

  if (!all.length) {
    console.error("No pages extracted — aborting.");
    process.exit(1);
  }

  // Deduplicate by svSlug (should already be unique across the bulk config).
  const seen = new Set();
  const unique = all.filter((p) => (seen.has(p.svSlug) ? false : (seen.add(p.svSlug), true)));

  const byCat = new Map();
  for (const p of unique) {
    if (!byCat.has(p.category)) byCat.set(p.category, []);
    byCat.get(p.category).push(p);
  }

  const order = [
    "tier1", "cbd", "cbg", "ingredient", "comparison", "myth", "trend", "science",
    "symptom", "condition", "bodypart", "lifecycle", "audience", "wellness",
    "lifestyle", "seasonal", "profession", "howto",
    "stad", "stad_v2", "stad_eu", "general",
  ];

  const header = `# 1753 SKINCARE — Guide library index for LLMs

This file enumerates every guide article on https://www.1753skin.com so that
language models can reason over the full content map without crawling the
entire sitemap. Every guide exists in Swedish (canonical), English, Spanish,
German and French (hreflang alternates).

- Canonical URL pattern (Swedish): https://www.1753skin.com/sv/guide/<svSlug>
- English URL pattern: https://www.1753skin.com/en/guide/<enSlug>
- Total guides (canonical): ${unique.length.toLocaleString("en-US")}
- Last generated: ${new Date().toISOString().slice(0, 10)}
- Human-readable index: https://www.1753skin.com/sv/guide/alla
- RSS feed: https://www.1753skin.com/guide/rss.xml
- Sitemap: https://www.1753skin.com/sitemap.xml

Format per entry:
    <svSlug> | <enSlug> | <one-sentence summary>

`;

  const sections = [];
  for (const cat of order) {
    const pages = byCat.get(cat);
    if (!pages || !pages.length) continue;
    pages.sort((a, b) => a.svSlug.localeCompare(b.svSlug));
    const label = CATEGORY_LABELS[cat] || cat;
    const lines = pages.map((p) => `${p.svSlug} | ${p.enSlug} | ${p.lead || p.h1}`);
    sections.push(`## ${label} (${pages.length})\n\n${lines.join("\n")}\n`);
  }

  // Any category not in order — append at end.
  for (const [cat, pages] of byCat) {
    if (order.includes(cat)) continue;
    pages.sort((a, b) => a.svSlug.localeCompare(b.svSlug));
    const lines = pages.map((p) => `${p.svSlug} | ${p.enSlug} | ${p.lead || p.h1}`);
    sections.push(`## ${cat} (${pages.length})\n\n${lines.join("\n")}\n`);
  }

  const body = header + sections.join("\n");
  fs.writeFileSync(OUT, body);
  console.log(`Wrote ${OUT} — ${unique.length} guides across ${byCat.size} categories.`);
}

main();
