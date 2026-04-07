import type { Metadata } from "next";
import { getProduct, PRODUCTS } from "@/lib/products";
import ProductDetail from "./product-detail";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) {
    return { title: "Produkten hittades inte" };
  }

  return {
    title: product.name,
    description: product.shortDesc,
    openGraph: {
      title: `${product.name} – 1753 SKINCARE`,
      description: product.shortDesc,
      images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
    },
  };
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const jsonLd = (() => {
    const product = getProduct(id);
    if (!product) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.shortDesc,
      image: `https://1753skincare.com${product.image}`,
      brand: { "@type": "Brand", name: "1753 SKINCARE" },
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "SEK",
        availability: "https://schema.org/InStock",
        url: `https://1753skincare.com/produkter/${product.id}`,
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
