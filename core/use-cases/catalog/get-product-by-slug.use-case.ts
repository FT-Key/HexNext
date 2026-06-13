import type { ICategoryRepository } from "@/core/ports/in/repositories/i-category-repository";
import type { IProductRepository } from "@/core/ports/in/repositories/i-product-repository";
import type { Category } from "@/core/domain/entities/category";
import type { Product } from "@/core/domain/entities/product";
import { DomainError } from "@/core/domain/errors/domain-error";

export class ProductNotFoundError extends DomainError {
  constructor(slug: string) {
    super(`Product not found: ${slug}`, "PRODUCT_NOT_FOUND");
  }
}

export class CategoryNotFoundError extends DomainError {
  constructor(categoriaId: string) {
    super(`Category not found: ${categoriaId}`, "CATEGORY_NOT_FOUND");
  }
}

export interface GetProductBySlugResult {
  product: Product;
  variants: Product[];
  category: Category;
}

export class GetProductBySlugUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(slug: string): Promise<GetProductBySlugResult> {
    const product = await this.productRepository.findBySlug(slug);

    if (!product) {
      throw new ProductNotFoundError(slug);
    }

    const category = await this.categoryRepository.findById(product.categoriaId);

    if (!category) {
      throw new CategoryNotFoundError(product.categoriaId);
    }

    const parentId = product.productoPadreId ?? product.id;
    const variants = await this.productRepository.findByProductoPadreId(parentId);

    if (product.productoPadreId === null) {
      const childVariants = variants.filter((v) => v.id !== product.id);
      return { product, variants: childVariants, category };
    }

    const parent = await this.productRepository.findById(product.productoPadreId!);
    const siblingVariants = variants.filter((v) => v.id !== product.id);

    return {
      product,
      variants: parent ? [parent, ...siblingVariants] : siblingVariants,
      category,
    };
  }
}
