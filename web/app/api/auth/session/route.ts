import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRole } from "@/features/auth";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("fablab_token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    // Obtener usuario de Strapi
    const response = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ user: null });
    }

    const strapiUser = await response.json();
    
    // Mapear a nuestro tipo User
    const user = {
      id: String(strapiUser.id),
      email: strapiUser.email,
      name: strapiUser.username,
      role: getRole(strapiUser.role?.name ?? 'Authenticated'),
      isActive: !strapiUser.blocked && strapiUser.confirmed,
      createdAt: new Date(strapiUser.createdAt),
    };

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
