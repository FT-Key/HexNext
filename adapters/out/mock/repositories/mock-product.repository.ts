import type { IProductRepository } from "@/core/ports/in/repositories/i-product-repository";
import type { Product } from "@/core/domain/entities/product";
import { Product as ProductEntity } from "@/core/domain/entities/product";
import { mockProducts } from "@/adapters/out/mock/data/products";

export class MockProductRepository implements IProductRepository {
  private products: Product[];

  constructor() {
    this.products = mockProducts.map((p) => new ProductEntity(p));
  }

  async findAll(): Promise<Product[]> {
    return this.products.filter((p) => p.activo);
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.find((p) => p.id === id && p.activo) ?? null;
  }

  async findByCategoriaIds(categoriaIds: string[]): Promise<Product[]> {
    return this.products.filter(
      (p) => categoriaIds.includes(p.categoriaId) && p.activo
    );
  }
}
