/**
 * Location & Venue - Ubicaciones físicas
 */

// === TIPOS ===

export type LocationType = 'campus' | 'building' | 'external';
export type VenueType = 'laboratory' | 'warehouse' | 'workshop' | 'office' | 'storage' | 'other';
export type LocationStatus = 'active' | 'inactive' | 'maintenance';

// === ENTIDADES ===

/** Sede o base física (ej: Camptech) */
export interface Location {
  id: string;
  name: string;
  code: string;
  type: LocationType;
  address?: string;
  description?: string;
  status: LocationStatus;
  coordinates?: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
}

/** Recinto dentro de una Location (ej: Laboratorio) */
export interface Venue {
  id: string;
  name: string;
  code: string;
  type: VenueType;
  locationId: string;
  location?: Location;
  description?: string;
  capacity?: number;
  managerId?: string;
  managerName?: string;
  status: LocationStatus;
  floor?: string;
  createdAt: string;
  updatedAt: string;
}

// === Locación Vessel (simplificada) ===

export type TipoLocacion = 'warehouse' | 'storage_unit';

export interface Locacion {
  id: string;
  nombre: string;
  tipo: TipoLocacion;
  padreId?: string;
  addressId?: string;
  descripcion?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface LocacionConHijos extends Locacion {
  hijos: LocacionConHijos[];
}

// === DTOs ===

export interface CreateLocationDTO {
  name: string;
  code: string;
  type: LocationType;
  address?: string;
  description?: string;
  status?: LocationStatus;
  coordinates?: { lat: number; lng: number };
}

export type UpdateLocationDTO = Partial<CreateLocationDTO>;

export interface CreateVenueDTO {
  name: string;
  code: string;
  type: VenueType;
  locationId: string;
  description?: string;
  capacity?: number;
  managerId?: string;
  status?: LocationStatus;
  floor?: string;
}

export type UpdateVenueDTO = Partial<CreateVenueDTO>;

export interface CrearLocacionDTO {
  nombre: string;
  tipo: TipoLocacion;
  padreId?: string;
  addressId?: string;
  descripcion?: string;
}

export interface ActualizarLocacionDTO {
  nombre?: string;
  descripcion?: string;
  addressId?: string;
}

// === FILTROS ===

export interface LocationFilters {
  type?: LocationType;
  status?: LocationStatus;
  search?: string;
}

export interface VenueFilters {
  locationId?: string;
  type?: VenueType;
  status?: LocationStatus;
  search?: string;
}
