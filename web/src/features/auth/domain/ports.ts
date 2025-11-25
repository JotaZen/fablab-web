/**
 * ============================================================
 * DOMAIN - PORTS (INTERFACES DE REPOSITORIO)
 * ============================================================
 * 
 * Contratos que deben implementar los adapters.
 * Definen las operaciones disponibles sin especificar cómo se implementan.
 */

import type {
  AuthenticatedUser,
  AuthSession,
  LoginCredentials,
  RegisterCredentials,
  User,
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
  PaginatedResult,
  Permission,
  UserPermission,
  AssignPermissionInput,
  Profile,
  ResolvedPermission,
} from './entities';

// ============================================================
// AUTH REPOSITORY - Autenticación
// ============================================================

/**
 * Puerto para operaciones de autenticación
 */
export interface AuthRepository {
  /**
   * Iniciar sesión con credenciales
   */
  login(credentials: LoginCredentials): Promise<AuthSession>;

  /**
   * Cerrar sesión
   */
  logout(): Promise<void>;

  /**
   * Registrar nuevo usuario
   */
  register(credentials: RegisterCredentials): Promise<AuthSession>;

  /**
   * Verificar si hay una sesión activa
   */
  getSession(): Promise<AuthSession | null>;

  /**
   * Refrescar el token de acceso
   */
  refreshToken(refreshToken: string): Promise<AuthSession>;

  /**
   * Obtener usuario actual con permisos resueltos
   */
  getCurrentUser(): Promise<AuthenticatedUser | null>;

  /**
   * Cambiar contraseña
   */
  changePassword(currentPassword: string, newPassword: string): Promise<void>;

  /**
   * Solicitar reset de contraseña
   */
  requestPasswordReset(email: string): Promise<void>;

  /**
   * Reset de contraseña con token
   */
  resetPassword(token: string, newPassword: string): Promise<void>;
}

// ============================================================
// USER REPOSITORY - Gestión de usuarios
// ============================================================

/**
 * Puerto para gestión de usuarios
 */
export interface UserRepository {
  /**
   * Obtener usuario por ID
   */
  findById(id: string | number): Promise<User | null>;

  /**
   * Obtener usuario por email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Obtener usuario por username
   */
  findByUsername(username: string): Promise<User | null>;

  /**
   * Listar usuarios con filtros y paginación
   */
  findMany(filters: UserFilters): Promise<PaginatedResult<User>>;

  /**
   * Crear usuario
   */
  create(input: CreateUserInput): Promise<User>;

  /**
   * Actualizar usuario
   */
  update(id: string | number, input: UpdateUserInput): Promise<User>;

  /**
   * Eliminar usuario
   */
  delete(id: string | number): Promise<void>;

  /**
   * Bloquear/desbloquear usuario
   */
  setBlocked(id: string | number, blocked: boolean): Promise<User>;

  /**
   * Obtener permisos resueltos de un usuario
   */
  getResolvedPermissions(id: string | number): Promise<ResolvedPermission[]>;
}

// ============================================================
// PERMISSION REPOSITORY - Gestión de permisos
// ============================================================

/**
 * Puerto para gestión de permisos
 */
export interface PermissionRepository {
  /**
   * Obtener todos los permisos del sistema
   */
  findAll(): Promise<Permission[]>;

  /**
   * Obtener permiso por ID
   */
  findById(id: string): Promise<Permission | null>;

  /**
   * Obtener permisos por categoría
   */
  findByCategory(category: string): Promise<Permission[]>;

  /**
   * Crear permiso (solo para permisos dinámicos)
   */
  create(permission: Omit<Permission, 'isActive'>): Promise<Permission>;

  /**
   * Activar/desactivar permiso
   */
  setActive(id: string, active: boolean): Promise<Permission>;
}

// ============================================================
// USER PERMISSION REPOSITORY - Asignación de permisos
// ============================================================

/**
 * Puerto para asignación de permisos a usuarios
 */
export interface UserPermissionRepository {
  /**
   * Obtener permisos de un usuario
   */
  findByUserId(userId: string | number): Promise<UserPermission[]>;

  /**
   * Asignar permiso a usuario
   */
  assign(input: AssignPermissionInput): Promise<UserPermission>;

  /**
   * Revocar permiso de usuario
   */
  revoke(userId: string | number, permissionId: string): Promise<void>;

  /**
   * Revocar todos los permisos de un usuario
   */
  revokeAll(userId: string | number): Promise<void>;

  /**
   * Verificar si usuario tiene permiso
   */
  hasPermission(
    userId: string | number,
    permissionId: string,
    workspaceId?: string
  ): Promise<boolean>;

  /**
   * Asignar múltiples permisos
   */
  assignMany(inputs: AssignPermissionInput[]): Promise<UserPermission[]>;
}

// ============================================================
// PROFILE REPOSITORY - Gestión de perfiles/roles
// ============================================================

/**
 * Puerto para gestión de perfiles
 */
export interface ProfileRepository {
  /**
   * Obtener todos los perfiles
   */
  findAll(): Promise<Profile[]>;

  /**
   * Obtener perfil por ID
   */
  findById(id: string): Promise<Profile | null>;

  /**
   * Crear perfil personalizado
   */
  create(profile: Omit<Profile, 'id' | 'isSystem' | 'userCount'>): Promise<Profile>;

  /**
   * Actualizar perfil (solo no-sistema)
   */
  update(id: string, profile: Partial<Omit<Profile, 'id' | 'isSystem'>>): Promise<Profile>;

  /**
   * Eliminar perfil (solo no-sistema)
   */
  delete(id: string): Promise<void>;

  /**
   * Asignar perfil a usuario
   */
  assignToUser(profileId: string, userId: string | number): Promise<void>;

  /**
   * Remover perfil de usuario
   */
  removeFromUser(profileId: string, userId: string | number): Promise<void>;

  /**
   * Obtener perfiles de un usuario
   */
  findByUserId(userId: string | number): Promise<Profile[]>;
}

// ============================================================
// EXTERNAL PERMISSION MAPPER - Mapeo de permisos externos
// ============================================================

/**
 * Puerto para mapear permisos de sistemas externos al sistema interno
 */
export interface ExternalPermissionMapper {
  /**
   * Nombre del sistema externo (ej: 'strapi', 'auth0')
   */
  readonly systemName: string;

  /**
   * Mapear permisos externos a permisos internos
   */
  mapToInternal(externalPermissions: unknown): ResolvedPermission[];

  /**
   * Mapear permisos internos a externos
   */
  mapToExternal(internalPermissions: ResolvedPermission[]): unknown;

  /**
   * Verificar si un permiso externo existe en el sistema interno
   */
  hasMapping(externalPermission: string): boolean;
}
