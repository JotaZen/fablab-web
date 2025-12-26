# Guía para Agentes AI (AGENTS.md)

Este documento sirve como contexto y guía para cualquier agente de IA (como Gemini/Antigravity o Copilot) que trabaje en el repositorio `fablab-web`.

## 1. Contexto del Proyecto
- **Nombre**: FabLab Web
- **Propósito**: Plataforma web para la gestión del FabLab INACAP Los Ángeles (Inventario, Blog, IoT, Proyectos).
- **Stack**: Next.js 15 (App Router), React 19, TypeScript, TailwindCSS 4, Payload CMS 3.0.
- **Arquitectura**: Feature-Sliced Design con DDD (Hexagonal).

## 2. Estructura de Directorios
El código fuente principal vive en `web/src/`.

### Estructura de un Feature (`src/features/*`)
Cada feature debe seguir ESTRICTAMENTE esta estructura:
- **`domain/`**: Entidades, Interfaces (Ports), VO (Value Objects). *Sin dependencias de framework.*
- **`application/`**: Casos de uso, Servicios de aplicación. *Solo depende de `domain`.*
- **`infrastructure/`**: Implementaciones de puertos (Adapters), DTOs, llamadas a API/DB. *Depende de `domain` y librerías externas.*
- **`presentation/`**: Componentes React (UI), Hooks, Actions (Controllers). *Depende de `application`.*

> **REGLA DE ORO**: No mezclar capas. Si necesitas lógica de negocio en un componente, muévela a `application` o `domain`. Si necesitas una llamada a API, usa un Adapter en `infrastructure` inyectado vía puerto.

## 3. Convenciones de Código
- **Idioma**: Español para documentación y comentarios. Inglés para código (variables, funciones, clases).
- **Estilos**: TailwindCSS. Evitar CSS modules a menos que sea estrictamente necesario.
- **Naming**: camelCase para variables/funciones, PascalCase para Clases/Componentes.

## 4. Workflows Comunes
- **Docker**: Los archivos de composición están en `docker/` (ej. `docker-compose -f docker/docker-compose.yml up`).
- **CMS**: El CMS es Payload y corre embebido en Next.js. Las colecciones están en `web/src/features/cms`.

## 5. Do's & Don'ts para Agentes

### ✅ Do
- Leer `README.md` y `docs/PROJECT_STATUS.md` antes de empezar tareas complejas.
- Crear archivos pequeños y cohesionados.
- Pedir confirmación antes de borrar código o archivos de configuración importantes.
- Actualizar documentación si cambias la arquitectura o agregas features.

### ❌ Don't
- No crear archivos sueltos en `src/` sin ubicarlos en un feature.
- No modificar `domain` para acomodar caprichos de la UI (la UI se adapta al dominio, o usamos mappers).
- No usar `any` en TypeScript.

## 6. Comandos Útiles
```bash
# Levantar entorno completo
pnpm dev

# Build
pnpm build

# Testing
pnpm test
```
