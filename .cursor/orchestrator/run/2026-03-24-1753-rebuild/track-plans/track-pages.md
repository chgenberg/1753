# Track: Om oss + Kontakt

**Agent 3** | Ansvarig för: about-sida, kontaktsida, storytelling-layout

## Mål

Skapa sidor som känns personliga och genuina. Christophers och Ebbas berättelse ska presenteras med en editorial känsla – inte som en standard "om oss"-sida. Kontaktsidan ska vara inbjudande.

## Filer att ändra

- `about.html` (huvudsakligt arbete)
- `contact.html` (huvudsakligt arbete)
- `styles.css` (sektioner: `/* ABOUT */`, `/* CONTACT */`)

## Filer att INTE röra

- `index.html` (ägs av Agent 1)
- `product.html`, `app.js` (ägs av Agent 2)

## Uppgifter

### 1. About-sida

**Storytelling-layout:**
- Öppna med citat eller stark mening från Christopher
- Alternera text/whitespace i en editorial grid
- Christopher-sektion med namn, roll, berättelse
- Ebba-sektion med namn, roll, berättelse
- Vision-sektion med variant bakgrund (--bg färg)
- Parallax-redo sektioner (klasser för Agent 4)

**Innehåll (finns redan i about.html):**
- Christopher Genberg – Founder / CBD-nörd
- Ebba Genberg – Färg, ljus och formexpert
- Vision: förbättra självkänslan genom hudens endocannabinoidsystem

**Design:**
- Stora textstycken med generöst whitespace
- Subtila horisontella linjer som avdelare
- Pull-quotes med larger font-size
- Sektioner som förbereds för fade-in vid scroll

### 2. Kontaktsida

**Layout:**
- Tvåkolumn: kontaktinfo vänster, formulär höger
- Kontaktuppgifter: adress, telefon, e-post, öppettider
- Formulär: namn, e-post, meddelande, skicka-knapp

**Formulärdesign:**
- Subtila labels som float up vid focus (floating labels)
- Inline-validering med färgkodning (grön/röd border)
- Submit-knapp med hover-state
- Bekräftelsemeddelande efter skickat (inline, inte alert)

**Kontaktuppgifter:**
- 1753 SKINCARE
- Södra Skjutbanevägen 10, 439 55, Åsa, Sverige
- 0732 - 30 55 21
- hej@1753skincare.com
- Måndag–Fredag 08:00–18:00, Lördag 10:00–14:00, Söndag stängt

### 3. Gemensamt

- Varje sida har nav + footer (kopiera strukturen från index.html)
- Varukorg-drawer ska finnas på alla sidor

## Acceptanskriterier

- [ ] About-sida har editorial känsla, inte generisk
- [ ] Kontaktformulär validerar input
- [ ] Bekräftelsemeddelande visas efter submit
- [ ] Responsivt på alla breakpoints
- [ ] Alla texter på korrekt svenska
