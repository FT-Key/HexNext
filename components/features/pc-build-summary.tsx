"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/shared/utils/format-price";

interface Props {
  totalPrice: number;
  estimatedPower: number;
  hasIncompatibilities: boolean;
  selectedCount: number;
  totalSlots: number;
}

export function PcBuildSummary({
  totalPrice,
  estimatedPower,
  hasIncompatibilities,
  selectedCount,
  totalSlots,
}: Props) {
  const allSelected = selectedCount === totalSlots;

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Resumen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Componentes</span>
            <span>
              {selectedCount}/{totalSlots}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Precio total</span>
            <span className="font-mono text-lg font-bold tracking-tight">
              {formatPrice(totalPrice)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Consumo estimado</span>
            <span className="font-mono text-sm font-medium">{estimatedPower}W</span>
          </div>
        </div>

        {hasIncompatibilities && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            Hay incompatibilidades entre los componentes seleccionados. Revisá las advertencias en
            cada slot.
          </div>
        )}

        {!hasIncompatibilities && selectedCount >= 2 && (
          <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-xs text-primary">
            Todos los componentes son compatibles.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          disabled={!allSelected || hasIncompatibilities}
        >
          Agregar todo al carrito
        </Button>
      </CardFooter>
    </Card>
  );
}
