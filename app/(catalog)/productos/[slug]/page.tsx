import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/shared/utils/get-product-by-slug";
import { ProductDetail } from "@/components/features/product-detail";
import { ProductNotFoundError } from "@/core/use-cases/catalog/get-product-by-slug.use-case";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { product } = await getProductBySlug(slug);

    return {
      title: `${product.nombre} - HexNext`,
      description: product.descripcion.slice(0, 160),
      openGraph: {
        title: product.nombre,
        description: product.descripcion.slice(0, 160),
        images: product.imagenes.length > 0 ? [{ url: product.imagenes[0]! }] : [],
      },
    };
  } catch {
    return { title: "Producto no encontrado - HexNext" };
  }
}

async function getPageData(slug: string) {
  try {
    return await getProductBySlug(slug);
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      notFound();
    }
    throw error;
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const { product, variants, category } = await getPageData(slug);

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Inicio</Link>
        <span>/</span>
        <Link
          href={`/categorias/${category.slug}`}
          className="hover:text-foreground"
        >
          {category.nombre}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.nombre}</span>
      </nav>

      <ProductDetail product={product} variants={variants} />
    </div>
  );
}
