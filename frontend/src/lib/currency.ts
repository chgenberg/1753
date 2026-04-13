import type { Locale } from "@/lib/i18n/types";

export type Currency = "SEK" | "EUR";

export function getCurrency(locale: Locale): Currency {
  return locale === "sv" ? "SEK" : "EUR";
}

export function getVivaCurrencyCode(locale: Locale): number {
  return locale === "sv" ? 752 : 978;
}

/**
 * Format a price with correct symbol and placement for locale.
 * Swedish: "1 495 kr"   International/EUR: "€129"
 */
export function formatPrice(amount: number, locale: Locale): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  if (locale === "sv") {
    return `${safe.toLocaleString("sv-SE")} kr`;
  }
  return `\u20AC${safe.toLocaleString("en-GB")}`;
}

export const SHIPPING_COST = { SEK: 49, EUR: 5 } as const;

export function getShippingCost(locale: Locale): number {
  return locale === "sv" ? SHIPPING_COST.SEK : SHIPPING_COST.EUR;
}
