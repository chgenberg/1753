# Track: Integrationer (Fortnox + Ongoing + Viva Wallet)

## Mål
Komplett order- och betalningsflöde:
Kund → Viva Wallet Smart Checkout → Webhook → Fortnox (bokföring) + Ongoing WMS (lagerleverans)

## Arkitektur

```
┌────────────┐    ┌──────────┐    ┌─────────────┐
│  Frontend   │───>│  server.js │───>│  Fortnox API │
│ (checkout)  │    │  (proxy)   │───>│  Ongoing API │
└────────────┘    └──────────┘    │  Viva API    │
                       ▲          └─────────────┘
                       │
                  Viva Webhook
```

## Filer

| Fil | Ansvar |
|-----|--------|
| `integrations/config.js` | Konfiguration, endpoints, proxy-URL |
| `integrations/fortnox.js` | Fortnox API-klient (frontend → proxy) |
| `integrations/ongoing.js` | Ongoing WMS-klient (frontend → proxy) |
| `integrations/vivawallet.js` | Viva Wallet Smart Checkout-klient |
| `server.js` | Express backend-proxy |
| `checkout.html` | Kassasida med formulär |
| `payment-success.html` | Bekräftelse efter betalning |
| `payment-fail.html` | Fehantering vid misslyckad betalning |
| `.env.example` | Mall för miljövariabler |
| `package.json` | Node-beroenden |

## Betalningsflöde (Viva Wallet)

1. **Kund** fyller i leveransuppgifter på `checkout.html`
2. **Frontend** anropar `VivaWalletClient.checkout(customerInfo)`
3. **Backend** (`POST /api/vivawallet/payment-order`) skapar Payment Order via Viva API
4. **Frontend** redirectar till Viva Smart Checkout (`?ref={orderCode}`)
5. **Kund** betalar → Viva redirectar till `payment-success.html` eller `payment-fail.html`
6. **Viva Webhook** (`POST /api/vivawallet/webhook`) tar emot EventTypeId 1796
7. **Backend** skapar order i Fortnox + Ongoing WMS + faktura + betalning

## Fortnox-flöde

1. Skapa eller hämta kund (`/customers`)
2. Skapa order med OrderRows (`/orders`)
3. Konvertera order till faktura (`/orders/{id}/createinvoice`)
4. Registrera betalning (`/invoicepayments`)
5. Artikelsynk: PRODUCTS-array → Fortnox Articles

## Ongoing WMS-flöde

1. Synka artiklar (PUT `/articles`)
2. Skapa leveransorder (PUT `/orders`)
3. Hämta lagersaldo (`/inventoryBalances`)
4. Hämta fraktmetoder (`/transporterContracts`)

## Uppgifter

### Fas A – Grundflöde (måste funka)
- [x] Config-modul med alla endpoints
- [x] Fortnox-klient (kunder, ordrar, fakturor, artiklar, betalningar)
- [x] Ongoing-klient (artiklar, lagersaldo, ordrar, frakt)
- [x] Viva Wallet-klient (Smart Checkout redirect)
- [x] Backend-proxy (Express med alla routes)
- [x] Kassasida (leveransformulär + ordersammanfattning)
- [x] Success/fail-sidor
- [x] Komplett webhook-hantering

### Fas B – Robusthet (nästa steg)
- [ ] Fortnox OAuth token-refresh (automatisk förnyelse)
- [ ] Retry-logik vid nätverksfel
- [ ] Validering av checkout-formulär (svenska postnummer, telefon)
- [ ] E-postbekräftelse via Fortnox eller separat
- [ ] Lagersaldovisning på produktsidor (via Ongoing)
- [ ] Rate limiting på webhook-endpoint
- [ ] Loggning till fil/service

### Fas C – Produktion
- [ ] HTTPS med certifikat
- [ ] Viva Wallet live-credentials + Source Code
- [ ] Fortnox OAuth-flöde (auktorisera via webbläsare)
- [ ] Ongoing produktions-URL
- [ ] Webhook-verifiering (signatur/secret)
- [ ] Error monitoring (Sentry/LogRocket)

## Auth-detaljer

### Fortnox
- OAuth 2.0 med Authorization Code
- Access token: 1h, Refresh token: 45 dagar
- Scopes: bookkeeping, invoice, customer, article, order
- API v3: `https://api.fortnox.se/3/`

### Ongoing WMS
- Basic Auth (username:password)
- Goods Owner REST API
- Base URL: `https://api.ongoingwarehouse.com/{goodsOwnerId}`

### Viva Wallet
- OAuth 2.0 Client Credentials
- Demo: `https://demo-api.vivapayments.com`
- Prod: `https://api.vivapayments.com`
- Checkout: `https://www.vivapayments.com/web/checkout?ref={orderCode}`
- Webhook: EventTypeId 1796 = Transaction Payment Created
