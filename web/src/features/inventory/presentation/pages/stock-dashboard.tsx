/**
 * Dashboard de Stock / Inventario
 * 
 * Vista principal estilo Excel con entradas, salidas y stock actual
 */

"use client";

import { useState, useCallback } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/cards/card';
import { 
  Package, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  AlertTriangle,
  Plus,
  BookOpen
} from 'lucide-react';
import { useStock } from '../hooks/use-stock';
import { useItems } from '../hooks/use-items';
import { useLocations } from '../use-locations';
import { TablaStock, FormularioIngresoStock } from '../components/stock';
import type { CrearItemStockDTO } from '../../domain/entities/stock';
import Link from 'next/link';

export function StockDashboard() {
  const { 
    stockItems, 
    cargando, 
    error, 
    refrescar, 
    entrada, 
    salida,
    crear 
  } = useStock();

  const { items: itemsCatalogo, cargando: cargandoItems } = useItems();
  const { locaciones, loading: cargandoUbicaciones } = useLocations();

  const [formularioAbierto, setFormularioAbierto] = useState(false);

  // Calcular estadísticas
  const totalItems = stockItems.length;
  const stockTotal = stockItems.reduce((acc: number, item) => acc + item.cantidad, 0);
  const sinStock = stockItems.filter(item => item.cantidadDisponible <= 0).length;
  const reservado = stockItems.reduce((acc: number, item) => acc + item.cantidadReservada, 0);

  const handleEntrada = useCallback(async (id: string, cantidad: number, razon?: string) => {
    await entrada(id, cantidad, razon);
  }, [entrada]);

  const handleSalida = useCallback(async (id: string, cantidad: number, razon?: string) => {
    await salida(id, cantidad, razon);
  }, [salida]);

  const handleIngresarStock = useCallback(async (data: CrearItemStockDTO) => {
    await crear(data);
    await refrescar();
  }, [crear, refrescar]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Control de Stock</h1>
          <p className="text-muted-foreground">
            Gestiona las entradas y salidas de inventario
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/inventory/items">
            <Button variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Catálogo
            </Button>
          </Link>
          <Button onClick={() => setFormularioAbierto(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ingresar Stock
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Items en inventario
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stockTotal}</div>
            <p className="text-xs text-muted-foreground">
              Unidades disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservado</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{reservado}</div>
            <p className="text-xs text-muted-foreground">
              Unidades reservadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{sinStock}</div>
            <p className="text-xs text-muted-foreground">
              Items agotados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Stock */}
      <Card>
        <CardHeader>
          <CardTitle>Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <TablaStock
            items={stockItems}
            cargando={cargando}
            onEntrada={handleEntrada}
            onSalida={handleSalida}
            onRefrescar={refrescar}
          />
        </CardContent>
      </Card>

      {/* Formulario de Ingreso */}
      <FormularioIngresoStock
        abierto={formularioAbierto}
        onCerrar={() => setFormularioAbierto(false)}
        onGuardar={handleIngresarStock}
        itemsCatalogo={itemsCatalogo}
        ubicaciones={locaciones}
        cargandoItems={cargandoItems}
        cargandoUbicaciones={cargandoUbicaciones}
      />
    </div>
  );
}
