import { getStrapiClient } from "@/features/auth/infrastructure/di";
import type { AuthAdapter, LoginCreds } from "@/features/auth/domain/authAdapter";
import type { User, AuthResult } from "@/features/auth/domain/user";

export class StrapiAdapter implements AuthAdapter {
  async login(creds: LoginCreds): Promise<AuthResult> {
    const client = getStrapiClient();
    const { jwt, user } = await client.login(creds);
    return { jwt, user };
  }

  async me(token: string): Promise<User> {
    const client = getStrapiClient();
    const user = await client.me(token);
    return user as User;
  }

  async logout() {
    // Adapter-level logout is no-op; logout endpoint clears cookie.
    return;
  }
}
