/**
 * LoginUseCase - Caso de uso para login
 */
import type { IAuthRepository } from '../domain/interfaces/auth-repository';
import type { Credentials, Session } from '../domain/entities/session';

export class LoginUseCase {
  constructor(private repository: IAuthRepository) {}

  execute(credentials: Credentials): Promise<Session> {
    return this.repository.login(credentials);
  }
}
