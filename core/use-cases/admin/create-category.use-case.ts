import type { ICategoryRepository } from "@/core/ports/in/repositories/i-category-repository";
import type { Category } from "@/core/domain/entities/category";
import { Category as CategoryEntity } from "@/core/domain/entities/category";
import { CategorySlugNotAvailableError } from "@/core/domain/errors/category-slug-not-available-error";
import { randomUUID } from "crypto";
import { slugifySpec as slugify } from "@/shared/utils/slugify";

export interface CreateCategoryDTO {
  nombre: string;
  descripcion: string | null;
  categoriaPadreId: string | null;
  orden: number;
  activo: boolean;
}

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(dto: CreateCategoryDTO): Promise<Category> {
    const slug = slugify(dto.nombre);
    const existing = await this.categoryRepo.findBySlugIncludingInactive(slug);

    if (existing) {
      throw new CategorySlugNotAvailableError(slug);
    }

    const category = new CategoryEntity({
      id: randomUUID(),
      nombre: dto.nombre,
      slug,
      descripcion: dto.descripcion,
      categoriaPadreId: dto.categoriaPadreId,
      orden: dto.orden,
      activo: dto.activo,
    });

    return this.categoryRepo.save(category);
  }
}
