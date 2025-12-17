/**
 * AuthServiceFactory - Crea AuthService según backend
 * 
 * Soporta múltiples backends de autenticación:
 * - payload: Payload CMS (predeterminado)
 * - strapi: Strapi CMS
 * - laravel: Laravel API
 */
import type { IAuthRepository } from '../../domain/interfaces/auth-repository';
import { AuthService } from '../services/auth-service';

export type AuthBackend = 'payload' | 'strapi' | 'laravel';

// Payload CMS es el backend por defecto
let currentBackend: AuthBackend = 'payload';
let authService: AuthService | null = null;

export function setAuthBackend(backend: AuthBackend): void {
  currentBackend = backend;
  authService = null;
}

export function getAuthBackend(): AuthBackend {
  return currentBackend;
}

export async function getAuthService(): Promise<AuthService> {
  if (authService) return authService;

  let repository: IAuthRepository;

  switch (currentBackend) {
    case 'payload': {
      const { PayloadAuthRepository } = await import('../../infrastructure/adapters/payload-auth-repository');
      repository = new PayloadAuthRepository();
      break;
    }
    case 'strapi': {
      const { StrapiAuthRepository } = await import('../../infrastructure/adapters/strapi-auth-repository');
      repository = new StrapiAuthRepository();
      break;
    }
    case 'laravel': {
      const { LaravelAuthRepository } = await import('../../infrastructure/adapters/laravel-auth-repository');
      repository = new LaravelAuthRepository();
      break;
    }
    default:
      throw new Error(`Backend de autenticación desconocido: ${currentBackend}`);
  }

  authService = new AuthService(repository);
  return authService;
}
