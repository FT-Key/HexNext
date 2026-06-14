import type { IProductRepository } from "@/core/ports/in/repositories/i-product-repository";
import type { Product } from "@/core/domain/entities/product";
import { Product as ProductEntity } from "@/core/domain/entities/product";
import { ProductSlugNotAvailableError } from "@/core/domain/errors/product-slug-not-available-error";
import { randomUUID } from "crypto";
import { slugifySpec as slugify } from "@/shared/utils/slugify";

export interface CreateProductDTO {
  sku: string;
  nombre: string;
  descripcion: string;
  marca: string;
  precio: number;
  precioComparativa: number | null;
  stock: number;
  categoriaId: string;
  productoPadreId: string | null;
  atributos: { id: string; nombre: string; valor: string; codigoColor: string | null }[];
  especificaciones: { id: string; nombre: string; valor: string }[];
  imagenes: string[];
  destacado: boolean;
  activo: boolean;
}

export class CreateProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(dto: CreateProductDTO): Promise<Product> {
    const slug = slugify(dto.nombre);
    const existing = await this.productRepo.findBySlugIncludingInactive(slug);

    if (existing) {
      throw new ProductSlugNotAvailableError(slug);
    }

    const now = new Date();

    const product = new ProductEntity({
      id: randomUUID(),
      sku: dto.sku,
      nombre: dto.nombre,
      slug,
      descripcion: dto.descripcion,
      marca: dto.marca,
      precio: dto.precio,
      precioComparativa: dto.precioComparativa,
      stock: dto.stock,
      categoriaId: dto.categoriaId,
      productoPadreId: dto.productoPadreId,
      atributos: dto.atributos,
      especificaciones: dto.especificaciones,
      imagenes: dto.imagenes,
      destacado: dto.destacado,
      activo: dto.activo,
      createdAt: now,
      updatedAt: now,
    });

    return this.productRepo.save(product);
  }
}
