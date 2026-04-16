import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/types";
import { locales } from "@/lib/i18n/types";

const BASE = "https://www.1753skin.com";

const TITLES: Record<string, string> = {
  sv: "Bildgalleri – Produktbilder & Inspiration | 1753 SKINCARE",
  en: "Image Gallery – Product Photos & Inspiration | 1753 SKINCARE",
  es: "Galería de Imágenes – Fotos de Productos e Inspiración | 1753 SKINCARE",
  de: "Bildgalerie – Produktfotos & Inspiration | 1753 SKINCARE",
  fr: "Galerie d'Images – Photos de Produits & Inspiration | 1753 SKINCARE",
};

const DESCRIPTIONS: Record<string, string> = {
  sv: "Utforska 1753 SKINCARE:s bildgalleri med produktfoton, livsstilsbilder och stämningsbilder.",
  en: "Browse the 1753 SKINCARE image gallery featuring product photos, lifestyle images and mood shots.",
  es: "Explora la galería de imágenes de 1753 SKINCARE con fotos de productos, imágenes de estilo de vida y ambiente.",
  de: "Durchstöbere die 1753 SKINCARE Bildgalerie mit Produktfotos, Lifestyle-Bildern und Stimmungsaufnahmen.",
  fr: "Parcourez la galerie d'images 1753 SKINCARE avec photos de produits, images lifestyle et ambiance.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;

  const alternatesLang: Record<string, string> = {};
  for (const loc of locales) alternatesLang[loc] = `${BASE}/${loc}/galleri`;
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
      canonical: `${BASE}/${l}/galleri`,
      languages: alternatesLang,
    },
  };
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
