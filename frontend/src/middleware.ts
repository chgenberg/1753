import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STATIC_EXT =
  /\.(ico|png|jpg|jpeg|webp|svg|gif|txt|xml|json|webmanifest|woff2?)$/i;

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
