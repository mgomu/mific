"use client";

import Link from "next/link";

interface MobileComparisonCardProps {
  selectedFunds: { id: string; name: string }[];
  onRemove: (id: string) => void;
}

const MAX_VISIBLE_AVATARS = 3;

export function MobileComparisonCard({
  selectedFunds,
  onRemove,
}: MobileComparisonCardProps) {
  const canCompare = selectedFunds.length >= 2;
  const compareUrl = `/comparar?ids=${selectedFunds.map((f) => f.id).join(",")}`;
  const visibleFunds = selectedFunds.slice(0, MAX_VISIBLE_AVATARS);
  const overflow = selectedFunds.length - MAX_VISIBLE_AVATARS;

  return (
    <div
      className={`md:hidden fixed bottom-4 left-3 right-3 z-[60] transition-all duration-300 ease-out ${
        selectedFunds.length > 0
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white/70 backdrop-blur-xl border border-primary/20 p-3 rounded-xl flex items-center justify-between shadow-ambient-hover">
        {/* Overlapping avatars */}
        <div className="flex -space-x-3">
          {visibleFunds.map((fund, i) => (
            <button
              key={fund.id}
              onClick={() => onRemove(fund.id)}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold border-2 border-surface active:scale-90 transition-transform"
              style={{ zIndex: MAX_VISIBLE_AVATARS - i }}
              title={fund.name}
            >
              {fund.name.slice(0, 2).toUpperCase()}
            </button>
          ))}
          {overflow > 0 && (
            <div className="w-8 h-8 rounded-full bg-outline flex items-center justify-center text-[10px] text-white font-bold border-2 border-surface">
              +{overflow}
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          href={canCompare ? compareUrl : "#"}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
            canCompare
              ? "bg-primary-container text-white"
              : "bg-surface-container-high text-on-surface-variant/50 cursor-not-allowed"
          }`}
          aria-disabled={!canCompare}
          tabIndex={!canCompare ? -1 : undefined}
        >
          Comparar Ahora
        </Link>
      </div>
    </div>
  );
}
