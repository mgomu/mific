"use client";

import { useState, useMemo } from "react";
import type { FundRecord } from "@/lib/types";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FilterBar } from "@/components/filter-bar";
import { RankingTable, type SortField, type SortDir } from "@/components/ranking-table";
import { ComparisonBar } from "@/components/comparison-bar";

const PAGE_SIZE = 50;

export function RankingClient({
  funds,
  fechaCorte,
}: {
  funds: FundRecord[];
  fechaCorte?: string;
}) {
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");
  const [admin, setAdmin] = useState("");
  const [subtipo, setSubtipo] = useState("");
  const [sortField, setSortField] = useState<SortField>("rentabilidadAnual");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  const tipos = useMemo(
    () => [...new Set(funds.map((f) => f.nombreTipoPatrimonio))].sort(),
    [funds]
  );
  const admins = useMemo(
    () => [...new Set(funds.map((f) => f.nombreEntidad))].sort(),
    [funds]
  );
  const subtipos = useMemo(
    () => [...new Set(funds.map((f) => f.nombreSubtipoPatrimonio))].sort(),
    [funds]
  );

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
    if (tipo) result = result.filter((f) => f.nombreTipoPatrimonio === tipo);
    if (admin) result = result.filter((f) => f.nombreEntidad === admin);
    if (subtipo)
      result = result.filter((f) => f.nombreSubtipoPatrimonio === subtipo);
    return result;
  }, [funds, search, tipo, admin, subtipo]);

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

  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(0);
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
      return fund ? { id, name: fund.nombrePatrimonio } : null;
    })
    .filter(Boolean) as { id: string; name: string }[];

  const hasActiveFilters = !!(tipo || admin || subtipo);

  return (
    <>
      <Header
        compareCount={selectedIds.length}
        compareIds={selectedIds}
        searchValue={search}
        onSearchChange={setSearch}
      />
      <main className="pt-24 pb-32 px-8 max-w-[1440px] mx-auto min-h-screen">
        <section className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">
            Fondos de Inversión Colectiva
          </h1>
          <p className="text-on-surface-variant text-lg">
            {sorted.length} fondos disponibles
            {fechaCorte && ` · Datos al ${fechaCorte}`}
          </p>
        </section>

        <FilterBar
          tipos={tipos}
          admins={admins}
          subtipos={subtipos}
          selectedTipo={tipo}
          selectedAdmin={admin}
          selectedSubtipo={subtipo}
          onTipoChange={(v) => { setTipo(v); setPage(0); }}
          onAdminChange={(v) => { setAdmin(v); setPage(0); }}
          onSubtipoChange={(v) => { setSubtipo(v); setPage(0); }}
          onClear={() => { setTipo(""); setAdmin(""); setSubtipo(""); setPage(0); }}
          hasActiveFilters={hasActiveFilters}
        />

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
              funds={paginated}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              sortField={sortField}
              sortDir={sortDir}
              onSort={handleSort}
            />

            {totalPages > 1 && (
              <div className="flex items-center justify-end gap-4 mt-6">
                <span className="text-xs text-on-surface-variant">
                  Mostrando {page * PAGE_SIZE + 1}-
                  {Math.min((page + 1) * PAGE_SIZE, sorted.length)} de{" "}
                  {sorted.length}
                </span>
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                  className="px-4 py-2 border border-outline-variant/40 rounded-lg text-sm disabled:opacity-40"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 border border-outline-variant/40 rounded-lg text-sm disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer fechaCorte={fechaCorte} />
      <ComparisonBar
        selectedFunds={selectedFunds}
        onRemove={(id) => toggleSelect(id)}
      />
    </>
  );
}
