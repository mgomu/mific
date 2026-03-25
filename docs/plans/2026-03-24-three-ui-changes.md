# Three UI Changes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add left sidebar navigation for fund type filtering, make the compare option always visible, and simplify the ranking table to show only annual profitability.

**Architecture:** Three independent UI changes. The sidebar replaces the "Tipo de fondo" dropdown with a vertical nav. The compare button becomes always-visible in the header. The ranking table drops the monthly and semestral columns.

**Tech Stack:** Next.js (App Router), React, Tailwind CSS, TypeScript

---

### Task 1: Simplify ranking table — show only annual profitability

The simplest change. Remove the monthly and semestral profitability columns from the ranking table.

**Files:**
- Modify: `src/components/ranking-table.tsx`

**Step 1: Remove monthly and semestral column headers**

In `src/components/ranking-table.tsx`, remove the two `<SortHeader>` elements for `rentabilidadMensual` and `rentabilidadSemestral` from the `<thead>`. Keep only:

```tsx
<SortHeader label="Rent. anual" field="rentabilidadAnual" currentField={sortField} currentDir={sortDir} onSort={onSort} align="right" isDefault={sortField === "rentabilidadAnual"} />
```

**Step 2: Remove monthly and semestral column cells**

In the same file, in the `<tbody>` row mapping, remove:
- The `<td>` for `fund.rentabilidadMensual` (the one using `<ProfitabilityIndicator>`)
- The `<td>` for `fund.rentabilidadSemestral` (the one with `.toFixed(2)%`)

Keep only the annual profitability cell.

**Step 3: Clean up unused SortField values**

The `SortField` type includes `"rentabilidadMensual" | "rentabilidadSemestral"`. These can be removed since those columns no longer exist:

```tsx
type SortField = "nombrePatrimonio" | "valorUnidad" | "rentabilidadAnual";
```

**Step 4: Remove unused import**

If `ProfitabilityIndicator` is no longer used in this file (it was only used for the monthly column), remove the import.

**Step 5: Verify the build**

Run: `npm run build`
Expected: Clean build with no errors.

**Step 6: Commit**

```bash
git add src/components/ranking-table.tsx
git commit -m "feat: show only annual profitability in ranking table"
```

---

### Task 2: Make compare option always visible

Currently the "Comparar" button in the header only renders when `compareCount > 0`. The Stitch design shows it always visible as "Comparar (0)" with a disabled/muted state when no funds are selected.

**Files:**
- Modify: `src/components/header.tsx`

**Step 1: Make the compare button always render**

In `src/components/header.tsx`, replace the conditional `{compareCount > 0 && (...)}` with an always-rendered button. When `compareCount < 2`, style it as disabled/muted:

```tsx
<Link
  href={compareCount >= 2 ? compareUrl : "#"}
  className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all ${
    compareCount >= 2
      ? "bg-gradient-to-r from-primary to-primary-container text-white shadow-lg shadow-primary/20 active:scale-95"
      : "bg-surface-container-high text-on-surface-variant"
  }`}
  aria-disabled={compareCount < 2}
>
  <span className="material-symbols-outlined text-base">compare_arrows</span>
  Comparar ({compareCount})
</Link>
```

Key changes:
- Always renders (removed `compareCount > 0 &&` conditional)
- Shows count always: "Comparar (0)", "Comparar (1)", etc.
- Disabled style (muted background, no gradient) when < 2 funds selected
- Active style (gradient, shadow) when >= 2 funds selected
- Added `compare_arrows` icon for visual clarity

**Step 2: Verify the build**

Run: `npm run build`
Expected: Clean build.

**Step 3: Commit**

```bash
git add src/components/header.tsx
git commit -m "feat: always show compare button in header with fund count"
```

---

### Task 3: Add left sidebar navigation for fund type selection

Replace the horizontal "Tipo de fondo" dropdown filter with a vertical sidebar nav on the left side of the ranking page. The sidebar shows fund types as clickable items. Selecting one filters the ranking table.

**Files:**
- Create: `src/components/fund-type-sidebar.tsx`
- Modify: `src/app/ranking-client.tsx`

**Step 1: Create the sidebar component**

Create `src/components/fund-type-sidebar.tsx`:

```tsx
"use client";

interface FundTypeSidebarProps {
  tipos: string[];
  selectedTipo: string;
  onTipoChange: (tipo: string) => void;
  counts: Map<string, number>;
}

export function FundTypeSidebar({
  tipos,
  selectedTipo,
  onTipoChange,
  counts,
}: FundTypeSidebarProps) {
  const totalCount = Array.from(counts.values()).reduce((a, b) => a + b, 0);

  return (
    <nav className="w-56 shrink-0 hidden lg:block" aria-label="Tipo de fondo">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-4 px-3">
        Tipo de fondo
      </h2>
      <ul className="space-y-1">
        <li>
          <button
            onClick={() => onTipoChange("")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              selectedTipo === ""
                ? "bg-primary/10 text-primary font-semibold"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span className="flex items-center justify-between">
              Todos los fondos
              <span className="text-xs tabular-nums opacity-60">{totalCount}</span>
            </span>
          </button>
        </li>
        {tipos.map((tipo) => (
          <li key={tipo}>
            <button
              onClick={() => onTipoChange(tipo)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                selectedTipo === tipo
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span className="flex items-center justify-between">
                {tipo}
                <span className="text-xs tabular-nums opacity-60">
                  {counts.get(tipo) ?? 0}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

Features:
- Shows "Todos los fondos" as first option (clears filter)
- Lists each fund type with count of funds
- Active state: primary color background tint
- Hidden on mobile (`hidden lg:block`), keeps dropdown for small screens
- Rounded items, no borders (no-line rule)

**Step 2: Integrate sidebar into ranking page layout**

In `src/app/ranking-client.tsx`:

1. Import the new component:
```tsx
import { FundTypeSidebar } from "@/components/fund-type-sidebar";
```

2. Compute fund type counts (add after the existing `useMemo` for `subtipos`):
```tsx
const tipoCounts = useMemo(() => {
  const counts = new Map<string, number>();
  for (const f of funds) {
    counts.set(f.nombreTipoPatrimonio, (counts.get(f.nombreTipoPatrimonio) ?? 0) + 1);
  }
  return counts;
}, [funds]);
```

3. Restructure the `<main>` content to use a flex layout with sidebar + content area:

```tsx
<main className="pt-24 pb-32 px-8 max-w-[1440px] mx-auto min-h-screen">
  <section className="mb-10">
    <h1 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight text-on-surface mb-2">
      Fondos de Inversión Colectiva
    </h1>
    <p className="text-on-surface-variant text-lg">
      {sorted.length} fondos disponibles
      {fechaCorte && ` · Datos al ${fechaCorte}`}
    </p>
  </section>

  <div className="flex gap-8">
    <FundTypeSidebar
      tipos={tipos}
      selectedTipo={tipo}
      onTipoChange={(v) => { setTipo(v); setPage(0); }}
      counts={tipoCounts}
    />

    <div className="flex-1 min-w-0">
      <FilterBar
        tipos={tipos}
        admins={admins}
        subtipos={subtipos}
        selectedTipo={tipo}
        selectedAdmin={admin}
        selectedSubtipo={subtipo}
        onTipoChange={(v) => { setTipo(v); setPage(0); }}
        onAdminChange={(v) => { setAdmin(v); setPage(0); }}
        onSubtipoChange={(v) => { setSubtipo(v); setPage(0); }}
        onClear={() => { setTipo(""); setAdmin(""); setSubtipo(""); setPage(0); }}
        hasActiveFilters={hasActiveFilters}
      />

      {/* ... rest of ranking table + pagination unchanged ... */}
    </div>
  </div>
</main>
```

**Step 3: Hide "Tipo de fondo" dropdown on desktop since sidebar handles it**

In `src/components/filter-bar.tsx`, hide the Tipo de fondo `<FilterButton>` on large screens since the sidebar now handles that filter:

```tsx
<div className="lg:hidden">
  <FilterButton
    label="Tipo de fondo"
    options={tipos}
    value={selectedTipo}
    onChange={onTipoChange}
  />
</div>
```

This keeps the dropdown for mobile but hides it on desktop where the sidebar is visible.

**Step 4: Verify the build**

Run: `npm run build`
Expected: Clean build.

**Step 5: Commit**

```bash
git add src/components/fund-type-sidebar.tsx src/app/ranking-client.tsx src/components/filter-bar.tsx
git commit -m "feat: add left sidebar navigation for fund type selection"
```

---

## Execution Order

Tasks are independent and can be executed in any order or in parallel:
- **Task 1** (ranking simplification) — smallest, no new files
- **Task 2** (compare button) — small, one file change
- **Task 3** (sidebar nav) — largest, new component + layout restructure
