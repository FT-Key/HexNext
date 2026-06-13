import type { Product } from "@/core/domain/entities/product";

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findByCategoriaIds(categoriaIds: string[]): Promise<Product[]>;
  findByProductoPadreId(padreId: string): Promise<Product[]>;
  findAll(): Promise<Product[]>;
}
