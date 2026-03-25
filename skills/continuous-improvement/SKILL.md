---
name: continuous-improvement
description: Kör en kontinuerlig förbättringsloop med 4 agenter som gör 1753 SKINCARE till världens mest interaktiva och säljande hudvårdssida. Aktivera med /improve, /förbättra, /loop.
---

# Kontinuerlig förbättringsloop – 1753 SKINCARE

Mål: Göra sidan till **världens mest interaktiva och säljande hudvårdssida**.
Designstandard: **Apple-lik minimalism**.
Metod: 4 agenter roterar i en oändlig cykel tills perfektion uppnås.

## Självförbättring – lär av förra cykeln

Loopen ska **inte börja om från noll** varje gång.

1. **Innan Steg 1 (Sentry):** Läs **senaste** `### Kvarstår till nästa cykel` i `IMPROVEMENT_LOG.md` och filen **`LEARNINGS.md`** i samma run-mapp (`.cursor/orchestrator/run/2026-03-24-1753-rebuild/LEARNINGS.md`). Be Sentry uttryckligen ta hänsyn till dessa punkter i handoffen under *Kända problem från förra cykeln*.
2. **Efter Steg 4 (Logga):** Lägg till en kort bullet-lista i **`LEARNINGS.md`** under en ny rubrik `## Cykel [N]` med: vad som visade sig viktigt, vad som återstår, en varning till nästa körning (t.ex. återkommande fallgropar).
3. **Mål:** Varje cykel bygger på föregående – närmare **världens bästa** sajt utan att upprepa samma misstag.

## Aktivering

**Chunkad körning (färre Provider-fel):** använd färdiga prompts och ny chatt mellan steg – se `.cursor/orchestrator/run/2026-03-24-1753-rebuild/SESSION_CHUNKS.md`. Validering i terminal: `./scripts/chunk-verify.sh`.

Använd denna skill när:
- Användaren skriver `/improve`, `/förbättra`, eller `/loop`
- Användaren ber om buggfixar, kodförbättringar, eller designförbättringar
- Användaren vill att agenterna granskar och förbättrar koden upprepade gånger
- Allt är byggt och det är dags att polera till perfektion

## De 4 agenterna

| Agent | Roll | Läser/skriver | Fil |
|-------|------|--------------|-----|
| **Sentry** | Skannar alla filer, hittar problem | Readonly | `agents/workstream-sentry.md` |
| **Improver** | Fixar allt sentry hittar + egna findings | Läser + skriver | `agents/improver.md` |
| **Verifier** | Kontrollerar att fixarna fungerar | Readonly | `agents/verifier.md` |
| **Orchestrator** | Styr loopen, loggar, avgör om ny cykel behövs | Denna skill | Du (som kör loopen) |

## Projektets alla filer (komplett lista)

### HTML-sidor (11 st)
- `index.html` – Startsida: hero, produktgrid, hudanalys-CTA
- `product.html` – Produktsida: bild, detaljer, köpknapp
- `about.html` – Om oss: grundare, vision
- `contact.html` – Kontakt: formulär, adress
- `analysis.html` – AI-hudanalys: foto-upload, resultat
- `checkout.html` – Kassa: leveransformulär, Viva Wallet
- `login.html` – Inloggning
- `register.html` – Registrering
- `dashboard.html` – Kunddashboard: 8 vyer
- `payment-success.html` – Bekräftelse
- `payment-fail.html` – Felsida

### CSS (1 fil)
- `styles.css` – Komplett designsystem med Apple-lik minimalism, auth, dashboard

### JavaScript (5 frontend + 1 backend)
- `app.js` – PRODUCTS (9 st), varukorg (localStorage), rendering
- `auth.js` – AuthClient: JWT, login/register, sessionhantering
- `dashboard.js` – Dashboard: routing, stats, hudresa, ordrar, rutin, lojalitet, önskelista
- `analysis.js` – OpenAI Vision via server-proxy, resultatvisning
- `server.js` – Express backend: auth (bcrypt+JWT), OpenAI-proxy, Fortnox, Ongoing, Viva Wallet

### Integrationer (4 st)
- `integrations/config.js` – Endpoints, proxy-URL
- `integrations/fortnox.js` – Bokföring
- `integrations/ongoing.js` – 3PL-lager
- `integrations/vivawallet.js` – Betalning (Smart Checkout)

## Cykeln: Skanna → Fixa → Verifiera → Logga → Upprepa

### Steg 1 – SENTRY skannar

Kör `agents/workstream-sentry.md` med denna handoff:

```
Handoff till Sentry – Cykel [N]:
- Granska ALLA filer: index.html, product.html, about.html, contact.html,
  analysis.html, checkout.html, login.html, register.html, dashboard.html,
  payment-success.html, payment-fail.html, styles.css, app.js, auth.js,
  dashboard.js, analysis.js, server.js, integrations/*.js
- Designstandard: Apple-lik minimalism (frosted glass, pill-knappar, stora radier,
  generösa marginaler, subtila skuggor, smooth transitions)
- Mål: världens mest **interaktiva** och säljande hudvårdssida; **minimalistiska ramar** och **snygg produktpresentation** (grid, produktsida, hero)
- Fokus cykel [N]: [se prioritering nedan]
- Kända problem fran förra cykeln: [lista eller "inga"]
```

### Steg 2 – IMPROVER fixar

Skicka sentrys rapport till `agents/improver.md`:

```
Handoff till Improver – Cykel [N]:
- Sentrys findings: [klistra in rapporten]
- Fixa ALLT sentry hittade
- Sök dessutom efter EGNA förbättringar
- Fokus denna cykel: [se prioritering nedan]
- Mål: gör varje fil mer säljande, **mer interaktiv**, mer Apple-lik; **produktpresentation** och **minimalistiska ramar** där det höjer kvaliteten
```

Improver fixar allt och rapporterar vad som gjordes.

### Steg 3 – VERIFIER kontrollerar

Skicka improvers rapport till `agents/verifier.md`:

```
Handoff till Verifier – Cykel [N]:
- Improvers rapport: [klistra in]
- Verifiera att VARJE påstådd fix är implementerad
- Kontrollera att INGA nya buggar introducerats
- Testa alla huvudflöden: startsida, produktsida, varukorg, kassa,
  login, register, dashboard (alla 8 vyer), hudanalys
- Verifiera Apple-design: nav blur, pill-knappar, radier, shadows, transitions
- Kontrollera produktbilder (`public/`), hero-bilder, och att presentation (ramar, hover) känns premium
```

### Steg 4 – LOGGA

Lägg till en entry i `.cursor/orchestrator/run/2026-03-24-1753-rebuild/IMPROVEMENT_LOG.md`:

```markdown
## Cykel [N] – [datum]

### Sentry hittade
- [antal] buggar
- [antal] säljhinder
- [antal] designbrister
- [antal] UX-problem
- [antal] kodproblem

### Improver fixade
- **Buggar:** [lista]
- **Sälj:** [lista]
- **Design:** [lista]
- **Interaktivitet:** [lista]
- **Kod:** [lista]

### Verifiering
- Status: [GODKÄND / PROBLEM / DELVIS]
- Flöden OK: [lista]
- Flöden med problem: [lista]

### Kvarstår till nästa cykel
- [lista]
```

### Steg 5 – LÄR (självförbättring)

Uppdatera `LEARNINGS.md` med 3–8 punkter: vad cykeln lärde, vad som ska prioriteras härnäst, vad som **inte** ska upprepas.

### Steg 6 – UPPREPA

Gå tillbaka till Steg 1 med nästa cykels fokusområde (och med `Kvarstår` + `LEARNINGS` som input).

## Prioritering per cykel

| Cykel | Primärt fokus | Sekundärt fokus |
|-------|--------------|-----------------|
| **1** | Buggar, trasiga flöden, JavaScript-errors | Grundläggande Apple-design |
| **2** | Auth + Dashboard-buggar, checkout-flöde | Saknade hover-states |
| **3** | Säljkraft: CTA:er, korsförsäljning, trust-signaler | Responsivitet |
| **4** | Apple-design: konsekvent typografi, radier, skuggor | Accessibility |
| **5** | Interaktivitet: scroll-reveal, stagger, micro-interactions | Performance |
| **6** | Dashboard-polish: hudresa, lojalitet, rutin-UX | Kodkvalitet |
| **7** | Säljoptimering: checkout, prenumerationer, re-order | SEO |
| **8** | Edge cases: tomma states, felhantering, nätverksfel | Mobilpolish |
| **9+** | Perfektion: varje pixel, varje transition, varje interaction | Allt |

## Säljmål per cykel

Varje cykel ska göra sidan mätbart mer säljande:

- **Cykel 1-2:** Grundflödet fungerar felfritt (ingen tappar bort i buggar)
- **Cykel 3-4:** Varje produktsida har minst 3 säljargument synliga utan scroll
- **Cykel 5-6:** Dashboard får kunden att vilja köpa mer (rekommendationer, re-order)
- **Cykel 7-8:** Checkout har trust-signaler, prenumerationserbjudande, garanti-badge
- **Cykel 9+:** Sidan KÄNNS som en Apple Store – premium, pålitlig, owiderstådlig

## Interaktivitetsmål per cykel

- **Cykel 1-2:** Alla knappar har hover-effekt, cart fungerar smooth
- **Cykel 3-4:** Produktgrid har stagger fade-in, hero har parallax
- **Cykel 5-6:** Dashboard-animationer (progress bars, timeline, routine checks)
- **Cykel 7-8:** Page transitions, loading skeletons, image blur-up
- **Cykel 9+:** Varje klick, hover, scroll har en medveten micro-interaction

## Stoppvillkor

Loopen avslutas NÄR:
1. Tre cykler i rad där Sentry rapporterar CLEAR
2. OCH Verifier godkänner alla flöden
3. OCH inga buggar, säljhinder, eller designbrister kvarstår

ELLER: Manuellt stopp fran användaren.

Vid stopp: Skriv en komplett slutrapport med:
- Totalt antal cykler
- Alla förbättringar kategoriserade
- Kvarstående förbättringsmöjligheter
- Bedömning: "Är detta världens bästa hudvårdssida?"

## Vad som ALDRIG ska ändras

- Produktdata (namn, priser) – ägs av butiksägaren
- Grundfärgerna i designsystemet
- Den holistiska filosofin i AI-hudanalysen
- Antalet menypunkter (Hem, Produkter, Om oss, Kontakt)
- API-nycklar och credentials
- server.js auth-logik (säkerhetsändringar kräver manuell granskning)

## Snabbstart

```
/improve

Starta kontinuerlig förbättringsloop. Läs först senaste Kvarstår i IMPROVEMENT_LOG.md och LEARNINGS.md.
Kör: Sentry → Improver → Verifier → Logga → uppdatera LEARNINGS.md → Upprepa.

Granska ALLA filer: 11 HTML, styles.css, 5 JS, server.js, 4 integrationer.
Fokus: buggar först, sedan sälj, sedan Apple-design, sedan interaktivitet.
Mål: världens mest interaktiva och säljande hudvårdssida.
Fortsätt tills tre cykler i rad ger CLEAR.
```

## Referens

- **Självförbättring / minne:** `.cursor/orchestrator/run/2026-03-24-1753-rebuild/LEARNINGS.md`
- **Historik per cykel:** samma mapp, `IMPROVEMENT_LOG.md`
- **Chunkad körning:** `SESSION_CHUNKS.md` i samma mapp
