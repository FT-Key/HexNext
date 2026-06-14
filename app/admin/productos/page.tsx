import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdminProductsTable } from "@/components/features/admin-products-table"
import { MockProductRepository } from "@/adapters/out/mock/repositories/mock-product.repository"

export default async function AdminProductosPage() {
  const repo = new MockProductRepository()
  const products = await repo.findAllAdmin()

  const plainProducts = products.map((p) => ({
    id: p.id,
    sku: p.sku,
    nombre: p.nombre,
    slug: p.slug,
    descripcion: p.descripcion,
    marca: p.marca,
    precio: p.precio,
    precioComparativa: p.precioComparativa,
    stock: p.stock,
    categoriaId: p.categoriaId,
    productoPadreId: p.productoPadreId,
    atributos: p.atributos,
    especificaciones: p.especificaciones,
    imagenes: p.imagenes,
    destacado: p.destacado,
    activo: p.activo,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Productos</h2>
          <p className="text-muted-foreground">
            Gestiona el catálogo de productos ({products.length} productos)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/productos/nuevo">Nuevo producto</Link>
        </Button>
      </div>

      <div className="rounded-2xl border bg-card">
        <AdminProductsTable products={plainProducts} />
      </div>
    </div>
  )
}
