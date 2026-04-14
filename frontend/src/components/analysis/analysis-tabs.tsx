"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  Droplets,
  Eye,
  Gift,
  HelpCircle,
  Leaf,
  Loader2,
  Moon,
  Package,
  ScanFace,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sun,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { MethodologyModal } from "./methodology-modal";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/types";
import { PRODUCTS, type Product, productDisplayName, productPrice } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { useLocale } from "@/providers/locale-provider";
import { useCart } from "@/providers/cart-provider";
import { formatPrice } from "@/lib/currency";
import {
  conditionLabel as getCondLabel,
  type ZoneResult,
} from "@/components/skin-scanner/zones";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ConcernItem {
  issue: string;
  severity?: "mild" | "moderate" | "severe";
}

interface SkinAnalysis {
  overview: string;
  strengths: string[];
  concerns: (string | ConcernItem)[];
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

export interface FaceZoneGPT {
  zone: string;
  label: string;
  x: number;
  y: number;
  condition: string;
  confidence: "low" | "medium" | "high";
  description?: string;
}

export interface MetricScore {
  score: number;
  grade: number;
  detail: string;
}

export interface SkinMetrics {
  wrinkles?: MetricScore;
  pores?: MetricScore;
  pigmentation?: MetricScore;
  redness?: MetricScore;
  texture?: MetricScore;
  dark_circles?: MetricScore;
  firmness?: MetricScore;
  hydration?: MetricScore;
  skin_tone?: MetricScore;
  acne?: MetricScore;
  sensitivity?: MetricScore;
  sun_damage?: MetricScore;
  elasticity?: MetricScore;
  radiance?: MetricScore;
  barrier_health?: MetricScore;
}

export interface AnalysisTabsProps {
  score: number;
  scoreLabel?: string;
  summary: string;
  skinAge?: number;
  fitzpatrick?: string;
  metrics?: SkinMetrics;
  skinAnalysis?: SkinAnalysis;
  products: ProductRec[];
  lifestyle: LifestyleItem[];
  routine?: Routine;
  routineLegacy?: { morning: string[]; evening: string[] };
  avoid: string[];
  nextAnalysis: string;
  hasScan?: boolean;
  scanImageSrc?: string;
  scanZoneResults?: ZoneResult[];
  faceZonesGPT?: FaceZoneGPT[];
}

/* ------------------------------------------------------------------ */
/*  Tab definitions                                                    */
/* ------------------------------------------------------------------ */

type TabId = "skin" | "products" | "lifestyle" | "routine";

/* ------------------------------------------------------------------ */
/*  Animated number counter                                            */
/* ------------------------------------------------------------------ */

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [value, duration]);

  return <>{display}</>;
}

/* ------------------------------------------------------------------ */
/*  Expandable box (accordion)                                         */
/* ------------------------------------------------------------------ */

function ExpandableBox({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  badge,
}: {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn(
      "overflow-hidden rounded-2xl border bg-white transition-all duration-300",
      open
        ? "border-[#108474]/20 shadow-lg shadow-[#108474]/[0.04]"
        : "border-[#e6e6e6]/80 hover:border-[#e6e6e6] hover:shadow-md hover:shadow-black/[0.03]"
    )}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-300",
              open ? "bg-[#108474]/10" : "bg-[#f5f5f7]"
            )}>
              <Icon className={cn(
                "h-4.5 w-4.5 transition-colors duration-300",
                open ? "text-[#108474]" : "text-[#766a62]"
              )} />
            </div>
          )}
          <span className="text-sm font-semibold text-[#1d1d1f]">{title}</span>
          {badge && (
            <span className="rounded-full bg-[#108474]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#108474]">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[#766a62] transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Locale helper                                                      */
/* ------------------------------------------------------------------ */

function tx(locale: string, sv: string, en: string, es?: string, de?: string, fr?: string): string {
  if (locale === "sv") return sv;
  if (locale === "es") return es || en;
  if (locale === "de") return de || en;
  if (locale === "fr") return fr || en;
  return en;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function Paragraphs({ text, className }: { text: string; className?: string }) {
  const paragraphs = text
    .split(/\n\n+/)
    .flatMap((p) => p.split(/\n/))
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length <= 1) {
    const sentences = text.split(/(?<=\.)\s+/);
    if (sentences.length > 4) {
      const chunks: string[] = [];
      const perChunk = Math.ceil(sentences.length / Math.ceil(sentences.length / 4));
      for (let i = 0; i < sentences.length; i += perChunk) {
        chunks.push(sentences.slice(i, i + perChunk).join(" "));
      }
      return (
        <div className={cn("space-y-3", className)}>
          {chunks.map((chunk, i) => (
            <p key={i}>{chunk}</p>
          ))}
        </div>
      );
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero score ring (large, animated)                                  */
/* ------------------------------------------------------------------ */

function ScoreRing({ score, label, skinAge, fitzpatrick, locale }: {
  score: number;
  label?: string;
  skinAge?: number;
  fitzpatrick?: string;
  locale: string;
}) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const scoreColor = score >= 80 ? "#108474" : score >= 60 ? "#fcb237" : "#e55050";

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
      <div className="relative mx-auto h-44 w-44 shrink-0 sm:mx-0">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle cx="80" cy="80" r={r} fill="none" stroke="#f5f5f7" strokeWidth="10" />
          <circle
            cx="80" cy="80" r={r} fill="none" stroke={scoreColor} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold tracking-tight text-[#1d1d1f]">
            <AnimatedNumber value={score} />
          </span>
          <span className="text-[11px] font-medium text-[#766a62]">
            {tx(locale, "av 100", "of 100", "de 100", "von 100", "sur 100")}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 sm:items-start">
        {label && (
          <p className="text-sm font-medium text-[#515151]">{label}</p>
        )}
        <div className="flex items-center gap-4">
          {skinAge && (
            <div className="flex flex-col items-center rounded-2xl bg-[#f5f5f7] px-5 py-3 sm:items-start">
              <span className="text-[10px] font-medium uppercase tracking-widest text-[#766a62]">
                {tx(locale, "Hudålder", "Skin age", "Edad de la piel", "Hautalter", "Âge de la peau")}
              </span>
              <span className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
                <AnimatedNumber value={skinAge} />
              </span>
            </div>
          )}
          {fitzpatrick && (
            <div className="flex flex-col items-center rounded-2xl bg-[#f5f5f7] px-5 py-3 sm:items-start">
              <span className="text-[10px] font-medium uppercase tracking-widest text-[#766a62]">
                Fitzpatrick
              </span>
              <span className="text-2xl font-bold tracking-tight text-[#1d1d1f]">{fitzpatrick}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Next-step CTA                                                      */
/* ------------------------------------------------------------------ */

function NextStepButton({ label, subtext, onClick }: {
  label: string;
  subtext?: string;
  onClick: () => void;
}) {
  return (
    <div className="mt-10 text-center">
      <button
        onClick={onClick}
        className="group inline-flex items-center gap-2.5 rounded-full bg-[#1d1d1f] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-all duration-300 hover:bg-[#108474] hover:shadow-xl hover:shadow-[#108474]/20 active:scale-[0.97]"
      >
        {label}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
      {subtext && (
        <p className="mt-2 text-xs text-[#766a62]">{subtext}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline product CTA (mini card for cross-sell)                      */
/* ------------------------------------------------------------------ */

function InlineProductCTA({ products, locale }: { products: ProductRec[]; locale: Locale }) {
  const { addItems, openCart } = useCart();

  const matched = products
    .slice(0, 2)
    .map((rec) => {
      const p = PRODUCTS.find((prod) => prod.id === rec.id);
      return p ? { ...p, reason: rec.reason } : null;
    })
    .filter(Boolean) as (Product & { reason: string })[];

  if (matched.length === 0) return null;

  const handleAddAll = () => {
    addItems(matched.map((p) => ({ id: p.id, qty: 1 })));
    localStorage.setItem("1753_auto_discount", "HUDANALYS15");
    openCart();
  };

  return (
    <div className="rounded-2xl border border-[#108474]/15 bg-gradient-to-br from-[#108474]/[0.03] to-transparent p-5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#108474]">
        <ShoppingBag className="h-3.5 w-3.5" />
        {tx(locale, "Rekommenderat för dig", "Recommended for you", "Recomendado para ti", "Empfohlen für dich", "Recommandé pour vous")}
      </div>
      <div className="mt-3 space-y-2.5">
        {matched.map((p) => (
          <div key={p.id} className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f7]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={productDisplayName(p, locale)} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#1d1d1f]">{productDisplayName(p, locale)}</p>
              <p className="truncate text-[11px] text-[#766a62]">{p.reason}</p>
            </div>
            <span className="shrink-0 text-xs font-bold text-[#1d1d1f]">
              {formatPrice(productPrice(p, locale), locale)}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddAll}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#108474] px-5 py-3 text-xs font-semibold text-white shadow-md shadow-[#108474]/20 transition-all duration-300 hover:bg-[#0d6e62] hover:shadow-lg active:scale-[0.97]"
      >
        <Gift className="h-3.5 w-3.5" />
        {tx(locale, "Lagg till med 15% rabatt", "Add with 15% off", "Añadir con 15% descuento", "Mit 15% Rabatt hinzufügen", "Ajouter avec 15% de réduction")}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Metric helpers                                                     */
/* ------------------------------------------------------------------ */

const METRIC_LABELS: Record<string, { sv: string; en: string; es: string; de: string; fr: string; icon: LucideIcon }> = {
  wrinkles: { sv: "Rynkor", en: "Wrinkles", es: "Arrugas", de: "Falten", fr: "Rides", icon: Eye },
  pores: { sv: "Porer", en: "Pores", es: "Poros", de: "Poren", fr: "Pores", icon: ScanFace },
  pigmentation: { sv: "Pigmentering", en: "Pigmentation", es: "Pigmentación", de: "Pigmentierung", fr: "Pigmentation", icon: Sun },
  redness: { sv: "Rodnad", en: "Redness", es: "Enrojecimiento", de: "Rötung", fr: "Rougeur", icon: ShieldCheck },
  texture: { sv: "Textur", en: "Texture", es: "Textura", de: "Textur", fr: "Texture", icon: Sparkles },
  dark_circles: { sv: "Mörka ringar", en: "Dark circles", es: "Ojeras", de: "Augenringe", fr: "Cernes", icon: Eye },
  firmness: { sv: "Fasthet", en: "Firmness", es: "Firmeza", de: "Festigkeit", fr: "Fermeté", icon: TrendingUp },
  hydration: { sv: "Fukt", en: "Hydration", es: "Hidratación", de: "Hydratation", fr: "Hydratation", icon: Droplets },
  skin_tone: { sv: "Hudton", en: "Skin tone", es: "Tono de piel", de: "Hautton", fr: "Teint", icon: Sparkles },
  acne: { sv: "Akne", en: "Acne", es: "Acné", de: "Akne", fr: "Acné", icon: ShieldCheck },
  sensitivity: { sv: "Känslighet", en: "Sensitivity", es: "Sensibilidad", de: "Empfindlichkeit", fr: "Sensibilité", icon: ShieldCheck },
  sun_damage: { sv: "Solskador", en: "Sun damage", es: "Daño solar", de: "Sonnenschäden", fr: "Dommages solaires", icon: Sun },
  elasticity: { sv: "Elasticitet", en: "Elasticity", es: "Elasticidad", de: "Elastizität", fr: "Élasticité", icon: Zap },
  radiance: { sv: "Lyster", en: "Radiance", es: "Luminosidad", de: "Ausstrahlung", fr: "Éclat", icon: Sparkles },
  barrier_health: { sv: "Barriär", en: "Barrier", es: "Barrera", de: "Barriere", fr: "Barrière", icon: ShieldCheck },
};

const RADAR_KEYS = [
  "hydration", "texture", "radiance", "firmness", "elasticity",
  "pores", "pigmentation", "redness", "barrier_health",
] as const;

function metricScoreColor(score: number): string {
  if (score >= 80) return "#108474";
  if (score >= 60) return "#fcb237";
  return "#e55050";
}

function gradeLabel(grade: number, locale: string): string {
  const labels: Record<number, { sv: string; en: string; es: string; de: string; fr: string }> = {
    1: { sv: "Utmarkt", en: "Excellent", es: "Excelente", de: "Ausgezeichnet", fr: "Excellent" },
    2: { sv: "Bra", en: "Good", es: "Bueno", de: "Gut", fr: "Bon" },
    3: { sv: "Medel", en: "Average", es: "Promedio", de: "Durchschnitt", fr: "Moyen" },
    4: { sv: "Under medel", en: "Below avg", es: "Bajo promedio", de: "Unterdurchschnitt", fr: "Sous la moyenne" },
    5: { sv: "Behover atgard", en: "Needs attention", es: "Necesita atención", de: "Braucht Aufmerksamkeit", fr: "Nécessite attention" },
  };
  const l = labels[grade];
  if (!l) return "";
  if (locale === "sv") return l.sv;
  if (locale === "es") return l.es;
  if (locale === "de") return l.de;
  if (locale === "fr") return l.fr;
  return l.en;
}

/* ------------------------------------------------------------------ */
/*  Metric card (uniform height, interactive)                          */
/* ------------------------------------------------------------------ */

function MetricCard({ metricKey, metric, locale }: { metricKey: string; metric: MetricScore; locale: string }) {
  const [open, setOpen] = useState(false);
  const info = METRIC_LABELS[metricKey];
  if (!info) return null;
  const label = (info as unknown as Record<string, string>)[locale] ?? info.en;
  const color = metricScoreColor(metric.score);
  const pct = Math.min(100, Math.max(0, metric.score));
  const Icon = info.icon;

  return (
    <button
      onClick={() => setOpen(!open)}
      className="group flex h-full w-full flex-col rounded-2xl border border-[#e6e6e6]/80 bg-white p-4 text-left transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.04] active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-300" style={{ backgroundColor: `${color}10` }}>
            <Icon className="h-4 w-4" style={{ color }} />
          </div>
          <span className="text-xs font-semibold text-[#1d1d1f]">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold tabular-nums leading-none" style={{ color }}>{metric.score}</span>
          <span className="block text-[10px] font-medium text-[#766a62]">{gradeLabel(metric.grade, locale)}</span>
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#f5f5f7]">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>

      <div
        className={cn(
          "mt-auto overflow-hidden transition-all duration-300",
          open ? "max-h-40 pt-3 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {metric.detail && (
          <p className="text-[11px] leading-relaxed text-[#515151]">{metric.detail}</p>
        )}
      </div>

      <div className="mt-2 flex items-center justify-center">
        <ChevronDown className={cn(
          "h-3 w-3 text-[#766a62]/50 transition-transform duration-300",
          open && "rotate-180"
        )} />
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Radar chart                                                        */
/* ------------------------------------------------------------------ */

function SkinRadarChart({ metrics, locale }: { metrics: SkinMetrics; locale: string }) {
  const data = RADAR_KEYS.map((key) => {
    const m = metrics[key];
    const info = METRIC_LABELS[key];
    return {
      metric: (info as unknown as Record<string, string> | undefined)?.[locale] ?? info?.en ?? key,
      score: m?.score ?? 50,
      fullMark: 100,
    };
  }).filter((d) => d.score > 0);

  if (data.length < 3) return null;

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-[#e6e6e6]/80 bg-white p-4">
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart cx="50%" cy="50%" outerRadius="68%" data={data}>
          <PolarGrid stroke="#e6e6e6" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "#766a62", fontSize: 10, fontWeight: 500 }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#108474"
            fill="#108474"
            fillOpacity={0.12}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Focus area pills                                                   */
/* ------------------------------------------------------------------ */

function FocusAreas({ entries, locale }: { entries: [string, MetricScore][]; locale: string }) {
  if (entries.length === 0) return null;
  return (
    <div className="space-y-4">
      <h4 className="text-center text-[11px] font-bold uppercase tracking-widest text-[#766a62]">
        {tx(locale, "Fokusområden", "Focus areas", "Áreas de enfoque", "Fokusgebiete", "Zones prioritaires")}
      </h4>
      <div className="grid gap-3 sm:grid-cols-3">
        {entries.map(([key, m]) => {
          const info = METRIC_LABELS[key];
          const label = (info as unknown as Record<string, string> | undefined)?.[locale] ?? info?.en ?? key;
          const color = metricScoreColor(m.score);
          const pct = Math.min(100, Math.max(0, m.score));
          const Icon = info?.icon;
          return (
            <div
              key={key}
              className="group flex flex-col gap-2 rounded-2xl border border-[#e6e6e6]/80 bg-white p-4 transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.04]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {Icon && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}10` }}>
                      <Icon className="h-4 w-4" style={{ color }} />
                    </div>
                  )}
                  <span className="text-xs font-semibold text-[#1d1d1f]">{label}</span>
                </div>
                <span className="text-xl font-bold tabular-nums" style={{ color }}>{m.score}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f5f5f7]">
                <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: color }} />
              </div>
              {m.detail && (
                <p className="text-[11px] leading-relaxed text-[#515151]">{m.detail}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 1 – Din hy                                                     */
/* ------------------------------------------------------------------ */

function SkinTab({ score, scoreLabel, summary, skinAge, fitzpatrick, metrics, skinAnalysis, hasScan, scanImageSrc, faceZonesGPT, products, onNextTab }: {
  score: number;
  scoreLabel?: string;
  summary: string;
  skinAge?: number;
  fitzpatrick?: string;
  metrics?: SkinMetrics;
  skinAnalysis?: SkinAnalysis;
  hasScan?: boolean;
  scanImageSrc?: string;
  faceZonesGPT?: FaceZoneGPT[];
  products: ProductRec[];
  onNextTab?: () => void;
}) {
  const { locale } = useLocale();
  const condLabels = (key: string) => getCondLabel(key, locale);
  const [showAllMetrics, setShowAllMetrics] = useState(false);

  const [activeZoneIdx, setActiveZoneIdx] = useState<number | null>(null);

  const gptZones = (faceZonesGPT ?? []).filter(
    (z) => z.confidence !== "low" && z.condition !== "normal"
  );
  const hasGPTZones = gptZones.length > 0;
  const hasMetrics = metrics && Object.keys(metrics).length > 0;

  const metricEntries = hasMetrics
    ? (Object.entries(metrics) as [string, MetricScore | undefined][]).filter(([, v]) => v && typeof v.score === "number") as [string, MetricScore][]
    : [];
  const topConcerns = [...metricEntries]
    .sort(([, a], [, b]) => a.score - b.score)
    .slice(0, 3);
  const displayedMetrics = showAllMetrics ? metricEntries : metricEntries.slice(0, 6);

  return (
    <div className="space-y-10">
      {/* Hero score */}
      <ScoreRing score={score} label={scoreLabel} skinAge={skinAge} fitzpatrick={fitzpatrick} locale={locale} />

      {/* Summary */}
      <Paragraphs
        text={summary}
        className="mx-auto max-w-lg text-center text-sm leading-relaxed text-[#515151]"
      />

      {/* Radar chart */}
      {hasMetrics && <SkinRadarChart metrics={metrics} locale={locale} />}

      {/* Focus areas */}
      <FocusAreas entries={topConcerns} locale={locale} />

      {/* All metric cards – uniform grid */}
      {metricEntries.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#766a62]">
            {tx(locale, "Alla metriker", "All metrics", "Todas las métricas", "Alle Metriken", "Toutes les métriques")}
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {displayedMetrics.map(([key, m]) => (
              <MetricCard key={key} metricKey={key} metric={m} locale={locale} />
            ))}
          </div>
          {metricEntries.length > 6 && !showAllMetrics && (
            <button
              onClick={() => setShowAllMetrics(true)}
              className="mx-auto flex items-center gap-1.5 rounded-full border border-[#e6e6e6] px-5 py-2.5 text-xs font-semibold text-[#108474] transition-all duration-300 hover:border-[#108474]/30 hover:bg-[#108474]/5"
            >
              {tx(locale, `Visa alla ${metricEntries.length}`, `Show all ${metricEntries.length}`, `Mostrar todos ${metricEntries.length}`, `Alle ${metricEntries.length} anzeigen`, `Afficher les ${metricEntries.length}`)}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Face scan image */}
      {hasScan && scanImageSrc && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#108474]">
            <ScanFace className="h-3.5 w-3.5" />
            {tx(locale, "Din ansiktsskanning", "Your face scan", "Tu escaneo facial", "Dein Gesichtsscan", "Votre scan facial")}
          </div>

          {hasGPTZones ? (
            <div className="mx-auto max-w-md">
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
              <div
                className="relative overflow-hidden rounded-2xl border border-[#e6e6e6]/80 shadow-sm"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setActiveZoneIdx(null);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={scanImageSrc}
                  alt={tx(locale, "Ansiktsskanning", "Face scan", "Escaneo facial", "Gesichtsscan", "Scan facial")}
                  className="block h-auto w-full"
                  onClick={() => setActiveZoneIdx(null)}
                />
                {gptZones.map((z, i) => {
                  const isActive = activeZoneIdx === i;
                  const confColor = z.confidence === "high" ? "#108474" : z.confidence === "medium" ? "#e8a020" : "#766a62";
                  return (
                    <button
                      key={z.zone}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveZoneIdx(isActive ? null : i);
                      }}
                      className="absolute z-10 group"
                      style={{ left: `${z.x}%`, top: `${z.y}%`, transform: "translate(-50%, -50%)" }}
                    >
                      <span className="relative flex h-4 w-4">
                        <span
                          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40"
                          style={{ backgroundColor: confColor }}
                        />
                        <span
                          className="relative inline-flex h-4 w-4 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: confColor }}
                        />
                      </span>

                      {isActive && (
                        <div className="absolute left-1/2 top-6 z-20 -translate-x-1/2 w-56 rounded-xl bg-white/95 backdrop-blur-sm border border-[#e6e6e6] p-3 shadow-xl animate-fade-in">
                          <p className="text-xs font-semibold text-[#1d1d1f] mb-1">{z.label}</p>
                          {z.description && (
                            <p className="text-[11px] leading-relaxed text-[#515151]">{z.description}</p>
                          )}
                          <div className="mt-2 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: confColor }} />
                            <span className="text-[10px] text-[#766a62]">
                              {condLabels(z.condition) || z.condition} — {z.confidence}
                            </span>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 space-y-1.5 md:hidden">
                {gptZones.map((z) => {
                  const label = condLabels(z.condition) || z.label;
                  const confColor = z.confidence === "high" ? "#108474" : z.confidence === "medium" ? "#e8a020" : "#766a62";
                  return (
                    <div key={z.zone} className="rounded-xl bg-[#f5f5f7] px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: confColor }} />
                        <span className="text-[11px] font-semibold text-[#1d1d1f]">{label}</span>
                        <span className="text-[11px] text-[#766a62]">{z.label}</span>
                      </div>
                      {z.description && (
                        <p className="mt-1 pl-4 text-[11px] leading-relaxed text-[#515151]">{z.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-[#e6e6e6]/80 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={scanImageSrc}
                alt={tx(locale, "Ansiktsskanning", "Face scan", "Escaneo facial", "Gesichtsscan", "Scan facial")}
                className="block h-auto w-full"
              />
            </div>
          )}
        </div>
      )}

      {hasScan && !scanImageSrc && (
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#f5f5f7] px-4 py-3 text-xs font-medium text-[#108474]">
          <ScanFace className="h-3.5 w-3.5" />
          {tx(locale, "Inkluderar data från din ansiktsskanning", "Includes data from your face scan", "Incluye datos de tu escaneo facial", "Enthält Daten aus deinem Gesichtsscan", "Inclut les données de votre scan facial")}
        </div>
      )}

      {/* Skin analysis details */}
      {skinAnalysis && (
        <div className="space-y-3">
          <ExpandableBox
            title={tx(locale, "Detaljerad analys", "Detailed analysis", "Análisis detallado", "Detaillierte Analyse", "Analyse détaillée")}
            icon={Sparkles}
            defaultOpen
          >
            <Paragraphs
              text={skinAnalysis.overview}
              className="text-sm leading-relaxed text-[#515151]"
            />
          </ExpandableBox>

          {skinAnalysis.strengths.length > 0 && (
            <ExpandableBox
              title={tx(locale, "Dina styrkor", "Your strengths", "Tus fortalezas", "Deine Stärken", "Vos points forts")}
              icon={Check}
              badge={`${skinAnalysis.strengths.length}`}
              defaultOpen
            >
              <div className="flex flex-wrap gap-2">
                {skinAnalysis.strengths.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-[#108474]/5 px-4 py-2 text-xs font-medium text-[#108474]">
                    <Check className="h-3 w-3" />
                    {s}
                  </span>
                ))}
              </div>
            </ExpandableBox>
          )}

          {skinAnalysis.concerns.length > 0 && (
            <ExpandableBox
              title={tx(locale, "Att forbattra", "Areas to improve", "Áreas a mejorar", "Verbesserungsbereiche", "Points à améliorer")}
              icon={ShieldCheck}
              badge={`${skinAnalysis.concerns.length}`}
              defaultOpen
            >
              <div className="flex flex-wrap gap-2">
                {skinAnalysis.concerns.map((c, i) => {
                  const label = typeof c === "string" ? c : c.issue;
                  const severity = typeof c === "string" ? undefined : c.severity;
                  const borderColor = severity === "severe" ? "#e55050" : severity === "moderate" ? "#fcb237" : "#e6e6e6";
                  return (
                    <span key={i} className="rounded-full bg-white px-4 py-2 text-xs font-medium text-[#515151]" style={{ border: `1.5px solid ${borderColor}` }}>
                      {label}{severity && severity !== "mild" ? ` (${
                      severity === "severe"
                        ? tx(locale, "allvarlig", "severe", "severo", "schwer", "sévère")
                        : tx(locale, "måttlig", "moderate", "moderado", "mäßig", "modéré")
                    })` : ""}
                    </span>
                  );
                })}
              </div>
            </ExpandableBox>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <ExpandableBox
              title={tx(locale, "Mikrobiom", "Microbiome", "Microbioma", "Mikrobiom", "Microbiome")}
              icon={ShieldCheck}
            >
              <p className="text-sm leading-relaxed text-[#515151]">{skinAnalysis.microbiome}</p>
            </ExpandableBox>
            <ExpandableBox
              title={tx(locale, "Endocannabinoidsystemet", "Endocannabinoid system", "Sistema endocannabinoide", "Endocannabinoid-System", "Système endocannabinoïde")}
              icon={Droplets}
            >
              <p className="text-sm leading-relaxed text-[#515151]">{skinAnalysis.ecs}</p>
            </ExpandableBox>
          </div>
        </div>
      )}

      {/* Cross-sell CTA at bottom of skin tab */}
      {products.length > 0 && (
        <InlineProductCTA products={products} locale={locale} />
      )}

      {onNextTab && (
        <NextStepButton
          label={tx(locale, "Se dina produkter", "See your products", "Ver tus productos", "Deine Produkte ansehen", "Voir vos produits")}
          subtext={tx(locale, "Produkter anpassade efter din hud", "Products matched to your skin", "Productos adaptados a tu piel", "Produkte für deine Haut", "Produits adaptés à votre peau")}
          onClick={onNextTab}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 2 – Produkter                                                  */
/* ------------------------------------------------------------------ */

function ProductsTab({ products, onNextTab }: { products: ProductRec[]; onNextTab?: () => void }) {
  const { locale } = useLocale();
  const { addItems, openCart } = useCart();
  const [added, setAdded] = useState(false);

  const matched: (Product & { reason: string; usage?: string })[] = products
    .map((rec) => {
      const p = PRODUCTS.find((prod) => prod.id === rec.id);
      return p ? { ...p, reason: rec.reason, usage: rec.usage } : null;
    })
    .filter(Boolean) as (Product & { reason: string; usage?: string })[];

  if (matched.length === 0) return null;

  const totalBefore = matched.reduce((s, p) => s + (productPrice(p, locale) ?? 0), 0);
  const discount = Math.round(totalBefore * 0.15);
  const totalAfter = totalBefore - discount;

  const handleAddAll = () => {
    addItems(matched.map((p) => ({ id: p.id, qty: 1 })));
    localStorage.setItem("1753_auto_discount", "HUDANALYS15");
    setAdded(true);
    openCart();
  };

  return (
    <div className="space-y-8">
      {/* Discount hero card */}
      <div className="overflow-hidden rounded-3xl bg-[#1d1d1f] p-6 text-center text-white sm:p-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-white/60">
          {tx(locale, "Tack för din analys", "Thank you for your analysis", "Gracias por tu análisis", "Danke für deine Analyse", "Merci pour votre analyse")}
        </p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {tx(locale, "15% rabatt", "15% off", "15% descuento", "15% Rabatt", "15% de réduction")}
        </h3>
        <p className="mt-1 text-sm text-white/70">
          {tx(locale, "På dina rekommenderade produkter", "On your recommended products", "En tus productos recomendados", "Auf deine empfohlenen Produkte", "Sur vos produits recommandés")}
        </p>

        <div className="mx-auto mt-5 inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2.5 backdrop-blur-sm">
          <span className="text-sm text-white/50 line-through">{formatPrice(totalBefore, locale)}</span>
          <span className="text-xl font-bold text-white">{formatPrice(totalAfter, locale)}</span>
          <span className="rounded-full bg-[#108474] px-3 py-1 text-[11px] font-bold text-white">
            -{formatPrice(discount, locale)}
          </span>
        </div>

        <div className="mt-6">
          <button
            onClick={handleAddAll}
            disabled={added}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold transition-all duration-300 active:scale-[0.97]",
              added
                ? "bg-[#108474] text-white"
                : "bg-white text-[#1d1d1f] shadow-lg shadow-white/10 hover:bg-[#f5f5f7]"
            )}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                {tx(locale, "Tillagda!", "Added!", "Añadidos!", "Hinzugefügt!", "Ajoutés!")}
              </>
            ) : (
              <>
                <Gift className="h-4 w-4" />
                {tx(locale, `Lägg alla i varukorgen — ${formatPrice(totalAfter, locale)}`, `Add all — ${formatPrice(totalAfter, locale)}`, `Añadir todo — ${formatPrice(totalAfter, locale)}`, `Alle hinzufügen — ${formatPrice(totalAfter, locale)}`, `Tout ajouter — ${formatPrice(totalAfter, locale)}`)}
              </>
            )}
          </button>
        </div>
        {!added && (
          <p className="mt-3 text-[11px] text-white/40">
            HUDANALYS15
          </p>
        )}
      </div>

      {/* Products grid */}
      <div className="space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#766a62]">
          {tx(locale, "Utvalda för din hud", "Chosen for your skin", "Elegidos para tu piel", "Ausgewählt für deine Haut", "Choisis pour votre peau")}
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          {matched.map((p) => (
            <div key={p.id} className="space-y-3">
              <ProductCard product={p} />
              <div className="rounded-2xl border border-[#e6e6e6]/80 bg-white p-4">
                <div className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#108474]" />
                  <div>
                    <p className="text-xs font-semibold text-[#1d1d1f]">
                      {tx(locale, "Varför just denna", "Why this product", "Por qué este producto", "Warum dieses Produkt", "Pourquoi ce produit")}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-[#515151]">{p.reason}</p>
                    {p.usage && (
                      <p className="mt-2 border-t border-[#f5f5f7] pt-2 text-[11px] leading-relaxed text-[#766a62]">
                        {p.usage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {onNextTab && (
        <NextStepButton
          label={tx(locale, "Dina livsstilsråd", "Your lifestyle tips", "Tus consejos de estilo de vida", "Deine Lifestyle-Tipps", "Vos conseils de vie")}
          subtext={tx(locale, "Personliga vanor för bättre hud", "Personalised habits for better skin", "Hábitos personalizados para mejor piel", "Persönliche Gewohnheiten für bessere Haut", "Habitudes personnalisées pour une meilleure peau")}
          onClick={onNextTab}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 3 – Livsstil                                                   */
/* ------------------------------------------------------------------ */

const AREA_ICONS: Record<string, LucideIcon> = {
  "Sömn": Moon, "Somn": Moon, "Sleep": Moon,
  "Stress": Sparkles,
  "Kost": Leaf, "Diet": Leaf,
  "Rörelse": Moon, "Rorelse": Sun, "Movement": Sun, "Exercise": Sun,
  "Tarmhälsa": Leaf, "Gut health": Leaf,
  "Vatten": Droplets, "Water": Droplets,
};

function getAreaLabel(area: string, locale: string) {
  const n = area.toLowerCase();
  if (n === "somn" || n === "sömn" || n === "sleep") return tx(locale, "Sömn", "Sleep", "Sueño", "Schlaf", "Sommeil");
  if (n === "kost" || n === "diet") return tx(locale, "Kost", "Diet", "Dieta", "Ernährung", "Alimentation");
  if (n === "rorelse" || n === "rörelse" || n === "movement" || n === "exercise") return tx(locale, "Rörelse", "Exercise", "Ejercicio", "Bewegung", "Exercice");
  if (n === "tarmhälsa" || n === "gut health" || n === "gut") return tx(locale, "Tarmhälsa", "Gut health", "Salud intestinal", "Darmgesundheit", "Santé intestinale");
  if (n === "vatten" || n === "water") return tx(locale, "Vatten", "Water", "Agua", "Wasser", "Eau");
  if (n === "stress") return "Stress";
  return area;
}

function getImpactBadge(impact: string, locale: string) {
  const n = impact.toLowerCase();
  if (n === "hog" || n === "hög" || n === "high") return { label: tx(locale, "Hög prioritet", "High priority", "Prioridad alta", "Hohe Priorität", "Priorité haute"), color: "#108474" };
  if (n === "medel" || n === "medium") return { label: tx(locale, "Medel", "Medium", "Medio", "Mittel", "Moyen"), color: "#fcb237" };
  return { label: tx(locale, "Bonus", "Lower", "Menor", "Niedriger", "Moins important"), color: "#766a62" };
}

function LifestyleTab({ lifestyle, avoid, products, onNextTab }: { lifestyle: LifestyleItem[]; avoid: string[]; products: ProductRec[]; onNextTab?: () => void }) {
  const { locale } = useLocale();
  return (
    <div className="space-y-4">
      {lifestyle.map((item, i) => {
        const areaLabel = getAreaLabel(item.area, locale);
        const Icon = AREA_ICONS[item.area] ?? AREA_ICONS[areaLabel];
        const badge = getImpactBadge(item.impact, locale);
        return (
          <ExpandableBox
            key={i}
            title={areaLabel}
            icon={Icon}
            defaultOpen={i < 2}
            badge={badge.label}
          >
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-[#1d1d1f]">{item.tip}</p>
              {item.why && (
                <p className="text-xs leading-relaxed text-[#766a62]">{item.why}</p>
              )}
              {item.source && (
                <p className="text-[11px] italic text-[#766a62]/60">{item.source}</p>
              )}
            </div>
          </ExpandableBox>
        );
      })}

      {avoid.length > 0 && (
        <ExpandableBox
          title={tx(locale, "Undvik", "Avoid", "Evitar", "Vermeiden", "Éviter")}
          defaultOpen
        >
          <div className="flex flex-wrap gap-2">
            {avoid.map((item, i) => (
              <span key={i} className="rounded-full border border-[#e55050]/20 bg-[#e55050]/5 px-4 py-2 text-xs font-medium text-[#1d1d1f]">
                {item}
              </span>
            ))}
          </div>
        </ExpandableBox>
      )}

      {/* Cross-sell */}
      {products.length > 0 && (
        <InlineProductCTA products={products} locale={locale} />
      )}

      {onNextTab && (
        <NextStepButton
          label={tx(locale, "Se din rutin", "See your routine", "Ver tu rutina", "Deine Routine ansehen", "Voir votre routine")}
          subtext={tx(locale, "Morgon- och kvällsrutin", "Morning & evening steps", "Pasos de mañana y noche", "Morgen- und Abendroutine", "Routine matin et soir")}
          onClick={onNextTab}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 4 – Din rutin                                                  */
/* ------------------------------------------------------------------ */

function RoutineTab({ routine, routineLegacy, products }: {
  routine?: Routine;
  routineLegacy?: { morning: string[]; evening: string[] };
  products: ProductRec[];
}) {
  const { locale } = useLocale();
  const morning = routine?.morning ?? routineLegacy?.morning.map(s => ({ step: s, why: "" })) ?? [];
  const evening = routine?.evening ?? routineLegacy?.evening.map(s => ({ step: s, why: "" })) ?? [];

  if (morning.length === 0 && evening.length === 0) return null;

  return (
    <div className="space-y-8">
      {morning.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fcb237]/10">
              <Sun className="h-4 w-4 text-[#fcb237]" />
            </div>
            <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f]">
              {tx(locale, "Morgonrutin", "Morning routine", "Rutina matutina", "Morgenroutine", "Routine du matin")}
            </h3>
          </div>
          <div className="space-y-2.5">
            {morning.map((s, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-[#e6e6e6]/80 bg-white p-4 transition-all duration-300 hover:shadow-md hover:shadow-black/[0.03]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#108474]/10 text-xs font-bold text-[#108474]">
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
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#766a62]/10">
              <Moon className="h-4 w-4 text-[#766a62]" />
            </div>
            <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f]">
              {tx(locale, "Kvällsrutin", "Evening routine", "Rutina nocturna", "Abendroutine", "Routine du soir")}
            </h3>
          </div>
          <div className="space-y-2.5">
            {evening.map((s, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-[#e6e6e6]/80 bg-white p-4 transition-all duration-300 hover:shadow-md hover:shadow-black/[0.03]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#766a62]/10 text-xs font-bold text-[#766a62]">
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

      {/* Cross-sell at bottom of routine */}
      {products.length > 0 && (
        <InlineProductCTA products={products} locale={locale} />
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
  skinAge,
  fitzpatrick,
  metrics,
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
  faceZonesGPT,
}: AnalysisTabsProps) {
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState<TabId>("skin");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const tabOrder: TabId[] = ["skin", "products", "lifestyle", "routine"];

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      const { generateAnalysisPDF } = await import("./pdf-export");
      await generateAnalysisPDF({
        score, scoreLabel, summary, skinAge, fitzpatrick,
        metrics, skinAnalysis, products, lifestyle,
        routine, routineLegacy, avoid, nextAnalysis,
        hasScan, scanImageSrc, scanZoneResults, faceZonesGPT,
      }, locale);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setPdfLoading(false);
    }
  };

  const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
    { id: "skin", label: tx(locale, "Din hy", "Your skin", "Tu piel", "Deine Haut", "Votre peau"), icon: Sparkles },
    { id: "products", label: tx(locale, "Produkter", "Products", "Productos", "Produkte", "Produits"), icon: Package },
    { id: "lifestyle", label: tx(locale, "Livsstil", "Lifestyle", "Estilo de vida", "Lebensstil", "Mode de vie"), icon: Leaf },
    { id: "routine", label: tx(locale, "Rutin", "Routine", "Rutina", "Routine", "Routine"), icon: Moon },
  ];

  const goToNextTab = () => {
    const idx = tabOrder.indexOf(activeTab);
    if (idx < tabOrder.length - 1) {
      setActiveTab(tabOrder[idx + 1]);
      tabBarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const currentIdx = tabOrder.indexOf(activeTab);

  return (
    <div className="space-y-6">
      {/* Sticky tab bar */}
      <div ref={tabBarRef} className="sticky top-16 z-30 -mx-6 bg-white/80 px-6 pb-4 pt-2 backdrop-blur-xl md:-mx-10 md:px-10">
        <div className="flex items-center justify-center gap-2">
          <div className="inline-flex w-full max-w-md rounded-2xl border border-[#e6e6e6]/80 bg-[#f5f5f7]/80 p-1 backdrop-blur-sm">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[11px] font-semibold transition-all duration-300 sm:text-xs",
                    active
                      ? "bg-white text-[#1d1d1f] shadow-sm"
                      : "text-[#766a62] hover:text-[#1d1d1f]"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden min-[380px]:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setMethodOpen(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e6e6e6]/80 bg-[#f5f5f7]/80 text-[#766a62] backdrop-blur-sm transition-all duration-300 hover:border-[#108474]/30 hover:bg-[#108474]/10 hover:text-[#108474]"
            aria-label={tx(locale, "Så fungerar analysen", "How the analysis works", "Cómo funciona el análisis", "So funktioniert die Analyse", "Comment fonctionne l'analyse")}
            title={tx(locale, "Så fungerar analysen", "How the analysis works", "Cómo funciona el análisis", "So funktioniert die Analyse", "Comment fonctionne l'analyse")}
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {tabOrder.map((id, i) => (
            <div
              key={id}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                id === activeTab
                  ? "w-8 bg-[#108474]"
                  : i < currentIdx
                    ? "w-4 bg-[#108474]/40"
                    : "w-1.5 bg-[#e6e6e6]"
              )}
            />
          ))}
        </div>
      </div>

      {/* Download PDF button */}
      <div className="flex justify-center">
        <button
          onClick={handleDownloadPDF}
          disabled={pdfLoading}
          className="inline-flex items-center gap-2 rounded-full border border-[#e6e6e6] bg-white px-5 py-2.5 text-xs font-semibold text-[#1d1d1f] shadow-sm transition-all duration-300 hover:border-[#108474]/30 hover:bg-[#108474]/5 hover:text-[#108474] hover:shadow-md active:scale-[0.97] disabled:opacity-50"
        >
          {pdfLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          {tx(locale,
            pdfLoading ? "Skapar PDF..." : "Ladda ner som PDF",
            pdfLoading ? "Creating PDF..." : "Download as PDF",
            pdfLoading ? "Creando PDF..." : "Descargar como PDF",
            pdfLoading ? "PDF wird erstellt..." : "Als PDF herunterladen",
            pdfLoading ? "Création du PDF..." : "Télécharger en PDF"
          )}
        </button>
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === "skin" && (
          <div className="animate-fade-in">
            <SkinTab
              score={score}
              scoreLabel={scoreLabel}
              summary={summary}
              skinAge={skinAge}
              fitzpatrick={fitzpatrick}
              metrics={metrics}
              skinAnalysis={skinAnalysis}
              hasScan={hasScan}
              scanImageSrc={scanImageSrc}
              faceZonesGPT={faceZonesGPT}
              products={products}
              onNextTab={goToNextTab}
            />
          </div>
        )}
        {activeTab === "products" && (
          <div className="animate-fade-in">
            <ProductsTab products={products} onNextTab={goToNextTab} />
          </div>
        )}
        {activeTab === "lifestyle" && (
          <div className="animate-fade-in">
            <LifestyleTab lifestyle={lifestyle} avoid={avoid} products={products} onNextTab={goToNextTab} />
          </div>
        )}
        {activeTab === "routine" && (
          <div className="animate-fade-in">
            <RoutineTab routine={routine} routineLegacy={routineLegacy} products={products} />
          </div>
        )}
      </div>

      {/* Next analysis hint */}
      {nextAnalysis && (
        <div className="rounded-2xl border border-[#e6e6e6]/80 bg-[#f5f5f7] p-5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#766a62]">
            {tx(locale, "Rekommenderad uppföljning", "Recommended follow-up", "Seguimiento recomendado", "Empfohlene Nachuntersuchung", "Suivi recommandé")}
          </p>
          <p className="mt-1 text-sm text-[#515151]">{nextAnalysis}</p>
        </div>
      )}

      <MethodologyModal open={methodOpen} onClose={() => setMethodOpen(false)} />
    </div>
  );
}
