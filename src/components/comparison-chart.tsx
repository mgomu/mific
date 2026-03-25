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
  Legend,
} from "recharts";
import type { FundRecord } from "@/lib/types";
import { formatShortDate } from "@/lib/format";

const CHART_COLORS = ["#2563eb", "#7C3AED", "#F59E0B", "#10B981", "#EF4444"];

type Metric = "rentabilidadAnual" | "rentabilidadMensual" | "rentabilidadSemestral" | "valorUnidad";
type Period = "3M" | "6M" | "1A" | "2A" | "Todo";

const METRIC_LABELS: Record<Metric, string> = {
  rentabilidadMensual: "Rent. mensual",
  rentabilidadSemestral: "Rent. semestral",
  rentabilidadAnual: "Rent. anual",
  valorUnidad: "Valor de la unidad",
};

const PERIOD_DAYS: Record<Period, number | null> = {
  "3M": 90,
  "6M": 180,
  "1A": 365,
  "2A": 730,
  Todo: null,
};

interface ComparisonChartProps {
  fundData: Map<string, FundRecord[]>;
  fundNames: Map<string, string>;
}

export function ComparisonChart({ fundData, fundNames }: ComparisonChartProps) {
  const [metric, setMetric] = useState<Metric>("rentabilidadAnual");
  const [period, setPeriod] = useState<Period>("1A");
  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set());

  const codigos = [...fundData.keys()];
  const days = PERIOD_DAYS[period];
  const since = days ? new Date(Date.now() - days * 86400000) : null;

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
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient">
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

      <div className="flex gap-2 mb-6">
        {(Object.keys(PERIOD_DAYS) as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              period === p
                ? "bg-primary text-white"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#c5c5d3" opacity={0.3} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#444651" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#444651" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => (isPercentage ? `${v}%` : `$${v.toLocaleString()}`)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "none",
              borderRadius: 8,
              boxShadow: "0 12px 40px rgba(0, 35, 111, 0.12)",
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
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-4 mt-4 justify-center">
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
            className={`flex items-center gap-2 text-xs text-on-surface-variant transition-opacity ${
              hiddenLines.has(codigo) ? "opacity-40" : ""
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            {fundNames.get(codigo) ?? codigo}
          </button>
        ))}
      </div>
    </div>
  );
}
