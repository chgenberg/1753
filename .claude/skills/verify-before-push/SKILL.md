---
name: verify-before-push
description: >-
  Mekanisk verifiering av 1753 SKINCARE före push: TypeScript, ESLint,
  backend-syntax och vilka kritiska flöden ändringarna berör. Använd före varje
  push, tillsammans med 1753-bug-hunter-prepush, eller när Christopher ber dig
  verifiera, kontrollera eller "köra verify".
---

# Verifiera före push

Kör stegen i ordning. Stoppa och rapportera om något steg misslyckas.

## 1. TypeScript (frontend)

```sh
cd frontend && npx tsc --noEmit
```

Krav: noll fel.

## 2. ESLint (frontend)

```sh
cd frontend && npm run lint
```

Krav: noll errors. Varningar accepteras. Har nya errors tillkommit sedan
senaste push: lista dem och föreslå fixar.

## 3. Backend-syntax

```sh
node -c server.js && node -c db.js
```

Har du ändrat andra backend-filer (`services/`, `outreach/`, `scripts/`): kör
`node -c` på dem också.

## 4. Ändrade filer

```sh
git status --short
git diff --name-only origin/main...HEAD
```

Finns inga ändringar: rapportera att allt är rent.

## 5. Diagnostik från editorn

Finns diagnostik från editorn tillgänglig i sessionen: hämta den för de
ändrade filerna och rapportera nya varningar eller fel. Annars räcker steg 1–3.

## 6. Vilka kritiska flöden berörs

| Flöde | Nyckelfiler |
|---|---|
| Hudanalys | `app/[locale]/hudanalys/page.tsx`, `components/analysis/` (flikar, PDF-export), `components/skin-scanner/`, `server.js` (prompt och `/api/analysis*`) |
| Kassa | `app/[locale]/kassa/page.tsx`, `providers/cart-provider.tsx`, `components/cart-drawer.tsx`, `components/cart-boosters.tsx`, `server.js` (ordrar), `services/checkout-helpers.js` |
| Auth | `providers/auth-provider.tsx`, `logga-in/`, `registrera/`, `valj-losenord/`, `server.js` (auth-rutter) |
| i18n | `lib/i18n/strings/*.ts`, `lib/i18n/navigation.ts`, `middleware.ts`, `components/header.tsx`, `components/footer.tsx` |
| Nyhetsbrev | `components/footer.tsx`, `server.js` (newsletter), `db.js` |
| Produkter | `app/[locale]/produkter/`, `lib/products.ts`, `PRODUCTS_MAP` i `server.js` |
| Prenumerationer | `server.js` (`processRecurringCharges`, `/api/subscriptions*`), `mitt-konto/` |

Berörs hudanalys eller kassa: stäm av mot `.claude/rules/hudanalys-las.md`
respektive `.claude/rules/kop-las.md`.

## 7. Rapport

```
VERIFIERING
-----------
TypeScript:  OK / FEL (antal)
ESLint:      OK / FEL (antal errors) / VARNINGAR (antal)
Backend:     OK / FEL
Diagnostik:  OK / NYA VARNINGAR (lista) / EJ TILLGÄNGLIG
Berörda flöden: [lista]

REKOMMENDATION: SÄKERT ATT PUSHA / ÅTGÄRDA FÖRE PUSH
```

Den här skillen ersätter inte bug-hunten. Före en produktionspush ska
`1753-bug-hunter-prepush` också ha körts.
