import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStrapiClient } from "@/features/auth/infrastructure/di";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("fablab_token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const client = getStrapiClient();
    const user = await client.me(token);
    return NextResponse.json({ user });
  } catch {
    // Token inválido o expirado
    return NextResponse.json({ user: null });
  }
}
