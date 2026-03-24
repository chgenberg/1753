# Track: Autentisering + Kunddashboard

## Mål
Världens bästa login-funktion och kunddashboard med smarta, säljande och värdehöjande funktioner. Apple-lik minimalistisk design.

## Design-princip
- Apple-inspirerad: extremt rent, stora radier, frosted glass, pill-knappar, generösa marginaler
- Typografi: stora fetstilta rubriker, tunn brödtext, tight letter-spacing
- Interaktioner: subtila hover-effekter, smooth transitions, micro-interactions

## Filer

| Fil | Ansvar |
|-----|--------|
| `login.html` | Inloggningssida |
| `register.html` | Registreringssida |
| `auth.js` | Frontend auth-klient (token, session, formulärhantering) |
| `dashboard.html` | Kunddashboard med 8 vyer |
| `dashboard.js` | Dashboard-logik, data, interaktioner |
| `server.js` | Auth-routes (register, login, profile, password, dashboard-data) |
| `styles.css` | Auth + Dashboard CSS-sektioner |

## Autentisering

### Flöde
1. Kund registrerar sig eller loggar in
2. Backend returnerar JWT-token + användardata
3. Frontend sparar i localStorage
4. Alla autentiserade API-anrop inkluderar Bearer token
5. Dashboard kräver inloggning (redirect till login.html)

### Endpoints
- `POST /api/auth/register` – Skapa konto
- `POST /api/auth/login` – Logga in
- `GET /api/auth/profile` – Hämta profil (autentiserad)
- `PUT /api/auth/profile` – Uppdatera profil
- `PUT /api/auth/password` – Byt lösenord
- `GET /api/dashboard/stats` – Dashboard-statistik
- `GET /api/dashboard/orders` – Ordrar
- `POST /api/dashboard/wishlist` – Önskelista

## Dashboard-vyer

### 1. Översikt
- Personlig hälsning
- Statistik-kort: hudpoäng, ordrar, sparade produkter, förmånspoäng
- Snabbåtgärder: ny hudanalys, beställ igen, se erbjudanden
- Senaste ordrar
- Rekommenderade produkter

### 2. Min hudresa
- Tidslinje med hudanalyser (datum + poäng)
- Jämförelse över tid
- "Gör ny analys" – länk till analysis.html
- Tips baserat på senaste analys

### 3. Mina ordrar
- Orderlista med statusbadgar (Behandlas, Skickad, Levererad)
- Ordernummer, datum, produkter, totalt
- Spårningslänk
- Tom-tillstånd: "Du har inga ordrar ännu"

### 4. Min rutin
- Morgonrutin (numrerade steg med produktrekommendationer)
- Kvällsrutin
- Rutinstreak ("Du har följt din rutin X dagar i rad")
- "Anpassa rutin" – baserat på hudtyp

### 5. Förmåner (Lojalitetsprogram)
- Fyra nivåer: Brons (0-499), Silver (500-1499), Guld (1500-3999), Platina (4000+)
- Poängsaldo + progressbar till nästa nivå
- Hur man tjänar poäng (1 kr = 1 poäng)
- Tillgängliga belöningar
- Referral: "Bjud in en vän – ni får båda 100 kr"

### 6. Prenumerationer
- Aktiva prenumerationer med nästa leveransdatum
- Pausa / ändra frekvens / avsluta
- Besparingskalkylator
- CTA för att starta prenumeration

### 7. Önskelista
- Produktgrid med "Lägg i varukorg" per produkt
- "Dela önskelista"
- Tom-tillstånd

### 8. Inställningar
- Profilformulär (namn, e-post, telefon)
- Byt lösenord
- Leveransadress
- Notifikationsval
- Radera konto (farozon)

## Uppgifter

### Grundflöde (klart)
- [x] Login-sida med e-post/lösenord
- [x] Registreringssida med validering
- [x] Frontend auth-klient med JWT
- [x] Backend auth-routes med bcrypt
- [x] Dashboard med 8 vyer
- [x] Sidebar-navigation med hash-routing
- [x] Apple-lik CSS för auth + dashboard
- [x] Responsiv layout (sidebar → stacked på mobil)

### Förbättringar (TODO)
- [ ] OAuth-inloggning (Google, Apple ID)
- [ ] Glömt lösenord (e-postflöde)
- [ ] E-postverifiering
- [ ] Databas istället för in-memory (PostgreSQL/MongoDB)
- [ ] Rate limiting på auth-endpoints
- [ ] CSRF-skydd
- [ ] Sessionshantering (refresh tokens)
- [ ] Push-notifikationer
- [ ] Faktiska prenumerationsavtal (Viva Wallet recurring)
- [ ] Admin-dashboard
