---
name: mongodb-patterns
description: Patrones de integracion con MongoDB/Mongoose en arquitectura hexagonal: repositorios, mappers, conexion, indices
license: MIT
---

## Conexion (singleton pattern)

```typescript
// adapters/out/mongodb/connection.ts
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI)
  }
  cached.conn = await cached.promise
  return cached.conn
}
```

## Schema vs Entity — separacion estricta

- **Mongoose Schema** (adapters/out/mongodb/schemas/): define como se guarda en MongoDB
- **Domain Entity** (core/domain/entities/): define el modelo de negocio puro
- **Mapper** (adapters/out/mongodb/mappers/): convierte entre ambos mundos

## Patron Repository

```typescript
// core/ports/out/repositories/IUserRepository.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: Email): Promise<User | null>
  save(user: User): Promise<User>
  delete(id: string): Promise<void>
  exists(email: Email): Promise<boolean>
}
```

```typescript
// adapters/out/mongodb/repositories/MongoUserRepository.ts
import { IUserRepository } from '@/core/ports/out/repositories/IUserRepository'

export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: Email): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.value() }).lean()
    return doc ? UserMapper.toDomain(doc) : null
  }

  async save(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user)
    const doc = await UserModel.findByIdAndUpdate(
      data._id, data, { upsert: true, new: true }
    )
    return UserMapper.toDomain(doc)
  }

  async exists(email: Email): Promise<boolean> {
    const doc = await UserModel.exists({ email: email.value() })
    return doc !== null
  }
}
```

## Patron Mapper

```typescript
// adapters/out/mongodb/mappers/UserMapper.ts
import { IUserDocument } from '../schemas/UserSchema'
import { User } from '@/core/domain/entities/User'

export class UserMapper {
  static toDomain(doc: IUserDocument): User {
    return User.create(
      UserId.create(doc._id.toString()),
      Email.create(doc.email),
      doc.name,
      doc.role as UserRole,
      doc.createdAt,
      doc.updatedAt
    )
  }

  static toPersistence(user: User): Record<string, unknown> {
    return {
      _id: user.id.value(),
      email: user.email.value(),
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
```

## Indices

Definir indices en el schema de Mongoose:

```typescript
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ role: 1, createdAt: -1 })
productSchema.index({ category: 1, price: -1 })
productSchema.index({ name: 'text', description: 'text' })
```

## Buenas practicas

- Usar `.lean()` en queries de solo lectura para mejor rendimiento
- Transacciones con `mongoose.startSession()` para operaciones multi-documento
- Soft delete con `deletedAt` en lugar de borrado fisico
- Audit fields (`createdAt`, `updatedAt`) en todos los schemas
- Paginacion con cursor-based (`_id > lastId`), no skip/limit para grandes datasets
- Validar ObjectId con `mongoose.Types.ObjectId.isValid()` antes de queries
- Los schemas de Mongoose usan snake_case en BD, camelCase en la entidad (el mapper transforma)
