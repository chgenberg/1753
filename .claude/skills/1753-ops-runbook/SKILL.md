---
name: 1753-ops-runbook
description: >-
  Driftrutiner för 1753 SKINCARE i produktion: order som är betald men inte
  levererad, dubbel Fortnox-faktura, prenumeration som inte drogs, rabattkod
  inför utskick, recensions- och Sparre-flödena, körning mot produktion med
  railway run. Använd när Christopher beskriver ett kundärende eller ett
  driftproblem, eller ber dig slå upp eller rätta något i produktion.
---

# Ops-runbook – 1753 SKINCARE

Arbeta via **admin** eller `railway run` mot produktion. Skapa inga nya skript
med kundnamn – parametrisera med order-id eller e-post som argument. Rör inte
`handleOrderCompletion`, `paidUnitPrice`, Viva-webhooken eller hudanalysens
kontrakt för att lösa ett enskilt ärende.

Läs först, ändra sedan. Varje åtgärd som drar pengar, skapar eller krediterar
en faktura, skickar en leverans eller mejlar en kund ska bekräftas av
Christopher innan den körs.

## Order som är betald men inte levererad

1. Admin → Ordrar → sök ordernumret.
2. Kontrollera `payment_status`, `processed_at` och `viva_transaction_id`.
3. Viva-transaktionen måste ha status `F` innan Fortnox och Ongoing körs.
4. Använd admin-åtgärderna som redan finns: reconcile-pending och
   backfill-fortnox.
5. Självläkningen körs var 30:e minut. Är webhooken bara sen: vänta först.

## Dubbel Fortnox-faktura

1. Läs fakturanumren. Kreditera dubbletten i Fortnox och bokför krediten.
2. Godkänt skript: `scripts/reverse-fortnox-payments-v2.js` via `railway run`.
3. Skapa aldrig en tredje faktura "för att laga". Stegen i
   `handleOrderCompletion` är idempotenta via `processed_at`.

## Rabattkod inför utskick

1. Skapa koden i Admin → Rabattkoder (sparas med gemener).
2. Verifiera med `/api/discount/validate`.
3. Preview till Christopher.
4. Först därefter utskick. Se skillen `1753-utskick-redaktor`.

## Prenumeration som inte drogs

1. Admin → Prenumerationer.
2. Kundens kort hos Viva måste vara giltigt. Dragningarna körs var 6:e timme.
   En nekad dragning syns i admin och försöks igen.
3. Återanvänd parametriserade skript via `railway run`. Skapa inte en ny fil
   per kund.

## Recension, Sparre och win-back

- Recensionsdrip: `outreach_settings` id `review`.
- Sparre: `outreach_settings` id `default`. Pausad som standard. Koden nämns
  bara om den är aktiv i databasen.
- Win-back: `system_config.winback_enabled`. Av tills den slås på i admin.
  Ingen kod i mejlet.

Kontrollera aktuellt läge i admin – det ändras över tid.

## Nycklar och railway

- Produktionsnycklarna nås via `railway run`. Lokal `.env` saknar ofta
  `JWT_SECRET` och `DATABASE_URL`.
- Recensionslänkar måste signeras med produktionens `JWT_SECRET`.
- Skriv aldrig ut nycklar eller hela kundposter i svaret. Visa bara det som
  behövs för ärendet.

## Skript

`scripts/README.md` skiljer återanvändbara ops-skript från engångsskript.
Engångsskripten (`charge-*`, `fix-*`, `fulfil-*`, `lookup-*` med kundnamn)
körs inte om och kopieras inte som mall. De ska heller inte committas – allt
i repot blir nåbart utifrån via backendens statiska filservering.

## Push

`1753-bug-hunter-prepush`, `cd frontend && npx tsc --noEmit` och
`node -c server.js`. Se `.claude/rules/push-gate.md`.
