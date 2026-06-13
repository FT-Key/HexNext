---
description: Ejecuta el flujo multi-agente completo para una historia de usuario: entender, planificar, implementar, revisar, testear, lint y commit
agent: build
---

# Workflow Multi-Agente

Ejecuta el proceso completo para resolver una historia de usuario.

## Uso
/workflow <descripcion de la historia de usuario>

## Proceso
1. Lee AGENTS.md para las reglas del workflow
2. Inicializa WORKFLOW_STATE.md con la request
3. Sigue las fases definidas en AGENTS.md
4. Cada fase delega al subagente correspondiente via Task tool
5. Itera si es necesario (review falla, tests fallan, etc.)
6. Al finalizar, presenta un resumen al usuario con:
   - Archivos creados/modificados
   - Resultados de tests
   - Estado del commit/PR
