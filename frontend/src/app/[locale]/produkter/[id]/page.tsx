import type { Metadata } from "next";
import { getProduct, PRODUCTS, productDisplayName, productShortDesc, productPrice } from "@/lib/products";
import { getCurrency } from "@/lib/currency";
import ProductDetail from "./product-detail";
import { getMessages } from "@/lib/i18n/messages";
import { localizePath } from "@/lib/i18n/navigation";
import { locales, type Locale } from "@/lib/i18n/types";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const l = locale as Locale;
  const m = getMessages(l);
  const product = getProduct(id);
  if (!product) {
    return { title: m.productsSeo.notFoundTitle };
  }

  const name = productDisplayName(product, l);
  const desc = productShortDesc(product, l);

  const base = "https://www.1753skin.com";
  const productLangUrls = {
    sv: `${base}/sv/produkter/${id}`,
    en: `${base}/en/products/${id}`,
    es: `${base}/es/productos/${id}`,
    de: `${base}/de/produkte/${id}`,
    fr: `${base}/fr/produits/${id}`,
  };
  const canonical = productLangUrls[l] ?? productLangUrls.en;

  return {
    title: name,
    description: desc,
    openGraph: {
      title: `${name} – 1753 SKINCARE`,
      description: desc,
      images: [{ url: product.image, width: 800, height: 800, alt: name }],
    },
    alternates: {
      canonical,
      languages: {
        sv: productLangUrls.sv,
        en: productLangUrls.en,
        es: productLangUrls.es,
        de: productLangUrls.de,
        fr: productLangUrls.fr,
        "x-default": productLangUrls.en,
      },
    },
  };
}

export function generateStaticParams() {
  return locales.flatMap((locale) => PRODUCTS.map((p) => ({ locale, id: p.id })));
}

const SITE_ORIGIN = "https://www.1753skin.com";

const COUNTRY_CODE: Record<string, string> = { sv: "SE", en: "GB", es: "ES", de: "DE", fr: "FR" };

function tx(locale: string, sv: string, en: string, es?: string, de?: string, fr?: string): string {
  if (locale === "sv") return sv;
  if (locale === "es") return es || en;
  if (locale === "de") return de || en;
  if (locale === "fr") return fr || en;
  return en;
}

export default async function ProductPage({ params }: Props) {
  const { id, locale } = await params;
  const l = locale as Locale;

  const jsonLd = (() => {
    const product = getProduct(id);
    if (!product) return null;
    const path = localizePath(l, "product", { productId: product.id });
    const name = productDisplayName(product, l);
    const currency = getCurrency(l);
    const price = productPrice(product, l);

    const schema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name,
      description: productShortDesc(product, l),
      image: `${SITE_ORIGIN}${product.image}`,
      sku: product.articleNumber,
      category: tx(l, "Hudvard", "Skincare", "Cuidado de la piel", "Hautpflege", "Soins de la peau"),
      brand: { "@type": "Brand", name: "1753 SKINCARE" },
      manufacturer: { "@type": "Organization", "@id": "https://www.1753skin.com/#organization" },
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: currency,
        availability: "https://schema.org/InStock",
        url: `${SITE_ORIGIN}${path}`,
        seller: { "@type": "Organization", "@id": "https://www.1753skin.com/#organization" },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: { "@type": "MonetaryAmount", value: "0", currency },
          shippingDestination: { "@type": "DefinedRegion", addressCountry: COUNTRY_CODE[l] || "GB" },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "d" },
            transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "d" },
          },
        },
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "SE",
          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 30,
          returnMethod: "https://schema.org/ReturnByMail",
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        bestRating: "5",
        worstRating: "1",
        reviewCount: String(product.reviews),
      },
    };

    if (product.size) schema.weight = product.size;
    if (product.ingredients) {
      schema.additionalProperty = {
        "@type": "PropertyValue",
        name: tx(l, "Ingredienser", "Ingredients", "Ingredientes", "Inhaltsstoffe", "Ingrédients"),
        value: product.ingredients,
      };
    }

    return schema;
  })();

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetail id={id} />
    </>
  );
}
