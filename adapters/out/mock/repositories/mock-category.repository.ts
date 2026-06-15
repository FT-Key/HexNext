import type { ICategoryRepository } from "@/core/ports/in/repositories/i-category-repository";
import type { Category } from "@/core/domain/entities/category";
import { Category as CategoryEntity } from "@/core/domain/entities/category";
import { mockCategories } from "@/adapters/out/mock/data/categories";

export class MockCategoryRepository implements ICategoryRepository {
  private categories: Category[];

  constructor() {
    this.categories = mockCategories.map((c) => new CategoryEntity(c));
  }

  async findAll(): Promise<Category[]> {
    return this.categories.filter((c) => c.activo);
  }

  async findAllIncludingInactive(): Promise<Category[]> {
    return [...this.categories];
  }

  async findById(id: string): Promise<Category | null> {
    return this.categories.find((c) => c.id === id && c.activo) ?? null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.categories.find((c) => c.slug === slug && c.activo) ?? null;
  }

  async findBySlugIncludingInactive(slug: string): Promise<Category | null> {
    return this.categories.find((c) => c.slug === slug) ?? null;
  }

  async findByPadreId(padreId: string | null): Promise<Category[]> {
    return this.categories.filter((c) => c.categoriaPadreId === padreId && c.activo);
  }

  async save(category: Category): Promise<Category> {
    const index = this.categories.findIndex((c) => c.id === category.id);

    if (index >= 0) {
      this.categories[index] = category;
    } else {
      this.categories.push(category);
    }

    return category;
  }
}
