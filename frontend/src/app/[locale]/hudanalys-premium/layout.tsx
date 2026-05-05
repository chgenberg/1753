import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";

const BASE_URL = "https://www.1753skin.com";

const PREMIUM_PATHS: Record<string, string> = {
  sv: "/sv/hudanalys-premium",
  en: "/en/premium-skin-analysis",
  es: "/es/analisis-piel-premium",
  de: "/de/hautanalyse-premium",
  fr: "/fr/analyse-peau-premium",
};

const FREE_PATHS: Record<string, string> = {
  sv: "/sv/hudanalys",
  en: "/en/skin-analysis",
  es: "/es/analisis-piel",
  de: "/de/hautanalyse",
  fr: "/fr/analyse-peau",
};

function isPremiumEnabled() {
  const v = String(process.env.PREMIUM_ANALYSIS_ENABLED || "").toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale as Locale).analysisPagePremium;
  const canonicalPath = PREMIUM_PATHS[locale] ?? PREMIUM_PATHS.en;
  return {
    title: m.seoTitle,
    description: m.seoDescription,
    openGraph: {
      title: m.seoTitle,
      description: m.seoDescription,
    },
    alternates: {
      canonical: `${BASE_URL}${canonicalPath}`,
      languages: {
        sv: `${BASE_URL}${PREMIUM_PATHS.sv}`,
        en: `${BASE_URL}${PREMIUM_PATHS.en}`,
        es: `${BASE_URL}${PREMIUM_PATHS.es}`,
        de: `${BASE_URL}${PREMIUM_PATHS.de}`,
        fr: `${BASE_URL}${PREMIUM_PATHS.fr}`,
        "x-default": `${BASE_URL}${PREMIUM_PATHS.sv}`,
      },
    },
    robots: isPremiumEnabled()
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export default async function HudanalysPremiumLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  if (!isPremiumEnabled()) {
    const { locale } = await params;
    const fallback = FREE_PATHS[locale] || FREE_PATHS.sv;
    redirect(fallback);
  }
  return <>{children}</>;
}
