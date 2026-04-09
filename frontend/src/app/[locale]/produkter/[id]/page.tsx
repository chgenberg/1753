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

  return {
    title: name,
    description: desc,
    openGraph: {
      title: `${name} – 1753 SKINCARE`,
      description: desc,
      images: [{ url: product.image, width: 800, height: 800, alt: name }],
    },
  };
}

export function generateStaticParams() {
  return locales.flatMap((locale) => PRODUCTS.map((p) => ({ locale, id: p.id })));
}

const SITE_ORIGIN = "https://www.1753skin.com";

export default async function ProductPage({ params }: Props) {
  const { id, locale } = await params;
  const l = locale as Locale;

  const jsonLd = (() => {
    const product = getProduct(id);
    if (!product) return null;
    const path = localizePath(l, "product", { productId: product.id });
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productDisplayName(product, l),
      description: productShortDesc(product, l),
      image: `${SITE_ORIGIN}${product.image}`,
      brand: { "@type": "Brand", name: "1753 SKINCARE" },
      offers: {
        "@type": "Offer",
        price: productPrice(product, l),
        priceCurrency: getCurrency(l),
        availability: "https://schema.org/InStock",
        url: `${SITE_ORIGIN}${path}`,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: String(product.reviews),
      },
    };
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
