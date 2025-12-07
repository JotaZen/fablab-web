/**
 * Auth Feature - Public API
 * 
 * Arquitectura Hexagonal:
 * - domain/         → Entidades, value objects, interfaces, servicios puros
 * - application/    → Casos de uso, servicios de aplicación, factories
 * - infrastructure/ → Adapters (Strapi, Laravel)
 * - presentation/   → React hooks, providers, componentes
 */

// ============================================================
// DOMAIN - Entities
// ============================================================

export type { RoleCode, Role } from './domain/entities/role';
export { ROLES, getRole, getRoleByCode, mergePermissions } from './domain/entities/role';

export type { User } from './domain/entities/user';

export type { Session, Credentials } from './domain/entities/session';

// ============================================================
// DOMAIN - Value Objects
// ============================================================

export type { Permission } from './domain/value-objects/permission';
export { ALL_PERMISSIONS } from './domain/value-objects/permission';

// ============================================================
// DOMAIN - Interfaces
// ============================================================

export type { IAuthRepository } from './domain/interfaces/auth-repository';

// ============================================================
// DOMAIN - Services
// ============================================================

export { hasPermission, hasAnyPermission, isAdmin } from './domain/services/authorization-service';

// ============================================================
// DOMAIN - Errors
// ============================================================

export type { AuthErrorCode } from './domain/errors/auth-error';
export { AuthError } from './domain/errors/auth-error';

// ============================================================
// APPLICATION - Use Cases
// ============================================================

export { LoginUseCase } from './application/use-cases/login-use-case';
export { LogoutUseCase } from './application/use-cases/logout-use-case';
export { GetSessionUseCase } from './application/use-cases/get-session-use-case';

// ============================================================
// APPLICATION - Services
// ============================================================

export { AuthService } from './application/services/auth-service';

// ============================================================
// APPLICATION - Factories
// ============================================================

export { getAuthService, setAuthBackend, type AuthBackend } from './application/factories/auth-service-factory';

// ============================================================
// INFRASTRUCTURE - Adapters
// ============================================================

export { StrapiAuthRepository } from './infrastructure/adapters/strapi-auth-repository';
export { LaravelAuthRepository } from './infrastructure/adapters/laravel-auth-repository';

// ============================================================
// PRESENTATION
// ============================================================

export { AuthProvider, useAuth, type AuthContextValue } from './presentation/providers/auth.provider';
export { usePermissions, type UsePermissionsResult } from './presentation/hooks/use-permissions';
export { useUsers } from './presentation/hooks/use-users';
export { RequireAuth } from './presentation/components/require-auth';
export { UserFormModal, type UserFormData } from './presentation/components/user-form-modal';
