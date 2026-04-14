"use client";

import jsPDF from "jspdf";
import type {
  AnalysisTabsProps,
  MetricScore,
  SkinMetrics,
} from "./analysis-tabs";

const GREEN = [16, 132, 116] as const;
const DARK = [29, 29, 31] as const;
const MUTED = [81, 81, 81] as const;
const BROWN = [118, 106, 98] as const;
const BG = [245, 245, 247] as const;
const WHITE = [255, 255, 255] as const;
const GOLD = [252, 178, 55] as const;
const RED = [229, 80, 80] as const;

function scoreColor(score: number): readonly [number, number, number] {
  if (score >= 80) return GREEN;
  if (score >= 60) return GOLD;
  return RED;
}

function gradeText(grade: number, locale: string): string {
  const labels: Record<number, Record<string, string>> = {
    5: { sv: "Utmärkt", en: "Excellent", es: "Excelente", de: "Ausgezeichnet", fr: "Excellent" },
    4: { sv: "Bra", en: "Good", es: "Bueno", de: "Gut", fr: "Bon" },
    3: { sv: "Medel", en: "Average", es: "Promedio", de: "Durchschnitt", fr: "Moyen" },
    2: { sv: "Under medel", en: "Below avg", es: "Bajo prom.", de: "Unter Durchschn.", fr: "Sous la moy." },
    1: { sv: "Låg", en: "Low", es: "Bajo", de: "Niedrig", fr: "Faible" },
  };
  const entry = labels[grade];
  if (!entry) return "";
  return entry[locale] || entry.en || "";
}

const METRIC_NAMES_I18N: Record<string, Record<string, string>> = {
  wrinkles: { sv: "Rynkor", en: "Wrinkles", es: "Arrugas", de: "Falten", fr: "Rides" },
  pores: { sv: "Porer", en: "Pores", es: "Poros", de: "Poren", fr: "Pores" },
  pigmentation: { sv: "Pigmentering", en: "Pigmentation", es: "Pigmentación", de: "Pigmentierung", fr: "Pigmentation" },
  redness: { sv: "Rodnad", en: "Redness", es: "Enrojecimiento", de: "Rötung", fr: "Rougeur" },
  texture: { sv: "Textur", en: "Texture", es: "Textura", de: "Textur", fr: "Texture" },
  dark_circles: { sv: "Mörka ringar", en: "Dark circles", es: "Ojeras", de: "Augenringe", fr: "Cernes" },
  firmness: { sv: "Fasthet", en: "Firmness", es: "Firmeza", de: "Festigkeit", fr: "Fermeté" },
  hydration: { sv: "Fukt", en: "Hydration", es: "Hidratación", de: "Hydratation", fr: "Hydratation" },
  skin_tone: { sv: "Hudton", en: "Skin tone", es: "Tono de piel", de: "Hautton", fr: "Teint" },
  acne: { sv: "Akne", en: "Acne", es: "Acné", de: "Akne", fr: "Acné" },
  sensitivity: { sv: "Känslighet", en: "Sensitivity", es: "Sensibilidad", de: "Empfindlichkeit", fr: "Sensibilité" },
  sun_damage: { sv: "Solskador", en: "Sun damage", es: "Daño solar", de: "Sonnenschäden", fr: "Dommages solaires" },
  elasticity: { sv: "Elasticitet", en: "Elasticity", es: "Elasticidad", de: "Elastizität", fr: "Élasticité" },
  radiance: { sv: "Lyster", en: "Radiance", es: "Luminosidad", de: "Ausstrahlung", fr: "Éclat" },
  barrier_health: { sv: "Barriär", en: "Barrier", es: "Barrera", de: "Barriere", fr: "Barrière" },
};

function metricName(key: string, locale: string): string {
  const entry = METRIC_NAMES_I18N[key];
  if (!entry) return key;
  return entry[locale] || entry.en || key;
}

function drawRoundedRect(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  r: number,
  fill: readonly [number, number, number],
  stroke?: readonly [number, number, number]
) {
  doc.setFillColor(...fill);
  if (stroke) {
    doc.setDrawColor(...stroke);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, w, h, r, r, "FD");
  } else {
    doc.roundedRect(x, y, w, h, r, r, "F");
  }
}

function drawScoreArc(
  doc: jsPDF,
  cx: number, cy: number, radius: number,
  score: number, color: readonly [number, number, number]
) {
  doc.setDrawColor(...BG);
  doc.setLineWidth(3);
  const steps = 60;
  for (let i = 0; i < steps; i++) {
    const a1 = -Math.PI / 2 + (i / steps) * 2 * Math.PI;
    const a2 = -Math.PI / 2 + ((i + 1) / steps) * 2 * Math.PI;
    doc.line(
      cx + Math.cos(a1) * radius, cy + Math.sin(a1) * radius,
      cx + Math.cos(a2) * radius, cy + Math.sin(a2) * radius
    );
  }

  doc.setDrawColor(...color);
  doc.setLineWidth(3);
  const fillSteps = Math.round((score / 100) * steps);
  for (let i = 0; i < fillSteps; i++) {
    const a1 = -Math.PI / 2 + (i / steps) * 2 * Math.PI;
    const a2 = -Math.PI / 2 + ((i + 1) / steps) * 2 * Math.PI;
    doc.line(
      cx + Math.cos(a1) * radius, cy + Math.sin(a1) * radius,
      cx + Math.cos(a2) * radius, cy + Math.sin(a2) * radius
    );
  }
}

function drawRadar(
  doc: jsPDF,
  cx: number, cy: number, radius: number,
  metrics: SkinMetrics,
  locale: string
) {
  const entries = Object.entries(metrics).filter(
    ([, v]) => v && typeof (v as MetricScore).score === "number"
  ) as [string, MetricScore][];

  if (entries.length < 3) return;

  const n = entries.length;
  const angleStep = (2 * Math.PI) / n;

  for (let ring = 1; ring <= 4; ring++) {
    const r = (ring / 4) * radius;
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.15);
    for (let i = 0; i < n; i++) {
      const a1 = -Math.PI / 2 + i * angleStep;
      const a2 = -Math.PI / 2 + (i + 1) * angleStep;
      doc.line(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r, cx + Math.cos(a2) * r, cy + Math.sin(a2) * r);
    }
  }

  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.15);
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * angleStep;
    doc.line(cx, cy, cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
  }

  const points: [number, number][] = entries.map(([, m], i) => {
    const a = -Math.PI / 2 + i * angleStep;
    const r = (m.score / 100) * radius;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });

  // Draw filled polygon using triangle fan
  if (points.length > 2) {
    doc.setFillColor(16, 132, 116);
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      doc.triangle(cx, cy, p1[0], p1[1], p2[0], p2[1], "F");
    }
  }

  // Draw outline
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.6);
  for (let i = 0; i < points.length; i++) {
    const next = points[(i + 1) % points.length];
    doc.line(points[i][0], points[i][1], next[0], next[1]);
  }

  doc.setFontSize(6);
  doc.setTextColor(...BROWN);
  entries.forEach(([key], i) => {
    const a = -Math.PI / 2 + i * angleStep;
    const labelR = radius + 6;
    const lx = cx + Math.cos(a) * labelR;
    const ly = cy + Math.sin(a) * labelR;
    const name = metricName(key, locale);
    doc.text(name, lx, ly, { align: "center", baseline: "middle" });
  });
}

function drawProgressBar(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  pct: number, color: readonly [number, number, number]
) {
  drawRoundedRect(doc, x, y, w, h, h / 2, BG);
  if (pct > 0) {
    const fillW = Math.max(h, (pct / 100) * w);
    drawRoundedRect(doc, x, y, fillW, h, h / 2, color);
  }
}

function tx(locale: string, sv: string, en: string, es?: string, de?: string, fr?: string): string {
  if (locale === "sv") return sv;
  if (locale === "es") return es || en;
  if (locale === "de") return de || en;
  if (locale === "fr") return fr || en;
  return en;
}

const DATE_LOCALES: Record<string, string> = { sv: "sv-SE", en: "en-US", es: "es-ES", de: "de-DE", fr: "fr-FR" };

export async function generateAnalysisPDF(
  props: AnalysisTabsProps,
  locale: string
): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = 210;
  const margin = 16;
  const cw = pw - margin * 2;
  let y = 0;

  const addPage = () => {
    doc.addPage();
    y = margin;
  };

  const checkSpace = (needed: number) => {
    if (y + needed > 280) addPage();
  };

  // ── Page 1: Header + Score ──

  doc.setFillColor(...DARK);
  doc.rect(0, 0, pw, 36, "F");

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text("1753", margin, 16);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("SKINCARE", margin, 22);

  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(tx(locale, "Din personliga hudanalys", "Your personal skin analysis", "Tu análisis personal de piel", "Deine persönliche Hautanalyse", "Votre analyse cutanée personnelle"), margin + cw, 16, { align: "right" });
  const dateStr = new Date().toLocaleDateString(DATE_LOCALES[locale] || "en-US", { year: "numeric", month: "long", day: "numeric" });
  doc.setFontSize(7);
  doc.setTextColor(200, 200, 200);
  doc.text(dateStr, margin + cw, 22, { align: "right" });

  y = 44;

  // ── Score section with portrait ──
  const sc = scoreColor(props.score);

  if (props.scanImageSrc) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = props.scanImageSrc!;
      });

      const imgW = 38;
      const imgH = (img.height / img.width) * imgW;
      const clampH = Math.min(imgH, 50);

      drawRoundedRect(doc, margin, y, imgW + 2, clampH + 2, 4, WHITE, [230, 230, 230]);
      doc.addImage(img, "JPEG", margin + 1, y + 1, imgW, clampH, undefined, "FAST");

      const scoreX = margin + imgW + 14;
      drawScoreArc(doc, scoreX + 18, y + 18, 16, props.score, sc);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...DARK);
      doc.text(String(props.score), scoreX + 18, y + 19, { align: "center", baseline: "middle" });
      doc.setFontSize(6);
      doc.setTextColor(...BROWN);
      doc.text(tx(locale, "av 100", "of 100", "de 100", "von 100", "sur 100"), scoreX + 18, y + 28, { align: "center" });

      if (props.scoreLabel) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...MUTED);
        doc.text(props.scoreLabel, scoreX + 40, y + 12, { maxWidth: 70 });
      }

      const infoX = scoreX + 40;
      const infoY = y + 24;
      if (props.skinAge) {
        drawRoundedRect(doc, infoX, infoY, 28, 14, 3, BG);
        doc.setFontSize(5.5);
        doc.setTextColor(...BROWN);
        doc.text(tx(locale, "HUDÅLDER", "SKIN AGE", "EDAD PIEL", "HAUTALTER", "ÂGE PEAU"), infoX + 14, infoY + 4, { align: "center" });
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...DARK);
        doc.text(String(props.skinAge), infoX + 14, infoY + 11.5, { align: "center" });
      }
      if (props.fitzpatrick) {
        const fpX = props.skinAge ? infoX + 32 : infoX;
        drawRoundedRect(doc, fpX, infoY, 28, 14, 3, BG);
        doc.setFontSize(5.5);
        doc.setTextColor(...BROWN);
        doc.text("FITZPATRICK", fpX + 14, infoY + 4, { align: "center" });
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...DARK);
        doc.text(props.fitzpatrick, fpX + 14, infoY + 11.5, { align: "center" });
      }

      y += Math.max(clampH + 6, 42);
    } catch {
      drawScoreArc(doc, margin + 22, y + 22, 20, props.score, sc);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...DARK);
      doc.text(String(props.score), margin + 22, y + 23, { align: "center", baseline: "middle" });
      y += 50;
    }
  } else {
    drawScoreArc(doc, margin + 22, y + 22, 20, props.score, sc);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text(String(props.score), margin + 22, y + 23, { align: "center", baseline: "middle" });
    doc.setFontSize(7);
    doc.setTextColor(...BROWN);
    doc.text(tx(locale, "av 100", "of 100", "de 100", "von 100", "sur 100"), margin + 22, y + 33, { align: "center" });

    if (props.scoreLabel) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...MUTED);
      doc.text(props.scoreLabel, margin + 50, y + 18, { maxWidth: cw - 54 });
    }
    y += 50;
  }

  // ── Summary ──
  if (props.summary) {
    drawRoundedRect(doc, margin, y, cw, 0.3, 0.15, [230, 230, 230]);
    y += 4;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    const lines = doc.splitTextToSize(props.summary, cw - 4);
    doc.text(lines, margin + 2, y);
    y += lines.length * 3.5 + 4;
  }

  // ── Radar chart ──
  if (props.metrics && Object.keys(props.metrics).length >= 3) {
    checkSpace(80);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BROWN);
    doc.text(tx(locale, "HUDPROFIL — RADARDIAGRAM", "SKIN PROFILE — RADAR CHART", "PERFIL CUTÁNEO — DIAGRAMA RADAR", "HAUTPROFIL — RADARDIAGRAMM", "PROFIL CUTANÉ — DIAGRAMME RADAR"), margin, y);
    y += 4;

    drawRoundedRect(doc, margin, y, cw, 72, 4, WHITE, [230, 230, 230]);
    drawRadar(doc, margin + cw / 2, y + 36, 28, props.metrics, locale);
    y += 76;
  }

  // ── Metrics grid ──
  if (props.metrics) {
    const entries = Object.entries(props.metrics).filter(
      ([, v]) => v && typeof (v as MetricScore).score === "number"
    ) as [string, MetricScore][];

    if (entries.length > 0) {
      checkSpace(10 + Math.ceil(entries.length / 3) * 22);

      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...BROWN);
      doc.text(tx(locale, "ALLA METRIKER", "ALL METRICS", "TODAS LAS MÉTRICAS", "ALLE METRIKEN", "TOUTES LES MÉTRIQUES"), margin, y);
      y += 4;

      const cols = 3;
      const cardW = (cw - (cols - 1) * 3) / cols;
      const cardH = 18;

      entries.forEach(([key, m], i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);

        if (col === 0 && row > 0) {
          checkSpace(cardH + 4);
        }

        const cx = margin + col * (cardW + 3);
        const cy = y + row * (cardH + 3);
        const color = scoreColor(m.score);

        drawRoundedRect(doc, cx, cy, cardW, cardH, 3, WHITE, [230, 230, 230]);

        doc.setFontSize(6.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...DARK);
        doc.text(metricName(key, locale), cx + 3, cy + 5.5);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...color);
        doc.text(String(m.score), cx + cardW - 3, cy + 6, { align: "right" });

        doc.setFontSize(5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...BROWN);
        doc.text(gradeText(m.grade, locale), cx + cardW - 3, cy + 10, { align: "right" });

        drawProgressBar(doc, cx + 3, cy + 12, cardW - 6, 1.5, m.score, color);

        if (m.detail) {
          doc.setFontSize(4.5);
          doc.setTextColor(...MUTED);
          const detailLines = doc.splitTextToSize(m.detail, cardW - 6);
          doc.text(detailLines.slice(0, 1), cx + 3, cy + 16.5);
        }
      });

      y += Math.ceil(entries.length / cols) * (cardH + 3) + 4;
    }
  }

  // ── Skin Analysis details ──
  if (props.skinAnalysis) {
    addPage();

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BROWN);
    doc.text(tx(locale, "DETALJERAD HUDANALYS", "DETAILED SKIN ANALYSIS", "ANÁLISIS DETALLADO DE LA PIEL", "DETAILLIERTE HAUTANALYSE", "ANALYSE CUTANÉE DÉTAILLÉE"), margin, y);
    y += 5;

    if (props.skinAnalysis.overview) {
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...DARK);
      const overviewLines = doc.splitTextToSize(props.skinAnalysis.overview.replace(/\\n\\n/g, "\n"), cw - 4);
      overviewLines.forEach((line: string) => {
        checkSpace(4);
        doc.text(line, margin + 2, y);
        y += 3.2;
      });
      y += 3;
    }

    if (props.skinAnalysis.strengths?.length) {
      checkSpace(12);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...GREEN);
      doc.text(tx(locale, "STYRKOR", "STRENGTHS", "FORTALEZAS", "STÄRKEN", "POINTS FORTS"), margin, y);
      y += 4;
      props.skinAnalysis.strengths.forEach((s) => {
        checkSpace(6);
        doc.setFillColor(...GREEN);
        doc.circle(margin + 2, y - 0.8, 0.8, "F");
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...DARK);
        const sLines = doc.splitTextToSize(s, cw - 10);
        doc.text(sLines, margin + 6, y);
        y += sLines.length * 3.2 + 1.5;
      });
      y += 2;
    }

    if (props.skinAnalysis.concerns?.length) {
      checkSpace(12);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...RED);
      doc.text(tx(locale, "FOKUSOMRÅDEN", "FOCUS AREAS", "ÁREAS DE ENFOQUE", "SCHWERPUNKTE", "DOMAINES D'ATTENTION"), margin, y);
      y += 4;
      props.skinAnalysis.concerns.forEach((c) => {
        checkSpace(6);
        const issue = typeof c === "string" ? c : c.issue;
        const severity = typeof c === "string" ? undefined : c.severity;
        doc.setFillColor(...RED);
        doc.circle(margin + 2, y - 0.8, 0.8, "F");
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...DARK);
        const cLines = doc.splitTextToSize(issue, cw - 10);
        doc.text(cLines, margin + 6, y);
        if (severity) {
          const sevY = y + cLines.length * 3.2;
          doc.setFontSize(5);
          doc.setTextColor(...BROWN);
          doc.text(`(${severity})`, margin + 6, sevY);
        }
        y += cLines.length * 3.2 + (severity ? 3.5 : 1.5);
      });
      y += 2;
    }

    if (props.skinAnalysis.microbiome) {
      checkSpace(15);
      const mLines = doc.splitTextToSize(props.skinAnalysis.microbiome, cw - 8);
      const boxH = 10 + mLines.length * 2.8;
      drawRoundedRect(doc, margin, y, cw, boxH, 3, BG);
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...GREEN);
      doc.text(tx(locale, "MIKROBIOM", "MICROBIOME", "MICROBIOMA", "MIKROBIOM", "MICROBIOME"), margin + 4, y + 4);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...MUTED);
      doc.text(mLines, margin + 4, y + 8);
      y += boxH + 4;
    }

    if (props.skinAnalysis.ecs) {
      checkSpace(15);
      const eLines = doc.splitTextToSize(props.skinAnalysis.ecs, cw - 8);
      const eBoxH = 10 + eLines.length * 2.8;
      drawRoundedRect(doc, margin, y, cw, eBoxH, 3, BG);
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...GREEN);
      doc.text(tx(locale, "ENDOCANNABINOIDSYSTEMET", "ENDOCANNABINOID SYSTEM", "SISTEMA ENDOCANNABINOIDE", "ENDOCANNABINOIDSYSTEM", "SYSTÈME ENDOCANNABINOÏDE"), margin + 4, y + 4);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...MUTED);
      doc.text(eLines, margin + 4, y + 8);
      y += eBoxH + 4;
    }
  }

  // ── Lifestyle ──
  if (props.lifestyle?.length) {
    checkSpace(30);
    if (y > 200) addPage();

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BROWN);
    doc.text(tx(locale, "LIVSSTILSREKOMMENDATIONER", "LIFESTYLE RECOMMENDATIONS", "RECOMENDACIONES DE ESTILO DE VIDA", "LEBENSSTILEMPFEHLUNGEN", "RECOMMANDATIONS MODE DE VIE"), margin, y);
    y += 5;

    props.lifestyle.forEach((item) => {
      checkSpace(20);
      const tipLines = doc.splitTextToSize(item.tip, cw - 14);
      const whyLines = item.why ? doc.splitTextToSize(item.why, cw - 14) : [];
      const cardH = 8 + tipLines.length * 3 + (whyLines.length > 0 ? whyLines.length * 2.8 + 2 : 0);

      drawRoundedRect(doc, margin, y, cw, cardH, 3, WHITE, [230, 230, 230]);

      drawRoundedRect(doc, margin + 3, y + 2.5, 6, 6, 2, BG);
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...GREEN);
      const icon = item.area.substring(0, 2).toUpperCase();
      doc.text(icon, margin + 6, y + 6.5, { align: "center" });

      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...DARK);
      const areaText = doc.splitTextToSize(item.area, cw - 30);
      doc.text(areaText.slice(0, 1), margin + 12, y + 5.5);

      const impactN = item.impact.toLowerCase();
      const isHigh = ["hög", "hog", "high", "alta", "hoch", "haute", "élevée", "elevee"].includes(impactN);
      const isMedium = ["medel", "medium", "media", "mittel", "moyenne", "moyen"].includes(impactN);
      const impactColor: [number, number, number] = isHigh ? [...GREEN] : isMedium ? [...GOLD] : [...BROWN];
      doc.setFontSize(5);
      doc.setTextColor(impactColor[0], impactColor[1], impactColor[2]);
      doc.text(item.impact, margin + cw - 4, y + 5.5, { align: "right" });

      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...DARK);
      doc.text(tipLines, margin + 12, y + 9);

      if (whyLines.length > 0) {
        const whyY = y + 9 + tipLines.length * 3;
        doc.setFontSize(6);
        doc.setTextColor(...BROWN);
        doc.text(whyLines, margin + 12, whyY);
      }

      y += cardH + 3;
    });
  }

  // ── Avoid ──
  if (props.avoid?.length) {
    checkSpace(14);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RED);
    doc.text(tx(locale, "UNDVIK", "AVOID", "EVITAR", "VERMEIDEN", "ÉVITER"), margin, y);
    y += 4;

    props.avoid.forEach((item) => {
      checkSpace(5);
      doc.setFillColor(...RED);
      doc.circle(margin + 2, y - 0.8, 0.8, "F");
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...DARK);
      const avLines = doc.splitTextToSize(item, cw - 10);
      doc.text(avLines, margin + 6, y);
      y += avLines.length * 3 + 1.5;
    });
    y += 2;
  }

  // ── Routine ──
  const morning = props.routine?.morning ?? props.routineLegacy?.morning.map(s => ({ step: s, why: "" })) ?? [];
  const evening = props.routine?.evening ?? props.routineLegacy?.evening.map(s => ({ step: s, why: "" })) ?? [];

  if (morning.length > 0 || evening.length > 0) {
    if (y > 180) addPage();
    checkSpace(20);

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BROWN);
    doc.text(tx(locale, "DIN PERSONLIGA RUTIN", "YOUR PERSONAL ROUTINE", "TU RUTINA PERSONAL", "DEINE PERSÖNLICHE ROUTINE", "VOTRE ROUTINE PERSONNELLE"), margin, y);
    y += 5;

    const drawRoutine = (title: string, steps: { step: string; why: string }[], accentColor: readonly [number, number, number]) => {
      checkSpace(10);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...DARK);
      doc.text(title, margin + 2, y);
      y += 5;

      steps.forEach((s, i) => {
        const stepLines = doc.splitTextToSize(s.step, cw - 18);
        const whyLines = s.why ? doc.splitTextToSize(s.why, cw - 18) : [];
        const cardH = 6 + stepLines.length * 3 + (whyLines.length > 0 ? whyLines.length * 2.5 + 1 : 0);
        checkSpace(cardH + 3);

        drawRoundedRect(doc, margin, y, cw, cardH, 3, WHITE, [230, 230, 230]);

        doc.setFillColor(...accentColor);
        doc.circle(margin + 5, y + 4, 3, "F");
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...WHITE);
        doc.text(String(i + 1), margin + 5, y + 4.8, { align: "center" });

        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...DARK);
        doc.text(stepLines, margin + 12, y + 5);

        if (whyLines.length > 0) {
          const whyY = y + 5 + stepLines.length * 3;
          doc.setFontSize(6);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...BROWN);
          doc.text(whyLines, margin + 12, whyY);
        }

        y += cardH + 2;
      });
      y += 2;
    };

    if (morning.length > 0) drawRoutine(tx(locale, "Morgonrutin", "Morning routine", "Rutina matutina", "Morgenroutine", "Routine du matin"), morning, GOLD);
    if (evening.length > 0) drawRoutine(tx(locale, "Kvällsrutin", "Evening routine", "Rutina nocturna", "Abendroutine", "Routine du soir"), evening, BROWN);
  }

  // ── Product recommendations ──
  if (props.products?.length) {
    if (y > 200) addPage();
    checkSpace(15);

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BROWN);
    doc.text(tx(locale, "REKOMMENDERADE PRODUKTER", "RECOMMENDED PRODUCTS", "PRODUCTOS RECOMENDADOS", "EMPFOHLENE PRODUKTE", "PRODUITS RECOMMANDÉS"), margin, y);
    y += 5;

    props.products.forEach((p) => {
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      const productName = p.id.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      const nameLines = doc.splitTextToSize(productName, cw - 8);
      const nameH = nameLines.length * 3.2;

      doc.setFontSize(6.5);
      const reasonLines = doc.splitTextToSize(p.reason, cw - 8);
      const usageLines = p.usage ? doc.splitTextToSize(p.usage, cw - 8) : [];
      const cardH = 6 + nameH + reasonLines.length * 2.8 + (usageLines.length > 0 ? usageLines.length * 2.5 + 2 : 0);
      checkSpace(cardH + 3);

      drawRoundedRect(doc, margin, y, cw, cardH, 3, WHITE, [230, 230, 230]);

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...DARK);
      doc.text(nameLines, margin + 4, y + 5);

      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...MUTED);
      const reasonY = y + 5 + nameH;
      doc.text(reasonLines, margin + 4, reasonY);

      if (usageLines.length > 0) {
        const uY = reasonY + reasonLines.length * 2.8 + 1;
        doc.setFontSize(6);
        doc.setTextColor(...BROWN);
        doc.text(usageLines, margin + 4, uY);
      }

      y += cardH + 3;
    });
  }

  // ── Footer on every page ──
  const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFillColor(...BG);
    doc.rect(0, 285, pw, 12, "F");
    doc.setFontSize(5.5);
    doc.setTextColor(...BROWN);
    doc.text("1753 SKINCARE — 1753skin.com", margin, 290);
    doc.text(tx(locale, `Sida ${p} av ${pageCount}`, `Page ${p} of ${pageCount}`, `Página ${p} de ${pageCount}`, `Seite ${p} von ${pageCount}`, `Page ${p} sur ${pageCount}`), pw - margin, 290, { align: "right" });
    doc.setFontSize(4.5);
    doc.text(tx(locale, "Denna analys ersätter inte medicinsk rådgivning.", "This analysis does not replace medical advice.", "Este análisis no sustituye el consejo médico.", "Diese Analyse ersetzt keine medizinische Beratung.", "Cette analyse ne remplace pas un avis médical."), margin, 293);
  }

  const filePrefix = tx(locale, "1753-hudanalys", "1753-skin-analysis", "1753-analisis-piel", "1753-hautanalyse", "1753-analyse-cutanee");
  doc.save(`${filePrefix}-${new Date().toISOString().split("T")[0]}.pdf`);
}
