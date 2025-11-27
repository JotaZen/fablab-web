/**
 * Cliente de Locations para la API de Vessel
 * 
 * Estructura jerárquica:
 * - Location (type: warehouse) = Locación/Bodega - puede tener hijos
 * - Location (type: storage_unit) = Unidad de almacenamiento - NO puede tener hijos
 * 
 * Ejemplo:
 *   Camptech (warehouse)
 *     └── Laboratorio FabLab (warehouse)
 *           └── Estante A (storage_unit)
 * 
 * Endpoints: /api/v1/locations/...
 */

// ============================================================
// TIPOS DE DOMINIO
// ============================================================

/** Tipos de locación según Vessel */
export type TipoLocacion = 'warehouse' | 'storage_unit';

/** Labels amigables para el usuario */
export const TIPO_LOCACION_LABELS: Record<TipoLocacion, string> = {
  warehouse: 'Locación',
  storage_unit: 'Unidad de Almacenamiento',
};

/** Una locación en el sistema */
export interface Locacion {
  id: string;
  nombre: string;
  tipo: TipoLocacion;
  padreId?: string;        // ID de la locación padre
  addressId?: string;      // ID de dirección (opcional)
  descripcion?: string;
  creadoEn: string;
  actualizadoEn: string;
}

/** Locación con sus hijos (árbol) */
export interface LocacionConHijos extends Locacion {
  hijos: LocacionConHijos[];
}

/** DTO para crear locación */
export interface CrearLocacionDTO {
  nombre: string;
  tipo: TipoLocacion;
  padreId?: string;
  addressId?: string;
  descripcion?: string;
}

/** DTO para actualizar locación */
export interface ActualizarLocacionDTO {
  nombre?: string;
  descripcion?: string;
  addressId?: string;
}

// ============================================================
// TIPOS API (snake_case)
// ============================================================

interface ApiLocation {
  id: string;
  name: string;
  type: string;
  parent_id?: string | null;
  address_id?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface ApiCreateLocation {
  name: string;
  type: string;
  parent_id?: string | null;
  address_id?: string | null;
  description?: string | null;
}

interface ApiListResponse<T> {
  success?: boolean;
  data: T[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
  };
}

// ============================================================
// ADAPTERS
// ============================================================

function apiToLocacion(api: ApiLocation): Locacion {
  return {
    id: api.id,
    nombre: api.name,
    tipo: (api.type as TipoLocacion) || 'warehouse',
    padreId: api.parent_id || undefined,
    addressId: api.address_id || undefined,
    descripcion: api.description || undefined,
    creadoEn: api.created_at || new Date().toISOString(),
    actualizadoEn: api.updated_at || new Date().toISOString(),
  };
}

function locacionToApi(dto: CrearLocacionDTO): ApiCreateLocation {
  return {
    name: dto.nombre,
    type: dto.tipo,
    parent_id: dto.padreId || null,
    address_id: dto.addressId || null,
    description: dto.descripcion || null,
  };
}

/** Construye árbol de locaciones */
function construirArbol(locaciones: Locacion[], padreId?: string): LocacionConHijos[] {
  return locaciones
    .filter(loc => loc.padreId === padreId)
    .map(loc => ({
      ...loc,
      hijos: loc.tipo === 'warehouse' 
        ? construirArbol(locaciones, loc.id)  // Solo warehouse puede tener hijos
        : [],  // storage_unit no tiene hijos
    }));
}

// ============================================================
// CLIENT
// ============================================================

export interface LocationClientConfig {
  baseUrl: string;
}

export class LocationClient {
  private baseUrl: string;

  constructor(config: LocationClientConfig) {
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
  // CRUD
  // ============================================================

  /** Lista todas las locaciones */
  async listar(): Promise<Locacion[]> {
    const url = `${this.baseUrl}/v1/locations/read`;
    const res = await fetch(url, { headers: this.getHeaders() });
    const response = await this.handleResponse<ApiListResponse<ApiLocation> | ApiLocation[]>(res);
    
    const data = Array.isArray(response) 
      ? response 
      : (response.data || []);
    
    return data.map(apiToLocacion);
  }

  /** Obtiene una locación por ID */
  async obtener(id: string): Promise<Locacion | null> {
    try {
      const url = `${this.baseUrl}/v1/locations/show/${id}`;
      const res = await fetch(url, { headers: this.getHeaders() });
      const response = await this.handleResponse<{ data: ApiLocation } | ApiLocation>(res);
      const data = 'data' in response ? response.data : response;
      return apiToLocacion(data);
    } catch {
      return null;
    }
  }

  /** Crea una nueva locación */
  async crear(dto: CrearLocacionDTO): Promise<Locacion> {
    // Validar que storage_unit no sea padre
    if (dto.padreId) {
      const padre = await this.obtener(dto.padreId);
      if (padre && padre.tipo === 'storage_unit') {
        throw new Error('Una unidad de almacenamiento no puede tener hijos');
      }
    }

    const url = `${this.baseUrl}/v1/locations/create`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(locacionToApi(dto)),
    });
    const response = await this.handleResponse<{ data: ApiLocation } | ApiLocation>(res);
    const data = 'data' in response ? response.data : response;
    return apiToLocacion(data);
  }

  /** Actualiza una locación */
  async actualizar(id: string, dto: ActualizarLocacionDTO): Promise<Locacion> {
    const url = `${this.baseUrl}/v1/locations/update/${id}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({
        name: dto.nombre,
        description: dto.descripcion,
        address_id: dto.addressId,
      }),
    });
    const response = await this.handleResponse<{ data: ApiLocation } | ApiLocation>(res);
    const data = 'data' in response ? response.data : response;
    return apiToLocacion(data);
  }

  /** Elimina una locación */
  async eliminar(id: string): Promise<void> {
    const url = `${this.baseUrl}/v1/locations/delete/${id}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error('Error al eliminar locación');
    }
  }

  // ============================================================
  // CONSULTAS ESPECIALES
  // ============================================================

  /** Lista solo locaciones (tipo warehouse) */
  async listarLocaciones(): Promise<Locacion[]> {
    const todas = await this.listar();
    return todas.filter(loc => loc.tipo === 'warehouse');
  }

  /** Lista solo unidades de almacenamiento */
  async listarUnidades(): Promise<Locacion[]> {
    const todas = await this.listar();
    return todas.filter(loc => loc.tipo === 'storage_unit');
  }

  /** Obtiene hijos de una locación */
  async obtenerHijos(padreId: string): Promise<Locacion[]> {
    const todas = await this.listar();
    return todas.filter(loc => loc.padreId === padreId);
  }

  /** Obtiene el árbol completo de locaciones */
  async obtenerArbol(): Promise<LocacionConHijos[]> {
    const todas = await this.listar();
    return construirArbol(todas, undefined);
  }

  /** Obtiene la ruta/breadcrumb de una locación */
  async obtenerRuta(id: string): Promise<Locacion[]> {
    const todas = await this.listar();
    const ruta: Locacion[] = [];
    
    let actual = todas.find(loc => loc.id === id);
    while (actual) {
      ruta.unshift(actual);
      actual = actual.padreId 
        ? todas.find(loc => loc.id === actual!.padreId)
        : undefined;
    }
    
    return ruta;
  }
}

// ============================================================
// FACTORY (Singleton)
// ============================================================

let _locationClient: LocationClient | null = null;

export function getLocationClient(config?: Partial<LocationClientConfig>): LocationClient {
  if (!_locationClient) {
    _locationClient = new LocationClient({
      baseUrl: config?.baseUrl || '/api/vessel',
    });
  }
  return _locationClient;
}

export function createLocationClient(config: LocationClientConfig): LocationClient {
  return new LocationClient(config);
}

export function resetLocationClient(): void {
  _locationClient = null;
}
