import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MockCategoryRepository } from "@/adapters/out/mock/repositories/mock-category.repository"

export default async function AdminDashboardPage() {
  const categoryRepo = new MockCategoryRepository()
  const allCategories = await categoryRepo.findAllIncludingInactive()
  const activeCategories = allCategories.filter((c) => c.activo)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Bienvenido al panel de administración de HexNext.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Productos</h3>
          <p className="mt-2 text-3xl font-bold">—</p>
          <Button variant="outline" size="sm" className="mt-4" asChild>
            <Link href="/admin/productos">Ver productos</Link>
          </Button>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Categorías</h3>
          <p className="mt-2 text-3xl font-bold">{activeCategories.length}</p>
          <p className="text-xs text-muted-foreground">
            {allCategories.length - activeCategories.length} inactivas
          </p>
          <Button variant="outline" size="sm" className="mt-4" asChild>
            <Link href="/admin/categorias">Ver categorías</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
