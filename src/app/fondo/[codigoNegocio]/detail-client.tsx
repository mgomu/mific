"use client";

import Link from "next/link";
import type { FundRecord } from "@/lib/types";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MetricCard } from "@/components/metric-card";
import { FundTypeBadge } from "@/components/fund-type-badge";
import { HistoryChart } from "@/components/history-chart";
import { formatCOP, formatNumber, formatCompactCOP, formatDate } from "@/lib/format";

export function DetailClient({ history }: { history: FundRecord[] }) {
  const latest = history[history.length - 1];

  return (
    <>
      <Header showSearch={false} />
      <main className="pt-24 pb-32 px-8 max-w-[1440px] mx-auto min-h-screen">
        {/* Breadcrumb */}
        <nav className="mb-6 text-xs text-on-surface-variant">
          <Link href="/" className="text-primary hover:underline">
            Fondos
          </Link>
          <span className="mx-2">→</span>
          <span>{latest.nombrePatrimonio}</span>
        </nav>

        {/* Fund header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-on-surface mb-2">
              {latest.nombrePatrimonio}
            </h1>
            <p className="text-on-surface-variant mb-3">
              {latest.nombreEntidad}
            </p>
            <div className="flex gap-2">
              <FundTypeBadge type={latest.nombreTipoPatrimonio} />
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-surface-container-high text-on-surface-variant">
                {latest.nombreSubtipoPatrimonio}
              </span>
            </div>
          </div>
          <Link
            href={`/comparar?ids=${latest.codigoNegocio}`}
            className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-primary/20 active:scale-95 transition-transform whitespace-nowrap"
          >
            Agregar a comparación
          </Link>
        </div>

        <div className="mb-8" />

        {/* Metric cards grid */}
        <div className="bg-surface-container-low rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            label="Valor de la unidad"
            value={formatCOP(latest.valorUnidad)}
          />
          <MetricCard
            label="Rentabilidad anual"
            value=""
            isProfitability
            numericValue={latest.rentabilidadAnual}
          />
          <MetricCard
            label="Rentabilidad semestral"
            value=""
            isProfitability
            numericValue={latest.rentabilidadSemestral}
          />
          <MetricCard
            label="Rentabilidad mensual"
            value=""
            isProfitability
            numericValue={latest.rentabilidadMensual}
          />
          <MetricCard
            label="Nº de inversionistas"
            value={formatNumber(latest.numeroInversionistas)}
          />
          <MetricCard
            label="Valor del fondo"
            value={formatCompactCOP(latest.valorFondo)}
          />
        </div></div>

        {/* Historical chart */}
        <HistoryChart data={history} />

        {/* Data updated */}
        <p className="text-xs text-on-surface-variant mt-6 text-right">
          Datos al {formatDate(latest.fechaCorte)}
        </p>
      </main>
      <Footer fechaCorte={formatDate(latest.fechaCorte)} />
    </>
  );
}
