# Design System: mific — The Financial Architect (The Digital Curator)

## Direction
**Creative North Star:** "The Digital Curator" — elite investment boutique aesthetic. Serene, high-end editorial experience. Authoritative yet breathable, like a premium financial journal.

**Key Principles:**
- Intentional Asymmetry: wide margins, off-center alignments to guide the eye
- Tonal Depth: replace borders with soft color transitions (The "No-Line" Rule)
- Layered Surfaces: stack surfaces like sheets of paper, not assembled boxes

---

## Foundation
- **Mode:** Light
- **Color Variant:** Fidelity
- **Spacing Scale:** 3 (multiplier)
- **Roundness:** ROUND_EIGHT (8px base)
- **Fonts:** Inter (all — display, headline, body, label)

---

## Color Tokens

### Primary Palette
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | #004ac6 | "Executive Blue" — main actions, focus points |
| `primary_container` | #2563eb | Gradient end for CTAs |
| `on_primary` | #ffffff | Text on primary |
| `on_primary_container` | #eeefff | Text on primary container |
| `primary_fixed` | #dbe1ff | Chip backgrounds (Mercado Monetario) |
| `primary_fixed_dim` | #b4c5ff | Hover chip state |
| `on_primary_fixed` | #00174b | Text on primary fixed |
| `on_primary_fixed_variant` | #003ea8 | |
| `inverse_primary` | #b4c5ff | |

### Secondary Palette
| Token | Value | Usage |
|-------|-------|-------|
| `secondary` | #712ae2 | "Insight Purple" — unique fund data, premium insights |
| `secondary_container` | #8a4cfc | |
| `on_secondary` | #ffffff | |
| `on_secondary_container` | #fffbff | |
| `secondary_fixed` | #eaddff | Chip backgrounds (Inmobiliario) |
| `secondary_fixed_dim` | #d2bbff | |
| `on_secondary_fixed` | #25005a | Text on secondary fixed |
| `on_secondary_fixed_variant` | #5a00c6 | |

### Tertiary Palette
| Token | Value | Usage |
|-------|-------|-------|
| `tertiary` | #006242 | "Growth Green" — positive performance, profitability |
| `tertiary_container` | #007d55 | |
| `on_tertiary` | #ffffff | |
| `on_tertiary_container` | #bdffdb | |
| `tertiary_fixed` | #6ffbbe | Chip backgrounds (Bursátil), positive indicator bg |
| `tertiary_fixed_dim` | #4edea3 | |
| `on_tertiary_fixed` | #002113 | |
| `on_tertiary_fixed_variant` | #005236 | |

### Surface Hierarchy (stacked low → high)
| Token | Value | Level |
|-------|-------|-------|
| `surface` | #f9f9ff | Base page background |
| `surface_container_low` | #f1f3ff | Page sections |
| `surface_container` | #e9edff | Default containers |
| `surface_container_high` | #e1e8fd | Utility sidebars, chip backgrounds |
| `surface_container_highest` | #dce2f7 | In-card highlights |
| `surface_container_lowest` | #ffffff | Active content cards (highest priority) |
| `surface_dim` | #d3daef | Dimmed state |
| `surface_bright` | #f9f9ff | |
| `surface_tint` | #0053db | |
| `surface_variant` | #dce2f7 | |
| `background` | #f9f9ff | |

### On-Surface
| Token | Value | Usage |
|-------|-------|-------|
| `on_surface` | #141b2b | Primary text (never use pure black #000) |
| `on_surface_variant` | #434655 | Secondary metadata, body descriptions |
| `on_background` | #141b2b | |
| `inverse_surface` | #293040 | |
| `inverse_on_surface` | #edf0ff | |

### Semantic
| Token | Value | Usage |
|-------|-------|-------|
| `error` | #ba1a1a | Losses, negative indicators |
| `error_container` | #ffdad6 | Negative indicator chip background |
| `on_error` | #ffffff | |
| `on_error_container` | #93000a | |
| `outline` | #737686 | Ghost borders at low opacity only |
| `outline_variant` | #c3c6d7 | Ghost borders at 20% opacity for inputs |

---

## Typography

All text uses **Inter**. Apply `font-variant-numeric: tabular-nums` for ALL monetary and percentage values.

| Scale | Size | Weight | Usage |
|-------|------|--------|-------|
| `display-lg` | 3.5rem | Heavy | Hero portfolio totals |
| `headline-md` | 1.75rem | Bold | Fund names, section titles (editorial voice) |
| `title-md` | 1.125rem | Medium | Card headers |
| `body-md` | 0.875rem | Regular | Descriptions, majority of data points — use `on_surface_variant` |
| `label-sm` | 0.6875rem | Regular | Micro-data (axis labels, "Last updated: 5m ago") |

**Line height:** 1.6 on body text for "magazine" feel.
**Hierarchy tip:** Pair `headline-md` with `label-md` in `on_surface_variant` to separate Narrative from Data.

---

## Elevation & Depth

**Tonal Layering (preferred):** Place `surface_container_lowest` (#fff) cards on `surface_container_low` (#f1f3ff) backgrounds. Natural lift, no shadows needed.

**Ambient Shadows (for floating states):**
```css
box-shadow: 0 12px 40px rgba(20, 27, 43, 0.06);
```
Tinted with `on_surface` (#141b2b), not pure black.

**Ghost Border (accessibility only):** `outline_variant` at 20% opacity. Whisper, not a wall.

**Glassmorphism (floating nav / tooltips / modals):**
```css
background: surface at 80% opacity;
backdrop-filter: blur(12px) to blur(20px);
```

---

## Component Patterns

### Buttons
| Type | Style | Radius |
|------|-------|--------|
| Primary | Gradient `primary` → `primary_container` (135°), white text | `full` (9999px pill) |
| Secondary | `surface_container_high` bg, `primary` text, no border | 8px |
| Tertiary / Ghost | No bg, no border, `primary` text | — |

### Cards & Fund Lists
- **No divider lines** — use `spacing: 3` (1rem) gap OR alternate row bg (`surface` vs `surface_container_low`)
- **Rounding:** `md` (0.75rem / 12px) on fund cards
- **Rule:** Forbid 1px solid borders for sectioning. Use color shifts only.

### Investment Type Chips (Badges)
| Type | Background | Text |
|------|-----------|------|
| General | `surface_container_high` | `on_surface` |
| Inmobiliario | `secondary_fixed` | `on_secondary_fixed` |
| Mercado Monetario | `primary_fixed` | `on_primary_fixed` |
| Bursátil | `tertiary_fixed` | `on_tertiary_fixed` |

### Profitability Indicators
- **Positive:** `tertiary` text + `tertiary_fixed` bg chip + ↗ 45° arrow
- **Negative:** `error` text + `error_container` bg chip + ↘ arrow

### Investment Line Charts
- **Line:** 2px stroke, `tertiary` (#006242) for positive trends
- **Area fill:** gradient `tertiary_fixed` 10% → 0% transparent
- **Axis labels:** `label-sm` in `on_surface_variant`

### Input Fields
- **Fill:** `surface_container_lowest`
- **Default border:** Ghost border (`outline_variant` at 20% opacity)
- **Focus:** transition to full opacity `primary` border (2px)

### Signature: "Comparison Float" Bar
Persistent bar at screen bottom:
```css
background: surface_container_lowest;
backdrop-filter: blur(12px);
border-top: 1px solid rgba(primary_fixed, 0.2);
```
Allows fund comparison without leaving current view.

---

## Spacing Principles
- **Page margins:** `spacing.12` – `spacing.16` (luxury = space you don't use)
- **Between data rows:** `spacing.8` (2rem) vertical white space
- **Large headlines:** Manrope with massive right margin (8.5rem) for "editorial" asymmetry
- **Row height in dense tables:** min 3.5rem for readability

---

## Do's and Don'ts

### Do
- Apply `font-variant-numeric: tabular-nums` to all financial figures
- Use `secondary` (#712ae2) for unique insights, `tertiary` (#006242) for positive growth
- Layer surfaces: `surface_container_lowest` inside `surface_container_low`
- Embrace asymmetrical layouts (wide data table + narrow "Insights" column)
- Use `spacing.12`–`spacing.16` for page margins

### Don't
- Use pure black (#000000) — always use `on_surface` (#141b2b)
- Use 1px solid dividers between items — use white space or color shifts
- Use standard browser `<select>` dropdowns — design custom layered menus
- Add drop shadows on buttons — keep flat or use ambient shadow on cards only
- Use `primary` color for body text — use `on_surface` or `on_surface_variant`
- Crowd data — increase row height or switch to card layout when tight

---

## Stitch Source
- **Project ID:** `projects/15035125010386463871`
- **Title:** mific
- **Extracted:** 2026-03-25
