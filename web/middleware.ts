import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware de autenticación para Next.js
 *
 * Protege rutas que requieren login:
 * - /admin/* (excepto /admin que es la página de login)
 * - /control-iot/*
 *
 * Verifica la presencia del token JWT en cookies.
 * Redirige a /admin (login) si no hay token.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const token = req.cookies.get("fablab_token")?.value;
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin";
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect control-iot routes
  if (pathname.startsWith("/control-iot")) {
    const token = req.cookies.get("fablab_token")?.value;
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin";
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/control-iot/:path*"],
};
