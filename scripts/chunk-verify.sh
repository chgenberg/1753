#!/usr/bin/env bash
# Automatiska kontroller mellan Sentry → Improver → Verifier.
# Startar inte nästa Cursor-chatt (går inte att göra utan Cursor-API).

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "== 1753 chunk-verify =="
node --check server.js
echo "OK: server.js"
echo ""
echo "Nästa steg manuellt: öppna ny Composer-chatt och kör Del 2 eller Del 3 enligt"
echo ".cursor/orchestrator/run/2026-03-24-1753-rebuild/SESSION_CHUNKS.md"
