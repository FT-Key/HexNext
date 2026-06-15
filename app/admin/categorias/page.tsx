import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdminCategoriesTable } from "@/components/features/admin-categories-table"
import { MockCategoryRepository } from "@/adapters/out/mock/repositories/mock-category.repository"

export default async function AdminCategoriasPage() {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Categorías</h2>
          <p className="text-muted-foreground">
            Gestiona las categorías del catálogo ({categories.length} categorías)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categorias/nuevo">Nueva categoría</Link>
        </Button>
      </div>

      <div className="rounded-2xl border bg-card">
        <AdminCategoriesTable categories={plainCategories} />
      </div>
    </div>
  )
}
