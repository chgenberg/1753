"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Droplets,
  Gift,
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
import { useCart } from "@/providers/cart-provider";
import {
  CONDITION_LABELS_SV,
  CONDITION_LABELS_EN,
  type ZoneResult,
} from "@/components/skin-scanner/zones";

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

export interface FaceZoneGPT {
  zone: string;
  label: string;
  x: number;
  y: number;
  condition: string;
  confidence: "low" | "medium" | "high";
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
  scanZoneResults?: ZoneResult[];
  faceZonesGPT?: FaceZoneGPT[];
}

/* ------------------------------------------------------------------ */
/*  Tab definitions                                                    */
/* ------------------------------------------------------------------ */

type TabId = "skin" | "products" | "lifestyle" | "routine";

/* ------------------------------------------------------------------ */
/*  Expandable box                                                     */
/* ------------------------------------------------------------------ */

function ExpandableBox({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white transition-shadow hover:shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="h-4 w-4 text-[#108474]" />}
          <span className="text-sm font-semibold text-[#1d1d1f]">{title}</span>
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
/*  Score ring                                                         */
/* ------------------------------------------------------------------ */

function ScoreRing({ score, label }: { score: number; label?: string }) {
  const { locale } = useLocale();
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = "#108474";

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
/*  Next-step CTA                                                      */
/* ------------------------------------------------------------------ */

function NextStepButton({ label, subtext, onClick }: {
  label: string;
  subtext?: string;
  onClick: () => void;
}) {
  return (
    <div className="mt-8 text-center">
      <button
        onClick={onClick}
        className="group inline-flex items-center gap-2.5 rounded-full border-2 border-[#1d1d1f] px-7 py-3.5 text-sm font-semibold text-[#1d1d1f] transition-all hover:bg-[#1d1d1f] hover:text-white active:scale-[0.97]"
      >
        {label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
      {subtext && (
        <p className="mt-2 text-xs text-[#766a62]">{subtext}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 1 – Din hy                                                     */
/* ------------------------------------------------------------------ */

function SkinTab({ score, scoreLabel, summary, skinAnalysis, hasScan, scanImageSrc, scanZoneResults, faceZonesGPT, onNextTab }: {
  score: number;
  scoreLabel?: string;
  summary: string;
  skinAnalysis?: SkinAnalysis;
  hasScan?: boolean;
  scanImageSrc?: string;
  scanZoneResults?: ZoneResult[];
  faceZonesGPT?: FaceZoneGPT[];
  onNextTab?: () => void;
}) {
  const { locale } = useLocale();
  const condLabels = locale === "en" ? CONDITION_LABELS_EN : CONDITION_LABELS_SV;

  const gptZones = (faceZonesGPT ?? []).filter(
    (z) => z.confidence !== "low" && z.condition !== "normal"
  );
  const hasGPTZones = gptZones.length > 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <ScoreRing score={score} label={scoreLabel} />

      <Paragraphs
        text={summary}
        className="mx-auto max-w-lg text-center text-sm leading-relaxed text-[#515151]"
      />

      {hasScan && scanImageSrc && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#108474]">
            <ScanFace className="h-3.5 w-3.5" />
            {locale === "en" ? "Your face scan" : "Din ansiktsskanning"}
          </div>

          {hasGPTZones ? (
            <div className="mx-auto max-w-md">
              <div className="relative overflow-hidden rounded-2xl border border-[#e6e6e6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={scanImageSrc}
                  alt={locale === "en" ? "Face scan" : "Ansiktsskanning"}
                  className="block h-auto w-full"
                />
                {gptZones.map((z) => {
                  const label = condLabels[z.condition] || z.label;
                  const isLeft = z.x < 50;
                  return (
                    <div
                      key={z.zone}
                      className="absolute flex items-center gap-1.5 pointer-events-none"
                      style={{
                        left: `${z.x}%`,
                        top: `${z.y}%`,
                        transform: isLeft ? "translate(-100%, -50%)" : "translate(0%, -50%)",
                      }}
                    >
                      {isLeft ? (
                        <>
                          <span className="rounded-lg bg-[#1d1d1f]/80 px-2 py-1 text-[10px] font-semibold leading-tight text-white backdrop-blur-sm md:text-xs">
                            {label}
                          </span>
                          <div className="h-2.5 w-2.5 rounded-full border-2 border-white bg-[#1d1d1f]" />
                        </>
                      ) : (
                        <>
                          <div className="h-2.5 w-2.5 rounded-full border-2 border-white bg-[#1d1d1f]" />
                          <span className="rounded-lg bg-[#1d1d1f]/80 px-2 py-1 text-[10px] font-semibold leading-tight text-white backdrop-blur-sm md:text-xs">
                            {label}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 space-y-1.5 md:hidden">
                {gptZones.map((z) => {
                  const label = condLabels[z.condition] || z.label;
                  return (
                    <div key={z.zone} className="flex items-center gap-2 rounded-lg bg-[#f5f5f7] px-3 py-1.5">
                      <div className="h-2 w-2 shrink-0 rounded-full bg-[#1d1d1f]" />
                      <span className="text-[11px] font-semibold text-[#1d1d1f]">{label}</span>
                      <span className="text-[11px] text-[#766a62]">{z.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-[#e6e6e6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={scanImageSrc}
                alt={locale === "en" ? "Face scan" : "Ansiktsskanning"}
                className="block h-auto w-full"
              />
            </div>
          )}
        </div>
      )}

      {hasScan && !scanImageSrc && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-[#f5f5f7] px-4 py-2.5 text-xs font-medium text-[#108474]">
          <ScanFace className="h-3.5 w-3.5" />
          {locale === "en"
            ? "Includes data from your face scan"
            : "Inkluderar data från din ansiktsskanning"}
        </div>
      )}

      {skinAnalysis && (
        <div className="space-y-4">
          <ExpandableBox
            title={locale === "en" ? "Skin analysis" : "Hudanalys"}
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
              title={locale === "en" ? "What looks strong" : "Dina styrkor"}
              icon={Check}
              defaultOpen
            >
              <div className="flex flex-wrap gap-2">
                {skinAnalysis.strengths.map((s, i) => (
                  <span key={i} className="rounded-full bg-[#f5f5f7] px-4 py-2 text-xs font-medium text-[#1d1d1f]">
                    {s}
                  </span>
                ))}
              </div>
            </ExpandableBox>
          )}

          {skinAnalysis.concerns.length > 0 && (
            <ExpandableBox
              title={locale === "en" ? "What to pay attention to" : "Att uppmärksamma"}
              icon={ShieldCheck}
              defaultOpen
            >
              <div className="flex flex-wrap gap-2">
                {skinAnalysis.concerns.map((c, i) => (
                  <span key={i} className="rounded-full border border-[#e6e6e6] bg-white px-4 py-2 text-xs font-medium text-[#515151]">
                    {c}
                  </span>
                ))}
              </div>
            </ExpandableBox>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <ExpandableBox
              title={locale === "en" ? "Microbiome" : "Mikrobiom"}
              icon={ShieldCheck}
            >
              <p className="text-sm leading-relaxed text-[#515151]">{skinAnalysis.microbiome}</p>
            </ExpandableBox>
            <ExpandableBox
              title={locale === "en" ? "Endocannabinoid system" : "Endocannabinoidsystemet"}
              icon={Droplets}
            >
              <p className="text-sm leading-relaxed text-[#515151]">{skinAnalysis.ecs}</p>
            </ExpandableBox>
          </div>
        </div>
      )}

      {onNextTab && (
        <NextStepButton
          label={locale === "en" ? "See your products" : "Se dina produkter"}
          subtext={locale === "en" ? "Products matched to your skin" : "Produkter anpassade efter din hud"}
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

  const totalBefore = matched.reduce((s, p) => s + (p.price ?? 0), 0);
  const discount = Math.round(totalBefore * 0.15);
  const totalAfter = totalBefore - discount;

  const handleAddAll = () => {
    addItems(matched.map((p) => ({ id: p.id, qty: 1 })));
    localStorage.setItem("1753_auto_discount", "HUDANALYS15");
    setAdded(true);
    openCart();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Clean discount banner */}
      <div className="rounded-2xl border border-[#e6e6e6] bg-white p-6 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-[#766a62]">
          {locale === "en" ? "Thank you for your analysis" : "Tack för din analys"}
        </p>
        <h3 className="mt-2 text-xl font-bold tracking-tight text-[#1d1d1f]">
          {locale === "en"
            ? "15% off your recommended products"
            : "15% rabatt på dina rekommenderade produkter"}
        </h3>
        <div className="mt-4 inline-flex items-center gap-3 rounded-full bg-[#f5f5f7] px-5 py-2">
          <span className="text-sm text-[#766a62] line-through">{totalBefore} kr</span>
          <span className="text-lg font-bold text-[#1d1d1f]">{totalAfter} kr</span>
          <span className="rounded-full bg-[#108474]/10 px-2.5 py-0.5 text-xs font-bold text-[#108474]">
            -{discount} kr
          </span>
        </div>

        <div className="mt-5">
          <button
            onClick={handleAddAll}
            disabled={added}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-semibold transition-all active:scale-[0.97]",
              added
                ? "bg-[#f5f5f7] text-[#108474]"
                : "bg-[#1d1d1f] text-white hover:bg-[#108474]"
            )}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                {locale === "en" ? "Added with 15% off!" : "Tillagda med 15% rabatt!"}
              </>
            ) : (
              <>
                <Gift className="h-4 w-4" />
                {locale === "en"
                  ? `Add all to cart — ${totalAfter} kr`
                  : `Lägg i varukorgen — ${totalAfter} kr`}
              </>
            )}
          </button>
        </div>
        {!added && (
          <p className="mt-2 text-[11px] text-[#766a62]">
            {locale === "en"
              ? "Discount code HUDANALYS15 applied automatically"
              : "Rabattkoden HUDANALYS15 läggs in automatiskt"}
          </p>
        )}
      </div>

      <p className="text-center text-xs font-medium uppercase tracking-widest text-[#766a62]">
        {locale === "en"
          ? "Products chosen for your skin"
          : "Produkter anpassade efter din hud"}
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {matched.map((p) => (
          <div key={p.id} className="space-y-3">
            <ProductCard product={p} />
            <ExpandableBox
              title={locale === "en" ? "Why this fits your skin" : "Varför just för dig"}
              defaultOpen
            >
              <p className="text-xs leading-relaxed text-[#515151]">{p.reason}</p>
              {p.usage && (
                <p className="mt-2 border-t border-[#e6e6e6] pt-2 text-xs leading-relaxed text-[#766a62]">
                  {p.usage}
                </p>
              )}
            </ExpandableBox>
          </div>
        ))}
      </div>

      {onNextTab && (
        <NextStepButton
          label={locale === "en" ? "Your lifestyle tips" : "Dina livsstilsråd"}
          subtext={locale === "en" ? "Personalised habits for better skin" : "Personliga vanor för bättre hud"}
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
  "Sömn": Moon,
  "Sleep": Moon,
  "Stress": Sparkles,
  "Kost": Leaf,
  "Diet": Leaf,
  "Rörelse": Sun,
  "Movement": Sun,
  "Exercise": Sun,
};

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

function LifestyleTab({ lifestyle, avoid, onNextTab }: { lifestyle: LifestyleItem[]; avoid: string[]; onNextTab?: () => void }) {
  const { locale } = useLocale();
  return (
    <div className="space-y-4 animate-fade-in">
      {lifestyle.map((item, i) => {
        const areaLabel = getAreaLabel(item.area, locale);
        const Icon = AREA_ICONS[item.area] ?? AREA_ICONS[areaLabel];
        return (
          <ExpandableBox
            key={i}
            title={areaLabel}
            icon={Icon}
            defaultOpen={i < 2}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#f5f5f7] px-3 py-1 text-[11px] font-medium text-[#515151]">
                  {getImpactLabel(item.impact, locale)}
                </span>
              </div>
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
          title={locale === "en" ? "Avoid" : "Undvik"}
          defaultOpen
        >
          <div className="flex flex-wrap gap-2">
            {avoid.map((item, i) => (
              <span key={i} className="rounded-full border border-[#e6e6e6] bg-[#f5f5f7] px-4 py-1.5 text-xs font-medium text-[#1d1d1f]">
                {item}
              </span>
            ))}
          </div>
        </ExpandableBox>
      )}

      {onNextTab && (
        <NextStepButton
          label={locale === "en" ? "See your routine" : "Se din rutin"}
          subtext={locale === "en" ? "Morning & evening steps" : "Morgon- och kvällsrutin"}
          onClick={onNextTab}
        />
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
    <div className="space-y-6 animate-fade-in">
      {morning.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Sun className="h-5 w-5 text-[#108474]" />
            <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f]">
              {locale === "en" ? "Morning routine" : "Morgonrutin"}
            </h3>
          </div>
          <div className="space-y-3">
            {morning.map((s, i) => (
              <ExpandableBox
                key={i}
                title={`${i + 1}. ${s.step}`}
                defaultOpen={i === 0}
              >
                {s.why && (
                  <p className="text-xs leading-relaxed text-[#766a62]">{s.why}</p>
                )}
                {!s.why && (
                  <p className="text-xs text-[#766a62]">
                    {locale === "en" ? "Part of your morning routine" : "Del av din morgonrutin"}
                  </p>
                )}
              </ExpandableBox>
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
              <ExpandableBox
                key={i}
                title={`${i + 1}. ${s.step}`}
                defaultOpen={i === 0}
              >
                {s.why && (
                  <p className="text-xs leading-relaxed text-[#766a62]">{s.why}</p>
                )}
                {!s.why && (
                  <p className="text-xs text-[#766a62]">
                    {locale === "en" ? "Part of your evening routine" : "Del av din kvällsrutin"}
                  </p>
                )}
              </ExpandableBox>
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
  faceZonesGPT,
}: AnalysisTabsProps) {
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState<TabId>("skin");
  const tabOrder: TabId[] = ["skin", "products", "lifestyle", "routine"];
  const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
    { id: "skin", label: locale === "en" ? "Your skin" : "Din hy", icon: Sparkles },
    { id: "products", label: locale === "en" ? "Products" : "Produkter", icon: Package },
    { id: "lifestyle", label: locale === "en" ? "Lifestyle" : "Livsstil", icon: Leaf },
    { id: "routine", label: locale === "en" ? "Routine" : "Din rutin", icon: Moon },
  ];

  const goToNextTab = () => {
    const idx = tabOrder.indexOf(activeTab);
    if (idx < tabOrder.length - 1) {
      setActiveTab(tabOrder[idx + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isLastTab = activeTab === tabOrder[tabOrder.length - 1];
  const currentIdx = tabOrder.indexOf(activeTab);

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
                  "inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-[11px] font-semibold transition-all duration-300 sm:px-4 sm:text-xs",
                  active
                    ? "bg-white text-[#1d1d1f] shadow-sm"
                    : "text-[#766a62] hover:text-[#1d1d1f]"
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-1.5">
        {tabOrder.map((id, i) => (
          <div
            key={id}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              id === activeTab ? "w-8 bg-[#1d1d1f]" : i < currentIdx ? "w-4 bg-[#108474]" : "w-1.5 bg-[#e6e6e6]"
            )}
          />
        ))}
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
            faceZonesGPT={faceZonesGPT}
            onNextTab={goToNextTab}
          />
        )}
        {activeTab === "products" && (
          <ProductsTab products={products} onNextTab={goToNextTab} />
        )}
        {activeTab === "lifestyle" && (
          <LifestyleTab lifestyle={lifestyle} avoid={avoid} onNextTab={goToNextTab} />
        )}
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
