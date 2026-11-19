---
paths:
  - "frontend/src/app/*/hudanalys/**"
  - "frontend/src/app/*/hudanalys-premium/**"
  - "frontend/src/components/skin-scanner/**"
  - "frontend/src/components/analysis/**"
  - "frontend/src/components/analysis-premium/**"
  - "server.js"
  - "services/premium-analysis-prompt.js"
---

# Hudanalys – kontraktslås

Hudanalysen är ett av två kärnflöden i 1753 SKINCARE och fungerar i dag hela
vägen. **Förbättra gärna design, copy, prestanda och småinteraktioner – men
ändra inget i listorna nedan utan att Christopher uttryckligen godkänner det.**

## Gratis hudanalys

Stegmaskinen i `frontend/src/app/[locale]/hudanalys/page.tsx`:

```ts
type Step = "intro" | "email" | "demographics" | "scan" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | "analyzing" | "result";
const TOTAL_STEPS = 7;
```

- Antalet quizsteg är **7**. Lägg inte till och ta inte bort steg.
- Återkommande användare hoppar över `email`-steget (`isReturningUser`-grenen i
  `next()` och `back()`).
- `QuizAnswers` har **14 fält**: `age, gender, skinType, concerns, routine,
  sleep, stress, diet, water, exercise, goals, sensitivities, sunProtection,
  hormonal`. Nya fält kräver att servern och alla språkfiler uppdateras.
- `AnalysisJSON` måste innehålla toppfälten `score, summary, products[],
  lifestyle[], avoid[], nextAnalysis`. Gränssnittet läser dem direkt.
- Resultatvyn ska kunna **spara historik, exportera PDF och delas**. Behåll
  flödet med `snapshotSaved` och `token`.

## Premium

`frontend/src/app/[locale]/hudanalys-premium/page.tsx` har tre faser:
**kassa → webhook → resultat via token-länk**. Behåll de tre Viva-stegen (skapa
order → vänta på webhook → öppna resultat). Frontend pollar
`GET /api/analysis-premium/status/:token`.

## Låsta API-rutter

Dessa får inte byta namn, ändra svarsformat eller tas bort:

| Metod | Sökväg | Inloggning |
|---|---|---|
| POST | `/api/analysis` | Frivillig (Bearer) |
| POST | `/api/analysis/chat` | Ingen |
| POST | `/api/analysis/classify` | Ingen |
| GET | `/api/analysis/history` | Krävs |
| DELETE | `/api/analysis/:id` | Krävs |
| POST | `/api/analysis/fusion` | Ingen |
| GET | `/api/analysis/diff` | Krävs |
| POST | `/api/analysis-premium/checkout` | Ingen |
| POST | `/api/analysis-premium/run` | Ingen (token) |
| GET | `/api/analysis-premium/status/:token` | Ingen |
| GET | `/api/analysis-premium/prefill` | Ingen |

## Beteenden som inte får tas bort

- **Prompten ligger på servern.** `ANALYSIS_SYSTEM_PROMPT` i `server.js` och
  premium-prompten i `services/premium-analysis-prompt.js`. Skicka aldrig
  prompten från klienten.
- **Holistisk grundfilosofi.** Prompten är skeptisk till konventionell hudvård
  och rekommenderar **högst 2–3 produkter**. Mjuka inte upp det till "allt
  passar alla".
- **Konto skapas automatiskt vid första analysen.** Anges e-post och kontot inte
  finns skapas det med tillfälligt lösenord och ett mejl för att välja lösenord.
  Behåll flödet med `analysisPassword` och `sendPasswordSetupEmail`.
- **Spärr på 10 anrop per minut** och IP på `/api/analysis`. Sänk den inte utan
  att resonera kring missbruk.
- **Fem språk.** `sv, en, es, de, fr` ska fungera i frågor, prompt och svar.
- **Inga råbilder lagras.** Bilder lever i klientens minne och i analysens
  ögonblicksbild kopplad till användaren. Logga aldrig bilddata.

## Tillåtet utan att fråga

- Visuell polering, animationer, mikrointeraktioner, copy.
- Prestanda, lazy loading, mindre bundle.
- Tillgänglighet, tangentbordsnavigation, fokusmarkeringar.
- Bugfixar som inte ändrar publika kontrakt.

## Kräver uttryckligt ok

- Antal quizsteg eller fälten i `QuizAnswers`.
- API-sökvägar, format på anrop och svar, statuskoder.
- Modell (`OPENAI_MODEL`), promptstrategi, `OPENAI_REASONING_EFFORT`,
  temperatur och max tokens.
- Borttagning av PDF, historik, delning, premiumflödet eller kamerastödet.
- Att låta klienten styra prompt eller modellval.

## Verifiera före push

- `cd frontend && npx tsc --noEmit` – noll fel.
- `node -c server.js`.
- Manuellt: kör hela flödet `intro → email → demographics → scan → 1..7 →
  analyzing → result` på minst två språk.
