import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STATIC_EXT =
  /\.(ico|png|jpg|jpeg|webp|svg|gif|txt|xml|json|webmanifest|woff2?|onnx|onnx\.data|bin|pb|data)$/i;

/* ── Shopify legacy redirects ── */
const SHOPIFY_PRODUCT_SLUGS: Record<string, string> = {
  "duo-kit-the-one-i-love": "duo-kit",
  "duo-ta-da": "duo-ta-da",
  "the-one-facial-oil": "duo-ta-da",
  "i-love-facial-oil": "duo-ta-da",
  "ta-da-serum": "ta-da-serum",
  "ta-da-moisturizing-serum": "ta-da-serum",
  "duo-kit": "duo-kit",
  "au-naturel-makeup-remover": "au-naturel-makeup-remover",
  "au-naturel": "au-naturel-makeup-remover",
  "fungtastic-mushroom-extract": "fungtastic-mushroom-extract",
  "fungtastic": "fungtastic-mushroom-extract",
};

function handleShopifyRedirect(pathname: string, request: NextRequest): NextResponse | null {
  const lower = pathname.toLowerCase();

  // /products/:handle → /sv/produkter/:id
  const productMatch = lower.match(/^\/products\/(.+?)(?:\/|$)/);
  if (productMatch) {
    const handle = productMatch[1];
    const mapped = SHOPIFY_PRODUCT_SLUGS[handle] || handle;
    return NextResponse.redirect(new URL(`/sv/produkter/${mapped}`, request.url), 301);
  }

  // /collections/* → /sv/produkter
  if (lower.startsWith("/collections")) {
    return NextResponse.redirect(new URL("/sv/produkter", request.url), 301);
  }

  // /pages/about, /pages/about-us → /sv/om-oss
  if (lower.startsWith("/pages/about")) {
    return NextResponse.redirect(new URL("/sv/om-oss", request.url), 301);
  }

  // /pages/contact → /sv/kontakt
  if (lower.startsWith("/pages/contact")) {
    return NextResponse.redirect(new URL("/sv/kontakt", request.url), 301);
  }

  // /account → /sv/logga-in
  if (lower === "/account" || lower === "/account/login" || lower === "/account/register") {
    return NextResponse.redirect(new URL("/sv/logga-in", request.url), 301);
  }

  // /cart → /sv/produkter (no cart page, send to shop)
  if (lower === "/cart") {
    return NextResponse.redirect(new URL("/sv/produkter", request.url), 301);
  }

  // /blogs/* → /sv/guide (guide hub)
  if (lower.startsWith("/blogs")) {
    return NextResponse.redirect(new URL("/sv/guide", request.url), 301);
  }

  return null;
}

function rewriteEnPretty(pathname: string, request: NextRequest): NextResponse | null {
  const url = request.nextUrl.clone();

  if (pathname === "/en/products" || pathname === "/en/products/") {
    url.pathname = "/en/produkter";
    return NextResponse.rewrite(url);
  }
  const prod = pathname.match(/^\/en\/products\/(.+)$/);
  if (prod) {
    url.pathname = `/en/produkter/${prod[1]}`;
    return NextResponse.rewrite(url);
  }

  const map: [string, string][] = [
    ["/en/about", "/en/om-oss"],
    ["/en/contact", "/en/kontakt"],
    ["/en/checkout", "/en/kassa"],
    ["/en/skin-analysis", "/en/hudanalys"],
    ["/en/terms", "/en/villkor"],
    ["/en/privacy", "/en/integritetspolicy"],
    ["/en/login", "/en/logga-in"],
    ["/en/register", "/en/registrera"],
    ["/en/my-account", "/en/mitt-konto"],
    ["/en/write-review", "/en/skriv-omdome"],
    ["/en/payment/success", "/en/betalning/lyckad"],
    ["/en/payment/failed", "/en/betalning/misslyckad"],
    ["/en/loyalty", "/en/lojalitetsprogram"],
    ["/en/set-password", "/en/valj-losenord"],
    ["/en/free-skin-analysis", "/en/gratis-hudanalys"],
  ];

  for (const [from, to] of map) {
    if (pathname === from || pathname === `${from}/`) {
      url.pathname = to;
      return NextResponse.rewrite(url);
    }
  }

  return null;
}

const ES_REWRITE_MAP: [string, string][] = [
  ["/es/productos", "/es/produkter"],
  ["/es/sobre-nosotros", "/es/om-oss"],
  ["/es/contacto", "/es/kontakt"],
  ["/es/pagar", "/es/kassa"],
  ["/es/analisis-piel", "/es/hudanalys"],
  ["/es/terminos", "/es/villkor"],
  ["/es/privacidad", "/es/integritetspolicy"],
  ["/es/iniciar-sesion", "/es/logga-in"],
  ["/es/registro", "/es/registrera"],
  ["/es/mi-cuenta", "/es/mitt-konto"],
  ["/es/escribir-resena", "/es/skriv-omdome"],
  ["/es/pago/exitoso", "/es/betalning/lyckad"],
  ["/es/pago/fallido", "/es/betalning/misslyckad"],
  ["/es/fidelidad", "/es/lojalitetsprogram"],
  ["/es/establecer-contrasena", "/es/valj-losenord"],
  ["/es/analisis-piel-gratis", "/es/gratis-hudanalys"],
];

const FR_REWRITE_MAP: [string, string][] = [
  ["/fr/produits", "/fr/produkter"],
  ["/fr/a-propos", "/fr/om-oss"],
  ["/fr/contact", "/fr/kontakt"],
  ["/fr/paiement", "/fr/kassa"],
  ["/fr/analyse-peau", "/fr/hudanalys"],
  ["/fr/cgv", "/fr/villkor"],
  ["/fr/confidentialite", "/fr/integritetspolicy"],
  ["/fr/connexion", "/fr/logga-in"],
  ["/fr/inscription", "/fr/registrera"],
  ["/fr/mon-compte", "/fr/mitt-konto"],
  ["/fr/ecrire-avis", "/fr/skriv-omdome"],
  ["/fr/paiement/reussi", "/fr/betalning/lyckad"],
  ["/fr/paiement/echoue", "/fr/betalning/misslyckad"],
  ["/fr/fidelite", "/fr/lojalitetsprogram"],
  ["/fr/choisir-mot-de-passe", "/fr/valj-losenord"],
  ["/fr/analyse-de-peau-gratuite", "/fr/gratis-hudanalys"],
];

const DE_REWRITE_MAP: [string, string][] = [
  ["/de/produkte", "/de/produkter"],
  ["/de/ueber-uns", "/de/om-oss"],
  ["/de/kontakt", "/de/kontakt"],
  ["/de/kasse", "/de/kassa"],
  ["/de/hautanalyse", "/de/hudanalys"],
  ["/de/agb", "/de/villkor"],
  ["/de/datenschutz", "/de/integritetspolicy"],
  ["/de/anmelden", "/de/logga-in"],
  ["/de/registrieren", "/de/registrera"],
  ["/de/mein-konto", "/de/mitt-konto"],
  ["/de/bewertung-schreiben", "/de/skriv-omdome"],
  ["/de/zahlung/erfolgreich", "/de/betalning/lyckad"],
  ["/de/zahlung/fehlgeschlagen", "/de/betalning/misslyckad"],
  ["/de/treueprogramm", "/de/lojalitetsprogram"],
  ["/de/passwort-setzen", "/de/valj-losenord"],
  ["/de/kostenlose-hautanalyse", "/de/gratis-hudanalys"],
];

function rewritePretty(
  pathname: string,
  request: NextRequest,
  prefix: string,
  map: [string, string][]
): NextResponse | null {
  const url = request.nextUrl.clone();

  // product list: /es/productos → /es/produkter
  if (pathname === `${prefix}/${map[0][0].split("/")[2]}` || pathname === `${prefix}/${map[0][0].split("/")[2]}/`) {
    url.pathname = `${prefix}/produkter`;
    return NextResponse.rewrite(url);
  }
  // product detail: /es/productos/:id → /es/produkter/:id
  const prodSegment = map[0][0].split("/")[2];
  const prodMatch = pathname.match(new RegExp(`^${prefix}/${prodSegment}/(.+)$`));
  if (prodMatch) {
    url.pathname = `${prefix}/produkter/${prodMatch[1]}`;
    return NextResponse.rewrite(url);
  }

  for (const [from, to] of map) {
    if (pathname === from || pathname === `${from}/`) {
      url.pathname = to;
      return NextResponse.rewrite(url);
    }
  }
  return null;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  if (host.includes("1753skincare.com")) {
    const dest = new URL(request.url);
    dest.host = "www.1753skin.com";
    dest.port = "";
    return NextResponse.redirect(dest, 301);
  }

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    STATIC_EXT.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Shopify legacy URLs → 301 redirect
  const shopify = handleShopifyRedirect(pathname, request);
  if (shopify) return shopify;

  const rw = rewriteEnPretty(pathname, request);
  if (rw) return rw;

  const esRw = rewritePretty(pathname, request, "/es", ES_REWRITE_MAP);
  if (esRw) return esRw;

  const deRw = rewritePretty(pathname, request, "/de", DE_REWRITE_MAP);
  if (deRw) return deRw;

  const frRw = rewritePretty(pathname, request, "/fr", FR_REWRITE_MAP);
  if (frRw) return frRw;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/sv", request.url));
  }

  if (
    !pathname.startsWith("/sv") &&
    !pathname.startsWith("/en") &&
    !pathname.startsWith("/es") &&
    !pathname.startsWith("/de") &&
    !pathname.startsWith("/fr")
  ) {
    return NextResponse.redirect(new URL(`/sv${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
