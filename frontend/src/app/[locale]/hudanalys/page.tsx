"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Droplets,
  Flame,
  Heart,
  Leaf,
  Loader2,
  Mail,
  Moon,
  ScanFace,
  Share2,
  Shield,
  ShieldAlert,
  Sparkles,
  X,
  Sun,
  Target,
  User,
  Zap,
} from "lucide-react";
import { AnalysisTabs } from "@/components/analysis/analysis-tabs";
import { apiFetch } from "@/lib/api";
import { useLocale } from "@/providers/locale-provider";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import { SkinScanner, type ScanSummary } from "@/components/skin-scanner/skin-scanner";
import {
  conditionLabel,
} from "@/components/skin-scanner/zones";

type Step = "intro" | "email" | "demographics" | "scan" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | "analyzing" | "result";

interface QuizAnswers {
  age: number;
  gender: string;
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
  sunProtection: string;
  hormonal: string;
}

interface FaceZoneGPT {
  zone: string;
  label: string;
  x: number;
  y: number;
  condition: string;
  confidence: "low" | "medium" | "high";
}

interface MetricScore {
  score: number;
  grade: number;
  detail: string;
}

interface SkinMetrics {
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

interface AnalysisJSON {
  score: number;
  scoreLabel?: string;
  summary: string;
  skinAge?: number;
  fitzpatrick?: string;
  metrics?: SkinMetrics;
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
  faceZones?: FaceZoneGPT[];
  primaryCondition?: {
    condition: string;
    confidence: "low" | "medium" | "high";
    reasoning?: string;
  };
  /** Legacy fields for backward compat */
  regions?: { label: string; observation: string; score: number }[];
  routineSuggestion?: { morning: string[]; evening: string[] };
}

interface AnalysisResponse {
  content: string;
  responseId: string | null;
  analysisId?: number;
}

const TOTAL_STEPS = 7;

function tx(locale: string, sv: string, en: string, es?: string, de?: string, fr?: string): string {
  if (locale === "sv") return sv;
  if (locale === "es") return es || en;
  if (locale === "de") return de || en;
  if (locale === "fr") return fr || en;
  return en;
}

const CONCERN_ICONS: Record<string, typeof Flame> = {
  none: Leaf,
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
        "group relative flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 px-4 py-4 text-center transition-all duration-300",
        subtitle ? "h-[140px]" : "h-[100px]",
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
          "text-sm font-semibold leading-snug transition-colors",
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
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => {
        const active = selected.includes(opt.key);
        const Icon = opt.icon;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onToggle(opt.key)}
            className={cn(
              "inline-flex h-[60px] items-center justify-center gap-2 rounded-full border-2 px-5 text-center text-sm font-medium leading-tight transition-all duration-300",
              active
                ? "border-[#108474] bg-[#108474]/5 text-[#108474]"
                : "border-brand-100 bg-white text-brand-700 hover:border-brand-200"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {opt.label}
            <Check className={cn("h-3.5 w-3.5 transition-opacity duration-200", active ? "opacity-100" : "opacity-0")} />
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

const ANALYSIS_STEPS_ES = [
  { pct: 0, label: "Preparando análisis..." },
  { pct: 8, label: "Procesando datos del escaneo..." },
  { pct: 18, label: "Analizando tipo y estado de piel..." },
  { pct: 30, label: "Evaluando factores de estilo de vida..." },
  { pct: 45, label: "Calculando puntuación de piel..." },
  { pct: 58, label: "Seleccionando productos para tu piel..." },
  { pct: 70, label: "Creando rutina personalizada..." },
  { pct: 82, label: "Compilando recomendaciones..." },
  { pct: 92, label: "Finalizando tu análisis..." },
  { pct: 100, label: "¡Listo!" },
];

const ANALYSIS_STEPS_DE = [
  { pct: 0, label: "Analyse wird vorbereitet..." },
  { pct: 8, label: "Scandaten werden verarbeitet..." },
  { pct: 18, label: "Hauttyp und Zustand werden analysiert..." },
  { pct: 30, label: "Lebensstilfaktoren werden bewertet..." },
  { pct: 45, label: "Hautscore wird berechnet..." },
  { pct: 58, label: "Produkte werden abgeglichen..." },
  { pct: 70, label: "Persönliche Routine wird erstellt..." },
  { pct: 82, label: "Lifestyle-Empfehlungen werden zusammengestellt..." },
  { pct: 92, label: "Analyse wird abgeschlossen..." },
  { pct: 100, label: "Fertig!" },
];

const ANALYSIS_STEPS_FR = [
  { pct: 0, label: "Préparation de l'analyse..." },
  { pct: 8, label: "Traitement des données du scan..." },
  { pct: 18, label: "Analyse du type et de l'état de la peau..." },
  { pct: 30, label: "Évaluation des facteurs de mode de vie..." },
  { pct: 45, label: "Calcul du score cutané..." },
  { pct: 58, label: "Sélection des produits pour votre peau..." },
  { pct: 70, label: "Création d'une routine personnalisée..." },
  { pct: 82, label: "Compilation des recommandations..." },
  { pct: 92, label: "Finalisation de votre analyse..." },
  { pct: 100, label: "Terminé !" },
];

const ANALYSIS_STEPS_MAP: Record<string, typeof ANALYSIS_STEPS_SV> = {
  sv: ANALYSIS_STEPS_SV,
  en: ANALYSIS_STEPS_EN,
  es: ANALYSIS_STEPS_ES,
  de: ANALYSIS_STEPS_DE,
  fr: ANALYSIS_STEPS_FR,
};

function AnalyzingProgress({ locale }: { locale: string }) {
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const steps = ANALYSIS_STEPS_MAP[locale] || ANALYSIS_STEPS_EN;

  useEffect(() => {
    const totalDuration = 120000;
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      const t = elapsed / totalDuration;

      let pct: number;
      if (t < 0.008) {
        // Jump to 1% in the first ~1 second
        pct = Math.round((t / 0.008) * 1);
      } else {
        const t2 = (t - 0.008) / (1 - 0.008);
        const eased = t2 < 0.5
          ? 4 * t2 * t2 * t2
          : 1 - Math.pow(-2 * t2 + 2, 3) / 2;
        pct = Math.round(1 + eased * 97);
      }
      pct = Math.min(pct, 98);
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
        {tx(locale, "Vår AI bygger din personliga analys", "Our AI is building your personalised analysis", "Nuestra IA está creando tu análisis personalizado", "Unsere KI erstellt deine persönliche Analyse", "Notre IA prépare votre analyse personnalisée")}
      </p>
    </div>
  );
}

const GRADE_MAP: Record<string, number> = { excellent: 1, good: 2, fair: 3, poor: 4, "very poor": 5 };

function parseAnalysisJSON(content: string): AnalysisJSON | null {
  const match = content.match(/```json\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    const raw = JSON.parse(match[1]);
    if (raw.metrics) {
      for (const key of Object.keys(raw.metrics)) {
        const m = raw.metrics[key];
        if (m && typeof m.grade === "string") {
          m.grade = GRADE_MAP[m.grade.toLowerCase()] ?? 3;
        }
      }
    }
    if (raw.skinAnalysis) {
      raw.skinAnalysis.strengths = raw.skinAnalysis.strengths ?? [];
      raw.skinAnalysis.concerns = raw.skinAnalysis.concerns ?? [];
    }
    raw.lifestyle = raw.lifestyle ?? [];
    raw.avoid = raw.avoid ?? [];
    raw.products = raw.products ?? [];
    return raw;
  } catch {
    return null;
  }
}

function stripJSON(content: string): string {
  return content.replace(/```json[\s\S]*?```/, "").trim();
}

export default function AnalysisPage() {
  const { locale, t, path } = useLocale();
  const { token, user } = useAuth();
  const a = (key: string, vars?: Record<string, string | number>) =>
    t(`analysisPage.${key}`, vars);
  const condLabel = (key: string) => conditionLabel(key, locale);

  const [step, setStep] = useState<Step>("intro");
  const [userEmail, setUserEmail] = useState("");
  const [emailConsent, setEmailConsent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [answers, setAnswers] = useState<QuizAnswers>({
    age: 0,
    gender: "",
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
    sunProtection: "",
    hormonal: "",
  });
  const [termsOpen, setTermsOpen] = useState(false);
  const [scanSummary, setScanSummary] = useState<ScanSummary | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [parsed, setParsed] = useState<AnalysisJSON | null>(null);
  const [error, setError] = useState("");
  const [trainingUploaded, setTrainingUploaded] = useState(false);
  const [trainingCount, setTrainingCount] = useState<number | null>(null);
  const [snapshotSaved, setSnapshotSaved] = useState(false);
  const [snapshotSaving, setSnapshotSaving] = useState(false);
  const [nlSubscribed, setNlSubscribed] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const analyzingRef = useRef(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("1753_analysis_result");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.result && data.parsed) {
          setResult(data.result);
          setParsed(data.parsed);
          if (data.answers) setAnswers(data.answers);
          if (data.scanSummary) setScanSummary(data.scanSummary);
          setStep("result");
          return;
        }
      }
      const progress = sessionStorage.getItem("1753_analysis_progress");
      if (progress) {
        const p = JSON.parse(progress);
        if (p.answers) setAnswers(p.answers);
        if (p.email) { setUserEmail(p.email); setEmailConsent(true); }
        if (p.scanSummary) setScanSummary(p.scanSummary);
        if (p.step === "analyzing") {
          setStep(TOTAL_STEPS);
        } else if (p.step === "scan" && p.scanSummary) {
          setStep(1);
        } else if (p.step) {
          setStep(p.step);
        }
      }
    } catch { /* ignore corrupt data */ }
  }, []);

  useEffect(() => {
    if (step === "intro" || step === "result") return;
    try {
      const scanMeta = scanSummary ? {
        overallTop: scanSummary.overallTop,
        zones: scanSummary.zones,
        consentGiven: scanSummary.consentGiven,
        overallSeverity: scanSummary.overallSeverity,
        skinMetrics: scanSummary.skinMetrics,
        imageBase64: scanSummary.imageBase64,
        zoneAnchors: scanSummary.zoneAnchors,
      } : undefined;
      sessionStorage.setItem("1753_analysis_progress", JSON.stringify({
        step,
        answers,
        email: userEmail || undefined,
        scanSummary: scanMeta,
      }));
    } catch { /* storage full or unavailable */ }
  }, [step, answers, userEmail, scanSummary]);

  useEffect(() => {
    if (!user) return;
    setUserEmail(user.email);
    setEmailConsent(true);
    setIsReturningUser(true);

    apiFetch<{ subscribed: boolean }>(`/newsletter/status?email=${encodeURIComponent(user.email)}`)
      .then((res) => {
        if (res.subscribed) setNlSubscribed(true);
      })
      .catch(() => {});
  }, [user]);

  const toggleArray = (arr: string[], key: string, max?: number) => {
    if (arr.includes(key)) return arr.filter((k) => k !== key);
    if (max && arr.length >= max) return arr;
    return [...arr, key];
  };

  const canProceed = useCallback((): boolean => {
    switch (step) {
      case "email":
        return !!userEmail.trim() && userEmail.includes("@") && emailConsent;
      case "demographics":
        return answers.age >= 13 && answers.age <= 120 && !!answers.gender;
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
      case 6:
        return !!answers.sunProtection;
      case 7:
        return !!answers.hormonal;
      default:
        return true;
    }
  }, [step, answers, userEmail, emailConsent]);

  const trainingUploadedRef = useRef(false);
  const uploadTrainingData = useCallback(async (
    scan: ScanSummary,
    quiz?: QuizAnswers
  ) => {
    if (trainingUploadedRef.current) return;
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
      trainingUploadedRef.current = true;
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

  useEffect(() => {
    if (step === "result" && token && scanSummary?.imageBase64 && !snapshotSaved && !snapshotSaving) {
      saveSnapshot();
    }
  }, [step, token, scanSummary, snapshotSaved, snapshotSaving, saveSnapshot]);

  const analyze = useCallback(async () => {
    if (analyzingRef.current) return;
    analyzingRef.current = true;
    setStep("analyzing");
    setError("");
    scrollTop();
    try {
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const scanContext = scanSummary
        ? {
            imageScan: {
              overall: scanSummary.overallTop.map((p) => ({
                condition: p.label,
                conditionSv: condLabel(p.label),
                confidence: Math.round(p.probability * 100),
              })),
              overallSeverity: scanSummary.overallSeverity
                ? { level: scanSummary.overallSeverity.level, confidence: Math.round(scanSummary.overallSeverity.confidence * 100) }
                : undefined,
              zones: scanSummary.zones
                .filter((z) => z.confidence >= 0.50)
                .map((z) => ({
                  zone: locale === "sv" ? z.zone.labelSv : z.zone.labelEn,
                  condition: z.topCondition,
                  conditionSv: condLabel(z.topCondition),
                  confidence: Math.round(z.confidence * 100),
                  severity: z.severity ? z.severity.level : undefined,
                })),
              skinMetrics: scanSummary.skinMetrics || undefined,
            },
          }
        : {};

      const faceImage = scanSummary?.imageBase64 || null;

      const requestBody = JSON.stringify({
        questions: {
          age: answers.age,
          gender: answers.gender,
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
            ? tx(locale, `Känsligheter/allergier: ${answers.sensitivities}`, `Sensitivities/allergies: ${answers.sensitivities}`, `Sensibilidades/alergias: ${answers.sensitivities}`, `Empfindlichkeiten/Allergien: ${answers.sensitivities}`, `Sensibilités/allergies : ${answers.sensitivities}`)
            : undefined,
          sunProtection: answers.sunProtection,
          hormonal: answers.hormonal,
          email: userEmail,
          locale,
        },
        ...scanContext,
        ...(faceImage ? { fullImage: faceImage } : {}),
        ...(scanSummary?.zoneCrops?.length
          ? {
              regions: scanSummary.zoneCrops
                .filter((zc) => zc.dataUrl)
                .map((zc) => ({
                  label: zc.labelEn || zc.id,
                  imageBase64: zc.dataUrl,
                })),
            }
          : {}),
      });

      let data: AnalysisResponse;
      try {
        data = await apiFetch<AnalysisResponse>("/analysis", { method: "POST", headers, body: requestBody });
      } catch (firstErr) {
        await new Promise((r) => setTimeout(r, 1000));
        data = await apiFetch<AnalysisResponse>("/analysis", { method: "POST", headers, body: requestBody });
      }
      setResult(data);
      const json = parseAnalysisJSON(data.content);
      setParsed(json);
      setStep("result");

      try {
        sessionStorage.setItem("1753_analysis_result", JSON.stringify({
          result: data,
          parsed: json,
          answers,
          scanSummary: scanSummary ? { overallTop: scanSummary.overallTop, zones: scanSummary.zones, consentGiven: scanSummary.consentGiven, imageBase64: scanSummary.imageBase64, zoneAnchors: scanSummary.zoneAnchors } : null,
        }));
        sessionStorage.removeItem("1753_analysis_progress");
      } catch { /* quota exceeded */ }

      if (scanSummary?.consentGiven) {
        uploadTrainingData(scanSummary, answers);
      }

      if (userEmail && !nlSubscribed) {
        const pc = json?.primaryCondition;
        const gptCondition = pc?.condition && pc.condition !== "normal" && pc.confidence !== "low"
          ? pc.condition
          : "general";
        apiFetch("/newsletter/subscribe", {
          method: "POST",
          body: JSON.stringify({
            email: userEmail,
            skinCondition: gptCondition,
            source: "analysis",
            locale,
          }),
        }).then(() => setNlSubscribed(true)).catch(() => {});
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[HudAnalys] Analysis submission failed:", msg);
      const isRateLimit = msg.includes("dagar") || msg.includes("days") || msg.includes("días") || msg.includes("Tagen") || msg.includes("jours");
      const isServerMessage = msg && msg !== "undefined" && !msg.startsWith("API error:");
      setError(isRateLimit || isServerMessage ? msg : a("analysisError"));
      setStep(TOTAL_STEPS);
    } finally {
      analyzingRef.current = false;
    }
  }, [answers, a, locale, token, scanSummary, uploadTrainingData, userEmail, nlSubscribed]);

  useEffect(() => {
    if (!termsOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setTermsOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
      document.removeEventListener("keydown", onKey);
    };
  }, [termsOpen]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  };

  const goNext = () => {
    if (step === "email") {
      if (!userEmail.trim() || !userEmail.includes("@")) {
        setEmailError(tx(locale, "Ange en giltig e-postadress.", "Please enter a valid email address.", "Introduce una dirección de email válida.", "Bitte gib eine gültige E-Mail-Adresse ein.", "Veuillez entrer une adresse e-mail valide."));
        return;
      }
      if (!emailConsent) {
        setEmailError(tx(locale, "Du behöver godkänna villkoren för att fortsätta.", "You need to accept the terms to continue.", "Debes aceptar los términos para continuar.", "Du musst die Bedingungen akzeptieren, um fortzufahren.", "Vous devez accepter les conditions pour continuer."));
        return;
      }
      setEmailError("");
      setStep("demographics");
    } else if (step === "demographics") {
      setStep("scan");
    } else if (typeof step === "number" && step < TOTAL_STEPS) {
      setStep((step + 1) as Step);
    } else if (typeof step === "number" && step === TOTAL_STEPS) {
      analyze();
      return;
    }
    scrollTop();
  };
  const goPrev = () => {
    if (typeof step === "number" && step > 1) setStep((step - 1) as Step);
    else if (step === 1) setStep(scanSummary ? "scan" : "demographics");
    else if (step === "demographics") setStep(isReturningUser ? "intro" : "email");
    else if (step === "email") setStep("intro");
    scrollTop();
  };

  const skinTypes = [
    { key: "dry", label: a("skinDry"), sub: a("skinDrySub"), icon: Droplets },
    { key: "normal", label: a("skinNormal"), sub: a("skinNormalSub"), icon: Leaf },
    { key: "combo", label: a("skinCombo"), sub: a("skinComboSub"), icon: Zap },
    { key: "oily", label: a("skinOily"), sub: a("skinOilySub"), icon: Flame },
    { key: "sensitive", label: a("skinSensitive"), sub: a("skinSensitiveSub"), icon: ShieldAlert },
  ];

  const concerns = [
    { key: "none", label: a("concernNone"), icon: CONCERN_ICONS.none },
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
                {tx(locale,
                  "Skanna ditt ansikte med MediaPipe-precision i 12 zoner, svara på sju korta frågor och få 15 vetenskapliga hudmetriker, estimerad hudålder, radardiagram och personliga rekommendationer.",
                  "Scan your face with MediaPipe precision across 12 zones, answer seven quick questions, and receive 15 scientific skin metrics, estimated skin age, a radar chart and personalised recommendations.",
                  "Escanea tu rostro con precisión MediaPipe en 12 zonas, responde siete preguntas rápidas y recibe 15 métricas científicas de la piel, edad estimada, gráfico radar y recomendaciones personalizadas.",
                  "Scanne dein Gesicht mit MediaPipe-Präzision in 12 Zonen, beantworte sieben kurze Fragen und erhalte 15 wissenschaftliche Hautmetriken, geschätztes Hautalter, Radardiagramm und personalisierte Empfehlungen.",
                  "Scannez votre visage avec la précision MediaPipe sur 12 zones, répondez à sept questions rapides et recevez 15 métriques cutanées scientifiques, un âge estimé de la peau, un graphique radar et des recommandations personnalisées.")}
              </p>

              <div className="mx-auto mt-8 grid max-w-sm gap-4 text-left">
                <div className="flex items-start gap-4 rounded-2xl border border-[#e6e6e6] bg-white p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#108474]/10 text-sm font-bold text-[#108474]">1</div>
                  <div>
                    <p className="text-sm font-semibold text-[#1d1d1f]">{tx(locale, "Ansiktsskanning – 12 zoner", "Face scan – 12 zones", "Escaneo facial – 12 zonas", "Gesichtsscan – 12 Zonen", "Scan du visage – 12 zones")}</p>
                    <p className="mt-0.5 text-xs text-[#515151]">{tx(locale, "MediaPipe kartlägger 478 punkter och analyserar varje zon", "MediaPipe maps 478 points and analyses each zone", "MediaPipe mapea 478 puntos y analiza cada zona", "MediaPipe erfasst 478 Punkte und analysiert jede Zone", "MediaPipe cartographie 478 points et analyse chaque zone")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-[#e6e6e6] bg-white p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#108474]/10 text-sm font-bold text-[#108474]">2</div>
                  <div>
                    <p className="text-sm font-semibold text-[#1d1d1f]">{tx(locale, "Livsstilsfrågor", "Lifestyle questions", "Preguntas de estilo de vida", "Lebensstilfragen", "Questions sur le mode de vie")}</p>
                    <p className="mt-0.5 text-xs text-[#515151]">{tx(locale, "Sju frågor om hud, livsstil och mål", "Seven questions about skin, lifestyle & goals", "Siete preguntas sobre piel, estilo de vida y objetivos", "Sieben Fragen zu Haut, Lebensstil und Zielen", "Sept questions sur la peau, le mode de vie et les objectifs")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-[#e6e6e6] bg-white p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#108474]/10 text-sm font-bold text-[#108474]">3</div>
                  <div>
                    <p className="text-sm font-semibold text-[#1d1d1f]">{tx(locale, "15 metriker + hudålder + radardiagram", "15 metrics + skin age + radar chart", "15 métricas + edad de la piel + gráfico radar", "15 Metriken + Hautalter + Radardiagramm", "15 métriques + âge de la peau + graphique radar")}</p>
                    <p className="mt-0.5 text-xs text-[#515151]">{tx(locale, "Plus rutin, produkter och livsstilsråd", "Plus routine, products & lifestyle tips", "Más rutina, productos y consejos", "Plus Routine, Produkte und Lifestyle-Tipps", "Plus routine, produits et conseils de mode de vie")}</p>
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-8 max-w-sm space-y-4">
                {isReturningUser && (
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-[#108474]/5 px-4 py-3 text-xs font-medium text-[#108474]">
                    <Check className="h-3.5 w-3.5" />
                    {tx(locale, `Inloggad som ${user?.name || userEmail}`, `Logged in as ${user?.name || userEmail}`, `Conectado como ${user?.name || userEmail}`, `Angemeldet als ${user?.name || userEmail}`, `Connecté en tant que ${user?.name || userEmail}`)}
                  </div>
                )}

                <button
                  onClick={() => { setStep(isReturningUser ? "demographics" : "email"); scrollTop(); }}
                  className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#108474] px-10 text-sm font-semibold text-white shadow-lg shadow-[#108474]/20 transition-all hover:bg-[#0d6e62] hover:shadow-xl active:scale-[0.97]"
                >
                  <ScanFace className="h-5 w-5" />
                  {tx(locale, "Starta analys", "Start analysis", "Iniciar análisis", "Analyse starten", "Démarrer l'analyse")}
                </button>
              </div>

              <p className="mx-auto mt-6 max-w-sm text-xs text-[#766a62]">
                {tx(locale,
                  "Ansiktsskanningen analyserar din hy direkt i din enhet. Din bild delas sedan krypterat med vår AI för en djupare analys.",
                  "The face scan analyses your skin directly on your device. Your image is then shared encrypted with our AI for a deeper analysis.",
                  "El escaneo facial analiza tu piel directamente en tu dispositivo. Tu imagen se comparte cifrada con nuestra IA para un análisis más profundo.",
                  "Der Gesichtsscan analysiert deine Haut direkt auf deinem Gerät. Dein Bild wird dann verschlüsselt an unsere KI für eine tiefere Analyse weitergegeben.",
                  "Le scan du visage analyse votre peau directement sur votre appareil. Votre image est ensuite partagée de manière chiffrée avec notre IA pour une analyse approfondie.")}
              </p>
            </div>
          )}

          {/* ---- EMAIL STEP ---- */}
          {step === "email" && (
            <div className="animate-fade-in">
              <button
                onClick={() => { setStep("intro"); scrollTop(); }}
                className="mb-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-[#515151] transition-colors hover:bg-[#f5f5f7]"
              >
                <ArrowLeft className="h-4 w-4" />
                {tx(locale, "Tillbaka", "Back", "Atrás", "Zurück", "Retour")}
              </button>

              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight">
                  {tx(locale, "Din e-postadress", "Your email", "Tu email", "Deine E-Mail", "Votre e-mail")}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tx(locale, "Vi skickar dina resultat och personliga tips hit.", "We'll send your results and personalised tips here.", "Enviaremos tus resultados y consejos personalizados aquí.", "Wir senden deine Ergebnisse und persönliche Tipps hierhin.", "Nous enverrons vos résultats et conseils personnalisés ici.")}
                </p>
              </div>

              <div className="mx-auto mt-8 max-w-sm space-y-4">
                <div>
                  <label className="mb-2 block text-left text-sm font-medium text-[#1d1d1f]">
                    {tx(locale, "E-postadress", "Email address", "Dirección de email", "E-Mail-Adresse", "Adresse e-mail")}
                  </label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => { setUserEmail(e.target.value); setEmailError(""); }}
                    placeholder={tx(locale, "namn@exempel.se", "name@example.com", "nombre@ejemplo.com", "name@beispiel.de", "nom@exemple.fr")}
                    className="w-full rounded-xl border border-[#e6e6e6] bg-white px-4 py-3 text-base shadow-sm placeholder:text-[#766a62]/50 focus:border-[#108474] focus:outline-none focus:ring-2 focus:ring-[#108474]/20 md:text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => { setEmailConsent((c) => !c); setEmailError(""); }}
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
                    {tx(locale,
                      "Jag godkänner villkoren för konto, e-post och anonym dataanvändning.",
                      "I accept the terms for account, email and anonymous data usage.",
                      "Acepto los términos de cuenta, email y uso anónimo de datos.",
                      "Ich akzeptiere die Bedingungen für Konto, E-Mail und anonyme Datennutzung.",
                      "J'accepte les conditions de compte, e-mail et utilisation anonyme des données."
                    )}{" "}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); setTermsOpen(true); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); setTermsOpen(true); } }}
                      className="font-semibold text-[#108474] underline underline-offset-2"
                    >
                      {tx(locale, "Läs villkoren", "Read terms", "Leer términos", "Bedingungen lesen", "Lire les conditions")}
                    </span>
                  </span>
                </button>

                {termsOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setTermsOpen(false)}>
                    <div
                      role="dialog"
                      aria-modal="true"
                      className="relative mx-4 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setTermsOpen(false)}
                        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-[#766a62] transition-colors hover:bg-[#f5f5f7]"
                      >
                        <X className="h-5 w-5" />
                      </button>

                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#108474]/10">
                          <Shield className="h-5 w-5 text-[#108474]" />
                        </div>
                        <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f]">
                          {tx(locale, "Villkor och datahantering", "Terms and data handling", "Términos y manejo de datos", "Bedingungen und Datenverarbeitung", "Conditions et traitement des données")}
                        </h3>
                      </div>

                      <div className="space-y-4 text-[13px] leading-relaxed text-[#515151]">
                        <p>{tx(locale,
                          "Ett konto skapas med din e-postadress så att dina analysresultat sparas. Du kan logga in för att se din hudresa, jämföra resultat och göra nya analyser (varannan vecka).",
                          "An account is created with your email so your analysis results are saved. You can log in to view your skin journey, compare results, and run new analyses (every two weeks).",
                          "Se crea una cuenta con tu email para guardar tus resultados. Puedes iniciar sesión para ver tu viaje de piel, comparar resultados y hacer nuevos análisis (cada dos semanas).",
                          "Mit deiner E-Mail wird ein Konto erstellt, damit deine Analyseergebnisse gespeichert werden. Du kannst dich einloggen, um deine Hautreise zu sehen und neue Analysen durchzuführen (alle zwei Wochen).",
                          "Un compte est créé avec votre email pour sauvegarder vos résultats. Vous pouvez vous connecter pour voir votre parcours peau et faire de nouvelles analyses (toutes les deux semaines)."
                        )}</p>

                        <p>{tx(locale,
                          "Din ansiktsbild analyseras först lokalt på din enhet — bilden lämnar aldrig din telefon i detta steg. Därefter skickas den krypterat (TLS 1.3) till vår AI för fördjupad analys.",
                          "Your face image is first analysed locally on your device — the image never leaves your phone in this step. It is then sent encrypted (TLS 1.3) to our AI for deeper analysis.",
                          "Tu imagen facial se analiza primero localmente en tu dispositivo. Luego se envía cifrada (TLS 1.3) a nuestra IA para un análisis más profundo.",
                          "Dein Gesichtsbild wird zunächst lokal auf deinem Gerät analysiert. Anschließend wird es verschlüsselt (TLS 1.3) an unsere KI gesendet.",
                          "Votre image faciale est d'abord analysée localement sur votre appareil. Elle est ensuite envoyée chiffrée (TLS 1.3) à notre IA."
                        )}</p>

                        <p>{tx(locale,
                          "Om du godkänner kan din bild användas anonymt för att förbättra vår AI-modell. Bilderna lagras krypterade (AES-256) i EU och kopplas aldrig till ditt konto. Ingen bild delas med tredje part.",
                          "If you consent, your image may be used anonymously to improve our AI model. Images are stored encrypted (AES-256) in the EU and never linked to your account. No image is shared with third parties.",
                          "Si das tu consentimiento, tu imagen puede usarse anónimamente para mejorar nuestro modelo de IA. Las imágenes se almacenan cifradas (AES-256) en la UE.",
                          "Wenn du zustimmst, kann dein Bild anonym zur Verbesserung unserer KI verwendet werden. Bilder werden verschlüsselt (AES-256) in der EU gespeichert.",
                          "Si vous consentez, votre image peut être utilisée anonymement pour améliorer notre modèle IA. Les images sont chiffrées (AES-256) dans l'UE."
                        )}</p>

                        <p>{tx(locale,
                          "Du kan få personliga hudvårdstips via e-post. Du kan avregistrera dig och radera ditt konto när som helst. All data hanteras enligt GDPR.",
                          "You may receive personalised skincare tips by email. You can unsubscribe and delete your account anytime. All data is handled per GDPR.",
                          "Puedes recibir consejos personalizados por email. Puedes cancelar y eliminar tu cuenta en cualquier momento. Datos según RGPD.",
                          "Du kannst personalisierte Tipps per E-Mail erhalten. Du kannst dich jederzeit abmelden und dein Konto löschen. DSGVO-konform.",
                          "Vous pouvez recevoir des conseils par email. Vous pouvez vous désinscrire et supprimer votre compte à tout moment. Conforme au RGPD."
                        )}</p>

                        <div className="rounded-xl bg-[#f5f5f7] px-4 py-3">
                          <p className="text-[11px] text-[#766a62]">
                            {tx(locale,
                              "Kontakta info@1753skin.com för frågor eller radering av data.",
                              "Contact info@1753skin.com for questions or data deletion.",
                              "Contacta info@1753skin.com para preguntas o eliminación de datos.",
                              "Kontaktiere info@1753skin.com für Fragen oder Datenlöschung.",
                              "Contactez info@1753skin.com pour toute question ou suppression de données."
                            )}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setTermsOpen(false)}
                        className="mt-6 w-full rounded-full bg-[#108474] py-3 text-sm font-semibold text-white transition-all hover:bg-[#0d6e62]"
                      >
                        {tx(locale, "Jag förstår", "Got it", "Entendido", "Verstanden", "Compris")}
                      </button>
                    </div>
                  </div>
                )}

                {emailError && (
                  <p className="rounded-xl bg-red-50 px-4 py-2 text-xs text-red-700">{emailError}</p>
                )}

                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#108474] px-10 text-sm font-semibold text-white shadow-lg shadow-[#108474]/20 transition-all hover:bg-[#0d6e62] hover:shadow-xl active:scale-[0.97] disabled:opacity-40 disabled:shadow-none"
                >
                  {tx(locale, "Fortsätt", "Continue", "Continuar", "Weiter", "Continuer")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---- DEMOGRAPHICS STEP ---- */}
          {step === "demographics" && (
            <div className="animate-fade-in">
              <button
                onClick={goPrev}
                className="mb-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-[#515151] transition-colors hover:bg-[#f5f5f7]"
              >
                <ArrowLeft className="h-4 w-4" />
                {tx(locale, "Tillbaka", "Back", "Atrás", "Zurück", "Retour")}
              </button>

              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight">
                  {tx(locale, "Berätta lite om dig", "Tell us about yourself", "Cuéntanos sobre ti", "Erzähl uns von dir", "Parlez-nous de vous")}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tx(locale, "Ålder och kön hjälper oss att ge bättre rekommendationer.", "Age and gender help us give better recommendations.", "La edad y el género nos ayudan a dar mejores recomendaciones.", "Alter und Geschlecht helfen uns, bessere Empfehlungen zu geben.", "L'âge et le genre nous aident à donner de meilleures recommandations.")}
                </p>
              </div>

              <div className="mx-auto mt-8 max-w-sm space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-brand-900">
                    {tx(locale, "Ålder", "Age", "Edad", "Alter", "Âge")}
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={13}
                    max={120}
                    value={answers.age > 0 ? answers.age : ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setAnswers((p) => ({ ...p, age: v === "" ? 0 : Math.min(120, Math.max(0, parseInt(v, 10) || 0)) }));
                    }}
                    placeholder={tx(locale, "Ange din ålder", "Enter your age", "Introduce tu edad", "Gib dein Alter ein", "Entrez votre âge")}
                    className="w-full rounded-xl border border-[#e6e6e6] bg-white px-4 py-3 text-base shadow-sm placeholder:text-[#766a62]/50 focus:border-[#108474] focus:outline-none focus:ring-2 focus:ring-[#108474]/20 md:text-sm"
                  />
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-brand-900">
                    {tx(locale, "Kön", "Gender", "Género", "Geschlecht", "Genre")}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "female", label: tx(locale, "Kvinna", "Woman", "Mujer", "Frau", "Femme") },
                      { key: "male", label: tx(locale, "Man", "Man", "Hombre", "Mann", "Homme") },
                      { key: "other", label: tx(locale, "Annat", "Other", "Otro", "Andere", "Autre") },
                      { key: "prefer-not", label: tx(locale, "Vill ej ange", "Prefer not to say", "Prefiero no decir", "Möchte ich nicht angeben", "Je préfère ne pas dire") },
                    ].map((g) => (
                      <OptionCard
                        key={g.key}
                        selected={answers.gender === g.key}
                        onClick={() => setAnswers((p) => ({ ...p, gender: g.key }))}
                        title={g.label}
                        icon={User}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#108474] px-10 text-sm font-semibold text-white shadow-lg shadow-[#108474]/20 transition-all hover:bg-[#0d6e62] hover:shadow-xl active:scale-[0.97] disabled:opacity-40 disabled:shadow-none"
                >
                  {tx(locale, "Fortsätt till skanning", "Continue to scan", "Continuar al escaneo", "Weiter zum Scan", "Continuer vers le scan")}
                  <ArrowRight className="h-4 w-4" />
                </button>

                {canProceed() && (
                  <button
                    onClick={() => { setStep(1); scrollTop(); }}
                    className="block mx-auto text-xs font-medium text-[#766a62] underline underline-offset-2 transition-colors hover:text-[#108474]"
                  >
                    {tx(locale, "Hoppa över skanning, svara bara på frågor", "Skip face scan, answer questions only", "Saltar escaneo, solo responder preguntas", "Scan überspringen, nur Fragen beantworten", "Passer le scan, répondre uniquement aux questions")}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ---- FACE SCAN ---- */}
          {step === "scan" && (
            <div className="animate-fade-in">
              <button
                onClick={() => { setStep("demographics"); scrollTop(); }}
                className="mb-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-[#515151] transition-colors hover:bg-[#f5f5f7]"
              >
                <ArrowLeft className="h-4 w-4" />
                {tx(locale, "Tillbaka", "Back", "Atrás", "Zurück", "Retour")}
              </button>

              <div className="mb-4 text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {tx(locale, "Steg 1 av 4 — Ansiktsskanning", "Step 1 of 4 — Face scan", "Paso 1 de 4 — Escaneo facial", "Schritt 1 von 4 — Gesichtsscan", "Étape 1 sur 4 — Scan du visage")}
                </p>
              </div>

              <SkinScanner
                onComplete={(summary) => {
                  setScanSummary(summary);
                  if (summary.consentGiven) {
                    uploadTrainingData(summary);
                  }
                  setStep(1);
                  scrollTop();
                }}
              />

              {scanSummary && (
                <div className="mt-6 animate-fade-in text-center">
                  <div className="mx-auto flex max-w-xs items-center justify-center gap-2 rounded-full bg-[#108474]/5 px-4 py-2.5 text-xs font-medium text-[#108474]">
                    <Check className="h-3.5 w-3.5" />
                    {tx(locale,
                      "Skanning klar — går vidare till frågor...",
                      "Scan complete — continuing to questions...",
                      "Escaneo completo — continuando con las preguntas...",
                      "Scan abgeschlossen — weiter zu den Fragen...",
                      "Scan terminé — passage aux questions...")}
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
                  {tx(locale, "Skanningsdata kopplad till analysen", "Scan data linked to this analysis", "Datos del escaneo vinculados al análisis", "Scandaten mit dieser Analyse verknüpft", "Données du scan liées à cette analyse")}
                </div>
              )}

              <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {scanSummary
                  ? tx(locale,
                      `Steg 3 av 4 — Fråga ${step} av ${TOTAL_STEPS}`,
                      `Step 3 of 4 — Question ${step} of ${TOTAL_STEPS}`,
                      `Paso 3 de 4 — Pregunta ${step} de ${TOTAL_STEPS}`,
                      `Schritt 3 von 4 — Frage ${step} von ${TOTAL_STEPS}`,
                      `Étape 3 sur 4 — Question ${step} sur ${TOTAL_STEPS}`)
                  : a("stepOf", { current: step, total: TOTAL_STEPS })}
              </p>

              {/* Step 1 - Skin type */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight">{a("step1Title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{a("step1Sub")}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
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
                      setAnswers((p) => {
                        if (k === "none") {
                          return { ...p, concerns: p.concerns.includes("none") ? [] : ["none"] };
                        }
                        const without = p.concerns.filter((c) => c !== "none");
                        return { ...p, concerns: toggleArray(without, k, 4) };
                      })
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
                      className="w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-base shadow-sm placeholder:text-brand-400 focus:border-[#108474] focus:outline-none focus:ring-2 focus:ring-[#108474]/20 md:text-sm"
                    />
                  </div>

                  {error && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
                  )}
                </div>
              )}

              {/* Step 6 - Sun habits */}
              {step === 6 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight">
                      {tx(locale, "Solskydd", "Sun protection", "Protección solar", "Sonnenschutz", "Protection solaire")}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {tx(locale, "Hur ofta använder du solskydd?", "How often do you use sun protection?", "¿Con qué frecuencia usas protección solar?", "Wie oft verwendest du Sonnenschutz?", "À quelle fréquence utilisez-vous une protection solaire ?")}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "never", label: tx(locale, "Aldrig", "Never", "Nunca", "Nie", "Jamais"), icon: Sun },
                      { key: "sometimes", label: tx(locale, "Ibland", "Sometimes", "A veces", "Manchmal", "Parfois"), icon: Sun },
                      { key: "daily", label: tx(locale, "Dagligen", "Daily", "Diariamente", "Täglich", "Quotidiennement"), icon: Sun },
                    ].map((opt) => (
                      <OptionCard
                        key={opt.key}
                        selected={answers.sunProtection === opt.key}
                        onClick={() => setAnswers((p) => ({ ...p, sunProtection: opt.key }))}
                        title={opt.label}
                        icon={opt.icon}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 7 - Hormonal */}
              {step === 7 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight">
                      {tx(locale, "Hormonell påverkan", "Hormonal influence", "Influencia hormonal", "Hormoneller Einfluss", "Influence hormonale")}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {tx(locale, "Upplever du förändringar i huden kopplade till hormoner?", "Do you experience skin changes related to hormones?", "¿Experimentas cambios en la piel relacionados con hormonas?", "Erlebst du hormonbedingte Hautveränderungen?", "Ressentez-vous des changements cutanés liés aux hormones ?")}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "yes", label: tx(locale, "Ja", "Yes", "Sí", "Ja", "Oui") },
                      { key: "no", label: tx(locale, "Nej", "No", "No", "Nein", "Non") },
                      { key: "unsure", label: tx(locale, "Vet ej", "Not sure", "No sé", "Weiß nicht", "Je ne sais pas") },
                      { key: "not-applicable", label: tx(locale, "Ej relevant", "Not applicable", "No aplica", "Nicht zutreffend", "Non applicable") },
                    ].map((opt) => (
                      <OptionCard
                        key={opt.key}
                        selected={answers.hormonal === opt.key}
                        onClick={() => setAnswers((p) => ({ ...p, hormonal: opt.key }))}
                        title={opt.label}
                      />
                    ))}
                  </div>

                  {error && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="mt-10 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
                <button
                  onClick={goPrev}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 md:h-auto md:w-auto md:justify-start md:rounded-xl md:px-5 md:py-2.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {a("prev")}
                </button>
                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#108474] px-10 text-sm font-semibold text-white shadow-lg shadow-[#108474]/20 transition-all hover:bg-[#0d6e62] hover:shadow-xl active:scale-[0.97] disabled:opacity-40 disabled:shadow-none md:h-auto md:w-auto md:px-8 md:py-3 md:shadow-md"
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
            <div className="space-y-10">
              <div className="animate-fade-in text-center">
                <h2 className="text-3xl font-bold tracking-tight">{a("resultTitle")}</h2>
              </div>

              {parsed ? (
                <AnalysisTabs
                  score={parsed.score}
                  scoreLabel={parsed.scoreLabel}
                  summary={parsed.summary}
                  skinAge={parsed.skinAge}
                  fitzpatrick={parsed.fitzpatrick}
                  metrics={parsed.metrics}
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
                  faceZonesGPT={parsed.faceZones || undefined}
                  zoneAnchors={scanSummary?.zoneAnchors || undefined}
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

              {/* Share result */}
              {parsed && (() => {
                const shareText = tx(locale,
                  `Min hud fick ${parsed.score}/100 poäng${parsed.skinAge ? ` och en biologisk hudålder på ${parsed.skinAge} år` : ""}! Testa din hud gratis:`,
                  `My skin scored ${parsed.score}/100${parsed.skinAge ? ` with a biological skin age of ${parsed.skinAge}` : ""}! Test yours free:`,
                  `Mi piel obtuvo ${parsed.score}/100${parsed.skinAge ? ` con una edad biológica de ${parsed.skinAge} años` : ""}! Prueba gratis:`,
                  `Meine Haut hat ${parsed.score}/100 Punkte${parsed.skinAge ? ` mit einem biologischen Hautalter von ${parsed.skinAge} Jahren` : ""}! Teste kostenlos:`,
                  `Ma peau a obtenu ${parsed.score}/100${parsed.skinAge ? ` avec un âge biologique de ${parsed.skinAge} ans` : ""}! Testez gratuitement :`);
                const shareUrl = `https://www.1753skin.com${path("skinAnalysis")}`;

                const generateShareImage = () => {
                  const canvas = document.createElement("canvas");
                  const w = 1080; const h = 1080;
                  canvas.width = w; canvas.height = h;
                  const ctx = canvas.getContext("2d");
                  if (!ctx) return;

                  const gradient = ctx.createLinearGradient(0, 0, w, h);
                  gradient.addColorStop(0, "#f5f5f7");
                  gradient.addColorStop(1, "#ffffff");
                  ctx.fillStyle = gradient;
                  ctx.fillRect(0, 0, w, h);

                  ctx.fillStyle = "#766a62";
                  ctx.font = "600 28px -apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif";
                  ctx.textAlign = "center";
                  ctx.letterSpacing = "6px";
                  ctx.fillText("1753 SKINCARE", w / 2, 200);
                  ctx.letterSpacing = "0px";

                  ctx.fillStyle = "#108474";
                  ctx.font = "bold 180px -apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif";
                  ctx.fillText(`${parsed.score}`, w / 2, 460);

                  ctx.fillStyle = "#766a62";
                  ctx.font = "500 32px -apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif";
                  ctx.fillText(tx(locale, "Hudpoäng av 100", "Skin score out of 100", "Puntuación de 100", "Hautscore von 100", "Score sur 100"), w / 2, 520);

                  if (parsed.skinAge) {
                    ctx.fillStyle = "#e6e6e6";
                    ctx.fillRect(w / 2 - 60, 580, 120, 1);

                    ctx.fillStyle = "#1d1d1f";
                    ctx.font = "bold 100px -apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif";
                    ctx.fillText(`${parsed.skinAge}`, w / 2, 710);

                    ctx.fillStyle = "#766a62";
                    ctx.font = "500 32px -apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif";
                    ctx.fillText(tx(locale, "Biologisk hudålder", "Biological skin age", "Edad biológica", "Biologisches Hautalter", "Âge biologique"), w / 2, 770);
                  }

                  ctx.fillStyle = "#766a62";
                  ctx.font = "400 26px -apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif";
                  ctx.fillText(tx(locale,
                    "Testa din hud gratis på 1753skin.com",
                    "Test your skin free at 1753skin.com",
                    "Analiza tu piel gratis en 1753skin.com",
                    "Teste deine Haut auf 1753skin.com",
                    "Testez votre peau sur 1753skin.com"), w / 2, 950);

                  ctx.fillStyle = "#108474";
                  ctx.beginPath();
                  ctx.roundRect(w / 2 - 100, 980, 200, 4, 2);
                  ctx.fill();

                  const link = document.createElement("a");
                  link.download = "1753-hudscore.png";
                  link.href = canvas.toDataURL("image/png");
                  link.click();
                };

                return (
                <div className="mx-auto max-w-md rounded-2xl border border-[#e6e6e6] bg-white p-6 text-center">
                  <Sparkles className="mx-auto mb-3 h-6 w-6 text-[#108474]" />
                  <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f]">
                    {tx(locale, "Dela ditt resultat", "Share your result", "Comparte tu resultado", "Teile dein Ergebnis", "Partagez votre résultat")}
                  </h3>
                  <p className="mt-1 text-xs text-[#515151]">
                    {tx(locale,
                      "Visa dina vänner hur gammal din hud egentligen är",
                      "Show your friends how old your skin really is",
                      "Muestra a tus amigos la edad real de tu piel",
                      "Zeige deinen Freunden, wie alt deine Haut wirklich ist",
                      "Montrez à vos amis l'âge réel de votre peau")}
                  </p>

                  {/* Share card preview */}
                  <div className="mx-auto mt-4 max-w-xs overflow-hidden rounded-2xl border border-[#e6e6e6] bg-gradient-to-br from-[#f5f5f7] to-white p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#766a62]">1753 SKINCARE</p>
                    <div className="mt-3 flex items-center justify-center gap-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-[#108474]">{parsed.score}</p>
                        <p className="mt-0.5 text-[10px] text-[#766a62]">{tx(locale, "Hudpoäng", "Skin score", "Puntuación", "Hautscore", "Score")}</p>
                      </div>
                      {parsed.skinAge && (
                        <>
                          <div className="h-10 w-px bg-[#e6e6e6]" />
                          <div className="text-center">
                            <p className="text-3xl font-bold text-[#1d1d1f]">{parsed.skinAge}</p>
                            <p className="mt-0.5 text-[10px] text-[#766a62]">{tx(locale, "Biologisk hudålder", "Biological skin age", "Edad biológica", "Biologisches Hautalter", "Âge biologique")}</p>
                          </div>
                        </>
                      )}
                    </div>
                    <p className="mt-3 text-[10px] text-[#766a62]">
                      {tx(locale,
                        "Testa din hud gratis på 1753skin.com",
                        "Test your skin free at 1753skin.com",
                        "Analiza tu piel gratis en 1753skin.com",
                        "Teste deine Haut auf 1753skin.com",
                        "Testez votre peau sur 1753skin.com")}
                    </p>
                  </div>

                  {/* Download share image */}
                  <button
                    onClick={generateShareImage}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#108474] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0d6e62]"
                  >
                    <Download className="h-4 w-4" />
                    {tx(locale, "Ladda ner bild", "Download image", "Descargar imagen", "Bild herunterladen", "Télécharger l'image")}
                  </button>

                  {/* Share buttons */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: "1753 SKINCARE", text: shareText, url: shareUrl }).catch((err) => {
                            if (err?.name !== "AbortError") console.warn("[Share]", err);
                          });
                        } else {
                          navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
                            setShareCopied(true);
                            setTimeout(() => setShareCopied(false), 2500);
                          }).catch(() => {});
                        }
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#e6e6e6] px-4 py-2.5 text-xs font-semibold text-[#515151] transition-all hover:border-[#108474] hover:text-[#108474]"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      {shareCopied
                        ? tx(locale, "Kopierat!", "Copied!", "¡Copiado!", "Kopiert!", "Copié !")
                        : tx(locale, "Dela", "Share", "Compartir", "Teilen", "Partager")}
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#e6e6e6] px-4 py-2.5 text-xs font-semibold text-[#515151] transition-all hover:border-[#25D366] hover:text-[#25D366]"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#e6e6e6] px-4 py-2.5 text-xs font-semibold text-[#515151] transition-all hover:border-[#1877F2] hover:text-[#1877F2]"
                    >
                      Facebook
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#e6e6e6] px-4 py-2.5 text-xs font-semibold text-[#515151] transition-all hover:border-[#1d1d1f] hover:text-[#1d1d1f]"
                    >
                      X
                    </a>
                  </div>

                  {/* Instagram note */}
                  <a
                    href="https://www.instagram.com/1753.skincare"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-xs text-[#766a62] transition-colors hover:text-[#108474]"
                  >
                    {tx(locale,
                      "Dela bilden på Instagram och tagga @1753.skincare",
                      "Share the image on Instagram and tag @1753.skincare",
                      "Comparte la imagen en Instagram y etiqueta @1753.skincare",
                      "Teile das Bild auf Instagram und tagge @1753.skincare",
                      "Partagez l'image sur Instagram et identifiez @1753.skincare")}
                  </a>
                </div>
                );
              })()}

              {/* Training data contribution */}
              {trainingUploaded && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-[#fcb237]/10 px-4 py-3 text-xs font-medium text-[#766a62]">
                  <Heart className="h-3.5 w-3.5 text-[#fcb237]" />
                  {tx(locale,
                    "Tack för att du bidrar till att förbättra vår AI-hudanalys",
                    "Thank you for helping us improve our AI skin analysis",
                    "Gracias por ayudarnos a mejorar nuestro análisis de piel con IA",
                    "Danke, dass du uns hilfst, unsere KI-Hautanalyse zu verbessern",
                    "Merci de nous aider à améliorer notre analyse de peau IA")}
                  {trainingCount !== null && (
                    <span className="text-[#766a62]/60">
                      {" "}&mdash; {tx(locale, "bidrag", "contribution", "contribución", "Beitrag", "contribution")} #{trainingCount}
                    </span>
                  )}
                </div>
              )}

              {/* Auto-saved snapshot indicator (saving in progress) */}
              {snapshotSaving && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-xs font-medium text-brand-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {tx(locale,
                    "Sparar ditt foto krypterat...",
                    "Saving your photo encrypted...",
                    "Guardando tu foto cifrado...",
                    "Speichere dein Foto verschlüsselt...",
                    "Enregistrement chiffré de votre photo...")}
                </div>
              )}

              {snapshotSaved && token && scanSummary?.imageBase64 && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-[#108474]/5 px-4 py-3 text-xs font-medium text-[#108474]">
                  <Check className="h-3.5 w-3.5" />
                  {tx(locale,
                    "Foto sparat i din hudresa",
                    "Photo saved to your skin journey",
                    "Foto guardado en tu viaje de piel",
                    "Foto in deiner Hautreise gespeichert",
                    "Photo enregistré dans votre parcours peau")}
                </div>
              )}

              {/* Newsletter confirmation */}
              {nlSubscribed && userEmail && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-[#108474]/5 px-4 py-3 text-xs font-medium text-[#108474]">
                  <Mail className="h-3.5 w-3.5" />
                  {tx(locale,
                    `Veckovisa hudvårdstips skickas till ${userEmail}`,
                    `Weekly skincare tips will be sent to ${userEmail}`,
                    `Consejos semanales de cuidado de la piel se enviarán a ${userEmail}`,
                    `Wöchentliche Hautpflegetipps werden an ${userEmail} gesendet`,
                    `Des conseils hebdomadaires de soins de la peau seront envoyés à ${userEmail}`)}
                </div>
              )}

              {/* New analysis CTA */}
              <div className="text-center">
                <button
                  onClick={() => {
                    sessionStorage.removeItem("1753_analysis_result");
                    sessionStorage.removeItem("1753_analysis_progress");
                    setStep("intro");
                    setResult(null);
                    setParsed(null);
                    setScanSummary(null);
                    setTrainingUploaded(false);
                    trainingUploadedRef.current = false;
                    setTrainingCount(null);
                    setSnapshotSaved(false);
                    setSnapshotSaving(false);
                    setNlSubscribed(false);
                    setUserEmail(user?.email ?? "");
                    setEmailConsent(false);
                    setEmailError("");
                    scrollTop();
                    setAnswers({
                      age: 0,
                      gender: "",
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
                      sunProtection: "",
                      hormonal: "",
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
                {tx(locale,
                  "Denna analys är framtagen med hjälp av artificiell intelligens och utgör inte medicinsk rådgivning, diagnos eller behandlingsrekommendation. Vid hudbesvär, kontakta alltid en legitimerad dermatolog eller läkare.",
                  "This analysis is generated with the help of artificial intelligence and does not constitute medical advice, diagnosis or treatment recommendations. If you have ongoing skin concerns, always contact a licensed dermatologist or doctor.",
                  "Este análisis se genera con la ayuda de inteligencia artificial y no constituye asesoramiento médico, diagnóstico ni recomendaciones de tratamiento. Si tienes problemas de piel persistentes, consulta siempre a un dermatólogo o médico autorizado.",
                  "Diese Analyse wurde mit Hilfe künstlicher Intelligenz erstellt und stellt keine medizinische Beratung, Diagnose oder Behandlungsempfehlung dar. Bei anhaltenden Hautproblemen wende dich immer an einen zugelassenen Dermatologen oder Arzt.",
                  "Cette analyse est générée à l'aide de l'intelligence artificielle et ne constitue pas un avis médical, un diagnostic ou des recommandations de traitement. En cas de problèmes de peau persistants, consultez toujours un dermatologue ou un médecin agréé.")}
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
