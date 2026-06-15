"use client";

import type { ProductProps } from "@/core/domain/entities/product";
import type { PcBuilderSlot } from "@/core/use-cases/catalog/get-pc-builder-data.use-case";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/shared/utils/format-price";

const SLOT_ICONS: Record<string, string> = {
  CPU: "⚡",
  Motherboard: "🔌",
  RAM: "🧠",
  GPU: "🎮",
  Storage: "💾",
  PSU: "🔋",
  Case: "🖥️",
};

interface Props {
  slot: PcBuilderSlot;
  products: ProductProps[];
  selectedProduct: ProductProps | null;
  compatibility: { compatible: boolean; message: string };
  selectorOpen: boolean;
  onSelectProduct: (product: ProductProps) => void;
  onClearSlot: () => void;
  onToggleSelector: () => void;
}

export function PcComponentSlot({
  slot,
  products,
  selectedProduct,
  compatibility,
  selectorOpen,
  onSelectProduct,
  onClearSlot,
  onToggleSelector,
}: Props) {
  return (
    <Card className={`rounded-2xl border ${!compatibility.compatible && selectedProduct ? "border-destructive/50" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{SLOT_ICONS[slot.icono] ?? "📦"}</span>
          <CardTitle className="text-base font-semibold">{slot.nombre}</CardTitle>
        </div>
        {selectedProduct && (
          <Badge variant={compatibility.compatible ? "default" : "destructive"} className="text-xs">
            {compatibility.compatible ? "✓ Compatible" : "✗ Incompatible"}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {selectedProduct ? (
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{selectedProduct.nombre}</p>
                <p className="text-sm text-muted-foreground">{selectedProduct.marca}</p>
              </div>
              <p className="shrink-0 font-mono text-sm font-semibold tracking-tight">
                {formatPrice(selectedProduct.precio)}
              </p>
            </div>
            {!compatibility.compatible && (
              <p className="text-xs text-destructive">{compatibility.message}</p>
            )}
            {compatibility.compatible && compatibility.message && (
              <p className="text-xs text-warning">{compatibility.message}</p>
            )}
            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={onToggleSelector}>
                Cambiar
              </Button>
              <Button variant="ghost" size="sm" onClick={onClearSlot}>
                Quitar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Ningún componente seleccionado</p>
            <Button variant="outline" size="sm" onClick={onToggleSelector}>
              Seleccionar {slot.nombre.toLowerCase()}
            </Button>
          </div>
        )}
        {selectorOpen && (
          <div className="mt-3 max-h-48 overflow-y-auto rounded-xl border bg-muted/50">
            <div className="space-y-1 p-2">
              {products.length === 0 && (
                <p className="p-2 text-sm text-muted-foreground">No hay productos disponibles</p>
              )}
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                    selectedProduct?.id === product.id ? "bg-accent font-medium" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{product.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.marca}
                        {product.stock <= 0 && " — Sin stock"}
                    </p>
                  </div>
                  <span className="ml-4 shrink-0 font-mono text-xs font-medium tracking-tight">
                    {formatPrice(product.precio)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
