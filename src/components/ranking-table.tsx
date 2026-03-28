"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { FundRecord } from "@/lib/types";
import { FundTypeBadge } from "./fund-type-badge";
import { formatCOP, formatCompactCOP, toSentenceCase, simplifyFundName } from "@/lib/format";

type SortField = "nombrePatrimonio" | "valorFondo" | "valorUnidad" | "rentabilidadAnual";
type SortDir = "asc" | "desc";

interface RankingTableProps {
  funds: FundRecord[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
  administradoras: string[];
  selectedAdministradoras: string[];
  onAdministradorasChange: (value: string[]) => void;
  showType?: boolean;
}

function SortHeader({
  label,
  field,
  currentField,
  currentDir,
  onSort,
  align = "left",
  className = "",
}: {
  label: string;
  field: SortField;
  currentField: SortField;
  currentDir: SortDir;
  onSort: (f: SortField) => void;
  align?: "left" | "right";
  className?: string;
}) {
  const isActive = currentField === field;
  return (
    <th
      className={`px-4 py-3 text-xs font-bold text-on-surface-variant tracking-wide cursor-pointer select-none bg-surface-container-high border-b border-r border-outline-variant/8 last:border-r-0 ${
        align === "right" ? "text-right" : ""
      } ${className}`}
      onClick={() => onSort(field)}
    >
      <div className={`inline-flex items-center gap-1 ${align === "right" ? "flex-row-reverse" : ""}`}>
        {label}
        <span className="material-symbols-outlined text-xs">
          {isActive
            ? currentDir === "asc"
              ? "arrow_upward"
              : "arrow_downward"
            : "unfold_more"}
        </span>
      </div>
    </th>
  );
}

function AdminFilterHeader({
  administradoras,
  selected,
  onChange,
  className = "",
}: {
  administradoras: string[];
  selected: string[];
  onChange: (value: string[]) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const ref = useRef<HTMLTableHeaderCellElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setFilterSearch("");
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const filtered = filterSearch
    ? administradoras.filter((a) => a.toLowerCase().includes(filterSearch.toLowerCase()))
    : administradoras;

  const hasFilter = selected.length > 0;

  function toggle(admin: string) {
    if (selected.includes(admin)) {
      onChange(selected.filter((a) => a !== admin));
    } else {
      onChange([...selected, admin]);
    }
  }

  return (
    <th className={`px-4 py-3 text-xs font-bold text-on-surface-variant tracking-wide relative bg-surface-container-high border-b border-r border-outline-variant/8 ${className}`} ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 cursor-pointer select-none hover:text-on-surface transition-colors ${
          hasFilter ? "text-primary" : ""
        }`}
      >
        Sociedad Administradora
        {hasFilter && (
          <span className="ml-0.5 bg-primary text-on-primary text-[10px] font-bold rounded-full w-4 h-4 inline-flex items-center justify-center">
            {selected.length}
          </span>
        )}
        <span className="material-symbols-outlined text-xs">
          {hasFilter ? "filter_alt" : "filter_list"}
        </span>
      </button>

      {hasFilter && (
        <button
          onClick={(e) => { e.stopPropagation(); onChange([]); }}
          className="ml-1 inline-flex items-center text-primary hover:text-error transition-colors"
          title="Quitar filtros"
        >
          <span className="material-symbols-outlined text-xs">close</span>
        </button>
      )}

      {open && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-surface-container-lowest rounded-2xl shadow-ambient-hover border border-outline-variant/10 w-72 overflow-hidden">
          <div className="p-3">
            <div className="relative">
              <span className="material-symbols-outlined text-sm text-on-surface-variant/40 absolute left-3 top-1/2 -translate-y-1/2">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar sociedad administradora..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="w-full text-xs px-3 pl-9 py-2.5 rounded-xl bg-surface-container-high-low border border-outline-variant/10 outline-none placeholder:text-on-surface-variant/40 text-on-surface focus:border-primary/30 transition-colors"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto px-2 pb-2">
            {filtered.map((admin) => {
              const isChecked = selected.includes(admin);
              return (
                <button
                  key={admin}
                  onClick={() => toggle(admin)}
                  className={`w-full text-left px-3 py-2.5 text-xs rounded-xl transition-colors flex items-center gap-2.5 ${
                    isChecked
                      ? "bg-primary-fixed/40 text-primary font-semibold"
                      : "text-on-surface hover:bg-surface-container-high-low"
                  }`}
                >
                  <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-colors ${
                    isChecked
                      ? "bg-primary border-primary"
                      : "border-outline-variant/40 bg-surface-container-lowest"
                  }`}>
                    {isChecked && (
                      <span className="material-symbols-outlined text-on-primary text-[11px]">check</span>
                    )}
                  </div>
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[7px] font-bold ${
                    isChecked
                      ? "bg-primary/10 text-primary"
                      : "bg-surface-container-high-high text-on-surface-variant/60"
                  }`}>
                    {admin.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="truncate">{toSentenceCase(admin)}</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-xs text-on-surface-variant/50 text-center">Sin resultados</p>
            )}
          </div>
          {hasFilter && (
            <div className="px-3 pb-3">
              <button
                onClick={() => { onChange([]); setOpen(false); setFilterSearch(""); }}
                className="w-full text-center text-xs font-semibold text-on-surface-variant/60 hover:text-error py-2 rounded-xl hover:bg-error/5 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      )}
    </th>
  );
}

export function RankingTable({
  funds,
  selectedIds,
  onToggleSelect,
  sortField,
  sortDir,
  onSort,
  administradoras,
  selectedAdministradoras,
  onAdministradorasChange,
  showType = true,
}: RankingTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-3 w-12 bg-surface-container-high border-b border-r border-outline-variant/8">
              <span className="sr-only">Select</span>
            </th>
            <SortHeader label="Nombre del fondo" field="nombrePatrimonio" currentField={sortField} currentDir={sortDir} onSort={onSort} />
            {/* Rentabilidad: 2nd column on mobile */}
            <SortHeader label="Rentabilidad Efectiva Anual" field="rentabilidadAnual" currentField={sortField} currentDir={sortDir} onSort={onSort} align="right" />
            {/* Desktop-only columns */}
            <AdminFilterHeader
              administradoras={administradoras}
              selected={selectedAdministradoras}
              onChange={onAdministradorasChange}
              className="hidden md:table-cell"
            />
            {showType && (
              <th className="px-4 py-3 text-xs font-bold text-on-surface-variant tracking-wide bg-surface-container-high border-b border-r border-outline-variant/8 hidden md:table-cell">
                Tipo
              </th>
            )}
            <SortHeader label="Activos Administrados" field="valorFondo" currentField={sortField} currentDir={sortDir} onSort={onSort} align="right" className="hidden md:table-cell" />
            <SortHeader label="Valor Unidad" field="valorUnidad" currentField={sortField} currentDir={sortDir} onSort={onSort} align="right" className="hidden md:table-cell" />
          </tr>
        </thead>
        <tbody>
          {funds.map((fund, idx) => {
            const isSelected = selectedIds.includes(fund.codigoNegocio);

            return (
              <tr
                key={fund.codigoNegocio}
                className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors duration-200 ease-out cursor-pointer group"
              >
                <td className="px-4 py-5 border-b border-r border-outline-variant/8" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(fund.codigoNegocio)}
                    className="rounded border-outline-variant text-primary focus:ring-primary"
                    aria-label={`Seleccionar ${fund.nombrePatrimonio}`}
                  />
                </td>
                <td className="px-4 py-5 border-b border-r border-outline-variant/8">
                  <Link href={`/fondo/${fund.codigoNegocio}`}>
                    <span className="text-sm font-bold text-primary group-hover:text-primary-container transition-colors">
                      {toSentenceCase(simplifyFundName(fund.nombrePatrimonio))}
                    </span>
                  </Link>
                </td>
                {/* Rentabilidad: 2nd column on mobile */}
                <td className="px-4 py-5 text-right border-b border-r border-outline-variant/8">
                  <span className={`font-bold flex items-center gap-1 justify-end ${
                    fund.rentabilidadAnual >= 0 ? "text-secondary" : "text-error"
                  }`}>
                    <span className="material-symbols-outlined text-sm">
                      {fund.rentabilidadAnual >= 0 ? "trending_up" : "trending_down"}
                    </span>
                    {fund.rentabilidadAnual.toFixed(1)}%
                  </span>
                </td>
                {/* Desktop-only columns */}
                <td className="px-4 py-5 border-b border-r border-outline-variant/8 hidden md:table-cell">
                  <span className="text-sm font-medium text-on-surface">
                    {toSentenceCase(fund.nombreEntidad)}
                  </span>
                </td>
                {showType && (
                  <td className="px-4 py-5 border-b border-r border-outline-variant/8 hidden md:table-cell">
                    <FundTypeBadge type={fund.nombreSubtipoPatrimonio} />
                  </td>
                )}
                <td className="px-4 py-5 text-right text-sm tabular-nums text-on-surface-variant font-mono border-b border-r border-outline-variant/8 hidden md:table-cell">
                  {formatCompactCOP(fund.valorFondo)}
                </td>
                <td className="px-4 py-5 text-right text-sm tabular-nums text-on-surface-variant font-mono border-b border-r border-outline-variant/8 hidden md:table-cell">
                  {formatCOP(fund.valorUnidad)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export type { SortField, SortDir };
