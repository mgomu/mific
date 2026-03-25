"use client";

interface FundTypeSidebarProps {
  tipos: string[];
  selectedTipo: string;
  onTipoChange: (tipo: string) => void;
  counts: Map<string, number>;
}

export function FundTypeSidebar({
  tipos,
  selectedTipo,
  onTipoChange,
  counts,
}: FundTypeSidebarProps) {
  const totalCount = Array.from(counts.values()).reduce((a, b) => a + b, 0);

  return (
    <nav className="w-56 shrink-0 hidden lg:block" aria-label="Tipo de fondo">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-4 px-3">
        Tipo de fondo
      </h2>
      <ul className="space-y-1">
        <li>
          <button
            onClick={() => onTipoChange("")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              selectedTipo === ""
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
        {tipos.map((tipo) => (
          <li key={tipo}>
            <button
              onClick={() => onTipoChange(tipo)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                selectedTipo === tipo
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span className="flex items-center justify-between">
                {tipo}
                <span className="text-xs tabular-nums opacity-60">
                  {counts.get(tipo) ?? 0}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
