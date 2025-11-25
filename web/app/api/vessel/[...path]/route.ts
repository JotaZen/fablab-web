import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy para la API de Vessel (Taxonomías/Inventario)
 * 
 * Redirige todas las peticiones a /api/vessel/[...path] hacia VESSEL_API_URL
 * Ejemplo: /api/vessel/v1/taxonomy/vocabularies/read -> http://localhost:8000/v1/taxonomy/vocabularies/read
 */

const VESSEL_API_URL = process.env.VESSEL_API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

async function proxyRequest(
  request: NextRequest,
  params: { path: string[] }
) {
  try {
    const path = params.path.join('/');
    const url = new URL(request.url);
    const targetUrl = `${VESSEL_API_URL}/${path}${url.search}`;

    // Headers a pasar al backend
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Pasar header de adapter si existe
    const adapterHeader = request.headers.get('X-TAXONOMY-ADAPTER');
    if (adapterHeader) {
      headers['X-TAXONOMY-ADAPTER'] = adapterHeader;
    }

    // Preparar opciones de fetch
    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
    };

    // Agregar body para POST/PUT
    if (request.method === 'POST' || request.method === 'PUT') {
      const body = await request.text();
      if (body) {
        fetchOptions.body = body;
      }
    }

    console.log(`[Vessel Proxy] ${request.method} ${targetUrl}`);

    const response = await fetch(targetUrl, fetchOptions);
    
    // Obtener respuesta
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Si hay error del backend, devolverlo
    if (!response.ok) {
      console.error(`[Vessel Proxy] Error ${response.status}:`, data);
      return NextResponse.json(
        { error: typeof data === 'string' ? data : data.message || 'Error del servidor' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Vessel Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Error de conexión con el servidor de inventario' },
      { status: 502 }
    );
  }
}
