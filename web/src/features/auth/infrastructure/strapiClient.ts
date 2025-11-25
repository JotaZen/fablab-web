<<<<<<< HEAD
import { 
  AuthUser, 
  AuthResult, 
  AuthError, 
  AUTH_ERRORS 
} from '../domain/types';
=======
import type { User, AuthResult } from "@/features/auth/domain/user";
import type { LoginRepository } from "@/features/auth/domain/loginRepository";

export type StrapiError = { message?: string };
>>>>>>> adb40986cf32d5a81e22d888cf94c6dd256e663a

/**
 * Estructura de error de Strapi v4
 * Strapi devuelve errores en formato: { error: { message, name, status, details } }
 */
interface StrapiErrorResponse {
  error?: {
    message?: string;
    name?: string;
    status?: number;
    details?: Record<string, unknown>;
  };
  message?: string; // Formato legacy
}

/**
 * Parsea el error de Strapi y devuelve un mensaje amigable
 */
function parsestrapiError(body: StrapiErrorResponse, statusCode: number): string {
  // Strapi v4 format
  if (body.error?.message) {
    const msg = body.error.message.toLowerCase();
    if (msg.includes('invalid identifier') || msg.includes('invalid credentials')) {
      return AUTH_ERRORS.INVALID_CREDENTIALS;
    }
    if (msg.includes('email') && msg.includes('taken')) {
      return AUTH_ERRORS.EMAIL_TAKEN;
    }
    if (msg.includes('username') && msg.includes('taken')) {
      return AUTH_ERRORS.USERNAME_TAKEN;
    }
    return body.error.message;
  }
  
  // Legacy format
  if (body.message) {
    return body.message;
  }
  
  // Por código de estado
  if (statusCode === 400) return AUTH_ERRORS.INVALID_CREDENTIALS;
  if (statusCode === 401) return AUTH_ERRORS.INVALID_TOKEN;
  if (statusCode === 404) return AUTH_ERRORS.USER_NOT_FOUND;
  
  return AUTH_ERRORS.UNKNOWN;
}

/**
 * StrapiClient - Cliente para autenticación con Strapi
 *
 * Maneja login, registro y validación de sesión.
 * Compatible con Strapi v4.
 */
export class StrapiClient implements LoginRepository {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  /**
   * Inicia sesión con email/username y contraseña
   */
<<<<<<< HEAD
  async login(identifier: string, password: string): Promise<AuthResult> {
    try {
      const res = await fetch(`${this.baseUrl}/api/auth/local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
=======
  async login(creds: { identifier: string; password: string }): Promise<AuthResult> {
    const res = await fetch(`${this.baseUrl}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: creds.identifier, password: creds.password }),
    });
>>>>>>> adb40986cf32d5a81e22d888cf94c6dd256e663a

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message = parsestrapiError(body as StrapiErrorResponse, res.status);
        throw new AuthError(message, 'LOGIN_FAILED', res.status);
      }

      const data = body as { jwt: string; user: AuthUser };
      return {
        jwt: data.jwt,
        user: this.normalizeUser(data.user),
      };
    } catch (err) {
      if (err instanceof AuthError) throw err;
      throw new AuthError(AUTH_ERRORS.NETWORK_ERROR, 'NETWORK_ERROR', 0);
    }
  }

  /**
   * Registra un nuevo usuario
   */
  async register(username: string, email: string, password: string): Promise<AuthResult> {
    try {
      const res = await fetch(`${this.baseUrl}/api/auth/local/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message = parsestrapiError(body as StrapiErrorResponse, res.status);
        throw new AuthError(message, 'REGISTER_FAILED', res.status);
      }

      const data = body as { jwt: string; user: AuthUser };
      return {
        jwt: data.jwt,
        user: this.normalizeUser(data.user),
      };
    } catch (err) {
      if (err instanceof AuthError) throw err;
      throw new AuthError(AUTH_ERRORS.NETWORK_ERROR, 'NETWORK_ERROR', 0);
    }
  }

  /**
   * Obtiene el usuario actual por token
   */
<<<<<<< HEAD
  async me(token: string): Promise<AuthUser> {
    try {
      const res = await fetch(`${this.baseUrl}/api/users/me?populate=role`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new AuthError(AUTH_ERRORS.INVALID_TOKEN, 'INVALID_TOKEN', res.status);
      }

      const user = await res.json();
      return this.normalizeUser(user as AuthUser);
    } catch (err) {
      if (err instanceof AuthError) throw err;
      throw new AuthError(AUTH_ERRORS.NETWORK_ERROR, 'NETWORK_ERROR', 0);
    }
=======
  async me(token: string): Promise<User> {
    // Pedimos también la relación role.permissions para intentar exponer permisos
    const url = `${this.baseUrl}/api/users/me?populate=role.permissions`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Invalid token");

    const data = await res.json();

    // Normalizar la respuesta: Strapi puede devolver el usuario directamente
    // o envuelto en `data.attributes` dependiendo de la configuración.
    const isObject = (u: unknown): u is Record<string, unknown> =>
      typeof u === "object" && u !== null;

    let userRecord: Record<string, unknown>;
    let extractedId: string | number | undefined;

    if (isObject(data) && "data" in data) {
      const maybeDataField = (data as Record<string, unknown>)["data"] as unknown;
      if (!isObject(maybeDataField)) {
        throw new Error("Unexpected response shape from Strapi me()");
      }
      const dataField = maybeDataField as Record<string, unknown>;
      if ("attributes" in dataField && isObject(dataField["attributes"])) {
        userRecord = dataField["attributes"] as Record<string, unknown>;
      } else if (isObject(dataField)) {
        userRecord = dataField as Record<string, unknown>;
      } else {
        throw new Error("Unexpected response shape from Strapi me()");
      }
      extractedId = (dataField["id"] as string | number | undefined) ?? undefined;
    } else if (isObject(data)) {
      userRecord = data as Record<string, unknown>;
    } else {
      throw new Error("Unexpected response shape from Strapi me()");
    }

    // Asegurar que `id` esté presente si viene en otro sitio
    const idVal = (userRecord["id"] ?? extractedId) as string | number | undefined;

    // Extraer role y permisos de forma segura
    const tryGetRole = (): Record<string, unknown> | null => {
      if ("role" in userRecord && isObject(userRecord["role"])) {
        return userRecord["role"] as Record<string, unknown>;
      }
      if ("data" in userRecord && isObject(userRecord["data"])) {
        const maybe = userRecord["data"] as Record<string, unknown>;
        if ("role" in maybe && isObject(maybe["role"])) return maybe["role"] as Record<string, unknown>;
      }
      return null;
    };

    const roleObj = tryGetRole();

    let permsArray: unknown[] | null = null;
    if (roleObj) {
      if ("permissions" in roleObj && Array.isArray(roleObj["permissions"])) {
        permsArray = roleObj["permissions"] as unknown[];
      } else if ("data" in roleObj && isObject(roleObj["data"])) {
        const inner = roleObj["data"] as Record<string, unknown>;
        if ("attributes" in inner && isObject(inner["attributes"])) {
          const attrs = inner["attributes"] as Record<string, unknown>;
          if ("permissions" in attrs && Array.isArray(attrs["permissions"])) {
            permsArray = attrs["permissions"] as unknown[];
          }
        } else if ("permissions" in inner && Array.isArray(inner["permissions"])) {
          permsArray = inner["permissions"] as unknown[];
        }
      }
    }

    const base = { ...userRecord } as Record<string, unknown>;
    if (idVal !== undefined) base["id"] = idVal;

    // Normalizar permisos a strings si existen
    if (permsArray && Array.isArray(permsArray)) {
      const permissions = permsArray.map((p) => {
        if (isObject(p)) {
          const pp = p as Record<string, unknown>;
          if (typeof pp["action"] === "string") return pp["action"] as string;
          if (typeof pp["name"] === "string") return pp["name"] as string;
          if (typeof pp["permission"] === "string") return pp["permission"] as string;
          return JSON.stringify(pp);
        }
        return String(p);
      });
      base["permissions"] = permissions;
    }

    return base as unknown as User;
>>>>>>> adb40986cf32d5a81e22d888cf94c6dd256e663a
  }

  /**
   * Normaliza el usuario de Strapi al formato interno
   */
  private normalizeUser(strapiUser: Record<string, unknown>): AuthUser {
    // Strapi puede devolver roles como objeto o array
    let roles: string[] = [];
    if (strapiUser.role) {
      const role = strapiUser.role as { name?: string; type?: string };
      roles = [role.name || role.type || 'authenticated'];
    }
    if (Array.isArray(strapiUser.roles)) {
      roles = strapiUser.roles.map((r: { name?: string }) => r.name || 'user');
    }

    return {
      id: strapiUser.id as string | number,
      username: (strapiUser.username as string) || '',
      email: (strapiUser.email as string) || '',
      roles,
    };
  }
}
