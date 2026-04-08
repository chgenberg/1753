import type { Locale } from "./types";
import { sv, type Messages } from "./strings/sv";
import { en } from "./strings/en";

export type { Messages };
export { sv, en };

export function getMessages(locale: Locale): Messages {
  return locale === "en" ? en : sv;
}
