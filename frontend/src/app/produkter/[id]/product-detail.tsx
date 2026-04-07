"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Minus, Plus, RefreshCcw, Shield, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { SectionWrapper } from "@/components/section-wrapper";
import { useCart } from "@/providers/cart-provider";
import { useToast } from "@/components/notification";
import { useAuth } from "@/providers/auth-provider";
import { authFetch } from "@/lib/api";
import { getProduct, getRelatedProducts } from "@/lib/products";
import { cn } from "@/lib/utils";

export default function ProductDetail({ id }: { id: string }) {
  const product = getProduct(id);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [subscribing, setSubscribing] = useState(false);
  const [subInterval, setSubInterval] = useState(60);
  const [showSubOptions, setShowSubOptions] = useState(false);
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { isLoggedIn, token } = useAuth();

  if (!product) return notFound();

  const related = getRelatedProducts(id, 4);
  const images = [
    { src: product.image, alt: product.name },
    { src: product.imageAlt, alt: `${product.name} – lifestyle` },
  ];

  return (
    <>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <Link
            href="/produkter"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Tillbaka till produkter
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
                    Spara{" "}
                    {(product.originalPrice - product.price).toLocaleString(
                      "sv-SE"
                    )}{" "}
                    kr
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Visa bild ${i + 1}: ${img.alt}`}
                    aria-pressed={activeImg === i}
                    className={cn(
                      "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl ring-2 transition-all duration-200",
                      activeImg === i
                        ? "ring-brand-900 shadow-md"
                        : "ring-brand-100 hover:ring-brand-300"
                    )}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-brand-500">
                  {product.reviews} omdömen
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {product.name}
              </h1>

              <p className="mt-3 text-base leading-relaxed text-brand-500">
                {product.shortDesc}
              </p>

              <div className="mt-6 flex items-center gap-3">
                <span className="text-2xl font-bold">
                  {product.price.toLocaleString("sv-SE")} kr
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-brand-500 line-through">
                    {product.originalPrice.toLocaleString("sv-SE")} kr
                  </span>
                )}
              </div>

              {product.size && (
                <p className="mt-2 text-sm text-brand-500">
                  {product.size}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-brand-200 px-2">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Minska antal"
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-brand-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    aria-label="Öka antal"
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
                    showToast(`${product.name} tillagd i varukorgen`, "success");
                  }}
                >
                  Lägg i varukorg
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
                    Prenumerera &amp; spara 15%
                  </span>
                  <span className="text-brand-600">
                    {Math.round(product.price * qty * 0.85).toLocaleString("sv-SE")} kr
                  </span>
                </button>

                {showSubOptions && (
                  <div className="border-t border-brand-200 bg-white px-4 py-4 space-y-4">
                    <p className="text-xs text-brand-500">Valj leveransintervall:</p>
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
                          {days} dagar
                        </button>
                      ))}
                    </div>
                    <button
                      disabled={subscribing}
                      onClick={async () => {
                        if (!isLoggedIn || !token) {
                          window.location.href = "/logga-in";
                          return;
                        }
                        setSubscribing(true);
                        try {
                          const res = await authFetch<{ checkoutUrl: string }>("/subscriptions/create", token, {
                            method: "POST",
                            body: JSON.stringify({ productId: product.id, quantity: qty, intervalDays: subInterval }),
                          });
                          window.location.href = res.checkoutUrl;
                        } catch {
                          showToast("Kunde inte starta prenumeration", "error");
                          setSubscribing(false);
                        }
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-800 active:scale-[0.98] disabled:opacity-60"
                    >
                      {subscribing ? (
                        "Startar prenumeration..."
                      ) : (
                        <>
                          Starta prenumeration &ndash;{" "}
                          {Math.round(product.price * qty * 0.85).toLocaleString("sv-SE")} kr var {subInterval}:e dag
                        </>
                      )}
                    </button>
                    <p className="text-center text-[11px] text-brand-400">
                      Avbryt nar som helst. Ingen bindningstid.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-brand-500">
                  <Truck className="h-4 w-4" />
                  <span>Fri frakt över 700 kr</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-brand-500">
                  <Shield className="h-4 w-4" />
                  <span>{product.guarantee}</span>
                </div>
              </div>

              {product.ingredients && (
                <div className="mt-8 border-t border-brand-100 pt-6">
                  <h3 className="mb-2 text-sm font-bold tracking-tight">
                    Ingredienser
                  </h3>
                  <p className="text-sm leading-relaxed text-brand-500">
                    {product.ingredients}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <SectionWrapper alt>
          <h2 className="mb-8 text-3xl font-bold tracking-tight">
            Du kanske också gillar
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
