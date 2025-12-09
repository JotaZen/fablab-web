import { NextResponse } from "next/server";
import { getRole } from "@/features/auth/domain/entities/role";

// Para server-side (Docker interno): usa STRAPI_API_URL
// Para client-side: usa NEXT_PUBLIC_STRAPI_URL
const STRAPI_URL = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginRequestBody;
    const { email, password } = body;

    console.log("[/api/auth/login] Attempting login for:", email);

    // Validación básica
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Llamar directamente a Strapi (servidor a servidor)
    const loginResponse = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });

    console.log("[/api/auth/login] Strapi login response status:", loginResponse.status);

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json().catch(() => ({}));
      console.log("[/api/auth/login] Strapi error:", errorData);
      return NextResponse.json(
        { error: errorData?.error?.message || "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const loginData = await loginResponse.json();
    const jwt = loginData.jwt;

    console.log("[/api/auth/login] Got JWT, fetching user with role...");

    // Obtener usuario con rol
    const userResponse = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Error al obtener usuario" },
        { status: 500 }
      );
    }

    const strapiUser = await userResponse.json();

    // Determinar rol: usar lista de admins definida en env o default
    const adminEmails = (process.env.ADMIN_EMAILS || 'testadmin@fablab.com,admin2@fablab.com,admin3@fablab.com').split(',').map(e => e.trim().toLowerCase());
    const isAdmin = adminEmails.includes(strapiUser.email.toLowerCase());

    // Mapear a formato interno
    const user = {
      id: String(strapiUser.id),
      email: strapiUser.email,
      name: strapiUser.username,
      role: getRole(isAdmin ? 'super_admin' : 'guest'),
      isActive: !strapiUser.blocked && strapiUser.confirmed,
      createdAt: new Date(strapiUser.createdAt),
    };

    console.log("[/api/auth/login] User logged in:", user.email, "Role:", user.role.name);

    const response = NextResponse.json({ user, jwt });

    // Cookie httpOnly para el servidor (middleware)
    response.cookies.set({
      name: "fablab_token",
      value: jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    // Cookie accesible para el cliente
    response.cookies.set({
      name: "fablab_jwt",
      value: jwt,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("[/api/auth/login] Error:", err);
    const message = err instanceof Error ? err.message : "Error al iniciar sesión";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

