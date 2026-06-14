import type { IProductRepository } from "@/core/ports/in/repositories/i-product-repository";
import type { Product } from "@/core/domain/entities/product";

export class GetAllProductsUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepo.findAllAdmin();
  }
}
