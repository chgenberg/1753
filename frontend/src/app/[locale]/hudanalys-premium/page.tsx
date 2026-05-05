"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Lock,
  Mail,
  ScanFace,
  Sparkles,
} from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { apiFetch } from "@/lib/api";
import { SkinScanner, type ScanSummary } from "@/components/skin-scanner/skin-scanner";
import {
  PREMIUM_CATEGORIES,
  visiblePremiumQuestions,
  tx,
  type PremiumQuestion,
} from "@/components/analysis-premium/premium-questions";
import { cn } from "@/lib/utils";

type Step = "intro" | "email" | "scan" | "questions" | "review" | "paying";
type AnswerValue = string | string[] | number | undefined;
type Answers = Record<string, Record<string, AnswerValue>>;

interface CheckoutResponse {
  token: string;
  orderCode: number;
  checkoutUrl: string;
  amount: number;
  currency: string;
}

interface PrefillResponse {
  found: boolean;
  latestAnalysisId?: number;
  createdAt?: string;
  score?: number;
  answers?: Record<string, unknown> | null;
}

const PRICE_DISPLAY = "29 kr";

export default function HudanalysPremiumPage() {
  const { locale, messages } = useLocale();
  const m = messages.analysisPagePremium;

  const [step, setStep] = useState<Step>("intro");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [scanSummary, setScanSummary] = useState<ScanSummary | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [prefillFound, setPrefillFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleQuestions = useMemo(
    () => visiblePremiumQuestions(answers),
    [answers]
  );
  const currentQuestion = visibleQuestions[questionIndex];
  const totalVisible = visibleQuestions.length;

  const setAnswer = useCallback(
    (category: string, field: string, value: AnswerValue) => {
      setAnswers((prev) => ({
        ...prev,
        [category]: { ...(prev[category] || {}), [field]: value },
      }));
    },
    []
  );

  const validateEmail = (raw: string) => /.+@.+\..+/.test(raw.trim());

  const submitEmail = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!validateEmail(trimmed)) {
      setEmailErr(
        tx(
          {
            sv: "Ange en giltig e-post.",
            en: "Enter a valid email.",
            es: "Introduce un correo válido.",
            de: "Gib eine gültige E-Mail ein.",
            fr: "Saisissez un e-mail valide.",
          },
          locale
        )
      );
      return;
    }
    setEmailErr(null);
    setEmail(trimmed);
    setAnswer("foundation", "email", trimmed);

    try {
      const data = await apiFetch<PrefillResponse>(
        `/analysis-premium/prefill?email=${encodeURIComponent(trimmed)}`
      );
      if (data.found) {
        setPrefillFound(true);
        const a = data.answers || {};
        type FreeAnswers = {
          age?: number;
          gender?: string;
          skinType?: string;
          concerns?: string[];
          goals?: string[];
          lifestyle?: { sleep?: number; stress?: string; diet?: string; activity?: string };
        };
        const fa = a as FreeAnswers;
        setAnswers((prev) => ({
          ...prev,
          foundation: {
            ...(prev.foundation || {}),
            email: trimmed,
            ...(fa.age ? { age: fa.age } : {}),
            ...(fa.skinType ? { skinType: fa.skinType } : {}),
          },
        }));
      }
    } catch {
      // Inget prefill: forts\u00e4tt utan
    }

    setStep("scan");
  };

  const submitScan = (summary: ScanSummary) => {
    setScanSummary(summary);
    setStep("questions");
    setQuestionIndex(0);
  };

  const goNextQuestion = () => {
    if (questionIndex >= totalVisible - 1) {
      setStep("review");
      return;
    }
    setQuestionIndex((i) => i + 1);
  };

  const goPrevQuestion = () => {
    if (questionIndex === 0) {
      setStep("scan");
      return;
    }
    setQuestionIndex((i) => i - 1);
  };

  const requiredAnswered = (q: PremiumQuestion) => {
    if (!q.required) return true;
    const v = answers[q.category]?.[q.id];
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "number") return !Number.isNaN(v);
    return Boolean(v && String(v).trim().length > 0);
  };

  const startCheckout = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const imageScan = scanSummary
        ? {
            overall: scanSummary.overallTop,
            zones: scanSummary.zones,
            overallSeverity: scanSummary.overallSeverity,
            skinMetrics: scanSummary.skinMetrics,
          }
        : null;

      const res = await apiFetch<CheckoutResponse>("/analysis-premium/checkout", {
        method: "POST",
        body: JSON.stringify({
          email,
          locale,
          answers,
          fullImage: scanSummary?.imageBase64 || null,
          imageScan,
        }),
      });

      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(
            `1753.premiumAnalysis.${res.token}`,
            JSON.stringify({ token: res.token, email, createdAt: Date.now() })
          );
        } catch {
          // localStorage indisposable, OK
        }
      }

      window.location.href = res.checkoutUrl;
    } catch (err) {
      setError((err as Error).message || m.errorGeneric);
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-4 pb-24 pt-12">
      <div className="mx-auto max-w-3xl">
        {step === "intro" && <IntroStep onStart={() => setStep("email")} />}
        {step === "email" && (
          <EmailStep
            email={email}
            setEmail={setEmail}
            err={emailErr}
            onSubmit={submitEmail}
          />
        )}
        {step === "scan" && (
          <ScanStep
            prefillFound={prefillFound}
            onComplete={submitScan}
            onBack={() => setStep("email")}
          />
        )}
        {step === "questions" && currentQuestion && (
          <QuestionStep
            question={currentQuestion}
            index={questionIndex}
            total={totalVisible}
            answers={answers}
            setAnswer={setAnswer}
            onPrev={goPrevQuestion}
            onNext={goNextQuestion}
            canNext={requiredAnswered(currentQuestion)}
          />
        )}
        {step === "review" && (
          <ReviewStep
            email={email}
            onPay={() => {
              setStep("paying");
              startCheckout();
            }}
            onBack={() => setStep("questions")}
            submitting={submitting}
            error={error}
          />
        )}
        {step === "paying" && (
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-12 text-center shadow-sm">
            <Loader2 className="h-12 w-12 animate-spin text-[#108474]" />
            <p className="text-lg font-medium text-[#1d1d1f]">{m.paymentPending}</p>
            <p className="text-sm text-[#766a62]">{m.paymentPendingSub}</p>
          </div>
        )}
      </div>
    </main>
  );

  function IntroStep({ onStart }: { onStart: () => void }) {
    return (
      <section className="rounded-3xl bg-white p-8 shadow-sm sm:p-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#108474]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#108474]">
          <Sparkles className="h-3.5 w-3.5" />
          {m.badge}
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#1d1d1f] sm:text-4xl">
          {m.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[#515151]">{m.intro}</p>

        <div className="mt-8 rounded-2xl bg-[#f5f5f7] p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#766a62]">
            {m.whatYouGetTitle}
          </p>
          <ul className="mt-4 space-y-3">
            {[
              m.whatYouGetItem1,
              m.whatYouGetItem2,
              m.whatYouGetItem3,
              m.whatYouGetItem4,
              m.whatYouGetItem5,
              m.whatYouGetItem6,
            ].map((line, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-[#1d1d1f]">
                <Check className="mt-0.5 h-4 w-4 flex-none text-[#108474]" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-sm text-[#766a62]">
            {m.payTotal}: <span className="font-semibold text-[#1d1d1f]">{PRICE_DISPLAY}</span>
          </p>
          <button
            type="button"
            onClick={onStart}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#108474] px-8 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {m.startCta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
          <p className="text-xs text-[#766a62]">{m.paySub}</p>
        </div>
      </section>
    );
  }

  function EmailStep({
    email,
    setEmail,
    err,
    onSubmit,
  }: {
    email: string;
    setEmail: (v: string) => void;
    err: string | null;
    onSubmit: () => void;
  }) {
    return (
      <section className="rounded-3xl bg-white p-8 shadow-sm sm:p-12">
        <Mail className="h-8 w-8 text-[#108474]" />
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#1d1d1f]">
          {m.emailStepTitle}
        </h2>
        <p className="mt-2 text-sm text-[#515151]">{m.emailStepSub}</p>

        <label className="mt-6 block text-sm font-medium text-[#1d1d1f]">
          {m.emailLabel}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={m.emailPlaceholder}
          className="mt-2 h-12 w-full rounded-xl border border-[#e6e6e6] bg-white px-4 text-base outline-none focus:border-[#108474] focus:ring-2 focus:ring-[#108474]/20"
          autoComplete="email"
          autoFocus
        />
        {err && <p className="mt-2 text-sm text-red-500">{err}</p>}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#108474] px-8 text-sm font-semibold text-white"
          >
            {m.continueBtn}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </section>
    );
  }

  function ScanStep({
    prefillFound,
    onComplete,
    onBack,
  }: {
    prefillFound: boolean;
    onComplete: (s: ScanSummary) => void;
    onBack: () => void;
  }) {
    return (
      <section className="rounded-3xl bg-white p-8 shadow-sm sm:p-12">
        <ScanFace className="h-8 w-8 text-[#108474]" />
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#1d1d1f]">
          {m.scanStepTitle}
        </h2>
        <p className="mt-2 text-sm text-[#515151]">{m.scanStepSub}</p>

        {prefillFound && (
          <div className="mt-4 rounded-2xl bg-[#108474]/5 p-4 text-sm text-[#108474]">
            <Check className="-mt-0.5 mr-2 inline h-4 w-4" />
            {m.prefillFound}
          </div>
        )}

        <div className="mt-6">
          <SkinScanner onComplete={onComplete} />
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#e6e6e6] bg-white px-6 text-sm font-medium text-[#1d1d1f]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {m.navBack}
          </button>
          <span className="text-xs text-[#766a62]">
            <Lock className="-mt-0.5 mr-1 inline h-3 w-3" />
            {locale === "sv"
              ? "Bilden lagras krypterat"
              : locale === "en"
              ? "Image stored encrypted"
              : locale === "es"
              ? "Imagen cifrada"
              : locale === "de"
              ? "Bild verschlüsselt gespeichert"
              : "Image chiffrée"}
          </span>
        </div>
      </section>
    );
  }

  function QuestionStep({
    question,
    index,
    total,
    answers,
    setAnswer,
    onPrev,
    onNext,
    canNext,
  }: {
    question: PremiumQuestion;
    index: number;
    total: number;
    answers: Answers;
    setAnswer: (cat: string, field: string, value: AnswerValue) => void;
    onPrev: () => void;
    onNext: () => void;
    canNext: boolean;
  }) {
    const cat = PREMIUM_CATEGORIES.find((c) => c.key === question.category);
    const catLabelKey = cat?.i18nKey as keyof typeof m | undefined;
    const catLabel = catLabelKey ? (m[catLabelKey] as string) : "";
    const value = answers[question.category]?.[question.id];
    const pct = ((index + 1) / total) * 100;

    return (
      <section className="rounded-3xl bg-white p-8 shadow-sm sm:p-12">
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-[#766a62]">
            <span className="font-semibold uppercase tracking-wide text-[#108474]">{catLabel}</span>
            <span>
              {m.questionStepHeader
                .replace("{current}", String(index + 1))
                .replace("{total}", String(total))}
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#f5f5f7]">
            <div
              className="h-full rounded-full bg-[#108474] transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
          {tx(question.prompt, locale)}
        </h2>
        {question.helper && (
          <p className="mt-2 text-sm text-[#515151]">{tx(question.helper, locale)}</p>
        )}

        <div className="mt-6">
          <QuestionInput
            question={question}
            value={value}
            onChange={(v) => setAnswer(question.category, question.id, v)}
            locale={locale}
          />
        </div>

        <div className="mt-8 flex justify-between gap-3">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#e6e6e6] bg-white px-6 text-sm font-medium text-[#1d1d1f]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {m.navBack}
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            className={cn(
              "inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-transform",
              canNext
                ? "bg-[#108474] text-white hover:scale-[1.02] active:scale-[0.98]"
                : "cursor-not-allowed bg-[#e6e6e6] text-[#9a9a9a]"
            )}
          >
            {m.navNext}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </section>
    );
  }

  function ReviewStep({
    email,
    onPay,
    onBack,
    submitting,
    error,
  }: {
    email: string;
    onPay: () => void;
    onBack: () => void;
    submitting: boolean;
    error: string | null;
  }) {
    return (
      <section className="rounded-3xl bg-white p-8 shadow-sm sm:p-12">
        <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">{m.payCta}</h2>
        <p className="mt-2 text-sm text-[#515151]">{m.paySub}</p>

        <div className="mt-6 rounded-2xl bg-[#f5f5f7] p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#766a62]">{m.title}</span>
            <span className="text-sm font-semibold text-[#1d1d1f]">{PRICE_DISPLAY}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#e6e6e6] pt-3">
            <span className="text-base font-semibold text-[#1d1d1f]">{m.payTotal}</span>
            <span className="text-base font-bold text-[#108474]">{PRICE_DISPLAY}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-[#766a62]">
          {m.emailReportSent.replace("{email}", email)}
        </p>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <div className="mt-8 flex justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#e6e6e6] bg-white px-6 text-sm font-medium text-[#1d1d1f]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {m.navBack}
          </button>
          <button
            type="button"
            onClick={onPay}
            disabled={submitting}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#108474] px-8 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {m.payCta}
          </button>
        </div>
      </section>
    );
  }
}

interface QuestionInputProps {
  question: PremiumQuestion;
  value: AnswerValue;
  onChange: (v: AnswerValue) => void;
  locale: string;
}

function QuestionInput({ question, value, onChange, locale }: QuestionInputProps) {
  if (question.type === "text") {
    return (
      <input
        type="text"
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        maxLength={question.maxLength || 200}
        className="h-12 w-full rounded-xl border border-[#e6e6e6] bg-white px-4 text-base outline-none focus:border-[#108474] focus:ring-2 focus:ring-[#108474]/20"
      />
    );
  }
  if (question.type === "longtext") {
    return (
      <textarea
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        maxLength={question.maxLength || 500}
        rows={5}
        className="w-full rounded-xl border border-[#e6e6e6] bg-white px-4 py-3 text-base outline-none focus:border-[#108474] focus:ring-2 focus:ring-[#108474]/20"
      />
    );
  }
  if (question.type === "number") {
    return (
      <input
        type="number"
        value={typeof value === "number" ? value : ""}
        onChange={(e) => {
          const num = parseInt(e.target.value, 10);
          onChange(Number.isNaN(num) ? undefined : num);
        }}
        min={question.min}
        max={question.max}
        className="h-12 w-32 rounded-xl border border-[#e6e6e6] bg-white px-4 text-base outline-none focus:border-[#108474] focus:ring-2 focus:ring-[#108474]/20"
      />
    );
  }
  if (question.type === "scale") {
    const min = question.min ?? 1;
    const max = question.max ?? 10;
    const cur = typeof value === "number" ? value : Math.round((min + max) / 2);
    return (
      <div className="flex flex-col gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={question.step || 1}
          value={cur}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full accent-[#108474]"
        />
        <div className="flex items-center justify-between text-xs text-[#766a62]">
          <span>{min}</span>
          <span className="text-2xl font-semibold text-[#108474]">{cur}</span>
          <span>{max}</span>
        </div>
      </div>
    );
  }
  if (question.type === "select") {
    const opts = question.options || [];
    const cur = typeof value === "string" ? value : "";
    return (
      <div className="grid gap-2">
        {opts.map((o) => {
          const active = cur === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={cn(
                "flex h-12 items-center justify-between rounded-xl border-2 bg-white px-4 text-left text-sm font-medium transition-all",
                active
                  ? "border-[#108474] bg-[#108474]/5 text-[#108474]"
                  : "border-[#e6e6e6] text-[#1d1d1f] hover:border-[#9a9a9a]"
              )}
            >
              <span>{tx(o.label, locale)}</span>
              {active && <Check className="h-4 w-4 text-[#108474]" />}
            </button>
          );
        })}
      </div>
    );
  }
  if (question.type === "multiselect") {
    const opts = question.options || [];
    const cur: string[] = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {opts.map((o) => {
          const active = cur.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                const next = active ? cur.filter((v) => v !== o.value) : [...cur, o.value];
                onChange(next);
              }}
              className={cn(
                "flex h-12 items-center justify-between rounded-xl border-2 bg-white px-4 text-left text-sm font-medium transition-all",
                active
                  ? "border-[#108474] bg-[#108474]/5 text-[#108474]"
                  : "border-[#e6e6e6] text-[#1d1d1f] hover:border-[#9a9a9a]"
              )}
            >
              <span>{tx(o.label, locale)}</span>
              {active && <Check className="h-4 w-4 text-[#108474]" />}
            </button>
          );
        })}
      </div>
    );
  }
  return null;
}
