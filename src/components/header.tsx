"use client";

import Link from "next/link";

export function Header({
  compareCount = 0,
  compareIds = [],
  searchValue = "",
  onSearchChange,
  showSearch = true,
}: {
  compareCount?: number;
  compareIds?: string[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}) {
  const compareUrl =
    compareIds.length >= 2
      ? `/comparar?ids=${compareIds.join(",")}`
      : "#";

  return (
    <header className="fixed top-0 w-full h-16 z-50 bg-surface-container-lowest/70 backdrop-blur-xl shadow-ambient flex items-center justify-center">
      <div className="flex items-center justify-between px-8 w-full max-w-[1440px]">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-primary"
          >
            mific
          </Link>
          {showSearch && (
            <div className="relative hidden md:block w-[400px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                search
              </span>
              <input
                type="text"
                className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Buscar fondos, administradoras..."
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link
              href="/"
              className="text-primary font-bold py-5"
            >
              Explorar
            </Link>
          </nav>
          <Link
            href={compareCount >= 2 ? compareUrl : "#"}
            className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              compareCount >= 2
                ? "bg-gradient-to-r from-primary to-primary-container text-white shadow-lg shadow-primary/20 active:scale-95"
                : "bg-surface-container-high text-on-surface-variant pointer-events-none cursor-default"
            }`}
            aria-disabled={compareCount < 2}
            tabIndex={compareCount < 2 ? -1 : undefined}
          >
            <span className="material-symbols-outlined text-base">compare_arrows</span>
            Comparar ({compareCount})
          </Link>
        </div>
      </div>
    </header>
  );
}
