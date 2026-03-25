# Lärdomar – 1753 SKINCARE (självförbättring)

Den här filen är **minnet mellan cykler**: korta punkter om vad som fungerat, vad som återstår, och vad nästa körning ska undvika att upprepa.

**Regel:** Varje gång en cykel avslutas (efter Verifier), lägger orchestrator till en sektion **Cykel [N]** nedan.  
**Regel:** Innan **Sentry** startar nästa cykel: läs **senaste posten här** + **senaste `Kvarstår`** i `IMPROVEMENT_LOG.md`.

---

## Cykel – start (2026-03-25)

- **Backend-URL:** `auth.js` / `analysis.js` måste laddas **efter** `integrations/config.js` så `INTEGRATION_CONFIG.backendUrl` finns; `checkout.html` har korrekt ordning.
- **Dashboard:** Kräver `auth.js` + `auth_user_1753` / JWT – annars tom session.
- **Bilder:** Produkt- och hero-filer förväntas under `public/` och `public/Products/`; fel filnamn (t.ex. mellanslag) ger 404 – verifiera i nätverkspanelen.
- **Design:** Minimalistiska ramar (skugga + inset) på produktkort/detajl; hero med `.hero--with-media` + gradient för läsbar text.
- **Nästa fokus:** SEO/delning (Open Graph), fler micro-interactions utan att bryta `prefers-reduced-motion`, eventuellt parallax/light motion på hero.

---

## Cykel 4 – 2026-03-25 (självförbättring + SEO + hero-rörelse)

- **Loop:** `SKILL.md` har nu Steg 5 **Lär** – efter varje logg ska `LEARNINGS.md` fyllas på så nästa Sentry/Improver **läser av historiken** (inte nollställa).
- **SEO/delning:** `index.html` har `canonical`, Open Graph och Twitter Card med absolut `og:image` mot `https://1753skincare.com/public/1753desktop.png` – vid annan domän måste URL:er uppdateras konsekvent.
- **Hero:** Lätt parallax på `.hero--with-media` via `animations.js` (inaktiv vid `prefers-reduced-motion`); `will-change: transform` på `.hero-media`.
- **Dokumentation:** `SESSION_CHUNKS.md` har Del 5 för lärdomar; `workstream-sentry.md` pekar på `LEARNINGS.md`; projektregeln länkar till `LEARNINGS.md`.
- **Nästa fokus:** OG på fler landningssidor (analys, checkout); dynamisk `og:title` för produktsida om möjligt; ev. `Riskzon` i dashboard om önskat; fortsatt pixel-polish enligt prioriteringstabell.

---

## Cykel 5 – 2026-03-25

- **OG/delning:** `analysis.html` och `checkout.html` har nu `canonical` + OG + Twitter (samma mönster som `index.html`).
- **Produktsida:** `app.js` sätter vid lyckad `renderProductDetail()` meta + canonical + OG/Twitter via `SITE_ORIGIN` och `product.image` (absolut URL till `public/...`).
- **Dashboard:** Rubrik **Riskzon** (tidigare stavfel Farozon).
- **Nästa fokus:** Synka `SITE_ORIGIN` + statiska OG-URL:er om produktion inte är `1753skincare.com`; micro-interactions / pixel enligt tabell; ev. server-renderad produkt-meta om SEO kräver det utan JS.

---

## Cykel 6 – 2026-03-25

- **OG/delning:** Alla relevanta HTML-sidor (om oss, kontakt, inloggning, registrering, betalningsbekräftelse/-fel, produktfallback, dashboard) har nu `canonical` + OG + Twitter i linje med startsidan.
- **Tillgänglighet:** `focus-visible` med grön ring på primär navigation och knappar.
- **Rörelse:** Vid `prefers-reduced-motion: reduce` stängs produktkorts hover-scale och bildzoom samt knappars `:active`-scale av; knappar behåller fortfarande mjuk färg/skjugg.
- **Nästa fokus:** Global domänbytestrategi; fler `focus-visible` på formulärfält om granskning visar att fokus är otydligt; fortsatt pixel/interaktivitet enligt prioritering.

---

## Cykel 7 – 2026-03-25

- **Formulär:** Grön fokusring visas vid **tangentbordsfokus** (`:focus-visible`) på inloggning, kassa, kontakt, shop-select, storleksval, API-fält – mus klickar utan extra ring.
- **Hudanalys:** Dropzonen är fokuserbar (`tabindex="0"`), aktiveras med Enter/blanksteg, har `aria-label` och synlig `:focus-visible`-kontur.
- **Detaljsidor:** `auth-link` och produktens `<summary>`-rader har `focus-visible` för tangentnavigation.
- **Nästa fokus:** Domänbyte i ett svep; ev. footer-/textlänkar; reveal/scroll enligt tabell.
