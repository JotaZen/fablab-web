/**
 * LaravelAuthRepository - Implementación para Laravel Sanctum
 */
import type { IAuthRepository } from '../../domain/interfaces/auth-repository';
import type { Credentials, Session } from '../../domain/entities/session';
import type { User } from '../../domain/entities/user';
import { getRole } from '../../domain/entities/role';
import { AuthError } from '../../domain/errors/auth-error';

const LARAVEL_URL = process.env.NEXT_PUBLIC_LARAVEL_URL || 'http://localhost:8000';
const TOKEN_KEY = 'laravel_token';

interface LaravelUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  role?: { id: number; name: string; slug: string };
}

function mapLaravelUser(laravelUser: LaravelUser): User {
  return {
    id: String(laravelUser.id),
    email: laravelUser.email,
    name: laravelUser.name,
    role: getRole(laravelUser.role?.name ?? 'Visitor'),
    isActive: laravelUser.email_verified_at !== null,
    createdAt: new Date(laravelUser.created_at),
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

export class LaravelAuthRepository implements IAuthRepository {
  async login(credentials: Credentials): Promise<Session> {
    await fetch(`${LARAVEL_URL}/sanctum/csrf-cookie`, { credentials: 'include' });

    const response = await fetch(`${LARAVEL_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new AuthError('Credenciales inválidas', 'INVALID_CREDENTIALS');
    }

    const data = await response.json();
    setStoredToken(data.token);
    return { user: mapLaravelUser(data.user), token: data.token };
  }

  async logout(): Promise<void> {
    const token = getStoredToken();
    if (token) {
      await fetch(`${LARAVEL_URL}/api/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      }).catch(() => {});
    }
    clearStoredToken();
  }

  async getSession(): Promise<Session | null> {
    const token = getStoredToken();
    if (!token) return null;

    try {
      const response = await fetch(`${LARAVEL_URL}/api/user`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });

      if (!response.ok) {
        clearStoredToken();
        return null;
      }

      const laravelUser: LaravelUser = await response.json();
      return { user: mapLaravelUser(laravelUser), token };
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
}
