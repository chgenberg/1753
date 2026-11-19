---
name: 1753-feedback-8-agents
description: >-
  Stor granskning av 1753 SKINCARE i åtta parallella spår (butik och backend)
  som bara hittar buggar och förbättringar. Varje fynd får poäng 1–5 och
  resultatet sparas som .txt i feedback/. Inga kodändringar. Använd när
  Christopher ber om en stor audit, buggjakt över hela sajten, "kör åtta
  agenter" eller flera granskningsvarv med körnings-id.
---

# 1753 – granskning i åtta spår (bara fynd, inga kodändringar)

## Syfte

- Åtta subagenter granskar var sin del av kodbasen och upplevelsen.
- Varje fynd får **poäng 1–5** (5 = mest kritiskt eller mest värt att åtgärda).
- **Inga ändringar i koden.** Bara läsa, analysera och skriva rapporter.
- Rapporterna hamnar under `feedback/` i projektroten (ligger i `.gitignore`).

Det här är den stora granskningen, inte det dagliga arbetssättet. Åtta
agenter kostar – bekräfta med Christopher innan du startar.

## Läs först

- `CLAUDE.md`
- `.claude/rules/regressionsskydd.md` (markera fynd som kan påverka de
  kritiska flödena)
- `.claude/rules/varumarke-design.md`

## Körnings-id

**En körning:** skriv till filerna i tabellen direkt under `feedback/`. Det
skriver över föregående körning – säg det tydligt när du är klar.

**Flera körningar:** anger Christopher ett id (till exempel `körning 3`,
`20261119-2`) läggs samma åtta filnamn i `feedback/runs/<id>/`.

## De åtta spåren

| Spår | Filnamn | Fokus | Börja i |
|---|---|---|---|
| 01 | `01-navigation-ia.txt` | Routing, middleware, länkar, språk-URL:er, 404, header och footer, dubbla canonicals | `frontend/src/middleware.ts`, `lib/i18n/navigation.ts`, `components/header.tsx`, `components/footer.tsx` |
| 02 | `02-ui-design-tokens.txt` | Layout, Tailwind, kontrast, mobil, produktkort, varumärkesregler | `frontend/src/components/`, `app/globals.css` |
| 03 | `03-interaktion-tillstand.txt` | Laddning, fel, tomma tillstånd, övergångar, reduced motion, formulärflöden, varukorgslådan | `providers/cart-provider.tsx`, `components/cart-drawer.tsx`, `components/fx/` |
| 04 | `04-tillganglighet.txt` | Fokus, aria, etiketter, tangentbord, semantik, hoppa-till-innehåll | header, varukorg, chatt, kassa, `components/ui/` |
| 05 | `05-prestanda-seo.txt` | `next/image`, LCP, metadata, JSON-LD, sitemap och robots, bundle | `frontend/next.config.ts`, `app/sitemap.ts`, `app/robots.ts`, `lib/seo/` |
| 06 | `06-api-backend.txt` | Rutter, auth, betalning, mejl, spärrar, språk i felmeddelanden, databasrisker | `server.js`, `db.js`, `services/` |
| 07 | `07-i18n-copy.txt` | Alla fem språk, hårdkodad text, mejl- och nyhetsbrevstexter, ton | `frontend/src/lib/i18n/strings/*.ts` |
| 08 | `08-edge-regression.txt` | Kassa, hudanalys, konto, betalningsreturer, kantfall, risk mot regressionsskyddet | `app/[locale]/kassa/`, `hudanalys/`, `mitt-konto/`, `betalning/` |

## Poängskala (obligatorisk för varje fynd)

- **5** – Kritiskt: säkerhet, dataförlust, trasigt köp, trasig analys eller
  betalning, grovt fel på flera språk
- **4** – Högt: tydlig bugg, trasig länk eller trasigt flöde, SEO-fel som
  skadar synligheten
- **3** – Medel: inkonsekvens, dålig UX, delvis fel språk, märkbar tröghet
- **2** – Lågt: kosmetik, mindre copy, marginell förbättring
- **1** – Trivialt: observation, bra att ha

## Format i varje fil

UTF-8, svenska rubriker:

```
SPÅR: <nummer och namn>
KÖRNING: <standard | runs/<id>>
DATUM: <ISO-datum>
AGENT: <kort beskrivning av rollen>

=== FYND ===

[POÄNG 4] Kort titel
Plats: sökväg:rad eller URL-mönster
Beskrivning: ...
Rekommenderad åtgärd (bara förslag, ingen implementation):

[POÄNG 3] ...

=== SAMMANFATTNING ===
Antal fynd per nivå: 5:x, 4:x, 3:x, 2:x, 1:x
De tre viktigaste (bara titlar):
1. ...
2. ...
3. ...
```

## Arbetsgång

1. Bekräfta körnings-id med Christopher, eller använd standard (`feedback/`).
2. Skapa `feedback/` (och vid behov `feedback/runs/<id>/`).
3. Starta **åtta subagenter parallellt**, en per spår. Ge varje agent: spårets
   fokus och startfiler, poängskalan, filformatet, den exakta sökvägen den
   ska skriva till, och förbudet nedan. Agenten får skapa sin egen rapportfil
   och ingenting annat.
4. När alla åtta filer finns: läs sammanfattningarna och ge en **kort**
   helhetsbild i chatten – de 5–10 högst rankade fynden över alla spår.
5. Kontrollera med `git status` att inget utanför `feedback/` har ändrats.

## Variation mellan upprepade körningar

Be varje spår prioritera något annat än förra gången:

- bara filer som ändrats nyligen (`git log`)
- bara `server.js`, eller bara `frontend/src/app/[locale]`
- bara mobil, eller bara ett språk (rotera)
- bara säkerhet, eller bara prestanda

## Uttryckligen förbjudet

- Kodändringar, refaktorering, commits, push.
- Ändringar i produktdata, färger, `ANALYSIS_SYSTEM_PROMPT` eller hemligheter.
- Anrop mot produktion: inga ordrar, inga mejl, ingen `railway run`.
