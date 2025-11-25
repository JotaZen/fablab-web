/**
 * ============================================================
 * DOMAIN - ENTIDADES DE AUTENTICACIÓN Y AUTORIZACIÓN
 * ============================================================
 * 
 * Este archivo contiene las entidades puras del dominio.
 * Son agnósticas de cualquier framework o tecnología.
 * 
 * Estructura de permisos: "categoria.recurso.accion"
 * Ejemplo: "inventory.items.read"
 */

// ============================================================
// PERMISSION - Permiso atómico del sistema
// ============================================================

/**
 * Permiso del sistema
 * Representa una acción permitida sobre un recurso
 */
export interface Permission {
  /** Identificador único: categoria.recurso.accion */
  readonly id: string;
  /** Descripción legible */
  readonly description: string;
  /** Categoría del permiso */
  readonly category: PermissionCategory;
  /** Si está activo en el sistema */
  readonly isActive: boolean;
}

export type PermissionCategory = 
  | 'inventory' 
  | 'iot' 
  | 'blog' 
  | 'users' 
  | 'admin' 
  | 'reservations';

/**
 * Scope de un permiso asignado
 * - global: Aplica a todos los recursos
 * - workspace: Aplica solo al workspace especificado
 * - own: Aplica solo a recursos propios del usuario
 */
export type PermissionScope = 'global' | 'workspace' | 'own';

// ============================================================
// USER PERMISSION - Asignación de permiso a usuario
// ============================================================

/**
 * Relación entre un usuario y un permiso
 * Incluye el scope y metadatos de asignación
 */
export interface UserPermission {
  /** ID de la asignación */
  readonly id: string | number;
  /** ID del usuario */
  readonly userId: string | number;
  /** ID del permiso */
  readonly permissionId: string;
  /** Scope del permiso */
  readonly scope: PermissionScope;
  /** Workspace ID (solo si scope = 'workspace') */
  readonly workspaceId?: string;
  /** Cuándo fue asignado */
  readonly grantedAt: Date;
  /** Quién lo asignó */
  readonly grantedBy?: string | number;
  /** Cuándo expira (opcional) */
  readonly expiresAt?: Date;
}

/**
 * Permiso resuelto con toda su información
 * Usado para verificar permisos en runtime
 */
export interface ResolvedPermission {
  /** ID del permiso: categoria.recurso.accion */
  readonly id: string;
  /** Scope asignado */
  readonly scope: PermissionScope;
  /** Workspace si aplica */
  readonly workspaceId?: string;
}

// ============================================================
// PROFILE - Plantilla de permisos (rol)
// ============================================================

/**
 * Perfil/Rol - Agrupación de permisos
 * Facilita asignar conjuntos de permisos comunes
 */
export interface Profile {
  /** Identificador único */
  readonly id: string;
  /** Nombre visible */
  readonly name: string;
  /** Descripción del rol */
  readonly description: string;
  /** IDs de permisos incluidos */
  readonly permissionIds: string[];
  /** Scope por defecto para los permisos */
  readonly defaultScope: PermissionScope;
  /** Si es un perfil del sistema (no editable) */
  readonly isSystem: boolean;
  /** Cantidad de usuarios con este perfil */
  readonly userCount?: number;
}

// ============================================================
// USER - Usuario del sistema
// ============================================================

/**
 * Usuario completo del sistema
 */
export interface User {
  /** ID único */
  readonly id: string | number;
  /** Nombre de usuario */
  readonly username: string;
  /** Email */
  readonly email: string;
  /** Nombre */
  readonly firstName?: string;
  /** Apellido */
  readonly lastName?: string;
  /** URL del avatar */
  readonly avatarUrl?: string;
  /** IDs de perfiles/roles asignados */
  readonly profileIds: string[];
  /** Permisos directos (sin pasar por perfil) */
  readonly directPermissions: ResolvedPermission[];
  /** Si la cuenta está bloqueada */
  readonly isBlocked: boolean;
  /** Si el email está confirmado */
  readonly isConfirmed: boolean;
  /** Proveedor de autenticación */
  readonly provider: AuthProvider;
  /** Fecha de creación */
  readonly createdAt: Date;
  /** Última actualización */
  readonly updatedAt: Date;
  /** Último acceso */
  readonly lastLoginAt?: Date;
}

export type AuthProvider = 'local' | 'google' | 'github' | 'microsoft';

/**
 * Usuario autenticado con sus permisos resueltos
 * Este es el objeto que se usa en toda la aplicación
 */
export interface AuthenticatedUser {
  readonly id: string | number;
  readonly username: string;
  readonly email: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatarUrl?: string;
  /** Todos los permisos del usuario (de perfiles + directos) */
  readonly permissions: ResolvedPermission[];
  /** IDs de perfiles para referencia */
  readonly profileIds: string[];
}

// ============================================================
// AUTH SESSION - Sesión de autenticación
// ============================================================

/**
 * Resultado de un login exitoso
 */
export interface AuthSession {
  /** Usuario autenticado */
  readonly user: AuthenticatedUser;
  /** Token JWT */
  readonly accessToken: string;
  /** Token de refresh (opcional) */
  readonly refreshToken?: string;
  /** Cuándo expira el access token */
  readonly expiresAt: Date;
}

/**
 * Estado de autenticación en el cliente
 */
export interface AuthState {
  readonly user: AuthenticatedUser | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: AuthError | null;
}

// ============================================================
// CREDENTIALS - Credenciales de autenticación
// ============================================================

export interface LoginCredentials {
  /** Email o username */
  readonly identifier: string;
  readonly password: string;
}

export interface RegisterCredentials {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly firstName?: string;
  readonly lastName?: string;
}

// ============================================================
// ERRORS
// ============================================================

export type AuthErrorCode = 
  | 'INVALID_CREDENTIALS'
  | 'USER_BLOCKED'
  | 'USER_NOT_CONFIRMED'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'USER_NOT_FOUND'
  | 'EMAIL_TAKEN'
  | 'USERNAME_TAKEN'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR';

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: AuthErrorCode = 'UNKNOWN_ERROR',
    public readonly statusCode: number = 400,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AuthError';
  }

  static invalidCredentials(): AuthError {
    return new AuthError('Credenciales inválidas', 'INVALID_CREDENTIALS', 401);
  }

  static userBlocked(): AuthError {
    return new AuthError('Usuario bloqueado', 'USER_BLOCKED', 403);
  }

  static tokenExpired(): AuthError {
    return new AuthError('Token expirado', 'TOKEN_EXPIRED', 401);
  }

  static forbidden(resource?: string): AuthError {
    return new AuthError(
      resource ? `Sin permiso para acceder a ${resource}` : 'Acceso denegado',
      'FORBIDDEN',
      403
    );
  }
}

// ============================================================
// INPUTS - DTOs para operaciones
// ============================================================

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profileIds?: string[];
  isBlocked?: boolean;
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  profileIds?: string[];
  isBlocked?: boolean;
}

export interface AssignPermissionInput {
  userId: string | number;
  permissionId: string;
  scope: PermissionScope;
  workspaceId?: string;
  expiresAt?: Date;
}

// ============================================================
// FILTERS
// ============================================================

export interface UserFilters {
  search?: string;
  profileId?: string;
  isBlocked?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'username' | 'email' | 'createdAt' | 'lastLoginAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
