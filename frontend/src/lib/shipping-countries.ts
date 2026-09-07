import type { Locale } from "@/lib/i18n/types";

export type ShipCountry = {
  code: string;
  calling: string;
  names: Record<Locale, string>;
};

export const SHIP_COUNTRIES: ShipCountry[] = [
  { code: "SE", calling: "46", names: { sv: "Sverige", en: "Sweden", es: "Suecia", de: "Schweden", fr: "Suède" } },
  { code: "AT", calling: "43", names: { sv: "Österrike", en: "Austria", es: "Austria", de: "Österreich", fr: "Autriche" } },
  { code: "BE", calling: "32", names: { sv: "Belgien", en: "Belgium", es: "Bélgica", de: "Belgien", fr: "Belgique" } },
  { code: "BG", calling: "359", names: { sv: "Bulgarien", en: "Bulgaria", es: "Bulgaria", de: "Bulgarien", fr: "Bulgarie" } },
  { code: "CH", calling: "41", names: { sv: "Schweiz", en: "Switzerland", es: "Suiza", de: "Schweiz", fr: "Suisse" } },
  { code: "CY", calling: "357", names: { sv: "Cypern", en: "Cyprus", es: "Chipre", de: "Zypern", fr: "Chypre" } },
  { code: "CZ", calling: "420", names: { sv: "Tjeckien", en: "Czechia", es: "Chequia", de: "Tschechien", fr: "Tchéquie" } },
  { code: "DE", calling: "49", names: { sv: "Tyskland", en: "Germany", es: "Alemania", de: "Deutschland", fr: "Allemagne" } },
  { code: "DK", calling: "45", names: { sv: "Danmark", en: "Denmark", es: "Dinamarca", de: "Dänemark", fr: "Danemark" } },
  { code: "EE", calling: "372", names: { sv: "Estland", en: "Estonia", es: "Estonia", de: "Estland", fr: "Estonie" } },
  { code: "ES", calling: "34", names: { sv: "Spanien", en: "Spain", es: "España", de: "Spanien", fr: "Espagne" } },
  { code: "FI", calling: "358", names: { sv: "Finland", en: "Finland", es: "Finlandia", de: "Finnland", fr: "Finlande" } },
  { code: "FR", calling: "33", names: { sv: "Frankrike", en: "France", es: "Francia", de: "Frankreich", fr: "France" } },
  { code: "GB", calling: "44", names: { sv: "Storbritannien", en: "United Kingdom", es: "Reino Unido", de: "Vereinigtes Königreich", fr: "Royaume-Uni" } },
  { code: "GR", calling: "30", names: { sv: "Grekland", en: "Greece", es: "Grecia", de: "Griechenland", fr: "Grèce" } },
  { code: "HR", calling: "385", names: { sv: "Kroatien", en: "Croatia", es: "Croacia", de: "Kroatien", fr: "Croatie" } },
  { code: "HU", calling: "36", names: { sv: "Ungern", en: "Hungary", es: "Hungría", de: "Ungarn", fr: "Hongrie" } },
  { code: "IE", calling: "353", names: { sv: "Irland", en: "Ireland", es: "Irlanda", de: "Irland", fr: "Irlande" } },
  { code: "IS", calling: "354", names: { sv: "Island", en: "Iceland", es: "Islandia", de: "Island", fr: "Islande" } },
  { code: "IT", calling: "39", names: { sv: "Italien", en: "Italy", es: "Italia", de: "Italien", fr: "Italie" } },
  { code: "LI", calling: "423", names: { sv: "Liechtenstein", en: "Liechtenstein", es: "Liechtenstein", de: "Liechtenstein", fr: "Liechtenstein" } },
  { code: "LT", calling: "370", names: { sv: "Litauen", en: "Lithuania", es: "Lituania", de: "Litauen", fr: "Lituanie" } },
  { code: "LU", calling: "352", names: { sv: "Luxemburg", en: "Luxembourg", es: "Luxemburgo", de: "Luxemburg", fr: "Luxembourg" } },
  { code: "LV", calling: "371", names: { sv: "Lettland", en: "Latvia", es: "Letonia", de: "Lettland", fr: "Lettonie" } },
  { code: "MT", calling: "356", names: { sv: "Malta", en: "Malta", es: "Malta", de: "Malta", fr: "Malte" } },
  { code: "NL", calling: "31", names: { sv: "Nederländerna", en: "Netherlands", es: "Países Bajos", de: "Niederlande", fr: "Pays-Bas" } },
  { code: "NO", calling: "47", names: { sv: "Norge", en: "Norway", es: "Noruega", de: "Norwegen", fr: "Norvège" } },
  { code: "PL", calling: "48", names: { sv: "Polen", en: "Poland", es: "Polonia", de: "Polen", fr: "Pologne" } },
  { code: "PT", calling: "351", names: { sv: "Portugal", en: "Portugal", es: "Portugal", de: "Portugal", fr: "Portugal" } },
  { code: "RO", calling: "40", names: { sv: "Rumänien", en: "Romania", es: "Rumanía", de: "Rumänien", fr: "Roumanie" } },
  { code: "SI", calling: "386", names: { sv: "Slovenien", en: "Slovenia", es: "Eslovenia", de: "Slowenien", fr: "Slovénie" } },
  { code: "SK", calling: "421", names: { sv: "Slovakien", en: "Slovakia", es: "Eslovaquia", de: "Slowakei", fr: "Slovaquie" } },
];

const SHIP_CODES = new Set(SHIP_COUNTRIES.map((c) => c.code));

export function isShipCountry(code: string | undefined | null): boolean {
  return !!code && SHIP_CODES.has(code.toUpperCase());
}

export function defaultShipCountry(locale: Locale): string {
  if (locale === "de") return "DE";
  if (locale === "es") return "ES";
  if (locale === "fr") return "FR";
  if (locale === "en") return "GB";
  return "SE";
}

export function countryCallingCode(countryCode: string): string {
  return SHIP_COUNTRIES.find((c) => c.code === countryCode)?.calling || "";
}

export function normalizeCheckoutPhone(raw: string, countryCode: string): string {
  const digits = String(raw || "").replace(/\D/g, "");
  if (countryCode === "SE") return digits.replace(/^0/, "");
  const calling = countryCallingCode(countryCode);
  if (calling && digits.startsWith("0")) return calling + digits.slice(1);
  return digits;
}

export function isValidCheckoutPhone(raw: string, countryCode: string): boolean {
  const digits = String(raw || "").replace(/\D/g, "");
  if (countryCode === "SE") return digits.length === 10;
  return digits.length >= 8 && digits.length <= 15;
}
