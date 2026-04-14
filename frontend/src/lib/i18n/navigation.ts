import type { Locale } from "./types";

/** Logical routes — use with localizePath() for hrefs */
export type AppRoute =
  | "home"
  | "products"
  | "product"
  | "about"
  | "contact"
  | "checkout"
  | "skinAnalysis"
  | "terms"
  | "privacy"
  | "login"
  | "register"
  | "account"
  | "writeReview"
  | "paymentSuccess"
  | "paymentFailed"
  | "loyalty"
  | "setPassword";

const SV_SEGMENT: Record<AppRoute, string> = {
  home: "",
  products: "produkter",
  product: "produkter",
  about: "om-oss",
  contact: "kontakt",
  checkout: "kassa",
  skinAnalysis: "hudanalys",
  terms: "villkor",
  privacy: "integritetspolicy",
  login: "logga-in",
  register: "registrera",
  account: "mitt-konto",
  writeReview: "skriv-omdome",
  paymentSuccess: "betalning/lyckad",
  paymentFailed: "betalning/misslyckad",
  loyalty: "lojalitetsprogram",
  setPassword: "valj-losenord",
};

/** English public URLs (middleware rewrites to Swedish folder names under /en/) */
const EN_SEGMENT: Record<AppRoute, string> = {
  home: "",
  products: "products",
  product: "products",
  about: "about",
  contact: "contact",
  checkout: "checkout",
  skinAnalysis: "skin-analysis",
  terms: "terms",
  privacy: "privacy",
  login: "login",
  register: "register",
  account: "my-account",
  writeReview: "write-review",
  paymentSuccess: "payment/success",
  paymentFailed: "payment/failed",
  loyalty: "loyalty",
  setPassword: "set-password",
};

const ES_SEGMENT: Record<AppRoute, string> = {
  home: "",
  products: "productos",
  product: "productos",
  about: "sobre-nosotros",
  contact: "contacto",
  checkout: "pagar",
  skinAnalysis: "analisis-piel",
  terms: "terminos",
  privacy: "privacidad",
  login: "iniciar-sesion",
  register: "registro",
  account: "mi-cuenta",
  writeReview: "escribir-resena",
  paymentSuccess: "pago/exitoso",
  paymentFailed: "pago/fallido",
  loyalty: "fidelidad",
  setPassword: "establecer-contrasena",
};

const DE_SEGMENT: Record<AppRoute, string> = {
  home: "",
  products: "produkte",
  product: "produkte",
  about: "ueber-uns",
  contact: "kontakt",
  checkout: "kasse",
  skinAnalysis: "hautanalyse",
  terms: "agb",
  privacy: "datenschutz",
  login: "anmelden",
  register: "registrieren",
  account: "mein-konto",
  writeReview: "bewertung-schreiben",
  paymentSuccess: "zahlung/erfolgreich",
  paymentFailed: "zahlung/fehlgeschlagen",
  loyalty: "treueprogramm",
  setPassword: "passwort-setzen",
};

const FR_SEGMENT: Record<AppRoute, string> = {
  home: "",
  products: "produits",
  product: "produits",
  about: "a-propos",
  contact: "contact",
  checkout: "paiement",
  skinAnalysis: "analyse-peau",
  terms: "cgv",
  privacy: "confidentialite",
  login: "connexion",
  register: "inscription",
  account: "mon-compte",
  writeReview: "ecrire-avis",
  paymentSuccess: "paiement/reussi",
  paymentFailed: "paiement/echoue",
  loyalty: "fidelite",
  setPassword: "choisir-mot-de-passe",
};

const LOCALE_SEGMENTS: Record<string, Record<AppRoute, string>> = {
  sv: SV_SEGMENT,
  en: EN_SEGMENT,
  es: ES_SEGMENT,
  de: DE_SEGMENT,
  fr: FR_SEGMENT,
};

export function localizePath(
  locale: Locale,
  route: AppRoute,
  params?: { productId?: string; query?: Record<string, string> }
): string {
  if (route === "home") {
    let path = `/${locale}`;
    if (params?.query) {
      path += `?${new URLSearchParams(params.query).toString()}`;
    }
    return path;
  }

  const base = LOCALE_SEGMENTS[locale] || SV_SEGMENT;
  let path = `/${locale}`;

  if (route === "product" && params?.productId) {
    path += `/${base.product}/${params.productId}`;
  } else {
    const seg = base[route];
    if (seg) path += `/${seg}`;
  }

  if (params?.query) {
    path += `?${new URLSearchParams(params.query).toString()}`;
  }
  return path;
}

export function localizeHomeHash(locale: Locale, hash: string): string {
  return `/${locale}${hash}`;
}

/**
 * Convert current pathname to the equivalent path in a different locale.
 * Reverse-looks up the first segment to find the matching AppRoute,
 * then builds the path for the target locale.
 * Falls back to swapping just the locale prefix if no match is found.
 */
export function switchLocalePath(
  pathname: string,
  toLocale: Locale
): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${toLocale}`;

  const fromLocale = parts[0];
  const rest = parts.slice(1);

  if (rest.length === 0) return `/${toLocale}`;

  const firstSeg = rest[0];
  const sourceSegments = LOCALE_SEGMENTS[fromLocale] || SV_SEGMENT;
  const targetSegments = LOCALE_SEGMENTS[toLocale] || SV_SEGMENT;

  let matchedRoute: AppRoute | null = null;
  for (const [route, seg] of Object.entries(sourceSegments)) {
    if (seg && seg === firstSeg) {
      matchedRoute = route as AppRoute;
      break;
    }
  }

  // Middleware rewrites pretty URLs to Swedish filesystem paths,
  // so usePathname() returns e.g. "/en/hudanalys" not "/en/skin-analysis".
  // Fall back to checking SV_SEGMENT for the internal/rewritten path.
  if (!matchedRoute && fromLocale !== "sv") {
    for (const [route, seg] of Object.entries(SV_SEGMENT)) {
      if (seg && seg === firstSeg) {
        matchedRoute = route as AppRoute;
        break;
      }
    }
  }

  if (!matchedRoute) {
    return `/${toLocale}/${rest.join("/")}`;
  }

  const targetSeg = targetSegments[matchedRoute];
  const remaining = rest.slice(1);

  if (!targetSeg) return `/${toLocale}`;

  const base = `/${toLocale}/${targetSeg}`;
  return remaining.length > 0 ? `${base}/${remaining.join("/")}` : base;
}
