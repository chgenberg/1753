# Dictionary Key Reference

Complete list of dictionary sections that `sv.ts` and `en.ts` must contain.
Each agent is responsible for their section(s).

## Structure

```ts
export type Dictionary = {
  meta: { ... }
  header: { ... }
  footer: { ... }
  topBanner: { ... }
  cookieBanner: { ... }
  home: { ... }
  products: { ... }
  productDetail: { ... }
  cart: { ... }
  checkout: { ... }
  paymentSuccess: { ... }
  paymentFailed: { ... }
  login: { ... }
  register: { ... }
  account: { ... }
  about: { ... }
  contact: { ... }
  terms: { ... }
  privacy: { ... }
  skinAnalysis: { ... }
  writeReview: { ... }
  reviews: { ... }
  notFound: { ... }
  chat: { ... }
  notification: { ... }
  common: { ... }
}
```

## Key conventions

- Flat within each section: `checkout.firstName`, not `checkout.form.fields.firstName`
- Interpolation with `{var}`: `"Handla for {amount} kr till for fri frakt"`
- HTML content (long descriptions) stored as separate keys with `Html` suffix:
  `productDetail.descriptionHtml`
- Plural forms: use `_one` / `_other` suffix: `cart.items_one`, `cart.items_other`

## Agent → Section mapping

| Agent | Sections |
|-------|----------|
| 1 (Infra) | `meta`, `common` + scaffold all sections |
| 2 (Layout) | `header`, `footer`, `topBanner`, `cookieBanner` |
| 3 (Home) | `home` |
| 4 (Products) | `products`, `productDetail`, `reviews` |
| 5 (Checkout) | `cart`, `checkout`, `paymentSuccess`, `paymentFailed` |
| 6 (Auth) | `login`, `register`, `account` |
| 7 (Content) | `about`, `contact`, `terms`, `privacy`, `skinAnalysis` |
| 8 (Misc) | `writeReview`, `notFound`, `chat`, `notification` |
