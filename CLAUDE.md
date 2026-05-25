# CLAUDE.md

> Follows the conventions at `../../../_privco/_doc/doc_structure_guideline.md`.

**Standalone** client-side BaZi (八字) calculator in Next.js + TypeScript. **No backend required** — all calculations run in the browser. Uses `lunar-typescript` for Solar→Lunar conversion. Outputs a formatted prompt the user copies into ChatGPT, Claude, Gemini, or any other LLM for interpretation.

This project is independent of `../fortune_app` and `../destinyai-frontend`. It is a self-contained prototype / standalone tool, not part of the paired backend+frontend system. UI primitives are kept byte-equivalent with `../destinyai-frontend/components/ui/` so the two apps share a look-and-feel.

Deploys to GitHub Pages as a static export.

## Commands

```bash
npm install
npm run dev      # dev server :3000
npm run build    # static export → /out
npm run lint     # eslint .
npm test         # vitest (calculator round-trip)
npx serve out    # preview static build locally
```

## Key Files

| File | Role |
|------|------|
| `src/lib/bazi/calculator.ts` | Calculation entry point |
| `src/lib/bazi/ganzhi.ts` | Stems/branches/element mappings **(do not modify)** |
| `src/lib/bazi/data.ts` | NaYin, branch relationships **(do not modify)** |
| `src/lib/bazi/tenDeities.ts` | Ten Deity mappings **(do not modify)** |
| `src/lib/bazi/types.ts` | All TypeScript types — `DaYunCycle` carries `startYear`/`endYear` |
| `src/lib/prompts/builder.ts` | Prompt construction; takes `locale: "zh" \| "en"` |
| `src/lib/i18n/strings.ts` | All UI labels keyed × `{zh, en}` (BaZi characters stay Chinese) |
| `src/lib/i18n/context.tsx` | `LocaleProvider` + `useLocale()`; persists to `localStorage["destinyai.locale"]` |
| `src/app/page.tsx` | Main UI (input form + all result panels + 中/EN segmented toggle) |
| `src/app/layout.tsx` | Wraps tree in `LocaleProvider` |
| `src/components/ui/` | shadcn/ui primitives (button, card, input, label, select) — kept in sync with `../destinyai-frontend/components/ui/` |
| `src/components/ElementLegend.tsx` | 五行 color legend (shown above result panels) |
| `src/lib/utils.ts` | `cn()` helper for shadcn className composition |
| `tests/calculator.test.ts` | Vitest round-trip on `calculateBaZi("1990-01-15", "12:00", "男")` |
| `vitest.config.ts` | Vitest config (`@/` → `./src` alias) |
| `components.json` | shadcn/ui config (`style: new-york`, `baseColor: neutral`) |
| `.github/workflows/deploy.yml` | GitHub Pages deployment workflow |

## i18n

- Default locale: `zh` (Traditional Chinese). Toggle via the `中 | EN` segmented control top-right.
- BaZi-specific characters (天干/地支/納音/五行/十神/ganzhi like `庚`, `辰`, `丑午害`, `大林木`) **stay in Chinese in both locales** — only chrome translates.
- Prompt templates have full ZH and EN versions in `src/lib/prompts/builder.ts`. The EN template embeds Chinese symbols verbatim in the data tables and translates only the prose / labels / analysis tasks.
- Locale persists across reloads via `localStorage["destinyai.locale"]`.
- Locale flips trigger an `useEffect` in `app/page.tsx` to regenerate both prompts in the new language; chart data (locale-agnostic) is unchanged.

## Critical

- Do not modify `ganzhi.ts`, `data.ts`, or `tenDeities.ts` — validated traditional data
- Static export base path is `/fortune_app_js` (set in `next.config.ts`)
- No API calls — if you see a `fetch` or external HTTP call, it's a bug
- UI primitives mirror `../destinyai-frontend/components/ui/` — when updating one, mirror the change in the other so the two apps stay visually consistent
- When adding a UI string, add **both** `zh` and `en` entries to `src/lib/i18n/strings.ts` — don't hard-code text in components

## Reference

- `_doc/architecture.md` — calculation pipeline, type definitions, tech stack, deployment notes
- `_doc/260516_shadcn_i18n_refactor.md` — session log: shadcn migration, calendar year on 大運, prev-1/+5 流年, 中/EN toggle, EN prompt templates
- `_doc/_historical_doc/260119_project.md` — original plan (archived)
- `_doc/_historical_doc/260119_TODO.md` — original implementation checklist (archived; Phases 1–6 + 10 shipped)
- `_doc/_historical_doc/260119_progress.md`, `260119_summary.md` — Phase build logs (archived)
