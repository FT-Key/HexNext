import { AdminCategoryForm } from "@/components/features/admin-category-form"
import { MockCategoryRepository } from "@/adapters/out/mock/repositories/mock-category.repository"

export default async function NuevaCategoriaPage() {
  const repo = new MockCategoryRepository()
  const categories = await repo.findAllIncludingInactive()

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
        <h2 className="text-2xl font-bold">Nueva categoría</h2>
        <p className="text-muted-foreground">
          Completá el formulario para crear una nueva categoría.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <AdminCategoryForm allCategories={plainCategories} />
      </div>
    </div>
  )
}
