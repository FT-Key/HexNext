import type { Product } from "@/core/domain/entities/product";
import type { Category } from "@/core/domain/entities/category";

export type SortOption =
  | "precio-asc"
  | "precio-desc"
  | "nombre-asc"
  | "nombre-desc"
  | "fecha-desc"
  | "popular-desc";

export interface ProductFilters {
  precioMin?: number;
  precioMax?: number;
  marcas?: string[];
  specs?: Record<string, string[]>;
}

export interface AttributeFilterOption {
  nombre: string;
  key: string;
  valores: Array<{ valor: string; count: number }>;
}

export interface FilterOptions {
  brands: Array<{ nombre: string; count: number }>;
  specFilters: AttributeFilterOption[];
  precioMin: number;
  precioMax: number;
}

export interface FilteredResult {
  products: Product[];
  category: Category;
  subcategories: Category[];
  filterOptions: FilterOptions;
}
