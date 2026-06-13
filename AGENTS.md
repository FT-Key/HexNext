# Reglas del equipo multi-agente

## Flujo de trabajo para historias de usuario

Cuando recibas una solicitud de implementacion, sigue este proceso.
NO es obligatorio pasar por todas las fases — se inteligente y adaptate.

### Fase 1: Entender
1. Si la solicitud es ambigua, haz preguntas al usuario
2. Lee WORKFLOW_STATE.md para ver si hay contexto previo
3. Define claramente el alcance antes de empezar

### Fase 2: Explorar
1. Usa @explore para entender la estructura actual del proyecto
2. Busca patrones existentes, componentes similares, convenciones
3. Entiende las dependencias y configuracion actual

### Fase 3: Planificar (para cambios > 1 archivo)
1. Escribe el plan en WORKFLOW_STATE.md seccion ## Plan
2. Define: archivos a crear/modificar, componentes, API routes, tipos
3. Si el plan es complejo, delega a @architect via Task tool
4. NO implementes sin plan si afecta a multiples archivos

### Fase 4: Implementar
1. Lee el plan de WORKFLOW_STATE.md si existe
2. Para implementacion directa: hazlo tu mismo (build)
3. Para implementacion compleja: delega a @builder via Task tool
4. Sigue las convenciones de Next.js App Router

### Fase 5: Revisar
1. Delega a @reviewer via Task tool para code review
2. Si hay issues bloqueantes:

   a. Corrige los issues (tu mismo o via @builder)
   b. Vuelve a pasar por Fase 5
3. Sigue iterando hasta que @reviewer apruebe

### Fase 6: Testear
1. Ejecuta los tests relevantes (no toda la suite si no es necesario)
2. Delega a @tester via Task tool
3. Si fallan:
   a. Diagnostica si es MISSING_BEHAVIOR o TEST_BROKEN
   b. Corrige y vuelve a Fase 5-6

### Fase 7: Lint + TypeScript
1. Delega a @linter via Task tool para ESLint y TypeScript checks
2. Si hay errores, corrigelos y vuelve a verificar

### Fase 8: Commit + PR
1. Delega a @git-assistant via Task tool
2. Crea un branch con nombre descriptivo feat/nombre o fix/nombre
3. Commit con conventional commits: feat|fix|chore|refactor|docs|test
4. Push y crea Pull Request si aplica

## Como delegar a subagentes

Usa el Task tool, NO @mention:

```
Task({
  description: "Implementar componente X",
  prompt: "Instrucciones detalladas para el subagente...",
  subagent_type: "builder"
})
```

Para tareas independientes, lanza multiples Task en UN SOLO mensaje
(se ejecutan en paralelo). Para secuencia, usa mensajes separados.

## Tareas paralelas vs secuenciales

- **Paralelo**: tareas independientes (ej: crear 2 componentes que no se relacionan)
  → Pon todos los Task en un solo mensaje

- **Secuencial**: tareas que dependen una de otra (ej: implementar, luego revisar)
  → Task en mensajes separados, esperando resultado de cada uno

## Convenciones de Next.js (App Router)

- Preferir Server Components por defecto
- Client Components solo con 'use client' cuando necesites interactividad
- Usar Server Actions para mutations de formularios
- Route handlers en app/api/
- Componentes de UI en components/
- Tipos compartidos en types/ o lib/
- Librerias recomendadas: shadcn/ui para UI, Tailwind para estilos
- TypeScript estricto - no usar any
- Zod para validacion
- Early returns sobre if-else anidados
- No dejar console.logs en produccion

## Skills del proyecto

El proyecto tiene skills para estandarizar el conocimiento. Los subagentes
deben cargarlos con `skill({ name: "..." })` segun corresponda.

### Lista de skills

| Skill | Cuando cargarlo |
|-------|----------------|
| `hexagonal-architecture` | Al planificar, implementar o revisar estructura |
| `mongodb-patterns` | Al trabajar con persistencia MongoDB |
| `design-principles` | Siempre (SOLID, KISS, DRY, YAGNI) |
| `design-patterns` | Al usar patrones como Factory, Result, etc. |
| `tailwind-styles` | Al crear o modificar componentes UI |
| `testing-strategy` | Al escribir o ejecutar tests |
| `error-handling` | Al implementar errores de dominio o API |
| `api-response` | Al crear endpoints API |
| `security` | Al implementar auth, validacion o headers |
| `dependency-injection` | Al configurar el contenedor DI |
| `logging` | Al anadir logs en cualquier capa |
| `forms-validation` | Al crear formularios con validacion |

### Como cargar una skill

```
skill({ name: "hexagonal-architecture" })
```

Se pueden cargar multiples skills al inicio de una tarea.

## Reglas generales

- NO modifiques codigo sin entenderlo primero
- Cada subagente actualiza SOLO su seccion en WORKFLOW_STATE.md
- Preserva el contenido existente de WORKFLOW_STATE.md
- Si encuentras un problema que no puedes resolver, informa al usuario
- Despues de completar una tarea, actualiza WORKFLOW_STATE.md con el resumen
- Define claramente "Definition of Done" antes de marcar como completado
