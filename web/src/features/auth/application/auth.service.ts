/**
 * AuthService - Facade para uso simple
 */

import type { Credentials, Session } from '../domain/entities/session';
import type { IAuthRepository } from '../domain/interfaces/auth-repository';
import { LoginUseCase } from './use-cases/login-use-case';
import { LogoutUseCase } from './use-cases/logout-use-case';
import { GetSessionUseCase } from './use-cases/get-session-use-case';

export class AuthService {
  private loginUseCase: LoginUseCase;
  private logoutUseCase: LogoutUseCase;
  private getSessionUseCase: GetSessionUseCase;

  constructor(private repository: IAuthRepository) {
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

  refreshSession(): Promise<Session> {
    return this.repository.refreshSession();
  }
}
