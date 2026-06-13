"use client";

import type { Product } from "@/core/domain/entities/product";
import { cn } from "@/lib/utils";

interface ProductVariantSelectorProps {
  variants: Product[];
  currentProduct: Product;
  onSelect: (product: Product) => void;
}

export function ProductVariantSelector({
  variants,
  currentProduct,
  onSelect,
}: ProductVariantSelectorProps) {
  if (variants.length === 0) {
    return null;
  }

  const atributoNombre = variants[0]?.atributos[0]?.nombre ?? "Variante";

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{atributoNombre}</p>
      <div className="flex flex-wrap gap-2">
        {[currentProduct, ...variants]
          .filter(
            (v, index, self) =>
              self.findIndex((s) => s.id === v.id) === index
          )
          .map((variant) => {
            const attrValue =
              variant.atributos[0]?.valor ?? variant.nombre;
            const isSelected = variant.id === currentProduct.id;
            const isColor =
              variant.atributos[0]?.codigoColor != null;

            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => onSelect(variant)}
                disabled={!variant.tieneStock}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm transition-colors",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-muted-foreground/40",
                  !variant.tieneStock &&
                    "cursor-not-allowed opacity-40 line-through"
                )}
                title={
                  !variant.tieneStock
                    ? "Sin stock"
                    : attrValue
                }
              >
                {isColor ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="size-4 rounded-full border"
                      style={{
                        backgroundColor:
                          variant.atributos[0]?.codigoColor ??
                          undefined,
                      }}
                    />
                    {attrValue}
                  </span>
                ) : (
                  attrValue
                )}
              </button>
            );
          })}
      </div>
    </div>
  );
}
