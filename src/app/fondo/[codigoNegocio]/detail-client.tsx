"use client";

import { useState } from "react";
import Link from "next/link";
import type { FundRecord } from "@/lib/types";
import { Header } from "@/components/header";
import { HistoryChart } from "@/components/history-chart";
import { formatNumber, formatCompactCOP, formatDate, formatCOP, toSentenceCase } from "@/lib/format";

export function DetailClient({ history }: { history: FundRecord[] }) {
  const [compareOpen, setCompareOpen] = useState(false);
  const latest = history[history.length - 1];

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
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary font-headline">
              {toSentenceCase(latest.nombrePatrimonio)}
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/comparar?ids=${latest.codigoNegocio}`}
              className="flex items-center gap-2 bg-surface-container-highest text-primary px-6 py-3 rounded-lg font-bold hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Agregar a comparación
            </Link>
          </div>
        </header>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface-container-lowest p-6 rounded-xl">
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

          <div className="bg-surface-container-lowest p-6 rounded-xl">
            <p className="text-sm font-semibold text-on-surface-variant mb-4 uppercase tracking-wider">
              Rentabilidad Efectiva Anual
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

          <div className="bg-surface-container-lowest p-6 rounded-xl">
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

          <div className="bg-surface-container-lowest p-6 rounded-xl">
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

      {/* Floating Compare Button + Expandable Panel */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-3">
        {compareOpen && (
          <div className="backdrop-blur-xl border py-4 px-6 rounded-2xl shadow-2xl w-[340px]" style={{ backgroundColor: "rgba(255,255,255,0.9)", borderColor: "rgba(220,225,255,0.3)" }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 border-white text-xs" style={{ backgroundColor: "#006a61", color: "#ffffff" }}>
                  {latest.nombrePatrimonio.slice(0, 2).toUpperCase()}
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center" style={{ backgroundColor: "#e6e8ea", borderColor: "#c5c5d3", color: "#444651" }}>
                  <span className="material-symbols-outlined text-sm">add</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: "#00236f" }}>Comparar fondos</p>
                <p className="text-[10px]" style={{ color: "#444651" }}>Selecciona fondos para comparar</p>
              </div>
            </div>
            <Link
              href={`/comparar?ids=${latest.codigoNegocio}`}
              className="w-full py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: "#00236f", color: "#ffffff" }}
            >
              <span className="material-symbols-outlined text-sm">compare_arrows</span>
              Comparar ahora
            </Link>
          </div>
        )}
        <button
          onClick={() => setCompareOpen(!compareOpen)}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:shadow-xl hover:scale-105"
          style={{
            backgroundColor: compareOpen ? "#e6e8ea" : "#00236f",
            color: compareOpen ? "#191c1e" : "#ffffff",
            transform: compareOpen ? "rotate(45deg)" : undefined,
          }}
        >
          <span className="material-symbols-outlined text-2xl">
            {compareOpen ? "close" : "compare_arrows"}
          </span>
        </button>
      </div>

    </>
  );
}
