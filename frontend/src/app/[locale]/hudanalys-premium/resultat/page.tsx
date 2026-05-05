"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { PremiumResult } from "@/components/analysis-premium/premium-result";

function PremiumResultPageInner() {
  const { messages } = useLocale();
  const m = messages.analysisPagePremium;
  const params = useSearchParams();
  const token = params.get("token");

  if (!token) {
    return (
      <main className="min-h-screen bg-[#f5f5f7] px-4 pb-24 pt-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-12 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#1d1d1f]">{m.errorTokenMissing}</h1>
          <p className="mt-3 text-sm text-[#515151]">{m.errorGeneric}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-4 pb-24 pt-12">
      <div className="mx-auto max-w-4xl">
        <PremiumResult token={token} />
      </div>
    </main>
  );
}

export default function PremiumResultPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f5f5f7]">
          <Loader2 className="h-8 w-8 animate-spin text-[#108474]" />
        </main>
      }
    >
      <PremiumResultPageInner />
    </Suspense>
  );
}
