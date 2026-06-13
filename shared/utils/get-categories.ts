import { cache } from "react";
import { MockCategoryRepository } from "@/adapters/out/mock/repositories/mock-category.repository";
import { GetCategoriesUseCase } from "@/core/use-cases/catalog/get-categories.use-case";

export const getCategories = cache(async () => {
  const repository = new MockCategoryRepository();
  const useCase = new GetCategoriesUseCase(repository);
  return useCase.execute();
});
