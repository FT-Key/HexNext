import type { ICategoryRepository } from "@/core/ports/in/repositories/i-category-repository";
import type { Category } from "@/core/domain/entities/category";

export class GetCategoriesUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(): Promise<Category[]> {
    const categories = await this.categoryRepository.findAll();
    const categoryMap = new Map<string, Category>();
    const roots: Category[] = [];

    for (const cat of categories) {
      categoryMap.set(cat.id, cat);
    }

    for (const cat of categories) {
      if (cat.categoriaPadreId && categoryMap.has(cat.categoriaPadreId)) {
        const parent = categoryMap.get(cat.categoriaPadreId)!;
        parent.addChild(cat);
      } else if (cat.esRaiz) {
        roots.push(cat);
      }
    }

    return roots.sort((a, b) => a.orden - b.orden);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.categoryRepository.findBySlug(slug);
  }

  async findById(id: string): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }
}
