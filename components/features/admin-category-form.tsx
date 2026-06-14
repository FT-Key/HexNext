"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  categoryFormSchema,
  type CategoryFormData,
} from "@/shared/validation/category-schema"
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

interface CategoryPlain {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  categoriaPadreId: string | null
  orden: number
  activo: boolean
}

interface AdminCategoryFormProps {
  allCategories: CategoryPlain[]
  category?: CategoryPlain
}

export function AdminCategoryForm({ allCategories, category }: AdminCategoryFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!category

  const parentOptions = allCategories.filter(
    (c) => c.activo && c.id !== category?.id
  )

  const form = useForm<CategoryFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(categoryFormSchema) as any,
    defaultValues: category
      ? {
          nombre: category.nombre,
          descripcion: category.descripcion,
          categoriaPadreId: category.categoriaPadreId,
          orden: category.orden,
          activo: category.activo,
        }
      : {
          nombre: "",
          descripcion: null,
          categoriaPadreId: null,
          orden: 0,
          activo: true,
        },
  })

  async function onSubmit(data: CategoryFormData) {
    setError(null)

    try {
      const url = isEditing
        ? `/api/admin/categorias/${category.id}`
        : "/api/admin/categorias"

      const method = isEditing ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!json.success) {
        setError(json.error?.message ?? "Error al guardar la categoría")
        return
      }

      router.push("/admin/categorias")
      router.refresh()
    } catch {
      setError("Error de conexión al guardar la categoría")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-2xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Información básica</h2>

          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Procesadores" {...field} />
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
                    placeholder="Descripción de la categoría..."
                    className="min-h-[80px]"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Jerarquía y orden</h2>

          <FormField
            control={form.control}
            name="categoriaPadreId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría padre</FormLabel>
                <Select
                  value={field.value ?? "null"}
                  onValueChange={(val) => field.onChange(val === "null" ? null : val)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sin padre (categoría raíz)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="null">Sin padre (raíz)</SelectItem>
                    {parentOptions.map((cat) => (
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

          <FormField
            control={form.control}
            name="orden"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orden</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Estado</h2>
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
        </section>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Guardando..."
              : isEditing
                ? "Actualizar categoría"
                : "Crear categoría"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/categorias")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}
