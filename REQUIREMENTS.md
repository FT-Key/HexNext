# Requirements: HexNext — E-commerce de Tecnología Informática

## Resumen Ejecutivo

HexNext es una plataforma e-commerce especializada en tecnología informática (componentes de PC, periféricos, sillas gamer y accesorios). Su propuesta de valor incluye un configurador de PC con validación automática de compatibilidad, comparador de componentes, PCs pre-armadas como punto de partida, y un chatbot con IA (Groq) para atención al cliente.

**Decisiones clave del proyecto:**
- **SEO first**: Arquitectura pensada para SEO con Server Components, ISR para catálogo, sitemap dinámico, Schema.org (Product, Organization, Article), Open Graph, meta tags dinámicas y archivo robots.txt
- **Multi-idioma y multi-tema**: Base preparada para español/inglés/portugués (se implementa solo español primero) y tema claro/oscuro con toggle
- **Mobile-first**: Diseño responsive priorizando dispositivos móviles
- **Testing first**: Tests automatizados (unit, integration, e2e) desde el MVP
- **Arquitectura hexagonal**: Separación estricta entre dominio, aplicación e infraestructura (Next.js App Router)

El proyecto está construido sobre Next.js con arquitectura hexagonal, y servirá como caso de prueba para el ecosistema multi-agente de desarrollo.

## Glosario

| Término | Definición |
|---------|-----------|
| **Armá tu PC** | Configurador interactivo donde el usuario selecciona componentes y el sistema valida compatibilidad automáticamente |
| **PC Pre-armada** | Combinación de componentes predefinida por el admin que sirve como plantilla en "Armá tu PC" |
| **Comparador** | Vista lado a lado de productos de una misma categoría mostrando sus atributos técnicos |
| **SKU** | Unidad mínima de inventario — producto con variantes específicas (ej: teclado X, color negro, switch rojo) |
| **Variante** | Atributo que diferencia unidades de un mismo producto base (color, modelo, talla, etc.) |
| **Brick (Mercado Pago)** | Componente integrable de Mercado Pago para pagos personalizados |
| **Checkout Pro (Mercado Pago)** | Checkout estándar de Mercado Pago fuera del sitio |
| **RAG** | Retrieval-Augmented Generation — técnica de IA para responder con contexto recuperado de una base de datos |
| **R2** | Servicio de almacenamiento de objetos de Cloudflare (compatible con S3) |
| **Schema.org** | Vocabulario de datos estructurados para que los motores de búsqueda entiendan el contenido |
| **ISR** | Incremental Static Regeneration — generación estática con actualización bajo demanda |
| **Server Component** | Componente de React que se renderiza exclusivamente en el servidor (App Router) |

## Actores

| Rol | Descripción | Responsabilidades |
|-----|-------------|-------------------|
| **Cliente** | Usuario registrado que navega, compara y compra productos | Navegar catálogo, armar PC, comparar productos, comprar, contactar, chatear con chatbot, postularse a ofertas |
| **Vendedor** | Staff con permisos limitados de administración | Gestionar pedidos, actualizar stock, responder consultas de contacto |
| **Admin** | Super-usuario con control total del sistema | CRUD de productos/usuarios/pedidos/envíos, blog, prensa, ofertas laborales, dashboard, ver logs |
| **Visitante** | Usuario no registrado que navega contenido público | Ver catálogo, usar comparador, ver blog/preusa/contacto, usar chatbot. **No puede comprar** |
| **Chatbot** | Agente automatizado con IA (Groq + RAG) | Responder dudas de productos, envíos, info institucional. Redirigir a páginas del sitio |

## Modelo de Dominio

### Entidades

#### Producto
- `id`: string (UUID)
- `sku`: string (código único de producto/variante)
- `nombre`: string
- `slug`: string (para URLs amigables)
- `descripcion`: string (HTML o Markdown)
- `precio`: number (decimal)
- `precioComparativa`: number | null (precio de lista para mostrar "descuento")
- `stock`: number
- `categoriaId`: string (referencia a Categoría)
- `productoPadreId`: string | null (para variantes jerárquicas)
- `atributos`: AtributoVariante[] (ej: color, switch, tamaño)
- `especificaciones`: EspecificacionTecnica[] (ej: velocidad, peso, dimensiones)
- `imagenes`: string[] (URLs)
- `destacado`: boolean
- `activo`: boolean
- `createdAt`: datetime
- `updatedAt`: datetime

#### Categoría
- `id`: string (UUID)
- `nombre`: string
- `slug`: string
- `descripcion`: string | null
- `categoriaPadreId`: string | null (jerarquía de categorías)
- `orden`: number
- `activo`: boolean

#### Atributo de Variante
- `id`: string
- `nombre`: string (ej: "Color", "Switch", "Tamaño")
- `tipo`: enum ('color', 'texto', 'numero', 'imagen')

#### Valor de Atributo
- `id`: string
- `atributoId`: string
- `valor`: string (ej: "Negro", "Rojo", "RX-570")
- `codigoColor`: string | null (hex para atributos tipo color)
- `orden`: number

#### Especificación Técnica
- `id`: string
- `nombre`: string (ej: "Velocidad reloj", "Tamaño pantalla")
- `categoriaId`: string (cada categoría tiene su template de specs)

#### PC Pre-armada
- `id`: string
- `nombre`: string (ej: "Gamer Gama Media Ryzen 5")
- `descripcion`: string
- `slug`: string
- `componentes`: { productoId: string, obligatorio: boolean }[]
- `precioBase`: number (suma de componentes al momento de creación)
- `imagen`: string | null
- `activo`: boolean

#### Carrito
- `id`: string
- `usuarioId`: string
- `items`: CarritoItem[]
- `fechaCreacion`: datetime
- `fechaActualizacion`: datetime

#### CarritoItem
- `id`: string
- `carritoId`: string
- `productoId`: string
- `cantidad`: number
- `precioUnitario`: number (precio al momento de agregar)

#### Orden / Pedido
- `id`: string (prefijo HEX-XXXXX)
- `usuarioId`: string
- `items`: OrdenItem[]
- `subtotal`: number
- `envioCosto`: number
- `total`: number
- `estado`: enum ('pendiente', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado', 'reembolsado')
- `metodoEnvio`: enum ('envio_domicilio', 'retiro_sucursal')
- `direccionEnvio`: Direccion | null
- `metodoPago`: string
- `pagoId`: string | null (ID de transacción MP)
- `pagoEstado`: string | null
- `notas`: string | null
- `createdAt`: datetime
- `updatedAt`: datetime

#### Usuario
- `id`: string (UUID)
- `email`: string (único)
- `passwordHash`: string
- `nombre`: string
- `apellido`: string
- `rol`: enum ('cliente', 'vendedor', 'admin')
- `telefono`: string | null
- `direcciones`: Direccion[]
- `activo`: boolean
- `createdAt`: datetime

#### Dirección
- `id`: string
- `usuarioId`: string
- `nombreDestinatario`: string
- `calle`: string
- `numero`: string
- `piso`: string | null
- `ciudad`: string
- `provincia`: string
- `codigoPostal`: string
- `esPrincipal`: boolean

#### Contacto
- `id`: string
- `nombre`: string
- `email`: string
- `asunto`: string
- `mensaje`: string
- `leido`: boolean
- `respondido`: boolean
- `createdAt`: datetime

#### Oferta Laboral
- `id`: string
- `titulo`: string
- `descripcion`: string (HTML/Markdown)
- `requisitos`: string
- `ubicacion`: string (ej: "Tucumán / Remoto")
- `tipoContrato`: enum ('full-time', 'part-time', 'freelance', 'pasantia')
- `activa`: boolean
- `createdAt`: datetime
- `updatedAt`: datetime

#### Postulación
- `id`: string
- `ofertaId`: string | null (puede ser postulación espontánea)
- `nombre`: string
- `email`: string
- `telefono`: string | null
- `mensaje`: string | null
- `archivoCV`: string (URL en Cloudflare R2)
- `leido`: boolean
- `createdAt`: datetime

#### Blog Post
- `id`: string
- `titulo`: string
- `slug`: string
- `contenido`: string (HTML/Markdown)
- `resumen`: string
- `categoriaId`: string
- `imagenPortada`: string | null
- `autorId`: string (referencia a Usuario admin)
- `publicado`: boolean
- `fechaPublicacion`: datetime | null
- `createdAt`: datetime
- `updatedAt`: datetime

#### Categoría de Blog
- `id`: string
- `nombre`: string (ej: "Reviews", "Noticias", "Tutoriales")
- `slug`: string

#### Prensa
- `id`: string
- `titulo`: string
- `tipo`: enum ('nota', 'video', 'radio', 'red_social', 'documento', 'imagen', 'logo')
- `url`: string | null (enlace externo)
- `iframeCode`: string | null (para embeds de Instagram/YouTube)
- `descripcion`: string
- `archivo`: string | null (URL a PDF/imagen descargable en R2)
- `medio`: string (ej: "TN Tecno", "Canal 8 Tucumán")
- `fecha`: datetime
- `publicado`: boolean
- `createdAt`: datetime

#### Log de Auditoría
- `id`: string
- `usuarioId`: string
- `accion`: string (ej: "producto.precio.update")
- `entidad`: string (ej: "Producto")
- `entidadId`: string
- `valorAnterior`: JSON | null
- `valorNuevo`: JSON | null
- `metadata`: JSON | null (IP, user-agent, etc.)
- `createdAt`: datetime

### Reglas de Negocio

- **RN-01 (Variantes jerárquicas)**: Un producto puede tener un `productoPadreId` que lo vincule a un producto base. La herencia de atributos se resuelve en cascada.
- **RN-02 (Compatibilidad Armá tu PC)**: El sistema debe validar al menos: socket de mother ↔ procesador, tipo de RAM (DDR4/DDR5) ↔ mother, factor de fuente ↔ gabinete, consumo total vs capacidad de fuente, factor de placa de video vs gabinete.
- **RN-03 (Stock)**: Un producto no puede agregarse al carrito si `stock <= 0`. El stock se descuenta al confirmar la orden, no al agregar al carrito.
- **RN-04 (Precio en carrito)**: El `precioUnitario` en CarritoItem se congela al momento de agregar el producto, no se actualiza si el precio del producto cambia después.
- **RN-05 (Registro obligatorio)**: Para finalizar una compra, el usuario debe estar registrado y autenticado. No existe compra como invitado.
- **RN-06 (Desactivar envíos)**: El admin puede desactivar globalmente la opción de envío a domicilio. En ese estado, todas las órdenes son forzosamente "retiro en sucursal".
- **RN-07 (Cálculo de envío)**: El costo de envío se calcula basado en código postal de destino vs origen (Tucumán). Se usará una tabla simulada con datos realistas.
- **RN-08 (Chatbot alcance)**: El chatbot solo puede acceder a información pública (productos, envíos, info institucional). No debe exponer datos de usuarios, órdenes, ni credenciales.
- **RN-09 (Logging crítico)**: Se registran en el Log de Auditoría: cambios de precio de producto, cambios de stock, cambios de rol de usuario, cancelaciones de orden, publicaciones/despublicaciones de blog.
- **RN-10 (PC Pre-armada)**: Al seleccionar una PC pre-armada, los componentes se cargan como items editables en "Armá tu PC". El usuario puede agregar, quitar o cambiar cualquier componente.

## User Stories

### Must Have (MVP) — Prioridad Crítica

#### Módulo: Catálogo y Productos

- **US-001**: Como **cliente**, quiero **navegar el catálogo por categorías** para **encontrar productos de mi interés**
  - **AC-1**: Las categorías se muestran en una jerarquía (ej: Componentes > Procesadores)
  - **AC-2**: Al hacer clic en una categoría, se muestran solo los productos de esa categoría (y subcategorías)
  - **AC-3**: Se muestra el nombre, precio, imagen y una badge de "disponible" o "sin stock"
  - **AC-4**: Los productos inactivos no se muestran al público
  - **Tamaño**: M

- **US-002**: Como **cliente**, quiero **filtrar y ordenar productos** para **refinar mi búsqueda**
  - **AC-1**: Filtros por: rango de precio, marca, atributos clave de la categoría
  - **AC-2**: Ordenar por: precio (asc/desc), nombre, más nuevo, más popular
  - **AC-3**: Los filtros se reflejan en la URL (compartible)
  - **Tamaño**: L

- **US-003**: Como **cliente**, quiero **ver la página de detalle de un producto** para **conocer todas sus características**
  - **AC-1**: Muestra nombre, precio, imágenes (galería), especificaciones técnicas en tabla
  - **AC-2**: Si tiene variantes (color, modelo), se muestran selectores y al cambiar varía el precio/stock
  - **AC-3**: Muestra stock disponible
  - **AC-4**: Botón "Agregar al carrito"
  - **Tamaño**: M

- **US-004**: Como **admin**, quiero **crear, editar y desactivar productos** para **mantener el catálogo actualizado**
  - **AC-1**: Formulario con todos los campos del producto
  - **AC-2**: Gestión de variantes: crear producto base, agregar variantes hijas
  - **AC-3**: Subida de imágenes
  - **AC-4**: Asignar a categoría y especificaciones técnicas
  - **AC-5**: Los cambios de precio se registran en log de auditoría
  - **Tamaño**: XL

- **US-005**: Como **admin**, quiero **gestionar categorías** para **organizar el catálogo**
  - **AC-1**: ABM de categorías con jerarquía padre-hijo
  - **AC-2**: Reordenar categorías (drag & drop o por orden numérico)
  - **AC-3**: Al desactivar una categoría, sus productos quedan ocultos
  - **Tamaño**: M

#### Módulo: Armá tu PC

- **US-006**: Como **cliente**, quiero **usar el configurador "Armá tu PC"** para **seleccionar componentes validados por compatibilidad**
  - **AC-1**: Interfaz con slots por tipo de componente (CPU, GPU, RAM, Mother, Fuente, Gabinete, Disco)
  - **AC-2**: Cada slot muestra productos disponibles de esa categoría
  - **AC-3**: Al seleccionar un componente, el sistema valida compatibilidad contra los ya seleccionados
  - **AC-4**: Si hay incompatibilidad, se muestra advertencia y se bloquea/no permite esa selección
  - **AC-5**: Se muestra un resumen con todos los componentes seleccionados, precio total y consumo estimado
  - **AC-6**: Botón "Agregar todo al carrito"
  - **Tamaño**: XL

- **US-007**: Como **cliente**, quiero **seleccionar una PC pre-armada** como **punto de partida en el configurador**
  - **AC-1**: Sección que lista las PCs pre-armadas con nombre, imagen, componentes y precio
  - **AC-2**: Al seleccionar una, se cargan todos sus componentes en el configurador
  - **AC-3**: El usuario puede modificar cualquier componente de la pre-armada
  - **Tamaño**: M

- **US-008**: Como **admin**, quiero **crear y gestionar PCs pre-armadas** para **ofrecer combinaciones recomendadas**
  - **AC-1**: Seleccionar productos específicos para cada slot
  - **AC-2**: Marcar un componente como "obligatorio" o "sugerido"
  - **AC-3**: Previsualizar precio total
  - **AC-4**: Activar/desactivar pre-armadas
  - **Tamaño**: M

#### Módulo: Comparador

- **US-009**: Como **cliente**, quiero **comparar productos lado a lado** para **elegir el que mejor se adapte a mis necesidades**
  - **AC-1**: Seleccionar 2-4 productos de la misma categoría
  - **AC-2**: Vista con columnas lado a lado mostrando especificaciones técnicas
  - **AC-3**: Las filas se agrupan por tipo de especificación
  - **AC-4**: Precio destacado en la parte superior
  - **AC-5**: Botón "Agregar al carrito" individual por cada producto
  - **Tamaño**: L

#### Módulo: Usuarios y Autenticación

- **US-010**: Como **visitante**, quiero **registrarme en la plataforma** para **poder comprar productos**
  - **AC-1**: Formulario con nombre, apellido, email, contraseña
  - **AC-2**: Verificación de email (link de confirmación)
  - **AC-3**: Email bienvenida automático
  - **AC-4**: Validación de email único
  - **Tamaño**: M

- **US-011**: Como **usuario**, quiero **iniciar sesión y gestionar mi perfil** para **acceder a mis funcionalidades**
  - **AC-1**: Login con email + contraseña
  - **AC-2**: Recuperación de contraseña por email
  - **AC-3**: Editar datos personales
  - **AC-4**: Gestionar direcciones (CRUD, marcar principal)
  - **AC-5**: Ver historial de pedidos con estados
  - **Tamaño**: L

- **US-012**: Como **admin**, quiero **gestionar usuarios y roles** para **administrar el acceso al sistema**
  - **AC-1**: Lista de usuarios con filtros (rol, activo, fecha)
  - **AC-2**: Cambiar rol de usuario (cliente ↔ vendedor ↔ admin)
  - **AC-3**: Activar/desactivar usuario
  - **AC-4**: Los cambios de rol se registran en log de auditoría
  - **Tamaño**: M

#### Módulo: Carrito y Checkout

- **US-013**: Como **usuario**, quiero **gestionar mi carrito de compras** para **revisar mi selección antes de comprar**
  - **AC-1**: Agregar/quitar productos
  - **AC-2**: Modificar cantidades (con validación de stock)
  - **AC-3**: Ver subtotal por producto y total general
  - **AC-4**: Carrito persistente (incluso si cierra sesión y vuelve)
  - **Tamaño**: M

- **US-014**: Como **usuario**, quiero **finalizar mi compra** para **recibir los productos**
  - **AC-1**: Flujo de checkout: resumen de carrito → dirección (si envía) → método de pago → confirmación
  - **AC-2**: Seleccionar entre "Envío a domicilio" o "Retiro en sucursal"
  - **AC-3**: Si selecciona envío, ingresar dirección y calcular costo automático
  - **AC-4**: Pagar con Mercado Pago (Checkout Pro + Bricks)
  - **AC-5**: Confirmación de orden con número de seguimiento
  - **AC-6**: Email de confirmación al usuario
  - **AC-7**: Si los envíos están desactivados globalmente, solo mostrar "Retiro en sucursal"
  - **Tamaño**: XL

- **US-015**: Como **admin**, quiero **gestionar pedidos** para **procesar y dar seguimiento**
  - **AC-1**: Lista de pedidos con filtros por estado, fecha, cliente
  - **AC-2**: Cambiar estado del pedido
  - **AC-3**: Ver detalle completo del pedido (items, pago, dirección)
  - **AC-4**: Cancelar pedido y procesar reembolso
  - **Tamaño**: L

#### Módulo: Envíos

- **US-016**: Como **admin**, quiero **configurar las zonas y costos de envío** para **calcular el flete automáticamente**
  - **AC-1**: Tabla de tarifas por rango de código postal
  - **AC-2**: Origen por defecto: Tucumán (configurable)
  - **AC-3**: Toggle global para activar/desactivar envíos
  - **AC-4**: Al desactivar, todas las órdenes fuerzan "retiro en sucursal"
  - **Tamaño**: M

#### Módulo: Contacto y Chatbot

- **US-017**: Como **visitante**, quiero **contactar con la empresa** para **hacer consultas**
  - **AC-1**: Formulario con nombre, email, asunto, mensaje
  - **AC-2**: Al enviar, se envía email de confirmación al usuario y notificación al admin
  - **AC-3**: Sección con enlaces a WhatsApp, Instagram y otras redes
  - **Tamaño**: S

- **US-018**: Como **visitante/usuario**, quiero **chatear con el asistente virtual** para **resolver dudas sobre productos y envíos**
  - **AC-1**: Chat widget accesible desde cualquier página pública
  - **AC-2**: El chatbot usa Groq con RAG sobre productos, envíos e info institucional
  - **AC-3**: Puede recomendar productos y redirigir a páginas del sitio
  - **AC-4**: No requiere login
  - **AC-5**: Alcance restringido: no responde sobre datos de usuarios, contraseñas, ni información sensible
  - **Tamaño**: XL

- **US-019**: Como **admin**, quiero **ver los mensajes de contacto** para **responder consultas**
  - **AC-1**: Bandeja de entrada con mensajes
  - **AC-2**: Marcar como leído/respondido
  - **AC-3**: Responder directamente desde el panel
  - **Tamaño**: S

#### Módulo: Trabajá con Nosotros

- **US-020**: Como **visitante**, quiero **ver ofertas laborales** para **postularme**
  - **AC-1**: Listado de ofertas activas con título, descripción, requisitos, ubicación
  - **AC-2**: Página de detalle de cada oferta
  - **AC-3**: Formulario de postulación con datos personales y subida de CV (Cloudflare R2)
  - **AC-4**: También acepta postulaciones espontáneas (sin oferta específica)
  - **AC-5**: Confirmación por email al postularse
  - **Tamaño**: L

- **US-021**: Como **admin**, quiero **gestionar ofertas laborales y postulaciones** para **administrar el talento**
  - **AC-1**: CRUD de ofertas laborales
  - **AC-2**: Ver lista de postulaciones con CV descargable
  - **AC-3**: Marcar postulaciones como leídas
  - **Tamaño**: L

#### Módulo: Sobre Nosotros

- **US-022**: Como **visitante**, quiero **conocer la empresa** para **obtener información institucional**
  - **AC-1**: Página con misión, visión, historia
  - **AC-2**: Imágenes del equipo/local
  - **AC-3**: Texto institucional (editable por admin)
  - **Tamaño**: S

#### Módulo: Blog

- **US-023**: Como **visitante**, quiero **leer artículos del blog** para **informarme sobre tecnología**
  - **AC-1**: Lista de posts con imagen de portada, título, resumen, fecha
  - **AC-2**: Filtro por categoría
  - **AC-3**: Página de detalle con contenido completo
  - **Tamaño**: M

- **US-024**: Como **admin**, quiero **gestionar el blog** para **publicar contenido**
  - **AC-1**: CRUD completo de posts
  - **AC-2**: Editor de contenido rico (Markdown o WYSIWYG)
  - **AC-3**: Categorías (ABM)
  - **AC-4**: Publicar/despublicar con fecha programada
  - **Tamaño**: L

#### Módulo: Prensa

- **US-025**: Como **visitante**, quiero **acceder a la sala de prensa** para **obtener información institucional y recursos**
  - **AC-1**: Sección con logo, imágenes institucionales, fichas descargables
  - **AC-2**: Enlaces a notas en medios (radio, YouTube, TV)
  - **AC-3**: Embeds de Instagram/reels/publicaciones
  - **Tamaño**: M

- **US-026**: Como **admin**, quiero **gestionar la sala de prensa** para **mantener actualizados los recursos**
  - **AC-1**: CRUD de items de prensa
  - **AC-2**: Subir archivos (PDFs, imágenes) a Cloudflare R2
  - **AC-3**: Agregar embeds y enlaces externos
  - **Tamaño**: M

#### Módulo: Dashboard y Admin General

- **US-027**: Como **admin**, quiero **ver un dashboard con métricas** para **tomar decisiones informadas**
  - **AC-1**: Tarjetas con: ventas del día/semana/mes, productos más vendidos, productos con bajo stock, pedidos pendientes
  - **AC-2**: Gráficos de tendencia de ventas
  - **AC-3**: Acceso rápido a acciones comunes
  - **Tamaño**: L

- **US-028**: Como **admin**, quiero **ver los logs de auditoría** para **rastrear cambios críticos**
  - **AC-1**: Lista cronológica de acciones con usuario, entidad, detalle
  - **AC-2**: Filtros por tipo de acción, usuario, fecha
  - **AC-3**: Vista detallada con valores anteriores y nuevos
  - **Tamaño**: M

### Should Have — Prioridad Alta

- **US-029**: Como **cliente**, quiero **guardar productos en una lista de deseos** para **comprarlos después**
  - **Tamaño**: S

- **US-030**: Como **cliente**, quiero **recibir notificaciones por email del estado de mi pedido** para **estar informado**
  - **AC-1**: Email al confirmar, al enviar, al entregar
  - **Tamaño**: S

- **US-031**: Como **cliente**, quiero **dejar reseñas y calificaciones en productos comprados** para **ayudar a otros usuarios**
  - **AC-1**: Solo puede reseñar productos que compró
  - **AC-2**: Calificación 1-5 estrellas + comentario
  - **AC-3**: Las reseñas se moderan (admin aprueba/rechaza)
  - **Tamaño**: M

- **US-032**: Como **admin**, quiero **exportar reportes (CSV/Excel)** para **analizar datos externamente**
  - **AC-1**: Exportar: productos, pedidos, usuarios
  - **Tamaño**: S

- **US-033**: Como **vendedor**, quiero **gestionar pedidos asignados** para **procesar envíos**
  - **AC-1**: Ver pedidos pendientes de preparación
  - **AC-2**: Marcar como "preparando" y "enviado"
  - **Tamaño**: M

### Could Have (Post-MVP) — Prioridad Media

- **US-034**: Como **cliente**, quiero **seguir el envío en tiempo real** para **saber cuándo llega**
  - **Tamaño**: L

- **US-035**: Como **cliente**, quiero **usar cupones de descuento** para **obtener promociones**
  - **AC-1**: Admin crea cupones con tipo (% o fijo), límite de usos, vigencia
  - **Tamaño**: M

- **US-036**: Como **admin**, quiero **programar precios promocionales** para **automatizar ofertas**
  - **AC-1**: Precio promocional con fecha de inicio y fin
  - **Tamaño**: M

- **US-037**: Como **admin**, quiero **recibir notificaciones en el dashboard de eventos importantes** para **reaccionar rápido**
  - **AC-1**: Notificaciones de: nuevo pedido, bajo stock, nuevo contacto, nueva postulación
  - **Tamaño**: S

- **US-038**: Como **cliente**, quiero **ver productos relacionados en la página de detalle** para **descubrir más opciones**
  - **Tamaño**: S

- **US-039**: Como **admin**, quiero **gestionar el contenido de "Sobre Nosotros"** para **mantenerlo actualizado**
  - **AC-1**: Editor de texto enriquecido para misión, visión, historia
  - **AC-2**: Gestión de imágenes institucionales
  - **Tamaño**: S

- **US-040**: Como **admin**, quiero **personalizar la página de "Envíos" desactivados** para **informar a los clientes**
  - **AC-1**: Mensaje configurable cuando los envíos están desactivados
  - **Tamaño**: S

- **US-041**: Como **admin**, quiero **tener un modo mantenimiento** para **suspender la tienda temporalmente**
  - **AC-1**: Toggle que muestra página de mantenimiento a los visitantes
  - **AC-2**: Los admins pueden seguir accediendo
  - **Tamaño**: S

## Tablero Trello

| Recurso | ID/URL |
|---------|--------|
| **Board ID** | `6a2d363381a98e5b28505ff5` |
| **Board URL** | https://trello.com/b/j7g87ijv/hexnext-e-commerce-tecnología |
| **Workspace ID** | `65e7b00404ab341f1cab3f4f` |

### Listas
| Lista | ID |
|-------|----|
| 📋 Backlog (Must Have - MVP) | `6a2d363c4aadfa89275196ba` |
| 📋 Backlog (Should Have) | `6a2d363daba96cfa084cd536` |
| 📋 Backlog (Could Have) | `6a2d363de7f9b4928e30e364` |
| 🔨 In Progress | `6a2d363ee8fe16bed18954ae` |
| 👀 Review | `6a2d363e61cc20a0a83bc9fd` |
| ✅ Done | `6a2d363e77e761ae7d230df4` |

### Cards por US

| US | Card ID | Short URL |
|----|---------|-----------|
| US-001 | `6a2d364483fcc3a3606efceb` | https://trello.com/c/EfwGe0P7 |
| US-002 | `6a2d364577e761ae7d231e3d` | https://trello.com/c/W85Jfclk |
| US-003 | `6a2d36462cf0b2e3061301c6` | https://trello.com/c/sJXk2IG0 |
| US-004 | `6a2d36481dee33ca9ed6f9ca` | https://trello.com/c/tNmuIl8d |
| US-005 | `6a2d3648515a2e671e75b4ed` | https://trello.com/c/tAEEkOaz |
| US-006 | `6a2d364a47441af9cf34a088` | https://trello.com/c/YQKVGRKd |
| US-007 | `6a2d364b44283591ccbfa6db` | https://trello.com/c/8QcBmH7x |
| US-008 | `6a2d364c0d421f1d8ed777fa` | https://trello.com/c/Loqsl7AP |
| US-009 | `6a2d3653cfb48b5e5aa37cd8` | https://trello.com/c/a5EdvhRs |
| US-010 | `6a2d36538235dde446ee7507` | https://trello.com/c/wEt6wQ6q |
| US-011 | `6a2d36542466c32122ec2454` | https://trello.com/c/gThZKNNb |
| US-012 | `6a2d3656c36fdf1135e0ac8f` | https://trello.com/c/XMhwfk0r |
| US-013 | `6a2d36561b8906831723bea3` | https://trello.com/c/OfQmP2fo |
| US-014 | `6a2d3658a021c0a1632b0744` | https://trello.com/c/Hk2x6sj9 |
| US-015 | `6a2d3659106db266d8b73e5f` | https://trello.com/c/VKPEiNk4 |
| US-016 | `6a2d365ad3160214f1cf7e35` | https://trello.com/c/eVzXd4An |
| US-017 | `6a2d365fad6537bc0bc9710f` | https://trello.com/c/5STo0Pia |
| US-018 | `6a2d3660727f8d611acb8e20` | https://trello.com/c/1ziQ2UqV |
| US-019 | `6a2d3661784e6340035b9bc8` | https://trello.com/c/GpebJ9i8 |
| US-020 | `6a2d36626a0997fea4116b85` | https://trello.com/c/0u0Se9Wu |
| US-021 | `6a2d3663db32bd3c7c6eae7e` | https://trello.com/c/kUAVeugC |
| US-022 | `6a2d3664c13c70076da4fe32` | https://trello.com/c/K7rPDqZz |
| US-023 | `6a2d366543fcc22c21621365` | https://trello.com/c/AqdKP5YS |
| US-024 | `6a2d366698b035e6c376d5f1` | https://trello.com/c/VszuU57I |
| US-025 | `6a2d366ce18eb5e275b24cb3` | https://trello.com/c/AXnOH9a6 |
| US-026 | `6a2d366dfdba40290c9b5278` | https://trello.com/c/1fJo58ML |
| US-027 | `6a2d366e70ade296e6c55684` | https://trello.com/c/R6Fcf857 |
| US-028 | `6a2d366fe223baa87c6458b0` | https://trello.com/c/Ci9HW1u1 |
| US-029 | `6a2d367029391f4e6abbe7fd` | https://trello.com/c/xV8rhFUa |
| US-030 | `6a2d3670e6e12053972ef020` | https://trello.com/c/mCxqa8NW |
| US-031 | `6a2d36707f21e3c5255ad8ec` | https://trello.com/c/6F1V0ElK |
| US-032 | `6a2d367196816da42732e9a7` | https://trello.com/c/BV9OrzrP |
| US-033 | `6a2d367233cdfde434114c3a` | https://trello.com/c/GLKPlPr9 |
| US-034 | `6a2d36774ac702f350891531` | https://trello.com/c/stv7PRNV |
| US-035 | `6a2d3678566be8acf0fc22a6` | https://trello.com/c/x0aWkJ6f |
| US-036 | `6a2d3679b20627a3c55f0802` | https://trello.com/c/TMQLFfSB |
| US-037 | `6a2d367a4be777c9905f50fa` | https://trello.com/c/lq0hAuhN |
| US-038 | `6a2d367a47e23de24774ee06` | https://trello.com/c/3vW3X6dE |
| US-039 | `6a2d367bd13cd279ee856e7c` | https://trello.com/c/f0cbfSrH |
| US-040 | `6a2d367c436fa2fac5fa70c3` | https://trello.com/c/K0sknYdB |
| US-041 | `6a2d367c280c6087b87c35b5` | https://trello.com/c/Vc7PUh6D |
| US-042 | `6a2db3148d92f5283331dccf` | https://trello.com/c/QIVFh3DW |

## Supuestos

1. El proyecto se desarrolla en Next.js App Router con arquitectura hexagonal
2. La base de datos es MongoDB (según skills del proyecto)
3. Los archivos se almacenan en Cloudflare R2 (CVs, imágenes de prensa, logos)
4. El chatbot usa Groq como proveedor de LLM con RAG sobre MongoDB
5. Los pagos se procesan exclusivamente via Mercado Pago (Checkout Pro + Bricks)
6. Los envíos se simulan con datos realistas desde Tucumán; en producción se reemplazará por API real (Andreani/OCA/Correo Argentino)
7. El envío de emails transaccionales usa un servicio SMTP o API (Resend, SendGrid, etc.)
8. La sede física está en Tucumán (para cálculo de envíos)
9. El proyecto usa TypeScript estricto, shadcn/ui, Tailwind CSS, Zod
10. **Tema claro/oscuro**: El sitio soporta ambos temas con toggle para el usuario, respetando la preferencia del sistema por defecto
11. **Logs de auditoría**: Se conservan por tiempo indefinido. Los logs mayores a 1 año pueden ser archivados automáticamente. Se implementa paginación y filtros para navegabilidad.
12. **Rendimiento (proyecto de prueba)**: Sin expectativas de alto tráfico. Se aplican optimizaciones estándar (Server Components, ISR para catálogo, lazy loading de imágenes, compresión de assets). No se implementan capas de caché distribuidas ni CDN avanzado.
13. **Blog**: Solo usuarios con rol **admin** pueden crear, editar y publicar posts. Los vendedores no tienen acceso al módulo de blog.
14. **Testing**: Se implementan tests automatizados desde el MVP (unitarios, integración y e2e) siguiendo la estrategia del skill correspondiente.

## Open Questions

1. **Multi-idioma**: ¿Cuáles serán los próximos idiomas a implementar después de español? (Se sugiere inglés y portugués)
2. **SEO avanzado**: ¿Se requiere integración con Google Merchant Center / feed de productos para shopping ads?
3. **Blog**: ¿Los posts pueden tener etiquetas (tags) adicionales a las categorías?
4. **CDN de imágenes**: Además de R2, ¿usamos un servicio de optimización de imágenes (Cloudinary, Next/Image con remote patterns)?
