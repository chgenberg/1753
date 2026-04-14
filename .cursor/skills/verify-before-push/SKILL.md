# Verify Before Push

Kör en komplett verifiering av kodbasen innan push. Aktiveras med `/verify`.

## Steg

Utför stegen nedan i ordning. Stoppa och rapportera om något steg misslyckas.

### 1. TypeScript-kompilering (frontend)

```sh
cd frontend && npx tsc --noEmit
```

Krav: NOLL fel. Alla TypeScript-typer måste stämma.

### 2. ESLint (frontend)

```sh
cd frontend && npm run lint
```

Krav: NOLL errors (warnings accepteras). Om nya errors uppstått sedan senaste push, lista dem och föreslå fixar.

### 3. Backend-syntaxkontroll

```sh
node -c server.js && node -c db.js
```

Krav: Båda filerna ska parsa utan syntaxfel.

### 4. Ändrade filer

Lista alla filer som ändrats sedan senaste commit:

```sh
git diff --name-only HEAD
```

Om inga ändringar finns, rapportera att allt är rent.

### 5. Linter-diagnostik

Kör `ReadLints` på varje ändrad fil från steg 4. Rapportera eventuella nya linter-varningar eller fel.

### 6. Kritiska flöden – påverkansanalys

Baserat på de ändrade filerna, identifiera vilka av dessa kritiska flöden som kan påverkas:

| Flöde | Nyckelfiler |
|-------|------------|
| Hudanalys | `hudanalys/page.tsx`, `analysis-tabs.tsx`, `pdf-export.ts`, `skin-scanner/`, `server.js` (prompt) |
| Kassa | `kassa/page.tsx`, `cart-provider.tsx`, `cart-drawer.tsx`, `server.js` (orders) |
| Auth | `auth-provider.tsx`, `login/`, `register/`, `server.js` (auth-routes) |
| i18n | `strings/*.ts`, `navigation.ts`, `middleware.ts`, `header.tsx`, `footer.tsx` |
| Newsletter | `footer.tsx`, `hudanalys/page.tsx`, `server.js` (newsletter), `db.js` |
| Produkter | `produkter/`, `[slug]/page.tsx`, `app.js` |

### 7. Rapport

Sammanställ resultatet i detta format:

```
VERIFIERING
-----------
TypeScript:  OK / FEL (antal)
ESLint:      OK / FEL (antal errors) / VARNINGAR (antal)
Backend:     OK / FEL
Linter:      OK / NYA VARNINGAR (lista)
Påverkade flöden: [lista]

REKOMMENDATION: SÄKERT ATT PUSHA / ÅTGÄRDA INNAN PUSH
```
