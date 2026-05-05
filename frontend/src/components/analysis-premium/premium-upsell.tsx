"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";

const PREMIUM_PATHS: Record<string, string> = {
  sv: "/sv/hudanalys-premium",
  en: "/en/premium-skin-analysis",
  es: "/es/analisis-piel-premium",
  de: "/de/hautanalyse-premium",
  fr: "/fr/analyse-peau-premium",
};

function isPremiumEnabled() {
  const v = String(process.env.NEXT_PUBLIC_PREMIUM_ANALYSIS_ENABLED || "").toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

export function PremiumUpsell() {
  const { locale, messages } = useLocale();
  if (!isPremiumEnabled()) return null;

  const m = messages.analysisPagePremium;
  const href = PREMIUM_PATHS[locale] || PREMIUM_PATHS.sv;

  return (
    <aside className="relative overflow-hidden rounded-3xl border border-[#108474]/15 bg-gradient-to-br from-white to-[#108474]/5 p-6 shadow-sm sm:p-8">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#108474]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#108474]">
        <Sparkles className="h-3.5 w-3.5" />
        {m.badge}
      </span>
      <h3 className="mt-3 text-xl font-bold tracking-tight text-[#1d1d1f] sm:text-2xl">
        {m.upsellTitle}
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#515151]">
        {m.upsellSub}
      </p>
      <div className="mt-5 flex items-center gap-3">
        <Link
          href={href}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#108474] px-6 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {m.upsellCta}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <span className="text-sm font-medium text-[#766a62]">
          {m.priceLabel}
        </span>
      </div>
    </aside>
  );
}
