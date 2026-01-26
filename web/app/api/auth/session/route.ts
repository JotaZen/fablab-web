/**
 * API Route: /api/auth/session
 * 
 * Valida la sesión del usuario usando Payload CMS
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { getRole } from "@/features/auth/domain/entities/role";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("fablab_token")?.value ||
      cookieStore.get("payload-token")?.value;

    console.log("[/api/auth/session] Token exists:", !!token);

    if (!token) {
      return NextResponse.json({ user: null, reason: "no_token" });
    }

    // Usar Payload Local API para validar el token
    const payload = await getPayload({ config: configPromise });

    try {
      // Verificar el token con Payload
      const { user: payloadUser } = await payload.auth({ headers: new Headers({ 'Authorization': `JWT ${token}` }) });

      if (!payloadUser) {
        return NextResponse.json({ user: null, reason: "invalid_token" });
      }

      // Mapear rol de Payload a rol interno
      const roleMap: Record<string, string> = {
        'admin': 'admin',
        'editor': 'editor',
        'author': 'author',
      };

      // Mapear a formato interno
      const user = {
        id: String(payloadUser.id),
        email: payloadUser.email,
        name: (payloadUser as any).name || payloadUser.email.split('@')[0],
        avatar: (payloadUser as any).avatar?.url,
        role: getRole(roleMap[(payloadUser as any).role] || 'Authenticated'),
        isActive: true,
        createdAt: new Date((payloadUser as any).createdAt),
      };

      console.log("[/api/auth/session] User found:", user.email);
      return NextResponse.json({ user });
    } catch (authError) {
      console.log("[/api/auth/session] Auth error:", authError);
      return NextResponse.json({ user: null, reason: "invalid_token" });
    }
  } catch (error) {
    console.error("[/api/auth/session] Error:", error);
    return NextResponse.json({ user: null, reason: "error" });
  }
}
