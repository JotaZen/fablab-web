import { NextResponse } from "next/server";
import { getStrapiClient } from "@/features/auth/infrastructure/di";

type RegisterRequestBody = { username: string; email: string; password: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterRequestBody;
    const { username, email, password } = body;

    const client = getStrapiClient();
    const { jwt, user } = await client.register(username, email, password);

    const response = NextResponse.json({ user });
    response.cookies.set({
      name: "fablab_token",
      value: jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
