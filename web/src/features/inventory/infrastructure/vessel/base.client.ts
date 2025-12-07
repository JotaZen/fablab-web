/**
 * Vessel API - Cliente Base
 * 
 * Cliente HTTP base para comunicarse con Vessel API.
 * Proporciona métodos comunes para GET, POST, PUT, DELETE.
 */

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
}

export class VesselBaseClient {
  protected baseUrl: string;

  constructor(baseUrl?: string) {
    const url = baseUrl || getVesselBaseUrl();
    this.baseUrl = url.replace(/\/$/, '');
  }

  // ============================================================
  // HTTP METHODS
  // ============================================================

  protected async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const res = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(res);
  }

  protected async post<T>(path: string, body?: unknown): Promise<T> {
    const url = this.buildUrl(path);
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(res);
  }

  protected async put<T>(path: string, body?: unknown): Promise<T> {
    const url = this.buildUrl(path);
    const res = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(res);
  }

  protected async delete<T = void>(path: string): Promise<T> {
    const url = this.buildUrl(path);
    const res = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(res);
  }

  // ============================================================
  // HELPERS (protected para permitir override)
  // ============================================================

  protected getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    };
  }

  protected buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = `${this.baseUrl}${path}`;

    if (!params) return url;

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    }

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  protected async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      let errorMessage = 'Error desconocido';
      let errorData: any = null;

      try {
        const text = await res.text();

        // Intentar parsear como JSON
        try {
          errorData = JSON.parse(text);
          errorMessage = errorData.message || errorData.error || text;
        } catch {
          errorMessage = text;
        }

        // LOG COMPLETO EN CONSOLA (para debug)
        console.error('[VesselBaseClient] Error API:', {
          status: res.status,
          url: res.url,
          error: errorMessage,
          details: errorData,
          raw: text
        });

      } catch (e) {
        console.error('[VesselBaseClient] Error leyendo respuesta de error:', e);
      }

      throw new VesselApiError(res.status, errorMessage);
    }

    // Para DELETE sin body
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return undefined as T;
    }

    return res.json();
  }
}

// ============================================================
// ERROR CLASS
// ============================================================

export class VesselApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(`Error ${statusCode}: ${message}`);
    this.name = 'VesselApiError';
  }

  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  get isServerError(): boolean {
    return this.statusCode >= 500;
  }
}

// ============================================================
// TYPES
// ============================================================

export interface ApiListResponse<T> {
  data: T[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
    total_pages?: number;
    last_page?: number;
  };
}

/** Extrae data de una respuesta que puede ser array o {data: []} */
export function extractData<T>(response: ApiListResponse<T> | T[]): T[] {
  return Array.isArray(response) ? response : (response.data || []);
}

/** Extrae meta de una respuesta */
export function extractMeta(response: ApiListResponse<unknown> | unknown[]): ApiListResponse<unknown>['meta'] {
  return Array.isArray(response) ? undefined : response.meta;
}

// ============================================================
// CONFIG
// ============================================================

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_VESSEL_API_URL || 'http://127.0.0.1:8000';

let _globalBaseUrl = DEFAULT_BASE_URL;

export function setVesselBaseUrl(url: string): void {
  _globalBaseUrl = url;
}

export function getVesselBaseUrl(): string {
  return _globalBaseUrl;
}
