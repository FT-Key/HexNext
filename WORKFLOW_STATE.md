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
✅ **APROBADO** — Sin issues bloqueantes. Código listo para merge.

**Veredicto:** Todos los AC cubiertos, build TypeScript strict pasa, ESLint sin errores, lógica de variantes correcta.

**Recomendaciones (no bloqueantes):**
- **M-1**: `ProductVariantSelector` no tiene `"use client"` — viola convención del proyecto de Next.js para componentes con interactividad. Aunque técnicamente funciona (su padre es Client Component), es frágil a refactorizaciones.
- **M-2**: `shared/utils/get-product-by-slug.ts` instancia repositorios mock directamente, acoplando shared a infraestructura. Refactorizar cuando se implemente DI.
- **M-3**: Falta `loading.tsx` y `not-found.tsx` en `app/(catalog)/productos/[slug]/` — mejora UX.
- **M-4**: Breadcrumb link a `/categorias` podría ser 404 si no existe página de listado.
- **M-5**: `generateMetadata` usa catch genérico que trata cualquier error como "Producto no encontrado".
- **M-6**: Uso de `<img>` en vez de `<Image>` de Next.js (ya advertido por ESLint, aceptable para MVP).
- **M-7**: Sección "Especificaciones técnicas" se renderiza incluso si está vacía.

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

### US-003 Lint
- Build: ✅ Sin errores
- ESLint: ✅ Solo 1 warning aceptable (`<img>` en product-gallery, placeholder para MVP)
- TypeScript: ✅ Strict mode sin errores

### US-002 Lint
- Build: ✅ Sin errores
- ESLint: ✅ 1 warning (react-hooks/exhaustive-deps en filter-sidebar.tsx — no bloqueante)
- TypeScript: ✅ Strict mode sin errores

## Commit / PR Status

### US-001 ✅ COMPLETADO
- Branch: `feat/US-001-catalogo-por-categorias`
- Commit: `451f9df` — `feat(US-001): navegar catálogo por categorías`
- Merge: Squash en dev — `7d98b0c`
- PR: [#2](https://github.com/FT-Key/HexNext/pull/2)
- Card Trello: ✅ Done

### US-002 ✅ COMPLETADO
- Branch: `feat/US-002-filtrar-ordenar-productos`
- Merge: Merge a dev completado (junio 2026)
- Card Trello: ✅ Done

### US-003 ✅ COMPLETADO
- Branch: `feat/US-003-detalle-producto`
- Merge: Merge a dev completado (commit 65fa13d)
- PR: [#3](https://github.com/FT-Key/HexNext/pull/3)
- Card Trello: ✅ Done

## Next Steps
1. Iniciar implementación de **US-042**: Style Audit — aplicar Emerald Terminal a componentes de US-001, US-002 y US-003
2. Card creada en Trello: 📋 Backlog (Must Have - MVP) — `6a2db3148d92f5283331dccf`
3. Después de US-042, continuar con la siguiente US del backlog MVP

## Definition of Done
- [x] REQUIREMENTS.md completo con todas las secciones
- [x] Entidades, reglas de negocio y user stories definidas
- [x] Open Questions resueltas con el usuario
- [x] Cards creadas en Trello (41 cards, 3 listas de backlog + In Progress + Review + Done)
- [x] Board ID y card IDs registrados en REQUIREMENTS.md para acceso de otros agentes
- [x] Iniciar implementacion de primera US (US-001)
- [x] US-002: Filtrar y ordenar productos implementado

---

### US-002: Filtrar y ordenar productos

**Objetivo**: Permitir al cliente filtrar productos por precio, marca y atributos clave de la categoría, y ordenarlos por precio, nombre, fecha o popularidad. Los filtros se reflejan en la URL para poder compartir la búsqueda.

**Card Trello**: `6a2d364577e761ae7d231e3d` — https://trello.com/c/W85Jfclk

#### Arquitectura (Hexagonal)

**Core/Domain** — cambios en entidad existente:
- `core/domain/entities/product.ts` — Agregar campo `marca: string` a `ProductProps` y clase `Product`

**Core/Use Cases** — nuevo caso de uso:
- `core/use-cases/catalog/get-filtered-products.use-case.ts` — Recibe slug de categoría + filtros + ordenación, devuelve productos filtrados + metadatos de opciones de filtro disponibles
- `core/use-cases/catalog/types.ts` — Tipos compartidos: `ProductFilters`, `SortOption`, `FilteredResult`, `FilterOptions`

**Adapters/Out** — modificar datos mock:
- `adapters/out/mock/data/products.ts` — Agregar `marca` a todos los productos (22 productos)
- `adapters/out/mock/repositories/mock-product.repository.ts` — Sin cambios (ya tiene `findAll()`)

**Adapters/In** — modificar página existente:
- `app/(catalog)/categorias/[slug]/page.tsx` — Aceptar `searchParams`, usar nuevo caso de uso, pasar datos a componentes de filtro

**UI Components** — nuevos componentes:
- `components/features/filter-sidebar.tsx` — Sidebar con filtros (client component)
- `components/features/sort-dropdown.tsx` — Dropdown de ordenación (client component)
- `components/features/product-card.tsx` — Modificar para mostrar marca

**Shared** — nuevo wrapper:
- `shared/utils/get-filtered-products.ts` — Wrapper con `React.cache()` para el nuevo caso de uso

---

#### Archivos a crear (6 archivos)

1. **`core/use-cases/catalog/types.ts`**
   - `SortOption` type: `'precio-asc' | 'precio-desc' | 'nombre-asc' | 'nombre-desc' | 'fecha-desc' | 'popular-desc'`
   - `ProductFilters` interface: `{ precioMin?: number; precioMax?: number; marcas?: string[]; specs?: Record<string, string[]> }`
   - `AttributeFilterOption` interface: `{ nombre: string; valores: { valor: string; count: number }[] }`
   - `FilterOptions` interface: `{ brands: { nombre: string; count: number }[]; attributeFilters: AttributeFilterOption[] }`
   - `FilteredResult` interface: `{ products: Product[]; category: Category; filterOptions: FilterOptions }`

2. **`core/use-cases/catalog/get-filtered-products.use-case.ts`**
   - Clase `GetFilteredProductsUseCase`
   - Constructor: `(categoryRepo: ICategoryRepository, productRepo: IProductRepository)`
   - Método `execute(slug: string, filters: ProductFilters, sort: SortOption): Promise<FilteredResult>`
   - Flujo:
     1. Obtener categoría por slug (como existe)
     2. Obtener subcategorías
     3. Obtener productos de categoría + subcategorías
     4. Extraer `FilterOptions` del set completo de productos ANTES de filtrar (brands disponibles, valores de specs)
     5. Aplicar filtros sobre los productos (in-memory):
        - Filtro por `precioMin`/`precioMax`
        - Filtro por `marcas` (array de strings)
        - Filtro por `specs` (coincidencia exacta en `especificaciones` → `{ nombre, valor }`)
     6. Aplicar ordenación:
        - `precio-asc`: sort por `precio` ascendente
        - `precio-desc`: sort por `precio` descendente
        - `nombre-asc`: sort por `nombre` A-Z
        - `nombre-desc`: sort por `nombre` Z-A
        - `fecha-desc`: sort por `createdAt` descendente (más nuevo)
        - `popular-desc`: sort por `stock` descendente (más vendido/popular como proxy)
     7. Retornar `FilteredResult`

3. **`shared/utils/get-filtered-products.ts`**
   - Función `getFilteredProducts(slug, filters, sort)` con `React.cache()`
   - Instancia `MockCategoryRepository`, `MockProductRepository`, `GetFilteredProductsUseCase`
   - Llama a `useCase.execute()`

4. **`components/features/filter-sidebar.tsx`** (client component, `'use client'`)
   - Props: `FilterSidebarProps`
     ```typescript
     interface FilterSidebarProps {
       filterOptions: FilterOptions;
       categorySlug: string;
       currentFilters: {
         precioMin?: string;
         precioMax?: string;
         marcas?: string[];
         specs?: Record<string, string[]>;
       };
       currentSort?: SortOption;
     }
     ```
   - Sección "Precio":
     - Dos inputs numéricos: "Mín" y "Máx"
     - Al cambiar → actualiza URL con `precioMin`/`precioMax` (debounced o con botón "Aplicar")
   - Sección "Marca":
     - Checkboxes para cada marca disponible (con count de productos)
     - Al seleccionar/deseleccionar → actualiza URL con `marca=AMD,NVIDIA`
   - Sección "Especificaciones" (dinámico por categoría):
     - Grupo colapsable por cada spec (ej: "Socket", "Capacidad")
     - Checkboxes para cada valor disponible (con count)
     - Al seleccionar → actualiza URL con query param del spec (ej: `socket=AM5,LGA1700`)
   - Botón "Limpiar filtros" que remueve todos los searchParams

   Estrategia de actualización de URL:
   - Usar `useRouter` + `useSearchParams` de `next/navigation`
   - En cada cambio de filtro, construir nueva URL con `URLSearchParams`
   - `router.replace(pathname + "?" + params.toString(), { scroll: false })`
   - Esto desencadena un re-render del Server Component que recibe los nuevos `searchParams`

5. **`components/features/sort-dropdown.tsx`** (client component, `'use client'`)
   - Props: `SortDropdownProps`
     ```typescript
     interface SortDropdownProps {
       currentSort?: SortOption;
       categorySlug: string;
       currentFilters: Record<string, string>; // other search params to preserve
     }
     ```
   - Select/dropdown con opciones:
     - `nombre-asc`: "Nombre A-Z"
     - `nombre-desc`: "Nombre Z-A"
     - `precio-asc`: "Menor precio"
     - `precio-desc`: "Mayor precio"
     - `fecha-desc`: "Más nuevos"
     - `popular-desc`: "Más populares"
   - Al cambiar → actualiza URL con `orden` param

6. **`components/ui/label.tsx`** — Componente shadcn/ui Label (necesario para los checkboxes y filtros)
   - Añadir mediante `npx shadcn@latest add label`

7. **`components/ui/checkbox.tsx`** — Componente shadcn/ui Checkbox
   - Añadir mediante `npx shadcn@latest add checkbox`

8. **`components/ui/separator.tsx`** — Componente shadcn/ui Separator (opcional, para dividir secciones del sidebar)
   - Añadir mediante `npx shadcn@latest add separator`

#### Archivos a modificar (4 archivos)

1. **`core/domain/entities/product.ts`**
   - Agregar `marca: string` a `ProductProps` interface
   - Agregar `public readonly marca: string` a la clase `Product`
   - Agregar `this.marca = props.marca` en el constructor

2. **`adapters/out/mock/data/products.ts`**
   - Agregar `marca` a cada uno de los 22 productos mock. Marcas a asignar:
     - `prod-1` (Ryzen 7600X): `"AMD"`
     - `prod-2` (i5-14600K): `"Intel"`
     - `prod-3` (Ryzen 7800X3D): `"AMD"`
     - `prod-4` (ASUS B650-A): `"ASUS"`
     - `prod-5` (Gigabyte Z790): `"Gigabyte"`
     - `prod-6` (Corsair Vengeance): `"Corsair"`
     - `prod-7` (Kingston Fury): `"Kingston"`
     - `prod-8` (WD SN850X): `"Western Digital"`
     - `prod-9` (RTX 4070 Super): `"NVIDIA"`
     - `prod-10` (RX 7800 XT): `"AMD"`
     - `prod-11` (Corsair RM750e): `"Corsair"`
     - `prod-12` (NZXT H5 Flow): `"NZXT"`
     - `prod-13` (Redragon K552): `"Redragon"`
     - `prod-14` (Logitech G502): `"Logitech"`
     - `prod-15` (HyperX Cloud II): `"HyperX"`
     - `prod-16` (Samsung Odyssey): `"Samsung"`
     - `prod-17` (Corsair T3 Rush): `"Corsair"`
     - `prod-18` (TP-Link Archer): `"TP-Link"`
     - `prod-19` (i3-14100F): `"Intel"`
     - `prod-20` (Samsung 990 Pro): `"Samsung"`
     - `prod-21` (RTX 4090): `"NVIDIA"`
     - `prod-22` (Logitech G Pro X): `"Logitech"`

3. **`app/(catalog)/categorias/[slug]/page.tsx`**
   - Actualizar props de página para recibir `searchParams`: `params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }>`
   - Extraer filtros de `searchParams`:
     - `precioMin` → número (o undefined)
     - `precioMax` → número (o undefined)
     - `marca` → string separado por coma → array (o undefined)
     - Specs dinámicos: cualquier otro param que no sea `precioMin`, `precioMax`, `marca`, `orden` → se interpreta como filtro de spec
     - `orden` → `SortOption` (default: `'nombre-asc'`)
   - Llamar a `getFilteredProducts(slug, filters, sort)` en lugar de `getProductsByCategory(slug)`
   - Agregar `FilterSidebar` dentro del `<aside>` existente
   - Agregar `SortDropdown` arriba del grid de productos (entre el breadcrumb y los productos)
   - Pasar `filterOptions` a `FilterSidebar`
   - El grid de productos se mantiene igual, solo cambia la fuente de datos

4. **`components/features/product-card.tsx`**
   - Agregar visualización de `marca` (texto pequeño arriba del nombre)
   - Opcional: badge de marca con estilo sutil

#### Tipos e interfaces nuevos

```typescript
// core/use-cases/catalog/types.ts

export type SortOption =
  | 'precio-asc'
  | 'precio-desc'
  | 'nombre-asc'
  | 'nombre-desc'
  | 'fecha-desc'
  | 'popular-desc';

export interface ProductFilters {
  precioMin?: number;
  precioMax?: number;
  marcas?: string[];
  specs?: Record<string, string[]>;
}

export interface AttributeFilterOption {
  nombre: string;
  // URL-safe key derived from nombre (lowercase, sin espacios, sin acentos)
  key: string;
  valores: Array<{ valor: string; count: number }>;
}

export interface FilterOptions {
  brands: Array<{ nombre: string; count: number }>;
  specFilters: AttributeFilterOption[];
  precioMin: number;
  precioMax: number;
}

export interface FilteredResult {
  products: Product[];
  category: Category;
  subcategories: Category[];
  filterOptions: FilterOptions;
}
```

#### Dependencias nuevas

- `@radix-ui/react-checkbox` (para shadcn/ui checkbox)
- `@radix-ui/react-label` (para shadcn/ui label)
- `@radix-ui/react-separator` (para shadcn/ui separator)
- Se instalan automáticamente al ejecutar `npx shadcn@latest add`

#### Flujo de datos completo

```
1. Usuario visita: /categorias/procesadores?precioMin=100000&marca=AMD,Intel&orden=precio-asc

2. Página Server Component extrae searchParams:
   { precioMin: "100000", marca: "AMD,Intel", orden: "precio-asc" }

3. Construye ProductFilters: { precioMin: 100000, marcas: ["AMD","Intel"] }
   SortOption: "precio-asc"

4. Llama a getFilteredProducts("procesadores", filters, sort)
   └─ React.cache() deduplica si se llama múltiples veces

5. GetFilteredProductsUseCase.execute():
   a. categoryRepo.findBySlug("procesadores") → categoría
   b. categoryRepo.findByPadreId(catId) → subcategorías (vacío en este caso)
   c. productRepo.findByCategoriaIds(["cat-2"]) → [prod-1, prod-2, prod-3, prod-19]
   d. Extrae FilterOptions del set sin filtrar:
      - brands: [{ nombre: "AMD", count: 2 }, { nombre: "Intel", count: 2 }]
      - specFilters: [
          { nombre: "Socket", key: "socket", valores: [{ valor: "AM5", count: 2 }, { valor: "LGA1700", count: 2 }] },
          { nombre: "Núcleos", key: "nucleos", valores: [...] },
          ...
        ]
      - precioMin: 119999, precioMax: 449999
   e. Filtra por precioMin=100000 → todos pasan (todos > 100000)
   f. Filtra por marcas=["AMD","Intel"] → todos pasan
   g. Ordena por precio ascendente: prod-19 ($119999), prod-1 ($289999), prod-2 ($329999), prod-3 ($449999)
   h. Retorna FilteredResult

6. Página renderiza:
   ┌─────────────────────────────────────┐
   │ Breadcrumb: Inicio / Procesadores    │
   │                                      │
   │  [SortDropdown ▼]  [X productos]     │
   │                                      │
   ├──────────┬──────────────────────────┤
   │ Filtros  │  ProductCard grid         │
   │          │  ┌─────┐ ┌─────┐ ┌─────┐ │
   │ Precio   │  │i3   │ │Ryzen│ │i5   │ │
   │ [100k]   │  │14100│ │7600X│ │14600│ │
   │ [500k]   │  │     │ │     │ │     │ │
   │          │  └─────┘ └─────┘ └─────┘ │
   │ Marca    │  ┌─────┐ ┌─────┐         │
   │ ☑ AMD(2) │  │Ryzen│ │i5   │         │
   │ ☑ Intel(2)│  │7800 │ │14600│         │
   │          │  │X3D  │ │K    │         │
   │ Socket   │  └─────┘ └─────┘         │
   │ ☑ AM5(2) │                          │
   │ ☑ LGA1700│                          │
   │ (2)      │                          │
   │          │                          │
   │ [Limpiar]│                          │
   └──────────┴──────────────────────────┘

7. Si usuario cambia filtro (ej: desmarca "Intel"):
   a. FilterSidebar actualiza URL: /categorias/procesadores?precioMin=100000&marca=AMD&orden=precio-asc
   b. Next.js re-renderiza la página con nuevos searchParams
   c. Flujo vuelve a paso 2

8. Footer/loading states:
   - Loading: Skeleton del grid de productos (ya existe en loading.tsx)
   - Empty state: "No hay productos con los filtros seleccionados" con botón "Limpiar filtros"
   - Error state: error.tsx existente maneja errores
```

#### Componentes UI — especificaciones detalladas

**FilterSidebar** (`'use client'`):
| Prop | Tipo | Descripción |
|------|------|-------------|
| `filterOptions` | `FilterOptions` | Opciones disponibles para filtros (brands, specs, rangos de precio) |
| `categorySlug` | `string` | Slug de categoría actual para construir URLs |
| `currentFilters` | `{ precioMin?: string; precioMax?: string; marcas?: string[]; specs?: Record<string, string[]> }` | Filtros activos actualmente |
| `currentSort?` | `SortOption` | Ordenación actual (para preservar al cambiar filtros) |
| `productCount` | `number` | Cantidad de productos resultantes después de filtrar |

Estado interno:
- `localPrecioMin` / `localPrecioMax`: estado local para los inputs (para permitir escribir sin hacer submit instantáneo)
- Al hacer blur o presionar Enter → actualiza URL

**SortDropdown** (`'use client'`):
| Prop | Tipo | Descripción |
|------|------|-------------|
| `currentSort` | `SortOption` | Opción de ordenación activa |
| `categorySlug` | `string` | Slug para construir URLs |
| `currentFilters` | `Record<string, string>` | Resto de filtros a preservar en URL |
| `productCount` | `number` | Cantidad de productos (para mostrar "N productos") |

#### Consideraciones

**Rendimiento**:
- El filtrado es in-memory sobre el resultado de `findByCategoriaIds()` — aceptable para MVP con datos mock (~22 productos)
- Con MongoDB real, el filtrado se movería al repositorio (query a DB) pero la interfaz del use case seguiría siendo la misma
- `React.cache()` evita duplicar fetch entre layout y página

**Seguridad**:
- Los searchParams se sanitizan: valores no numéricos en precio se ignoran, marcas se validan contra valores conocidos
- No hay SQL injection (no hay SQL)
- Los spec keys se sanitizan a lowercase alphanumeric

**Edge cases**:
- **Sin filtros**: Muestra todos los productos de la categoría, ordenados por defecto (`nombre-asc`)
- **Filtro sin resultados**: Empty state con mensaje "No hay productos con los filtros seleccionados" + botón "Limpiar filtros"
- **Filtro inválido**: Si `precioMin` > `precioMax`, se ignoran ambos
- **Marca no existente**: Se ignora (no hay productos que coincidan)
- **URL maliciosa**: `precioMin=abc` → se ignora (NaN check)
- **Spec key desconocido**: Se ignora silenciosamente
- **Categoría sin productos**: Se muestra filterOptions vacío y empty state (caso ya cubierto)

**UX**:
- Los filtros se aplican al cambiar (no hay botón "Aplicar" separado, excepto para precio que tiene botón "Filtrar" para evitar muchas navegaciones)
- El sort dropdown cambia inmediatamente al seleccionar
- Scroll position se mantiene (`scroll: false` en router.replace)
- Mobile: los filtros van dentro de un `<details>` colapsable (similar al menú de categorías existente)

**Dependencias entre tareas**:
1. Primero modificar entidad Product (agregar `marca`)
2. Luego actualizar datos mock con `marca`
3. Crear tipos compartidos
4. Crear el use case de filtrado
5. Crear shared wrapper
6. Instalar shadcn/ui label + checkbox + separator
7. Crear FilterSidebar
8. Crear SortDropdown
9. Modificar ProductCard para mostrar marca
10. Modificar página de categoría para integrar todo

#### Orden de implementación

| Paso | Archivo | Depende de |
|------|---------|------------|
| 1 | `core/domain/entities/product.ts` (modificar) | — |
| 2 | `adapters/out/mock/data/products.ts` (modificar) | Paso 1 |
| 3 | `core/use-cases/catalog/types.ts` (crear) | — |
| 4 | `core/use-cases/catalog/get-filtered-products.use-case.ts` (crear) | Pasos 1, 3 |
| 5 | `shared/utils/get-filtered-products.ts` (crear) | Paso 4 |
| 6 | Instalar shadcn/ui: label, checkbox, separator | — |
| 7 | `components/ui/*` (label, checkbox, separator) | Paso 6 |
| 8 | `components/features/sort-dropdown.tsx` (crear) | Paso 3 |
| 9 | `components/features/filter-sidebar.tsx` (crear) | Pasos 3, 7 |
| 10 | `components/features/product-card.tsx` (modificar) | Paso 1 |
| 11 | `app/(catalog)/categorias/[slug]/page.tsx` (modificar) | Pasos 5, 8, 9, 10 |

**Riesgos**:
- Next.js 16 `searchParams` es asíncrono (`Promise`) — verificar la API exacta
- Los componentes client (`FilterSidebar`, `SortDropdown`) no pueden importar server-only code
- Los nombres de specs como keys de URL: "Tipo de RAM" → `tipo-de-ram` (slugify). Necesitamos función helper para convertir spec name → URL-safe key y viceversa
