---
name: 1753-english-site
description: >-
  Create a complete English version of the 1753 SKINCARE Next.js frontend using
  i18n routing and 8 parallel sub-agents. Use when asked to translate the site
  to English, create an English version, or set up internationalisation.
---

# 1753 English Site – Orchestrated Translation

Creates an identical English version of the 1753 SKINCARE site by introducing
Next.js `[locale]` routing and translating every user-facing string.
Eight sub-agents work in parallel, each owning a vertical slice.

## Architecture

```
frontend/src/
├── middleware.ts              ← locale detection + redirect
├── lib/i18n/
│   ├── index.ts              ← getDictionary(), Locale type
│   ├── sv.ts                 ← Swedish dictionary (extracted from current hardcoded text)
│   └── en.ts                 ← English dictionary (translated)
├── app/
│   └── [locale]/             ← all existing pages move here
│       ├── layout.tsx
│       ├── page.tsx
│       ├── produkter/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── ... (all other routes)
│       └── not-found.tsx
├── components/               ← shared components receive `locale` / dict props
└── providers/
    └── locale-provider.tsx   ← React context for current locale + dictionary
```

### URL scheme

| Svenska (default) | English |
|---|---|
| `/` → redirect → `/sv` | `/en` |
| `/sv/produkter` | `/en/products` |
| `/sv/om-oss` | `/en/about` |
| `/sv/kontakt` | `/en/contact` |
| `/sv/kassa` | `/en/checkout` |
| `/sv/hudanalys` | `/en/skin-analysis` |
| `/sv/villkor` | `/en/terms` |
| `/sv/integritetspolicy` | `/en/privacy` |
| `/sv/logga-in` | `/en/login` |
| `/sv/registrera` | `/en/register` |
| `/sv/mitt-konto` | `/en/my-account` |
| `/sv/skriv-omdome` | `/en/write-review` |
| `/sv/betalning/lyckad` | `/en/payment/success` |
| `/sv/betalning/misslyckad` | `/en/payment/failed` |

Admin pages (`/admin/*`) stay **Swedish only** – no translation needed.

---

## Execution plan – 8 agents

Run agents 1 first (infrastructure), then agents 2–8 in parallel.

### Agent 1: i18n Infrastructure (run first, alone)

**Files to create/edit:**

1. `frontend/src/middleware.ts` – intercept requests, detect locale from
   cookie / Accept-Language / path prefix, redirect bare `/` to `/sv`
2. `frontend/src/lib/i18n/index.ts` – `Locale` type (`"sv" | "en"`),
   `locales` array, `defaultLocale`, `getDictionary(locale)` that
   dynamically imports the right dictionary
3. `frontend/src/lib/i18n/sv.ts` – extract **every** user-facing string
   from all 24 pages + 11 translatable components into a flat-ish
   dictionary object, organised by page/section keys
4. `frontend/src/lib/i18n/en.ts` – English translations of sv.ts
   (same keys, translated values)
5. `frontend/src/providers/locale-provider.tsx` – React context that
   provides `locale`, `dictionary`, and a `t(key)` helper
6. Move `frontend/src/app/layout.tsx` →
   `frontend/src/app/[locale]/layout.tsx`, add locale param, wrap with
   `LocaleProvider`
7. `frontend/src/app/layout.tsx` – minimal root layout that just renders
   children (the `[locale]` segment handles the real layout)
8. Update `next.config.js` / `next.config.mjs` if needed for i18n

**Key rules:**
- `sv.ts` must contain the EXACT current Swedish text (copy-paste, not
  paraphrase)
- Dictionary keys use dot notation: `home.hero.title`, `header.nav.products`,
  `checkout.form.firstName` etc.
- The `t()` helper supports interpolation: `t("cart.freeShippingIn", { amount: 200 })`

**Output:** commit the infrastructure; confirm all existing pages still
render (Swedish) before agents 2–8 start.

---

### Agent 2: Layout, Header, Footer, TopBanner

**Scope:** Shared chrome visible on every page.

| File | What to do |
|---|---|
| `components/header.tsx` | Replace hardcoded nav labels, logo alt text, mobile menu text with `t()` calls. Map Swedish route names to locale-aware paths (e.g. `/sv/produkter` vs `/en/products`). |
| `components/footer.tsx` | Translate footer sections, link labels, copyright text, contact info labels. |
| `components/top-banner.tsx` | Translate marquee messages. |
| `components/cookie-banner.tsx` | Translate cookie consent text and button labels. |
| `app/[locale]/layout.tsx` | Ensure `<html lang={locale}>` is set. Translate metadata (title, description, OG tags). |

---

### Agent 3: Homepage

**Scope:** `app/[locale]/page.tsx`

Translate:
- Hero section (headline, subtext, CTA button)
- Review carousel labels
- "Vart sortiment" section heading + subtext
- Product card labels (via props or dict)
- "Varfor 1753?" section (all feature cards: titles, descriptions, detail popups)
- Any other homepage sections

Keep all animations, interactions, and layout identical.

---

### Agent 4: Product pages

**Scope:**
- `app/[locale]/produkter/page.tsx` (product listing)
- `app/[locale]/produkter/[id]/page.tsx` (product detail)
- `app/[locale]/produkter/[id]/product-detail.tsx`
- `app/[locale]/produkter/product-grid.tsx`
- `app/[locale]/produkter/loading.tsx`
- `components/product-card.tsx`
- `components/reviews-section.tsx`
- `lib/products.ts` – add English name/description/ingredients fields

Product data in `lib/products.ts` must be extended with English fields:
```ts
{
  name: "CBD Ansiktsolja",
  nameEn: "CBD Facial Oil",
  shortDesc: "...",
  shortDescEn: "...",
  longDesc: "<p>...</p>",
  longDescEn: "<p>...</p>",
  ingredients: "...",
  ingredientsEn: "..."
}
```

Components select the right field based on locale.

---

### Agent 5: Checkout flow

**Scope:**
- `app/[locale]/kassa/page.tsx`
- `app/[locale]/betalning/lyckad/page.tsx`
- `app/[locale]/betalning/misslyckad/page.tsx`
- `components/cart-drawer.tsx`

Translate:
- All form labels, placeholders, validation messages
- Order summary labels
- Subscription terms text
- Cart drawer (item labels, totals, CTA)
- Payment success/failure messages

Ensure `sessionStorage` keys and API calls remain unchanged.

---

### Agent 6: Auth & Account

**Scope:**
- `app/[locale]/logga-in/page.tsx`
- `app/[locale]/registrera/page.tsx`
- `app/[locale]/mitt-konto/page.tsx`
- `app/[locale]/mitt-konto/loading.tsx`
- `providers/auth-provider.tsx` (translate any user-facing error messages)

Translate:
- Login/register form labels, placeholders, validation text
- Dashboard sections (overview, orders, loyalty tiers, routines, wishlist, settings)
- All tab labels, stat labels, tier names and descriptions
- Password requirement text

---

### Agent 7: Content pages

**Scope:**
- `app/[locale]/om-oss/page.tsx` + `layout.tsx`
- `app/[locale]/kontakt/page.tsx` + `layout.tsx`
- `app/[locale]/villkor/page.tsx`
- `app/[locale]/integritetspolicy/page.tsx`
- `app/[locale]/hudanalys/page.tsx` + `layout.tsx`

Translate all body copy, headings, metadata. For legal pages (villkor,
integritetspolicy), ensure the English version is a proper legal
translation, not just casual.

---

### Agent 8: Misc, SEO & Verification

**Scope:**
- `app/[locale]/skriv-omdome/page.tsx` + `review-form.tsx`
- `app/[locale]/not-found.tsx`
- `components/chat-widget.tsx`
- `components/notification.tsx`
- `app/[locale]/sitemap.ts` – generate entries for both `/sv/` and `/en/`
- `app/[locale]/robots.ts` – include both locale sitemaps
- `components/analytics.tsx` – no translation needed, just verify

**Verification checklist (run after all agents):**
- [ ] `npm run build` passes with zero errors
- [ ] All `/sv/...` routes render identical to current site
- [ ] All `/en/...` routes render with English text
- [ ] Language switcher in header works
- [ ] Cart, auth, checkout flows work in both locales
- [ ] SEO metadata is locale-correct
- [ ] `<html lang>` attribute switches correctly
- [ ] No Swedish text leaks onto English pages
- [ ] No console errors

---

## Translation tone guide

The English copy should match the brand voice:

- **Honest, warm, rebellious** – never clinical or corporate
- Short sentences. Direct address.
- "Your skin deserves honesty" not "Our products provide optimal dermal outcomes"
- Keep the anti-conventional-skincare attitude
- Product names stay in their original form (e.g. "Fungtastic", "DUO-kit")
- Scientific claims keep source references

---

## How to run

```
# In Composer / Agent chat:
"Create the English version of the site using the 1753-english-site skill"
```

The orchestrating agent should:

1. Read this SKILL.md
2. Launch **Agent 1** (infrastructure) and wait for completion
3. Launch **Agents 2–8** in parallel
4. After all complete, run the verification checklist from Agent 8
5. Commit all changes with message:
   `feat(i18n): add complete English version of the site`
