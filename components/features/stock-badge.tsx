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
          ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
          : "bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          disponible ? "bg-emerald-500" : "bg-rose-500"
        )}
      />
      {disponible ? "Disponible" : "Sin stock"}
    </span>
  );
}
