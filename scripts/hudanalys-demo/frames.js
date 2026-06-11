/**
 * Renderar ram-assets för filmen med Playwright (1920x1080), per språk:
 *   out/<locale>/bg.png     – bakgrund med drop-shadow + glasplatta + brandtext
 *   out/<locale>/frame.png  – transparent telefonram (bezel, statusbar, Dynamic Island)
 *   out/<locale>/intro.png  – brandat titelkort
 *   out/<locale>/outro.png  – brandat slutkort
 *
 * Användning:  node frames.js [sv|en|es|de]
 */
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const LOCALE = process.argv[2] || process.env.LOCALE || "sv";

const COPY = {
  sv: {
    heroTitle: "Gratis AI-hudanalys<br><em>på 2 minuter</em>",
    heroSub: "Skanna ansiktet, svara på sju korta frågor och få en komplett hudrapport – med PDF att ladda ner.",
    pill1: "Helt gratis",
    pill2: "Ingen app behövs",
    introTitle: "Hur mår din hud <em>egentligen</em>?",
    introSub: "Gör vår gratis AI-hudanalys – så här enkelt är det.",
    outroKicker: "1753skin.com/hudanalys",
    outroTitle: "Gör din egen analys – <em>helt gratis</em>",
    outroSub: "2 minuter · 15 hudmetriker · PDF-rapport direkt till din mejl.",
  },
  en: {
    heroTitle: "Free AI skin analysis<br><em>in 2 minutes</em>",
    heroSub: "Scan your face, answer seven quick questions and get a complete skin report – with a PDF to download.",
    pill1: "Completely free",
    pill2: "No app needed",
    introTitle: "How healthy is your skin <em>really</em>?",
    introSub: "Take our free AI skin analysis – it's this easy.",
    outroKicker: "1753skin.com/skin-analysis",
    outroTitle: "Do your own analysis – <em>completely free</em>",
    outroSub: "2 minutes · 15 skin metrics · PDF report straight to your inbox.",
  },
  es: {
    heroTitle: "Análisis de piel con IA<br><em>gratis en 2 minutos</em>",
    heroSub: "Escanea tu rostro, responde siete preguntas rápidas y recibe un informe completo de tu piel – con PDF para descargar.",
    pill1: "Totalmente gratis",
    pill2: "Sin app",
    introTitle: "¿Cómo está tu piel <em>realmente</em>?",
    introSub: "Haz nuestro análisis de piel con IA gratis – así de fácil.",
    outroKicker: "1753skin.com/analisis-piel",
    outroTitle: "Haz tu propio análisis – <em>totalmente gratis</em>",
    outroSub: "2 minutos · 15 métricas de piel · informe PDF directo a tu correo.",
  },
  de: {
    heroTitle: "Kostenlose KI-Hautanalyse<br><em>in 2 Minuten</em>",
    heroSub: "Scanne dein Gesicht, beantworte sieben kurze Fragen und erhalte einen kompletten Hautbericht – mit PDF zum Herunterladen.",
    pill1: "Komplett kostenlos",
    pill2: "Keine App nötig",
    introTitle: "Wie gesund ist deine Haut <em>wirklich</em>?",
    introSub: "Mach unsere kostenlose KI-Hautanalyse – so einfach geht's.",
    outroKicker: "1753skin.com/hautanalyse",
    outroTitle: "Mach deine eigene Analyse – <em>komplett kostenlos</em>",
    outroSub: "2 Minuten · 15 Hautmetriken · PDF-Bericht direkt in dein Postfach.",
  },
};

const C = COPY[LOCALE];
if (!C) throw new Error(`Okänt språk: ${LOCALE} (välj sv|en|es|de)`);

const OUT = path.resolve(__dirname, "out", LOCALE);
const SCREEN = { w: 415, h: 900, x: 752, y: 90 };
const STATUS = 56;
const BEZEL = 14;
const RADIUS = 64;

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

const baseCss = `
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1920px;height:1080px;font-family:'Inter',-apple-system,sans-serif;overflow:hidden}
`;

function bgHtml() {
  return `<!doctype html><html><head>${FONT}<style>${baseCss}
    body{background:
      radial-gradient(1200px 800px at 30% 20%, #ffffff 0%, #f5f5f7 55%, #ebebef 100%);}
    .shadow{position:absolute;left:${SCREEN.x + SCREEN.w / 2}px;top:${SCREEN.y + SCREEN.h - 18}px;
      width:${SCREEN.w + 160}px;height:90px;transform:translateX(-50%);
      background:radial-gradient(closest-side, rgba(0,0,0,.22), rgba(0,0,0,0));border-radius:50%}
    .plate{position:absolute;left:${SCREEN.x - BEZEL}px;top:${SCREEN.y - BEZEL}px;
      width:${SCREEN.w + BEZEL * 2}px;height:${SCREEN.h + BEZEL * 2}px;
      border-radius:${RADIUS + BEZEL}px;background:#fff}
    .brand{position:absolute;left:170px;top:0;height:1080px;display:flex;flex-direction:column;justify-content:center;gap:26px;width:480px}
    .brand .k{font-size:15px;font-weight:600;letter-spacing:6px;color:#766a62;text-transform:uppercase}
    .brand h1{font-size:58px;font-weight:700;letter-spacing:-1.5px;color:#1d1d1f;line-height:1.12}
    .brand h1 em{font-style:normal;color:#108474}
    .brand p{font-size:21px;font-weight:400;color:#515151;line-height:1.6;max-width:430px}
    .pill{display:inline-flex;align-items:center;gap:10px;margin-top:8px}
    .pill span{font-size:16px;font-weight:600;color:#108474;background:rgba(16,132,116,.08);
      border-radius:980px;padding:12px 24px}
  </style></head><body>
    <div class="shadow"></div>
    <div class="plate"></div>
    <div class="brand">
      <div class="k">1753 Skincare</div>
      <h1>${C.heroTitle}</h1>
      <p>${C.heroSub}</p>
      <div class="pill"><span>${C.pill1}</span><span>${C.pill2}</span></div>
    </div>
  </body></html>`;
}

function frameHtml() {
  return `<!doctype html><html><head>${FONT}<style>${baseCss}
    body{background:transparent}
    .bezel{position:absolute;left:${SCREEN.x - BEZEL}px;top:${SCREEN.y - BEZEL}px;
      width:${SCREEN.w + BEZEL * 2}px;height:${SCREEN.h + BEZEL * 2}px;
      border-radius:${RADIUS + BEZEL}px;
      border:${BEZEL}px solid #101012;
      box-shadow:inset 0 0 0 2px rgba(255,255,255,.06), 0 30px 80px rgba(0,0,0,.28)}
    .statusbar{position:absolute;left:${SCREEN.x}px;top:${SCREEN.y}px;width:${SCREEN.w}px;height:${STATUS}px;
      background:#fff;border-radius:${RADIUS - BEZEL}px ${RADIUS - BEZEL}px 0 0;
      display:flex;align-items:flex-end;justify-content:space-between;
      padding:0 34px 7px 40px;color:#1d1d1f}
    .time{font-size:17px;font-weight:600;letter-spacing:.2px}
    .right{display:flex;align-items:center;gap:7px}
    .bars{display:flex;align-items:flex-end;gap:2px}
    .bars i{display:block;width:3.5px;background:#1d1d1f;border-radius:1px}
    .wifi{width:18px;height:13px}
    .batt{position:relative;width:27px;height:13px;border:1.5px solid rgba(29,29,31,.5);border-radius:4px}
    .batt::after{content:"";position:absolute;right:-4.5px;top:3px;width:2px;height:5px;
      background:rgba(29,29,31,.5);border-radius:0 2px 2px 0}
    .batt b{position:absolute;left:1.5px;top:1.5px;bottom:1.5px;width:17px;background:#1d1d1f;border-radius:2px}
    .island{position:absolute;left:${SCREEN.x + SCREEN.w / 2}px;top:${SCREEN.y + 14}px;
      width:122px;height:34px;transform:translateX(-50%);background:#000;border-radius:980px}
    .home{position:absolute;left:${SCREEN.x + SCREEN.w / 2}px;top:${SCREEN.y + SCREEN.h - 16}px;
      width:140px;height:5px;transform:translateX(-50%);background:rgba(0,0,0,.85);border-radius:3px}
  </style></head><body>
    <div class="statusbar">
      <div class="time">09:41</div>
      <div class="right">
        <div class="bars"><i style="height:4px"></i><i style="height:7px"></i><i style="height:10px"></i><i style="height:13px"></i></div>
        <svg class="wifi" viewBox="0 0 20 14" fill="none"><path d="M10 13.2l3.2-3.9a5 5 0 00-6.4 0L10 13.2z" fill="#1d1d1f"/><path d="M10 7.2c1.9 0 3.7.7 5.1 1.9l2-2.4A11 11 0 0010 4a11 11 0 00-7.1 2.7l2 2.4A8 8 0 0110 7.2z" fill="#1d1d1f" opacity=".95"/><path d="M10 .8C6.1.8 2.6 2.2 0 4.6l1.9 2.4A12.5 12.5 0 0110 3.9c3.1 0 5.9 1.1 8.1 3.1L20 4.6A15 15 0 0010 .8z" fill="#1d1d1f" opacity=".95"/></svg>
        <div class="batt"><b></b></div>
      </div>
    </div>
    <div class="bezel"></div>
    <div class="island"></div>
    <div class="home"></div>
  </body></html>`;
}

function cardHtml({ kicker, title, sub }) {
  return `<!doctype html><html><head>${FONT}<style>${baseCss}
    body{background:radial-gradient(1200px 800px at 50% 35%, #ffffff 0%, #f5f5f7 60%, #ebebef 100%);
      display:flex;align-items:center;justify-content:center}
    .card{text-align:center;max-width:1100px;padding:0 60px}
    .k{font-size:17px;font-weight:600;letter-spacing:7px;color:#766a62;text-transform:uppercase}
    h1{margin-top:30px;font-size:84px;font-weight:700;letter-spacing:-2.5px;color:#1d1d1f;line-height:1.08}
    h1 em{font-style:normal;color:#108474}
    p{margin-top:28px;font-size:27px;font-weight:400;color:#515151;line-height:1.55}
    .rule{margin:42px auto 0;width:120px;height:4px;border-radius:2px;background:#108474}
  </style></head><body>
    <div class="card">
      <div class="k">${kicker}</div>
      <h1>${title}</h1>
      <p>${sub}</p>
      <div class="rule"></div>
    </div>
  </body></html>`;
}

async function shoot(page, html, file, transparent) {
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(OUT, file), omitBackground: !!transparent });
  console.log(`[frames] (${LOCALE}) ${file}`);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await shoot(page, bgHtml(), "bg.png");
  await shoot(page, frameHtml(), "frame.png", true);
  await shoot(page, cardHtml({ kicker: "1753 Skincare", title: C.introTitle, sub: C.introSub }), "intro.png");
  await shoot(page, cardHtml({ kicker: C.outroKicker, title: C.outroTitle, sub: C.outroSub }), "outro.png");

  await browser.close();
  console.log(`[frames] (${LOCALE}) Klart.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
