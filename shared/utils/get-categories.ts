import { cache } from "react";
import { MockCategoryRepository } from "@/adapters/out/mock/repositories/mock-category.repository";
import { GetCategoriesUseCase } from "@/core/use-cases/catalog/get-categories.use-case";

export interface CategoryNode {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  categoriaPadreId: string | null;
  orden: number;
  activo: boolean;
  children: CategoryNode[];
}

function toPlain(cat: {
  id: string; nombre: string; slug: string; descripcion: string | null;
  categoriaPadreId: string | null; orden: number; activo: boolean;
  children: { id: string; nombre: string; slug: string; descripcion: string | null; categoriaPadreId: string | null; orden: number; activo: boolean; children: unknown[] }[];
}): CategoryNode {
  return {
    id: cat.id,
    nombre: cat.nombre,
    slug: cat.slug,
    descripcion: cat.descripcion,
    categoriaPadreId: cat.categoriaPadreId,
    orden: cat.orden,
    activo: cat.activo,
    children: (cat.children || []).map(toPlain),
  };
}

export const getCategories = cache(async () => {
  const repository = new MockCategoryRepository();
  const useCase = new GetCategoriesUseCase(repository);
  const categories = await useCase.execute();
  return categories.map(toPlain);
});
