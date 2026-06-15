import type { ICategoryRepository } from "@/core/ports/in/repositories/i-category-repository";
import type { Category } from "@/core/domain/entities/category";
import { CategoryNotFoundError } from "@/core/domain/errors/category-not-found-error";
import { Category as CategoryEntity } from "@/core/domain/entities/category";

export class ToggleCategoryActiveUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(id: string): Promise<Category> {
    const category = await this.categoryRepo.findById(id);

    if (!category) {
      throw new CategoryNotFoundError(id);
    }

    const updated = new CategoryEntity({
      ...category,
      activo: !category.activo,
    });

    return this.categoryRepo.save(updated);
  }
}
