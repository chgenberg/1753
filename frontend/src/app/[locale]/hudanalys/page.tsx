"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Droplets,
  Flame,
  Heart,
  Leaf,
  Loader2,
  Lock,
  Mail,
  Moon,
  ScanFace,
  ShieldAlert,
  Sparkles,
  Sun,
  Target,
  Zap,
} from "lucide-react";
import { AnalysisTabs } from "@/components/analysis/analysis-tabs";
import { apiFetch } from "@/lib/api";
import { useLocale } from "@/providers/locale-provider";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import { SkinScanner, type ScanSummary } from "@/components/skin-scanner/skin-scanner";
import {
  CONDITION_LABELS_EN,
  CONDITION_LABELS_SV,
} from "@/components/skin-scanner/zones";

type Step = "intro" | "scan" | 1 | 2 | 3 | 4 | 5 | "analyzing" | "result";

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
  scoreLabel?: string;
  summary: string;
  skinAnalysis?: {
    overview: string;
    strengths: string[];
    concerns: string[];
    microbiome: string;
    ecs: string;
  };
  products: { id: string; reason: string; usage?: string }[];
  lifestyle: { area: string; tip: string; why?: string; impact: string; source?: string }[];
  routine?: {
    morning: { step: string; why: string }[];
    evening: { step: string; why: string }[];
  };
  avoid: string[];
  nextAnalysis: string;
  /** Legacy fields for backward compat */
  regions?: { label: string; observation: string; score: number }[];
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


const ANALYSIS_STEPS_SV = [
  { pct: 0, label: "Förbereder analys..." },
  { pct: 8, label: "Bearbetar skanningsdata..." },
  { pct: 18, label: "Analyserar hudtyp och tillstånd..." },
  { pct: 30, label: "Utvärderar livsstilsfaktorer..." },
  { pct: 45, label: "Beräknar hudpoäng..." },
  { pct: 58, label: "Matchar produkter mot din hud..." },
  { pct: 70, label: "Skapar personlig rutin..." },
  { pct: 82, label: "Sammanställer livsstilsråd..." },
  { pct: 92, label: "Slutför din analys..." },
  { pct: 100, label: "Klar!" },
];

const ANALYSIS_STEPS_EN = [
  { pct: 0, label: "Preparing analysis..." },
  { pct: 8, label: "Processing scan data..." },
  { pct: 18, label: "Analysing skin type and condition..." },
  { pct: 30, label: "Evaluating lifestyle factors..." },
  { pct: 45, label: "Calculating skin score..." },
  { pct: 58, label: "Matching products to your skin..." },
  { pct: 70, label: "Creating personalised routine..." },
  { pct: 82, label: "Compiling lifestyle recommendations..." },
  { pct: 92, label: "Finalising your analysis..." },
  { pct: 100, label: "Done!" },
];

function AnalyzingProgress({ locale }: { locale: string }) {
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const steps = locale === "en" ? ANALYSIS_STEPS_EN : ANALYSIS_STEPS_SV;

  useEffect(() => {
    const totalDuration = 30000;
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      const t = elapsed / totalDuration;
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const pct = Math.min(Math.round(eased * 98), 98);
      setProgress(pct);

      const idx = steps.reduce((acc, s, i) => (pct >= s.pct ? i : acc), 0);
      setStepIdx(idx);

      if (elapsed >= totalDuration) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [steps]);

  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <div className="text-center animate-fade-in">
      <div className="relative mx-auto h-48 w-48">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle
            cx="80" cy="80" r={r}
            fill="none" stroke="#e6e6e6" strokeWidth="6"
          />
          <circle
            cx="80" cy="80" r={r}
            fill="none" stroke="#108474" strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-200 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tabular-nums text-[#1d1d1f]">
            {progress}%
          </span>
        </div>
      </div>

      <h2 className="mt-4 text-xl font-bold tracking-tight text-[#1d1d1f]">
        {steps[stepIdx].label}
      </h2>

      <div className="mx-auto mt-6 max-w-xs">
        <div className="flex flex-wrap justify-center gap-1.5">
          {steps.slice(0, -1).map((s, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                i <= stepIdx ? "bg-[#108474]" : "bg-[#e6e6e6]"
              )}
            />
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-[#766a62]">
        {locale === "en"
          ? "Our AI is building your personalised analysis"
          : "Vår AI bygger din personliga analys"}
      </p>
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
  const { locale, t } = useLocale();
  const { token } = useAuth();
  const a = (key: string, vars?: Record<string, string | number>) =>
    t(`analysisPage.${key}`, vars);
  const conditionLabels = locale === "en" ? CONDITION_LABELS_EN : CONDITION_LABELS_SV;

  const [step, setStep] = useState<Step>("intro");
  const [userEmail, setUserEmail] = useState("");
  const [emailConsent, setEmailConsent] = useState(false);
  const [emailError, setEmailError] = useState("");
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
  const [scanSummary, setScanSummary] = useState<ScanSummary | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [parsed, setParsed] = useState<AnalysisJSON | null>(null);
  const [error, setError] = useState("");
  const [trainingUploaded, setTrainingUploaded] = useState(false);
  const [trainingCount, setTrainingCount] = useState<number | null>(null);
  const [snapshotSaved, setSnapshotSaved] = useState(false);
  const [snapshotSaving, setSnapshotSaving] = useState(false);
  const [nlSubscribed, setNlSubscribed] = useState(false);

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

  const uploadTrainingData = useCallback(async (
    scan: ScanSummary,
    quiz?: QuizAnswers
  ) => {
    if (!scan.consentGiven || !scan.imageBase64) return;
    try {
      const res = await apiFetch<{ id: number; totalContributions: number }>(
        "/training-data",
        {
          method: "POST",
          body: JSON.stringify({
            imageBase64: scan.imageBase64,
            scanResults: {
              overall: scan.overallTop.map((p) => ({
                condition: p.label,
                probability: p.probability,
              })),
              zones: scan.zones.map((z) => ({
                zone: z.zone.id,
                zoneSv: z.zone.labelSv,
                topCondition: z.topCondition,
                confidence: z.confidence,
              })),
            },
            quizAnswers: quiz || null,
            topCondition: scan.overallTop[0]?.label || null,
            confidence: scan.overallTop[0]?.probability || null,
          }),
        }
      );
      setTrainingUploaded(true);
      setTrainingCount(res.totalContributions);
    } catch {
      // Non-critical — silently ignore
    }
  }, []);

  const saveSnapshot = useCallback(async () => {
    if (!token || !scanSummary?.imageBase64 || snapshotSaving || snapshotSaved) return;
    setSnapshotSaving(true);
    try {
      await apiFetch("/face-snapshots", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          image: scanSummary.imageBase64,
          analysisId: result?.analysisId || null,
        }),
      });
      setSnapshotSaved(true);
    } catch {
      // Non-critical
    } finally {
      setSnapshotSaving(false);
    }
  }, [token, scanSummary, result, snapshotSaving, snapshotSaved]);

  const analyze = useCallback(async () => {
    setStep("analyzing");
    setError("");
    try {
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const scanContext = scanSummary
        ? {
            imageScan: {
              overall: scanSummary.overallTop.map((p) => ({
                condition: p.label,
                conditionSv: conditionLabels[p.label] || p.label,
                confidence: Math.round(p.probability * 100),
              })),
              zones: scanSummary.zones
                .filter((z) => z.confidence >= 0.15)
                .map((z) => ({
                  zone: locale === "en" ? z.zone.labelEn : z.zone.labelSv,
                  condition: z.topCondition,
                  conditionSv: conditionLabels[z.topCondition] || z.topCondition,
                  confidence: Math.round(z.confidence * 100),
                })),
            },
          }
        : {};

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
              ? locale === "en"
                ? `Sensitivities/allergies: ${answers.sensitivities}`
                : `Känsligheter/allergier: ${answers.sensitivities}`
              : undefined,
            locale,
          },
          ...scanContext,
        }),
      });
      setResult(data);
      const json = parseAnalysisJSON(data.content);
      setParsed(json);
      setStep("result");

      if (scanSummary?.consentGiven) {
        uploadTrainingData(scanSummary, answers);
      }

      if (userEmail && !nlSubscribed) {
        const topCondition =
          scanSummary?.overallTop?.[0]?.label || "general";
        apiFetch("/newsletter/subscribe", {
          method: "POST",
          body: JSON.stringify({
            email: userEmail,
            skinCondition: topCondition,
          }),
        }).then(() => setNlSubscribed(true)).catch(() => {});
      }
    } catch {
      setError(a("analysisError"));
      setStep(5);
    }
  }, [answers, a, token, scanSummary, uploadTrainingData, userEmail, nlSubscribed]);

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
                {locale === "en"
                  ? "Take a photo of your face, answer five quick questions about your lifestyle, and receive a complete personalised analysis with recommendations."
                  : "Ta ett foto av ditt ansikte, svara på fem korta frågor om din livsstil och få en komplett personlig analys med rekommendationer."}
              </p>

              <div className="mx-auto mt-8 grid max-w-sm gap-4 text-left">
                <div className="flex items-start gap-4 rounded-2xl border border-[#e6e6e6] bg-white p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#108474]/10 text-sm font-bold text-[#108474]">1</div>
                  <div>
                    <p className="text-sm font-semibold text-[#1d1d1f]">{locale === "en" ? "Face scan" : "Ansiktsskanning"}</p>
                    <p className="mt-0.5 text-xs text-[#515151]">{locale === "en" ? "AI analyses your skin zone by zone" : "AI analyserar din hud zon för zon"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-[#e6e6e6] bg-white p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#108474]/10 text-sm font-bold text-[#108474]">2</div>
                  <div>
                    <p className="text-sm font-semibold text-[#1d1d1f]">{locale === "en" ? "Lifestyle questions" : "Livsstilsfrågor"}</p>
                    <p className="mt-0.5 text-xs text-[#515151]">{locale === "en" ? "Five questions about sleep, diet & stress" : "Fem frågor om sömn, kost och stress"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-[#e6e6e6] bg-white p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#108474]/10 text-sm font-bold text-[#108474]">3</div>
                  <div>
                    <p className="text-sm font-semibold text-[#1d1d1f]">{locale === "en" ? "Personalised analysis" : "Personlig analys"}</p>
                    <p className="mt-0.5 text-xs text-[#515151]">{locale === "en" ? "Complete results with routine, products & lifestyle tips" : "Komplett resultat med rutin, produkter och livsstilsråd"}</p>
                  </div>
                </div>
              </div>

              {/* Email collection */}
              <div className="mx-auto mt-8 max-w-sm">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setEmailError("");
                    if (!userEmail.trim() || !userEmail.includes("@")) {
                      setEmailError(locale === "en" ? "Please enter a valid email address." : "Ange en giltig e-postadress.");
                      return;
                    }
                    if (!emailConsent) {
                      setEmailError(locale === "en" ? "You need to accept the terms to continue." : "Du behöver godkänna villkoren för att fortsätta.");
                      return;
                    }
                    setStep("scan");
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="mb-2 block text-left text-sm font-medium text-[#1d1d1f]">
                      {locale === "en" ? "Your email" : "Din e-postadress"}
                    </label>
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder={locale === "en" ? "name@example.com" : "namn@exempel.se"}
                      className="w-full rounded-xl border border-[#e6e6e6] bg-white px-4 py-3 text-sm shadow-sm placeholder:text-[#766a62]/50 focus:border-[#108474] focus:outline-none focus:ring-2 focus:ring-[#108474]/20"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setEmailConsent((c) => !c)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-300",
                      emailConsent
                        ? "border-[#108474]/30 bg-[#108474]/5"
                        : "border-transparent bg-[#f5f5f7] hover:border-[#e6e6e6]"
                    )}
                  >
                    {emailConsent ? (
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#108474]" />
                    ) : (
                      <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded border-2 border-[#766a62]/30" />
                    )}
                    <span className="text-xs leading-relaxed text-[#515151]">
                      {locale === "en" ? (
                        <>
                          I agree to receive personalised skincare tips by email based on my analysis results.
                          I also agree that my answers may be used <span className="font-semibold text-[#1d1d1f]">anonymously</span> to
                          improve the AI analysis. I can unsubscribe at any time.
                        </>
                      ) : (
                        <>
                          Jag godkänner att få personliga hudvårdstips via e-post baserat på mina analysresultat.
                          Jag godkänner också att mina svar får användas <span className="font-semibold text-[#1d1d1f]">anonymt</span> för
                          att förbättra AI-analysen. Jag kan avregistrera mig när som helst.
                        </>
                      )}
                    </span>
                  </button>

                  {emailError && (
                    <p className="rounded-xl bg-red-50 px-4 py-2 text-xs text-red-700">{emailError}</p>
                  )}

                  <button
                    type="submit"
                    className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#108474] px-10 text-sm font-semibold text-white shadow-lg shadow-[#108474]/20 transition-all hover:bg-[#0d6e62] hover:shadow-xl active:scale-[0.97]"
                  >
                    <ScanFace className="h-5 w-5" />
                    {locale === "en" ? "Start analysis" : "Starta analys"}
                  </button>
                </form>

                <button
                  onClick={() => {
                    if (!userEmail.trim() || !userEmail.includes("@")) {
                      setEmailError(locale === "en" ? "Please enter a valid email address." : "Ange en giltig e-postadress.");
                      return;
                    }
                    if (!emailConsent) {
                      setEmailError(locale === "en" ? "You need to accept the terms to continue." : "Du behöver godkänna villkoren för att fortsätta.");
                      return;
                    }
                    setStep(1);
                  }}
                  className="mt-3 block mx-auto text-xs font-medium text-[#766a62] underline underline-offset-2 transition-colors hover:text-[#108474]"
                >
                  {locale === "en" ? "Skip face scan, answer questions only" : "Hoppa över skanning, svara bara på frågor"}
                </button>
              </div>

              <p className="mx-auto mt-6 max-w-sm text-xs text-[#766a62]">
                {locale === "en"
                  ? "The face scan analyses your skin directly on your device. No image is sent to any server."
                  : "Ansiktsskanningen analyserar din hy direkt i din enhet. Ingen bild skickas till någon server."}
              </p>
            </div>
          )}

          {/* ---- FACE SCAN ---- */}
          {step === "scan" && (
            <div className="animate-fade-in">
              <button
                onClick={() => setStep("intro")}
                className="mb-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-[#515151] transition-colors hover:bg-[#f5f5f7]"
              >
                <ArrowLeft className="h-4 w-4" />
                {locale === "en" ? "Back" : "Tillbaka"}
              </button>

              <div className="mb-4 text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {locale === "en" ? "Step 1 of 3 — Face scan" : "Steg 1 av 3 — Ansiktsskanning"}
                </p>
              </div>

              <SkinScanner
                onComplete={(summary) => {
                  setScanSummary(summary);
                  if (summary.consentGiven) {
                    uploadTrainingData(summary);
                  }
                  setTimeout(() => setStep(1), 1500);
                }}
              />

              {scanSummary && (
                <div className="mt-6 animate-fade-in text-center">
                  <div className="mx-auto flex max-w-xs items-center justify-center gap-2 rounded-full bg-[#108474]/5 px-4 py-2.5 text-xs font-medium text-[#108474]">
                    <Check className="h-3.5 w-3.5" />
                    {locale === "en"
                      ? "Scan complete — continuing to questions..."
                      : "Skanning klar — går vidare till frågor..."}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---- QUIZ STEPS ---- */}
          {typeof step === "number" && (
            <div className="animate-fade-in">
              <ProgressBar current={step} total={TOTAL_STEPS} />

              {scanSummary && step === 1 && (
                <div className="mx-auto mb-5 flex max-w-xs items-center justify-center gap-2 rounded-full bg-[#108474]/5 px-4 py-2 text-xs font-medium text-[#108474]">
                  <ScanFace className="h-3.5 w-3.5" />
                  {locale === "en" ? "Scan data linked to this analysis" : "Skanningsdata kopplad till analysen"}
                </div>
              )}

              <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {scanSummary
                  ? (locale === "en"
                      ? `Step 2 of 3 — Question ${step} of ${TOTAL_STEPS}`
                      : `Steg 2 av 3 — Fråga ${step} av ${TOTAL_STEPS}`)
                  : a("stepOf", { current: step, total: TOTAL_STEPS })}
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
            <AnalyzingProgress locale={locale} />
          )}

          {/* ---- RESULT ---- */}
          {step === "result" && result && (
            <div className="animate-fade-in space-y-10">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">{a("resultTitle")}</h2>
              </div>

              {parsed ? (
                <AnalysisTabs
                  score={parsed.score}
                  scoreLabel={parsed.scoreLabel}
                  summary={parsed.summary}
                  skinAnalysis={parsed.skinAnalysis}
                  products={parsed.products}
                  lifestyle={parsed.lifestyle}
                  routine={parsed.routine}
                  routineLegacy={parsed.routineSuggestion}
                  avoid={parsed.avoid}
                  nextAnalysis={parsed.nextAnalysis}
                  hasScan={!!scanSummary}
                  scanImageSrc={scanSummary?.imageBase64 || undefined}
                  scanZoneResults={scanSummary?.zones || undefined}
                />
              ) : (
                <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
                  <div
                    className="prose prose-sm max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html: stripJSON(result.content)
                        .split(/\n\n+/)
                        .flatMap((p) => p.split(/\n/))
                        .map((p) => p.trim())
                        .filter(Boolean)
                        .map((p) => `<p>${p}</p>`)
                        .join("")
                    }}
                  />
                </div>
              )}

              {/* Training data contribution */}
              {trainingUploaded && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-[#fcb237]/10 px-4 py-3 text-xs font-medium text-[#766a62]">
                  <Heart className="h-3.5 w-3.5 text-[#fcb237]" />
                  {locale === "en"
                    ? "Thank you for helping us improve our AI skin analysis"
                    : "Tack för att du bidrar till att förbättra vår AI-hudanalys"}
                  {trainingCount !== null && (
                    <span className="text-[#766a62]/60">
                      {" "}&mdash; {locale === "en" ? "contribution" : "bidrag"} #{trainingCount}
                    </span>
                  )}
                </div>
              )}

              {/* Save face snapshot opt-in */}
              {token && scanSummary?.imageBase64 && !snapshotSaved && (
                <div className="mx-auto max-w-md rounded-2xl border border-brand-200 bg-white p-5 text-center">
                  <Camera className="mx-auto mb-2 h-5 w-5 text-brand-500" />
                  <p className="text-sm font-semibold text-brand-900">
                    {locale === "en"
                      ? "Save your photo to track changes over time?"
                      : "Spara ditt foto för att följa förändringar över tid?"}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-brand-500">
                    {locale === "en"
                      ? "Your image is encrypted and stored securely. Only you can see it. You can delete it anytime from your account."
                      : "Din bild krypteras och lagras säkert. Bara du kan se den. Du kan radera den när som helst från ditt konto."}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={saveSnapshot}
                      disabled={snapshotSaving}
                      className="inline-flex items-center gap-2 rounded-full bg-[#108474] px-6 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#0d6e62] disabled:opacity-50"
                    >
                      {snapshotSaving ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Lock className="h-3.5 w-3.5" />
                      )}
                      {locale === "en" ? "Save encrypted" : "Spara krypterat"}
                    </button>
                    <button
                      onClick={() => setSnapshotSaved(true)}
                      className="rounded-full px-5 py-2.5 text-xs font-medium text-brand-500 transition-colors hover:bg-brand-50"
                    >
                      {locale === "en" ? "No thanks" : "Nej tack"}
                    </button>
                  </div>
                </div>
              )}

              {snapshotSaved && token && scanSummary?.imageBase64 && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-[#108474]/5 px-4 py-3 text-xs font-medium text-[#108474]">
                  <Check className="h-3.5 w-3.5" />
                  {locale === "en"
                    ? "Photo saved to your skin journey"
                    : "Foto sparat i din hudresa"}
                </div>
              )}

              {/* Newsletter confirmation */}
              {nlSubscribed && userEmail && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-[#108474]/5 px-4 py-3 text-xs font-medium text-[#108474]">
                  <Mail className="h-3.5 w-3.5" />
                  {locale === "en"
                    ? `Weekly skincare tips will be sent to ${userEmail}`
                    : `Veckovisa hudvårdstips skickas till ${userEmail}`}
                </div>
              )}

              {/* New analysis CTA */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setStep("intro");
                    setResult(null);
                    setParsed(null);
                    setScanSummary(null);
                    setTrainingUploaded(false);
                    setTrainingCount(null);
                    setSnapshotSaved(false);
                    setSnapshotSaving(false);
                    setNlSubscribed(false);
                    setUserEmail("");
                    setEmailConsent(false);
                    setEmailError("");
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

              {/* Medical disclaimer */}
              <p className="mx-auto max-w-md text-center text-[11px] leading-relaxed text-[#766a62]/80">
                {locale === "en"
                  ? "This analysis is generated with the help of artificial intelligence and does not constitute medical advice, diagnosis or treatment recommendations. If you have ongoing skin concerns, always contact a licensed dermatologist or doctor."
                  : "Denna analys är framtagen med hjälp av artificiell intelligens och utgör inte medicinsk rådgivning, diagnos eller behandlingsrekommendation. Vid hudbesvär, kontakta alltid en legitimerad dermatolog eller läkare."}
              </p>
            </div>
          )}
        </div>
      </section>
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
