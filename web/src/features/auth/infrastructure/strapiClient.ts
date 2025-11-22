import type { User, AuthResult } from "@/features/auth/domain/user";
import type { LoginRepository } from "@/features/auth/domain/loginRepository";

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
export class StrapiClient implements LoginRepository {
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
  async login(creds: { identifier: string; password: string }): Promise<AuthResult> {
    const res = await fetch(`${this.baseUrl}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: creds.identifier, password: creds.password }),
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
  }

  // Puedes añadir más métodos (refresh, roles, etc.) aquí
}
