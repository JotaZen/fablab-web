/**
 * Hook para manejar Locaciones (estructura jerárquica)
 * 
 * Tipos de locaciones:
 * - warehouse: Locación/Bodega (puede tener hijos)
 * - storage_unit: Unidad de Almacenamiento (sin hijos)
 */

"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { getLocationClient } from '../../infrastructure/vessel/locations.client';
import type {
  Locacion,
  LocacionConHijos,
  CrearLocacionDTO,
  ActualizarLocacionDTO,
  TipoLocacion,
} from '../../domain/entities/location';

// Re-exportar tipos
export type {
  Locacion,
  LocacionConHijos,
  CrearLocacionDTO,
  ActualizarLocacionDTO,
  TipoLocacion,
};

interface UseLocationsState {
  /** Todas las locaciones */
  locaciones: Locacion[];
  
  /** Solo locaciones tipo warehouse */
  warehouses: Locacion[];
  
  /** Solo unidades de almacenamiento */
  unidades: Locacion[];
  
  /** Árbol jerárquico */
  arbol: LocacionConHijos[];
  
  loading: boolean;
  error: string | null;
}

interface UseLocationsReturn extends UseLocationsState {
  // CRUD
  fetchLocaciones: () => Promise<void>;
  getLocacion: (id: string) => Promise<Locacion | null>;
  crearLocacion: (data: CrearLocacionDTO) => Promise<Locacion>;
  actualizarLocacion: (id: string, data: ActualizarLocacionDTO) => Promise<Locacion>;
  eliminarLocacion: (id: string) => Promise<void>;
  
  // Consultas
  getHijos: (padreId: string) => Promise<Locacion[]>;
  getRuta: (id: string) => Promise<Locacion[]>;
  
  // Helpers
  getUnidadesPorLocacion: (locacionId: string) => Locacion[];
  
  // Utils
  clearError: () => void;
}

export function useLocations(): UseLocationsReturn {
  const [state, setState] = useState<UseLocationsState>({
    locaciones: [],
    warehouses: [],
    unidades: [],
    arbol: [],
    loading: false,
    error: null,
  });

  const client = getLocationClient();

  const setLoading = (loading: boolean) => setState(s => ({ ...s, loading }));
  const setError = (error: string | null) => setState(s => ({ ...s, error, loading: false }));
  const clearError = () => setError(null);

  // ============================================================
  // FETCH
  // ============================================================

  const fetchLocaciones = useCallback(async () => {
    setLoading(true);
    try {
      const [locaciones, arbol] = await Promise.all([
        client.listar(),
        client.obtenerArbol(),
      ]);
      
      setState(s => ({
        ...s,
        locaciones,
        warehouses: locaciones.filter(l => l.tipo === 'warehouse'),
        unidades: locaciones.filter(l => l.tipo === 'storage_unit'),
        arbol,
        loading: false,
        error: null,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar locaciones');
    }
  }, [client]);

  // ============================================================
  // CRUD
  // ============================================================

  const getLocacion = useCallback(async (id: string): Promise<Locacion | null> => {
    try {
      return await client.obtener(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener locación');
      return null;
    }
  }, [client]);

  const crearLocacion = useCallback(async (data: CrearLocacionDTO): Promise<Locacion> => {
    setLoading(true);
    try {
      const locacion = await client.crear(data);
      
      // Actualizar estado local
      setState(s => {
        const nuevasLocaciones = [...s.locaciones, locacion];
        return {
          ...s,
          locaciones: nuevasLocaciones,
          warehouses: nuevasLocaciones.filter(l => l.tipo === 'warehouse'),
          unidades: nuevasLocaciones.filter(l => l.tipo === 'storage_unit'),
          loading: false,
          error: null,
        };
      });
      
      // Recargar árbol
      const arbol = await client.obtenerArbol();
      setState(s => ({ ...s, arbol }));
      
      return locacion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear locación');
      throw err;
    }
  }, [client]);

  const actualizarLocacion = useCallback(async (id: string, data: ActualizarLocacionDTO): Promise<Locacion> => {
    setLoading(true);
    try {
      const locacion = await client.actualizar(id, data);
      
      setState(s => {
        const nuevasLocaciones = s.locaciones.map(l => l.id === id ? locacion : l);
        return {
          ...s,
          locaciones: nuevasLocaciones,
          warehouses: nuevasLocaciones.filter(l => l.tipo === 'warehouse'),
          unidades: nuevasLocaciones.filter(l => l.tipo === 'storage_unit'),
          loading: false,
          error: null,
        };
      });
      
      // Recargar árbol
      const arbol = await client.obtenerArbol();
      setState(s => ({ ...s, arbol }));
      
      return locacion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar locación');
      throw err;
    }
  }, [client]);

  const eliminarLocacion = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await client.eliminar(id);
      
      setState(s => {
        // Eliminar también los hijos
        const nuevasLocaciones = s.locaciones.filter(l => 
          l.id !== id && l.padreId !== id
        );
        return {
          ...s,
          locaciones: nuevasLocaciones,
          warehouses: nuevasLocaciones.filter(l => l.tipo === 'warehouse'),
          unidades: nuevasLocaciones.filter(l => l.tipo === 'storage_unit'),
          loading: false,
          error: null,
        };
      });
      
      // Recargar árbol
      const arbol = await client.obtenerArbol();
      setState(s => ({ ...s, arbol }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar locación');
      throw err;
    }
  }, [client]);

  // ============================================================
  // CONSULTAS
  // ============================================================

  const getHijos = useCallback(async (padreId: string): Promise<Locacion[]> => {
    try {
      return await client.obtenerHijos(padreId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener hijos');
      return [];
    }
  }, [client]);

  const getRuta = useCallback(async (id: string): Promise<Locacion[]> => {
    try {
      return await client.obtenerRuta(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener ruta');
      return [];
    }
  }, [client]);

  // ============================================================
  // HELPERS (sincrónico)
  // ============================================================

  /** Obtiene las unidades de almacenamiento de una locación (desde estado local) */
  const getUnidadesPorLocacion = useCallback((locacionId: string): Locacion[] => {
    return state.unidades.filter(u => u.padreId === locacionId);
  }, [state.unidades]);

  // Auto-cargar al montar
  const cargadoRef = useRef(false);
  useEffect(() => {
    if (!cargadoRef.current) {
      cargadoRef.current = true;
      fetchLocaciones();
    }
  }, [fetchLocaciones]);

  return {
    ...state,
    fetchLocaciones,
    getLocacion,
    crearLocacion,
    actualizarLocacion,
    eliminarLocacion,
    getHijos,
    getRuta,
    getUnidadesPorLocacion,
    clearError,
  };
}
