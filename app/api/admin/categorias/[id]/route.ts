import { NextResponse } from "next/server"
import { MockCategoryRepository } from "@/adapters/out/mock/repositories/mock-category.repository"
import { UpdateCategoryUseCase } from "@/core/use-cases/admin/update-category.use-case"
import { ToggleCategoryActiveUseCase } from "@/core/use-cases/admin/toggle-category-active.use-case"
import { categoryFormSchema } from "@/shared/validation/category-schema"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const repo = new MockCategoryRepository()
    const category = await repo.findById(id)

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "CATEGORY_NOT_FOUND", message: `Categoría no encontrada: ${id}` },
          meta: { timestamp: new Date().toISOString() },
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: category,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch (error) {
    console.error("[API] Error GET /api/admin/categorias/[id]:", error)
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Error al obtener categoría" },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = categoryFormSchema.partial().safeParse(body)

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
    const useCase = new UpdateCategoryUseCase(repo)
    const category = await useCase.execute({ id, ...parsed.data })

    return NextResponse.json({
      success: true,
      data: category,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch (error) {
    const err = error as Error & { code?: string }

    if (err.code === "CATEGORY_NOT_FOUND") {
      return NextResponse.json(
        {
          success: false,
          error: { code: err.code, message: err.message },
          meta: { timestamp: new Date().toISOString() },
        },
        { status: 404 }
      )
    }

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

    console.error("[API] Error PATCH /api/admin/categorias/[id]:", error)
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Error al actualizar categoría" },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const repo = new MockCategoryRepository()
    const useCase = new ToggleCategoryActiveUseCase(repo)
    const category = await useCase.execute(id)

    return NextResponse.json({
      success: true,
      data: category,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch (error) {
    const err = error as Error & { code?: string }

    if (err.code === "CATEGORY_NOT_FOUND") {
      return NextResponse.json(
        {
          success: false,
          error: { code: err.code, message: err.message },
          meta: { timestamp: new Date().toISOString() },
        },
        { status: 404 }
      )
    }

    console.error("[API] Error DELETE /api/admin/categorias/[id]:", error)
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Error al desactivar categoría" },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 500 }
    )
  }
}
