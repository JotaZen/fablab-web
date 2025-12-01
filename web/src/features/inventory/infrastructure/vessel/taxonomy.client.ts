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
import { VesselBaseClient, type ApiListResponse } from './base.client';

interface ApiPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}

export class TaxonomyClient extends VesselBaseClient implements TaxonomyPort {
  private adapter: 'local' | 'sql';

  constructor(baseUrl?: string, adapter: 'local' | 'sql' = 'local') {
    super(baseUrl);
    this.adapter = adapter;
  }

  protected override getHeaders(): HeadersInit {
    const headers = super.getHeaders();
    if (this.adapter === 'local') {
      (headers as Record<string, string>)['X-TAXONOMY-ADAPTER'] = 'local';
    }
    return headers;
  }

  // === VOCABULARIOS ===

  async listarVocabularios(filtros?: FiltrosVocabularios): Promise<PaginatedResponse<Vocabulario>> {
    const params = new URLSearchParams();
    if (filtros?.busqueda) params.set('search', filtros.busqueda);
    if (filtros?.pagina) params.set('page', String(filtros.pagina));
    if (filtros?.porPagina) params.set('per_page', String(filtros.porPagina));

    const queryString = params.toString() ? `?${params}` : '';
    const response = await this.get<ApiPaginatedResponse<ApiVocabulary>>(`/taxonomy/vocabularies/read${queryString}`);
    
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
      const data = await this.get<ApiVocabulary>(`/taxonomy/vocabularies/show/${id}`);
      return apiToVocabulario(data);
    } catch {
      return null;
    }
  }

  async crearVocabulario(data: Omit<Vocabulario, 'id'>): Promise<Vocabulario> {
    const response = await this.post<ApiVocabulary | { data: ApiVocabulary }>(
      '/taxonomy/vocabularies/create',
      vocabularioToApi(data)
    );
    const apiData = 'data' in response ? response.data : response;
    return apiToVocabulario(apiData);
  }

  async actualizarVocabulario(id: string, data: Partial<Vocabulario>): Promise<Vocabulario> {
    const apiData = await this.put<ApiVocabulary>(
      `/taxonomy/vocabularies/update/${id}`,
      vocabularioToApi(data)
    );
    return apiToVocabulario(apiData);
  }

  async eliminarVocabulario(id: string): Promise<void> {
    await this.delete(`/taxonomy/vocabularies/delete/${id}`);
  }

  // === TÉRMINOS ===

  async listarTerminos(filtros?: FiltrosTerminos): Promise<PaginatedResponse<Termino>> {
    const params = new URLSearchParams();
    if (filtros?.vocabularioId) params.set('vocabulary_id', filtros.vocabularioId);
    if (filtros?.padreId) params.set('parent_id', filtros.padreId);
    if (filtros?.busqueda) params.set('search', filtros.busqueda);
    if (filtros?.pagina) params.set('page', String(filtros.pagina));
    if (filtros?.porPagina) params.set('per_page', String(filtros.porPagina));

    const queryString = params.toString() ? `?${params}` : '';
    const response = await this.get<ApiPaginatedResponse<ApiTerm>>(`/taxonomy/terms/read${queryString}`);
    
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
      const data = await this.get<ApiTerm>(`/taxonomy/terms/show/${id}`);
      return apiToTermino(data);
    } catch {
      return null;
    }
  }

  async crearTermino(data: Omit<Termino, 'id'>): Promise<Termino> {
    const response = await this.post<ApiTerm | { data: ApiTerm }>(
      '/taxonomy/terms/create',
      terminoToApi(data)
    );
    const apiData = 'data' in response ? response.data : response;
    return apiToTermino(apiData);
  }

  async actualizarTermino(id: string, data: Partial<Termino>): Promise<Termino> {
    const apiData = await this.put<ApiTerm>(
      `/taxonomy/terms/update/${id}`,
      terminoToApi(data)
    );
    return apiToTermino(apiData);
  }

  async eliminarTermino(id: string): Promise<void> {
    await this.delete(`/taxonomy/terms/delete/${id}`);
  }

  // === ÁRBOL ===

  async obtenerArbol(vocabularioId: string): Promise<ArbolTermino[]> {
    const data = await this.get<ApiTermTree[]>(`/taxonomy/terms/tree?vocabulary_id=${vocabularioId}`);
    return data.map(apiToArbolTermino);
  }

  async obtenerBreadcrumb(terminoId: string): Promise<Breadcrumb[]> {
    const data = await this.get<ApiBreadcrumb[]>(`/taxonomy/terms/breadcrumb/${terminoId}`);
    return data.map(apiToBreadcrumb);
  }
}

// === FACTORY ===

let _taxonomyClient: TaxonomyClient | null = null;

export function getTaxonomyClient(): TaxonomyClient {
  if (!_taxonomyClient) {
    _taxonomyClient = new TaxonomyClient(undefined, 'local');
  }
  return _taxonomyClient;
}

export function resetTaxonomyClient(): void {
  _taxonomyClient = null;
}
