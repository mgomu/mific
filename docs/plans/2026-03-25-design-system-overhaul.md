# Design System Overhaul — "The Digital Architect"

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align the entire MiFIC application with the reference design system from the Stitch document — new color palette, dual-font typography (Manrope + Inter), tighter border radii, No-Line rule, glassmorphism nav, and editorial hierarchy.

**Architecture:** Update the design tokens (tailwind.config.ts, globals.css, layout.tsx) first, then cascade changes through every component and page. No logic changes — purely visual/CSS updates. Each task is one file or a tight group of related files.

**Tech Stack:** Next.js 15, Tailwind CSS, Google Fonts (Manrope + Inter), Recharts

**Reference files:**
- Design system doc: `/Users/manuelgomu/Downloads/stitch_text_document/DESIGN.md`
- Reference HTML: `/Users/manuelgomu/Downloads/stitch_text_document/code.html`
- Reference screenshot: `/Users/manuelgomu/Downloads/stitch_text_document/screen.png`

---

## Key Design Deltas (Current → Target)

| Token | Current | Target |
|-------|---------|--------|
| primary | #1E3A8A | #00236f |
| primary-container | #2563EB | #1e3a8a |
| secondary | #0D9488 | #006a61 |
| secondary-container | — | #86f2e4 |
| surface | #F8FAFC | #f7f9fb |
| surface-container-low | #F1F5F9 | #f2f4f6 |
| surface-container-high | #CBD5E1 | #e6e8ea |
| surface-container-highest | #B8C4D4 | #e0e3e5 |
| surface-container | #E2E8F0 | #eceef0 |
| on-surface | #0F172A | #191c1e |
| on-surface-variant | #475569 | #444651 |
| outline-variant | #CBD5E1 | #c5c5d3 |
| borderRadius DEFAULT | 0.5rem | 0.25rem |
| borderRadius lg | 1rem | 0.5rem |
| borderRadius xl | 1.5rem | 0.75rem |
| Font headline | Inter | Manrope |
| Font body | Inter | Inter |

### Design Rules
1. **No-Line Rule:** No 1px solid borders for sectioning. Use bg color shifts instead.
2. **Glass & Gradient:** Nav uses bg-white/70 + backdrop-blur-xl. Primary CTAs use gradient from primary to primary-container at 135°.
3. **Ambient Shadows:** 24px blur, 4% opacity, tinted with primary (#00236f).
4. **Ghost Border:** outline-variant at 15% opacity only for accessibility in tables.
5. **Forbid Dividers:** No lines between list/table items. Use spacing or alternating bg tones.
6. **Surface stacking:** lowest (white) on low (light gray) creates "natural lift."

---

### Task 1: Update Design Tokens — tailwind.config.ts

**Files:**
- Modify: `tailwind.config.ts`

**What to change:**
- Update ALL color values to match the reference palette
- Add missing tokens: `secondary-container`, `on-secondary-container`, `primary-fixed-dim`, `tertiary-fixed-dim`, `surface-variant`, `surface-tint`, `surface-dim`, `surface-bright`, `inverse-*` tokens, etc.
- Update `borderRadius`: DEFAULT → 0.25rem, lg → 0.5rem, xl → 0.75rem
- Update `fontFamily`: add `headline: ["Manrope", "sans-serif"]`, keep body/label as Inter
- Update `boxShadow.ambient` to use new primary (#00236f) tint

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "sans-serif"],
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        label: ["Inter", "system-ui", "sans-serif"],
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
        background: "#f7f9fb",
        "on-background": "#191c1e",
        chart: {
          1: "#00236f",
          2: "#006a61",
          3: "#6e2c00",
          4: "#F59E0B",
          5: "#EF4444",
        },
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
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

**Step 1:** Replace the entire tailwind.config.ts with the code above.
**Step 2:** Run `npx next build --no-lint` to verify no build errors. Expected: successful build.
**Step 3:** Commit: `feat: update design tokens to Digital Architect palette`

---

### Task 2: Update Fonts & Global CSS — layout.tsx + globals.css

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**layout.tsx changes:**
- Import Manrope from next/font/google alongside Inter
- Add both font variables to body class
- Use Manrope variable for --font-display/--font-headline

```tsx
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "MiFIC — Fondos de Inversión Colectiva en Colombia",
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
      <body className={`${inter.variable} ${manrope.variable} ${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
```

**globals.css changes:**
- Update @theme to include --font-headline
- Update body bg/color to match new tokens
- Add font-headline utility

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-display: "Manrope", sans-serif;
  --font-headline: "Manrope", sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-label: "Inter", system-ui, sans-serif;
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

**Step 1:** Update layout.tsx and globals.css as shown.
**Step 2:** Run dev server and verify fonts load. Manrope should render for `font-headline`/`font-display` classes.
**Step 3:** Commit: `feat: add Manrope headline font and update global styles`

---

### Task 3: Update Header — Glassmorphism Nav

**Files:**
- Modify: `src/components/header.tsx`

**Changes:**
- Nav: `bg-surface/80` → `bg-white/70 backdrop-blur-xl` (glassmorphism)
- Remove `shadow-ambient-up`, the glass effect is sufficient
- Logo: use `font-headline` class
- Active nav link: add `border-b-2 border-primary pb-1` for the active indicator
- Search input: remove `border border-outline-variant/20`, use `bg-surface-container-low border-none`
- Compare button: keep gradient but use `rounded-lg` instead of `rounded-full`
- Add notification + account buttons from reference (Material Symbols: notifications, account_circle)
- Add `border-l border-outline-variant/15` divider before icons (using ghost border, not solid line)

**Key classes for nav:**
```
className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl"
```

**Step 1:** Update header.tsx with glassmorphism nav, font-headline on logo, border-b indicator on active link, ghost border divider.
**Step 2:** Visual check in browser.
**Step 3:** Commit: `feat: glassmorphism nav with editorial hierarchy`

---

### Task 4: Update Fund Type Sidebar

**Files:**
- Modify: `src/components/fund-type-sidebar.tsx`

**Changes:**
- Sidebar bg: `bg-surface-container-low` → `bg-surface-container-low` (stays, but verify with new tokens)
- "Filtros" heading: add `font-headline` class
- Selected item: remove `border-l-2 border-primary` (No-Line rule). Use `bg-surface-container-lowest text-primary shadow-ambient font-bold` only.
- Hover state: `hover:bg-surface-container-high` stays
- Remove the divider (`border-t border-slate-200`) from the subtype section — use `mt-6 pt-6` spacing only
- "Reset Filters" button at bottom: `border border-primary/10 rounded-lg` (ghost border acceptable for buttons)

**Step 1:** Update fund-type-sidebar.tsx — remove border-l from selected state, add font-headline to heading, remove divider lines.
**Step 2:** Visual check.
**Step 3:** Commit: `feat: sidebar follows No-Line rule`

---

### Task 5: Update Ranking Table

**Files:**
- Modify: `src/components/ranking-table.tsx`

**Changes:**
- Table header row: `bg-surface-container-low` (already matches)
- Remove `border-collapse` dividers — the reference uses `hover:bg-surface-container-low/50` transitions and alternating row backgrounds without `divide-y`
- Row alternation: already has `idx % 2` logic, keep it
- Fund name: use `font-headline` or at least `font-bold text-primary`
- Fund subtype text under name (like "Equity · Abierto" in reference): add `<span className="text-[11px] text-on-surface-variant">{subtype} · {type}</span>` under name
- Admin avatar: keep the circle initial avatar
- Profitability column: use `text-secondary` for positive (reference uses secondary/teal for growth), `text-error` for negative
- Remove any visible divider lines between rows — rely on alternating bg only

**Step 1:** Update ranking-table.tsx: remove dividers, add subtype under name, use secondary for positive returns.
**Step 2:** Visual check.
**Step 3:** Commit: `feat: ranking table with No-Line rule and editorial type`

---

### Task 6: Update Ranking Page — Add Bento Stat Cards + Page Header

**Files:**
- Modify: `src/app/ranking-client.tsx`
- Modify: `src/app/page.tsx` (if header/footer changes needed)

**Changes:**
- Add page header section before the table:
  ```tsx
  <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div>
      <h1 className="font-headline text-4xl font-extrabold text-primary tracking-tight">
        Ranking de Fondos de Inversión
      </h1>
      <p className="text-on-surface-variant mt-2 max-w-xl">
        Compara el rendimiento de los principales FICs de Colombia con transparencia de datos en tiempo real.
      </p>
    </div>
    <div className="flex gap-2">
      <div className="bg-surface-container px-4 py-2 rounded-lg flex items-center gap-2 border-none">
        <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
        <span className="text-sm font-semibold text-primary">{fechaCorte}</span>
      </div>
    </div>
  </header>
  ```
- Add 3 bento stat cards (from reference) before the ranking table:
  - "Top Performing Type" card (white bg, secondary accent)
  - "Total Indexed Funds" card (white bg, primary accent)
  - "Market Sentiment" or data availability card (primary bg, white text)
- Table card: add header bar with "Ranking de Fondos" + "LIVE" badge + sort/filter icons
- "Load More" button: match reference style

**Step 1:** Add header, bento cards, and table header to ranking-client.tsx.
**Step 2:** Visual check against reference screenshot.
**Step 3:** Commit: `feat: ranking page bento cards and editorial header`

---

### Task 7: Update Comparison Bar

**Files:**
- Modify: `src/components/comparison-bar.tsx`

**Changes:**
- Match the reference "Comparison Float" bar: `rounded-full` shape, `bg-white/80 backdrop-blur-xl`, `shadow-2xl`, `border border-primary-fixed/10`
- Fund pill avatars: show as overlapping circles with `?` placeholder or initials
- "Compare Now" button inside the bar
- Position: `fixed bottom-6 left-1/2 -translate-x-1/2`

**Step 1:** Update comparison-bar.tsx to match reference float bar.
**Step 2:** Visual check.
**Step 3:** Commit: `feat: comparison float bar with glassmorphism`

---

### Task 8: Update Fund Detail Page

**Files:**
- Modify: `src/app/fondo/[codigoNegocio]/detail-client.tsx`

**Changes:**
- Page header: Use `font-headline` for fund name
- "Invertir ahora" CTA: gradient from primary to primary-container at 135°
- Metric cards: ensure they use new surface tokens, no borders
- Info sidebar: `bg-surface-container-high` → verify with new token values, no borders
- Floating compare button: match new primary color
- Inline styles with old hex values (#1E3A8A, #0D9488, etc.) → update to new hex values (#00236f, #006a61, etc.)
- All `font-display` → `font-headline` for consistency

**Step 1:** Update detail-client.tsx with new fonts, colors, and no-line styling.
**Step 2:** Visual check.
**Step 3:** Commit: `feat: detail page with Digital Architect tokens`

---

### Task 9: Update History Chart

**Files:**
- Modify: `src/components/history-chart.tsx`

**Changes:**
- Chart stroke: `#1E3A8A` → `#00236f`
- Area gradient: `#0D9488` → `#006a61`
- Toggle buttons: use `font-headline` or keep Inter but update active state to match new tokens
- Card: `shadow-sm` → `shadow-ambient`
- Period toggle: pill-style buttons matching reference
- Title: `font-headline` class

**Step 1:** Update history-chart.tsx colors and styling.
**Step 2:** Visual check.
**Step 3:** Commit: `feat: history chart with updated palette`

---

### Task 10: Update Comparison Page Components

**Files:**
- Modify: `src/components/comparison-chart.tsx`
- Modify: `src/components/comparison-table.tsx`
- Modify: `src/components/fund-search-modal.tsx`
- Modify: `src/app/comparar/comparar-client.tsx`

**Changes:**
- comparison-chart.tsx: Update hardcoded colors (#434655 → #444651, #e9edff → use outline-variant/15), tooltip shadow to use new primary tint
- comparison-table.tsx: Remove `divide-y divide-surface-container` (No-Line rule). Use alternating row bg or spacing. Update `border-b border-surface-container` to just spacing.
- fund-search-modal.tsx: Modal bg → `bg-surface-container-lowest`, input use `bg-surface-container-low border-none`, rounded-xl. No border on input — use focus ring only.
- comparar-client.tsx: Update page header to use `font-headline`, update inline style hex values, match float bar styling.

**Step 1:** Update all four files.
**Step 2:** Visual check on /comparar page.
**Step 3:** Commit: `feat: comparison page with Digital Architect styling`

---

### Task 11: Update Chart Colors Constant

**Files:**
- Modify: `src/lib/chart-colors.ts`

**Changes:**
- Update to match new palette:
```typescript
export const CHART_COLORS = ["#00236f", "#006a61", "#6e2c00", "#F59E0B", "#EF4444"];
```

**Step 1:** Update chart-colors.ts.
**Step 2:** Commit: `feat: chart colors match new palette`

---

### Task 12: Update Remaining Small Components

**Files:**
- Modify: `src/components/fund-type-badge.tsx` — verify tokens still resolve correctly with new palette
- Modify: `src/components/profitability-indicator.tsx` — use `text-secondary` for positive (not tertiary, since secondary=#006a61 is the growth color per DESIGN.md)
- Modify: `src/components/metric-card.tsx` — verify shadow tokens
- Modify: `src/components/footer.tsx` — use `font-headline` for logo, verify bg tokens

**Step 1:** Update all four files.
**Step 2:** Visual check.
**Step 3:** Commit: `feat: small components follow updated design system`

---

### Task 13: Update Error & 404 Pages

**Files:**
- Modify: `src/app/error.tsx`
- Modify: `src/app/not-found.tsx`

**Changes:**
- Use `font-headline` for headings
- Button styling: gradient CTA or ghost button matching new tokens
- Verify colors

**Step 1:** Update error.tsx and not-found.tsx.
**Step 2:** Commit: `feat: error pages match design system`

---

### Task 14: Final Visual QA Pass

**Step 1:** Run `npm run dev` and check all three pages:
- `/` (Ranking)
- `/fondo/[any-code]` (Detail)
- `/comparar?ids=code1,code2` (Comparison)

**Step 2:** Verify:
- [ ] No 1px borders used for sectioning
- [ ] Glassmorphism nav renders correctly
- [ ] Manrope renders for all headlines/titles
- [ ] Primary color is deep navy #00236f everywhere
- [ ] Secondary teal #006a61 used for positive growth
- [ ] Surface layering creates natural lift (white cards on light gray)
- [ ] Ambient shadows use primary tint
- [ ] No hardcoded old hex values remain (#1E3A8A, #0D9488, #0F172A, #475569 in inline styles)

**Step 3:** Fix any remaining issues found.
**Step 4:** Commit: `chore: final visual QA pass`
