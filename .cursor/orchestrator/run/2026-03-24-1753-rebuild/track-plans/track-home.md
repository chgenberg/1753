# Track: Hem + Navigation

**Agent 1** | Ansvarig för: startsida, navigation, footer, sidövergångar

## Mål

Skapa en startsida som omedelbart kommunicerar varumärkets identitet. Sticky navigation, mobilmeny, och smooth scroll-beteende. Inspiration: mantleskin.com men renare.

## Filer att ändra

- `index.html` (huvudsakligt arbete)
- `styles.css` (sektioner markerade med `/* NAV */`, `/* HERO */`, `/* FOOTER */`)

## Filer att INTE röra

- `product.html`, `about.html`, `contact.html` (ägs av andra agenter)
- `app.js` (ägs av Agent 2 för produktlogik)

## Uppgifter

### 1. Navigation
- Sticky header som krymper vid scroll (60px → 48px)
- Logo till vänster, menyval centrerade eller till höger
- 4 menyval: Hem, Produkter, Om oss, Kontakt
- Varukorg-ikon med badge (count)
- Mobilmeny: hamburger → fullscreen overlay med smooth fade
- Active state på nuvarande sida

### 2. Hero-sektion
- Fullbredd-layout, ren typografi, ingen bild i hero
- Rubrik + kort text om varumärket
- Subtil animation: text fade-in vid sidladdning
- Eventuellt: announcement bar ovanför nav ("Fri frakt över X kr")

### 3. Utvald sektion
- Lyft fram 3 populära produkter i en visuell sektion under hero
- Stora kort, hover-effekt, länk till produkt
- Kan använda `renderProductsGrid()` från app.js men med anpassad layout

### 4. Footer
- Ren 3-kolumn layout
- Kontaktuppgifter, snabblänkar, copyright
- Subtila hover-effekter på länkar

### 5. Scroll-beteende
- Smooth scroll (`scroll-behavior: smooth`)
- Navigation-bakgrund förändras vid scroll (transparent → vit)
- Sektioner fade-in vid scroll (förbereds för Agent 4)

## Acceptanskriterier

- [ ] Nav fungerar på mobil och desktop
- [ ] Hero ser rent och avskalat ut
- [ ] Inga horisontella scrollbars
- [ ] Footer synlig och korrekt
- [ ] Alla texter på korrekt svenska
