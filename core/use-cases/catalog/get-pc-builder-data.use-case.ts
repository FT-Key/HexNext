import type { ICategoryRepository } from "@/core/ports/in/repositories/i-category-repository";
import type { IProductRepository } from "@/core/ports/in/repositories/i-product-repository";
import type { ProductProps } from "@/core/domain/entities/product";

export interface PcBuilderSlot {
  id: string;
  nombre: string;
  categoriaId: string;
  icono: string;
}

export interface PcBuilderData {
  slots: PcBuilderSlot[];
  productsByCategory: Record<string, ProductProps[]>;
}

const SLOTS: PcBuilderSlot[] = [
  { id: "cpu", nombre: "Procesador", categoriaId: "cat-2", icono: "CPU" },
  { id: "motherboard", nombre: "Motherboard", categoriaId: "cat-3", icono: "Motherboard" },
  { id: "ram", nombre: "Memoria RAM", categoriaId: "cat-4", icono: "RAM" },
  { id: "gpu", nombre: "Placa de Video", categoriaId: "cat-6", icono: "GPU" },
  { id: "storage", nombre: "Almacenamiento", categoriaId: "cat-5", icono: "Storage" },
  { id: "psu", nombre: "Fuente de Poder", categoriaId: "cat-7", icono: "PSU" },
  { id: "case", nombre: "Gabinete", categoriaId: "cat-8", icono: "Case" },
];

export class GetPcBuilderDataUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly productRepository: IProductRepository
  ) {}

  async execute(): Promise<PcBuilderData> {
    const categoriaIds = SLOTS.map((s) => s.categoriaId);
    const products = await this.productRepository.findByCategoriaIds(categoriaIds);

    const productsByCategory: Record<string, ProductProps[]> = {};
    for (const slot of SLOTS) {
      productsByCategory[slot.id] = products
        .filter((p) => p.categoriaId === slot.categoriaId && p.activo)
        .map((p) => ({
          id: p.id,
          sku: p.sku,
          nombre: p.nombre,
          slug: p.slug,
          descripcion: p.descripcion,
          marca: p.marca,
          precio: p.precio,
          precioComparativa: p.precioComparativa,
          stock: p.stock,
          categoriaId: p.categoriaId,
          productoPadreId: p.productoPadreId,
          atributos: p.atributos,
          especificaciones: p.especificaciones,
          imagenes: p.imagenes,
          destacado: p.destacado,
          activo: p.activo,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }));
    }

    return { slots: SLOTS, productsByCategory };
  }
}
