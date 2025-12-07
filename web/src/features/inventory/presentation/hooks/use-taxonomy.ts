"use client";

import { useState, useCallback, useMemo } from 'react';
import type { Vocabulario, Termino, ArbolTermino, Breadcrumb, FiltrosTerminos } from '../../domain/entities/taxonomy';
import { TaxonomyClient } from '../../infrastructure/vessel/taxonomy.client';
import { useToast } from '@/shared/ui/feedback/toast-provider';

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
  crearTermino: (data: Partial<Termino>) => Promise<Termino>;
  actualizarVocabulario: (id: string, data: Partial<Vocabulario>) => Promise<Vocabulario>;
  actualizarTermino: (id: string, data: Partial<Termino>) => Promise<Termino>;
  eliminarVocabulario: (id: string) => Promise<void>;
  eliminarTermino: (id: string) => Promise<void>;
  obtenerOCrearVocabulario: (nombre: string) => Promise<Vocabulario>;
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

  const { error: showError } = useToast();

  // Cliente real de Vessel API (sin adapter = usa BD real)
  // Nota: asegúrate de que NEXT_PUBLIC_VESSEL_API_URL esté definido o usa fallback
  const client = useMemo(() => new TaxonomyClient(
    process.env.NEXT_PUBLIC_VESSEL_API_URL || 'http://127.0.0.1:8000',
    'sql',
  ), []);

  const cargarVocabularios = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await client.listarVocabularios();
      setVocabularios(response.data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cargar vocabularios';
      setError(msg);
      showError(msg, 'Error de conexión');
    } finally {
      setCargando(false);
    }
  }, [client, showError]);

  const cargarTerminos = useCallback(async (filtros?: FiltrosTerminos) => {
    setCargando(true);
    setError(null);
    try {
      const response = await client.listarTerminos(filtros);
      setTerminos(response.data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cargar términos';
      setError(msg);
      showError(msg, 'Error en términos');
    } finally {
      setCargando(false);
    }
  }, [client, showError]);

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
      const msg = err instanceof Error ? err.message : 'Error al cargar árbol';
      setError(msg);
      showError(msg, 'Error en árbol');
    } finally {
      setCargando(false);
    }
  }, [client, showError]);

  const cargarBreadcrumb = useCallback(async (terminoId: string) => {
    setCargando(true);
    setError(null);
    try {
      const data = await client.obtenerBreadcrumb(terminoId);
      setBreadcrumbs(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cargar breadcrumb';
      setError(msg);
      showError(msg);
    } finally {
      setCargando(false);
    }
  }, [client, showError]);

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
      showError(msg, 'Error creación');
      throw err;
    } finally {
      setCargando(false);
    }
  }, [client, showError]);

  const crearTermino = useCallback(async (data: Partial<Termino>): Promise<Termino> => {
    setCargando(true);
    setError(null);
    try {
      const nuevo = await client.crearTermino(data);
      setTerminos(prev => [...prev, nuevo]);
      return nuevo;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear término';
      setError(msg);
      showError(msg, 'Error creación');
      throw err;
    } finally {
      setCargando(false);
    }
  }, [client, showError]);

  const actualizarVocabulario = useCallback(async (id: string, data: Partial<Vocabulario>) => {
    setCargando(true);
    setError(null);
    try {
      const actualizado = await client.actualizarVocabulario(id, data);
      setVocabularios(prev => prev.map(v => v.id === id ? actualizado : v));
      return actualizado;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar vocabulario';
      setError(msg);
      showError(msg, 'Error actualización');
      throw err;
    } finally {
      setCargando(false);
    }
  }, [client, showError]);

  const actualizarTermino = useCallback(async (id: string, data: Partial<Termino>) => {
    setCargando(true);
    setError(null);
    try {
      const actualizado = await client.actualizarTermino(id, data);
      setTerminos(prev => prev.map(t => t.id === id ? actualizado : t));
      return actualizado;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar término';
      setError(msg);
      showError(msg, 'Error actualización');
      throw err;
    } finally {
      setCargando(false);
    }
  }, [client, showError]);

  const eliminarVocabulario = useCallback(async (id: string) => {
    setCargando(true);
    setError(null);
    try {
      await client.eliminarVocabulario(id);
      setVocabularios(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar vocabulario';
      setError(msg);
      showError(msg, 'Error eliminación');
      throw err;
    } finally {
      setCargando(false);
    }
  }, [client, showError]);

  const eliminarTermino = useCallback(async (id: string) => {
    setCargando(true);
    setError(null);
    try {
      await client.eliminarTermino(id);
      setTerminos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar término';
      setError(msg);
      showError(msg, 'Error eliminación');
      throw err;
    } finally {
      setCargando(false);
    }
  }, [client, showError]);

  const obtenerOCrearVocabulario = useCallback(async (nombre: string) => {
    setCargando(true);
    try {
      const response = await client.listarVocabularios();
      const existente = response.data.find(v => v.nombre.toLowerCase() === nombre.toLowerCase());

      if (existente) {
        return existente;
      }

      const nuevo = await client.crearVocabulario({ nombre });
      setVocabularios(prev => [...prev, nuevo]);
      return nuevo;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al obtener/crear vocabulario ' + nombre;
      setError(msg);
      showError(msg);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [client, showError]);

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
    actualizarVocabulario,
    actualizarTermino,
    eliminarVocabulario,
    eliminarTermino,
    obtenerOCrearVocabulario,
    limpiarError,
  };
}
