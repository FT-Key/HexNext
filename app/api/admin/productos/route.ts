import { NextResponse } from "next/server"
import { MockProductRepository } from "@/adapters/out/mock/repositories/mock-product.repository"
import { CreateProductUseCase } from "@/core/use-cases/admin/create-product.use-case"
import { productFormSchema } from "@/shared/validation/product-schema"

export async function GET() {
  try {
    const repo = new MockProductRepository()
    const products = await repo.findAllAdmin()

    return NextResponse.json({
      success: true,
      data: products,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch (error) {
    console.error("[API] Error GET /api/admin/productos:", error)
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Error al obtener productos" },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = productFormSchema.safeParse(body)

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
    const useCase = new CreateProductUseCase(repo)
    const product = await useCase.execute(parsed.data)

    return NextResponse.json(
      {
        success: true,
        data: product,
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 201 }
    )
  } catch (error) {
    const err = error as Error & { code?: string; httpStatus?: number }

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

    console.error("[API] Error POST /api/admin/productos:", error)
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Error al crear producto" },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 500 }
    )
  }
}
