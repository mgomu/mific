# Stitch UI Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update mific's visual design to match the Stitch "Digital Architect" design system (primary #00236f, secondary #006a61, Manrope headlines, no-line rule, glassmorphism nav, surface hierarchy).

**Architecture:** Design token changes cascade top-down: tailwind config → globals → components. No business logic changes. Verification is build passing + no TypeScript errors.

**Tech Stack:** Next.js 16, Tailwind CSS 4, next/font/google, Recharts

**Worktree:** `/Volumes/DATA/Proyectos/mific/.worktrees/stitch-ui-redesign`

---

## Task 1: Design Tokens — tailwind.config.ts + globals.css + layout.tsx

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Step 1: Update tailwind.config.ts**

Replace the entire file with:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#f7f9fb",
          dim: "#d8dadc",
          bright: "#f7f9fb",
          container: {
            DEFAULT: "#eceef0",
            lowest: "#ffffff",
            low: "#f2f4f6",
            high: "#e6e8ea",
            highest: "#e0e3e5",
          },
          variant: "#e0e3e5",
          tint: "#4059aa",
        },
        primary: {
          DEFAULT: "#00236f",
          container: "#1e3a8a",
          fixed: { DEFAULT: "#dce1ff", dim: "#b6c4ff" },
        },
        secondary: {
          DEFAULT: "#006a61",
          container: "#86f2e4",
          fixed: { DEFAULT: "#89f5e7", dim: "#6bd8cb" },
        },
        tertiary: {
          DEFAULT: "#4b1c00",
          container: "#6e2c00",
          fixed: { DEFAULT: "#ffdbcb", dim: "#ffb691" },
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
        "on-surface": {
          DEFAULT: "#191c1e",
          variant: "#444651",
        },
        "on-primary": {
          DEFAULT: "#ffffff",
          container: "#90a8ff",
          fixed: { DEFAULT: "#00164e", variant: "#264191" },
        },
        "on-secondary": {
          DEFAULT: "#ffffff",
          container: "#006f66",
          fixed: { DEFAULT: "#00201d", variant: "#005049" },
        },
        "on-tertiary": {
          DEFAULT: "#ffffff",
          container: "#f39461",
          fixed: { DEFAULT: "#341100", variant: "#773205" },
        },
        "on-error": { DEFAULT: "#ffffff", container: "#93000a" },
        outline: { DEFAULT: "#757682", variant: "#c5c5d3" },
        inverse: {
          surface: "#2d3133",
          "on-surface": "#eff1f3",
          primary: "#b6c4ff",
        },
        chart: {
          1: "#2563eb",
          2: "#7C3AED",
          3: "#F59E0B",
          4: "#10B981",
          5: "#EF4444",
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      boxShadow: {
        ambient: "0 12px 40px rgba(0, 35, 111, 0.06)",
        "ambient-up": "0 -4px 12px rgba(0, 35, 111, 0.08)",
        "ambient-hover": "0 24px 48px rgba(0, 35, 111, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
```

**Step 2: Update globals.css**

Replace with:

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-display: "Manrope", system-ui, sans-serif;
}

body {
  font-family: "Inter", system-ui, sans-serif;
  background-color: #f7f9fb;
  color: #191c1e;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

**Step 3: Update layout.tsx — add Manrope**

Replace with:

```typescript
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-display", weight: ["700", "800"] });

export const metadata: Metadata = {
  title: "mific — Fondos de Inversión Colectiva en Colombia",
  description:
    "Compara fondos de inversión colectiva en Colombia. Ranking, detalle y comparador visual con datos de la Superintendencia Financiera.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${manrope.variable} ${inter.className}`}>{children}</body>
    </html>
  );
}
```

**Step 4: Verify build**

```bash
cd /Volumes/DATA/Proyectos/mific/.worktrees/stitch-ui-redesign && npm run build 2>&1 | tail -15
```

Expected: Build succeeds, 5 pages generated.

**Step 5: Commit**

```bash
git add tailwind.config.ts src/app/globals.css src/app/layout.tsx
git commit -m "feat: update design tokens to Stitch palette + add Manrope font"
```

---

## Task 2: Header — Glassmorphism + Search pill

**Files:**
- Modify: `src/components/header.tsx`

**Step 1: Update header.tsx**

Change line 24 — update `bg-white/80` to `bg-surface-container-lowest/70`:
```
className="fixed top-0 w-full h-16 z-50 bg-surface-container-lowest/70 backdrop-blur-xl shadow-ambient flex items-center justify-center"
```

Change line 40 — search input bg (already correct `surface-container-low`, keep as is).

Change line 52-55 — active nav link: remove `border-b-2 border-primary`, use text color only:
```tsx
<Link
  href="/"
  className="text-primary font-bold py-5"
>
  Explorar
</Link>
```

**Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add src/components/header.tsx
git commit -m "feat: glassmorphism header with Stitch tokens"
```

---

## Task 3: ComparisonBar — Glassmorphism footer, no border-t

**Files:**
- Modify: `src/components/comparison-bar.tsx`

**Step 1: Update comparison-bar.tsx**

Change line 16 — replace `bg-white border-t border-outline-variant/20 shadow-ambient-up` with glassmorphism:
```
className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest/70 backdrop-blur-xl border-t border-primary-fixed/20 shadow-ambient-up z-40 transition-transform"
```

**Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add src/components/comparison-bar.tsx
git commit -m "feat: glassmorphism comparison bar footer"
```

---

## Task 4: RankingTable — No dividers, alternating rows, Manrope fund name

**Files:**
- Modify: `src/components/ranking-table.tsx`

**Step 1: Remove `divide-y` and add alternating rows**

Line 86 — change `<tbody className="divide-y divide-surface-container-low">` to:
```tsx
<tbody>
```

Line 92-93 — add alternating row background:
```tsx
<tr
  key={fund.codigoNegocio}
  className={`hover:bg-surface-container-low transition-colors cursor-pointer group ${
    index % 2 === 0 ? "bg-surface-container-lowest" : "bg-surface"
  }`}
>
```

**Step 2: Apply Manrope to fund name**

Line 108 — add `font-display` to fund name span:
```tsx
<span className="text-sm font-bold font-display text-on-surface group-hover:text-primary transition-colors">
```

**Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 4: Commit**

```bash
git add src/components/ranking-table.tsx
git commit -m "feat: ranking table no-line rule + Manrope fund names"
```

---

## Task 5: FilterBar — Remove border from select pill

**Files:**
- Modify: `src/components/filter-bar.tsx`

**Step 1: Update FilterButton select className**

Line 32 — remove `border border-outline-variant/20`, keep the rest:
```tsx
className="px-5 py-2.5 bg-surface-container-lowest rounded-full text-sm font-medium text-on-surface shadow-sm hover:bg-surface-container-low transition-colors appearance-none cursor-pointer pr-10"
```

**Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add src/components/filter-bar.tsx
git commit -m "feat: filter pills no-line rule"
```

---

## Task 6: MetricCard — Architectural lift, hover shadow

**Files:**
- Modify: `src/components/metric-card.tsx`

**Step 1: Update card style**

Line 15 — remove `shadow-ambient`, add `hover:shadow-ambient-hover transition-shadow`:
```tsx
<div className="bg-surface-container-lowest rounded-xl p-5 hover:shadow-ambient-hover transition-shadow">
```

**Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add src/components/metric-card.tsx
git commit -m "feat: metric card architectural lift with hover shadow"
```

---

## Task 7: ProfitabilityIndicator — secondary/error colors

**Files:**
- Modify: `src/components/profitability-indicator.tsx`

**Step 1: Replace `tertiary-fixed/tertiary` with `secondary-fixed/secondary`**

Line 14-18 — update the positive className:
```tsx
isPositive
  ? "bg-secondary-fixed/30 text-secondary"
  : "bg-error-container text-error"
```

**Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add src/components/profitability-indicator.tsx
git commit -m "feat: profitability indicator uses secondary color"
```

---

## Task 8: FundTypeBadge — Update secondary references

**Files:**
- Modify: `src/components/fund-type-badge.tsx`

**Step 1: Update TYPE_MAP colors to use surface tokens (no secondary purple)**

Replace the TYPE_MAP constant:
```typescript
const TYPE_MAP: Record<string, { label: string; bg: string; text: string }> = {
  general: {
    label: "General",
    bg: "bg-surface-container-high",
    text: "text-on-surface",
  },
  inmobiliario: {
    label: "Inmobiliario",
    bg: "bg-primary-fixed/40",
    text: "text-primary",
  },
  monetario: {
    label: "Mercado Monetario",
    bg: "bg-secondary-fixed/40",
    text: "text-secondary",
  },
  bursátil: {
    label: "Bursátil",
    bg: "bg-tertiary-fixed/40",
    text: "text-on-tertiary-fixed",
  },
};
```

**Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add src/components/fund-type-badge.tsx
git commit -m "feat: fund type badge updated color tokens"
```

---

## Task 9: HistoryChart — secondary gradient fill

**Files:**
- Modify: `src/components/history-chart.tsx`

**Step 1: Update area gradient color**

Lines 100-103 — change `#004ac6` to `#006a61` (secondary):
```tsx
<linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
  <stop offset="5%" stopColor="#006a61" stopOpacity={0.1} />
  <stop offset="95%" stopColor="#006a61" stopOpacity={0} />
</linearGradient>
```

Line 139 — change Area stroke:
```tsx
<Area
  type="monotone"
  dataKey="value"
  stroke="#00236f"
  strokeWidth={2}
  fill="url(#areaGradient)"
/>
```

Line 105 — update CartesianGrid stroke to new outline-variant:
```tsx
<CartesianGrid strokeDasharray="3 3" stroke="#c5c5d3" opacity={0.3} />
```

Lines 107, 113 — update axis tick fill to new on-surface-variant:
```tsx
tick={{ fontSize: 11, fill: "#444651" }}
```

**Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add src/components/history-chart.tsx
git commit -m "feat: history chart secondary gradient + updated stroke colors"
```

---

## Task 10: ComparisonChart — secondary gradient, updated tab style

**Files:**
- Modify: `src/components/comparison-chart.tsx`

**Step 1: Read the full file** to find all hardcoded color references, then update:
- `stroke="#c3c6d7"` → `stroke="#c5c5d3"` (CartesianGrid)
- `fill: "#434655"` → `fill: "#444651"` (axis ticks)
- Tooltip boxShadow: `rgba(20, 27, 43, 0.12)` → `rgba(0, 35, 111, 0.12)`

Run:
```bash
grep -n "c3c6d7\|434655\|141b2b\|004ac6\|20, 27, 43" /Volumes/DATA/Proyectos/mific/.worktrees/stitch-ui-redesign/src/components/comparison-chart.tsx
```

Then update each occurrence found.

**Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add src/components/comparison-chart.tsx
git commit -m "feat: comparison chart updated stroke colors"
```

---

## Task 11: Home Page — Manrope title, remove divider

**Files:**
- Modify: `src/app/ranking-client.tsx`

**Step 1: Read the full file** to find the page title and section headings:
```bash
grep -n "text-3xl\|text-2xl\|font-bold\|font-extrabold\|h1\|h2" /Volumes/DATA/Proyectos/mific/.worktrees/stitch-ui-redesign/src/app/ranking-client.tsx
```

**Step 2:** Add `font-display` to any main title/h1 found.

**Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 4: Commit**

```bash
git add src/app/ranking-client.tsx
git commit -m "feat: home page Manrope title typography"
```

---

## Task 12: Detail Page — Manrope h1, remove divider line, card layout

**Files:**
- Modify: `src/app/fondo/[codigoNegocio]/detail-client.tsx`

**Step 1: Add font-display to h1**

Line 31 — add `font-display`:
```tsx
<h1 className="text-3xl font-extrabold font-display tracking-tight text-on-surface mb-2">
```

**Step 2: Remove the divider line**

Line 52 — remove this line entirely:
```tsx
<div className="h-px bg-outline-variant/20 mb-8" />
```

Replace with just spacing: `<div className="mb-8" />`

**Step 3: Update metric cards section** — wrap the grid in a `bg-surface-container-low` container so cards get the "architectural lift" (white on light gray):
```tsx
<div className="bg-surface-container-low rounded-xl p-6 mb-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* existing metric cards */}
  </div>
</div>
```

**Step 4: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 5: Commit**

```bash
git add src/app/fondo/[codigoNegocio]/detail-client.tsx
git commit -m "feat: detail page Manrope title + architectural lift cards"
```

---

## Task 13: Comparar Page — chip and tab styles

**Files:**
- Modify: `src/app/comparar/comparar-client.tsx`

**Step 1: Read the file** to find fund chip and tab className:
```bash
grep -n "chip\|bg-surface\|border\|rounded" /Volumes/DATA/Proyectos/mific/.worktrees/stitch-ui-redesign/src/app/comparar/comparar-client.tsx | head -30
```

**Step 2:** Update fund selection chips to use `bg-surface-container-high` without border outline.

**Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 4: Commit**

```bash
git add src/app/comparar/comparar-client.tsx
git commit -m "feat: comparar page chip styles updated"
```

---

## Task 14: Final verification

**Step 1: Full build**

```bash
cd /Volumes/DATA/Proyectos/mific/.worktrees/stitch-ui-redesign && npm run build 2>&1
```

Expected: All 5 pages build successfully, 0 TypeScript errors.

**Step 2: Check for any remaining old color hardcodes**

```bash
grep -rn "#004ac6\|#712ae2\|#f9f9ff\|#141b2b\|#434655\|#f1f3ff\|#e1e8fd" src/ --include="*.tsx" --include="*.ts" --include="*.css"
```

Fix any remaining occurrences.

**Step 3: Final commit if any fixes**

```bash
git add -A && git commit -m "fix: remove remaining old color hardcodes"
```
