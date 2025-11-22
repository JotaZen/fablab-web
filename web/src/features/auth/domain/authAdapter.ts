import type { User, AuthResult } from "@/features/auth/domain/user";

export type LoginCreds = { identifier: string; password: string };

export interface AuthAdapter {
  // Login returns jwt + user (server side). Client login may go through API route.
  login?: (creds: LoginCreds) => Promise<AuthResult>;
  // Get user by token (server-side)
  me: (token: string) => Promise<User>;
  // Optional logout (server-side/adapter specific)
  logout?: () => Promise<void>;
}
