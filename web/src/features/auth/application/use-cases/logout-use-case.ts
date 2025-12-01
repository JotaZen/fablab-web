/**
 * LogoutUseCase - Caso de uso para logout
 */
import type { IAuthRepository } from '../domain/interfaces/auth-repository';

export class LogoutUseCase {
  constructor(private repository: IAuthRepository) {}

  execute(): Promise<void> {
    return this.repository.logout();
  }
}
