import type { ICategoryRepository } from "@/core/ports/in/repositories/i-category-repository";
import { Category as CategoryEntity } from "@/core/domain/entities/category";

export interface ReorderItem {
  id: string;
  orden: number;
}

export class ReorderCategoriesUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(items: ReorderItem[]): Promise<void> {
    const categories = await this.categoryRepo.findAllIncludingInactive();
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    for (const item of items) {
      const existing = categoryMap.get(item.id);
      if (!existing) continue;

      const updated = new CategoryEntity({
        ...existing,
        orden: item.orden,
      });

      await this.categoryRepo.save(updated);
    }
  }
}
