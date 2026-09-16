# Ops-runbook — 1753 SKINCARE

Kör via **admin-UI** eller `railway run` mot produktion. Skapa inte nya kundnamns-skript.
Rör inte `handleOrderCompletion`, `paidUnitPrice`, Viva-webhook eller hudanalys-kontraktet.

## Stuck order (betald, ingen leverans)

1. Admin → Ordrar → sök ordernummer.
2. Kolla `payment_status`, `processed_at`, `viva_transaction_id`.
3. Viva måste vara StatusId `F` innan Fortnox/Ongoing.
4. Admin-åtgärder som redan finns: reconcile-pending, backfill-fortnox.
5. Intern reconcile-tick kör var 30:e minut — vänta först om webhooken bara är sen.

## Dubbel Fortnox-faktura

1. Läs fakturanumren. Kreditera dubbletten i Fortnox, boka kredit.
2. Godkänt skript: `scripts/reverse-fortnox-payments-v2.js` via `railway run`.
3. Skapa inte en tredje faktura "för att laga". Steg 1–5 i `handleOrderCompletion` är idempotenta via `processed_at`.

## Rabattkod + mejl

1. Skapa koden i Admin → Rabattkoder (hamnar lowercase i DB).
2. Verifiera med `/api/discount/validate`.
3. Preview till `ch.genberg@gmail.com`.
4. Först därefter utskick. Se skillen `1753-utskick-redaktor`.

## Prenumeration som inte drogs

1. Admin → Prenumerationer.
2. Viva-kort måste vara giltigt. Recurring-tick var 6:e timme.
3. Återanvänd parametriska charge-script via `railway run`, inte nya filer per kund.

## Recension / Sparre / win-back

- Recensionsdrip: `outreach_settings` id `review`. Pausad efter blast 8 sep 2026.
- Sparre: `outreach_settings` id `default`. Paus default. Kod bara om aktiv i DB (SPARRE löpte ut 27 aug 2026).
- Win-back: `system_config.winback_enabled`. Av tills du slår på i admin. Ingen kod i mejlet.

## JWT / railway

Prod-nycklar via `railway run`. Lokal `.env` saknar ofta `JWT_SECRET` och `DATABASE_URL`.
Recensionslänkar måste signeras med prod-`JWT_SECRET`.

## Push

`1753-bug-hunter-prepush` + `cd frontend && npx tsc --noEmit` + `node -c server.js`.
