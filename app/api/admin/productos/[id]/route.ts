import { NextResponse } from "next/server"
import { MockProductRepository } from "@/adapters/out/mock/repositories/mock-product.repository"
import { UpdateProductUseCase } from "@/core/use-cases/admin/update-product.use-case"
import { ToggleProductActiveUseCase } from "@/core/use-cases/admin/toggle-product-active.use-case"
import { productFormSchema } from "@/shared/validation/product-schema"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const repo = new MockProductRepository()
    const product = await repo.findById(id)

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "PRODUCT_NOT_FOUND", message: `Producto no encontrado: ${id}` },
          meta: { timestamp: new Date().toISOString() },
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch (error) {
    console.error("[API] Error GET /api/admin/productos/[id]:", error)
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Error al obtener producto" },
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
    const parsed = productFormSchema.partial().safeParse(body)

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

    const repo = new MockProductRepository()
    const useCase = new UpdateProductUseCase(repo)
    const product = await useCase.execute({ id, ...parsed.data })

    return NextResponse.json({
      success: true,
      data: product,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch (error) {
    const err = error as Error & { code?: string; httpStatus?: number }

    if (err.code === "PRODUCT_NOT_FOUND") {
      return NextResponse.json(
        {
          success: false,
          error: { code: err.code, message: err.message },
          meta: { timestamp: new Date().toISOString() },
        },
        { status: 404 }
      )
    }

    if (err.code === "PRODUCT_SLUG_NOT_AVAILABLE") {
      return NextResponse.json(
        {
          success: false,
          error: { code: err.code, message: err.message },
          meta: { timestamp: new Date().toISOString() },
        },
        { status: 409 }
      )
    }

    console.error("[API] Error PATCH /api/admin/productos/[id]:", error)
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Error al actualizar producto" },
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
    const repo = new MockProductRepository()
    const useCase = new ToggleProductActiveUseCase(repo)
    const product = await useCase.execute(id)

    return NextResponse.json({
      success: true,
      data: product,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch (error) {
    const err = error as Error & { code?: string }

    if (err.code === "PRODUCT_NOT_FOUND") {
      return NextResponse.json(
        {
          success: false,
          error: { code: err.code, message: err.message },
          meta: { timestamp: new Date().toISOString() },
        },
        { status: 404 }
      )
    }

    console.error("[API] Error DELETE /api/admin/productos/[id]:", error)
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Error al desactivar producto" },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 500 }
    )
  }
}
