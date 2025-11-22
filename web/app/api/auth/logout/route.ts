import { NextResponse } from "next/server";
import { serverLogout } from "@/features/auth/infrastructure/controllers/authController";

export async function POST() {
  try {
    // Execute infrastructure controller which injects the repo and runs the use-case
    await serverLogout();
  } catch (err) {
    // Ignore logout errors from upstream, we'll still clear the cookie
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: "fablab_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
  return res;
}
