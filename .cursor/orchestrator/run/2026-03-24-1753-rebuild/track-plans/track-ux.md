# Track: Interaktioner + Polish

**Agent 4** | Ansvarig för: animationer, micro-interactions, accessibility, performance

## Mål

Ta den grundläggande sidan och gör den levande. Varje interaktion ska kännas medveten och ändamålsenlig – aldrig flashig. Tänk Mantle/Aesop-nivå men med ännu mer subtilitet.

## Filer att skapa/ändra

- `animations.js` (ny fil – alla scroll- och interaktionsanimationer)
- `styles.css` (lägg till animationsklasser, transitions, hover-states)
- Alla HTML-filer (lägg till data-attribut och klasser för animationer)

## Uppgifter

### 1. Scroll-animationer (IntersectionObserver)

```js
// Mönster: element med [data-reveal] syns vid scroll
// Klasser: .reveal-up, .reveal-fade, .reveal-stagger
```

- Element med `data-reveal` fade-in och slide-up vid scroll
- Stagger-effekt på produktgrid (varje kort med 80ms delay)
- Threshold: 0.15 (trigga tidigt)
- Respektera `prefers-reduced-motion`

### 2. Navigation-animationer
- Header bakgrund: transparent → solid vid scroll
- Header height transition: smooth shrink
- Mobilmeny: overlay med backdrop-blur + staggered link reveal
- Logo subtle scale på hover

### 3. Produktinteraktioner
- Produktkort: bild `scale(1.03)` vid hover, 400ms ease
- Lägg-i-varukorg: knapp-pulse (scale 0.95 → 1.0)
- Cart badge: bounce keyframe vid uppdatering
- Cart drawer: slide-in med backdrop fade
- Bildladdning: opacity 0 → 1 transition vid load

### 4. Formulärinteraktioner
- Input focus: border-color transition till --green
- Floating labels: translateY animation
- Submit-knapp: loading state med subtle spinner
- Success-meddelande: fade-in

### 5. Micro-interactions
- Alla knappar: subtle scale(0.98) vid :active
- Länkar: underline-animation (width 0 → 100%)
- Footer-länkar: color transition
- Details/summary: smooth open/close med max-height transition

### 6. Performance
- `will-change` på animerade element (bara under animation)
- `loading="lazy"` på alla bilder
- GPU-acceleration via `transform: translateZ(0)` där det behövs
- Inga layout shifts – alla bilder med aspect-ratio

### 7. Accessibility
- `:focus-visible` styles på alla interaktiva element
- `aria-expanded` på mobilmeny och cart drawer
- `aria-label` på ikoner utan text
- Skip-to-content länk
- `role="dialog"` på cart drawer
- Tangentbordsnavigering: Escape stänger drawers/menus

## Animationsklasser (CSS)

```css
[data-reveal] { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
[data-reveal].visible { opacity: 1; transform: translateY(0); }
[data-reveal-stagger] { transition-delay: calc(var(--stagger) * 80ms); }
```

## Acceptanskriterier

- [ ] Alla sektioner animeras smidigt vid scroll
- [ ] Inga animation-janks (60fps)
- [ ] prefers-reduced-motion stänger av animationer
- [ ] Alla interaktiva element har focus-styles
- [ ] Inga accessibility-varningar i Lighthouse
- [ ] Bilder laddar lazy utan layout shift
