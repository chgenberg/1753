import type { Metadata } from "next";
import { ProductGrid } from "./product-grid";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";

const BASE_URL = "https://www.1753skin.com";

const PRODUCTS_PATHS: Record<string, string> = {
  sv: "/sv/produkter",
  en: "/en/products",
  es: "/es/productos",
  de: "/de/produkte",
  fr: "/fr/produits",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale as Locale).productsSeo;
  const canonicalPath = PRODUCTS_PATHS[locale] ?? PRODUCTS_PATHS.en;
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
        sv: `${BASE_URL}${PRODUCTS_PATHS.sv}`,
        en: `${BASE_URL}${PRODUCTS_PATHS.en}`,
        es: `${BASE_URL}${PRODUCTS_PATHS.es}`,
        de: `${BASE_URL}${PRODUCTS_PATHS.de}`,
        fr: `${BASE_URL}${PRODUCTS_PATHS.fr}`,
        "x-default": `${BASE_URL}${PRODUCTS_PATHS.sv}`,
      },
    },
  };
}

export default function ProductsPage() {
  return <ProductGrid />;
}
