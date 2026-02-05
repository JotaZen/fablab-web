import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  
  // Limpiar todas las cookies de autenticación
  res.cookies.set({
    name: "fablab_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
  
  res.cookies.set({
    name: "fablab_jwt",
    value: "",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });

  // También limpiar cookie de Payload CMS
  res.cookies.set({
    name: "payload-token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
  
  return res;
}
