import { NextResponse } from "next/server";

const STRAPI_URL =
  process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
// Accept public tokens too, in case only NEXT_PUBLIC_* is configured locally.
const STRAPI_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_TOKEN;

const headers: Record<string, string> = {
  "Content-Type": "application/json",
};

if (STRAPI_TOKEN) {
  headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
}

export async function GET() {
  try {
    const url = `${STRAPI_URL}/api/team-members?sort=orden:asc&populate=foto`;
    const res = await fetch(url, { headers, cache: "no-store" });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { error: "strapi_error", status: res.status, body },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error proxying team-members", error);
    return NextResponse.json({ error: "fetch_error" }, { status: 500 });
  }
}
