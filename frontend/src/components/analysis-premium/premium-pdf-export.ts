"use client";

import jsPDF from "jspdf";
import type { PremiumAnalysisResult, PremiumPdfStrings } from "./premium-types";
import { getPremiumProductView } from "./product-display";
import {
  PREMIUM_CITATIONS,
  type CitationCategoryKey,
} from "./premium-citations";
import type { Locale } from "@/lib/i18n/types";

export type { PremiumAnalysisResult, PremiumPdfStrings } from "./premium-types";

/**
 * Premium PDF-export – designsystem.
 *
 * Helt fristående från frontend/src/components/analysis/pdf-export.ts (gratis-PDF).
 * Bygger en ~25-sidig premium-rapport med:
 *   • Cover med donut-chart (canvas → PNG)
 *   • Innehållsförteckning
 *   • Radar-chart (12 metrics) ritad i canvas
 *   • 4-veckors timeline-graf
 *   • Färgade veckokort, kostplan-kort, livsstilsprogram
 *   • Tabeller med alternerande raddrader
 *   • Konsekvent sidhuvud + sidfot på varje icke-cover-sida
 *   • Avslutande signaturkort
 *
 * Inga nya npm-paket: all grafik renderas i en off-screen <canvas> och bäddas
 * in som PNG via doc.addImage(). Detta är samma mekanism som proffsiga
 * premium-rapporter använder.
 */

interface ExportOptions {
  result: PremiumAnalysisResult;
  locale: string;
  strings: PremiumPdfStrings;
  email?: string;
  analysisId?: number | null;
}

/**
 * Returnerar en validerad locale (faller tillbaka till "sv") för att
 * skicka vidare till product-display-helpers utan att få typkonflikter
 * när PDF:en kallas med en oväntad locale-sträng.
 */
function asLocale(locale: string): Locale {
  if (locale === "en" || locale === "es" || locale === "de" || locale === "fr") {
    return locale;
  }
  return "sv";
}

const GREEN: [number, number, number] = [16, 132, 116];
const GREEN_SOFT: [number, number, number] = [232, 244, 241];
const DARK: [number, number, number] = [29, 29, 31];
const MUTED: [number, number, number] = [81, 81, 81];
const BROWN: [number, number, number] = [118, 106, 98];
const BG: [number, number, number] = [245, 245, 247];
const GOLD: [number, number, number] = [252, 178, 55];
const AMBER_SOFT: [number, number, number] = [254, 243, 199];
const AMBER_BORDER: [number, number, number] = [251, 191, 36];
const WHITE: [number, number, number] = [255, 255, 255];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 18;
const TEXT_W = PAGE_W - MARGIN_X * 2;
const FOOTER_Y = PAGE_H - 12;
const HEADER_Y = 14;
const CONTENT_TOP = 30;
const CONTENT_BOTTOM = PAGE_H - 22;

const METRIC_LABELS: Record<string, string> = {
  hydration: "Hydrering",
  barrier: "Barriär",
  elasticity: "Elasticitet",
  redness: "Rodnad",
  lustre: "Lyster",
  pores: "Porer",
  pigmentation: "Pigmentering",
  fineLines: "Fina linjer",
  oiliness: "Oljighet",
  sensitivity: "Känslighet",
  microbiomeHealth: "Mikrobiom",
  vascularHealth: "Mikrocirkulation",
};

type LifestyleKey = "sleep" | "stress" | "nutrition" | "gut" | "movement";
const LIFESTYLE_KEYS: LifestyleKey[] = [
  "sleep",
  "stress",
  "nutrition",
  "gut",
  "movement",
];

function hasAnyLifestyleScore(
  s: NonNullable<PremiumAnalysisResult["lifestyleScores"]>
): boolean {
  return LIFESTYLE_KEYS.some((k) => typeof s[k]?.score === "number");
}

function determineWeakestLink(
  s: NonNullable<PremiumAnalysisResult["lifestyleScores"]>
): LifestyleKey | null {
  if (s.weakestLink && (LIFESTYLE_KEYS as string[]).includes(s.weakestLink)) {
    return s.weakestLink as LifestyleKey;
  }
  let lowestKey: LifestyleKey | null = null;
  let lowest = Number.POSITIVE_INFINITY;
  for (const k of LIFESTYLE_KEYS) {
    const v = s[k]?.score;
    if (typeof v === "number" && v < lowest) {
      lowest = v;
      lowestKey = k;
    }
  }
  return lowestKey;
}

/**
 * Normaliserar Unicode-tecken som inte stöds av jsPDFs default Helvetica
 * (WinAnsi/Latin-1). Förhindrar att t.ex. → och smarta citat renderas som
 * "'!" eller fragmenterade glyphs i den exporterade PDF:en.
 */
function safe(text: string): string {
  return String(text)
    .replace(/→/g, "->")
    .replace(/←/g, "<-")
    .replace(/↑/g, "^")
    .replace(/↓/g, "v")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/\u2013/g, "-")
    .replace(/\u2014/g, "--");
}

interface PdfCtx {
  doc: jsPDF;
  y: number;
  strings: PremiumPdfStrings;
  email?: string;
  totalPagesPlaceholder: number;
}

/**
 * Laddar 1753-logotypen från `/1753.png` och returnerar den som
 * data-URL. Faller tillbaka till null om något går snett – PDF:en ska
 * fortfarande renderas korrekt utan logo (text-fallback i covern).
 */
async function loadLogoAsDataUrl(path: string): Promise<string | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function exportPremiumPdf({
  result,
  locale,
  strings,
  email,
  analysisId,
}: ExportOptions): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFont("helvetica", "normal");

  const logoDataUrl = await loadLogoAsDataUrl("/1753.png");

  // Monkey-patch text/splitTextToSize så all input går igenom safe()
  // (jspdf default-helvetica klarar bara WinAnsi/Latin-1)
  const origText = doc.text.bind(doc);
  const origSplit = doc.splitTextToSize.bind(doc);
  type TextArgs = Parameters<typeof origText>;
  (doc as { text: typeof doc.text }).text = ((
    text: TextArgs[0],
    x: number,
    y: number,
    opts?: TextArgs[3]
  ) => {
    const sanitized = Array.isArray(text)
      ? text.map((t) => (typeof t === "string" ? safe(t) : t))
      : typeof text === "string"
      ? safe(text)
      : text;
    return origText(sanitized as TextArgs[0], x, y, opts);
  }) as typeof doc.text;
  (doc as { splitTextToSize: typeof doc.splitTextToSize }).splitTextToSize = ((
    text: string,
    w: number
  ) => origSplit(typeof text === "string" ? safe(text) : text, w)) as typeof doc.splitTextToSize;

  const ctx: PdfCtx = {
    doc,
    y: CONTENT_TOP,
    strings,
    email,
    totalPagesPlaceholder: 0,
  };

  drawCover(ctx, result, logoDataUrl);
  drawToc(ctx, result);

  if (result.summary) {
    pageBreakIfNeeded(ctx, 60);
    section(ctx, strings.resultSummaryHead);
    paragraph(ctx, result.summary);
  }

  if (result.skinArchetype && (result.skinArchetype.name || result.skinArchetype.description)) {
    pageBreakIfNeeded(ctx, 70);
    section(ctx, strings.archetypeHead);
    drawArchetypeCard(ctx, result);
  }

  if (Array.isArray(result.skinDnaInsights) && result.skinDnaInsights.length > 0) {
    pageBreakIfNeeded(ctx, 90);
    section(ctx, strings.skinDnaHead);
    for (const ins of result.skinDnaInsights) {
      drawInsightCard(ctx, ins.title, ins.insight, ins.evidenceFromAnswers);
    }
  }

  if (result.lifestyleScores && hasAnyLifestyleScore(result.lifestyleScores)) {
    pageBreakIfNeeded(ctx, 150);
    section(ctx, strings.lifestyleScoresHead);
    drawLifestyleScores(ctx, result.lifestyleScores);
  }

  if (result.metrics && Object.keys(result.metrics).length > 0) {
    pageBreakIfNeeded(ctx, 120);
    section(ctx, strings.resultMetricsHead);
    drawRadarChart(ctx, result.metrics);
    spacer(ctx, 6);
    drawMetricsTable(ctx, result.metrics);
  }

  if (result.deepDive) {
    pageBreakIfNeeded(ctx, 60);
    section(ctx, strings.resultDeepDiveHead);
    if (result.deepDive.rootCauses?.length) {
      heading(ctx, strings.rootCausesHead);
      for (const cause of result.deepDive.rootCauses) {
        drawCalloutCard(ctx, cause.title || "", cause.explanation, cause.evidence);
      }
    }
    if (result.deepDive.systemicConnections?.length) {
      pageBreakIfNeeded(ctx, 40);
      heading(ctx, strings.systemicConnectionsHead);
      for (const c of result.deepDive.systemicConnections) {
        paragraph(ctx, `• ${c.system || ""}`, { bold: true });
        if (c.explanation) paragraph(ctx, c.explanation);
        spacer(ctx, 1);
      }
    }
    if (result.deepDive.skinHistoryPattern) {
      paragraph(ctx, result.deepDive.skinHistoryPattern, { muted: true, italic: true });
    }
  }

  if (result.circadianRhythm) {
    pageBreakIfNeeded(ctx, 80);
    section(ctx, strings.circadianHead);
    drawCircadianRow(ctx, result.circadianRhythm);
  }

  if (result.nutritionPlan) {
    pageBreakIfNeeded(ctx, 110);
    section(ctx, strings.nutritionHead);
    drawNutritionPlan(ctx, result.nutritionPlan);
  }

  if (Array.isArray(result.supplementSuggestions) && result.supplementSuggestions.length > 0) {
    pageBreakIfNeeded(ctx, 60);
    section(ctx, strings.supplementsHead);
    drawSupplementTable(ctx, result.supplementSuggestions);
  }

  if (result.environmentalFactors) {
    pageBreakIfNeeded(ctx, 90);
    section(ctx, strings.environmentHead);
    drawEnvironmentGrid(ctx, result.environmentalFactors);
  }

  if (Array.isArray(result.microHabits) && result.microHabits.length > 0) {
    pageBreakIfNeeded(ctx, 60);
    section(ctx, strings.microHabitsHead);
    drawMicroHabitsList(ctx, result.microHabits);
  }

  if (result.protocol4Weeks) {
    pageBreakIfNeeded(ctx, 130);
    section(ctx, strings.protocol4WeeksHead);
    if (result.protocol4Weeks.vision) {
      paragraph(ctx, result.protocol4Weeks.vision, { italic: true });
      spacer(ctx, 2);
    }
    drawWeeksTimeline(ctx, result.protocol4Weeks);
    spacer(ctx, 4);
    drawWeeksGrid(ctx, result.protocol4Weeks);
  }

  if (result.expectedTrajectory) {
    pageBreakIfNeeded(ctx, 80);
    section(ctx, strings.expectedTrajectoryHead);
    drawTrajectory(ctx, result.expectedTrajectory);
  }

  if (result.lifestyleProgram) {
    pageBreakIfNeeded(ctx, 110);
    section(ctx, strings.lifestyleProgramHead);
    drawLifestyleGrid(ctx, result.lifestyleProgram);
  }

  if (result.productProtocol) {
    pageBreakIfNeeded(ctx, 100);
    section(ctx, strings.productProtocolHead);
    drawProductProtocol(ctx, result.productProtocol);
  }

  if (Array.isArray(result.products) && result.products.length > 0) {
    pageBreakIfNeeded(ctx, 60);
    section(ctx, strings.productsHead);
    drawProductRecommendations(ctx, result.products, asLocale(locale));
  }

  if (Array.isArray(result.ingredientWarnings) && result.ingredientWarnings.length > 0) {
    pageBreakIfNeeded(ctx, 60);
    section(ctx, strings.ingredientWarningsHead);
    for (const w of result.ingredientWarnings) {
      drawWarningCard(ctx, w.ingredient, w.why, w.alternativeApproach, strings.ingredientAlternative);
    }
  }

  if (result.progressTracking) {
    pageBreakIfNeeded(ctx, 90);
    section(ctx, strings.progressTrackingHead);
    drawProgressTracking(ctx, result.progressTracking);
  }

  if (Array.isArray(result.redFlags) && result.redFlags.length > 0) {
    pageBreakIfNeeded(ctx, 50);
    section(ctx, strings.redFlagsHead);
    for (const f of result.redFlags) {
      drawWarningCard(ctx, undefined, f);
    }
  }

  if (result.psychologicalNote) {
    pageBreakIfNeeded(ctx, 60);
    section(ctx, strings.psychologicalNoteHead);
    drawBlockQuote(ctx, result.psychologicalNote);
  }

  if (result.positiveAffirmation) {
    pageBreakIfNeeded(ctx, 60);
    section(ctx, strings.positiveAffirmationHead);
    drawAffirmation(ctx, result.positiveAffirmation);
  }

  if (result.followUp) {
    pageBreakIfNeeded(ctx, 50);
    section(ctx, strings.followUpHead);
    drawFollowUp(ctx, result.followUp, strings);
  }

  pageBreakIfNeeded(ctx, 60);
  section(ctx, strings.sourcesHead);
  drawCitations(ctx, strings);

  drawFinalSignature(ctx, result, email);
  drawHeadersAndFooters(ctx);

  const filename = `1753-premium-hudanalys${analysisId ? `-${analysisId}` : ""}-${locale}.pdf`;
  doc.save(filename);
}

/* ------------------------------------------------------------------ */
/*  COVER + TOC                                                        */
/* ------------------------------------------------------------------ */

/**
 * Cover-layout (stilren / Apple-minimalistisk):
 *
 *   ┌─ tunn grön linje (1mm) ─────────────────────────────┐
 *   │                                                       │
 *   │              [1753 SKINCARE LOGO]                     │
 *   │                                                       │
 *   │                PREMIUM HUDANALYS                      │
 *   │                                                       │
 *   │           Din premium-hudanalys                       │
 *   │           ─────                                       │
 *   │   Score-label / kort beskrivning                      │
 *   │                                                       │
 *   │              [DONUT score 80mm]                       │
 *   │                                                       │
 *   │       ARKETYP    HUDÅLDER    FITZPATRICK              │
 *   │       Aurora     32          II–III                   │
 *   │                                                       │
 *   │                                                       │
 *   │   Sammanställd för …  ·  Datum …                      │
 *   │   1753 SKINCARE · 1753skin.com · info@1753skin.com    │
 *   └─ tunn grön linje (1mm) ─────────────────────────────┘
 */
function drawCover(
  ctx: PdfCtx,
  result: PremiumAnalysisResult,
  logoDataUrl: string | null
) {
  const { doc, strings, email } = ctx;

  // Ren vit bakgrund (stilren cover)
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  // Två tunna accentlinjer i topp/botten – mer subtilt än fyllda band
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, PAGE_W, 1, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, PAGE_H - 1, PAGE_W, 1, "F");

  // === LOGOTYP CENTRERAT ===
  const logoSize = 28;
  const logoX = (PAGE_W - logoSize) / 2;
  const logoY = 24;
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", logoX, logoY, logoSize, logoSize);
  } else {
    // Text-fallback om logon inte gick att ladda
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...DARK);
    doc.text("1753", PAGE_W / 2, logoY + 14, { align: "center" });
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("SKINCARE", PAGE_W / 2, logoY + 22, { align: "center" });
  }

  // === ETIKETT ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...BROWN);
  // Manuell letter-spacing genom att splitta strängen
  drawTrackedText(
    doc,
    strings.generatedBy.toUpperCase(),
    PAGE_W / 2,
    logoY + logoSize + 9,
    1.6
  );

  // === STOR HUVUDTITEL ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.setTextColor(...DARK);
  const titleLines = doc.splitTextToSize(strings.resultTitle, TEXT_W);
  doc.text(titleLines, PAGE_W / 2, logoY + logoSize + 24, { align: "center" });

  // Tunn grön accentlinje under titeln (40mm centerad)
  const accentLineY = logoY + logoSize + 30;
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.6);
  doc.line(PAGE_W / 2 - 16, accentLineY, PAGE_W / 2 + 16, accentLineY);

  // === SCORE-LABEL (kort beskrivning) ===
  if (result.scoreLabel) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...MUTED);
    const labelLines = doc.splitTextToSize(result.scoreLabel, TEXT_W - 20);
    doc.text(labelLines, PAGE_W / 2, accentLineY + 9, { align: "center" });
  }

  // === DONUT (centrerat) ===
  const donutSize = 78;
  const donutY = 138;
  if (typeof result.scoreOverall === "number") {
    const donut = renderDonut(result.scoreOverall, 700);
    if (donut) {
      doc.addImage(
        donut,
        "PNG",
        (PAGE_W - donutSize) / 2,
        donutY,
        donutSize,
        donutSize
      );
    }
  }

  // === FAKTA-GRID (3 kolumner med tunna dividers) ===
  const facts: { label: string; value: string }[] = [];
  if (result.skinArchetype?.name) {
    facts.push({ label: strings.archetypeLabel, value: result.skinArchetype.name });
  }
  if (typeof result.skinAge === "number") {
    facts.push({ label: strings.skinAgeLabel, value: String(result.skinAge) });
  }
  if (result.fitzpatrick) {
    facts.push({ label: strings.fitzpatrickLabel, value: result.fitzpatrick });
  }

  if (facts.length) {
    const factsY = donutY + donutSize + 16;
    const colW = TEXT_W / facts.length;
    facts.forEach((f, i) => {
      const cx = MARGIN_X + colW * i + colW / 2;
      // Etikett
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...BROWN);
      drawTrackedText(doc, f.label.toUpperCase(), cx, factsY, 1.2);
      // Värde
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...DARK);
      doc.text(f.value, cx, factsY + 7, { align: "center" });

      // Tunn vertikal divider mellan kolumnerna
      if (i < facts.length - 1) {
        const dividerX = MARGIN_X + colW * (i + 1);
        doc.setDrawColor(225, 225, 225);
        doc.setLineWidth(0.3);
        doc.line(dividerX, factsY - 3, dividerX, factsY + 9);
      }
    });
  }

  // === SIDFOT ===
  // Tunn divider precis ovanför sidfoten
  doc.setDrawColor(225, 225, 225);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_X, PAGE_H - 32, PAGE_W - MARGIN_X, PAGE_H - 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...BROWN);

  if (email) {
    const meta = `${strings.reportPreparedFor}: ${email}   ·   ${strings.reportDate}: ${new Date().toLocaleDateString("sv-SE")}`;
    doc.text(meta, PAGE_W / 2, PAGE_H - 24, { align: "center" });
  } else {
    doc.text(
      `${strings.reportDate}: ${new Date().toLocaleDateString("sv-SE")}`,
      PAGE_W / 2,
      PAGE_H - 24,
      { align: "center" }
    );
  }

  doc.setFontSize(8);
  doc.setTextColor(...BROWN);
  doc.text(strings.contactLine, PAGE_W / 2, PAGE_H - 16, { align: "center" });
}

/**
 * Ritar text med fast pixel-spacing mellan tecken (manuellt eftersom
 * jsPDF inte har inbyggd letter-spacing). Används för små caps/etiketter.
 */
function drawTrackedText(
  doc: jsPDF,
  text: string,
  cx: number,
  y: number,
  spacing: number
) {
  const safeText = text;
  // Beräkna total bredd (chars + spacing)
  let total = 0;
  for (const ch of safeText) {
    total += doc.getTextWidth(ch) + spacing;
  }
  total -= spacing;
  let x = cx - total / 2;
  for (const ch of safeText) {
    doc.text(ch, x, y);
    x += doc.getTextWidth(ch) + spacing;
  }
}

function drawToc(ctx: PdfCtx, result: PremiumAnalysisResult) {
  const { doc, strings } = ctx;
  doc.addPage();
  ctx.y = CONTENT_TOP;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...DARK);
  doc.text(strings.tocHead, MARGIN_X, ctx.y);

  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.6);
  doc.line(MARGIN_X, ctx.y + 4, MARGIN_X + 30, ctx.y + 4);
  ctx.y += 14;

  const items: string[] = [];
  if (result.summary) items.push(strings.resultSummaryHead);
  if (result.skinArchetype) items.push(strings.archetypeHead);
  if (result.skinDnaInsights?.length) items.push(strings.skinDnaHead);
  if (result.lifestyleScores && hasAnyLifestyleScore(result.lifestyleScores))
    items.push(strings.lifestyleScoresHead);
  if (result.metrics) items.push(strings.resultMetricsHead);
  if (result.deepDive) items.push(strings.resultDeepDiveHead);
  if (result.circadianRhythm) items.push(strings.circadianHead);
  if (result.nutritionPlan) items.push(strings.nutritionHead);
  if (result.supplementSuggestions?.length) items.push(strings.supplementsHead);
  if (result.environmentalFactors) items.push(strings.environmentHead);
  if (result.microHabits?.length) items.push(strings.microHabitsHead);
  if (result.protocol4Weeks) items.push(strings.protocol4WeeksHead);
  if (result.expectedTrajectory) items.push(strings.expectedTrajectoryHead);
  if (result.lifestyleProgram) items.push(strings.lifestyleProgramHead);
  if (result.productProtocol) items.push(strings.productProtocolHead);
  if (result.products?.length) items.push(strings.productsHead);
  if (result.ingredientWarnings?.length) items.push(strings.ingredientWarningsHead);
  if (result.progressTracking) items.push(strings.progressTrackingHead);
  if (result.redFlags?.length) items.push(strings.redFlagsHead);
  if (result.psychologicalNote) items.push(strings.psychologicalNoteHead);
  if (result.positiveAffirmation) items.push(strings.positiveAffirmationHead);
  if (result.followUp) items.push(strings.followUpHead);
  items.push(strings.sourcesHead);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...DARK);

  items.forEach((label, i) => {
    if (ctx.y > CONTENT_BOTTOM - 12) {
      doc.addPage();
      ctx.y = CONTENT_TOP;
    }
    doc.setTextColor(...BROWN);
    doc.setFont("helvetica", "bold");
    doc.text(String(i + 1).padStart(2, "0"), MARGIN_X, ctx.y);
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "normal");
    doc.text(label, MARGIN_X + 12, ctx.y);
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.2);
    doc.line(MARGIN_X + 12 + doc.getTextWidth(label) + 4, ctx.y - 1, PAGE_W - MARGIN_X, ctx.y - 1);
    ctx.y += 8;
  });
}

/* ------------------------------------------------------------------ */
/*  GENERIC LAYOUT                                                     */
/* ------------------------------------------------------------------ */

function pageBreakIfNeeded(ctx: PdfCtx, needed: number) {
  if (ctx.y + needed > CONTENT_BOTTOM) {
    ctx.doc.addPage();
    ctx.y = CONTENT_TOP;
  }
}

function ensureSpace(ctx: PdfCtx, needed: number) {
  if (ctx.y + needed > CONTENT_BOTTOM) {
    ctx.doc.addPage();
    ctx.y = CONTENT_TOP;
  }
}

function section(ctx: PdfCtx, title: string) {
  // Extra luft mellan sektioner när det inte är första sektionen på sidan
  if (ctx.y > CONTENT_TOP + 5) {
    ctx.y += 10;
  }
  ensureSpace(ctx, 26);
  const { doc } = ctx;
  doc.setFillColor(...GREEN);
  doc.rect(MARGIN_X, ctx.y - 4, 4, 10, "F");
  doc.setTextColor(...DARK);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, MARGIN_X + 10, ctx.y + 3);

  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_X, ctx.y + 9, PAGE_W - MARGIN_X, ctx.y + 9);
  ctx.y += 18;
}

function heading(ctx: PdfCtx, text: string) {
  ctx.y += 3;
  ensureSpace(ctx, 14);
  ctx.doc.setTextColor(...GREEN);
  ctx.doc.setFontSize(11);
  ctx.doc.setFont("helvetica", "bold");
  ctx.doc.text(text.toUpperCase(), MARGIN_X, ctx.y);
  ctx.y += 7;
}

interface ParaOpts {
  bold?: boolean;
  italic?: boolean;
  muted?: boolean;
  size?: number;
  indent?: number;
}

function paragraph(ctx: PdfCtx, text: string, opts: ParaOpts = {}) {
  if (!text) return;
  const { doc } = ctx;
  doc.setFont("helvetica", opts.bold ? "bold" : opts.italic ? "italic" : "normal");
  doc.setFontSize(opts.size || (opts.muted ? 9 : 10));
  doc.setTextColor(...(opts.muted ? BROWN : DARK));
  const indent = opts.indent || 0;
  const wrapped = doc.splitTextToSize(text, TEXT_W - indent);
  for (const line of wrapped) {
    ensureSpace(ctx, 5.5);
    doc.text(line, MARGIN_X + indent, ctx.y);
    ctx.y += opts.muted ? 4.5 : 5;
  }
  ctx.y += 1;
}

function spacer(ctx: PdfCtx, h: number) {
  ctx.y += h;
}

/* ------------------------------------------------------------------ */
/*  SECTION RENDERERS                                                  */
/* ------------------------------------------------------------------ */

function drawArchetypeCard(ctx: PdfCtx, result: PremiumAnalysisResult) {
  const { doc, strings } = ctx;
  const a = result.skinArchetype || {};
  const cardH = 50;
  ensureSpace(ctx, cardH + 4);

  doc.setFillColor(...GREEN_SOFT);
  doc.roundedRect(MARGIN_X, ctx.y, TEXT_W, cardH, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GREEN);
  doc.text(strings.archetypeLabel.toUpperCase(), MARGIN_X + 6, ctx.y + 9);

  doc.setFontSize(20);
  doc.setTextColor(...DARK);
  doc.text(a.name || "—", MARGIN_X + 6, ctx.y + 19);

  if (a.tagline) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...MUTED);
    doc.text(a.tagline, MARGIN_X + 6, ctx.y + 26);
  }

  if (a.description) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...DARK);
    const wrapped = doc.splitTextToSize(a.description, TEXT_W - 12);
    doc.text(wrapped, MARGIN_X + 6, ctx.y + 34);
  }

  ctx.y += cardH + 4;
}

function drawInsightCard(
  ctx: PdfCtx,
  title: string | undefined,
  insight: string | undefined,
  evidence?: string[]
) {
  const { doc } = ctx;
  const lines = doc.splitTextToSize(insight || "", TEXT_W - 12);
  const evidenceText = evidence?.length ? evidence.join(" · ") : "";
  const evLines = evidenceText ? doc.splitTextToSize(evidenceText, TEXT_W - 12) : [];
  const cardH = Math.max(28, 14 + lines.length * 5 + (evLines.length ? evLines.length * 4 + 4 : 0));
  ensureSpace(ctx, cardH + 5);

  doc.setFillColor(...WHITE);
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN_X, ctx.y, TEXT_W, cardH, 3, 3, "FD");

  doc.setFillColor(...GREEN);
  doc.rect(MARGIN_X, ctx.y, 2, cardH, "F");

  let yy = ctx.y + 7;
  if (title) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    doc.text(title, MARGIN_X + 6, yy);
    yy += 6;
  }
  if (lines.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...MUTED);
    doc.text(lines, MARGIN_X + 6, yy);
    yy += lines.length * 5;
  }
  if (evLines.length) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(...BROWN);
    doc.text(evLines, MARGIN_X + 6, yy + 2);
  }

  ctx.y += cardH + 5;
}

function drawCalloutCard(
  ctx: PdfCtx,
  title: string,
  body?: string,
  evidence?: string[]
) {
  drawInsightCard(ctx, title, body, evidence);
}

function drawWarningCard(
  ctx: PdfCtx,
  title?: string,
  body?: string,
  alternative?: string,
  alternativeLabel?: string
) {
  const { doc } = ctx;
  const lines = doc.splitTextToSize(body || "", TEXT_W - 12);
  const altLines = alternative
    ? doc.splitTextToSize(`${alternativeLabel || "Alternativ"}: ${alternative}`, TEXT_W - 12)
    : [];
  const cardH = Math.max(20, 8 + (title ? 6 : 0) + lines.length * 5 + (altLines.length ? altLines.length * 4 + 2 : 0));
  ensureSpace(ctx, cardH + 3);

  doc.setFillColor(...AMBER_SOFT);
  doc.setDrawColor(...AMBER_BORDER);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN_X, ctx.y, TEXT_W, cardH, 3, 3, "FD");

  let yy = ctx.y + 7;
  if (title) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(146, 64, 14);
    doc.text(title, MARGIN_X + 6, yy);
    yy += 6;
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...DARK);
  if (lines.length) {
    doc.text(lines, MARGIN_X + 6, yy);
    yy += lines.length * 5;
  }
  if (altLines.length) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(...BROWN);
    doc.text(altLines, MARGIN_X + 6, yy + 1);
  }

  ctx.y += cardH + 5;
}

function drawCircadianRow(ctx: PdfCtx, c: NonNullable<PremiumAnalysisResult["circadianRhythm"]>) {
  const { doc, strings } = ctx;
  const items: { label: string; ritual?: string; why?: string; tint: [number, number, number] }[] = [
    { label: strings.circadianMorning, ritual: c.morning?.ritual, why: c.morning?.why, tint: [255, 244, 214] },
    { label: strings.circadianMidday, ritual: c.midday?.ritual, why: c.midday?.why, tint: [255, 230, 220] },
    { label: strings.circadianEvening, ritual: c.evening?.ritual, why: c.evening?.why, tint: [232, 230, 250] },
  ];
  const colW = (TEXT_W - 8) / 3;
  const cardH = 46;
  ensureSpace(ctx, cardH + 4);

  items.forEach((it, i) => {
    const x = MARGIN_X + i * (colW + 4);
    doc.setFillColor(...it.tint);
    doc.roundedRect(x, ctx.y, colW, cardH, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...DARK);
    doc.text(it.label.toUpperCase(), x + 4, ctx.y + 7);

    if (it.ritual) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      const wrapped = doc.splitTextToSize(it.ritual, colW - 8);
      doc.text(wrapped, x + 4, ctx.y + 15);
    }
    if (it.why) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      const w2 = doc.splitTextToSize(it.why, colW - 8);
      doc.text(w2, x + 4, ctx.y + 28);
    }
  });
  ctx.y += cardH + 7;
}

function drawNutritionPlan(ctx: PdfCtx, plan: NonNullable<PremiumAnalysisResult["nutritionPlan"]>) {
  const { doc, strings } = ctx;
  if (plan.headline) {
    paragraph(ctx, plan.headline, { italic: true });
    spacer(ctx, 1);
  }

  // Add / Limit kort
  const colW = (TEXT_W - 4) / 2;
  const startY = ctx.y;
  const cardPad = 5;

  const renderList = (
    x: number,
    y: number,
    title: string,
    items: { primary?: string; secondary?: string; tertiary?: string }[],
    accent: [number, number, number],
    bg: [number, number, number]
  ) => {
    let h = 14;
    items.forEach((it) => {
      h += 6;
      if (it.secondary) {
        const wr = doc.splitTextToSize(it.secondary, colW - 12);
        h += wr.length * 4;
      }
      if (it.tertiary) {
        const wr = doc.splitTextToSize(it.tertiary, colW - 12);
        h += wr.length * 4 + 1;
      }
      h += 2;
    });
    doc.setFillColor(...bg);
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, colW, h, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...accent);
    doc.text(title.toUpperCase(), x + cardPad, y + 8);

    let yy = y + 14;
    items.forEach((it) => {
      if (it.primary) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...DARK);
        doc.text(it.primary, x + cardPad, yy);
        yy += 5;
      }
      if (it.secondary) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...MUTED);
        const wr = doc.splitTextToSize(it.secondary, colW - 12);
        doc.text(wr, x + cardPad, yy);
        yy += wr.length * 4;
      }
      if (it.tertiary) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(...BROWN);
        const wr = doc.splitTextToSize(it.tertiary, colW - 12);
        doc.text(wr, x + cardPad, yy);
        yy += wr.length * 4;
      }
      yy += 2;
    });
    return h;
  };

  const adds = plan.foodsToAdd?.map((f) => ({
    primary: f.food,
    secondary: f.why,
    tertiary: f.frequency,
  })) || [];
  const limits = plan.foodsToLimit?.map((f) => ({
    primary: f.food,
    secondary: f.why,
    tertiary: f.alternative,
  })) || [];

  const totalNeeded = Math.max(60, 60);
  pageBreakIfNeeded(ctx, totalNeeded);
  const yLine = ctx.y;
  const h1 = adds.length
    ? renderList(MARGIN_X, yLine, strings.foodsToAdd, adds, GREEN, GREEN_SOFT)
    : 0;
  const h2 = limits.length
    ? renderList(MARGIN_X + colW + 4, yLine, strings.foodsToLimit, limits, AMBER_BORDER, AMBER_SOFT)
    : 0;
  ctx.y = startY + Math.max(h1, h2) + 4;

  // Sample day
  if (plan.sampleDay) {
    pageBreakIfNeeded(ctx, 50);
    const meals: { label: string; value?: string }[] = [
      { label: strings.breakfast, value: plan.sampleDay.breakfast },
      { label: strings.lunch, value: plan.sampleDay.lunch },
      { label: strings.dinner, value: plan.sampleDay.dinner },
      { label: strings.snacks, value: plan.sampleDay.snacks },
    ].filter((m) => m.value);
    if (meals.length) {
      heading(ctx, strings.sampleDay);
      const cellW = (TEXT_W - 4) / 2;
      const startY2 = ctx.y;
      meals.forEach((meal, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = MARGIN_X + col * (cellW + 4);
        const yy = startY2 + row * 24;
        doc.setFillColor(...BG);
        doc.roundedRect(x, yy, cellW, 22, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...GREEN);
        doc.text(meal.label.toUpperCase(), x + 4, yy + 6);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...DARK);
        const wr = doc.splitTextToSize(meal.value || "", cellW - 8);
        doc.text(wr.slice(0, 3), x + 4, yy + 12);
      });
      ctx.y = startY2 + Math.ceil(meals.length / 2) * 24 + 2;
    }
  }

  if (plan.hydrationGoal) {
    paragraph(ctx, `${strings.hydrationGoal}: ${plan.hydrationGoal}`, { bold: true });
  }
}

function drawSupplementTable(
  ctx: PdfCtx,
  list: NonNullable<PremiumAnalysisResult["supplementSuggestions"]>
) {
  const { doc, strings } = ctx;
  // Header
  ensureSpace(ctx, 10);
  doc.setFillColor(...GREEN);
  doc.rect(MARGIN_X, ctx.y, TEXT_W, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...WHITE);
  doc.text("NAMN", MARGIN_X + 3, ctx.y + 5.5);
  doc.text(strings.doseLabel.toUpperCase(), MARGIN_X + 70, ctx.y + 5.5);
  doc.text(strings.evidenceLabel.toUpperCase(), MARGIN_X + 110, ctx.y + 5.5);
  ctx.y += 10;

  list.forEach((s, i) => {
    const lines = s.why ? doc.splitTextToSize(s.why, TEXT_W - 6) : [];
    const rowH = Math.max(8, 8 + lines.length * 4);
    ensureSpace(ctx, rowH + 2);

    if (i % 2 === 0) {
      doc.setFillColor(...BG);
      doc.rect(MARGIN_X, ctx.y - 1, TEXT_W, rowH + 2, "F");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text(s.name || "—", MARGIN_X + 3, ctx.y + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    if (s.dose) doc.text(s.dose, MARGIN_X + 70, ctx.y + 4);
    if (s.evidenceLevel) doc.text(String(s.evidenceLevel), MARGIN_X + 110, ctx.y + 4);

    if (lines.length) {
      doc.setFontSize(8.5);
      doc.setTextColor(...BROWN);
      doc.text(lines, MARGIN_X + 3, ctx.y + 9);
    }

    ctx.y += rowH + 4;
  });
}

function drawEnvironmentGrid(
  ctx: PdfCtx,
  env: NonNullable<PremiumAnalysisResult["environmentalFactors"]>
) {
  const { doc, strings } = ctx;
  const factors: {
    key: keyof NonNullable<PremiumAnalysisResult["environmentalFactors"]>;
    label: string;
  }[] = [
    { key: "uv", label: strings.envUv },
    { key: "blueLight", label: strings.envBlueLight },
    { key: "pollution", label: strings.envPollution },
    { key: "climate", label: strings.envClimate },
    { key: "waterHardness", label: strings.envWater },
  ];
  const cols = 2;
  const colW = (TEXT_W - (cols - 1) * 4) / cols;

  // Förrendera kort så vi kan beräkna varje rads max-höjd och lägga
  // korten på rätt y. Annars hamnar nästa rad ovanpå föregående om
  // korten i samma rad har olika textmängd.
  type EnvCard = {
    label: string;
    impact?: string;
    adviceLines: string[];
    cardH: number;
  };
  const cards: EnvCard[] = [];
  for (const f of factors) {
    const data = env[f.key];
    if (!data) continue;
    const adviceLines = data.advice
      ? doc.splitTextToSize(data.advice, colW - 10)
      : [];
    const cardH = Math.max(28, 16 + adviceLines.length * 4);
    cards.push({
      label: f.label,
      impact: data.impact,
      adviceLines,
      cardH,
    });
  }

  let yCursor = ctx.y;
  let col = 0;
  let rowMaxH = 0;
  cards.forEach((card, i) => {
    if (col === 0) {
      const partner = cards[i + 1];
      const rowH = partner ? Math.max(card.cardH, partner.cardH) : card.cardH;
      if (yCursor + rowH > CONTENT_BOTTOM) {
        doc.addPage();
        yCursor = CONTENT_TOP;
      }
      rowMaxH = card.cardH;
    } else {
      rowMaxH = Math.max(rowMaxH, card.cardH);
    }

    const x = MARGIN_X + col * (colW + 4);
    const y = yCursor;

    doc.setFillColor(...WHITE);
    doc.setDrawColor(225, 225, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, colW, card.cardH, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...GREEN);
    doc.text(card.label.toUpperCase(), x + 5, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...BROWN);
    if (card.impact) {
      doc.text(`${strings.envImpact}: ${card.impact}`, x + 5, y + 12);
    }

    if (card.adviceLines.length) {
      doc.setFontSize(9);
      doc.setTextColor(...DARK);
      doc.text(card.adviceLines, x + 5, y + 18);
    }

    col++;
    if (col >= cols) {
      col = 0;
      yCursor += rowMaxH + 4;
      rowMaxH = 0;
    }
  });
  if (col !== 0) yCursor += rowMaxH + 4;
  ctx.y = yCursor + 3;
}

function drawMicroHabitsList(
  ctx: PdfCtx,
  list: NonNullable<PremiumAnalysisResult["microHabits"]>
) {
  const { doc, strings } = ctx;
  list.forEach((h, i) => {
    const habitLines = doc.splitTextToSize(h.habit || "", TEXT_W - 22);
    const meta = [
      h.stackWith ? `${strings.microHabitStackWith}: ${h.stackWith}` : "",
      h.duration ? `${strings.microHabitDuration}: ${h.duration}` : "",
    ]
      .filter(Boolean)
      .join("  ·  ");
    const metaLines = meta ? doc.splitTextToSize(meta, TEXT_W - 22) : [];
    const rowH = Math.max(14, 6 + habitLines.length * 5 + metaLines.length * 4 + 4);
    ensureSpace(ctx, rowH + 2);

    doc.setFillColor(...BG);
    doc.roundedRect(MARGIN_X, ctx.y, TEXT_W, rowH, 2, 2, "F");

    doc.setFillColor(...GREEN);
    doc.circle(MARGIN_X + 7, ctx.y + 8, 4.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...WHITE);
    doc.text(String(i + 1), MARGIN_X + 7, ctx.y + 9.5, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text(habitLines, MARGIN_X + 16, ctx.y + 7);

    if (metaLines.length) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(...BROWN);
      doc.text(metaLines, MARGIN_X + 16, ctx.y + 7 + habitLines.length * 5 + 1);
    }

    ctx.y += rowH + 4;
  });
}

function drawWeeksTimeline(
  ctx: PdfCtx,
  protocol: NonNullable<PremiumAnalysisResult["protocol4Weeks"]>
) {
  const { doc } = ctx;
  ensureSpace(ctx, 22);
  const lineY = ctx.y + 8;
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.6);
  doc.line(MARGIN_X + 4, lineY, PAGE_W - MARGIN_X - 4, lineY);

  const xs = [0, 1, 2, 3].map(
    (i) => MARGIN_X + 4 + (i * (TEXT_W - 8)) / 3
  );
  const weeks = ["week1", "week2", "week3", "week4"] as const;
  xs.forEach((x, i) => {
    const w = protocol[weeks[i]];
    doc.setFillColor(w ? GREEN[0] : 200, w ? GREEN[1] : 200, w ? GREEN[2] : 200);
    doc.circle(x, lineY, 3, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text(`V${i + 1}`, x, lineY - 3, { align: "center" });
    if (w?.focus) {
      const wr = doc.splitTextToSize(w.focus, 38);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...MUTED);
      doc.text(wr.slice(0, 2), x, lineY + 6, { align: "center" });
    }
  });
  ctx.y += 22;
}

function drawWeeksGrid(
  ctx: PdfCtx,
  protocol: NonNullable<PremiumAnalysisResult["protocol4Weeks"]>
) {
  const { doc, strings } = ctx;
  const weeks = ["week1", "week2", "week3", "week4"] as const;
  const colW = (TEXT_W - 4) / 2;
  let col = 0;
  const tints: [number, number, number][] = [
    [232, 244, 241],
    [254, 243, 199],
    [243, 232, 252],
    [254, 226, 226],
  ];
  // Förrendera kort-höjder så vi kan använda MAX(vänster, höger) per rad
  // och därmed undvika att kort från olika rader hamnar ovanpå varandra.
  type WeekCard = {
    idx: number;
    wk: typeof weeks[number];
    focusLines: string[];
    actionsLines: string[];
    milestoneLines: string[];
    cardH: number;
  };
  const cards: WeekCard[] = [];
  weeks.forEach((wk, idx) => {
    const w = protocol[wk];
    if (!w) return;
    const actionsLines: string[] = [];
    if (w.actions?.length) {
      w.actions.forEach((a) => {
        const wr = doc.splitTextToSize(`• ${a}`, colW - 10);
        actionsLines.push(...wr);
      });
    }
    const focusLines = w.focus
      ? doc.splitTextToSize(`${strings.weekFocus}: ${w.focus}`, colW - 10)
      : [];
    const milestoneLines = w.milestone
      ? doc.splitTextToSize(`${strings.weekMilestone}: ${w.milestone}`, colW - 10)
      : [];
    const cardH = Math.max(
      55,
      14 + focusLines.length * 5 + actionsLines.length * 4.5 + milestoneLines.length * 4 + 6
    );
    cards.push({ idx, wk, focusLines, actionsLines, milestoneLines, cardH });
  });

  let rowMaxH = 0;
  cards.forEach((card, i) => {
    if (col === 0) {
      // Vid radstart: säkerställ utrymme för den högsta kortet i raden
      const partner = cards[i + 1];
      const rowH = partner ? Math.max(card.cardH, partner.cardH) : card.cardH;
      if (ctx.y + rowH > CONTENT_BOTTOM) {
        doc.addPage();
        ctx.y = CONTENT_TOP;
      }
      rowMaxH = card.cardH;
    } else {
      rowMaxH = Math.max(rowMaxH, card.cardH);
    }

    const x = MARGIN_X + col * (colW + 4);
    const y = ctx.y;

    doc.setFillColor(...tints[card.idx]);
    doc.roundedRect(x, y, colW, card.cardH, 3, 3, "F");

    doc.setFillColor(...GREEN);
    doc.rect(x, y, colW, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...WHITE);
    doc.text(
      strings.weekLabel.replace("{n}", String(card.idx + 1)).toUpperCase(),
      x + 4,
      y + 5.5
    );

    let yy = y + 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...DARK);
    if (card.focusLines.length) {
      doc.text(card.focusLines, x + 4, yy);
      yy += card.focusLines.length * 5;
    }
    if (card.actionsLines.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...MUTED);
      doc.text(card.actionsLines, x + 4, yy + 1);
      yy += card.actionsLines.length * 4.5 + 1;
    }
    if (card.milestoneLines.length) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(...GREEN);
      doc.text(card.milestoneLines, x + 4, yy + 2);
    }

    col++;
    if (col >= 2) {
      col = 0;
      ctx.y = y + rowMaxH + 6;
      rowMaxH = 0;
    }
  });
  // Om sista raden bara har ett kort: stega förbi det
  if (col !== 0) ctx.y += rowMaxH + 6;
}

function drawTrajectory(
  ctx: PdfCtx,
  traj: NonNullable<PremiumAnalysisResult["expectedTrajectory"]>
) {
  const { doc, strings } = ctx;
  const weeks = ["week1", "week2", "week3", "week4"] as const;
  weeks.forEach((wk, idx) => {
    const text = traj[wk];
    if (!text) return;
    const wr = doc.splitTextToSize(text, TEXT_W - 18);
    const cardH = 10 + wr.length * 5;
    ensureSpace(ctx, cardH + 3);

    doc.setFillColor(...WHITE);
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(0.5);
    doc.line(MARGIN_X + 6, ctx.y, MARGIN_X + 6, ctx.y + cardH);

    doc.setFillColor(...GREEN);
    doc.circle(MARGIN_X + 6, ctx.y + 5, 2.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...WHITE);
    doc.text(String(idx + 1), MARGIN_X + 6, ctx.y + 6.2, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...GREEN);
    doc.text(strings.weekLabel.replace("{n}", String(idx + 1)), MARGIN_X + 13, ctx.y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...DARK);
    doc.text(wr, MARGIN_X + 13, ctx.y + 11);

    ctx.y += cardH + 6;
  });
}

function drawLifestyleGrid(
  ctx: PdfCtx,
  lp: NonNullable<PremiumAnalysisResult["lifestyleProgram"]>
) {
  const { doc } = ctx;
  const entries = Object.entries(lp);
  const colW = (TEXT_W - 4) / 2;
  const startY = ctx.y;
  let yCol0 = startY;
  let yCol1 = startY;

  entries.forEach((entry, i) => {
    const [key, val] = entry;
    const actionsLines: string[] = [];
    if (val.actions?.length) {
      val.actions.forEach((a) => {
        const wr = doc.splitTextToSize(`• ${a}`, colW - 10);
        actionsLines.push(...wr);
      });
    }
    const headlineLines = val.headline
      ? doc.splitTextToSize(val.headline, colW - 10)
      : [];
    const whyLines = val.why ? doc.splitTextToSize(val.why, colW - 10) : [];
    const cardH = Math.max(
      40,
      14 + headlineLines.length * 5 + actionsLines.length * 4.5 + whyLines.length * 4 + 6
    );

    const col = i % 2;
    const x = MARGIN_X + col * (colW + 4);
    let y = col === 0 ? yCol0 : yCol1;
    if (y + cardH > CONTENT_BOTTOM) {
      doc.addPage();
      y = CONTENT_TOP;
      if (col === 0) yCol0 = y;
      else yCol1 = y;
    }

    doc.setFillColor(...BG);
    doc.roundedRect(x, y, colW, cardH, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...GREEN);
    doc.text(key.toUpperCase(), x + 5, y + 7);

    if (val.expectedImpact) {
      const tagW = doc.getTextWidth(val.expectedImpact) + 6;
      doc.setFillColor(...WHITE);
      doc.roundedRect(x + colW - tagW - 5, y + 3, tagW, 6, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...BROWN);
      doc.text(val.expectedImpact.toUpperCase(), x + colW - tagW / 2 - 5, y + 7, { align: "center" });
    }

    let yy = y + 14;
    if (headlineLines.length) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...DARK);
      doc.text(headlineLines, x + 5, yy);
      yy += headlineLines.length * 5;
    }
    if (actionsLines.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...MUTED);
      doc.text(actionsLines, x + 5, yy);
      yy += actionsLines.length * 4.5;
    }
    if (whyLines.length) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(...BROWN);
      doc.text(whyLines, x + 5, yy + 2);
    }

    if (col === 0) yCol0 = y + cardH + 6;
    else yCol1 = y + cardH + 6;
  });
  ctx.y = Math.max(yCol0, yCol1) + 2;
}

function drawProductProtocol(
  ctx: PdfCtx,
  pp: NonNullable<PremiumAnalysisResult["productProtocol"]>
) {
  const { doc, strings } = ctx;
  const slots: { key: keyof typeof pp; label: string }[] = [
    { key: "morning", label: strings.protocolMorning },
    { key: "evening", label: strings.protocolEvening },
    { key: "weekly", label: strings.protocolWeekly },
  ];
  const colW = (TEXT_W - 8) / 3;
  const startY = ctx.y;
  let maxH = 0;

  slots.forEach((s, i) => {
    const items = pp[s.key];
    if (!items?.length) return;
    const x = MARGIN_X + i * (colW + 4);

    let yy = startY + 12;
    const lineHeights: number[] = [];

    items.forEach((it) => {
      const stepLines = it.step ? doc.splitTextToSize(it.step, colW - 8) : [];
      const whyLines = it.why ? doc.splitTextToSize(it.why, colW - 8) : [];
      lineHeights.push(stepLines.length * 5 + whyLines.length * 4 + 4);
    });
    const totalH = 14 + lineHeights.reduce((a, b) => a + b, 0);

    doc.setFillColor(...WHITE);
    doc.setDrawColor(225, 225, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, startY, colW, totalH, 3, 3, "FD");

    doc.setFillColor(...GREEN);
    doc.rect(x, startY, colW, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...WHITE);
    doc.text(s.label.toUpperCase(), x + 4, startY + 5.5);

    items.forEach((it) => {
      const stepLines = it.step ? doc.splitTextToSize(it.step, colW - 8) : [];
      const whyLines = it.why ? doc.splitTextToSize(it.why, colW - 8) : [];
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...DARK);
      if (stepLines.length) {
        doc.text(stepLines, x + 4, yy);
        yy += stepLines.length * 5;
      }
      if (whyLines.length) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(...BROWN);
        doc.text(whyLines, x + 4, yy);
        yy += whyLines.length * 4;
      }
      yy += 3;
    });

    if (totalH > maxH) maxH = totalH;
  });

  ctx.y = startY + maxH + 7;
}

function drawLifestyleScores(
  ctx: PdfCtx,
  scores: NonNullable<PremiumAnalysisResult["lifestyleScores"]>
) {
  const { doc, strings } = ctx;
  const labels: Record<LifestyleKey, string> = {
    sleep: strings.lifestyleSleep,
    stress: strings.lifestyleStress,
    nutrition: strings.lifestyleNutrition,
    gut: strings.lifestyleGut,
    movement: strings.lifestyleMovement,
  };

  const weakest = determineWeakestLink(scores);

  // Radarchart till vänster, staplar till höger
  const radarSize = 78;
  const radarPng = renderLifestyleRadar(scores, labels, 700);
  const startY = ctx.y;

  ensureSpace(ctx, radarSize + 14);

  if (radarPng) {
    doc.addImage(radarPng, "PNG", MARGIN_X, startY, radarSize, radarSize);
  }

  // Stapellista till höger
  const barX = MARGIN_X + radarSize + 8;
  const barW = PAGE_W - MARGIN_X - barX;
  let barY = startY;
  const rowH = 14.5;

  for (const k of LIFESTYLE_KEYS) {
    const entry = scores[k];
    if (typeof entry?.score !== "number") continue;
    const score = Math.max(0, Math.min(100, entry.score));
    const isWeakest = k === weakest;

    // Bakgrundskort om svagast
    if (isWeakest) {
      doc.setFillColor(...GREEN_SOFT);
      doc.roundedRect(barX - 2, barY - 2.5, barW + 4, rowH + 1, 2, 2, "F");
    }

    // Etikett
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    doc.text(labels[k].toUpperCase(), barX, barY + 3);

    if (isWeakest) {
      const tag = strings.lifestyleStartHere.toUpperCase();
      const tagW = doc.getTextWidth(tag) + 4;
      const tagX = barX + doc.getTextWidth(labels[k].toUpperCase()) + 3;
      doc.setFillColor(...GREEN);
      doc.roundedRect(tagX, barY - 1, tagW, 4.6, 1.2, 1.2, "F");
      doc.setFontSize(6.2);
      doc.setTextColor(...WHITE);
      doc.text(tag, tagX + tagW / 2, barY + 2.4, { align: "center" });
    }

    // Score-tal till höger ("55 / 100")
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text(`${Math.round(score)} / 100`, barX + barW - 3, barY + 3, {
      align: "right",
    });

    // Stapel (bakgrund + fyllning)
    const trackY = barY + 5.2;
    const trackH = 2;
    doc.setFillColor(225, 225, 225);
    doc.roundedRect(barX, trackY, barW, trackH, 1, 1, "F");
    const fill: [number, number, number] =
      score >= 80 ? GREEN : score >= 60 ? GOLD : [217, 119, 87];
    doc.setFillColor(...fill);
    doc.roundedRect(barX, trackY, (barW * score) / 100, trackH, 1, 1, "F");

    // Detaljtext
    if (entry?.detail) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...MUTED);
      const detailLines = doc.splitTextToSize(entry.detail, barW);
      doc.text(detailLines.slice(0, 1), barX, barY + 11);
    }

    barY += rowH;
  }

  ctx.y = Math.max(startY + radarSize, barY) + 8;

  // Svagaste-länken-callout
  if (weakest) {
    drawWeakestLinkCallout(ctx, weakest, scores, labels);
  }
}

function drawWeakestLinkCallout(
  ctx: PdfCtx,
  weakest: LifestyleKey,
  scores: NonNullable<PremiumAnalysisResult["lifestyleScores"]>,
  labels: Record<LifestyleKey, string>
) {
  const { doc, strings } = ctx;
  const entry = scores[weakest];
  const headlineText = labels[weakest];
  const score = Math.round(entry?.score ?? 0);
  const insight = scores.weakestLinkInsight || "";
  const insightLines = insight
    ? doc.splitTextToSize(insight, TEXT_W - 18)
    : [];
  const levers = (entry?.topLevers || []).slice(0, 3);
  const leverColW = (TEXT_W - 18 - 8) / Math.max(1, levers.length);

  // Beräkna leverans-höjd: 3 kolumner med varje text wraps
  const leverLineHeights = levers.map((lv) =>
    doc.splitTextToSize(lv, leverColW - 14).length
  );
  const maxLeverLines = Math.max(0, ...leverLineHeights);
  const leverBlockH = levers.length ? 14 + maxLeverLines * 4.5 : 0;

  const calloutH =
    18 + insightLines.length * 5 + (leverBlockH ? leverBlockH + 6 : 0);
  ensureSpace(ctx, calloutH + 4);

  // Bakgrund
  doc.setFillColor(...GREEN_SOFT);
  doc.roundedRect(MARGIN_X, ctx.y, TEXT_W, calloutH, 4, 4, "F");

  // Etikett "Svagaste länken"
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GREEN);
  doc.text(strings.lifestyleWeakestLink.toUpperCase(), MARGIN_X + 7, ctx.y + 7);

  // Stort namn + score
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...DARK);
  const nameW = doc.getTextWidth(headlineText);
  doc.text(headlineText, MARGIN_X + 7, ctx.y + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...BROWN);
  doc.text(`${score} / 100`, MARGIN_X + 7 + nameW + 4, ctx.y + 16);

  let yy = ctx.y + 22;
  if (insightLines.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...DARK);
    doc.text(insightLines, MARGIN_X + 7, yy);
    yy += insightLines.length * 5;
  }

  // Hävstångar
  if (levers.length) {
    yy += 3;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...BROWN);
    doc.text(
      strings.lifestyleTopLevers.toUpperCase(),
      MARGIN_X + 7,
      yy
    );
    yy += 4;

    levers.forEach((lever, i) => {
      const colGap = 4;
      const usableW = TEXT_W - 14;
      const cardW = (usableW - colGap * (levers.length - 1)) / levers.length;
      const colX = MARGIN_X + 7 + i * (cardW + colGap);
      doc.setFillColor(...WHITE);
      doc.roundedRect(colX, yy, cardW, leverBlockH - 6, 2, 2, "F");
      // Nummer
      doc.setFillColor(...GREEN);
      doc.circle(colX + 5, yy + 5.5, 2.8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...WHITE);
      doc.text(String(i + 1), colX + 5, yy + 6.5, { align: "center" });
      // Text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...DARK);
      const wr = doc.splitTextToSize(lever, cardW - 14);
      doc.text(wr, colX + 11, yy + 5);
    });
  }

  ctx.y += calloutH + 6;
}

function renderLifestyleRadar(
  scores: NonNullable<PremiumAnalysisResult["lifestyleScores"]>,
  labels: Record<LifestyleKey, string>,
  size = 600
): string | null {
  const c = getCanvas(size);
  if (!c) return null;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, size, size);

  const entries = LIFESTYLE_KEYS.filter(
    (k) => typeof scores[k]?.score === "number"
  );
  const n = entries.length;
  if (!n) return null;

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.32;

  ctx.strokeStyle = "#e6e6e6";
  ctx.lineWidth = 1;
  for (let g = 1; g <= 5; g++) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
      const x = cx + Math.cos(angle) * radius * (g / 5);
      const y = cy + Math.sin(angle) * radius * (g / 5);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  ctx.fillStyle = "#766a62";
  ctx.font = `600 ${Math.round(size * 0.046)}px helvetica, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.strokeStyle = "#e6e6e6";
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();

    const lblX = cx + Math.cos(angle) * (radius + size * 0.07);
    const lblY = cy + Math.sin(angle) * (radius + size * 0.07);
    ctx.fillStyle = "#1d1d1f";
    ctx.fillText(labels[entries[i]], lblX, lblY);
  }

  ctx.fillStyle = "rgba(16, 132, 116, 0.22)";
  ctx.strokeStyle = "#108474";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const v = Math.max(0, Math.min(100, scores[entries[i]]?.score ?? 0)) / 100;
    const x = cx + Math.cos(angle) * radius * v;
    const y = cy + Math.sin(angle) * radius * v;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#108474";
  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const v = Math.max(0, Math.min(100, scores[entries[i]]?.score ?? 0)) / 100;
    const x = cx + Math.cos(angle) * radius * v;
    const y = cy + Math.sin(angle) * radius * v;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.012, 0, Math.PI * 2);
    ctx.fill();
  }

  return c.toDataURL("image/png");
}

function drawProductRecommendations(
  ctx: PdfCtx,
  products: NonNullable<PremiumAnalysisResult["products"]>,
  locale: Locale
) {
  const { doc } = ctx;
  for (const p of products) {
    const view = getPremiumProductView(p.id, locale);
    const reasonLines = p.reason ? doc.splitTextToSize(p.reason, TEXT_W - 14) : [];
    const usageLines = p.usage ? doc.splitTextToSize(p.usage, TEXT_W - 14) : [];
    const descLines = view.shortDesc
      ? doc.splitTextToSize(view.shortDesc, TEXT_W - 14)
      : [];
    const cardH = Math.max(
      30,
      18 +
        (descLines.length ? descLines.length * 4 + 2 : 0) +
        (reasonLines.length ? reasonLines.length * 5 + 2 : 0) +
        (usageLines.length ? usageLines.length * 4 + 4 : 0) +
        4
    );
    ensureSpace(ctx, cardH + 5);

    // Card-bakgrund
    doc.setFillColor(...WHITE);
    doc.setDrawColor(225, 225, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(MARGIN_X, ctx.y, TEXT_W, cardH, 4, 4, "FD");

    // Vänsterkant
    doc.setFillColor(...GREEN);
    doc.rect(MARGIN_X, ctx.y, 3, cardH, "F");

    // Produktnamn (riktigt namn, fetstilt + Title Case)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...DARK);
    doc.text(view.name, MARGIN_X + 8, ctx.y + 9);

    // Pris-pill till höger
    if (view.price !== null) {
      const priceText = `${view.price} ${view.currency}`;
      const priceW = doc.getTextWidth(priceText) + 8;
      const pillX = PAGE_W - MARGIN_X - priceW - 4;
      doc.setFillColor(...GREEN);
      doc.roundedRect(pillX, ctx.y + 4, priceW, 7.5, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...WHITE);
      doc.text(priceText, pillX + priceW / 2, ctx.y + 9, { align: "center" });
    } else {
      // Markera "ingår i DUO-kit" för icke-säljbara
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(...BROWN);
      const note = locale === "en"
        ? "Included in DUO-kit"
        : locale === "es"
        ? "Incluido en DUO-kit"
        : locale === "de"
        ? "Enthalten im DUO-Kit"
        : locale === "fr"
        ? "Inclus dans le DUO-kit"
        : "Ingår i DUO-kit";
      doc.text(note, PAGE_W - MARGIN_X - 4, ctx.y + 9, { align: "right" });
    }

    let yy = ctx.y + 16;
    if (descLines.length) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(...BROWN);
      doc.text(descLines, MARGIN_X + 8, yy);
      yy += descLines.length * 4 + 2;
    }

    if (reasonLines.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...DARK);
      doc.text(reasonLines, MARGIN_X + 8, yy);
      yy += reasonLines.length * 5 + 2;
    }

    if (usageLines.length) {
      doc.setFillColor(...BG);
      doc.roundedRect(MARGIN_X + 8, yy, TEXT_W - 16, usageLines.length * 4 + 5, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...GREEN);
      const labelText = locale === "en"
        ? "USE"
        : locale === "es"
        ? "USO"
        : locale === "de"
        ? "ANWENDUNG"
        : locale === "fr"
        ? "UTILISATION"
        : "ANVÄNDNING";
      doc.text(labelText, MARGIN_X + 11, yy + 4);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...MUTED);
      doc.text(usageLines, MARGIN_X + 11 + doc.getTextWidth(labelText) + 4, yy + 4);
    }

    ctx.y += cardH + 5;
  }
}

function drawProgressTracking(
  ctx: PdfCtx,
  prog: NonNullable<PremiumAnalysisResult["progressTracking"]>
) {
  const { doc, strings } = ctx;
  if (prog.rephotoFrequency) {
    drawInsightCard(ctx, strings.progressRephoto, prog.rephotoFrequency);
  }
  if (prog.metricsToTrack?.length) {
    heading(ctx, strings.progressMetrics);
    for (const mm of prog.metricsToTrack) paragraph(ctx, `• ${mm}`);
  }
  if (prog.journalingPrompts?.length) {
    heading(ctx, strings.progressJournaling);
    for (const j of prog.journalingPrompts) paragraph(ctx, `“${j}”`, { italic: true });
  }
  // Anteckningsutrymme – page-break per linje förhindrar spillover
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  for (let i = 0; i < 6; i++) {
    ensureSpace(ctx, 9);
    doc.line(MARGIN_X, ctx.y, PAGE_W - MARGIN_X, ctx.y);
    ctx.y += 8;
  }
}

function drawBlockQuote(ctx: PdfCtx, text: string) {
  const { doc } = ctx;
  const wrapped = doc.splitTextToSize(text, TEXT_W - 14);
  const h = 12 + wrapped.length * 5;
  ensureSpace(ctx, h + 4);

  doc.setFillColor(...BG);
  doc.roundedRect(MARGIN_X, ctx.y, TEXT_W, h, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...GREEN);
  doc.text("\u201C", MARGIN_X + 5, ctx.y + 14);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text(wrapped, MARGIN_X + 14, ctx.y + 8);

  ctx.y += h + 6;
}

function drawAffirmation(ctx: PdfCtx, text: string) {
  const { doc } = ctx;
  const wrapped = doc.splitTextToSize(text, TEXT_W - 16);
  const h = 18 + wrapped.length * 6;
  ensureSpace(ctx, h + 4);

  doc.setFillColor(...GREEN);
  doc.roundedRect(MARGIN_X, ctx.y, TEXT_W, h, 5, 5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...WHITE);
  doc.text(wrapped, PAGE_W / 2, ctx.y + 12, { align: "center" });

  ctx.y += h + 6;
}

function drawFollowUp(
  ctx: PdfCtx,
  fu: NonNullable<PremiumAnalysisResult["followUp"]>,
  strings: PremiumPdfStrings
) {
  if (typeof fu.recommendedRescanWeeks === "number") {
    paragraph(ctx, `${strings.followUpRescan}: ${strings.followUpRescanWeeks.replace("{n}", String(fu.recommendedRescanWeeks))}`, { bold: true });
  }
  if (fu.escalationCriteria?.length) {
    heading(ctx, strings.followUpEscalation);
    for (const e of fu.escalationCriteria) paragraph(ctx, `• ${e}`);
  }
}

function categoryLabel(key: CitationCategoryKey, strings: PremiumPdfStrings): string {
  switch (key) {
    case "sleep":
      return strings.sourcesCatSleep;
    case "stress":
      return strings.sourcesCatStress;
    case "gut":
      return strings.sourcesCatGut;
    case "ecs":
      return strings.sourcesCatEcs;
    case "omega":
      return strings.sourcesCatOmega;
    case "antioxidants":
      return strings.sourcesCatAntioxidants;
    case "magnesium":
      return strings.sourcesCatMagnesium;
    case "probiotics":
      return strings.sourcesCatProbiotics;
    case "environment":
      return strings.sourcesCatEnvironment;
    case "barrier":
      return strings.sourcesCatBarrier;
    case "diet":
      return strings.sourcesCatDiet;
    case "psychology":
      return strings.sourcesCatPsychology;
  }
}

function drawCitations(ctx: PdfCtx, strings: PremiumPdfStrings) {
  const { doc } = ctx;

  paragraph(ctx, strings.sourcesIntro, { muted: true });
  ctx.y += 4;

  let counter = 1;
  PREMIUM_CITATIONS.forEach((cat, idx) => {
    if (idx > 0) ctx.y += 2;

    // Förhindra orphan-rubrik: kräv plats för rubrik + första citationen
    const firstCit = cat.items[0];
    let firstBlockH = 0;
    if (firstCit) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const aL = doc.splitTextToSize(`${firstCit.authors} `, TEXT_W - 12);
      doc.setFont("helvetica", "italic");
      const tL = doc.splitTextToSize(firstCit.title, TEXT_W - 12);
      doc.setFont("helvetica", "normal");
      const jL = doc.splitTextToSize(`${firstCit.journal}. ${firstCit.yearVolume}`, TEXT_W - 12);
      firstBlockH = aL.length * 4.4 + tL.length * 4.4 + jL.length * 4.4 + 4;
    }
    ensureSpace(ctx, 12 + firstBlockH + 4);

    // Category heading – grön versal etikett
    doc.setTextColor(...GREEN);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(categoryLabel(cat.key, strings).toUpperCase(), MARGIN_X, ctx.y);

    // Tunn linje under rubriken
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(0.25);
    doc.line(MARGIN_X, ctx.y + 2, MARGIN_X + 30, ctx.y + 2);
    ctx.y += 8;

    cat.items.forEach((c) => {
      const numLabel = `[${counter}]`;
      counter += 1;

      const numWidth = 10;
      const textIndent = numWidth + 2;
      const textWidth = TEXT_W - textIndent;

      // Bygg formaterad referens i två rader
      const line1 = `${c.authors} `;
      const line2Title = c.title;
      const line3 = `${c.journal}. ${c.yearVolume}`;

      // Beräkna höjd
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const authorsLines = doc.splitTextToSize(line1, textWidth);
      doc.setFont("helvetica", "italic");
      const titleLines = doc.splitTextToSize(line2Title, textWidth);
      doc.setFont("helvetica", "normal");
      const journalLines = doc.splitTextToSize(line3, textWidth);

      const blockH =
        authorsLines.length * 4.4 +
        titleLines.length * 4.4 +
        journalLines.length * 4.4 +
        4;

      ensureSpace(ctx, blockH);

      // Nummer
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...BROWN);
      doc.text(numLabel, MARGIN_X, ctx.y);

      // Författare
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...DARK);
      let blockY = ctx.y;
      for (const ln of authorsLines) {
        doc.text(ln, MARGIN_X + textIndent, blockY);
        blockY += 4.4;
      }
      // Titel (italic)
      doc.setFont("helvetica", "italic");
      for (const ln of titleLines) {
        doc.text(ln, MARGIN_X + textIndent, blockY);
        blockY += 4.4;
      }
      // Tidskrift + år
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...BROWN);
      for (const ln of journalLines) {
        doc.text(ln, MARGIN_X + textIndent, blockY);
        blockY += 4.4;
      }

      ctx.y = blockY + 3;
    });
  });

  // Avslutande disclaimer i mjuk grå card-yta
  ctx.y += 4;
  ensureSpace(ctx, 30);
  const disclaimerLines = doc.splitTextToSize(strings.sourcesDisclaimer, TEXT_W - 16);
  const cardH = disclaimerLines.length * 4.6 + 14;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(MARGIN_X, ctx.y, TEXT_W, cardH, 4, 4, "F");
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.4);
  doc.line(MARGIN_X, ctx.y, MARGIN_X, ctx.y + cardH);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...BROWN);
  let dy = ctx.y + 9;
  for (const ln of disclaimerLines) {
    doc.text(ln, MARGIN_X + 8, dy);
    dy += 4.6;
  }
  ctx.y += cardH + 6;
}

function drawFinalSignature(ctx: PdfCtx, _result: PremiumAnalysisResult, email?: string) {
  const { doc, strings } = ctx;
  doc.addPage();
  ctx.y = CONTENT_TOP;

  doc.setFillColor(...DARK);
  doc.roundedRect(MARGIN_X, ctx.y, TEXT_W, 110, 6, 6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GREEN);
  doc.text("1753 SKINCARE", MARGIN_X + 12, ctx.y + 16);

  doc.setFontSize(20);
  doc.setTextColor(...WHITE);
  const sigLines = doc.splitTextToSize(strings.signatureLine, TEXT_W - 24);
  doc.text(sigLines, MARGIN_X + 12, ctx.y + 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  if (email) doc.text(`${strings.reportPreparedFor}: ${email}`, MARGIN_X + 12, ctx.y + 60);
  doc.text(`${strings.reportDate}: ${new Date().toLocaleDateString("sv-SE")}`, MARGIN_X + 12, ctx.y + 68);
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  doc.text(strings.contactLine, MARGIN_X + 12, ctx.y + 92);

  ctx.y += 120;
}

/* ------------------------------------------------------------------ */
/*  HEADERS + FOOTERS                                                  */
/* ------------------------------------------------------------------ */

function drawHeadersAndFooters(ctx: PdfCtx) {
  const { doc, strings } = ctx;
  const total = (doc as unknown as { internal: { getNumberOfPages: () => number } })
    .internal.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    if (p === 1) continue;
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.2);
    doc.line(MARGIN_X, HEADER_Y - 4, PAGE_W - MARGIN_X, HEADER_Y - 4);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...GREEN);
    doc.text("1753 SKINCARE", MARGIN_X, HEADER_Y - 7);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...BROWN);
    doc.text(strings.generatedBy, PAGE_W - MARGIN_X, HEADER_Y - 7, { align: "right" });

    doc.setFontSize(8);
    doc.setTextColor(...BROWN);
    doc.text(
      strings.pageOf
        .replace("{n}", String(p))
        .replace("{total}", String(total)),
      PAGE_W - MARGIN_X,
      FOOTER_Y,
      { align: "right" }
    );
    doc.text(strings.contactLine, MARGIN_X, FOOTER_Y);
  }
}

/* ------------------------------------------------------------------ */
/*  CHARTS via off-screen canvas                                       */
/* ------------------------------------------------------------------ */

function getCanvas(size: number): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  return c;
}

function renderDonut(score: number, size = 480): string | null {
  const c = getCanvas(size);
  if (!c) return null;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.4;
  const ringW = size * 0.085;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, size, size);

  // Bakgrundsring
  ctx.beginPath();
  ctx.lineWidth = ringW;
  ctx.strokeStyle = "#e6e6e6";
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Score-ring
  const clamped = Math.max(0, Math.min(100, score));
  const start = -Math.PI / 2;
  const end = start + (clamped / 100) * Math.PI * 2;
  ctx.beginPath();
  ctx.lineWidth = ringW;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#108474";
  ctx.arc(cx, cy, r, start, end);
  ctx.stroke();

  // Score-text
  ctx.fillStyle = "#1d1d1f";
  ctx.font = `700 ${Math.round(size * 0.27)}px helvetica, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(clamped), cx, cy - size * 0.02);

  ctx.fillStyle = "#766a62";
  ctx.font = `600 ${Math.round(size * 0.08)}px helvetica, Arial, sans-serif`;
  ctx.fillText("/ 100", cx, cy + size * 0.18);

  return c.toDataURL("image/png");
}

function renderRadar(metrics: Record<string, { score?: number }>, size = 700): string | null {
  const c = getCanvas(size);
  if (!c) return null;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, size, size);

  const entries = Object.entries(metrics).filter(
    ([, v]) => v && typeof v.score === "number"
  );
  const n = entries.length;
  if (!n) return null;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.34;

  // Polar grid
  ctx.strokeStyle = "#e6e6e6";
  ctx.lineWidth = 1;
  for (let g = 1; g <= 5; g++) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
      const x = cx + Math.cos(angle) * radius * (g / 5);
      const y = cy + Math.sin(angle) * radius * (g / 5);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Axis lines + labels
  ctx.fillStyle = "#766a62";
  ctx.font = `500 ${Math.round(size * 0.024)}px helvetica, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();

    const lblX = cx + Math.cos(angle) * (radius + size * 0.06);
    const lblY = cy + Math.sin(angle) * (radius + size * 0.06);
    const label = METRIC_LABELS[entries[i][0]] || entries[i][0];
    ctx.fillText(label, lblX, lblY);
  }

  // Data area
  ctx.fillStyle = "rgba(16, 132, 116, 0.18)";
  ctx.strokeStyle = "#108474";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const v = Math.max(0, Math.min(100, entries[i][1].score || 0)) / 100;
    const x = cx + Math.cos(angle) * radius * v;
    const y = cy + Math.sin(angle) * radius * v;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Punkter
  ctx.fillStyle = "#108474";
  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const v = Math.max(0, Math.min(100, entries[i][1].score || 0)) / 100;
    const x = cx + Math.cos(angle) * radius * v;
    const y = cy + Math.sin(angle) * radius * v;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.008, 0, Math.PI * 2);
    ctx.fill();
  }

  return c.toDataURL("image/png");
}

function drawRadarChart(ctx: PdfCtx, metrics: Record<string, { score?: number }>) {
  const png = renderRadar(metrics, 800);
  if (!png) return;
  const size = 110;
  ensureSpace(ctx, size + 4);
  const x = (PAGE_W - size) / 2;
  ctx.doc.addImage(png, "PNG", x, ctx.y, size, size);
  ctx.y += size + 4;
}

function drawMetricsTable(
  ctx: PdfCtx,
  metrics: Record<string, { score?: number; detail?: string }>
) {
  const { doc } = ctx;
  const entries = Object.entries(metrics).filter(
    ([, m]) => m && typeof m.score === "number"
  );
  const colW = (TEXT_W - 4) / 2;

  // Förrendera kort (höjd) så vi alltid stegar med MAX(vänster, höger)
  // höjd per rad → texter kan aldrig krocka mellan rader.
  type MetricCard = {
    label: string;
    score: number;
    detail: string[];
    cardH: number;
  };
  const cards: MetricCard[] = entries.map(([name, metric]) => {
    const label = METRIC_LABELS[name] || name;
    const score = Math.max(0, Math.min(100, metric.score || 0));
    const detail = metric.detail
      ? doc.splitTextToSize(metric.detail, colW - 8)
      : [];
    const cardH = Math.max(18, 14 + detail.length * 4);
    return { label, score, detail, cardH };
  });

  let col = 0;
  let rowMaxH = 0;
  cards.forEach((card, i) => {
    if (col === 0) {
      const partner = cards[i + 1];
      const rowH = partner ? Math.max(card.cardH, partner.cardH) : card.cardH;
      ensureSpace(ctx, rowH + 2);
      rowMaxH = card.cardH;
    } else {
      rowMaxH = Math.max(rowMaxH, card.cardH);
    }

    const x = MARGIN_X + col * (colW + 4);
    const y = ctx.y;

    doc.setFillColor(...BG);
    doc.roundedRect(x, y, colW, card.cardH, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    doc.text(card.label, x + 4, y + 6);
    doc.setFontSize(10);
    doc.setTextColor(...GREEN);
    doc.text(String(card.score), x + colW - 4, y + 6, { align: "right" });

    // Score-bar
    doc.setFillColor(225, 225, 225);
    doc.roundedRect(x + 4, y + 8, colW - 8, 1.6, 0.8, 0.8, "F");
    const barColor: [number, number, number] =
      card.score >= 80 ? GREEN : card.score >= 60 ? GOLD : [217, 119, 87];
    doc.setFillColor(...barColor);
    doc.roundedRect(
      x + 4,
      y + 8,
      ((colW - 8) * card.score) / 100,
      1.6,
      0.8,
      0.8,
      "F"
    );

    if (card.detail.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text(card.detail, x + 4, y + 14);
    }

    col++;
    if (col >= 2) {
      col = 0;
      ctx.y = y + rowMaxH + 2;
      rowMaxH = 0;
    }
  });
  // Sista raden hade bara ett kort
  if (col !== 0) ctx.y += rowMaxH + 2;
}
