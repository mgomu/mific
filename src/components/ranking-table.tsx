"use client";

import Link from "next/link";
import type { FundRecord } from "@/lib/types";
import { FundTypeBadge } from "./fund-type-badge";
import { ProfitabilityIndicator } from "./profitability-indicator";
import { formatCOP } from "@/lib/format";

type SortField = "nombrePatrimonio" | "valorUnidad" | "rentabilidadMensual" | "rentabilidadSemestral" | "rentabilidadAnual";
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
  isDefault = false,
}: {
  label: string;
  field: SortField;
  currentField: SortField;
  currentDir: SortDir;
  onSort: (f: SortField) => void;
  align?: "left" | "right";
  isDefault?: boolean;
}) {
  const isActive = currentField === field;
  return (
    <th
      className={`px-6 py-4 cursor-pointer select-none ${
        align === "right" ? "text-right" : ""
      } ${isActive || isDefault ? "bg-primary/5 text-primary" : ""}`}
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
    <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 w-12 text-center">
                <span className="sr-only">Seleccionar</span>
              </th>
              <th className="px-4 py-4 w-12 tabular-nums">#</th>
              <SortHeader label="Fondo" field="nombrePatrimonio" currentField={sortField} currentDir={sortDir} onSort={onSort} />
              <th className="px-6 py-4">Tipo</th>
              <SortHeader label="Valor unidad" field="valorUnidad" currentField={sortField} currentDir={sortDir} onSort={onSort} align="right" />
              <SortHeader label="Rent. mensual" field="rentabilidadMensual" currentField={sortField} currentDir={sortDir} onSort={onSort} align="right" />
              <SortHeader label="Rent. semestral" field="rentabilidadSemestral" currentField={sortField} currentDir={sortDir} onSort={onSort} align="right" />
              <SortHeader label="Rent. anual" field="rentabilidadAnual" currentField={sortField} currentDir={sortDir} onSort={onSort} align="right" isDefault={sortField === "rentabilidadAnual"} />
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {funds.map((fund, index) => {
              const isSelected = selectedIds.includes(fund.codigoNegocio);
              return (
                <tr
                  key={fund.codigoNegocio}
                  className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(fund.codigoNegocio)}
                      className="rounded border-outline-variant text-primary focus:ring-primary"
                      aria-label={`Seleccionar ${fund.nombrePatrimonio}`}
                    />
                  </td>
                  <td className="px-4 py-4 text-sm tabular-nums font-medium text-on-surface-variant">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/fondo/${fund.codigoNegocio}`} className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                        {fund.nombrePatrimonio}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {fund.nombreEntidad}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <FundTypeBadge type={fund.nombreTipoPatrimonio} />
                  </td>
                  <td className="px-6 py-4 text-right text-sm tabular-nums">
                    {formatCOP(fund.valorUnidad)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ProfitabilityIndicator value={fund.rentabilidadMensual} />
                  </td>
                  <td className="px-6 py-4 text-right text-sm tabular-nums">
                    {fund.rentabilidadSemestral.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 text-right text-sm tabular-nums font-bold text-primary bg-primary/5">
                    {fund.rentabilidadAnual.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export type { SortField, SortDir };
