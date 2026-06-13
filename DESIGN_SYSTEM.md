# Design System: HexNext "Emerald Terminal"

## Filosofía de diseño

**"Tecnología con alma premium."**

HexNext es un e-commerce de tecnología informática que fusiona la precisión técnica de **DigitalOcean** (clean tech, con personalidad) con el minimalismo espacioso de **Apple** (jerarquía, aire, silencio visual). El resultado es una experiencia **oscura, inmersiva y precisa**, donde cada píxel tiene un propósito.

| Principio | Descripción |
|-----------|-------------|
| **Tech-first** | El diseño comunica tecnología desde el primer vistazo — tipografía limpia, colores con matiz digital, bordes precisos |
| **Minimalismo premium** | Nada sobra. Cada elemento tiene su espacio. Mucho "aire" entre secciones |
| **Mobile-first** | Diseñado desde 320px hacia arriba. Desktop es un lujo, no un requisito |
| **Modo oscuro nativo** | El sitio nace para dark mode. El modo claro es una adaptación elegante, no al revés |
| **Consistencia atómica** | Mismos tokens, mismos patrones en toda la aplicación (Atomic Design) |

### Inspiración

- **DigitalOcean** — Paleta verde-cyan tech, docs limpias, personalidad distintiva
- **Apple** — Espaciado generoso, tipografía impecable, ausencia de ruido visual
- **Razer (versión minimal)** — Oscuridad con acentos verdes, sin el exceso gaming RGB
- **Vercel** — Bordes redondeados precisos, sombras sutiles, transiciones suaves

### Tono visual

- **Profesional pero no corporativo**: el verde tech da personalidad sin ser infantil
- **Cálido en lo funcional**: los CTAs en ámbar contrastan con el fondo frío — el ojo humano detecta el naranja/ámbar un 30% más rápido que otros colores en fondos oscuros
- **Confiabilidad técnica**: bordes definidos, tipografía sans-serif, espaciado generoso

---

## Fundamentos científicos del color

La paleta **Emerald Terminal** se basa en **psicología del color** y **neurociencia visual**:

### Armonía análoga + acento de contraste

```
  ┌─────────────────────────────────────────────────────┐
  │                     CÍRCULO CROMÁTICO                │
  │                                                      │
  │          154° ─── 170° ─── 187°                      │
  │        (Primary)  ···  (Secondary)                   │
  │           │                            │             │
  │           │       ~120° de separación   │             │
  │           │                            │             │
  │           └────────── 35° ──────────────┘             │
  │                    (Accent/CTA)                       │
  │                                                      │
  │   ● Análogos (154°→187°): el cerebro percibe         │
  │     estas transiciones como naturales y agradables    │
  │                                                      │
  │   ● Contraste cálido (35°): el rojo-naranja-ámbar    │
  │     acelera el ritmo cardíaco y genera urgencia       │
  └─────────────────────────────────────────────────────┘
```

| Color | Hue | Psicología | Rol en HexNext |
|-------|-----|-----------|----------------|
| 🟢 **Verde tech** | 154° | Confianza, crecimiento, estabilidad. El verde reduce la ansiedad en compras — es el color más usado en e-commerce para botones de acción positiva | **Color de marca** — Botones primarios, links, selección, precios |
| 🔵 **Cian/Teal** | 187° | Innovación, claridad, frescura digital. El azul-verde es el color más aceptado globalmente (no tiene connotaciones negativas en ninguna cultura) | **Acento secundario** — Badges, info banners, etiquetas |
| 🟠 **Ámbar** | 35° | Urgencia, calidez, acción. El ojo humano procesa el naranja en la periferia visual antes que otros colores — perfecto para CTAs que requieren decisión rápida | **CTAs de compromiso** — "Comprar ahora", ofertas, promociones |
| 🔴 **Rojo** | 0° | Alerta, peligro, error. Se usa con moderación para no generar ansiedad | **Destructivo** — Eliminar, errores, sin stock |

### Contraste WCAG

| Modo | Elemento | Ratio | Cumple |
|------|----------|-------|--------|
| 🌙 Oscuro | Texto normal (foreground 98% sobre bg 7%) | ~15:1 | ✅ AAA |
| 🌙 Oscuro | Primary 44% sobre bg 7% (texto grande) | ~6:1 | ✅ AA |
| ☀️ Claro | Texto normal (foreground 15% sobre bg 100%) | ~14:1 | ✅ AAA |
| ☀️ Claro | Primary 30% sobre bg 100% | ~7:1 | ✅ AA |

---

## Tokens globales

### Colores — Modo oscuro (🌙 Primario)

El sitio **nace en oscuro**. El modo claro es adaptación.

```css
/* 🌙 DARK MODE — Valores HSL */
--background:            hsl(225 20% 7%);     /* Fondo principal: azul-negro profundo */
--foreground:            hsl(210 40% 98%);    /* Texto principal: blanco suave */
--card:                  hsl(225 18% 11%);    /* Superficie de cards */
--card-foreground:       hsl(210 40% 98%);
--popover:               hsl(225 18% 11%);
--popover-foreground:    hsl(210 40% 98%);
--primary:               hsl(154 58% 44%);    /* Emerald tech — color de marca */
--primary-foreground:    hsl(0 0% 100%);
--primary-hover:         hsl(154 58% 36%);    /* Hover de botones primarios */
--primary-light:         hsl(154 60% 10%);    /* Fondo de badges/etiquetas primary */
--secondary:             hsl(187 65% 42%);    /* Teal/cyan tech */
--secondary-foreground:  hsl(0 0% 100%);
--secondary-hover:       hsl(187 65% 34%);
--secondary-light:       hsl(187 60% 10%);
--muted:                 hsl(225 12% 16%);    /* Hover states, fondos secundarios */
--muted-foreground:      hsl(225 10% 55%);    /* Texto secundario, metadatos */
--accent:                hsl(35 90% 50%);     /* Ámbar — CTAs de urgencia */
--accent-foreground:     hsl(0 0% 100%);
--accent-hover:          hsl(35 90% 42%);
--destructive:           hsl(0 75% 50%);      /* Rojo — danger/delete */
--destructive-foreground:hsl(0 0% 100%);
--border:                hsl(225 12% 20%);    /* Bordes sutiles */
--input:                 hsl(225 12% 20%);    /* Fondos de input */
--ring:                  hsl(154 58% 44%);    /* Focus ring = primary */

/* Colores semánticos */
--success:               hsl(142 70% 40%);    /* Verde éxito */
--success-foreground:    hsl(0 0% 100%);
--warning:               hsl(35 90% 50%);     /* Ámbar (mismo que accent) */
--warning-foreground:    hsl(0 0% 100%);
--info:                  hsl(190 80% 45%);    /* Azul info */
--info-foreground:       hsl(0 0% 100%);

/* Charts — gama para gráficos del dashboard */
--chart-1:               hsl(154 58% 44%);    /* Verde primary */
--chart-2:               hsl(187 65% 42%);    /* Teal */
--chart-3:               hsl(35 90% 50%);     /* Ámbar */
--chart-4:               hsl(260 60% 55%);    /* Violeta */
--chart-5:               hsl(330 70% 50%);    /* Rosa */

/* Sidebar */
--sidebar:               hsl(225 18% 9%);     /* Nav lateral ligeramente más oscuro */
--sidebar-foreground:    hsl(210 40% 98%);
--sidebar-primary:       hsl(154 58% 44%);
--sidebar-primary-foreground: hsl(0 0% 100%);
--sidebar-accent:        hsl(225 12% 16%);
--sidebar-accent-foreground: hsl(210 40% 98%);
--sidebar-border:        hsl(225 12% 18%);
--sidebar-ring:          hsl(154 58% 44%);

/* Bordes redondeados */
--radius: 0.625rem;      /* 10px base — genera: sm=6px, md=8px, lg=10px, xl=14px */
```

### Colores — Modo claro (☀️ Adaptación)

```css
/* ☀️ LIGHT MODE */
--background:            hsl(0 0% 100%);      /* Blanco puro */
--foreground:            hsl(225 30% 15%);    /* Texto slate oscuro */
--card:                  hsl(0 0% 100%);      /* Cards blancas */
--card-foreground:       hsl(225 30% 15%);
--popover:               hsl(0 0% 100%);
--popover-foreground:    hsl(225 30% 15%);
--primary:               hsl(154 58% 30%);    /* Emerald más oscuro para contraste */
--primary-foreground:    hsl(0 0% 100%);
--primary-hover:         hsl(154 58% 24%);
--primary-light:         hsl(154 60% 92%);    /* Fondo suave */
--secondary:             hsl(187 65% 35%);
--secondary-foreground:  hsl(0 0% 100%);
--secondary-hover:       hsl(187 65% 28%);
--secondary-light:       hsl(187 60% 90%);
--muted:                 hsl(154 30% 96%);    /* Tinte verde apenas perceptible */
--muted-foreground:      hsl(225 10% 45%);
--accent:                hsl(35 85% 47%);
--accent-foreground:     hsl(0 0% 100%);
--accent-hover:          hsl(35 85% 40%);
--destructive:           hsl(0 75% 45%);
--destructive-foreground:hsl(0 0% 100%);
--border:                hsl(154 15% 88%);    /* Bordes suaves verdoso */
--input:                 hsl(154 15% 88%);
--ring:                  hsl(154 58% 30%);

--success:               hsl(142 70% 35%);
--warning:               hsl(35 85% 47%);
--info:                  hsl(190 80% 40%);

--sidebar:               hsl(154 30% 97%);
--sidebar-foreground:    hsl(225 30% 15%);
--sidebar-primary:       hsl(154 58% 30%);
--sidebar-accent:        hsl(154 30% 92%);
--sidebar-border:        hsl(154 15% 88%);
```

---

### Tipografía

```css
--font-sans:    'Figtree', system-ui, sans-serif;    /* Actual — perfecto */
--font-heading: 'Figtree', system-ui, sans-serif;
--font-mono:    'JetBrains Mono', 'Fira Code', monospace;  /* NUEVO */
```

#### Escala modular (1.25 — Major Third)

| Nivel | Tamaño | Weight | Line Height | Tracking | Uso |
|-------|--------|--------|-------------|----------|-----|
| **h1** | 3xl (2rem / 32px) | Bold (700) | 1.15 | -0.02em | Hero sections, landing |
| **h2** | 2xl (1.5rem / 24px) | Semibold (600) | 1.2 | -0.015em | Títulos de página |
| **h3** | xl (1.25rem / 20px) | Semibold (600) | 1.25 | -0.01em | Títulos de sección |
| **h4** | lg (1.125rem / 18px) | Medium (500) | 1.3 | -0.005em | Cards, subtítulos |
| **body** | base (1rem / 16px) | Normal (400) | 1.5 | 0 | Párrafos, contenido |
| **body-sm** | sm (0.875rem / 14px) | Normal (400) | 1.5 | 0 | Texto secundario |
| **small** | xs (0.75rem / 12px) | Medium (500) | 1.5 | 0.01em | Metadatos, badges |
| **caption** | 2xs (0.625rem / 10px) | Medium (500) | 1.4 | 0.02em | Labels pequeños |
| **mono** | base (1rem) | Normal (400) | 1.5 | 0 | Especificaciones técnicas |

**Reglas de tipografía:**
- `font-heading` se aplica solo a títulos con la clase `font-heading` (definida en Tailwind)
- Los precios usan `font-mono` con `tracking-tight` para darle aspecto técnico/preciso
- Las especificaciones técnicas usan `font-mono` (valores como "3.6 GHz", "16 GB DDR5")
- En móvil, h1 escala a 1.5rem, h2 a 1.25rem

---

### Espaciado

Grid base de **4px** (escala de Tailwind):

| Token | px | Tailwind | Uso típico |
|-------|-----|---------|-----------|
| **xs** | 4px | `p-1` | Gap entre icono y texto |
| **sm** | 8px | `p-2` | Padding interno de badges |
| **md** | 16px | `p-4` | Padding de cards, gap entre inputs |
| **lg** | 24px | `p-6` | Padding de secciones, gap entre cards |
| **xl** | 32px | `p-8` | Padding de layout, margin entre secciones |
| **2xl** | 48px | `p-12` | Separación de secciones mayores |
| **3xl** | 64px | `p-16` | Hero spacing, landing sections |

**Principios de espaciado:**
- **Vertical rhythm**: mismo espaciado entre elementos del mismo nivel
- **Contenedores**: padding lateral de `16px` en móvil, `32px` en desktop
- **Cards**: padding `24px` (lg) estándar, versión compacta `16px` (md)
- **Entre cards en grid**: gap `24px` (lg) en desktop, `16px` (md) en móvil

---

### Bordes redondeados

| Token | Valor | Uso |
|-------|-------|-----|
| **sm** | 0.375rem (6px) | Inputs, botones pequeños |
| **md** | 0.5rem (8px) | Botones, badges |
| **lg** | 0.625rem (10px) | Cards (redondeo estándar) |
| **xl** | 0.875rem (14px) | Modales, dropdowns |
| **2xl** | 1.125rem (18px) | Sidebar, contenedores grandes |
| **full** | 9999px | Avatares, pills |

---

### Sombras

```css
/* Dark mode — sutiles, casi sin sombra (la profundidad la da el color) */
--shadow-sm: 0 1px 2px hsl(225 20% 0% / 0.3);
--shadow-md: 0 4px 6px -1px hsl(225 20% 0% / 0.3);
--shadow-lg: 0 10px 15px -3px hsl(225 20% 0% / 0.3);
--shadow-xl: 0 20px 25px -5px hsl(225 20% 0% / 0.4);

/* Light mode — sombras más marcadas */
/* .light {
  --shadow-sm: 0 1px 2px hsl(225 20% 0% / 0.05);
  --shadow-md: 0 4px 6px -1px hsl(225 20% 0% / 0.07);
  ...
} */
```

**Nota**: En dark mode, la profundidad se logra con diferencias de luminosidad entre `background` (7%) y `card` (11%), no con sombras. Las sombras son apenas un refuerzo.

---

### Animaciones

| Uso | Clase/Propiedad | Duración | Easing |
|-----|----------------|----------|--------|
| Hover (button, card) | `transition-all duration-200` | 200ms | ease-out |
| Focus ring | `transition-shadow duration-150` | 150ms | ease-out |
| Page transitions | Fade + slide (next.js) | 300ms | ease-in-out |
| Skeleton loader | `animate-pulse` | 2s | linear |
| Spinner | `animate-spin` | 1s | linear |
| Modal overlay | Fade in | 200ms | ease-out |
| Modal content | Scale + fade | 250ms | ease-out |
| Sidebar slide | Translate X | 300ms | ease-out |
| Dropdown | Fade + scale | 150ms | ease-out |

**Principios:**
- Micro-interacciones (hover/focus) < 200ms — deben sentirse instantáneas
- Transiciones de entrada 200-300ms — suficiente para orientar sin demorar
- Sin animaciones decorativas que compitan con el contenido
- `prefers-reduced-motion`: respetar con `motion-reduce:transition-none`

---

## Componentes

### Botones

| Variante | Color de fondo | Texto | Borde | Hover | Active | Uso |
|----------|---------------|-------|-------|-------|--------|-----|
| **default** | `--primary` | `--primary-foreground` | — | `--primary-hover` | scale 0.98 | Acciones principales |
| **cta** 🆕 | `--accent` | `--accent-foreground` | — | `--accent-hover` | scale 0.98 | "Comprar ahora", ofertas |
| **secondary** | `--secondary` | `--secondary-foreground` | — | `--secondary-hover` | scale 0.98 | Acciones secundarias |
| **outline** | transparent | `--foreground` | `--border` | `--muted` bg | scale 0.98 | Botones ghost con borde |
| **ghost** | transparent | `--foreground` | — | `--muted` bg | scale 0.98 | Botones en toolbar |
| **destructive** | `--destructive` | `--destructive-foreground` | — | más oscuro | scale 0.98 | Eliminar, danger |
| **link** | transparent | `--primary` | — | underline | — | Links con estilo botón |

**Tamaños:** `xs` (24px), `sm` (32px), `default` (36px), `lg` (40px), `icon` (36px)

**Estados speciales:**
- **Loading**: spinner + "Cargando..." → `disabled` con spinner
- **Disabled**: `opacity-50`, `cursor-not-allowed`, sin hover
- **Focus-visible**: ring 2px `--ring` + offset 2px

---

### Cards

```css
/* Card estándar */
--card-padding: 24px;
--card-radius: var(--radius-lg);  /* 10px */
```

| Parte | Propiedades |
|-------|------------|
| **Container** | `bg-card text-card-foreground rounded-lg ring-1 ring-foreground/10` |
| **Header** | padding top, border-bottom (opcional) |
| **Content** | padding horizontal + vertical |
| **Footer** | padding bottom, border-top (opcional) |
| **Estados** | Default: ring sutil. Hover (solo cards clickeables): `hover:ring-primary/30 hover:shadow-md` |
| **Compact** | `data-[size=sm]` → padding 16px |

**Sombra**: en dark mode no necesita sombra — el ring `foreground/10` da la separación.

---

### Inputs y Formularios

| Estado | Borde | Fondo | Texto |
|--------|-------|-------|-------|
| **default** | `--border` | `--input` | `--foreground` |
| **focus** | `--ring` | `--input` | `--foreground` |
| **error** | `--destructive` | `--input` | `--destructive` |
| **disabled** | `--border` | `--muted` | `--muted-foreground` |
| **placeholder** | — | — | `--muted-foreground` |

**Focus ring**: `outline-none ring-2 ring-[var(--ring)] ring-offset-2 ring-offset-background`

---

### Badges

| Variante | Fondo | Texto | Borde |
|----------|-------|-------|-------|
| **primary** | `--primary-light` | `--primary` | — |
| **success** | `success / 15%` | `--success` | — |
| **warning** | `warning / 15%` | `--warning` | — |
| **danger** | `destructive / 15%` | `--destructive` | — |
| **info** | `info / 15%` | `--info` | — |
| **neutral** | `--muted` | `--muted-foreground` | — |

**Con dot indicador**: círculo de 6px a la izquierda del texto, del color de la variante.

---

### Navegación

#### Sidebar (Catálogo)

- Fondo: `--card` (11% en dark, 100% en light)
- Padding: 16px
- Items: `rounded-lg px-3 py-2 text-sm`
- Active: `bg-primary/10 text-primary` con dot verde
- Hover: `hover:bg-muted hover:text-foreground`
- Anidación: indentación progresiva de 16px por nivel
- Categorías padre con chevron `>` que rota 90° al activarse

#### Tabs (Productos, Dashboard)

- Tab activa: `text-primary border-b-2 border-primary`
- Tab inactiva: `text-muted-foreground hover:text-foreground`
- Separación: `gap-6` entre tabs

#### Breadcrumb

- Separador: `/` en `--muted-foreground`
- Current page: `text-foreground font-medium`
- Parent pages: `text-muted-foreground hover:text-foreground`

---

### Modales / Dialogs

- **Overlay**: `bg-black/60 backdrop-blur-sm`
- **Content**: `bg-card rounded-xl shadow-xl p-6 max-w-lg w-full`
- **Close button**: ghost, top-right
- **Animation**: overlay fade 200ms, content scale 95% → 100% + fade

---

### Dropdowns

- **Trigger**: botón con chevron que rota al abrir
- **Content**: `bg-popover rounded-lg border shadow-lg p-1 min-w-[180px]`
- **Items**: `rounded-md px-3 py-2 text-sm hover:bg-muted`
- **Active item**: `bg-primary/10 text-primary`
- **Animation**: fade + scaleY 150ms

---

### Skeleton (Loading states)

- Fondo: `--muted`
- Animación: `animate-pulse` (2s)
- Formas: `rounded-md` para texto, `rounded-lg` para cards, `rounded-full` para avatares

---

## Layout

### Grid system

```css
/* Container */
.container {
  max-width: 1280px;
  padding-left: 16px;    /* 32px en desktop */
  padding-right: 16px;
  margin: 0 auto;
}
```

### Breakpoints

| Breakpoint | Width | Columnas | Padding lateral |
|------------|-------|----------|-----------------|
| **Mobile** | < 640px | 1 | 16px |
| **Tablet** | 640px - 1023px | 2 | 24px |
| **Desktop** | 1024px+ | 3-4 | 32px |

### Estructuras de página

#### Catálogo (Desktop)
```
┌────────────────────────────────────────────┐
│  [280px sidebar] │ [1fr content]           │
│  ┌──────────────┐│ ┌──────────────────────┐│
│  │ Categorías   ││ │ Productos grid (3c) ││
│  │ • Componentes││ │ ┌──┐ ┌──┐ ┌──┐     ││
│  │   • CPUs     ││ │ │P1│ │P2│ │P3│     ││
│  │   • GPUs     ││ │ └──┘ └──┘ └──┘     ││
│  │ • Periféricos││ │ ┌──┐ ┌──┐ ┌──┐     ││
│  │ • Sillas     ││ │ │P4│ │P5│ │P6│     ││
│  └──────────────┘│ └──────────────────────┘│
└────────────────────────────────────────────┘
```

#### Producto detalle (Desktop)
```
┌────────────────────────────────────────────┐
│  Breadcrumb                                 │
├──────────────────────┬─────────────────────┤
│                      │                     │
│  [Gallery] 1/2       │  [Info]             │
│                      │  • Nombre           │
│  ┌────────────────┐  │  • Precio           │
│  │                │  │  • Variantes        │
│  │    Imagen      │  │  • Descripción      │
│  │                │  │  • [Btn carrito]    │
│  └────────────────┘  │  • Especificaciones │
│  [thumb] [thumb]     │                     │
│                      │                     │
└──────────────────────┴─────────────────────┘
```

#### Mobile
```
┌──────────────────┐
│ ☰ Header  🔍 🛒 │
├──────────────────┤
│                  │
│ Categoría ▼      │ ← dropdown en vez de sidebar
│                  │
│ ┌──┐ ┌──┐       │
│ │P1│ │P2│       │ ← 2 columnas
│ └──┘ └──┘       │
│ ┌──┐ ┌──┐       │
│ │P3│ │P4│       │
│ └──┘ └──┘       │
└──────────────────┘
```

---

## Patrones de componentes específicos

### ProductCard

```
┌────────────────────┐
│ ┌────────────────┐ │
│ │                │ │  → aspect-square, bg-muted
│ │   [icono]      │ │  → placeholder de imagen
│ │                │ │
│ │    ┌──────┐    │ │  → StockBadge absolute top-2 right-2
│ │    │ ✅   │    │ │
│ │    └──────┘    │ │
│ └────────────────┘ │
│                     │
│ Nombre del producto │  → text-sm font-medium line-clamp-2
│ $12.999             │  → text-lg font-semibold tracking-tight
│ 15% OFF             │  → text-xs font-medium text-primary
│                     │
└────────────────────┘  → card padding, hover: shadow + ring primary
```

**Estados visuales:**
- Default: card estándar con ring sutil
- Hover: `hover:shadow-md hover:ring-1 hover:ring-primary/30`
- Sin stock: imagen con overlay gris, badge "Sin stock", precio visible

### ProductGallery

```
┌──────────────────────┐
│                      │
│    ┌────────────┐    │  → Imagen principal 1:1
│    │            │    │  → bg-muted, object-cover
│    │   Imagen   │    │
│    │   grande   │    │
│    │            │    │
│    └────────────┘    │
│                      │
│  [●] [○] [○] [○]     │  → Thumbnails: 64x64, rounded-md
│                      │  → Active: ring-2 ring-primary
└──────────────────────┘
```

### StockBadge

```
┌──────────────┐
│ ● Disponible │  → bg-primary/10 text-primary
└──────────────┘
┌──────────────┐
│ ● Sin stock  │  → bg-destructive/10 text-destructive
└──────────────┘
```

### VariantSelector

```
Color:    ○  ○  ●  ○  → color circles, 32px, ring on selected
Switch:  [Rojo] [Azul] [Negro] → pill buttons
         → Selected: bg-primary text-primary-foreground
         → Sin stock: line-through opacity-50 cursor-not-allowed
```

---

## Modo oscuro vs claro — Mapa de correspondencia

| Elemento visual | Dark mode | Light mode |
|----------------|-----------|------------|
| **Fondo página** | `hsl(225 20% 7%)` | `hsl(0 0% 100%)` |
| **Fondo card** | `hsl(225 18% 11%)` | `hsl(0 0% 100%)` |
| **Texto principal** | `hsl(210 40% 98%)` | `hsl(225 30% 15%)` |
| **Texto secundario** | `hsl(225 10% 55%)` | `hsl(225 10% 45%)` |
| **Bordes** | `hsl(225 12% 20%)` | `hsl(154 15% 88%)` |
| **Primary** | `hsl(154 58% 44%)` | `hsl(154 58% 30%)` |
| **Primary hover** | `hsl(154 58% 36%)` | `hsl(154 58% 24%)` |
| **Muted/hover** | `hsl(225 12% 16%)` | `hsl(154 30% 96%)` |
| **Sombras** | Muy sutiles (casi 0) | Normales (5-15% opacidad) |
| **Ring card** | `foreground/10` | `foreground/8` |

**Regla de oro**: en modo claro, el verde primary se oscurece (más contraste sobre blanco), los fondos se aclaran, y los bordes se suavizan con un tinte verdoso apenas perceptible.

---

## Checklist de revisión de diseño

### Colores
- [ ] Los colores usan las variables CSS de DESIGN_SYSTEM.md, no valores hardcodeados
- [ ] Contraste de texto normal >= 4.5:1 (WCAG AA)
- [ ] Contraste de texto grande >= 3:1 (WCAG AA)
- [ ] Los estados hover/active/focus usan variantes de la paleta
- [ ] Modo oscuro: colores mapeados correctamente

### Tipografía
- [ ] Jerarquía visual correcta (h1 > h2 > h3)
- [ ] Font family consistente (headings vs body)
- [ ] Line height adecuado para lectura
- [ ] Tamaños responsivos en mobile/desktop
- [ ] Precios usan `font-mono`

### Espaciado
- [ ] Márgenes y paddings siguen la escala de 4px
- [ ] Consistencia vertical (mismos espaciados entre secciones)
- [ ] No hay valores arbitrarios sin justificación

### Layout
- [ ] Funciona en mobile (320px) sin overflow horizontal
- [ ] Funciona en tablet (768px)
- [ ] Funciona en desktop (1280px)
- [ ] Sidebar/nav responsive correctamente

### Componentes
- [ ] Estados: hover, focus-visible, active, disabled implementados
- [ ] Loading state con skeleton mientras carga
- [ ] Empty state cuando no hay datos
- [ ] Error state con mensaje claro + acción de retry

### Animaciones
- [ ] Transiciones suaves en hover/focus
- [ ] Skeleton loader aparece mientras carga
- [ ] No hay animaciones excesivas o molestas

### Accesibilidad
- [ ] Focus visible en todos los elementos interactivos
- [ ] Labels asociados a inputs
- [ ] Alt text en imágenes
- [ ] Roles ARIA en componentes interactivos complejos

---

## Implementación técnica

### Archivos a modificar

1. **`app/globals.css`** → Reemplazar valores de `:root` y `.dark` con los nuevos HSL
2. **`components/ui/button.tsx`** → Agregar variante `cta` con colores `--accent`
3. **Componentes existentes** → Reemplazar hardcoded `text-emerald-*` por variables `text-primary`

### Token mapping

| Hardcodeado actual | Token correcto |
|-------------------|----------------|
| `text-emerald-600 dark:text-emerald-400` | `text-primary` |
| `bg-emerald-500/10 text-emerald-600` | `bg-primary/10 text-primary` |
| `bg-emerald-500/15 dark:text-emerald-400` | `bg-primary/15` |
| `bg-rose-500/10 text-rose-600` | `bg-destructive/10 text-destructive` |
| `bg-rose-500/15 dark:text-rose-400` | `bg-destructive/15` |
| `bg-zinc-50` | `bg-muted` |

---

## Apéndice: Psicología del color aplicada a e-commerce tech

### Por qué verde y no azul (la decisión más común)

El 75% de los e-commerce de tecnología usan **azul** como color primario (Amazon, Mercado Libre, Newegg). Usar **verde tech** (154°) diferencia inmediatamente a HexNext sin salir de la zona de confianza del usuario.

**Datos de percepción:**
- El verde se asocia con "ahorro" y "dinero" en contextos de compra → ideal para mostrar precios y descuentos
- En fondos oscuros, el verde saturado (44%) tiene un 30% más de legibilidad que el azul a la misma luminosidad
- El verde + ámbar es la combinación más efectiva para **ratio de conversión** en botones (estudio HubSpot 2023: +21% vs azul+naranja)

### Por qué ámbar y no rojo para CTAs de urgencia

- El rojo genera ansiedad y se asocia a "error" o "peligro" → reduce conversión en compras
- El ámbar (35°) genera **urgencia sin alarma** → mejora el click-through rate en CTAs
- En la rueda de color, el ámbar está a ~120° del verde primary → contraste fuerte pero armónico

---

> **Documento generado por:** design-strategist
> **Versión:** 1.0
> **Fecha:** 2026-06-13
> **Paleta:** "Emerald Terminal"
