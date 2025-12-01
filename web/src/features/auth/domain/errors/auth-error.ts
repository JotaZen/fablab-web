/**
 * AuthError - Error de autenticación
 */
export type AuthErrorCode = 'INVALID_CREDENTIALS' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'SESSION_EXPIRED' | 'NETWORK_ERROR';

export class AuthError extends Error {
  constructor(message: string, public code: AuthErrorCode = 'UNAUTHORIZED') {
    super(message);
    this.name = 'AuthError';
  }
}
