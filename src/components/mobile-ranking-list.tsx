"use client";

import Link from "next/link";
import type { FundRecord } from "@/lib/types";
import { formatCompactCOP, toSentenceCase, simplifyFundName } from "@/lib/format";

interface MobileRankingListProps {
  funds: FundRecord[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

export function MobileRankingList({
  funds,
  selectedIds,
  onToggleSelect,
}: MobileRankingListProps) {
  return (
    <div className="space-y-1">
      {/* Column headers */}
      <div className="grid grid-cols-12 px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/60">
        <div className="col-span-1"><span className="sr-only">Seleccionar</span></div>
        <div className="col-span-6">Nombre del Fondo</div>
        <div className="col-span-2 text-right">Rent.</div>
        <div className="col-span-3 text-right">AUM</div>
      </div>

      {funds.map((fund, idx) => {
        const isSelected = selectedIds.includes(fund.codigoNegocio);

        return (
          <div
            key={fund.codigoNegocio}
            className={`grid grid-cols-12 items-center px-4 py-3 rounded-lg border-b border-outline-variant/10 transition-colors ${
              idx % 2 === 0
                ? "bg-surface-container-lowest"
                : "bg-surface-container-low/30"
            } ${isSelected ? "ring-1 ring-primary/20" : ""}`}
          >
            {/* Checkbox */}
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(fund.codigoNegocio)}
                className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4"
                aria-label={`Seleccionar ${fund.nombrePatrimonio}`}
              />
            </div>

            {/* Fund name + admin entity */}
            <div className="col-span-5 pr-2 min-w-0">
              <Link href={`/fondo/${fund.codigoNegocio}`}>
                <p className="font-headline font-bold text-sm text-primary leading-tight truncate">
                  {toSentenceCase(simplifyFundName(fund.nombrePatrimonio))}
                </p>
                <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-tighter truncate">
                  {toSentenceCase(fund.nombreEntidad)}
                </p>
              </Link>
            </div>

            {/* Return % */}
            <div className="col-span-3 text-right">
              <span
                className={`font-bold text-sm ${
                  fund.rentabilidadAnual >= 0 ? "text-secondary" : "text-error"
                }`}
              >
                {fund.rentabilidadAnual.toFixed(1)}%
              </span>
            </div>

            {/* AUM */}
            <div className="col-span-3 text-right">
              <span className="font-medium text-on-surface-variant text-xs tabular-nums">
                {formatCompactCOP(fund.valorFondo)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
