"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { FundRecord } from "@/lib/types";
import { formatShortDate } from "@/lib/format";
import { CHART_COLORS } from "@/lib/chart-colors";

type Metric = "rentabilidadAnual" | "valorUnidad";
type Period = "1M" | "6M" | "YTD" | "1Y" | "MAX";
type MetricMode = "Anual" | "Valor de Unidad";

const METRIC_MAP: Record<MetricMode, Metric> = {
  "Anual": "rentabilidadAnual",
  "Valor de Unidad": "valorUnidad",
};

const PERIOD_DAYS: Record<Period, number | null> = {
  "1M": 30,
  "6M": 180,
  YTD: null, // special handling
  "1Y": 365,
  MAX: null,
};

interface ComparisonChartProps {
  fundData: Map<string, FundRecord[]>;
  fundNames: Map<string, string>;
}

export function ComparisonChart({ fundData, fundNames }: ComparisonChartProps) {
  const [metricMode, setMetricMode] = useState<MetricMode>("Anual");
  const [period, setPeriod] = useState<Period>("YTD");
  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set());

  const metric = METRIC_MAP[metricMode];
  const codigos = [...fundData.keys()];

  // Calculate "since" date
  const getSince = (): Date | null => {
    if (period === "MAX") return null;
    if (period === "YTD") {
      const now = new Date();
      return new Date(now.getFullYear(), 0, 1);
    }
    const days = PERIOD_DAYS[period];
    return days ? new Date(Date.now() - days * 86400000) : null;
  };

  const since = getSince();

  const dateMap = new Map<string, Record<string, number>>();
  for (const [codigo, records] of fundData) {
    for (const r of records) {
      if (since && r.fechaCorte < since) continue;
      const dateKey = r.fechaCorte.toISOString().split("T")[0];
      if (!dateMap.has(dateKey)) dateMap.set(dateKey, {});
      const entry = dateMap.get(dateKey)!;
      entry[codigo] = metric === "valorUnidad" ? r.valorUnidad : r[metric];
    }
  }

  const chartData = [...dateMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({
      date: formatShortDate(new Date(date)),
      fullDate: date,
      ...values,
    }));

  const isPercentage = metric !== "valorUnidad";

  return (
    <div className="space-y-6">
      {/* Controls Card */}
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 p-1 bg-surface-container-low rounded-lg">
          {(["Anual", "Valor de Unidad"] as MetricMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetricMode(m)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                metricMode === m
                  ? "bg-surface-container-lowest text-primary shadow-ambient"
                  : "text-on-surface-variant hover:bg-surface transition-colors"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {(Object.keys(PERIOD_DAYS) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                  period === p
                    ? "text-primary bg-primary-fixed"
                    : "text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            Personalizado
          </button>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-surface-container-lowest rounded-xl p-8 shadow-ambient">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-wrap gap-4">
            {codigos.map((codigo, i) => (
              <button
                key={codigo}
                onClick={() =>
                  setHiddenLines((prev) => {
                    const next = new Set(prev);
                    next.has(codigo) ? next.delete(codigo) : next.add(codigo);
                    return next;
                  })
                }
                className={`flex items-center gap-2 transition-opacity ${
                  hiddenLines.has(codigo) ? "opacity-40" : ""
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <span className="text-xs font-bold text-on-surface">
                  {fundNames.get(codigo) ?? codigo}
                </span>
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="4" stroke="#e9edff" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#434655" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#434655" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (isPercentage ? `${v}%` : `$${v.toLocaleString()}`)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "none",
                borderRadius: 8,
                boxShadow: "0 12px 40px rgba(0, 74, 198, 0.12)",
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any) => [
                typeof value === "number"
                  ? isPercentage ? `${value.toFixed(2)}%` : `$${value.toLocaleString()}`
                  : String(value ?? ""),
                fundNames.get(String(name)) ?? String(name),
              ]}
            />
            {codigos.map((codigo, i) => (
              <Line
                key={codigo}
                type="monotone"
                dataKey={codigo}
                name={codigo}
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth={2}
                dot={false}
                hide={hiddenLines.has(codigo)}
                strokeLinecap="round"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
