import type { ICategoryRepository } from "@/core/ports/in/repositories/i-category-repository";
import type { Category } from "@/core/domain/entities/category";

export class GetAllCategoriesUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepo.findAllIncludingInactive();
  }
}
