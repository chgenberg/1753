---
paths:
  - "server.js"
  - "services/**"
  - "outreach/**"
  - "scripts/**"
---

# OpenAI-modeller

## Regel

Projektet använder GPT-5.4-familjen eller nyare. Aldrig äldre modeller.

Förbjudet: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `gpt-3.5-turbo` och allt
äldre än GPT-5.4-familjen.

## Vad som används var

| Användning | Styrs av | Standardvärde |
|---|---|---|
| Hudanalys, premiumanalys, följdfrågor i analysen | `OPENAI_MODEL` i `server.js` | `gpt-5.6-terra` |
| Hudanalysens resonemangsnivå | `OPENAI_REASONING_EFFORT` | `low` |
| Mejlsvar och mejlutkast | `EMAIL_AI_MODEL` | samma som `OPENAI_MODEL` |
| Mejlagenten (`outreach/agent.js`) | `OPENAI_MODEL_NEWSLETTER` | `gpt-5.4`, reserv `gpt-5.4-mini` |
| Personliga nyhetsbrev (`scripts/`) | `OPENAI_MODEL_NEWSLETTER` | `gpt-5.4` |
| Admin-agenterna (`services/agent-army.js`) | `OPENAI_MODEL_AGENT` | `gpt-5.4` |
| Chatten i butiken, översättning av recensioner | hårdkodat i `server.js` | `gpt-5.4-mini` |

Miljövariablerna sätts i Railway. Ett värde där vinner över standardvärdet i koden.

## Vid ändringar

- Hudanalysens modell, resonemangsnivå och prompt ändras inte utan uttryckligt
  ok (se `hudanalys-las.md`). Bytet till `gpt-5.6-terra` gjordes medvetet: den
  är nyare och billigare än 5.4 och ger lika bra eller bättre analyser.
- Välj den billigare modellen för uppgifter där kunden inte läser resultatet
  ordagrant. Välj den starkare för allt som bär varumärkets röst.
- När en nyare modell släpps: uppgradera, testa mot riktiga analyser och
  uppdatera tabellen här.
- AI-prompter som skriver mejl får aldrig hitta på rabattkoder. Ta inte bort de
  raderna ur prompterna.
