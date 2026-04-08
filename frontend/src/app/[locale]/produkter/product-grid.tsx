"use client";

import { ProductCard } from "@/components/product-card";
import { SectionWrapper } from "@/components/section-wrapper";
import { PRODUCTS } from "@/lib/products";
import { useLocale } from "@/providers/locale-provider";

export function ProductGrid() {
  const { t } = useLocale();

  return (
    <SectionWrapper>
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-brand-900 md:text-4xl">
          {t("home.sortimentTitle")}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-brand-500">
          {t("home.sortimentSub")}
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </SectionWrapper>
  );
}
