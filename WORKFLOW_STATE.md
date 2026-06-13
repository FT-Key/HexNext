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

### Design System — Paleta "Emerald Terminal" (COMPLETADO)

**Tarea 1**: `app/globals.css` — Reemplazados todos los valores oklch por HSL de la paleta Emerald Terminal:
- `:root` con paleta clara (fondo blanco, primary verde 154° 58% 30%, accent ámbar 35° 85% 47%)
- `.dark` con paleta oscura (fondo azul-negro 225° 20% 7%, primary verde 154° 58% 44%)
- Agregados `--color-success`, `--color-warning`, `--color-info` y sus foregrounds al `@theme inline`
- `--font-mono` cambiado de `var(--font-geist-mono)` a `var(--font-mono)`
- Todos los `--chart-*` y `--sidebar-*` actualizados con los nuevos valores HSL

**Tarea 2**: `components/ui/button.tsx` — Agregada variante `cta`:
```ts
cta: "bg-accent text-accent-foreground hover:bg-accent/80",
```

**Tarea 3**: Reemplazados colores hardcodeados por tokens CSS en:
- `components/features/product-card.tsx`: `text-emerald-600 dark:text-emerald-400` → `text-primary`, agregado `hover:ring-1 hover:ring-primary/30`
- `components/features/product-detail.tsx`: `text-emerald-600 dark:text-emerald-400` → `text-primary`
- `components/features/stock-badge.tsx`: `bg-emerald-500/10 text-emerald-600` → `bg-primary/10 text-primary`, `bg-rose-500/10 text-rose-600` → `bg-destructive/10 text-destructive`, dots actualizados

**Tarea 4**: `app/layout.tsx` — Agregada tipografía JetBrains Mono:
- Importado `JetBrains_Mono` de `next/font/google`
- Instancia con `variable: "--font-mono"`
- Agregado `jetbrainsMono.variable` al className del html

**Build**: ✅ Sin errores (TypeScript strict, compilación exitosa)

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

## Commit / PR Status

### US-001 ✅ COMPLETADO
- Branch: `feat/US-001-catalogo-por-categorias`
- Commit: `451f9df` — `feat(US-001): navegar catálogo por categorías`
- Merge: Squash en dev — `7d98b0c`
- PR: [#2](https://github.com/FT-Key/HexNext/pull/2)
- Card Trello: ✅ Done

### US-003 ✅ COMPLETADO
- Branch: `feat/US-003-detalle-producto`
- Commit: `810bc53` — `feat(US-003): página de detalle de producto con variantes`
- Merge: Squash en dev — `65fa13d`
- PR: [#3](https://github.com/FT-Key/HexNext/pull/3)
- Card Trello: ✅ Done

### US-002 ✅ COMPLETADO
- Branch: `feat/US-002-filtrar-ordenar-productos`
- Commit: `4e58787` — `feat(US-002): filtrar y ordenar productos en catálogo`
- Merge: `809d256` en dev
- PR: [#1](https://github.com/FT-Key/HexNext/pull/1)
- Card Trello: ✅ Done

### US-042 ✅ COMPLETADO
- Branch: `feat/US-042-style-audit`
- Commit: `95de20a` — `feat: US-042 style audit - apply Emerald Terminal design tokens`
- Merge: Squash en dev — `d720b34`
- PR: [#4](https://github.com/FT-Key/HexNext/pull/4)
- Card Trello: ✅ Done

## Design System
✅ **DESIGN_SYSTEM.md creado** — Paleta "Emerald Terminal"
- Filosofia: Tech minimalista premium (DigitalOcean × Apple)
- Colores HSL definidos para dark mode (primario) y light mode
- Tipografia: Figtree + JetBrains Mono
- Componentes visuales documentados
- Ver archivo `DESIGN_SYSTEM.md` para tokens completos

### Plan de implementacion del Design System

#### Tarea 1: Actualizar `app/globals.css`
Reemplazar TODO el contenido del archivo con los nuevos valores HSL de la paleta Emerald Terminal.

**Archivo:** `app/globals.css`

**Cambios:**
- `:root` (light mode): reemplazar valores oklch por HSL de la paleta clara
- `.dark`: reemplazar valores oklch por HSL de la paleta oscura
- Agregar al `@theme inline`: `--color-success`, `--color-warning`, `--color-info` y sus foregrounds
- Valor de `--font-mono` en `@theme`: cambiar de `var(--font-geist-mono)` a `var(--font-mono)`
- Los `--chart-*` y `--sidebar-*` tambien se actualizan con los nuevos valores

**Paleta light (`:root`):**
```css
--background: hsl(0 0% 100%);
--foreground: hsl(225 30% 15%);
--card: hsl(0 0% 100%);
--card-foreground: hsl(225 30% 15%);
--popover: hsl(0 0% 100%);
--popover-foreground: hsl(225 30% 15%);
--primary: hsl(154 58% 30%);
--primary-foreground: hsl(0 0% 100%);
--secondary: hsl(187 65% 35%);
--secondary-foreground: hsl(0 0% 100%);
--muted: hsl(154 30% 96%);
--muted-foreground: hsl(225 10% 45%);
--accent: hsl(35 85% 47%);
--accent-foreground: hsl(0 0% 100%);
--destructive: hsl(0 75% 45%);
--destructive-foreground: hsl(0 0% 100%);
--border: hsl(154 15% 88%);
--input: hsl(154 15% 88%);
--ring: hsl(154 58% 30%);
--radius: 0.625rem;
--success: hsl(142 70% 35%);
--success-foreground: hsl(0 0% 100%);
--warning: hsl(35 85% 47%);
--warning-foreground: hsl(0 0% 100%);
--info: hsl(190 80% 40%);
--info-foreground: hsl(0 0% 100%);
--chart-1: hsl(154 58% 30%);
--chart-2: hsl(187 65% 35%);
--chart-3: hsl(35 85% 47%);
--chart-4: hsl(260 60% 50%);
--chart-5: hsl(330 70% 45%);
--sidebar: hsl(154 30% 97%);
--sidebar-foreground: hsl(225 30% 15%);
--sidebar-primary: hsl(154 58% 30%);
--sidebar-primary-foreground: hsl(0 0% 100%);
--sidebar-accent: hsl(154 30% 92%);
--sidebar-accent-foreground: hsl(225 30% 15%);
--sidebar-border: hsl(154 15% 88%);
--sidebar-ring: hsl(154 58% 30%);
```

**Paleta dark (`.dark`):**
```css
--background: hsl(225 20% 7%);
--foreground: hsl(210 40% 98%);
--card: hsl(225 18% 11%);
--card-foreground: hsl(210 40% 98%);
--popover: hsl(225 18% 11%);
--popover-foreground: hsl(210 40% 98%);
--primary: hsl(154 58% 44%);
--primary-foreground: hsl(0 0% 100%);
--secondary: hsl(187 65% 42%);
--secondary-foreground: hsl(0 0% 100%);
--muted: hsl(225 12% 16%);
--muted-foreground: hsl(225 10% 55%);
--accent: hsl(35 90% 50%);
--accent-foreground: hsl(0 0% 100%);
--destructive: hsl(0 75% 50%);
--destructive-foreground: hsl(0 0% 100%);
--border: hsl(225 12% 20%);
--input: hsl(225 12% 20%);
--ring: hsl(154 58% 44%);
--radius: 0.625rem;
--success: hsl(142 70% 40%);
--success-foreground: hsl(0 0% 100%);
--warning: hsl(35 90% 50%);
--warning-foreground: hsl(0 0% 100%);
--info: hsl(190 80% 45%);
--info-foreground: hsl(0 0% 100%);
--chart-1: hsl(154 58% 44%);
--chart-2: hsl(187 65% 42%);
--chart-3: hsl(35 90% 50%);
--chart-4: hsl(260 60% 55%);
--chart-5: hsl(330 70% 50%);
--sidebar: hsl(225 18% 9%);
--sidebar-foreground: hsl(210 40% 98%);
--sidebar-primary: hsl(154 58% 44%);
--sidebar-primary-foreground: hsl(0 0% 100%);
--sidebar-accent: hsl(225 12% 16%);
--sidebar-accent-foreground: hsl(210 40% 98%);
--sidebar-border: hsl(225 12% 18%);
--sidebar-ring: hsl(154 58% 44%);
```

#### Tarea 2: Agregar variante `cta` al componente Button

**Archivo:** `components/ui/button.tsx`

**Cambio:** Agregar nueva variante `cta` al objeto `buttonVariants`:
```ts
cta: "bg-accent text-accent-foreground hover:bg-accent/80",
```

Esto permite usar `<Button variant="cta">Comprar ahora</Button>` con color ambar.

#### Tarea 3: Reemplazar colores hardcodeados por tokens

**Archivo:** `components/features/product-card.tsx`
- Linea 50: `text-emerald-600 dark:text-emerald-400` → `text-primary`
- Linea 15: `hover:shadow-md` → `hover:shadow-md hover:ring-1 hover:ring-primary/30`

**Archivo:** `components/features/product-detail.tsx`
- Linea 54: `text-emerald-600 dark:text-emerald-400` → `text-primary`

**Archivo:** `components/features/stock-badge.tsx`
- Linea 15: `bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400` → `bg-primary/10 text-primary`
- Linea 16: `bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400` → `bg-destructive/10 text-destructive`
- Linea 23: `bg-emerald-500` → `bg-primary`
- Linea 23: `bg-rose-500` → `bg-destructive`

#### Tarea 4: Agregar JetBrains Mono (tipografia)

**Archivo:** `app/layout.tsx`
- Importar `JetBrains Mono` de `next/font/google`
- Agregar variable `--font-mono`

### Instrucciones para el builder
1. Cargar skill: `skill({ name: "design-system" })` y `skill({ name: "tailwind-styles" })`
2. Leer `DESIGN_SYSTEM.md` para entender la vision de diseno
3. Implementar tareas 1-4 en orden
4. Verificar que `npm run build` pase sin errores
5. Verificar que el modo claro y oscuro se vean correctamente (los colores cambian)

## Current Phase
✅ US-001, US-002, US-003 y US-042 completados en dev

## Next Steps
1. Seleccionar próxima US del backlog para implementar
2. Continuar con arquitectura hexagonal y buenas prácticas del proyecto

## Definition of Done
- [x] REQUIREMENTS.md completo con todas las secciones
- [x] Entidades, reglas de negocio y user stories definidas
- [x] Open Questions resueltas con el usuario
- [x] Cards creadas en Trello (41 cards, 3 listas de backlog + In Progress + Review + Done)
- [x] Board ID y card IDs registrados en REQUIREMENTS.md para acceso de otros agentes
- [x] Iniciar implementacion de primera US (US-001)
- [x] Iniciar implementacion de US-002
- [x] US-003 completada
- [x] US-042 completada (Style Audit Emerald Terminal)
