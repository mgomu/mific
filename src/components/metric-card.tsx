import { ProfitabilityIndicator } from "./profitability-indicator";

export function MetricCard({
  label,
  value,
  isProfitability = false,
  numericValue,
  borderColor,
  subtitle,
  suffix,
}: {
  label: string;
  value: string;
  isProfitability?: boolean;
  numericValue?: number;
  borderColor?: string;
  subtitle?: string;
  suffix?: string;
}) {
  return (
    <div
      className={`bg-surface-container-lowest rounded-xl p-6 shadow-ambient hover:shadow-ambient-hover transition-shadow ${
        borderColor ? `border-l-4 ${borderColor}` : ""
      }`}
    >
      <p className="text-sm font-semibold text-on-surface-variant mb-4 uppercase tracking-wider">
        {label}
      </p>
      {isProfitability && numericValue !== undefined ? (
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-tertiary tabular-nums">
              {Math.abs(numericValue).toFixed(2)}%
            </span>
            {suffix && (
              <span className="text-xs font-bold text-tertiary">{suffix}</span>
            )}
          </div>
          <div className="mt-1">
            <ProfitabilityIndicator value={numericValue} />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-on-surface tabular-nums">
              {value}
            </p>
            {suffix && (
              <span className="text-xs font-medium text-on-surface-variant">{suffix}</span>
            )}
          </div>
        </div>
      )}
      {subtitle && (
        <p className="text-xs text-on-surface-variant mt-2">{subtitle}</p>
      )}
    </div>
  );
}
