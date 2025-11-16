// Helpers del lado servidor para validar tokens con Strapi

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

export type StrapiUser = { id: string | number; username?: string; email?: string; [key: string]: unknown };

export async function validateTokenWithStrapi(token: string): Promise<StrapiUser | null> {
  if (!token) return null;
  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const user = (await res.json()) as StrapiUser;
    return user;
  } catch {
    return null;
  }
}
