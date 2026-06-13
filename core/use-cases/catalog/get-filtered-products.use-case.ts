import type { ICategoryRepository } from "@/core/ports/in/repositories/i-category-repository";
import type { IProductRepository } from "@/core/ports/in/repositories/i-product-repository";
import type { Product } from "@/core/domain/entities/product";
import type {
  ProductFilters,
  SortOption,
  FilteredResult,
  FilterOptions,
  AttributeFilterOption,
} from "./types";
import { slugifySpec } from "@/shared/utils/slugify";
import { EntityNotFoundError } from "@/core/domain/errors/entity-not-found-error";

function applyFilters(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((p) => {
    if (filters.precioMin !== undefined && p.precio < filters.precioMin) {
      return false;
    }
    if (filters.precioMax !== undefined && p.precio > filters.precioMax) {
      return false;
    }
    if (
      filters.marcas !== undefined &&
      filters.marcas.length > 0 &&
      !filters.marcas.includes(p.marca)
    ) {
      return false;
    }
    if (filters.specs !== undefined) {
      for (const [specKey, specValues] of Object.entries(filters.specs)) {
        if (specValues.length === 0) continue;
        const matches = p.especificaciones.some(
          (e) => slugifySpec(e.nombre) === specKey && specValues.includes(e.valor)
        );
        if (!matches) return false;
      }
    }
    return true;
  });
}

function applySort(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "precio-asc":
      sorted.sort((a, b) => a.precio - b.precio);
      break;
    case "precio-desc":
      sorted.sort((a, b) => b.precio - a.precio);
      break;
    case "nombre-asc":
      sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case "nombre-desc":
      sorted.sort((a, b) => b.nombre.localeCompare(a.nombre));
      break;
    case "fecha-desc":
      sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case "popular-desc":
      sorted.sort((a, b) => b.stock - a.stock);
      break;
  }
  return sorted;
}

function computeFilterOptions(products: Product[]): FilterOptions {
  const brandMap = new Map<string, number>();
  const specMap = new Map<string, Map<string, number>>();

  for (const p of products) {
    brandMap.set(p.marca, (brandMap.get(p.marca) ?? 0) + 1);

    for (const spec of p.especificaciones) {
      const key = slugifySpec(spec.nombre);
      if (!specMap.has(key)) {
        specMap.set(key, new Map());
      }
      const valueMap = specMap.get(key)!;
      valueMap.set(spec.valor, (valueMap.get(spec.valor) ?? 0) + 1);
    }
  }

  const brands = Array.from(brandMap.entries())
    .map(([nombre, count]) => ({ nombre, count }))
    .sort((a, b) => b.count - a.count);

  const specFilters: AttributeFilterOption[] = Array.from(specMap.entries())
    .map(([key, valueMap]) => ({
      nombre:
        products
          .flatMap((p) => p.especificaciones)
          .find((e) => slugifySpec(e.nombre) === key)?.nombre ?? key,
      key,
      valores: Array.from(valueMap.entries())
        .map(([valor, count]) => ({ valor, count }))
        .sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  const prices = products.map((p) => p.precio);
  const precioMin = prices.length > 0 ? Math.min(...prices) : 0;
  const precioMax = prices.length > 0 ? Math.max(...prices) : 0;

  return { brands, specFilters, precioMin, precioMax };
}

export class GetFilteredProductsUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly productRepository: IProductRepository
  ) {}

  async execute(
    categorySlug: string,
    filters: ProductFilters = {},
    sort: SortOption = "nombre-asc"
  ): Promise<FilteredResult> {
    const category = await this.categoryRepository.findBySlug(categorySlug);

    if (!category) {
      throw new EntityNotFoundError("Category", categorySlug);
    }

    const subcategories =
      await this.categoryRepository.findByPadreId(category.id);
    const allCategoryIds = [
      category.id,
      ...subcategories.map((s) => s.id),
    ];
    const allProducts =
      await this.productRepository.findByCategoriaIds(allCategoryIds);

    const filterOptions = computeFilterOptions(allProducts);
    const filtered = applyFilters(allProducts, filters);
    const products = applySort(filtered, sort);

    return {
      products,
      category,
      subcategories,
      filterOptions,
    };
  }
}
