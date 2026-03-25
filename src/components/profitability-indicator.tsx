export function ProfitabilityIndicator({ value }: { value: number }) {
  if (value === 0 || isNaN(value)) {
    return (
      <span className="text-on-surface-variant text-sm tabular-nums">
        {Math.abs(value).toFixed(2)}%
      </span>
    );
  }

  const isPositive = value > 0;

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-xs ${
        isPositive
          ? "bg-secondary-fixed/30 text-secondary"
          : "bg-error-container text-error"
      }`}
    >
      <span className="material-symbols-outlined text-xs">
        {isPositive ? "north_east" : "south_west"}
      </span>
      {Math.abs(value).toFixed(2)}%
    </div>
  );
}
