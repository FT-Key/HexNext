import { notFound } from "next/navigation"
import { AdminCategoryForm } from "@/components/features/admin-category-form"
import { MockCategoryRepository } from "@/adapters/out/mock/repositories/mock-category.repository"

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const repo = new MockCategoryRepository()

  const category = await repo.findById(id)

  if (!category) {
    notFound()
  }

  const allCategories = await repo.findAllIncludingInactive()

  const plainCategory = {
    id: category.id,
    nombre: category.nombre,
    slug: category.slug,
    descripcion: category.descripcion,
    categoriaPadreId: category.categoriaPadreId,
    orden: category.orden,
    activo: category.activo,
  }

  const plainAllCategories = allCategories.map((c) => ({
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
        <h2 className="text-2xl font-bold">Editar categoría</h2>
        <p className="text-muted-foreground">
          Modificá los campos de la categoría.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <AdminCategoryForm
          allCategories={plainAllCategories}
          category={plainCategory}
        />
      </div>
    </div>
  )
}
