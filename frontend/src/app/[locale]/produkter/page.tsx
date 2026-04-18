import type { Metadata } from "next";
import { ProductGrid } from "./product-grid";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";
import { PRODUCTS, productDisplayName, productPrice } from "@/lib/products";
import { localizePath } from "@/lib/i18n/navigation";
import { getCurrency } from "@/lib/currency";
import Link from "next/link";

const BASE_URL = "https://www.1753skin.com";

function tx(locale: string, sv: string, en: string, es?: string, de?: string, fr?: string): string {
  if (locale === "sv") return sv;
  if (locale === "es") return es || en;
  if (locale === "de") return de || en;
  if (locale === "fr") return fr || en;
  return en;
}

const PRODUCT_BRIEF: Record<string, { actives: string; for: { sv: string; en: string; es: string; de: string; fr: string }; size: string }> = {
  "duo-ta-da": {
    actives: "10% CBD, 0.2–5% CBG",
    size: "2 × 10 ml + 30 ml",
    for: {
      sv: "Hela rutinen",
      en: "Complete routine",
      es: "Rutina completa",
      de: "Komplette Routine",
      fr: "Routine complète",
    },
  },
  "duo-kit": {
    actives: "10% CBD, 0.2–5% CBG",
    size: "2 × 10 ml",
    for: {
      sv: "Morgon + kväll",
      en: "Morning + evening",
      es: "Mañana + noche",
      de: "Morgen + Abend",
      fr: "Matin + soir",
    },
  },
  "ta-da-serum": {
    actives: "3% CBG",
    size: "30 ml",
    for: {
      sv: "Glow & boost",
      en: "Glow & boost",
      es: "Luminosidad",
      de: "Glow & Boost",
      fr: "Éclat",
    },
  },
  "au-naturel-makeup-remover": {
    actives: "MCT + 0.2% CBD",
    size: "100 ml",
    for: {
      sv: "Rengöring",
      en: "Cleansing",
      es: "Limpieza",
      de: "Reinigung",
      fr: "Nettoyage",
    },
  },
  "fungtastic-mushroom-extract": {
    actives: tx("en", "25 % var av Chaga, Lion's Mane, Cordyceps, Reishi", "25% each of Chaga, Lion's Mane, Cordyceps, Reishi"),
    size: tx("en", "60 kapslar", "60 capsules"),
    for: {
      sv: "Inifrån",
      en: "Inside-out",
      es: "Desde dentro",
      de: "Innere Unterstützung",
      fr: "De l'intérieur",
    },
  },
};

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

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const currency = getCurrency(l);
  const currencySymbol = currency === "EUR" ? "€" : "kr";

  return (
    <>
      <ProductGrid />

      <section id="jamforelse" className="border-t border-[#e6e6e6] bg-[#f5f5f7] py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#108474]">
              {tx(l, "Jämför", "Compare", "Comparar", "Vergleich", "Comparer")}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] md:text-3xl">
              {tx(
                l,
                "Översikt över alla produkter",
                "An overview of every product",
                "Resumen de todos los productos",
                "Überblick über alle Produkte",
                "Aperçu de tous les produits"
              )}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#515151]">
              {tx(
                l,
                "Snabb jämförelse – aktiva ingredienser, storlek, pris och för vem produkten passar bäst.",
                "Quick comparison — actives, size, price and who each product is for.",
                "Comparación rápida — activos, tamaño, precio y para quién es cada producto.",
                "Schneller Vergleich — Wirkstoffe, Größe, Preis und für wen das Produkt geeignet ist.",
                "Comparaison rapide — actifs, taille, prix et à qui chaque produit est destiné."
              )}
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#e6e6e6] bg-white shadow-sm">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">
                {tx(
                  l,
                  "Jämförelse av alla 1753 SKINCARE produkter",
                  "Comparison of every 1753 SKINCARE product",
                  "Comparación de todos los productos de 1753 SKINCARE",
                  "Vergleich aller 1753 SKINCARE Produkte",
                  "Comparaison de tous les produits 1753 SKINCARE"
                )}
              </caption>
              <thead className="bg-[#f5f5f7] text-xs font-semibold uppercase tracking-[0.1em] text-[#766a62]">
                <tr>
                  <th scope="col" className="px-5 py-4">
                    {tx(l, "Produkt", "Product", "Producto", "Produkt", "Produit")}
                  </th>
                  <th scope="col" className="px-5 py-4">
                    {tx(l, "Aktiva ingredienser", "Key actives", "Ingredientes activos", "Wirkstoffe", "Actifs clés")}
                  </th>
                  <th scope="col" className="px-5 py-4">
                    {tx(l, "Storlek", "Size", "Tamaño", "Größe", "Taille")}
                  </th>
                  <th scope="col" className="px-5 py-4">
                    {tx(l, "Pris", "Price", "Precio", "Preis", "Prix")}
                  </th>
                  <th scope="col" className="px-5 py-4">
                    {tx(l, "För vem", "Best for", "Para quién", "Für wen", "Pour qui")}
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#1d1d1f]">
                {PRODUCTS.map((p) => {
                  const brief = PRODUCT_BRIEF[p.id];
                  const href = localizePath(l, "product", { productId: p.id });
                  return (
                    <tr key={p.id} className="border-t border-[#e6e6e6] transition-colors hover:bg-[#f5f5f7]/50">
                      <th scope="row" className="px-5 py-4 text-left font-semibold">
                        <Link href={href} className="hover:text-[#108474]">
                          {productDisplayName(p, l)}
                        </Link>
                      </th>
                      <td className="px-5 py-4 text-[#515151]">{brief?.actives || "—"}</td>
                      <td className="px-5 py-4 text-[#515151]">{brief?.size || p.size || "—"}</td>
                      <td className="px-5 py-4 text-[#515151]">
                        {productPrice(p, l)} {currencySymbol}
                      </td>
                      <td className="px-5 py-4 text-[#515151]">
                        {brief?.for?.[l] || brief?.for?.en || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
