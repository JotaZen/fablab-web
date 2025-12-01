/**
 * AuthService - Facade que orquesta los casos de uso
 */
import type { IAuthRepository } from '../../domain/interfaces/auth-repository';
import type { Credentials, Session } from '../../domain/entities/session';
import { LoginUseCase } from '../use-cases/login-use-case';
import { LogoutUseCase } from '../use-cases/logout-use-case';
import { GetSessionUseCase } from '../use-cases/get-session-use-case';

export class AuthService {
  private loginUseCase: LoginUseCase;
  private logoutUseCase: LogoutUseCase;
  private getSessionUseCase: GetSessionUseCase;

  constructor(repository: IAuthRepository) {
    this.loginUseCase = new LoginUseCase(repository);
    this.logoutUseCase = new LogoutUseCase(repository);
    this.getSessionUseCase = new GetSessionUseCase(repository);
  }

  login(credentials: Credentials): Promise<Session> {
    return this.loginUseCase.execute(credentials);
  }

  logout(): Promise<void> {
    return this.logoutUseCase.execute();
  }

  getSession(): Promise<Session | null> {
    return this.getSessionUseCase.execute();
  }
}
