"use client";

import { useState, useEffect } from "react";
import type { FundRecord } from "@/lib/types";

interface FundSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (fund: FundRecord) => void;
  allFunds: FundRecord[];
  excludeIds: string[];
}

export function FundSearchModal({
  isOpen,
  onClose,
  onAdd,
  allFunds,
  excludeIds,
}: FundSearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase();
  const results = allFunds
    .filter(
      (f) =>
        !excludeIds.includes(f.codigoNegocio) &&
        (f.nombrePatrimonio.toLowerCase().includes(q) ||
          f.nombreEntidad.toLowerCase().includes(q))
    )
    .slice(0, 8);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-surface-container-lowest rounded-2xl w-[480px] max-h-[80vh] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <h3 className="text-lg font-semibold mb-4">Agregar fondo</h3>
        <input
          type="text"
          className="w-full border-none bg-surface-container-low rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none mb-4"
          placeholder="Buscar por nombre o administradora..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="space-y-1 max-h-[320px] overflow-y-auto">
          {results.map((fund) => (
            <button
              key={fund.codigoNegocio}
              onClick={() => {
                onAdd(fund);
                onClose();
              }}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface-container-low transition-colors"
            >
              <p className="text-sm font-medium text-on-surface">
                {fund.nombrePatrimonio}
              </p>
              <p className="text-xs text-on-surface-variant">
                {fund.nombreEntidad}
              </p>
            </button>
          ))}
          {results.length === 0 && query && (
            <p className="text-sm text-on-surface-variant text-center py-4">
              No se encontraron fondos
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
