"use client";

import Link from "next/link";

interface ComparisonBarProps {
  selectedFunds: { id: string; name: string }[];
  onRemove: (id: string) => void;
}

export function ComparisonBar({ selectedFunds, onRemove }: ComparisonBarProps) {
  if (selectedFunds.length === 0) return null;

  const canCompare = selectedFunds.length >= 2;
  const compareUrl = `/comparar?ids=${selectedFunds.map((f) => f.id).join(",")}`;

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center items-center pb-4 md:pb-8 px-3 md:px-6 z-[60]">
      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl md:rounded-full py-2.5 md:py-3 px-4 md:px-6 flex items-center gap-2 md:gap-3 max-w-[700px] w-full md:w-fit border border-primary/10">
        <span className="text-xs font-bold text-primary whitespace-nowrap">
          ({selectedFunds.length})
        </span>
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto no-scrollbar flex-1 min-w-0">
          {selectedFunds.map((fund) => (
            <div
              key={fund.id}
              className="bg-primary-fixed px-2 md:px-3 py-1 rounded-full flex items-center gap-1 md:gap-1.5 text-xs font-semibold text-on-primary-fixed whitespace-nowrap max-w-[100px] md:max-w-[150px]"
              title={fund.name}
            >
              <span className="truncate">{fund.name}</span>
              <button
                onClick={() => onRemove(fund.id)}
                className="material-symbols-outlined text-xs cursor-pointer hover:opacity-70 transition-opacity shrink-0"
              >
                close
              </button>
            </div>
          ))}
        </div>
        <Link
          href={canCompare ? compareUrl : "#"}
          className={`rounded-full px-4 md:px-5 py-2 font-semibold text-xs flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0 ${
            canCompare
              ? "bg-gradient-to-r from-primary to-primary-container text-on-primary hover:opacity-90 active:scale-95"
              : "bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-50"
          }`}
          aria-disabled={!canCompare}
          tabIndex={!canCompare ? -1 : undefined}
        >
          <span className="hidden sm:inline">Comparar</span>
          <span className="material-symbols-outlined text-sm">compare_arrows</span>
        </Link>
      </div>
    </div>
  );
}
