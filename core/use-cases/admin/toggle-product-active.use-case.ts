import type { IProductRepository } from "@/core/ports/in/repositories/i-product-repository";
import type { Product } from "@/core/domain/entities/product";
import { ProductNotFoundError } from "@/core/domain/errors/product-not-found-error";
import { Product as ProductEntity } from "@/core/domain/entities/product";

export class ToggleProductActiveUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepo.findById(id);

    if (!product) {
      throw new ProductNotFoundError(id);
    }

    const updated = new ProductEntity({
      ...product,
      activo: !product.activo,
      updatedAt: new Date(),
    });

    return this.productRepo.save(updated);
  }
}
