"use client";

import { toSentenceCase } from "@/lib/format";

interface FundTypeSidebarProps {
  items: string[];
  selectedItem: string;
  onItemChange: (item: string) => void;
  counts: Map<string, number>;
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
}: FundTypeSidebarProps) {
  const totalCount = Array.from(counts.values()).reduce((a, b) => a + b, 0);

  return (
    <aside className="h-screen w-64 sticky top-16 left-0 bg-surface-container-low flex-col gap-y-2 p-4 hidden lg:flex">
      <div className="px-2 mb-4">
        <h3 className="font-bold text-lg text-primary">Filtros</h3>
        <p className="text-xs text-on-surface-variant">Refina tu búsqueda</p>
      </div>

      <div className="space-y-1">
        <button
          onClick={() => onItemChange("")}
          className={`w-full text-left rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-all ${
            selectedItem === ""
              ? "bg-surface-container-lowest text-primary shadow-ambient font-bold border-l-2 border-primary"
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
                ? "bg-surface-container-lowest text-primary shadow-ambient font-bold border-l-2 border-primary"
                : "text-on-surface-variant hover:bg-surface-container-high hover:translate-x-1"
            }`}
          >
            <span className="material-symbols-outlined">{getIcon(item)}</span>
            <span className="text-sm font-semibold truncate">{toSentenceCase(item)}</span>
            <span className="ml-auto text-xs opacity-60 tabular-nums">{counts.get(item) ?? 0}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
