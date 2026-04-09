"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, RefreshCcw, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart, type CartItem } from "@/providers/cart-provider";
import { PRODUCTS, productDisplayName, productPrice } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/locale-provider";

function productIdFromCartId(cartId: string) {
  return cartId.replace(/__sub$/, "");
}

export function CartDrawer() {
  const { items, removeItem, updateQty, isOpen, closeCart, totalItems } = useCart();
  const { t, path, locale } = useLocale();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  const cartProducts = items
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === productIdFromCartId(item.id));
      return product ? { ...product, cartId: item.id, qty: item.qty, subscription: item.subscription } : null;
    })
    .filter(Boolean) as (typeof PRODUCTS[number] & { cartId: string; qty: number; subscription?: CartItem["subscription"] })[];

  const subtotal = cartProducts.reduce((s, p) => {
    const base = productPrice(p, locale);
    const unitPrice = p.subscription ? Math.round(base * 0.85) : base;
    return s + unitPrice * p.qty;
  }, 0);
  const hasSubscription = cartProducts.some((p) => p.subscription);

  function subscriptionLabel(days: number) {
    if (locale === "en") {
      return t("cartDrawer.subscriptionOrdinal", { days });
    }
    return `Var ${days}:e dag`;
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />
      )}

      <aside
        className={cn(
          "fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <ShoppingBag className="h-5 w-5" />
            {t("cartDrawer.title")} ({totalItems})
          </h2>
          <button
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-brand-50"
            aria-label={t("cartDrawer.closeAria")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cartProducts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
            <ShoppingBag className="h-12 w-12 text-brand-300" />
            <p className="text-sm text-muted-foreground">
              {t("cartDrawer.empty")}
            </p>
            <Button
              variant="outline"
              onClick={closeCart}
              className="rounded-xl"
            >
              {t("cartDrawer.continue")}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="flex flex-col gap-4">
                {cartProducts.map((product) => {
                  const base = productPrice(product, locale);
                  const unitPrice = product.subscription
                    ? Math.round(base * 0.85)
                    : base;
                  const displayName = productDisplayName(product, locale);
                  return (
                    <div
                      key={product.cartId}
                      className={cn(
                        "flex gap-4 rounded-xl border p-3",
                        product.subscription
                          ? "border-brand-700/20 bg-brand-50/50"
                          : "border-border"
                      )}
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-brand-50">
                        <Image
                          src={product.image}
                          alt={displayName}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-sm font-medium leading-tight">
                            {displayName}
                          </p>
                          {product.subscription ? (
                            <div className="mt-1 flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 rounded-md bg-brand-800 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                <RefreshCcw className="h-2.5 w-2.5" />
                                {subscriptionLabel(product.subscription.intervalDays)}
                              </span>
                              <span className="text-xs font-medium text-green-700">-15%</span>
                            </div>
                          ) : null}
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {formatPrice(unitPrice, locale)}
                            {product.subscription && (
                              <span className="ml-1.5 text-xs line-through text-brand-400">
                                {formatPrice(base, locale)}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQty(product.cartId, product.qty - 1)
                              }
                              aria-label={t("cartDrawer.decreaseQty")}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:bg-brand-50"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">
                              {product.qty}
                            </span>
                            <button
                              onClick={() =>
                                updateQty(product.cartId, product.qty + 1)
                              }
                              aria-label={t("cartDrawer.increaseQty")}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:bg-brand-50"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(product.cartId)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-brand-400 hover:bg-red-50 hover:text-red-500"
                            aria-label={t("cartDrawer.remove")}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border px-6 py-5">
              <p className="mb-3 text-center text-xs font-medium text-brand-700">
                {t("cartDrawer.freeShippingLine")}
              </p>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium">{t("cartDrawer.total")}</span>
                <span className="text-lg font-bold">
                  {formatPrice(subtotal, locale)}
                </span>
              </div>
              <Link href={path("checkout")} onClick={closeCart}>
                <Button className="w-full rounded-xl h-12 text-sm font-medium">
                  {t("cartDrawer.checkout")}
                </Button>
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
