"use client";

interface FilterBarProps {
  tipos: string[];
  admins: string[];
  subtipos: string[];
  selectedTipo: string;
  selectedAdmin: string;
  selectedSubtipo: string;
  onTipoChange: (value: string) => void;
  onAdminChange: (value: string) => void;
  onSubtipoChange: (value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

function FilterButton({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-5 py-2.5 bg-surface-container-lowest rounded-full text-sm font-medium text-on-surface shadow-sm hover:bg-surface-container-low transition-colors appearance-none cursor-pointer pr-10"
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export function FilterBar({
  tipos,
  admins,
  subtipos,
  selectedTipo,
  selectedAdmin,
  selectedSubtipo,
  onTipoChange,
  onAdminChange,
  onSubtipoChange,
  onClear,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <section className="flex flex-wrap items-center gap-4 mb-8">
      <FilterButton
        label="Tipo de fondo"
        options={tipos}
        value={selectedTipo}
        onChange={onTipoChange}
      />
      <FilterButton
        label="Administradora"
        options={admins}
        value={selectedAdmin}
        onChange={onAdminChange}
      />
      <FilterButton
        label="Subtipo"
        options={subtipos}
        value={selectedSubtipo}
        onChange={onSubtipoChange}
      />
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="text-primary text-sm font-semibold hover:underline ml-2"
        >
          Limpiar filtros
        </button>
      )}
    </section>
  );
}
