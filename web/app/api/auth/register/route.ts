/**
 * API Route: /api/auth/register
 * 
 * Maneja el registro de usuarios usando Payload CMS
 */
import { NextResponse } from "next/server";
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { getRole } from "@/features/auth";

type RegisterRequestBody = {
  username?: string;
  name?: string;
  email: string;
  password: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterRequestBody;
    const { username, name, email, password } = body;

    console.log("[/api/auth/register] Attempting registration for:", email);

    // Validación básica
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Usar Payload Local API para crear usuario
    const payload = await getPayload({ config: configPromise });

    try {
      // Crear usuario en Payload
      const newUser = await payload.create({
        collection: 'users',
        data: {
          email,
          password,
          name: name || username || email.split('@')[0],
          role: 'author', // Rol por defecto para nuevos usuarios
        },
      });

      console.log("[/api/auth/register] User created:", newUser.id);

      // Login automático después del registro
      const loginResult = await payload.login({
        collection: 'users',
        data: { email, password },
      });

      const token = loginResult.token;

      // Mapear usuario
      const user = {
        id: String(newUser.id),
        email: newUser.email,
        name: (newUser as any).name || email.split('@')[0],
        role: getRole('Autor'),
        isActive: true,
        createdAt: new Date((newUser as any).createdAt),
      };

      const res = NextResponse.json({ user });

      if (token) {
        res.cookies.set({
          name: "fablab_token",
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });

        res.cookies.set({
          name: "payload-token",
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });

        res.cookies.set({
          name: "fablab_jwt",
          value: token,
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      return res;
    } catch (createError: any) {
      console.log("[/api/auth/register] Create error:", createError?.message);

      // Manejar error de email duplicado
      if (createError?.message?.includes('duplicate') || createError?.message?.includes('already exists')) {
        return NextResponse.json(
          { error: "Ya existe un usuario con ese email" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: createError?.message || "Error al registrar usuario" },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("[/api/auth/register] Error:", err);
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
