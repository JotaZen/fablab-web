/**
 * Dashboard de Kardex
 * 
 * Historial de movimientos por item con saldos acumulados (estilo Excel)
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import { Badge } from '@/shared/ui/badges/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/inputs/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/tables/table';
import { 
  Package, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  History,
  Search,
  RefreshCw,
  Loader2,
  AlertTriangle,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Calendar
} from 'lucide-react';
import type { Item, ItemStock } from '../../domain/entities';
import { getItemsClient } from '../../infrastructure/api/items-client';
import { getStockClient } from '../../infrastructure/api/stock-client';

// Tipo para movimiento del kardex
interface MovimientoKardex {
  id: string;
  fecha: string;
  tipo: 'entrada' | 'salida' | 'ajuste' | 'inicial';
  razon: string;
  entrada: number;
  salida: number;
  saldo: number;
  referencia?: string;
  usuario?: string;
}

// Datos mock de movimientos (en producción vendrían de la API)
function generarMovimientosMock(itemId: string, stockActual: number): MovimientoKardex[] {
  const ahora = new Date();
  const movimientos: MovimientoKardex[] = [];
  
  // Generar historial hacia atrás
  const numMovimientos = Math.floor(Math.random() * 8) + 3;
  
  // Primero generar los deltas
  const deltas: { tipo: 'entrada' | 'salida'; cantidad: number; razon: string }[] = [];
  
  for (let i = 0; i < numMovimientos; i++) {
    const esEntrada = Math.random() > 0.4;
    const cantidad = Math.floor(Math.random() * 15) + 1;
    
    const razonesEntrada = ['Compra', 'Donación', 'Devolución', 'Ajuste inventario'];
    const razonesSalida = ['Préstamo', 'Consumo', 'Merma', 'Transferencia'];
    
    deltas.push({
      tipo: esEntrada ? 'entrada' : 'salida',
      cantidad,
      razon: esEntrada 
        ? razonesEntrada[Math.floor(Math.random() * razonesEntrada.length)]
        : razonesSalida[Math.floor(Math.random() * razonesSalida.length)]
    });
  }
  
  // Calcular saldo inicial
  let saldoInicial = stockActual;
  deltas.forEach(d => {
    if (d.tipo === 'entrada') {
      saldoInicial -= d.cantidad;
    } else {
      saldoInicial += d.cantidad;
    }
  });
  
  // Asegurar que el saldo inicial sea positivo
  if (saldoInicial < 0) {
    saldoInicial = Math.floor(Math.random() * 20) + 10;
  }
  
  // Crear movimiento inicial
  movimientos.push({
    id: `${itemId}-init`,
    fecha: new Date(ahora.getTime() - (numMovimientos + 1) * 24 * 60 * 60 * 1000).toISOString(),
    tipo: 'inicial',
    razon: 'Saldo inicial',
    entrada: saldoInicial,
    salida: 0,
    saldo: saldoInicial,
  });
  
  // Crear movimientos
  let saldoActual = saldoInicial;
  deltas.forEach((delta, i) => {
    const fecha = new Date(ahora.getTime() - (numMovimientos - i) * 24 * 60 * 60 * 1000);
    
    if (delta.tipo === 'entrada') {
      saldoActual += delta.cantidad;
      movimientos.push({
        id: `${itemId}-${i}`,
        fecha: fecha.toISOString(),
        tipo: 'entrada',
        razon: delta.razon,
        entrada: delta.cantidad,
        salida: 0,
        saldo: saldoActual,
      });
    } else {
      // Solo hacer salida si hay stock
      if (saldoActual >= delta.cantidad) {
        saldoActual -= delta.cantidad;
        movimientos.push({
          id: `${itemId}-${i}`,
          fecha: fecha.toISOString(),
          tipo: 'salida',
          razon: delta.razon,
          entrada: 0,
          salida: delta.cantidad,
          saldo: saldoActual,
        });
      }
    }
  });
  
  return movimientos;
}

export function KardexDashboard() {
  // Datos
  const [items, setItems] = useState<Item[]>([]);
  const [stockItems, setStockItems] = useState<ItemStock[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [itemSeleccionado, setItemSeleccionado] = useState<string>('');
  const [busqueda, setBusqueda] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  // Clientes API
  const itemsClient = getItemsClient();
  const stockClient = getStockClient();

  // Cargar datos
  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const [itemsRes, stockData] = await Promise.all([
        itemsClient.listar().catch(() => ({ items: [], total: 0 })),
        stockClient.listarItems().catch(() => []),
      ]);

      const itemsData = Array.isArray(itemsRes) ? itemsRes : (itemsRes.items || []);
      
      setItems(itemsData);
      setStockItems(stockData);
      
      // Seleccionar primer item si hay
      if (itemsData.length > 0 && !itemSeleccionado) {
        setItemSeleccionado(itemsData[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setCargando(false);
    }
  }, [itemsClient, stockClient, itemSeleccionado]);

  useEffect(() => {
    cargarDatos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Obtener item actual y su stock
  const itemActual = items.find(i => i.id === itemSeleccionado);
  const stockActual = stockItems.find(s => 
    s.catalogoItemId === itemSeleccionado || s.sku === itemActual?.codigo
  );

  // Generar movimientos del kardex
  const movimientos = useMemo(() => {
    if (!itemSeleccionado || !stockActual) return [];
    return generarMovimientosMock(itemSeleccionado, stockActual.cantidad);
  }, [itemSeleccionado, stockActual]);

  // Filtrar movimientos
  const movimientosFiltrados = useMemo(() => {
    let resultado = movimientos;
    
    if (busqueda) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(m => 
        m.razon.toLowerCase().includes(termino) ||
        m.referencia?.toLowerCase().includes(termino)
      );
    }
    
    if (fechaDesde) {
      resultado = resultado.filter(m => m.fecha >= fechaDesde);
    }
    
    if (fechaHasta) {
      resultado = resultado.filter(m => m.fecha <= fechaHasta + 'T23:59:59');
    }
    
    return resultado;
  }, [movimientos, busqueda, fechaDesde, fechaHasta]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    const totalEntradas = movimientosFiltrados.reduce((acc, m) => acc + m.entrada, 0);
    const totalSalidas = movimientosFiltrados.reduce((acc, m) => acc + m.salida, 0);
    const saldoFinal = movimientosFiltrados.length > 0 
      ? movimientosFiltrados[movimientosFiltrados.length - 1].saldo 
      : 0;
    
    return { totalEntradas, totalSalidas, saldoFinal };
  }, [movimientosFiltrados]);

  // Items filtrados para el selector
  const itemsFiltrados = items.filter(item => 
    item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Cargando kardex...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertTriangle className="h-8 w-8 text-destructive mb-4" />
          <p className="text-destructive font-medium mb-2">Error al cargar datos</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
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
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6" />
            Kardex de Inventario
          </h1>
          <p className="text-muted-foreground">
            Historial de movimientos por artículo con saldos
          </p>
        </div>
        <Button onClick={cargarDatos} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Selector de Item y Filtros */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Seleccionar Artículo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Selector de item */}
            <div className="md:col-span-2">
              <Select
                value={itemSeleccionado}
                onValueChange={setItemSeleccionado}
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

            {/* Fecha desde */}
            <div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="pl-10"
                  placeholder="Desde"
                />
              </div>
            </div>

            {/* Fecha hasta */}
            <div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="pl-10"
                  placeholder="Hasta"
                />
              </div>
            </div>
          </div>

          {/* Búsqueda */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en movimientos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info del Item Seleccionado */}
      {itemActual && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Artículo</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">{itemActual.nombre}</div>
              <p className="text-xs text-muted-foreground font-mono">{itemActual.codigo}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entradas</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +{estadisticas.totalEntradas}
              </div>
              <p className="text-xs text-muted-foreground">unidades</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Salidas</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                -{estadisticas.totalSalidas}
              </div>
              <p className="text-xs text-muted-foreground">unidades</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Actual</CardTitle>
              <History className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stockActual?.cantidadDisponible ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">disponibles</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabla de Kardex */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Movimientos
          </CardTitle>
          <CardDescription>
            {movimientosFiltrados.length} movimientos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!itemSeleccionado ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Selecciona un artículo</p>
              <p className="text-sm">Para ver su historial de movimientos</p>
            </div>
          ) : movimientosFiltrados.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Sin movimientos</p>
              <p className="text-sm">No hay movimientos registrados para este artículo</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Concepto / Razón</TableHead>
                    <TableHead className="text-right w-[100px]">Entrada</TableHead>
                    <TableHead className="text-right w-[100px]">Salida</TableHead>
                    <TableHead className="text-right w-[100px] font-bold">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimientosFiltrados.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell className="font-mono text-xs">
                        {new Date(mov.fecha).toLocaleDateString('es-CL', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        {mov.tipo === 'entrada' && (
                          <Badge className="bg-green-600">
                            <ArrowUpCircle className="h-3 w-3 mr-1" />
                            Entrada
                          </Badge>
                        )}
                        {mov.tipo === 'salida' && (
                          <Badge variant="destructive">
                            <ArrowDownCircle className="h-3 w-3 mr-1" />
                            Salida
                          </Badge>
                        )}
                        {mov.tipo === 'inicial' && (
                          <Badge variant="outline">
                            <Package className="h-3 w-3 mr-1" />
                            Inicial
                          </Badge>
                        )}
                        {mov.tipo === 'ajuste' && (
                          <Badge variant="secondary">
                            Ajuste
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{mov.razon}</span>
                        {mov.referencia && (
                          <span className="text-xs text-muted-foreground block">
                            Ref: {mov.referencia}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {mov.entrada > 0 ? (
                          <span className="text-green-600 font-medium">+{mov.entrada}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {mov.salida > 0 ? (
                          <span className="text-red-600 font-medium">-{mov.salida}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold">
                        {mov.saldo}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
