import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STATIC_EXT =
  /\.(ico|png|jpg|jpeg|webp|svg|gif|txt|xml|json|webmanifest|woff2?)$/i;

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

  // /blogs/* → /sv (no blog equivalent)
  if (lower.startsWith("/blogs")) {
    return NextResponse.redirect(new URL("/sv", request.url), 301);
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
  ];

  for (const [from, to] of map) {
    if (pathname === from || pathname === `${from}/`) {
      url.pathname = to;
      return NextResponse.rewrite(url);
    }
  }

  return null;
}

export function middleware(request: NextRequest) {
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

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/sv", request.url));
  }

  if (!pathname.startsWith("/sv") && !pathname.startsWith("/en")) {
    return NextResponse.redirect(new URL(`/sv${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
