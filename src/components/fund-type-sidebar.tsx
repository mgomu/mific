"use client";

import { toSentenceCase } from "@/lib/format";

interface FundTypeSidebarProps {
  items: string[];
  selectedItem: string;
  onItemChange: (item: string) => void;
  counts: Map<string, number>;
  onReset?: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  "": "list_alt",
  "GENERAL": "trending_flat",
  "INMOBILIARIO": "apartment",
  "BURSÁTIL": "show_chart",
  "MERCADO MONETARIO": "account_balance",
  "DEL MERCADO MONETARIO": "account_balance",
};

function getIcon(item: string): string {
  const upper = item.toUpperCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (key && upper.includes(key)) return icon;
  }
  return "public";
}

export function FundTypeSidebar({
  items,
  selectedItem,
  onItemChange,
  counts,
  onReset,
}: FundTypeSidebarProps) {
  const totalCount = Array.from(counts.values()).reduce((a, b) => a + b, 0);
  const hasFilters = !!selectedItem;

  return (
    <aside className="h-screen w-64 sticky top-16 left-0 bg-surface-container-low flex-col gap-y-2 p-4 hidden lg:flex">
      <div className="px-2 mb-4">
        <h3 className="font-display font-bold text-lg text-primary">Filtros</h3>
        <p className="text-xs text-on-surface-variant">Refina tu búsqueda</p>
      </div>

      <div className="space-y-1">
        <button
          onClick={() => onItemChange("")}
          className={`w-full text-left rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-all ${
            selectedItem === ""
              ? "bg-white text-primary shadow-sm font-bold"
              : "text-on-surface-variant hover:bg-surface-container-high hover:translate-x-1"
          }`}
        >
          <span className="material-symbols-outlined">list_alt</span>
          <span className="text-sm font-semibold">Todos los Fondos</span>
          <span className="ml-auto text-xs opacity-60 tabular-nums">{totalCount}</span>
        </button>
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onItemChange(item)}
            className={`w-full text-left rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-all ${
              selectedItem === item
                ? "bg-white text-primary shadow-sm font-bold"
                : "text-on-surface-variant hover:bg-surface-container-high hover:translate-x-1"
            }`}
          >
            <span className="material-symbols-outlined">{getIcon(item)}</span>
            <span className="text-sm font-semibold truncate">{toSentenceCase(item)}</span>
            <span className="ml-auto text-xs opacity-60 tabular-nums">{counts.get(item) ?? 0}</span>
          </button>
        ))}
      </div>

      {hasFilters && onReset && (
        <button
          onClick={onReset}
          className="mt-auto mb-4 w-full py-2 px-4 text-sm font-bold text-primary border border-primary/10 rounded-lg hover:bg-white hover:shadow-sm transition-all active:scale-95"
        >
          Limpiar Filtros
        </button>
      )}

      <div className="flex flex-col gap-1 border-t border-outline-variant/20 pt-4 mt-auto">
        <span className="text-xs font-semibold text-on-surface-variant/60 hover:text-primary flex items-center gap-2 p-1 cursor-pointer">
          <span className="material-symbols-outlined text-sm">help</span> Centro de Ayuda
        </span>
        <span className="text-xs font-semibold text-on-surface-variant/60 hover:text-primary flex items-center gap-2 p-1 cursor-pointer">
          <span className="material-symbols-outlined text-sm">shield</span> Privacidad
        </span>
      </div>
    </aside>
  );
}
