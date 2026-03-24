# Designsystem – 1753 SKINCARE

## Filosofi

Sidan ska se ut som att en talangfull designer satt och pixlat den för hand. Inte som en AI-genererad mall. Det betyder:

- Asymmetri där det passar – allt behöver inte vara perfekt centrerat
- Generöst whitespace – låt innehållet andas
- Subtila ojämnheter i spacing som ger en mänsklig känsla
- Inga stock-mönster: inga gradients, inga drop-shadows på kort, inga rounded corners överallt

## Inspiration

**mantleskin.com/sv** – men enklare:
- Deras fullbredd-sektioner och editorial typografi
- Deras hover-effekter på produktkort
- Deras rena navigation med minimalt antal val
- Deras scroll-animationer (fade-in sektioner)

**Vad vi INTE tar med:**
- Deras komplexitet (många produktkategorier, submenyer)
- Deras badge-system (bästsäljare, nyhet osv)
- Deras tunga bildanvändning i hero

## Färgpalett

```
Primär:     #108474  (teal/grön – CTA, accent)
Sekundär:   #766a62  (varm brun – labels, metadata)
Text:       #212121  (mörk – huvudtext)
Text ljus:  #515151  (grå – sekundärtext)
Bakgrund:   #fafafa  (off-white – sektionsbakgrund)
Vit:        #ffffff  (huvudbakgrund)
Border:     #e6e6e6  (grå – linjer, avdelare)
Guld:       #fcb237  (betyg, stjärnor)
```

## Typografi

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
```

| Element | Storlek | Vikt | Letter-spacing |
|---|---|---|---|
| H1 (hero) | 2.2rem | 300 | 0.01em |
| H2 (sektionsrubrik) | 1.4rem | 400 | 0.02em |
| H3 (produktnamn) | 0.9rem | 500 | 0 |
| Body | 0.9rem | 400 | 0 |
| Label/meta | 0.75rem | 600 | 0.12em, uppercase |
| Nav-länk | 0.82rem | 400 | 0.03em |
| Pris | 0.9rem | 400 | 0 |

## Spacing

Baserat på 8px-grid:
- Sektions-padding: 80px vertikalt
- Inre padding container: 24px horisontellt
- Produktgrid gap: 24px
- Max-width: 1100px centrerad

## Knappar

```css
/* Primär */
.btn-primary {
  background: #212121;
  color: #ffffff;
  padding: 13px 36px;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
  border-radius: 3px;
  transition: background 0.2s;
}
.btn-primary:hover { background: #108474; }

/* Outline */
.btn-outline {
  background: transparent;
  color: #212121;
  border: 1px solid #212121;
  /* samma spacing som primary */
}
.btn-outline:hover { background: #212121; color: #ffffff; }
```

## Animationer

Alla animationer ska vara subtila och ändamålsenliga.

```
Transition standard:    0.2s ease
Transition slow:        0.4s ease
Transition smooth:      0.6s cubic-bezier(0.16, 1, 0.3, 1)
Scroll reveal duration: 0.6s ease
Stagger delay:          80ms per element
```

**prefers-reduced-motion:** Alla animationer ska stängas av helt.

## Responsivitet

| Breakpoint | Kolumner | Nav |
|---|---|---|
| > 1024px | 3 kolumner | Horisontell |
| 768–1024px | 2 kolumner | Horisontell |
| < 768px | 2 kolumner | Hamburger overlay |
| < 480px | 1–2 kolumner | Hamburger overlay |

## Ikoner

Inga ikonbibliotek. Använd HTML-entities eller enkel SVG inline:
- Hamburger: 3 `<span>` med CSS
- Stäng: `&times;`
- Varukorg: inline SVG eller text "Varukorg"
- Plus/minus i varukorg: text

## Bildhantering

- Alla produktbilder från Shopify CDN (redan i app.js)
- `loading="lazy"` på alla bilder
- `aspect-ratio: 1` på produktkort-bilder
- Bakgrundsfärg `#fafafa` som placeholder
- Transition `opacity 0 → 1` vid bildladdning
