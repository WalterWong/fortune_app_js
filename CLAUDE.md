# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

DestinyAI TypeScript is a pure client-side BaZi (八字) fortune-telling application. All calculations run in the browser using `lunar-typescript`. The app generates prompts that users copy to ChatGPT/Claude for interpretation.

**Key Principle**: No backend. Everything runs client-side. Deployable to GitHub Pages as static files.

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build (static export)
npm run build

# Preview static build
npx serve out

# Lint
npm run lint
```

## Architecture

```
Browser Only (No Backend)
├── BaZi Calculator (lunar-typescript)
├── Prompt Builder (generates LLM prompts)
├── UI Components (React + Tailwind)
└── Static Export → GitHub Pages
```

## Key Files

| Purpose | File | Notes |
|---------|------|-------|
| Main Calculator | `src/lib/bazi/calculator.ts` | Uses lunar-typescript |
| Core Constants | `src/lib/bazi/ganzhi.ts` | Stems, branches, elements |
| Relationships | `src/lib/bazi/data.ts` | NaYin, 冲/合/刑/害/破 |
| Ten Deities | `src/lib/bazi/tenDeities.ts` | 十神 mapping |
| Element Scoring | `src/lib/bazi/elements.ts` | Weighted hidden stems |
| Strength | `src/lib/bazi/strength.ts` | Day master 强/弱 |
| Prompt Builder | `src/lib/prompts/builder.ts` | System + user prompts |
| Main Page | `src/app/page.tsx` | Input → Results flow |
| Deployment | `.github/workflows/deploy.yml` | GitHub Pages |

## Type System

All BaZi data has strict TypeScript types in `src/lib/bazi/types.ts`:

- `Element`: "木" | "火" | "土" | "金" | "水"
- `Gan`: Heavenly Stems (10)
- `Zhi`: Earthly Branches (12)
- `Pillar`: { gan, zhi, ganzhi, nayin, element, hiddenStems }
- `BaZiResult`: Complete calculation output
- `DaYunCycle`: 10-year luck period
- `LiuNian`: Yearly fortune

## Calculation Flow

1. Parse birth date/time/gender
2. Convert Solar → Lunar using `lunar-typescript`
3. Extract four pillars (Year/Month/Day/Hour)
4. Calculate hidden stems with weights
5. Derive ten deities from day master
6. Score five elements
7. Assess day master strength
8. Calculate DaYun (大運) cycles
9. Generate LiuNian (流年) list
10. Detect branch relationships

## Important Notes

### lunar-typescript API
```typescript
import { Solar, Lunar } from "lunar-typescript";

const solar = Solar.fromYmd(year, month, day);
const lunar = solar.getLunar();
const eightChar = lunar.getEightChar();

// Get pillars
eightChar.getYearGan()   // 年干
eightChar.getMonthZhi()  // 月支
eightChar.getDayGanZhi() // 日柱

// DaYun (gender: 1=male, 0=female)
const yun = eightChar.getYun(gender === "男" ? 1 : 0);
yun.getDaYun() // Array of DaYun cycles
```

### Hidden Stem Weights
- 主氣 (primary): highest weight
- 中氣 (middle): medium weight
- 餘氣 (remaining): lowest weight
- Month branch scores are doubled

### GitHub Pages
- Static export configured in `next.config.ts`
- Base path: `/fortune_app_js` (change if repo name differs)
- Workflow: `.github/workflows/deploy.yml`

## Do NOT Modify

- `src/lib/bazi/ganzhi.ts` - Validated traditional data
- `src/lib/bazi/data.ts` - Validated lookup tables
- `src/lib/bazi/tenDeities.ts` - Traditional ten deity mappings

These files contain traditional Chinese metaphysics data. Only modify if fixing calculation errors.

## Future Enhancements

Optional features not yet implemented:
- Direct LLM API integration (user provides own key)
- Classical texts (sizi.json, yue.json) lazy-loading
- Dark mode
- Multi-language support
