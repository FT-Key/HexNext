import Link from "next/link";
import type { Product } from "@/core/domain/entities/product";
import { Card, CardContent } from "@/components/ui/card";
import { StockBadge } from "@/components/features/stock-badge";
import { formatPrice } from "@/shared/utils/format-price";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const href = `/productos/${product.slug}`;

  return (
    <Link href={href} className="block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-muted">
          <div className="flex h-full items-center justify-center text-4xl text-muted-foreground/30">
            <svg
              className="size-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="absolute right-2 top-2">
            <StockBadge stock={product.stock} />
          </div>
        </div>
        <CardContent className="flex flex-1 flex-col gap-1 pt-4">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug">
            {product.nombre}
          </h3>
          {product.precioComparativa && (
            <p className="text-xs text-muted-foreground line-through">
              {formatPrice(product.precioComparativa)}
            </p>
          )}
          <p className="text-lg font-semibold tracking-tight">
            {formatPrice(product.precio)}
          </p>
          {product.descuento && (
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {product.descuento}% OFF
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
