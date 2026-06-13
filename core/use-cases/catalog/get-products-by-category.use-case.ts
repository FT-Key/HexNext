import type { ICategoryRepository } from "@/core/ports/in/repositories/i-category-repository";
import type { IProductRepository } from "@/core/ports/in/repositories/i-product-repository";
import type { Category } from "@/core/domain/entities/category";
import type { Product } from "@/core/domain/entities/product";

export class GetProductsByCategoryUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly productRepository: IProductRepository
  ) {}

  async execute(categorySlug: string): Promise<{
    category: Category;
    products: Product[];
    subcategories: Category[];
  }> {
    const category = await this.categoryRepository.findBySlug(categorySlug);

    if (!category) {
      throw new Error(`Category not found: ${categorySlug}`);
    }

    const subcategories = await this.categoryRepository.findByPadreId(category.id);
    const allCategoryIds = [category.id, ...subcategories.map((s) => s.id)];
    const products = await this.productRepository.findByCategoriaIds(allCategoryIds);

    return {
      category,
      products,
      subcategories,
    };
  }
}
