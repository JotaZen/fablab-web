Frontend — Arquitectura (versión revisada: patrón por features)

Este documento describe la estructura y convenciones del `frontend` usando el patrón "features" aplicado al proyecto (`Next.js` App Router + TypeScript). Está pensado para que el equipo tenga un contrato claro sobre dónde poner UI, infraestructura, hooks y utilidades.

Resumen rápido
- Framework: Next.js (App Router), React, TypeScript (strict), Tailwind/PostCSS.
- Convención central: cada dominio va en `src/features/<feature>/` dividido en `presentation`, `infrastructure` y `application`. Código reutilizable va en `src/shared/`.

Estructura actual del frontend

A continuación se muestra la estructura real detectada en el repositorio `frontend` y los elementos clave que ya existen. Esta sección sustituye la formulación "recomendada" y describe lo que está presente ahora para que la documentación coincida con el código.

frontend/
├─ app/                          # Next.js App Router (rutas, layouts, assets, api)
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ globals.css
│  ├─ favicon.ico
│  ├─ control-iot/               # Ruta /control-iot
│  └─ api/
│     ├─ auth/
│     │  ├─ login/
│     │  ├─ logout/
│     │  └─ session/
│     └─ tuya/
│        ├─ commands/
│        ├─ device-info/
│        ├─ device-status/
│        └─ token/
├─ src/
│  ├─ features/                  # Features por dominio (reales detectadas)
│  │  ├─ auth/
│  │  ├─ blog/
│  │  ├─ config/
│  │  ├─ inventory/
│  │  ├─ iot/
│  │  ├─ landing/
│  │  ├─ models-3d/
│  │  ├─ team/
│  │  └─ web/
│  ├─ shared/                    # Providers, hooks, utilitarios reutilizables
│  │  ├─ auth/
│  │  ├─ constants/
│  │  ├─ helpers/
│  │  ├─ hooks/
│  │  ├─ layout/
│  │  ├─ ui/
│  │  ├─ types/
│  │  └─ utils.ts

Notas importantes sobre coincidencia código↔documento
- `app/` está en la raíz de `frontend/` (no en `src/`) y contiene los ficheros del App Router: `layout.tsx`, `page.tsx`, `globals.css` y la carpeta `api/` con endpoints server.
- Los endpoints actuales incluyen `app/api/auth/*` (login/logout/session) y rutas bajo `app/api/tuya/*`.
- `src/features/` contiene varias características reales del proyecto — el documento debe reflejar estas carpetas como la fuente de verdad para nuevas features.

Acciones recomendadas siguientes (de bajo fricción)
- Actualizar esta documentación por cada nueva feature que se añada a `src/features/`.
- Mover cualquier fetch directo a servicios externos dentro de `features/<x>/infrastructure` y exponer clientes via factory/DI.


Convenciones y responsabilidades
- presentation: solo UI y lógica de interacción (state local, validaciones de formulario, llamadas a hooks de application). No `fetch` directo a servicios externos.
- infrastructure: cliente HTTP, adaptadores, lógica de manejo de tokens, código que conoce APIs externas. Aquí es donde viven `strapiClient`, adaptadores a Tuya, etc.
- application: orquesta flujos y casos de uso, expone hooks reutilizables (ej. `useLoginFlow`, `useDevices`).
- shared: providers y hooks de alto nivel (`AuthProvider`), primitives UI, utilidades comunes.

Patrón de inyección (DI) y testing
- Cada cliente a servicios externos debe ser encapsulado en `features/<x>/infrastructure` y expuesto vía una fábrica o `getClient()` + `setClientForTest()` para tests.
- Los endpoints server (ej.: `app/api/auth/*`) deben usar el cliente tipado desde `infrastructure` en vez de `fetch` crudo.
- En tests sustituir cliente con una implementación fake (ej. `FakeStrapiClient`) para evitar I/O.

Ejemplo concreto: Auth
- `src/features/auth/infrastructure/strapiClient.ts` — encapsula `login()` y `me()` con tipos claros.
- `src/features/auth/infrastructure/di.ts` — `getStrapiClient()` / `setStrapiClientForTest()`.
- `src/shared/auth/AuthProvider.tsx` — consulta `GET /api/auth/session` al montar y expone `login()`/`logout()`.
- `app/api/auth/login/route.ts` — endpoint que llama `getStrapiClient().login()` y guarda cookie HTTP-only.

Declaraciones y configuración TypeScript
- Mantener `strict: true` en `tsconfig.json`.
- Incluir `src/types/**/*.d.ts` en `tsconfig.json` para declaraciones de assets y módulos.

Documentación y archivos por feature
- Cada feature puede tener su `ARCHITECTURE.md` corto si es complejo (ej. `src/features/auth/ARCHITECTURE.md`) describiendo contratos, endpoints y adaptadores.
- Mantener un `frontend/ARCHITECTURE.md` global con convenciones (este documento).

Checklist práctico (acciones recomendadas)
- Alta prioridad
  - Integrar `AuthProvider` en `app/layout.tsx` para exponer `useAuth` globalmente.
  - Mover fetchs directos de servicios externos a `features/*/infrastructure`.
  - Añadir `src/types/assets.d.ts` si faltan declaraciones.
- Media prioridad
  - Añadir `RequireAuth` cliente para proteger componentes/páginas que lo necesiten.
  - Crear `features/<feature>/presentation/` con páginas y componentes de ejemplo.
- Baja prioridad
  - Añadir pipeline CI (lint → build → tests).

Auth (resumen rápido)
--------------------
- ¿Usamos Strapi para auth? **Sí.** El frontend delega autenticación y usuarios a Strapi (CMS) — toda la información de sesión y roles se gestiona desde el backend Strapi.
- Flujo básico:
  1. El usuario envía email/usuario + password desde la app Next (`/admin` o cualquier formulario) al endpoint `app/api/auth/login`.
  2. Ese endpoint llama a `getStrapiClient().login()` (cliente en `src/features/auth/infrastructure/strapiClient.ts`) que a su vez consulta Strapi `/api/auth/local`.
  3. Strapi devuelve un JWT; el endpoint `app/api/auth/login` establece una cookie HTTP-only `fablab_token` con ese JWT.
  4. El `AuthProvider` (cliente en `src/shared/auth/AuthProvider.tsx`) al montar pide `GET /api/auth/session` al servidor para hidratar `user` en el cliente; ese endpoint hace `getStrapiClient().me()` con el token de cookie para validar la sesión y devolver user.
  5. Páginas/protecciones: usamos `RequireAuth` (cliente) y `web/middleware.ts` (server) para proteger rutas `/admin/*`.

Archivos clave (implementación actual)
- `web/src/features/auth/infrastructure/strapiClient.ts` — cliente que encapsula `login()` y `me()` contra Strapi.
- `web/src/features/auth/infrastructure/di.ts` — fábrica/DI (`getStrapiClient()` / `setStrapiClientForTest()`).
- `web/app/api/auth/login/route.ts` — server endpoint que guarda cookie `fablab_token`.
- `web/app/api/auth/session/route.ts` — server endpoint que valida el token y devuelve `user`.
- `web/src/shared/auth/AuthProvider.tsx` — provider/estado global de sesión en cliente.
- `web/src/shared/auth/RequireAuth.tsx` — HOC para proteger rutas cliente.
- `web/middleware.ts` — protección simple de `/admin/*` que chequea cookie; puedes reforzar validaciones si lo deseas.
- `web/src/features/auth/infrastructure/migrations/*` — scripts de ejemplo / seeds (dev) para crear usuarios de prueba (recomendado: mantener migraciones reales en `cms/`).

Bases de datos / migraciones — nota rápida
- ¿Dónde está la DB? Strapi (en `cms/`) maneja la base de datos; por defecto usa SQLite en dev, y se puede configurar PostgreSQL/MySQL para producción en `cms/config/database.ts`.
- Si quieres usar PostgreSQL: crea base, rellena `cms/.env` (o `DATABASE_*` variables) — revisa el ejemplo `cms/.env.example` que añadí.
- Migraciones/seed: para tareas que alteran el esquema o crean roles/admins, usa las herramientas del backend (`strapi` CLI, scripts en `cms/`, Data Transfer). El frontend solo incluye scripts dev/seed de ejemplo (`web/src/features/auth/infrastructure/migrations/create-test-user.js`).

Recomendaciones (rápido)
- Integrar `AuthProvider` en `app/layout.tsx` globalmente para exponer `useAuth` en toda la app (recomendado si la sesión es necesaria en el resto de la UI).
- Para producción aumentar la seguridad en `middleware` validando JWT con Strapi en vez de solo chequear cookie.
- Mantener migraciones en el backend (Strapi) y usar el seed del frontend solo para pruebas locales.


Siguientes pasos (elige una opción)
1) Solo documentar (esta versión). No cambios físicos — ya listo.
2) Generar checklist de migración detallado con comandos y pasos para mover archivos y actualizar imports.
3) Aplicar reorganización física (crear carpetas y mover archivos). Requiere confirmación explícita.

Indica 1, 2 o 3 y procedo. No moveré archivos sin tu confirmación.
