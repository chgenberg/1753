# Roadmap: 1753 SKINCARE Rebuild

**Mål:** Bygga den mest interaktiva och visuellt slående minimalistiska hudvårdssidan som någonsin skapats. Inspiration från mantleskin.com/sv men renare.

**Datum:** 2026-03-24

---

## Fas 1 – Grundstruktur (parallellt, Agent 1–3)

### Track: Hem + Navigation (Agent 1)
- [ ] Redesigna hero-sektion med fullbredd-layout och subtil parallax
- [ ] Sticky navigation med shrink-on-scroll
- [ ] Mobilmeny med smooth slide-in
- [ ] Announcement bar (frakt-info)
- [ ] Smooth page-scroll med sektionsövergångar
- [ ] Footer redesign med hover-effekter

### Track: Produkter + Butik (Agent 2)
- [ ] Produktgrid med hover-zoom och snabb-info overlay
- [ ] Filtrera/sortera produkter (pris, typ)
- [ ] Produktsida med bildgalleri-känsla
- [ ] Varukorg-drawer med smooth slide-in + quantities
- [ ] "Lägg i varukorg"-animation (flyg-till-ikon eller pulse)
- [ ] Prisbadge för rabatterade produkter
- [ ] Relaterade produkter-sektion på produktsida

### Track: Om oss + Kontakt (Agent 3)
- [ ] About-sida med storytelling-layout (text + visuella block)
- [ ] Parallax-sektioner på about-sidan
- [ ] Kontaktformulär med inline-validering och animation
- [ ] Kontaktuppgifter med kartkänsla eller grafik
- [ ] Responsiv grid-layout för båda sidorna

---

## Fas 1b – AI Hudanalys (Agent 5, parallellt med Fas 1)

### Track: Holistisk Hudanalys
- [ ] Streaming av OpenAI-svar (SSE) för realtidskänsla
- [ ] Förbättrad resultatformatering med visuella sektioner
- [ ] Animerad laddningsindikator med hudfakta
- [ ] Analyshistorik i localStorage (spara och jämför)
- [ ] "Före och efter"-jämförelse över tid
- [ ] Follow-up frågor ("Berätta mer om din kost", "Hur sover du?")
- [ ] Server-side proxy för API-nyckel (säkerhet)
- [ ] Rate limiting och smart felhantering
- [ ] Mobilanpassad kamera-integration (capture="user")
- [ ] Drag-and-drop polish med visuell feedback

---

## Fas 1c – Integrationer (Agent 6, parallellt med Fas 1)

### Track: Fortnox + Ongoing WMS + Viva Wallet

#### Grundflöde (klart, scaffoldat)
- [x] Config-modul med alla endpoints (`integrations/config.js`)
- [x] Fortnox-klient: kunder, ordrar, fakturor, artiklar, betalningar (`integrations/fortnox.js`)
- [x] Ongoing-klient: artiklar, lagersaldo, ordrar, frakt (`integrations/ongoing.js`)
- [x] Viva Wallet Smart Checkout-klient (`integrations/vivawallet.js`)
- [x] Express backend-proxy med alla routes (`server.js`)
- [x] Kassasida med leveransformulär + ordersammanfattning (`checkout.html`)
- [x] Success/fail-sidor (`payment-success.html`, `payment-fail.html`)
- [x] Komplett webhook-hantering + orderflöde

#### Robusthet (TODO)
- [ ] Fortnox OAuth token-refresh (automatisk förnyelse av access token)
- [ ] Retry-logik vid nätverksfel (exponential backoff)
- [ ] Formulärvalidering: svenska postnummer, telefon, e-post
- [ ] Lagersaldovisning på produktsidor (Ongoing → frontend)
- [ ] Rate limiting på webhook-endpoint
- [ ] E-postbekräftelse (via Fortnox eller separat SMTP)
- [ ] Loggning (structured logging)

#### Produktion (TODO)
- [ ] HTTPS med certifikat
- [ ] Viva Wallet live-credentials + Source Code
- [ ] Fortnox OAuth-auktoriseringsflöde (webbläsare)
- [ ] Ongoing produktions-URL
- [ ] Webhook-signaturverifiering
- [ ] Error monitoring

---

## Fas 1d – Autentisering + Kunddashboard (Agent 7, parallellt)

### Track: Login + Dashboard med smarta funktioner
Designriktning: Apple-lik minimalism. Världens bästa kundupplevelse.

#### Grundflöde (klart)
- [x] Login-sida med e-post/lösenord (`login.html`)
- [x] Registreringssida med validering (`register.html`)
- [x] Frontend auth-klient med JWT (`auth.js`)
- [x] Backend auth-routes: register, login, profile, password (`server.js`)
- [x] Dashboard med 8 vyer (`dashboard.html` + `dashboard.js`):
  - [x] Översikt med statistik och rekommendationer
  - [x] Min hudresa – tidslinje med analyser
  - [x] Mina ordrar – status, spårning
  - [x] Min rutin – morgon/kväll, streak
  - [x] Förmåner – lojalitetsprogram (4 nivåer)
  - [x] Prenumerationer – auto-leverans
  - [x] Önskelista
  - [x] Inställningar – profil, lösenord, notifikationer
- [x] Apple-lik CSS: frosted glass nav, pill-knappar, stora radier, hover-elevation
- [x] Responsiv: sidebar → stacked på mobil

#### Förbättringar (TODO)
- [ ] OAuth (Google, Apple ID)
- [ ] Glömt lösenord (e-postflöde)
- [ ] E-postverifiering
- [ ] Databas (PostgreSQL/MongoDB) istället för in-memory
- [ ] Refresh tokens
- [ ] Push-notifikationer
- [ ] Recurring payments via Viva Wallet
- [ ] Admin-dashboard

---

## Fas 2 – Interaktioner + Polish (Agent 4)

- [ ] IntersectionObserver-baserade reveal-animationer på scroll
- [ ] Stagger-animationer för produktgrid (cascading fade-in)
- [ ] Smooth hover-states på alla interaktiva element
- [ ] Custom cursor eller subtil cursor-effekt
- [ ] Loading-state för bilder (skeleton/blur-up)
- [ ] Micro-interactions: knapptryck, formulärfält-focus, cart-badge bounce
- [ ] Prefers-reduced-motion respekteras
- [ ] Accessibility-granskning (aria, tabindex, focus-styles)
- [ ] Performance-optimering (lazy loading, will-change, GPU layers)

---

## Fas 3 – Verifiering + Sweep

- [ ] Kör verifier på alla sidor
- [ ] Kör workstream-sentry för sista granskning
- [ ] Testa på mobil (375px), tablet (768px), desktop (1440px)
- [ ] Console-error check
- [ ] FINAL_SWEEP.md
- [ ] FINAL_REPORT.md

---

## Fas 4 – Kontinuerlig förbättring (oändlig loop)

Denna fas aktiveras efter att Fas 1–3 är klara. Tre agenter roterar i en oändlig cykel.

### Cykeln

```
SENTRY (skanna) → IMPROVER (fixa) → VERIFIER (kontrollera) → upprepa
```

### Per cykel

1. **Sentry** (`agents/workstream-sentry.md`) skannar alla filer och rapporterar findings
2. **Improver** (`agents/improver.md`) fixar alla findings + egna observationer
3. **Verifier** (`agents/verifier.md`) kontrollerar att fixarna fungerar
4. Logga i `IMPROVEMENT_LOG.md`
5. Tillbaka till steg 1

### Prioritet per cykelblock

| Cykel | Fokus |
|---|---|
| 1–2 | Buggar, trasiga funktioner, console-errors |
| 3–4 | UX-brister, responsivitet, accessibility, saknade hover-states |
| 5–6 | Koddoft, duplicerad CSS, inline styles, inkonsekvent namngivning |
| 7–8 | Performance, lazy loading, will-change, GPU-acceleration |
| 9+ | Micro-interactions, edge cases, perfektion |

### Checklista per cykel

- [ ] Alla HTML-filer granskade (inkl. checkout, payment-success, payment-fail)
- [ ] styles.css granskad
- [ ] app.js granskad
- [ ] analysis.js granskad
- [ ] integrations/*.js granskade
- [ ] server.js granskad
- [ ] Inga nya console-errors
- [ ] Responsivitet intakt (375px, 768px, 1440px)
- [ ] Varukorg fungerar
- [ ] Kassaflöde fungerar (checkout → betalning → bekräftelse)
- [ ] AI-hudanalys fungerar
- [ ] Alla länkar och knappar fungerar

### Stoppvillkor

Loopen avslutas när:
- Tre cykler i rad där sentry + improver rapporterar CLEAR
- ELLER manuellt stopp från användaren

### Aktivering

```
/improve
```

Eller:

```
/orchestrator

Starta Fas 4 – kontinuerlig förbättring. Kör cykeln sentry → improver → verifier
på alla filer. Fortsätt tills tre cykler i rad ger CLEAR.
```

---

## Designreferens

Se `context/design-system.md` för komplett designsystem.

## Befintlig kod

Grundläggande HTML/CSS/JS finns redan:
- `index.html` – grundläggande startsida
- `product.html` – produktsida
- `about.html` – om oss
- `contact.html` – kontakt
- `styles.css` – grundstyling
- `app.js` – produktdata + varukorglogik

Allt ska byggas vidare på – inte skrivas om från scratch.

### AI Hudanalys (nytt)
- `analysis.html` – Upload + resultatvy
- `analysis.js` – OpenAI Vision-integration med holistiskt system prompt
- Grundläggande flöde fungerande: upload → analys → resultat → produktrekommendationer
- Produktbilder ersatta med Unsplash-mockups (original-URL:er sparade som `shopifyImage`)

### Integrationer (nytt)
- `integrations/config.js` – Konfiguration och endpoints
- `integrations/fortnox.js` – Fortnox bokföring (kunder, ordrar, fakturor, artiklar)
- `integrations/ongoing.js` – Ongoing WMS 3PL (artiklar, lagersaldo, ordrar, frakt)
- `integrations/vivawallet.js` – Viva Wallet Smart Checkout (redirect-flöde)
- `server.js` – Express backend-proxy (hanterar API-nycklar server-side)
- `checkout.html` – Kassasida med leveransformulär
- `payment-success.html` / `payment-fail.html` – Bekräftelse/felsidor
- `.env.example` – Mall för API-nycklar
- `package.json` – Node-beroenden
- Komplett orderflöde: kund → Viva → webhook → Fortnox + Ongoing
