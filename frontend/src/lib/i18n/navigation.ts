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

  const base = locale === "sv" ? SV_SEGMENT : EN_SEGMENT;
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
