/**
 * Hook para manejar Locations y Venues
 * 
 * Proporciona acceso al cliente de locations con manejo de estado
 */

"use client";

import { useState, useCallback, useEffect } from 'react';
import { 
  LocationClient, 
  getLocationClient,
  type LocationClientConfig 
} from '../infrastructure/api/location-client';
import type {
  Location,
  Venue,
  CreateLocationDTO,
  UpdateLocationDTO,
  CreateVenueDTO,
  UpdateVenueDTO,
  LocationFilters,
  VenueFilters,
} from '../domain/entities';

interface UseLocationsState {
  locations: Location[];
  venues: Venue[];
  loading: boolean;
  error: string | null;
}

interface UseLocationsReturn extends UseLocationsState {
  // Location operations
  fetchLocations: (filters?: LocationFilters) => Promise<void>;
  getLocation: (id: string) => Promise<Location | null>;
  createLocation: (data: CreateLocationDTO) => Promise<Location>;
  updateLocation: (id: string, data: UpdateLocationDTO) => Promise<Location>;
  deleteLocation: (id: string) => Promise<void>;
  
  // Venue operations
  fetchVenues: (filters?: VenueFilters) => Promise<void>;
  fetchVenuesByLocation: (locationId: string) => Promise<void>;
  getVenue: (id: string) => Promise<Venue | null>;
  createVenue: (data: CreateVenueDTO) => Promise<Venue>;
  updateVenue: (id: string, data: UpdateVenueDTO) => Promise<Venue>;
  deleteVenue: (id: string) => Promise<void>;
  
  // Utils
  clearError: () => void;
  refresh: () => Promise<void>;
}

export function useLocations(config?: Partial<LocationClientConfig>): UseLocationsReturn {
  const [state, setState] = useState<UseLocationsState>({
    locations: [],
    venues: [],
    loading: false,
    error: null,
  });

  const client = getLocationClient(config);

  const setLoading = (loading: boolean) => setState(s => ({ ...s, loading }));
  const setError = (error: string | null) => setState(s => ({ ...s, error, loading: false }));
  const clearError = () => setError(null);

  // ============================================================
  // LOCATIONS
  // ============================================================

  const fetchLocations = useCallback(async (filters?: LocationFilters) => {
    setLoading(true);
    try {
      const locations = await client.getLocations(filters);
      setState(s => ({ ...s, locations, loading: false, error: null }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar sedes');
    }
  }, [client]);

  const getLocation = useCallback(async (id: string): Promise<Location | null> => {
    try {
      return await client.getLocationById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener sede');
      return null;
    }
  }, [client]);

  const createLocation = useCallback(async (data: CreateLocationDTO): Promise<Location> => {
    setLoading(true);
    try {
      const location = await client.createLocation(data);
      setState(s => ({ 
        ...s, 
        locations: [...s.locations, location], 
        loading: false, 
        error: null 
      }));
      return location;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear sede');
      throw err;
    }
  }, [client]);

  const updateLocation = useCallback(async (id: string, data: UpdateLocationDTO): Promise<Location> => {
    setLoading(true);
    try {
      const location = await client.updateLocation(id, data);
      setState(s => ({
        ...s,
        locations: s.locations.map(l => l.id === id ? location : l),
        loading: false,
        error: null,
      }));
      return location;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar sede');
      throw err;
    }
  }, [client]);

  const deleteLocation = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await client.deleteLocation(id);
      setState(s => ({
        ...s,
        locations: s.locations.filter(l => l.id !== id),
        venues: s.venues.filter(v => v.locationId !== id),
        loading: false,
        error: null,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar sede');
      throw err;
    }
  }, [client]);

  // ============================================================
  // VENUES
  // ============================================================

  const fetchVenues = useCallback(async (filters?: VenueFilters) => {
    setLoading(true);
    try {
      const venues = await client.getVenues(filters);
      setState(s => ({ ...s, venues, loading: false, error: null }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar recintos');
    }
  }, [client]);

  const fetchVenuesByLocation = useCallback(async (locationId: string) => {
    setLoading(true);
    try {
      const venues = await client.getVenuesByLocation(locationId);
      setState(s => ({ ...s, venues, loading: false, error: null }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar recintos');
    }
  }, [client]);

  const getVenue = useCallback(async (id: string): Promise<Venue | null> => {
    try {
      return await client.getVenueById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener recinto');
      return null;
    }
  }, [client]);

  const createVenue = useCallback(async (data: CreateVenueDTO): Promise<Venue> => {
    setLoading(true);
    try {
      const venue = await client.createVenue(data);
      setState(s => ({ 
        ...s, 
        venues: [...s.venues, venue], 
        loading: false, 
        error: null 
      }));
      return venue;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear recinto');
      throw err;
    }
  }, [client]);

  const updateVenue = useCallback(async (id: string, data: UpdateVenueDTO): Promise<Venue> => {
    setLoading(true);
    try {
      const venue = await client.updateVenue(id, data);
      setState(s => ({
        ...s,
        venues: s.venues.map(v => v.id === id ? venue : v),
        loading: false,
        error: null,
      }));
      return venue;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar recinto');
      throw err;
    }
  }, [client]);

  const deleteVenue = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await client.deleteVenue(id);
      setState(s => ({
        ...s,
        venues: s.venues.filter(v => v.id !== id),
        loading: false,
        error: null,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar recinto');
      throw err;
    }
  }, [client]);

  // ============================================================
  // UTILS
  // ============================================================

  const refresh = useCallback(async () => {
    await Promise.all([fetchLocations(), fetchVenues()]);
  }, [fetchLocations, fetchVenues]);

  return {
    ...state,
    fetchLocations,
    getLocation,
    createLocation,
    updateLocation,
    deleteLocation,
    fetchVenues,
    fetchVenuesByLocation,
    getVenue,
    createVenue,
    updateVenue,
    deleteVenue,
    clearError,
    refresh,
  };
}
