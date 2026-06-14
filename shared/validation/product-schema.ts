import { z } from "zod";

export const atributoVarianteSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, "El nombre del atributo es requerido"),
  valor: z.string().min(1, "El valor del atributo es requerido"),
  codigoColor: z.string().nullable(),
});

export const especificacionTecnicaSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, "El nombre de la especificación es requerido"),
  valor: z.string().min(1, "El valor de la especificación es requerido"),
});

export const productFormSchema = z.object({
  sku: z.string().min(1, "SKU es requerido"),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(200),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  marca: z.string().min(1, "La marca es requerida"),
  precio: z.coerce.number().positive("El precio debe ser mayor a 0"),
  precioComparativa: z.coerce.number().positive().nullable(),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  categoriaId: z.string().min(1, "La categoría es requerida"),
  productoPadreId: z.string().nullable(),
  atributos: z.array(atributoVarianteSchema).optional().default([]),
  especificaciones: z.array(especificacionTecnicaSchema).optional().default([]),
  imagenes: z.array(z.string()).optional().default([]),
  destacado: z.boolean().optional().default(false),
  activo: z.boolean().optional().default(true),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
