---
name: design-patterns
description: Catalogo de patrones de diseno GoF y arquitectonicos aprobados para el proyecto. No usar patrones donde una funcion simple baste
license: MIT
---

## Factory Method

Creacion de objetos complejos o con logica condicional.

```typescript
// core/domain/entities/User.ts
export class UserFactory {
  static create(props: CreateUserProps): User {
    const id = UserId.create()
    const email = Email.create(props.email)

    return new User(
      id,
      email,
      props.name,
      UserRole.USER,
      new Date(),
      new Date()
    )
  }

  static fromPersistence(data: UserPersistence): User {
    return new User(
      UserId.fromString(data._id),
      Email.create(data.email),
      data.name,
      data.role as UserRole,
      data.createdAt,
      data.updatedAt
    )
  }
}
```

## Repository

Abstraccion sobre la capa de datos. Ver skill mongodb-patterns para detalle.

## Adapter / Mapper

Convierte entre interfaces incompatibles sin acoplarlas.

```typescript
// adapters/out/mongodb/mappers/UserMapper.ts (ver mongodb-patterns)
```

## Use Case (Command Pattern)

Cada operacion de negocio es un objeto con un metodo execute().

```typescript
// core/use-cases/auth/RegisterUserUseCase.ts
export class RegisterUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly emailService: IEmailService
  ) {}

  async execute(dto: RegisterUserDTO): Promise<Result<User, DomainError>> {
    const email = Email.create(dto.email)
    const exists = await this.userRepo.exists(email)
    if (exists) {
      return Result.fail(new EmailAlreadyExistsError(dto.email))
    }

    const user = UserFactory.create(dto)
    const saved = await this.userRepo.save(user)
    await this.emailService.sendWelcome(saved.email)

    return Result.ok(saved)
  }
}
```

## Value Object

Objeto inmutable que encapsula un valor con validacion.

```typescript
// core/domain/value-objects/Email.ts
export class Email {
  private constructor(private readonly _value: string) {}

  static create(value: string): Email {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      throw new InvalidEmailError(value)
    }
    return new Email(value.toLowerCase())
  }

  value(): string {
    return this._value
  }

  equals(other: Email): boolean {
    return this._value === other._value
  }
}
```

## Result Pattern

Encapsula exito/fracaso sin excepciones para flujos esperados.

```typescript
// core/domain/errors/Result.ts
export class Result<T, E extends Error = Error> {
  private constructor(
    private readonly _value?: T,
    private readonly _error?: E
  ) {}

  static ok<T>(value: T): Result<T, never> {
    return new Result(value)
  }

  static fail<E extends Error>(error: E): Result<never, E> {
    return new Result(undefined, error)
  }

  get isOk(): boolean { return !this._error }
  get isFail(): boolean { return !!this._error }

  unwrap(): T {
    if (this.isFail) throw this._error
    return this._value!
  }

  unwrapOr(defaultValue: T): T {
    return this.isOk ? this._value! : defaultValue
  }
}
```

## Reglas de uso

- Factory para creacion compleja o condicional
- Repository siempre para acceso a datos
- Mapper para cada conversion entre capas
- Use Case para cada operacion de negocio
- Value Object para tipos primitivos con validacion (Email, Phone, DNI, Money)
- Result Pattern para flujos donde el fallo es esperado (no excepcional)
- NO uses patrones donde una funcion simple baste (KISS)
