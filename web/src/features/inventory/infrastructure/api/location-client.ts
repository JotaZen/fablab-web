/**
 * Cliente de Locations para la API de Vessel
 * 
 * Usa el módulo LOCATIONS de Vessel (NO taxonomy)
 * Endpoints: /api/v1/locations/...
 */

import type {
  Location,
  Venue,
  CreateLocationDTO,
  UpdateLocationDTO,
  CreateVenueDTO,
  UpdateVenueDTO,
  LocationFilters,
  VenueFilters,
  LocationType,
  VenueType,
} from '../../domain/entities';

// ============================================================
// TIPOS API
// ============================================================

interface ApiLocation {
  id: string;
  name: string;
  code: string;
  type: string;
  address?: string;
  description?: string;
  status: string;
  lat?: number;
  lng?: number;
  created_at?: string;
  updated_at?: string;
}

interface ApiVenue {
  id: string;
  name: string;
  code: string;
  type: string;
  location_id: string;
  description?: string;
  capacity?: number;
  manager_id?: string;
  manager_name?: string;
  status: string;
  floor?: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiCreateLocation {
  name: string;
  code?: string;
  type: string;
  address?: string;
  description?: string;
  status?: string;
  lat?: number;
  lng?: number;
}

interface ApiCreateVenue {
  name: string;
  code?: string;
  type: string;
  location_id: string;
  description?: string;
  capacity?: number;
  manager_id?: string;
  status?: string;
  floor?: string;
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

function apiToLocation(api: ApiLocation): Location {
  return {
    id: api.id,
    name: api.name,
    code: api.code,
    type: api.type as LocationType,
    address: api.address,
    description: api.description,
    status: api.status as 'active' | 'inactive',
    coordinates: api.lat && api.lng ? { lat: api.lat, lng: api.lng } : undefined,
    createdAt: api.created_at || new Date().toISOString(),
    updatedAt: api.updated_at || new Date().toISOString(),
  };
}

function locationToApi(dto: CreateLocationDTO): ApiCreateLocation {
  return {
    name: dto.name,
    code: dto.code,
    type: dto.type,
    address: dto.address,
    description: dto.description,
    status: dto.status,
    lat: dto.coordinates?.lat,
    lng: dto.coordinates?.lng,
  };
}

function apiToVenue(api: ApiVenue): Venue {
  return {
    id: api.id,
    name: api.name,
    code: api.code,
    type: api.type as VenueType,
    locationId: api.location_id,
    description: api.description,
    capacity: api.capacity,
    managerId: api.manager_id,
    managerName: api.manager_name,
    status: api.status as 'active' | 'inactive' | 'maintenance',
    floor: api.floor,
    createdAt: api.created_at || new Date().toISOString(),
    updatedAt: api.updated_at || new Date().toISOString(),
  };
}

function venueToApi(dto: CreateVenueDTO): ApiCreateVenue {
  return {
    name: dto.name,
    code: dto.code,
    type: dto.type,
    location_id: dto.locationId,
    description: dto.description,
    capacity: dto.capacity,
    manager_id: dto.managerId,
    status: dto.status,
    floor: dto.floor,
  };
}

// ============================================================
// CLIENT CONFIG
// ============================================================

export interface LocationClientConfig {
  baseUrl: string;
}

// ============================================================
// LOCATION CLIENT
// ============================================================

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
  // LOCATIONS (SEDES)
  // ============================================================

  /** Lista todas las sedes */
  async getLocations(filters?: LocationFilters): Promise<Location[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.set('type', filters.type);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);

    const queryString = params.toString();
    const url = `${this.baseUrl}/v1/locations/read${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, { headers: this.getHeaders() });
    const response = await this.handleResponse<ApiListResponse<ApiLocation> | ApiLocation[]>(res);
    
    const data = Array.isArray(response) ? response : response.data;
    return data.map(apiToLocation);
  }

  /** Obtiene una sede por ID */
  async getLocationById(id: string): Promise<Location | null> {
    try {
      const url = `${this.baseUrl}/v1/locations/show/${id}`;
      const res = await fetch(url, { headers: this.getHeaders() });
      const data = await this.handleResponse<ApiLocation>(res);
      return apiToLocation(data);
    } catch {
      return null;
    }
  }

  /** Crea una nueva sede */
  async createLocation(data: CreateLocationDTO): Promise<Location> {
    const url = `${this.baseUrl}/v1/locations/create`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(locationToApi(data)),
    });
    const response = await this.handleResponse<ApiLocation>(res);
    return apiToLocation(response);
  }

  /** Actualiza una sede */
  async updateLocation(id: string, data: UpdateLocationDTO): Promise<Location> {
    const url = `${this.baseUrl}/v1/locations/update/${id}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(locationToApi(data as CreateLocationDTO)),
    });
    const response = await this.handleResponse<ApiLocation>(res);
    return apiToLocation(response);
  }

  /** Elimina una sede */
  async deleteLocation(id: string): Promise<void> {
    const url = `${this.baseUrl}/v1/locations/delete/${id}`;
    await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
  }

  // ============================================================
  // VENUES (RECINTOS)
  // ============================================================

  /** Lista todos los recintos */
  async getVenues(filters?: VenueFilters): Promise<Venue[]> {
    const params = new URLSearchParams();
    if (filters?.locationId) params.set('location_id', filters.locationId);
    if (filters?.type) params.set('type', filters.type);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);

    const queryString = params.toString();
    const url = `${this.baseUrl}/v1/venues/read${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, { headers: this.getHeaders() });
    const response = await this.handleResponse<ApiListResponse<ApiVenue> | ApiVenue[]>(res);
    
    const data = Array.isArray(response) ? response : response.data;
    return data.map(apiToVenue);
  }

  /** Obtiene recintos de una sede */
  async getVenuesByLocation(locationId: string): Promise<Venue[]> {
    return this.getVenues({ locationId });
  }

  /** Obtiene un recinto por ID */
  async getVenueById(id: string): Promise<Venue | null> {
    try {
      const url = `${this.baseUrl}/v1/venues/show/${id}`;
      const res = await fetch(url, { headers: this.getHeaders() });
      const data = await this.handleResponse<ApiVenue>(res);
      return apiToVenue(data);
    } catch {
      return null;
    }
  }

  /** Crea un nuevo recinto */
  async createVenue(data: CreateVenueDTO): Promise<Venue> {
    const url = `${this.baseUrl}/v1/venues/create`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(venueToApi(data)),
    });
    const response = await this.handleResponse<ApiVenue>(res);
    return apiToVenue(response);
  }

  /** Actualiza un recinto */
  async updateVenue(id: string, data: UpdateVenueDTO): Promise<Venue> {
    const url = `${this.baseUrl}/v1/venues/update/${id}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(venueToApi(data as CreateVenueDTO)),
    });
    const response = await this.handleResponse<ApiVenue>(res);
    return apiToVenue(response);
  }

  /** Elimina un recinto */
  async deleteVenue(id: string): Promise<void> {
    const url = `${this.baseUrl}/v1/venues/delete/${id}`;
    await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
  }

  // ============================================================
  // ÁRBOL DE UBICACIONES
  // ============================================================

  /** Obtiene el árbol completo de sedes y recintos */
  async getLocationTree(): Promise<Array<Location & { venues: Venue[] }>> {
    const [locations, venues] = await Promise.all([
      this.getLocations(),
      this.getVenues(),
    ]);

    return locations.map(location => ({
      ...location,
      venues: venues.filter(v => v.locationId === location.id),
    }));
  }
}

// ============================================================
// FACTORY
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
