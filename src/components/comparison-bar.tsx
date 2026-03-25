"use client";

import Link from "next/link";

interface ComparisonBarProps {
  selectedFunds: { id: string; name: string }[];
  onRemove: (id: string) => void;
}

export function ComparisonBar({ selectedFunds, onRemove }: ComparisonBarProps) {
  if (selectedFunds.length === 0) return null;

  const compareUrl = `/comparar?ids=${selectedFunds.map((f) => f.id).join(",")}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant/20 shadow-ambient-up z-40 transition-transform">
      <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {selectedFunds.map((fund) => (
            <span
              key={fund.id}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-surface-container rounded-lg text-xs font-medium text-on-surface whitespace-nowrap"
            >
              {fund.name.length > 25
                ? fund.name.slice(0, 25) + "..."
                : fund.name}
              <button
                onClick={() => onRemove(fund.id)}
                className="text-on-surface-variant hover:text-error ml-1"
                aria-label={`Remover ${fund.name}`}
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </span>
          ))}
        </div>
        <Link
          href={selectedFunds.length >= 2 ? compareUrl : "#"}
          className={`bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg shadow-primary/20 whitespace-nowrap ${
            selectedFunds.length < 2
              ? "opacity-50 pointer-events-none"
              : "active:scale-95 transition-transform"
          }`}
          aria-disabled={selectedFunds.length < 2}
        >
          Comparar {selectedFunds.length} fondos →
        </Link>
      </div>
    </div>
  );
}
