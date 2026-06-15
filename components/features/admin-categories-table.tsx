"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CategoryPlain {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  categoriaPadreId: string | null
  orden: number
  activo: boolean
}

interface AdminCategoriesTableProps {
  categories: CategoryPlain[]
}

export function AdminCategoriesTable({ categories }: AdminCategoriesTableProps) {
  const router = useRouter()

  async function handleToggleActive(id: string) {
    await fetch(`/api/admin/categorias/${id}`, {
      method: "DELETE",
    })
    router.refresh()
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Orden</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Categoría padre</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((cat) => (
          <TableRow key={cat.id}>
            <TableCell className="font-mono text-xs">{cat.orden}</TableCell>
            <TableCell className="font-medium">{cat.nombre}</TableCell>
            <TableCell className="font-mono text-xs">{cat.slug}</TableCell>
            <TableCell className="text-muted-foreground">
              {cat.categoriaPadreId
                ? categories.find((c) => c.id === cat.categoriaPadreId)?.nombre ?? "—"
                : "—"}
            </TableCell>
            <TableCell>
              {cat.activo ? (
                <Badge variant="success">Activo</Badge>
              ) : (
                <Badge variant="destructive">Inactivo</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="xs" asChild>
                  <Link href={`/admin/categorias/${cat.id}/editar`}>
                    Editar
                  </Link>
                </Button>
                <Button
                  variant={cat.activo ? "destructive" : "secondary"}
                  size="xs"
                  onClick={() => handleToggleActive(cat.id)}
                >
                  {cat.activo ? "Desactivar" : "Activar"}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {categories.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              No hay categorías
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
