#!/usr/bin/env node
/**
 * generate-tier1-landing.js
 *
 * Generates 15 nischade "tier 1" landningssidor (scientific pillars,
 * condition deep-dives, life-stage, myth-busting) in 5 languages.
 *
 * Uses the EXACT same LandingPage type as existing pages-*.ts files so
 * /guide/[slug]/page.tsx picks them up automatically. Zero changes to
 * the template, sitemap logic, or middleware.
 *
 * Usage:
 *   node scripts/generate-tier1-landing.js                    # all, uses cache
 *   node scripts/generate-tier1-landing.js --only=<svSlug>    # single slug
 *   node scripts/generate-tier1-landing.js --force            # bypass cache
 *   node scripts/generate-tier1-landing.js --write-only       # skip LLM, only rebuild TS from cache
 *
 * Output: frontend/src/lib/seo/pages-tier1.ts
 * Cache:  scripts/.cache/tier1/<svSlug>.json
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
const OUT_PATH = path.join(ROOT, "frontend", "src", "lib", "seo", "pages-tier1.ts");
const CACHE_DIR = path.join(__dirname, ".cache", "tier1");

function argValue(name, fallback) {
  const hit = process.argv.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return fallback;
  if (hit === `--${name}`) return true;
  return hit.split("=")[1];
}

const ONLY = typeof argValue("only", false) === "string" ? argValue("only") : null;
const FORCE = process.argv.includes("--force");
const WRITE_ONLY = process.argv.includes("--write-only");

// ---- config: 15 slugs × 5 languages ----

const PAGES = [
  // ── Pillar / science (5) ──
  {
    svSlug: "hudens-mikrobiom",
    enSlug: "skin-microbiome",
    esSlug: "microbioma-de-la-piel",
    deSlug: "hautmikrobiom",
    frSlug: "microbiome-cutane",
    category: "condition",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "fungtastic-mushroom-extract"],
    topic: "Hudens mikrobiom – biljoner mikrober på huden som styr barriär, immunförsvar och inflammation",
    keywords: ["hudmikrobiom", "Staphylococcus epidermidis", "Cutibacterium acnes", "diversitet", "pre- och postbiotika", "antibakteriella rengöringar"],
    productBrief: "DUO-kit (The ONE + I LOVE) stödjer en divers mikroflora istället för att slå ut den. Au Naturel rengör utan att sterilisera. Fungtastic stärker immunförsvaret.",
  },
  {
    svSlug: "tarm-hud-axeln",
    enSlug: "gut-skin-axis",
    esSlug: "eje-intestino-piel",
    deSlug: "darm-haut-achse",
    frSlug: "axe-intestin-peau",
    category: "condition",
    productIds: ["fungtastic-mushroom-extract", "duo-kit"],
    topic: "Tarm-hud-axeln – hur tarmhälsan styr hudens inflammation, akne, eksem och åldrande",
    keywords: ["gut-skin axis", "SIBO", "dysbios", "zonulin", "läckande tarm", "LPS", "kortkedjiga fettsyror", "fermenterat"],
    productBrief: "Fungtastic Mushroom Extract (Chaga + Reishi + Lion's Mane + Cordyceps) stödjer tarmen inifrån. DUO-kit lugnar ytan medan tarmen läker.",
  },
  {
    svSlug: "endocannabinoidsystemet-i-huden",
    enSlug: "endocannabinoid-system-in-skin",
    esSlug: "sistema-endocannabinoide-en-la-piel",
    deSlug: "endocannabinoidsystem-der-haut",
    frSlug: "systeme-endocannabinoide-peau",
    category: "general",
    productIds: ["duo-kit", "duo-ta-da", "ta-da-serum"],
    topic: "Endocannabinoidsystemet (ECS) i huden – hur kroppens eget reglersystem styr talg, inflammation och cellförnyelse",
    keywords: ["ECS", "CB1", "CB2", "anandamid", "2-AG", "c(ut)annabinoid", "homeostas", "klinisk endocannabinoidbrist"],
    productBrief: "DUO-kit och Ta-DA serum matar huden med fytocannabinoider (CBD + CBG) som stödjer ECS utan att slå ut det.",
  },
  {
    svSlug: "hudbarriar-aterstalla",
    enSlug: "restore-skin-barrier",
    esSlug: "restaurar-barrera-cutanea",
    deSlug: "hautbarriere-wiederherstellen",
    frSlug: "restaurer-barriere-cutanee",
    category: "condition",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "ta-da-serum"],
    topic: "Hudbarriär – stratum corneum, ceramider, lipidmatris, TEWL och hur man faktiskt återställer en utarmad barriär",
    keywords: ["stratum corneum", "ceramider", "kolesterol", "fria fettsyror", "TEWL", "over-exfoliation", "murbruk-modellen"],
    productBrief: "Au Naturel tvättar utan att störa lipidmatrisen. DUO-kit + Ta-DA serum tillför ceramider, fytosteroler och cannabinoider som lugnar barriären.",
  },
  {
    svSlug: "inflammation-i-huden",
    enSlug: "skin-inflammation",
    esSlug: "inflamacion-de-la-piel",
    deSlug: "hautentzundung",
    frSlug: "inflammation-de-la-peau",
    category: "condition",
    productIds: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    topic: "Inflammation i huden – den gemensamma drivkraften bakom akne, rosacea, eksem och för tidigt åldrande",
    keywords: ["kronisk låggradig inflammation", "inflammaging", "NF-kB", "cytokiner", "histamin", "omega-3:6-balans"],
    productBrief: "CBD och CBG i DUO-kit och Ta-DA serum modulerar inflammatoriska kaskader. Fungtastic stödjer immunförsvarets balans inifrån.",
  },

  // ── High-intent conditions (5) ──
  {
    svSlug: "hormonell-akne",
    enSlug: "hormonal-acne",
    esSlug: "acne-hormonal",
    deSlug: "hormonelle-akne",
    frSlug: "acne-hormonale",
    category: "condition",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "fungtastic-mushroom-extract"],
    topic: "Hormonell akne – djupa finnar kring haka och käke, mensrelaterade utbrott, PCOS och vuxenakne",
    keywords: ["androgener", "DHT", "insulin", "SHBG", "PCOS", "menscykel", "p-piller", "fyllnadsfinnar"],
    productBrief: "DUO-kit balanserar talg utan att strippa. Au Naturel rengör utan att störa hormonellt hudförsvar. Fungtastic adaptogener stödjer kroppens stressrespons.",
  },
  {
    svSlug: "melasma-behandling",
    enSlug: "melasma-treatment",
    esSlug: "tratamiento-del-melasma",
    deSlug: "melasma-behandlung",
    frSlug: "traitement-melasma",
    category: "condition",
    productIds: ["ta-da-serum", "duo-ta-da", "au-naturel-makeup-remover"],
    topic: "Melasma – graviditetsmask, hyperpigmentering på kinder och panna, solets och hormonernas roll",
    keywords: ["melanocyter", "östrogen", "UV + HEV", "blått ljus", "tranexamsyra", "azelainsyra", "antioxidantförsvar"],
    productBrief: "Ta-DA serum tillför antioxidanter och CBG som dämpar melanogenes. DUO Ta-DA för extra effekt. Au Naturel undviker oljor som ökar ljuskänslighet.",
  },
  {
    svSlug: "seborroisk-dermatit",
    enSlug: "seborrheic-dermatitis",
    esSlug: "dermatitis-seborreica",
    deSlug: "seborrhoisches-ekzem",
    frSlug: "dermatite-seborrheique",
    category: "condition",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "fungtastic-mushroom-extract"],
    topic: "Seborroisk dermatit – flagnande rodnad i T-zon, runt näsa och i hårfäste, jästsvampens roll",
    keywords: ["Malassezia", "jästsvamp", "talgrik hud", "ketokonazol", "zinkpyrithion", "mjukt anti-svamp"],
    productBrief: "DUO-kit lugnar inflammationen utan att mata jästen (få sockerarter, ingen glycerin). Au Naturel rengör utan hård kemi. Fungtastic reglerar immunförsvaret.",
  },
  {
    svSlug: "keratosis-pilaris",
    enSlug: "keratosis-pilaris",
    esSlug: "queratosis-pilar",
    deSlug: "keratosis-pilaris",
    frSlug: "keratose-pilaire",
    category: "condition",
    productIds: ["au-naturel-makeup-remover", "duo-kit", "ta-da-serum"],
    topic: "Keratosis pilaris – 'hönshud' på överarmar, lår och skinkor, keratinpluggar och hudens torra barriär",
    keywords: ["keratinisering", "filaggrin", "mekanisk exfoliering myter", "oljemassage", "mjuk syrapeel"],
    productBrief: "Au Naturel (MCT-olja) mjukar upp keratinpluggar skonsamt. DUO-kit + Ta-DA serum lugnar inflammationen runt folliklarna.",
  },
  {
    svSlug: "aknearr-behandling",
    enSlug: "acne-scars-treatment",
    esSlug: "tratamiento-cicatrices-acne",
    deSlug: "aknenarben-behandlung",
    frSlug: "traitement-cicatrices-acne",
    category: "condition",
    productIds: ["ta-da-serum", "duo-ta-da", "duo-kit"],
    topic: "Aknearr – post-inflammatorisk hyperpigmentering (PIH) vs atrofiska ärr, kollagenremodellering",
    keywords: ["PIH", "PIE", "atrofiska ärr", "ice-pick", "rolling", "kollagen typ I/III", "microneedling-alternativ"],
    productBrief: "Ta-DA serum stödjer kollagenbildning och bleker PIH. DUO Ta-DA för extra hudförnyelse. DUO-kit håller pågående akne i schack.",
  },

  // ── Life-stage (3) ──
  {
    svSlug: "perimenopaus-och-huden",
    enSlug: "perimenopause-and-skin",
    esSlug: "perimenopausia-y-piel",
    deSlug: "perimenopause-und-haut",
    frSlug: "perimenopause-et-peau",
    category: "lifestyle",
    productIds: ["duo-ta-da", "ta-da-serum", "fungtastic-mushroom-extract"],
    topic: "Perimenopaus och huden – torrhet, rynkor, vuxenakne och hudens stora östrogentapp under 40-55",
    keywords: ["östrogenfall", "kollagenförlust 30% på 5 år", "vallningar", "sömnstörning", "progesteron"],
    productBrief: "DUO Ta-DA återfuktar och ger cannabinoid-stöd till en hud i förändring. Ta-DA serum mot torrhet och rynkor. Fungtastic för hormonbalans inifrån.",
  },
  {
    svSlug: "menscykel-och-huden",
    enSlug: "menstrual-cycle-and-skin",
    esSlug: "ciclo-menstrual-y-piel",
    deSlug: "menstruationszyklus-und-haut",
    frSlug: "cycle-menstruel-et-peau",
    category: "lifestyle",
    productIds: ["duo-kit", "ta-da-serum", "au-naturel-makeup-remover"],
    topic: "Huden över menscykeln – follikel-, ovulations-, luteal- och mens-fasen och hur rutinen borde variera",
    keywords: ["follikulär fas", "luteal fas", "PMS-akne", "ovulationsglow", "cyklisk hudvård"],
    productBrief: "DUO-kit och Ta-DA serum är cykelvänliga – inga aktiva som stressar en redan upprörd hud i lutealfasen. Au Naturel alltid mild.",
  },
  {
    svSlug: "huden-efter-graviditet",
    enSlug: "postpartum-skin",
    esSlug: "piel-postparto",
    deSlug: "haut-nach-der-schwangerschaft",
    frSlug: "peau-post-partum",
    category: "lifestyle",
    productIds: ["duo-kit", "ta-da-serum", "au-naturel-makeup-remover"],
    topic: "Huden efter graviditet – hormondropp, håravfall, bristningar, melasma, postpartum-akne och ammingsäkra ingredienser",
    keywords: ["hormonkrasch", "amning", "säkra ingredienser", "cortisol", "sömnbrist", "hudcirkulation"],
    productBrief: "Hela 1753-sortimentet är amningsvänligt. DUO-kit för hormonrelaterade utbrott. Ta-DA serum mot torrhet och trötthetsmärken. Au Naturel for snabba morgnar.",
  },

  // ── Answer-engine bait (2) ──
  {
    svSlug: "retinol-naturliga-alternativ",
    enSlug: "natural-retinol-alternatives",
    esSlug: "alternativas-naturales-retinol",
    deSlug: "natuerliche-retinol-alternativen",
    frSlug: "alternatives-naturelles-retinol",
    category: "howto",
    productIds: ["ta-da-serum", "duo-ta-da", "duo-kit"],
    topic: "Naturliga alternativ till retinol – bakuchiol, cannabinoider, rosehip, vitamin-A från alger – och varför retinol inte alltid är svaret",
    keywords: ["bakuchiol", "retinal vs retinol", "sensitiv hud", "CBD cellförnyelse", "CBG anti-aging", "pro-vitamin A"],
    productBrief: "Ta-DA serum och DUO Ta-DA ger retinol-liknande effekter (cellomsättning, kollagen, jämnhet) utan irritation, torrhet eller ljuskänslighet.",
  },
  {
    svSlug: "minimalistisk-5-stegs-rutin",
    enSlug: "minimalist-5-step-routine",
    esSlug: "rutina-minimalista-5-pasos",
    deSlug: "minimalistische-5-schritte-routine",
    frSlug: "routine-minimaliste-5-etapes",
    category: "howto",
    productIds: ["au-naturel-makeup-remover", "duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    topic: "Minimalistisk 5-stegs hudvårdsrutin – skin streaming, hur färre steg ger bättre hud, morgon- och kvällsversion",
    keywords: ["skin streaming", "skinimalism", "under-cleansing", "barriär-återhämtning", "morgon vs kväll"],
    productBrief: "Morgon: Au Naturel → The ONE → Ta-DA. Kväll: Au Naturel → I LOVE → Ta-DA + Fungtastic oralt. Fem steg, noll kompromiss.",
  },
];

// ---- OpenAI call ----

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
    throw new Error(`OpenAI ${res.status}: ${errText.slice(0, 500)}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim() || "";
  return { text, usage: data.usage || null };
}

// ---- Prompt design ----

function buildSystemPrompt() {
  return `Du är senior copywriter för 1753 SKINCARE – ett svenskt hudvårdsmärke byggt på CBD/CBG från hampa. Tonen är ärlig, varm, rebellisk och skeptisk till konventionell hudvård (aggressiv rengöring, överdriven exfoliering, onödiga aktiva). Aldrig klinisk eller korporativ. Aldrig emojis. Använd korrekt å, ä, ö när du skriver svenska.

Produkterna du får referera till (och bara dessa):
- DUO-kit: The ONE (CBD-ansiktsolja) + I LOVE (CBG-serum) – tillsammans ger full cannabinoidspektrum
- The ONE: CBD + MCT – hudreglerande ansiktsolja
- I LOVE: CBG-serum – lugnande, antibakteriellt
- Ta-DA serum: antioxidant-cocktail med CBG och adaptogener, anti-aging
- DUO Ta-DA: DUO-kit + Ta-DA
- Au Naturel Makeup Remover: MCT-olja, mild rengöring
- Fungtastic Mushroom Extract: Chaga, Reishi, Lion's Mane, Cordyceps – oralt tillskott

Din uppgift: producera en djup, SEO- och LLM-optimerad landningssida i JSON-format.

Strikt JSON-schema per språk:
{
  "metaTitle": "max 65 tecken, inkluderar huvud-keyword och avslutar '| 1753 SKINCARE'",
  "metaDescription": "max 160 tecken, säljande, innehåller primär keyword",
  "kicker": "kort kategori-etikett, 1-3 ord, versaliserat som substantiv",
  "h1": "emotionell H1, gärna bindestreck-format ('X – varför det funkar')",
  "lead": "2-4 meningar som sätter tonen, 30-60 ord",
  "problemTitle": "H2 som ställer en fråga eller utmanar",
  "problemBody": "3 paragrafer i HTML: <p>...</p><p>...</p><p>...</p>. Innehåller vetenskap (nämn mekanism, studier där det passar), konfronterar konventionell dogma, bjuder in läsaren. Totalt 180-260 ord.",
  "tipsTitle": "H2 som lovar konkreta råd ('Fem vanor som...', 'Sju sätt att...')",
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
- Akta anpassning – inget kulturellt skorrande i översättningen

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
- sv: den svenska termen som matchar "${page.svSlug.replace(/-/g, " ")}"
- en: den engelska termen som matchar "${page.enSlug.replace(/-/g, " ")}"
- es: den spanska termen som matchar "${page.esSlug.replace(/-/g, " ")}"
- de: den tyska termen som matchar "${page.deSlug.replace(/-/g, " ")}"
- fr: den franska termen som matchar "${page.frSlug.replace(/-/g, " ")}"

VIKTIGT: Producera ÄKTA översättningar per språk – inte maskinöversättningar. Varje språk ska kännas skrivet av en native copywriter. Kulturella exempel får gärna skilja (mat, klimat, vardagsscenarion) men produkter och vetenskap ska vara konsekvent.

Returnera ETT JSON-objekt:
{
  "sv": { ...LandingPageContent... },
  "en": { ...LandingPageContent... },
  "es": { ...LandingPageContent... },
  "de": { ...LandingPageContent... },
  "fr": { ...LandingPageContent... }
}`;
}

// ---- Validation ----

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

function validateContent(obj, locale, slug) {
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
    errors.push(`${locale}.tips must have >=3 entries`);
  }
  if (c.tips && Array.isArray(c.tips)) {
    c.tips.forEach((t, i) => {
      if (!t.title || !t.body) errors.push(`${locale}.tips[${i}] missing title/body`);
    });
  }
  if (c.faq && (!Array.isArray(c.faq) || c.faq.length < 3)) {
    errors.push(`${locale}.faq must have >=3 entries`);
  }
  if (c.faq && Array.isArray(c.faq)) {
    c.faq.forEach((f, i) => {
      if (!f.q || !f.a) errors.push(`${locale}.faq[${i}] missing q/a`);
    });
  }
  return errors;
}

// ---- Per-slug generation with cache ----

async function generateForSlug(page) {
  const cachePath = path.join(CACHE_DIR, `${page.svSlug}.json`);
  if (!FORCE && fs.existsSync(cachePath)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
      if (cached.sv && cached.en && cached.es && cached.de && cached.fr) {
        console.log(`[cache] ${page.svSlug}`);
        return cached;
      }
    } catch {
      // fall through
    }
  }

  console.log(`[gen]   ${page.svSlug} ...`);
  const messages = [
    { role: "system", content: buildSystemPrompt() },
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
        allErrors.push(...validateContent(parsed, loc, page.svSlug));
      }
      if (allErrors.length) {
        throw new Error(`validation failed: ${allErrors.slice(0, 5).join("; ")}`);
      }

      fs.mkdirSync(CACHE_DIR, { recursive: true });
      fs.writeFileSync(cachePath, JSON.stringify(parsed, null, 2), "utf-8");
      console.log(
        `  ok (in=${usage?.prompt_tokens || "?"}, out=${usage?.completion_tokens || "?"})`
      );
      return parsed;
    } catch (err) {
      lastErr = err;
      console.warn(`  attempt ${attempt} failed: ${err.message}`);
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  throw lastErr;
}

// ---- Writer: turn cached content into pages-tier1.ts ----

function writeTsFile(allContent) {
  const entries = PAGES.map((page) => {
    const c = allContent[page.svSlug];
    if (!c) throw new Error(`no content for ${page.svSlug}`);
    return {
      svSlug: page.svSlug,
      enSlug: page.enSlug,
      esSlug: page.esSlug,
      deSlug: page.deSlug,
      frSlug: page.frSlug,
      category: page.category,
      productIds: page.productIds,
      sv: c.sv,
      en: c.en,
      es: c.es,
      de: c.de,
      fr: c.fr,
    };
  });

  const header = `import type { LandingPage } from "./types";

/**
 * Tier 1 niche landing pages – scientific pillars, high-intent conditions,
 * life-stage content and answer-engine bait. Generated by
 * scripts/generate-tier1-landing.js; edit via regenerating with --only=<slug>.
 */
export const TIER1_PAGES: LandingPage[] = `;

  const body = JSON.stringify(entries, null, 2);
  const file = `${header}${body};\n`;
  fs.writeFileSync(OUT_PATH, file, "utf-8");
  console.log(`\nwrote ${OUT_PATH} (${entries.length} pages)`);
}

// ---- Main ----

async function main() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const pagesToProcess = ONLY ? PAGES.filter((p) => p.svSlug === ONLY) : PAGES;
  if (ONLY && !pagesToProcess.length) {
    console.error(`unknown slug: ${ONLY}`);
    process.exit(1);
  }

  const allContent = {};

  if (!WRITE_ONLY) {
    for (const page of pagesToProcess) {
      try {
        allContent[page.svSlug] = await generateForSlug(page);
      } catch (err) {
        console.error(`FAILED ${page.svSlug}: ${err.message}`);
        process.exitCode = 1;
      }
    }
  }

  // Always rebuild the full TS file from whatever exists in cache (so a single --only run still produces a valid file)
  for (const page of PAGES) {
    if (allContent[page.svSlug]) continue;
    const cachePath = path.join(CACHE_DIR, `${page.svSlug}.json`);
    if (fs.existsSync(cachePath)) {
      try {
        allContent[page.svSlug] = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
      } catch {
        // ignore
      }
    }
  }

  const missing = PAGES.filter((p) => !allContent[p.svSlug]).map((p) => p.svSlug);
  if (missing.length) {
    console.warn(`\nMissing content for ${missing.length} slug(s): ${missing.join(", ")}`);
    console.warn("Skipping TS write until all 15 are cached.");
    return;
  }

  writeTsFile(allContent);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
