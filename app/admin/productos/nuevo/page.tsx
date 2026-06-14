import { AdminProductForm } from "@/components/features/admin-product-form"
import { MockCategoryRepository } from "@/adapters/out/mock/repositories/mock-category.repository"

export default async function NuevoProductoPage() {
  const categoryRepo = new MockCategoryRepository()
  const categories = await categoryRepo.findAll()

  const plainCategories = categories.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    slug: c.slug,
    descripcion: c.descripcion,
    categoriaPadreId: c.categoriaPadreId,
    orden: c.orden,
    activo: c.activo,
  }))

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Nuevo producto</h2>
        <p className="text-muted-foreground">
          Completá el formulario para crear un nuevo producto.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <AdminProductForm categories={plainCategories} />
      </div>
    </div>
  )
}
