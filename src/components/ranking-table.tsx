"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { FundRecord } from "@/lib/types";
import { FundTypeBadge } from "./fund-type-badge";
import { formatCOP, toSentenceCase } from "@/lib/format";

type SortField = "nombrePatrimonio" | "valorUnidad" | "rentabilidadAnual";
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
}

function SortHeader({
  label,
  field,
  currentField,
  currentDir,
  onSort,
  align = "left",
}: {
  label: string;
  field: SortField;
  currentField: SortField;
  currentDir: SortDir;
  onSort: (f: SortField) => void;
  align?: "left" | "right";
}) {
  const isActive = currentField === field;
  return (
    <th
      className={`px-4 py-4 text-xs font-bold text-on-surface-variant/60 tracking-wider cursor-pointer select-none ${
        align === "right" ? "text-right" : ""
      }`}
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
}: {
  administradoras: string[];
  selected: string[];
  onChange: (value: string[]) => void;
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
    <th className="p-4 text-xs font-bold text-on-surface-variant/60 tracking-wider relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 cursor-pointer select-none hover:text-on-surface transition-colors ${
          hasFilter ? "text-primary" : ""
        }`}
      >
        Administradora
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
        <div className="absolute top-full left-0 mt-1 z-50 bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant/20 w-72 overflow-hidden">
          <div className="p-2 border-b border-surface-container-low">
            <input
              type="text"
              placeholder="Buscar administradora..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg bg-surface-container-low outline-none placeholder:text-on-surface-variant/40"
              autoFocus
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.map((admin) => {
              const isChecked = selected.includes(admin);
              return (
                <button
                  key={admin}
                  onClick={() => toggle(admin)}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container-low transition-colors flex items-center gap-2 ${
                    isChecked ? "text-primary font-bold" : "text-on-surface"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="rounded border-outline-variant text-primary focus:ring-primary pointer-events-none"
                  />
                  <div className="w-5 h-5 bg-surface-container-high rounded-full flex-shrink-0 flex items-center justify-center text-[7px] font-bold text-on-surface-variant">
                    {admin.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="truncate">{toSentenceCase(admin)}</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-sm text-on-surface-variant/60">Sin resultados</p>
            )}
          </div>
          {hasFilter && (
            <div className="p-2 border-t border-surface-container-low">
              <button
                onClick={() => { onChange([]); setOpen(false); setFilterSearch(""); }}
                className="w-full text-center text-xs font-semibold text-primary hover:underline py-1"
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
}: RankingTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low">
            <th className="px-4 py-4 w-12">
              <span className="sr-only">Select</span>
            </th>
            <SortHeader label="Nombre del fondo" field="nombrePatrimonio" currentField={sortField} currentDir={sortDir} onSort={onSort} />
            <AdminFilterHeader
              administradoras={administradoras}
              selected={selectedAdministradoras}
              onChange={onAdministradorasChange}
            />
            <th className="px-4 py-4 text-xs font-bold text-on-surface-variant/60 tracking-wider">
              Tipo
            </th>
            <SortHeader label="Valor Unidad" field="valorUnidad" currentField={sortField} currentDir={sortDir} onSort={onSort} align="right" />
            <SortHeader label="Rentabilidad Anual" field="rentabilidadAnual" currentField={sortField} currentDir={sortDir} onSort={onSort} align="right" />
          </tr>
        </thead>
        <tbody>
          {funds.map((fund, idx) => {
            const isSelected = selectedIds.includes(fund.codigoNegocio);

            return (
              <tr
                key={fund.codigoNegocio}
                className={`hover:bg-surface-container-low/60 transition-colors cursor-pointer group ${
                  idx % 2 === 0 ? "bg-surface-container-lowest" : "bg-surface"
                }`}
              >
                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(fund.codigoNegocio)}
                    className="rounded border-outline-variant text-primary focus:ring-primary"
                    aria-label={`Seleccionar ${fund.nombrePatrimonio}`}
                  />
                </td>
                <td className="px-4 py-4">
                  <Link href={`/fondo/${fund.codigoNegocio}`} className="flex flex-col">
                    <span className="text-sm font-bold text-primary group-hover:text-primary-container transition-colors">
                      {toSentenceCase(fund.nombrePatrimonio)}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-surface-container-high rounded-full flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-on-surface-variant">
                      {fund.nombreEntidad.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-on-surface">
                      {toSentenceCase(fund.nombreEntidad)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <FundTypeBadge type={fund.nombreSubtipoPatrimonio} />
                </td>
                <td className="px-4 py-4 text-right text-sm tabular-nums text-on-surface-variant font-mono">
                  {formatCOP(fund.valorUnidad)}
                </td>
                <td className="px-4 py-4 text-right">
                  <span className={`font-bold flex items-center gap-1 justify-end ${
                    fund.rentabilidadAnual >= 0 ? "text-tertiary" : "text-error"
                  }`}>
                    <span className="material-symbols-outlined text-sm">
                      {fund.rentabilidadAnual >= 0 ? "trending_up" : "trending_down"}
                    </span>
                    {fund.rentabilidadAnual.toFixed(1)}%
                  </span>
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
