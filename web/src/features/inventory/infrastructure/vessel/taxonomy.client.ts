/**
 * Vessel API - Taxonomy Client
 */

import type { 
  Vocabulario, 
  Termino, 
  ArbolTermino, 
  Breadcrumb,
  FiltrosTerminos,
  FiltrosVocabularios,
} from '../../domain/entities/taxonomy';
import type { PaginatedResponse } from '../../domain/entities/pagination';
import type { TaxonomyPort } from '../../domain/ports/taxonomy.port';
import type { ApiVocabulary, ApiTerm, ApiTermTree, ApiBreadcrumb } from './vessel.types';
import { 
  apiToVocabulario, 
  apiToTermino, 
  apiToArbolTermino, 
  apiToBreadcrumb,
  vocabularioToApi,
  terminoToApi,
} from './vessel.mappers';

export interface TaxonomyClientConfig {
  baseUrl: string;
  adapter?: 'local' | 'sql';
}

interface ApiPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}

export class TaxonomyClient implements TaxonomyPort {
  private baseUrl: string;
  private adapter: 'local' | 'sql';

  constructor(config: TaxonomyClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.adapter = config.adapter ?? 'local';
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (this.adapter === 'local') {
      headers['X-TAXONOMY-ADAPTER'] = 'local';
    }
    return headers;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const error = await res.text().catch(() => 'Error desconocido');
      throw new Error(`Error ${res.status}: ${error}`);
    }
    return res.json();
  }

  // === VOCABULARIOS ===

  async listarVocabularios(filtros?: FiltrosVocabularios): Promise<PaginatedResponse<Vocabulario>> {
    const params = new URLSearchParams();
    if (filtros?.busqueda) params.set('search', filtros.busqueda);
    if (filtros?.pagina) params.set('page', String(filtros.pagina));
    if (filtros?.porPagina) params.set('per_page', String(filtros.porPagina));

    const url = `${this.baseUrl}/api/v1/taxonomy/vocabularies/read${params.toString() ? `?${params}` : ''}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    const response = await this.handleResponse<ApiPaginatedResponse<ApiVocabulary>>(res);
    
    return {
      data: response.data.map(apiToVocabulario),
      total: response.meta.total,
      pagina: response.meta.page,
      porPagina: response.meta.per_page,
      totalPaginas: response.meta.last_page,
    };
  }

  async obtenerVocabulario(id: string): Promise<Vocabulario | null> {
    try {
      const res = await fetch(
        `${this.baseUrl}/api/v1/taxonomy/vocabularies/show/${id}`,
        { headers: this.getHeaders() }
      );
      const data = await this.handleResponse<ApiVocabulary>(res);
      return apiToVocabulario(data);
    } catch {
      return null;
    }
  }

  async crearVocabulario(data: Omit<Vocabulario, 'id'>): Promise<Vocabulario> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/taxonomy/vocabularies/create`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(vocabularioToApi(data)),
      }
    );
    const response = await this.handleResponse<ApiVocabulary | { data: ApiVocabulary }>(res);
    const apiData = 'data' in response ? response.data : response;
    return apiToVocabulario(apiData);
  }

  async actualizarVocabulario(id: string, data: Partial<Vocabulario>): Promise<Vocabulario> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/taxonomy/vocabularies/update/${id}`,
      {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(vocabularioToApi(data)),
      }
    );
    const apiData = await this.handleResponse<ApiVocabulary>(res);
    return apiToVocabulario(apiData);
  }

  async eliminarVocabulario(id: string): Promise<void> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/taxonomy/vocabularies/delete/${id}`,
      { method: 'DELETE', headers: this.getHeaders() }
    );
    if (!res.ok) throw new Error('Error al eliminar vocabulario');
  }

  // === TÉRMINOS ===

  async listarTerminos(filtros?: FiltrosTerminos): Promise<PaginatedResponse<Termino>> {
    const params = new URLSearchParams();
    if (filtros?.vocabularioId) params.set('vocabulary_id', filtros.vocabularioId);
    if (filtros?.padreId) params.set('parent_id', filtros.padreId);
    if (filtros?.busqueda) params.set('search', filtros.busqueda);
    if (filtros?.pagina) params.set('page', String(filtros.pagina));
    if (filtros?.porPagina) params.set('per_page', String(filtros.porPagina));

    const url = `${this.baseUrl}/api/v1/taxonomy/terms/read${params.toString() ? `?${params}` : ''}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    const response = await this.handleResponse<ApiPaginatedResponse<ApiTerm>>(res);
    
    return {
      data: response.data.map(apiToTermino),
      total: response.meta.total,
      pagina: response.meta.page,
      porPagina: response.meta.per_page,
      totalPaginas: response.meta.last_page,
    };
  }

  async obtenerTermino(id: string): Promise<Termino | null> {
    try {
      const res = await fetch(
        `${this.baseUrl}/api/v1/taxonomy/terms/show/${id}`,
        { headers: this.getHeaders() }
      );
      const data = await this.handleResponse<ApiTerm>(res);
      return apiToTermino(data);
    } catch {
      return null;
    }
  }

  async crearTermino(data: Omit<Termino, 'id'>): Promise<Termino> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/taxonomy/terms/create`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(terminoToApi(data)),
      }
    );
    const response = await this.handleResponse<ApiTerm | { data: ApiTerm }>(res);
    const apiData = 'data' in response ? response.data : response;
    return apiToTermino(apiData);
  }

  async actualizarTermino(id: string, data: Partial<Termino>): Promise<Termino> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/taxonomy/terms/update/${id}`,
      {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(terminoToApi(data)),
      }
    );
    const apiData = await this.handleResponse<ApiTerm>(res);
    return apiToTermino(apiData);
  }

  async eliminarTermino(id: string): Promise<void> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/taxonomy/terms/delete/${id}`,
      { method: 'DELETE', headers: this.getHeaders() }
    );
    if (!res.ok) throw new Error('Error al eliminar término');
  }

  // === ÁRBOL ===

  async obtenerArbol(vocabularioId: string): Promise<ArbolTermino[]> {
    const params = new URLSearchParams();
    params.set('vocabulary_id', vocabularioId);

    const url = `${this.baseUrl}/api/v1/taxonomy/terms/tree?${params}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    const data = await this.handleResponse<ApiTermTree[]>(res);
    return data.map(apiToArbolTermino);
  }

  async obtenerBreadcrumb(terminoId: string): Promise<Breadcrumb[]> {
    const res = await fetch(
      `${this.baseUrl}/api/v1/taxonomy/terms/breadcrumb/${terminoId}`,
      { headers: this.getHeaders() }
    );
    const data = await this.handleResponse<ApiBreadcrumb[]>(res);
    return data.map(apiToBreadcrumb);
  }
}

// === FACTORY ===

let _taxonomyClient: TaxonomyClient | null = null;

export function getTaxonomyClient(config?: Partial<TaxonomyClientConfig>): TaxonomyClient {
  if (!_taxonomyClient) {
    _taxonomyClient = new TaxonomyClient({
      baseUrl: config?.baseUrl || process.env.NEXT_PUBLIC_VESSEL_API_URL || 'http://127.0.0.1:8000',
      adapter: 'local',
    });
  }
  return _taxonomyClient;
}

export function resetTaxonomyClient(): void {
  _taxonomyClient = null;
}
