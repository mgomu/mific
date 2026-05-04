import { supabase } from './supabase';

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
