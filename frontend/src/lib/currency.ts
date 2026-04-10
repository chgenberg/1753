import type { Locale } from "@/lib/i18n/types";

export type Currency = "SEK" | "EUR";

export function getCurrency(locale: Locale): Currency {
  return locale === "en" ? "EUR" : "SEK";
}

export function getVivaCurrencyCode(locale: Locale): number {
  return locale === "en" ? 978 : 752;
}

/**
 * Format a price with correct symbol and placement for locale.
 * Swedish: "1 495 kr"   English/EUR: "€129"
 */
export function formatPrice(amount: number, locale: Locale): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  if (locale === "en") {
    return `€${safe.toLocaleString("en-GB")}`;
  }
  return `${safe.toLocaleString("sv-SE")} kr`;
}

export const SHIPPING_COST = { SEK: 49, EUR: 5 } as const;

export function getShippingCost(locale: Locale): number {
  return locale === "en" ? SHIPPING_COST.EUR : SHIPPING_COST.SEK;
}
