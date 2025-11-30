/**
 * Cliente de Taxonomía para la API de Vessel
 * 
 * Maneja las peticiones HTTP y transforma los datos usando los adaptadores
 */

import type {
  Vocabulario,
  Termino,
  ArbolTermino,
  Breadcrumb,
  FiltrosTerminos,
  FiltrosVocabularios,
} from '../../domain/entities';

import type {
  ApiVocabulary,
  ApiTerm,
  ApiTermTree,
  ApiBreadcrumb,
} from './types';

import {
  apiToVocabulario,
  apiToVocabularios,
  apiToTermino,
  apiToTerminos,
  apiToArbolTermino,
  apiToBreadcrumb,
  vocabularioToApi,
  terminoToApi,
} from './adapters';

/** Opciones de configuración del cliente */
export interface TaxonomyClientConfig {
  baseUrl: string;
  adapter?: 'local' | 'sql';
}

/** Respuesta paginada de la API */
interface ApiPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}

/** Cliente de Taxonomía */
export class TaxonomyClient {
  private baseUrl: string;
  private adapter: 'local' | 'sql';

  constructor(config: TaxonomyClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.adapter = config.adapter ?? 'local';
  }

  /** Headers comunes para todas las peticiones */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.adapter === 'local') {
      headers['X-TAXONOMY-ADAPTER'] = 'local';
    }
    
    return headers;
  }

  /** Maneja errores de fetch */
  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const error = await res.text().catch(() => 'Error desconocido');
      throw new Error(`Error ${res.status}: ${error}`);
    }
    return res.json();
  }

  // ==================== VOCABULARIOS ====================

  /** Obtiene todos los vocabularios */
  async getVocabularios(filtros?: FiltrosVocabularios): Promise<Vocabulario[]> {
    const params = new URLSearchParams();
    if (filtros?.busqueda) params.set('search', filtros.busqueda);
    if (filtros?.pagina) params.set('page', String(filtros.pagina));
    if (filtros?.porPagina) params.set('per_page', String(filtros.porPagina));

    const url = `${this.baseUrl}/api/v1/taxonomy/vocabularies/read${params.toString() ? `?${params}` : ''}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    const response = await this.handleResponse<ApiPaginatedResponse<ApiVocabulary>>(res);
    return apiToVocabularios(response.data);
  }

  /** Obtiene un vocabulario por ID */
  async getVocabulario(id: string): Promise<Vocabulario> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/taxonomy/vocabularies/show/${id}`,
      { headers: this.getHeaders() }
    );
    const data = await this.handleResponse<ApiVocabulary>(res);
    return apiToVocabulario(data);
  }

  /** Crea un nuevo vocabulario */
  async createVocabulario(vocabulario: Omit<Vocabulario, 'id'>): Promise<Vocabulario> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/taxonomy/vocabularies/create`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(vocabularioToApi(vocabulario)),
      }
    );
    const response = await this.handleResponse<ApiVocabulary | { data: ApiVocabulary }>(res);
    // La API puede devolver { data: {...} } o directamente {...}
    const data = 'data' in response ? response.data : response;
    console.log('[TaxonomyClient] createVocabulario response:', { response, data });
    return apiToVocabulario(data);
  }

  /** Actualiza un vocabulario */
  async updateVocabulario(id: string, vocabulario: Partial<Vocabulario>): Promise<Vocabulario> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/taxonomy/vocabularies/update/${id}`,
      {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(vocabularioToApi(vocabulario)),
      }
    );
    const data = await this.handleResponse<ApiVocabulary>(res);
    return apiToVocabulario(data);
  }

  /** Elimina un vocabulario */
  async deleteVocabulario(id: string): Promise<void> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/taxonomy/vocabularies/delete/${id}`,
      {
        method: 'DELETE',
        headers: this.getHeaders(),
      }
    );
    if (!res.ok) throw new Error('Error al eliminar vocabulario');
  }

  // ==================== TÉRMINOS ====================

  /** Obtiene términos, opcionalmente filtrados */
  async getTerminos(filtros?: FiltrosTerminos): Promise<Termino[]> {
    const params = new URLSearchParams();
    if (filtros?.vocabularioId) params.set('vocabulary_id', filtros.vocabularioId);
    if (filtros?.padreId) params.set('parent_id', filtros.padreId);
    if (filtros?.busqueda) params.set('search', filtros.busqueda);
    if (filtros?.pagina) params.set('page', String(filtros.pagina));
    if (filtros?.porPagina) params.set('per_page', String(filtros.porPagina));

    const url = `${this.baseUrl}/api/v1/taxonomy/terms/read${params.toString() ? `?${params}` : ''}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    const response = await this.handleResponse<ApiPaginatedResponse<ApiTerm>>(res);
    return apiToTerminos(response.data);
  }

  /** Obtiene un término por ID */
  async getTermino(id: string): Promise<Termino> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/taxonomy/terms/show/${id}`,
      { headers: this.getHeaders() }
    );
    const data = await this.handleResponse<ApiTerm>(res);
    return apiToTermino(data);
  }

  /** Crea un nuevo término */
  async createTermino(termino: Omit<Termino, 'id'>): Promise<Termino> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/taxonomy/terms/create`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(terminoToApi(termino)),
      }
    );
    const response = await this.handleResponse<ApiTerm | { data: ApiTerm }>(res);
    // La API puede devolver { data: {...} } o directamente {...}
    const data = 'data' in response ? response.data : response;
    console.log('[TaxonomyClient] createTermino response:', { response, data });
    return apiToTermino(data);
  }

  /** Actualiza un término */
  async updateTermino(id: string, termino: Partial<Termino>): Promise<Termino> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/taxonomy/terms/update/${id}`,
      {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(terminoToApi(termino)),
      }
    );
    const data = await this.handleResponse<ApiTerm>(res);
    return apiToTermino(data);
  }

  /** Elimina un término */
  async deleteTermino(id: string): Promise<void> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/taxonomy/terms/delete/${id}`,
      {
        method: 'DELETE',
        headers: this.getHeaders(),
      }
    );
    if (!res.ok) throw new Error('Error al eliminar término');
  }

  /** Obtiene el árbol de términos */
  async getArbolTerminos(vocabularioId?: string, padreId?: string): Promise<ArbolTermino[]> {
    const params = new URLSearchParams();
    if (vocabularioId) params.set('vocabulary_id', vocabularioId);
    if (padreId) params.set('parent_id', padreId);

    const url = `${this.baseUrl}/api/v1/taxonomy/terms/tree${params.toString() ? `?${params}` : ''}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    const data = await this.handleResponse<ApiTermTree[]>(res);
    return data.map(apiToArbolTermino);
  }

  /** Obtiene el breadcrumb de un término */
  async getBreadcrumb(terminoId: string): Promise<Breadcrumb[]> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/taxonomy/terms/breadcrumb/${terminoId}`,
      { headers: this.getHeaders() }
    );
    const data = await this.handleResponse<ApiBreadcrumb[]>(res);
    return data.map(apiToBreadcrumb);
  }
}

/** Instancia singleton del cliente (configurable) */
let clientInstance: TaxonomyClient | null = null;

export function getTaxonomyClient(config?: TaxonomyClientConfig): TaxonomyClient {
  if (!clientInstance && config) {
    clientInstance = new TaxonomyClient(config);
  }
  if (!clientInstance) {
    clientInstance = new TaxonomyClient({
      baseUrl: process.env.NEXT_PUBLIC_VESSEL_API_URL || 'http://127.0.0.1:8000',
      adapter: 'local',
    });
  }
  return clientInstance;
}

export function resetTaxonomyClient(): void {
  clientInstance = null;
}
