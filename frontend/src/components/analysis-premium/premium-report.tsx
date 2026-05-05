"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  Apple,
  BookOpen,
  Calendar,
  Camera,
  Check,
  Cloud,
  Compass,
  Coffee,
  Download,
  FileText,
  FlaskConical,
  Heart,
  Leaf,
  Moon,
  Pill,
  Quote,
  Sparkles,
  Stethoscope,
  Sun,
  Sunrise,
  Sunset,
  TrendingUp,
  Utensils,
  Waves,
  Wind,
} from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { useLocale } from "@/providers/locale-provider";
import { exportPremiumPdf } from "./premium-pdf-export";
import type {
  PremiumAnalysisResult,
  LifestyleScores,
} from "./premium-types";
import { getPremiumProductView } from "./product-display";
import { cn } from "@/lib/utils";

type LifestyleKey = "sleep" | "stress" | "nutrition" | "gut" | "movement";

const LIFESTYLE_KEYS: LifestyleKey[] = [
  "sleep",
  "stress",
  "nutrition",
  "gut",
  "movement",
];

const METRIC_LABELS_SV: Record<string, string> = {
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

const LIFESTYLE_ICONS: Record<string, typeof Moon> = {
  sleep: Moon,
  stress: Heart,
  nutrition: Utensils,
  gut: Leaf,
  movement: TrendingUp,
};

interface PremiumReportProps {
  result: PremiumAnalysisResult;
  email?: string;
  analysisId?: number | null;
}

export function PremiumReport({ result, email, analysisId }: PremiumReportProps) {
  const { locale, messages } = useLocale();
  const m = messages.analysisPagePremium;

  const metrics = result?.metrics;
  const radarData = useMemo(() => {
    if (!metrics) return [];
    return Object.entries(metrics)
      .filter(([, v]) => v && typeof v.score === "number")
      .map(([key, v]) => ({
        metric: METRIC_LABELS_SV[key] || key,
        value: v.score || 0,
      }));
  }, [metrics]);

  return (
    <article className="space-y-8">
      {/* Hero header */}
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#108474]/5 p-8 shadow-sm sm:p-12">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#108474]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#108474]">
              <Sparkles className="h-3.5 w-3.5" />
              {m.badge}
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#1d1d1f] sm:text-5xl">
              {m.resultTitle}
            </h1>
            {result.skinArchetype?.name && (
              <p className="mt-3 text-base font-medium text-[#108474]">
                {m.archetypeLabel}: {result.skinArchetype.name}
                {result.skinArchetype.tagline ? ` — ${result.skinArchetype.tagline}` : ""}
              </p>
            )}
          </div>
          <ScoreDonut score={result.scoreOverall} label={m.resultScore} of={m.resultScoreOf} />
        </div>

        {result.scoreLabel && (
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#515151]">
            {result.scoreLabel}
          </p>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {typeof result.skinAge === "number" && (
            <FactCard label={m.skinAgeLabel} value={`${result.skinAge}`} />
          )}
          {result.fitzpatrick && (
            <FactCard label={m.fitzpatrickLabel} value={result.fitzpatrick} />
          )}
          {result.skinArchetype?.name && (
            <FactCard label={m.archetypeLabel} value={result.skinArchetype.name} />
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() =>
              exportPremiumPdf({
                result,
                locale,
                strings: m,
                email: email || "",
                analysisId,
              })
            }
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#108474] px-6 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="mr-2 h-4 w-4" />
            {m.downloadPdf}
          </button>
          <a
            href={accountPath(locale)}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#e6e6e6] bg-white px-6 text-sm font-medium text-[#1d1d1f]"
          >
            {m.ctaResultMyAccount}
          </a>
          <a
            href={shopPath(locale)}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#e6e6e6] bg-white px-6 text-sm font-medium text-[#1d1d1f]"
          >
            {m.ctaResultShop}
          </a>
        </div>
      </header>

      <Toc result={result} m={m} />

      {result.summary && (
        <Section id="summary" head={m.resultSummaryHead}>
          <p className="text-base leading-relaxed text-[#515151]">{result.summary}</p>
        </Section>
      )}

      {Array.isArray(result.skinDnaInsights) && result.skinDnaInsights.length > 0 && (
        <Section id="dna" head={m.skinDnaHead}>
          <div className="grid gap-4 md:grid-cols-3">
            {result.skinDnaInsights.map((ins, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#e6e6e6] bg-white p-5 transition-shadow hover:shadow-md"
              >
                {ins.title && (
                  <p className="text-sm font-semibold text-[#1d1d1f]">{ins.title}</p>
                )}
                {ins.insight && (
                  <p className="mt-2 text-sm leading-relaxed text-[#515151]">
                    {ins.insight}
                  </p>
                )}
                {ins.evidenceFromAnswers?.length ? (
                  <p className="mt-3 text-xs text-[#766a62]">
                    {ins.evidenceFromAnswers.join(" · ")}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </Section>
      )}

      {result.lifestyleScores && hasAnyLifestyleScore(result.lifestyleScores) && (
        <Section id="lifestyle-scores" head={m.lifestyleScoresHead}>
          <LifestyleScoresPanel scores={result.lifestyleScores} m={m} />
        </Section>
      )}

      {result.metrics && Object.keys(result.metrics).length > 0 && (
        <Section id="metrics" head={m.resultMetricsHead}>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="aspect-square w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="78%">
                  <PolarGrid stroke="#e6e6e6" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: "#766a62", fontSize: 11 }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="#108474"
                    strokeWidth={2}
                    fill="#108474"
                    fillOpacity={0.18}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Object.entries(result.metrics).map(([key, metric]) => (
                <MetricBar
                  key={key}
                  name={METRIC_LABELS_SV[key] || key}
                  metric={metric}
                />
              ))}
            </div>
          </div>
        </Section>
      )}

      {result.deepDive && (
        <Section id="deepdive" head={m.resultDeepDiveHead}>
          {result.deepDive.rootCauses?.length ? (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#108474]">
                {m.rootCausesHead}
              </h3>
              <ul className="mt-3 space-y-3">
                {result.deepDive.rootCauses.map((cause, i) => (
                  <li
                    key={i}
                    className="rounded-2xl border-l-4 border-[#108474] bg-[#f5f5f7] p-5"
                  >
                    <p className="text-sm font-semibold text-[#1d1d1f]">{cause.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#515151]">
                      {cause.explanation}
                    </p>
                    {cause.evidence?.length ? (
                      <p className="mt-2 text-xs text-[#766a62]">
                        {cause.evidence.join(" · ")}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {result.deepDive.systemicConnections?.length ? (
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#108474]">
                {m.systemicConnectionsHead}
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#515151]">
                {result.deepDive.systemicConnections.map((c, i) => (
                  <li key={i}>
                    <span className="font-semibold text-[#1d1d1f]">{c.system}: </span>
                    {c.explanation}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Section>
      )}

      {result.circadianRhythm && (
        <Section id="circadian" head={m.circadianHead}>
          <div className="grid gap-4 md:grid-cols-3">
            {(
              [
                ["morning", m.circadianMorning, Sunrise, "from-amber-50 to-amber-100/60"],
                ["midday", m.circadianMidday, Sun, "from-orange-50 to-orange-100/60"],
                ["evening", m.circadianEvening, Sunset, "from-indigo-50 to-indigo-100/60"],
              ] as const
            ).map(([slot, label, Icon, gradient]) => {
              const r = result.circadianRhythm?.[slot];
              if (!r) return null;
              return (
                <div
                  key={slot}
                  className={`rounded-2xl bg-gradient-to-br ${gradient} p-5`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-[#1d1d1f]" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#1d1d1f]">
                      {label}
                    </span>
                  </div>
                  {r.ritual && (
                    <p className="mt-3 text-sm font-semibold text-[#1d1d1f]">{r.ritual}</p>
                  )}
                  {r.why && (
                    <p className="mt-2 text-xs leading-relaxed text-[#515151]">{r.why}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {result.nutritionPlan && (
        <Section id="nutrition" head={m.nutritionHead}>
          {result.nutritionPlan.headline && (
            <p className="text-base leading-relaxed text-[#515151]">
              {result.nutritionPlan.headline}
            </p>
          )}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.isArray(result.nutritionPlan.foodsToAdd) &&
              result.nutritionPlan.foodsToAdd.length > 0 && (
                <div className="rounded-2xl border border-[#108474]/15 bg-[#108474]/5 p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#108474]">
                    <Apple className="h-4 w-4" /> {m.foodsToAdd}
                  </p>
                  <ul className="mt-3 space-y-3">
                    {result.nutritionPlan.foodsToAdd.map((f, i) => (
                      <li key={i}>
                        <p className="text-sm font-semibold text-[#1d1d1f]">{f.food}</p>
                        {f.why && <p className="text-xs text-[#515151]">{f.why}</p>}
                        {f.frequency && <p className="text-xs text-[#766a62]">{f.frequency}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            {Array.isArray(result.nutritionPlan.foodsToLimit) &&
              result.nutritionPlan.foodsToLimit.length > 0 && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                    <AlertTriangle className="h-4 w-4" /> {m.foodsToLimit}
                  </p>
                  <ul className="mt-3 space-y-3">
                    {result.nutritionPlan.foodsToLimit.map((f, i) => (
                      <li key={i}>
                        <p className="text-sm font-semibold text-[#1d1d1f]">{f.food}</p>
                        {f.why && <p className="text-xs text-[#515151]">{f.why}</p>}
                        {f.alternative && (
                          <p className="text-xs text-[#766a62]">{f.alternative}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>

          {result.nutritionPlan.sampleDay && (
            <div className="mt-6 rounded-2xl bg-[#f5f5f7] p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#108474]">
                {m.sampleDay}
              </p>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["breakfast", m.breakfast],
                    ["lunch", m.lunch],
                    ["dinner", m.dinner],
                    ["snacks", m.snacks],
                  ] as const
                ).map(([key, label]) => {
                  const v = result.nutritionPlan?.sampleDay?.[key];
                  if (!v) return null;
                  return (
                    <div key={key}>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-[#766a62]">
                        {label}
                      </dt>
                      <dd className="mt-1 text-sm text-[#1d1d1f]">{v}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          )}

          {result.nutritionPlan.hydrationGoal && (
            <p className="mt-4 flex items-center gap-2 text-sm text-[#515151]">
              <Waves className="h-4 w-4 text-[#108474]" />
              <span className="font-semibold text-[#1d1d1f]">{m.hydrationGoal}: </span>
              {result.nutritionPlan.hydrationGoal}
            </p>
          )}
        </Section>
      )}

      {Array.isArray(result.supplementSuggestions) &&
        result.supplementSuggestions.length > 0 && (
          <Section id="supplements" head={m.supplementsHead}>
            <ul className="space-y-3">
              {result.supplementSuggestions.map((s, i) => (
                <li key={i} className="rounded-2xl bg-[#f5f5f7] p-5">
                  <div className="flex items-start gap-3">
                    <Pill className="mt-0.5 h-5 w-5 flex-none text-[#108474]" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1d1d1f]">{s.name}</p>
                      <p className="mt-1 text-xs text-[#766a62]">
                        {m.doseLabel}: {s.dose}
                        {s.evidenceLevel ? ` · ${m.evidenceLabel}: ${s.evidenceLevel}` : ""}
                      </p>
                      {s.why && (
                        <p className="mt-2 text-sm leading-relaxed text-[#515151]">{s.why}</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        )}

      {result.environmentalFactors && (
        <Section id="environment" head={m.environmentHead}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {(
              [
                ["uv", m.envUv, Sun],
                ["blueLight", m.envBlueLight, Cloud],
                ["pollution", m.envPollution, Wind],
                ["climate", m.envClimate, Compass],
                ["waterHardness", m.envWater, Waves],
              ] as const
            ).map(([key, label, Icon]) => {
              const f = result.environmentalFactors?.[key];
              if (!f) return null;
              return (
                <div key={key} className="rounded-2xl border border-[#e6e6e6] bg-white p-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#108474]" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#766a62]">
                      {label}
                    </span>
                  </div>
                  {f.impact && (
                    <p className="mt-2 text-xs text-[#766a62]">
                      {m.envImpact}: <span className="text-[#1d1d1f]">{f.impact}</span>
                    </p>
                  )}
                  {f.advice && (
                    <p className="mt-2 text-sm leading-relaxed text-[#515151]">{f.advice}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {Array.isArray(result.microHabits) && result.microHabits.length > 0 && (
        <Section id="microhabits" head={m.microHabitsHead}>
          <ol className="space-y-3">
            {result.microHabits.map((h, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-2xl border border-[#e6e6e6] bg-white p-5"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#108474]/10 text-sm font-bold text-[#108474]">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1d1d1f]">{h.habit}</p>
                  {(h.stackWith || h.duration) && (
                    <p className="mt-1 text-xs text-[#766a62]">
                      {h.stackWith && (
                        <>
                          {m.microHabitStackWith}: {h.stackWith}
                        </>
                      )}
                      {h.stackWith && h.duration ? " · " : ""}
                      {h.duration && (
                        <>
                          {m.microHabitDuration}: {h.duration}
                        </>
                      )}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {result.protocol4Weeks && (
        <Section id="protocol" head={m.protocol4WeeksHead}>
          {result.protocol4Weeks.vision && (
            <p className="text-base leading-relaxed text-[#515151]">
              {result.protocol4Weeks.vision}
            </p>
          )}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {(["week1", "week2", "week3", "week4"] as const).map((wk, idx) => {
              const week = result.protocol4Weeks?.[wk];
              if (!week) return null;
              return (
                <div
                  key={wk}
                  className="overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white"
                >
                  <div className="bg-[#108474] px-5 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white">
                      {m.weekLabel.replace("{n}", String(idx + 1))}
                    </p>
                  </div>
                  <div className="p-5">
                    {week.focus && (
                      <p className="text-sm font-semibold text-[#1d1d1f]">
                        {m.weekFocus}: {week.focus}
                      </p>
                    )}
                    {week.actions?.length ? (
                      <ul className="mt-3 space-y-1.5 text-sm text-[#515151]">
                        {week.actions.map((a, i) => (
                          <li key={i} className="flex gap-2">
                            <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-[#108474]" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {week.milestone && (
                      <p className="mt-4 text-xs text-[#766a62]">
                        {m.weekMilestone}: {week.milestone}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {result.expectedTrajectory && (
        <Section id="trajectory" head={m.expectedTrajectoryHead}>
          <ol className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
            {(["week1", "week2", "week3", "week4"] as const).map((wk, idx) => {
              const txt = result.expectedTrajectory?.[wk];
              if (!txt) return null;
              return (
                <li
                  key={wk}
                  className="rounded-2xl border-l-4 border-[#108474]/40 bg-white p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#108474]">
                    {m.weekLabel.replace("{n}", String(idx + 1))}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#515151]">{txt}</p>
                </li>
              );
            })}
          </ol>
        </Section>
      )}

      {result.lifestyleProgram && (
        <Section id="lifestyle" head={m.lifestyleProgramHead}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(result.lifestyleProgram).map(([key, val]) => {
              const Icon = LIFESTYLE_ICONS[key] || Heart;
              return (
                <div key={key} className="rounded-2xl bg-[#f5f5f7] p-5">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#108474]" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#108474]">
                      {key}
                    </p>
                    {val.expectedImpact && (
                      <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase text-[#766a62]">
                        {val.expectedImpact}
                      </span>
                    )}
                  </div>
                  {val.headline && (
                    <p className="mt-3 text-sm font-semibold text-[#1d1d1f]">{val.headline}</p>
                  )}
                  {val.actions?.length ? (
                    <ul className="mt-2 space-y-1 text-sm text-[#515151]">
                      {val.actions.map((a, i) => (
                        <li key={i} className="flex gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-[#108474]" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {val.why && (
                    <p className="mt-3 text-xs leading-relaxed text-[#766a62]">{val.why}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {result.productProtocol && (
        <Section id="protocol-products" head={m.productProtocolHead}>
          <div className="grid gap-4 md:grid-cols-3">
            {(
              [
                ["morning", m.protocolMorning, Sunrise],
                ["evening", m.protocolEvening, Sunset],
                ["weekly", m.protocolWeekly, Calendar],
              ] as const
            ).map(([slot, label, Icon]) => {
              const items = result.productProtocol?.[slot];
              if (!items?.length) return null;
              return (
                <div key={slot} className="rounded-2xl border border-[#e6e6e6] bg-white p-5">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#108474]" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#108474]">
                      {label}
                    </p>
                  </div>
                  <ol className="mt-3 space-y-3 text-sm">
                    {items.map((it, i) => (
                      <li key={i} className="border-b border-[#e6e6e6] pb-3 last:border-0 last:pb-0">
                        <p className="font-semibold text-[#1d1d1f]">{it.step}</p>
                        {it.why && <p className="mt-1 text-xs text-[#766a62]">{it.why}</p>}
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {Array.isArray(result.products) && result.products.length > 0 && (
        <Section id="products" head={m.productsHead}>
          <ul className="grid gap-4 sm:grid-cols-2">
            {result.products.map((p, i) => {
              const view = getPremiumProductView(p.id, locale);
              return (
                <li
                  key={i}
                  className="overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white transition-shadow hover:shadow-md"
                >
                  {view.image ? (
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#f5f5f7]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={view.image}
                        alt={view.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-col gap-3 p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-base font-semibold tracking-tight text-[#1d1d1f]">
                        {view.name}
                      </p>
                      {view.price !== null && (
                        <p className="text-sm font-semibold text-[#108474]">
                          {view.price} {view.currency}
                        </p>
                      )}
                    </div>
                    {view.shortDesc && (
                      <p className="text-xs leading-relaxed text-[#766a62]">
                        {view.shortDesc}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed text-[#515151]">{p.reason}</p>
                    {p.usage && (
                      <p className="rounded-xl bg-[#f5f5f7] px-3 py-2 text-xs text-[#766a62]">
                        {p.usage}
                      </p>
                    )}
                    {view.href && (
                      <a
                        href={view.href}
                        className="mt-1 inline-flex h-9 w-fit items-center justify-center rounded-full bg-[#108474] px-4 text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
                      >
                        {locale === "en"
                          ? "View product"
                          : locale === "es"
                          ? "Ver producto"
                          : locale === "de"
                          ? "Produkt ansehen"
                          : locale === "fr"
                          ? "Voir le produit"
                          : "Se produkten"}
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {Array.isArray(result.ingredientWarnings) && result.ingredientWarnings.length > 0 && (
        <Section id="ingredient-warnings" head={m.ingredientWarningsHead}>
          <ul className="space-y-3">
            {result.ingredientWarnings.map((w, i) => (
              <li key={i} className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-sm font-semibold text-amber-800">{w.ingredient}</p>
                {w.why && <p className="mt-2 text-sm leading-relaxed text-[#515151]">{w.why}</p>}
                {w.alternativeApproach && (
                  <p className="mt-2 text-xs text-[#766a62]">
                    {m.ingredientAlternative}: {w.alternativeApproach}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {result.progressTracking && (
        <Section id="progress" head={m.progressTrackingHead}>
          <div className="grid gap-4 md:grid-cols-3">
            {result.progressTracking.rephotoFrequency && (
              <ProgressCard
                Icon={Camera}
                label={m.progressRephoto}
                value={result.progressTracking.rephotoFrequency}
              />
            )}
            {result.progressTracking.metricsToTrack?.length ? (
              <div className="rounded-2xl border border-[#e6e6e6] bg-white p-5">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-[#108474]" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#108474]">
                    {m.progressMetrics}
                  </p>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-[#515151]">
                  {result.progressTracking.metricsToTrack.map((mm, i) => (
                    <li key={i} className="flex gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-[#108474]" />
                      <span>{mm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {result.progressTracking.journalingPrompts?.length ? (
              <div className="rounded-2xl border border-[#e6e6e6] bg-white p-5">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#108474]" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#108474]">
                    {m.progressJournaling}
                  </p>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-[#515151]">
                  {result.progressTracking.journalingPrompts.map((j, i) => (
                    <li key={i} className="flex gap-2">
                      <Quote className="mt-0.5 h-3.5 w-3.5 flex-none text-[#108474]" />
                      <span>{j}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Section>
      )}

      {Array.isArray(result.redFlags) && result.redFlags.length > 0 && (
        <Section id="redflags" head={m.redFlagsHead}>
          <ul className="space-y-2 text-sm text-[#515151]">
            {result.redFlags.map((flag, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-2xl border-l-4 border-amber-400 bg-amber-50 p-4"
              >
                <Stethoscope className="mt-0.5 h-4 w-4 flex-none text-amber-600" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {result.psychologicalNote && (
        <Section id="psych" head={m.psychologicalNoteHead}>
          <blockquote className="relative rounded-2xl bg-[#f5f5f7] p-6 italic">
            <Quote className="absolute -top-3 left-4 h-6 w-6 text-[#108474]" />
            <p className="pl-6 text-base leading-relaxed text-[#515151]">
              {result.psychologicalNote}
            </p>
          </blockquote>
        </Section>
      )}

      {result.positiveAffirmation && (
        <Section id="affirm" head={m.positiveAffirmationHead}>
          <p className="rounded-2xl bg-gradient-to-br from-[#108474]/8 to-[#108474]/15 p-6 text-center text-lg font-medium leading-relaxed text-[#1d1d1f]">
            {result.positiveAffirmation}
          </p>
        </Section>
      )}

      {result.followUp && (
        <Section id="followup" head={m.followUpHead}>
          {typeof result.followUp.recommendedRescanWeeks === "number" && (
            <p className="text-sm text-[#515151]">
              <span className="font-semibold text-[#1d1d1f]">{m.followUpRescan}: </span>
              {m.followUpRescanWeeks.replace(
                "{n}",
                String(result.followUp.recommendedRescanWeeks)
              )}
            </p>
          )}
          {result.followUp.escalationCriteria?.length ? (
            <div className="mt-3">
              <p className="text-sm font-semibold text-[#1d1d1f]">{m.followUpEscalation}:</p>
              <ul className="mt-2 space-y-1 text-sm text-[#515151]">
                {result.followUp.escalationCriteria.map((e, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#108474]">•</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Section>
      )}

      <footer className="rounded-3xl bg-[#1d1d1f] p-8 text-center text-white sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#108474]">
          1753 SKINCARE
        </p>
        <p className="mt-3 text-2xl font-bold">{m.signatureLine}</p>
        <p className="mt-2 text-sm text-white/70">{m.contactLine}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() =>
              exportPremiumPdf({
                result,
                locale,
                strings: m,
                email: email || "",
                analysisId,
              })
            }
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#108474] px-6 text-sm font-semibold text-white"
          >
            <FileText className="mr-2 h-4 w-4" />
            {m.downloadPdf}
          </button>
          <a
            href={shopPath(locale)}
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-medium text-white"
          >
            <Coffee className="mr-2 h-4 w-4" />
            {m.ctaResultShop}
          </a>
        </div>
      </footer>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function Section({
  id,
  head,
  children,
}: {
  id: string;
  head: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-3xl bg-white p-8 shadow-sm sm:p-12"
    >
      <h2 className="text-xl font-bold tracking-tight text-[#1d1d1f] sm:text-2xl">
        {head}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function FactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f5f5f7] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#766a62]">{label}</p>
      <p className="mt-1 text-base font-semibold text-[#1d1d1f]">{value}</p>
    </div>
  );
}

function ScoreDonut({
  score,
  label,
  of,
}: {
  score?: number;
  label: string;
  of: string;
}) {
  if (typeof score !== "number") return null;
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;
  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e6e6e6" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#108474"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-[#1d1d1f]">{clamped}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#766a62]">
          {of}
        </span>
        <span className="mt-0.5 text-[10px] uppercase tracking-wide text-[#766a62]">{label}</span>
      </div>
    </div>
  );
}

function MetricBar({
  name,
  metric,
}: {
  name: string;
  metric: { score?: number; grade?: number; detail?: string } | undefined;
}) {
  if (!metric) return null;
  const score = typeof metric.score === "number" ? metric.score : 0;
  const color =
    score >= 80 ? "bg-[#108474]" : score >= 60 ? "bg-[#fcb237]" : "bg-[#d97757]";
  return (
    <div className="rounded-2xl bg-[#f5f5f7] p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#766a62]">
          {name}
        </span>
        <span className="text-sm font-bold text-[#1d1d1f]">{score}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
        <div
          className={cn("h-full rounded-full transition-[width] duration-500", color)}
          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        />
      </div>
      {metric.detail && <p className="mt-2 text-xs text-[#515151]">{metric.detail}</p>}
    </div>
  );
}

function ProgressCard({
  Icon,
  label,
  value,
}: {
  Icon: typeof Camera;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e6e6e6] bg-white p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#108474]" />
        <p className="text-xs font-semibold uppercase tracking-wide text-[#108474]">{label}</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[#515151]">{value}</p>
    </div>
  );
}

function hasAnyLifestyleScore(s: LifestyleScores): boolean {
  return LIFESTYLE_KEYS.some((k) => typeof s[k]?.score === "number");
}

function lifestyleLabel(k: LifestyleKey, m: LifestylePanelStrings): string {
  switch (k) {
    case "sleep":
      return m.lifestyleSleep;
    case "stress":
      return m.lifestyleStress;
    case "nutrition":
      return m.lifestyleNutrition;
    case "gut":
      return m.lifestyleGut;
    case "movement":
      return m.lifestyleMovement;
  }
}

function determineWeakestLink(s: LifestyleScores): LifestyleKey | null {
  if (s.weakestLink && LIFESTYLE_KEYS.includes(s.weakestLink as LifestyleKey)) {
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

interface LifestylePanelStrings {
  lifestyleSleep: string;
  lifestyleStress: string;
  lifestyleNutrition: string;
  lifestyleGut: string;
  lifestyleMovement: string;
  lifestyleWeakestLink: string;
  lifestyleStartHere: string;
  lifestyleTopLevers: string;
}

function LifestyleScoresPanel({
  scores,
  m,
}: {
  scores: LifestyleScores;
  m: LifestylePanelStrings;
}) {
  const weakest = determineWeakestLink(scores);
  const radarData = LIFESTYLE_KEYS.filter(
    (k) => typeof scores[k]?.score === "number"
  ).map((k) => ({
    metric: lifestyleLabel(k, m),
    value: scores[k]?.score ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="aspect-square w-full max-w-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="78%">
              <PolarGrid stroke="#e6e6e6" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "#766a62", fontSize: 12, fontWeight: 600 }}
              />
              <Radar
                dataKey="value"
                stroke="#108474"
                strokeWidth={2}
                fill="#108474"
                fillOpacity={0.18}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex flex-col justify-center gap-3">
          {LIFESTYLE_KEYS.filter((k) => typeof scores[k]?.score === "number").map(
            (k) => {
              const entry = scores[k];
              const score = entry?.score ?? 0;
              const isWeakest = k === weakest;
              return (
                <li
                  key={k}
                  className={cn(
                    "rounded-2xl border bg-white p-4 transition-all",
                    isWeakest
                      ? "border-[#108474] shadow-md"
                      : "border-[#e6e6e6]"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold uppercase tracking-wide text-[#1d1d1f]">
                        {lifestyleLabel(k, m)}
                      </span>
                      {isWeakest && (
                        <span className="rounded-full bg-[#108474] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          {m.lifestyleStartHere}
                        </span>
                      )}
                    </div>
                    <span className="text-base font-bold text-[#1d1d1f]">
                      {Math.round(score)}
                      <span className="text-xs font-medium text-[#766a62]">
                        {" "}
                        / 100
                      </span>
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f5f5f7]">
                    <div
                      className={cn(
                        "h-full rounded-full transition-[width] duration-700",
                        score >= 80
                          ? "bg-[#108474]"
                          : score >= 60
                          ? "bg-[#fcb237]"
                          : "bg-[#d97757]"
                      )}
                      style={{
                        width: `${Math.max(0, Math.min(100, score))}%`,
                      }}
                    />
                  </div>
                  {entry?.detail && (
                    <p className="mt-2 text-xs leading-relaxed text-[#515151]">
                      {entry.detail}
                    </p>
                  )}
                </li>
              );
            }
          )}
        </ul>
      </div>

      {weakest && (
        <div className="rounded-2xl bg-gradient-to-br from-[#108474]/8 via-[#108474]/4 to-transparent p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#108474]">
            {m.lifestyleWeakestLink}
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-[#1d1d1f] sm:text-3xl">
            {lifestyleLabel(weakest, m)}
            <span className="ml-3 text-base font-medium text-[#766a62]">
              {Math.round(scores[weakest]?.score ?? 0)} / 100
            </span>
          </h3>
          {scores.weakestLinkInsight && (
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#515151]">
              {scores.weakestLinkInsight}
            </p>
          )}
          {scores[weakest]?.topLevers?.length ? (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#766a62]">
                {m.lifestyleTopLevers}
              </p>
              <ol className="mt-3 grid gap-2 sm:grid-cols-3">
                {scores[weakest]?.topLevers?.slice(0, 3).map((lever, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-xl bg-white p-4 shadow-sm"
                  >
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#108474]/10 text-sm font-bold text-[#108474]">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-[#1d1d1f]">
                      {lever}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

interface PremiumStrings {
  resultSummaryHead: string;
  skinDnaHead: string;
  lifestyleScoresHead: string;
  resultMetricsHead: string;
  resultDeepDiveHead: string;
  archetypeHead: string;
  circadianHead: string;
  nutritionHead: string;
  supplementsHead: string;
  environmentHead: string;
  microHabitsHead: string;
  protocol4WeeksHead: string;
  expectedTrajectoryHead: string;
  lifestyleProgramHead: string;
  productProtocolHead: string;
  productsHead: string;
  ingredientWarningsHead: string;
  progressTrackingHead: string;
  redFlagsHead: string;
  psychologicalNoteHead: string;
  positiveAffirmationHead: string;
  followUpHead: string;
  tocHead: string;
}

function Toc({ result, m }: { result: PremiumAnalysisResult; m: PremiumStrings }) {
  const items: { id: string; label: string }[] = [];
  if (result.summary) items.push({ id: "summary", label: m.resultSummaryHead });
  if (result.skinDnaInsights?.length) items.push({ id: "dna", label: m.skinDnaHead });
  if (result.lifestyleScores && hasAnyLifestyleScore(result.lifestyleScores))
    items.push({ id: "lifestyle-scores", label: m.lifestyleScoresHead });
  if (result.metrics && Object.keys(result.metrics).length)
    items.push({ id: "metrics", label: m.resultMetricsHead });
  if (result.deepDive) items.push({ id: "deepdive", label: m.resultDeepDiveHead });
  if (result.circadianRhythm) items.push({ id: "circadian", label: m.circadianHead });
  if (result.nutritionPlan) items.push({ id: "nutrition", label: m.nutritionHead });
  if (result.supplementSuggestions?.length)
    items.push({ id: "supplements", label: m.supplementsHead });
  if (result.environmentalFactors)
    items.push({ id: "environment", label: m.environmentHead });
  if (result.microHabits?.length) items.push({ id: "microhabits", label: m.microHabitsHead });
  if (result.protocol4Weeks) items.push({ id: "protocol", label: m.protocol4WeeksHead });
  if (result.expectedTrajectory)
    items.push({ id: "trajectory", label: m.expectedTrajectoryHead });
  if (result.lifestyleProgram)
    items.push({ id: "lifestyle", label: m.lifestyleProgramHead });
  if (result.productProtocol)
    items.push({ id: "protocol-products", label: m.productProtocolHead });
  if (result.products?.length) items.push({ id: "products", label: m.productsHead });
  if (result.ingredientWarnings?.length)
    items.push({ id: "ingredient-warnings", label: m.ingredientWarningsHead });
  if (result.progressTracking) items.push({ id: "progress", label: m.progressTrackingHead });
  if (result.redFlags?.length) items.push({ id: "redflags", label: m.redFlagsHead });
  if (result.psychologicalNote)
    items.push({ id: "psych", label: m.psychologicalNoteHead });
  if (result.positiveAffirmation)
    items.push({ id: "affirm", label: m.positiveAffirmationHead });
  if (result.followUp) items.push({ id: "followup", label: m.followUpHead });

  if (!items.length) return null;
  return (
    <nav
      aria-label="Table of contents"
      className="rounded-3xl border border-[#e6e6e6] bg-white p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-[#766a62]">
        {m.tocHead}
      </p>
      <ol className="mt-3 grid gap-2 text-sm sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((it, i) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className="block rounded-xl px-2 py-1.5 text-[#1d1d1f] transition-colors hover:bg-[#108474]/5 hover:text-[#108474]"
            >
              <span className="mr-2 text-xs font-semibold text-[#766a62]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function accountPath(locale: string) {
  switch (locale) {
    case "en":
      return "/en/my-account";
    case "es":
      return "/es/mi-cuenta";
    case "de":
      return "/de/mein-konto";
    case "fr":
      return "/fr/mon-compte";
    default:
      return "/sv/mitt-konto";
  }
}

function shopPath(locale: string) {
  switch (locale) {
    case "en":
      return "/en/products";
    case "es":
      return "/es/productos";
    case "de":
      return "/de/produkte";
    case "fr":
      return "/fr/produits";
    default:
      return "/sv/produkter";
  }
}
