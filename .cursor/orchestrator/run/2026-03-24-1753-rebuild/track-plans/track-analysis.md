# Track: Holistisk Hudanalys (AI)

**Agent 5** | Ansvarig för: AI-driven hudanalys med OpenAI Vision

## Mål

Bygga den smartaste hudanalys- och rekommendationsfunktionen i hudvårdsbranschen. Kunden laddar upp ett foto och får realtidsrekommendationer kring livsstil, hudvård (våra produkter) och holistiskt välmående.

## Filosofi (KRITISKT)

Analysen ska vara STRIKT holistisk:
- Huden ses som ett intelligent organ format av 1,9 miljoner år av evolution
- Fokus på hudens endocannabinoidsystem (ECS)
- Försiktigt skeptisk till konventionell hudvård (syror, retinol, kemiska peels)
- Försiktigt skeptisk till modern livsstil (stress, processad mat, brist på natur)
- Rekommenderar livsstilsförändringar LIKA MYCKET som produkter
- Enkelhet – rekommendera max 2-3 produkter, inte hela sortimentet

## Filer

- `analysis.html` – Upload-sida med resultatvy
- `analysis.js` – OpenAI Vision-integration, prompt, resultatformatering
- `styles.css` – Sektioner markerade med `/* ANALYSIS */`

## Teknisk arkitektur

### OpenAI Integration
- Modell: `gpt-4o` med vision
- API-nyckel: sparas i localStorage (temporärt), ska senare konfigureras server-side
- System prompt i `analysis.js` som `ANALYSIS_SYSTEM_PROMPT`
- Bilden skickas som base64 data-URL

### Flöde
1. Användare laddar upp foto (drag-and-drop eller filväljare)
2. Förhandsgranskning av foto
3. Klick på "Analysera min hud"
4. Laddningsindikator med informativ text
5. Resultat visas: analys-text + rekommenderade produkter
6. Produktrekommendationer matchar automatiskt baserat på nyckelord i analysen

### Prompt-design
System-prompten ska instruera GPT-4o att:
- Analysera synliga hudtillstånd
- Ge livsstilsrekommendationer (sömn, kost, stress, rörelse, tarm)
- Rekommendera specifika 1753-produkter med namn och pris
- Varna för vanliga misstag i konventionell hudvård
- Aldrig ge medicinsk diagnos
- Skriva på svenska utan emojis
- Max 600 ord

## Uppgifter för vidare utveckling

### Fas 1 (nuvarande)
- [x] Grundläggande upload + preview
- [x] OpenAI API-integration
- [x] Resultatformatering (markdown → HTML)
- [x] Automatisk produktmatchning
- [x] CTA på startsidan

### Fas 2 (framtida)
- [ ] Streaming av svar (SSE) för realtidskänsla
- [ ] Spara analyshistorik i localStorage
- [ ] Jämför "före och efter" över tid
- [ ] Server-side proxy för API-nyckel (inte exponera i frontend)
- [ ] Rate limiting och felhantering
- [ ] Detaljerade hudkartor (markera problemområden på bilden)
- [ ] Follow-up frågor ("Berätta mer om din kost")

### Fas 3 (vision)
- [ ] Integration med Shopify för direkt köp av rekommenderade produkter
- [ ] Personaliserad e-post med analysresultat
- [ ] Säsongsanpassade rekommendationer
- [ ] Community-funktion: anonymt dela analyser och resultat

## Acceptanskriterier

- [ ] Foto-upload fungerar (klick + drag-and-drop)
- [ ] Förhandsgranskning visas korrekt
- [ ] API-anrop till OpenAI fungerar med giltig nyckel
- [ ] Resultat formateras snyggt med rubriker och listor
- [ ] Rekommenderade produkter visas med bild och pris
- [ ] Felmeddelanden vid saknad nyckel eller API-fel
- [ ] Responsivt på mobil och desktop
- [ ] Korrekt svenska i all text
