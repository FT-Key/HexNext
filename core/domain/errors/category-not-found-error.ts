import { DomainError } from "./domain-error";

export class CategoryNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Categoría no encontrada: ${id}`, "CATEGORY_NOT_FOUND");
  }
}
