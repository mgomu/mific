import { supabaseAdmin } from "@/lib/supabase";
import { mergeDuplicateRecords } from "@/lib/api";
import type { SodaRawRecord, FundRecord } from "@/lib/types";

export const maxDuration = 300;

const BASE_URL = "https://www.datos.gov.co/resource/qhpu-8ixx.json";
const APP_TOKEN = process.env.SOCRATA_APP_TOKEN ?? "";

async function sodaFetch(query: string): Promise<SodaRawRecord[]> {
  const url = `${BASE_URL}?${query}`;
  const headers: HeadersInit = {};
  if (APP_TOKEN) headers["X-App-Token"] = APP_TOKEN;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`SODA API error: ${res.status}`);
  return res.json();
}

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

function toDbRow(r: FundRecord) {
  return {
    codigo_negocio: r.codigoNegocio,
    fecha_corte: r.fechaCorte.toISOString().split("T")[0],
    nombre_entidad: r.nombreEntidad,
    nombre_patrimonio: r.nombrePatrimonio,
    nombre_tipo_patrimonio: r.nombreTipoPatrimonio,
    nombre_subtipo_patrimonio: r.nombreSubtipoPatrimonio,
    valor_unidad: r.valorUnidad,
    valor_fondo: r.valorFondo,
    numero_inversionistas: r.numeroInversionistas,
    rentabilidad_diaria: r.rentabilidadDiaria,
    rentabilidad_mensual: r.rentabilidadMensual,
    rentabilidad_semestral: r.rentabilidadSemestral,
    rentabilidad_anual: r.rentabilidadAnual,
    rendimientos_abonados: r.rendimientosAbonados,
    aportes_recibidos: r.aportesRecibidos,
    retiros_redenciones: r.retirosRedenciones,
  };
}

type SyncResult = {
  synced: number;
  datesProcessed: number;
  datesRemaining: number;
  firstDate: string | null;
  lastDate: string | null;
};

// Vercel maxDuration is 300s; leave headroom so we can return a response.
const TIME_BUDGET_MS = 270_000;

async function syncFromDate(sinceStr: string): Promise<SyncResult> {
  const startTime = Date.now();

  // List distinct dates to sync, ordered. Including sinceStr itself lets us
  // repair any partially-synced "latest" day from a previous run.
  const dateRows = await sodaFetch(
    `$select=fecha_corte&$where=fecha_corte>='${sinceStr}'&$group=fecha_corte&$order=fecha_corte ASC&$limit=50000`
  );
  const dates = dateRows
    .map((r) => r.fecha_corte.split("T")[0])
    .filter(Boolean);

  let totalSynced = 0;
  let processed = 0;
  let firstDate: string | null = null;
  let lastDate: string | null = null;

  for (const date of dates) {
    if (Date.now() - startTime > TIME_BUDGET_MS) break;

    const records = await sodaFetch(
      `$where=fecha_corte='${date}'&$limit=5000`
    );

    if (records.length > 0) {
      // Merge dup tipo_participacion rows → one row per (codigo_negocio, date),
      // which is exactly what the PK / onConflict expects.
      const parsed = mergeDuplicateRecords(records.map(parseRecord));
      const rows = parsed.map(toDbRow);

      for (let i = 0; i < rows.length; i += 500) {
        const batch = rows.slice(i, i + 500);
        const { error } = await supabaseAdmin
          .from("fund_records")
          .upsert(batch, { onConflict: "codigo_negocio,fecha_corte" });
        if (error) {
          throw new Error(`Supabase upsert error (${date}): ${error.message}`);
        }
        totalSynced += batch.length;
      }
    }

    if (firstDate === null) firstDate = date;
    lastDate = date;
    processed++;
  }

  return {
    synced: totalSynced,
    datesProcessed: processed,
    datesRemaining: dates.length - processed,
    firstDate,
    lastDate,
  };
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mode = new URL(request.url).searchParams.get("mode");

  try {
    let sinceStr: string;

    if (mode === "backfill") {
      // Full backfill: sync all available data
      sinceStr = "2020-01-01";
    } else {
      // Incremental: find latest date in Supabase and sync from there
      const { data: latest } = await supabaseAdmin
        .from("fund_records")
        .select("fecha_corte")
        .order("fecha_corte", { ascending: false })
        .limit(1);

      if (latest && latest.length > 0) {
        sinceStr = latest[0].fecha_corte;
      } else {
        // Empty table — do a full backfill
        sinceStr = "2020-01-01";
      }
    }

    const result = await syncFromDate(sinceStr);
    return Response.json({
      ...result,
      since: sinceStr,
      mode: mode ?? "incremental",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
