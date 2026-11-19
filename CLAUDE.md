# 1753 SKINCARE

Svensk hudvård med CBD/CBG. Det här repot är hela verksamheten på nätet: butiken
(www.1753skin.com), AI-hudanalysen, kundkonton, admin, kopplingar till betalning,
bokföring och lager, samt automatiska utskick. Riktiga kunder och riktiga pengar –
en push till `main` går rakt ut i produktion.

Christopher (ägare) arbetar på svenska. Svara på svenska.

## Ton och språk

- Kundtext skrivs på korrekt svenska med å, ä, ö. Tonen är ärlig, varm och
  rebellisk – aldrig klinisk eller korporativ.
- Aldrig emojis: inte i kod, copy, mejl eller commits.
- Sajten finns på fem språk: `sv` (standard), `en`, `es`, `de`, `fr`. En ny sträng
  ska in i alla fem.
- Commits: `typ(område): vad som ändras för kunden`, på svenska. Exempel:
  `fix(kassa): nivårabatten för Silver, Guld och Platina dras automatiskt`.

## Så hänger det ihop

| Del | Var | Vad |
|---|---|---|
| Butik | `frontend/` | Next.js 16 (App Router), React 19, TypeScript, Tailwind 4, shadcn/base-ui |
| Backend | `server.js` | Express. En fil på cirka 11 000 rader med alla ~180 API-rutter och alla bakgrundsjobb |
| Databas | `db.js` | Postgres. Schemat skapas och migreras vid varje uppstart |
| Tjänster | `services/` | `checkout-helpers.js`, `premium-analysis-prompt.js`, `agent-army.js` (admin-agenter) |
| Mejlagent | `outreach/` | Autonom agent som mejlar "som Christopher". Se `outreach/README.md` |
| Ops-skript | `scripts/` | Körs mot produktion med `railway run`. Se `scripts/README.md` |

### Butiken (`frontend/src/`)

- `app/[locale]/…` – publika sidor. Mappnamnen är svenska (`kassa`, `hudanalys`,
  `mitt-konto`). `middleware.ts` och `lib/i18n/navigation.ts` översätter
  URL:erna per språk (`/en/checkout` visar `kassa`).
- `app/admin/…` – admin, bara på svenska: ordrar, kunder, prenumerationer,
  rabattkoder, nyhetsbrev, outreach, recensioner, inkorg, social, agenter, produkter.
- `lib/i18n/strings/{sv,en,es,de,fr}.ts` – alla texter.
- `lib/products.ts` – produkterna som de visas. Pris, artikelnummer och moms som
  faktiskt faktureras ligger i `PRODUCTS_MAP` i `server.js`. De två måste stämma
  överens. `articleNumber` är nyckeln mot Fortnox och Ongoing.
- `components/fx/` – rörelse och ramar (`Reveal`, `Parallax`, `Marquee`,
  `MediaFrame`, `Pill`, `LenisProvider`).
- Butiken anropar backend via `/api/*` (rewrite i `next.config.ts`, `lib/api.ts`).
- Next.js 16 skiljer sig från äldre versioner. Läs `frontend/AGENTS.md` och
  relevant guide i `frontend/node_modules/next/dist/docs/` innan du skriver Next-kod.

### Backend

- Integrationer: Viva Wallet (betalning och återkommande dragningar), Fortnox
  (bokföring), Ongoing WMS (lager och leverans), Resend (mejl), OpenAI
  (hudanalys, chatt, mejlutkast), Publer (sociala medier).
- Bakgrundsjobb körs som `setInterval` i `server.js`: prenumerationsdragningar
  var 6:e timme, automation-kö och schemalagda nyhetsbrev varje minut,
  mejlagenten var 60:e sekund, recensionsdrip var 90:e sekund, social kö var 5:e
  minut, självläkning av betalda men obehandlade ordrar var 30:e minut.
  Kör därför aldrig två backend-instanser samtidigt.
- All token-verifiering går via `verifyToken()` med `JWT_SECRET`.

### Sådant som ligger kvar men inte är butiken

- Rot-filerna `*.html`, `app.js`, `styles.css`, `auth.js`, `dashboard.js`,
  `analysis.js`, `animations.js`, `chat-widget.js` och `integrations/` är den
  första vanilla-versionen från mars 2026. Bygg inte vidare där.
- `video/` (Remotion-reklamfilm), `bildproduktion/` (bildprompter och underlag),
  `newsletters/` (mejl-HTML), `acne/`, `data/`, `services/skin-classifier/`
  (ML-experiment), `feedback/`, `sim-findings/`, `docs/` (granskningsrapporter).
- `.cursor/` är arkiv från tiden i Cursor. Reglerna där är inaktuella på flera
  punkter. Det som gäller står här och i `.claude/`.

## Kommandon

```sh
npm run dev                            # backend på :3001
cd frontend && npm run dev             # butik på :3000, /api går till :3001
npm run check                          # frontend: typecheck + lint
npm run check:backend                  # node -c server.js && node -c db.js
cd frontend && npm run build           # produktionsbygge
railway run -- node scripts/<fil>.js   # ops mot produktion
```

Det finns ingen automatisk testsvit. Verifiering betyder typecheck, lint,
syntaxkontroll och att köra flödet för hand. Lokal `.env` saknar ofta
`JWT_SECRET` och `DATABASE_URL` – produktionsnycklarna nås bara via `railway run`.

## Drift

- `git push` mot `main` deployar automatiskt backend och butik på Railway.
  Backend svarar på `api.1753skin.com`, butiken på `www.1753skin.com`.
- Husky kör `tsc --noEmit` och `node -c` vid push. Det fångar syntax, inte logik.
- Backend serverar repo-roten som statiska filer (`express.static(".")`). Allt
  som committas blir därmed nåbart utifrån på `api.1753skin.com/<sökväg>`.
  Committa aldrig kunddata, exportfiler eller skript med kundnamn.

## Regler som alltid gäller

1. **Röd zon.** Köpkedjan (kassa → Viva → Fortnox → Ongoing) och hudanalysen har
   kontraktslås: `.claude/rules/kop-las.md` och `.claude/rules/hudanalys-las.md`.
   De laddas automatiskt när du öppnar berörda filer. Läs dem innan du ändrar
   något i de flödena. Design, copy, tillgänglighet och prestanda är fritt fram;
   kontrakt, belopp, prompter och steg kräver uttryckligt ok.
2. **Före push till `main`.** Kör skillen `1753-bug-hunter-prepush` och de
   mekaniska kontrollerna (`verify-before-push`). Se `.claude/rules/push-gate.md`.
3. **Ta aldrig bort befintlig funktionalitet** utan att Christopher bett om det.
4. **Kräver uttryckligt ok:** produktdata (priser, artikelnummer, moms),
   varumärkesfärgerna, navigationsstrukturen, hudanalysens prompt och modell,
   fraktbelopp och rabattregler.
5. **Produktionsdata.** Ändra inte `discount_codes`, `orders` eller
   `subscriptions` med egen SQL. Använd admin, eller be Christopher köra det.
   Skapa inga nya engångsskript med kundnamn i filnamnet – parametrisera.
6. **Utskick.** Aldrig skarpt direkt. Segment och antal → kontrollera att nämnda
   rabattkoder finns i `discount_codes` → preview till Christopher → vänta på
   "kör". Se skillen `1753-utskick-redaktor`.
7. **Hemligheter** läses bara på servern. Aldrig i frontend-kod, aldrig i
   `NEXT_PUBLIC_*`, aldrig i loggar. `.env` committas aldrig.

## Var resten står

| Vad | Var |
|---|---|
| Kritiska flöden, högriskfiler, i18n-krav | `.claude/rules/regressionsskydd.md` |
| Grind före produktionspush | `.claude/rules/push-gate.md` |
| Designsystem och varumärke | `.claude/rules/varumarke-design.md` |
| AI-modeller | `.claude/rules/ai-modeller.md` |
| Kundsimuleringens säkerhetsregler | `.claude/rules/sim-150.md` |
| Fastnad order, dubbel faktura, utebliven dragning | skillen `1753-ops-runbook` |
| Stor granskning i åtta spår | skillen `1753-feedback-8-agents` |
| Läsande granskare | agenterna `salj-sentry` och `verifier` |
