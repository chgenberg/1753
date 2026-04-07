"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

export function ProductCard({
  product,
  className,
  priority = false,
}: {
  product: Product;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/produkter/${product.id}`}
      className={cn(
        "group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-100/80 transition-all duration-300 hover:shadow-xl hover:shadow-brand-900/5 hover:ring-brand-200",
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          className="object-cover transition-all duration-700 ease-out group-hover:opacity-0 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <Image
          src={product.imageAlt}
          alt={`${product.name} – lifestyle`}
          fill
          className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
        {product.originalPrice && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-800 px-3 py-1 text-[11px] font-semibold text-white shadow-lg">
            Spara{" "}
            {(product.originalPrice - product.price).toLocaleString("sv-SE")} kr
          </span>
        )}
      </div>
      <div className="p-4 pb-5">
        <div className="mb-2 flex items-center gap-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="text-xs font-medium text-brand-500">
            ({product.reviews})
          </span>
        </div>
        <h3 className="text-sm font-semibold tracking-tight text-brand-900">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-brand-500">
          {product.shortDesc}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-base font-bold text-brand-900">
            {product.price.toLocaleString("sv-SE")} kr
          </span>
          {product.originalPrice && (
            <span className="text-xs font-medium text-brand-500 line-through">
              {product.originalPrice.toLocaleString("sv-SE")} kr
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
