"use client";

import { useState, useMemo } from "react";
import type { FundRecord } from "@/lib/types";
import { Header } from "@/components/header";
import { FundTypeSidebar } from "@/components/fund-type-sidebar";
import { RankingTable, type SortField, type SortDir } from "@/components/ranking-table";
import { ComparisonBar } from "@/components/comparison-bar";
import { formatDate, toSentenceCase, simplifyFundName } from "@/lib/format";

const PAGE_SIZE = 50;

/** Merge Money Market funds into the General FIC category. */
function normalizeFunds(raw: FundRecord[]): FundRecord[] {
  const generalSubtipo = raw.find((f) =>
    f.nombreSubtipoPatrimonio.toUpperCase().includes("GENERAL")
  )?.nombreSubtipoPatrimonio;
  if (!generalSubtipo) return raw;
  return raw.map((f) =>
    f.nombreSubtipoPatrimonio.toUpperCase().includes("MONETARI")
      ? { ...f, nombreSubtipoPatrimonio: generalSubtipo }
      : f
  );
}

export function RankingClient({
  funds: rawFunds,
}: {
  funds: FundRecord[];
}) {
  const funds = useMemo(() => normalizeFunds(rawFunds), [rawFunds]);
  const [search, setSearch] = useState("");
  const defaultSubtipo = useMemo(
    () => funds.find((f) => f.nombreSubtipoPatrimonio.toUpperCase().includes("GENERAL"))?.nombreSubtipoPatrimonio ?? "",
    [funds]
  );
  const [subtipo, setSubtipo] = useState(defaultSubtipo);
  const [administradoras_sel, setAdministradoras_sel] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("rentabilidadAnual");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const subtipos = useMemo(
    () => [...new Set(funds.map((f) => f.nombreSubtipoPatrimonio))].sort(),
    [funds]
  );

  const subtipoCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const f of funds) {
      counts.set(f.nombreSubtipoPatrimonio, (counts.get(f.nombreSubtipoPatrimonio) ?? 0) + 1);
    }
    return counts;
  }, [funds]);

  const administradoras = useMemo(
    () => [...new Set(funds.map((f) => f.nombreEntidad))].sort(),
    [funds]
  );

  const filtered = useMemo(() => {
    let result = funds;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.nombrePatrimonio.toLowerCase().includes(q) ||
          simplifyFundName(f.nombrePatrimonio).toLowerCase().includes(q) ||
          f.nombreEntidad.toLowerCase().includes(q)
      );
    }
    if (subtipo) result = result.filter((f) => f.nombreSubtipoPatrimonio === subtipo);
    if (administradoras_sel.length > 0) result = result.filter((f) => administradoras_sel.includes(f.nombreEntidad));
    return result;
  }, [funds, search, subtipo, administradoras_sel]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [filtered, sortField, sortDir]);

  const visible = sorted.slice(0, visibleCount);

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setVisibleCount(PAGE_SIZE);
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  }

  const selectedFunds = selectedIds
    .map((id) => {
      const fund = funds.find((f) => f.codigoNegocio === id);
      return fund ? { id, name: toSentenceCase(simplifyFundName(fund.nombrePatrimonio)) } : null;
    })
    .filter(Boolean) as { id: string; name: string }[];

  return (
    <>
      <Header showSearch={false} />
      <div className="flex flex-col lg:flex-row pt-14 lg:pt-20 min-h-screen">
        <FundTypeSidebar
          items={subtipos}
          selectedItem={subtipo}
          onItemChange={(v) => { setSubtipo(v); setVisibleCount(PAGE_SIZE); }}
          counts={subtipoCounts}
          fechaCorte={funds[0]?.fechaCorte}
        />

        <main className="flex-1 px-4 py-4 md:p-10 max-w-7xl mx-auto w-full">

          <div className="mb-4 md:mb-6">
            <h1 className="text-lg md:text-2xl font-bold text-primary mb-1 md:mb-2">
              Ranking de Fondos de Inversión Colectiva y Fondos de Capital Privado colombianos
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant">
              Seleccione hasta cinco fondos para comparar.
            </p>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1 md:mt-2">
              Ingrese a un fondo específico para revisar sus principales indicadores.
            </p>
          </div>

          {/* Search + Cut Date */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                search
              </span>
              <input
                type="text"
                className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm w-full max-w-sm focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Buscar fondos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {funds[0]?.fechaCorte && (
              <p className="text-xs text-on-surface-variant/60 whitespace-nowrap">
                Datos al {formatDate(funds[0].fechaCorte)}
              </p>
            )}
          </div>

          {/* Table Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden mb-8">

            {sorted.length === 0 ? (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-4">
                  search_off
                </span>
                <p className="text-lg font-semibold text-on-surface-variant">
                  No encontramos fondos con esos criterios
                </p>
                <p className="text-sm text-on-surface-variant mt-1">
                  Intenta cambiar los filtros o la búsqueda
                </p>
              </div>
            ) : (
              <>
                <RankingTable
                  funds={visible}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                  sortField={sortField}
                  sortDir={sortDir}
                  onSort={handleSort}
                  administradoras={administradoras}
                  selectedAdministradoras={administradoras_sel}
                  onAdministradorasChange={(v) => { setAdministradoras_sel(v); setVisibleCount(PAGE_SIZE); }}
                  showType={!subtipo}
                />

                {visibleCount < sorted.length && (
                  <div className="p-6 flex items-center justify-center">
                    <button
                      onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                      className="text-sm font-bold text-primary hover:text-primary-container hover:underline transition-all"
                    >
                      Load More Funds
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </main>
      </div>

      <ComparisonBar
        selectedFunds={selectedFunds}
        onRemove={(id) => toggleSelect(id)}
      />
    </>
  );
}
