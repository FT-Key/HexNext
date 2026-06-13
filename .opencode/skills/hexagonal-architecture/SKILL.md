---
name: hexagonal-architecture
description: Arquitectura hexagonal (ports & adapters) para Next.js con separacion estricta entre dominio, aplicacion e infraestructura
license: MIT
---

## Estructura de carpetas

```
src/
├── core/                           # DOMAIN - cero dependencias externas
│   ├── domain/
│   │   ├── entities/               # Entidades del negocio (User, Product, Order)
│   │   ├── value-objects/          # Value objects inmutables (Email, Money, Slug)
│   │   └── errors/                 # Errores de dominio (DomainError subclasses)
│   │
│   ├── ports/
│   │   ├── in/                     # Inbound ports (use case interfaces)
│   │   │   └── repositories/       # Ej: IUserRepository
│   │   └── out/                    # Outbound ports
│   │       └── services/           # Ej: IEmailService, IPaymentGateway
│   │
│   └── use-cases/                  # Application services (implementan ports/in)
│       └── auth/
│           ├── RegisterUserUseCase.ts
│           ├── LoginUseCase.ts
│           └── RefreshTokenUseCase.ts
│
├── adapters/                       # INFRASTRUCTURE - implementa ports
│   ├── in/                         # Inbound adapters (como entra data)
│   │   ├── app/                    # Next.js App Router (paginas)
│   │   │   ├── (auth)/
│   │   │   ├── (dashboard)/
│   │   │   └── api/                # Route handlers (API endpoints)
│   │   │       └── auth/
│   │   └── validation/             # Zod schemas para validacion de input
│   │
│   ├── out/                        # Outbound adapters (como sale data)
│   │   ├── mongodb/                # Implementaciones con MongoDB/Mongoose
│   │   │   ├── repositories/       # Implementan IUserRepository, etc.
│   │   │   ├── schemas/            # Mongoose schemas (NO en dominio)
│   │   │   └── mappers/            # Mongoose document <-> Domain entity
│   │   └── services/               # Implementan IEmailService, etc.
│   │
│   └── di/                         # Dependency Injection
│       └── container.ts            # Registro de dependencias
│       └── providers.ts            # Proveedores por entorno
│
├── ui/                             # PRESENTATION - componentes React puros
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   └── features/               # Feature-specific components
│   ├── layouts/                    # Layouts de pagina
│   └── hooks/                      # Custom hooks
│
└── shared/                         # COMPARTIDO - cross-cutting
    ├── errors/                     # Manejadores de error globales
    ├── utils/                      # Funciones helper puras
    └── types/                      # Tipos compartidos
```

## Reglas de dependencia

```
core/          → nada (no imports de frameworks, Next.js, MongoDB, etc.)
adapters/out/  → core/ports/out/  (implementa interfaces)
adapters/in/   → core/use-cases/  (llama a casos de uso)
ui/            → adapters/in/app/ (solo paginas y componentes)
shared/        → cualquiera (utilidades transversales)
```

## Principios

1. El DOMAIN (core/) NO importa NADA de infraestructura
2. Los puertos (interfaces) se definen en core/ports/
3. Los adapters implementan esas interfaces
4. La DI conecta todo en tiempo de ejecucion
5. Los use cases orquestan la logica de negocio
6. Las entidades son puras: validacion en constructor, metodos de negocio
7. Value objects son inmutables con .value() para acceso

## Convenciones de naming

- Interfaces de puertos: `IUserRepository`, `IEmailService`
- Use cases: `RegisterUserUseCase`, `GetUserProfileUseCase`
- Adaptadores: `MongoUserRepository`, `SendGridEmailService`
- Entidades: `User`, `Product`, `Order` (sin prefijo)
- Value objects: `Email`, `UserId`, `Money`

## Ejemplo de flujo completo

```
Request HTTP
  → Route Handler (adapters/in/app/api/)
    → valida con Zod
      → llama a RegisterUserUseCase (core/use-cases/)
        → User entity se crea (core/domain/entities/)
          → llama a IUserRepository.save() (core/ports/out/)
            → MongoUserRepository.save() (adapters/out/mongodb/)
              → mapea entity → Mongoose document → guarda
        → resultado vuelve ← entidad de dominio
  → Route Handler responde JSON unificado (api-response skill)
```
