"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, CreditCard, Gift, Lock, RefreshCcw, ShieldCheck, Tag, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "@/providers/cart-provider";
import { PRODUCTS, productDisplayName, productPrice } from "@/lib/products";
import { formatPrice, getCurrency, getShippingCost } from "@/lib/currency";
import { apiFetch } from "@/lib/api";
import { useLocale } from "@/providers/locale-provider";

function productIdFromCartId(cartId: string) {
  return cartId.replace(/__sub$/, "");
}

interface ActiveDiscount {
  code: string;
  percent: number;
  fixedAmount?: number;
  description: string;
  applicableProductIds: string[] | null;
}

export default function CheckoutPage() {
  const { t, path, locale, homeHash } = useLocale();
  const currency = getCurrency(locale);
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [discountLoading, setDiscountLoading] = useState(false);
  const [activeDiscount, setActiveDiscount] = useState<ActiveDiscount | null>(null);
  const [createAccount, setCreateAccount] = useState(false);
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
    const base = productPrice(p, locale);
    const unitPrice = p.subscription ? Math.round(base * 0.85) : base;
    return s + unitPrice * p.qty;
  }, 0);

  const discountAmount = activeDiscount
    ? activeDiscount.fixedAmount
      ? activeDiscount.fixedAmount
      : cartProducts.reduce((s, p) => {
          const realId = productIdFromCartId(p.cartId);
          const base = productPrice(p, locale);
          const unitPrice = p.subscription ? Math.round(base * 0.85) : base;
          if (!activeDiscount.applicableProductIds || activeDiscount.applicableProductIds.includes(realId)) {
            return s + Math.round(unitPrice * p.qty * (activeDiscount.percent / 100));
          }
          return s;
        }, 0)
    : 0;

  const discountedSubtotal = subtotal - discountAmount;
  const FREE_SHIPPING_THRESHOLD = 0;
  const freeShipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = freeShipping ? 0 : getShippingCost(locale);
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
      const msg = err instanceof Error ? err.message : t("checkout.invalidDiscount");
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
      setError(t("checkout.phoneError"));
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
            currency,
            createAccount: createAccount || undefined,
          }),
        }
      );
      if (data.orderNumber) {
        sessionStorage.setItem("1753_orderNumber", data.orderNumber);
      }
      window.location.href = data.checkoutUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("common.error");
      setError(msg);
      setLoading(false);
    }
  };

  if (cartProducts.length === 0) {
    return (
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("checkout.emptyTitle")}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {t("checkout.emptySub")}
          </p>
          <Link href={homeHash("#produkter")}>
            <Button className="mt-6 rounded-xl h-12 px-8">
              {t("home.ctaProducts")}
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
          href={path("home")}
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("checkout.back")}
        </Link>

        <h1 className="mb-8 text-3xl font-bold tracking-tight">{t("checkout.title")}</h1>

        <div className="grid gap-10 lg:grid-cols-5">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            <h2 className="text-lg font-bold tracking-tight">
              {t("checkout.yourDetails")}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {t("checkout.firstName")}
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
                  placeholder={t("checkout.firstName")}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {t("checkout.lastName")}
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
                  placeholder={t("checkout.lastName")}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                {t("checkout.email")}
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
                placeholder={t("checkout.email")}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                {t("checkout.phone")}
              </label>
              <input
                type="tel"
                required
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                placeholder={t("checkout.phone")}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                {t("checkout.address")}
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
                placeholder={t("checkout.address")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {t("checkout.zip")}
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
                  placeholder={t("checkout.zip")}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {t("checkout.city")}
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
                  placeholder={t("checkout.city")}
                />
              </div>
            </div>

            {hasSubscription && (
              <div id="prenumerationsvillkor" className="rounded-xl border-2 border-brand-800/20 bg-brand-50/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-900">
                  <RefreshCcw className="h-4 w-4" />
                  {t("checkout.subscriptionHeadingShort")}
                </div>
                <ul className="space-y-1 text-xs leading-relaxed text-brand-600">
                  {cartProducts
                    .filter((p) => p.subscription)
                    .map((p) => {
                      const name = productDisplayName(p, locale);
                      const interval = p.subscription!.intervalDays;
                      const base = productPrice(p, locale);
                      const unit = Math.round(base * 0.85);
                      return (
                        <li key={p.cartId}>
                          <strong>{name}</strong>{" "}
                          {t("checkout.subBulletAuto", {
                            interval: String(interval),
                            price: formatPrice(unit, locale),
                          })}
                        </li>
                      );
                    })}
                  <li>{t("checkout.subBulletFirst")}</li>
                  <li>{t("checkout.subBulletAccount")}</li>
                  <li>{t("checkout.subBulletNoBinding")}</li>
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
                {t("checkout.termsLabel")}{" "}
                <Link
                  href={path("terms")}
                  target="_blank"
                  className="font-medium text-brand-900 underline underline-offset-2"
                >
                  {t("checkout.termsLink")}
                </Link>{" "}
                {t("checkout.termsAnd")}{" "}
                <Link
                  href={path("privacy")}
                  target="_blank"
                  className="font-medium text-brand-900 underline underline-offset-2"
                >
                  {t("checkout.privacyLink")}
                </Link>
                {hasSubscription && (
                  <>
                    {" "}
                    {t("checkout.subTerms")}
                  </>
                )}
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3 transition-colors hover:bg-brand-50/70">
              <input
                type="checkbox"
                checked={createAccount}
                onChange={(e) => setCreateAccount(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-brand-300 accent-brand-900"
              />
              <div>
                <span className="text-sm font-medium leading-relaxed text-brand-900">
                  {t("checkout.createAccountLabel")}
                </span>
                <p className="mt-0.5 text-xs leading-relaxed text-brand-500">
                  {t("checkout.createAccountHint")}
                </p>
              </div>
            </label>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {hasSubscription && (
              <div className="flex gap-3 rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm leading-relaxed text-brand-700 shadow-sm ring-1 ring-brand-100/80">
                <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-brand-900" aria-hidden />
                <p>{t("checkout.subscriptionCardOnly")}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-13 w-full rounded-xl px-8 text-sm font-medium active:scale-[0.98]"
            >
              {loading ? (
                t("checkout.processing")
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  {t("checkout.payWithTotal", { amount: formatPrice(total, locale) })}
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t("checkout.secureHint")}
              </span>
              <span className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5" />
                {freeShipping ? t("checkout.freeShipping") : t("checkout.shippingPaidAmount")}
              </span>
            </div>
          </form>

          <aside className="rounded-2xl border border-border bg-brand-50/40 p-6 lg:col-span-2 self-start">
            <h2 className="mb-4 text-lg font-bold tracking-tight">
              {t("checkout.orderAsideTitle")}
            </h2>
            <div className="flex flex-col gap-4">
              {cartProducts.map((p) => {
                const base = productPrice(p, locale);
                const unitPrice = p.subscription ? Math.round(base * 0.85) : base;
                return (
                  <div key={p.cartId} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-black/5">
                      <Image
                        src={p.image}
                        alt={productDisplayName(p, locale)}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{productDisplayName(p, locale)}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.qty} {t("checkout.qtyUnit")}
                      </p>
                      {p.subscription && (
                        <span className="mt-0.5 inline-flex items-center gap-1 rounded-md bg-brand-800 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          <RefreshCcw className="h-2.5 w-2.5" />
                          {t("cartDrawer.subscriptionOrdinal", {
                            days: p.subscription.intervalDays,
                          })}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatPrice(unitPrice * p.qty, locale)}
                      </p>
                      {p.subscription && (
                        <p className="text-xs text-brand-400 line-through">
                          {formatPrice(base * p.qty, locale)}
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
                    aria-label={t("checkout.removeDiscountAria")}
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
                        placeholder={t("checkout.discountPlaceholder")}
                        className="w-full rounded-xl border border-input bg-background py-2.5 pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleApplyDiscount}
                      disabled={discountLoading || !discountInput.trim()}
                      className="rounded-xl border border-brand-200 bg-brand-50 px-4 text-sm font-medium text-brand-900 transition-colors hover:bg-brand-100 disabled:opacity-50"
                    >
                      {discountLoading ? "..." : t("checkout.applyDiscount")}
                    </button>
                  </div>
                  {discountError && (
                    <p className="mt-1.5 text-xs text-red-600">{discountError}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("checkout.subtotal")}</span>
                  <span>{formatPrice(subtotal, locale)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-700">
                    <span>{t("checkout.discount")}</span>
                    <span>-{formatPrice(discountAmount, locale)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("checkout.shipping")}</span>
                  <span>
                    {freeShipping ? t("checkout.freeShipping") : t("checkout.shippingPaidAmount")}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                  <span>{t("checkout.total")}</span>
                  <span>{formatPrice(total, locale)}</span>
                </div>
              </div>

              <Link
                href={path("loyalty")}
                className="mt-5 flex items-start gap-3 rounded-xl bg-brand-900/[0.04] p-3.5 transition-colors hover:bg-brand-900/[0.08] group"
              >
                <Gift className="mt-0.5 h-4 w-4 shrink-0 text-brand-700 group-hover:text-green" />
                <div className="text-xs leading-relaxed text-brand-600">
                  <span className="font-semibold text-brand-900">{t("checkout.loyaltyTitle")}</span>{" "}
                  {t("checkout.loyaltyDesc", { points: String(total) })}
                </div>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
