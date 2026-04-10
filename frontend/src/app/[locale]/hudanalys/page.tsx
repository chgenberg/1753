"use client";

import { useCallback, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Droplets,
  Flame,
  Leaf,
  Loader2,
  Moon,
  ShieldAlert,
  Sparkles,
  Sun,
  Target,
  Zap,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { SectionWrapper } from "@/components/section-wrapper";
import { apiFetch } from "@/lib/api";
import { PRODUCTS, type Product } from "@/lib/products";
import { useLocale } from "@/providers/locale-provider";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

type Step = "intro" | 1 | 2 | 3 | 4 | 5 | "analyzing" | "result";

interface QuizAnswers {
  skinType: string;
  concerns: string[];
  routine: string[];
  sleep: number;
  stress: string;
  diet: string;
  water: string;
  exercise: string;
  goals: string[];
  sensitivities: string;
}

interface AnalysisJSON {
  score: number;
  summary: string;
  regions?: { label: string; observation: string; score: number }[];
  lifestyle: { area: string; tip: string; impact: string }[];
  products: { id: string; reason: string }[];
  avoid: string[];
  nextAnalysis: string;
  routineSuggestion?: { morning: string[]; evening: string[] };
}

interface AnalysisResponse {
  content: string;
  responseId: string | null;
  analysisId?: number;
}

const TOTAL_STEPS = 5;

const CONCERN_ICONS: Record<string, typeof Flame> = {
  acne: Flame,
  dryness: Droplets,
  redness: ShieldAlert,
  pigment: Sun,
  aging: Moon,
  eczema: ShieldAlert,
  pores: Target,
  dull: Sparkles,
};

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100;
  return (
    <div className="mx-auto mb-8 w-full max-w-md">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
        <div
          className="h-full rounded-full bg-[#108474] transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  subtitle,
  icon: Icon,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
  icon?: typeof Leaf;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-2 rounded-2xl border-2 px-5 py-6 text-center transition-all duration-300",
        selected
          ? "border-[#108474] bg-[#108474]/5 shadow-md shadow-[#108474]/10"
          : "border-brand-100 bg-white hover:border-brand-200 hover:shadow-sm",
        className
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "h-6 w-6 transition-colors",
            selected ? "text-[#108474]" : "text-brand-400 group-hover:text-brand-600"
          )}
        />
      )}
      <span
        className={cn(
          "text-sm font-semibold transition-colors",
          selected ? "text-[#108474]" : "text-brand-900"
        )}
      >
        {title}
      </span>
      {subtitle && (
        <span className="text-xs text-brand-500">{subtitle}</span>
      )}
      {selected && (
        <div className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#108474]">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
    </button>
  );
}

function ChipSelect({
  options,
  selected,
  onToggle,
}: {
  options: { key: string; label: string; icon?: typeof Flame }[];
  selected: string[];
  onToggle: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {options.map((opt) => {
        const active = selected.includes(opt.key);
        const Icon = opt.icon;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onToggle(opt.key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-medium transition-all duration-300",
              active
                ? "border-[#108474] bg-[#108474]/5 text-[#108474]"
                : "border-brand-100 bg-white text-brand-700 hover:border-brand-200"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {opt.label}
            {active && <Check className="h-3.5 w-3.5" />}
          </button>
        );
      })}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 75 ? "#108474" : score >= 50 ? "#fcb237" : "#e55050";

  return (
    <div className="relative mx-auto h-48 w-48">
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="#e6e6e6"
          strokeWidth="10"
        />
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-brand-900">{score}</span>
        <span className="text-xs font-medium text-brand-500">av 100</span>
      </div>
    </div>
  );
}

function parseAnalysisJSON(content: string): AnalysisJSON | null {
  const match = content.match(/```json\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function stripJSON(content: string): string {
  return content.replace(/```json[\s\S]*?```/, "").trim();
}

export default function AnalysisPage() {
  const { t } = useLocale();
  const { token } = useAuth();
  const a = (key: string, vars?: Record<string, string | number>) =>
    t(`analysisPage.${key}`, vars);

  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<QuizAnswers>({
    skinType: "",
    concerns: [],
    routine: [],
    sleep: 7,
    stress: "",
    diet: "",
    water: "",
    exercise: "",
    goals: [],
    sensitivities: "",
  });
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [parsed, setParsed] = useState<AnalysisJSON | null>(null);
  const [error, setError] = useState("");

  const toggleArray = (arr: string[], key: string, max?: number) => {
    if (arr.includes(key)) return arr.filter((k) => k !== key);
    if (max && arr.length >= max) return arr;
    return [...arr, key];
  };

  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 1:
        return !!answers.skinType;
      case 2:
        return answers.concerns.length > 0;
      case 3:
        return answers.routine.length > 0;
      case 4:
        return !!answers.stress && !!answers.diet && !!answers.water && !!answers.exercise;
      case 5:
        return answers.goals.length > 0;
      default:
        return true;
    }
  }, [step, answers]);

  const analyze = useCallback(async () => {
    setStep("analyzing");
    setError("");
    try {
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const data = await apiFetch<AnalysisResponse>("/analysis", {
        method: "POST",
        headers,
        body: JSON.stringify({
          questions: {
            skinType: answers.skinType,
            concerns: answers.concerns,
            routine: answers.routine.join(", "),
            lifestyle: {
              sleep: answers.sleep,
              stress: answers.stress,
              diet: answers.diet,
              water: answers.water,
              activity: answers.exercise,
            },
            goals: answers.goals,
            goalFreeText: answers.sensitivities
              ? `Känsligheter/allergier: ${answers.sensitivities}`
              : undefined,
          },
        }),
      });
      setResult(data);
      const json = parseAnalysisJSON(data.content);
      setParsed(json);
      setStep("result");
    } catch {
      setError(a("analysisError"));
      setStep(5);
    }
  }, [answers, a, token]);

  const goNext = () => {
    if (typeof step === "number" && step < TOTAL_STEPS) setStep((step + 1) as Step);
    else if (typeof step === "number" && step === TOTAL_STEPS) analyze();
  };
  const goPrev = () => {
    if (typeof step === "number" && step > 1) setStep((step - 1) as Step);
    else if (step === 1) setStep("intro");
  };

  const skinTypes = [
    { key: "dry", label: a("skinDry"), sub: a("skinDrySub"), icon: Droplets },
    { key: "normal", label: a("skinNormal"), sub: a("skinNormalSub"), icon: Leaf },
    { key: "combo", label: a("skinCombo"), sub: a("skinComboSub"), icon: Zap },
    { key: "oily", label: a("skinOily"), sub: a("skinOilySub"), icon: Flame },
    { key: "sensitive", label: a("skinSensitive"), sub: a("skinSensitiveSub"), icon: ShieldAlert },
  ];

  const concerns = [
    { key: "acne", label: a("concernAcne"), icon: CONCERN_ICONS.acne },
    { key: "dryness", label: a("concernDryness"), icon: CONCERN_ICONS.dryness },
    { key: "redness", label: a("concernRedness"), icon: CONCERN_ICONS.redness },
    { key: "pigment", label: a("concernPigment"), icon: CONCERN_ICONS.pigment },
    { key: "aging", label: a("concernAging"), icon: CONCERN_ICONS.aging },
    { key: "eczema", label: a("concernEczema"), icon: CONCERN_ICONS.eczema },
    { key: "pores", label: a("concernPores"), icon: CONCERN_ICONS.pores },
    { key: "dull", label: a("concernDull"), icon: CONCERN_ICONS.dull },
  ];

  const routineOpts = [
    { key: "cleanse", label: a("routineCleanse") },
    { key: "serum", label: a("routineSerum") },
    { key: "oil", label: a("routineOil") },
    { key: "moisturizer", label: a("routineMoisturizer") },
    { key: "spf", label: a("routineSPF") },
    { key: "nothing", label: a("routineNothing") },
    { key: "other", label: a("routineOther") },
  ];

  const goalOpts = [
    { key: "glow", label: a("goalGlow") },
    { key: "calm", label: a("goalCalm") },
    { key: "clear", label: a("goalClear") },
    { key: "anti-age", label: a("goalAntiAge") },
    { key: "hydrate", label: a("goalHydrate") },
    { key: "simplify", label: a("goalSimplify") },
  ];

  const matchedProducts: (Product & { reason: string })[] = (parsed?.products ?? [])
    .map((rec) => {
      const p = PRODUCTS.find((prod) => prod.id === rec.id);
      return p ? { ...p, reason: rec.reason } : null;
    })
    .filter(Boolean) as (Product & { reason: string })[];

  const impactBadge = (impact: string) => {
    const key = impact.toLowerCase();
    if (key === "hög" || key === "high")
      return { label: a("lifestyleImpactHigh"), cls: "bg-red-50 text-red-700" };
    if (key === "medel" || key === "medium")
      return { label: a("lifestyleImpactMedium"), cls: "bg-amber-50 text-amber-700" };
    return { label: a("lifestyleImpactLow"), cls: "bg-green-50 text-green-700" };
  };

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[680px] px-6 md:px-10">
          {/* ---- INTRO ---- */}
          {step === "intro" && (
            <div className="text-center animate-fade-in">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                {a("badge")}
              </p>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {a("title")}
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                {a("intro")}
              </p>
              <button
                onClick={() => setStep(1)}
                className="mt-10 inline-flex h-14 items-center gap-3 rounded-full bg-[#108474] px-10 text-sm font-semibold text-white shadow-lg shadow-[#108474]/20 transition-all hover:bg-[#0d6e62] hover:shadow-xl active:scale-[0.97]"
              >
                <Sparkles className="h-5 w-5" />
                {a("startQuiz")}
              </button>
            </div>
          )}

          {/* ---- QUIZ STEPS ---- */}
          {typeof step === "number" && (
            <div className="animate-fade-in">
              <ProgressBar current={step} total={TOTAL_STEPS} />

              <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {a("stepOf", { current: step, total: TOTAL_STEPS })}
              </p>

              {/* Step 1 - Skin type */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight">{a("step1Title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{a("step1Sub")}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {skinTypes.map((st) => (
                      <OptionCard
                        key={st.key}
                        selected={answers.skinType === st.key}
                        onClick={() => setAnswers((p) => ({ ...p, skinType: st.key }))}
                        title={st.label}
                        subtitle={st.sub}
                        icon={st.icon}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 - Concerns */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight">{a("step2Title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{a("step2Sub")}</p>
                  </div>
                  <ChipSelect
                    options={concerns}
                    selected={answers.concerns}
                    onToggle={(k) =>
                      setAnswers((p) => ({
                        ...p,
                        concerns: toggleArray(p.concerns, k, 4),
                      }))
                    }
                  />
                </div>
              )}

              {/* Step 3 - Current routine */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight">{a("step3Title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{a("step3Sub")}</p>
                  </div>
                  <ChipSelect
                    options={routineOpts}
                    selected={answers.routine}
                    onToggle={(k) =>
                      setAnswers((p) => ({
                        ...p,
                        routine: toggleArray(p.routine, k),
                      }))
                    }
                  />
                </div>
              )}

              {/* Step 4 - Lifestyle */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight">{a("step4Title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{a("step4Sub")}</p>
                  </div>
                  <div className="space-y-5">
                    {/* Sleep slider */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-brand-900">
                        {a("sleepLabel")}: {answers.sleep} {a("sleepH")}
                      </label>
                      <input
                        type="range"
                        min={3}
                        max={10}
                        step={0.5}
                        value={answers.sleep}
                        onChange={(e) =>
                          setAnswers((p) => ({ ...p, sleep: parseFloat(e.target.value) }))
                        }
                        className="w-full accent-[#108474]"
                      />
                      <div className="mt-1 flex justify-between text-xs text-brand-400">
                        <span>3h</span>
                        <span>10h</span>
                      </div>
                    </div>

                    {/* Stress */}
                    <SelectField
                      label={a("stressLabel")}
                      value={answers.stress}
                      onChange={(v) => setAnswers((p) => ({ ...p, stress: v }))}
                      options={[
                        { value: "low", label: a("stressLow") },
                        { value: "medium", label: a("stressMedium") },
                        { value: "high", label: a("stressHigh") },
                        { value: "very-high", label: a("stressVeryHigh") },
                      ]}
                    />

                    {/* Diet */}
                    <SelectField
                      label={a("dietLabel")}
                      value={answers.diet}
                      onChange={(v) => setAnswers((p) => ({ ...p, diet: v }))}
                      options={[
                        { value: "balanced", label: a("dietBalanced") },
                        { value: "vegan", label: a("dietVegan") },
                        { value: "processed", label: a("dietProcessed") },
                        { value: "low-carb", label: a("dietLowCarb") },
                        { value: "other", label: a("dietOther") },
                      ]}
                    />

                    {/* Water */}
                    <SelectField
                      label={a("waterLabel")}
                      value={answers.water}
                      onChange={(v) => setAnswers((p) => ({ ...p, water: v }))}
                      options={[
                        { value: "low", label: a("waterLow") },
                        { value: "medium", label: a("waterMedium") },
                        { value: "high", label: a("waterHigh") },
                      ]}
                    />

                    {/* Exercise */}
                    <SelectField
                      label={a("exerciseLabel")}
                      value={answers.exercise}
                      onChange={(v) => setAnswers((p) => ({ ...p, exercise: v }))}
                      options={[
                        { value: "none", label: a("exerciseNone") },
                        { value: "1-2", label: a("exercise12") },
                        { value: "3-5", label: a("exercise35") },
                        { value: "daily", label: a("exerciseDaily") },
                      ]}
                    />
                  </div>
                </div>
              )}

              {/* Step 5 - Goals & sensitivities */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight">{a("step5Title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{a("step5Sub")}</p>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-medium text-brand-900">{a("goalsLabel")}</p>
                    <ChipSelect
                      options={goalOpts}
                      selected={answers.goals}
                      onToggle={(k) =>
                        setAnswers((p) => ({
                          ...p,
                          goals: toggleArray(p.goals, k),
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-brand-900">
                      {a("sensitivitiesLabel")}
                    </label>
                    <input
                      type="text"
                      value={answers.sensitivities}
                      onChange={(e) =>
                        setAnswers((p) => ({ ...p, sensitivities: e.target.value }))
                      }
                      placeholder={a("sensitivitiesPlaceholder")}
                      className="w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-brand-400 focus:border-[#108474] focus:outline-none focus:ring-2 focus:ring-[#108474]/20"
                    />
                  </div>

                  {error && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="mt-10 flex items-center justify-between">
                <button
                  onClick={goPrev}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {a("prev")}
                </button>
                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="inline-flex items-center gap-2 rounded-full bg-[#108474] px-8 py-3 text-sm font-semibold text-white shadow-md shadow-[#108474]/20 transition-all hover:bg-[#0d6e62] disabled:opacity-40 disabled:shadow-none"
                >
                  {step === TOTAL_STEPS ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {a("getResults")}
                    </>
                  ) : (
                    <>
                      {a("next")}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ---- ANALYZING ---- */}
          {step === "analyzing" && (
            <div className="text-center animate-fade-in">
              <Loader2 className="mx-auto mb-6 h-14 w-14 animate-spin text-[#108474]" />
              <h2 className="text-2xl font-bold tracking-tight">{a("analyzingTitle")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{a("analyzingSub")}</p>
            </div>
          )}

          {/* ---- RESULT ---- */}
          {step === "result" && result && (
            <div className="animate-fade-in space-y-10">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">{a("resultTitle")}</h2>
              </div>

              {/* Score ring */}
              {parsed && (
                <div className="text-center">
                  <ScoreRing score={parsed.score} />
                  <p className="mt-2 text-sm font-medium text-brand-500">
                    {a("resultScore")}
                  </p>
                  {parsed.summary && (
                    <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-brand-600">
                      {parsed.summary}
                    </p>
                  )}
                </div>
              )}

              {/* Prose content (without JSON) */}
              <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
                <div
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: stripJSON(result.content) }}
                />
              </div>

              {/* Lifestyle recommendations */}
              {parsed?.lifestyle && parsed.lifestyle.length > 0 && (
                <div>
                  <h3 className="mb-4 text-lg font-bold tracking-tight">{a("lifestyleTitle")}</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {parsed.lifestyle.map((item, i) => {
                      const badge = impactBadge(item.impact);
                      return (
                        <div
                          key={i}
                          className="rounded-2xl border border-border bg-white p-5 shadow-sm"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-semibold text-brand-900">
                              {item.area}
                            </span>
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                                badge.cls
                              )}
                            >
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed text-brand-600">{item.tip}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Avoid list */}
              {parsed?.avoid && parsed.avoid.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-bold tracking-tight">{a("avoidTitle")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {parsed.avoid.map((item, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-medium text-red-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Next analysis hint */}
              {parsed?.nextAnalysis && (
                <p className="text-center text-sm text-brand-500">
                  {a("nextAnalysisHint", { time: parsed.nextAnalysis })}
                </p>
              )}

              {/* New analysis CTA */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setStep("intro");
                    setResult(null);
                    setParsed(null);
                    setAnswers({
                      skinType: "",
                      concerns: [],
                      routine: [],
                      sleep: 7,
                      stress: "",
                      diet: "",
                      water: "",
                      exercise: "",
                      goals: [],
                      sensitivities: "",
                    });
                  }}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[#108474] px-8 py-3 text-sm font-semibold text-[#108474] transition-all hover:bg-[#108474]/5"
                >
                  <Sparkles className="h-4 w-4" />
                  {a("newAnalysis")}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recommended products */}
      {step === "result" && matchedProducts.length > 0 && (
        <SectionWrapper alt>
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
            {a("recProductsTitle")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matchedProducts.map((p) => (
              <div key={p.id} className="space-y-3">
                <ProductCard product={p} />
                <div className="rounded-xl bg-[#108474]/5 px-4 py-3">
                  <p className="mb-1 text-xs font-semibold text-[#108474]">
                    {a("recProductWhy")}
                  </p>
                  <p className="text-xs leading-relaxed text-brand-700">{p.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      )}
    </>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-brand-900">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all",
              value === opt.value
                ? "border-[#108474] bg-[#108474]/5 text-[#108474]"
                : "border-brand-100 bg-white text-brand-700 hover:border-brand-200"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
