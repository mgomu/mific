# UI Redesign: Stitch "Digital Architect" Design System

**Date:** 2026-03-24
**Stitch Project:** https://stitch.withgoogle.com/projects/9947634732262141213
**Scope:** Full visual redesign — Home, Comparar, Detalle pages

---

## Creative North Star: "The Digital Architect"

Calm authority over financial data. Intentional white space, editorial typography, tonal surface layering. No line borders for sectioning — boundaries defined through background color shifts.

---

## 1. Design System Tokens

### Colors (`tailwind.config.ts`)

| Token | Value | Replaces |
|-------|-------|---------|
| `primary` | `#00236f` | `#004ac6` |
| `primary-container` | `#1e3a8a` | — |
| `secondary` | `#006a61` | `#712ae2` (purple) |
| `surface` | `#f7f9fb` | `#f9f9ff` |
| `surface-container-lowest` | `#ffffff` | same |
| `surface-container-low` | `#f2f4f6` | `#f1f3ff` |
| `surface-container` | `#eceef0` | — |
| `surface-container-high` | `#e6e8ea` | `#e1e8fd` |
| `on-surface` | `#191c1e` | `#141b2b` |
| `on-surface-variant` | `#444651` | — |
| `outline-variant` | `#c5c5d3` | — |
| `error` | `#ba1a1a` | same |

### Shadows
- Default ambient: `0 12px 40px rgba(0, 35, 111, 0.06)`
- Hover float: `0 24px 48px rgba(0, 35, 111, 0.10)`

### Typography (`layout.tsx` + `tailwind.config.ts`)
- Add `Manrope` (700, 800) via `next/font/google` → `font-display`
- Keep `Inter` as `font-sans`
- Headlines & fund names → `font-display`
- Body & labels → `font-sans`

---

## 2. No-Line Rule

**1px solid borders are prohibited for sectioning.** Use background color shifts instead.
Exception: `outline-variant` at 15% opacity in high-density tables for accessibility.

---

## 3. Component Changes

### Header
- `surface-container-lowest/70` + `backdrop-blur-xl` (glassmorphism)
- Logo in `primary`
- Nav links in `on-surface-variant`, active in `primary`
- Compare button: linear gradient `primary` → `primary-container` at 135°

### Home Page (Ranking)
- Page bg: `surface` (#f7f9fb)
- Title: Manrope `text-3xl font-bold text-on-surface`
- FilterBar: `surface-container-lowest` inputs, `primary` focus underline (no thick outline)
- RankingTable: alternating `surface` / `surface-container-lowest` rows — no dividers
- Fund name: Manrope `font-semibold`; admin: Inter `text-sm text-on-surface-variant`
- Positive returns: `secondary` (#006a61); negative: `error` (#ba1a1a)
- ComparisonBar: `surface-container-lowest/70` + `backdrop-blur`, `primary-fixed` top border at 20% opacity

### Comparar Page
- Metric tabs: underline active indicator in `primary`, no borders
- Fund chips: `surface-container-high` bg, no outline
- Chart fill gradient: `secondary` at 10%→0%

### Detalle Page
- Metric cards: `surface-container-lowest` on `surface-container-low` bg (architectural lift, no default shadow)
- Card hover: ambient shadow tinted with `primary`
- Fund name: Manrope `text-3xl font-bold`
- Area chart fill: `secondary` gradient 10%→0%

---

## 4. Files to Change

1. `tailwind.config.ts` — color tokens + font family
2. `src/app/layout.tsx` — add Manrope font
3. `src/app/globals.css` — base styles update
4. `src/components/header.tsx` — glassmorphism + gradient CTA
5. `src/components/ranking-table.tsx` — no dividers, alternating rows, Manrope fund names
6. `src/components/filter-bar.tsx` — input style update
7. `src/components/comparison-bar.tsx` — glassmorphism footer
8. `src/components/metric-card.tsx` — architectural lift style
9. `src/components/profitability-indicator.tsx` — secondary/error colors
10. `src/components/fund-type-badge.tsx` — surface-container-high style
11. `src/components/comparison-chart.tsx` — tab style, chart fill
12. `src/components/history-chart.tsx` — area fill gradient
13. `src/app/page.tsx` / `ranking-client.tsx` — title typography
14. `src/app/comparar/comparar-client.tsx` — chip & tab styles
15. `src/app/fondo/[codigoNegocio]/detail-client.tsx` — fund name + card layout
