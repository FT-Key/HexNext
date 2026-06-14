import type { Category } from "@/core/domain/entities/category";

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findAllIncludingInactive(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findBySlugIncludingInactive(slug: string): Promise<Category | null>;
  findByPadreId(padreId: string | null): Promise<Category[]>;
  save(category: Category): Promise<Category>;
}
