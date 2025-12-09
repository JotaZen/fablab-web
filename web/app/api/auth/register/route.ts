import { NextResponse } from "next/server";
import { getRole } from "@/features/auth";

// Para server-side (Docker interno): usa STRAPI_API_URL
const STRAPI_URL = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

type RegisterRequestBody = { username: string; email: string; password: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterRequestBody;
    const { username, email, password } = body;

    // Registrar en Strapi
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Error al registrar');
    }

    const data = await response.json();

    // Fetch user with role from Strapi to get actual role
    const jwt = data.jwt;
    const userResponse = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
      headers: { 'Authorization': `Bearer ${jwt}` },
    });

    const strapiUser = userResponse.ok ? await userResponse.json() : data.user;

    // Mapear usuario con el rol real de Strapi
    const user = {
      id: String(strapiUser.id),
      email: strapiUser.email,
      name: strapiUser.username,
      role: getRole(strapiUser.role?.name ?? 'Authenticated'),
      isActive: strapiUser.confirmed ?? false,
      createdAt: new Date(strapiUser.createdAt),
    };

    const res = NextResponse.json({ user });

    res.cookies.set({
      name: "fablab_token",
      value: data.jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    res.cookies.set({
      name: "fablab_jwt",
      value: data.jwt,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
