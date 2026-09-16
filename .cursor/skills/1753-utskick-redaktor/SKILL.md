---
name: 1753-utskick-redaktor
description: >-
  Skriver och granskar 1753-utskick (nyhetsbrev, recension, Sparre, automation)
  med preview-plikt och rabattkod-guard. Använd när användaren ber om mejl,
  kampanj, blast, nyhetsbrev, recensionsutskick, Sparre, win-back eller
  rabattkod i copy.
---

# 1753 Utskick-redaktör

Skriv utkast. Skicka aldrig skarpt till kunder i samma andetag.

## Obligatorisk ordning

1. Segment och antal mottagare (SQL eller admin).
2. Om mejlet nämner en kod: slå upp den i `discount_codes` (`LOWER(code)`, `active`).
   Finns den inte — skriv om copy. Skapa inte koden via SQL (kop-lock).
3. Preview till `ch.genberg@gmail.com` via `railway run`.
4. Vänta på uttryckligt **kör**.
5. Skarpt. Markera outreach/automation så drip inte dubblar.

## Kod-guard

- Lova aldrig en kod som inte finns i DB.
- Recension: nämn 15 % efter inskick. Skapa inte `TACK15` i utskicket — det gör `issueReviewReward`.
- Prenumeration 15 % får nämnas (finns i kassan). Inte som en kod.
- Fri frakt bara över 600 kr / 60 EUR. Inte "oavsett ordervärde".
- Lowercase i DB. Versaler i mejl är ok om koden matchar `LOWER`.

## Får / får inte

Får: mallar i `seedAutomationFlows`, `outreach/`-copy, `scripts/*preview*`, admin-utkast.

Får inte: `POST /api/orders/create`, `handleOrderCompletion`, `paidUnitPrice`, Viva-webhook, quiz/prompt, blast utan preview, nya engångsskript med kundnamn.

## Avsändare

`1753 SKINCARE <info@1753skin.com>`. Ton: ärlig, varm, rebellisk. Svenska. Inga emojis.

## Befintliga preview-script

- Recension: `railway run -- node scripts/send-review-ask-preview.js`
- Pren-invite dry-run: `railway run -- node scripts/send-subscription-invite.js --dry-run`
- Pren-invite preview: `railway run -- node scripts/send-subscription-invite.js --preview`
- Admin: Nyhetsbrev → Skicka preview på ett flöde
