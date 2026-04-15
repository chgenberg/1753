import type { Metadata } from "next";
import { localizePath } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/types";
import { locales } from "@/lib/i18n/types";

const BASE = "https://www.1753skin.com";

const TITLES: Record<string, string> = {
  sv: "Lojalitetsprogram – Silver, Guld & Platina | 1753 SKINCARE",
  en: "Loyalty Program – Silver, Gold & Platinum | 1753 SKINCARE",
  es: "Programa de Fidelidad – Plata, Oro y Platino | 1753 SKINCARE",
  de: "Treueprogramm – Silber, Gold & Platin | 1753 SKINCARE",
  fr: "Programme de Fidélité – Argent, Or & Platine | 1753 SKINCARE",
};

const DESCRIPTIONS: Record<string, string> = {
  sv: "Handla och samla poäng. Lås upp Silver, Guld och Platina med exklusiva rabatter och förmåner hos 1753 SKINCARE.",
  en: "Shop and earn points. Unlock Silver, Gold and Platinum tiers with exclusive discounts and rewards at 1753 SKINCARE.",
  es: "Compra y acumula puntos. Desbloquea los niveles Plata, Oro y Platino con descuentos exclusivos en 1753 SKINCARE.",
  de: "Einkaufen und Punkte sammeln. Schalte die Stufen Silber, Gold und Platin mit exklusiven Rabatten bei 1753 SKINCARE frei.",
  fr: "Achetez et cumulez des points. Débloquez les niveaux Argent, Or et Platine avec des remises exclusives chez 1753 SKINCARE.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;

  const alternatesLang: Record<string, string> = {};
  for (const loc of locales) alternatesLang[loc] = `${BASE}${localizePath(loc, "loyalty")}`;
  alternatesLang["x-default"] = alternatesLang.en;

  return {
    title: TITLES[l] || TITLES.en,
    description: DESCRIPTIONS[l] || DESCRIPTIONS.en,
    openGraph: {
      title: TITLES[l] || TITLES.en,
      description: DESCRIPTIONS[l] || DESCRIPTIONS.en,
      locale: ({ sv: "sv_SE", en: "en_US", es: "es_ES", de: "de_DE", fr: "fr_FR" })[l] || "en_US",
    },
    alternates: {
      canonical: `${BASE}${localizePath(l, "loyalty")}`,
      languages: alternatesLang,
    },
  };
}

export default function LoyaltyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
