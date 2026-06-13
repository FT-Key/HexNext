import { DomainError } from "./domain-error";

export class EntityNotFoundError extends DomainError {
  constructor(entityName: string, identifier: string) {
    super(
      `${entityName} not found: ${identifier}`,
      `${entityName.toUpperCase()}_NOT_FOUND`
    );
  }
}
