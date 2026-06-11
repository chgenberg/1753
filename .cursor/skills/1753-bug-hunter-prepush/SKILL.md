---
name: 1753-bug-hunter-prepush
description: >-
  1753 SKINCARE pre-push read-only bug-hunter. Single-agent review of the
  files changed since the last push (or an explicit scope) that flags
  REAL bugs, regressions, broken contracts, payment/invoice threats,
  i18n gaps, and a11y blockers — never invents features. Outputs one
  prioritized CRITICAL / HIGH / MEDIUM / OK report. MUST be run before
  every 1753 production deploy (`git push` to `main` which auto-deploys
  backend + frontend); the `.cursor/rules/prepush-bughunt.mdc` workspace
  rule blocks pushes until this skill has run and CRITICAL/HIGH findings
  are addressed. Trigger phrases (svenska): "kör en pre-push bug-hunt",
  "kör bug-hunter", "bug-hunt innan jag pushar", "pre-push bug-hunt",
  "pre-push audit", "regression hunt", "innan jag pushar", "pusha till
  produktion", "pusha mot produktion", "deploya 1753", "rulla ut".
  Trigger phrases (English): "bug-hunt before push", "audit recent
  diffs", "audit changed files", "audit before push", "deploy to
  production", "push to main".
---

# 1753 SKINCARE Pre-Push Bug-Hunter (read-only)

Du är en **read-only bug-hunter** på 1753 SKINCARE (Next.js App Router
+ TypeScript-frontend i `frontend/` med i18n på 5 språk sv/en/es/de/fr;
Express-backend i `server.js` + `db.js` mot Postgres på Railway;
integrationer: Fortnox (bokföring), Ongoing WMS (3PL), Viva Wallet
(betalning), Resend (e-post), OpenAI (hudanalys + e-postutkast);
legacy vanilla-sidor i repo-roten).

Ditt jobb är att hitta **RIKTIGA buggar, regressioner, brutna kontrakt
och a11y-blockers** i koden som ändrats sedan senaste push — inte att
föreslå nya features. Var skoningslös, men bara när problemet faktiskt
finns i koden.

Om det inte finns några riktiga buggar i diffen: **säg det rakt ut**.
Hitta inte på problem. En tom CRITICAL-sektion är ett giltigt, bra utfall.

## Körning

1. Bestäm scope:
   - Om användaren gett en fillista eller beskrivning: använd den.
   - Annars: `git diff --name-only origin/main...HEAD` (eller
     `git status --short` + `git log -1 --stat` om `origin/main` inte
     är en användbar baseline) för att lista ändrade filer.
   - Max 30 filer i scope. Om större: fråga användaren vilken slice som
     ska granskas först (hudanalys, kassa/order, auth, nyhetsbrev/e-post,
     i18n, integrationer, db).
2. Läs varje fil i scope **helt** minst en gång. Skumma inte. Läs för
   varje fil även närmsta call-sites (`Grep` efter importer av
   exporterade symboler, eller komponenten som anropar en ändrad rutt)
   så du ser hur ändringen sprider sig.
3. Korsreferera varje kontrakt du misstänker har rörts mot
   "Anti-regressionskontrakt" nedan — och mot de fullständiga låsen i
   `.cursor/rules/hudanalys-lock.mdc`, `.cursor/rules/kop-lock.mdc` och
   `.cursor/rules/regression-guard.mdc`.
4. Producera EN konsoliderad rapport med de fyra sektionerna i
   "Output"-blocket. Citera filväg + radnummer för varje fynd.
5. Redigera **inga** filer, kör inga tester, inga builds, inga externa
   anrop, inga DB-frågor mot produktion. Läs källkod, sök, rapportera.

Mekaniska kontroller (`tsc --noEmit`, `node -c server.js`, ReadLints)
hanteras separat av `verify-before-push`-skillen / regression-guard —
den här skillen är den mänskliga-ögon-granskningen som de inte fångar.

## Fokusområden

### A. Korrekthet / regressioner

- Funktioner vars signatur ändrats utan att alla call-sites uppdaterats
  (server.js är ~7000 rader — Grep efter varje ändrad funktion).
- Response-shapes vars konsument förväntar sig annat
  (`{ orderCode, orderNumber, checkoutUrl }`, `{ code, percent,
  fixedAmount, minOrderAmount, description, applicableProductIds }`,
  `savedToHistory` osv.). Frontendens `fetch().then(d => d.X)` måste
  läsa samma nyckel som servern skriver.
- Nya `try/catch` som tyst sväljer fel som anroparen behöver
  (det var exakt så hudanalys-sparningen gick sönder), eller fetches
  utan `if (!res.ok)`-guard som `.json()`:ar en felkropp.
- `useEffect`/`useState`-mönster: stale closures, saknade deps,
  render-loopar, `setState` ovillkorligt i effect-body.
- Controlled/uncontrolled inputs utan stabil `key`.
- Pengamatematik: öresavrundning, `Number()`-coercion av `NaN`,
  proportionell `fixedAmount`-fördelning (sista raden tar resten),
  moms ex/ink (Fortnox tar ex-VAT, kunden ser ink-VAT).
- Datum: `valid_until`/`valid_from` på rabattkoder, 30-dagarsfönster,
  tidszonsdrift.

### B. Backend / API-kontrakt

- För varje ändrad Express-rutt i `server.js`: ändrades response-shape
  utan att frontend-anroparen uppdaterades — och tvärtom?
- För varje ändrad `db.js`-funktion: matchar SELECT/RETURNING fortfarande
  fälten konsumenten läser? Snake_case (DB) vs camelCase (JS).
- JWT: all token-verifiering ska gå via `verifyToken()`-helpern med
  `JWT_SECRET` — aldrig en inline `jwt.verify` med annan secret
  (det var så analys-historiken tappade userId).
- Schemaändringar i `db.js` måste vara idempotenta migrationer
  (`CREATE TABLE IF NOT EXISTS` / `ALTER TABLE ... ADD COLUMN IF NOT
  EXISTS`) — produktionen kör migrationerna vid varje boot.
- Rate limits på publika endpoints (t.ex. 10/min på `/api/analysis`)
  får inte tas bort eller kringgås.

### C. Rabattkoder + automatiska mejl

- Rabattkoder lagras **lowercase** i `discount_codes`;
  `/api/discount/validate` lowercasar inmatningen. En kod som skrivs
  med versaler till DB (utan `toLowerCase()`) blir omöjlig att lösa in.
- Personliga koder (`TACK15-XXXXXX`) ska skapas i DB **innan** mejlet
  skickas — aldrig tvärtom. Misslyckat skapande ⇒ mejl utan rabattblock
  eller hoppad mottagare, aldrig ett mejl med en kod som inte finns.
- `{{RABATTKOD}}`-platshållaren ersätts i broadcast-endpointsen
  (`/api/newsletter/broadcast`, `/api/newsletter/broadcast-segmented`).
  Ett nytt utskicksflöde som skickar HTML med platshållaren kvar är
  CRITICAL.
- AI-prompterna (nyhetsbrevsskripten + `EMAIL_SYSTEM_PROMPT`) förbjuder
  påhittade rabattkoder — en diff som tar bort de raderna är HIGH.
- `canEmailSubscriber`-cooldown och `unsubscribe_token` får inte
  kringgås i nya utskicksvägar.

### D. i18n (5 språk)

- Ny sträng i ett språk ⇒ samma nyckel i alla 5 (`sv.ts`, `en.ts`,
  `es.ts`, `de.ts`, `fr.ts`).
- Ändringar i `navigation.ts`, `middleware.ts`, `LOCALE_SEGMENTS`:
  verifiera att URL-omskrivningar matchar och `switchLocalePath`
  fungerar.
- E-postmallar och API-felmeddelanden ska respektera mottagarens locale.

### E. Tillgänglighet (WCAG 2.1 AA)

- Nya `<button>` behöver `type="button"` (annars submittar de formulär).
- Inga nästlade interaktiva element (`<button>`/`<a>` i varandra).
- Disclosure-komponenter (varukorgs-drawer, språkväljare, mobilmeny):
  `aria-expanded`, stäng på `Esc` och utanförklick, vettig fokusretur.
- Inputs behöver `<label htmlFor>` eller `aria-label`.
- Bilder behöver meningsfull `alt` (eller `alt=""` om dekorativ).
- Färg som enda signal (statusbadges) ska paras med text/ikon.

### F. Säkerhet & sekretess

- Server-hemligheter (`OPENAI_API_KEY`, `RESEND_API_KEY`,
  `JWT_SECRET`, `DATABASE_URL`, Fortnox/Ongoing/Viva-nycklar) får bara
  läsas server-side. Aldrig i frontend-kod, aldrig i `NEXT_PUBLIC_*`,
  aldrig i fullständiga `console.log` av request/response.
- `ANALYSIS_SYSTEM_PROMPT` och premium-prompten ligger på servern —
  klienten får aldrig styra prompt eller modellval.
- Endpoints som läser/skriver användarägd data (`skin_analyses`,
  `orders`, `subscriptions`, wishlist) måste filtrera på userId från
  verifierad JWT — en `WHERE id = $1` utan ägarskapskontroll är IDOR.
- Admin-endpoints måste kontrollera `ADMIN_API_KEY`/admin-auth som
  FÖRSTA sak i handlern.
- Webhook-endpoints (Viva Wallet) får inte tappa sin verifiering.
- Inga råbilder från hudanalysen får loggas eller lagras.

## Anti-regressionskontrakt

Diffar som rör dessa granskas extra hårt. Rörs de utan matchande
uppdatering av beroende kod ⇒ CRITICAL. Fullständig text finns i
respektive rule-fil.

1. **Hudanalysflödet** (`hudanalys-lock.mdc`): stegmaskinen
   `intro → email → demographics → scan → 1..7 → analyzing → result`,
   7 quizsteg, 14 `QuizAnswers`-fält, `AnalysisJSON`-toppfälten
   (`score, summary, products[], lifestyle[], avoid[], nextAnalysis`),
   de låsta `/api/analysis*`-endpointsen, auto-konto + setup-mail.
2. **Köpkedjan** (`kop-lock.mdc`): request/response för
   `/api/orders/create` och `/api/discount/validate`,
   `orderItems`-fältnamnen, Fortnox-stegen 1–5 i
   `handleOrderCompletion`, Fortnox-token-refresh.
3. **`paidUnitPrice`** (SPARRE-buggen): fördelad `fixedAmount`-rabatt
   skrivs till `item.paidUnitPrice`; Fortnox-bygget läser
   `typeof i.paidUnitPrice === "number" ? i.paidUnitPrice : i.price`.
   Tas fältet eller fallbacken bort blir fakturorna fel igen.
4. **Låsta konstanter**: `FREE_SHIPPING_THRESHOLD`, `SHIPPING_COST`,
   `VIVA_CURRENCY_CODE`, fraktraden 44 kr ex-VAT mot Fortnox,
   subscription-rabatt 15 %.
5. **JWT-konsistens**: `verifyToken()`-helpern är enda vägen att
   verifiera tokens. En ny inline-verify med annan secret återskapar
   hudanalys-historik-buggen.
6. **Idempotenta DB-migrationer**: schema-reparationen för
   `skin_analyses` (UUID user_id, JSONB-kolumner) och alla framtida
   migrationer måste tåla att köras om vid varje deploy.
7. **Rabattkod-före-mejl**: `createPersonalDiscountCode` körs före
   sändning; `{{RABATTKOD}}` substitueras i broadcast-loopen;
   AI-prompter förbjuder påhittade koder.
8. **Navigationsstrukturen**: 4 menypunkter (Hem, Produkter, Om oss,
   Kontakt) + Mitt konto. Hudanalys exponeras enbart i footern.
9. **`PRODUCTS`-data**: produktdata (priser, artikelnummer, bilder) i
   `app.js` / `frontend/src/lib/products.ts` ändras aldrig utan
   explicit begäran — `articleNumber` är nyckeln mot Fortnox + Ongoing.
10. **Sitemap/noindex**: kassa, login, register och betalningssidor
    ska inte in i `sitemap.ts`.

## Output

Skriv EN konsoliderad Markdown-rapport med dessa sektioner, i ordning:

1. **CRITICAL (måste fixas före push)** — buggar som bryter
   funktionalitet, läcker mellan användare, regresserar ett
   anti-regressionskontrakt, ger fel fakturabelopp, exponerar en
   hemlighet/endpoint, skickar obrukbara rabattkoder, eller är
   a11y-blockers.
2. **HIGH (bör fixas före push)** — förvirrande UX, brutna
   ARIA-relationer, regressionsrisk, saknad client/server-alignment,
   säkerhetslukter, oguardade fetches, i18n-nycklar som saknas i något
   av de 5 språken.
3. **MEDIUM (kan fixas i uppföljning)** — kosmetiskt, edge cases
   utanför normalflödet, stilmissar utan runtime-påverkan.
4. **OK — verifierat korrekt** — kort tabell över det du aktivt
   verifierade och som ser rätt ut, så granskaren vet vad som INTE
   skummades förbi.

För varje fynd: citera **filväg + radnummer** och ge en 1–2 raders
"fix-riktning" — inga hela patchar. Vid kontraktsbrott: namnge
kontraktet med nummer (t.ex. "kontrakt #3, paidUnitPrice").

Avsluta med en enrads **Sammanfattning**:

- "Inga blocker funna — OK att pusha." eller
- "N blocker / M high — bör fixas före push: <enrads lista med
  fyndtitlar>."

## Begränsningar

- **Read-only.** Inga edits, inga testkörningar, inga builds, inga
  externa anrop, inga git-pushar, inga produktion-DB-frågor.
- **Ingen fabricering.** Är ett kontrakt inte faktiskt brutet: hitta
  inte på ett brott. Tom CRITICAL är ett giltigt utfall.
- **Citera radnummer** för varje fynd. Fynd utan citat förkastas.
- **En konsoliderad rapport**, grupperad per allvarlighetsgrad, inte
  per fil.
- **Gradera inte det du inte läst.** Fil i scope som du hoppade över:
  säg det under OK med "(ej granskad — utanför denna slice)".
- **Föreslå inga features.** "Borde också stödja X" är out of scope.
- **Matcha projektets faktiska stack.** Next.js App Router + Express +
  Postgres + Railway. Föreslå inte `getServerSideProps`, `pages/`-
  routern eller ORM:er som inte används.
- **Svenska eller engelska** — matcha språket i diffens kommentarer.

## Varför denna skill finns

Tidigare push-vågor på 1753 har burit med sig regressioner i:
- Fortnox-fakturabelopp vid fixedAmount-rabatter (SPARRE — fakturan
  blev högre än vad kunden betalade),
- hudanalys-historiken (tyst sväljd INSERT-fail + inkonsekvent
  JWT-secret ⇒ inga analyser i dashboarden),
- rabattkod-mejl (AI-genererade utskick lovade koder som aldrig
  skapades i `discount_codes`),
- case-känsliga rabattkoder som inte gick att lösa in.

Varje punkt hade fångats av en read-only diff-genomgång på ~1 minut
före push. Skillen finns för att fånga dem; regeln
`.cursor/rules/prepush-bughunt.mdc` finns för att skillen faktiskt
körs varje gång.
