"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const compareUrl =
    compareIds.length >= 2
      ? `/comparar?ids=${compareIds.join(",")}`
      : "#";

  const isExplore = pathname === "/";

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-ambient-up">
      <div className="flex items-center justify-between px-6 py-3 w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-primary"
          >
            MiFIC
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`transition-colors ${
                isExplore
                  ? "text-primary font-bold"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Explorar Fondos
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {showSearch && (
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                search
              </span>
              <input
                type="text"
                className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/20 rounded-lg text-sm w-64 focus:outline-none focus:border-primary transition-all"
                placeholder="Buscar fondos..."
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          )}
          <Link
            href={compareCount >= 2 ? compareUrl : "#"}
            className={`bg-gradient-to-r from-primary to-primary-container text-white px-5 py-2 rounded-full font-semibold text-sm hover:opacity-90 hover:translate-y-[-1px] transition-all active:scale-95 ${
              compareCount < 2 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-disabled={compareCount < 2}
            tabIndex={compareCount < 2 ? -1 : undefined}
          >
            Comparar ({compareCount})
          </Link>
        </div>
      </div>
    </nav>
  );
}
