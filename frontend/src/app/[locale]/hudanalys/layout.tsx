import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";

const BASE_URL = "https://www.1753skin.com";

// SEO-konsolidering: verktygssidan (/hudanalys) är en interaktiv funnel utan
// unikt rankningsbart innehåll. Vi canonicaliserar den till den innehållsrika
// landningssidan (/gratis-hudanalys) så att all "hudanalys"-signal samlas där.
// OBS: endast metadata – själva analysflödet påverkas inte.
const LANDING_PATHS: Record<string, string> = {
  sv: "/sv/gratis-hudanalys",
  en: "/en/free-skin-analysis",
  es: "/es/analisis-piel-gratis",
  de: "/de/kostenlose-hautanalyse",
  fr: "/fr/analyse-de-peau-gratuite",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale as Locale).analysisLayoutSeo;
  const canonicalPath = LANDING_PATHS[locale] ?? LANDING_PATHS.en;
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
        sv: `${BASE_URL}${LANDING_PATHS.sv}`,
        en: `${BASE_URL}${LANDING_PATHS.en}`,
        es: `${BASE_URL}${LANDING_PATHS.es}`,
        de: `${BASE_URL}${LANDING_PATHS.de}`,
        fr: `${BASE_URL}${LANDING_PATHS.fr}`,
        "x-default": `${BASE_URL}${LANDING_PATHS.sv}`,
      },
    },
  };
}

export default function HudanalysLayout({ children }: { children: React.ReactNode }) {
  return children;
}
