# Feature: CMS

Esta feature centraliza toda la configuración e infraestructura de **Payload CMS**.

## Estructura

```
cms/
├── index.ts                          # Exports públicos
├── infrastructure/
│   └── payload/
│       ├── collections/              # Todas las colecciones
│       │   ├── index.ts              # Re-exporta todas
│       │   ├── Users.ts              # Usuarios del sistema
│       │   ├── Media.ts              # Archivos multimedia
│       │   ├── Posts.ts              # Posts del blog
│       │   ├── Categories.ts         # Categorías del blog
│       │   ├── TeamMembers.ts        # Miembros del equipo
│       │   └── Projects.ts           # Proyectos del FabLab
│       ├── globals/                  # Configuraciones globales
│       │   ├── index.ts
│       │   └── EquipoPage.ts         # Página de equipo
│       ├── access/                   # Control de acceso reutilizable
│       │   └── index.ts
│       └── index.ts                  # Re-exporta todo
```

## Uso

### En `payload.config.ts`

```typescript
import { collections, globals } from '@/features/cms';

export default buildConfig({
    collections,
    globals,
    // ...
});
```

### En otras features

```typescript
// Importar tipos
import type { User, Post, TeamMember, Project } from '@/features/cms';

// Importar helpers de acceso
import { isAdmin, isEditor } from '@/features/cms';
```

## Colecciones

| Slug | Descripción | Grupo Admin |
|------|-------------|-------------|
| `users` | Usuarios del sistema (admin, editor, author) | Configuración |
| `media` | Archivos multimedia (imágenes, videos) | - |
| `posts` | Publicaciones del blog | Blog |
| `categories` | Categorías del blog | Blog |
| `services` | Servicios del FabLab | Servicios |
| `equipment` | Máquinas y herramientas | Servicios |
| `team-members` | Miembros del equipo | Equipo |
| `projects` | Proyectos realizados | Proyectos |
| `events` | Talleres, cursos, eventos | Eventos |
| `faqs` | Preguntas frecuentes | Contenido |
| `testimonials` | Testimonios de usuarios | Contenido |

## Globals

| Slug | Descripción |
|------|-------------|
| `site-settings` | Configuración general del sitio (logo, contacto, redes sociales) |
| `landing-config` | Configuración de la página principal |
| `equipo-page` | Configuración de la página de equipo |

## Control de Acceso

```typescript
// Roles disponibles
type UserRole = 'admin' | 'editor' | 'author';

// Helpers
isAdmin(user)      // true si user.role === 'admin'
isEditor(user)     // true si user.role === 'admin' || 'editor'
isAuthenticated()  // true si hay usuario autenticado
```

## Agregar Nueva Colección

1. Crear archivo en `infrastructure/payload/collections/NuevaColeccion.ts`
2. Exportar desde `infrastructure/payload/collections/index.ts`
3. El array `collections` se actualizará automáticamente
4. Documentar en este README

## Agregar Nuevo Global

1. Crear archivo en `infrastructure/payload/globals/NuevoGlobal.ts`
2. Exportar desde `infrastructure/payload/globals/index.ts`
3. El array `globals` se actualizará automáticamente

## Migraciones

Cuando se modifica el schema de una colección:

```bash
# El servidor de desarrollo detecta cambios automáticamente
# Si hay errores, limpiar la tabla específica:
docker exec -i fablab-postgres psql -U fablab -d fablab_blog -c "DROP TABLE IF EXISTS nombre_tabla CASCADE;"
```
