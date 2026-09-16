# Masterplan: agentautomation för 1753 SKINCARE

Datum: 2026-09-16  
Syfte: mer försäljning och lättare ops **utan** att förstöra köpflöde eller hudanalys.  
Ingen kod ändrades i den här omgången.

Planeringsagenter: automation-inventarie, säljlivscykel, struktur, svärmdesign, risk.

---

## Princip

Bygg inte ett nytt system. Koppla ihop det som redan finns: `automation_flows`, `outreach/`, admin och TACK15-mönstret.

- Allt nytt utskick går först till `ch.genberg@gmail.com`.
- En rabattkod får bara nämnas i mejl om den redan finns i `discount_codes`.
- Två skrivande Cursor-agenter får inte köra parallellt mot samma filer.
- Kassa (`kop-lock`) och hudanalys (`hudanalys-lock`) är röd zon.

---

## Två lager

### Lager A — Cursor (när Christopher ber)

| Agent | Jobb | Får | Aldrig |
|---|---|---|---|
| Sälj-sentry | Hitta det som tappar köp | Läsa, skriva `feedback/` | Koda, pusha |
| Flödes-kodare | Genomföra 1–3 valda fixar | frontend, copy, admin, i18n | `handleOrderCompletion`, quiz, prompts |
| Prepush-jägare | Stoppa regression före `main` | Diff, `tsc`, `node -c` | Pusha vid CRITICAL/HIGH |
| Utskick-redaktör | Utkast + preview | Mallar, preview-script | Broadcast, skapa rabattkoder |

Befintliga: `workstream-sentry`, `improver`, `verifier`, `1753-bug-hunter-prepush`, `1753-feedback-8-agents`. Feedback-8 är stor audit, inte dagssvärm.

### Lager B — Produktion (tick redan i `server.js`)

| Agent | Trigger | Får | Handoff |
|---|---|---|---|
| Sparre | 60 s, paus default | `outreach_*`, kod bara om aktiv | Klagomål / 12 svar → Christopher |
| Recension-drip | 90 s, vardag 09–18 | `review.js`, TACK15 efter inskick | Ny kohort = preview först |
| Publik-kö | 60 s mejl / 5 min social | Schemalagda utkast, automation, Publer | Utkast i admin |
| Intäkts-väktare | 6 h / 30 min / dygn | Recurring, reconcile, Fortnox-hälsa | Logg. Aldrig “fixa” fakturabelopp |

---

## Ordning

```
Sälj-sentry → Christopher väljer → Flödes-kodare → ev. Verifier → Prepush-jägare → människa pushar
```

Utskick parallellt med kod, men **human-gate är standard**:

1. Segment och antal mottagare  
2. Kod i `discount_codes`, eller ingen kod i mejlet  
3. Preview till `ch.genberg@gmail.com`  
4. Christopher svarar “kör”  
5. Skarpt. Markera kontakter så drip inte dubblar.

---

## Säljautomation (intäkt × låg risk)

1. **Analys → köp** — `analysis_complete` 72 h + 7 dagar. Finns ingen sådan serie idag.  
2. **Personligt uppföljningsmejl** — återanvänd `generate-personal-newsletters.js` som veckobatch.  
3. **Win-back live** — `checkWinbackEligibility` enqueue:ar redan, men `win_back`-flödet är inte seedat.  
4. **Pren-invite** — månadsvisa `send-subscription-invite.js` mot ≥3 köp utan prenumeration.  
5. **Varukorg steg 3 säkert** — `KOMTILLBAKA5` i mallen måste finnas i DB, annars bort ur copy. Samma för `INSIDER15`.  
6. **Sparre-ramp** — soft launch mot egen inkorg, sen 15/dag.  
7. **Recensionsdrip på igen** — låg kvot, vardag, efter preview (blasten 8 sep är redan ute).  
8. **Post-köp → prenumeration** — befintligt steg dag 45, bara kopia + deeplink.

### Dåliga idéer

- AI som hittar på rabattkoder  
- Lova TACK15 i recensions-*utskicket*  
- Fri frakt i mejl oavsett belopp (kassa: 600 kr)  
- AI som rör Fortnox / `paidUnitPrice`  
- Fler än 2–3 produkter i hudanalys-prompten  

---

## Fasning

### Vecka 1–2 (noll kontraktsrisk)

- Skill för Utskick-redaktör (preview + kod-guard)  
- Verifiera `INSIDER15` och `KOMTILLBAKA5` i DB  
- Ops-runbook: stuck order, dubbel Fortnox, rabatt+mejl  
- Katalogisera `scripts/` (ops vs one-off)  
- Sälj-sentry på CTA / recensionssida — Christopher väljer tre UI-fixar utanför låsen  

### Vecka 3–6 (additivt)

- Seeda `win_back` (ingen kod i mejlet) + daglig tick  
- `analysis_complete`-serie  
- Månatlig pren-invite  
- Admin-knapp “skicka preview”  
- Ev. flytta Fortnox-tokenrefresh till `services/` bakom samma signatur  

### Senare (bara om mätt)

- Dela `server.js` per domän med smoke på kassa + webhook  
- Aldrig microservices  
- Aldrig två Railway-replicas utan lock på Viva-dragningar  

---

## Do-not-touch

| Flöde | Låst | Får ändå |
|---|---|---|
| Köpkedjan | `orders/create`, webhook, `paidUnitPrice`, Fortnox 1–5, frakt, 15 % | UI, kopia, logg |
| Hudanalys | 7 steg, 14 fält, `AnalysisJSON`, `/api/analysis*`, prompt | Design, a11y, kopia |
| Rabattkoder | Lowercase i DB, validate, fixedAmount | Skapa rad först, sen nämn |
| Auth / historik | Bara `verifyToken()` + samma `JWT_SECRET` | Fixar utan nytt token-kontrakt |
| Nav / produkter | Pill-nav, `PRODUCTS`, färg-tokens | Inget utan explicit ok |

### Gates

- Push till `main`: `1753-bug-hunter-prepush` + `tsc` + `node -c server.js`  
- Kampanjmejl: kod i DB → preview → “kör”  
- Prod-SQL: inte agent  

### Grön zon

Copy, admin-köer med manuell approve, outreach-mallar utan rabattlöften, läsande cron, fx, docs.
