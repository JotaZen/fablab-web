/**
 * Dashboard de Locaciones
 * 
 * Gestión de ubicaciones físicas del FabLab:
 * - Locaciones (warehouse): Bodegas, laboratorios, etc.
 * - Unidades de Almacenamiento (storage_unit): Estantes, cajones, etc.
 * - Ver items en cada locación
 */

"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import { Badge } from '@/shared/ui/badges/badge';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { 
  Building2, 
  Box, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Plus,
  ChevronRight,
  Trash2,
  FolderTree,
  Package,
  Loader2,
  X,
} from 'lucide-react';
import { 
  getLocationClient,
  type Locacion,
  type LocacionConHijos,
  type CrearLocacionDTO,
  TIPO_LOCACION_LABELS,
} from '../../infrastructure/api/location-client';
import { getStockClient } from '../../infrastructure/api/stock-client';
import { getItemsClient } from '../../infrastructure/api/items-client';
import type { ItemStock, Item } from '../../domain/entities';

type EstadoConexion = 'verificando' | 'conectado' | 'desconectado' | 'error';

interface EstadoApi {
  estado: EstadoConexion;
  mensaje: string;
  latencia?: number;
  cantidadLocaciones?: number;
  cantidadUnidades?: number;
}

export function LocationsDashboard() {
  const [estadoApi, setEstadoApi] = useState<EstadoApi>({
    estado: 'verificando',
    mensaje: 'Verificando conexión...',
  });

  const [locaciones, setLocaciones] = useState<Locacion[]>([]);
  const [arbol, setArbol] = useState<LocacionConHijos[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Formulario
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState<'warehouse' | 'storage_unit'>('warehouse');
  const [nuevoPadreId, setNuevoPadreId] = useState<string>('');

  // Locación seleccionada para ver items
  const [locacionSeleccionada, setLocacionSeleccionada] = useState<Locacion | null>(null);
  const [itemsEnLocacion, setItemsEnLocacion] = useState<Array<{ stock: ItemStock; item?: Item }>>([]);
  const [cargandoItems, setCargandoItems] = useState(false);

  const locationClient = getLocationClient();
  const stockClient = getStockClient();
  const itemsClient = getItemsClient();

  const verificarConexion = useCallback(async () => {
    setEstadoApi({ estado: 'verificando', mensaje: 'Verificando conexión...' });
    
    const tiempoInicio = Date.now();
    
    try {
      const todas = await locationClient.listar();
      const latencia = Date.now() - tiempoInicio;
      
      setLocaciones(todas);
      
      // Construir árbol
      const arbolData = await locationClient.obtenerArbol();
      setArbol(arbolData);
      
      const warehouses = todas.filter(l => l.tipo === 'warehouse');
      const unidades = todas.filter(l => l.tipo === 'storage_unit');
      
      setEstadoApi({
        estado: 'conectado',
        mensaje: 'Conectado a Vessel API',
        latencia,
        cantidadLocaciones: warehouses.length,
        cantidadUnidades: unidades.length,
      });
    } catch (err) {
      setEstadoApi({
        estado: 'desconectado',
        mensaje: err instanceof Error ? err.message : 'No se pudo conectar',
      });
    }
  }, [locationClient]);

  useEffect(() => {
    verificarConexion();
  }, [verificarConexion]);

  // Cargar items de una locación
  const cargarItemsDeLocacion = useCallback(async (locacion: Locacion) => {
    setLocacionSeleccionada(locacion);
    setCargandoItems(true);
    setItemsEnLocacion([]);

    try {
      // Obtener stock de esta ubicación
      const stockItems = await stockClient.listarItems({ ubicacionId: locacion.id });
      
      // Obtener catálogo de items para enriquecer
      const itemsRes = await itemsClient.listar().catch(() => ({ items: [], total: 0 }));
      const catalogoItems = Array.isArray(itemsRes) ? itemsRes : (itemsRes.items || []);
      
      // Combinar stock con info de item
      const itemsConInfo = stockItems.map(stock => {
        const item = catalogoItems.find(i => i.id === stock.catalogoItemId);
        return { stock, item };
      });

      setItemsEnLocacion(itemsConInfo);
    } catch (err) {
      console.error('Error cargando items:', err);
    } finally {
      setCargandoItems(false);
    }
  }, [stockClient, itemsClient]);

  // ============================================================
  // MANEJADORES
  // ============================================================

  const handleCrear = useCallback(async () => {
    if (!nuevoNombre.trim()) {
      setError('El nombre es requerido');
      return;
    }
    
    setCargando(true);
    setError(null);
    
    try {
      const dto: CrearLocacionDTO = {
        nombre: nuevoNombre.trim(),
        tipo: nuevoTipo,
        padreId: nuevoPadreId || undefined,
      };
      
      await locationClient.crear(dto);
      
      // Limpiar y recargar
      setNuevoNombre('');
      setNuevoTipo('warehouse');
      setNuevoPadreId('');
      setMostrarFormulario(false);
      await verificarConexion();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear');
    } finally {
      setCargando(false);
    }
  }, [locationClient, nuevoNombre, nuevoTipo, nuevoPadreId, verificarConexion]);

  const handleEliminar = useCallback(async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta locación?')) return;
    
    setCargando(true);
    try {
      await locationClient.eliminar(id);
      if (locacionSeleccionada?.id === id) {
        setLocacionSeleccionada(null);
        setItemsEnLocacion([]);
      }
      await verificarConexion();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setCargando(false);
    }
  }, [locationClient, verificarConexion, locacionSeleccionada]);

  // ============================================================
  // UI DE ESTADO
  // ============================================================

  const obtenerIconoEstado = () => {
    switch (estadoApi.estado) {
      case 'verificando':
        return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />;
      case 'conectado':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'desconectado':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const obtenerBadgeEstado = () => {
    switch (estadoApi.estado) {
      case 'verificando':
        return <Badge variant="outline">Verificando...</Badge>;
      case 'conectado':
        return <Badge className="bg-green-100 text-green-800">Conectado</Badge>;
      case 'desconectado':
        return <Badge variant="destructive">Desconectado</Badge>;
      case 'error':
        return <Badge className="bg-yellow-100 text-yellow-800">Error</Badge>;
    }
  };

  // Locaciones disponibles como padre (solo warehouses)
  const locacionesParaPadre = locaciones.filter(l => l.tipo === 'warehouse');

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Locaciones</h1>
          <p className="text-muted-foreground">
            Gestiona las ubicaciones físicas del inventario
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={verificarConexion} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button onClick={() => setMostrarFormulario(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Locación
          </Button>
        </div>
      </div>

      {/* Alerta de Error */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError(null)}
            >
              Cerrar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tarjeta de Estado */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            {obtenerIconoEstado()}
            <div className="flex-1">
              <CardTitle className="text-base">Vessel API - Locations</CardTitle>
              <CardDescription>{estadoApi.mensaje}</CardDescription>
            </div>
            {obtenerBadgeEstado()}
          </div>
        </CardHeader>
        {estadoApi.estado === 'conectado' && (
          <CardContent>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{estadoApi.cantidadLocaciones}</span>
                <span className="text-muted-foreground">locaciones</span>
              </div>
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{estadoApi.cantidadUnidades}</span>
                <span className="text-muted-foreground">unidades de almacenamiento</span>
              </div>
              {estadoApi.latencia && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>Latencia: {estadoApi.latencia}ms</span>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Formulario de Nueva Locación */}
      {mostrarFormulario && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nueva Locación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <Input
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Ej: Bodega Principal"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <select
                value={nuevoTipo}
                onChange={(e) => setNuevoTipo(e.target.value as 'warehouse' | 'storage_unit')}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="warehouse">Locación (puede tener hijos)</option>
                <option value="storage_unit">Unidad de Almacenamiento (sin hijos)</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Locación Padre (opcional)</label>
              <select
                value={nuevoPadreId}
                onChange={(e) => setNuevoPadreId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">Sin padre (raíz)</option>
                {locacionesParaPadre.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCrear} disabled={cargando}>
                {cargando ? 'Creando...' : 'Crear'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contenido principal: Árbol + Panel de Items */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Árbol de Locaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              Estructura de Locaciones
            </CardTitle>
            <CardDescription>
              Haz clic en una locación para ver sus items
            </CardDescription>
          </CardHeader>
          <CardContent>
            {arbol.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No hay locaciones registradas. Crea una nueva para comenzar.
              </p>
            ) : (
              <div className="space-y-1">
                {arbol.map((loc) => (
                  <NodoLocacion 
                    key={loc.id} 
                    locacion={loc} 
                    nivel={0}
                    onEliminar={handleEliminar}
                    onSeleccionar={cargarItemsDeLocacion}
                    seleccionadaId={locacionSeleccionada?.id}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Panel de Items de la Locación */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {locacionSeleccionada 
                    ? `Items en ${locacionSeleccionada.nombre}`
                    : 'Items en Locación'
                  }
                </CardTitle>
                <CardDescription>
                  {locacionSeleccionada 
                    ? `${itemsEnLocacion.length} item(s) registrado(s)`
                    : 'Selecciona una locación para ver sus items'
                  }
                </CardDescription>
              </div>
              {locacionSeleccionada && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setLocacionSeleccionada(null);
                    setItemsEnLocacion([]);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!locacionSeleccionada ? (
              <div className="text-center py-12 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Sin locación seleccionada</p>
                <p className="text-sm">Haz clic en una locación del árbol</p>
              </div>
            ) : cargandoItems ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
                <p className="text-muted-foreground">Cargando items...</p>
              </div>
            ) : itemsEnLocacion.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Sin items</p>
                <p className="text-sm">Esta locación no tiene items registrados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {itemsEnLocacion.map(({ stock, item }) => (
                  <div 
                    key={stock.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {item?.nombre || stock.sku}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          SKU: {stock.sku}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{stock.cantidadDisponible}</p>
                      <p className="text-xs text-muted-foreground">disponible</p>
                      {stock.cantidadReservada > 0 && (
                        <p className="text-xs text-amber-600">
                          {stock.cantidadReservada} reservado
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente recursivo para mostrar el árbol
interface NodoLocacionProps {
  locacion: LocacionConHijos;
  nivel: number;
  onEliminar: (id: string) => void;
  onSeleccionar: (locacion: Locacion) => void;
  seleccionadaId?: string;
}

function NodoLocacion({ locacion, nivel, onEliminar, onSeleccionar, seleccionadaId }: NodoLocacionProps) {
  const [expandido, setExpandido] = useState(true);
  const tieneHijos = locacion.hijos && locacion.hijos.length > 0;
  const estaSeleccionada = locacion.id === seleccionadaId;
  
  const esWarehouse = locacion.tipo === 'warehouse';
  const Icono = esWarehouse ? Building2 : Box;
  
  return (
    <div className="select-none">
      <div 
        className={`flex items-center gap-2 py-2 px-3 rounded-md cursor-pointer group transition-colors ${
          estaSeleccionada 
            ? 'bg-primary/10 border border-primary/30' 
            : 'hover:bg-muted/50'
        }`}
        style={{ paddingLeft: `${nivel * 24 + 12}px` }}
        onClick={() => onSeleccionar(locacion)}
      >
        {/* Toggle expandir */}
        {tieneHijos ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandido(!expandido);
            }}
            className="p-1 hover:bg-muted rounded"
          >
            <ChevronRight 
              className={`h-4 w-4 transition-transform ${expandido ? 'rotate-90' : ''}`} 
            />
          </button>
        ) : (
          <div className="w-6" />
        )}
        
        {/* Icono y nombre */}
        <Icono className={`h-4 w-4 ${esWarehouse ? 'text-blue-500' : 'text-amber-500'}`} />
        <span className={`font-medium flex-1 ${estaSeleccionada ? 'text-primary' : ''}`}>
          {locacion.nombre}
        </span>
        
        {/* Badge de tipo */}
        <Badge variant="outline" className="text-xs">
          {TIPO_LOCACION_LABELS[locacion.tipo]}
        </Badge>
        
        {/* Acciones */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onEliminar(locacion.id);
          }}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      
      {/* Hijos */}
      {tieneHijos && expandido && (
        <div>
          {locacion.hijos.map((hijo) => (
            <NodoLocacion 
              key={hijo.id} 
              locacion={hijo} 
              nivel={nivel + 1}
              onEliminar={onEliminar}
              onSeleccionar={onSeleccionar}
              seleccionadaId={seleccionadaId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Alias para compatibilidad
export { LocationsDashboard as SedesRecintosDashboard };
