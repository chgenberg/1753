---
name: 1753-utskick-redaktor
description: >-
  Skriver och granskar utskick för 1753 SKINCARE (nyhetsbrev, recensionsmejl,
  Sparre, win-back, automationsflöden) med krav på preview och kontroll av
  rabattkoder. Använd när Christopher ber om mejl, kampanj, utskick, nyhetsbrev,
  recensionsutskick, Sparre, win-back eller rabattkod i copy.
---

# 1753 Utskick-redaktör

Skriv utkast. Skicka aldrig skarpt till kunder i samma andetag.

## Obligatorisk ordning

1. Segment och antal mottagare (via admin eller en läsande fråga).
2. Nämner mejlet en kod: slå upp den i `discount_codes` (`LOWER(code)`,
   `active`). Finns den inte – skriv om texten. Skapa inte koden med SQL
   (se `.claude/rules/kop-las.md`); den skapas i Admin → Rabattkoder.
3. Preview till `ch.genberg@gmail.com` via `railway run`.
4. Vänta på ett uttryckligt **kör**.
5. Skarpt utskick. Markera kontakterna i outreach/automation så att
   drip-flödena inte skickar dubbelt.

## Kod-kontroll

- Lova aldrig en kod som inte finns i databasen.
- Recension: nämn 15 % efter inskickad recension. Skapa inte `TACK15` i
  utskicket – det gör `issueReviewReward` när recensionen kommer in.
- Prenumerationens 15 % får nämnas (finns i kassan), men inte som en kod.
- Fri frakt gäller bara över 600 kr. Skriv aldrig "oavsett ordervärde".
- Alla ordrar debiteras i kronor, även utanför Sverige. Eurobelopp i mejl till
  andra länder är ungefärliga och ska skrivas så ("ca 54 euro"), aldrig som
  fasta priser.
- Koder sparas med gemener i databasen. Versaler i mejlet går bra så länge
  koden matchar med `LOWER`.
- Lojalitetsnivåerna (Silver 5 %, Guld 8 %, Platina 12 %) dras automatiskt i
  kassan. De gäller inte prenumerationer och kombineras inte med rabattkoder –
  kunden får den större av nivårabatt och kod. Lova aldrig båda.

## Får och får inte

Får: mallar i `seedAutomationFlows`, texter i `outreach/`, HTML i
`newsletters/`, `scripts/*preview*`, utkast i admin.

Får inte: `POST /api/orders/create`, `handleOrderCompletion`,
`paidUnitPrice`, Viva-webhooken, quiz eller prompt i hudanalysen, utskick utan
preview, nya engångsskript med kundnamn.

## Avsändare och ton

`1753 SKINCARE <info@1753skin.com>`. Ärlig, varm, rebellisk. Svenska. Inga
emojis. Mejlagenten i `outreach/` skickar i stället personligt från
subdomänen `mejl.1753skin.com` – rör aldrig rotdomänens inställningar.

## Befintliga skript för preview

- Recension: `railway run -- node scripts/send-review-ask-preview.js`
- Prenumerationsinbjudan, torrkörning: `railway run -- node scripts/send-subscription-invite.js --dry-run`
- Prenumerationsinbjudan, preview: `railway run -- node scripts/send-subscription-invite.js --preview`
- Personliga analysmejl: `scripts/generate-personal-newsletters.js` (torrkörning som standard, `--send` för skarpt)
- Admin: Nyhetsbrev → Skicka preview på ett flöde

## Läget i de automatiska flödena

Kontrollera alltid aktuellt läge i admin innan du utgår från det här:

- Recensionsdrip: `outreach_settings` id `review`.
- Sparre: `outreach_settings` id `default`. Pausad som standard. Koden nämns
  bara om den är aktiv i databasen.
- Win-back: `system_config.winback_enabled`. Ingen kod i mejlet.
