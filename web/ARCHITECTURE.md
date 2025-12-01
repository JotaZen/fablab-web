
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
│  │  ├─ auth/                   # Ver detalle abajo
│  │  ├─ inventory/              # Ver detalle abajo
│  │  ├─ blog/
│  │  ├─ config/
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

## Feature: Auth

Estructura interna siguiendo Arquitectura Hexagonal con separación por entidad:

```
auth/
├── domain/
│   ├── entities/           # Una entidad por archivo
│   │   ├── user.ts         # User, PublicUser, AuthenticatedUser
│   │   ├── role.ts         # Role, CreateRoleDTO, UpdateRoleDTO
│   │   ├── permission.ts   # Permission
│   │   ├── session.ts      # Session, SessionState
│   │   ├── credentials.ts  # LoginCredentials, RegisterCredentials, PasswordReset
│   │   ├── config.ts       # AuthConfig, StrapiAuthConfig
│   │   └── pagination.ts   # PaginatedResult, PaginationParams
│   ├── ports/              # Un puerto por concepto
│   │   ├── auth.port.ts    # AuthPort (login, logout, session)
│   │   ├── users.port.ts   # UsersPort (CRUD usuarios)
│   │   └── roles.port.ts   # RolesPort (CRUD roles)
│   ├── errors.ts           # AuthError y subclases
│   └── helpers.ts          # Funciones puras auxiliares
├── application/
│   ├── auth.service.ts     # Caso de uso: autenticación
│   ├── users.service.ts    # Caso de uso: gestión usuarios
│   └── roles.service.ts    # Caso de uso: gestión roles
├── infrastructure/
│   ├── container.ts        # Factory/DI para obtener servicios
│   ├── strapi/             # Adaptador Strapi
│   │   ├── strapi.auth.adapter.ts
│   │   ├── strapi.users.adapter.ts
│   │   └── strapi.roles.adapter.ts
│   └── laravel/            # Adaptador Laravel Sanctum
│       └── sanctum.adapter.ts
├── presentation/
│   ├── providers/
│   │   └── auth.provider.tsx
│   ├── hooks/
│   │   ├── use-permissions.tsx
│   │   ├── use-users.ts
│   │   └── use-roles.ts
│   └── components/
│       └── require-auth.tsx
├── __tests__/              # Tests unitarios (vitest)
└── index.ts                # Exports públicos del feature
```

## Feature: Inventory

Estructura interna siguiendo el mismo patrón:

```
inventory/
├── domain/
│   ├── entities/           # Una entidad por archivo
│   │   ├── item.ts         # Item, CrearItemDTO, ActualizarItemDTO, EstadoItem
│   │   ├── stock.ts        # ItemStock, Movimiento, CrearItemStockDTO, FiltrosStock
│   │   ├── location.ts     # Locacion, LocacionConHijos, TipoLocacion, Venue
│   │   ├── taxonomy.ts     # Vocabulario, Termino, ArbolTermino, Breadcrumb
│   │   ├── uom.ts          # UnidadMedida, CategoriaUoM, ConvertirUoMDTO
│   │   └── pagination.ts   # PaginatedResult, PaginatedResponse
│   ├── ports/              # Un puerto por concepto
│   │   ├── items.port.ts   # ItemsPort (CRUD items)
│   │   ├── stock.port.ts   # StockPort (movimientos, kardex)
│   │   ├── locations.port.ts   # LocationsPort (CRUD locaciones)
│   │   ├── taxonomy.port.ts    # TaxonomyPort (vocabularios, términos)
│   │   └── uom.port.ts     # UoMPort (unidades de medida)
│   ├── labels.ts           # Constantes de UI (ESTADO_ITEM_LABELS, etc.)
│   ├── seeds.ts            # Datos iniciales/seed
│   └── constants/          # Constantes de dominio
├── infrastructure/
│   ├── vessel/             # Adaptador Vessel API (Python/FastAPI)
│   │   ├── vessel.types.ts     # Tipos API (snake_case)
│   │   ├── vessel.mappers.ts   # Transformaciones API <-> Domain
│   │   ├── items.client.ts     # Cliente HTTP items
│   │   ├── stock.client.ts     # Cliente HTTP stock
│   │   ├── locations.client.ts # Cliente HTTP locaciones
│   │   ├── taxonomy.client.ts  # Cliente HTTP taxonomía
│   │   └── uom.client.ts       # Cliente HTTP UoM
│   └── mock/               # Cliente mock para desarrollo
│       └── mock-client.ts
├── presentation/
│   ├── hooks/              # Hooks de estado y API
│   │   ├── use-items.ts
│   │   ├── use-stock.ts
│   │   ├── use-taxonomy.ts
│   │   └── use-selectores-item.ts
│   ├── pages/              # Páginas/dashboards
│   │   ├── kardex-dashboard.tsx
│   │   ├── locations-dashboard.tsx
│   │   ├── catalogo-dashboard.tsx
│   │   └── articulos-dashboard.tsx
│   └── components/         # Componentes UI
│       ├── items/
│       ├── stock/
│       ├── locations/
│       ├── movimientos/
│       ├── terminos/
│       └── vocabularios/
└── index.ts                # Exports públicos del feature
```

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
