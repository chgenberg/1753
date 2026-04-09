"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Heart, Minus, Plus, RefreshCcw, Shield, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ReviewsSection } from "@/components/reviews-section";
import { SectionWrapper } from "@/components/section-wrapper";
import { useCart } from "@/providers/cart-provider";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/components/notification";
import { useRouter } from "next/navigation";
import { apiFetch, authFetch } from "@/lib/api";
import {
  getProduct,
  getRelatedProducts,
  productDescriptionHtml,
  productDisplayName,
  productGuarantee,
  productIngredients,
  productShortDesc,
  productSize,
  productPrice,
  productOriginalPrice,
} from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/locale-provider";

export default function ProductDetail({ id }: { id: string }) {
  const { t, path, locale } = useLocale();
  const loc = locale === "en" ? "en-GB" : "sv-SE";
  const product = getProduct(id);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [subInterval, setSubInterval] = useState(60);
  const [showSubOptions, setShowSubOptions] = useState(false);
  const { addItem } = useCart();
  const { token, isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);

  const [reviewStats, setReviewStats] = useState<{ count: number; avg: number } | null>(null);

  useEffect(() => {
    apiFetch<{ stats: { count: number; avg: number } }>(`/reviews/${id}?limit=1&offset=0`)
      .then((d) => setReviewStats(d.stats))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!isLoggedIn || !token) return;
    authFetch<{ product_id: string }[]>("/wishlist", token)
      .then((items) => setWishlisted(items.some((i) => i.product_id === id)))
      .catch(() => {});
  }, [isLoggedIn, token, id]);

  const displayName = product ? productDisplayName(product, locale) : "";

  const toggleWishlist = async () => {
    if (!isLoggedIn || !token) {
      router.push(path("login"));
      return;
    }
    try {
      if (wishlisted) {
        await authFetch(`/wishlist/${id}`, token, { method: "DELETE" });
        setWishlisted(false);
        showToast(t("productCard.wishlistToastRemoved"), "success");
      } else {
        await authFetch("/wishlist", token, { method: "POST", body: JSON.stringify({ productId: id }) });
        setWishlisted(true);
        showToast(t("productCard.wishlistToastAdded"), "success");
      }
    } catch {
      showToast(t("common.error"), "error");
    }
  };

  if (!product) return notFound();

  const related = getRelatedProducts(id, 4);
  const pname = productDisplayName(product, locale);
  const images = [
    { src: product.image, alt: pname },
    { src: product.imageAlt, alt: `${pname}${t("productDetail.lifestyleAltSuffix")}` },
  ];
  const price = productPrice(product, locale);
  const origPrice = productOriginalPrice(product, locale);
  const saveAmount = origPrice
    ? formatPrice(origPrice - price, locale)
    : "";
  const ingredients = productIngredients(product, locale);
  const descHtml = productDescriptionHtml(product, locale);
  const sizeLabel = productSize(product, locale);

  return (
    <>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <Link
            href={path("products")}
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-900"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("productDetail.backToProducts")}
          </Link>

          <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <div className="group relative aspect-square overflow-hidden rounded-3xl bg-brand-50 shadow-xl shadow-brand-900/5">
                <Image
                  src={images[activeImg].src}
                  alt={images[activeImg].alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
                {product.originalPrice && (
                  <span className="absolute left-4 top-4 rounded-full bg-brand-800 px-3 py-1 text-[11px] font-semibold text-white shadow-lg">
                    {t("productDetail.saveBadge", { amount: saveAmount })}
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={t("productDetail.showImage", { n: i + 1, alt: img.alt })}
                    aria-pressed={activeImg === i}
                    className={cn(
                      "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl ring-2 transition-all duration-200",
                      activeImg === i
                        ? "ring-brand-900 shadow-md"
                        : "ring-brand-100 hover:ring-brand-300"
                    )}
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => {
                    const avg = reviewStats?.avg ?? 5;
                    return (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.round(avg) ? "fill-amber-400 text-amber-400" : "fill-brand-100 text-brand-100"
                        )}
                      />
                    );
                  })}
                </div>
                <span className="text-sm text-brand-500">
                  {reviewStats
                    ? t("reviewsUi.reviewCountLabel", {
                        count: reviewStats.count.toLocaleString(loc),
                      })
                    : `${product.reviews} ${t("productDetail.reviewsLabel")}`}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{pname}</h1>
                <button
                  onClick={toggleWishlist}
                  aria-label={
                    wishlisted ? t("productCard.wishlistRemove") : t("productCard.wishlistAdd")
                  }
                  className="mt-1 flex-shrink-0 rounded-full p-2 transition-all hover:bg-brand-50"
                >
                  <Heart
                    className={cn(
                      "h-6 w-6 transition-colors",
                      wishlisted ? "fill-red-500 text-red-500" : "text-brand-300"
                    )}
                  />
                </button>
              </div>

              <p className="mt-3 text-base leading-relaxed text-brand-500">
                {productShortDesc(product, locale)}
              </p>

              <div className="mt-6 flex items-center gap-3">
                <span className="text-2xl font-bold">
                  {formatPrice(price, locale)}
                </span>
                {origPrice && (
                  <span className="text-lg text-brand-500 line-through">
                    {formatPrice(origPrice, locale)}
                  </span>
                )}
              </div>

              {sizeLabel && (
                <p className="mt-2 text-sm text-brand-500">{sizeLabel}</p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-brand-200 px-2">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label={t("productDetail.decQty")}
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-brand-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    aria-label={t("productDetail.incQty")}
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-brand-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    addItem(product.id, qty);
                    showToast(
                      t("productDetail.addedToCart", { name: displayName }),
                      "success"
                    );
                  }}
                >
                  {t("productDetail.addToCart")}
                </Button>
              </div>

              <div className="mt-3 overflow-hidden rounded-xl border-2 border-brand-200 bg-brand-50/30 transition-all">
                <button
                  type="button"
                  onClick={() => setShowSubOptions(!showSubOptions)}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-brand-900 transition-colors hover:bg-brand-100/50"
                >
                  <span className="flex items-center gap-2">
                    <RefreshCcw className="h-4 w-4" />
                    {t("productCard.subscribeSave")}
                  </span>
                  <span className="text-brand-600">
                    {formatPrice(Math.round(price * qty * 0.85), locale)}
                  </span>
                </button>

                {showSubOptions && (
                  <div className="border-t border-brand-200 bg-white px-4 py-4 space-y-4">
                    <p className="text-xs text-brand-500">{t("productDetail.chooseInterval")}</p>
                    <div className="flex gap-2">
                      {[30, 60, 90].map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setSubInterval(days)}
                          className={cn(
                            "flex-1 rounded-lg border-2 px-3 py-2.5 text-center text-sm font-medium transition-all",
                            subInterval === days
                              ? "border-brand-900 bg-brand-900 text-white shadow-md"
                              : "border-brand-200 text-brand-700 hover:border-brand-400"
                          )}
                        >
                          {days} {t("productDetail.days")}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        addItem(product.id, qty, { intervalDays: subInterval });
                        showToast(
                          t("productDetail.addedSubscription", { name: displayName }),
                          "success"
                        );
                        router.push(path("checkout"));
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-800 active:scale-[0.98]"
                    >
                      {t("productDetail.subscribeCta", {
                        price: formatPrice(Math.round(price * qty * 0.85), locale),
                        interval: String(subInterval),
                      })}
                    </button>
                    <p className="text-center text-[11px] text-brand-400">
                      {t("productDetail.subDisclaimer")}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-brand-500">
                  <Truck className="h-4 w-4" />
                  <span>{t("productDetail.freeShippingHint")}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-brand-500">
                  <Shield className="h-4 w-4" />
                  <span>{productGuarantee(product, locale)}</span>
                </div>
              </div>

              <div
                className="product-description mt-8 border-t border-brand-100 pt-6 text-[15px] leading-relaxed text-brand-600 [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:text-brand-900 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_li]:text-brand-600 [&_em]:text-brand-500 [&_strong]:font-semibold [&_strong]:text-brand-800"
                dangerouslySetInnerHTML={{ __html: descHtml }}
              />

              {ingredients && (
                <div className="mt-8 border-t border-brand-100 pt-6">
                  <h3 className="mb-2 text-sm font-bold tracking-tight">
                    {t("productDetail.ingredientsTitle")}
                  </h3>
                  <p className="text-sm leading-relaxed text-brand-500">{ingredients}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection productId={id} />

      {related.length > 0 && (
        <SectionWrapper alt>
          <h2 className="mb-8 text-3xl font-bold tracking-tight">
            {t("productDetail.relatedTitle")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </SectionWrapper>
      )}
    </>
  );
}