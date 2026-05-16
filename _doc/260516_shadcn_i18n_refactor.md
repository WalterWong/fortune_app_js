# 2026-05-16 — shadcn migration, calendar years on 大運, 7-year 流年, 中/EN toggle, EN prompts

Session log for the refactor that brought `fortune_app_js` in line with `../destinyai-frontend` and added a full English mode.

## What changed

### P1 — Doc cleanup
- Moved `doc/{project,progress,summary,TODO}.md` → `_doc/_historical_doc/260119_*.md`.
- Removed the empty lowercase `doc/` folder.
- Added the upward link `../../_privco/_doc/doc_structure_guideline.md` in `CLAUDE.md`.
- Dropped the "not `_doc/`" caveat in `_doc/architecture.md`.

### P2 — UI alignment with destinyai-frontend
- Installed: `@radix-ui/react-{label,select,slot}`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `lucide-react`, `react-hook-form`, `zod`, `@hookform/resolvers`.
- Removed unused: `zustand`.
- Added: `components.json`, `src/lib/utils.ts` (`cn()`), full shadcn token set in `src/app/globals.css` (light + dark, oklch).
- Copied shadcn primitives byte-equivalent from `../destinyai-frontend/components/ui/` → `src/components/ui/`: `button.tsx`, `card.tsx`, `input.tsx`, `label.tsx`, `select.tsx`.
- Refactored `BirthInput.tsx` to react-hook-form + zod + shadcn primitives.
- Wrapped result panels in `Card / CardHeader / CardContent`; adopted destinyai's purple→blue gradient header.
- Kept element semantic colors (金=amber, 木=green, 水=blue, 火=red, 土=orange) and BaZi relationship colors (合=green, 沖=red, 刑=orange, 害=amber, 破=purple) — these have intentional domain meaning.

### P3 — Hygiene
- `lint` script: bare `eslint` → `eslint .`
- Added `test` script: `vitest run`
- Added `vitest.config.ts` and `tests/calculator.test.ts` (round-trip on `1990-01-15 12:00 男` plus dayun count and noon fallback).

### UI additions
- **`ElementLegend`** — 5 chips above the result panels showing 金/木/水/火/土 in their canonical bg/text colors.
- **Calendar years on 大運** — extended `DaYunCycle` with `startYear` / `endYear` (`birthYear + startAge` / `birthYear + endAge`), shown under each age range in `DayunTimeline`.
- **流年 retuned to 7 entries** — `calculateLiunian(currentYear - 1, 7)`. Past year shown at 60% opacity with "去年/Last year" label; current year keeps its green ring.

### i18n
- `src/lib/i18n/strings.ts` — flat dict, ~50 keys × `{ zh, en }`. BaZi-specific characters (天干/地支/納音/十神/五行/ganzhi) never translated.
- `src/lib/i18n/context.tsx` — `LocaleProvider` + `useLocale()`; persists to `localStorage["destinyai.locale"]`; hydrates after mount (SSR-safe).
- `app/layout.tsx` wraps the tree in `LocaleProvider`.
- `app/page.tsx` — segmented `中 | EN` toggle in the header (active state uses `aria-pressed` + `bg-primary text-primary-foreground`). Earlier version showed only the opposite locale on a single button; the user found that confusing → replaced with the segmented control. A `useEffect([locale, result, gender, birthday])` regenerates both prompts in the new language when locale flips.
- Prompt builder — `buildInitialPrompt` / `buildLuckScalePrompt` / `buildChatPrompt` now take a `locale` arg and dispatch to `_Zh` / `_En` templates. EN templates use English prose but embed Chinese characters in data tables verbatim (e.g. `Year (年) Pillar: 己巳 | NaYin (納音): 大林木 | Hidden Stems (藏干): 丙, 戊, 庚`).
- LLM list in prompt viewer title + usage step expanded: `ChatGPT / Claude / Gemini` (was just `ChatGPT / Claude`).

## Live verification

Tested in Chrome at `localhost:3000` with `1990-01-15 12:00 男`:

- ZH default + toggle to EN: every panel re-renders with English labels; BaZi characters (庚, 辰, 大林木, 涧下水, 丑午害, 丑辰破, 喜用神, 忌神) stay in Chinese in both locales.
- 大運 cells show e.g. `34-43 yrs / 2024–2033`; current cycle ringed purple with `Now` / `當前`.
- 流年 strip: 2025 (`Last year` / 60% opacity), 2026 (`This year` / green ring), 2027–2031.
- Element legend chips render with matching bg/text colors.
- Prompt content: system + user prompts both in English (or Chinese) with embedded Chinese symbols preserved.
- `localStorage["destinyai.locale"]` set correctly on toggle, survives reload.
- `npm run lint`: 0 errors, 16 pre-existing unused-import warnings in `src/lib/bazi/*` (not from this refactor).
- `npm test`: 3/3 pass.
- `npm run build`: static export succeeds.

## Notable decisions

- **Mirror destinyai's primitives, don't fork.** `src/components/ui/*.tsx` are byte-equivalent copies. If one project changes a shadcn component, mirror it to the other.
- **Domain colors stay opinionated.** 五行 element colors and BaZi relationship colors carry meaning (合/合 = harmonious = green, 沖 = clash = red). Did not replace with shadcn neutral tokens.
- **`src/` layout retained** (vs. destinyai's flat layout). Calc-heavy `src/lib/bazi/*` benefits from the namespace separation. Cross-project consistency lives in the primitives and the design tokens, not the folder shape.
- **No URL routing for results** — single-page input ↔ results toggle preserves the standalone GitHub-Pages character.
- **SSR-safe i18n hydration** — `useEffect` reads `localStorage` after mount. Lazy initializer would mismatch SSR; `useSyncExternalStore` would over-engineer it. Carries one targeted `eslint-disable-next-line react-hooks/set-state-in-effect` with explanation.

## Files touched

```
Modified
  CLAUDE.md
  README.md
  _doc/architecture.md
  package.json, package-lock.json
  src/app/{layout,page,globals.css}.tsx
  src/components/{BirthInput,BaziChart,ElementChart,DayunTimeline,LiunianList,PromptViewer}.tsx
  src/lib/bazi/{calculator,types}.ts
  src/lib/prompts/builder.ts

New
  components.json
  src/components/ui/{button,card,input,label,select}.tsx
  src/components/ElementLegend.tsx
  src/lib/utils.ts
  src/lib/i18n/{strings.ts, context.tsx}
  tests/calculator.test.ts
  vitest.config.ts
  _doc/260516_shadcn_i18n_refactor.md   ← this file

Moved (archived)
  doc/project.md   → _doc/_historical_doc/260119_project.md
  doc/progress.md  → _doc/_historical_doc/260119_progress.md
  doc/summary.md   → _doc/_historical_doc/260119_summary.md
  doc/TODO.md      → _doc/_historical_doc/260119_TODO.md

Removed
  doc/                         (now empty)
  zustand dep                  (was unused)
```
