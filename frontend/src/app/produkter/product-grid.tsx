"use client";

import { ProductCard } from "@/components/product-card";
import { SectionWrapper } from "@/components/section-wrapper";
import { PRODUCTS } from "@/lib/products";

export function ProductGrid() {
  return (
    <SectionWrapper>
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-brand-900 md:text-4xl">
          Vårt sortiment
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-brand-500">
          Varje produkt är utvecklad för att stärka din hud inifrån.
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
