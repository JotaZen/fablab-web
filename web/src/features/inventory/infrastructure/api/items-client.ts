/**
 * Cliente de Items para la API de Vessel
 * 
 * Módulo: Items (Catálogo de productos)
 * Endpoints: /api/v1/items/...
 */

import type {
  Item,
  CrearItemDTO,
  ActualizarItemDTO,
  FiltrosItem,
  EstadoItem,
} from '../../domain/entities';

// ============================================================
// TIPOS API (snake_case)
// ============================================================

interface ApiItem {
  id: string;
  name: string;
  description?: string;
  uom_id?: string;
  notes?: string;
  status: string;
  term_ids?: string[];
  created_at?: string;
  updated_at?: string;
}

interface ApiCreateItem {
  name: string;
  description?: string;
  uom_id?: string;
  notes?: string;
  status?: string;
  term_ids?: string[];
}

interface ApiListResponse<T> {
  data: T[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}

// ============================================================
// ADAPTERS
// ============================================================

/** Genera un código único basado en timestamp */
function generarCodigo(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ITEM-${timestamp.slice(-4)}${random}`;
}

/** Convierte API response a entidad de dominio */
function apiToItem(api: ApiItem): Item {
  // El ID puede venir como string o como objeto, manejar ambos casos
  const itemId = typeof api.id === 'string' ? api.id : String(api.id || '');
  const codigo = itemId ? itemId.substring(0, 8).toUpperCase() : generarCodigo();
  
  return {
    id: itemId,
    codigo,
    nombre: api.name || 'Sin nombre',
    descripcion: api.description,
    uomId: api.uom_id,
    notas: api.notes,
    estado: (api.status || 'active') as EstadoItem,
    terminoIds: api.term_ids,
    creadoEn: api.created_at || new Date().toISOString(),
    actualizadoEn: api.updated_at || new Date().toISOString(),
  };
}

/** Convierte DTO a formato API */
function itemToApi(dto: CrearItemDTO): ApiCreateItem {
  return {
    name: dto.nombre,
    description: dto.descripcion,
    uom_id: dto.uomId,
    notes: dto.notas,
    status: dto.estado || 'active',
    term_ids: dto.terminoIds,
  };
}

// ============================================================
// CLIENT CONFIG
// ============================================================

export interface ItemsClientConfig {
  baseUrl: string;
}

// ============================================================
// ITEMS CLIENT
// ============================================================

export class ItemsClient {
  private baseUrl: string;

  constructor(config: ItemsClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const error = await res.text().catch(() => 'Error desconocido');
      throw new Error(`Error ${res.status}: ${error}`);
    }
    return res.json();
  }

  // ============================================================
  // CRUD ITEMS
  // ============================================================

  /** Lista todos los items con filtros opcionales */
  async listar(filtros?: FiltrosItem): Promise<{ items: Item[]; total: number }> {
    const params = new URLSearchParams();
    if (filtros?.estado) params.set('status', filtros.estado);
    if (filtros?.busqueda) params.set('search', filtros.busqueda);
    if (filtros?.pagina) params.set('page', String(filtros.pagina));
    if (filtros?.porPagina) params.set('per_page', String(filtros.porPagina));

    const queryString = params.toString();
    const url = `${this.baseUrl}/v1/items/read${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, { headers: this.getHeaders() });
    const response = await this.handleResponse<ApiListResponse<ApiItem> | ApiItem[]>(res);
    
    // La API puede devolver {data: [...]} o directamente [...]
    const data = Array.isArray(response) ? response : (response.data || []);
    const meta = !Array.isArray(response) ? response.meta : undefined;
    
    return {
      items: data.filter(item => item && item.id).map(apiToItem),
      total: meta?.total || data.length,
    };
  }

  /** Obtiene un item por ID */
  async obtener(id: string): Promise<Item | null> {
    try {
      const url = `${this.baseUrl}/v1/items/show/${id}`;
      const res = await fetch(url, { headers: this.getHeaders() });
      const data = await this.handleResponse<ApiItem>(res);
      return apiToItem(data);
    } catch {
      return null;
    }
  }

  /** Crea un nuevo item */
  async crear(data: CrearItemDTO): Promise<Item> {
    const url = `${this.baseUrl}/v1/items/create`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(itemToApi(data)),
    });
    const response = await this.handleResponse<ApiItem>(res);
    return apiToItem(response);
  }

  /** Actualiza un item existente */
  async actualizar(id: string, data: ActualizarItemDTO): Promise<Item> {
    const url = `${this.baseUrl}/v1/items/update/${id}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(itemToApi(data as CrearItemDTO)),
    });
    const response = await this.handleResponse<ApiItem>(res);
    return apiToItem(response);
  }

  /** Elimina un item */
  async eliminar(id: string): Promise<void> {
    const url = `${this.baseUrl}/v1/items/delete/${id}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error('Error al eliminar item');
    }
  }

  // ============================================================
  // HELPERS
  // ============================================================

  /** Lista solo items activos */
  async listarActivos(): Promise<Item[]> {
    const { items } = await this.listar({ estado: 'active' });
    return items;
  }

  /** Busca items por nombre */
  async buscar(termino: string): Promise<Item[]> {
    const { items } = await this.listar({ busqueda: termino });
    return items;
  }
}

// ============================================================
// FACTORY (Singleton)
// ============================================================

let _itemsClient: ItemsClient | null = null;

export function getItemsClient(config?: Partial<ItemsClientConfig>): ItemsClient {
  if (!_itemsClient) {
    _itemsClient = new ItemsClient({
      baseUrl: config?.baseUrl || '/api/vessel',
    });
  }
  return _itemsClient;
}

export function createItemsClient(config: ItemsClientConfig): ItemsClient {
  return new ItemsClient(config);
}

export function resetItemsClient(): void {
  _itemsClient = null;
}
