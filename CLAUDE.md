# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

```
npm run dev
```

Requires Node.js on PATH. First run `npm install` if `node_modules` is missing. Visit `http://localhost:5173`.

**Build:** `npm run build` — output goes to `build/`. Set `NODE_ENV=production` for the correct base path.

**Deployment:** push to `main` on GitHub. The Actions workflow (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages at `https://miel.github.io/kneefit-v2/`. Always bump `package.json` version before committing.

## Architecture

SvelteKit + `adapter-static` (fully client-side SPA, no SSR). Svelte 5 with legacy component syntax (`export let`, `$:`, `on:event`).

**iOS PWA routing:** the app uses store-based navigation (`src/lib/navigation.js`) instead of SvelteKit's URL router. The URL permanently stays at `/kneefit-v2/`. This avoids iOS Safari showing the browser chrome on navigation. Never use `goto()` for in-app navigation — use `navigate(pageName)` instead.

**Page rendering:** `src/routes/+page.svelte` is the only route. It renders one of five page components from `src/lib/pages/` based on the `currentPage` store.

**Data layer:** IndexedDB via `idb` (npm). All access goes through `src/lib/db.js`. Stores are primed once in `src/routes/+layout.js` `load()` and kept reactive via Svelte stores in `src/lib/stores.js`. Action helpers in `stores.js` update both IDB and the store atomically — never call `db.js` directly from components.

**Theme:** `src/lib/theme.js` store writes `data-theme` to `<html>`. Light/dark CSS variables are in `src/app.css` — dark is `:root`, light is `[data-theme="light"]` (must come after `:root`). An inline script in `src/app.html` sets the theme before Svelte hydrates to prevent flash.

## Key files

| File | Purpose |
|---|---|
| `src/lib/navigation.js` | `currentPage` store + `navigate()` |
| `src/lib/db.js` | All IndexedDB CRUD |
| `src/lib/stores.js` | Reactive stores + action helpers |
| `src/lib/csv.js` | CSV export + v1 import parser |
| `src/lib/pages/` | One component per page |
| `src/lib/components/` | Shared UI components |
| `vite.config.js` | PWA manifest + Workbox config (base path `/kneefit-v2/`) |
| `svelte.config.js` | adapter-static, `paths.base` (empty in dev, `/kneefit-v2` in prod) |

## Data models

**exerciseLogs** — `{ id: number, date: 'YYYY-MM-DD', timeSlot: 'morning'|'afternoon'|'evening', exercises: [{ exercise, sets, restTime, weight, reps }], notes }`

**painAssessments** — `{ id: number, date: 'YYYY-MM-DD', timeSlot, restPain, activityPain, touchPain, scaleType: 'numeric'|'qualitative', notes }`
Qualitative values: `'no pain' | 'sensitive' | 'painful' | 'sharp pain'`

**customExercises** — `{ name: string, createdAt: number }` — keyPath is `name`

Always use local date formatting (`getFullYear/getMonth/getDate`) for ISO date strings — never `toISOString()`, which shifts to UTC and causes date mismatches for users in UTC+ timezones.
