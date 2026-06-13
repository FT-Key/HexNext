---
name: logging
description: Structured logging con pino, niveles, contexto enriquecido, correlacion entre capas. Sin console.log en produccion
license: MIT
---

## Logger con pino

```typescript
// shared/utils/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  serializers: {
    req: (req) => ({ method: req.method, url: req.url }),
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
  },
})
```

## Logger con contexto (correlation ID)

```typescript
// shared/utils/logger.ts (ampliacion)
import { AsyncLocalStorage } from 'async_hooks'

const asyncStorage = new AsyncLocalStorage<{ requestId: string }>()

export function withRequestId<T>(requestId: string, fn: () => T): T {
  return asyncStorage.run({ requestId }, fn)
}

export function createContextLogger(module: string) {
  return {
    debug: (msg: string, data?: unknown) => {
      const ctx = asyncStorage.getStore()
      logger.debug({ module, requestId: ctx?.requestId, ...data }, msg)
    },
    info: (msg: string, data?: unknown) => {
      const ctx = asyncStorage.getStore()
      logger.info({ module, requestId: ctx?.requestId, ...data }, msg)
    },
    warn: (msg: string, data?: unknown) => {
      const ctx = asyncStorage.getStore()
      logger.warn({ module, requestId: ctx?.requestId, ...data }, msg)
    },
    error: (msg: string, error?: unknown, data?: unknown) => {
      const ctx = asyncStorage.getStore()
      logger.error(
        { module, requestId: ctx?.requestId, err: error, ...data },
        msg
      )
    },
  }
}
```

## Uso en cada capa

```typescript
// En use cases
const log = createContextLogger('RegisterUserUseCase')

export class RegisterUserUseCase {
  async execute(dto: RegisterUserDTO) {
    log.info('Registering user', { email: dto.email })
    // ...
    log.debug('User saved successfully', { userId: user.id.value() })
  }
}

// En adapters
const log = createContextLogger('MongoUserRepository')

export class MongoUserRepository implements IUserRepository {
  async save(user: User) {
    log.debug('Saving user to MongoDB', { userId: user.id.value() })
    // ...
  }
}
```

## Middleware para requestId en API routes

```typescript
// adapters/in/app/api/middleware.ts
import { randomUUID } from 'crypto'
import { withRequestId } from '@/shared/utils/logger'

export async function apiMiddleware(req: NextRequest, handler: () => Promise<NextResponse>) {
  const requestId = randomUUID()
  req.headers.set('x-request-id', requestId)
  logger.info({ requestId, method: req.method, url: req.url }, 'Incoming request')

  const start = Date.now()
  const response = await withRequestId(requestId, handler)
  const duration = Date.now() - start

  logger.info({ requestId, status: response.status, duration }, 'Request completed')
  response.headers.set('x-request-id', requestId)
  response.headers.set('x-response-time', `${duration}ms`)

  return response
}
```

## Reglas

- Niveles: debug < info < warn < error
- debug: todo el detalle interno (solo dev)
- info: hits importantes (registro, login, compra)
- warn: situaciones inesperadas no criticas
- error: fallos que requieren atencion
- NO loggear secrets, passwords, tokens
- NO usar console.log en produccion (prohibido en ESLint)
- Incluir correlationId en cada log para tracing
