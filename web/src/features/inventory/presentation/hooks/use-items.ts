/**
 * Hook para gestionar Items del catálogo
 */

"use client";

import { useState, useCallback, useEffect } from 'react';
import type { Item, CrearItemDTO, ActualizarItemDTO, FiltrosItem } from '../../domain/entities';
import { getItemsClient } from '../../infrastructure/api/items-client';

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
  const [filtrosActuales, setFiltrosActuales] = useState<FiltrosItem | undefined>(filtrosIniciales);

  const cliente = getItemsClient();

  const cargar = useCallback(async (filtros?: FiltrosItem) => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await cliente.listar(filtros);
      setItems(resultado.items);
      setTotal(resultado.total);
      setFiltrosActuales(filtros);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar items');
    } finally {
      setCargando(false);
    }
  }, [cliente]);

  const crear = useCallback(async (data: CrearItemDTO): Promise<Item> => {
    setCargando(true);
    setError(null);
    try {
      const nuevoItem = await cliente.crear(data);
      // Recargar lista
      await cargar(filtrosActuales);
      return nuevoItem;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al crear item';
      setError(mensaje);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [cliente, cargar, filtrosActuales]);

  const actualizar = useCallback(async (id: string, data: ActualizarItemDTO): Promise<Item> => {
    setCargando(true);
    setError(null);
    try {
      const itemActualizado = await cliente.actualizar(id, data);
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
  }, [cliente]);

  const eliminar = useCallback(async (id: string): Promise<void> => {
    setCargando(true);
    setError(null);
    try {
      await cliente.eliminar(id);
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
  }, [cliente]);

  const buscar = useCallback(async (termino: string) => {
    await cargar({ ...filtrosActuales, busqueda: termino });
  }, [cargar, filtrosActuales]);

  const refrescar = useCallback(async () => {
    await cargar(filtrosActuales);
  }, [cargar, filtrosActuales]);

  // Cargar items al montar
  useEffect(() => {
    cargar(filtrosIniciales);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
