import { NextResponse } from "next/server";

import { getStrapiClient } from "@/features/auth/infrastructure/di";

function parseCookie(header: string | null, name: string) {
  if (!header) return undefined;
  const pairs = header.split(";").map((p) => p.trim());
  for (const p of pairs) {
    const [k, ...v] = p.split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const token = parseCookie(cookieHeader, "fablab_token");
    if (!token) return NextResponse.json({ user: null });

    const client = getStrapiClient();
    const user = await client.me(token);
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
