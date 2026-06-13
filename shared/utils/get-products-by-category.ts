import { cache } from "react";
import { MockCategoryRepository } from "@/adapters/out/mock/repositories/mock-category.repository";
import { MockProductRepository } from "@/adapters/out/mock/repositories/mock-product.repository";
import { GetProductsByCategoryUseCase } from "@/core/use-cases/catalog/get-products-by-category.use-case";

export const getProductsByCategory = cache(async (slug: string) => {
  const categoryRepo = new MockCategoryRepository();
  const productRepo = new MockProductRepository();
  const useCase = new GetProductsByCategoryUseCase(categoryRepo, productRepo);
  return useCase.execute(slug);
});
