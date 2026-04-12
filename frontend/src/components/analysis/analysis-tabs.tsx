"use client";

import { useState } from "react";
import {
  Droplets,
  Heart,
  Leaf,
  Moon,
  Package,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCTS, type Product } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { useLocale } from "@/providers/locale-provider";
import { FaceCanvas as FaceCanvasLazy } from "@/components/skin-scanner/face-canvas";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SkinAnalysis {
  overview: string;
  strengths: string[];
  concerns: string[];
  microbiome: string;
  ecs: string;
}

interface ProductRec {
  id: string;
  reason: string;
  usage?: string;
}

interface LifestyleItem {
  area: string;
  tip: string;
  why?: string;
  impact: string;
  source?: string;
}

interface RoutineStep {
  step: string;
  why: string;
}

interface Routine {
  morning: RoutineStep[];
  evening: RoutineStep[];
}

export interface AnalysisTabsProps {
  score: number;
  scoreLabel?: string;
  summary: string;
  skinAnalysis?: SkinAnalysis;
  products: ProductRec[];
  lifestyle: LifestyleItem[];
  routine?: Routine;
  routineLegacy?: { morning: string[]; evening: string[] };
  avoid: string[];
  nextAnalysis: string;
  hasScan?: boolean;
  scanImageSrc?: string;
  scanZoneResults?: import("@/components/skin-scanner/zones").ZoneResult[];
}

/* ------------------------------------------------------------------ */
/*  Tab definitions                                                    */
/* ------------------------------------------------------------------ */

type TabId = "skin" | "products" | "lifestyle" | "routine";

/* ------------------------------------------------------------------ */
/*  Score ring                                                         */
/* ------------------------------------------------------------------ */

function ScoreRing({ score, label }: { score: number; label?: string }) {
  const { locale } = useLocale();
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 75 ? "#108474" : score >= 50 ? "#fcb237" : "#e55050";

  return (
    <div className="text-center">
      <div className="relative mx-auto h-44 w-44">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle cx="80" cy="80" r={r} fill="none" stroke="#e6e6e6" strokeWidth="8" />
          <circle
            cx="80" cy="80" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-[#1d1d1f]">{score}</span>
          <span className="text-xs font-medium text-[#766a62]">
            {locale === "en" ? "out of 100" : "av 100"}
          </span>
        </div>
      </div>
      {label && (
        <p className="mt-2 text-sm font-medium text-[#515151]">{label}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 1 – Din hy                                                     */
/* ------------------------------------------------------------------ */

function SkinTab({ score, scoreLabel, summary, skinAnalysis, hasScan, scanImageSrc, scanZoneResults }: {
  score: number;
  scoreLabel?: string;
  summary: string;
  skinAnalysis?: SkinAnalysis;
  hasScan?: boolean;
  scanImageSrc?: string;
  scanZoneResults?: import("@/components/skin-scanner/zones").ZoneResult[];
}) {
  const { locale } = useLocale();
  return (
    <div className="space-y-8 animate-fade-in">
      <ScoreRing score={score} label={scoreLabel} />

      <p className="mx-auto max-w-lg text-center text-sm leading-relaxed text-[#515151]">
        {summary}
      </p>

      {hasScan && scanImageSrc && scanZoneResults && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#108474]">
            <ScanFace className="h-3.5 w-3.5" />
            {locale === "en" ? "Your face scan results" : "Resultat från din ansiktsskanning"}
          </div>
          <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-[#e6e6e6] shadow-sm">
            <FaceCanvasLazy imageSrc={scanImageSrc} results={scanZoneResults} />
          </div>
        </div>
      )}

      {hasScan && !scanImageSrc && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-[#108474]/5 px-4 py-2.5 text-xs font-medium text-[#108474]">
          <ScanFace className="h-3.5 w-3.5" />
          {locale === "en"
            ? "Includes data from your face scan"
            : "Inkluderar data från din ansiktsskanning"}
        </div>
      )}

      {skinAnalysis && (
        <>
          <div className="rounded-2xl border border-[#e6e6e6] bg-white p-6 md:p-8">
            <h3 className="mb-4 text-lg font-bold tracking-tight text-[#1d1d1f]">
              {locale === "en" ? "Skin analysis" : "Hudanalys"}
            </h3>
            <div className="space-y-3 text-sm leading-relaxed text-[#515151]">
              {skinAnalysis.overview.split("\\n\\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {skinAnalysis.strengths.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-bold tracking-tight text-[#1d1d1f]">
                {locale === "en" ? "What looks strong" : "Styrkor"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {skinAnalysis.strengths.map((s, i) => (
                  <span key={i} className="rounded-full bg-[#108474]/5 px-4 py-2 text-xs font-medium text-[#108474]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {skinAnalysis.concerns.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-bold tracking-tight text-[#1d1d1f]">
                {locale === "en" ? "What to pay attention to" : "Att uppmärksamma"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {skinAnalysis.concerns.map((c, i) => (
                  <span key={i} className="rounded-full bg-[#fcb237]/10 px-4 py-2 text-xs font-medium text-[#766a62]">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#e6e6e6] bg-white p-5">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#108474]" />
                <h4 className="text-sm font-bold text-[#1d1d1f]">
                  {locale === "en" ? "Microbiome" : "Mikrobiom"}
                </h4>
              </div>
              <p className="text-sm leading-relaxed text-[#515151]">{skinAnalysis.microbiome}</p>
            </div>
            <div className="rounded-2xl border border-[#e6e6e6] bg-white p-5">
              <div className="mb-2 flex items-center gap-2">
                <Droplets className="h-4 w-4 text-[#108474]" />
                <h4 className="text-sm font-bold text-[#1d1d1f]">
                  {locale === "en" ? "Endocannabinoid system" : "Endocannabinoidsystemet"}
                </h4>
              </div>
              <p className="text-sm leading-relaxed text-[#515151]">{skinAnalysis.ecs}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 2 – Produkter                                                  */
/* ------------------------------------------------------------------ */

function ProductsTab({ products }: { products: ProductRec[] }) {
  const { locale } = useLocale();
  const matched: (Product & { reason: string; usage?: string })[] = products
    .map((rec) => {
      const p = PRODUCTS.find((prod) => prod.id === rec.id);
      return p ? { ...p, reason: rec.reason, usage: rec.usage } : null;
    })
    .filter(Boolean) as (Product & { reason: string; usage?: string })[];

  if (matched.length === 0) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-center text-sm text-[#515151]">
        {locale === "en"
          ? "Products chosen around your skin analysis"
          : "Produkter anpassade efter din hudanalys"}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {matched.map((p) => (
          <div key={p.id} className="space-y-3">
            <ProductCard product={p} />
            <div className="rounded-2xl border border-[#108474]/10 bg-[#108474]/[0.03] p-4">
              <p className="mb-1.5 text-xs font-bold text-[#108474]">
                {locale === "en" ? "Why this fits your skin" : "Varför just för dig"}
              </p>
              <p className="text-xs leading-relaxed text-[#515151]">{p.reason}</p>
              {p.usage && (
                <p className="mt-2 border-t border-[#e6e6e6] pt-2 text-xs leading-relaxed text-[#766a62]">
                  {p.usage}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 3 – Livsstil                                                   */
/* ------------------------------------------------------------------ */

const IMPACT_STYLES: Record<string, { cls: string }> = {
  "hög": { cls: "bg-red-50 text-red-700" },
  "high": { cls: "bg-red-50 text-red-700" },
  "medel": { cls: "bg-amber-50 text-amber-700" },
  "medium": { cls: "bg-amber-50 text-amber-700" },
  "låg": { cls: "bg-green-50 text-green-700" },
  "low": { cls: "bg-green-50 text-green-700" },
};

const AREA_ICONS: Record<string, LucideIcon> = {
  "Sömn": Moon,
  "Sleep": Moon,
  "Stress": Heart,
  "Kost": Leaf,
  "Diet": Leaf,
  "Rörelse": Sun,
  "Movement": Sun,
  "Exercise": Sun,
};

function getImpactLabel(impact: string, locale: "sv" | "en") {
  const normalized = impact.toLowerCase();
  if (normalized === "hög" || normalized === "high") {
    return locale === "en" ? "High priority" : "Hög prioritet";
  }
  if (normalized === "medel" || normalized === "medium") {
    return locale === "en" ? "Medium" : "Medel";
  }
  return locale === "en" ? "Lower priority" : "Bonus";
}

function getAreaLabel(area: string, locale: "sv" | "en") {
  const normalized = area.toLowerCase();
  if (normalized === "sömn" || normalized === "sleep") {
    return locale === "en" ? "Sleep" : "Sömn";
  }
  if (normalized === "kost" || normalized === "diet") {
    return locale === "en" ? "Diet" : "Kost";
  }
  if (normalized === "rörelse" || normalized === "movement" || normalized === "exercise") {
    return locale === "en" ? "Exercise" : "Rörelse";
  }
  if (normalized === "stress") {
    return "Stress";
  }
  return area;
}

function LifestyleTab({ lifestyle, avoid }: { lifestyle: LifestyleItem[]; avoid: string[] }) {
  const { locale } = useLocale();
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 sm:grid-cols-2">
        {lifestyle.map((item, i) => {
          const badge = IMPACT_STYLES[item.impact.toLowerCase()] ?? IMPACT_STYLES["medel"];
          const areaLabel = getAreaLabel(item.area, locale);
          const Icon = AREA_ICONS[item.area] ?? AREA_ICONS[areaLabel];
          return (
            <div key={i} className="rounded-2xl border border-[#e6e6e6] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4 text-[#108474]" />}
                  <span className="text-sm font-bold text-[#1d1d1f]">{areaLabel}</span>
                </div>
                <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", badge.cls)}>
                  {getImpactLabel(item.impact, locale)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#515151]">{item.tip}</p>
              {item.why && (
                <p className="mt-2 text-xs leading-relaxed text-[#766a62]">{item.why}</p>
              )}
              {item.source && (
                <p className="mt-1.5 text-[11px] italic text-[#766a62]/60">{item.source}</p>
              )}
            </div>
          );
        })}
      </div>

      {avoid.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-bold tracking-tight text-[#1d1d1f]">
            {locale === "en" ? "Avoid" : "Undvik"}
          </h4>
          <div className="flex flex-wrap gap-2">
            {avoid.map((item, i) => (
              <span key={i} className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-medium text-red-700">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 4 – Din rutin                                                  */
/* ------------------------------------------------------------------ */

function RoutineTab({ routine, routineLegacy }: {
  routine?: Routine;
  routineLegacy?: { morning: string[]; evening: string[] };
}) {
  const { locale } = useLocale();
  const morning = routine?.morning ?? routineLegacy?.morning.map(s => ({ step: s, why: "" })) ?? [];
  const evening = routine?.evening ?? routineLegacy?.evening.map(s => ({ step: s, why: "" })) ?? [];

  if (morning.length === 0 && evening.length === 0) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {morning.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Sun className="h-5 w-5 text-[#fcb237]" />
            <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f]">
              {locale === "en" ? "Morning routine" : "Morgonrutin"}
            </h3>
          </div>
          <div className="space-y-3">
            {morning.map((s, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-[#e6e6e6] bg-white p-4 transition-shadow hover:shadow-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#108474]/10 text-sm font-bold text-[#108474]">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1d1d1f]">{s.step}</p>
                  {s.why && (
                    <p className="mt-1 text-xs leading-relaxed text-[#766a62]">{s.why}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {evening.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Moon className="h-5 w-5 text-[#766a62]" />
            <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f]">
              {locale === "en" ? "Evening routine" : "Kvällsrutin"}
            </h3>
          </div>
          <div className="space-y-3">
            {evening.map((s, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-[#e6e6e6] bg-white p-4 transition-shadow hover:shadow-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#766a62]/10 text-sm font-bold text-[#766a62]">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1d1d1f]">{s.step}</p>
                  {s.why && (
                    <p className="mt-1 text-xs leading-relaxed text-[#766a62]">{s.why}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Tabs Component                                                */
/* ------------------------------------------------------------------ */

export function AnalysisTabs({
  score,
  scoreLabel,
  summary,
  skinAnalysis,
  products,
  lifestyle,
  routine,
  routineLegacy,
  avoid,
  nextAnalysis,
  hasScan,
  scanImageSrc,
  scanZoneResults,
}: AnalysisTabsProps) {
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState<TabId>("skin");
  const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
    { id: "skin", label: locale === "en" ? "Your skin" : "Din hy", icon: Sparkles },
    { id: "products", label: locale === "en" ? "Products" : "Produkter", icon: Package },
    { id: "lifestyle", label: locale === "en" ? "Lifestyle" : "Livsstil", icon: Leaf },
    { id: "routine", label: locale === "en" ? "Routine" : "Din rutin", icon: Moon },
  ];

  return (
    <div className="space-y-8">
      {/* Tab bar */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl border border-[#e6e6e6] bg-[#f5f5f7] p-1">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300",
                  active
                    ? "bg-white text-[#108474] shadow-sm"
                    : "text-[#766a62] hover:text-[#1d1d1f]"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="min-h-[300px]">
        {activeTab === "skin" && (
          <SkinTab
            score={score}
            scoreLabel={scoreLabel}
            summary={summary}
            skinAnalysis={skinAnalysis}
            hasScan={hasScan}
            scanImageSrc={scanImageSrc}
            scanZoneResults={scanZoneResults}
          />
        )}
        {activeTab === "products" && <ProductsTab products={products} />}
        {activeTab === "lifestyle" && <LifestyleTab lifestyle={lifestyle} avoid={avoid} />}
        {activeTab === "routine" && (
          <RoutineTab routine={routine} routineLegacy={routineLegacy} />
        )}
      </div>

      {/* Next analysis hint */}
      {nextAnalysis && (
        <p className="text-center text-sm text-[#766a62]">
          {locale === "en" ? "Recommended follow-up:" : "Rekommenderad uppföljning:"}{" "}
          {nextAnalysis}
        </p>
      )}
    </div>
  );
}
