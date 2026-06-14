"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  productFormSchema,
  type ProductFormData,
} from "@/shared/validation/product-schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { AdminVariantManager } from "./admin-variant-manager"
interface CategoryPlain {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  categoriaPadreId: string | null
  orden: number
  activo: boolean
}

interface ProductPlain {
  id: string
  sku: string
  nombre: string
  slug: string
  descripcion: string
  marca: string
  precio: number
  precioComparativa: number | null
  stock: number
  categoriaId: string
  productoPadreId: string | null
  atributos: { id: string; nombre: string; valor: string; codigoColor: string | null }[]
  especificaciones: { id: string; nombre: string; valor: string }[]
  imagenes: string[]
  destacado: boolean
  activo: boolean
  createdAt: string
  updatedAt: string
}

interface AdminProductFormProps {
  categories: CategoryPlain[]
  product?: ProductPlain
}

export function AdminProductForm({ categories, product }: AdminProductFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!product

  const form = useForm<ProductFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: product
      ? {
          sku: product.sku,
          nombre: product.nombre,
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
        }
      : {
          sku: "",
          nombre: "",
          descripcion: "",
          marca: "",
          precio: 0,
          precioComparativa: null,
          stock: 0,
          categoriaId: "",
          productoPadreId: null,
          atributos: [],
          especificaciones: [],
          imagenes: [],
          destacado: false,
          activo: true,
        },
  })

  async function onSubmit(data: ProductFormData) {
    setError(null)

    try {
      const url = isEditing
        ? `/api/admin/productos/${product.id}`
        : "/api/admin/productos"

      const method = isEditing ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!json.success) {
        setError(json.error?.message ?? "Error al guardar el producto")
        return
      }

      router.push("/admin/productos")
      router.refresh()
    } catch {
      setError("Error de conexión al guardar el producto")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <div className="rounded-2xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Información básica</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="CPU-AMD-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input placeholder="AMD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="AMD Ryzen 5 7600X" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descripción del producto..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Precio y Stock</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="precioComparativa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio comparativa ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Opcional"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Categoría</h2>
          <FormField
            control={form.control}
            name="categoriaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Atributos (variantes)</h2>
          <FormField
            control={form.control}
            name="atributos"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AdminVariantManager
                    variants={field.value ?? []}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Especificaciones técnicas</h2>
          <FormField
            control={form.control}
            name="especificaciones"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <EspecsManager
                    specs={field.value ?? []}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Imágenes</h2>
          <FormField
            control={form.control}
            name="imagenes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageManager
                    urls={field.value ?? []}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Opciones</h2>
          <div className="flex items-center gap-6">
            <FormField
              control={form.control}
              name="destacado"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Label>Destacado</Label>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activo"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Label>Activo</Label>
                </FormItem>
              )}
            />
          </div>
        </section>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Guardando..."
              : isEditing
                ? "Actualizar producto"
                : "Crear producto"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/productos")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}

function EspecsManager({
  specs,
  onChange,
}: {
  specs: { id: string; nombre: string; valor: string }[]
  onChange: (specs: { id: string; nombre: string; valor: string }[]) => void
}) {
  function add() {
    onChange([
      ...specs,
      { id: crypto.randomUUID(), nombre: "", valor: "" },
    ])
  }

  function remove(id: string) {
    onChange(specs.filter((s) => s.id !== id))
  }

  function update(id: string, key: "nombre" | "valor", value: string) {
    onChange(
      specs.map((s) => (s.id === id ? { ...s, [key]: value } : s))
    )
  }

  return (
    <div className="space-y-3">
      {specs.map((spec) => (
        <div key={spec.id} className="flex items-center gap-2">
          <Input
            placeholder="Nombre (ej: Socket)"
            value={spec.nombre}
            onChange={(e) => update(spec.id, "nombre", e.target.value)}
          />
          <Input
            placeholder="Valor (ej: AM5)"
            value={spec.valor}
            onChange={(e) => update(spec.id, "valor", e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-destructive"
            onClick={() => remove(spec.id)}
          >
            X
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Agregar especificación
      </Button>
    </div>
  )
}

function ImageManager({
  urls,
  onChange,
}: {
  urls: string[]
  onChange: (urls: string[]) => void
}) {
  function add() {
    onChange([...urls, ""])
  }

  function remove(index: number) {
    onChange(urls.filter((_, i) => i !== index))
  }

  function update(index: number, value: string) {
    onChange(urls.map((u, i) => (i === index ? value : u)))
  }

  return (
    <div className="space-y-3">
      {urls.map((url, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder="URL de la imagen"
            value={url}
            onChange={(e) => update(index, e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-destructive"
            onClick={() => remove(index)}
          >
            X
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Agregar imagen
      </Button>
      <p className="text-xs text-muted-foreground">
        Por ahora solo URLs. La subida de archivos se implementará próximamente.
      </p>
    </div>
  )
}
