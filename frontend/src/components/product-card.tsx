"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/components/notification";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { productDisplayName, productShortDesc, productPrice, productOriginalPrice } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import { useLocale } from "@/providers/locale-provider";

export function ProductCard({
  product,
  className,
  priority = false,
}: {
  product: Product;
  className?: string;
  priority?: boolean;
}) {
  const { isWishlisted, toggle, isLoggedIn } = useWishlist();
  const { showToast } = useToast();
  const router = useRouter();
  const { path, t, locale } = useLocale();
  const inWishlist = isWishlisted(product.id);
  const name = productDisplayName(product, locale);
  const shortDesc = productShortDesc(product, locale);
  const price = productPrice(product, locale);
  const origPrice = productOriginalPrice(product, locale);

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push(path("login"));
      return;
    }
    const ok = await toggle(product.id);
    if (ok) {
      showToast(
        inWishlist ? t("productCard.wishlistToastRemoved") : t("productCard.wishlistToastAdded"),
        "success"
      );
    }
  };

  const href = path("product", { productId: product.id });

  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-100/80 transition-all duration-300 hover:shadow-xl hover:shadow-brand-900/5 hover:ring-brand-200",
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-50">
        <Image
          src={product.image}
          alt={name}
          fill
          priority={priority}
          className="object-cover transition-all duration-700 ease-out group-hover:opacity-0 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <Image
          src={product.imageAlt}
          alt={`${name}${t("productDetail.lifestyleAltSuffix")}`}
          fill
          className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
        {origPrice && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-800 px-3 py-1 text-[11px] font-semibold text-white shadow-lg">
            {t("productCard.save")}{" "}
            {formatPrice(origPrice - price, locale)}
          </span>
        )}
        <button
          onClick={handleWishlistClick}
          aria-label={inWishlist ? t("productCard.wishlistRemove") : t("productCard.wishlistAdd")}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
        >
          <Heart className={cn("h-4 w-4 transition-colors", inWishlist ? "fill-red-500 text-red-500" : "text-brand-400")} />
        </button>
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
          {name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-brand-500">
          {shortDesc}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-base font-bold text-brand-900">
            {formatPrice(price, locale)}
          </span>
          {origPrice && (
            <span className="text-xs font-medium text-brand-500 line-through">
              {formatPrice(origPrice, locale)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
