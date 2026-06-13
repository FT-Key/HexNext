---
name: error-handling
description: Jerarquia de errores para arquitectura hexagonal. DomainError, ApplicationError, InfrastructureError. Result pattern y manejadores globales
license: MIT
---

## Jerarquia de errores

```
Error
└── AppError (base)
    ├── DomainError        ← reglas de negocio violadas
    │   ├── InvalidEmailError
    │   ├── InvalidAmountError
    │   └── EntityNotFoundError
    ├── ApplicationError   ← errores de casos de uso
    │   ├── UnauthorizedError
    │   ├── ForbiddenError
    │   └── ValidationError
    └── InfrastructureError ← errores tecnicos
        ├── DatabaseError
        ├── EmailSendError
        └── ExternalServiceError
```

## Implementacion

```typescript
// core/domain/errors/AppError.ts
export abstract class AppError extends Error {
  abstract readonly code: string
  abstract readonly httpStatus: number

  constructor(message: string, public readonly details?: unknown) {
    super(message)
    this.name = this.constructor.name
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
    }
  }
}

// core/domain/errors/DomainError.ts
export abstract class DomainError extends AppError {
  readonly httpStatus = 400
}

// core/domain/errors/InvalidEmailError.ts
export class InvalidEmailError extends DomainError {
  readonly code = 'INVALID_EMAIL'
  constructor(email: string) {
    super(`Invalid email format: ${email}`, { email })
  }
}
```

## Global Error Handler (API)

```typescript
// adapters/in/app/api/error-handler.ts
import { NextResponse } from 'next/server'
import { AppError } from '@/core/domain/errors/AppError'

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, error: error.toJSON() },
      { status: error.httpStatus }
    )
  }

  // Error desconocido — no exponer detalles internos
  console.error('Unhandled error:', error)
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    },
    { status: 500 }
  )
}
```

## Result Pattern para errores esperados

Usar Result en use cases cuando el fallo es parte del flujo normal:

```typescript
const result = await useCase.execute(dto)
if (result.isFail) {
  // result.error es un DomainError tipado
  return handleApiError(result.error)
}
// result.value es el dato de exito
```

## Error Boundaries (UI)

Cada segmento de ruta debe tener su `error.tsx`:

```typescript
'use client'
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-2xl font-bold">Algo salio mal</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Intentar de nuevo</Button>
    </div>
  )
}
```
