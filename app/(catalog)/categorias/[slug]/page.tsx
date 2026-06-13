import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/shared/utils/get-categories";
import { getFilteredProducts } from "@/shared/utils/get-filtered-products";
import { getCategoryBySlug } from "@/shared/utils/get-category";
import { CategoryNav } from "@/components/features/category-nav";
import { ProductCard } from "@/components/features/product-card";
import { SortDropdown } from "@/components/features/sort-dropdown";
import { FilterSidebar } from "@/components/features/filter-sidebar";
import type {
  ProductFilters,
  SortOption,
} from "@/core/use-cases/catalog/types";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function parseSearchParams(
  sp: Awaited<PageProps["searchParams"]>
): { filters: ProductFilters; sort: SortOption } {
  const knownKeys = new Set(["precioMin", "precioMax", "marca", "orden"]);

  const precioMinRaw = sp.precioMin;
  const precioMin =
    typeof precioMinRaw === "string" && precioMinRaw !== ""
      ? Number(precioMinRaw)
      : undefined;

  const precioMaxRaw = sp.precioMax;
  const precioMax =
    typeof precioMaxRaw === "string" && precioMaxRaw !== ""
      ? Number(precioMaxRaw)
      : undefined;

  const marcaRaw = sp.marca;
  const marcas =
    typeof marcaRaw === "string" && marcaRaw.trim() !== ""
      ? marcaRaw.split(",").map((m) => m.trim()).filter(Boolean)
      : undefined;

  const specs: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(sp)) {
    if (knownKeys.has(key)) continue;
    if (typeof value === "string" && value.trim() !== "") {
      const values = value.split(",").map((v) => v.trim()).filter(Boolean);
      if (values.length > 0) {
        specs[key] = values;
      }
    }
  }

  const sortRaw = sp.orden;
  const validSorts: SortOption[] = [
    "precio-asc",
    "precio-desc",
    "nombre-asc",
    "nombre-desc",
    "fecha-desc",
    "popular-desc",
  ];
  const sort: SortOption =
    typeof sortRaw === "string" && validSorts.includes(sortRaw as SortOption)
      ? (sortRaw as SortOption)
      : "nombre-asc";

  return { filters: { precioMin, precioMax, marcas, specs }, sort };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  return {
    title: `${category.nombre} - HexNext`,
    description:
      category.descripcion ??
      `Productos de ${category.nombre} en HexNext`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const { filters, sort } = parseSearchParams(sp);

  const [categories, { category, products, filterOptions }] =
    await Promise.all([
      getCategories(),
      getFilteredProducts(slug, filters, sort),
    ]);

  const showMobileFilters = filterOptions.brands.length > 0 ||
    filterOptions.specFilters.length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-foreground">{category.nombre}</span>
        </nav>
        <h1 className="text-2xl font-semibold tracking-tight">
          {category.nombre}
        </h1>
        {category.descripcion && (
          <p className="text-sm text-muted-foreground">
            {category.descripcion}
          </p>
        )}
      </div>

      <div className="lg:hidden">
        <details className="group rounded-xl border">
          <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium">
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            {showMobileFilters ? "Filtros y categorías" : "Categorías"}
            <svg
              className="ml-auto size-4 transition-transform group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          <div className="border-t px-2 py-2">
            <CategoryNav categories={categories} />
            {showMobileFilters && (
              <div className="mt-4 border-t pt-4">
                <FilterSidebar filterOptions={filterOptions} />
              </div>
            )}
          </div>
        </details>
      </div>

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border bg-card p-4">
            <FilterSidebar filterOptions={filterOptions} />
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <SortDropdown currentSort={sort} productCount={products.length} />

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 text-4xl text-muted-foreground/30">
                <svg
                  className="size-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-medium">Sin resultados</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                No hay productos con los filtros seleccionados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
