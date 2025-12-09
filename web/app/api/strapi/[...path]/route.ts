import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_TOKEN;

// Remove hop-by-hop headers that can break proxying
function cleanHeaders(headers: Headers) {
  const blocked = ["host", "content-length"];
  const result = new Headers();
  headers.forEach((value, key) => {
    if (blocked.includes(key.toLowerCase())) return;
    result.set(key, value);
  });
  return result;
}

async function proxy(request: NextRequest, { params }: { params: { path: string[] } }) {
  const targetPath = params.path?.join("/") ?? "";
  const url = `${STRAPI_URL}/api/${targetPath}${request.nextUrl.search}`;

  const headers = cleanHeaders(request.headers);
  if (STRAPI_TOKEN) headers.set("Authorization", `Bearer ${STRAPI_TOKEN}`);

  let body: BodyInit | undefined = undefined;
  if (!['GET', 'HEAD'].includes(request.method)) {
    const buffer = await request.arrayBuffer();
    body = buffer;
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    body,
    redirect: "follow",
  };

  try {
    const res = await fetch(url, init);
    const resHeaders = new Headers(res.headers);
    // Remove potential set-cookie from Strapi to avoid conflicts
    resHeaders.delete("set-cookie");

    const body = await res.arrayBuffer();
    return new NextResponse(body, {
      status: res.status,
      statusText: res.statusText,
      headers: resHeaders,
    });
  } catch (error) {
    console.error("Proxy error to Strapi", error);
    return NextResponse.json({ error: "proxy_error" }, { status: 500 });
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as DELETE, proxy as PATCH };
