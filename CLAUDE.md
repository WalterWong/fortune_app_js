# CLAUDE.md

<!-- status: stale -->
<!-- next: PARKED on purpose — port the deterministic chart layer from destinyai-backend engine/ once 姨姨's open Q's close (pack r7 §J Q45–Q46, Q47, Q37–Q44). Nothing here is wrong, it is BEHIND. Read RESUME.md for the gate + porting order @claude -->

> **What this is, and what it is NOT.** `bazi-standalone` is the **no-backend** BaZi app: it
> computes the chart in the browser, renders the template + annotation labels, and **prepares a
> prompt** you paste into ChatGPT / Claude / Gemini yourself. It is *not* a JS port of
> `destinyai-backend`, and *not* a cut-down `destinyai-frontend`. Those two are one paired
> product (FastAPI + Next.js + OAuth + stored sessions); this is a third, independent thing that
> shares only the BaZi domain. Renamed from `fortune_app_js` on 2026-09-08 because that name
> implied otherwise and repeatedly caused exactly that confusion.
>
> **Status: behind, not broken.** Frozen since 2026-05-25 while the Python engine advanced to
> 0.8.1 and absorbed 麥燕芬師傅's canon (r4–r8). Nothing here is *wrong* on its own terms — it is
> simply older. See "Catching up" at the bottom before making it look current.

> Follows the conventions at `../../../_privco/_doc/doc_structure_guideline.md`.

**Standalone** client-side BaZi (八字) calculator in Next.js + TypeScript. **No backend required** — all calculations run in the browser. Uses `lunar-typescript` for Solar→Lunar conversion. Outputs a formatted prompt the user copies into ChatGPT, Claude, Gemini, or any other LLM for interpretation.

This project is independent of `../destinyai-backend` and `../destinyai-frontend`. It is a self-contained standalone tool, not part of the paired backend+frontend system. Its UI primitives *started* byte-equivalent with `../destinyai-frontend/components/ui/`, which is why the two look alike — but that two-way obligation is retired (see Critical below); they may now diverge.

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
| `src/components/ui/` | shadcn/ui primitives (button, card, input, label, select) — originally byte-equivalent with `../destinyai-frontend/components/ui/`; may now diverge |
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
- Static export base path is `/bazi-standalone` (set in `next.config.ts`)
- No API calls — if you see a `fetch` or external HTTP call, it's a bug
- UI primitives were originally kept byte-equivalent with `../destinyai-frontend/components/ui/`.
  **That standing two-way obligation is retired (2026-09-08)** — the two apps may diverge. The
  rule now is one-way and on demand: when catching up, you may LIFT a component from
  `../destinyai-frontend/` (both are Next.js + React + shadcn, so they drop in), but nothing
  obliges either app to track the other
- When adding a UI string, add **both** `zh` and `en` entries to `src/lib/i18n/strings.ts` — don't hard-code text in components

## Reference

- **`RESUME.md`** — paste-ready cold-resume prompt + ordered reading list + the porting order for when the canon unblocks. Read this first on a cold start.
- `_doc/architecture.md` — calculation pipeline, type definitions, tech stack, deployment notes
- `_doc/260516_shadcn_i18n_refactor.md` — session log: shadcn migration, calendar year on 大運, prev-1/+5 流年, 中/EN toggle, EN prompt templates
- `_doc/_historical_doc/260119_project.md` — original plan (archived)
- `_doc/_historical_doc/260119_TODO.md` — original implementation checklist (archived; Phases 1–6 + 10 shipped)
- `_doc/_historical_doc/260119_progress.md`, `260119_summary.md` — Phase build logs (archived)

## Catching up (the standing gap)

Frozen 2026-05-25; the Python engine has since reached **0.8.1** and absorbed 麥燕芬師傅's
canon rounds r4–r8. Nothing here is *wrong* on its own terms — it is **behind**. Assessed
2026-09-08:

**There is no architectural blocker.** Everything this app needs is portable:

| Layer | Portable? |
|---|---|
| `destinyai-backend/src/fortune_backend/engine/` (~5,150 lines) | **Yes** — pure. stdlib + `lunar_python` only; no I/O, no DB, no network, no `async` |
| 曆法 / 節氣 / 大運起運 | **Yes** — the backend uses `lunar-python`, this app already uses `lunar-typescript` (same author, same API). It already calls the identical set: `Solar.fromYmdHms`, `getEightChar`, `getYun`, `getDaYun` |
| 命盤 template + annotation labels | **Already TypeScript** — `../destinyai-frontend/components/{FanChart.tsx, fan/chart-parts.tsx}` ≈ 1,000 lines of exactly this, as pure render components over a `chart_table` prop. Both apps are Next.js + React + shadcn, so they lift across |
| LLM interpretation | **Not needed** — by design this app *prepares a prompt* for the user to paste. That is the one genuinely server-side thing, and it is the one thing this app deliberately does not do |

Remaining work is therefore a port of the *computation* only: ~4,270 lines of engine (excluding
`ziwei.py` and `curve.py`) plus ~1,500 lines of prompt logic. There is a **differential oracle** —
331 Python tests and `tests/fixtures/` — so expected outputs can be generated for a batch of
charts and diffed. Keep 姨姨's own externally-produced chart as a *completeness* fixture too: an
oracle diff only ever covers what you already emit.

**Do not start the port yet.** Her canon is still moving (pack r7 §J Q45–Q46 open, Q47 十神雙讀
awaiting written confirmation, Q37–Q44 not yet pasted). Porting a moving target means owning two
engines that drift apart silently, since this one has no expert reviewer. Wait until the pack is
walked, then port once against a frozen ruleset.

**Script rule — read before any zh-Hant sweep.** The authority is her canon in `../../bazi/`,
NOT a conversion library. A blanket converter destroys the domain: `丑`(地支)→醜 "ugly",
`干`(天干)→幹, `斗`(斗數)→鬥, `凶`→兇, and `冲`→衝 where the canon wants `沖`. **Never convert:
丑 干 斗 凶, and the standalone mark 杀.** `tests/labels.test.ts` enforces this in both directions.

**Known divergences from canon (deliberate, not bugs):**
- `七殺` — the **short chart mark** is `杀` (Simplified, on purpose: her canon has 杀 525 : 殺 166),
  but the **full name** is `七殺` (canon 七殺 56 : 七杀 2). Her own guide states the pairing
  literally: 「七殺 → 杀」. Do not blanket-convert either way; `tests/labels.test.ts` pins both.
- `偏印` prints as `梟` (Traditional). The `杀` exception does NOT extend here — the backend canon
  contains no `枭`/`梟` at all (it writes `P`), and `../../bazi/` has 梟 12 : 枭 0.
- Hidden-stem weights use this app's own 5/3/1-ish scale, not the engine's 20/10 司令 weights.
  Both are proportional systems; hers has not ruled on ours. Leave until it does.
