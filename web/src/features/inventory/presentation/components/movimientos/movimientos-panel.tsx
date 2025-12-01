/**
 * Panel de Movimientos de Stock
 * 
 * Interfaz para registrar entradas y salidas de inventario
 * usando la API real de Vessel (sin header local)
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Label } from '@/shared/ui/labels/label';
import { Badge } from '@/shared/ui/badges/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import { Textarea } from '@/shared/ui/inputs/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/inputs/select';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Package,
  Loader2,
  RefreshCw,
  History,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Warehouse,
  Box
} from 'lucide-react';
import type { Item } from '../../../domain/entities/item';
import type { ItemStock } from '../../../domain/entities/stock';
import { getItemsClient } from '../../../infrastructure/vessel/items.client';
import { getStockClient } from '../../../infrastructure/vessel/stock.client';
import { getLocationClient } from '../../../infrastructure/vessel/locations.client';
import type { Locacion } from '../../../domain/entities/location';

// Razones disponibles
const RAZONES_ENTRADA = [
  { valor: 'compra', etiqueta: 'Compra' },
  { valor: 'donacion', etiqueta: 'Donación' },
  { valor: 'devolucion', etiqueta: 'Devolución' },
  { valor: 'retorno_prestamo', etiqueta: 'Retorno de Préstamo' },
  { valor: 'ajuste', etiqueta: 'Ajuste de Inventario' },
  { valor: 'otro', etiqueta: 'Otro' },
];

const RAZONES_SALIDA = [
  { valor: 'prestamo', etiqueta: 'Préstamo' },
  { valor: 'consumo', etiqueta: 'Consumo' },
  { valor: 'merma', etiqueta: 'Merma/Pérdida' },
  { valor: 'transferencia', etiqueta: 'Transferencia' },
  { valor: 'ajuste', etiqueta: 'Ajuste de Inventario' },
  { valor: 'otro', etiqueta: 'Otro' },
];

interface MovimientoReciente {
  id: string;
  fecha: string;
  tipo: 'entrada' | 'salida';
  itemNombre: string;
  cantidad: number;
  razon: string;
  observaciones?: string;
  ubicacion?: string;
}

export function MovimientosPanel() {
  // Datos base
  const [items, setItems] = useState<Item[]>([]);
  const [stockItems, setStockItems] = useState<ItemStock[]>([]);
  const [locaciones, setLocaciones] = useState<Locacion[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  // Estado del formulario
  const [tipoMovimiento, setTipoMovimiento] = useState<'entrada' | 'salida'>('entrada');
  const [itemSeleccionado, setItemSeleccionado] = useState<string>('');
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<string>('');
  const [cantidad, setCantidad] = useState<string>('');
  const [razon, setRazon] = useState<string>('compra');
  const [observaciones, setObservaciones] = useState('');
  
  // Estado de UI
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [movimientosRecientes, setMovimientosRecientes] = useState<MovimientoReciente[]>([]);

  // Clientes API
  const itemsClient = getItemsClient();
  const stockClient = getStockClient();
  const locationClient = getLocationClient();

  // Cargar datos iniciales
  const cargarDatos = useCallback(async () => {
    setCargandoDatos(true);
    setErrorCarga(null);

    try {
      const [itemsRes, stockData, locData] = await Promise.all([
        itemsClient.listar().catch(() => ({ items: [], total: 0 })),
        stockClient.listarItems().catch(() => []),
        locationClient.listar().catch(() => []),
      ]);

      // Manejar respuesta de items (puede ser array o {items, total})
      const itemsData = Array.isArray(itemsRes) ? itemsRes : (itemsRes.items || []);
      
      setItems(itemsData);
      setStockItems(stockData);
      setLocaciones(locData);
    } catch (err) {
      setErrorCarga(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setCargandoDatos(false);
    }
  }, [itemsClient, stockClient, locationClient]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Cambiar razón cuando cambia tipo
  useEffect(() => {
    if (tipoMovimiento === 'entrada') {
      setRazon('compra');
    } else {
      setRazon('prestamo');
    }
  }, [tipoMovimiento]);

  // Obtener razones según tipo
  const razones = tipoMovimiento === 'entrada' ? RAZONES_ENTRADA : RAZONES_SALIDA;

  // Buscar info del item seleccionado
  const itemInfo = items.find(i => i.id === itemSeleccionado);
  
  // Buscar stock del item en la ubicación seleccionada
  const stockActual = stockItems.find(s => 
    (s.catalogoItemId === itemSeleccionado || s.sku === itemInfo?.codigo) &&
    (ubicacionSeleccionada ? s.ubicacionId === ubicacionSeleccionada : true)
  );

  // Ubicación seleccionada info
  const ubicacionInfo = locaciones.find(l => l.id === ubicacionSeleccionada);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setExito(null);

    // Validaciones
    if (!itemSeleccionado) {
      setError('Selecciona un artículo');
      return;
    }

    const cantidadNum = parseInt(cantidad, 10);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      setError('Ingresa una cantidad válida mayor a 0');
      return;
    }

    // Validar stock disponible para salidas
    if (tipoMovimiento === 'salida') {
      if (!stockActual) {
        setError('No hay stock registrado para este artículo en esta ubicación');
        return;
      }
      if (cantidadNum > stockActual.cantidadDisponible) {
        setError(`Stock insuficiente. Disponible: ${stockActual.cantidadDisponible}`);
        return;
      }
    }

    setGuardando(true);

    try {
      const razonTexto = razones.find(r => r.valor === razon)?.etiqueta || razon;
      const razonCompleta = observaciones 
        ? `${razonTexto}: ${observaciones}`
        : razonTexto;

      if (tipoMovimiento === 'entrada') {
        if (stockActual) {
          // Ajustar stock existente (delta positivo)
          await stockClient.ajustarStock(stockActual.id, {
            sku: stockActual.sku,
            ubicacionId: stockActual.ubicacionId,
            delta: cantidadNum,
            razon: razonCompleta,
          });
        } else {
          // Crear nuevo item de stock
          await stockClient.crearItem({
            sku: itemInfo?.codigo || `ITEM-${itemSeleccionado.substring(0, 8)}`,
            catalogoItemId: itemSeleccionado,
            catalogoOrigen: 'vessel_items',
            ubicacionId: ubicacionSeleccionada || 'default',
            tipoUbicacion: ubicacionInfo?.tipo === 'storage_unit' ? 'warehouse' : 'warehouse',
            cantidad: cantidadNum,
          });
        }
      } else {
        // Salida: Ajustar stock (delta negativo)
        if (stockActual) {
          await stockClient.ajustarStock(stockActual.id, {
            sku: stockActual.sku,
            ubicacionId: stockActual.ubicacionId,
            delta: -cantidadNum,
            razon: razonCompleta,
          });
        }
      }

      // Agregar a historial local
      setMovimientosRecientes(prev => [{
        id: Date.now().toString(),
        fecha: new Date().toISOString(),
        tipo: tipoMovimiento,
        itemNombre: itemInfo?.nombre || 'Item',
        cantidad: cantidadNum,
        razon: razonTexto,
        observaciones,
        ubicacion: ubicacionInfo?.nombre,
      }, ...prev.slice(0, 9)]);

      // Limpiar formulario
      setCantidad('');
      setObservaciones('');
      setExito(`${tipoMovimiento === 'entrada' ? 'Entrada' : 'Salida'} registrada correctamente`);

      // Recargar stock
      const nuevoStock = await stockClient.listarItems().catch(() => []);
      setStockItems(nuevoStock);

      // Limpiar mensaje de éxito
      setTimeout(() => setExito(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar movimiento');
    } finally {
      setGuardando(false);
    }
  };

  if (cargandoDatos) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertTriangle className="h-8 w-8 text-destructive mb-4" />
          <p className="text-destructive font-medium mb-2">Error al cargar datos</p>
          <p className="text-sm text-muted-foreground mb-4">{errorCarga}</p>
          <Button onClick={cargarDatos} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Movimientos de Stock</h1>
          <p className="text-muted-foreground">
            Registra entradas y salidas de inventario
          </p>
        </div>
        <Button onClick={cargarDatos} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Formulario de movimiento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {tipoMovimiento === 'entrada' ? (
                <ArrowUpCircle className="h-5 w-5 text-green-600" />
              ) : (
                <ArrowDownCircle className="h-5 w-5 text-red-600" />
              )}
              Registrar Movimiento
            </CardTitle>
            <CardDescription>
              Ingresa los datos del movimiento de stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tipo de movimiento */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={tipoMovimiento === 'entrada' ? 'default' : 'outline'}
                  className={tipoMovimiento === 'entrada' ? 'bg-green-600 hover:bg-green-700 flex-1' : 'flex-1'}
                  onClick={() => setTipoMovimiento('entrada')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Entrada
                </Button>
                <Button
                  type="button"
                  variant={tipoMovimiento === 'salida' ? 'default' : 'outline'}
                  className={tipoMovimiento === 'salida' ? 'bg-red-600 hover:bg-red-700 flex-1' : 'flex-1'}
                  onClick={() => setTipoMovimiento('salida')}
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Salida
                </Button>
              </div>

              {/* Artículo */}
              <div className="grid gap-2">
                <Label>Artículo <span className="text-destructive">*</span></Label>
                <Select
                  value={itemSeleccionado}
                  onValueChange={setItemSeleccionado}
                  disabled={guardando}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar artículo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {items.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        No hay artículos registrados
                      </div>
                    ) : (
                      items.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          <span className="flex items-center gap-2">
                            <Package className="h-3 w-3" />
                            <span className="font-mono text-xs">{item.codigo}</span>
                            {item.nombre}
                          </span>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Ubicación */}
              <div className="grid gap-2">
                <Label>Ubicación</Label>
                <Select
                  value={ubicacionSeleccionada || '__none__'}
                  onValueChange={(v) => setUbicacionSeleccionada(v === '__none__' ? '' : v)}
                  disabled={guardando}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ubicación..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Sin ubicación específica</SelectItem>
                    {locaciones.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        <span className="flex items-center gap-2">
                          {loc.tipo === 'warehouse' ? (
                            <Warehouse className="h-3 w-3" />
                          ) : (
                            <Box className="h-3 w-3" />
                          )}
                          {loc.nombre}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Info de stock actual */}
              {itemSeleccionado && (
                <div className="p-3 rounded-lg bg-muted/50 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Stock actual:</span>
                    <span className="font-bold">
                      {stockActual ? stockActual.cantidadDisponible : 0} unidades
                    </span>
                  </div>
                  {stockActual && stockActual.cantidadReservada > 0 && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-muted-foreground text-xs">Reservado:</span>
                      <span className="text-xs text-amber-600">
                        {stockActual.cantidadReservada} unidades
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Cantidad */}
              <div className="grid gap-2">
                <Label>Cantidad <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder="Ej: 10"
                  disabled={guardando}
                />
              </div>

              {/* Razón */}
              <div className="grid gap-2">
                <Label>Razón</Label>
                <Select
                  value={razon}
                  onValueChange={setRazon}
                  disabled={guardando}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {razones.map((r) => (
                      <SelectItem key={r.valor} value={r.valor}>
                        {r.etiqueta}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Observaciones */}
              <div className="grid gap-2">
                <Label>Observaciones</Label>
                <Textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Detalles adicionales del movimiento..."
                  rows={2}
                  disabled={guardando}
                />
              </div>

              {/* Mensajes */}
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              {exito && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  {exito}
                </div>
              )}

              {/* Submit */}
              <Button 
                type="submit" 
                disabled={guardando || !itemSeleccionado || !cantidad}
                className={`w-full ${
                  tipoMovimiento === 'entrada' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {guardando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {tipoMovimiento === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Historial reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Movimientos Recientes
            </CardTitle>
            <CardDescription>
              Últimos movimientos registrados en esta sesión
            </CardDescription>
          </CardHeader>
          <CardContent>
            {movimientosRecientes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No hay movimientos recientes</p>
                <p className="text-sm">Los movimientos que registres aparecerán aquí</p>
              </div>
            ) : (
              <div className="space-y-3">
                {movimientosRecientes.map((mov) => (
                  <div 
                    key={mov.id}
                    className={`flex items-start justify-between p-3 rounded-lg border transition-colors ${
                      mov.tipo === 'entrada' 
                        ? 'border-green-200 bg-green-50 dark:bg-green-950/20' 
                        : 'border-red-200 bg-red-50 dark:bg-red-950/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {mov.tipo === 'entrada' ? (
                        <ArrowUpCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{mov.itemNombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {mov.razon}
                          {mov.observaciones && (
                            <span className="block mt-0.5 italic">{mov.observaciones}</span>
                          )}
                        </p>
                        {mov.ubicacion && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Warehouse className="h-3 w-3" />
                            {mov.ubicacion}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={mov.tipo === 'entrada' ? 'default' : 'destructive'}
                        className={mov.tipo === 'entrada' ? 'bg-green-600' : ''}
                      >
                        {mov.tipo === 'entrada' ? '+' : '-'}{mov.cantidad}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(mov.fecha).toLocaleTimeString('es-CL', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumen de stock */}
      {stockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumen de Stock</CardTitle>
            <CardDescription>
              Vista rápida de existencias por artículo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {stockItems.slice(0, 6).map((stock) => {
                const item = items.find(i => i.id === stock.catalogoItemId);
                return (
                  <div 
                    key={stock.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item?.nombre || stock.sku}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {stock.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{stock.cantidadDisponible}</p>
                      <p className="text-xs text-muted-foreground">disponible</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {stockItems.length > 6 && (
              <p className="text-sm text-muted-foreground text-center mt-4">
                Y {stockItems.length - 6} artículos más...
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
