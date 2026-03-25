import { ProfitabilityIndicator } from "./profitability-indicator";

export function MetricCard({
  label,
  value,
  isProfitability = false,
  numericValue,
}: {
  label: string;
  value: string;
  isProfitability?: boolean;
  numericValue?: number;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 hover:shadow-ambient-hover transition-shadow">
      <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-2">
        {label}
      </p>
      {isProfitability && numericValue !== undefined ? (
        <div className="mt-1">
          <span className="text-2xl font-bold text-on-surface tabular-nums">
            {Math.abs(numericValue).toFixed(2)}%
          </span>
          <div className="mt-1">
            <ProfitabilityIndicator value={numericValue} />
          </div>
        </div>
      ) : (
        <p className="text-2xl font-bold text-on-surface tabular-nums">
          {value}
        </p>
      )}
    </div>
  );
}
