"use client";

import { useState, useCallback, useMemo } from 'react';
import type { Vocabulario, Termino, ArbolTermino, Breadcrumb, FiltrosTerminos } from '../../domain/entities/taxonomy';
import { TaxonomyClient } from '../../infrastructure/vessel/taxonomy.client';

/** Estado del hook */
interface UseTaxonomyState {
  vocabularios: Vocabulario[];
  terminos: Termino[];
  arbol: ArbolTermino[];
  breadcrumbs: Breadcrumb[];
  cargando: boolean;
  error: string | null;
}

/** Acciones del hook */
interface UseTaxonomyActions {
  cargarVocabularios: () => Promise<void>;
  cargarTerminos: (filtros?: FiltrosTerminos) => Promise<void>;
  cargarArbol: (vocabularioId?: string) => Promise<void>;
  cargarBreadcrumb: (terminoId: string) => Promise<void>;
  crearVocabulario: (data: Omit<Vocabulario, 'id'>) => Promise<Vocabulario>;
  crearTermino: (data: Omit<Termino, 'id'>) => Promise<Termino>;
  eliminarVocabulario: (id: string) => Promise<void>;
  eliminarTermino: (id: string) => Promise<void>;
  limpiarError: () => void;
}

export type UseTaxonomyResult = UseTaxonomyState & UseTaxonomyActions;

/** Hook para gestionar taxonomías */
export function useTaxonomy(): UseTaxonomyResult {
  const [vocabularios, setVocabularios] = useState<Vocabulario[]>([]);
  const [terminos, setTerminos] = useState<Termino[]>([]);
  const [arbol, setArbol] = useState<ArbolTermino[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cliente real de Vessel API (sin adapter = usa BD real)
  const client = useMemo(() => new TaxonomyClient({
    baseUrl: process.env.NEXT_PUBLIC_VESSEL_API_URL || 'http://127.0.0.1:8000',
    adapter: 'sql',
  }), []);

  const cargarVocabularios = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await client.listarVocabularios();
      setVocabularios(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar vocabularios');
    } finally {
      setCargando(false);
    }
  }, [client]);

  const cargarTerminos = useCallback(async (filtros?: FiltrosTerminos) => {
    setCargando(true);
    setError(null);
    try {
      const response = await client.listarTerminos(filtros);
      setTerminos(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar términos');
    } finally {
      setCargando(false);
    }
  }, [client]);

  const cargarArbol = useCallback(async (vocabularioId?: string) => {
    setCargando(true);
    setError(null);
    try {
      if (!vocabularioId) {
        setArbol([]);
        return;
      }
      const data = await client.obtenerArbol(vocabularioId);
      setArbol(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar árbol');
    } finally {
      setCargando(false);
    }
  }, [client]);

  const cargarBreadcrumb = useCallback(async (terminoId: string) => {
    setCargando(true);
    setError(null);
    try {
      const data = await client.obtenerBreadcrumb(terminoId);
      setBreadcrumbs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar breadcrumb');
    } finally {
      setCargando(false);
    }
  }, [client]);

  const crearVocabulario = useCallback(async (data: Omit<Vocabulario, 'id'>): Promise<Vocabulario> => {
    setCargando(true);
    setError(null);
    try {
      const nuevo = await client.crearVocabulario(data);
      setVocabularios(prev => [...prev, nuevo]);
      return nuevo;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear vocabulario';
      setError(msg);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [client]);

  const crearTermino = useCallback(async (data: Omit<Termino, 'id'>): Promise<Termino> => {
    setCargando(true);
    setError(null);
    try {
      const nuevo = await client.crearTermino(data);
      setTerminos(prev => [...prev, nuevo]);
      return nuevo;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear término';
      setError(msg);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [client]);

  const eliminarVocabulario = useCallback(async (id: string) => {
    setCargando(true);
    setError(null);
    try {
      await client.eliminarVocabulario(id);
      setVocabularios(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar vocabulario';
      setError(msg);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [client]);

  const eliminarTermino = useCallback(async (id: string) => {
    setCargando(true);
    setError(null);
    try {
      await client.eliminarTermino(id);
      setTerminos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar término';
      setError(msg);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [client]);

  const limpiarError = useCallback(() => setError(null), []);

  return {
    vocabularios,
    terminos,
    arbol,
    breadcrumbs,
    cargando,
    error,
    cargarVocabularios,
    cargarTerminos,
    cargarArbol,
    cargarBreadcrumb,
    crearVocabulario,
    crearTermino,
    eliminarVocabulario,
    eliminarTermino,
    limpiarError,
  };
}
