"use client";

import Image from "next/image";
import { Gift, Sparkles } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { useLocale } from "@/providers/locale-provider";
import { PRODUCTS, productDisplayName, productPrice } from "@/lib/products";
import { formatPrice, getCurrency } from "@/lib/currency";
import {
  GIFT_PRODUCT_ID,
  GIFT_THRESHOLD,
  UPGRADE_ADDON_ID,
  UPGRADE_FROM_ID,
  UPGRADE_TO_ID,
} from "@/lib/gift";
import { cn } from "@/lib/utils";

function productIdFromCartId(cartId: string) {
  return cartId.replace(/__sub$/, "");
}

function findProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function DuoUpgrade({ className }: { className?: string }) {
  const { items, replaceItem } = useCart();
  const { t, locale } = useLocale();

  const line = items.find((i) => productIdFromCartId(i.id) === UPGRADE_FROM_ID);
  const from = findProduct(UPGRADE_FROM_ID);
  const to = findProduct(UPGRADE_TO_ID);
  const addon = findProduct(UPGRADE_ADDON_ID);
  if (!line || !from || !to || !addon) return null;

  const unit = (price: number) => (line.subscription ? Math.round(price * 0.85) : price);
  const extra = (unit(productPrice(to, locale)) - unit(productPrice(from, locale))) * line.qty;
  if (extra <= 0) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#108474]/20 bg-[#108474]/[0.04] p-4",
        className
      )}
    >
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#108474]">
        <Sparkles className="h-3 w-3" aria-hidden />
        {t("cartBoost.upgradeKicker")}
      </p>
      <p className="mt-1.5 text-sm font-semibold text-[#1d1d1f]">
        {t("cartBoost.upgradeTitle", { product: productDisplayName(to, locale) })}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-[#515151]">
        {t("cartBoost.upgradeBody", {
          amount: formatPrice(extra, locale),
          regular: formatPrice(productPrice(addon, locale), locale),
        })}
      </p>
      <button
        type="button"
        onClick={() => replaceItem(line.id, UPGRADE_TO_ID)}
        className="mt-3 w-full rounded-full bg-[#108474] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#0d6e62] hover:shadow-md active:scale-[0.98] cursor-pointer"
      >
        {t("cartBoost.upgradeCta")} · +{formatPrice(extra, locale)}
      </button>
    </div>
  );
}

export function giftUnlocked(amount: number, locale: Parameters<typeof getCurrency>[0]) {
  return amount >= GIFT_THRESHOLD[getCurrency(locale)];
}

export function GiftProgress({ amount, className }: { amount: number; className?: string }) {
  const { t, locale } = useLocale();
  const gift = findProduct(GIFT_PRODUCT_ID);
  if (!gift) return null;

  const threshold = GIFT_THRESHOLD[getCurrency(locale)];
  const unlocked = amount >= threshold;
  const progress = Math.min(1, Math.max(0, amount / threshold));
  const name = productDisplayName(gift, locale);

  return (
    <div className={cn("text-xs", className)}>
      <p className="flex items-center justify-center gap-1.5 text-center font-medium text-brand-700">
        <Gift className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {unlocked
          ? t("cartBoost.giftUnlocked", { product: name })
          : t("cartBoost.giftProgress", { amount: formatPrice(threshold - amount, locale), product: name })}
      </p>
      <div
        className="mt-2 h-1 w-full overflow-hidden rounded-full bg-brand-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={threshold}
        aria-valuenow={Math.min(amount, threshold)}
        aria-label={name}
      >
        <div
          className="h-full rounded-full bg-[#108474] transition-[width] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

export function GiftLine({ amount }: { amount: number }) {
  const { t, locale } = useLocale();
  const gift = findProduct(GIFT_PRODUCT_ID);
  if (!gift || !giftUnlocked(amount, locale)) return null;
  const name = productDisplayName(gift, locale);

  return (
    <div className="flex gap-3">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-[#f5f5f7] ring-1 ring-inset ring-black/5">
        <Image src={gift.image} alt={name} fill className="object-cover" sizes="64px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-[#766a62] px-1.5 py-0.5 text-[10px] font-semibold text-white">
          <Gift className="h-2.5 w-2.5" aria-hidden />
          {t("cartBoost.giftLabel")}
        </span>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-medium">{formatPrice(0, locale)}</p>
        <p className="text-xs text-brand-400 line-through">{formatPrice(productPrice(gift, locale), locale)}</p>
      </div>
    </div>
  );
}
