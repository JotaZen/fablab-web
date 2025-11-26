/**
 * Cliente de Locations para la API de Vessel
 * 
 * Maneja las peticiones HTTP para sedes (locations) y recintos (venues)
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
} from '../../domain/entities';

import type {
  ApiLocation,
  ApiVenue,
  ApiCreateLocation,
  ApiCreateVenue,
  ApiListResponse,
} from './types';

// ============================================================
// ADAPTERS - Transforman entre API (snake_case) y Domain (camelCase)
// ============================================================

function apiToLocation(api: ApiLocation): Location {
  return {
    id: api.id,
    name: api.name,
    code: api.code,
    type: api.type,
    address: api.address,
    description: api.description,
    status: api.status,
    coordinates: api.lat && api.lng ? { lat: api.lat, lng: api.lng } : undefined,
    createdAt: api.created_at || new Date().toISOString(),
    updatedAt: api.updated_at || new Date().toISOString(),
  };
}

function locationToApi(location: CreateLocationDTO): ApiCreateLocation {
  return {
    name: location.name,
    code: location.code,
    type: location.type,
    address: location.address,
    description: location.description,
    status: location.status,
    lat: location.coordinates?.lat,
    lng: location.coordinates?.lng,
  };
}

function apiToVenue(api: ApiVenue): Venue {
  return {
    id: api.id,
    name: api.name,
    code: api.code,
    type: api.type,
    locationId: api.location_id,
    description: api.description,
    capacity: api.capacity,
    managerId: api.manager_id,
    managerName: api.manager_name,
    status: api.status,
    floor: api.floor,
    createdAt: api.created_at || new Date().toISOString(),
    updatedAt: api.updated_at || new Date().toISOString(),
  };
}

function venueToApi(venue: CreateVenueDTO): ApiCreateVenue {
  return {
    name: venue.name,
    code: venue.code,
    type: venue.type,
    location_id: venue.locationId,
    description: venue.description,
    capacity: venue.capacity,
    manager_id: venue.managerId,
    status: venue.status,
    floor: venue.floor,
  };
}

// ============================================================
// CLIENT CONFIG
// ============================================================

export interface LocationClientConfig {
  baseUrl: string;
  adapter?: 'local' | 'sql';
}

// ============================================================
// LOCATION CLIENT
// ============================================================

export class LocationClient {
  private baseUrl: string;
  private adapter: 'local' | 'sql';

  constructor(config: LocationClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.adapter = config.adapter ?? 'local';
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.adapter === 'local') {
      headers['X-LOCATION-ADAPTER'] = 'local';
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
}

// ============================================================
// FACTORY
// ============================================================

let _locationClient: LocationClient | null = null;

export function getLocationClient(config?: Partial<LocationClientConfig>): LocationClient {
  if (!_locationClient) {
    _locationClient = new LocationClient({
      // Usar proxy de Next.js para evitar CORS
      baseUrl: config?.baseUrl || '/api/vessel',
      adapter: config?.adapter || 'local',
    });
  }
  return _locationClient;
}

export function createLocationClient(config: LocationClientConfig): LocationClient {
  return new LocationClient(config);
}
