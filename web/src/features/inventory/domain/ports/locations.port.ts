/**
 * Locations Port - Interface para repositorio de ubicaciones
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
  Locacion,
  LocacionConHijos,
  CrearLocacionDTO,
  ActualizarLocacionDTO,
} from '../entities/location';
import type { PaginatedResult } from '../entities/pagination';

/** Puerto para gestión de ubicaciones (Location/Venue) */
export interface LocationsPort {
  // === LOCATIONS ===
  getLocations(filters?: LocationFilters): Promise<PaginatedResult<Location>>;
  getLocationById(id: string): Promise<Location | null>;
  createLocation(data: CreateLocationDTO): Promise<Location>;
  updateLocation(id: string, data: UpdateLocationDTO): Promise<Location>;
  deleteLocation(id: string): Promise<void>;
  
  // === VENUES ===
  getVenues(filters?: VenueFilters): Promise<PaginatedResult<Venue>>;
  getVenuesByLocation(locationId: string): Promise<Venue[]>;
  getVenueById(id: string): Promise<Venue | null>;
  createVenue(data: CreateVenueDTO): Promise<Venue>;
  updateVenue(id: string, data: UpdateVenueDTO): Promise<Venue>;
  deleteVenue(id: string): Promise<void>;
}

/** Puerto para gestión de locaciones Vessel */
export interface LocacionesPort {
  listar(): Promise<Locacion[]>;
  obtener(id: string): Promise<Locacion | null>;
  crear(dto: CrearLocacionDTO): Promise<Locacion>;
  actualizar(id: string, dto: ActualizarLocacionDTO): Promise<Locacion>;
  eliminar(id: string): Promise<void>;
  
  // Consultas especiales
  listarLocaciones(): Promise<Locacion[]>;
  listarUnidades(): Promise<Locacion[]>;
  obtenerHijos(padreId: string): Promise<Locacion[]>;
  obtenerArbol(): Promise<LocacionConHijos[]>;
  obtenerRuta(id: string): Promise<Locacion[]>;
}
