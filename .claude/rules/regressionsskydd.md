# Regressionsskydd

Gäller vid alla kodändringar och inför varje push.

## Före varje push

1. **TypeScript:** `cd frontend && npx tsc --noEmit` – noll fel.
2. **Lint:** `cd frontend && npm run lint` – noll errors. Varningar accepteras,
   men nya errors i ändrade filer ska åtgärdas.
3. **Backend-syntax:** `node -c server.js && node -c db.js`.
4. **Sammanfattning:** beskriv kort vilka av de kritiska flödena nedan som berörs
   av ändringarna och hur de verifierats.

Bug-hunten före produktionspush är ett eget krav, se `push-gate.md`.

## Kritiska flöden som aldrig får gå sönder

| Flöde | Steg |
|---|---|
| Hudanalys | intro → e-post → demografi → skanning → quiz (7 frågor) → analys → resultat → PDF → delning |
| Kassa | varukorg → kassaformulär → Viva Wallet → bekräftelsesida |
| Autentisering | registrering → inloggning → Mitt konto (8 vyer) → lösenordsåterställning |
| i18n | Alla 5 språk (sv/en/es/de/fr) i samtliga flöden: URL-routing, metadata, PDF, API-felmeddelanden |
| Nyhetsbrev | prenumeration med språk → bekräftelse → avprenumeration |
| Produkter | produktlista → produktsida → lägg i varukorg |

## Regler vid kodändringar

- **Ta aldrig bort befintlig funktionalitet** utan uttrycklig begäran.
- **Ändra aldrig detta utan att fråga först:**
  - produktdata i `frontend/src/lib/products.ts` och `PRODUCTS_MAP` i `server.js`
    (priser, artikelnummer, moms, bilder)
  - varumärkesfärgerna
  - navigationsstrukturen: pill-nav med Produkter, Om oss, [logotyp = Hem],
    Hudanalys, Kontakt, samt ikoner för språk, Mitt konto och varukorg
    (bekräftad av Christopher 2026-06-11)
  - API-nycklar och hemligheter
  - grundfilosofin i `ANALYSIS_SYSTEM_PROMPT`
- **Kontrollera importer.** När en export tas bort eller byter namn: sök upp alla
  filer som importerar den.
- **i18n-konsistens.** En ny eller ändrad nyckel ska finnas i alla fem filerna
  `frontend/src/lib/i18n/strings/{sv,en,es,de,fr}.ts`.
- **Routing.** Vid ändringar i `navigation.ts` eller `middleware.ts`: verifiera
  att URL-omskrivningarna fortfarande matchar och att språkbytet
  (`switchLocalePath`) hamnar på rätt sida.
- **Databas.** Schemaändringar i `db.js` ska vara idempotenta
  (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE … ADD COLUMN IF NOT EXISTS`).
  Produktionen kör migreringarna vid varje uppstart.
- **JWT.** Verifiera tokens via `verifyToken()`. En egen `jwt.verify` med annan
  hemlighet var orsaken till att hudanalys-historiken försvann.
- **Tysta fel.** Lägg inte in `try/catch` som sväljer fel anroparen behöver
  känna till. Kontrollera `res.ok` innan `.json()`.

## Filer med hög risk

- `server.js` – backend, auth, AI-prompter, betalning, mejl
- `db.js` – schema och frågor
- `frontend/src/middleware.ts` – URL-routing för alla språk
- `frontend/src/lib/i18n/navigation.ts` – lokaliserade sökvägar
- `frontend/src/app/[locale]/hudanalys/page.tsx` – hudanalysflödet
- `frontend/src/app/[locale]/kassa/page.tsx` – kassan
- `frontend/src/providers/auth-provider.tsx` – inloggningstillstånd
- `frontend/src/providers/cart-provider.tsx` – varukorgen

## Kontraktslås

Två kärnflöden har egna, detaljerade lås. Läs och följ dem så fort du arbetar i
respektive område:

- **Hudanalys (gratis och premium):** `.claude/rules/hudanalys-las.md`
- **Köpkedjan (kassa → Viva → Fortnox → Ongoing):** `.claude/rules/kop-las.md`

Låsen listar exakt vad som får förbättras fritt och vad som kräver uttryckligt
ok. Är du osäker – fråga först.
