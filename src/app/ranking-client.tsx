"use client";

import { useState, useMemo } from "react";
import type { FundRecord } from "@/lib/types";
import { Header } from "@/components/header";
import { FundTypeSidebar } from "@/components/fund-type-sidebar";
import { RankingTable, type SortField, type SortDir } from "@/components/ranking-table";
import { ComparisonBar } from "@/components/comparison-bar";
import { toSentenceCase } from "@/lib/format";

const PAGE_SIZE = 50;

export function RankingClient({
  funds,
  fechaCorte,
}: {
  funds: FundRecord[];
  fechaCorte?: string;
}) {
  const [search, setSearch] = useState("");
  const [subtipo, setSubtipo] = useState("");
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

  const filtered = useMemo(() => {
    let result = funds;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.nombrePatrimonio.toLowerCase().includes(q) ||
          f.nombreEntidad.toLowerCase().includes(q)
      );
    }
    if (subtipo) result = result.filter((f) => f.nombreSubtipoPatrimonio === subtipo);
    return result;
  }, [funds, search, subtipo]);

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
      return fund ? { id, name: toSentenceCase(fund.nombrePatrimonio) } : null;
    })
    .filter(Boolean) as { id: string; name: string }[];

  // Compute top performing subtype
  const topType = useMemo(() => {
    const typeAvg = new Map<string, { sum: number; count: number }>();
    for (const f of funds) {
      const entry = typeAvg.get(f.nombreSubtipoPatrimonio) ?? { sum: 0, count: 0 };
      entry.sum += f.rentabilidadAnual;
      entry.count += 1;
      typeAvg.set(f.nombreSubtipoPatrimonio, entry);
    }
    let best = "";
    let bestAvg = -Infinity;
    for (const [name, { sum, count }] of typeAvg) {
      const avg = sum / count;
      if (avg > bestAvg) {
        bestAvg = avg;
        best = name;
      }
    }
    return { name: best, avg: bestAvg };
  }, [funds]);

  return (
    <>
      <Header
        compareCount={selectedIds.length}
        compareIds={selectedIds}
        searchValue={search}
        onSearchChange={setSearch}
      />
      <div className="flex pt-16 min-h-screen">
        <FundTypeSidebar
          items={subtipos}
          selectedItem={subtipo}
          onItemChange={(v) => { setSubtipo(v); setVisibleCount(PAGE_SIZE); }}
          counts={subtipoCounts}
        />

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">


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
                />

                {visibleCount < sorted.length && (
                  <div className="p-4 bg-surface-container-low/30 flex items-center justify-center">
                    <button
                      onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                      className="rounded-full border border-primary/20 hover:bg-primary-fixed/30 text-xs font-bold text-primary hover:text-primary-container px-6 py-2 transition-all"
                    >
                      Cargar Más Fondos
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
