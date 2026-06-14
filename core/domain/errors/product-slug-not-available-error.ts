import { DomainError } from "./domain-error";

export class ProductSlugNotAvailableError extends DomainError {
  constructor(slug: string) {
    super(`El slug ya está en uso: ${slug}`, "PRODUCT_SLUG_NOT_AVAILABLE");
  }
}
