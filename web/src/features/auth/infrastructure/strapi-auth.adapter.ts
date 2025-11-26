/**
 * ============================================================
 * INFRASTRUCTURE - STRAPI AUTH ADAPTER
 * ============================================================
 * 
 * Implementación del AuthRepository para Strapi
 */

import type {
  AuthRepository,
  AuthSession,
  AuthenticatedUser,
  LoginCredentials,
  RegisterCredentials,
  AuthError,
  ResolvedPermission,
} from '../domain';
import { resolveProfilePermissions, PROFILES } from '../domain';

// ============================================================
// TIPOS DE STRAPI
// ============================================================

interface StrapiUser {
  id: number;
  username: string;
  email: string;
  blocked: boolean;
  confirmed: boolean;
  provider: string;
  createdAt: string;
  updatedAt: string;
  // Campos personalizados
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  profiles?: string[]; // IDs de perfiles: ['admin', 'editor']
}

interface StrapiAuthResponse {
  jwt: string;
  user: StrapiUser;
}

interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// ============================================================
// STRAPI AUTH ADAPTER
// ============================================================

export class StrapiAuthAdapter implements AuthRepository {
  private baseUrl: string;
  private tokenKey: string;

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
    tokenKey: string = 'fablab_jwt'
  ) {
    this.baseUrl = baseUrl;
    this.tokenKey = tokenKey;
  }

  // ==================== LOGIN ====================

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await fetch(`${this.baseUrl}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: credentials.identifier,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const error = await this.parseError(response);
      throw error;
    }

    const data: StrapiAuthResponse = await response.json();
    return this.mapToSession(data);
  }

  // ==================== LOGOUT ====================

  async logout(): Promise<void> {
    // Strapi no tiene endpoint de logout, solo eliminamos el token del cliente
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.tokenKey);
    }
  }

  // ==================== REGISTER ====================

  async register(credentials: RegisterCredentials): Promise<AuthSession> {
    const response = await fetch(`${this.baseUrl}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const error = await this.parseError(response);
      throw error;
    }

    const data: StrapiAuthResponse = await response.json();
    return this.mapToSession(data);
  }

  // ==================== GET SESSION ====================

  async getSession(): Promise<AuthSession | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const user = await this.getCurrentUser();
      if (!user) return null;

      return {
        user,
        accessToken: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      };
    } catch {
      return null;
    }
  }

  // ==================== REFRESH TOKEN ====================

  async refreshToken(_refreshToken: string): Promise<AuthSession> {
    // Strapi no tiene refresh token nativo
    // Simplemente verificamos que el token actual sea válido
    const session = await this.getSession();
    if (!session) {
      throw this.createError('TOKEN_EXPIRED', 'Token expirado', 401);
    }
    return session;
  }

  // ==================== GET CURRENT USER ====================

  async getCurrentUser(): Promise<AuthenticatedUser | null> {
    const token = this.getToken();
    if (!token) return null;

    const response = await fetch(`${this.baseUrl}/api/users/me?populate=*`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) return null;
      throw await this.parseError(response);
    }

    const strapiUser: StrapiUser = await response.json();
    return this.mapToAuthenticatedUser(strapiUser);
  }

  // ==================== CHANGE PASSWORD ====================

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const token = this.getToken();
    if (!token) {
      throw this.createError('UNAUTHORIZED', 'No autenticado', 401);
    }

    const response = await fetch(`${this.baseUrl}/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        password: newPassword,
        passwordConfirmation: newPassword,
      }),
    });

    if (!response.ok) {
      throw await this.parseError(response);
    }
  }

  // ==================== REQUEST PASSWORD RESET ====================

  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw await this.parseError(response);
    }
  }

  // ==================== RESET PASSWORD ====================

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: token,
        password: newPassword,
        passwordConfirmation: newPassword,
      }),
    });

    if (!response.ok) {
      throw await this.parseError(response);
    }
  }

  // ==================== HELPERS PRIVADOS ====================

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(this.tokenKey);
  }

  private mapToSession(data: StrapiAuthResponse): AuthSession {
    return {
      user: this.mapToAuthenticatedUser(data.user),
      accessToken: data.jwt,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    };
  }

  private mapToAuthenticatedUser(strapiUser: StrapiUser): AuthenticatedUser {
    // Resolver permisos desde los perfiles
    const profileIds = strapiUser.profiles || ['member']; // Default: member
    const permissions = this.resolvePermissions(profileIds);

    return {
      id: strapiUser.id,
      username: strapiUser.username,
      email: strapiUser.email,
      firstName: strapiUser.firstName,
      lastName: strapiUser.lastName,
      avatarUrl: strapiUser.avatarUrl,
      permissions,
      profileIds,
    };
  }

  private resolvePermissions(profileIds: string[]): ResolvedPermission[] {
    // Obtener permisos de los perfiles
    const resolved = resolveProfilePermissions(profileIds);
    
    // Mapear al formato ResolvedPermission
    return resolved.map(p => ({
      id: p.id,
      scope: p.scope,
    }));
  }

  private async parseError(response: Response): Promise<AuthError> {
    try {
      const data: StrapiError = await response.json();
      return this.mapStrapiError(data, response.status);
    } catch {
      return this.createError('UNKNOWN_ERROR', 'Error desconocido', response.status);
    }
  }

  private mapStrapiError(error: StrapiError, statusCode: number): AuthError {
    const message = error.error?.message || 'Error desconocido';
    const name = error.error?.name || '';

    // Mapear errores de Strapi a nuestros códigos
    if (name === 'ValidationError' || message.includes('Invalid identifier or password')) {
      return this.createError('INVALID_CREDENTIALS', 'Credenciales inválidas', 401);
    }
    if (message.includes('blocked')) {
      return this.createError('USER_BLOCKED', 'Usuario bloqueado', 403);
    }
    if (message.includes('Email or Username are already taken')) {
      return this.createError('EMAIL_TAKEN', 'Email o usuario ya registrado', 400);
    }

    return this.createError('UNKNOWN_ERROR', message, statusCode);
  }

  private createError(
    code: string,
    message: string,
    statusCode: number
  ): AuthError {
    const error = new Error(message) as AuthError;
    error.name = 'AuthError';
    (error as Record<string, unknown>).code = code;
    (error as Record<string, unknown>).statusCode = statusCode;
    return error;
  }
}

// ============================================================
// FACTORY
// ============================================================

let authAdapterInstance: StrapiAuthAdapter | null = null;

export function getAuthAdapter(): AuthRepository {
  if (!authAdapterInstance) {
    authAdapterInstance = new StrapiAuthAdapter();
  }
  return authAdapterInstance;
}
