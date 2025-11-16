import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

export async function POST(request: Request) {
  if (!STRAPI_URL) {
    return NextResponse.json({ error: 'STRAPI_URL no configurada en el servidor' }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const candidates = [
    'posts',
    'articles',
    'blog-posts',
    'blogs',
    'news',
    'entries',
  ];

  const results: Record<string, { status?: number; ok?: boolean; body?: unknown; error?: string }> = {};

  for (const candidate of candidates) {
    const url = `${STRAPI_URL.replace(/\/$/, '')}/api/${candidate}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
        },
        body: JSON.stringify(body),
      });

      const text = await res.text().catch(() => '');
      const contentType = res.headers.get('content-type') || '';

  let parsed: unknown = text;
      if (contentType.includes('application/json')) {
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = text;
        }
      }

      results[candidate] = { status: res.status, ok: res.ok, body: parsed };

      // if success, forward it immediately
      if (res.ok) {
        return NextResponse.json(parsed, { status: res.status });
      }
    } catch (err) {
      results[candidate] = { error: String(err) };
    }
  }

  // none succeeded — add helper if all are 405
  const statuses: number[] = Object.values(results)
    .map((r) => (r as { status?: number }).status)
    .filter((s): s is number => typeof s === 'number');
  const all405 = statuses.length > 0 && statuses.every((s) => s === 405);

  const response: { error: string; results: typeof results; hint?: string } = { error: 'No se pudo crear en ninguna ruta candidata', results };
  if (all405) {
    response.hint = 'Todas las rutas candidatas devolvieron 405 Method Not Allowed. Verifica permisos/API tokens en Strapi: crea un API token con permiso de creación para el Content Type "post" o habilita temporalmente permisos públicos para crear posts desde Settings -> Roles & Permissions.';
  }

  return NextResponse.json(response, { status: 404 });
}
