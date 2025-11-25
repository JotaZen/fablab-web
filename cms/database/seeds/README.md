# Sistema de Permisos FabLab

## Seeds Opcionales

Los seeds **NO se ejecutan automáticamente**. Para cargar datos iniciales:

### Primera vez (desarrollo)
```bash
cd cms
npm run dev:seed    # Inicia Strapi y carga permisos/perfiles
```

### Producción (una sola vez)
```bash
SEED_DATABASE=true npm run start
# O
npm run seed
```

### Desarrollo normal (sin seeds)
```bash
npm run dev         # No carga seeds, comportamiento normal
```

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                         USUARIO                             │
│  ┌─────────┐     ┌─────────────┐     ┌─────────────────┐   │
│  │ Profile │────▶│ Permission  │────▶│ UserPermission  │   │
│  │ (Rol)   │     │ (Permiso)   │     │ (Pivote)        │   │
│  └─────────┘     └─────────────┘     └─────────────────┘   │
│       │                                      │              │
│       │         scope: global|workspace|own  │              │
│       └──────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

## Content-Types en Strapi

### 1. Permission
| Campo | Tipo | Descripción |
|-------|------|-------------|
| permissionId | string (unique) | ID: `categoria.recurso.accion` |
| description | string | Descripción legible |
| category | enum | inventory, iot, blog, users, admin, reservations |
| isActive | boolean | Si está activo |

### 2. Profile (Rol)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| profileId | string (unique) | ID del perfil: `admin`, `editor`, etc. |
| name | string | Nombre visible |
| description | text | Descripción del rol |
| permissions | relation (M2M) | Permisos incluidos |
| defaultScope | enum | Scope por defecto: global, workspace, own |
| isSystem | boolean | Si es rol del sistema (no editable) |

### 3. UserPermission (Pivote)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| user | relation (M2O) | Usuario |
| permission | relation (M2O) | Permiso |
| scope | enum | global, workspace, own |
| workspaceId | string | ID del workspace (si scope=workspace) |
| grantedBy | relation (O2O) | Quién lo asignó |
| grantedAt | datetime | Cuándo se asignó |
| expiresAt | datetime | Cuándo expira (opcional) |

## Formato de Permisos

```
categoria.recurso.accion
```

### Categorías disponibles:
- `inventory` - Inventario de equipos y materiales
- `iot` - Dispositivos IoT
- `blog` - Publicaciones del blog
- `users` - Gestión de usuarios
- `admin` - Administración del sistema
- `reservations` - Reservas de espacios/equipos

### Ejemplos:
```
inventory.items.read      # Ver items del inventario
inventory.items.create    # Crear items
iot.devices.control       # Controlar dispositivos
blog.posts.publish        # Publicar posts
users.permissions.manage  # Gestionar permisos
admin.dashboard.access    # Acceder al admin
```

## Scopes

| Scope | Descripción |
|-------|-------------|
| `global` | El permiso aplica a TODOS los recursos |
| `workspace` | Solo aplica al workspace especificado |
| `own` | Solo aplica a recursos creados por el usuario |

Para FabLab (un solo workspace), `global` y `workspace` son equivalentes.

## Perfiles Predefinidos

| Profile | Descripción | Scope |
|---------|-------------|-------|
| `superadmin` | Acceso total | global |
| `admin` | Gestión general | global |
| `editor` | Solo blog | own |
| `inventory_manager` | Solo inventario | global |
| `iot_operator` | Solo IoT | global |
| `member` | Usuario normal | own |

## Seeds Automáticos

Al iniciar Strapi, el bootstrap (`src/index.ts`) crea automáticamente:
1. Todos los permisos definidos
2. Todos los perfiles predefinidos con sus permisos

## Uso en el Frontend

### Verificar permisos

```typescript
import { hasPermission, hasAnyPermission } from '@/features/auth/domain';

// Usuario actual con permisos resueltos
const user = await authAdapter.getCurrentUser();

// Verificar un permiso
if (hasPermission(user, 'inventory.items.create')) {
  // Puede crear items
}

// Verificar con contexto (para scope 'own')
if (hasPermission(user, 'blog.posts.update', { resourceOwnerId: post.authorId })) {
  // Puede editar el post
}

// Verificar múltiples permisos
if (hasAnyPermission(user, ['blog.posts.create', 'blog.posts.update'])) {
  // Puede crear o editar
}
```

### Componentes de protección

```tsx
import { RequirePermission } from '@/features/auth/presentation';

<RequirePermission permission="admin.dashboard.access" fallback={<AccessDenied />}>
  <AdminDashboard />
</RequirePermission>
```

### PermissionChecker fluido

```typescript
import { PermissionChecker } from '@/features/auth/domain';

const checker = new PermissionChecker(user);

if (checker.can('inventory.items.delete').check()) {
  // ...
}

if (checker.withContext({ resourceOwnerId: post.authorId })
           .can('blog.posts.update').check()) {
  // ...
}
```

## API Endpoints

### Permissions
```
GET  /api/permissions           # Listar todos
GET  /api/permissions/:id       # Obtener uno
POST /api/permissions           # Crear (solo dinámicos)
```

### Profiles
```
GET  /api/profiles              # Listar todos
GET  /api/profiles/:id          # Obtener uno
POST /api/profiles              # Crear perfil personalizado
PUT  /api/profiles/:id          # Actualizar (solo no-sistema)
```

### User Permissions
```
GET  /api/user-permissions?filters[user][id]=1&populate=permission
POST /api/user-permissions      # Asignar permiso
DEL  /api/user-permissions/:id  # Revocar permiso
```

## Configurar permisos de API en Strapi

Ve a: **Settings → Users & Permissions Plugin → Roles → Authenticated**

Habilita:
- **Permission**: find, findOne
- **Profile**: find, findOne
- **User-permission**: find, findOne, create, update, delete
