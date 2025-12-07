/**
 * StrapiAuthRepository - Implementación para Strapi
 */
import type { IAuthRepository } from '../../domain/interfaces/auth-repository';
import type { Credentials, Session } from '../../domain/entities/session';
import type { User } from '../../domain/entities/user';
import { getRole } from '../../domain/entities/role';
import { AuthError } from '../../domain/errors/auth-error';
import { TokenStorage } from '../storage/token-storage';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

interface StrapiUser {
  id: number;
  username: string;
  email: string;
  blocked: boolean;
  confirmed: boolean;
  createdAt: string;
  role?: { id: number; name: string; type: string };
}

/**
 * Mapear usuario de Strapi a formato interno
 */
function mapStrapiUser(strapiUser: StrapiUser): User {
  return {
    id: String(strapiUser.id),
    email: strapiUser.email,
    name: strapiUser.username,
    role: getRole(strapiUser.role?.name ?? 'Authenticated'),
    isActive: !strapiUser.blocked && strapiUser.confirmed,
    createdAt: new Date(strapiUser.createdAt),
  };
}

export class StrapiAuthRepository implements IAuthRepository {
  async login(credentials: Credentials): Promise<Session> {
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: credentials.email, password: credentials.password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new AuthError(
        error?.error?.message || 'Credenciales inválidas',
        'INVALID_CREDENTIALS'
      );
    }

    const data = await response.json();

    // Guardar token usando TokenStorage unificado
    TokenStorage.setToken(data.jwt);

    const user = await this.fetchUserWithRole(data.jwt);
    return { user, token: data.jwt };
  }

  async logout(): Promise<void> {
    TokenStorage.clearToken();
  }

  async getSession(): Promise<Session | null> {
    const token = TokenStorage.getToken();
    if (!token) return null;

    // TokenStorage ya verifica expiración
    try {
      const user = await this.fetchUserWithRole(token);
      return { user, token };
    } catch (error) {
      // Token inválido o expirado en el servidor
      TokenStorage.clearToken();
      return null;
    }
  }

  async refreshSession(): Promise<Session> {
    const session = await this.getSession();
    if (!session) throw new AuthError('Sesión expirada', 'SESSION_EXPIRED');
    return session;
  }

  private async fetchUserWithRole(token: string): Promise<User> {
    const response = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new AuthError('Sesión inválida', 'UNAUTHORIZED');
    }

    const strapiUser: StrapiUser = await response.json();
    return mapStrapiUser(strapiUser);
  }
}
