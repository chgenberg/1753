// Rena hjälpfunktioner för kassan, betalsidan hos Viva och trattmätningen.
// Ligger i en egen modul så att de kan testas utan att starta servern
// (scripts/test-checkout-helpers.js).

const STORE_LOCALES = ["sv", "en", "es", "de", "fr"];

const VIVA_REQUEST_LANG = {
  sv: "sv-SE",
  en: "en-GB",
  es: "es-ES",
  de: "de-DE",
  fr: "fr-FR",
};

/** Språk för Vivas betalsida. Utan detta visas sidan på svenska för alla. */
function vivaRequestLang(locale) {
  return VIVA_REQUEST_LANG[locale] || VIVA_REQUEST_LANG.sv;
}

/** Vivas `lang`-parameter i retur-URL:en (t.ex. "de-DE") → butikens locale. */
function storeLocaleFromVivaLang(lang) {
  const l = String(lang || "").slice(0, 2).toLowerCase();
  return STORE_LOCALES.includes(l) ? l : "sv";
}

function storeLocale(locale) {
  return STORE_LOCALES.includes(locale) ? locale : null;
}

/**
 * Svenskt nummer → nationellt nummer utan inledande nolla ("701234567"),
 * samma format som kassan alltid har skickat för nummer skrivna som 070….
 *
 * Tar bort landskoden när numret skrivits internationellt (+46…, 0046…, 46…).
 * "46…" tolkas bara som landskod när numret är minst 11 siffror, annars
 * skulle riktnummer 046 (Lund) – som kassan skickar som "46…" – förstöras.
 */
function normalizeSwedishPhone(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("0046")) d = d.slice(4);
  else if (d.startsWith("46") && d.length >= 11) d = d.slice(2);
  return d.replace(/^0+/, "");
}

function isSwedishMobile(nationalNumber) {
  return /^7\d{8}$/.test(String(nationalNumber || ""));
}

/**
 * Telefonnumret som skickas till Viva. Viva förifyller Swish-rutan med det
 * och sätter +46 framför, så ett nummer som inte är ett svenskt mobilnummer
 * ger en Swish-förfrågan som aldrig kommer fram. Då skickar vi hellre inget
 * nummer alls – kunden skriver in sitt Swish-nummer själv hos Viva.
 */
function vivaCustomerPhone(rawPhone, countryCode) {
  if (String(countryCode || "SE").toUpperCase() !== "SE") return null;
  const national = normalizeSwedishPhone(rawPhone);
  return isSwedishMobile(national) ? national : null;
}

/** Telefonnumret som sparas på ordern (Fortnox, Ongoing-SMS). */
function orderCustomerPhone(rawPhone, countryCode) {
  if (String(countryCode || "SE").toUpperCase() === "SE") {
    return normalizeSwedishPhone(rawPhone);
  }
  return String(rawPhone || "").replace(/^0/, "");
}

// ---- Trattmätning ----

const FUNNEL_EVENTS = new Set([
  "view_product",
  "add_to_cart",
  "begin_checkout",
  "submit_payment",
  "purchase",
  "payment_failed",
  "analysis_start",
  "analysis_quiz",
  "analysis_result",
  "analysis_add_to_cart",
]);

function isFunnelEvent(name) {
  return FUNNEL_EVENTS.has(name);
}

/** Grov enhetsklass ur User-Agent. Själva strängen sparas aldrig. */
function deviceFromUserAgent(ua) {
  const s = String(ua || "");
  if (/Instagram|FBAN|FBAV|FB_IAB|TikTok|musical_ly|Snapchat|Pinterest|LinkedInApp/i.test(s)) return "inapp";
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(s)) return "mobile";
  return "desktop";
}

module.exports = {
  STORE_LOCALES,
  vivaRequestLang,
  storeLocaleFromVivaLang,
  storeLocale,
  normalizeSwedishPhone,
  isSwedishMobile,
  vivaCustomerPhone,
  orderCustomerPhone,
  isFunnelEvent,
  deviceFromUserAgent,
};
