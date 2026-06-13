import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/shared/utils/get-categories";
import { getProductsByCategory } from "@/shared/utils/get-products-by-category";
import { CategoryNav } from "@/components/features/category-nav";
import { ProductCard } from "@/components/features/product-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getProductsByCategory(slug);

  return {
    title: `${category.nombre} - HexNext`,
    description:
      category.descripcion ??
      `Productos de ${category.nombre} en HexNext`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const [categories, { category, products }] = await Promise.all([
    getCategories(),
    getProductsByCategory(slug),
  ]);

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
            Categorías
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
          </div>
        </details>
      </div>

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
          <h2 className="text-lg font-medium">No hay productos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            No encontramos productos en esta categoría.
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
  );
}
