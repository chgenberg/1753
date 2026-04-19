#!/usr/bin/env node
/**
 * generate-bulk-landing.js
 *
 * Generates ~260 niche landing pages across 12 categories in 5 languages.
 * Produces 12 separate `frontend/src/lib/seo/pages-*.ts` files that plug
 * straight into ALL_LANDING_PAGES (no template / middleware / sitemap
 * changes required).
 *
 * Usage:
 *   node scripts/generate-bulk-landing.js                           # all, use cache
 *   node scripts/generate-bulk-landing.js --category=ingredient     # one category
 *   node scripts/generate-bulk-landing.js --only=<svSlug>           # one slug
 *   node scripts/generate-bulk-landing.js --force                   # bypass cache
 *   node scripts/generate-bulk-landing.js --write-only              # skip LLM, rebuild TS from cache
 *   node scripts/generate-bulk-landing.js --concurrency=6           # parallel gen (default 6)
 *
 * Cache:  scripts/.cache/bulk-landing/<category>/<svSlug>.json
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL_LANDING || "gpt-5.4-mini";

if (!OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY krävs.");
  process.exit(1);
}

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "frontend", "src", "lib", "seo");
const CACHE_ROOT = path.join(__dirname, ".cache", "bulk-landing");

function argValue(name, fallback) {
  const hit = process.argv.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return fallback;
  if (hit === `--${name}`) return true;
  return hit.split("=")[1];
}

const ONLY = typeof argValue("only", false) === "string" ? argValue("only") : null;
const CATEGORY_FILTER = typeof argValue("category", false) === "string" ? argValue("category") : null;
const FORCE = process.argv.includes("--force");
const WRITE_ONLY = process.argv.includes("--write-only");
const CONCURRENCY = parseInt(
  typeof argValue("concurrency", false) === "string" ? argValue("concurrency") : "6",
  10,
);

// -------- valid product IDs --------

const VALID_PRODUCT_IDS = [
  "duo-kit",
  "duo-ta-da",
  "ta-da-serum",
  "au-naturel-makeup-remover",
  "fungtastic-mushroom-extract",
];

// -------- 12 categories × ~260 slugs --------

const CATEGORIES_CONFIG = require("./bulk-landing-config");

// -------- OpenAI call --------

async function callOpenAI(messages) {
  const fetch = (await import("node-fetch")).default;
  const body = {
    model: MODEL,
    messages,
    temperature: 0.85,
    max_completion_tokens: 16000,
    response_format: { type: "json_object" },
  };
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI ${res.status}: ${errText.slice(0, 400)}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim() || "";
  return { text, usage: data.usage || null };
}

// -------- Prompt design --------

function buildSystemPrompt(categoryDirective) {
  return `Du är senior copywriter för 1753 SKINCARE – ett svenskt hudvårdsmärke byggt på CBD/CBG från hampa. Tonen är ärlig, varm, rebellisk och skeptisk till konventionell hudvård (aggressiv rengöring, överdriven exfoliering, onödiga aktiva). Aldrig klinisk eller korporativ. Aldrig emojis. Använd korrekt å, ä, ö när du skriver svenska.

Produkterna du får referera till (och bara dessa):
- DUO-kit: The ONE (CBD-ansiktsolja) + I LOVE (CBG-serum) – tillsammans ger full cannabinoidspektrum
- The ONE: CBD + MCT – hudreglerande ansiktsolja
- I LOVE: CBG-serum – lugnande, antibakteriellt
- Ta-DA serum: antioxidant-cocktail med CBG och adaptogener, anti-aging
- DUO Ta-DA: DUO-kit + Ta-DA
- Au Naturel Makeup Remover: MCT-olja, mild rengöring
- Fungtastic Mushroom Extract: Chaga, Reishi, Lion's Mane, Cordyceps – oralt tillskott

KATEGORI-INSTRUKTION:
${categoryDirective}

Strikt JSON-schema per språk:
{
  "metaTitle": "max 65 tecken, inkluderar huvud-keyword och avslutar '| 1753 SKINCARE'",
  "metaDescription": "max 160 tecken, säljande, innehåller primär keyword",
  "kicker": "kort kategori-etikett, 1-3 ord, versaliserat som substantiv",
  "h1": "emotionell H1, gärna bindestreck-format",
  "lead": "2-4 meningar som sätter tonen, 30-60 ord",
  "problemTitle": "H2 som ställer en fråga eller utmanar",
  "problemBody": "3 paragrafer i HTML: <p>...</p><p>...</p><p>...</p>. Innehåller vetenskap (nämn mekanism, studier där det passar), konfronterar konventionell dogma, bjuder in läsaren. Totalt 180-260 ord.",
  "tipsTitle": "H2 som lovar konkreta råd",
  "tips": [5 objekt: { "title": "imperativ eller kort fras, 3-6 ord", "body": "2-3 meningar, 25-45 ord, konkret, användbart idag" }],
  "solutionTitle": "H2 om hur man faktiskt löser det",
  "solutionBody": "3 paragrafer i HTML som ovan. Här kommer 1753-produkterna in naturligt – inte säljigt, utan som det uppenbara valet. Nämn 2-3 produkter från listan. 180-260 ord.",
  "faq": [4 objekt: { "q": "vanlig fråga", "a": "2-4 meningar, konkret svar, 35-70 ord" }],
  "ctaTitle": "stark CTA-rubrik, 5-9 ord",
  "ctaSub": "1 mening, inbjudande, 12-18 ord"
}

För HTML: använd endast <p>, <strong>, <em>. Inga klasser, inga inline-stilar, inga bilder.

Ton-regler:
- Tala till läsaren som en kunnig vän
- Konkret, inte abstrakt
- Vetenskap ja, men översatt till mänsklig nivå
- Aldrig "garanterar", "kurerar", "eliminerar"
- Gärna lätt utmanande mot mainstream-dermatologi när det är befogat
- Äkta översättningar, inte maskin-vibe

Du svarar med ETT JSON-objekt med FEM nycklar: "sv", "en", "es", "de", "fr". Inget annat. Inga markdown-fences. Ren JSON.`;
}

function buildUserPrompt(page) {
  return `Skapa en landningssida om följande ämne:

SVENSK SLUG: ${page.svSlug}
KATEGORI: ${page.category}
ÄMNE: ${page.topic}

Nyckel-koncept att inkludera där relevant: ${page.keywords.join(", ")}

Produktvinkel (väv in naturligt i solutionBody, inte i problemBody):
${page.productBrief}

Primär keyword per språk att väva in i metaTitle, H1 och naturligt i brödtexten:
- sv: matchar "${page.svSlug.replace(/-/g, " ")}"
- en: matchar "${page.enSlug.replace(/-/g, " ")}"
- es: matchar "${page.esSlug.replace(/-/g, " ")}"
- de: matchar "${page.deSlug.replace(/-/g, " ")}"
- fr: matchar "${page.frSlug.replace(/-/g, " ")}"

VIKTIGT: Producera ÄKTA översättningar per språk – inte maskinöversättningar. Kulturella exempel får skilja (mat, klimat, vardagsscenarion) men produkter och vetenskap ska vara konsekvent.

Returnera ETT JSON-objekt:
{
  "sv": { ...LandingPageContent... },
  "en": { ...LandingPageContent... },
  "es": { ...LandingPageContent... },
  "de": { ...LandingPageContent... },
  "fr": { ...LandingPageContent... }
}`;
}

// -------- Validation --------

const REQUIRED_KEYS = [
  "metaTitle",
  "metaDescription",
  "kicker",
  "h1",
  "lead",
  "problemTitle",
  "problemBody",
  "tipsTitle",
  "tips",
  "solutionTitle",
  "solutionBody",
  "faq",
  "ctaTitle",
  "ctaSub",
];

function validateContent(obj, locale) {
  const errors = [];
  const c = obj?.[locale];
  if (!c) {
    errors.push(`missing locale: ${locale}`);
    return errors;
  }
  for (const k of REQUIRED_KEYS) {
    if (!(k in c)) errors.push(`${locale}.${k} missing`);
  }
  if (c.tips && (!Array.isArray(c.tips) || c.tips.length < 3)) {
    errors.push(`${locale}.tips <3`);
  }
  if (c.faq && (!Array.isArray(c.faq) || c.faq.length < 3)) {
    errors.push(`${locale}.faq <3`);
  }
  return errors;
}

// -------- Per-slug generation --------

async function generateForSlug(page, categoryDirective) {
  const cacheDir = path.join(CACHE_ROOT, page.category);
  fs.mkdirSync(cacheDir, { recursive: true });
  const cachePath = path.join(cacheDir, `${page.svSlug}.json`);

  if (!FORCE && fs.existsSync(cachePath)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
      if (cached.sv && cached.en && cached.es && cached.de && cached.fr) {
        return { content: cached, cached: true };
      }
    } catch {
      // fall through
    }
  }

  const messages = [
    { role: "system", content: buildSystemPrompt(categoryDirective) },
    { role: "user", content: buildUserPrompt(page) },
  ];

  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { text, usage } = await callOpenAI(messages);
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        throw new Error(`invalid JSON: ${e.message}`);
      }
      const allErrors = [];
      for (const loc of ["sv", "en", "es", "de", "fr"]) {
        allErrors.push(...validateContent(parsed, loc));
      }
      if (allErrors.length) throw new Error(`validation: ${allErrors.slice(0, 3).join("; ")}`);
      fs.writeFileSync(cachePath, JSON.stringify(parsed, null, 2), "utf-8");
      return { content: parsed, cached: false, usage };
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  throw lastErr;
}

// -------- Concurrency pool --------

async function runPool(items, worker, concurrency) {
  const results = new Array(items.length);
  let idx = 0;
  const workers = Array.from({ length: concurrency }).map(async () => {
    while (true) {
      const i = idx++;
      if (i >= items.length) return;
      try {
        results[i] = await worker(items[i], i);
      } catch (err) {
        results[i] = { error: err };
      }
    }
  });
  await Promise.all(workers);
  return results;
}

// -------- Write category .ts files --------

const CATEGORY_EXPORT_NAME = {
  ingredient: "INGREDIENT_PAGES",
  myth: "MYTH_PAGES",
  trend: "TREND_PAGES",
  symptom: "SYMPTOM_PAGES",
  bodypart: "BODYPART_PAGES",
  lifecycle: "LIFECYCLE_PAGES",
  comparison: "COMPARISON_PAGES",
  seasonal: "SEASONAL_PAGES",
  wellness: "WELLNESS_PAGES",
  profession: "PROFESSION_PAGES",
  stad_v2: "CITY_V2_PAGES",
  science: "SCIENCE_PAGES",
};

const CATEGORY_FILE_NAME = {
  ingredient: "pages-ingredients.ts",
  myth: "pages-myths.ts",
  trend: "pages-trends.ts",
  symptom: "pages-symptoms.ts",
  bodypart: "pages-bodyparts.ts",
  lifecycle: "pages-lifecycle.ts",
  comparison: "pages-comparisons.ts",
  seasonal: "pages-seasonal.ts",
  wellness: "pages-wellness.ts",
  profession: "pages-profession.ts",
  stad_v2: "pages-cities-v2.ts",
  science: "pages-science.ts",
};

function writeCategoryFile(categoryKey, pages, contentByKey) {
  const exportName = CATEGORY_EXPORT_NAME[categoryKey];
  const fileName = CATEGORY_FILE_NAME[categoryKey];
  if (!exportName || !fileName) throw new Error(`unknown category: ${categoryKey}`);

  const entries = pages.map((page) => {
    const c = contentByKey[page.svSlug];
    if (!c) return null;
    return {
      svSlug: page.svSlug,
      enSlug: page.enSlug,
      esSlug: page.esSlug,
      deSlug: page.deSlug,
      frSlug: page.frSlug,
      category: page.category,
      productIds: page.productIds.filter((id) => VALID_PRODUCT_IDS.includes(id)),
      sv: c.sv,
      en: c.en,
      es: c.es,
      de: c.de,
      fr: c.fr,
    };
  }).filter(Boolean);

  const header = `import type { LandingPage } from "./types";

/**
 * ${exportName} – bulk niche landing pages (category: ${categoryKey}).
 * Generated by scripts/generate-bulk-landing.js. Regenerate a single page with
 * \`node scripts/generate-bulk-landing.js --only=<svSlug>\`.
 */
export const ${exportName}: LandingPage[] = `;

  const body = JSON.stringify(entries, null, 2);
  const outPath = path.join(OUT_DIR, fileName);
  fs.writeFileSync(outPath, `${header}${body};\n`, "utf-8");
  console.log(`wrote ${fileName} (${entries.length}/${pages.length} pages)`);
}

// -------- Main --------

async function main() {
  fs.mkdirSync(CACHE_ROOT, { recursive: true });

  let totalPages = 0;
  let totalCategories = 0;

  for (const [categoryKey, cfg] of Object.entries(CATEGORIES_CONFIG)) {
    if (CATEGORY_FILTER && categoryKey !== CATEGORY_FILTER) continue;
    totalCategories++;
    const pages = ONLY ? cfg.pages.filter((p) => p.svSlug === ONLY) : cfg.pages;
    if (!pages.length) continue;

    console.log(`\n=== ${categoryKey} (${pages.length} pages) ===`);
    const contentByKey = {};

    // Load cache first (for all pages in category, so writer has full set)
    for (const p of cfg.pages) {
      const cp = path.join(CACHE_ROOT, categoryKey, `${p.svSlug}.json`);
      if (fs.existsSync(cp)) {
        try {
          contentByKey[p.svSlug] = JSON.parse(fs.readFileSync(cp, "utf-8"));
        } catch { /* ignore */ }
      }
    }

    if (!WRITE_ONLY) {
      let done = 0;
      const results = await runPool(pages, async (p) => {
        const r = await generateForSlug(p, cfg.directive);
        done++;
        const tag = r.cached ? "cache" : "gen  ";
        console.log(`  [${done}/${pages.length}] ${tag}  ${p.svSlug}`);
        return r;
      }, CONCURRENCY);

      for (let i = 0; i < pages.length; i++) {
        const r = results[i];
        if (r?.error) {
          console.error(`  FAILED ${pages[i].svSlug}: ${r.error.message}`);
          process.exitCode = 1;
        } else if (r?.content) {
          contentByKey[pages[i].svSlug] = r.content;
        }
      }
    }

    writeCategoryFile(categoryKey, cfg.pages, contentByKey);
    totalPages += Object.keys(contentByKey).length;
  }

  console.log(`\nDONE: ${totalPages} pages across ${totalCategories} categories.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
