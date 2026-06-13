import { cache } from "react";
import { MockCategoryRepository } from "@/adapters/out/mock/repositories/mock-category.repository";
import { MockProductRepository } from "@/adapters/out/mock/repositories/mock-product.repository";
import { GetProductBySlugUseCase } from "@/core/use-cases/catalog/get-product-by-slug.use-case";

export const getProductBySlug = cache(async (slug: string) => {
  const categoryRepo = new MockCategoryRepository();
  const productRepo = new MockProductRepository();
  const useCase = new GetProductBySlugUseCase(productRepo, categoryRepo);
  return useCase.execute(slug);
});
