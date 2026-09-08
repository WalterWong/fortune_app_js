# DestinyAI TypeScript — BaZi Fortune Calculator

> **`bazi-standalone`** — the **no-backend** BaZi app. Computes the chart in the browser,
> renders the template and annotation labels, and **prepares a prompt** you paste into
> ChatGPT / Claude / Gemini yourself. It is *not* a JS port of `destinyai-backend` and *not* a
> cut-down `destinyai-frontend` — those two are one paired product; this is independent and
> shares only the BaZi domain. Renamed from `fortune_app_js` on 2026-09-08, because that name
> implied otherwise. **Status: behind, not broken** — see `CLAUDE.md` § Catching up.


A pure client-side TypeScript implementation of BaZi (八字) fortune-telling calculations. All calculations run in the browser — no backend required. Deployable to GitHub Pages. Bilingual UI (中/EN) with an in-built LLM prompt builder that targets ChatGPT, Claude, Gemini, or any other LLM.

## Features

- **Client-side BaZi calculation** via `lunar-typescript` — no network calls
- **Four Pillars (四柱)** with hidden stems and NaYin
- **Ten Deities (十神)** complete map
- **Five Elements (五行)** weighted scoring + favorable / unfavorable analysis
- **DaYun (大運)** 10-year cycles with both age range and calendar year range
- **LiuNian (流年)** 7-year window (previous year + current + next 5)
- **Bilingual UI** with a 中/EN segmented toggle (persists across reloads)
- **LLM prompt builder** with separate ZH/EN templates; BaZi characters preserved in both
- **shadcn/ui** primitives shared with the sibling `destinyai-frontend` app

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → /out
npm run lint
npm test           # vitest
npx serve out      # preview the static build
```

## Project Structure

```
bazi-standalone/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # wraps tree in LocaleProvider
│   │   ├── page.tsx                # main UI + 中/EN toggle + result panels
│   │   └── globals.css             # shadcn token set (light + dark)
│   ├── components/
│   │   ├── ui/                     # shadcn primitives (button, card, input, label, select)
│   │   ├── BirthInput.tsx          # react-hook-form + zod form
│   │   ├── BaziChart.tsx           # four pillars panel
│   │   ├── ElementChart.tsx        # five-element distribution
│   │   ├── DayunTimeline.tsx       # 10-cycle grid (age range + calendar years)
│   │   ├── LiunianList.tsx         # 7-year strip (prev/current/next 5)
│   │   ├── ElementLegend.tsx       # 五行 color legend
│   │   └── PromptViewer.tsx        # collapsible system/user prompt + copy buttons
│   └── lib/
│       ├── bazi/
│       │   ├── types.ts            # DaYunCycle carries startYear/endYear
│       │   ├── ganzhi.ts           # stems, branches (do not modify)
│       │   ├── data.ts             # NaYin, relationships (do not modify)
│       │   ├── tenDeities.ts       # ten deities (do not modify)
│       │   ├── elements.ts         # five-element scoring + color helpers
│       │   ├── strength.ts         # day master 强/弱
│       │   ├── calculator.ts       # main calculation engine
│       │   └── index.ts            # barrel
│       ├── prompts/
│       │   ├── builder.ts          # buildInitialPrompt / buildLuckScalePrompt (locale-aware)
│       │   └── index.ts
│       ├── i18n/
│       │   ├── strings.ts          # ~50 UI keys × { zh, en }
│       │   └── context.tsx         # LocaleProvider + useLocale (localStorage-backed)
│       └── utils.ts                # cn() helper
├── tests/
│   └── calculator.test.ts          # vitest round-trip
├── vitest.config.ts
├── components.json                 # shadcn config
├── .github/workflows/deploy.yml    # GitHub Pages deployment
├── next.config.ts
└── package.json
```

## How It Works

1. **Input** — user enters birth date, time (optional), gender.
2. **Calculate** — BaZi runs entirely in the browser.
3. **Display** — four pillars, element distribution, dayun (with calendar years), 7-year liunian, branch relationships.
4. **Prompts** — system + user prompts generated in the active locale (中 or EN), embedded BaZi characters always Chinese.
5. **Hand off** — copy the prompt into ChatGPT, Claude, Gemini, or any other LLM.

## i18n

- Default language: 中 (Traditional Chinese). Toggle via the `中 | EN` segmented control top-right.
- BaZi-specific characters (天干 / 地支 / 納音 / 十神 / 五行 / ganzhi) stay in Chinese in both languages — only chrome translates.
- Locale persists via `localStorage["destinyai.locale"]`.
- Prompt templates (`src/lib/prompts/builder.ts`) have full ZH and EN versions; data tables embed Chinese symbols verbatim.

## GitHub Pages Deployment

### Automatic (GitHub Actions)

1. Push to GitHub.
2. Settings → Pages → Source = "GitHub Actions".
3. Pushes to `main` auto-deploy.
4. Access at `https://<username>.github.io/bazi-standalone`.

### Manual

```bash
npm run build
# Upload contents of ./out to any static host
```

### Base Path

Configured in `next.config.ts`:

```ts
basePath: process.env.NODE_ENV === "production" ? "/bazi-standalone" : "",
```

Change `/bazi-standalone` to match your repository name.

## Key Dependencies

| Package | Purpose |
|---------|---------|
| next, react, react-dom | App framework |
| typescript | Strict types |
| tailwindcss + tw-animate-css | Styling |
| @radix-ui/react-{label,select,slot} | shadcn primitives' underlying Radix layer |
| class-variance-authority, clsx, tailwind-merge | shadcn className tooling |
| lucide-react | Icons |
| react-hook-form + zod + @hookform/resolvers | Form validation |
| recharts | Chart lib (reserved for future luck-scale viz) |
| lunar-typescript | Solar ↔ Lunar conversion + ganzhi extraction |
| vitest, @vitest/coverage-v8 | Tests (dev) |

## API Reference

### calculateBaZi

```typescript
import { calculateBaZi } from "@/lib/bazi";

const result = calculateBaZi(
  "1990-01-15",  // birthday (YYYY-MM-DD)
  "12:00",       // birthTime (HH:MM, optional, defaults to 12:00)
  "男"           // gender ("男" | "女")
);
```

### buildInitialPrompt

```typescript
import { buildInitialPrompt } from "@/lib/prompts";

const { systemPrompt, userPrompt } = buildInitialPrompt(
  baziResult,
  gender,
  birthday,
  /* includeClassical */ false,
  /* locale */ "en"          // or "zh"
);
```

Copy `systemPrompt` + `userPrompt` to your LLM of choice.

## Testing

```bash
npm test           # vitest run
npm run lint       # eslint .
npm run build      # static-export build (also type-checks)
```

## Credits

- Calendar calculations: [lunar-typescript](https://github.com/6tail/lunar-typescript)
- UI primitives: [shadcn/ui](https://ui.shadcn.com/)
- Based on traditional BaZi (八字) Chinese metaphysics; ported from the Python `destinyai-backend` backend (was `fortune_app`).

## License

MIT
