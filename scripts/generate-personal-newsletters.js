#!/usr/bin/env node
/**
 * generate-personal-newsletters.js
 *
 * Generates unique, per-individual newsletters for subscribers who have
 * completed a skin analysis. Each mail is built from:
 *   - the subscriber's most recent skin_analyses row (metrics + answers)
 *   - relevant excerpts from data/ebook-segments.json
 *   - fresh PubMed-style abstracts via Valyu (if VALYU_API_KEY is set)
 * ...fed through GPT-5.4-mini for cost-efficiency.
 *
 * Defaults to DRY-RUN. No mail is actually sent unless --send is passed.
 * Every generated mail (dry or real) is logged to personal_newsletters.
 *
 * Usage:
 *   node scripts/generate-personal-newsletters.js                    # dry-run, 10 subs
 *   node scripts/generate-personal-newsletters.js --limit=25         # dry-run, 25 subs
 *   node scripts/generate-personal-newsletters.js --days=120         # analysis age limit
 *   node scripts/generate-personal-newsletters.js --cooldown=7       # per-sub cooldown
 *   node scripts/generate-personal-newsletters.js --email=foo@bar    # only this address
 *   node scripts/generate-personal-newsletters.js --send             # actually send
 *
 * Never touches checkout, payment, analysis endpoints, or transactional mail.
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VALYU_API_KEY = process.env.VALYU_API_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MODEL = process.env.OPENAI_MODEL_NEWSLETTER || "gpt-5.4-mini";
const EMAIL_FROM_INFO = process.env.EMAIL_FROM_INFO || "info@1753skin.com";
const BASE_URL = process.env.BASE_URL || "https://api.1753skin.com";
const SITE_URL = "https://www.1753skin.com";

if (!OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY krävs.");
  process.exit(1);
}

// ---- args ----

function argValue(name, fallback) {
  const hit = process.argv.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return fallback;
  if (hit === `--${name}`) return true;
  return hit.split("=")[1];
}

const SEND = process.argv.includes("--send");
const DRY_RUN = !SEND;
const LIMIT = parseInt(argValue("limit", SEND ? "100" : "10"), 10);
const DAYS = parseInt(argValue("days", "180"), 10);
const COOLDOWN = parseInt(argValue("cooldown", "6"), 10);
const ONLY_EMAIL = typeof argValue("email", false) === "string" ? argValue("email") : null;

// ---- lightweight requires (loaded lazily to keep script fast on abort) ----

const db = require(path.join(__dirname, "..", "db.js"));

// ---- ebook knowledge ----

const SEGMENTS_PATH = path.join(__dirname, "..", "data", "ebook-segments.json");
let EBOOK_SEGMENTS = [];
try {
  if (fs.existsSync(SEGMENTS_PATH)) {
    EBOOK_SEGMENTS = JSON.parse(fs.readFileSync(SEGMENTS_PATH, "utf-8"));
  }
} catch (err) {
  console.warn("[Ebook] Kunde inte läsa ebook-segments.json:", err.message);
}

// Simple keyword-based segment retrieval. Cheap, deterministic, good enough
// until we invest in embeddings. Scores each segment by how many focus-area
// tokens appear in its tags, title and summary.
function findRelevantEbookSegments(focusAreas, count = 2) {
  if (!EBOOK_SEGMENTS.length || !focusAreas.length) return [];

  const tokens = focusAreas
    .flatMap((f) => String(f || "").toLowerCase().split(/[\s,/-]+/))
    .filter((t) => t.length > 3);

  const scored = EBOOK_SEGMENTS.map((seg) => {
    const haystack = [
      ...(seg.tags || []),
      seg.title || "",
      seg.summary || "",
    ]
      .join(" ")
      .toLowerCase();
    const score = tokens.reduce(
      (acc, t) => (haystack.includes(t) ? acc + 1 : acc),
      0
    );
    return { seg, score };
  });

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((x) => x.seg);
}

// ---- focus-area extraction from skin analysis ----

// Heuristic: find the worst 1-2 metrics from the analysis, and combine with
// 1 lifestyle concern flagged by the quiz answers. Falls back to skin_condition.
function extractFocusAreas(analysis, skinCondition) {
  const focuses = [];

  const result = analysis?.result || {};
  const answers = analysis?.answers || {};

  // Metrics: look for low scores (0-100 where higher = healthier) in common shapes
  const metrics = result.metrics || result.skinMetrics || {};
  const metricEntries = Object.entries(metrics)
    .filter(([, v]) => typeof v === "number")
    .sort((a, b) => a[1] - b[1]);

  for (const [key, value] of metricEntries.slice(0, 2)) {
    if (value < 65) focuses.push(`${humanizeMetric(key)} (score ${Math.round(value)})`);
  }

  // Primary condition
  const primary = result.primaryCondition?.condition || skinCondition;
  if (primary && primary !== "normal" && !focuses.some((f) => f.toLowerCase().includes(primary))) {
    focuses.push(primary);
  }

  // Lifestyle concern from answers
  const stress = Number(answers.stress || answers.stressLevel);
  const sleepHours = Number(answers.sleep || answers.sleepHours);
  if (Number.isFinite(stress) && stress >= 7) focuses.push("hög stressnivå");
  if (Number.isFinite(sleepHours) && sleepHours > 0 && sleepHours < 7) {
    focuses.push(`sömnbrist (${sleepHours}h/natt)`);
  }
  if (typeof answers.diet === "string" && /socker|processad|snabbmat/i.test(answers.diet)) {
    focuses.push("tarm-hud-axeln");
  }

  // Guarantee at least one focus area to avoid empty prompts
  if (!focuses.length) {
    focuses.push(skinCondition || "övergripande hudbalans");
  }

  return focuses.slice(0, 3);
}

function humanizeMetric(key) {
  const map = {
    hydration: "fuktbalans",
    sebum: "talgproduktion",
    barrier: "hudbarriärens integritet",
    redness: "rodnad",
    pigmentation: "pigmentering",
    elasticity: "elasticitet",
    pores: "porer",
    texture: "textur",
    wrinkles: "linjer och rynkor",
    clarity: "klarhet",
    radiance: "lyster",
    evenness: "jämnhet",
    sensitivity: "känslighet",
    inflammation: "inflammation",
    skinAge: "biologisk hudålder",
  };
  return map[key] || key.replace(/([A-Z])/g, " $1").toLowerCase();
}

// ---- LLM ----

async function callOpenAIJson(messages) {
  const fetch = (await import("node-fetch")).default;
  const body = {
    model: MODEL,
    messages,
    temperature: 0.8,
    max_completion_tokens: 1800,
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
    throw new Error(`OpenAI ${res.status}: ${errText.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim() || "";
  return { text, usage: data.usage || null };
}

// ---- Research (Valyu / PubMed proxy) ----

async function fetchResearch(focusAreas) {
  if (!VALYU_API_KEY) return [];
  const { Valyu } = require("valyu-js");
  const client = new Valyu({ apiKey: VALYU_API_KEY });
  const focus = focusAreas.slice(0, 2).join(" ");
  const query = `${focus} skin dermatology pubmed 2024`;
  try {
    const response = await client.search({ query, searchType: "all", maxNumResults: 3 });
    if (!response?.results) return [];
    return response.results.map((r) => ({
      title: r.title || "",
      url: r.url || "",
      snippet: (r.content || r.snippet || "").slice(0, 360),
    }));
  } catch (err) {
    console.warn("[Valyu] sökning misslyckades:", err.message);
    return [];
  }
}

// ---- System prompt ----

function buildSystemPrompt(locale) {
  const intro = {
    sv: "Du är copywriter för 1753 SKINCARE, ett svenskt hudvårdsmärke med CBD/CBG-baserade produkter.",
    en: "You are a copywriter for 1753 SKINCARE, a Swedish skincare brand with CBD/CBG-based products.",
    es: "Eres copywriter para 1753 SKINCARE, una marca sueca de skincare con productos a base de CBD/CBG.",
    de: "Du bist Copywriter für 1753 SKINCARE, eine schwedische Hautpflege-Marke mit CBD/CBG-Produkten.",
    fr: "Tu es copywriter pour 1753 SKINCARE, une marque suédoise de soins à base de CBD/CBG.",
  }[locale] || locale;

  return `${intro}

Ton: ärlig, varm, rebellisk, aldrig klinisk eller korporativ. Skriv som en kunnig vän.

Detta är ett HELT PERSONLIGT nyhetsbrev till EN specifik kund, baserat på deras senaste hudanalys.
Tilltala mottagaren direkt med förnamn. Referera konkret till deras specifika fokusområden.
Lägg inte in alla metrikerna som en lista - plocka ut 1-2 som är mest relevanta och prata om DEM.

Regler:
- Skriv på ${locale === "sv" ? "svenska" : locale === "en" ? "engelska" : locale === "es" ? "spanska" : locale === "de" ? "tyska" : "franska"}
- Använd aldrig emojis
- Max 380 ord (exkl. HTML-taggar)
- Inkludera källor när du refererar till forskning (endast om du faktiskt fått abstracts)
- Lova inget du inte kan belägga
- Aldrig "du borde" eller "du måste" - inbjudande ton
- HTML-formatering: <h2>, <p>, <strong>, <em>, <a>, <blockquote>, <ul>/<li>
- Styla: font-family inheritas från wrapper; font-size:15px; line-height:1.7; color:#515151
- Rubriker: font-size:22px; font-weight:700; color:#1d1d1f
- Länkar: color:#108474; text-decoration:underline
- Blockquote: border-left:3px solid #108474; padding-left:16px; font-style:italic

Strukturera nyhetsbrevet:
1. Kort öppning som visar att du sett just deras analys (2-3 meningar)
2. En djupare insikt om ett av deras fokusområden (kopplat till e-boken eller forskningen om sådan ges)
3. Ett konkret livsstilstips (konkret, idag-genomförbart)
4. En kort avslutning som inbjuder till att göra en ny analys om 4-8 veckor

Svara ENBART med JSON:
{
  "subject": "Ämnesrad som refererar till deras fokusområde (max 65 tecken)",
  "preheader": "Förhandsgranskning (max 110 tecken)",
  "htmlBody": "HTML-innehåll enligt stilreglerna ovan",
  "sources": [{"title": "...", "url": "..."}]
}`;
}

function buildUserMessage({ firstName, focusAreas, metrics, skinAge, fitzpatrick, primary, ebookSegments, research }) {
  const ebookBlock = ebookSegments.length
    ? "Relevanta kapitel från e-boken:\n" +
      ebookSegments
        .map((s) => `[${s.title}] ${s.summary.slice(0, 500)}`)
        .join("\n\n")
    : "Inga matchande bokavsnitt - använd din generella kunskap.";

  const researchBlock = research.length
    ? "Forskningsreferenser (använd bara om relevant, ge källor):\n" +
      research.map((r, i) => `${i + 1}. "${r.title}" - ${r.url}\n   ${r.snippet}`).join("\n\n")
    : "Inga färska forskningsreferenser denna gång.";

  const metricsBlock = metrics && Object.keys(metrics).length
    ? "Mätvärden från analysen (0-100, högre = friskare):\n" +
      Object.entries(metrics)
        .map(([k, v]) => `- ${k}: ${typeof v === "number" ? Math.round(v) : v}`)
        .join("\n")
    : "Inga detaljerade mätvärden.";

  return `Mottagare: ${firstName || "(förnamn saknas - undvik då tilltal med förnamn)"}
Deras fokusområden (från senaste analys): ${focusAreas.join(", ")}
Primär hudbild: ${primary || "ospecificerat"}
Biologisk hudålder: ${skinAge || "okänd"}
Fitzpatrick: ${fitzpatrick || "okänd"}

${metricsBlock}

${ebookBlock}

${researchBlock}

Generera det personliga nyhetsbrevet nu.`;
}

// ---- HTML shell (mirrors server's emailWrapper) ----

function emailWrapper(content, unsubscribeUrl) {
  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1d1d1f;padding:0 16px">
    <div style="text-align:center;padding:32px 0 8px">
      <img src="${SITE_URL}/1753.png" alt="1753 SKINCARE" width="48" height="48" style="border-radius:12px"/>
    </div>
    ${content}
    <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e6e6e6;text-align:center">
      <p style="font-size:12px;color:#766a62;line-height:1.6;margin:0">
        1753 SKINCARE &ndash; Holistisk hudvård med CBD och CBG<br>
        <a href="${SITE_URL}" style="color:#108474">www.1753skin.com</a>
      </p>
      ${unsubscribeUrl ? `<p style="margin-top:12px;font-size:11px"><a href="${unsubscribeUrl}" style="color:#999;text-decoration:underline">Avprenumerera</a></p>` : ""}
    </div>
  </div>`;
}

function analysisCta(locale) {
  const label = {
    sv: "Gör en ny hudanalys",
    en: "Run a fresh skin analysis",
    es: "Haz un nuevo análisis",
    de: "Neue Hautanalyse starten",
    fr: "Lancer une nouvelle analyse",
  }[locale] || "Gör en ny hudanalys";

  const localePath = locale === "sv" ? "" : `/${locale}`;
  return `<div style="margin-top:32px;padding:20px;background:#f5f5f7;border-radius:16px;text-align:center">
    <p style="font-size:14px;color:#515151;margin:0 0 12px">Redo att se hur din hud utvecklats? Kör en ny analys.</p>
    <a href="${SITE_URL}${localePath}/hudanalys" style="display:inline-block;background:#108474;color:#fff;padding:14px 32px;border-radius:980px;font-size:15px;font-weight:600;text-decoration:none">${label}</a>
  </div>`;
}

function sourceFooter(sources) {
  if (!sources || !sources.length) return "";
  return `<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e6e6e6">
     <p style="font-size:12px;color:#766a62;margin:0 0 8px">Källor:</p>
     <ul style="font-size:12px;color:#766a62;padding-left:16px;margin:0">
       ${sources.map((s) => `<li><a href="${s.url}" style="color:#108474">${s.title}</a></li>`).join("")}
     </ul>
   </div>`;
}

// ---- Resend send with one-click unsubscribe headers ----

async function sendViaResend({ to, subject, html, unsubUrl }) {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY saknas");
  const { Resend } = require("resend");
  const resend = new Resend(RESEND_API_KEY);
  await resend.emails.send({
    from: `1753 SKINCARE <${EMAIL_FROM_INFO}>`,
    to,
    subject,
    html,
    headers: {
      "List-Unsubscribe": `<${unsubUrl}>, <mailto:info@1753skin.com?subject=unsubscribe>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
}

// ---- Main ----

async function run() {
  console.log("=== Personliga nyhetsbrev ===");
  console.log(
    `Läge: ${DRY_RUN ? "DRY-RUN (inget skickas)" : "SKARPT (skickar)"} | limit=${LIMIT} | days=${DAYS} | cooldown=${COOLDOWN}`
  );

  let candidates = await db.findSubscribersForPersonalNewsletter({
    withinDays: DAYS,
    cooldownDays: COOLDOWN,
    limit: LIMIT,
  });

  if (ONLY_EMAIL) {
    const lower = ONLY_EMAIL.toLowerCase();
    candidates = candidates.filter((c) => c.email.toLowerCase() === lower);
    console.log(`Filtrerar till --email=${ONLY_EMAIL} (${candidates.length} träff).`);
  }

  if (!candidates.length) {
    console.log("Inga mottagare uppfyller kriterierna.");
    return;
  }

  console.log(`${candidates.length} mottagare att generera mejl för.`);

  const previewDir = path.join(__dirname, "..", "data", "personal-newsletters-preview");
  if (DRY_RUN) fs.mkdirSync(previewDir, { recursive: true });

  let ok = 0;
  let failed = 0;

  for (const c of candidates) {
    const locale = c.locale || "sv";
    const analysis = {
      result: c.analysis_result || {},
      answers: c.analysis_answers || {},
    };
    const focusAreas = extractFocusAreas(analysis, c.skin_condition);
    const ebookSegments = findRelevantEbookSegments(focusAreas, 2);
    const research = await fetchResearch(focusAreas);

    const metrics = analysis.result.metrics || analysis.result.skinMetrics || {};
    const skinAge = analysis.result.skinAge;
    const fitzpatrick = analysis.result.fitzpatrick;
    const primary = analysis.result.primaryCondition?.condition;

    console.log(
      `\n-> ${c.email} | locale=${locale} | focus=[${focusAreas.join(" · ")}] | ebook=${ebookSegments.length} | research=${research.length}`
    );

    let generated = null;
    try {
      const { text, usage } = await callOpenAIJson([
        { role: "system", content: buildSystemPrompt(locale) },
        {
          role: "user",
          content: buildUserMessage({
            firstName: c.first_name,
            focusAreas,
            metrics,
            skinAge,
            fitzpatrick,
            primary,
            ebookSegments,
            research,
          }),
        },
      ]);
      generated = JSON.parse(text);
      console.log(
        `   "${generated.subject}" (in=${usage?.prompt_tokens ?? "?"} out=${usage?.completion_tokens ?? "?"})`
      );
    } catch (err) {
      console.error(`   FEL: ${err.message}`);
      failed++;
      continue;
    }

    const unsubUrl = `${BASE_URL}/api/newsletter/unsubscribe/${c.unsubscribe_token}`;
    const fullHtml = emailWrapper(
      generated.htmlBody + sourceFooter(generated.sources) + analysisCta(locale),
      unsubUrl
    );

    if (DRY_RUN) {
      const safeName = c.email.replace(/[^a-z0-9]+/gi, "_");
      const fp = path.join(previewDir, `${safeName}.html`);
      fs.writeFileSync(fp, fullHtml, "utf-8");
    } else {
      const canSend = await db.canEmailSubscriber(c.subscriber_id, 20);
      if (!canSend) {
        console.log("   Hoppar över: canEmailSubscriber sa nej (kyligen mailad).");
        continue;
      }
      try {
        await sendViaResend({
          to: c.email,
          subject: generated.subject,
          html: fullHtml,
          unsubUrl,
        });
        await db.touchSubscriberEmailed(c.subscriber_id);
        console.log("   Skickat.");
      } catch (err) {
        console.error(`   Kunde inte skicka: ${err.message}`);
        failed++;
        continue;
      }
    }

    try {
      await db.recordPersonalNewsletter({
        subscriberId: c.subscriber_id,
        userId: c.user_id,
        analysisId: c.analysis_id,
        email: c.email,
        locale,
        focusAreas,
        subject: generated.subject,
        html: fullHtml,
        sources: generated.sources || [],
        model: MODEL,
        dryRun: DRY_RUN,
        sent: !DRY_RUN,
      });
    } catch (err) {
      console.warn(`   Logging failed (icke-fatalt): ${err.message}`);
    }

    ok++;

    // Light pacing to stay well below OpenAI + Resend rate limits.
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log(`\nKlart. OK=${ok}, misslyckade=${failed}, totalt=${candidates.length}`);
  if (DRY_RUN) {
    console.log(`Förhandsgranska HTML: ${previewDir}`);
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Fel:", err);
    process.exit(1);
  });
