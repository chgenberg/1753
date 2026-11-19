# Bug-hunt är obligatorisk före produktionspush

Innan du kör något kommando som rullar ut 1753 SKINCARE till en miljö riktiga
kunder ser MÅSTE skillen `1753-bug-hunter-prepush` ha körts mot diffen sedan
senaste push, och en rapport utan CRITICAL och HIGH finnas i den pågående
konversationen.

Det här är en hård grind, inte en rekommendation. Skillen tar ungefär en minut.
Det är billigare än varje produktionsbugg som fixats i panik.

Bug-hunten ersätter inte de mekaniska kontrollerna i `regressionsskydd.md`
(`tsc --noEmit`, lint, `node -c`). Båda ska köras. Bug-hunten är
kodgranskningen; de mekaniska kontrollerna är kompilatorn.

## Vad som räknas som produktionspush

- `git push` mot `main` (deployar automatiskt backend och butik)
- `git push` mot andra grenar som någon miljö deployar från
- `railway up` och andra deploykommandon
- ändrad deploy- eller infrakonfiguration (`Dockerfile`, Railway-inställningar,
  `package.json`-skript som körs i produktion) följd av en deploy

Omfattas inte: lokal `npm run dev`, lokal `next build`, syntaxkontroller,
tester mot localhost, commits utan push.

## Flödet

1. Kör `1753-bug-hunter-prepush` mot diffen sedan senaste push
   (`git diff --name-only origin/main...HEAD` är standard).
2. Vänta på den samlade rapporten med CRITICAL / HIGH / MEDIUM / OK.
3. **Finns CRITICAL eller HIGH:** stoppa. Visa rapporten och föreslå fixar.
   Pusha inte förrän Christopher uttryckligen säger "kör ändå" eller motsvarande
   – och upprepa då fyndet i en sista bekräftelse innan du kör.
4. **Bara MEDIUM eller rent:** kör de mekaniska kontrollerna och pusha sedan.
5. Sammanfatta kort i svaret, till exempel:
   "Bug-hunt klar – 0 CRITICAL, 0 HIGH, 2 MEDIUM. Pushar nu."

## Enda undantaget

Om Christopher själv uttryckligen ber dig hoppa över bug-hunten ("skip
bug-hunt", "pusha direkt utan att kolla"): notera det i svaret och fortsätt.
Ta aldrig själv initiativ till en push utan bug-hunt – inte ens när diffen ser
liten ut eller "bara är en textändring".

## Varför regeln finns

Tidigare pushar har fört med sig regressioner i:

- **Fortnox-fakturabelopp** (SPARRE-buggen): rabatt i fast belopp kom inte med
  till Fortnox, så fakturan blev högre än vad kunden betalade.
- **Hudanalys-historiken:** ett tyst svalt INSERT-fel och en avvikande
  JWT-hemlighet gjorde att inga analyser syntes i Mitt konto.
- **Rabattkod-mejl:** AI-genererade utskick lovade koder som aldrig skapades i
  `discount_codes`.
- **Skiftlägeskänsliga rabattkoder:** koder sparade med versaler gick inte att
  lösa in, eftersom valideringen gör inmatningen till gemener.

Alla fyra hade fångats av en läsande genomgång av diffen före push.
