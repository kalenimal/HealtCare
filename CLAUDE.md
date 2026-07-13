# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start Vite dev server (serves under base path /HealtCare/, e.g. http://localhost:5173/HealtCare/)
npm run build    # tsc -b (project references type-check) && vite build
npm run lint      # oxlint
npm run preview  # preview the production build locally
```

There is no test suite configured in this repo (no test runner/dependency present).

## What this project is

A frontend-only mock/demo UI for a health-monitoring platform ("Здоровьесбережение"). There is no backend: authentication doesn't validate credentials, and all data is generated client-side by a seeded PRNG rather than fetched from an API. Treat any "save"/"submit" action as writing to local in-memory state only, not a real persistence layer.

Deployed to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`. Because of this, `vite.config.ts` sets `base: '/HealtCare/'` and the app uses `HashRouter` (`src/main.tsx`) instead of a browser-history router — both are required for the static GitHub Pages hosting to work and shouldn't be changed without also reconsidering the deploy target.

## Architecture

The codebase follows Feature-Sliced Design. Layers, from highest to lowest, each only importing from layers below it:

```
app       — routing shell, route guards (src/App.tsx, src/app/providers/*)
pages     — route-level screens, compose widgets/features (src/pages/*)
widgets   — larger composed UI blocks used by pages (src/widgets/*)
features  — user-interactions/actions (auth form, export button, edit modals) (src/features/*)
entities  — domain models + mock data + business logic (src/entities/*)
shared    — generic UI kit, libs, config with no domain knowledge (src/shared/*)
```

Each slice is re-exported through an `index.ts` barrel; import across slices via the `@/` alias (mapped to `src/`) and the slice's barrel, e.g. `@/entities/health-metric`, not deep paths into another slice's internals.

### Domain model and mock data

- `entities/health-metric/model/catalog.ts` (`metricCatalog`, keyed by `MetricKey`) is the single source of truth for every tracked health metric: label, unit, normal range, decimal precision, and whether higher values are better. Charts, tables, reports, and exports all read from this catalog rather than hardcoding metric metadata. Adding a metric means updating the `MetricKey` union in `model/types.ts`, adding an entry to `catalog.ts`, and adding defaults/bounds/profile overrides in `model/mock-series.ts`.
- `entities/health-metric/model/mock-series.ts` deterministically generates ~120 days of history per `(patientId, metricKey)` pair using a seeded `mulberry32` PRNG (`shared/lib/random.ts`), so the same patient/metric always produces the same series across renders/reloads. Per-patient trend/noise/base overrides live in `patientProfiles`; anything not overridden falls back to `defaultBase`/`defaultNoise`.
- `entities/report/lib/build-report.ts` (`buildGroupReport`) aggregates a group's patients' series for one metric into a `GroupReport` (per-patient average/latest/change + group-level average/change). The specialist reports page calls this once per selected metric to build multi-metric comparisons.
- `entities/user/model/session-store.ts` is a zustand store holding the logged-in `currentUser`; it is not persisted (no localStorage), so a page reload logs the user out. `RootRedirect` and `RequireRole` (`src/app/providers/`) gate routes based on this store and the user's `role` (`patient` | `specialist`), redirecting to `/auth` or to the role's home route as appropriate.

### Reports and XLSX export

`shared/lib/export-xlsx.ts` wraps `exceljs` + `file-saver` and exposes both `exportRowsToXlsx` (single sheet) and `exportSheetsToXlsx` (multiple sheets in one workbook). The generic `ExportButton` feature component uses the single-sheet form; `SpecialistReportsPage`'s multi-metric comparison export builds one `XlsxSheet` per selected metric plus a combined summary sheet and calls `exportSheetsToXlsx` directly. Both `exceljs` and `file-saver` are dynamically `import()`-ed inside the export functions so they land in a separate chunk instead of the main bundle.

### Styling

Tailwind v4 via `@tailwindcss/vite` (CSS-first config, no `tailwind.config.js`). Custom design tokens (the navy/sand/mist color palette, font stack) are declared in the `@theme` block in `src/index.css`.
