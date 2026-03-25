"use client";

import Link from "next/link";

interface ComparisonBarProps {
  selectedFunds: { id: string; name: string }[];
  onRemove: (id: string) => void;
}

export function ComparisonBar({ selectedFunds, onRemove }: ComparisonBarProps) {
  if (selectedFunds.length === 0) return null;

  const compareUrl = `/comparar?ids=${selectedFunds.map((f) => f.id).join(",")}`;
  const canCompare = selectedFunds.length >= 2;

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center items-center pb-8 px-6 z-[60]">
      <div className="bg-surface-container-lowest/90 backdrop-blur-lg shadow-ambient-up rounded-2xl py-4 px-8 flex items-center justify-between gap-12 max-w-[800px] w-full border border-primary-fixed/20">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-primary">Comparando:</span>
          <div className="flex gap-2">
            {selectedFunds.map((fund) => (
              <div
                key={fund.id}
                className="bg-primary-fixed px-3 py-1 rounded-full flex items-center gap-2 text-xs font-semibold text-on-primary-fixed"
              >
                {fund.name}
                <button
                  onClick={() => onRemove(fund.id)}
                  className="material-symbols-outlined text-xs cursor-pointer hover:opacity-70 transition-opacity"
                >
                  close
                </button>
              </div>
            ))}
          </div>
        </div>
        <Link
          href={canCompare ? compareUrl : "#"}
          className={`rounded-full px-8 py-3 font-semibold text-sm flex items-center gap-2 transition-opacity ${
            canCompare
              ? "bg-gradient-to-r from-primary to-primary-container text-on-primary hover:opacity-90 active:scale-95"
              : "bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-50"
          }`}
          aria-disabled={!canCompare}
          tabIndex={!canCompare ? -1 : undefined}
        >
          Comparar {selectedFunds.length} fondos
          <span className="material-symbols-outlined">compare_arrows</span>
        </Link>
      </div>
    </div>
  );
}
