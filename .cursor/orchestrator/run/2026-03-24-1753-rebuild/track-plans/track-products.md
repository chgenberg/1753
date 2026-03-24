# Track: Produkter + Butik

**Agent 2** | Ansvarig för: produktgrid, produktsida, varukorg, filtrering

## Mål

Skapa en butikskänsla i klass med Mantle/Aesop men enklare. Produkter ska vara lätta att bläddra, öppna och lägga i varukorg. Varukorgen ska kännas responsiv och smooth.

## Filer att ändra

- `product.html` (huvudsakligt arbete)
- `app.js` (produktrendering, varukorg, filtrering)
- `styles.css` (sektioner: `/* PRODUCTS GRID */`, `/* PRODUCT DETAIL */`, `/* CART */`)

## Filer att INTE röra

- `index.html` hero/nav-sektioner (ägs av Agent 1)
- `about.html`, `contact.html` (ägs av Agent 3)

## Uppgifter

### 1. Produktgrid (index.html-sektionen + ev. products-vy)
- 3 kolumner desktop, 2 mobil
- Hover-effekt: bild zoomar subtilt (scale 1.03), overlay med produktnamn
- Prisbadge för rabatterade produkter (röd/grön liten badge)
- Fade-in animation vid scroll (klasser som Agent 4 kan använda)
- Sortering: pris lågt-högt, högt-lågt, popularitet (antal omdömen)

### 2. Produktsida (product.html)
- Vänster: stor produktbild (sticky vid scroll på desktop)
- Höger: produktinfo, pris, storlek-selector, lägg-i-varukorg-knapp
- Expanderbara sektioner: Ingredienser, Förpackning, Garanti
- Produktbeskrivning med snygg typografi
- Relaterade produkter längst ner (3 st)

### 3. Varukorg
- Drawer från höger med smooth slide-in (300ms ease)
- Produkter med bild-thumbnail, namn, pris, antal +/-
- Total-summa med tydlig typografi
- "Till kassan"-knapp
- Tom-varukorg meddelande
- Badge på varukorg-ikonen bouncar vid tillägg

### 4. Lägg-i-varukorg-upplevelse
- Knapp-animation vid klick (pulse eller ripple)
- Notifikation som slidar in nerifrån
- Varukorgs-badge uppdateras med kort bounce

### 5. Produktdata
- All data finns redan i PRODUCTS-arrayen i app.js
- Lägg till `category`-fält om det behövs för filtrering
- Se till att alla priser formateras korrekt (sv-SE locale)

## Acceptanskriterier

- [ ] Alla 9 produkter visas korrekt i griden
- [ ] Produktsida laddar rätt data baserat på URL-param
- [ ] Varukorg fungerar: lägg till, ta bort, ändra antal
- [ ] Varukorgen sparas i localStorage
- [ ] Sortering fungerar
- [ ] Responsivt på alla breakpoints
