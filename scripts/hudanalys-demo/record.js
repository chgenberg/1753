/**
 * Spelar in hudanalysflödet som video med Playwright (mobilkontext).
 *
 * Körs mot produktion (eller BASE_URL). Skriver per språk:
 *   out/<locale>/raw.webm    – rå inspelning (415x844)
 *   out/<locale>/marks.json  – tidsmarkörer för klippningen i compose.js
 *
 * Användning:  node record.js [sv|en|es|de]
 *
 * Env:
 *   BASE_URL           (default https://www.1753skin.com)
 *   DEMO_DATABASE_URL  (valfri – rensar 14-dagars-cooldown för demo-kontot före tagning)
 *   HEADED=1           (valfri – kör med synlig browser)
 */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const LOCALE = process.argv[2] || process.env.LOCALE || "sv";

// Alla UI-etiketter som flödet behöver, per språk. OBS: de.ts använder
// en-dash i "1–2 Liter" / "3–5 Mal pro Woche" – måste matcha exakt.
const L10N = {
  sv: {
    segment: "hudanalys",
    start: "Starta analys",
    consent: "Jag godkänner villkoren",
    continue: "Fortsätt",
    gender: "Kvinna",
    toScan: "Fortsätt till skanning",
    upload: "Ladda upp foto",
    analyze: "Analysera min hy",
    skinDry: "Torr",
    skinCombo: "Kombinerad",
    concern1: "Torrhet",
    concern2: "Matt / livlös hy",
    routine1: "Rengöring",
    routine2: "Ansiktsolja",
    stress: "Medel",
    diet: "Balanserad / varierad",
    water: "1-2 liter",
    exercise: "3-5 gånger i veckan",
    goal1: "Mer lyster och utstrålning",
    goal2: "Djupare återfuktning",
    sun: "Ibland",
    hormonal: "Nej",
    next: "Nästa",
    getResults: "Visa min analys",
    pdf: "Ladda ner som PDF",
  },
  en: {
    segment: "skin-analysis",
    start: "Start analysis",
    consent: "I accept the terms",
    continue: "Continue",
    gender: "Woman",
    toScan: "Continue to scan",
    upload: "Upload photo",
    analyze: "Analyse my skin",
    skinDry: "Dry",
    skinCombo: "Combination",
    concern1: "Dryness",
    concern2: "Dull / lifeless skin",
    routine1: "Cleanser",
    routine2: "Face oil",
    stress: "Medium",
    diet: "Balanced / varied",
    water: "1-2 litres",
    exercise: "3-5 times a week",
    goal1: "More glow and radiance",
    goal2: "Deeper hydration",
    sun: "Sometimes",
    hormonal: "No",
    next: "Next",
    getResults: "Show my analysis",
    pdf: "Download as PDF",
  },
  es: {
    segment: "analisis-piel",
    start: "Iniciar análisis",
    consent: "Acepto los términos",
    continue: "Continuar",
    gender: "Mujer",
    toScan: "Continuar al escaneo",
    upload: "Subir foto",
    analyze: "Analizar mi piel",
    skinDry: "Seca",
    skinCombo: "Mixta",
    concern1: "Sequedad",
    concern2: "Piel apagada / sin vida",
    routine1: "Limpiador",
    routine2: "Aceite facial",
    stress: "Medio",
    diet: "Equilibrada / variada",
    water: "1-2 litros",
    exercise: "3-5 veces por semana",
    goal1: "Más luminosidad y resplandor",
    goal2: "Hidratación más profunda",
    sun: "A veces",
    hormonal: "No",
    next: "Siguiente",
    getResults: "Ver mi análisis",
    pdf: "Descargar como PDF",
  },
  de: {
    segment: "hautanalyse",
    start: "Analyse starten",
    consent: "Ich akzeptiere die Bedingungen",
    continue: "Weiter",
    gender: "Frau",
    toScan: "Weiter zum Scan",
    upload: "Foto hochladen",
    analyze: "Meine Haut analysieren",
    skinDry: "Trocken",
    skinCombo: "Mischhaut",
    concern1: "Trockenheit",
    concern2: "Fahle / leblose Haut",
    routine1: "Reinigung",
    routine2: "Gesichtsöl",
    stress: "Mittel",
    diet: "Ausgewogen / abwechslungsreich",
    water: "1\u20132 Liter",
    exercise: "3\u20135 Mal pro Woche",
    goal1: "Mehr Ausstrahlung und Glow",
    goal2: "Tiefenwirksame Feuchtigkeit",
    sun: "Manchmal",
    hormonal: "Nein",
    next: "Weiter",
    getResults: "Meine Analyse anzeigen",
    pdf: "Als PDF herunterladen",
  },
};

const T = L10N[LOCALE];
if (!T) throw new Error(`Okänt språk: ${LOCALE} (välj sv|en|es|de)`);

const BASE_URL = process.env.BASE_URL || "https://www.1753skin.com";
const DEMO_EMAIL = "info@1753skincare.com";
const PHOTO = path.resolve(__dirname, "../../public/Ebbaanalys.png");
const OUT = path.resolve(__dirname, "out", LOCALE);

// Geometri: telefonglaset är 415x900 på en 1920x1080-canvas. Översta 56px
// reserveras för en fejkad iOS-statusbar, så sidan spelas in i 415x844.
const SCREEN = { w: 415, h: 900, x: 752, y: 90 };
const STATUS = 56;
const PAGE_H = SCREEN.h - STATUS;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cleanupCooldown() {
  const url = process.env.DEMO_DATABASE_URL;
  if (!url) {
    console.log("[cleanup] DEMO_DATABASE_URL saknas – hoppar över cooldown-rensning");
    return;
  }
  const { Pool } = require("pg");
  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  try {
    const res = await pool.query(
      `DELETE FROM skin_analyses
       WHERE user_id = (SELECT id FROM users WHERE LOWER(email) = LOWER($1))
         AND created_at > NOW() - INTERVAL '14 days'
       RETURNING id, created_at`,
      [DEMO_EMAIL]
    );
    console.log(`[cleanup] Raderade ${res.rowCount} analys(er) inom cooldown för ${DEMO_EMAIL}`);
  } finally {
    await pool.end();
  }
}

async function main() {
  if (!fs.existsSync(PHOTO)) throw new Error(`Foto saknas: ${PHOTO}`);
  fs.mkdirSync(OUT, { recursive: true });

  await cleanupCooldown();

  const browser = await chromium.launch({
    headless: !process.env.HEADED,
    args: ["--enable-unsafe-swiftshader"],
  });

  const ctx = await browser.newContext({
    viewport: { width: SCREEN.w, height: PAGE_H },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    locale: LOCALE,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
    recordVideo: { dir: OUT, size: { width: SCREEN.w, height: PAGE_H } }, // = viewport!
  });

  const page = await ctx.newPage();

  // Cookiebanner ska aldrig synas i filmen
  await page.addInitScript(() => {
    try { localStorage.setItem("1753_cookie_consent", "all"); } catch {}
  });

  // Tap-ripples så att klicken syns i filmen
  await page.addInitScript(() => {
    const style = document.createElement("style");
    style.textContent = `.bb-tap{position:fixed;width:34px;height:34px;border-radius:50%;
      background:rgba(20,20,20,.28);border:2px solid rgba(255,255,255,.85);
      transform:translate(-50%,-50%) scale(.5);pointer-events:none;
      z-index:2147483647;animation:bbTap .45s ease-out forwards}
      @keyframes bbTap{to{transform:translate(-50%,-50%) scale(1.6);opacity:0}}`;
    document.addEventListener("DOMContentLoaded", () => document.head.appendChild(style));
    window.addEventListener("pointerdown", (e) => {
      const d = document.createElement("div");
      d.className = "bb-tap";
      d.style.left = `${e.clientX}px`;
      d.style.top = `${e.clientY}px`;
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 500);
    }, true);
  });

  page.on("response", async (res) => {
    if (res.url().includes("/api/analysis")) {
      let body = "";
      try { body = (await res.text()).slice(0, 300); } catch {}
      console.log(`[api] ${res.status()} ${res.url()}\n${body}`);
    }
  });

  const marks = [];
  let t0 = 0;
  const mark = (name) => {
    const t = (Date.now() - t0) / 1000;
    marks.push({ name, t });
    console.log(`[mark] ${name} @ ${t.toFixed(2)}s`);
  };

  const tapText = async (text, opts = {}) => {
    const loc = page.locator(`button:has-text("${text}")`).first();
    await loc.waitFor({ state: "visible", timeout: opts.timeout || 20000 });
    await loc.scrollIntoViewIfNeeded();
    await sleep(opts.before ?? 350);
    // position används för consent: tap på checkbox-ikonen till vänster så att
    // den nästlade "Läs villkoren"-länken (stopPropagation) aldrig träffas
    await loc.tap(opts.position ? { position: opts.position } : undefined);
  };

  const softScroll = async (deltaY, steps = 40) => {
    await page.evaluate(async ({ deltaY, steps }) => {
      const per = deltaY / steps;
      for (let i = 0; i < steps; i++) {
        window.scrollBy(0, per);
        await new Promise((r) => setTimeout(r, 16));
      }
    }, { deltaY, steps });
  };

  console.log(`[record] (${LOCALE}) Går till ${BASE_URL}/${LOCALE}/${T.segment}`);
  await page.goto(`${BASE_URL}/${LOCALE}/${T.segment}`, { waitUntil: "networkidle", timeout: 60000 });
  t0 = Date.now();
  await sleep(900);
  mark("start");

  // ---- INTRO ----
  await tapText(T.start);
  mark("startTap");

  // ---- EMAIL ----
  const emailInput = page.locator('input[type="email"]').first();
  await emailInput.waitFor({ state: "visible" });
  await sleep(500);
  await emailInput.tap();
  await emailInput.pressSequentially(DEMO_EMAIL, { delay: 38 });
  mark("typedEmail");
  await tapText(T.consent, { position: { x: 26, y: 22 } });
  await sleep(350);
  await tapText(T.continue);
  mark("emailNext");

  // ---- DEMOGRAPHICS ----
  const ageInput = page.locator('input[type="number"]').first();
  await ageInput.waitFor({ state: "visible" });
  await sleep(450);
  await ageInput.tap();
  await ageInput.pressSequentially("28", { delay: 120 });
  await tapText(T.gender);
  mark("demoFilled");
  await tapText(T.toScan);
  mark("demoNext");

  // ---- SCAN: ladda upp foto ----
  await page.locator(`button:has-text("${T.upload}")`).waitFor({ state: "visible" });
  await sleep(700);
  mark("scanShown");
  await page.locator('input[type="file"]').first().setInputFiles(PHOTO);
  await page.locator(`button:has-text("${T.analyze}")`).waitFor({ state: "visible", timeout: 30000 });
  await sleep(800);
  mark("photoSet");
  await tapText(T.analyze);
  mark("analyzeTap");
  // Scanner-stegen byter layout – se till att laddaren är i bild
  await sleep(250);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Vänta på att skanningen blir klar och quiz steg 1 dyker upp
  // (modellnedladdning ~87 MB första gången – komprimeras i klippet)
  await page.locator(`button:has-text("${T.skinDry}")`).first().waitFor({ state: "visible", timeout: 300000 });
  await sleep(400);
  mark("quizShown");

  // ---- QUIZ 1: hudtyp ----
  await tapText(T.skinCombo);
  await sleep(450);
  await tapText(T.next);
  mark("q1");

  // ---- QUIZ 2: besvär ----
  await tapText(T.concern1);
  await sleep(300);
  await tapText(T.concern2);
  await sleep(400);
  await tapText(T.next);
  mark("q2");

  // ---- QUIZ 3: rutin ----
  await tapText(T.routine1);
  await sleep(300);
  await tapText(T.routine2);
  await sleep(400);
  await tapText(T.next);
  mark("q3");

  // ---- QUIZ 4: livsstil ----
  await tapText(T.stress);
  await sleep(280);
  await tapText(T.diet);
  await sleep(280);
  await tapText(T.water);
  await sleep(280);
  await tapText(T.exercise);
  await sleep(400);
  await tapText(T.next);
  mark("q4");

  // ---- QUIZ 5: mål ----
  await tapText(T.goal1);
  await sleep(300);
  await tapText(T.goal2);
  await sleep(400);
  await tapText(T.next);
  mark("q5");

  // ---- QUIZ 6: solskydd ----
  await tapText(T.sun);
  await sleep(400);
  await tapText(T.next);
  mark("q6");

  // ---- QUIZ 7: hormonell ----
  await tapText(T.hormonal);
  await sleep(400);
  await tapText(T.getResults);
  mark("resultsTap");

  // ---- Vänta på resultatet (AI-analysen, komprimeras i klippet) ----
  try {
    await page.locator(`button:has-text("${T.pdf}")`).waitFor({ state: "visible", timeout: 240000 });
  } catch (e) {
    await page.screenshot({ path: path.join(OUT, "fail.png"), fullPage: true });
    throw e;
  }
  await sleep(600);
  mark("resultShown");

  // ---- Visa resultatet: mjuk scroll genom rapporten ----
  await sleep(1800);
  await softScroll(900, 55);
  await sleep(900);
  mark("scrolled1");
  await softScroll(1100, 55);
  await sleep(900);
  mark("scrolled2");

  // ---- Ladda ner PDF ----
  const pdfBtn = page.locator(`button:has-text("${T.pdf}")`);
  await pdfBtn.scrollIntoViewIfNeeded();
  await sleep(800);
  mark("pdfShown");
  const dlPromise = page.waitForEvent("download", { timeout: 120000 });
  await pdfBtn.tap();
  mark("pdfTap");
  const dl = await dlPromise;
  await dl.saveAs(path.join(OUT, "rapport.pdf"));
  mark("pdfDone");
  await sleep(1600);
  mark("end");

  await page.close();
  const videoPath = await page.video().path();
  await ctx.close();
  await browser.close();

  fs.copyFileSync(videoPath, path.join(OUT, "raw.webm"));
  fs.writeFileSync(path.join(OUT, "marks.json"), JSON.stringify({ SCREEN, STATUS, marks }, null, 2));
  console.log(`\n[record] (${LOCALE}) Klart. raw.webm + marks.json i ${OUT}`);
}

main().catch((err) => {
  console.error("[record] FEL:", err);
  process.exit(1);
});
