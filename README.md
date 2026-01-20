# DestinyAI TypeScript - BaZi Fortune Calculator

A pure client-side TypeScript implementation of BaZi (八字) fortune-telling calculations. All calculations run in the browser - no backend required. Deployable to GitHub Pages.

## Features

- **Client-Side BaZi Calculation**: All calculations using `lunar-typescript`
- **Four Pillars (四柱)**: Year, Month, Day, Hour pillars with hidden stems
- **Ten Deities (十神)**: Complete ten deity calculations
- **Five Elements (五行)**: Weighted element scoring with strength analysis
- **DaYun (大運)**: 10-year luck cycle calculation
- **LiuNian (流年)**: Yearly fortune display
- **Prompt Generation**: Ready-to-use prompts for ChatGPT/Claude
- **Static Export**: Deployable to GitHub Pages

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production (static export)
npm run build

# Preview static build locally
npx serve out
```

## Project Structure

```
fortune_app_js/
├── src/
│   ├── app/
│   │   └── page.tsx              # Main application page
│   ├── components/
│   │   ├── BirthInput.tsx        # Birth date/time/gender form
│   │   ├── BaziChart.tsx         # Four pillars display
│   │   ├── ElementChart.tsx      # Five elements bar chart
│   │   ├── DayunTimeline.tsx     # 10-year luck cycles
│   │   ├── LiunianList.tsx       # Yearly fortune list
│   │   └── PromptViewer.tsx      # Prompt display with copy buttons
│   └── lib/
│       ├── bazi/
│       │   ├── types.ts          # TypeScript interfaces
│       │   ├── ganzhi.ts         # Core constants (stems, branches)
│       │   ├── data.ts           # NaYin, relationships
│       │   ├── tenDeities.ts     # Ten deities mapping
│       │   ├── elements.ts       # Element scoring
│       │   ├── strength.ts       # Day master strength
│       │   ├── calculator.ts     # Main calculation engine
│       │   └── index.ts          # Module exports
│       └── prompts/
│           ├── builder.ts        # Prompt construction
│           └── index.ts          # Module exports
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Pages deployment
├── next.config.ts                # Static export configuration
└── package.json
```

## How It Works

1. **Input**: User enters birth date, time (optional), and gender
2. **Calculate**: BaZi calculation runs entirely in the browser
3. **Display**: Results show four pillars, elements, DaYun, LiuNian
4. **Generate Prompts**: Copy system/user prompts for LLM analysis
5. **Use with LLM**: Paste prompts into ChatGPT, Claude, or any AI

## GitHub Pages Deployment

### Option 1: Automatic (GitHub Actions)

1. Push to GitHub repository
2. Go to **Settings > Pages**
3. Set **Source** to "GitHub Actions"
4. Push to `main` branch - deployment runs automatically
5. Access at `https://<username>.github.io/fortune_app_js`

### Option 2: Manual

```bash
npm run build
# Upload contents of ./out to any static hosting
```

## Configuration

### Base Path

If deploying to a subdirectory (e.g., GitHub Pages), the base path is configured in `next.config.ts`:

```typescript
basePath: process.env.NODE_ENV === "production" ? "/fortune_app_js" : "",
```

Change `/fortune_app_js` to match your repository name.

## Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Calendar**: lunar-typescript
- **Charts**: Recharts
- **Build**: Static export for GitHub Pages

## Key Dependencies

| Package | Purpose |
|---------|---------|
| lunar-typescript | Chinese calendar (Solar/Lunar) conversion |
| recharts | Element distribution chart |
| tailwindcss | Styling |

## API Reference

### calculateBaZi

```typescript
import { calculateBaZi } from "@/lib/bazi";

const result = calculateBaZi(
  "1990-01-15",  // birthday (YYYY-MM-DD)
  "12:00",       // birthTime (HH:MM, optional)
  "男"           // gender ("男" or "女")
);

// Returns: BaZiResult with pillars, elements, dayun, etc.
```

### buildInitialPrompt

```typescript
import { buildInitialPrompt } from "@/lib/prompts";

const { systemPrompt, userPrompt } = buildInitialPrompt(
  baziResult,
  gender,
  birthday,
  includeClassicalTexts
);

// Copy prompts to ChatGPT/Claude for interpretation
```

## Development Notes

### Adding New Features

1. BaZi calculations go in `src/lib/bazi/`
2. UI components go in `src/components/`
3. Prompt templates go in `src/lib/prompts/`

### Testing Locally

```bash
npm run dev     # Development with hot reload
npm run build   # Verify production build
npm run lint    # Run ESLint
```

## Credits

- Calendar calculations: [lunar-typescript](https://github.com/6tail/lunar-typescript)
- Based on traditional BaZi (八字) Chinese metaphysics
- Ported from Python backend version

## License

MIT
