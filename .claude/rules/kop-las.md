---
paths:
  - "frontend/src/app/*/kassa/**"
  - "frontend/src/app/*/betalning/**"
  - "frontend/src/providers/cart-provider.tsx"
  - "frontend/src/lib/currency.ts"
  - "frontend/src/lib/products.ts"
  - "server.js"
  - "db.js"
  - "services/checkout-helpers.js"
  - "integrations/fortnox.js"
  - "integrations/vivawallet.js"
  - "integrations/ongoing.js"
---

# Köpkedjan – kontraktslås

Hela kedjan **varukorg → kassa → Viva Wallet → webhook → Fortnox (kund, order,
faktura, bokföring, betalning) → Ongoing → bekräftelsemejl** fungerar i dag.
**Förbättra gärna gränssnitt, prestanda och småinteraktioner – men rör inte
listorna nedan utan att Christopher uttryckligen godkänner det.**

Kedjan har byggts ut sedan låset skrevs (leveransland, gåvor i varukorgen,
90 dagars intervall, nivårabatt). Nya fält får läggas till. De som står här får
inte ändras eller försvinna.

## Valuta: butiken tar bara betalt i kronor

Sedan 2026-11-19 skickar butiken alltid `currency: "SEK"`, oavsett språk.
Viva-kontot har inte Multicurrency aktiverat, så euro-ordrar gick inte att
betala med kort.

- All prisräkning i frontend görs i kronor för alla språk: `productPrice()` i
  `lib/products.ts`, `getCurrency()`, `getShippingCost()` och
  `getFreeShippingThreshold()` i `lib/currency.ts`.
- På övriga språk visar `formatPrice()` en ungefärlig omräkning ("≈ €134") med
  visningskursen `SEK_PER_EUR`. Kassans summa och betalknapp visar det exakta
  kronbeloppet med `formatSek()`, tillsammans med en rad som förklarar att
  kundens bank räknar om.
- Belopp som redan är debiterade (ordrar, prenumerationer) visas alltid med
  `formatSek()`.
- Servern stöder fortfarande `"EUR"` och har kvar europriserna i
  `PRODUCTS_MAP`. Slå inte på euro i butiken igen förrän Viva har bekräftat
  Multicurrency, och aldrig utan uttryckligt ok.

## Låsta API-kontrakt

### `POST /api/orders/create`

```ts
{
  customer: { name: string; email: string; phone: string };
  deliveryAddress: { address: string; zip: string; city: string; country?: string }; // landskod, SE om den saknas
  items: { id: string; qty: number; subscription?: { intervalDays: number } }[];     // intervall 30, 60 eller 90
  discountCode?: string;
  currency: "SEK" | "EUR";
  locale: "sv" | "en" | "es" | "de" | "fr";
  createAccount?: boolean;
}
```

Svar: `{ orderCode, orderNumber, checkoutUrl }`. Behåll alla tre fälten.

### `POST /api/discount/validate`

Anrop: `{ code, items: [{ id, qty }] }`. Svar: `{ code, percent, fixedAmount,
minOrderAmount, description, applicableProductIds, freeProductIds }`. Frontend
läser **alla** dessa fält.

### Övriga låsta rutter

- `POST /api/account/check-email` (autoifyllning vid känd e-post)
- `POST /api/orders/verify`
- `GET /api/vivawallet/verify/:transactionId`
- `GET /api/vivawallet/webhook` (URL-verifiering)
- `POST /api/vivawallet/webhook` (transaktioner)

## Låst datastruktur i `orders.items` (JSONB)

`/api/orders/create` skriver dessa fält per rad:

```ts
{
  articleNumber: string;     // nyckel mot Fortnox och Ongoing
  productId: string;         // internt produkt-id
  name: string;
  quantity: number;
  price: number;             // efter prenumerations- och procentrabatt, inte justerad för fast belopp
  originalPrice: number;     // fullt butikspris
  vatRate: number;           // 0.25 för hudvård, 0.06 för kosttillskott
  paidUnitPrice?: number;    // sätts ENBART när en rabatt i fast belopp fördelats
  subscription?: true;
  intervalDays?: number;
}
```

**`paidUnitPrice` är inte utfyllnad – fältet lagar SPARRE-buggen där
Fortnox-fakturan blev för hög.** Orderbygget i `handleOrderCompletion` läser:

```js
const paidPrice = typeof i.paidUnitPrice === "number" ? i.paidUnitPrice : i.price;
```

Tas fältet bort eller ändras reservlogiken kommer buggen tillbaka.

## Låsta konstanter i `server.js`

```js
const FREE_SHIPPING_THRESHOLD = { SEK: 600, EUR: 60 };
const SHIPPING_COST          = { SEK: 55,  EUR: 6  };
const VIVA_CURRENCY_CODE     = { SEK: 752, EUR: 978 };
```

Affärsregler:

- **Prenumerationsrabatt = 15 %** (`Math.round(price * 0.85)`).
- **Fraktraden mot Fortnox** = `Description: "Frakt", Price: 44, VAT: 25`
  (exklusive moms) när `shipping_cost > 0`.
- **Rabatt i fast belopp** (`fixedAmount`) fördelas proportionellt över raderna.
  Sista raden tar resten av öresavrundningen. Taket är
  `min(fixedAmount, subtotal)`.
- **Rabattkoder** sparas med gemener i `discount_codes`, och valideringen gör
  inmatningen till gemener.

## Låst ordning i `handleOrderCompletion`

Ordningen är idempotent och atomisk (lås via `processed_at`):

1. Fortnox: hitta eller skapa kund
2. Fortnox: skapa order (med `paidPrice` exklusive moms per rad och eventuell fraktrad)
3. Fortnox: skapa faktura ur ordern (`PUT /orders/{n}/createinvoice`)
4. Fortnox: bokför fakturan (`PUT /invoices/{n}/bookkeep`)
5. Fortnox: registrera och bokför betalningen (`order.total_amount + order.shipping_cost`)
6. Ongoing: skapa leveransorder (PBREV/PUA inom Sverige)
7. Databas: spara alla referenser och status (`fulfilled`, `partial`, `confirmed`)
8. Lojalitetspoäng och prenumerationsrader
9. Bekräftelsemejl till kund och team
10. Automation efter köp

Hoppa inte över något steg utan att resonera kring följderna. Kunden ska
alltid få både faktura och leverans.

Viva-transaktionen måste ha status `F` innan Fortnox och Ongoing körs.

## Fortnox-token

- Token sparas i databasen via `db.saveFortnoxTokensToDB`. Skriv aldrig om så
  att token tappas vid deploy.
- Förnyas i förväg var 45:e minut och vid behov före anrop. Behåll
  `_fortnoxRefreshLock` så förnyelsen inte sker dubbelt.
- 401 ger en (1) automatisk förnyelse och ett nytt försök. Inte fler.

## Tillåtet utan att fråga

- Gränssnitt i `kassa/page.tsx` och `betalning/lyckad/page.tsx` (animationer,
  copy, layout).
- Nya fält i orderraderna, så länge befintliga behålls.
- Loggning, övervakning och tålighet mot nätverksfel.
- Frontend-validering av telefon, postnummer och e-post.

## Kräver uttryckligt ok

- Ändring av `FREE_SHIPPING_THRESHOLD`, `SHIPPING_COST`, `VIVA_CURRENCY_CODE`
  eller fraktradens 44 kr.
- Ändring av prenumerationsrabatten (15 %) eller fördelningen av `fixedAmount`.
- Ny eller ändrad valuta eller nytt språk.
- Borttagning eller omkastning av Fortnox-stegen 1–5 ovan.
- Ändrade fältnamn i orderraderna (`price`, `paidUnitPrice`, `originalPrice`,
  `articleNumber`, `productId`, `vatRate`, `subscription`, `intervalDays`).
- Flytt bort från Viva Wallet, Fortnox eller Ongoing.
- Direkt SQL mot `discount_codes`, `orders` eller `subscriptions`. Be
  Christopher köra det, eller använd admin.

## Verifiera före push

- `cd frontend && npx tsc --noEmit` – noll fel.
- `node -c server.js`.
- Manuellt: lägg i varukorg → kassa → ange rabattkod → klicka betala →
  kontrollera att `checkoutUrl` öppnas.
- Vid ändring i `handleOrderCompletion`: simulera webhooken med en testorder
  och kontrollera att Fortnox-fakturan får **rätt totalbelopp** och att
  betalningen registreras så att saldot blir 0.
