/**
 * Hook para gestionar Items del catálogo
 */

"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Item, CrearItemDTO, ActualizarItemDTO, FiltrosItem } from '../../domain/entities/item';
import { getItemsClient } from '../../infrastructure/vessel/items.client';

interface UseItemsReturn {
  items: Item[];
  total: number;
  cargando: boolean;
  error: string | null;
  
  // CRUD
  cargar: (filtros?: FiltrosItem) => Promise<void>;
  crear: (data: CrearItemDTO) => Promise<Item>;
  actualizar: (id: string, data: ActualizarItemDTO) => Promise<Item>;
  eliminar: (id: string) => Promise<void>;
  
  // Helpers
  buscar: (termino: string) => Promise<void>;
  refrescar: () => Promise<void>;
}

export function useItems(filtrosIniciales?: FiltrosItem): UseItemsReturn {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filtrosRef = useRef<FiltrosItem | undefined>(filtrosIniciales);
  const cargadoRef = useRef(false);

  // Cliente singleton - no cambia entre renders
  const clienteRef = useRef(getItemsClient());

  const cargar = useCallback(async (filtros?: FiltrosItem) => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await clienteRef.current.listar(filtros);
      setItems(resultado.items);
      setTotal(resultado.total);
      filtrosRef.current = filtros;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar items');
    } finally {
      setCargando(false);
    }
  }, []);

  const crear = useCallback(async (data: CrearItemDTO): Promise<Item> => {
    setCargando(true);
    setError(null);
    try {
      const nuevoItem = await clienteRef.current.crear(data);
      // Recargar lista
      await cargar(filtrosRef.current);
      return nuevoItem;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al crear item';
      setError(mensaje);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [cargar]);

  const actualizar = useCallback(async (id: string, data: ActualizarItemDTO): Promise<Item> => {
    setCargando(true);
    setError(null);
    try {
      const itemActualizado = await clienteRef.current.actualizar(id, data);
      // Actualizar en la lista local
      setItems(prev => prev.map(item => item.id === id ? itemActualizado : item));
      return itemActualizado;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al actualizar item';
      setError(mensaje);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const eliminar = useCallback(async (id: string): Promise<void> => {
    setCargando(true);
    setError(null);
    try {
      await clienteRef.current.eliminar(id);
      // Remover de la lista local
      setItems(prev => prev.filter(item => item.id !== id));
      setTotal(prev => prev - 1);
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al eliminar item';
      setError(mensaje);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const buscar = useCallback(async (termino: string) => {
    await cargar({ ...filtrosRef.current, busqueda: termino });
  }, [cargar]);

  const refrescar = useCallback(async () => {
    await cargar(filtrosRef.current);
  }, [cargar]);

  // Cargar items al montar - solo una vez
  useEffect(() => {
    if (!cargadoRef.current) {
      cargadoRef.current = true;
      cargar(filtrosIniciales);
    }
  }, [cargar, filtrosIniciales]);

  return {
    items,
    total,
    cargando,
    error,
    cargar,
    crear,
    actualizar,
    eliminar,
    buscar,
    refrescar,
  };
}
