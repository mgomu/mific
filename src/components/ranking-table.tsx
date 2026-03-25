"use client";

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
      className={`p-4 text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider cursor-pointer select-none ${
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

export function RankingTable({
  funds,
  selectedIds,
  onToggleSelect,
  sortField,
  sortDir,
  onSort,
}: RankingTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low">
            <th className="p-4 w-12">
              <span className="sr-only">Select</span>
            </th>
            <SortHeader label="Nombre del fondo" field="nombrePatrimonio" currentField={sortField} currentDir={sortDir} onSort={onSort} />
            <th className="p-4 text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider">
              Administradora
            </th>
            <th className="p-4 text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider">
              Tipo
            </th>
            <SortHeader label="Valor Unidad" field="valorUnidad" currentField={sortField} currentDir={sortDir} onSort={onSort} align="right" />
            <SortHeader label="Rentabilidad Anual" field="rentabilidadAnual" currentField={sortField} currentDir={sortDir} onSort={onSort} align="right" />
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container-low">
          {funds.map((fund) => {
            const isSelected = selectedIds.includes(fund.codigoNegocio);

            return (
              <tr
                key={fund.codigoNegocio}
                className="hover:bg-surface-container-low/50 transition-colors cursor-pointer group"
              >
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(fund.codigoNegocio)}
                    className="rounded border-outline-variant text-primary focus:ring-primary"
                    aria-label={`Seleccionar ${fund.nombrePatrimonio}`}
                  />
                </td>
                <td className="p-4">
                  <Link href={`/fondo/${fund.codigoNegocio}`} className="flex flex-col">
                    <span className="text-sm font-bold text-primary group-hover:text-primary-container transition-colors">
                      {toSentenceCase(fund.nombrePatrimonio)}
                    </span>
                    <span className="text-[11px] text-on-surface-variant/60">
                      {toSentenceCase(fund.nombreTipoPatrimonio)} &middot; {toSentenceCase(fund.nombreSubtipoPatrimonio)}
                    </span>
                  </Link>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-surface-container-high rounded-full flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-on-surface-variant">
                      {fund.nombreEntidad.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-on-surface">
                      {toSentenceCase(fund.nombreEntidad)}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <FundTypeBadge type={fund.nombreSubtipoPatrimonio} />
                </td>
                <td className="p-4 text-right text-sm tabular-nums text-on-surface-variant font-mono">
                  {formatCOP(fund.valorUnidad)}
                </td>
                <td className="p-4 text-right">
                  <span className={`font-bold flex items-center gap-1 justify-end ${
                    fund.rentabilidadAnual >= 0 ? "text-secondary" : "text-error"
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
