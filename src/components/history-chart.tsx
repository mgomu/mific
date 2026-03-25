"use client";

import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { FundRecord } from "@/lib/types";
import { formatShortDate, formatCOP } from "@/lib/format";

type Metric = "valorUnidad" | "rentabilidadAnual";
type Period = "1M" | "3M" | "6M" | "1A" | "Todo";

const METRIC_LABELS: Record<Metric, string> = {
  valorUnidad: "Valor de Unidad",
  rentabilidadAnual: "Rentabilidad E.A.",
};

const PERIOD_DAYS: Record<Period, number | null> = {
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1A": 365,
  Todo: null,
};

// How many days to group together per period
const PERIOD_BUCKET_DAYS: Record<Period, number> = {
  "1M": 1,
  "3M": 3,
  "6M": 7,
  "1A": 7,
  Todo: 30,
};

function aggregateData(
  records: FundRecord[],
  bucketDays: number,
  metric: Metric
): { date: string; value: number; fullDate: string }[] {
  if (bucketDays <= 1) {
    return records.map((d) => ({
      date: formatShortDate(d.fechaCorte),
      value: metric === "valorUnidad" ? d.valorUnidad : d[metric],
      fullDate: d.fechaCorte.toLocaleDateString("es-CO"),
    }));
  }

  const buckets = new Map<number, { sum: number; count: number; date: Date }>();
  const msPerDay = 86_400_000;
  const bucketMs = bucketDays * msPerDay;

  for (const d of records) {
    const key = Math.floor(d.fechaCorte.getTime() / bucketMs);
    const val = metric === "valorUnidad" ? d.valorUnidad : d[metric];
    if (val == null) continue;
    const existing = buckets.get(key);
    if (existing) {
      existing.sum += val;
      existing.count += 1;
    } else {
      buckets.set(key, { sum: val, count: 1, date: d.fechaCorte });
    }
  }

  return Array.from(buckets.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(({ sum, count, date }) => ({
      date: formatShortDate(date),
      value: sum / count,
      fullDate: date.toLocaleDateString("es-CO"),
    }));
}

export function HistoryChart({ data }: { data: FundRecord[] }) {
  const [metric, setMetric] = useState<Metric>("valorUnidad");
  const [period, setPeriod] = useState<Period>("1A");

  const filteredData = (() => {
    const days = PERIOD_DAYS[period];
    if (!days) return data;
    const since = new Date();
    since.setDate(since.getDate() - days);
    return data.filter((d) => d.fechaCorte >= since);
  })();

  const chartData = aggregateData(filteredData, PERIOD_BUCKET_DAYS[period], metric);

  const isPercentage = metric !== "valorUnidad";

  return (
    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-ambient">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary font-headline">
            Evolución Histórica
          </h2>
          <div className="flex bg-surface-container p-1 rounded-lg">
            {(Object.keys(PERIOD_DAYS) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                  period === p
                    ? "bg-white text-primary shadow-sm"
                    : "text-on-surface-variant"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex bg-surface-container p-1 rounded-lg self-start">
          {(Object.keys(METRIC_LABELS) as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${
                metric === m
                  ? "bg-white text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {METRIC_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#006a61" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#006a61" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#c5c5d3" opacity={0.3} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#444651" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={60}
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
              padding: "8px 12px",
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) =>
              [
                typeof value === "number"
                  ? isPercentage ? `${value.toFixed(2)}%` : `$${value.toLocaleString()}`
                  : String(value ?? ""),
                METRIC_LABELS[metric],
              ]
            }
            labelFormatter={(_, payload) =>
              payload[0]?.payload?.fullDate ?? ""
            }
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#00236f"
            strokeWidth={2}
            fill="url(#areaGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
      {/* Min/Avg/Max Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-6">
        {(() => {
          const values = filteredData.map((d) =>
            metric === "valorUnidad" ? d.valorUnidad : d[metric]
          ).filter((v) => v > 0);
          const minVal = values.length ? Math.min(...values) : 0;
          const maxVal = values.length ? Math.max(...values) : 0;
          const avgVal = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
          const fmt = (v: number) =>
            isPercentage ? `${v.toFixed(2)}%` : formatCOP(v);
          return (
            <>
              <div className="text-center">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Mínimo</p>
                <p className="text-sm font-bold tabular-nums">{fmt(minVal)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Promedio</p>
                <p className="text-sm font-bold tabular-nums">{fmt(avgVal)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Máximo</p>
                <p className="text-sm font-bold tabular-nums">{fmt(maxVal)}</p>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
