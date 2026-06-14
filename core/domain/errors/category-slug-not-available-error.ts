import { DomainError } from "./domain-error";

export class CategorySlugNotAvailableError extends DomainError {
  constructor(slug: string) {
    super(`El slug de categoría ya está en uso: ${slug}`, "CATEGORY_SLUG_NOT_AVAILABLE");
  }
}
