import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";

const BASE_URL = "https://www.1753skin.com";

const ANALYSIS_PATHS: Record<string, string> = {
  sv: "/sv/hudanalys",
  en: "/en/skin-analysis",
  es: "/es/analisis-de-piel",
  de: "/de/hautanalyse",
  fr: "/fr/analyse-de-peau",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale as Locale).analysisLayoutSeo;
  const canonicalPath = ANALYSIS_PATHS[locale] ?? ANALYSIS_PATHS.en;
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
    },
    alternates: {
      canonical: `${BASE_URL}${canonicalPath}`,
      languages: {
        sv: `${BASE_URL}${ANALYSIS_PATHS.sv}`,
        en: `${BASE_URL}${ANALYSIS_PATHS.en}`,
        es: `${BASE_URL}${ANALYSIS_PATHS.es}`,
        de: `${BASE_URL}${ANALYSIS_PATHS.de}`,
        fr: `${BASE_URL}${ANALYSIS_PATHS.fr}`,
        "x-default": `${BASE_URL}${ANALYSIS_PATHS.en}`,
      },
    },
  };
}

export default function HudanalysLayout({ children }: { children: React.ReactNode }) {
  return children;
}
