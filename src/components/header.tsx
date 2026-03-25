"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header({
  searchValue = "",
  onSearchChange,
  showSearch = true,
}: {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container-lowest backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-3 w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-headline font-bold tracking-tight text-primary"
          >
            MiFIC
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {showSearch && (
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                search
              </span>
              <input
                type="text"
                className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Buscar fondos..."
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
