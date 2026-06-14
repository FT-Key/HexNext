import { z } from "zod";

export const categoryFormSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  descripcion: z.string().nullable(),
  categoriaPadreId: z.string().nullable(),
  orden: z.coerce.number().int().min(0, "El orden no puede ser negativo"),
  activo: z.boolean().optional().default(true),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
