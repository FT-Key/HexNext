import { notFound } from "next/navigation"
import { AdminProductForm } from "@/components/features/admin-product-form"
import { MockProductRepository } from "@/adapters/out/mock/repositories/mock-product.repository"
import { MockCategoryRepository } from "@/adapters/out/mock/repositories/mock-category.repository"

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const productRepo = new MockProductRepository()
  const categoryRepo = new MockCategoryRepository()

  const product = await productRepo.findById(id)
  const categories = await categoryRepo.findAll()

  if (!product) {
    notFound()
  }

  const plainCategories = categories.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    slug: c.slug,
    descripcion: c.descripcion,
    categoriaPadreId: c.categoriaPadreId,
    orden: c.orden,
    activo: c.activo,
  }))

  const plainProduct = {
    id: product.id,
    sku: product.sku,
    nombre: product.nombre,
    slug: product.slug,
    descripcion: product.descripcion,
    marca: product.marca,
    precio: product.precio,
    precioComparativa: product.precioComparativa,
    stock: product.stock,
    categoriaId: product.categoriaId,
    productoPadreId: product.productoPadreId,
    atributos: product.atributos,
    especificaciones: product.especificaciones,
    imagenes: product.imagenes,
    destacado: product.destacado,
    activo: product.activo,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Editar producto</h2>
        <p className="text-muted-foreground">
            Modificá los campos del producto.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <AdminProductForm categories={plainCategories} product={plainProduct} />
      </div>
    </div>
  )
}
