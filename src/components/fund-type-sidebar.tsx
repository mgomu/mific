"use client";


interface FundTypeSidebarProps {
  items: string[];
  selectedItem: string;
  onItemChange: (item: string) => void;
  counts: Map<string, number>;
}

/** Strips accents so keyword matching is resilient to API variations. */
function normalize(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

/** Display order, label, and icon for each fund category (matched by keyword). */
const CATEGORIES: { keyword: string; label: string; icon: string }[] = [
  { keyword: "GENERAL", label: "FIC Generales", icon: "trending_flat" },
  { keyword: "MONETARI", label: "FIC Money Market", icon: "account_balance" },
  { keyword: "BURSATIL", label: "FIC Bursátiles", icon: "show_chart" },
  { keyword: "INMOBILIARIA", label: "FIC Inmobiliarios", icon: "apartment" },
  { keyword: "CAPITAL PRIVADO", label: "Fondos de Capital Privado", icon: "public" },
];

function findCategory(item: string) {
  const norm = normalize(item);
  return CATEGORIES.find((c) => norm.includes(c.keyword));
}

function categoryIndex(item: string): number {
  const norm = normalize(item);
  const idx = CATEGORIES.findIndex((c) => norm.includes(c.keyword));
  return idx === -1 ? CATEGORIES.length : idx;
}

function getLabel(item: string): string {
  return findCategory(item)?.label ?? item;
}

function getIcon(item: string): string {
  return findCategory(item)?.icon ?? "public";
}

export function FundTypeSidebar({
  items,
  selectedItem,
  onItemChange,
  counts,
}: FundTypeSidebarProps) {
  const totalCount = Array.from(counts.values()).reduce((a, b) => a + b, 0);
  const sorted = [...items].sort((a, b) => categoryIndex(a) - categoryIndex(b));

  return (
    <aside className="h-screen w-64 sticky top-16 left-0 bg-surface-container-low flex-col gap-y-2 p-4 hidden lg:flex">
      <div className="space-y-1">
        {sorted.map((item) => (
          <button
            key={item}
            onClick={() => onItemChange(item)}
            className={`w-full text-left rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-all ${
              selectedItem === item
                ? "bg-surface-container-lowest text-primary shadow-ambient font-bold"
                : "text-on-surface-variant hover:bg-surface-container-high hover:translate-x-1"
            }`}
          >
            <span className="material-symbols-outlined">{getIcon(item)}</span>
            <span className="text-sm font-semibold truncate">{getLabel(item)}</span>
            <span className="ml-auto text-xs opacity-60 tabular-nums">{counts.get(item) ?? 0}</span>
          </button>
        ))}
      </div>

      <hr className="border-outline-variant/40 my-2" />

      <button
        onClick={() => onItemChange("")}
        className={`w-full text-left rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-all ${
          selectedItem === ""
            ? "bg-surface-container-lowest text-primary shadow-ambient font-bold"
            : "text-on-surface-variant hover:bg-surface-container-high hover:translate-x-1"
        }`}
      >
        <span className="material-symbols-outlined">list_alt</span>
        <span className="text-sm font-semibold">Todos los Fondos</span>
        <span className="ml-auto text-xs opacity-60 tabular-nums">{totalCount}</span>
      </button>
    </aside>
  );
}
