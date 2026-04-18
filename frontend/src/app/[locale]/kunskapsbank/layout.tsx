import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/types";
import { locales } from "@/lib/i18n/types";

const BASE = "https://www.1753skin.com";

const TITLES: Record<string, string> = {
  sv: "Kunskapsbank – Hudvårdsordlista & Begrepp | 1753 SKINCARE",
  en: "Knowledge Hub – Skincare Glossary & Definitions | 1753 SKINCARE",
  es: "Base de Conocimiento – Glosario de Cuidado de la Piel | 1753 SKINCARE",
  de: "Wissensdatenbank – Hautpflege-Glossar & Begriffe | 1753 SKINCARE",
  fr: "Base de Connaissances – Glossaire des Soins de la Peau | 1753 SKINCARE",
};

const DESCRIPTIONS: Record<string, string> = {
  sv: "Definitioner av de viktigaste begreppen inom holistisk hudvård: endocannabinoidsystemet, CBD, CBG, hudmikrobiom, tarm-hud-axeln, Fitzpatrick och mer.",
  en: "Definitions of the key concepts in holistic skincare: endocannabinoid system, CBD, CBG, skin microbiome, gut-skin axis, Fitzpatrick scale and more.",
  es: "Definiciones de los conceptos clave del cuidado holístico de la piel: sistema endocannabinoide, CBD, CBG, microbioma cutáneo, eje intestino-piel, escala Fitzpatrick y más.",
  de: "Definitionen der wichtigsten Begriffe der ganzheitlichen Hautpflege: Endocannabinoid-System, CBD, CBG, Hautmikrobiom, Darm-Haut-Achse, Fitzpatrick-Skala und mehr.",
  fr: "Définitions des concepts clés des soins holistiques : système endocannabinoïde, CBD, CBG, microbiome cutané, axe intestin-peau, échelle de Fitzpatrick et plus.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;

  const alternatesLang: Record<string, string> = {};
  for (const loc of locales) alternatesLang[loc] = `${BASE}/${loc}/kunskapsbank`;
  alternatesLang["x-default"] = alternatesLang.sv;

  return {
    title: TITLES[l] || TITLES.en,
    description: DESCRIPTIONS[l] || DESCRIPTIONS.en,
    openGraph: {
      title: TITLES[l] || TITLES.en,
      description: DESCRIPTIONS[l] || DESCRIPTIONS.en,
      locale: ({ sv: "sv_SE", en: "en_US", es: "es_ES", de: "de_DE", fr: "fr_FR" })[l] || "en_US",
    },
    alternates: {
      canonical: `${BASE}/${l}/kunskapsbank`,
      languages: alternatesLang,
    },
  };
}

export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
