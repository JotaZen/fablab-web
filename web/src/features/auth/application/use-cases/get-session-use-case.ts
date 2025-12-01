/**
 * GetSessionUseCase - Obtener sesión actual
 */
import type { IAuthRepository } from '../../domain/interfaces/auth-repository';
import type { Session } from '../../domain/entities/session';

export class GetSessionUseCase {
  constructor(private repository: IAuthRepository) {}

  execute(): Promise<Session | null> {
    return this.repository.getSession();
  }
}
