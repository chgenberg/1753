#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Mäter token-förbrukning för en typisk premium-hudanalys.
 * Använder tiktoken med o200k_base (samma som GPT-5/GPT-5.4 family).
 */
import { encoding_for_model, get_encoding } from "tiktoken";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PREMIUM_ANALYSIS_SYSTEM_PROMPT, buildPremiumAnalysisPrompt } =
  require("../services/premium-analysis-prompt.js");

let enc;
try {
  enc = encoding_for_model("gpt-4o");
} catch {
  enc = get_encoding("o200k_base");
}

function count(text) {
  return enc.encode(String(text)).length;
}

function pad(n) {
  return String(n).padStart(7, " ");
}

// === Realistisk demo-input – 35 frågor besvarade ===
const demoAnswers = {
  email: "kund@example.com",
  locale: "sv",
  foundation: {
    skinType: "Blandhud",
    perceivedSkinAge: "32",
    sensitivity: "Medel - reagerar på alkohol och eteriska oljor",
    pastDiagnoses: "Mild rosacea i kindområdet, tidigare akne i tonåren",
    photoBaseline: "Aktuellt foto bifogat",
  },
  sleep: {
    averageHours: "5-6",
    quality: "Vaknar 1-2 ggr/natt",
    nightPattern: "Sover tungt första halvan, lättare andra",
  },
  stress: {
    level: "7",
    coping: "Träning 3 ggr/v, försöker meditera men sporadiskt",
    socialPattern: "Social, men trött efter jobb",
    freeText: "Jobbet pressar just nu, mycket deadlines",
  },
  nutrition: {
    typicalDay: "Yoghurt+kaffe morgon, sallad lunch, grönt+protein middag",
    dairy: "1-2 portioner/dag",
    sugar: "Måttligt",
    alcohol: "Helger, 2-3 glas vin",
    coffee: "4-5 koppar",
    gut: "Uppblåsthet, oregelbunden mage",
  },
  movement: {
    type: "Crossfit + promenader",
    frequency: "3 ggr/v",
    sunTime: "30-60 min/dag",
  },
  routine: {
    productsToday: "Cetaphil rening, La Roche-Posay serum, Avène SPF",
    ingredients: "Niacinamid, hyaluronsyra, vitamin C",
    frequency: "Morgon + kväll",
    problems: "Glans i T-zon, rodnad runt näsa, små finnar på haka",
    pastAttempts: "Retinol gav reaktioner, slutade",
  },
  hormones: {
    cycle: "Regelbunden 28d",
    menopause: "Nej",
    contraceptive: "Nej",
    pregnancy: "Nej",
  },
  goals: {
    primary: "Lugna rodnaden",
    secondary: "Mer lyster, jämnare ton",
    deadline: "8 veckor",
    budget: "1500-2000 kr",
    freeText: "Vill ha en hud som känns lugn på morgonen och inte glansig på kvällen",
  },
};

const demoImageScan = {
  overall: [
    { conditionSv: "frisk hud", confidence: 78 },
    { conditionSv: "rodnad", confidence: 14 },
    { conditionSv: "akne", confidence: 8 },
  ],
  overallSeverity: { level: "mild", confidence: 72 },
  zones: [
    { zone: "panna", conditionSv: "frisk hud", confidence: 80 },
    { zone: "vänster kind", conditionSv: "rodnad", confidence: 65, severity: "mild" },
    { zone: "höger kind", conditionSv: "rodnad", confidence: 62, severity: "mild" },
    { zone: "haka", conditionSv: "akne", confidence: 58, severity: "mild" },
    { zone: "näsa", conditionSv: "frisk hud", confidence: 75 },
  ],
  skinMetrics: {
    hydration: 72,
    elasticity: 80,
    pores: 75,
    texture: 78,
    evenness: 70,
    sensitivity: 60,
    oiliness: 70,
    wrinkles: 82,
    darkCircles: 70,
    redness: 60,
    acneScore: 75,
    pigmentation: 78,
    sunDamage: 80,
    barrier: 68,
    overall: 73,
  },
};

const sysTokens = count(PREMIUM_ANALYSIS_SYSTEM_PROMPT);
const userPromptText = buildPremiumAnalysisPrompt(demoAnswers, demoImageScan);
const userTokens = count(userPromptText);

// OpenAI Vision token-kostnad för bilder
// Källa: OpenAI docs - "high" detail = 85 (base) + 170 per 512x512 tile
// För en 1024x1024 bild = 85 + 170 × 4 = 765 tokens
// "low" detail = bara 85 tokens
const IMAGE_TOKENS_HIGH = 765; // 1024x1024 high detail
const IMAGE_TOKENS_LOW = 85;
const numImagesTypical = 1; // huvudbild
const numImagesMax = 4;     // huvudbild + 3 regioner

const inputTokensTypical = sysTokens + userTokens + numImagesTypical * IMAGE_TOKENS_HIGH;
const inputTokensMax = sysTokens + userTokens + numImagesMax * IMAGE_TOKENS_HIGH;

// Output: realistic JSON med alla 21 sektioner
// Mätt på vår demo-payload (har vi mock-result? använd preview-data)
import { readFile } from "node:fs/promises";
const previewSrc = await readFile(
  new URL("../frontend/src/app/[locale]/hudanalys-premium/preview/page.tsx", import.meta.url),
  "utf8"
);
// Extract DEMO_RESULT-objektet (mellan { och slutet före `};`)
const m = previewSrc.match(/const DEMO_RESULT[^=]+=\s*({[\s\S]*?});\s*export default/);
let outputTokens = 0;
let outputJson = "";
if (m) {
  // Approximera output via det formaterade JSON-schemat (det AI:n returnerar)
  // Vi mäter source-koden men det är ungefär samma storleksordning
  outputJson = m[1];
  outputTokens = count(outputJson);
}

console.log("\n=== PREMIUM-HUDANALYS · TOKEN-FÖRBRUKNING ===\n");
console.log("Modell:                gpt-5.4 (default), max_output_tokens = 32000");
console.log(`Tokenizer-encoding:    ${enc.name || "o200k_base"}\n`);

console.log("--- INPUT (varje analys) ---");
console.log(`System prompt:         ${pad(sysTokens)} tokens`);
console.log(`User prompt (35 frågor + ONNX-scan):`);
console.log(`                       ${pad(userTokens)} tokens`);
console.log(`Bild huvudbild (high): ${pad(IMAGE_TOKENS_HIGH)} tokens`);
console.log(`Bild regioner (×3):    ${pad(IMAGE_TOKENS_HIGH * 3)} tokens`);
console.log(`---`);
console.log(`Typisk input (1 bild): ${pad(inputTokensTypical)} tokens`);
console.log(`Max input (4 bilder):  ${pad(inputTokensMax)} tokens`);

console.log("\n--- OUTPUT (per analys) ---");
console.log(`Mätt JSON (vår demo-payload som AI:n förväntas matcha):`);
console.log(`                       ${pad(outputTokens)} tokens`);
console.log(`max_output_tokens cap: ${pad(32000)} tokens`);

console.log("\n--- TOTAL TOKENS PER ANALYS ---");
console.log(`Typisk: input + output ≈ ${pad(inputTokensTypical + outputTokens)} tokens`);
console.log(`Max:    input + output ≈ ${pad(inputTokensMax + 32000)} tokens (om AI:n fyller cap:en)`);

// Prissättning – aktuell OpenAI prissättning för GPT-5/GPT-5.4-familjen
// Källa: openai.com/pricing (april 2026)
// GPT-5: $1.25/1M input, $10/1M output (cached input billigare men vi räknar utan cache)
// Om GPT-5.4 är samma pris som GPT-5
const PRICE_INPUT_PER_M = 1.25;
const PRICE_OUTPUT_PER_M = 10.0;
const SEK_PER_USD = 10.5;

const inputCost = (inputTokensTypical / 1e6) * PRICE_INPUT_PER_M;
const outputCost = (outputTokens / 1e6) * PRICE_OUTPUT_PER_M;
const totalCostUsd = inputCost + outputCost;
const totalCostSek = totalCostUsd * SEK_PER_USD;

console.log("\n--- KOSTNAD (GPT-5/5.4-prissättning april 2026) ---");
console.log(`Input  ($${PRICE_INPUT_PER_M.toFixed(2)}/1M):     $${inputCost.toFixed(4)}`);
console.log(`Output ($${PRICE_OUTPUT_PER_M.toFixed(2)}/1M):    $${outputCost.toFixed(4)}`);
console.log(`---`);
console.log(`USD per analys:        $${totalCostUsd.toFixed(4)}`);
console.log(`SEK per analys (~$1=${SEK_PER_USD}kr): ${(totalCostSek).toFixed(2)} kr`);

// Marginal
const PRICE_PER_ANALYSIS = 29;
const grossMargin = ((PRICE_PER_ANALYSIS - totalCostSek) / PRICE_PER_ANALYSIS) * 100;
console.log("\n--- AFFÄRSEKONOMI ---");
console.log(`Pris till kund:        ${PRICE_PER_ANALYSIS} kr`);
console.log(`OpenAI-kostnad:        ${totalCostSek.toFixed(2)} kr`);
console.log(`Brutto per analys:     ${(PRICE_PER_ANALYSIS - totalCostSek).toFixed(2)} kr`);
console.log(`Bruttomarginal:        ${grossMargin.toFixed(1)} %`);
console.log(`(Viva Wallet-avgift ~1.6% + 1.50 kr ej inkluderad)\n`);

enc.free();
