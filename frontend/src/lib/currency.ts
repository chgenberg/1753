import type { Locale } from "@/lib/i18n/types";

export type Currency = "SEK" | "EUR";

/**
 * Valutan som ordern debiteras i. Alltid SEK: Viva-kontot tar bara betalt i
 * kronor (Multicurrency är inte aktiverat). All prisräkning i butiken görs
 * därför i kronor för alla språk, precis som i det svenska flödet, och euro
 * visas bara som en ungefärlig omräkning.
 *
 * Servern stöder fortfarande "EUR" i /api/orders/create. Den dag Viva slår på
 * Multicurrency är det den här funktionen, productPrice() och formatPrice()
 * som ska ändras tillbaka.
 */
export function getCurrency(locale: Locale): Currency {
  void locale;
  return "SEK";
}

export function getVivaCurrencyCode(locale: Locale): number {
  void locale;
  return 752;
}

/**
 * Kurs för att visa ungefärliga europriser. ECB:s referenskurs 2026-11-18.
 * Det är bara en visningskurs: kunden debiteras alltid kronbeloppet och
 * kundens bank räknar om. Uppdatera om kronan rör sig mer än ett par procent.
 */
export const SEK_PER_EUR = 11.14;

/** Kronor till hela euro, för visning. */
export function sekToEur(amountSek: number): number {
  const safe = Number.isFinite(amountSek) ? amountSek : 0;
  return Math.round(safe / SEK_PER_EUR);
}

function numberLocale(locale: Locale): string {
  return locale === "es" ? "es-ES" : locale === "de" ? "de-DE" : locale === "fr" ? "fr-FR" : "en-GB";
}

/**
 * Exakt belopp i kronor, det som faktiskt debiteras.
 * Svenska: "1 495 kr"   Övriga språk: "1,495 SEK"
 */
export function formatSek(amountSek: number, locale: Locale): string {
  const safe = Number.isFinite(amountSek) ? amountSek : 0;
  if (locale === "sv") {
    return `${safe.toLocaleString("sv-SE")} kr`;
  }
  return `${safe.toLocaleString(numberLocale(locale))} SEK`;
}

/** Ungefärligt belopp i euro, utan tecknet ≈: "€134". */
export function formatEurApprox(amountSek: number, locale: Locale): string {
  return `€${sekToEur(amountSek).toLocaleString(numberLocale(locale))}`;
}

/**
 * Pris för visning i butiken. Beloppet anges alltid i kronor.
 * Svenska: "1 495 kr"   Övriga språk: "≈ €134" (ungefärlig omräkning)
 */
export function formatPrice(amountSek: number, locale: Locale): string {
  if (locale === "sv") {
    return formatSek(amountSek, locale);
  }
  const eur = sekToEur(amountSek);
  if (eur === 0) {
    // Några kronor blir noll hela euro. Skriv aldrig "€0" för ett belopp som inte är noll.
    return amountSek > 0 ? "< €1" : "€0";
  }
  return `≈ ${formatEurApprox(amountSek, locale)}`;
}

export const SHIPPING_COST = { SEK: 55, EUR: 6 } as const;
export const FREE_SHIPPING_THRESHOLD = { SEK: 600, EUR: 60 } as const;

/** Fraktkostnad i kronor. */
export function getShippingCost(locale: Locale): number {
  return SHIPPING_COST[getCurrency(locale)];
}

/** Gräns för fri frakt i kronor. */
export function getFreeShippingThreshold(locale: Locale): number {
  return FREE_SHIPPING_THRESHOLD[getCurrency(locale)];
}
