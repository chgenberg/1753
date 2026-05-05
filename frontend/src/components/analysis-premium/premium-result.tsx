"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { apiFetch } from "@/lib/api";
import { PremiumReport } from "./premium-report";
import type { PremiumAnalysisResult } from "./premium-types";

interface StatusResponse {
  status: "pending" | "paid" | "redeemed" | "failed";
  analysisId: number | null;
  paidAt: string | null;
  redeemedAt: string | null;
  email: string;
  locale: string;
}

interface RunResponse {
  status: string;
  analysisId: number;
  analysis: {
    id: number;
    score: number | null;
    answers: unknown;
    result: PremiumAnalysisResult | string;
    full_text: string;
    created_at: string;
  };
  result?: PremiumAnalysisResult | null;
  content?: string;
}

type Phase = "polling" | "running" | "ready" | "failed";

export function PremiumResult({ token }: { token: string }) {
  const { locale, messages } = useLocale();
  const m = messages.analysisPagePremium;

  const [phase, setPhase] = useState<Phase>("polling");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [result, setResult] = useState<PremiumAnalysisResult | null>(null);
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const runningRef = useRef(false);

  const pollStatus = useCallback(async () => {
    try {
      const data = await apiFetch<StatusResponse>(
        `/analysis-premium/status/${encodeURIComponent(token)}`
      );
      setStatus(data);
      return data;
    } catch (err) {
      setError((err as Error).message || m.errorGeneric);
      setPhase("failed");
      return null;
    }
  }, [token, m.errorGeneric]);

  const runAnalysis = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setPhase("running");
    setError(null);
    try {
      const data = await apiFetch<RunResponse>("/analysis-premium/run", {
        method: "POST",
        body: JSON.stringify({ token, locale }),
      });
      const parsed: PremiumAnalysisResult | null =
        data.result || resolveResult(data.analysis?.result, data.content);
      setResult(parsed);
      setAnalysisId(data.analysisId || null);
      setPhase("ready");
    } catch (err) {
      const message = (err as Error).message || m.errorGeneric;
      setError(message);
      setPhase("failed");
    } finally {
      runningRef.current = false;
    }
  }, [token, locale, m.errorGeneric]);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = async () => {
      const data = await pollStatus();
      if (cancelled || !data) return;
      if (data.status === "redeemed" || data.status === "paid") {
        await runAnalysis();
        return;
      }
      if (data.status === "pending") {
        timer = setTimeout(tick, 4000);
      } else {
        setPhase("failed");
        setError(m.errorPaymentFailed);
      }
    };

    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [pollStatus, runAnalysis, m.errorPaymentFailed]);

  if (phase === "polling") {
    return (
      <section className="rounded-3xl bg-white p-12 text-center shadow-sm">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#108474]" />
        <p className="mt-6 text-lg font-medium text-[#1d1d1f]">{m.paymentPending}</p>
        <p className="mt-2 text-sm text-[#766a62]">{m.paymentPendingSub}</p>
      </section>
    );
  }

  if (phase === "running") {
    return (
      <section className="rounded-3xl bg-white p-12 text-center shadow-sm">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#108474]" />
        <p className="mt-6 text-lg font-medium text-[#1d1d1f]">{m.generating}</p>
        <p className="mt-2 text-sm text-[#766a62]">{m.generatingSub}</p>
      </section>
    );
  }

  if (phase === "failed" || !result) {
    return (
      <section className="rounded-3xl bg-white p-12 text-center shadow-sm">
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
        <p className="mt-6 text-lg font-medium text-[#1d1d1f]">
          {error || m.errorGeneric}
        </p>
        <p className="mt-2 text-xs text-[#766a62]">info@1753skin.com</p>
      </section>
    );
  }

  return (
    <PremiumReport result={result} email={status?.email || ""} analysisId={analysisId} />
  );
}

function resolveResult(
  raw: PremiumAnalysisResult | string | undefined,
  contentText?: string
): PremiumAnalysisResult | null {
  if (!raw && !contentText) return null;
  if (typeof raw === "object" && raw !== null) return raw;
  const candidate = typeof raw === "string" ? raw : contentText || "";
  const m = candidate.match(/```json\s*([\s\S]*?)```/);
  if (m) {
    try {
      return JSON.parse(m[1]) as PremiumAnalysisResult;
    } catch {
      return null;
    }
  }
  try {
    return JSON.parse(candidate) as PremiumAnalysisResult;
  } catch {
    return null;
  }
}
