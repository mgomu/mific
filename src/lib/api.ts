import type { FundRecord, SodaRawRecord } from "./types";
import { supabase } from "./supabase";

const BASE_URL = "https://www.datos.gov.co/resource/qhpu-8ixx.json";
const APP_TOKEN = process.env.SOCRATA_APP_TOKEN ?? "";

function parseRecord(raw: SodaRawRecord): FundRecord {
  return {
    codigoNegocio: raw.codigo_negocio,
    nombreEntidad: raw.nombre_entidad,
    nombrePatrimonio: raw.nombre_patrimonio,
    nombreTipoPatrimonio: raw.nombre_tipo_patrimonio,
    nombreSubtipoPatrimonio: raw.nombre_subtipo_patrimonio,
    valorUnidad: parseFloat(raw.valor_unidad_operaciones) || 0,
    valorFondo: parseFloat(raw.valor_fondo_cierre_dia_t) || 0,
    numeroInversionistas: parseInt(raw.numero_inversionistas, 10) || 0,
    rentabilidadDiaria: parseFloat(raw.rentabilidad_diaria) || 0,
    rentabilidadMensual: parseFloat(raw.rentabilidad_mensual) || 0,
    rentabilidadSemestral: parseFloat(raw.rentabilidad_semestral) || 0,
    rentabilidadAnual: parseFloat(raw.rentabilidad_anual) || 0,
    fechaCorte: new Date(raw.fecha_corte),
    rendimientosAbonados: parseFloat(raw.rendimientos_abonados) || 0,
    aportesRecibidos: parseFloat(raw.aportes_recibidos) || 0,
    retirosRedenciones: parseFloat(raw.retiros_redenciones) || 0,
  };
}

/**
 * Merge duplicate records for the same fund+date (different tipo_participacion).
 * Sums: inversionistas, valorFondo, rendimientos, aportes, retiros.
 * Takes rates/unit value from the record with the most investors (main class).
 */
export function mergeDuplicateRecords(records: FundRecord[]): FundRecord[] {
  const byKey = new Map<string, FundRecord[]>();
  for (const r of records) {
    const key = `${r.codigoNegocio}_${r.fechaCorte.toISOString()}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push(r);
  }

  const merged: FundRecord[] = [];
  for (const group of byKey.values()) {
    if (group.length === 1) {
      merged.push(group[0]);
      continue;
    }
    const main = group.reduce((a, b) =>
      b.numeroInversionistas > a.numeroInversionistas ? b : a
    );
    merged.push({
      ...main,
      numeroInversionistas: group.reduce((s, r) => s + r.numeroInversionistas, 0),
      valorFondo: group.reduce((s, r) => s + r.valorFondo, 0),
      rendimientosAbonados: group.reduce((s, r) => s + r.rendimientosAbonados, 0),
      aportesRecibidos: group.reduce((s, r) => s + r.aportesRecibidos, 0),
      retirosRedenciones: group.reduce((s, r) => s + r.retirosRedenciones, 0),
    });
  }
  return merged;
}

// ---------------------------------------------------------------------------
// Supabase helpers
// ---------------------------------------------------------------------------

export function dbRowToFundRecord(row: Record<string, unknown>): FundRecord {
  return {
    codigoNegocio: row.codigo_negocio as string,
    nombreEntidad: row.nombre_entidad as string,
    nombrePatrimonio: row.nombre_patrimonio as string,
    nombreTipoPatrimonio: row.nombre_tipo_patrimonio as string,
    nombreSubtipoPatrimonio: row.nombre_subtipo_patrimonio as string,
    valorUnidad: Number(row.valor_unidad) || 0,
    valorFondo: Number(row.valor_fondo) || 0,
    numeroInversionistas: Number(row.numero_inversionistas) || 0,
    rentabilidadDiaria: Number(row.rentabilidad_diaria) || 0,
    rentabilidadMensual: Number(row.rentabilidad_mensual) || 0,
    rentabilidadSemestral: Number(row.rentabilidad_semestral) || 0,
    rentabilidadAnual: Number(row.rentabilidad_anual) || 0,
    fechaCorte: new Date(row.fecha_corte as string),
    rendimientosAbonados: Number(row.rendimientos_abonados) || 0,
    aportesRecibidos: Number(row.aportes_recibidos) || 0,
    retirosRedenciones: Number(row.retiros_redenciones) || 0,
  };
}

// ---------------------------------------------------------------------------
// Socrata fallback (used when Supabase has no data yet)
// ---------------------------------------------------------------------------

async function sodaFetch(query: string): Promise<SodaRawRecord[]> {
  const url = `${BASE_URL}?${query}`;
  const headers: HeadersInit = {};
  if (APP_TOKEN) headers["X-App-Token"] = APP_TOKEN;

  const res = await fetch(url, {
    headers,
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`SODA API error: ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Public API — reads from Supabase, falls back to Socrata
// ---------------------------------------------------------------------------

export async function fetchLatestFunds(): Promise<FundRecord[]> {
  // fund_latest view: DISTINCT ON (codigo_negocio) within last 90 days,
  // so weekly-reporting funds appear alongside daily ones.
  const all: Record<string, unknown>[] = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("fund_latest")
      .select("*")
      .order("codigo_negocio", { ascending: true })
      .range(from, from + pageSize - 1);
    if (error || !data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
  }
  // Require a minimum number of funds — a handful of rows means the DB isn't
  // populated yet and we should fall through to Socrata.
  if (all.length >= 50) return all.map(dbRowToFundRecord);

  // Fallback to Socrata — fetch last 30 days, keep latest record per fund
  try {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const sinceStr = since.toISOString().split("T")[0];
    const records = await sodaFetch(
      `$where=fecha_corte>='${sinceStr}'&$order=fecha_corte DESC&$limit=5000`
    );
    if (records.length === 0) return all.map(dbRowToFundRecord);

    const parsed = records.map(parseRecord);
    const merged = mergeDuplicateRecords(parsed);
    // Keep only the latest date per fund
    const latestByFund = new Map<string, FundRecord>();
    for (const r of merged) {
      const existing = latestByFund.get(r.codigoNegocio);
      if (!existing || r.fechaCorte > existing.fechaCorte) {
        latestByFund.set(r.codigoNegocio, r);
      }
    }
    return Array.from(latestByFund.values());
  } catch (err) {
    console.error("[fetchLatestFunds] Socrata fallback failed:", err);
    return all.map(dbRowToFundRecord);
  }
}

export async function fetchFundHistory(
  codigoNegocio: string,
  days = 365
): Promise<FundRecord[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("fund_records")
    .select("*")
    .eq("codigo_negocio", codigoNegocio)
    .gte("fecha_corte", sinceStr)
    .order("fecha_corte", { ascending: true });

  if (!error && data && data.length > 0) {
    return data.map(dbRowToFundRecord);
  }

  // Fallback to Socrata
  const records = await sodaFetch(
    `$where=codigo_negocio='${codigoNegocio}' AND fecha_corte>='${sinceStr}'&$order=fecha_corte ASC&$limit=5000`
  );
  return mergeDuplicateRecords(records.map(parseRecord));
}

export async function fetchFundActiveSince(
  codigoNegocio: string
): Promise<Date | null> {
  const { data, error } = await supabase
    .from("fund_records")
    .select("fecha_corte")
    .eq("codigo_negocio", codigoNegocio)
    .order("fecha_corte", { ascending: true })
    .limit(1);

  if (!error && data && data.length > 0) {
    return new Date(data[0].fecha_corte);
  }

  // Fallback to Socrata
  const records = await sodaFetch(
    `$select=fecha_corte&$where=codigo_negocio='${codigoNegocio}'&$order=fecha_corte ASC&$limit=1`
  );
  if (records.length === 0) return null;
  return new Date(records[0].fecha_corte);
}

export async function fetchFundsComparison(
  codigos: string[],
  days = 365
): Promise<FundRecord[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("fund_records")
    .select("*")
    .in("codigo_negocio", codigos)
    .gte("fecha_corte", sinceStr)
    .order("fecha_corte", { ascending: true });

  if (!error && data && data.length > 0) {
    return data.map(dbRowToFundRecord);
  }

  // Fallback to Socrata
  const inClause = codigos.map((c) => `'${c}'`).join(",");
  const records = await sodaFetch(
    `$where=codigo_negocio in (${inClause}) AND fecha_corte>='${sinceStr}'&$order=fecha_corte ASC&$limit=50000`
  );
  return mergeDuplicateRecords(records.map(parseRecord));
}
