/**
 * IAuthRepository - Contrato para autenticación
 */
import type { Credentials, Session } from '../entities/session';

export interface IAuthRepository {
  login(credentials: Credentials): Promise<Session>;
  logout(): Promise<void>;
  getSession(): Promise<Session | null>;
  refreshSession(): Promise<Session>;
}
