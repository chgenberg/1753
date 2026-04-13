import type { Locale } from "./types";
import { sv, type Messages } from "./strings/sv";
import { en } from "./strings/en";
import { es } from "./strings/es";
import { de } from "./strings/de";
import { fr } from "./strings/fr";

export type { Messages };
export { sv, en, es, de, fr };

const LOCALE_MESSAGES: Record<string, Messages> = { sv, en, es, de, fr };

export function getMessages(locale: Locale): Messages {
  return LOCALE_MESSAGES[locale] || sv;
}
