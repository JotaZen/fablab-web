import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRole } from "@/features/auth/domain/entities/role";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("fablab_token")?.value;

    console.log("[/api/auth/session] Token exists:", !!token);

    if (!token) {
      return NextResponse.json({ user: null, reason: "no_token" });
    }

    // Validar token directamente con el backend (servidor a servidor)
    const response = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log("[/api/auth/session] Strapi response status:", response.status);

    if (!response.ok) {
      return NextResponse.json({ user: null, reason: "invalid_token" });
    }

    const strapiUser = await response.json();

    // Mapear a formato interno
    const user = {
      id: String(strapiUser.id),
      email: strapiUser.email,
      name: strapiUser.username,
      role: getRole(strapiUser.role?.name ?? 'Authenticated'),
      isActive: !strapiUser.blocked && strapiUser.confirmed,
      createdAt: new Date(strapiUser.createdAt),
    };

    console.log("[/api/auth/session] User found:", user.email);
    return NextResponse.json({ user });
  } catch (error) {
    console.error("[/api/auth/session] Error:", error);
    return NextResponse.json({ user: null, reason: "error" });
  }
}
