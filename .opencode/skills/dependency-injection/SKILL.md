---
name: dependency-injection
description: Inyeccion de dependencias para arquitectura hexagonal. Registro de interfaces, proveedores por entorno, testing con mocks
license: MIT
---

## Contenedor DI con tsyringe

```typescript
// adapters/di/container.ts
import { container } from 'tsyringe'
import { IUserRepository } from '@/core/ports/out/repositories/IUserRepository'
import { MongoUserRepository } from '@/adapters/out/mongodb/repositories/MongoUserRepository'
import { RegisterUserUseCase } from '@/core/use-cases/auth/RegisterUserUseCase'
import { LoginUseCase } from '@/core/use-cases/auth/LoginUseCase'

// Repositories
container.registerSingleton<IUserRepository>('IUserRepository', MongoUserRepository)

// Use cases
container.registerSingleton(RegisterUserUseCase)
container.registerSingleton(LoginUseCase)
```

## Proveedores por entorno

```typescript
// adapters/di/providers.ts
import { container } from 'tsyringe'
import { IEmailService } from '@/core/ports/out/services/IEmailService'
import { SendGridEmailService } from '@/adapters/out/services/SendGridEmailService'
import { MockEmailService } from '@/adapters/out/services/MockEmailService'

export function registerProviders() {
  if (process.env.NODE_ENV === 'production') {
    container.registerSingleton<IEmailService>('IEmailService', SendGridEmailService)
  } else {
    container.registerSingleton<IEmailService>('IEmailService', MockEmailService)
  }
}
```

## Resolucion en route handlers

```typescript
// adapters/in/app/api/auth/register/route.ts
import { container } from '@/adapters/di/container'
import { RegisterUserUseCase } from '@/core/use-cases/auth/RegisterUserUseCase'

export async function POST(req: NextRequest) {
  const useCase = container.resolve(RegisterUserUseCase)
  // ... usar useCase
}
```

## Testing con mocks

```typescript
// tests/unit/core/use-cases/auth/RegisterUserUseCase.test.ts
import 'reflect-metadata'
import { container } from 'tsyringe'
import { IUserRepository } from '@/core/ports/out/repositories/IUserRepository'

beforeEach(() => {
  container.clearInstances()
  const mockRepo = {
    findById: vi.fn(),
    findByEmail: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    exists: vi.fn(),
  }
  container.registerInstance<IUserRepository>('IUserRepository', mockRepo)
})

it('should register user', async () => {
  const useCase = container.resolve(RegisterUserUseCase)
  // ...
})
```

## Alternativa manual (sin libreria)

Si no quieres dependencias, usa un patron service-locator simple:

```typescript
// adapters/di/registry.ts
export class Registry {
  private static instances = new Map<string, unknown>()

  static register<T>(key: string, instance: T): void {
    this.instances.set(key, instance)
  }

  static resolve<T>(key: string): T {
    const instance = this.instances.get(key)
    if (!instance) throw new Error(`No registry entry for: ${key}`)
    return instance as T
  }
}

// Uso
Registry.register<IUserRepository>('IUserRepository', new MongoUserRepository())
const repo = Registry.resolve<IUserRepository>('IUserRepository')
```
