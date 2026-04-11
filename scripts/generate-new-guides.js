#!/usr/bin/env node
/**
 * generate-new-guides.js
 *
 * Identifies keyword gaps in the 1753 SKINCARE guide library and generates
 * new landing pages using GPT-5.4 + Valyu research. Pages are written
 * directly into the SEO source files, grouped by category.
 *
 * Usage:
 *   node scripts/generate-new-guides.js                      # auto-discover gaps
 *   node scripts/generate-new-guides.js --dry-run             # preview without writing
 *   node scripts/generate-new-guides.js --max 5               # generate max 5 pages
 *   node scripts/generate-new-guides.js --category lifestyle  # only fill lifestyle gaps
 *   node scripts/generate-new-guides.js --topic "retinol och CBD"  # force a specific topic
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VALYU_API_KEY = process.env.VALYU_API_KEY;

const isDryRun = process.argv.includes("--dry-run");
const maxPages = (() => {
  const idx = process.argv.indexOf("--max");
  return idx >= 0 ? parseInt(process.argv[idx + 1], 10) : 3;
})();
const filterCategory = (() => {
  const idx = process.argv.indexOf("--category");
  return idx >= 0 ? process.argv[idx + 1] : null;
})();
const forceTopic = (() => {
  const idx = process.argv.indexOf("--topic");
  return idx >= 0 ? process.argv[idx + 1] : null;
})();

if (!OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY required.");
  process.exit(1);
}

const SEO_DIR = path.join(__dirname, "..", "frontend", "src", "lib", "seo");
const STATE_PATH = path.join(__dirname, "..", "data", "guide-generation-state.json");

const PRODUCT_IDS = [
  "duo-ta-da",
  "ta-da-serum",
  "duo-kit",
  "au-naturel-makeup-remover",
  "fungtastic-mushroom-extract",
];

const CATEGORY_FILES = {
  general: "pages-general.ts",
  cbd: "pages-cbd.ts",
  cbg: "pages-cbg.ts",
  condition: "pages-conditions.ts",
  lifestyle: "pages-lifestyle.ts",
  audience: "pages-audience.ts",
  howto: "pages-howto.ts",
};

// ---- Helpers ----

async function callOpenAI(messages, maxTokens = 6000) {
  const fetch = (await import("node-fetch")).default;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5.4",
      messages,
      temperature: 0.75,
      max_completion_tokens: maxTokens,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI ${res.status}: ${errText}`);
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

async function searchValyu(query, maxResults = 5) {
  if (!VALYU_API_KEY) return [];
  try {
    const { Valyu } = require("valyu-js");
    const client = new Valyu({ apiKey: VALYU_API_KEY });
    const response = await client.search({
      query,
      searchType: "all",
      maxNumResults: maxResults,
    });
    if (!response?.results) return [];
    return response.results.map((r) => ({
      title: r.title || "",
      url: r.url || "",
      snippet: (r.content || r.snippet || "").slice(0, 500),
    }));
  } catch {
    return [];
  }
}

function loadState() {
  if (fs.existsSync(STATE_PATH)) return JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"));
  return { generated: [], lastRun: null };
}

function saveState(state) {
  const dir = path.dirname(STATE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
}

function loadExistingSlugs() {
  const files = fs.readdirSync(SEO_DIR).filter((f) => f.startsWith("pages-") && f.endsWith(".ts"));
  const slugs = new Set();
  for (const file of files) {
    const content = fs.readFileSync(path.join(SEO_DIR, file), "utf-8");
    for (const m of content.matchAll(/svSlug:\s*"([^"]+)"/g)) slugs.add(m[1]);
    for (const m of content.matchAll(/enSlug:\s*"([^"]+)"/g)) slugs.add(m[1]);
  }
  return slugs;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---- Gap discovery ----

const GAP_DISCOVERY_PROMPT = `Du ar en SEO-strateg for 1753 SKINCARE, ett svenskt hudvardmarke med CBD/CBG-produkter.

Nedan ar alla befintliga guide-sluggar pa sajten. Din uppgift ar att identifiera KEYWORD GAPS -- amnen med sok-trafik-potential som saknas.

Fokusera pa:
1. Sma-nisch-sokord med hog kopintention (t.ex. "cbd mot perioral dermatit")
2. Jämforande sokord (t.ex. "cbd vs retinol", "cbg vs niacinamid")
3. Sasongsrelaterade hudproblem (t.ex. "vinterhud tips", "solskadad hud aterhamtning")
4. Specifika livsstilskopplingar (t.ex. "alkohol och hudhalsa", "vegansk kost hudvard")
5. Fragor manniskor staller (t.ex. "varfor kliar huden pa kvallen")
6. Trender 2025-2026 (t.ex. "skin cycling", "barrier repair")

VIKTIGT:
- Foreslagna svSlug och enSlug MASTE vara unika (finns inte i befintliga sluggar)
- Varje forslag maste ha en tydlig sokintention
- Valj ratt kategori fran: general, cbd, cbg, condition, lifestyle, audience, howto
- Foreslagna produkter maste vara exakt fran: ${PRODUCT_IDS.join(", ")}

Svara med JSON:
{
  "gaps": [
    {
      "svSlug": "...",
      "enSlug": "...",
      "category": "...",
      "topic_sv": "kort beskrivning pa svenska",
      "topic_en": "kort beskrivning pa engelska",
      "search_intent": "informational|commercial|navigational",
      "estimated_volume": "low|medium|high",
      "productIds": ["..."]
    }
  ]
}

Returnera exakt ${maxPages + 5} forslag, sorterade efter uppskattad sokvolym (hogst forst).`;

// ---- Page generation ----

const PAGE_GEN_PROMPT = `Du ar en expert-copywriter for 1753 SKINCARE. Du skriver SEO-optimerade landningssidor pa bade svenska och engelska.

Regler:
- SVAR-FORST: borja varje stycke med den viktigaste insikten/svaret
- Skriv i varumarkets ton: arlig, varm, rebellisk -- aldrig klinisk eller korporativ
- Var skeptisk till konventionell hudvard och modern livsstil
- Rekommendera livsstil (somn, kost, stress, rorelse, tarm) FORST, produkter sist
- HTML i problemBody och solutionBody: anvand <p>, <strong>, <em>
- Tips och FAQ: ren text, ingen HTML
- 5 tips, 4 FAQ
- metaTitle max 60 tecken, metaDescription max 155 tecken
- h1 ska vara unik och sokbar, INTE identisk med metaTitle
- Inkludera forskning/kallor naturligt i texten om du har det

Svara ENBART med JSON:
{
  "sv": {
    "metaTitle": "...",
    "metaDescription": "...",
    "kicker": "...",
    "h1": "...",
    "lead": "...",
    "problemTitle": "...",
    "problemBody": "...",
    "tipsTitle": "...",
    "tips": [{"title": "...", "body": "..."}],
    "solutionTitle": "...",
    "solutionBody": "...",
    "faq": [{"q": "...", "a": "..."}],
    "ctaTitle": "...",
    "ctaSub": "..."
  },
  "en": {
    "metaTitle": "...",
    "metaDescription": "...",
    "kicker": "...",
    "h1": "...",
    "lead": "...",
    "problemTitle": "...",
    "problemBody": "...",
    "tipsTitle": "...",
    "tips": [{"title": "...", "body": "..."}],
    "solutionTitle": "...",
    "solutionBody": "...",
    "faq": [{"q": "...", "a": "..."}],
    "ctaTitle": "...",
    "ctaSub": "..."
  }
}`;

// ---- Insert into source file ----

function insertPageIntoFile(category, pageObject) {
  const fileName = CATEGORY_FILES[category];
  if (!fileName) {
    console.error(`  Unknown category "${category}" -- skipping`);
    return false;
  }
  const filePath = path.join(SEO_DIR, fileName);
  let source = fs.readFileSync(filePath, "utf-8");

  const serialized = serializePage(pageObject);

  const lastBracket = source.lastIndexOf("];");
  if (lastBracket === -1) {
    console.error(`  Could not find array end in ${fileName}`);
    return false;
  }

  const before = source.slice(0, lastBracket);
  const after = source.slice(lastBracket);

  const needsComma = before.trimEnd().endsWith("}");
  const insertion = `${needsComma ? "," : ""}\n${serialized}\n`;

  source = before + insertion + after;
  fs.writeFileSync(filePath, source, "utf-8");
  return true;
}

function serializePage(page) {
  const esc = (s) => {
    if (!s) return '""';
    return JSON.stringify(s);
  };
  const serializeTips = (tips) =>
    tips
      .map((t) => `        { title: ${esc(t.title)}, body: ${esc(t.body)} }`)
      .join(",\n");
  const serializeFaq = (faq) =>
    faq
      .map((f) => `        { q: ${esc(f.q)}, a: ${esc(f.a)} }`)
      .join(",\n");

  const serializeContent = (c) => `{
      metaTitle: ${esc(c.metaTitle)},
      metaDescription: ${esc(c.metaDescription)},
      kicker: ${esc(c.kicker)},
      h1: ${esc(c.h1)},
      lead: ${esc(c.lead)},
      problemTitle: ${esc(c.problemTitle)},
      problemBody: ${esc(c.problemBody)},
      tipsTitle: ${esc(c.tipsTitle)},
      tips: [
${serializeTips(c.tips)}
      ],
      solutionTitle: ${esc(c.solutionTitle)},
      solutionBody: ${esc(c.solutionBody)},
      faq: [
${serializeFaq(c.faq)}
      ],
      ctaTitle: ${esc(c.ctaTitle)},
      ctaSub: ${esc(c.ctaSub)}
    }`;

  return `  {
    svSlug: ${esc(page.svSlug)},
    enSlug: ${esc(page.enSlug)},
    category: ${esc(page.category)},
    productIds: [${page.productIds.map((id) => `"${id}"`).join(", ")}],
    sv: ${serializeContent(page.sv)},
    en: ${serializeContent(page.en)}
  }`;
}

// ---- Main ----

async function main() {
  console.log("=== 1753 SKINCARE -- Guide Auto-Generator ===\n");
  const state = loadState();
  const existingSlugs = loadExistingSlugs();
  console.log(`Existing pages: ${existingSlugs.size / 2} (${existingSlugs.size} slugs sv+en)`);

  let gaps;

  if (forceTopic) {
    const svSlug = slugify(forceTopic);
    const enSlug = svSlug;
    gaps = [
      {
        svSlug,
        enSlug,
        category: filterCategory || "general",
        topic_sv: forceTopic,
        topic_en: forceTopic,
        search_intent: "informational",
        estimated_volume: "medium",
        productIds: ["duo-ta-da", "ta-da-serum"],
      },
    ];
  } else {
    console.log("\n1) Discovering keyword gaps with GPT-5.4...");
    const existingList = [...existingSlugs].join(", ");
    const gapRaw = await callOpenAI(
      [
        { role: "system", content: GAP_DISCOVERY_PROMPT },
        {
          role: "user",
          content: `Befintliga sluggar:\n${existingList}\n\nIdentifiera ${maxPages + 5} keyword gaps.${filterCategory ? ` Fokusera pa kategori: ${filterCategory}` : ""}`,
        },
      ],
      3000,
    );
    const parsed = JSON.parse(gapRaw);
    gaps = (parsed.gaps || []).filter(
      (g) => !existingSlugs.has(g.svSlug) && !existingSlugs.has(g.enSlug),
    );
    console.log(`   Found ${gaps.length} unique gaps`);
  }

  const toGenerate = gaps.slice(0, maxPages);
  console.log(`\n2) Generating ${toGenerate.length} new guide pages...\n`);

  let created = 0;

  for (const gap of toGenerate) {
    console.log(`--- [${gap.category}] ${gap.svSlug} / ${gap.enSlug} ---`);

    if (existingSlugs.has(gap.svSlug) || existingSlugs.has(gap.enSlug)) {
      console.log("   Slug already exists -- skipping");
      continue;
    }

    const research = await searchValyu(`${gap.topic_en} skincare CBD research 2025 2026`);
    const researchContext =
      research.length > 0
        ? `\n\nForskning att referera:\n${research.map((r) => `- ${r.title}: ${r.snippet}`).join("\n")}`
        : "";

    console.log(`   Research: ${research.length} sources found`);

    const raw = await callOpenAI([
      { role: "system", content: PAGE_GEN_PROMPT },
      {
        role: "user",
        content: `Skapa en komplett landningssida for:
Amne (SV): ${gap.topic_sv}
Amne (EN): ${gap.topic_en}
Kategori: ${gap.category}
Sokintention: ${gap.search_intent}
Rekommenderade produkter: ${gap.productIds.join(", ")}${researchContext}`,
      },
    ]);

    let content;
    try {
      content = JSON.parse(raw);
    } catch (e) {
      console.error(`   Failed to parse GPT response: ${e.message}`);
      continue;
    }

    if (!content.sv || !content.en) {
      console.error("   Missing sv/en in response -- skipping");
      continue;
    }

    const pageObj = {
      svSlug: gap.svSlug,
      enSlug: gap.enSlug,
      category: gap.category,
      productIds: gap.productIds.filter((id) => PRODUCT_IDS.includes(id)),
      sv: content.sv,
      en: content.en,
    };

    if (isDryRun) {
      console.log(`   [DRY RUN] Would create: ${gap.svSlug} in ${CATEGORY_FILES[gap.category]}`);
      console.log(`   SV h1: ${content.sv.h1}`);
      console.log(`   EN h1: ${content.en.h1}`);
    } else {
      const ok = insertPageIntoFile(gap.category, pageObj);
      if (ok) {
        console.log(`   Written to ${CATEGORY_FILES[gap.category]}`);
        existingSlugs.add(gap.svSlug);
        existingSlugs.add(gap.enSlug);
        state.generated.push({
          svSlug: gap.svSlug,
          enSlug: gap.enSlug,
          category: gap.category,
          createdAt: new Date().toISOString(),
        });
        created++;
      }
    }

    if (toGenerate.indexOf(gap) < toGenerate.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  state.lastRun = new Date().toISOString();
  saveState(state);

  console.log(`\n=== Done. Created ${created} new guides. Total: ${existingSlugs.size / 2} pages. ===`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
