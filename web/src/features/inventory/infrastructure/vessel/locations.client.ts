/**
 * Vessel API - Locations Client
 */

import type { 
  Locacion, 
  LocacionConHijos, 
  CrearLocacionDTO, 
  ActualizarLocacionDTO,
  TipoLocacion,
} from '../../domain/entities/location';
import type { LocacionesPort } from '../../domain/ports/locations.port';
import type { ApiLocation, ApiListResponse } from './vessel.types';
import { apiToLocacion } from './vessel.mappers';

export interface LocationClientConfig {
  baseUrl: string;
}

/** Construye árbol de locaciones */
function construirArbol(locaciones: Locacion[], padreId?: string): LocacionConHijos[] {
  return locaciones
    .filter(loc => loc.padreId === padreId)
    .map(loc => ({
      ...loc,
      hijos: loc.tipo === 'warehouse' 
        ? construirArbol(locaciones, loc.id)
        : [],
    }));
}

export class LocationClient implements LocacionesPort {
  private baseUrl: string;

  constructor(config: LocationClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
  }

  private getHeaders(): HeadersInit {
    return { 'Content-Type': 'application/json' };
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const error = await res.text().catch(() => 'Error desconocido');
      throw new Error(`Error ${res.status}: ${error}`);
    }
    return res.json();
  }

  async listar(): Promise<Locacion[]> {
    const url = `${this.baseUrl}/v1/locations/read`;
    const res = await fetch(url, { headers: this.getHeaders() });
    const response = await this.handleResponse<ApiListResponse<ApiLocation> | ApiLocation[]>(res);
    
    const data = Array.isArray(response) ? response : (response.data || []);
    return data.map(apiToLocacion);
  }

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
      body: JSON.stringify({
        name: dto.nombre,
        type: dto.tipo,
        parent_id: dto.padreId || null,
        address_id: dto.addressId || null,
        description: dto.descripcion || null,
      }),
    });
    const response = await this.handleResponse<{ data: ApiLocation } | ApiLocation>(res);
    const data = 'data' in response ? response.data : response;
    return apiToLocacion(data);
  }

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

  async eliminar(id: string): Promise<void> {
    const url = `${this.baseUrl}/v1/locations/delete/${id}`;
    const res = await fetch(url, { method: 'DELETE', headers: this.getHeaders() });
    if (!res.ok) throw new Error('Error al eliminar locación');
  }

  async listarLocaciones(): Promise<Locacion[]> {
    const todas = await this.listar();
    return todas.filter(loc => loc.tipo === 'warehouse');
  }

  async listarUnidades(): Promise<Locacion[]> {
    const todas = await this.listar();
    return todas.filter(loc => loc.tipo === 'storage_unit');
  }

  async obtenerHijos(padreId: string): Promise<Locacion[]> {
    const todas = await this.listar();
    return todas.filter(loc => loc.padreId === padreId);
  }

  async obtenerArbol(): Promise<LocacionConHijos[]> {
    const todas = await this.listar();
    return construirArbol(todas, undefined);
  }

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

// === FACTORY ===

let _locationClient: LocationClient | null = null;

export function getLocationClient(config?: Partial<LocationClientConfig>): LocationClient {
  if (!_locationClient) {
    _locationClient = new LocationClient({ baseUrl: config?.baseUrl || '/api/vessel' });
  }
  return _locationClient;
}

export function resetLocationClient(): void {
  _locationClient = null;
}
