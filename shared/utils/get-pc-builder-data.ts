import { cache } from "react";
import { MockCategoryRepository } from "@/adapters/out/mock/repositories/mock-category.repository";
import { MockProductRepository } from "@/adapters/out/mock/repositories/mock-product.repository";
import { GetPcBuilderDataUseCase } from "@/core/use-cases/catalog/get-pc-builder-data.use-case";

export const getPcBuilderData = cache(async () => {
  const categoryRepo = new MockCategoryRepository();
  const productRepo = new MockProductRepository();
  const useCase = new GetPcBuilderDataUseCase(categoryRepo, productRepo);
  return useCase.execute();
});
