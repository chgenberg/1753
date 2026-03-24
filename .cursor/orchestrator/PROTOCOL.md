# Orchestrator Protocol – 1753 SKINCARE Rebuild

## Syfte

Koordinera parallella agenter som bygger om 1753skincare.com till en superminimalistisk, interaktiv webshop med komplett betalnings- och lagerhantering. Varje agent äger ett spår (track) med tydliga leverabler och acceptanskriterier.

## Regler

1. Varje agent arbetar inom sitt track – inga överlappande filändringar
2. Delade resurser (styles.css, app.js) kräver tydlig uppdelning via CSS-sektioner och JS-funktioner
3. Verifiering sker efter varje workload med `agents/verifier.md`
4. Granskning av pågående arbete via `agents/workstream-sentry.md`
5. Alla texter på korrekt svenska
6. Ingen agent får använda emojis

## De 7 agenterna

| Agent | Track | Ansvar | Huvudfiler |
|---|---|---|---|
| **Agent 1: Hem + Navigation** | `track-home` | Hero, navigation, sticky header, mobilmeny, scroll-animationer, page transitions | `index.html`, delar av `styles.css` |
| **Agent 2: Produkter + Butik** | `track-products` | Produktgrid, filtrering, produktsida, varukorg, "lägg i varukorg"-animation | `product.html`, `app.js`, delar av `styles.css` |
| **Agent 3: Om oss + Kontakt** | `track-pages` | About-sida, kontaktsida, formulärvalidering, storytelling-layout | `about.html`, `contact.html`, delar av `styles.css` |
| **Agent 4: Interaktioner + Polish** | `track-ux` | Animationer, IntersectionObserver, hover-effekter, laddningstider, accessibility, micro-interactions | Ny fil `animations.js`, delar av `styles.css` |
| **Agent 5: AI Hudanalys** | `track-analysis` | OpenAI Vision-integration, holistisk prompt, upload/resultat-UX, produktmatchning | `analysis.html`, `analysis.js`, delar av `styles.css` |
| **Agent 6: Integrationer** | `track-integrations` | Fortnox bokföring, Ongoing WMS lager, Viva Wallet betalning, backend-proxy, checkout-flöde | `server.js`, `integrations/`, `checkout.html`, `payment-*.html` |
| **Agent 7: Auth + Dashboard** | `track-auth-dashboard` | Login, registrering, JWT-auth, kunddashboard med 8 vyer, lojalitetsprogram, hudresa, prenumerationer | `login.html`, `register.html`, `auth.js`, `dashboard.html`, `dashboard.js` |

## Arbetsordning

### Fas 1–3: Bygg + Polish + Verifiering (sekventiellt)

1. Agent 1–3 + 5 bygger struktur och innehåll parallellt
2. Agent 4 arbetar på interaktioner och polish efter att grundstrukturen är klar
3. Verifierare kör efter varje agent-pass
4. Workstream-sentry granskar vid behov
5. Final sweep och rapport avslutar byggfasen

### Fas 4: Kontinuerlig förbättring (4 agenter, oändlig loop)

Mål: **världens mest interaktiva och säljande hudvårdssida**.

4 agenter roterar i en oändlig cykel. Varje cykel granskar ALLA 22 filer
(11 HTML, 1 CSS, 6 JS, 4 integrations-JS).

```
┌──────────────────────────────────────────────────┐
│  1. SENTRY skannar ALLA 22 filer (readonly)      │
│     Letar: buggar, säljhinder, designbrister,    │
│     UX-problem, kodkvalitet                      │
│     ↓ rapport med findings                       │
│  2. IMPROVER fixar alla findings + egna          │
│     Fokus: det som kostar mest att inte fixa     │
│     Min 3 säljförbättringar + 3 designfixar      │
│     + 2 interaktivitetsförbättringar per pass    │
│     ↓ rapport med alla fixar                     │
│  3. VERIFIER kontrollerar varje fix              │
│     Testar alla flöden: hem, produkt, korg,      │
│     kassa, login, dashboard, hudanalys           │
│     ↓ godkänd / problem                          │
│  4. LOGGA i IMPROVEMENT_LOG.md                   │
│     ↓                                            │
│  5. UPPREPA fran steg 1 med nästa fokus          │
└──────────────────────────────────────────────────┘
```

**Agentroller:**

| Agent | Fil | Roll | Läser/skriver |
|---|---|---|---|
| Sentry | `agents/workstream-sentry.md` | Skannar alla filer, hittar problem | Readonly |
| Improver | `agents/improver.md` | Fixar allt + egna förbättringar | Läser + skriver |
| Verifier | `agents/verifier.md` | Verifierar fixar, testar flöden | Readonly |
| Orchestrator | `skills/continuous-improvement/SKILL.md` | Styr loopen, loggar, prioriterar | Orkestrering |

**Filer att granska (komplett):**

| Typ | Filer |
|-----|-------|
| HTML (11) | index, product, about, contact, analysis, checkout, login, register, dashboard, payment-success, payment-fail |
| CSS (1) | styles.css |
| JS Frontend (4) | app.js, auth.js, dashboard.js, analysis.js |
| JS Backend (1) | server.js |
| Integrations (4) | config.js, fortnox.js, ongoing.js, vivawallet.js |

**Prioritering per cykel:**

| Cykel | Fokus | Mål |
|-------|-------|-----|
| 1-2 | Buggar, trasiga flöden | Allt fungerar felfritt |
| 3-4 | Säljkraft: CTA, korsförsäljning, trust | Varje sida säljer |
| 5-6 | Apple-design: typografi, radier, skuggor | Premium-känsla |
| 7-8 | Interaktivitet: scroll-reveal, micro-interactions | Levande upplevelse |
| 9+ | Perfektion: varje pixel, transition, edge case | Bäst i världen |

**Stoppvillkor:** Tre cykler i rad med CLEAR fran sentry + godkänt fran verifier.

**Aktivering:** `/improve`, `/förbättra`, `/loop`

**Logg:** `.cursor/orchestrator/run/2026-03-24-1753-rebuild/IMPROVEMENT_LOG.md`

**Snabbstart för Composer:**
```
Starta Fas 4 – kontinuerlig förbättring. Läs skills/continuous-improvement/SKILL.md.
Kör cykeln: sentry → improver → verifier → logga → upprepa.
Granska ALLA 22 filer. Fokus: buggar först, sedan sälj, sedan Apple-design,
sedan interaktivitet. Mål: världens mest interaktiva och säljande hudvårdssida.
Fortsätt tills tre cykler i rad ger CLEAR.
```

## Acceptanskriterier (gemensamma)

- Inga console-errors
- Responsivt på 375px, 768px, 1440px
- Apple-lik design genomgående (blur-nav, pill-knappar, stora radier, smooth transitions)
- Alla knappar och länkar fungerar med hover-effekt
- Smooth animationer utan janking
- Korrekt svenska i all synlig text
- Laddar snabbt (inga tunga beroenden)
- Alla flöden fungerar: hem → produkt → varukorg → kassa → betalning
- Auth fungerar: register → login → dashboard
- Dashboard: alla 8 vyer renderar korrekt
- AI-hudanalys: upload → analys → resultat → produktrekommendationer
- Varje sida har minst 1 säljdrivande element
