# Chunkad AI-session – 1753 SKINCARE

Det här ersätter **inte** auto-continue i Composer (finns inte). Det ger i stället **färdiga prompts** så du snabbt startar **ny chatt** mellan steg – mindre kontext, färre Provider-fel.

## Så kör du

1. **Del 1** i en **ny** Composer/Agent-chatt. `@`-referera bara `agents/workstream-sentry.md` (eller klistra in prompten nedan utan massor av andra filer).
2. När Sentry är klar: kopiera svaret, stäng eller lämna chatten.
3. **Del 2** i **ny** chatt – klistra in Sentry-rapporten där det står `[SENTRY-RAPPORT]`.
4. **Del 3** i **ny** chatt – klistra in Improver-rapporten.
5. **Del 4** kan köras i samma chatt som Del 3 eller en ny – uppdatera `IMPROVEMENT_LOG.md`.

**Mellan del 1→2 och 2→3 (valfritt):** kör automatiska kontroller i terminalen:

```bash
./scripts/chunk-verify.sh
```

Skriptet stoppar vid fel; det startar **inte** nästa Cursor-chatt åt dig.

---

## Del 1 – Sentry (readonly)

**Inkludera i chatten:** `@agents/workstream-sentry.md` (rekommenderat).

**Klistra in:**

```
Du kör rollen från agents/workstream-sentry.md (readonly, inga filändringar).

Handoff – Cykel [N] (sätt N):
- Granska alla relevanta filer i 1753-projektet enligt sentry-filen.
- Designstandard: Apple-lik minimalism (1753-designsystemet).
- Fokus denna cykel: [välj från prioritering i skills/continuous-improvement/SKILL.md eller skriv "allmän skanning"].
- Kända problem från förra cykeln: [lista eller "inga"].

Leverera en tydlig findings-rapport: buggar, säljhinder, design/UX, tillgänglighet, kod – prioriterat.
```

---

## Del 2 – Improver (skriver kod)

**Inkludera:** `@agents/improver.md` och vid behov de filer Sentry nämnde (sparsamt).

**Klista in (ersätt [SENTRY-RAPPORT]):**

```
Du kör rollen från agents/improver.md.

Handoff – Cykel [N]:
Sentrys rapport:
[SENTRY-RAPPORT]

- Fixa det Sentry hittade där det är motiverat.
- Läs gärna relevanta filer själv och fixa uppenbara saker Sentry missade.
- Följ 1753-projektreglerna och designsystemet.
- Avsluta med kort rapport: vad som ändrats (fil + ändring).
```

---

## Del 3 – Verifier (readonly)

**Inkludera:** `@agents/verifier.md`.

**Klistra in (ersätt [IMPROVER-RAPPORT]):**

```
Du kör rollen från agents/verifier.md (readonly).

Handoff – Cykel [N]:
Improvers rapport:
[IMPROVER-RAPPORT]

Verifiera mot kodbasen: att fixar finns, inga uppenbara regressioner, huvudflöden rimliga.
Svara med GODKÄND / DELVIS / PROBLEM och konkreta punkter.
```

---

## Del 4 – Logga

**Inkludera:** `@IMPROVEMENT_LOG.md` eller öppna filen manuellt.

**Klistra in:**

```
Lägg till en ny cykel-sektion i .cursor/orchestrator/run/2026-03-24-1753-rebuild/IMPROVEMENT_LOG.md
enligt mallen i skills/continuous-improvement/SKILL.md (Steg 4 – LOGGA).

Använd datum och sammanfatta Sentry / Improver / Verifier från denna körning.
```

---

## Felsökning

| Problem | Åtgärd |
|--------|--------|
| Provider Error | Ny chatt, färre `@`-filer, kortare prompt |
| Tappat tråden | Öka bara `[N]` och beskriv "kända problem" i Del 1 |
| Vill automatisera mer | Endast terminal: `chunk-verify.sh`, egna `npm`-script, CI – inte Composer |

## Relaterade filer

- `skills/continuous-improvement/SKILL.md` – full loop och prioriteringstabell
- `IMPROVEMENT_LOG.md` – historik
- `agents/workstream-sentry.md`, `agents/improver.md`, `agents/verifier.md` – roller
