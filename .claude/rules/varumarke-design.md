---
paths:
  - "frontend/src/**"
  - "newsletters/**"
  - "bildproduktion/**"
---

# Varumärke och designsystem

## Varumärke

1753 SKINCARE säljer hudvård baserad på CBD och CBG. Tonen är ärlig, varm och
rebellisk – aldrig klinisk eller korporativ. Skeptisk till konventionell
hudvård. Korta meningar, direkt tilltal. Aldrig emojis.

Produktnamn översätts inte (Fungtastic, DUO-kit, TA-DA Serum, Au Naturel,
Chagala). Vetenskapliga påståenden behåller sina källor.

## Designprinciper

- **Apple-lik minimalism:** renhet, stora radier, generösa marginaler, frostat glas.
- **Superminimalistiskt:** varje element ska motivera sin plats.
- **Inte AI-aktigt:** undvik perfekt symmetri, generiska gradienter och
  stockfoto-estetik.
- **Interaktivt:** mjuka scroll-animationer, hover med lyft, mikrointeraktioner.
  Mycket rörelse, men aldrig rörigt.

## Designspråk sedan 2026-06-11 (beslutat av Christopher)

- **Header:** centrerad pill i frostat glas med logotypen i mitten. Ordning:
  Produkter, Om oss, [logotyp = Hem], Hudanalys, Kontakt. Ikoner till höger för
  språk, Mitt konto och varukorg. Mobilmenyn har alla fem punkter inklusive Hem.
  Strukturen ändras inte utan att fråga.
- **Rörelse** i `frontend/src/components/fx/`:
  - `motion.tsx`: `Reveal` (fade/slide vid scroll), `Parallax`, `Marquee`
  - `frames.tsx`: `MediaFrame` (valvbågsramar: arch, arch-bl, arch-br, circle,
    wide), `Pill` (liten etikett ovanför rubrik)
  - `lenis-provider.tsx`: `LenisProvider`, mjuk scroll för hela sajten
  - `fonts.ts`: `displayFont`
- **Typografi:** Fraunces (`--font-fraunces`, via `displayFont`) för stora
  rubriker, Inter för brödtext. Båda laddas med `next/font` i `app/layout.tsx`.
- **Signaturformer:** valvbågsramar med parallax, färgblockskort i grönt, brunt
  och mörkt med stor serif, den jättelika ordbilden "1753" i footern.
- **Startsidans hero:** tre valvbågsramar (arch-bl, arch, arch-br) med parallax
  under en serif-rubrik och en pill.
- **Lenis:** allt som scrollar ovanpå sidan MÅSTE ha `data-lenis-prevent`
  (varukorgslådan, chatten, modaler, adressförslag). Annars går det inte att
  scrolla i dem.

## Färger

Varumärkesfärgerna skrivs som hex direkt i Tailwind-klasser
(`bg-[#108474]`, `text-[#766a62]`). De ändras inte utan att fråga.

| Färg | Hex | Används till |
|---|---|---|
| Grön | `#108474` | Köpknappar, accent, hover |
| Brun | `#766a62` | Sekundär text, etiketter |
| Mörk | `#1d1d1f` | Brödtext |
| Mörk ljus | `#515151` | Sekundär brödtext |
| Bakgrund | `#f5f5f7` | Ljusa sektioner |
| Vit | `#ffffff` | Huvudbakgrund |
| Grå | `#e6e6e6` | Avdelare |
| Guld | `#fcb237` | Stjärnor, betyg |

shadcn-variablerna i `app/globals.css` (`--foreground`, `--muted` med flera) är
en varm neutral skala för UI-komponenterna och är inte varumärkesfärgerna.

## Detaljer

- Radier: 16 px på kort, 980 px på pill-knappar, 12 px på inputfält.
- Skuggor i stället för kantlinjer – subtila och lätta.
- Hover på kort: `scale(1.02)` och djupare skugga.
- Övergångar: `0.3s cubic-bezier(0.25, 0.1, 0.25, 1)`.
- Inputfält: 48 px höga, fokus markeras med en ring.
- Navigationen: `backdrop-filter: blur(20px)`.
- Storlekar i `rem`. Radavstånd 1.6 i brödtext.
- Respektera `prefers-reduced-motion`.

## Produktbilder

- Produktbilder visas i minimalistiska ramar: tydlig yta, luft, subtil skugga
  eller lätt inre kontur. Aldrig tunga ramlister.
- Produktkort och produktsida ska kännas som genomtänkt butiksdesign: ren yta,
  fokus på produkten.

## Kvalitetskrav

1. Korrekt svenska (å, ä, ö) och motsvarande kvalitet på övriga fyra språk.
2. Fungerar på mobil (375 px), surfplatta (768 px) och desktop (1440 px).
3. Inga fel i konsolen.
4. Alla länkar och interaktioner fungerar.
5. Tillgänglighet: semantisk HTML, `aria-label` där text saknas,
   tangentbordsnavigation, synlig fokus. Knappar i formulär ska ha
   `type="button"` om de inte ska skicka formuläret.
6. Bilder via `next/image` med meningsfull `alt` (tom `alt` om dekorativ).

## Sökmotorer

`frontend/src/app/sitemap.ts` innehåller startsida, produkter, om oss, kontakt,
hudanalys, guider och juridik. Kassa, inloggning, registrering och
betalningssidor hålls medvetet utanför.
