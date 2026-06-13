# Workflow State

## Request
Analisis de sistema completo para HexNext, un e-commerce de tecnologia informatica (componentes PC, perifericos, sillas gamer). Incluye: Armá tu PC con validacion de compatibilidad, comparador de componentes, chatbot con IA (Groq), blog, prensa, trabajá con nosotros, dashboard admin con metricas y logs.

## Clarified Scope
- **Catalogo**: Categorias jerarquicas, productos con variantes (colores, modelos), especificaciones tecnicas
- **Armá tu PC**: Configurador con slots, validacion automatica de compatibilidad, PCs pre-armadas como plantillas editables
- **Comparador**: Productos lado a lado por categoria, especificaciones en filas agrupadas
- **Usuarios**: Registro obligatorio para comprar. Roles: admin, vendedor, cliente
- **Pagos**: Mercado Pago (Checkout Pro + Bricks)
- **Envios**: Simulados desde Tucuman por codigo postal. Admin puede desactivar envios globalmente
- **Contacto**: Formulario con auto-respuesta por email. Seccion WhatsApp/Redes
- **Chatbot**: IA con Groq + RAG sobre productos/envios/info institucional. Publico, sin login
- **Trabajá con nosotros**: Ofertas laborales + postulaciones con CV (Cloudflare R2)
- **Blog**: CRUD por admin, categorias, contenido rico
- **Prensa**: Notas, videos, embeds, documentos descargables
- **Dashboard**: Metricas, logs de auditoria para cambios criticos

## Open Questions
Resueltas durante el analisis. Pendientes menores en REQUIREMENTS.md (multi-idioma futuros, feed Google Shopping, tags de blog, CDN imagenes).

## Plan

### US-001: Navegar catálogo por categorías

#### Arquitectura (Hexagonal)

**Core/Domain** (sin dependencias externas):
- `core/domain/errors/domain-error.ts` — Error base del dominio
- `core/domain/entities/category.ts` — Entidad Category pura
- `core/domain/entities/product.ts` — Entidad Product pura (con `tieneStock`, `descuento`)

**Core/Ports** (interfaces de repositorio):
- `core/ports/in/repositories/i-category-repository.ts` — `findAll()`, `findBySlug()`, `findByPadreId()`
- `core/ports/in/repositories/i-product-repository.ts` — `findByCategoriaIds()`, `findById()`

**Core/Use Cases** (orquestan lógica de negocio):
- `core/use-cases/catalog/get-categories.use-case.ts` — Árbol jerárquico de categorías activas
- `core/use-cases/catalog/get-products-by-category.use-case.ts` — Productos activos de categoría + subcategorías

**Adapters/Out** (infraestructura — mock data):
- `adapters/out/mock/data/categories.ts` — Categorías realistas de tecnología
- `adapters/out/mock/data/products.ts` — Productos realistas con stock variado
- `adapters/out/mock/repositories/mock-category.repository.ts` — Implementación mock
- `adapters/out/mock/repositories/mock-product.repository.ts` — Implementación mock

**Adapters/In** (Next.js App Router):
- `app/(catalog)/layout.tsx` — Layout del catálogo con sidebar de categorías
- `app/(catalog)/page.tsx` — Redirige a la primera categoría
- `app/(catalog)/categorias/[slug]/page.tsx` — Página de productos por categoría

**UI Components** (presentación):
- `components/features/stock-badge.tsx` — Badge "Disponible" / "Sin stock"
- `components/features/product-card.tsx` — Card de producto (imagen, nombre, precio, badge)
- `components/features/category-nav.tsx` — Navegación jerárquica de categorías (recursiva)

**Shared** (utilidades transversales):
- `shared/utils/format-price.ts` — Formateador de precios ARS ($)

## Implementation Notes

### US-001 — Navegar catálogo por categorías (COMPLETADO)

**Arquitectura**: Hexagonal completa implementada:
- `core/domain/` — Entidades puras Category y Product con getters de negocio (tieneStock, descuento)
- `core/ports/in/repositories/` — Interfaces ICategoryRepository, IProductRepository
- `core/use-cases/catalog/` — GetCategoriesUseCase (árbol jerárquico), GetProductsByCategoryUseCase (incluye subcategorías)
- `adapters/out/mock/` — Mock repositories con datos realistas (15 categorías, 22 productos)
- `adapters/in/app/` — Next.js App Router con route group (catalog)
- `ui/components/features/` — CategoryNav (use client), ProductCard, StockBadge

**Decisiones técnicas**:
- Sin MongoDB/configuración de BD — se usa mock data en memoria con interfaces limpias para reemplazar después
- React `cache()` para deduplicar fetch de categorías entre layout y página
- `loading.tsx` con skeleton, `error.tsx` con botón de retry
- `usePathname()` solo en CategoryNav (client component necesario)
- Metadata dinámica con `generateMetadata`
- Mobile-first: sidebar oculta en mobile con menú colapsable dentro de la página de categoría
- Formato de precio ARS con Intl.NumberFormat (es-AR)
- Precios en pesos argentinos realistas

**AC cubiertos**:
- AC-1: ✅ Categorías en jerarquía (sidebar recursiva)
- AC-2: ✅ Click en categoría muestra productos (incluye subcategorías)
- AC-3: ✅ Nombre, precio, imagen placeholder, badge Disponible/Sin stock
- AC-4: ✅ Productos inactivos filtrados en repositorios

### US-003 — Página de detalle de producto (IMPLEMENTADO)

**Arquitectura**: Hexagonal completa:
- `core/ports/in/repositories/i-product-repository.ts` — Nuevos métodos `findBySlug()`, `findByProductoPadreId()`
- `core/use-cases/catalog/get-product-by-slug.use-case.ts` — Nuevo use case con errores tipados (ProductNotFoundError, CategoryNotFoundError)
- `adapters/out/mock/data/products.ts` — 6 nuevos productos variantes (2 para teclados, 1 para gabinete)
- `adapters/out/mock/repositories/mock-product.repository.ts` — Implementación de nuevos métodos
- `app/(catalog)/productos/[slug]/page.tsx` — Server component con generateMetadata + breadcrumb
- `components/features/product-detail.tsx` — Client component principal con estado de variante seleccionada
- `components/features/product-gallery.tsx` — Galería con thumbnails seleccionables
- `components/features/product-specs-table.tsx` — Tabla de especificaciones con filas alternadas
- `components/features/product-variant-selector.tsx` — Selector de variantes con soporte color/texto, deshabilitado sin stock
- `components/features/product-card.tsx` — Envuelto en Link a /productos/[slug]

**Decisiones técnicas**:
- `ProductDetail` como client component para manejar estado de variante seleccionada
- `ProductVariantSelector` soporta variantes de tipo color (círculo de color) y texto
- Variantes sin stock se muestran tachadas y no seleccionables
- Breadcrumb navegable: Inicio > Catálogo > Categoría > Producto
- Open Graph metadata sin type "product" (no soportado por Next.js 16)
- `getPageData()` separa la lógica de fetching del JSX para evitar error de lint (JSX en try/catch)
- Productos variantes: Redragon K552 (3 switches), Logitech G Pro X TKL (2 switches), NZXT H5 Flow (2 colores)

**AC cubiertos**:
- AC-1: ✅ Nombre, precio, galería de imágenes, tabla de especificaciones técnicas
- AC-2: ✅ Selector de variantes (switches/colores) que cambia precio, stock y descripción
- AC-3: ✅ StockBadge "Disponible"/"Sin stock" + cantidad de unidades
- AC-4: ✅ Botón "Agregar al carrito" (deshabilitado si sin stock, placeholder para US-013)

## Review Findings

### US-003 Review (@reviewer)
- **Resultado**: ✅ APROBADO — Sin issues bloqueantes
- **Pendientes (no bloqueantes)**: M-1 (Breadcrumb /categorias no existe) → corregido, M-4 (faltante "use client" en variant-selector) → corregido. M-2 (desacoplar shared de mock), M-3 (loading/not-found), M-5 (diferenciar errores en generateMetadata), M-6 (next/image), M-7 (ocultar specs vacías) → mejoras futuras.

### US-001 Review (@reviewer)
- **1er review**: ❌ No aprobado — B-1 (Link a ruta inexistente), M-1 (catch silencioso), M-2 (faltan loading/error), M-5 (duplicación de fetch)
- **2do review**: ✅ Aprobado — Todos los issues corregidos. Código seguro para merge.

## Test Results
<!-- No hay tests configurados aún en el proyecto (MVP Fase 0) -->

## Lint Results

### US-001 Lint
- Build: ✅ Sin errores
- ESLint: ✅ Sin errores ni warnings
- TypeScript: ✅ Strict mode sin errores

## Commit / PR Status

### US-001 ✅ COMPLETADO
- Branch: `feat/US-001-catalogo-por-categorias`
- Commit: `451f9df` — `feat(US-001): navegar catálogo por categorías`
- Merge: Squash en dev — `7d98b0c`
- PR: [#2](https://github.com/FT-Key/HexNext/pull/2)
- Card Trello: 👀 Review (pendiente mover a Done)

## Current Phase
US-003 EN PROGRESO — Página de detalle de producto

## Next Steps
1. Completar implementación US-003: Página de detalle de producto

---

### US-003: Página de detalle de producto

#### Requisitos (AC)
- **AC-1**: Muestra nombre, precio, imágenes (galería), especificaciones técnicas en tabla
- **AC-2**: Si tiene variantes (color, modelo), se muestran selectores y al cambiar varía el precio/stock
- **AC-3**: Muestra stock disponible
- **AC-4**: Botón "Agregar al carrito"

#### Arquitectura

**Core/Ports** (extender interfaces):
- `core/ports/in/repositories/i-product-repository.ts` — Add `findBySlug()`, `findByProductoPadreId()`

**Core/Use Cases** (nuevo):
- `core/use-cases/catalog/get-product-by-slug.use-case.ts` — Obtiene producto por slug + sus variantes + categoría

**Adapters/Out** (extender):
- `adapters/out/mock/data/products.ts` — Agregar 2-3 productos variantes (teclado switches, mouse color)
- `adapters/out/mock/repositories/mock-product.repository.ts` — Implementar findBySlug y findByProductoPadreId

**Adapters/In** (nueva ruta):
- `app/(catalog)/productos/[slug]/page.tsx` — Server component con metadata dinámica

**UI Components** (nuevos):
- `components/features/product-detail.tsx` — Client component principal (use client)
- `components/features/product-gallery.tsx` — Galería de imágenes con thumbnails
- `components/features/product-variant-selector.tsx` — Selector de variantes
- `components/features/product-specs-table.tsx` — Tabla de especificaciones técnicas

**Shared** (nuevo):
- `shared/utils/get-product-by-slug.ts` — cache() wrapper

**Modificar existente**:
- `components/features/product-card.tsx` — Envolver en Link a /productos/[slug]

## Definition of Done
- [x] REQUIREMENTS.md completo con todas las secciones
- [x] Entidades, reglas de negocio y user stories definidas
- [x] Open Questions resueltas con el usuario
- [x] Cards creadas en Trello (41 cards, 3 listas de backlog + In Progress + Review + Done)
- [x] Board ID y card IDs registrados en REQUIREMENTS.md para acceso de otros agentes
- [x] Iniciar implementacion de primera US (US-001)
- [ ] Iniciar implementacion de US-002
