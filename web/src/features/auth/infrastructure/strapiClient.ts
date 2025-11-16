export type StrapiUser = {
  id: string | number;
  username?: string;
  email?: string;
  roles?: string[];
  [key: string]: unknown;
};

export type AuthResult = { jwt: string; user: StrapiUser };

export class StrapiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async login(identifier: string, password: string): Promise<AuthResult> {
    const res = await fetch(`${this.baseUrl}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body && (body as any).message) || `Login failed (${res.status})`);
    }

    return (await res.json()) as AuthResult;
  }

  async me(token: string): Promise<StrapiUser> {
    const res = await fetch(`${this.baseUrl}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Invalid token");
    return (await res.json()) as StrapiUser;
  }

  // Puedes añadir más métodos (refresh, roles, etc.) aquí
}
