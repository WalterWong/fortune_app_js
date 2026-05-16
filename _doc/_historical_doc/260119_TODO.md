# DestinyAI TypeScript Implementation Plan

> **Status**: Core implementation complete. Ready for GitHub Pages deployment.
>
> See `progress.md` for detailed implementation log.
> See `summary.md` for high-level status overview.

## Phase 1: Project Setup ✅ COMPLETE

### 1.1 Initialize Next.js Project
- [x] Create Next.js 14+ project with TypeScript
  ```bash
  npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
  ```
- [x] Configure TypeScript strict mode
- [x] Configure static export in `next.config.ts`:
  ```javascript
  const nextConfig = {
    output: 'export',
    basePath: '/fortune_app_js', // GitHub repo name
    images: { unoptimized: true },
  }
  ```
- [x] Install dependencies:
  - `lunar-typescript` - Chinese calendar calculations
  - `recharts` - Charts for luck scale
  - `zustand` - State management

### 1.2 Project Structure
```
fortune_app_js/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Main input page
│   │   ├── result/page.tsx    # Results page
│   │   ├── settings/page.tsx  # API key settings (optional)
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── BirthInput.tsx     # Date/time/gender form
│   │   ├── BaziChart.tsx      # Four pillars display
│   │   ├── ElementChart.tsx   # Five elements visualization
│   │   ├── DayunTimeline.tsx  # 大運 display
│   │   ├── LiunianList.tsx    # 流年 display
│   │   ├── LuckScaleChart.tsx # Plotly bar chart
│   │   ├── PromptViewer.tsx   # Debug prompt display
│   │   └── ChatInterface.tsx  # Follow-up chat UI
│   ├── lib/
│   │   ├── bazi/
│   │   │   ├── calculator.ts  # Main calculation logic
│   │   │   ├── ganzhi.ts      # Stems/branches data
│   │   │   ├── data.ts        # NaYin, relationships
│   │   │   ├── tenDeities.ts  # Ten deities logic
│   │   │   ├── elements.ts    # Five elements scoring
│   │   │   ├── dayun.ts       # 大運 calculation
│   │   │   ├── strength.ts    # Day master strength
│   │   │   └── types.ts       # TypeScript interfaces
│   │   └── prompts/
│   │       ├── builder.ts     # Prompt construction
│   │       ├── templates.ts   # Prompt templates
│   │       └── luckScale.ts   # Luck scale prompts
│   ├── data/
│   │   ├── sizi.json          # Classical texts (lazy-loaded)
│   │   └── yue.json           # Monthly analysis (lazy-loaded)
│   └── hooks/
│       └── useBazi.ts         # Custom hook for calculation
├── public/
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## Phase 2: BaZi Data Layer ✅ COMPLETE

### 2.1 Core Constants (`lib/bazi/ganzhi.ts`)
- [x] Define `Gan` array (10 Heavenly Stems)
- [ ] Define `Zhi` array (12 Earthly Branches)
- [ ] Define `GanElement` mapping (stem → element)
- [ ] Define `ZhiElement` mapping (branch → element)
- [ ] Define `hiddenStems` (branch → {stem: weight})
- [ ] Add TypeScript types for all constants

### 2.2 Relationship Data (`lib/bazi/data.ts`)
- [ ] Port `naYin` mapping (60 pillars → NaYin name)
- [ ] Port `branchRelations` (冲/合/刑/害/破)
- [ ] Port `ganCombinations` (天干合)
- [ ] Port `branchCombinations` (地支合)
- [ ] Port `empties` (空亡) mapping

### 2.3 Ten Deities (`lib/bazi/tenDeities.ts`)
- [ ] Port `tenDeities` bidirectional mapping for each day master
- [ ] Create `getTenDeity(dayMaster, target)` function
- [ ] Create `getPositionalStatus(dayMaster, branch)` function
- [ ] Handle hidden stem ten deity calculation

### 2.4 Types Definition (`lib/bazi/types.ts`)
```typescript
// Define all interfaces:
- [ ] Pillar { gan, zhi, ganzhi, nayin, element, hiddenStems }
- [ ] BaZiResult (full calculation result)
- [ ] DaYunCycle { cycle, ageRange, pillar, gan, zhi, element }
- [ ] ElementScores { scores, strongest, weakest, total }
- [ ] Relationships { he, chong, xing, hai, po }
- [ ] TenDeitiesMap (for all pillars + hidden stems)
- [ ] Strength { isWeak, assessment, supportCount, supportScore }
```

---

## Phase 3: BaZi Calculator ✅ COMPLETE

### 3.1 Main Calculator (`lib/bazi/calculator.ts`)
- [ ] Import and configure `lunar-typescript`
- [ ] Create `BaziCalculator` class
- [ ] Implement `calculate(birthday, birthTime?, gender)` method

### 3.2 Calendar Conversion
- [ ] Parse input date string (YYYY-MM-DD)
- [ ] Convert Solar to Lunar using `lunar-typescript`
- [ ] Extract year/month/day/hour GanZhi from library
- [ ] Handle optional birth time (default to 12:00)
- [ ] Map hour to Chinese 时辰 (2-hour periods)

### 3.3 Pillar Extraction
- [ ] Get year pillar (年柱)
- [ ] Get month pillar (月柱)
- [ ] Get day pillar (日柱)
- [ ] Get hour pillar (时柱)
- [ ] Add NaYin for each pillar
- [ ] Add hidden stems for each branch

### 3.4 Relationship Detection
- [ ] Detect 六合 (Six Harmonies)
- [ ] Detect 三合 (Three Harmonies)
- [ ] Detect 六冲 (Six Clashes)
- [ ] Detect 相刑 (Punishments)
- [ ] Detect 相害 (Harms)
- [ ] Detect 相破 (Breaks)

### 3.5 Ten Deities Calculation
- [ ] Calculate ten deity for year stem
- [ ] Calculate ten deity for month stem
- [ ] Calculate ten deity for hour stem
- [ ] Calculate ten deities for all hidden stems
- [ ] Return complete ten deities map

### 3.6 Five Elements Scoring (`lib/bazi/elements.ts`)
- [ ] Heavenly stem scoring (5 points each)
- [ ] Hidden stem weighted scoring
- [ ] Month branch double counting
- [ ] Calculate total per element
- [ ] Determine strongest/weakest elements

### 3.7 Day Master Strength (`lib/bazi/strength.ts`)
- [ ] Count supporting ten deities (比/劫/印/枭)
- [ ] Calculate support score
- [ ] Determine positional status (临官/帝旺/etc.)
- [ ] Apply month influence
- [ ] Return strength assessment (强/弱)

### 3.8 DaYun Calculation (`lib/bazi/dayun.ts`)
- [ ] Determine direction based on year stem parity + gender
- [ ] Calculate 10 cycles (100 years total)
- [ ] Generate pillar for each cycle
- [ ] Include age ranges

### 3.9 LiuNian (Fleeting Years)
- [ ] Get current year GanZhi
- [ ] Generate next 10 years GanZhi
- [ ] Include year numbers

---

## Phase 4: Prompt Builder ✅ COMPLETE

### 4.1 Initial Prompt (`lib/prompts/builder.ts`)
- [ ] Port system prompt template (BaZi expert role)
- [ ] Build user prompt with:
  - [ ] Current year info
  - [ ] Birth information
  - [ ] Four pillars with full details
  - [ ] Day master analysis section
  - [ ] Five element distribution
  - [ ] Branch relationships
  - [ ] Ten deities distribution
  - [ ] DaYun information
  - [ ] LiuNian information
  - [ ] Analysis tasks (9-point framework)
  - [ ] Analysis principles

### 4.2 Classical Texts Integration
- [ ] Create async loader for sizi.json
- [ ] Create async loader for yue.json
- [ ] Function to get classical text by day pillar
- [ ] Function to get monthly analysis
- [ ] Optional inclusion flag (for bundle size)

### 4.3 Luck Scale Prompt (`lib/prompts/luckScale.ts`)
- [ ] Port luck scale system prompt
- [ ] Build user prompt with:
  - [ ] Luck scale definition (0-100)
  - [ ] Three-layer evaluation criteria
  - [ ] User info and current age
  - [ ] Four pillars with elements
  - [ ] Element scores
  - [ ] Current DaYun cycle
  - [ ] Next 11 years LiuNian
  - [ ] JSON output format specification

### 4.4 Chat Prompt
- [ ] Build multi-turn conversation format
- [ ] Include previous reading as context
- [ ] Include conversation history
- [ ] Format for OpenAI message array

---

## Phase 5: UI Components ✅ COMPLETE

### 5.1 Input Page (`app/page.tsx`)
- [ ] Birth date picker (with text input toggle)
- [ ] Birth time input (optional)
- [ ] Gender selection
- [ ] Name input (optional)
- [ ] Debug mode toggle
- [ ] Submit button → navigate to results

### 5.2 BaZi Chart Component (`components/BaziChart.tsx`)
- [ ] Four-column layout (年/月/日/时)
- [ ] Display GanZhi vertically
- [ ] Show element colors
- [ ] Display NaYin
- [ ] Show ten deity labels
- [ ] Hidden stems expansion

### 5.3 Element Distribution (`components/ElementChart.tsx`)
- [ ] Five element bars/progress
- [ ] Score labels
- [ ] Color coding (金白/木绿/水黑/火红/土黄)
- [ ] Strongest/weakest indicators

### 5.4 DaYun Timeline (`components/DayunTimeline.tsx`)
- [ ] 10-cycle grid display
- [ ] Age range labels
- [ ] GanZhi for each cycle
- [ ] Current cycle highlight (based on age)

### 5.5 LiuNian List (`components/LiunianList.tsx`)
- [ ] Current year + next 4/10 years
- [ ] Year number + GanZhi
- [ ] Current year highlight

### 5.6 Luck Scale Chart (`components/LuckScaleChart.tsx`)
- [ ] Plotly.js or Recharts bar chart
- [ ] Color coding:
  - Green (80+): Very fortunate
  - Blue (60-79): Favorable
  - Gray (50-59): Neutral
  - Orange (40-49): Challenging
  - Red (<40): Difficult
- [ ] Year labels on X-axis
- [ ] Score on Y-axis
- [ ] Hover/click for details

### 5.7 Prompt Viewer (`components/PromptViewer.tsx`)
- [ ] Collapsible/expandable section
- [ ] System prompt display
- [ ] User prompt display
- [ ] Copy to clipboard button
- [ ] Syntax highlighting (optional)

### 5.8 Chat Interface (`components/ChatInterface.tsx`)
- [ ] Message list (user/assistant alternating)
- [ ] Input field with send button
- [ ] Loading state
- [ ] Auto-scroll to latest

---

## Phase 6: State Management & Integration ✅ COMPLETE

### 6.1 BaZi Hook (`hooks/useBazi.ts`)
- [ ] Input state (birthday, time, gender, name)
- [ ] Calculated result state
- [ ] Generated prompts state
- [ ] Loading/error states
- [ ] `calculate()` function
- [ ] Persist to sessionStorage (optional)

### 6.2 Results Page (`app/result/page.tsx`)
- [ ] Retrieve calculation from state/URL params
- [ ] Display all components
- [ ] Prompt viewer section (debug mode)
- [ ] Copy prompt buttons
- [ ] "Generate Reading" button (optional LLM integration)

### 6.3 LLM Integration Options

**Mode A: Manual Copy (Default)**
- [ ] "Copy System Prompt" button with clipboard API
- [ ] "Copy User Prompt" button with clipboard API
- [ ] "Copy All" button (combined prompts)
- [ ] Toast notification on successful copy
- [ ] Instructions for pasting into ChatGPT/Claude

**Mode B: Direct API (Optional)**
- [ ] Settings page (`app/settings/page.tsx`)
- [ ] API key input field with show/hide toggle
- [ ] Provider selection (OpenAI, Anthropic, DeepSeek)
- [ ] Save to localStorage with clear warning
- [ ] "Clear API Key" button
- [ ] OpenAI SDK browser bundle integration
- [ ] Loading states during API calls
- [ ] Error handling (invalid key, rate limits, etc.)
- [ ] Display LLM response in UI

---

## Phase 7: Data Conversion Scripts (SKIPPED)

> Skipped: Data was ported directly to TypeScript during Phase 2.

### 7.1 Convert Python Data to JSON/TypeScript
- [ ] Script to convert `sizi.py` → `sizi.json`
- [ ] Script to convert `yue.py` → `yue.json`
- [ ] Script to convert `ganzhi.py` → TypeScript constants
- [ ] Script to convert `datas.py` → TypeScript constants
- [ ] Validate converted data matches original

### 7.2 Data Validation Tests
- [ ] Compare calculation output: Python vs TypeScript
- [ ] Test with 10+ birth dates across date range
- [ ] Verify NaYin mappings
- [ ] Verify ten deity calculations
- [ ] Verify element scoring
- [ ] Verify DaYun calculation direction

---

## Phase 8: Testing & Validation (PENDING)

### 8.1 Unit Tests
- [ ] Test calendar conversion (Solar ↔ Lunar)
- [ ] Test pillar extraction for known dates
- [ ] Test relationship detection
- [ ] Test ten deity calculation
- [ ] Test element scoring
- [ ] Test strength assessment
- [ ] Test DaYun direction logic

### 8.2 Integration Tests
- [ ] Full calculation pipeline test
- [ ] Prompt generation test
- [ ] Compare with Python backend output
- [ ] Edge cases (leap years, midnight, etc.)

### 8.3 UI Tests
- [ ] Input validation
- [ ] Date picker functionality
- [ ] Results display
- [ ] Responsive design

---

## Phase 9: Optimization (PENDING)

### 9.1 Bundle Size
- [ ] Lazy load classical texts (sizi.json, yue.json)
- [ ] Tree-shake unused lunar-typescript features
- [ ] Analyze bundle with `next/bundle-analyzer`
- [ ] Target: <200KB initial JS

### 9.2 Performance
- [ ] Memoize calculation results
- [ ] Optimize re-renders
- [ ] Loading states for async operations

---

## Phase 10: GitHub Pages Deployment ✅ COMPLETE

### 10.1 Build Configuration
- [x] Verify `next.config.ts` has `output: 'export'`
- [x] Set correct `basePath` (repo name)
- [x] Test static export locally: `npm run build && npx serve out`

### 10.2 GitHub Actions Workflow
- [x] Create `.github/workflows/deploy.yml`:
  ```yaml
  name: Deploy to GitHub Pages
  on:
    push:
      branches: [main]
  jobs:
    build-and-deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: '20'
        - run: npm ci
        - run: npm run build
        - uses: peaceiris/actions-gh-pages@v3
          with:
            github_token: ${{ secrets.GITHUB_TOKEN }}
            publish_dir: ./out
  ```
- [x] Enable GitHub Pages in repo settings (use GitHub Actions source)
- [ ] Test deployment (after pushing to GitHub)

### 10.3 Post-Deployment
- [ ] Verify all routes work with basePath
- [ ] Test on mobile browsers
- [ ] Add custom domain (optional)

> **Note**: Deployment workflow created. Push to GitHub and enable Pages to complete.

---

## Implementation Order (Recommended)

1. **Week 1**: Phase 1 + Phase 2 (Setup + Data Layer)
2. **Week 2**: Phase 3 (Calculator Core)
3. **Week 3**: Phase 4 (Prompt Builder)
4. **Week 4**: Phase 5 (UI Components)
5. **Week 5**: Phase 6 + 7 (Integration + Data Scripts)
6. **Week 6**: Phase 8 + 9 + 10 (Testing + Optimization + Deploy)

---

## Key Files to Reference (Python Codebase)

| Purpose | Python File | Notes |
|---------|-------------|-------|
| Calculator | `src/fortune_backend/services/bazi_calculator.py` | Main calculation logic |
| Prompts | `src/fortune_backend/services/prompt_builder.py` | All prompt templates |
| Stems/Branches | `bazi_lib/ganzhi.py` | Core data structures |
| Lookup Tables | `bazi_lib/datas.py` | NaYin, relationships |
| Classical Texts | `bazi_lib/sizi.py` | 三命通會 (~169KB) |
| Monthly Data | `bazi_lib/yue.py` | Monthly analysis (~85KB) |
| Frontend UI | `frontend.py` | Streamlit layout reference |
| API Schemas | `src/fortune_backend/models/schemas.py` | Request/response shapes |

---

## Verification Checklist

Before considering complete, verify:

- [ ] Calculation matches Python for test date: 1990-01-15 12:00 Male
- [ ] Calculation matches Python for test date: 2000-06-30 03:00 Female
- [ ] Calculation matches Python for edge case: 1900-01-31 (lunar year boundary)
- [ ] Generated prompts are character-for-character identical to Python version
- [ ] UI displays all information shown in Streamlit version
- [ ] Bundle size < 300KB (excluding lazy-loaded data)
- [ ] All TypeScript types are strict (no `any`)
- [ ] Copy-to-clipboard works on all browsers
- [ ] Static export builds without errors (`npm run build`)
- [ ] GitHub Pages deployment works
- [ ] All routes work with basePath prefix
