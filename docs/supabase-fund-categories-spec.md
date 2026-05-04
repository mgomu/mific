# Supabase: Fund Categories Feature — Implementation Spec

## Context

This is a Next.js app deployed on Vercel that aggregates Colombian investment fund (FIC) data. The Supabase database currently has a single table `fund_records` with composite PK `(codigo_negocio, fecha_corte)` — one row per fund per reporting date.

We need to add a **fund-level categorization by asset class**. This classification is done externally (via an n8n automation) and stored in a new lookup table. The app needs to read this data and join it with existing fund records.

## Existing Setup

- **Supabase client file**: `supabase.ts` (or similar) — already exports two clients:
  - `supabase` — anon client (respects RLS, used for reads)
  - `supabaseAdmin` — service-role client (bypasses RLS, used for writes/sync)
- **RLS pattern**: RLS enabled, public read policy, writes via service-role only.
- **Existing table**: `fund_records` — see schema below for reference.

### `fund_records` schema (reference only — do NOT modify)

| Column | Type |
|---|---|
| codigo_negocio | text (PK part 1) |
| fecha_corte | date (PK part 2) |
| nombre_entidad | text |
| nombre_patrimonio | text |
| nombre_tipo_patrimonio | text |
| nombre_subtipo_patrimonio | text |
| valor_unidad | numeric |
| valor_fondo | numeric |
| numero_inversionistas | integer |
| rentabilidad_diaria | numeric |
| rentabilidad_mensual | numeric |
| rentabilidad_semestral | numeric |
| rentabilidad_anual | numeric |
| rendimientos_abonados | numeric |
| aportes_recibidos | numeric |
| retiros_redenciones | numeric |
| synced_at | timestamptz |

---

## Tasks

### 1. Create Supabase Migration: `fund_categories` table

Create a new Supabase migration file for the `fund_categories` table.

If the project uses Supabase CLI migrations (check for a `supabase/migrations/` directory), create a new migration file there with a timestamped name like `YYYYMMDDHHMMSS_create_fund_categories.sql`.

If there's no migrations directory, create the file as `supabase/migrations/create_fund_categories.sql` and add a comment at the top noting it should be run manually in the Supabase SQL Editor.

#### SQL content for the migration:

```sql
-- Create fund_categories lookup table
-- One row per fund, stores the asset class classification
CREATE TABLE IF NOT EXISTS fund_categories (
  codigo_negocio TEXT PRIMARY KEY,
  nombre_patrimonio TEXT NOT NULL,
  nombre_entidad TEXT NOT NULL,
  asset_class TEXT CHECK (asset_class IN ('renta_fija', 'renta_variable', 'alternativos', 'otros')),
  classified_at TIMESTAMPTZ,
  source_url TEXT
);

-- Enable RLS (same pattern as fund_records)
ALTER TABLE fund_categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for fund_categories"
  ON fund_categories
  FOR SELECT
  USING (true);

-- Index on asset_class for filtered queries
CREATE INDEX idx_fund_categories_asset_class ON fund_categories (asset_class);

-- View: fund_records enriched with asset_class
-- Use this view anywhere you need fund data with its category
CREATE OR REPLACE VIEW fund_records_enriched AS
SELECT
  fr.*,
  fc.asset_class
FROM fund_records fr
LEFT JOIN fund_categories fc USING (codigo_negocio);
```

### 2. Add TypeScript Types

Find the file where Supabase types or database types are defined (commonly `types/supabase.ts`, `lib/types.ts`, `types/database.ts`, or generated via `supabase gen types`). Add the following type alongside existing types:

```typescript
export interface FundCategory {
  codigo_negocio: string;
  nombre_patrimonio: string;
  nombre_entidad: string;
  asset_class: 'renta_fija' | 'renta_variable' | 'alternativos' | 'otros' | null;
  classified_at: string | null;
  source_url: string | null;
}

// Also export the asset class union type for reuse
export type AssetClass = 'renta_fija' | 'renta_variable' | 'alternativos' | 'otros';

// Display labels for the UI (Spanish)
export const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
  renta_fija: 'Renta Fija',
  renta_variable: 'Renta Variable',
  alternativos: 'Alternativos',
  otros: 'Otros',
};
```

If types are auto-generated via `supabase gen types typescript`, just add the `AssetClass` union type and `ASSET_CLASS_LABELS` map in a separate file (e.g., `lib/constants.ts` or `types/fund-categories.ts`) — don't edit auto-generated files.

### 3. Create Data Access Helpers

Create a new file `lib/fund-categories.ts` (or in whatever directory the project keeps its data access / query logic — look for patterns like `lib/`, `utils/`, `services/`, or `data/`).

```typescript
import { supabase } from './supabase'; // adjust import path to match project

/**
 * Get all funds enriched with their asset class.
 * Uses the fund_records_enriched view.
 * Fetches only the latest record per fund.
 */
export async function getFundsWithCategory() {
  const { data, error } = await supabase
    .from('fund_records_enriched')
    .select('*')
    .order('fecha_corte', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get the category for a specific fund.
 */
export async function getFundCategory(codigoNegocio: string) {
  const { data, error } = await supabase
    .from('fund_categories')
    .select('*')
    .eq('codigo_negocio', codigoNegocio)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
}

/**
 * Get all funds filtered by asset class.
 * Uses the enriched view for latest records only.
 */
export async function getFundsByAssetClass(assetClass: string) {
  const { data, error } = await supabase
    .from('fund_records_enriched')
    .select('*')
    .eq('asset_class', assetClass)
    .order('fecha_corte', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get all distinct asset classes that have at least one fund.
 */
export async function getAvailableAssetClasses() {
  const { data, error } = await supabase
    .from('fund_categories')
    .select('asset_class')
    .not('asset_class', 'is', null);

  if (error) throw error;

  const unique = [...new Set(data.map((d) => d.asset_class))];
  return unique;
}

/**
 * Get count of uncategorized funds (funds in fund_records but not in fund_categories).
 * Useful for displaying a status/badge in the UI.
 */
export async function getUncategorizedFundCount() {
  const { count, error } = await supabase
    .from('fund_records_enriched')
    .select('codigo_negocio', { count: 'exact', head: true })
    .is('asset_class', null);

  if (error) throw error;
  return count ?? 0;
}
```

### 4. Important Notes

- **Do NOT modify the `fund_records` table in any way.** The category lives in the separate `fund_categories` table and is joined via the view.
- **Do NOT create any write/upsert helpers for `fund_categories` in the Next.js app.** Writes to this table are handled exclusively by the n8n automation using the service-role key. The app only reads.
- **The `fund_records_enriched` view** is a LEFT JOIN, so funds without a category will show `asset_class: null`. The app should handle this gracefully (e.g., show "Sin clasificar" or a badge).
- **RLS**: The new table follows the same pattern — public reads, writes only via service-role (which the n8n automation will use).
