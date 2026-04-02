1753 SKINCARE – Frontend-audit: fleragents-struktur
===================================================
Syfte: Varje spår granskas som en "agent" med egen utdatafil. Efter en full
omgång uppdateras de två sammanfattande filerna i docs/ (se nedan).

Skill: .cursor/skills/1753-frontend-audit-composer/SKILL.md

Filer i denna mapp (tracks/)
  agent-01-navigation-ia.txt
  agent-02-typografi-layout.txt
  agent-03-rorelse-micro-ux.txt
  agent-04-tillganglighet.txt
  agent-05-prestanda.txt
  agent-06-api-koppling.txt
  agent-07-copy-varumarke.txt
  agent-08-edge-cases.txt

Sammanfattningar (en nivå upp i docs/)
  frontend-audit-forbattringsatgarder.txt  – prioriterade åtgärder P0–P2
  frontend-audit-buggar.txt               – risker, buggar, manuella tester

Arbetsflöde
1) Kör spår 1–8 (olika agentpass eller samma agent sekventiellt) – uppdatera
   respektive agent-NN-*.txt utifrån frontend/src/ och regler.
2) Kör "sammanfattningssteget": flytta/aggregera till de två filerna i docs/
   utan att duplicera allt rått (tracks behåller detalj, summaries prioriterar).

Senast full audit-körning: 2026-04-02 (agents/frontend-audit.md)
