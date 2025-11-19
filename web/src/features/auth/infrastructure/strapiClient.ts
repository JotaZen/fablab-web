export type StrapiUser = {
  id: string | number;
  username?: string;
  email?: string;
  roles?: string[];
  [key: string]: unknown;
};

export type AuthResult = { jwt: string; user: StrapiUser };

export type StrapiError = { message?: string };

/**
 * StrapiClient - Cliente para interactuar con la API de Strapi
 *
 * Este cliente maneja la autenticación y otras operaciones con Strapi.
 * Requiere que Strapi esté corriendo y configurado correctamente.
 *
 * Configuración necesaria en Strapi:
 * - Endpoints de auth habilitados para el rol Public
 * - Usuarios creados en Content Manager > User
 * - JWT generado al hacer login
 */
export class StrapiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  /**
   * Inicia sesión en Strapi con identificador (email o username) y contraseña
   * @param identifier - Email o username del usuario
   * @param password - Contraseña del usuario
   * @returns Promise con el usuario y JWT
   * @throws Error si las credenciales son inválidas o hay error de red
   */
  async login(identifier: string, password: string): Promise<AuthResult> {
    const res = await fetch(`${this.baseUrl}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        (body && (body as StrapiError).message) ||
          `Login failed (${res.status})`
      );
    }

    return (await res.json()) as AuthResult;
  }

  /**
   * Registra un nuevo usuario en Strapi
   * @param username - Nombre de usuario
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @returns Promise con el usuario y JWT
   * @throws Error si el registro falla (email ya existe, etc.)
   */
  async register(
    username: string,
    email: string,
    password: string
  ): Promise<AuthResult> {
    const res = await fetch(`${this.baseUrl}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        (body && (body as StrapiError).message) ||
          `Register failed (${res.status})`
      );
    }

    return (await res.json()) as AuthResult;
  }

  /**
   * Obtiene la información del usuario actual usando el token JWT
   * @param token - Token JWT del usuario
   * @returns Promise con la información del usuario
   * @throws Error si el token es inválido
   */
  async me(token: string): Promise<StrapiUser> {
    const res = await fetch(`${this.baseUrl}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Invalid token");
    return (await res.json()) as StrapiUser;
  }

  // Puedes añadir más métodos (refresh, roles, etc.) aquí
}
