#!/usr/bin/env node
/**
 * generate-skin-newsletters.js
 *
 * Generates personalised weekly newsletters per skin condition using GPT-5.4,
 * then sends them via the segmented broadcast endpoint.
 *
 * Conditions: acne, rosacea, eczema, dryness, hyperpigmentation, sun_damage,
 *             psoriasis, dermatitis, fungal + "general" (untagged subscribers).
 *
 * Usage:
 *   node scripts/generate-skin-newsletters.js              # generate + send
 *   node scripts/generate-skin-newsletters.js --dry-run     # generate only
 *   node scripts/generate-skin-newsletters.js --preview     # print to stdout
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VALYU_API_KEY = process.env.VALYU_API_KEY;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "1753-admin-key";
const BACKEND_URL = process.env.BACKEND_URL || process.env.BASE_URL || "https://api.1753skin.com";

const isDryRun = process.argv.includes("--dry-run");
const isPreview = process.argv.includes("--preview");

if (!OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY kravs.");
  process.exit(1);
}

const STATE_PATH = path.join(__dirname, "..", "data", "skin-newsletter-state.json");

// ---- Skin conditions with Swedish names and content themes ----

const SKIN_CONDITIONS = {
  acne: {
    sv: "Akne",
    themes: [
      "Tarmhälsa och akne -- gut-skin axis",
      "Hormoner och akne: varför det bryter ut just nu",
      "Anti-inflammatorisk kost mot akne",
      "Stress och akne: den dolda kopplingen",
      "CBD och akne: vad forskningen visar",
      "Sömnens roll for aknebenägen hud",
      "Hudens mikrobiom och akne",
      "Rengöring utan att förstöra hudbarriären",
      "Endocannabinoidsystemet och talgproduktion",
      "Naturliga ingredienser mot inflammatorisk akne",
    ],
    products: ["duo-kit", "au-naturel-makeup-remover", "ta-da-serum"],
  },
  rosacea: {
    sv: "Rosacea",
    themes: [
      "Rosacea-triggers: vad forskningen egentligen visar",
      "CBD och rosacea: anti-inflammatorisk potential",
      "Tarmflora och rosacea",
      "Stresshantering for rosacea-hud",
      "Hudbarriären vid rosacea: stärka, inte angripa",
      "Kost och rosacea: livsmedel att utforska",
      "Hudens endocannabinoidsystem och rodnad",
      "Solskydd vid rosacea utan irritation",
      "Minimalistisk hudvård vid rosacea",
      "Mikrobiom-obalans och rosacea",
    ],
    products: ["duo-kit", "ta-da-serum"],
  },
  eczema: {
    sv: "Eksem",
    themes: [
      "Eksem och hudens barriärfunktion",
      "CBD for eksem: anti-klåda och anti-inflammation",
      "Tarm-hud-axeln vid eksem",
      "Eksem och stress: en ond cirkel",
      "Fettsyror och eksem: vad huden behöver",
      "Sömnkvalitet och eksemskov",
      "Mikrobiom och eksem: nya rön",
      "Minimera triggers: praktiska vardagstips",
      "CBG och hudinflammation",
      "Endocannabinoidsystemet och klåda",
    ],
    products: ["duo-kit", "ta-da-serum"],
  },
  dryness: {
    sv: "Torr hud",
    themes: [
      "Varför din hud är torr -- orsaker bortom produkter",
      "Fettsyror och hudbarriären",
      "CBD-olja for djup återfuktning",
      "Vinterhud: så stärker du barriären",
      "Kost for fuktad hud inifrån",
      "Hudens ceramider och hur du stöttar dem",
      "Vattenintag och hud: myt vs verklighet",
      "Sömn och hudens nattliga reparation",
      "Layering-teknik for torr hud",
      "Omega-3, omega-6 och hudbalans",
    ],
    products: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
  },
  hyperpigmentation: {
    sv: "Hyperpigmentering",
    themes: [
      "Melaninproduktion: varför fläckar uppstår",
      "Anti-inflammatorisk approach mot pigmentfläckar",
      "CBD och hyperpigmentering: lovande forskning",
      "Solskydd: den viktigaste åtgärden",
      "Kost och antioxidanter for jämnare hudton",
      "Post-inflammatorisk hyperpigmentering: tålamod lönar sig",
      "Vitamin C vs kemiska peelingar: vad fungerar?",
      "Hudens omsättningscykel och pigment",
      "Hormonell pigmentering: melasma",
      "Niacinamid och naturliga alterntiv",
    ],
    products: ["ta-da-serum", "duo-kit"],
  },
  sun_damage: {
    sv: "Solskadad hud",
    themes: [
      "Solskador: vad som händer under ytan",
      "Antioxidanter for solskadad hud",
      "CBD och hudcellsreparation",
      "Kost som stödjer hudens solskydd",
      "Kollagenproduktion och solskador",
      "Fria radikaler: kroppens oxidativa stress",
      "Solskydd året runt i Norden",
      "Reparera vs förebygga: bägge behövs",
      "Endocannabinoidsystemet och UV-stress",
      "Retinol-alternativ: naturliga vägar till cellförnyelse",
    ],
    products: ["ta-da-serum", "duo-kit"],
  },
  psoriasis: {
    sv: "Psoriasis",
    themes: [
      "Psoriasis och immunsystemet: vad vi vet",
      "CBD och psoriasis: endocannabinoid-kopplingen",
      "Tarmen och psoriasis: den överlappande inflammationen",
      "Stressreduktion vid psoriasis",
      "Kost och psoriasis: anti-inflammatorisk approach",
      "Hudbarriären vid psoriasis",
      "Psoriasis och sömnkvalitet",
      "Naturliga oljor som stöd vid psoriasis",
      "Mikrobiom-forskning och psoriasis",
      "Fettsyrebalans och kronisk inflammation",
    ],
    products: ["duo-kit", "ta-da-serum"],
  },
  dermatitis: {
    sv: "Dermatit",
    themes: [
      "Kontaktdermatit vs atopisk dermatit: skillnaden",
      "CBD for inflammation och klåda",
      "Hudbarriären: din första försvarslinje",
      "Triggers i vardagen: rengöring, textilier, produkter",
      "Tarm-hud-axeln vid dermatit",
      "Minimalistisk rutin for irriterad hud",
      "Endocannabinoidsystemet och hudinflammation",
      "Stressens roll vid dermatit-skov",
      "Ceramider och naturliga lipider",
      "Probiotika for huden: yttre och inre",
    ],
    products: ["duo-kit", "au-naturel-makeup-remover"],
  },
  fungal: {
    sv: "Svampinfektion",
    themes: [
      "Hudens mikrobiom och svampbalans",
      "Malassezia: vad det är och varför det spelar roll",
      "Svampsäkra hudvårdsrutiner",
      "Tarmhälsa och hudsvamp",
      "CBD:s antifungala egenskaper",
      "Kost som stödjer mikrobiombalans",
      "Svampakne vs bakteriell akne: så skiljer du dem",
      "Reishi och medicinella svampar for immunförsvaret",
      "Fukt, värme och svampväxt: förebygga skov",
      "Probiotika och svampbalans",
    ],
    products: ["fungtastic-mushroom-extract", "duo-kit"],
  },
  general: {
    sv: "Allmän hudvård",
    themes: [
      "Holistisk hudvård: mer än produkter",
      "Endocannabinoidsystemet: hudens inre balans",
      "Sömn och hud: den mest underskattade faktorn",
      "Kost for bättre hud: konkreta tips",
      "Stress och hud: bryt mönstret",
      "Hudens mikrobiom: din osynliga allierade",
      "CBD och CBG: vad är skillnaden?",
      "Tarm-hud-axeln: varför magen påverkar ansiktet",
      "Minimalism i hudvård: mindre är mer",
      "Säsongsanpassa din hudvård",
    ],
    products: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
  },
};

const PRODUCTS_MAP = {
  "duo-kit": { name: "DUO-kit", slug: "duo-kit", tagline: "The ONE + I LOVE i ett kit" },
  "duo-ta-da": { name: "DUO TA-DA", slug: "duo-ta-da", tagline: "The ONE + Ta-Da Serum" },
  "ta-da-serum": { name: "Ta-Da Serum", slug: "ta-da-serum", tagline: "CBG-serum for lyster och balans" },
  "au-naturel-makeup-remover": { name: "Au Naturel Makeup Remover", slug: "au-naturel-makeup-remover", tagline: "Naturlig rengöring med CBD" },
  "fungtastic-mushroom-extract": { name: "Fungtastic Mushroom Extract", slug: "fungtastic-mushroom-extract", tagline: "Svampextrakt for tarmhälsa" },
};

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
      temperature: 0.85,
      max_completion_tokens: 2500,
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
  return { weekCounter: 0, lastRun: null, conditionThemeIndex: {} };
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
}

function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "var";
  if (month >= 5 && month <= 7) return "sommar";
  if (month >= 8 && month <= 10) return "host";
  return "vinter";
}

function greenButton(text, href) {
  return `<div style="text-align:center;margin:28px 0">
    <a href="${href}" style="display:inline-block;background:#108474;color:#fff;padding:14px 32px;border-radius:980px;font-size:15px;font-weight:600;text-decoration:none">${text}</a>
  </div>`;
}

// ---- System prompt ----

function buildSystemPrompt(condition, conditionSv) {
  return `Du ar copywriter for 1753 SKINCARE, ett svenskt hudvardmarke med CBD/CBG-baserade produkter.

Ton: arlig, varm, rebellisk -- aldrig klinisk eller korporativ. Du skriver som en kunnig van.

Du skriver nu for lassare som har ${conditionSv.toLowerCase()} som sitt primara hudtillstand.
Allt innehall ska vara relevant, vetenskapligt grundat och relaterat till just ${conditionSv.toLowerCase()}.

Regler:
- Skriv pa svenska
- Anvand aldrig emojis
- Max 500 ord (exkl. HTML-taggar)
- Inkludera kallhanvisningar (lank + titel) for faktapastaenden nar kallor finns
- HTML-formatering: <h2>, <p>, <strong>, <em>, <a>, <blockquote>, <ul>/<li>
- Styla: inline CSS med font-family:-apple-system,sans-serif; font-size:15px; line-height:1.7; color:#515151
- Rubriker: font-size:22px; font-weight:700; color:#1d1d1f
- Lankar: color:#108474; text-decoration:underline
- Blockquote: border-left:3px solid #108474; padding-left:16px; font-style:italic

Strukturera nyhetsbrevet:
1. Veckans insikt (huvuddel -- utbildande, intressant, relaterbart)
2. Livsstilstips (ett konkret tips kopplat till amnet)
3. "Visste du att..." (kort avslutande fakta)

Svara ENBART med JSON:
{
  "subject": "Amnesrad (max 60 tecken, relevant for ${conditionSv.toLowerCase()})",
  "preheader": "Forhandsgranskning (max 100 tecken)",
  "htmlBody": "HTML-innehall enligt stilreglerna ovan",
  "sources": [{"title": "...", "url": "..."}]
}`;
}

// ---- Main ----

async function main() {
  console.log("=== Segmenterat hudtillstandsnyhetsbrev ===\n");

  const state = loadState();
  const weekNum = state.weekCounter + 1;
  const season = getCurrentSeason();
  const isSelling = weekNum % 4 === 0;

  console.log(`Vecka #${weekNum} | Sasong: ${season} | Typ: ${isSelling ? "saljande" : "vardehojande"}\n`);

  // Fetch active segments from backend
  let activeSegments;
  try {
    const fetch = (await import("node-fetch")).default;
    const segRes = await fetch(`${BACKEND_URL}/api/newsletter/skin-segments?adminKey=${ADMIN_API_KEY}`);
    if (segRes.ok) {
      const segData = await segRes.json();
      activeSegments = segData.segments.map(s => s.skin_condition);
      console.log(`Aktiva segment: ${activeSegments.join(", ")} (${segData.tagged} taggade / ${segData.totalActive} totalt)`);
      if (segData.untagged > 0) activeSegments.push("general");
    } else {
      activeSegments = Object.keys(SKIN_CONDITIONS);
    }
  } catch {
    activeSegments = Object.keys(SKIN_CONDITIONS);
  }

  if (activeSegments.length === 0) {
    activeSegments = ["general"];
  }

  console.log(`\nGenererar ${activeSegments.length} nyhetsbrev...\n`);

  const newsletters = [];

  for (const condition of activeSegments) {
    const config = SKIN_CONDITIONS[condition] || SKIN_CONDITIONS.general;
    const themeIdx = (state.conditionThemeIndex[condition] || 0) % config.themes.length;
    const theme = config.themes[themeIdx];

    console.log(`[${config.sv}] Tema: "${theme}"`);

    // Search for supporting sources
    const searchQuery = `${theme} ${condition} skincare research`;
    const sources = await searchValyu(searchQuery);
    console.log(`  ${sources.length} kallor hittade`);

    const sourcesContext = sources.length > 0
      ? "Externa kallor:\n" + sources.map((s, i) => `${i + 1}. "${s.title}" -- ${s.url}\n   ${s.snippet}`).join("\n\n")
      : "Inga externa kallor -- anvand din kunskap.";

    let productContext = "";
    if (isSelling) {
      const productSlug = config.products[weekNum % config.products.length];
      const product = PRODUCTS_MAP[productSlug];
      if (product) {
        productContext = `\nVav in produkten naturligt (inte pushigt):
Produkt: ${product.name} -- ${product.tagline}
Lank: https://www.1753skin.com/produkter/${product.slug}
Inkludera en CTA-knapp i HTML med texten "Utforska ${product.name}" som lankar till produktsidan.
CTA-knapp stil: display:inline-block; background:#108474; color:#fff; padding:14px 32px; border-radius:980px; font-size:15px; font-weight:600; text-decoration:none`;
      }
    }

    const systemPrompt = buildSystemPrompt(condition, config.sv);
    const userMessage = `Tema for veckan: "${theme}"
Sasong: ${season}
${isSelling ? "Typ: SALJANDE -- vav in produkten naturligt" : "Typ: VARDEHOJANDE -- dela kunskap, inga produkter"}

${sourcesContext}
${productContext}

Generera nyhetsbrevet nu.`;

    try {
      const raw = await callOpenAI([
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ]);

      const nl = JSON.parse(raw);

      // Append source footer
      const sourceFooter = (nl.sources || []).length > 0
        ? `<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e6e6e6">
             <p style="font-size:12px;color:#766a62;margin:0 0 8px">Kallor:</p>
             <ul style="font-size:12px;color:#766a62;padding-left:16px;margin:0">
               ${nl.sources.map(s => `<li><a href="${s.url}" style="color:#108474">${s.title}</a></li>`).join("")}
             </ul>
           </div>`
        : "";

      // Append analysis CTA
      const analysisCta = `<div style="margin-top:32px;padding:20px;background:#f5f5f7;border-radius:16px;text-align:center">
        <p style="font-size:14px;color:#515151;margin:0 0 12px">Har din hud forandrats sedan sist? Gor en ny analys och se din utveckling.</p>
        ${greenButton("Gor gratis hudanalys", "https://www.1753skin.com/hudanalys")}
      </div>`;

      const fullHtml = nl.htmlBody + sourceFooter + analysisCta;

      newsletters.push({
        skinCondition: condition,
        subject: nl.subject,
        html: fullHtml,
      });

      console.log(`  OK: "${nl.subject}"\n`);
    } catch (err) {
      console.error(`  FEL for ${condition}: ${err.message}\n`);
    }

    // Advance theme index
    state.conditionThemeIndex[condition] = themeIdx + 1;
  }

  // Update state
  state.weekCounter = weekNum;
  state.lastRun = new Date().toISOString();
  saveState(state);

  if (newsletters.length === 0) {
    console.log("Inga nyhetsbrev genererades.");
    return;
  }

  console.log(`\n${newsletters.length} nyhetsbrev genererade.`);

  if (isPreview) {
    for (const nl of newsletters) {
      console.log(`\n--- ${nl.skinCondition}: ${nl.subject} ---\n`);
      console.log(nl.html);
    }
    return;
  }

  if (isDryRun) {
    const previewDir = path.join(__dirname, "..", "data");
    for (const nl of newsletters) {
      const fp = path.join(previewDir, `skin-newsletter-${nl.skinCondition}.html`);
      fs.writeFileSync(fp, nl.html, "utf-8");
    }
    console.log(`[DRY RUN] Sparade i data/-mappen.`);
    return;
  }

  // Send via segmented broadcast endpoint
  console.log("\nSkickar via segmenterad broadcast...");
  const fetch = (await import("node-fetch")).default;
  const broadcastRes = await fetch(`${BACKEND_URL}/api/newsletter/broadcast-segmented`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newsletters, adminKey: ADMIN_API_KEY }),
  });

  if (!broadcastRes.ok) {
    const errText = await broadcastRes.text();
    console.error(`Broadcast misslyckades (${broadcastRes.status}): ${errText}`);
    process.exit(1);
  }

  const result = await broadcastRes.json();
  console.log("\nResultat:");
  for (const r of result.results) {
    console.log(`  ${r.skinCondition}: ${r.sent}/${r.total} skickade`);
  }
  console.log("\nKlart!");
}

main().catch((err) => {
  console.error("Fel:", err);
  process.exit(1);
});
