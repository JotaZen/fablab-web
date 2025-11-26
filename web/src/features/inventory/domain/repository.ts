/**
 * ============================================================
 * INVENTORY REPOSITORY INTERFACE
 * ============================================================
 * 
 * Puerto/interfaz para el repositorio de inventario.
 * Define las operaciones disponibles sin importar la implementación.
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
} from './entities';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface InventoryRepository {
  // === LOCATIONS ===
  
  /** Lista todas las locations con filtros opcionales */
  getLocations(filters?: LocationFilters): Promise<PaginatedResult<Location>>;
  
  /** Obtiene una location por ID */
  getLocationById(id: string): Promise<Location | null>;
  
  /** Crea una nueva location */
  createLocation(data: CreateLocationDTO): Promise<Location>;
  
  /** Actualiza una location existente */
  updateLocation(id: string, data: UpdateLocationDTO): Promise<Location>;
  
  /** Elimina una location */
  deleteLocation(id: string): Promise<void>;
  
  // === VENUES ===
  
  /** Lista todos los venues con filtros opcionales */
  getVenues(filters?: VenueFilters): Promise<PaginatedResult<Venue>>;
  
  /** Obtiene venues de una location específica */
  getVenuesByLocation(locationId: string): Promise<Venue[]>;
  
  /** Obtiene un venue por ID */
  getVenueById(id: string): Promise<Venue | null>;
  
  /** Crea un nuevo venue */
  createVenue(data: CreateVenueDTO): Promise<Venue>;
  
  /** Actualiza un venue existente */
  updateVenue(id: string, data: UpdateVenueDTO): Promise<Venue>;
  
  /** Elimina un venue */
  deleteVenue(id: string): Promise<void>;
}
