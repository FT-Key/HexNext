"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import type { SortOption } from "@/core/use-cases/catalog/types";

interface SortDropdownProps {
  currentSort: SortOption;
  productCount: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "nombre-asc", label: "Nombre A-Z" },
  { value: "nombre-desc", label: "Nombre Z-A" },
  { value: "precio-asc", label: "Menor precio" },
  { value: "precio-desc", label: "Mayor precio" },
  { value: "fecha-desc", label: "Más nuevos" },
  { value: "popular-desc", label: "Más populares" },
];

export function SortDropdown({ currentSort, productCount }: SortDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      const value = e.target.value;
      if (value === "nombre-asc") {
        params.delete("orden");
      } else {
        params.set("orden", value);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {productCount} producto{productCount !== 1 ? "s" : ""}
      </span>
      <div className="ml-auto flex items-center gap-2">
        <label htmlFor="sort-select" className="text-sm text-muted-foreground">
          Ordenar:
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={handleChange}
          className="rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
