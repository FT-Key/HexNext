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

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price)
}

interface ProductPlain {
  id: string
  sku: string
  nombre: string
  slug: string
  precio: number
  stock: number
  activo: boolean
}

interface AdminProductsTableProps {
  products: ProductPlain[]
}

export function AdminProductsTable({ products }: AdminProductsTableProps) {
  const router = useRouter()

  async function handleToggleActive(id: string) {
    await fetch(`/api/admin/productos/${id}`, {
      method: "DELETE",
    })
    router.refresh()
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-mono text-xs">{product.sku}</TableCell>
            <TableCell className="font-medium">{product.nombre}</TableCell>
            <TableCell>{formatPrice(product.precio)}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              {product.activo ? (
                <Badge variant="success">Activo</Badge>
              ) : (
                <Badge variant="destructive">Inactivo</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="xs" asChild>
                  <Link href={`/admin/productos/${product.id}/editar`}>
                    Editar
                  </Link>
                </Button>
                <Button
                  variant={product.activo ? "destructive" : "secondary"}
                  size="xs"
                  onClick={() => handleToggleActive(product.id)}
                >
                  {product.activo ? "Desactivar" : "Activar"}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {products.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              No hay productos
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
