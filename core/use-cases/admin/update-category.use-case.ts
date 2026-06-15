import type { ICategoryRepository } from "@/core/ports/in/repositories/i-category-repository";
import type { Category } from "@/core/domain/entities/category";
import { Category as CategoryEntity } from "@/core/domain/entities/category";
import { CategoryNotFoundError } from "@/core/domain/errors/category-not-found-error";
import { CategorySlugNotAvailableError } from "@/core/domain/errors/category-slug-not-available-error";
import { slugifySpec as slugify } from "@/shared/utils/slugify";

export interface UpdateCategoryDTO {
  id: string;
  nombre?: string;
  descripcion?: string | null;
  categoriaPadreId?: string | null;
  orden?: number;
  activo?: boolean;
}

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(dto: UpdateCategoryDTO): Promise<Category> {
    const existing = await this.categoryRepo.findById(dto.id);

    if (!existing) {
      throw new CategoryNotFoundError(dto.id);
    }

    let slug = existing.slug;

    if (dto.nombre && dto.nombre !== existing.nombre) {
      slug = slugify(dto.nombre);
      const slugExists = await this.categoryRepo.findBySlugIncludingInactive(slug);

      if (slugExists && slugExists.id !== dto.id) {
        throw new CategorySlugNotAvailableError(slug);
      }
    }

    const updated = new CategoryEntity({
      id: existing.id,
      nombre: dto.nombre ?? existing.nombre,
      slug,
      descripcion: dto.descripcion !== undefined ? dto.descripcion : existing.descripcion,
      categoriaPadreId: dto.categoriaPadreId !== undefined ? dto.categoriaPadreId : existing.categoriaPadreId,
      orden: dto.orden ?? existing.orden,
      activo: dto.activo ?? existing.activo,
    });

    return this.categoryRepo.save(updated);
  }
}
