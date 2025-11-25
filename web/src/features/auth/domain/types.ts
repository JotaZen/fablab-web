/**
 * Tipos para el sistema de autenticación
 */

/** Usuario autenticado */
export interface AuthUser {
  id: string | number;
  username: string;
  email: string;
  roles: string[];
}

/** Resultado de autenticación exitosa */
export interface AuthResult {
  user: AuthUser;
  jwt: string;
}

/** Estado de autenticación */
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/** Credenciales de login */
export interface LoginCredentials {
  identifier: string;
  password: string;
}

/** Credenciales de registro */
export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

/** Error de autenticación */
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string = 'AUTH_ERROR',
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/** Errores conocidos de Strapi */
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Credenciales inválidas. Verifica tu usuario y contraseña.',
  USER_NOT_FOUND: 'Usuario no encontrado.',
  EMAIL_TAKEN: 'Este email ya está registrado.',
  USERNAME_TAKEN: 'Este nombre de usuario ya existe.',
  INVALID_TOKEN: 'Sesión inválida. Por favor inicia sesión nuevamente.',
  NETWORK_ERROR: 'Error de conexión. Verifica que el servidor esté disponible.',
  UNKNOWN: 'Error desconocido. Intenta nuevamente.',
} as const;
