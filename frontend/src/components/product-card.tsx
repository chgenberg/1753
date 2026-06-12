"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/providers/cart-provider";
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
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const { path, t, locale } = useLocale();
  const inWishlist = isWishlisted(product.id);
  const name = productDisplayName(product, locale);
  const shortDesc = productShortDesc(product, locale);
  const price = productPrice(product, locale);
  const origPrice = productOriginalPrice(product, locale);
  const [justAdded, setJustAdded] = useState(false);

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id);
    openCart();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const href = path("product", { productId: product.id });

  return (
    <Link
      href={href}
      className={cn("group relative block", className)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#f5f5f7] shadow-sm transition-all duration-500 ease-out group-hover:shadow-xl group-hover:shadow-black/[0.08]">
        <Image
          src={product.image}
          alt={name}
          fill
          priority={priority}
          className="object-cover transition-all duration-700 ease-out group-hover:opacity-0 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <Image
          src={product.imageAlt}
          alt={`${name}${t("productDetail.lifestyleAltSuffix")}`}
          fill
          className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-black/5" />
        {origPrice && (
          <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 pt-[5px] pb-[3px] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1d1d1f] shadow-sm backdrop-blur-sm">
            {t("productCard.save")}{" "}
            {formatPrice(origPrice - price, locale)}
          </span>
        )}
        <button
          onClick={handleWishlistClick}
          aria-label={inWishlist ? t("productCard.wishlistRemove") : t("productCard.wishlistAdd")}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-md active:scale-90"
        >
          <Heart className={cn("h-4 w-4 transition-colors", inWishlist ? "fill-red-500 text-red-500" : "text-brand-400")} />
        </button>
        <button
          onClick={handleAddToCart}
          aria-label={t("productCard.addToCart")}
          className={cn(
            "absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all duration-300 active:scale-90",
            justAdded
              ? "bg-[#108474] text-white shadow-[#108474]/25"
              : "bg-white/90 text-[#1d1d1f] hover:bg-[#108474] hover:text-white hover:shadow-lg hover:shadow-[#108474]/20"
          )}
        >
          {justAdded ? (
            <Check className="h-4 w-4 animate-in zoom-in-50 duration-200" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </button>
      </div>
      <div className="px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-[family-name:var(--font-fraunces)] text-lg leading-snug tracking-[-0.01em] text-brand-900">
            {name}
          </h3>
          <div className="shrink-0 pt-1 text-right">
            <span className="text-sm font-medium text-brand-900">
              {formatPrice(price, locale)}
            </span>
            {origPrice && (
              <span className="ml-1.5 text-xs text-brand-400 line-through">
                {formatPrice(origPrice, locale)}
              </span>
            )}
          </div>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-brand-500">
          {shortDesc}
        </p>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3 w-3 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="text-[11px] font-medium text-brand-400">
            ({product.reviews})
          </span>
        </div>
      </div>
    </Link>
  );
}
