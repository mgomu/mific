"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { FundRecord } from "@/lib/types";
import { Header } from "@/components/header";
import { toSentenceCase } from "@/lib/format";
import { mergeDuplicateRecords } from "@/lib/api";
import { ComparisonChart } from "@/components/comparison-chart";
import { ComparisonTable } from "@/components/comparison-table";
import { FundSearchModal } from "@/components/fund-search-modal";
import { Skeleton } from "@/components/skeleton";
import { CHART_COLORS } from "@/lib/chart-colors";

export function CompararClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idsParam = searchParams.get("ids") ?? "";
  const ids = idsParam ? idsParam.split(",").filter(Boolean) : [];

  const [fundData, setFundData] = useState<Map<string, FundRecord[]>>(new Map());
  const [allFunds, setAllFunds] = useState<FundRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchComparison = useCallback(async (codigos: string[]) => {
    if (codigos.length === 0) {
      setFundData(new Map());
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const since = new Date();
      since.setDate(since.getDate() - 365);
      const sinceStr = since.toISOString().split("T")[0];
      const inClause = codigos.map((c) => `'${c}'`).join(",");

      const url = `https://www.datos.gov.co/resource/qhpu-8ixx.json?$where=codigo_negocio in (${inClause}) AND fecha_corte>='${sinceStr}'&$order=fecha_corte ASC&$limit=50000`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("API error");
      const raw = await res.json();

      const parsed = raw.map((r: any) => ({
        codigoNegocio: r.codigo_negocio,
        nombreEntidad: r.nombre_entidad,
        nombrePatrimonio: r.nombre_patrimonio,
        nombreTipoPatrimonio: r.nombre_tipo_patrimonio,
        nombreSubtipoPatrimonio: r.nombre_subtipo_patrimonio,
        valorUnidad: parseFloat(r.valor_unidad_operaciones) || 0,
        valorFondo: parseFloat(r.valor_fondo_cierre_dia_t) || 0,
        numeroInversionistas: parseInt(r.numero_inversionistas, 10) || 0,
        rentabilidadDiaria: parseFloat(r.rentabilidad_diaria) || 0,
        rentabilidadMensual: parseFloat(r.rentabilidad_mensual) || 0,
        rentabilidadSemestral: parseFloat(r.rentabilidad_semestral) || 0,
        rentabilidadAnual: parseFloat(r.rentabilidad_anual) || 0,
        fechaCorte: new Date(r.fecha_corte),
        rendimientosAbonados: parseFloat(r.rendimientos_abonados) || 0,
        aportesRecibidos: parseFloat(r.aportes_recibidos) || 0,
        retirosRedenciones: parseFloat(r.retiros_redenciones) || 0,
      } as FundRecord));
      const merged = mergeDuplicateRecords(parsed);

      const grouped = new Map<string, FundRecord[]>();
      for (const record of merged) {
        if (!grouped.has(record.codigoNegocio)) {
          grouped.set(record.codigoNegocio, []);
        }
        grouped.get(record.codigoNegocio)!.push(record);
      }
      setFundData(grouped);
    } catch (e) {
      console.error("Failed to fetch comparison data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComparison(ids);
  }, [idsParam]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function fetchAll() {
      try {
        const dateRes = await fetch(
          "https://www.datos.gov.co/resource/qhpu-8ixx.json?$select=fecha_corte&$order=fecha_corte DESC&$limit=1"
        );
        const dateData = await dateRes.json();
        if (dateData.length === 0) return;
        const latestDate = dateData[0].fecha_corte.split("T")[0];

        const res = await fetch(
          `https://www.datos.gov.co/resource/qhpu-8ixx.json?$where=fecha_corte='${latestDate}'&$limit=5000`
        );
        const raw = await res.json();
        const allParsed = raw.map((r: any) => ({
          codigoNegocio: r.codigo_negocio,
          nombreEntidad: r.nombre_entidad,
          nombrePatrimonio: r.nombre_patrimonio,
          nombreTipoPatrimonio: r.nombre_tipo_patrimonio ?? "",
          nombreSubtipoPatrimonio: r.nombre_subtipo_patrimonio ?? "",
          valorUnidad: parseFloat(r.valor_unidad_operaciones) || 0,
          valorFondo: parseFloat(r.valor_fondo_cierre_dia_t) || 0,
          numeroInversionistas: parseInt(r.numero_inversionistas, 10) || 0,
          rentabilidadDiaria: parseFloat(r.rentabilidad_diaria) || 0,
          rentabilidadMensual: parseFloat(r.rentabilidad_mensual) || 0,
          rentabilidadSemestral: parseFloat(r.rentabilidad_semestral) || 0,
          rentabilidadAnual: parseFloat(r.rentabilidad_anual) || 0,
          fechaCorte: new Date(r.fecha_corte),
          rendimientosAbonados: parseFloat(r.rendimientos_abonados) || 0,
          aportesRecibidos: parseFloat(r.aportes_recibidos) || 0,
          retirosRedenciones: parseFloat(r.retiros_redenciones) || 0,
        } as FundRecord));
        setAllFunds(mergeDuplicateRecords(allParsed));
      } catch {
        // silently fail
      }
    }
    fetchAll();
  }, []);

  function updateIds(newIds: string[]) {
    router.push(`/comparar?ids=${newIds.join(",")}`);
  }

  function removeFund(id: string) {
    updateIds(ids.filter((x) => x !== id));
  }

  function addFund(fund: FundRecord) {
    if (ids.length >= 5) return;
    updateIds([...ids, fund.codigoNegocio]);
  }

  const fundNames = new Map<string, string>();
  const fundEntities = new Map<string, string>();
  for (const [codigo, records] of fundData) {
    if (records.length > 0) {
      fundNames.set(codigo, records[0].nombrePatrimonio);
      fundEntities.set(codigo, records[0].nombreEntidad);
    }
  }

  const latestPerFund = ids
    .map((id) => {
      const records = fundData.get(id);
      return records?.[records.length - 1];
    })
    .filter(Boolean) as FundRecord[];

  return (
    <>
      <Header showSearch={false} />
      <main className="pt-24 pb-20 px-6 max-w-screen-2xl mx-auto min-h-screen">
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-2">
            Comparación de Fondos
          </h1>
          <p className="text-on-surface-variant font-medium">
            Analiza y compara el rendimiento histórico de tus selecciones.
          </p>
        </header>

        {ids.length < 2 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-4">
              compare_arrows
            </span>
            <p className="text-lg font-semibold text-on-surface-variant">
              Selecciona al menos 2 fondos para comparar
            </p>
            <a
              href="/"
              className="inline-block mt-4 px-6 py-2 border border-outline-variant/30 rounded-full text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
            >
              Ir al ranking
            </a>
          </div>
        ) : loading ? (
          <div className="space-y-6">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Chart */}
            <div className="lg:col-span-9 space-y-6">
              <ComparisonChart fundData={fundData} fundNames={fundNames} />
            </div>

            {/* Right Column: Selected Funds */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-surface-container-lowest rounded-xl p-6 h-full shadow-ambient">
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center justify-between">
                  Fondos Seleccionados
                  <span className="bg-primary-fixed text-primary px-2 py-0.5 rounded text-xs">
                    {ids.length}/5
                  </span>
                </h2>
                <div className="space-y-3">
                  {ids.map((id, i) => (
                    <div
                      key={id}
                      className="bg-surface-container-lowest p-3 rounded-lg shadow-ambient group"
                      style={{ borderLeft: `4px solid ${CHART_COLORS[i % CHART_COLORS.length]}` }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-primary">
                            {toSentenceCase(fundEntities.get(id) ?? "")}
                          </p>
                          <p className="text-sm font-bold text-on-surface leading-tight">
                            {toSentenceCase((fundNames.get(id) ?? id).slice(0, 30))}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFund(id)}
                          className="text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between pt-2 mt-2">
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant">Rent. YTD</span>
                        <span className="text-xs font-bold text-tertiary">
                          {latestPerFund.find((f) => f.codigoNegocio === id)
                            ? `+${latestPerFund.find((f) => f.codigoNegocio === id)!.rentabilidadAnual.toFixed(1)}%`
                            : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                  {ids.length < 5 && (
                    <button
                      onClick={() => setModalOpen(true)}
                      className="w-full border-2 border-dashed border-outline-variant/50 rounded-lg p-4 text-on-surface-variant hover:bg-surface-container-lowest hover:text-primary transition-all flex flex-col items-center justify-center gap-1 group"
                    >
                      <span className="material-symbols-outlined">add_circle</span>
                      <span className="text-xs font-bold">Agregar Fondo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Comparison Table: Full Width */}
            <div className="lg:col-span-12 mt-8">
              <ComparisonTable funds={latestPerFund} />
            </div>
          </div>
        )}
      </main>

      {/* Comparison Float Bar */}
      {ids.length >= 2 && !loading && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl z-40 px-6">
          <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl p-4 shadow-ambient border border-primary-fixed/20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {ids.map((id, i) => (
                  <div
                    key={id}
                    className="w-10 h-10 rounded-full border-2 border-surface flex items-center justify-center text-on-primary text-[10px] font-bold"
                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  >
                    {(fundNames.get(id) ?? id).slice(0, 3).toUpperCase()}
                  </div>
                ))}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-primary leading-none">
                  Comparando {ids.length} fondos
                </p>
                <p className="text-[10px] text-on-surface-variant font-medium mt-1">
                  Sincronizado con tus favoritos
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-surface-container-high px-4 py-2 rounded-full text-sm font-bold text-primary hover:bg-surface-container-highest transition-colors">
                Compartir
              </button>
              <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2 rounded-full text-sm font-bold shadow-ambient hover:opacity-90 active:scale-95 transition-all">
                Generar Reporte PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <FundSearchModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addFund}
        allFunds={allFunds}
        excludeIds={ids}
      />
    </>
  );
}
