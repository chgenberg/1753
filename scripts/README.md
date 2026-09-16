# scripts/

Återanvändbara ops-skript. Kör mot produktion med `railway run -- node scripts/<fil>.js`.
Kundnamns-skript är engångs — kör dem inte igen, kopiera dem inte som mall.

## Återanvänd (ops)

| Fil | Syfte |
|-----|--------|
| `send-subscription-invite.js` | Pren-mejl till ≥3 köp utan prenumeration. `--dry-run`, `--preview`, annars skarpt. |
| `send-review-ask-preview.js` | Preview av recensionsmejl till Christopher. |
| `send-review-ask-blast.js` | Skarpt recensionsutskick (redan kört 8 sep 2026). |
| `generate-newsletter.js` | Nyhetsbrevsutkast. |
| `generate-personal-newsletters.js` | Personliga analysmejl. Default dry-run, `--send` för skarpt. |
| `generate-skin-newsletters.js` | Hudtillstånds-nyhetsbrev. |
| `refresh-landing-content.js` | SEO-landningssidor. |
| `generate-new-guides.js` / `generate-llms-guides.js` | Guider. |
| `reverse-fortnox-payments-v2.js` | Kreditera Fortnox-betalningar. |
| `import-reviews.js` / `translate-reviews.js` | Recensioner. |
| `sync-resend-audience.js` | Resend-lista. |
| `social-media-generator.js` | Socialt innehåll. |
| `schedule-30-days.js` / `schedule-week.js` | Social kö. |

## Engångs (arkiv, kör inte om)

`charge-*`, `fix-*`, `fulfil-*`, `finish-*`, `lookup-*`, `reschedule-*`, `retry-failed-subs-*`, `cancel-ulrika-grahn.js`, `create-*-discount.js`, `seed-gabriellaschmidt.js` och liknande kundspecifika filer.

Ny ops: parametrisera (order-id / e-post som argv), lägg inte kundnamn i filnamnet.
