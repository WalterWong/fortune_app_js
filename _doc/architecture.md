# bazi-standalone — Architecture Reference

> Renamed from `fortune_app_js` on 2026-09-08. Active but **behind** the Python engine —
> see `../CLAUDE.md` § Catching up for the assessed gap and why the port is deliberately parked.

## Project Purpose

Pure **client-side** BaZi (八字) calculator built with Next.js + TypeScript. No backend server. All calculations run in the browser using `lunar-typescript`. Outputs a formatted prompt that users copy into ChatGPT, Claude, Gemini, or any other LLM for interpretation. Bilingual UI (中/EN) with EN prompt templates that keep BaZi characters in Chinese.

**Deployment target**: GitHub Pages (static export via `output: "export"` in `next.config.ts`).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack, static export) |
| Language | TypeScript 5 (strict) |
| Styling | TailwindCSS v4 + `tw-animate-css` + shadcn token set (oklch, light + dark) |
| Component library | shadcn/ui (Radix primitives + `class-variance-authority` + `clsx` + `tailwind-merge`) |
| Icons | lucide-react |
| Forms | react-hook-form + zod (+ `@hookform/resolvers`) |
| Charts | recharts (currently unused; reserved for future luck-scale viz) |
| BaZi engine | lunar-typescript |
| i18n | In-house `src/lib/i18n/` (Context + localStorage hydration) |
| Tests | Vitest (`tests/calculator.test.ts`) |
| Deployment | GitHub Pages (`.github/workflows/deploy.yml`) |

## Calculation Pipeline

```
User Input (birth date, time, gender)
    ↓
Solar → Lunar conversion (lunar-typescript)
    ↓
Four Pillars extraction (Year / Month / Day / Hour)
    ↓
Hidden stems with weights (主氣 > 中氣 > 餘氣)
    ↓
Ten Deities derivation (from Day Master)
    ↓
Five Elements scoring
    ↓
Day Master strength assessment (身强 / 身弱)
    ↓
DaYun (大運) 10-year cycles  — includes startYear/endYear
    ↓
LiuNian (流年) annual list   — prev year + current + next 5 = 7 entries
    ↓
Branch relationship detection (沖/合/刑/害/破)
    ↓
Prompt generation (zh | en) → User copies to LLM
```

## Key Source Files

| File | Description |
|------|-------------|
| `src/lib/bazi/calculator.ts` | Main calculation entry point. Adds `startYear`/`endYear` to each DaYun cycle and trims LiuNian to a 7-year window (prev 1 + current + next 5). |
| `src/lib/bazi/ganzhi.ts` | Stems, branches, element mappings **(do not modify)** |
| `src/lib/bazi/data.ts` | NaYin, branch relationships **(do not modify)** |
| `src/lib/bazi/tenDeities.ts` | Ten Deity mappings **(do not modify)** |
| `src/lib/bazi/elements.ts` | Five Element scoring with hidden stem weights, plus element color helpers (`getElementBgColor` / `getElementTextColor` / `getElementColor`) used by the BaZi chart, dayun timeline, liunian list, and legend |
| `src/lib/bazi/strength.ts` | Day Master 强/弱 assessment |
| `src/lib/bazi/types.ts` | All TypeScript types. `DaYunCycle` now carries `startYear` + `endYear`. |
| `src/lib/prompts/builder.ts` | Prompt construction. `buildInitialPrompt(...)` and `buildLuckScalePrompt(...)` accept a `locale: "zh" \| "en"` param and dispatch to `_Zh` / `_En` templates. EN versions keep BaZi characters (天干/地支/納音/五行/十神/ganzhi) verbatim. |
| `src/lib/i18n/strings.ts` | Flat `STRINGS` dict keyed by id × `{zh, en}`. ~50 keys covering header / form / panels / prompt viewer / footer. |
| `src/lib/i18n/context.tsx` | `LocaleProvider` + `useLocale()` hook. Persists to `localStorage["destinyai.locale"]`; hydrates after mount (SSR-safe). |
| `src/lib/utils.ts` | `cn()` helper for shadcn className composition. |
| `src/components/ui/` | shadcn primitives: `button.tsx`, `card.tsx`, `input.tsx`, `label.tsx`, `select.tsx`. Originally byte-equivalent with `../destinyai-frontend/components/ui/`; that two-way obligation is **retired (2026-09-08)** — the two apps may diverge, and this one lifts from the frontend on demand rather than tracking it. |
| `src/components/BirthInput.tsx` | Form using react-hook-form + zod; uses shadcn Input / Label / Select / Button. |
| `src/components/BaziChart.tsx` | Four pillars panel; uses element bg/text colors. |
| `src/components/ElementChart.tsx` | Five-element bar chart with favorable/unfavorable callouts. |
| `src/components/DayunTimeline.tsx` | 10-cycle grid; each cell shows pillar + age range + calendar year range (`1991–1993` etc). |
| `src/components/LiunianList.tsx` | 7-year strip (prev / current / next 5). Past year shown 60% opacity with "去年/Last year" label; current year ringed green. |
| `src/components/ElementLegend.tsx` | 5-chip 五行 color legend rendered once between Birth Info and BaZi Chart. |
| `src/components/PromptViewer.tsx` | Collapsible card with system/user prompts and copy buttons. |
| `src/app/page.tsx` | Top-level page. `中 \| EN` segmented toggle in header; results section composes all panels. Re-renders prompts on locale change via `useEffect([locale, result, gender, birthday])`. |
| `src/app/layout.tsx` | Wraps the tree in `LocaleProvider`. |
| `tests/calculator.test.ts` | Vitest round-trip on `calculateBaZi("1990-01-15", "12:00", "男")`. |
| `vitest.config.ts` | Vitest config; aliases `@/` → `./src`. |
| `.github/workflows/deploy.yml` | GitHub Pages deployment workflow. |

## TypeScript Types

```typescript
Element: "木" | "火" | "土" | "金" | "水"
Gan:     // 10 Heavenly Stems
Zhi:     // 12 Earthly Branches
Pillar:  { gan, zhi, ganzhi, nayin, element, hiddenStems }
BaZiResult:  // Complete calculation output
DaYunCycle:  { cycle, ageRange, startYear, endYear, pillar, gan, zhi, element }
LiuNian:     { year, ganzhi, gan, zhi }
```

## i18n

UI labels live in `src/lib/i18n/strings.ts` as a flat dict keyed by id, with `{ zh, en }` values. Components call `const { t } = useLocale()` and use `t("key")`. BaZi-specific characters (天干/地支/納音/十神/五行/ganzhi) stay in Chinese in both locales — only chrome translates.

Prompt templates (`src/lib/prompts/builder.ts`) take a `locale` arg. The EN template uses English prose but embeds Chinese symbols in the data tables verbatim (e.g. `Year (年) Pillar: 己巳 | NaYin (納音): 大林木 | Hidden Stems (藏干): 丙, 戊, 庚`).

Locale persists via `localStorage["destinyai.locale"]`; hydration runs in a `useEffect` after mount to avoid SSR/CSR mismatch.

## GitHub Pages Deployment

```bash
npm run build    # generates /out static files
# GitHub Actions auto-deploys on push to main
```

Base path is `/bazi-standalone` — configured in `next.config.ts`.

## Reference Docs

- `_doc/260516_shadcn_i18n_refactor.md` — session log: shadcn migration, calendar year on 大運, 7-year 流年 window, 中/EN toggle, EN prompt templates.

Original build artifacts are archived under `_doc/_historical_doc/` (per the `_privco` doc-structure guideline):

- `_historical_doc/260119_project.md` — original project spec
- `_historical_doc/260119_progress.md` — development progress log
- `_historical_doc/260119_summary.md` — feature summary
- `_historical_doc/260119_TODO.md` — implementation checklist (Phases 1–6 + 10 shipped)

## Related Projects

- `../destinyai-backend` — Python FastAPI backend (full-stack version; was `fortune_app`)
- `../destinyai-frontend` — Next.js frontend with Google OAuth for `destinyai-backend`. Source of truth for the shadcn primitives mirrored here.
