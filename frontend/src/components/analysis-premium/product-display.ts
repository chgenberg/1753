/**
 * Pretty-print produkt-id:n från premium-AI till riktiga produktnamn,
 * pris och kort beskrivning. Hanterar både säljbara id:n (lookup i
 * `lib/products.ts`) och de fall då AI:n refererar till en delkomponent
 * (t.ex. "the-one-facial-oil" som i dag bara säljs i DUO-kit).
 *
 * Används av både resultatsidan (`premium-report.tsx`) och PDF-exporten
 * (`premium-pdf-export.ts`) så att vi har EN sanningskälla för hur
 * produktnamn presenteras i premium-rapporten.
 */
import {
  PRODUCTS,
  getProduct,
  productDisplayName,
  productPrice,
  productShortDesc,
} from "@/lib/products";
import type { Locale } from "@/lib/i18n/types";

export interface PremiumProductView {
  /** Riktigt produktnamn (exempelvis "DUO-kit + TA-DA Serum"). */
  name: string;
  /** Pris i SEK eller EUR beroende på locale (kan vara null om fallback). */
  price: number | null;
  /** "kr" eller "€" beroende på locale. */
  currency: "kr" | "€";
  /** Kort beskrivning från PRODUCTS, eller null om fallback. */
  shortDesc: string | null;
  /** Bildsökväg från PRODUCTS, eller null om fallback. */
  image: string | null;
  /** Slug till produktsidan eller null om produkten inte säljs separat. */
  href: string | null;
  /** True om id:t finns i PRODUCTS (alltså går att köpa separat). */
  available: boolean;
}

/**
 * Fallback-namn för id:n som AI:n historiskt sett använt men som inte
 * finns som separat säljbar produkt. Vi behåller dessa så vi kan rendera
 * gamla analyser snyggt även om prompten ändras framöver.
 */
const NON_SELLABLE_FALLBACKS: Record<string, string> = {
  "the-one-facial-oil": "The ONE Facial Oil",
  "i-love-facial-oil": "I LOVE Facial Oil",
  "the-one-i-love-ta-da": "The ONE + I LOVE + TA-DA Serum",
  "duo-kit-ta-da": "DUO-kit + TA-DA Serum",
};

const PRODUCT_PATH: Record<Locale, string> = {
  sv: "/sv/produkter",
  en: "/en/products",
  es: "/es/productos",
  de: "/de/produkte",
  fr: "/fr/produits",
};

function prettifySlug(id: string): string {
  return id
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export function getPremiumProductView(
  id: string,
  locale: Locale
): PremiumProductView {
  const product = getProduct(id);
  if (product) {
    return {
      name: productDisplayName(product, locale),
      price: productPrice(product, locale),
      currency: locale === "sv" ? "kr" : "€",
      shortDesc: productShortDesc(product, locale),
      image: product.image || null,
      href: `${PRODUCT_PATH[locale]}/${product.id}`,
      available: true,
    };
  }
  const fallback = NON_SELLABLE_FALLBACKS[id] || prettifySlug(id);
  return {
    name: fallback,
    price: null,
    currency: locale === "sv" ? "kr" : "€",
    shortDesc: null,
    image: null,
    href: null,
    available: false,
  };
}

export { PRODUCTS };
