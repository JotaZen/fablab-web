/**
 * API Route: /api/auth/login
 * 
 * Maneja el inicio de sesión usando Payload CMS
 */
import { NextResponse } from "next/server";
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { getRole } from "@/features/auth/domain/entities/role";

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

    // Usar Payload Local API para login
    const payload = await getPayload({ config: configPromise });

    try {
      const result = await payload.login({
        collection: 'users',
        data: { email, password },
      });

      console.log("[/api/auth/login] Payload login successful");

      const payloadUser = result.user;
      const token = result.token;

      if (!payloadUser || !token) {
        return NextResponse.json(
          { error: "Error al obtener datos de usuario" },
          { status: 500 }
        );
      }

      // Mapear rol de Payload a rol interno
      const roleMap: Record<string, string> = {
        'admin': 'Admin',
        'editor': 'Editor',
        'author': 'Autor',
        'viewer': 'Visualizador',
      };

      // Mapear a formato interno
      const user = {
        id: String(payloadUser.id),
        email: payloadUser.email,
        name: (payloadUser as any).name || payloadUser.email.split('@')[0],
        avatar: (payloadUser as any).avatar?.url,
        role: getRole(roleMap[(payloadUser as any).role] || "Visualizador"),
        isActive: true,
        createdAt: new Date((payloadUser as any).createdAt),
      };

      console.log("[/api/auth/login] User logged in:", user.email, "Role:", user.role.name);

      const response = NextResponse.json({ user, jwt: token });

      // Cookie httpOnly para el servidor (middleware)
      response.cookies.set({
        name: "fablab_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 días
      });

      // Cookie para Payload
      response.cookies.set({
        name: "payload-token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      // Cookie accesible para el cliente
      response.cookies.set({
        name: "fablab_jwt",
        value: token,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    } catch (loginError: any) {
      console.log("[/api/auth/login] Login error:", loginError?.message);
      return NextResponse.json(
        { error: loginError?.message || "Credenciales inválidas" },
        { status: 401 }
      );
    }
  } catch (err) {
    console.error("[/api/auth/login] Error:", err);
    const message = err instanceof Error ? err.message : "Error al iniciar sesión";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
