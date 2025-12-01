import { NextResponse } from "next/server";
import { StrapiAuthRepository, AuthError } from "@/features/auth";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginRequestBody;
    const { email, password } = body;

    // Validación básica
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const repository = new StrapiAuthRepository();
    const session = await repository.login({ email, password });

    const response = NextResponse.json({ user: session.user, jwt: session.token });
    
    // Cookie httpOnly para el servidor (segura)
    response.cookies.set({
      name: "fablab_token",
      value: session.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });
    
    // Cookie accesible para el cliente (para API calls a Strapi)
    response.cookies.set({
      name: "fablab_jwt",
      value: session.token,
      httpOnly: false,  // Accesible desde JavaScript
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    if (err instanceof AuthError) {
      const statusCode = err.code === 'INVALID_CREDENTIALS' ? 401 : 400;
      return NextResponse.json({ error: err.message }, { status: statusCode });
    }

    const message = err instanceof Error ? err.message : "Error al iniciar sesión";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
