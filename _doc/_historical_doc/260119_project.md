# DestinyAI JavaScript/TypeScript Port

## Project Overview

A pure client-side TypeScript port of the DestinyAI BaZi (八字) fortune-telling application. All BaZi calculations and prompt generation happen in the browser using `lunar-typescript`. Deployable as a static site on GitHub Pages.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   Browser (100% Client-Side)                    │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   UI Layer  │  │ BaZi Calc   │  │   Prompt Builder        │ │
│  │  (React)    │  │ (TypeScript)│  │   (TypeScript)          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│         │               │                    │                  │
│         ▼               ▼                    ▼                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              lunar-typescript (Calendar Library)            ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    LLM Integration Options                  ││
│  │  ┌─────────────────┐  ┌─────────────────────────────────┐  ││
│  │  │ Option A:       │  │ Option B:                       │  ││
│  │  │ Copy prompts    │  │ User's own API key              │  ││
│  │  │ to ChatGPT/     │  │ (stored in localStorage)        │  ││
│  │  │ Claude web UI   │  │ Direct calls to OpenAI/etc.     │  ││
│  │  └─────────────────┘  └─────────────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (No backend needed!)
                              ▼
                    ┌─────────────────┐
                    │  GitHub Pages   │
                    │  (Static Host)  │
                    └─────────────────┘
```

## What Runs Where

| Component | Location | Notes |
|-----------|----------|-------|
| BaZi Calculation | Client (Browser) | All math/lookups in browser |
| Prompt Building | Client (Browser) | Constructs full prompts |
| UI Rendering | Client (Browser) | React components |
| LLM Calls | Client (Browser) | User's API key or manual copy |
| API Key Storage | localStorage | User manages their own key |
| Hosting | GitHub Pages | Pure static files, zero cost |

## Core Features

### 1. Client-Side BaZi Calculation
- Solar to Lunar calendar conversion (1900-2100)
- Four Pillars extraction (Year/Month/Day/Hour)
- Hidden stems calculation with weighted scoring
- Ten Deities (十神) derivation
- Five Elements (五行) scoring
- Branch relationships (合/冲/刑/害/破)
- Day master strength assessment
- DaYun (大運) 10-year cycles calculation
- LiuNian (流年) yearly fortune

### 2. Prompt Generation
- System prompts for BaZi expert role
- User prompts with complete calculation data
- Luck scale analysis prompts
- Chat continuation prompts with context
- Classical text integration (optional, lazy-loaded)

### 3. User Interface
- Birth date/time input (supports both picker and text)
- Gender selection
- Real-time BaZi chart display
- Element distribution visualization
- DaYun timeline display
- LiuNian yearly forecast
- Prompt preview (debug mode)
- Chat interface for follow-up questions

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14+ (Static Export) | React with `output: 'export'` |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first CSS |
| Calendar | lunar-typescript | Chinese calendar calculations |
| Charts | Plotly.js or Recharts | Luck scale visualization |
| State | React Context or Zustand | Client state management |
| LLM | OpenAI SDK (browser) | Optional, user provides API key |
| Hosting | GitHub Pages | Free static hosting |

## Data Migration

### From Python bazi_lib/

| Python File | Size | TypeScript Target | Strategy |
|-------------|------|-------------------|----------|
| ganzhi.py | 25KB | `lib/bazi/ganzhi.ts` | Direct port (core mappings) |
| datas.py | 83KB | `lib/bazi/data.ts` | Direct port (lookup tables) |
| sizi.py | 169KB | `data/sizi.json` | JSON, lazy-loaded |
| yue.py | 85KB | `data/yue.json` | JSON, lazy-loaded |

### Key Data Structures to Port

```typescript
// Heavenly Stems
const Gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;

// Earthly Branches
const Zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

// Hidden Stems with weights
const hiddenStems: Record<string, Record<string, number>> = {
  "子": { "癸": 8 },
  "丑": { "己": 5, "癸": 2, "辛": 1 },
  // ...
};

// Ten Deities mapping (per day master)
const tenDeities: Record<string, Record<string, string>> = {
  "甲": { "甲": "比", "乙": "劫", "丙": "食", /* ... */ },
  // ...
};

// Branch relationships
const branchRelations: Record<string, BranchRelation> = {
  "子": { chong: "午", he: ["申", "辰"], hai: "未", po: "酉" },
  // ...
};

// NaYin (纳音)
const naYin: Record<string, string> = {
  "甲子": "海中金",
  "乙丑": "海中金",
  // ...
};
```

## Calculation Output Schema

```typescript
interface BaZiResult {
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };
  dayMaster: string;
  relationships: {
    he: string[];
    chong: string[];
    xing: string[];
    hai: string[];
    po: string[];
  };
  tenDeities: TenDeitiesMap;
  elementScores: {
    scores: Record<Element, number>;
    strongest: Element;
    weakest: Element;
    total: number;
  };
  dayun: DaYunCycle[];
  strength: {
    isWeak: boolean;
    assessment: "强" | "弱";
    supportCount: number;
    supportScore: number;
  };
  favorableElements: Element[];
  unfavorableElements: Element[];
  classicalTexts?: {
    sizi: string;
    monthly: string;
  };
  birthInfo: {
    solarDate: string;
    lunarDate: string;
    gender: string;
  };
}
```

## Scope Boundaries

### In Scope
- All BaZi calculations (client-side, matching Python backend output)
- Prompt generation (client-side, system + user prompts)
- UI components for input and display
- Debug mode for prompt inspection
- Copy-to-clipboard for prompts (use in ChatGPT/Claude)
- Optional: Direct LLM calls with user's own API key
- GitHub Pages deployment

### Out of Scope (Phase 1)
- User authentication/sessions
- Database persistence
- Server-side code
- Mobile app (web-first)

## Key Differences from Python Version

| Aspect | Python Version | TypeScript Version |
|--------|---------------|-------------------|
| Calculation Location | Backend (FastAPI) | Client (Browser) |
| Calendar Library | lunar-python | lunar-typescript |
| State Management | Server sessions + SQLite | Client state (localStorage) |
| LLM Calls | Backend proxied | User's key or manual copy |
| Classical Texts | Bundled in Python | Lazy-loaded JSON |
| Build | uv + uvicorn | npm/pnpm + Next.js static export |
| Server Code | ~2000 LOC | **0 LOC** (pure static) |
| Hosting | Requires server | GitHub Pages (free) |

## Performance Considerations

1. **Bundle Size**: Core bazi lib ~110KB, classical texts ~250KB (lazy-loaded)
2. **Calculation Speed**: All calculations are O(1) lookups, <10ms total
3. **LLM Latency**: Same as before (network dependent)
4. **Initial Load**: Aim for <200KB JS bundle (excluding lazy-loaded data)

## Security Notes

- **No server = no server-side secrets to manage**
- If user provides API key:
  - Stored in browser localStorage (user's responsibility)
  - Never transmitted except to LLM provider directly
  - Clear warning that key is stored locally
- Alternative: User copies prompts to ChatGPT/Claude web UI (no key needed)
- No user data leaves the browser (except optional LLM calls)

## LLM Integration Modes

### Mode 1: Manual Copy (Default, Safest)
1. App generates prompts
2. User clicks "Copy System Prompt" / "Copy User Prompt"
3. User pastes into ChatGPT, Claude, or any LLM interface
4. No API key required

### Mode 2: Direct API (Optional)
1. User enters their own API key in Settings
2. Key stored in localStorage (with clear warning)
3. App calls OpenAI/Anthropic API directly from browser
4. User responsible for their own API costs/security

## Success Criteria

1. BaZi calculation output matches Python version exactly
2. Generated prompts are identical to Python version
3. UI provides similar UX to Streamlit version
4. Page load <3 seconds on 3G connection
5. All calculations complete <100ms client-side
