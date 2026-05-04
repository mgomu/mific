-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- No Supabase CLI migrations directory existed, so run manually.

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
