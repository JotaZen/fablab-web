/**
 * AuthServiceFactory - Crea AuthService según backend
 */
import type { IAuthRepository } from '../../domain/interfaces/auth-repository';
import { AuthService } from '../services/auth-service';

export type AuthBackend = 'strapi' | 'laravel';

let currentBackend: AuthBackend = 'strapi';
let authService: AuthService | null = null;

export function setAuthBackend(backend: AuthBackend): void {
  currentBackend = backend;
  authService = null;
}

export async function getAuthService(): Promise<AuthService> {
  if (authService) return authService;

  let repository: IAuthRepository;

  if (currentBackend === 'strapi') {
    const { StrapiAuthRepository } = await import('../../infrastructure/adapters/strapi-auth-repository');
    repository = new StrapiAuthRepository();
  } else {
    const { LaravelAuthRepository } = await import('../../infrastructure/adapters/laravel-auth-repository');
    repository = new LaravelAuthRepository();
  }

  authService = new AuthService(repository);
  return authService;
}
