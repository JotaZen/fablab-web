import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware de autenticación para Next.js
 *
 * Protege rutas que requieren login:
 * - /admin/* (todas las rutas de admin)
 * - /control-iot/*
 * - /cms/*
 *
 * Verifica la presencia del token JWT en cookies.
 * Redirige a /login si no hay token.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("fablab_token")?.value;

  // Protect admin routes (todas)
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect control-iot routes
  if (pathname.startsWith("/control-iot")) {
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect CMS routes (Payload)
  if (pathname.startsWith("/cms")) {
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/control-iot/:path*", "/cms/:path*"],
};
