import type { IProductRepository } from "@/core/ports/in/repositories/i-product-repository";
import type { Product } from "@/core/domain/entities/product";
import { Product as ProductEntity } from "@/core/domain/entities/product";
import { ProductNotFoundError } from "@/core/domain/errors/product-not-found-error";
import { ProductSlugNotAvailableError } from "@/core/domain/errors/product-slug-not-available-error";
import { slugifySpec as slugify } from "@/shared/utils/slugify";

export interface UpdateProductDTO {
  id: string;
  sku?: string;
  nombre?: string;
  descripcion?: string;
  marca?: string;
  precio?: number;
  precioComparativa?: number | null;
  stock?: number;
  categoriaId?: string;
  productoPadreId?: string | null;
  atributos?: { id: string; nombre: string; valor: string; codigoColor: string | null }[];
  especificaciones?: { id: string; nombre: string; valor: string }[];
  imagenes?: string[];
  destacado?: boolean;
  activo?: boolean;
}

export class UpdateProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(dto: UpdateProductDTO): Promise<Product> {
    const existing = await this.productRepo.findById(dto.id);

    if (!existing) {
      throw new ProductNotFoundError(dto.id);
    }

    let slug = existing.slug;

    if (dto.nombre && dto.nombre !== existing.nombre) {
      slug = slugify(dto.nombre);
      const slugExists = await this.productRepo.findBySlugIncludingInactive(slug);

      if (slugExists && slugExists.id !== dto.id) {
        throw new ProductSlugNotAvailableError(slug);
      }
    }

    if (dto.precio !== undefined && dto.precio !== existing.precio) {
      console.log("[AUDIT LOG] Cambio de precio", {
        productoId: dto.id,
        sku: existing.sku,
        precioAnterior: existing.precio,
        precioNuevo: dto.precio,
        timestamp: new Date().toISOString(),
      });
    }

    const updated = new ProductEntity({
      id: existing.id,
      sku: dto.sku ?? existing.sku,
      nombre: dto.nombre ?? existing.nombre,
      slug,
      descripcion: dto.descripcion ?? existing.descripcion,
      marca: dto.marca ?? existing.marca,
      precio: dto.precio ?? existing.precio,
      precioComparativa: dto.precioComparativa !== undefined ? dto.precioComparativa : existing.precioComparativa,
      stock: dto.stock ?? existing.stock,
      categoriaId: dto.categoriaId ?? existing.categoriaId,
      productoPadreId: dto.productoPadreId !== undefined ? dto.productoPadreId : existing.productoPadreId,
      atributos: dto.atributos ?? existing.atributos,
      especificaciones: dto.especificaciones ?? existing.especificaciones,
      imagenes: dto.imagenes ?? existing.imagenes,
      destacado: dto.destacado ?? existing.destacado,
      activo: dto.activo ?? existing.activo,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    return this.productRepo.save(updated);
  }
}
