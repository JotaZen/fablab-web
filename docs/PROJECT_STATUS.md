# Estado del Proyecto FabLab Web

## Stack
- **Framework**: Next.js 15 + React 19 + TypeScript
- **CMS**: Payload CMS 3.0 (embebido)
- **DB**: PostgreSQL
- **Estilos**: TailwindCSS 4

## Módulos

| Módulo | Estado | CMS | UI | Notas |
|--------|--------|-----|----|----|
| **Auth** | ✅ | - | ✅ | DDD completo, multi-provider (Strapi/Laravel) |
| **Proyectos** | ✅ | ✅ | ✅ | CRUD via `/cms`, categorías, galería, equipo |
| **Equipo** | ✅ | ✅ | ✅ | Miembros, categorías, redes sociales |
| **Blog** | ✅ | ✅ | ✅ | Posts, categorías, tags, SEO, vistas |
| **Inventario** | ✅ | - | ✅ | Vessel API, taxonomías, arquitectura hexagonal |
| **IoT** | ✅ | - | ✅ | Tuya API, breaker inteligente |
| **Landing** | ✅ | ✅ | ✅ | Secciones públicas, equipo, servicios |
| **CMS** | ✅ | ✅ | - | Colecciones: Posts, Projects, Team, Media, etc. |

## Gestión de Contenidos
Acceder a **`/cms`** para:
- Crear/editar proyectos, posts, miembros del equipo
- Subir medios (imágenes, documentos)
- Gestionar categorías y taxonomías

## Arquitectura
Cada feature sigue DDD:
```
feature/
├── domain/        # Entidades, Ports (interfaces)
├── infrastructure/ # Adapters (API, CMS)
├── presentation/  # UI (components, hooks, pages)
└── index.ts       # Exports públicos
```
