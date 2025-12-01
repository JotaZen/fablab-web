/**
 * Session - Sesión de usuario autenticado
 */
import type { User } from './user';

export interface Session {
  user: User;
  token: string;
  expiresAt?: Date;
}

export interface Credentials {
  email: string;
  password: string;
}
