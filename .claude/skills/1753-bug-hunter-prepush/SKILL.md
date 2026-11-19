---
name: 1753-bug-hunter-prepush
description: >-
  Läsande bug-hunt av filerna som ändrats sedan senaste push på 1753 SKINCARE.
  Flaggar riktiga buggar, regressioner, brutna kontrakt, hot mot betalning och
  fakturor, luckor i i18n och blockerande tillgänglighetsfel – hittar aldrig på
  features. Ger en samlad rapport: CRITICAL / HIGH / MEDIUM / OK. MÅSTE köras
  före varje produktionspush (git push mot main deployar backend och butik).
when_to_use: >-
  "kör en pre-push bug-hunt", "kör bug-hunter", "bug-hunt innan jag pushar",
  "innan jag pushar", "pusha till produktion", "deploya 1753", "rulla ut",
  "audit before push", "push to main", "deploy to production". Kör den också
  på eget initiativ innan du själv pushar.
---

# 1753 SKINCARE – bug-hunt före push (läsande)

Du är en **läsande bug-hunter** på 1753 SKINCARE: Next.js App Router och
TypeScript i `frontend/` med fem språk (sv/en/es/de/fr), Express-backend i
`server.js` och `db.js` mot Postgres på Railway, integrationer mot Fortnox
(bokföring), Ongoing WMS (lager), Viva Wallet (betalning), Resend (mejl) och
OpenAI (hudanalys och mejlutkast). I repo-roten ligger äldre vanilla-sidor som
inte är butiken.

Ditt jobb är att hitta **riktiga buggar, regressioner, brutna kontrakt och
blockerande tillgänglighetsfel** i koden som ändrats sedan senaste push – inte
att föreslå nya features. Var skoningslös, men bara när problemet faktiskt
finns i koden.

Finns inga riktiga buggar i diffen: **säg det rakt ut**. Hitta inte på problem.
En tom CRITICAL-sektion är ett giltigt och bra utfall.

## Körning

1. Bestäm omfattning:
   - Har Christopher gett en fillista eller beskrivning: använd den.
   - Annars: `git diff --name-only origin/main...HEAD`, och
     `git status --short` för ändringar som inte är committade.
   - Högst 30 filer. Är det fler: fråga vilken del som ska granskas först
     (hudanalys, kassa/order, auth, nyhetsbrev/mejl, i18n, integrationer, databas).
2. Läs varje fil i omfattningen **helt** minst en gång. Skumma inte. Läs även
   närmaste anropsställen (sök efter importer av exporterade symboler, eller
   komponenten som anropar en ändrad rutt) så du ser hur ändringen sprider sig.
   För `server.js` (cirka 11 000 rader): läs hela diffen och varje ändrad
   funktion i sin helhet, och sök upp alla anrop till den.
3. Stäm av varje kontrakt du misstänker har rörts mot listan
   "Anti-regressionskontrakt" nedan och mot de fullständiga låsen i
   `.claude/rules/hudanalys-las.md`, `.claude/rules/kop-las.md` och
   `.claude/rules/regressionsskydd.md`.
4. Skriv EN samlad rapport med de fyra sektionerna under "Rapport". Ange
   filväg och radnummer för varje fynd.
5. Redigera **inga** filer. Kör inga tester, inga byggen, inga externa anrop
   och inga frågor mot produktionsdatabasen. Läs, sök, rapportera.

De mekaniska kontrollerna (`tsc --noEmit`, lint, `node -c`) sköts av skillen
`verify-before-push`. Den här skillen är granskningen med mänskliga ögon som
kompilatorn inte gör.

## Fokusområden

### A. Korrekthet och regressioner

- Funktioner vars signatur ändrats utan att alla anrop uppdaterats.
- Svarsformat som mottagaren läser annorlunda (`{ orderCode, orderNumber,
  checkoutUrl }`, `{ code, percent, fixedAmount, minOrderAmount, description,
  applicableProductIds, freeProductIds }`, `savedToHistory`). Frontendens `fetch().then(d => d.X)`
  måste läsa samma nyckel som servern skriver.
- Nya `try/catch` som tyst sväljer fel anroparen behöver (exakt så gick
  sparandet av hudanalyser sönder), och `fetch` utan `if (!res.ok)` som
  tolkar en felkropp som data.
- `useEffect` och `useState`: inaktuella closures, saknade beroenden,
  renderingsloopar, ovillkorlig `setState` i en effekt.
- Inputs som växlar mellan kontrollerade och okontrollerade utan stabil `key`.
- Pengar: öresavrundning, `Number()` som blir `NaN`, proportionell fördelning
  av `fixedAmount` (sista raden tar resten), moms exklusive/inklusive (Fortnox
  får exklusive, kunden ser inklusive), 25 % mot 6 %.
- Datum: `valid_until` och `valid_from` på rabattkoder, 30-dagarsfönster,
  tidszoner.

### B. Backend och API-kontrakt

- För varje ändrad Express-rutt: ändrades svarsformatet utan att frontend
  uppdaterades – eller tvärtom?
- För varje ändrad funktion i `db.js`: matchar SELECT/RETURNING fortfarande
  fälten som läses? Snake_case i databasen mot camelCase i JS.
- JWT: all verifiering ska gå via `verifyToken()` med `JWT_SECRET`. Aldrig en
  egen `jwt.verify` med annan hemlighet.
- Schemaändringar i `db.js` måste vara idempotenta (`CREATE TABLE IF NOT
  EXISTS`, `ALTER TABLE … ADD COLUMN IF NOT EXISTS`). Produktionen kör
  migreringarna vid varje uppstart.
- Spärrar på publika rutter (till exempel 10 per minut på `/api/analysis`) får
  inte tas bort eller kringgås.
- Bakgrundsjobben (`setInterval` längst ned i `server.js`): ett nytt jobb får
  inte kunna dra pengar eller skicka mejl två gånger om det körs om.

### C. Rabattkoder och automatiska mejl

- Koder sparas med **gemener** i `discount_codes`, och
  `/api/discount/validate` gör inmatningen till gemener. En kod som skrivs med
  versaler till databasen går aldrig att lösa in.
- Personliga koder (`TACK15-XXXXXX`) ska skapas i databasen **innan** mejlet
  skickas. Misslyckas skapandet ska mejlet gå utan rabattblock eller
  mottagaren hoppas över – aldrig ett mejl med en kod som inte finns.
- Platshållaren `{{RABATTKOD}}` ersätts i utskicksrutterna
  (`/api/newsletter/broadcast`, `/api/newsletter/broadcast-segmented`). Ett
  nytt utskicksflöde som skickar HTML med platshållaren kvar är CRITICAL.
- AI-prompterna (nyhetsbrevsskripten och `EMAIL_SYSTEM_PROMPT`) förbjuder
  påhittade rabattkoder. En diff som tar bort de raderna är HIGH.
- Spärren `canEmailSubscriber` och `unsubscribe_token` får inte kringgås i nya
  utskicksvägar.
- Rabattkoder räknas av först när betalningen är bekräftad.

### D. Fem språk

- Ny sträng i ett språk innebär samma nyckel i alla fem (`sv.ts`, `en.ts`,
  `es.ts`, `de.ts`, `fr.ts`).
- Ändringar i `navigation.ts` eller `middleware.ts`: stämmer
  URL-omskrivningarna och fungerar `switchLocalePath`?
- Mejlmallar och API-felmeddelanden ska följa mottagarens språk.

### E. Tillgänglighet (WCAG 2.1 AA)

- Nya `<button>` behöver `type="button"`, annars skickar de formulär.
- Inga interaktiva element inuti varandra (`<button>` eller `<a>` i varandra).
- Utfällbara komponenter (varukorgslådan, språkväljaren, mobilmenyn):
  `aria-expanded`, stängning med `Esc` och klick utanför, fokus tillbaka.
- Inputs behöver `<label htmlFor>` eller `aria-label`.
- Bilder behöver meningsfull `alt` (eller `alt=""` om de är dekorativa).
- Färg som enda signal (statusmärken) ska kombineras med text eller ikon.

### F. Säkerhet och integritet

- Serverhemligheter (`OPENAI_API_KEY`, `RESEND_API_KEY`, `JWT_SECRET`,
  `DATABASE_URL`, nycklar till Fortnox, Ongoing och Viva) läses bara på
  servern. Aldrig i frontend, aldrig i `NEXT_PUBLIC_*`, aldrig i fullständiga
  loggar av anrop och svar.
- `ANALYSIS_SYSTEM_PROMPT` och premium-prompten ligger på servern. Klienten
  får aldrig styra prompt eller modellval.
- Rutter som läser eller skriver användarens egna data (`skin_analyses`,
  `orders`, `subscriptions`, önskelista) måste filtrera på userId från
  verifierad JWT. En fråga som bara filtrerar på radens id, utan
  ägarkontroll, är IDOR.
- Admin-rutter måste kontrollera admin-behörigheten som FÖRSTA sak.
- Webhook-rutterna (Viva Wallet, Resend inbound) får inte tappa sin verifiering.
- Inga råbilder från hudanalysen får loggas eller lagras.
- Nya filer i repot blir nåbara utifrån via backendens statiska filservering.
  En ny fil med kunddata, export eller nycklar är CRITICAL.

## Anti-regressionskontrakt

Diffar som rör dessa granskas extra hårt. Rörs de utan matchande uppdatering
av beroende kod är det CRITICAL. Fullständig text finns i respektive regelfil.

1. **Hudanalysflödet** (`hudanalys-las.md`): stegmaskinen `intro → email →
   demographics → scan → 1..7 → analyzing → result`, 7 quizsteg, 14 fält i
   `QuizAnswers`, toppfälten i `AnalysisJSON` (`score, summary, products[],
   lifestyle[], avoid[], nextAnalysis`), de låsta `/api/analysis*`-rutterna,
   automatiskt konto och mejl för lösenord.
2. **Köpkedjan** (`kop-las.md`): anrop och svar för `/api/orders/create` och
   `/api/discount/validate`, fältnamnen i orderraderna, Fortnox-stegen 1–5 i
   `handleOrderCompletion`, förnyelsen av Fortnox-token.
3. **`paidUnitPrice`** (SPARRE-buggen): fördelad rabatt i fast belopp skrivs
   till `item.paidUnitPrice`, och Fortnox-bygget läser
   `typeof i.paidUnitPrice === "number" ? i.paidUnitPrice : i.price`. Tas
   fältet eller reservlogiken bort blir fakturorna fel igen.
4. **Låsta konstanter:** `FREE_SHIPPING_THRESHOLD`, `SHIPPING_COST`,
   `VIVA_CURRENCY_CODE`, fraktraden 44 kr exklusive moms mot Fortnox,
   prenumerationsrabatten 15 %.
5. **JWT:** `verifyToken()` är enda vägen att verifiera tokens. En ny egen
   verifiering med annan hemlighet återskapar buggen med hudanalys-historiken.
6. **Idempotenta migreringar:** reparationen av `skin_analyses` (UUID för
   user_id, JSONB-kolumner) och alla framtida migreringar måste tåla att
   köras om vid varje deploy.
7. **Rabattkod före mejl:** `createPersonalDiscountCode` körs före sändning,
   `{{RABATTKOD}}` ersätts i utskicksloopen, AI-prompterna förbjuder
   påhittade koder.
8. **Navigationsstrukturen:** pill-nav med Produkter, Om oss, [logotyp = Hem],
   Hudanalys, Kontakt, samt ikoner för språk, Mitt konto och varukorg.
   Mobilmenyn har alla fem punkterna.
9. **Produktdata:** priser, artikelnummer, moms och bilder i
   `frontend/src/lib/products.ts` och `PRODUCTS_MAP` i `server.js` ändras
   aldrig utan uttrycklig begäran, och de två ska stämma överens.
   `articleNumber` är nyckeln mot Fortnox och Ongoing.
10. **Sitemap:** kassa, inloggning, registrering och betalningssidor ska inte
    in i `sitemap.ts`.
11. **Viva-status före bokföring:** återkommande dragningar och ordrar får
    inte gå till Fortnox eller Ongoing innan Viva-transaktionen har status `F`.

## Rapport

Skriv EN samlad rapport i Markdown med dessa sektioner, i ordning:

1. **CRITICAL (måste fixas före push)** – buggar som bryter funktion, läcker
   mellan användare, bryter ett anti-regressionskontrakt, ger fel
   fakturabelopp, exponerar en hemlighet eller rutt, skickar obrukbara
   rabattkoder eller blockerar tillgängligheten.
2. **HIGH (bör fixas före push)** – förvirrande UX, brutna ARIA-relationer,
   regressionsrisk, klient och server som inte stämmer, säkerhetslukt, `fetch`
   utan kontroll, i18n-nycklar som saknas i något av de fem språken.
3. **MEDIUM (kan fixas i uppföljning)** – kosmetiskt, kantfall utanför
   normalflödet, stilmissar utan påverkan vid körning.
4. **OK – verifierat korrekt** – kort tabell över det du aktivt kontrollerade
   och som ser rätt ut, så det syns vad som INTE skummades förbi.

För varje fynd: **filväg och radnummer**, och en fixriktning på en till två
rader – inga hela patchar. Vid kontraktsbrott: namnge kontraktet med nummer
(till exempel "kontrakt 3, paidUnitPrice").

Avsluta med en rad **Sammanfattning**:

- "Inga blockerande fynd – OK att pusha." eller
- "N CRITICAL / M HIGH – bör fixas före push: <fyndens titlar på en rad>."

## Begränsningar

- **Läsande.** Inga ändringar, inga testkörningar, inga byggen, inga externa
  anrop, ingen push, inga frågor mot produktionsdatabasen.
- **Inget påhitt.** Är ett kontrakt inte brutet: hitta inte på ett brott.
- **Radnummer för varje fynd.** Fynd utan hänvisning förkastas.
- **En samlad rapport**, grupperad efter allvar, inte per fil.
- **Gradera inte det du inte läst.** En fil du hoppade över anges under OK med
  "(ej granskad – utanför denna del)".
- **Föreslå inga features.**
- **Följ projektets faktiska stack:** Next.js App Router, Express, Postgres,
  Railway. Föreslå inte `getServerSideProps`, `pages/`-routern eller ORM:er.
