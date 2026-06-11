"use client";

import { ProductCard } from "@/components/product-card";
import { SectionWrapper } from "@/components/section-wrapper";
import { PRODUCTS } from "@/lib/products";
import { useLocale } from "@/providers/locale-provider";
import { Reveal, displayFont } from "@/components/fx/motion";
import { Pill } from "@/components/fx/frames";

export function ProductGrid() {
  const { t } = useLocale();

  return (
    <SectionWrapper>
      <Reveal className="mb-12 flex flex-col items-center text-center">
        <Pill>1753 Skincare</Pill>
        <h1 className={`${displayFont} mt-5 text-4xl tracking-[-0.01em] text-brand-900 md:text-6xl`}>
          {t("productsPage.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-brand-500">
          {t("productsPage.sub")}
        </p>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {PRODUCTS.map((product, i) => (
          <Reveal key={product.id} delay={(i % 4) * 80}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
