"use client";

import { useState } from "react";
import type { Product } from "@/core/domain/entities/product";
import { formatPrice } from "@/shared/utils/format-price";
import { StockBadge } from "@/components/features/stock-badge";
import { ProductGallery } from "@/components/features/product-gallery";
import { ProductSpecsTable } from "@/components/features/product-specs-table";
import { ProductVariantSelector } from "@/components/features/product-variant-selector";
import { Button } from "@/components/ui/button";

interface ProductDetailProps {
  product: Product;
  variants: Product[];
}

export function ProductDetail({ product: initialProduct, variants }: ProductDetailProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product>(initialProduct);

  const hasVariants = variants.length > 0;
  const isOutOfStock = !selectedProduct.tieneStock;

  const handleVariantSelect = (variant: Product) => {
    setSelectedProduct(variant);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <ProductGallery
        imagenes={selectedProduct.imagenes}
        nombre={selectedProduct.nombre}
      />

      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
            {selectedProduct.nombre}
          </h1>
          <StockBadge stock={selectedProduct.stock} />
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-3">
            <p className="font-mono text-3xl font-bold tracking-tight">
              {formatPrice(selectedProduct.precio)}
            </p>
            {selectedProduct.precioComparativa && (
              <p className="text-lg text-muted-foreground line-through">
                {formatPrice(selectedProduct.precioComparativa)}
              </p>
            )}
          </div>
          {selectedProduct.descuento != null && selectedProduct.descuento > 0 && (
            <p className="text-sm font-medium text-primary">
              {selectedProduct.descuento}% de descuento
            </p>
          )}
        </div>

        {hasVariants && (
          <ProductVariantSelector
            variants={variants}
            currentProduct={selectedProduct}
            onSelect={handleVariantSelect}
          />
        )}

        <p className="text-sm leading-relaxed text-muted-foreground">
          {selectedProduct.descripcion}
        </p>

        <div className="space-y-3">
          <Button
            size="lg"
            variant="cta"
            className="w-full"
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Sin stock" : "Agregar al carrito"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {isOutOfStock
              ? "Este producto no está disponible actualmente."
              : `Stock disponible: ${selectedProduct.stock} unidades`}
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Especificaciones técnicas</h2>
          <ProductSpecsTable
            especificaciones={selectedProduct.especificaciones}
          />
        </div>
      </div>
    </div>
  );
}
