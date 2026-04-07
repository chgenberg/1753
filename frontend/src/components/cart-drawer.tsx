"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { PRODUCTS } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { items, removeItem, updateQty, isOpen, closeCart, totalItems } =
    useCart();

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
      const product = PRODUCTS.find((p) => p.id === item.id);
      return product ? { ...product, qty: item.qty } : null;
    })
    .filter(Boolean) as (typeof PRODUCTS[number] & { qty: number })[];

  const subtotal = cartProducts.reduce((s, p) => s + p.price * p.qty, 0);
  const freeShipping = subtotal >= 700;

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
            Varukorg ({totalItems})
          </h2>
          <button
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-brand-50"
            aria-label="Stäng varukorg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cartProducts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
            <ShoppingBag className="h-12 w-12 text-brand-300" />
            <p className="text-sm text-muted-foreground">
              Din varukorg är tom
            </p>
            <Button
              variant="outline"
              onClick={closeCart}
              className="rounded-xl"
            >
              Fortsätt handla
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="flex flex-col gap-4">
                {cartProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-4 rounded-xl border border-border p-3"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-brand-50">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-sm font-medium leading-tight">
                          {product.name}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {product.price.toLocaleString("sv-SE")} kr
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQty(product.id, product.qty - 1)
                            }
                            aria-label="Minska antal"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:bg-brand-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">
                            {product.qty}
                          </span>
                          <button
                            onClick={() =>
                              updateQty(product.id, product.qty + 1)
                            }
                            aria-label="Öka antal"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:bg-brand-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-brand-400 hover:bg-red-50 hover:text-red-500"
                          aria-label="Ta bort"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border px-6 py-5">
              {!freeShipping && (
                <p className="mb-3 text-center text-xs text-muted-foreground">
                  Handla för{" "}
                  {(700 - subtotal).toLocaleString("sv-SE")} kr till
                  för fri frakt
                </p>
              )}
              {freeShipping && (
                <p className="mb-3 text-center text-xs font-medium text-brand-700">
                  Fri frakt ingår
                </p>
              )}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium">Totalt</span>
                <span className="text-lg font-bold">
                  {subtotal.toLocaleString("sv-SE")} kr
                </span>
              </div>
              <Link href="/kassa" onClick={closeCart}>
                <Button className="w-full rounded-xl h-12 text-sm font-medium">
                  Till kassan
                </Button>
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
