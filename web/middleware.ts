import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Proteger rutas que comienzan con /control-iot
  if (url.pathname.startsWith("/control-iot")) {
    const token = req.cookies.get("fablab_token")?.value;
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    // Opcional: podrías verificar token contra Strapi aquí.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/control-iot/:path*"],
};
