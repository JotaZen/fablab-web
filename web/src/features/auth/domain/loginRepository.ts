import type { User, AuthResult } from "./user";
import type { LoginCreds } from "./authAdapter";

export interface LoginRepository {
  login?: (creds: LoginCreds) => Promise<AuthResult>;
  me: (token: string) => Promise<User>;
  logout?: () => Promise<void>;
}

export type { LoginCreds };
