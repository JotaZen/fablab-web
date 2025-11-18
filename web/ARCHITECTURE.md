
Estructura

web/
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

Siguientes pasos (elige una opción)
1) Solo documentar (esta versión). No cambios físicos — ya listo.
2) Generar checklist de migración detallado con comandos y pasos para mover archivos y actualizar imports.
3) Aplicar reorganización física (crear carpetas y mover archivos). Requiere confirmación explícita.

Indica 1, 2 o 3 y procedo. No moveré archivos sin tu confirmación.
