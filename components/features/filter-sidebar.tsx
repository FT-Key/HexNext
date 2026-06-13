"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { FilterOptions } from "@/core/use-cases/catalog/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface FilterSidebarProps {
  filterOptions: FilterOptions;
}

function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateUrl = useCallback(
    (updates: { key: string; value: string | null }[]) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const { key, value } of updates) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return { searchParams, updateUrl, clearFilters };
}

function SpecFilterGroup({
  spec,
  selectedValues,
  onToggle,
}: {
  spec: FilterOptions["specFilters"][number];
  selectedValues: string[];
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 py-1 text-left text-sm font-medium"
      >
        <svg
          className={`size-3 transition-transform ${open ? "rotate-90" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        {spec.nombre}
      </button>
      {open && (
        <div className="ml-3 space-y-1.5 pb-2">
          {spec.valores.map((v) => (
            <label
              key={v.valor}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <Checkbox
                checked={selectedValues.includes(v.valor)}
                onCheckedChange={() => onToggle(v.valor)}
              />
              <span className="flex-1">{v.valor}</span>
              <span className="text-xs text-muted-foreground">({v.count})</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function FilterSidebar({ filterOptions }: FilterSidebarProps) {
  const { searchParams, updateUrl, clearFilters } = useFilters();

  const [localPrecioMin, setLocalPrecioMin] = useState(
    searchParams.get("precioMin") ?? ""
  );
  const [localPrecioMax, setLocalPrecioMax] = useState(
    searchParams.get("precioMax") ?? ""
  );

  const activeBrands = useMemo(
    () => searchParams.get("marca")?.split(",").filter(Boolean) ?? [],
    [searchParams]
  );

  const toggleBrand = useCallback(
    (marca: string) => {
      const current = new Set(activeBrands);
      if (current.has(marca)) {
        current.delete(marca);
      } else {
        current.add(marca);
      }
      const value =
        current.size > 0 ? Array.from(current).join(",") : null;
      updateUrl([{ key: "marca", value }]);
    },
    [activeBrands, updateUrl]
  );

  const applyPriceFilter = useCallback(() => {
    const min = localPrecioMin.trim();
    const max = localPrecioMax.trim();
    const updates: { key: string; value: string | null }[] = [];
    const minNum = Number(min);
    const maxNum = Number(max);

    if (min !== "" && !isNaN(minNum) && minNum >= 0) {
      updates.push({ key: "precioMin", value: min });
    } else {
      updates.push({ key: "precioMin", value: null });
    }

    if (max !== "" && !isNaN(maxNum) && maxNum >= 0) {
      updates.push({ key: "precioMax", value: max });
    } else {
      updates.push({ key: "precioMax", value: null });
    }

    updateUrl(updates);
  }, [localPrecioMin, localPrecioMax, updateUrl]);

  const hasActiveFilters = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("orden");
    return params.toString() !== "";
  }, [searchParams]);

  const getSpecSelectedValues = useCallback(
    (key: string): string[] => {
      const val = searchParams.get(key);
      return val?.split(",").filter(Boolean) ?? [];
    },
    [searchParams]
  );

  const toggleSpecValue = useCallback(
    (specKey: string, valor: string) => {
      const current = new Set(getSpecSelectedValues(specKey));
      if (current.has(valor)) {
        current.delete(valor);
      } else {
        current.add(valor);
      }
      const value =
        current.size > 0 ? Array.from(current).join(",") : null;
      updateUrl([{ key: specKey, value }]);
    },
    [getSpecSelectedValues, updateUrl]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filtros</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-primary hover:underline"
          >
            Limpiar todo
          </button>
        )}
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="text-sm font-medium">Precio</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Mín"
            value={localPrecioMin}
            onChange={(e) => setLocalPrecioMin(e.target.value)}
            onBlur={applyPriceFilter}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyPriceFilter();
            }}
            className="h-8 text-sm"
          />
          <span className="text-xs text-muted-foreground">—</span>
          <Input
            type="number"
            placeholder="Máx"
            value={localPrecioMax}
            onChange={(e) => setLocalPrecioMax(e.target.value)}
            onBlur={applyPriceFilter}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyPriceFilter();
            }}
            className="h-8 text-sm"
          />
        </div>
      </div>

      <Separator />

      {filterOptions.brands.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Marca</Label>
          <div className="space-y-1.5">
            {filterOptions.brands.map((brand) => (
              <label
                key={brand.nombre}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={activeBrands.includes(brand.nombre)}
                  onCheckedChange={() => toggleBrand(brand.nombre)}
                />
                <span className="flex-1">{brand.nombre}</span>
                <span className="text-xs text-muted-foreground">
                  ({brand.count})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {filterOptions.specFilters.length > 0 && (
        <>
          <Separator />
          <div className="space-y-1">
            <Label className="text-sm font-medium">Especificaciones</Label>
            {filterOptions.specFilters.map((spec) => (
              <SpecFilterGroup
                key={spec.key}
                spec={spec}
                selectedValues={getSpecSelectedValues(spec.key)}
                onToggle={(valor) => toggleSpecValue(spec.key, valor)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
