import { NextResponse } from "next/server";
import { getStrapiClient } from "@/features/auth/infrastructure/di";
import { AuthError } from "@/features/auth/domain/types";

interface LoginRequestBody {
  identifier: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginRequestBody;
    const { identifier, password } = body;

    // Validación básica
    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const client = getStrapiClient();
    const { jwt, user } = await client.login({ identifier, password });

    const response = NextResponse.json({ user });
    response.cookies.set({
      name: "fablab_token",
      value: jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (err) {
    // Si es un AuthError, usar su mensaje (ya es amigable)
    if (err instanceof AuthError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode || 400 }
      );
    }

    // Error genérico
    const message = err instanceof Error ? err.message : "Error al iniciar sesión";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
