# Route Mapping: Swedish → English

The `[locale]` segment handles locale switching. Route **slugs** differ
between locales to provide SEO-friendly, language-native URLs.

## Public routes

| Current path | Swedish (`/sv`) | English (`/en`) |
|---|---|---|
| `/` | `/sv` | `/en` |
| `/produkter` | `/sv/produkter` | `/en/products` |
| `/produkter/[id]` | `/sv/produkter/[id]` | `/en/products/[id]` |
| `/om-oss` | `/sv/om-oss` | `/en/about` |
| `/kontakt` | `/sv/kontakt` | `/en/contact` |
| `/kassa` | `/sv/kassa` | `/en/checkout` |
| `/hudanalys` | `/sv/hudanalys` | `/en/skin-analysis` |
| `/villkor` | `/sv/villkor` | `/en/terms` |
| `/integritetspolicy` | `/sv/integritetspolicy` | `/en/privacy` |
| `/logga-in` | `/sv/logga-in` | `/en/login` |
| `/registrera` | `/sv/registrera` | `/en/register` |
| `/mitt-konto` | `/sv/mitt-konto` | `/en/my-account` |
| `/skriv-omdome` | `/sv/skriv-omdome` | `/en/write-review` |
| `/betalning/lyckad` | `/sv/betalning/lyckad` | `/en/payment/success` |
| `/betalning/misslyckad` | `/sv/betalning/misslyckad` | `/en/payment/failed` |

## Admin routes (Swedish only, no locale prefix)

All `/admin/*` routes stay unchanged and are excluded from the `[locale]`
segment. The middleware should pass them through without locale redirect.

## Implementation in middleware.ts

```ts
const PUBLIC_LOCALES = ["sv", "en"] as const;
const DEFAULT_LOCALE = "sv";

// Paths that should NOT be locale-prefixed
const BYPASS_PATHS = ["/admin", "/api", "/_next", "/favicon", "/public"];
```

## Route helper

Create a `localePath(locale, route)` utility:

```ts
const routeMap: Record<string, Record<Locale, string>> = {
  products:        { sv: "/produkter",           en: "/products" },
  about:           { sv: "/om-oss",              en: "/about" },
  contact:         { sv: "/kontakt",             en: "/contact" },
  checkout:        { sv: "/kassa",               en: "/checkout" },
  skinAnalysis:    { sv: "/hudanalys",            en: "/skin-analysis" },
  terms:           { sv: "/villkor",              en: "/terms" },
  privacy:         { sv: "/integritetspolicy",    en: "/privacy" },
  login:           { sv: "/logga-in",             en: "/login" },
  register:        { sv: "/registrera",           en: "/register" },
  myAccount:       { sv: "/mitt-konto",           en: "/my-account" },
  writeReview:     { sv: "/skriv-omdome",         en: "/write-review" },
  paymentSuccess:  { sv: "/betalning/lyckad",     en: "/payment/success" },
  paymentFailed:   { sv: "/betalning/misslyckad", en: "/payment/failed" },
};

export function localePath(locale: Locale, route: string, params?: Record<string, string>) {
  const base = routeMap[route]?.[locale] || route;
  let path = `/${locale}${base}`;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      path = path.replace(`[${k}]`, v);
    });
  }
  return path;
}
```
