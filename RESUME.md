# RESUME — `bazi-standalone`

Paste this into a fresh session to continue:

> Continue `bazi-standalone` in `~/Workspaces/_personal/destinyai/bazi-standalone/`.
> Read `CLAUDE.md` — especially the header (what this app is and is NOT) and the
> **§ Catching up** section at the bottom, which holds the assessed gap. Then check
> whether 麥燕芬師傅's canon has settled (see `../../bazi/exchange/_doc/260709_fan_clarification_pack.md`
> and `../../bazi/CLAUDE.md`'s `next:` line). Tell me whether the port is unblocked yet,
> and if it is, propose the porting order.

## Reading order

1. `CLAUDE.md` — what this is vs the paired product; the § Catching up gap assessment;
   the three deliberate divergences from canon (do not "fix" them).
2. `../../bazi/CLAUDE.md` — the four tiers, and its `next:` line (whether her open Q's closed).
3. `../../bazi/exchange/_doc/260709_fan_clarification_pack.md` — the live question ledger.
   **The gate is here:** r7 §J Q45–Q46, Q47 十神雙讀 (awaiting written confirmation), and
   Q37–Q44 (drafted in `../../bazi/teaching/_doc/260904_reading_0903_case_jia_analysis.md` §6,
   not yet pasted).
4. `../destinyai-backend/src/fortune_backend/engine/` — the port source. Start at
   `model.py`, `annual.py` (TEN_GOD_SHORT = the canon labels), then `fan_rules.py`.
5. `../destinyai-frontend/components/FanChart.tsx` + `../destinyai-frontend/components/fan/chart-parts.tsx` —
   the annotation-label rendering to LIFT, not rewrite.

## State as of 2026-09-08

**Not blocked technically. Blocked deliberately.** Renamed from `fortune_app_js` and
un-retired today; `status: stale`, public, Pages live at
<https://walterwong.github.io/bazi-standalone/>. `tsc` clean · 3 tests pass · build clean.

Shipped today: 107 Simplified→Traditional conversions across the data tables (the app
declares zh-Hant and its whole output is a prompt, so it had been emitting Simplified
十神 into prompts). `杀` was **deliberately kept** Simplified — that is what she writes
for 七殺, so converting it would diverge from her. See `CLAUDE.md` § Catching up.

## The next step

**Do not start the port yet.** The gate is her canon settling, not our readiness.

When it settles, the order is:

1. **Port the deterministic chart layer first** — pillars, 藏干, 十神, marks, 大運/流年.
   That is the part her rulings rarely move. `~4,270` lines of engine, excluding
   `ziwei.py` and `curve.py`.
2. **Lift the render components** from `destinyai-frontend` rather than rewriting them.
   Both apps are Next.js + React + shadcn; they drop in.
3. **Port the prompt logic last** (~1,500 lines; its other ~490 lines are template prose
   you paste over).

Build a **differential oracle** as you go: `destinyai-backend` has 331 tests and
`tests/fixtures/`, so generate expected outputs for a batch of charts and diff the TS
against them. Keep 姨姨's own externally-produced chart as a **completeness** fixture too —
an oracle diff only ever covers what you already emit.

If you would rather not wait for the canon: port only the deterministic chart layer (step 1),
which is stable, and leave 喜忌/格局 judgment to the paste-into-an-LLM step this app is
built around.
