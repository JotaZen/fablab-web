/**
 * StrapiAuthRepository - Implementación para Strapi
 */
import type { IAuthRepository } from '../../domain/interfaces/auth-repository';
import type { Credentials, Session } from '../../domain/entities/session';
import type { User } from '../../domain/entities/user';
import { getRole } from '../../domain/entities/role';
import { AuthError } from '../../domain/errors/auth-error';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';
const TOKEN_KEY = 'strapi_jwt';

interface StrapiUser {
  id: number;
  username: string;
  email: string;
  blocked: boolean;
  confirmed: boolean;
  createdAt: string;
  role?: { id: number; name: string; type: string };
}

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

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

function setStoredToken(token: string): void {
  if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
}

function clearStoredToken(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
}

export class StrapiAuthRepository implements IAuthRepository {
  async login(credentials: Credentials): Promise<Session> {
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: credentials.email, password: credentials.password }),
    });

    if (!response.ok) {
      throw new AuthError('Credenciales inválidas', 'INVALID_CREDENTIALS');
    }

    const data = await response.json();
    setStoredToken(data.jwt);
    
    const user = await this.fetchUserWithRole(data.jwt);
    return { user, token: data.jwt };
  }

  async logout(): Promise<void> {
    clearStoredToken();
  }

  async getSession(): Promise<Session | null> {
    const token = getStoredToken();
    if (!token) return null;

    try {
      const user = await this.fetchUserWithRole(token);
      return { user, token };
    } catch {
      clearStoredToken();
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

    if (!response.ok) throw new AuthError('Sesión inválida', 'UNAUTHORIZED');

    const strapiUser: StrapiUser = await response.json();
    return mapStrapiUser(strapiUser);
  }
}
