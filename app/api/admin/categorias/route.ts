import { NextResponse } from "next/server"
import { MockCategoryRepository } from "@/adapters/out/mock/repositories/mock-category.repository"
import { CreateCategoryUseCase } from "@/core/use-cases/admin/create-category.use-case"
import { categoryFormSchema } from "@/shared/validation/category-schema"

export async function GET() {
  try {
    const repo = new MockCategoryRepository()
    const categories = await repo.findAllIncludingInactive()

    return NextResponse.json({
      success: true,
      data: categories,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch (error) {
    console.error("[API] Error GET /api/admin/categorias:", error)
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Error al obtener categorías" },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = categoryFormSchema.safeParse(body)

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
    const useCase = new CreateCategoryUseCase(repo)
    const category = await useCase.execute(parsed.data)

    return NextResponse.json(
      {
        success: true,
        data: category,
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 201 }
    )
  } catch (error) {
    const err = error as Error & { code?: string }

    if (err.code === "CATEGORY_SLUG_NOT_AVAILABLE") {
      return NextResponse.json(
        {
          success: false,
          error: { code: err.code, message: err.message },
          meta: { timestamp: new Date().toISOString() },
        },
        { status: 409 }
      )
    }

    console.error("[API] Error POST /api/admin/categorias:", error)
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Error al crear categoría" },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 500 }
    )
  }
}
