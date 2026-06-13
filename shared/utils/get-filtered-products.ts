import { cache } from "react";
import { MockCategoryRepository } from "@/adapters/out/mock/repositories/mock-category.repository";
import { MockProductRepository } from "@/adapters/out/mock/repositories/mock-product.repository";
import { GetFilteredProductsUseCase } from "@/core/use-cases/catalog/get-filtered-products.use-case";
import type { ProductFilters, SortOption } from "@/core/use-cases/catalog/types";

export const getFilteredProducts = cache(
  async (slug: string, filters?: ProductFilters, sort?: SortOption) => {
    const categoryRepo = new MockCategoryRepository();
    const productRepo = new MockProductRepository();
    const useCase = new GetFilteredProductsUseCase(categoryRepo, productRepo);
    return useCase.execute(slug, filters, sort);
  }
);
