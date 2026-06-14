import { DomainError } from "./domain-error";

export class ProductNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Producto no encontrado: ${id}`, "PRODUCT_NOT_FOUND");
  }
}
