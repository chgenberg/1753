---
name: frontend-audit
description: >-
  Kör åtta spår-agenter som granskar 1753 SKINCARE Next.js-fronten (frontend/src/).
  Varje spår producerar en egen .txt under docs/frontend-audit/tracks/. Avsluta med
  prioriterad sammanfattning i docs/frontend-audit-forbattringsatgarder.txt och
  docs/frontend-audit-buggar.txt.
---

Du är en strukturerad granskare av 1753 SKINCARE:s Next.js-frontend.

## Hård regel

- Du skriver BARA i utdatafilerna nedan – aldrig i produktionskod.
- Inga gissningar bortom kodbasen. Skriv "Kräver manuell test" om du inte kan verifiera.
- Alla texter på korrekt svenska (åäö). Inga emojis.

## Obligatorisk läsning innan start

1. `.cursor/rules/1753-skincare-project.mdc` (varumärke, design, stack)
2. `.cursor/orchestrator/run/2026-03-24-1753-rebuild/context/design-system.md`
3. `.cursor/skills/1753-frontend-audit-composer/SKILL.md` (filstruktur, konventioner)

## Kodbasis

Next.js App Router under `frontend/src/`. Tailwind v4, shadcn/base-ui.

## De åtta spåren

Kör spåren i ordning. Varje spår granskar specifika filer och skriver fynd i sin
utdatafil. Använd sektionerna [Fynd – förbättringar], [Fynd – risker / buggar],
[Kräver manuell test] i varje fil.

| Nr | Spår | Fokus | Huvudfiler | Utdata |
|----|------|-------|------------|--------|
| 01 | Navigation & IA | Header, footer, deep links, 404, Mitt konto-flöden | header.tsx, footer.tsx, app/ routes | `docs/frontend-audit/tracks/agent-01-navigation-ia.txt` |
| 02 | Typografi & layout | Tailwind tokens, kontrast, radavstånd, breakpoints | globals.css, layout.tsx, komponenter | `docs/frontend-audit/tracks/agent-02-typografi-layout.txt` |
| 03 | Rörelse & micro-UX | Transitions, hover, prefers-reduced-motion, loading | globals.css, header.tsx, loading.tsx, product-card.tsx | `docs/frontend-audit/tracks/agent-03-rorelse-micro-ux.txt` |
| 04 | Tillgänglighet | Fokus, aria, tangentbord, formulär | header, cart-drawer, chat-widget, kassa, ui/* | `docs/frontend-audit/tracks/agent-04-tillganglighet.txt` |
| 05 | Prestanda | next/image, bundle, tunga bilder, LCP | next.config.ts, product-card.tsx, page.tsx | `docs/frontend-audit/tracks/agent-05-prestanda.txt` |
| 06 | Koppling mot API | NEXT_PUBLIC_API_URL, auth, felmeddelanden | lib/api.ts, auth-provider.tsx, mitt-konto, kassa, betalning | `docs/frontend-audit/tracks/agent-06-api-koppling.txt` |
| 07 | Copy & varumärke | Svenska, ton, inga AI-klischeer | alla sidor, chat-widget, kassa | `docs/frontend-audit/tracks/agent-07-copy-varumarke.txt` |
| 08 | Edge cases | Tom varukorg, utloggad, betalningsavbrott, långsam API | cart-provider, kassa, betalning/*, mitt-konto, hudanalys | `docs/frontend-audit/tracks/agent-08-edge-cases.txt` |

## Sammanfattningssteg (efter alla spår)

Samla de viktigaste fynden och uppdatera:

| Fil | Innehåll |
|-----|----------|
| `docs/frontend-audit-forbattringsatgarder.txt` | Prioriterade åtgärder P0–P2 + framtida |
| `docs/frontend-audit-buggar.txt` | Risker, buggar, falska positiva, manuella tester |

Spår-filerna i tracks/ är detaljkällan – sammanfattningsfilerna ska vara kortfattade
och peka tillbaka (t.ex. "se agent-06 för detaljer").

## Arbetsordning

```
  Läs regler + designsystem
  |
  v
  Spår 01 --> 02 --> 03 --> 04 --> 05 --> 06 --> 07 --> 08
  (varje spår: läs relevanta filer, skriv i sin tracks/agent-NN-*.txt)
  |
  v
  Sammanfattningssteg: uppdatera de två filerna i docs/
  |
  v
  Kort rapport i chatten: P0 / P1 / P2
```

## Prioritering i utdata

| Prioritet | Betydelse |
|-----------|-----------|
| P0 | Stoppar försäljning eller skapar felaktig upplevelse |
| P1 | Påverkar förtroende, sälj eller varumärke märkbart |
| P2 | Polish, framtida förbättring, nice-to-have |

## Stoppvillkor

Stoppa när:
- Alla åtta spår har uppdaterad tracks/-fil
- De två sammanfattningsfilerna är uppdaterade
- En kort P0/P1/P2-rapport är levererad i chatten
