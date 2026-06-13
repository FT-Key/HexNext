import { cn } from "@/lib/utils";

interface StockBadgeProps {
  stock: number;
}

export function StockBadge({ stock }: StockBadgeProps) {
  const disponible = stock > 0;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        disponible
          ? "bg-primary/10 text-primary"
          : "bg-destructive/10 text-destructive"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          disponible ? "bg-primary" : "bg-destructive"
        )}
      />
      {disponible ? "Disponible" : "Sin stock"}
    </span>
  );
}
