# Auth Feature - Arquitectura Hexagonal

## Estructura

```
features/auth/
├── domain/                         # 🎯 NÚCLEO - Lógica de negocio pura
│   ├── entities/
│   │   ├── user.ts                # User, UserInput, UserFilters
│   │   ├── role.ts                # Role
│   │   ├── permission.ts          # Permission
│   │   ├── session.ts             # Session
│   │   ├── credentials.ts         # Credentials, RegisterData
│   │   ├── config.ts              # AuthConfig
│   │   └── pagination.ts          # PaginatedResponse<T>
│   ├── ports/
│   │   ├── auth.port.ts           # AuthPort interface
│   │   ├── users.port.ts          # UsersPort interface
│   │   └── roles.port.ts          # RolesPort interface
│   ├── errors.ts                  # AuthError class
│   └── helpers.ts                 # hasPermission, hasRole, isAdmin, etc.
│
├── application/                   # 📋 CASOS DE USO - Orquestación
│   ├── auth.service.ts            # login, logout, register, getSession
│   ├── users.service.ts           # CRUD usuarios, block/unblock
│   └── roles.service.ts           # CRUD roles, permisos
│
├── infrastructure/                # 🔌 ADAPTADORES - Implementaciones
│   ├── container.ts               # DI: factories para adapters
│   ├── strapi/
│   │   ├── strapi.auth.adapter.ts # AuthPort para Strapi
│   │   ├── strapi.users.adapter.ts# UsersPort para Strapi
│   │   ├── strapi.roles.adapter.ts# RolesPort para Strapi
│   │   ├── strapi.client.ts       # HTTP client
│   │   └── strapi.mappers.ts      # Strapi <-> Domain
│   └── laravel/
│       └── sanctum.adapter.ts     # AuthPort para Laravel
│
├── presentation/                  # 🖥️ UI - React
│   ├── providers/
│   │   └── auth.provider.tsx      # AuthProvider, useAuth, useUser
│   ├── hooks/
│   │   ├── use-permissions.tsx    # usePermissions
│   │   ├── use-users.ts           # useUsers
│   │   └── use-roles.ts           # useRoles
│   └── components/
│       └── require-auth.tsx       # Protección de rutas
│
├── __tests__/                     # 🧪 TESTS
│   ├── domain/
│   │   ├── helpers.test.ts
│   │   └── errors.test.ts
│   └── infrastructure/
│       └── strapi-mappers.test.ts
│
├── index.ts                       # 📤 API PÚBLICA
└── ARCHITECTURE.md                # Este archivo
```

## Reglas de Dependencia

```
presentation → application → domain ← infrastructure
                    ↑              ↓
                    └──────────────┘
```

1. **domain/** NO importa de ninguna otra capa
2. **application/** solo importa de domain/
3. **infrastructure/** implementa ports de domain/
4. **presentation/** usa application/ y puede usar infrastructure/ para DI

## Entidades de Dominio

```typescript
// User - Usuario del sistema
interface User {
  id: string | number;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  blocked: boolean;
  confirmed: boolean;
}

// Role - Perfil con permisos
interface Role {
  id: string | number;
  name: string;
  description?: string;
  permissions: string[];
}

// Session - Sesión autenticada
interface Session {
  user: User;
  token: string;
  expiresAt?: Date;
}
```

## Ports (Interfaces)

```typescript
// AuthPort - Autenticación
interface AuthPort {
  login(credentials: Credentials): Promise<Session>;
  logout(): Promise<void>;
  register(data: RegisterData): Promise<Session>;
  getSession(): Promise<Session | null>;
  getConfig(): Promise<AuthConfig>;
}

// UsersPort - Gestión de usuarios
interface UsersPort {
  list(filters?: UserFilters): Promise<PaginatedResponse<User>>;
  getById(id: string | number): Promise<User | null>;
  create(data: UserInput): Promise<User>;
  update(id: string | number, data: Partial<UserInput>): Promise<User>;
  delete(id: string | number): Promise<void>;
  block(id: string | number, blocked: boolean): Promise<User>;
}

// RolesPort - Gestión de roles
interface RolesPort {
  list(): Promise<Role[]>;
  getById(id: string | number): Promise<Role | null>;
  create(data: Omit<Role, 'id'>): Promise<Role>;
  update(id: string | number, data: Partial<Role>): Promise<Role>;
  delete(id: string | number): Promise<void>;
  getPermissions(): Promise<Permission[]>;
}
```

## Uso desde fuera del feature

```tsx
// Solo importar desde el index.ts
import { 
  AuthProvider, 
  useAuth, 
  usePermissions,
  RequireAuth,
  useUsers,
  useRoles,
} from '@/features/auth';

// Configurar provider (opcional)
import { setAuthProvider } from '@/features/auth';
setAuthProvider('laravel'); // default: 'strapi'
```

## Providers Soportados

- **Strapi** (default): CMS headless con users-permissions plugin
- **Laravel Sanctum**: API tokens con SPA authentication
