"use client";

import Link from "next/link";
import type { FundRecord } from "@/lib/types";
import { Header } from "@/components/header";
import { HistoryChart } from "@/components/history-chart";
import { formatCOP, formatNumber, formatCompactCOP, formatDate, toSentenceCase } from "@/lib/format";

export function DetailClient({ history }: { history: FundRecord[] }) {
  const latest = history[history.length - 1];

  const values = history.map((h) => h.valorUnidad).filter((v) => v > 0);
  const minVal = values.length ? Math.min(...values) : 0;
  const maxVal = values.length ? Math.max(...values) : 0;
  const avgVal = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

  return (
    <>
      <Header showSearch={false} />
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto min-h-screen">
        {/* Fund Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-on-surface-variant mb-1 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="text-sm font-medium">Volver a fondos</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary font-display">
              {toSentenceCase(latest.nombrePatrimonio)}
            </h1>
            <p className="text-xl text-on-surface-variant font-medium">
              {toSentenceCase(latest.nombreEntidad)}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/comparar?ids=${latest.codigoNegocio}`}
              className="flex items-center gap-2 bg-surface-container-highest text-primary px-6 py-3 rounded-lg font-bold hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Agregar a comparación
            </Link>
            <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
              Invertir ahora
            </button>
          </div>
        </header>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-primary">
            <p className="text-sm font-semibold text-on-surface-variant mb-4 uppercase tracking-wider">
              Valor de la unidad
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary tabular-nums">
                {formatCOP(latest.valorUnidad)}
              </span>
              <span className="text-xs font-bold text-secondary flex items-center">
                <span className="material-symbols-outlined text-xs">arrow_upward</span>
                {latest.rentabilidadDiaria.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">
              Cierre del {formatDate(latest.fechaCorte)}
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-secondary">
            <p className="text-sm font-semibold text-on-surface-variant mb-4 uppercase tracking-wider">
              Rentabilidad Anual
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-secondary tabular-nums">
                {latest.rentabilidadAnual.toFixed(2)}%
              </span>
              <span className="text-xs font-bold text-secondary">E.A.</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">
              Promedio últimos 12 meses
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <p className="text-sm font-semibold text-on-surface-variant mb-4 uppercase tracking-wider">
              Valor total del fondo
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface tabular-nums">
                {formatCompactCOP(latest.valorFondo)}
              </span>
              <span className="text-xs font-medium text-on-surface-variant">COP</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">
              Patrimonio bajo gestión
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <p className="text-sm font-semibold text-on-surface-variant mb-4 uppercase tracking-wider">
              N° de inversionistas
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface tabular-nums">
                {formatNumber(latest.numeroInversionistas)}
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-xl">groups</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">
              Activos actualmente
            </p>
          </div>
        </div>

        {/* Chart + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <HistoryChart data={history} />
            {/* Min/Avg/Max Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 bg-surface-container-lowest rounded-xl p-4 shadow-sm">
              <div className="text-center">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Mínimo (1A)</p>
                <p className="text-sm font-bold tabular-nums">{formatCOP(minVal)}</p>
              </div>
              <div className="text-center border-x border-outline-variant/20">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Promedio</p>
                <p className="text-sm font-bold tabular-nums">{formatCOP(avgVal)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Máximo (1A)</p>
                <p className="text-sm font-bold tabular-nums">{formatCOP(maxVal)}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-surface-container-high p-6 rounded-xl">
              <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">info</span>
                Información del Fondo
              </h4>
              <ul className="space-y-4">
                <li className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Tipo</span>
                  <span className="font-bold text-on-surface">{toSentenceCase(latest.nombreTipoPatrimonio)}</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Subtipo</span>
                  <span className="font-bold text-on-surface">{toSentenceCase(latest.nombreSubtipoPatrimonio)}</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Inversionistas</span>
                  <span className="font-bold text-on-surface">{formatNumber(latest.numeroInversionistas)}</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Valor del Fondo</span>
                  <span className="font-bold text-on-surface">{formatCompactCOP(latest.valorFondo)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Comparison Float Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-surface-container-lowest/80 backdrop-blur-xl border border-primary-fixed/20 py-4 px-6 rounded-2xl shadow-2xl flex items-center justify-between z-40">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold border-2 border-white text-xs">
              {latest.nombrePatrimonio.slice(0, 2).toUpperCase()}
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-dashed border-outline-variant flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">add</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-primary">Comparando fondos</p>
            <p className="text-[10px] text-on-surface-variant">Selecciona un fondo más para comparar</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-on-surface-variant hover:text-error transition-colors cursor-pointer">
            Limpiar
          </span>
          <Link
            href={`/comparar?ids=${latest.codigoNegocio}`}
            className="bg-primary text-white px-5 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-all"
          >
            Comparar ahora
          </Link>
        </div>
      </div>

    </>
  );
}
