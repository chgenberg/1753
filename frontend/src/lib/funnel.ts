import { API_URL } from "@/lib/api";
import { getConsent } from "@/components/cookie-banner";

// Måste matcha FUNNEL_EVENTS i services/checkout-helpers.js – servern räknar
// bara händelser den känner igen.
export type FunnelEvent =
  | "view_product"
  | "add_to_cart"
  | "begin_checkout"
  | "submit_payment"
  | "purchase"
  | "payment_failed"
  | "analysis_start"
  | "analysis_quiz"
  | "analysis_result"
  | "analysis_add_to_cart";

const LOCALES = ["sv", "en", "es", "de", "fr"];

/**
 * Räknar ett steg i köp- eller analysflödet. Anonymt: servern sparar bara en
 * räknare per dag, steg, språk och enhetsklass.
 *
 * - Skickas bara om besökaren godkänt statistik i cookie-rutan.
 * - Varje steg räknas en gång per webbläsarsession, så siffrorna går att läsa
 *   som "så många besök kom hit".
 * - Får aldrig kasta eller blockera något – mätningen är inte värd ett tappat köp.
 */
export function trackFunnel(event: FunnelEvent): void {
  if (typeof window === "undefined") return;
  try {
    if (getConsent() !== "all") return;
    const key = `1753_funnel_${event}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    const segment = window.location.pathname.split("/")[1] || "";
    const locale = LOCALES.includes(segment) ? segment : "sv";
    fetch(`${API_URL}/funnel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, locale }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* privat läge utan storage m.m. – hoppa över mätningen */
  }
}
