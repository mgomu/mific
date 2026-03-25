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
  Area,
  AreaChart,
} from "recharts";
import type { FundRecord } from "@/lib/types";
import { formatShortDate } from "@/lib/format";

type Metric = "rentabilidadAnual" | "rentabilidadMensual" | "rentabilidadSemestral" | "valorUnidad";
type Period = "1M" | "3M" | "6M" | "1A" | "Todo";

const METRIC_LABELS: Record<Metric, string> = {
  rentabilidadAnual: "Rent. anual",
  rentabilidadMensual: "Rent. mensual",
  rentabilidadSemestral: "Rent. semestral",
  valorUnidad: "Valor de la unidad",
};

const PERIOD_DAYS: Record<Period, number | null> = {
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1A": 365,
  Todo: null,
};

export function HistoryChart({ data }: { data: FundRecord[] }) {
  const [metric, setMetric] = useState<Metric>("rentabilidadAnual");
  const [period, setPeriod] = useState<Period>("1A");

  const filteredData = (() => {
    const days = PERIOD_DAYS[period];
    if (!days) return data;
    const since = new Date();
    since.setDate(since.getDate() - days);
    return data.filter((d) => d.fechaCorte >= since);
  })();

  const chartData = filteredData.map((d) => ({
    date: formatShortDate(d.fechaCorte),
    value: metric === "valorUnidad" ? d.valorUnidad : d[metric],
    fullDate: d.fechaCorte.toLocaleDateString("es-CO"),
  }));

  const isPercentage = metric !== "valorUnidad";

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient">
      <h2 className="text-lg font-semibold text-on-surface mb-4">
        Evolución histórica
      </h2>

      {/* Metric tabs */}
      <div className="flex gap-6 border-b border-outline-variant/20 mb-4">
        {(Object.keys(METRIC_LABELS) as Metric[]).map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`pb-2 text-sm font-medium transition-colors ${
              metric === m
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {METRIC_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Period selector */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(PERIOD_DAYS) as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              period === p
                ? "bg-primary text-white"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#004ac6" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#004ac6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#c3c6d7" opacity={0.3} />
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
              boxShadow: "0 12px 40px rgba(20, 27, 43, 0.12)",
              padding: "8px 12px",
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) =>
              typeof value === "number"
                ? isPercentage ? `${value.toFixed(2)}%` : `$${value.toLocaleString()}`
                : String(value ?? "")
            }
            labelFormatter={(_, payload) =>
              payload[0]?.payload?.fullDate ?? ""
            }
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#004ac6"
            strokeWidth={2}
            fill="url(#areaGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
