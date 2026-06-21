# Autonom mejlagent ("som Christopher")

En autonom Resend-baserad outreach-agent som skriver och svarar som Christopher
Genberg, segmenterar mottagare och driver `sparre`-kampanjen. Byggd ovanpå
befintlig Resend-, e-bok- och OpenAI-infrastruktur. Köper aldrig kringgår
köpflödet eller hudanalysen – allt är additivt.

## Arkitektur

| Lager | Fil |
|---|---|
| Segmentering (verifierad kunddata) | `outreach/segment.js` |
| Kampanj-/produktfakta + guard | `outreach/campaign.js` |
| LLM-hjärna (persona, e-bok, briefs) | `outreach/agent.js` |
| Sänd/persistens (Resend, plain text) | `outreach/send.js` |
| Orchestrator (state machine) | `outreach/run.js` |
| API + intern tick | `server.js` (`/api/outreach/*`) |
| Admin-UI | `frontend/src/app/admin/outreach/` |
| Tabeller | `outreach_contacts`, `outreach_messages`, `outreach_settings` (db.js) |

Statusflöde per kontakt: `queued → awaiting_reply → replied → (handed_off | not_interested | unsubscribed | done | error)`.

## 1. DNS + Resend (görs i Resend-dashboard + hos registrar)

1. Lägg till subdomänen **`mejl.1753skin.com`** som ny domän i Resend.
   Lägg in de SPF-, DKIM- och return-path-poster Resend visar hos registraren.
   **Rör inte rot-`1753skin.com`** – det skyddar `info@`/`orders@`.
2. Aktivera **Resend Inbound** för subdomänen → lägg in MX-posten.
3. Sätt inbound-webhook till `POST https://api.1753skin.com/api/outreach/inbound`
   och kopiera signing-secret (`whsec_…`) till `RESEND_WEBHOOK_SECRET`.

## 2. Env-variabler (Railway)

```
OUTREACH_FROM_EMAIL=christopher@mejl.1753skin.com
OUTREACH_REPLY_EMAIL=christopher@mejl.1753skin.com
OUTREACH_SENDER_NAME=Christopher Genberg
RESEND_WEBHOOK_SECRET=whsec_...
OUTREACH_CRON_SECRET=<lång slumpsträng>
# Valfri produktbild (måste ligga på 1753-domänen):
OUTREACH_CAMPAIGN_IMAGE_URL=https://www.1753skin.com/New_Products/DUO%2BTA-DA.jpg
```

Återanvänder befintliga `RESEND_API_KEY` och `OPENAI_API_KEY`. Sätt även
`NODE_ENV=production` så cron/webhook blir fail-closed (kräver secrets).

## 3. Kampanjkod `sparre`

Agenten nämner **bara** koden om den finns och är `active` i `discount_codes`
(guard i `outreach/campaign.js → isCampaignCodeActive`). Vi skapar den aldrig
automatiskt – ekonomin sätts medvetet i admin → Rabattkoder (regressionsskydd för
köpflödet). Är koden inaktiv beskriver agenten erbjudandet i ord utan kod.

## 4. Schemaläggning

En intern `setInterval` kör tick var 60:e sekund (levererar schemalagda svar +
skickar dagens första-mejl). Lägg gärna **cron-job.org** som redundans:

```
POST https://api.1753skin.com/api/outreach/tick
Header: x-cron-secret: <OUTREACH_CRON_SECRET>
var minut
```

## 5. Soft launch (rekommenderat innan skarpt)

1. Deploy + sätt env. Agenten startar **pausad** (`paused=true`).
2. Admin → **Mejlagent**: bekräfta "Resend konfigurerad" + kampanjkod-badge.
3. **Köa dig själv**: klistra in dina egna adresser i "Lägg till mottagare".
4. Sätt agenten **live** kort → verifiera att första-mejlet kommer, ton/fakta ok,
   och att ett svar tillbaka triggar autosvar (4–10 min fördröjt). Pausa igen.
5. Köa riktiga mottagare och sätt **live** för 15/dag i 2 veckor.

## 6. Säkerhetsräls (inbyggda)

- Master-paus (default på), dagskvot (default 15), autonom-flagga.
- Autosvar/frånvaro ignoreras. Avprenumerering ("sluta"/"stop") → status
  `unsubscribed` + nyhetsbrevs-avregistrering, inga fler mejl.
- Eskalering till människa vid klagomål/känsligt/osäkerhet (handoff-mejl).
- Loop-skydd: efter 12 egna svar lämnas tråden över till människa.
- Idempotent leverans: atomisk `scheduled → sending`. Prompt-injection: all
  mottagartext behandlas som DATA. `List-Unsubscribe` på varje utgående.
