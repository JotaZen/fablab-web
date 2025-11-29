/**
 * Hook para gestionar Stock de Items
 */

"use client";

import { useState, useCallback, useEffect } from 'react';
import type { ItemStock, CrearItemStockDTO, AjustarStockDTO, FiltrosStock } from '../../domain/entities';
import { getStockClient } from '../../infrastructure/api/stock-client';

interface UseStockReturn {
  stockItems: ItemStock[];
  cargando: boolean;
  error: string | null;
  
  // CRUD
  cargar: (filtros?: FiltrosStock) => Promise<void>;
  crear: (data: CrearItemStockDTO) => Promise<ItemStock>;
  ajustar: (id: string, data: AjustarStockDTO) => Promise<ItemStock>;
  eliminar: (id: string) => Promise<void>;
  
  // Helpers
  refrescar: () => Promise<void>;
  entrada: (id: string, cantidad: number, razon?: string) => Promise<ItemStock>;
  salida: (id: string, cantidad: number, razon?: string) => Promise<ItemStock>;
}

export function useStock(filtrosIniciales?: FiltrosStock): UseStockReturn {
  const [stockItems, setStockItems] = useState<ItemStock[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtrosActuales, setFiltrosActuales] = useState<FiltrosStock | undefined>(filtrosIniciales);

  const cliente = getStockClient();

  const cargar = useCallback(async (filtros?: FiltrosStock) => {
    setCargando(true);
    setError(null);
    try {
      const items = await cliente.listarItems(filtros);
      setStockItems(items);
      setFiltrosActuales(filtros);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar stock');
    } finally {
      setCargando(false);
    }
  }, [cliente]);

  const crear = useCallback(async (data: CrearItemStockDTO): Promise<ItemStock> => {
    setCargando(true);
    setError(null);
    try {
      const nuevoItem = await cliente.crearItem(data);
      await cargar(filtrosActuales);
      return nuevoItem;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al crear stock';
      setError(mensaje);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [cliente, cargar, filtrosActuales]);

  const ajustar = useCallback(async (id: string, data: AjustarStockDTO): Promise<ItemStock> => {
    setCargando(true);
    setError(null);
    try {
      const itemActualizado = await cliente.ajustarStock(id, data);
      setStockItems(prev => prev.map(item => item.id === id ? itemActualizado : item));
      return itemActualizado;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al ajustar stock';
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
      await cliente.eliminarItem(id);
      setStockItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al eliminar stock';
      setError(mensaje);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [cliente]);

  // Helpers para entrada/salida simplificadas
  const entrada = useCallback(async (id: string, cantidad: number, razon?: string): Promise<ItemStock> => {
    const item = stockItems.find(i => i.id === id);
    if (!item) throw new Error('Item no encontrado');
    
    return ajustar(id, {
      sku: item.sku,
      ubicacionId: item.ubicacionId,
      delta: Math.abs(cantidad), // Siempre positivo para entrada
      razon: razon || 'Entrada de stock',
    });
  }, [ajustar, stockItems]);

  const salida = useCallback(async (id: string, cantidad: number, razon?: string): Promise<ItemStock> => {
    const item = stockItems.find(i => i.id === id);
    if (!item) throw new Error('Item no encontrado');
    
    return ajustar(id, {
      sku: item.sku,
      ubicacionId: item.ubicacionId,
      delta: -Math.abs(cantidad), // Siempre negativo para salida
      razon: razon || 'Salida de stock',
    });
  }, [ajustar, stockItems]);

  const refrescar = useCallback(async () => {
    await cargar(filtrosActuales);
  }, [cargar, filtrosActuales]);

  // Cargar al montar
  useEffect(() => {
    cargar(filtrosIniciales);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    stockItems,
    cargando,
    error,
    cargar,
    crear,
    ajustar,
    eliminar,
    refrescar,
    entrada,
    salida,
  };
}
