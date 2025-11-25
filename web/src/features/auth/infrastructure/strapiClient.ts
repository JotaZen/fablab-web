import { 
  AuthUser, 
  AuthResult, 
  AuthError, 
  AUTH_ERRORS 
} from '../domain/types';

/**
 * Estructura de error de Strapi v4
 * Strapi devuelve errores en formato: { error: { message, name, status, details } }
 */
interface StrapiErrorResponse {
  error?: {
    message?: string;
    name?: string;
    status?: number;
    details?: Record<string, unknown>;
  };
  message?: string; // Formato legacy
}

/**
 * Parsea el error de Strapi y devuelve un mensaje amigable
 */
function parseStrapiError(body: StrapiErrorResponse, statusCode: number): string {
  // Strapi v4 format
  if (body.error?.message) {
    const msg = body.error.message.toLowerCase();
    if (msg.includes('invalid identifier') || msg.includes('invalid credentials')) {
      return AUTH_ERRORS.INVALID_CREDENTIALS;
    }
    if (msg.includes('email') && msg.includes('taken')) {
      return AUTH_ERRORS.EMAIL_TAKEN;
    }
    if (msg.includes('username') && msg.includes('taken')) {
      return AUTH_ERRORS.USERNAME_TAKEN;
    }
    return body.error.message;
  }
  
  // Legacy format
  if (body.message) {
    return body.message;
  }
  
  // Por código de estado
  if (statusCode === 400) return AUTH_ERRORS.INVALID_CREDENTIALS;
  if (statusCode === 401) return AUTH_ERRORS.INVALID_TOKEN;
  if (statusCode === 404) return AUTH_ERRORS.USER_NOT_FOUND;
  
  return AUTH_ERRORS.UNKNOWN;
}

/**
 * StrapiClient - Cliente para autenticación con Strapi
 *
 * Maneja login, registro y validación de sesión.
 * Compatible con Strapi v4.
 */
export class StrapiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  /**
   * Inicia sesión con email/username y contraseña
   */
  async login(identifier: string, password: string): Promise<AuthResult> {
    try {
      const res = await fetch(`${this.baseUrl}/api/auth/local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message = parseStrapiError(body as StrapiErrorResponse, res.status);
        throw new AuthError(message, 'LOGIN_FAILED', res.status);
      }

      const data = body as { jwt: string; user: AuthUser };
      return {
        jwt: data.jwt,
        user: this.normalizeUser(data.user),
      };
    } catch (err) {
      if (err instanceof AuthError) throw err;
      throw new AuthError(AUTH_ERRORS.NETWORK_ERROR, 'NETWORK_ERROR', 0);
    }
  }

  /**
   * Registra un nuevo usuario
   */
  async register(username: string, email: string, password: string): Promise<AuthResult> {
    try {
      const res = await fetch(`${this.baseUrl}/api/auth/local/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message = parseStrapiError(body as StrapiErrorResponse, res.status);
        throw new AuthError(message, 'REGISTER_FAILED', res.status);
      }

      const data = body as { jwt: string; user: AuthUser };
      return {
        jwt: data.jwt,
        user: this.normalizeUser(data.user),
      };
    } catch (err) {
      if (err instanceof AuthError) throw err;
      throw new AuthError(AUTH_ERRORS.NETWORK_ERROR, 'NETWORK_ERROR', 0);
    }
  }

  /**
   * Obtiene el usuario actual por token
   */
  async me(token: string): Promise<AuthUser> {
    try {
      const res = await fetch(`${this.baseUrl}/api/users/me?populate=role`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new AuthError(AUTH_ERRORS.INVALID_TOKEN, 'INVALID_TOKEN', res.status);
      }

      const user = await res.json();
      return this.normalizeUser(user as AuthUser);
    } catch (err) {
      if (err instanceof AuthError) throw err;
      throw new AuthError(AUTH_ERRORS.NETWORK_ERROR, 'NETWORK_ERROR', 0);
    }
  }

  /**
   * Normaliza el usuario de Strapi al formato interno
   */
  private normalizeUser(strapiUser: AuthUser | Record<string, unknown>): AuthUser {
    const user = strapiUser as Record<string, unknown>;
    
    // Strapi puede devolver roles como objeto o array
    let roles: string[] = [];
    if ('role' in user && user.role) {
      const role = user.role as { name?: string; type?: string };
      roles = [role.name || role.type || 'authenticated'];
    }
    if ('roles' in user && Array.isArray(user.roles)) {
      roles = (user.roles as Array<{ name?: string }>).map((r) => r.name || 'user');
    }

    return {
      id: user.id as string | number,
      username: (user.username as string) || '',
      email: (user.email as string) || '',
      roles,
    };
  }
}
