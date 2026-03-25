"use client";

interface FundTypeSidebarProps {
  label: string;
  items: string[];
  selectedItem: string;
  onItemChange: (item: string) => void;
  counts: Map<string, number>;
}

export function FundTypeSidebar({
  label,
  items,
  selectedItem,
  onItemChange,
  counts,
}: FundTypeSidebarProps) {
  const totalCount = Array.from(counts.values()).reduce((a, b) => a + b, 0);

  return (
    <nav className="w-56 shrink-0 hidden lg:block" aria-label={label}>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-4 px-3">
        {label}
      </h2>
      <ul className="space-y-1">
        <li>
          <button
            onClick={() => onItemChange("")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              selectedItem === ""
                ? "bg-primary/10 text-primary font-semibold"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span className="flex items-center justify-between">
              Todos los fondos
              <span className="text-xs tabular-nums opacity-60">{totalCount}</span>
            </span>
          </button>
        </li>
        {items.map((item) => (
          <li key={item}>
            <button
              onClick={() => onItemChange(item)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                selectedItem === item
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span className="flex items-center justify-between">
                {item}
                <span className="text-xs tabular-nums opacity-60">
                  {counts.get(item) ?? 0}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
