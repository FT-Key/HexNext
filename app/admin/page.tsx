import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboardPage() {
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
      </div>
    </div>
  )
}
