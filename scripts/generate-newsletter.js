#!/usr/bin/env node
/**
 * generate-newsletter.js
 *
 * Picks an ebook segment, searches for supporting research via Valyu,
 * generates a newsletter using OpenAI GPT-5.4, and sends it via the
 * broadcast endpoint.
 *
 * Newsletter types rotate:
 *   Week 1-3: value-adding (holistic skincare, lifestyle, research)
 *   Week 4:   selling (product focus tied to the week's theme)
 *   Random:   satirical chronicle about conventional skincare industry
 *
 * Usage:
 *   node scripts/generate-newsletter.js            # generate + send
 *   node scripts/generate-newsletter.js --dry-run   # generate only, no send
 *   node scripts/generate-newsletter.js --preview   # print to stdout
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");

const SEGMENTS_PATH = path.join(__dirname, "..", "data", "ebook-segments.json");
const STATE_PATH = path.join(__dirname, "..", "data", "newsletter-state.json");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VALYU_API_KEY = process.env.VALYU_API_KEY;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "1753-admin-key";
const BACKEND_URL = process.env.BACKEND_URL || process.env.BASE_URL || "https://api.1753skin.com";

const isDryRun = process.argv.includes("--dry-run");
const isPreview = process.argv.includes("--preview");

if (!OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY krävs.");
  process.exit(1);
}

// ---- Helpers ----

async function callOpenAI(messages, { jsonMode = false } = {}) {
  const fetch = (await import("node-fetch")).default;
  const body = {
    model: "gpt-5.4",
    messages,
    temperature: 0.8,
    max_completion_tokens: 2000,
  };
  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }
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
    throw new Error(`OpenAI ${res.status}: ${errText}`);
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

async function searchValyu(query, maxResults = 6) {
  if (!VALYU_API_KEY) {
    console.log("  VALYU_API_KEY saknas -- hoppar över webbsökning");
    return [];
  }
  try {
    const { Valyu } = require("valyu-js");
    const client = new Valyu({ apiKey: VALYU_API_KEY });
    const response = await client.search({
      query,
      searchType: "all",
      maxNumResults: maxResults,
    });
    if (!response || !response.results) return [];
    return response.results.map((r) => ({
      title: r.title || "",
      url: r.url || "",
      snippet: (r.content || r.snippet || "").slice(0, 500),
      source: r.source || "web",
    }));
  } catch (err) {
    console.log(`  Valyu-sökning misslyckades: ${err.message}`);
    return [];
  }
}

function loadState() {
  if (fs.existsSync(STATE_PATH)) {
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"));
  }
  return { issueCounter: 0, lastGeneratedAt: null, history: [] };
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
}

function loadSegments() {
  if (!fs.existsSync(SEGMENTS_PATH)) {
    console.error(`Segmentfilen saknas: ${SEGMENTS_PATH}\nKör: node scripts/segment-ebook.js`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(SEGMENTS_PATH, "utf-8"));
}

function saveSegments(segments) {
  fs.writeFileSync(SEGMENTS_PATH, JSON.stringify(segments, null, 2), "utf-8");
}

function pickSegment(segments, history) {
  const recentIds = new Set(history.slice(-10).map((h) => h.chapterId));
  const candidates = segments.filter((s) => !recentIds.has(s.chapterId));
  const pool = candidates.length > 0 ? candidates : segments;
  pool.sort((a, b) => a.usedCount - b.usedCount);
  return pool[0];
}

function determineType(issueCounter) {
  const cycle = issueCounter % 5;
  if (cycle === 3) return "selling";
  if (cycle === 4) return "satire";
  return "value";
}

// ---- Products data for selling issues ----
const PRODUCTS = [
  { name: "DUO-kit", slug: "duo-kit", tagline: "The ONE + I LOVE i ett kit" },
  { name: "DUO TA-DA", slug: "duo-ta-da", tagline: "The ONE + Ta-Da Serum" },
  { name: "Ta-Da Serum", slug: "ta-da-serum", tagline: "CBG-serum för lyster och balans" },
  { name: "Au Naturel Makeup Remover", slug: "au-naturel-makeup-remover", tagline: "Naturlig rengöring med CBD" },
  { name: "Fungtastic Mushroom Extract", slug: "fungtastic-mushroom-extract", tagline: "Svampextrakt för tarmhälsa" },
];

// ---- System prompts ----

const SYSTEM_BASE = `Du är copywriter för 1753 SKINCARE, ett svenskt hudvårdsmärke som säljer CBD/CBG-baserade produkter.

Ton: ärlig, varm, rebellisk -- aldrig klinisk eller korporativ. Du skriver som en kunnig vän som delar med sig, inte som ett företag som säljer.

Regler:
- Skriv på svenska
- Använd aldrig emojis
- Max 400 ord (exkl. HTML-taggar)
- Inkludera alltid källhänvisningar (länk + titel) för faktapåståenden
- HTML-formatering: använd <h2>, <p>, <strong>, <em>, <a>, <blockquote>, <ul>/<li>
- Styla: inline CSS med font-family:-apple-system,sans-serif; font-size:15px; line-height:1.7; color:#515151
- Rubriker: font-size:22px; font-weight:700; color:#1d1d1f
- Länkar: color:#108474; text-decoration:underline
- Blockquote: border-left:3px solid #108474; padding-left:16px; font-style:italic`;

const VALUE_PROMPT = `${SYSTEM_BASE}

Skriv ett VÄRDEHÖJANDE nyhetsbrev. Ämnet ska vara holistisk hudvård/livsstil.
Dela konkret kunskap -- forskning, tips, insikter. Avsluta med en "Visste du att..."-fakta.
Nämn INTE produkter direkt (enbart i en mycket subtil fotnot om alls).`;

const SELLING_PROMPT = `${SYSTEM_BASE}

Skriv ett SÄLJANDE nyhetsbrev. Knyt veckans ämne till en specifik produkt.
Var inte pushig -- berätta en historia, dela vetenskap, och väv in produkten naturligt.
Inkludera en tydlig CTA-knapp (grön, 48px hög, 980px border-radius).
CTA-länk: https://www.1753skin.com/produkter/PRODUCT_SLUG`;

const SATIRE_PROMPT = `${SYSTEM_BASE}

Skriv en SATIRISK KRÖNIKA som gör narr av den konventionella hudvårdsindustrin.
Fiktiv men igenkännbar -- överdrivna påståenden, absurda ingredienslistor,
pseudo-vetenskaplig jargong. Undvik att nämna riktiga varumärken.
Avsluta med en kort, uppriktig reflektion om vad verklig hudvård handlar om.`;

// ---- Main ----

async function main() {
  console.log("=== Nyhetsbrevsgenerator ===\n");

  const segments = loadSegments();
  const state = loadState();

  const issueNum = state.issueCounter + 1;
  const type = determineType(state.issueCounter);
  console.log(`Nummer: #${issueNum}  |  Typ: ${type}\n`);

  const segment = pickSegment(segments, state.history);
  console.log(`E-boks-segment: "${segment.title}" (använt ${segment.usedCount}x)\n`);

  // Search for supporting research
  const searchTerms = segment.tags.length > 0
    ? `${segment.tags.slice(0, 3).join(" ")} skincare research`
    : `${segment.title} holistic skincare endocannabinoid`;
  console.log(`Söker: "${searchTerms}"`);
  const sources = await searchValyu(searchTerms);
  console.log(`  ${sources.length} källor hittade\n`);

  const sourcesContext = sources.length > 0
    ? "Externa källor:\n" + sources.map((s, i) =>
        `${i + 1}. "${s.title}" -- ${s.url}\n   ${s.snippet}`
      ).join("\n\n")
    : "Inga externa källor tillgängliga -- använd din egen kunskap.";

  const recentSubjects = state.history.slice(-5).map((h) => h.subject).join(", ");

  let systemPrompt;
  let productContext = "";
  if (type === "selling") {
    systemPrompt = SELLING_PROMPT;
    const product = PRODUCTS[state.issueCounter % PRODUCTS.length];
    productContext = `\nFokusPRODUKT: ${product.name} -- ${product.tagline}\nProduktlänk: https://www.1753skin.com/produkter/${product.slug}`;
  } else if (type === "satire") {
    systemPrompt = SATIRE_PROMPT;
  } else {
    systemPrompt = VALUE_PROMPT;
  }

  const userMessage = `E-boks-segment (tema för veckan):
Titel: "${segment.title}"
Sammanfattning: ${segment.summary}

${sourcesContext}
${productContext}

Tidigare ämnesrader (undvik upprepning): ${recentSubjects || "inga ännu"}

Svara ENBART med JSON:
{
  "subject": "Ämnesrad (max 60 tecken)",
  "preheader": "Förhandsgranskning (max 100 tecken)",
  "htmlBody": "HTML-innehåll enligt stilreglerna ovan",
  "sources": [{"title": "...", "url": "..."}]
}`;

  console.log("Genererar med GPT-5.4...");
  const raw = await callOpenAI(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    { jsonMode: true }
  );

  let newsletter;
  try {
    newsletter = JSON.parse(raw);
  } catch {
    console.error("Kunde inte parsa JSON-svar från OpenAI:\n", raw);
    process.exit(1);
  }

  console.log(`\nÄmne: ${newsletter.subject}`);
  console.log(`Preheader: ${newsletter.preheader}`);
  console.log(`Källor: ${(newsletter.sources || []).length} st`);

  if (isPreview) {
    console.log("\n--- HTML ---\n");
    console.log(newsletter.htmlBody);
    console.log("\n--- /HTML ---");
    return;
  }

  // Add source footer
  const sourceFooter = (newsletter.sources || []).length > 0
    ? `<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e6e6e6">
         <p style="font-size:12px;color:#766a62;margin:0 0 8px">Källor:</p>
         <ul style="font-size:12px;color:#766a62;padding-left:16px;margin:0">
           ${newsletter.sources.map((s) =>
             `<li><a href="${s.url}" style="color:#108474">${s.title}</a></li>`
           ).join("")}
         </ul>
       </div>`
    : "";

  const fullHtml = newsletter.htmlBody + sourceFooter;

  // Update state
  segment.usedCount++;
  saveSegments(segments);

  state.issueCounter = issueNum;
  state.lastGeneratedAt = new Date().toISOString();
  state.history.push({
    issue: issueNum,
    type,
    chapterId: segment.chapterId,
    subject: newsletter.subject,
    sourcesCount: (newsletter.sources || []).length,
    generatedAt: state.lastGeneratedAt,
  });
  if (state.history.length > 52) {
    state.history = state.history.slice(-52);
  }
  saveState(state);

  if (isDryRun) {
    console.log("\n[DRY RUN] Nyhetsbrevet genererades men skickades INTE.");
    const previewPath = path.join(__dirname, "..", "data", "newsletter-preview.html");
    fs.writeFileSync(previewPath, fullHtml, "utf-8");
    console.log(`Förhandsvisning sparad: ${previewPath}`);
    return;
  }

  // Save as draft via API (requires approval before sending)
  console.log("\nSparar utkast...");
  const fetch = (await import("node-fetch")).default;
  const draftRes = await fetch(`${BACKEND_URL}/api/newsletter/drafts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": ADMIN_API_KEY,
    },
    body: JSON.stringify({
      issueNumber: issueNum,
      type,
      subject: newsletter.subject,
      preheader: newsletter.preheader || "",
      htmlBody: fullHtml,
      sources: newsletter.sources || [],
      segmentTitle: segment.title,
    }),
  });

  if (!draftRes.ok) {
    const errText = await draftRes.text();
    console.error(`Kunde inte spara utkast (${draftRes.status}): ${errText}`);
    process.exit(1);
  }

  const draft = await draftRes.json();
  console.log(`Utkast #${draft.id} sparat. Väntar på godkännande i admin-dashboarden.`);
}

main().catch((err) => {
  console.error("Fel:", err);
  process.exit(1);
});
