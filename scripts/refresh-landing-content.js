#!/usr/bin/env node
/**
 * refresh-landing-content.js
 *
 * Refreshes SEO landing page content every 30 days using GPT-5.4 + Valyu
 * research. Updates problemBody, solutionBody, tips and FAQ with fresh
 * angles, new research citations, and seasonal relevance.
 *
 * Content freshness is a key GEO (Generative Engine Optimization) signal:
 * pages updated within 30 days receive 3.2x more AI citations.
 *
 * Usage:
 *   node scripts/refresh-landing-content.js                # refresh all stale pages
 *   node scripts/refresh-landing-content.js --dry-run       # preview without writing
 *   node scripts/refresh-landing-content.js --force          # refresh all regardless of age
 *   node scripts/refresh-landing-content.js --slug cbd-hudvard  # refresh one page
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VALYU_API_KEY = process.env.VALYU_API_KEY;

const isDryRun = process.argv.includes("--dry-run");
const isForce = process.argv.includes("--force");
const slugArg = (() => {
  const idx = process.argv.indexOf("--slug");
  return idx >= 0 ? process.argv[idx + 1] : null;
})();

if (!OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY kravs.");
  process.exit(1);
}

const SEO_DIR = path.join(__dirname, "..", "frontend", "src", "lib", "seo");
const STATE_PATH = path.join(__dirname, "..", "data", "content-refresh-state.json");
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

// ---- Helpers ----

async function callOpenAI(messages) {
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
      temperature: 0.7,
      max_completion_tokens: 4000,
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

async function searchValyu(query, maxResults = 4) {
  if (!VALYU_API_KEY) return [];
  try {
    const { Valyu } = require("valyu-js");
    const client = new Valyu({ apiKey: VALYU_API_KEY });
    const response = await client.search({ query, searchType: "all", maxNumResults: maxResults });
    if (!response?.results) return [];
    return response.results.map((r) => ({
      title: r.title || "",
      url: r.url || "",
      snippet: (r.content || r.snippet || "").slice(0, 400),
    }));
  } catch {
    return [];
  }
}

function loadState() {
  if (fs.existsSync(STATE_PATH)) return JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"));
  return { lastRefresh: {}, history: [] };
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
}

function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

// ---- Parse SEO files ----

function loadSeoPages() {
  const files = fs.readdirSync(SEO_DIR).filter(f => f.startsWith("pages-") && f.endsWith(".ts"));
  const pages = [];

  for (const file of files) {
    const fullPath = path.join(SEO_DIR, file);
    const content = fs.readFileSync(fullPath, "utf-8");

    const varMatch = content.match(/export\s+const\s+(\w+):/);
    if (!varMatch) continue;

    // Extract page slugs from the file
    const slugMatches = [...content.matchAll(/svSlug:\s*"([^"]+)"/g)];
    for (const m of slugMatches) {
      pages.push({ file, fullPath, svSlug: m[1], varName: varMatch[1] });
    }
  }
  return pages;
}

// ---- System prompt ----

const SYSTEM_PROMPT = `Du ar en expert pa SEO-copywriting for 1753 SKINCARE, ett svenskt hudvardmarke med CBD/CBG-produkter.

Din uppgift ar att uppdatera befintligt innehall pa landningssidor for att halla det farskt och relevant.
Du ska INTE andra struktur, tonalitet eller sidans grundlaggande budskap -- bara uppdatera med:
1. Ny forskning och statistik (om kallor finns)
2. Sasongsanpassade vinklar
3. Formleringsforandringar for battre lasbarhet och engagement
4. Svar-forst-formatering: borja stycken med det viktigaste svaret/insikten

Regler:
- Behall exakt samma antal tips (vanligtvis 4-5)
- Behall exakt samma antal FAQ (vanligtvis 3-5)
- Skriv pa SVENSKA for sv-falten
- Skriv pa ENGELSKA for en-falten
- HTML i problemBody och solutionBody: anvand <p>, <strong>, <em>
- Tips och FAQ ska vara ren text (ingen HTML)
- Svarsforst: borja varje body/svar med den viktigaste informationen

Svara ENBART med JSON:
{
  "sv": {
    "problemBody": "...",
    "solutionBody": "...",
    "tips": [{"title": "...", "body": "..."}],
    "faq": [{"q": "...", "a": "..."}]
  },
  "en": {
    "problemBody": "...",
    "solutionBody": "...",
    "tips": [{"title": "...", "body": "..."}],
    "faq": [{"q": "...", "a": "..."}]
  }
}`;

// ---- Update a single page in its source file ----

function updatePageInFile(filePath, svSlug, updatedContent) {
  let source = fs.readFileSync(filePath, "utf-8");

  // Find the page block by its svSlug
  const slugIdx = source.indexOf(`svSlug: "${svSlug}"`);
  if (slugIdx === -1) {
    console.error(`  Could not find svSlug "${svSlug}" in ${filePath}`);
    return false;
  }

  // Helper: replace a field value
  function replaceField(src, fieldName, newValue, startFrom) {
    const fieldPattern = new RegExp(`(${fieldName}:\\s*)("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')`, "g");
    fieldPattern.lastIndex = startFrom;
    const match = fieldPattern.exec(src);
    if (match) {
      const escaped = JSON.stringify(newValue).slice(1, -1);
      return src.slice(0, match.index) + match[1] + `"${escaped}"` + src.slice(match.index + match[0].length);
    }
    return src;
  }

  // Helper: replace a block (tips or faq array)
  function replaceArrayBlock(src, fieldName, newArray, startFrom, endBound) {
    const searchRegion = src.slice(startFrom, endBound);
    const fieldIdx = searchRegion.indexOf(`${fieldName}:`);
    if (fieldIdx === -1) return src;

    const absFieldIdx = startFrom + fieldIdx;
    const bracketStart = src.indexOf("[", absFieldIdx);
    if (bracketStart === -1) return src;

    // Find matching closing bracket
    let depth = 0;
    let bracketEnd = -1;
    for (let i = bracketStart; i < src.length; i++) {
      if (src[i] === "[") depth++;
      else if (src[i] === "]") {
        depth--;
        if (depth === 0) { bracketEnd = i; break; }
      }
    }
    if (bracketEnd === -1) return src;

    const indent = "        ";
    const items = newArray.map(item => {
      if (item.q !== undefined) {
        return `{ q: ${JSON.stringify(item.q)}, a: ${JSON.stringify(item.a)} }`;
      }
      return `{ title: ${JSON.stringify(item.title)}, body: ${JSON.stringify(item.body)} }`;
    });

    const replacement = `[\n${indent}  ${items.join(`,\n${indent}  `)}\n${indent}]`;
    return src.slice(0, bracketStart) + replacement + src.slice(bracketEnd + 1);
  }

  // Find the bounds of sv: { ... } and en: { ... } blocks for this page
  function findLangBlock(src, lang, fromIdx) {
    const langIdx = src.indexOf(`${lang}: {`, fromIdx);
    if (langIdx === -1) return null;
    let depth = 0;
    let blockStart = src.indexOf("{", langIdx);
    let blockEnd = -1;
    for (let i = blockStart; i < src.length; i++) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}") {
        depth--;
        if (depth === 0) { blockEnd = i; break; }
      }
    }
    return blockEnd > -1 ? { start: blockStart, end: blockEnd } : null;
  }

  for (const lang of ["sv", "en"]) {
    const content = updatedContent[lang];
    if (!content) continue;

    const block = findLangBlock(source, lang, slugIdx);
    if (!block) {
      console.error(`  Could not find ${lang} block for "${svSlug}"`);
      continue;
    }

    // Replace problemBody
    source = replaceField(source, "problemBody", content.problemBody, block.start);
    // Re-find block since source changed
    const block2 = findLangBlock(source, lang, source.indexOf(`svSlug: "${svSlug}"`));
    if (!block2) continue;

    source = replaceField(source, "solutionBody", content.solutionBody, block2.start);
    const block3 = findLangBlock(source, lang, source.indexOf(`svSlug: "${svSlug}"`));
    if (!block3) continue;

    // Replace tips array
    source = replaceArrayBlock(source, "tips", content.tips, block3.start, block3.end);
    const block4 = findLangBlock(source, lang, source.indexOf(`svSlug: "${svSlug}"`));
    if (!block4) continue;

    // Replace faq array
    source = replaceArrayBlock(source, "faq", content.faq, block4.start, block4.end);
  }

  fs.writeFileSync(filePath, source, "utf-8");
  return true;
}

// ---- Main ----

async function main() {
  console.log("=== Content Refresh (GEO Freshness) ===\n");

  const state = loadState();
  const now = Date.now();
  const season = getCurrentSeason();
  const allPages = loadSeoPages();

  console.log(`Hittade ${allPages.length} landningssidor i ${SEO_DIR}`);
  console.log(`Sasong: ${season}\n`);

  // Filter pages that need refresh
  const pagesToRefresh = allPages.filter(p => {
    if (slugArg) return p.svSlug === slugArg;
    if (isForce) return true;
    const lastRefresh = state.lastRefresh[p.svSlug];
    return !lastRefresh || (now - new Date(lastRefresh).getTime()) > THIRTY_DAYS;
  });

  if (pagesToRefresh.length === 0) {
    console.log("Alla sidor ar uppdaterade (senaste 30 dagarna). Anvand --force for att tvinga uppdatering.");
    return;
  }

  console.log(`${pagesToRefresh.length} sidor behover uppdateras:\n`);

  let updated = 0;

  for (const page of pagesToRefresh) {
    console.log(`[${page.svSlug}] Uppdaterar...`);

    // Read current content
    const fileContent = fs.readFileSync(page.fullPath, "utf-8");

    // Extract current sv content for context (simplified)
    const svSlugIdx = fileContent.indexOf(`svSlug: "${page.svSlug}"`);
    const h1Match = fileContent.slice(svSlugIdx, svSlugIdx + 2000).match(/h1:\s*"([^"]+)"/);
    const leadMatch = fileContent.slice(svSlugIdx, svSlugIdx + 3000).match(/lead:\s*"([^"]+)"/);
    const h1 = h1Match ? h1Match[1] : page.svSlug;
    const lead = leadMatch ? leadMatch[1] : "";

    // Search for fresh research
    const searchQuery = `${h1} skincare research ${new Date().getFullYear()}`;
    const sources = await searchValyu(searchQuery);
    console.log(`  ${sources.length} kallor hittade`);

    const sourcesContext = sources.length > 0
      ? "Ny forskning att referera till:\n" + sources.map((s, i) =>
          `${i + 1}. "${s.title}" -- ${s.url}\n   ${s.snippet}`
        ).join("\n\n")
      : "Inga externa kallor -- uppdatera med nya formuleringar och vinklar.";

    // Extract current tips count and faq count from the region around svSlug
    const region = fileContent.slice(svSlugIdx, svSlugIdx + 8000);
    const tipsCount = (region.match(/\{ title:/g) || []).length / 2;
    const faqCount = (region.match(/\{ q:/g) || []).length / 2;

    const userMessage = `Uppdatera landningssidan "${h1}".
Sammanfattning: ${lead}
Sasong: ${season}
Antal tips att behalla: ${Math.max(tipsCount, 4)}
Antal FAQ att behalla: ${Math.max(faqCount, 3)}

${sourcesContext}

VIKTIGT: Behall sidans grundlaggande budskap och tonalitet. Uppdatera med:
- Farska formuleringar (inte bara omskrivningar)
- Ny forskning om kallor finns
- Sasongsrelevanta vinklar (det ar ${season})
- Svar-forst-format: borja varje stycke med det viktigaste

Generera bade sv och en versioner.`;

    try {
      const raw = await callOpenAI([
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ]);

      const result = JSON.parse(raw);

      if (!result.sv || !result.en) {
        console.error(`  Ogiltigt svar -- saknar sv/en`);
        continue;
      }

      if (isDryRun) {
        console.log(`  [DRY RUN] Skulle uppdatera:`);
        console.log(`    sv tips: ${result.sv.tips?.length}, faq: ${result.sv.faq?.length}`);
        console.log(`    en tips: ${result.en.tips?.length}, faq: ${result.en.faq?.length}`);
      } else {
        const ok = updatePageInFile(page.fullPath, page.svSlug, result);
        if (ok) {
          console.log(`  Uppdaterad!`);
          updated++;
        } else {
          console.log(`  MISSLYCKADES att skriva`);
          continue;
        }
      }

      state.lastRefresh[page.svSlug] = new Date().toISOString();
    } catch (err) {
      console.error(`  FEL: ${err.message}`);
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }

  // Save state
  state.history.push({
    date: new Date().toISOString(),
    pagesAttempted: pagesToRefresh.length,
    pagesUpdated: isDryRun ? 0 : updated,
    season,
  });
  if (state.history.length > 24) state.history = state.history.slice(-24);
  saveState(state);

  console.log(`\nKlart! ${isDryRun ? "[DRY RUN]" : `${updated}/${pagesToRefresh.length} sidor uppdaterade.`}`);
}

main().catch((err) => {
  console.error("Fel:", err);
  process.exit(1);
});
