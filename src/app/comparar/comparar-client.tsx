"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { FundRecord } from "@/lib/types";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ComparisonChart } from "@/components/comparison-chart";
import { ComparisonTable } from "@/components/comparison-table";
import { FundSearchModal } from "@/components/fund-search-modal";
import { Skeleton } from "@/components/skeleton";
import Link from "next/link";

const CHART_COLORS = ["#2563eb", "#7C3AED", "#F59E0B", "#10B981", "#EF4444"];

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

      const grouped = new Map<string, FundRecord[]>();
      for (const r of raw) {
        const record: FundRecord = {
          codigoNegocio: r.codigo_negocio,
          nombreEntidad: r.nombre_entidad,
          nombrePatrimonio: r.nombre_patrimonio,
          nombreTipoPatrimonio: r.nombre_tipo_patrimonio,
          nombreSubtipoPatrimonio: r.nombre_subtipo_patrimonio,
          valorUnidad: parseFloat(r.valor_unidad_operaciones_dia_t) || 0,
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
        };
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
        setAllFunds(
          raw.map((r: any) => ({
            codigoNegocio: r.codigo_negocio,
            nombreEntidad: r.nombre_entidad,
            nombrePatrimonio: r.nombre_patrimonio,
            nombreTipoPatrimonio: r.nombre_tipo_patrimonio ?? "",
            nombreSubtipoPatrimonio: r.nombre_subtipo_patrimonio ?? "",
            valorUnidad: parseFloat(r.valor_unidad_operaciones_dia_t) || 0,
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
          }))
        );
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
  for (const [codigo, records] of fundData) {
    if (records.length > 0) fundNames.set(codigo, records[0].nombrePatrimonio);
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
      <main className="pt-24 pb-32 px-8 max-w-[1440px] mx-auto min-h-screen">
        <nav className="mb-6 text-xs text-on-surface-variant">
          <Link href="/" className="text-primary hover:underline">
            Fondos
          </Link>
          <span className="mx-2">{"\u2192"}</span>
          <span>Comparar</span>
        </nav>

        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-6">
          Comparar fondos
        </h1>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          {ids.map((id, i) => (
            <span
              key={id}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded-lg text-xs font-medium"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              {(fundNames.get(id) ?? id).slice(0, 30)}
              <button
                onClick={() => removeFund(id)}
                className="text-on-surface-variant hover:text-error"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </span>
          ))}
          {ids.length < 5 && (
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-dashed border-outline-variant rounded-lg text-xs font-medium text-primary hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Agregar fondo
            </button>
          )}
        </div>

        {ids.length < 2 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-4">
              compare_arrows
            </span>
            <p className="text-lg font-semibold text-on-surface-variant">
              Selecciona al menos 2 fondos para comparar
            </p>
            <Link
              href="/"
              className="inline-block mt-4 px-6 py-2 border border-outline-variant rounded-full text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
            >
              Ir al ranking
            </Link>
          </div>
        ) : loading ? (
          <div className="space-y-6">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <ComparisonChart fundData={fundData} fundNames={fundNames} />
            <ComparisonTable funds={latestPerFund} />
          </div>
        )}
      </main>
      <Footer />
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
