import { cache } from "react";
import { MockCategoryRepository } from "@/adapters/out/mock/repositories/mock-category.repository";

export const getCategoryBySlug = cache(async (slug: string) => {
  const repo = new MockCategoryRepository();
  const category = await repo.findBySlug(slug);
  if (!category) {
    throw new Error(`Category not found: ${slug}`);
  }
  return category;
});
