import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL;

export async function GET() {
  if (!STRAPI_URL) {
    return NextResponse.json({ error: 'STRAPI_URL no configurada en el servidor' }, { status: 500 });
  }

  try {
    const url = `${STRAPI_URL.replace(/\/$/, '')}/api`;
    const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
    const text = await res.text().catch(() => '');
    const contentType = res.headers.get('content-type') || '';

    if (!res.ok) {
      try {
        const parsed = contentType.includes('application/json') ? JSON.parse(text) : { message: text };
        return NextResponse.json(parsed, { status: res.status });
      } catch {
        return new NextResponse(text || 'Upstream error', { status: res.status });
      }
    }

    if (contentType.includes('application/json')) {
      return NextResponse.json(JSON.parse(text));
    }

    return new NextResponse(text);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
