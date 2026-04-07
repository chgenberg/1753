"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Lock, RefreshCcw, ShieldCheck, Tag, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "@/providers/cart-provider";
import { PRODUCTS } from "@/lib/products";
import { apiFetch } from "@/lib/api";

function productIdFromCartId(cartId: string) {
  return cartId.replace(/__sub$/, "");
}

interface ActiveDiscount {
  code: string;
  percent: number;
  description: string;
  applicableProductIds: string[] | null;
}

export default function CheckoutPage() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [discountLoading, setDiscountLoading] = useState(false);
  const [activeDiscount, setActiveDiscount] = useState<ActiveDiscount | null>(null);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    zip: "",
    city: "",
  });

  const cartProducts = items
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === productIdFromCartId(item.id));
      return product ? { ...product, cartId: item.id, qty: item.qty, subscription: item.subscription } : null;
    })
    .filter(Boolean) as (typeof PRODUCTS[number] & { cartId: string; qty: number; subscription?: CartItem["subscription"] })[];

  const hasSubscription = cartProducts.some((p) => p.subscription);

  const subtotal = cartProducts.reduce((s, p) => {
    const unitPrice = p.subscription ? Math.round(p.price * 0.85) : p.price;
    return s + unitPrice * p.qty;
  }, 0);

  const discountAmount = activeDiscount
    ? cartProducts.reduce((s, p) => {
        const realId = productIdFromCartId(p.cartId);
        const unitPrice = p.subscription ? Math.round(p.price * 0.85) : p.price;
        if (!activeDiscount.applicableProductIds || activeDiscount.applicableProductIds.includes(realId)) {
          return s + Math.round(unitPrice * p.qty * (activeDiscount.percent / 100));
        }
        return s;
      }, 0)
    : 0;

  const discountedSubtotal = subtotal - discountAmount;
  const FREE_SHIPPING_THRESHOLD = 0;
  const freeShipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = freeShipping ? 0 : 49;
  const total = discountedSubtotal + shipping;

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) return;
    setDiscountError("");
    setDiscountLoading(true);
    try {
      const data = await apiFetch<ActiveDiscount>("/discount/validate", {
        method: "POST",
        body: JSON.stringify({ code: discountInput, items: items.map((i) => ({ id: productIdFromCartId(i.id), qty: i.qty })) }),
      });
      setActiveDiscount(data);
      setDiscountInput("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ogiltig rabattkod";
      setDiscountError(msg);
    } finally {
      setDiscountLoading(false);
    }
  };

  const abandonSent = useRef(false);

  useEffect(() => {
    if (!form.email || !form.email.includes("@") || items.length === 0 || abandonSent.current) return;
    const timer = setTimeout(() => {
      if (abandonSent.current) return;
      abandonSent.current = true;
      apiFetch("/automation/event", {
        method: "POST",
        body: JSON.stringify({
          event: "cart_abandoned",
          email: form.email,
          context: { firstName: form.firstname, items: items.map((i) => ({ id: productIdFromCartId(i.id), qty: i.qty })) },
        }),
      }).catch(() => {});
    }, 60_000);
    return () => clearTimeout(timer);
  }, [form.email, form.firstname, items]);

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    setForm((prev) => ({ ...prev, phone: formatPhone(digits) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setError("Ange ett giltigt mobilnummer (10 siffror).");
      setLoading(false);
      return;
    }

    try {
      const data = await apiFetch<{ checkoutUrl: string; orderNumber: string }>(
        "/orders/create",
        {
          method: "POST",
          body: JSON.stringify({
            customer: {
              name: `${form.firstname} ${form.lastname}`.trim(),
              email: form.email,
              phone: phoneDigits,
            },
            deliveryAddress: {
              address: form.address,
              zip: form.zip.replace(/\s/g, ""),
              city: form.city,
            },
            items: items.map((i) => ({
              id: productIdFromCartId(i.id),
              qty: i.qty,
              subscription: i.subscription || undefined,
            })),
            discountCode: activeDiscount?.code || undefined,
          }),
        }
      );
      if (data.orderNumber) {
        sessionStorage.setItem("1753_orderNumber", data.orderNumber);
      }
      window.location.href = data.checkoutUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Något gick fel";
      setError(msg);
      setLoading(false);
    }
  };

  if (cartProducts.length === 0) {
    return (
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Din varukorg är tom
          </h1>
          <p className="mt-3 text-muted-foreground">
            Lägg till produkter innan du går till kassan.
          </p>
          <Link href="/#produkter">
            <Button className="mt-6 rounded-xl h-12 px-8">
              Se produkter
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Tillbaka
        </Link>

        <h1 className="mb-8 text-3xl font-bold tracking-tight">Kassa</h1>

        <div className="grid gap-10 lg:grid-cols-5">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            <h2 className="text-lg font-bold tracking-tight">
              Dina uppgifter
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Förnamn
                </label>
                <input
                  type="text"
                  required
                  autoComplete="given-name"
                  value={form.firstname}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, firstname: e.target.value }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                  placeholder="Ditt förnamn"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Efternamn
                </label>
                <input
                  type="text"
                  required
                  autoComplete="family-name"
                  value={form.lastname}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, lastname: e.target.value }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                  placeholder="Ditt efternamn"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                E-post
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                placeholder="christopher@1753skincare.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Mobilnummer
              </label>
              <input
                type="tel"
                required
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                placeholder="0732-305 521"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Adress
              </label>
              <input
                type="text"
                required
                autoComplete="street-address"
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                placeholder="Södra Skjutbanevägen 10"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Postnummer
                </label>
                <input
                  type="text"
                  required
                  autoComplete="postal-code"
                  value={form.zip}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, zip: e.target.value }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                  placeholder="439 55"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Ort
                </label>
                <input
                  type="text"
                  required
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, city: e.target.value }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                  placeholder="Åsa"
                />
              </div>
            </div>

            {hasSubscription && (
              <div className="rounded-xl border-2 border-brand-800/20 bg-brand-50/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-900">
                  <RefreshCcw className="h-4 w-4" />
                  Prenumerationsvillkor
                </div>
                <ul className="space-y-1 text-xs leading-relaxed text-brand-600">
                  {cartProducts
                    .filter((p) => p.subscription)
                    .map((p) => (
                      <li key={p.cartId}>
                        <strong>{p.name}</strong> levereras automatiskt var {p.subscription!.intervalDays}:e dag till 15% rabatt ({Math.round(p.price * 0.85).toLocaleString("sv-SE")} kr/st).
                      </li>
                    ))}
                  <li>Första leveransen betalas nu. Efterföljande dras automatiskt.</li>
                  <li>Du kan ändra intervall, pausa eller avbryta när som helst via Mitt konto.</li>
                  <li>Ingen bindningstid.</li>
                </ul>
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-brand-300 accent-brand-900"
              />
              <span className="text-sm leading-relaxed text-brand-600">
                Jag godkänner{" "}
                <Link
                  href="/villkor"
                  target="_blank"
                  className="font-medium text-brand-900 underline underline-offset-2"
                >
                  köpvillkoren
                </Link>{" "}
                och{" "}
                <Link
                  href="/integritetspolicy"
                  target="_blank"
                  className="font-medium text-brand-900 underline underline-offset-2"
                >
                  integritetspolicyn
                </Link>
                {hasSubscription && " samt prenumerationsvillkoren ovan"}
              </span>
            </label>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-13 w-full rounded-xl px-8 text-sm font-medium active:scale-[0.98]"
            >
              {loading ? (
                "Bearbetar..."
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Betala {total.toLocaleString("sv-SE")} kr
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Säker betalning
              </span>
              <span className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5" />
                {freeShipping ? "Fri frakt" : "Frakt 49 kr"}
              </span>
            </div>
          </form>

          <aside className="rounded-2xl border border-border bg-brand-50/40 p-6 lg:col-span-2 self-start">
            <h2 className="mb-4 text-lg font-bold tracking-tight">
              Din beställning
            </h2>
            <div className="flex flex-col gap-4">
              {cartProducts.map((p) => {
                const unitPrice = p.subscription ? Math.round(p.price * 0.85) : p.price;
                return (
                  <div key={p.cartId} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-black/5">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.qty} st
                      </p>
                      {p.subscription && (
                        <span className="mt-0.5 inline-flex items-center gap-1 rounded-md bg-brand-800 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          <RefreshCcw className="h-2.5 w-2.5" />
                          Var {p.subscription.intervalDays}:e dag
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {(unitPrice * p.qty).toLocaleString("sv-SE")} kr
                      </p>
                      {p.subscription && (
                        <p className="text-xs text-brand-400 line-through">
                          {(p.price * p.qty).toLocaleString("sv-SE")} kr
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 border-t border-border pt-4">
              {activeDiscount ? (
                <div className="mb-4 flex items-center justify-between rounded-xl bg-green-50 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        {activeDiscount.code.toUpperCase()}
                      </p>
                      <p className="text-xs text-green-600">
                        {activeDiscount.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveDiscount(null)}
                    aria-label="Ta bort rabattkod"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-green-600 hover:bg-green-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-500" />
                      <input
                        type="text"
                        value={discountInput}
                        onChange={(e) => {
                          setDiscountInput(e.target.value);
                          setDiscountError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyDiscount()}
                        placeholder="Rabattkod"
                        className="w-full rounded-xl border border-input bg-background py-2.5 pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleApplyDiscount}
                      disabled={discountLoading || !discountInput.trim()}
                      className="rounded-xl border border-brand-200 bg-brand-50 px-4 text-sm font-medium text-brand-900 transition-colors hover:bg-brand-100 disabled:opacity-50"
                    >
                      {discountLoading ? "..." : "Använd"}
                    </button>
                  </div>
                  {discountError && (
                    <p className="mt-1.5 text-xs text-red-600">{discountError}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delsumma</span>
                  <span>{subtotal.toLocaleString("sv-SE")} kr</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-700">
                    <span>Rabatt</span>
                    <span>-{discountAmount.toLocaleString("sv-SE")} kr</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frakt</span>
                  <span>{freeShipping ? "Fri frakt" : "49 kr"}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                  <span>Totalt</span>
                  <span>{total.toLocaleString("sv-SE")} kr</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
