import { NextResponse } from "next/server"
import { MockCategoryRepository } from "@/adapters/out/mock/repositories/mock-category.repository"
import { ReorderCategoriesUseCase } from "@/core/use-cases/admin/reorder-categories.use-case"
import { z } from "zod"

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      orden: z.number().int().min(0),
    })
  ),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = reorderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Datos inválidos",
            details: parsed.error.flatten(),
          },
          meta: { timestamp: new Date().toISOString() },
        },
        { status: 400 }
      )
    }

    const repo = new MockCategoryRepository()
    const useCase = new ReorderCategoriesUseCase(repo)
    await useCase.execute(parsed.data.items)

    return NextResponse.json({
      success: true,
      data: null,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch (error) {
    console.error("[API] Error POST /api/admin/categorias/reordenar:", error)
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Error al reordenar categorías" },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 500 }
    )
  }
}
