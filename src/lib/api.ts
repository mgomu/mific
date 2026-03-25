import type { FundRecord, SodaRawRecord } from "./types";

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

async function sodaFetch(query: string): Promise<SodaRawRecord[]> {
  const url = `${BASE_URL}?${query}`;
  const headers: HeadersInit = {};
  if (APP_TOKEN) headers["X-App-Token"] = APP_TOKEN;

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`SODA API error: ${res.status}`);
  return res.json();
}

export async function fetchLatestFunds(): Promise<FundRecord[]> {
  const dateRecords = await sodaFetch(
    "$select=fecha_corte&$order=fecha_corte DESC&$limit=1"
  );
  if (dateRecords.length === 0) return [];

  const latestDate = dateRecords[0].fecha_corte.split("T")[0];
  const records = await sodaFetch(
    `$where=fecha_corte='${latestDate}'&$limit=5000`
  );
  const parsed = records.map(parseRecord);
  const seen = new Set<string>();
  return parsed.filter((r) => {
    if (seen.has(r.codigoNegocio)) return false;
    seen.add(r.codigoNegocio);
    return true;
  });
}

export async function fetchFundHistory(
  codigoNegocio: string,
  days = 365
): Promise<FundRecord[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split("T")[0];

  const records = await sodaFetch(
    `$where=codigo_negocio='${codigoNegocio}' AND fecha_corte>='${sinceStr}'&$order=fecha_corte ASC&$limit=5000`
  );
  return records.map(parseRecord);
}

export async function fetchFundsComparison(
  codigos: string[],
  days = 365
): Promise<FundRecord[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split("T")[0];
  const inClause = codigos.map((c) => `'${c}'`).join(",");

  const records = await sodaFetch(
    `$where=codigo_negocio in (${inClause}) AND fecha_corte>='${sinceStr}'&$order=fecha_corte ASC&$limit=50000`
  );
  return records.map(parseRecord);
}
