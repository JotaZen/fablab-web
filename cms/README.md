# 🏭 FabLab CMS (Strapi)

Sistema de gestión de contenido para FabLab basado en Strapi 5.

## 📋 Tabla de Contenidos

- [Inicio Rápido](#inicio-rápido)
- [Sistema de Permisos](#sistema-de-permisos)
- [Permisos FabLab vs Strapi](#permisos-fablab-vs-strapi)
- [Migraciones de Datos](#migraciones-de-datos)
- [Content Types](#content-types)
- [API Reference](#api-reference)

---

## 🚀 Inicio Rápido

### Desarrollo

```bash
npm run develop   # Con autoReload
```

### Producción

```bash
npm run build     # Compilar admin panel
npm run start     # Sin autoReload
```

### Cargar datos base (primera vez)

**Opción 1: Consola de Strapi (recomendado)**

```bash
# Terminal 1: Iniciar Strapi
cd cms
npm run develop

# Terminal 2: Ejecutar migraciones
cd cms
npm run strapi console
```

En la consola de Strapi, copia y pega:

```javascript
// 1. Cargar permisos y perfiles
const m = require('./dist/src/migrations');
await m.runMigrations(strapi);

// 2. Asignar permiso GLOBAL a tu usuario (cambia el email)
await m.assignGlobalPermission(strapi, 'tu@email.com');
```

**Opción 2: Desde el panel de Strapi**

1. Ve a **Content Manager → Permiso**
2. Crea entrada: `permissionId: system.all.all`, `category: system`
3. Ve a **Content Manager → Permiso de Usuario**
4. Crea entrada: selecciona tu usuario, el permiso `system.all.all`, scope `global`

---

## 🔐 Sistema de Permisos

FabLab implementa un sistema de permisos granular basado en:

### Estructura de Permisos

Los permisos siguen el formato: `categoria.recurso.accion`

```
inventory.items.read      # Leer items del inventario
inventory.items.create    # Crear items
iot.devices.control       # Controlar dispositivos IoT
blog.posts.publish        # Publicar posts
admin.settings.update     # Actualizar configuraciones
```

### Scopes de Permisos

- **global**: Acceso a todos los recursos del sistema
- **workspace**: Acceso limitado al workspace del usuario
- **own**: Acceso solo a recursos propios

### Perfiles Predefinidos

| Perfil | Descripción |
|--------|-------------|
| `superadmin` | Acceso total al sistema (permiso `system.all.all`) |
| `admin` | Administrador de FabLab |
| `editor` | Gestión de contenido (blog) |
| `inventory_manager` | Gestión de inventario |
| `iot_operator` | Control de dispositivos IoT |
| `member` | Miembro básico |

### Permiso Global (Wildcard)

El permiso `system.all.all` otorga acceso total a todo el sistema. Cuando un usuario tiene este permiso, cualquier verificación de permisos retorna `true`.

```typescript
// En el frontend
import { hasSuperPermission } from '@/features/auth/domain';

if (hasSuperPermission(user)) {
  // Acceso total
}
```

---

## 🔄 Permisos FabLab vs Strapi

### ⚠️ Son sistemas DIFERENTES

| Característica | Permisos FabLab | Permisos Strapi |
|----------------|-----------------|-----------------|
| **Propósito** | Tu app frontend | Admin panel de Strapi |
| **Dónde se configuran** | Migraciones + API | Settings → Users & Permissions |
| **Quién los usa** | Tu código React/Next.js | Strapi interno |
| **Content Type** | `api::permission.permission` | Plugin interno de Strapi |

### Para que un usuario pueda crear posts de blog:

1. **En Strapi Admin (para API REST)**:
   - Settings → Users & Permissions → Roles
   - Editar el rol (ej: "Authenticated")
   - En "Post" marcar: create, find, findOne, update, delete

2. **En tu App (permisos FabLab)**:
   - El usuario debe tener `blog.posts.create` asignado
   - Esto lo verificas en tu frontend antes de mostrar botones

### Flujo completo:

```
Usuario hace login
       │
       ▼
┌──────────────────┐
│ Strapi devuelve  │
│ JWT + user data  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│ Frontend obtiene permisos FabLab del usuario │
│ GET /api/user-permissions?user=X             │
└────────┬─────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│ Frontend verifica: hasPermission(user,       │
│ 'blog.posts.create') antes de mostrar botón  │
└────────┬─────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│ Si tiene permiso, hace POST /api/posts       │
│ Strapi verifica su propio sistema de roles   │
└──────────────────────────────────────────────┘
```

---

## 📦 Migraciones de Datos

Las migraciones cargan datos base (permisos, perfiles) de forma controlada y segura para producción.

### ⚠️ IMPORTANTE

**Las migraciones NO se ejecutan automáticamente.**

Debes ejecutarlas manualmente después del primer despliegue o cuando se añadan nuevas migraciones.

### Métodos de Ejecución

#### 1. Via API REST (Recomendado para producción)

```bash
# Listar migraciones disponibles
GET /api/admin-migrations/list

# Ejecutar todas las migraciones pendientes
POST /api/admin-migrations/run

# Ejecutar una migración específica
POST /api/admin-migrations/run/001-base-permissions

# Revertir una migración (requiere confirmación)
DELETE /api/admin-migrations/rollback/001-base-permissions
Body: { "confirm": "DELETE_ALL_DATA" }
```

#### 2. Via Strapi Console (Desarrollo)

```bash
npm run strapi console
```

```javascript
// En la consola de Strapi:
const { runMigrations, listMigrations } = require('./dist/src/migrations');

// Ver migraciones disponibles
listMigrations();

// Ejecutar todas
await runMigrations(strapi);

// Ejecutar una específica
const { runMigration } = require('./dist/src/migrations');
await runMigration(strapi, '001-base-permissions');
```

### Migraciones Disponibles

| ID | Descripción |
|----|-------------|
| `001-base-permissions` | 31 permisos base del sistema |
| `002-base-profiles` | 6 perfiles predefinidos |

### Crear Nueva Migración

1. Crear archivo en `src/migrations/00X-nombre.ts`:

```typescript
import type { Core } from '@strapi/strapi';

export const id = '00X-nombre';
export const description = 'Descripción de la migración';
export const dependsOn = ['001-base-permissions']; // opcional

export async function up(strapi: Core.Strapi) {
  let created = 0, skipped = 0;
  
  // Tu lógica aquí...
  // Siempre verificar si existe antes de crear
  
  return { created, skipped };
}

export async function down(strapi: Core.Strapi) {
  // Lógica para revertir
  return deletedCount;
}
```

2. Registrar en `src/migrations/index.ts`:

```typescript
import * as migration00X from './00X-nombre';

export const migrations: Migration[] = [
  // ... existentes
  migration00X,
];
```

---

## 📊 Content Types

### Permission

Permisos individuales del sistema.

```typescript
{
  permissionId: string;   // "inventory.items.read"
  description: string;
  category: 'inventory' | 'iot' | 'blog' | 'users' | 'admin' | 'reservations';
  isActive: boolean;
}
```

### Profile

Perfiles que agrupan permisos (similar a roles).

```typescript
{
  profileId: string;      // "admin"
  name: string;           // "Administrador"
  description: string;
  defaultScope: 'global' | 'workspace' | 'own';
  isSystem: boolean;      // No se puede eliminar
  permissions: Permission[];
}
```

### User-Permission

Permisos individuales asignados a usuarios.

```typescript
{
  user: User;
  permission: Permission;
  scope: 'global' | 'workspace' | 'own';
  workspaceId?: string;   // Si scope es 'workspace'
  grantedBy: string;
  grantedAt: datetime;
}
```

---

## 🔗 API Reference

### Autenticación

```bash
# Login
POST /api/auth/local
Body: { "identifier": "email", "password": "..." }

# Registro
POST /api/auth/local/register
Body: { "username": "...", "email": "...", "password": "..." }

# Usuario actual
GET /api/users/me?populate=*
```

### Verificar Permisos

Los permisos se verifican en el frontend. El backend expone los permisos del usuario:

```bash
GET /api/users/me?populate[user_permissions][populate]=permission
```

---

## ⚙️ Deployment

Strapi ofrece varias opciones de despliegue incluyendo [Strapi Cloud](https://cloud.strapi.io).

```bash
yarn strapi deploy
```

## 📚 Más Información

- [Strapi Documentation](https://docs.strapi.io)
- [Strapi Tutorials](https://strapi.io/tutorials)
- [Resource Center](https://strapi.io/resource-center)

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

How to connect a PostgreSQL database (quick)
1. Create a PostgreSQL database and user. Example (local):
```bash
createdb fablab_strapi
createuser fablab_user -P
psql -c "GRANT ALL PRIVILEGES ON DATABASE fablab_strapi TO fablab_user;"
```
2. Create a `.env` in `/cms` and copy values from `.env.example` (don't commit `.env`).
3. Set DB variables in `.env`:
```
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=fablab_strapi
DATABASE_USERNAME=fablab_user
DATABASE_PASSWORD=your_password_here
```
4. Start Strapi:
```bash
cd cms
npm install
npm run build
npm start
```
Strapi se encargará de crear sus tablas al iniciar. Para migraciones más avanzadas utiliza la CLI de Strapi o la funcionalidad de content export/import.

Vulnerabilidades y actualizaciones (rápido)
- Si `npm audit` muestra vulnerabilidades, puedes intentar resolverlas con:
```bash
cd cms
npm audit
npm audit fix
```
- Si la salida sugiere actualizaciones para `@strapi/strapi` o paquetes relacionados, revisa la versión recomendada y actualiza:
```bash
npm install @strapi/strapi@latest
npm update
```
- Si hay vulnerabilidades críticas y `npm audit fix` no las corrige, prueba `npm audit fix --force` **solo** si aceptas posibles cambios mayores.
- Recomendación final: después de actualizar, prueba `npm run build` y `npm start` para verificar que el CMS funcione correctamente.

Configurar `APP_KEYS` (importante)
- Strapi requiere `APP_KEYS` (array de valores) para firmar los cookies de sesión. Puedes añadirlos en `cms/.env` con al menos dos claves separadas por coma:
```
APP_KEYS=key_1_random,key_2_random
```
- Genera claves seguras:
```bash
# Node (bash):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- En desarrollo puedes usar el fallback que hay en `cms/config/server.ts` (no recomendado en producción).

Permitir CORS para el frontend
- Si tu frontend llama directamente a Strapi desde el navegador, añade origen en `cms/config/middlewares.ts` para `strapi::cors` (o configura en `config`):
```ts
export default [
	'strapi::logger',
	'strapi::errors',
	'strapi::security',
	{ name: 'strapi::cors', config: { origin: ['http://localhost:3000'], credentials: true } },
	'strapi::poweredBy',
	'strapi::query',
	'strapi::body',
	'strapi::session',
	'strapi::favicon',
	'strapi::public',
];
```



---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
