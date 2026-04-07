---
name: 1753-frontend-audit-composer
description: >-
  Kör strukturerad UI/UX- och kodgranskning av 1753 SKINCARE Next.js-fronten.
  Åtta spår-agenter skriver till docs/frontend-audit/tracks/; sammanfattning i
  docs/frontend-audit-*.txt. Använd vid förbättring, buggar eller Composer 2.0-
  granskning. Pekar på utdatafiler och projektregler.
---

# 1753 frontend-granskning med Composer 2.0

## När ska detta användas

- Användaren nämner **Composer 2.0**, **skills**, frontend-audit eller "världens bästa hudvårdssida".
- Du ska producera eller uppdatera audit-listor utan att gissa bortom kodbasen.

## Modellval (Cursor)

1. I Cursor: välj **Composer** och modell **Composer 1** eller **Composer 2** (det som visas som "Composer 2.0" i din klient) för längre, helhetsinriktade pass över många filer.
2. Agent-läge med denna skill aktiv: följ stegen nedan sekventiellt.
3. **Fleragents-läge (rekommenderat vid full granskning):** använd åtta spår-agenter
   (en per dimension nedan). Varje agent uppdaterar **sin** fil under
   `docs/frontend-audit/tracks/`. Avsluta med **sammanfattningssteget**: uppdatera
   de två filerna i `docs/` (prioriterade åtgärder + buggar) utifrån spåren –
   undvik att duplicera allt; spår-filerna är källan till detalj.
4. Chat-läge: ge användaren samma checklista och be dem köra Composer 2.0 för en djupare pass om scope är stort.

## Obligatorisk läsning innan audit

- Projektregel: `.cursor/rules/1753-skincare-project.mdc`
- Designsystem (om relevant): `.cursor/orchestrator/run/2026-03-24-1753-rebuild/context/design-system.md`
- Frontend-root: `frontend/src/`

## Utdatafiler (uppdatera dessa, skapa inte dubbletter)

### Spår-agenter (en fil per dimension)

| Agent | Fil | Ansvar |
|-------|-----|--------|
| 01 | `docs/frontend-audit/tracks/agent-01-navigation-ia.txt` | Navigation & IA |
| 02 | `docs/frontend-audit/tracks/agent-02-typografi-layout.txt` | Typografi & layout |
| 03 | `docs/frontend-audit/tracks/agent-03-rorelse-micro-ux.txt` | Rörelse & micro-UX |
| 04 | `docs/frontend-audit/tracks/agent-04-tillganglighet.txt` | Tillgänglighet |
| 05 | `docs/frontend-audit/tracks/agent-05-prestanda.txt` | Prestanda |
| 06 | `docs/frontend-audit/tracks/agent-06-api-koppling.txt` | Koppling mot API |
| 07 | `docs/frontend-audit/tracks/agent-07-copy-varumarke.txt` | Copy & varumärke |
| 08 | `docs/frontend-audit/tracks/agent-08-edge-cases.txt` | Edge cases |

Översikt av mappstruktur: `docs/frontend-audit/README.txt`.

### Sammanfattning (efter spår eller vid snabb pass)

| Fil | Innehåll |
|-----|----------|
| `docs/frontend-audit-forbattringsatgarder.txt` | Förbättringsåtgärder, prioriterade (P0–P2) |
| `docs/frontend-audit-buggar.txt` | Potentiella buggar, risker, falska positiva markerade |

Använd **ASCII** eller ren svenska i `.txt`; undvik tecken som kan korrumperas i terminaler.

## Granskningsdimensioner (åtta spår)

Genomför varje spår och notera fynd i **agentens** fil (`tracks/agent-NN-…txt`).
Uppdatera vid behov de två sammanfattande filerna i `docs/`:

1. **Navigation & IA** – header, footer, deep links, 404, Mitt konto-flöden
2. **Typografi & layout** – Tailwind tokens, kontrast, radavstånd, mobil breakpoints
3. **Rörelse & micro-UX** – transitions, hover, `prefers-reduced-motion`, Laddningstillstånd
4. **Tillgänglighet** – fokus, aria, tangentbord, formulär
5. **Prestanda** – `next/image`, bundle-storlek, tunga bilder
6. **Koppling mot API** – `NEXT_PUBLIC_API_URL`, auth, felmeddelanden
7. **Copy & varumärke** – svenska (åäö), ton enligt regel, inga AI-klischeer i rubriker
8. **Edge cases** – tom varukorg, utloggad, betalningsavbrott, långsam API

## Agent-fil

`agents/frontend-audit.md` – fullständig instruktion för en agent som kör alla
åtta spår sekventiellt och producerar tracks + sammanfattning. Använd vid
fleragents-pass eller som enda agent.

## Efter granskning

- Kort sammanfattning i chatten: P0 / P1 / P2
- Om något är osäkert: märk som "Kräver manuell test" i bugg-filen
