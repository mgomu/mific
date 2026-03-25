"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FeedbackBubble } from "@/components/feedback-bar";

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
      <div className="grid grid-cols-3 items-center px-4 md:px-6 py-2 w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-xl md:text-2xl font-headline font-bold tracking-tight text-primary"
          >
            MiFIC
          </Link>
        </div>
        <div className="hidden sm:flex justify-center">
          <FeedbackBubble />
        </div>
        <div className="flex items-center justify-end gap-3">
          <div className="sm:hidden">
            <FeedbackBubble />
          </div>
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
