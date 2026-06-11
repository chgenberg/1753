/**
 * Komponerar slutfilmen med ffmpeg:
 *   raw.webm (415x844) → speed-ramp enligt marks.json → overlay på bg.png
 *   → frame.png ovanpå → intro/outro med xfade → out/hudanalys-demo.mp4
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const LOCALE = process.argv[2] || process.env.LOCALE || "sv";
const MODE = process.argv[3] || "desktop";
const MOBILE = MODE === "mobile";
const OUT = path.resolve(__dirname, "out", LOCALE);
const { marks } = JSON.parse(fs.readFileSync(path.join(OUT, "marks.json"), "utf8"));

// Geometri måste matcha frames.js. Mobil: rå-videon skalas upp 1.9x till
// 788x1604 och telefonen centreras på en 1080x1920-canvas.
const SCREEN = MOBILE
  ? { w: 788, h: 1710, x: 146, y: 105 }
  : { w: 415, h: 900, x: 752, y: 90 };
const STATUS = MOBILE ? 106 : 56;
const SUFFIX = MOBILE ? "-mobile" : "";

const T = Object.fromEntries(marks.map((m) => [m.name, m.t]));
const need = (n) => { if (T[n] == null) throw new Error(`Saknar mark: ${n}`); return T[n]; };

// Segment: [from, to, speed] eller [from, to, { dur }] (dur = mål-längd i sek)
const SEGS = [
  [Math.max(0, need("start") - 0.4), need("startTap") + 0.5, 1],
  [need("startTap") + 0.5, need("typedEmail") + 0.2, 1.25],      // skrivandet
  [need("typedEmail") + 0.2, need("demoNext") + 0.3, 1.25],      // samtycke + ålder + kön
  [need("demoNext") + 0.3, need("photoSet") + 0.2, 1.15],        // foto-uppladdning + förhandsvisning
  [need("photoSet") + 0.2, need("analyzeTap") + 0.45, 1],
  [need("analyzeTap") + 0.45, need("quizShown"), { dur: 2.4 }],  // modell + skanning – komprimeras
  [need("quizShown"), need("resultsTap") + 0.4, 2.3],            // quizen i snabb takt
  [need("resultsTap") + 0.4, need("resultShown"), { dur: 2.2 }], // AI:n tänker – komprimeras
  [need("resultShown"), need("pdfShown"), 1.5],                  // scrolla genom rapporten
  [need("pdfShown"), need("end") + 2.0, 1],                      // PDF-knappen + nedladdning
];

let inner = 0;
const resolved = SEGS.map(([a, b, v]) => {
  const span = b - a;
  const speed = typeof v === "object" ? Math.max(1, span / v.dur) : v;
  inner += span / speed;
  return [a, b, speed];
});
console.log(`[compose] Inre längd: ${inner.toFixed(1)}s (${resolved.length} segment)`);

const INTRO = 1.8;
const OUTRO = 2.4;
const FADE = 0.5;
const total = INTRO + inner + OUTRO - 2 * FADE;
console.log(`[compose] Total längd: ${total.toFixed(1)}s`);

const trims = resolved
  .map(([a, b, v], i) => `[0:v]trim=start=${a.toFixed(3)}:end=${b.toFixed(3)},setpts=(PTS-STARTPTS)/${v}[t${i}]`)
  .join(";");
const concatIn = resolved.map((_, i) => `[t${i}]`).join("");

const filter = [
  trims,
  `${concatIn}concat=n=${resolved.length}:v=1:a=0,fps=30,scale=${SCREEN.w}:${SCREEN.h - STATUS}:flags=lanczos,setsar=1[vc]`,
  `[1:v][vc]overlay=x=${SCREEN.x}:y=${SCREEN.y + STATUS}[vb]`,
  `[vb][2:v]overlay=0:0,format=yuv420p,fps=30[main]`,
  `[3:v]fps=30,format=yuv420p[intro]`,
  `[4:v]fps=30,format=yuv420p[outro]`,
  `[intro][main]xfade=transition=fade:duration=${FADE}:offset=${(INTRO - FADE).toFixed(2)}[m1]`,
  `[m1][outro]xfade=transition=fade:duration=${FADE}:offset=${(INTRO + inner - 2 * FADE).toFixed(2)},format=yuv420p[vout]`,
].join(";");

const outFile = path.join(OUT, `hudanalys-demo${SUFFIX}.mp4`);

const args = [
  "-y",
  "-i", path.join(OUT, "raw.webm"),
  "-loop", "1", "-t", String((inner + INTRO + 2).toFixed(2)), "-i", path.join(OUT, `bg${SUFFIX}.png`),
  "-loop", "1", "-t", String((inner + INTRO + 2).toFixed(2)), "-i", path.join(OUT, `frame${SUFFIX}.png`),
  "-loop", "1", "-t", String(INTRO.toFixed(2)), "-i", path.join(OUT, `intro${SUFFIX}.png`),
  "-loop", "1", "-t", String(OUTRO.toFixed(2)), "-i", path.join(OUT, `outro${SUFFIX}.png`),
  "-filter_complex", filter,
  "-map", "[vout]",
  "-an",
  "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  outFile,
];

console.log("[compose] Kör ffmpeg...");
const res = spawnSync("ffmpeg", args, { stdio: ["ignore", "inherit", "inherit"] });
if (res.status !== 0) process.exit(res.status || 1);

// Poster: en bra frame en bit in i filmen
spawnSync("ffmpeg", [
  "-y", "-ss", String((INTRO + 1.2).toFixed(2)), "-i", outFile,
  "-frames:v", "1", "-q:v", "3", path.join(OUT, `hudanalys-demo${SUFFIX}-poster.jpg`),
], { stdio: "ignore" });

console.log(`[compose] Klart: ${outFile}`);
