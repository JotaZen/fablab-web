/**
 * Dashboard de Locaciones
 * 
 * Gestión de ubicaciones físicas del inventario:
 * - Locaciones: Bodegas, laboratorios, talleres, etc.
 * - Unidades de Almacenamiento: Estantes, cajones, repisas, etc.
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
  Plus,
  ChevronRight,
  ChevronDown,
  Trash2,
  Package,
  Loader2,
  Search,
  MapPin,
  FolderPlus,
  AlertCircle,
} from 'lucide-react';
import { 
  getLocationClient,
} from '../../infrastructure/vessel/locations.client';
import type { 
  Locacion,
  LocacionConHijos,
} from '../../domain/entities/location';
import { TIPO_LOCACION_LABELS } from '../../domain/labels';
import { getStockClient } from '../../infrastructure/vessel/stock.client';
import { getItemsClient } from '../../infrastructure/vessel/items.client';
import type { ItemStock } from '../../domain/entities/stock';
import type { Item } from '../../domain/entities/item';

export function LocationsDashboard() {
  const [locaciones, setLocaciones] = useState<Locacion[]>([]);
  const [arbol, setArbol] = useState<LocacionConHijos[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  
  // Modal de crear
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState<'warehouse' | 'storage_unit'>('warehouse');
  const [nuevoPadreId, setNuevoPadreId] = useState<string>('');
  const [creando, setCreando] = useState(false);

  // Locación seleccionada
  const [locacionSeleccionada, setLocacionSeleccionada] = useState<Locacion | null>(null);
  const [itemsEnLocacion, setItemsEnLocacion] = useState<Array<{ stock: ItemStock; item?: Item }>>([]);
  const [cargandoItems, setCargandoItems] = useState(false);

  // Nodos expandidos
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

  const locationClient = getLocationClient();
  const stockClient = getStockClient();
  const itemsClient = getItemsClient();

  // Cargar datos
  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);
    
    try {
      const todas = await locationClient.listar();
      setLocaciones(todas);
      
      const arbolData = await locationClient.obtenerArbol();
      setArbol(arbolData);
      
      // Expandir todos por defecto si son pocos
      if (arbolData.length <= 5) {
        const ids = new Set<string>();
        const agregarIds = (items: LocacionConHijos[]) => {
          items.forEach(item => {
            ids.add(item.id);
            if (item.hijos) agregarIds(item.hijos);
          });
        };
        agregarIds(arbolData);
        setExpandidos(ids);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar locaciones');
    } finally {
      setCargando(false);
    }
  }, [locationClient]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Cargar items de una locación
  const cargarItems = useCallback(async (locacion: Locacion) => {
    setLocacionSeleccionada(locacion);
    setCargandoItems(true);
    setItemsEnLocacion([]);

    try {
      const stockItems = await stockClient.listarItems({ ubicacionId: locacion.id });
      const itemsRes = await itemsClient.listar().catch(() => ({ items: [], total: 0 }));
      const catalogoItems = Array.isArray(itemsRes) ? itemsRes : (itemsRes.items || []);
      
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

  // Crear locación
  const handleCrear = async () => {
    if (!nuevoNombre.trim()) return;
    
    setCreando(true);
    try {
      await locationClient.crear({
        nombre: nuevoNombre.trim(),
        tipo: nuevoTipo,
        padreId: nuevoPadreId || undefined,
      });
      
      setNuevoNombre('');
      setNuevoTipo('warehouse');
      setNuevoPadreId('');
      setMostrarModal(false);
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear');
    } finally {
      setCreando(false);
    }
  };

  // Eliminar locación
  const handleEliminar = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
    
    try {
      await locationClient.eliminar(id);
      if (locacionSeleccionada?.id === id) {
        setLocacionSeleccionada(null);
        setItemsEnLocacion([]);
      }
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  // Toggle expandir
  const toggleExpandir = (id: string) => {
    setExpandidos(prev => {
      const nuevo = new Set(prev);
      if (nuevo.has(id)) {
        nuevo.delete(id);
      } else {
        nuevo.add(id);
      }
      return nuevo;
    });
  };

  // Filtrar árbol por búsqueda
  const filtrarArbol = (items: LocacionConHijos[], termino: string): LocacionConHijos[] => {
    if (!termino) return items;
    
    return items.reduce<LocacionConHijos[]>((acc, item) => {
      const coincide = item.nombre.toLowerCase().includes(termino.toLowerCase());
      const hijosFiltrados = item.hijos ? filtrarArbol(item.hijos, termino) : [];
      
      if (coincide || hijosFiltrados.length > 0) {
        acc.push({
          ...item,
          hijos: hijosFiltrados.length > 0 ? hijosFiltrados : item.hijos,
        });
      }
      
      return acc;
    }, []);
  };

  const arbolFiltrado = filtrarArbol(arbol, busqueda);
  const locacionesParaPadre = locaciones.filter(l => l.tipo === 'warehouse');
  
  const totalLocaciones = locaciones.filter(l => l.tipo === 'warehouse').length;
  const totalUnidades = locaciones.filter(l => l.tipo === 'storage_unit').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Locaciones</h1>
          <p className="text-muted-foreground">
            Gestiona las ubicaciones físicas del inventario
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={cargarDatos} variant="outline" size="sm" disabled={cargando}>
            <RefreshCw className={`mr-2 h-4 w-4 ${cargando ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={() => setMostrarModal(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Locación
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalLocaciones}</p>
              <p className="text-sm text-muted-foreground">Locaciones</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-amber-100 p-3">
              <Box className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalUnidades}</p>
              <p className="text-sm text-muted-foreground">Unidades de Almacenamiento</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error */}
      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive flex-1">{error}</p>
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>
              Cerrar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Contenido principal */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Lista de Locaciones */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Estructura</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar locación..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            {cargando ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : arbolFiltrado.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="font-medium text-muted-foreground">
                  {busqueda ? 'Sin resultados' : 'Sin locaciones'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {busqueda ? 'Intenta con otro término' : 'Crea una locación para comenzar'}
                </p>
              </div>
            ) : (
              <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
                {arbolFiltrado.map((loc) => (
                  <NodoLocacion 
                    key={loc.id} 
                    locacion={loc} 
                    nivel={0}
                    expandidos={expandidos}
                    onToggleExpandir={toggleExpandir}
                    onEliminar={handleEliminar}
                    onSeleccionar={cargarItems}
                    seleccionadaId={locacionSeleccionada?.id}
                    onCrearHijo={(padreId) => {
                      setNuevoPadreId(padreId);
                      setNuevoTipo('storage_unit');
                      setMostrarModal(true);
                    }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Panel de detalle */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {locacionSeleccionada ? locacionSeleccionada.nombre : 'Detalle de Locación'}
                </CardTitle>
                <CardDescription>
                  {locacionSeleccionada 
                    ? `${TIPO_LOCACION_LABELS[locacionSeleccionada.tipo]} • ${itemsEnLocacion.length} items`
                    : 'Selecciona una locación para ver sus detalles'
                  }
                </CardDescription>
              </div>
              {locacionSeleccionada && (
                <Badge variant={locacionSeleccionada.tipo === 'warehouse' ? 'default' : 'secondary'}>
                  {TIPO_LOCACION_LABELS[locacionSeleccionada.tipo]}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!locacionSeleccionada ? (
              <div className="text-center py-16">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground">
                  Selecciona una locación del panel izquierdo
                </p>
              </div>
            ) : cargandoItems ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : itemsEnLocacion.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="font-medium text-muted-foreground">Sin items registrados</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Esta locación no tiene items en stock
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {itemsEnLocacion.map(({ stock, item }) => (
                  <div 
                    key={stock.id}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {item?.nombre || 'Item sin nombre'}
                      </p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {stock.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{stock.cantidadDisponible}</p>
                      <p className="text-xs text-muted-foreground">disponibles</p>
                    </div>
                    {stock.cantidadReservada > 0 && (
                      <Badge variant="outline" className="text-amber-600 border-amber-300">
                        {stock.cantidadReservada} reservados
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de crear */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setMostrarModal(false)}
          />
          <Card className="relative w-full max-w-md mx-4 animate-in fade-in zoom-in-95">
            <CardHeader>
              <CardTitle>Nueva Locación</CardTitle>
              <CardDescription>
                Agrega una nueva ubicación al inventario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre *</label>
                <Input
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder="Ej: Bodega Principal, Estante A1..."
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <select
                  value={nuevoTipo}
                  onChange={(e) => setNuevoTipo(e.target.value as 'warehouse' | 'storage_unit')}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="warehouse">Locación (puede contener sub-locaciones)</option>
                  <option value="storage_unit">Unidad de Almacenamiento</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Ubicar dentro de (opcional)</label>
                <select
                  value={nuevoPadreId}
                  onChange={(e) => setNuevoPadreId(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Ninguna (nivel raíz)</option>
                  {locacionesParaPadre.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.nombre}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setMostrarModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCrear} 
                  disabled={!nuevoNombre.trim() || creando}
                  className="flex-1"
                >
                  {creando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    'Crear Locación'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Componente de nodo del árbol
interface NodoLocacionProps {
  locacion: LocacionConHijos;
  nivel: number;
  expandidos: Set<string>;
  onToggleExpandir: (id: string) => void;
  onEliminar: (id: string, nombre: string) => void;
  onSeleccionar: (locacion: Locacion) => void;
  seleccionadaId?: string;
  onCrearHijo: (padreId: string) => void;
}

function NodoLocacion({ 
  locacion, 
  nivel, 
  expandidos,
  onToggleExpandir,
  onEliminar, 
  onSeleccionar, 
  seleccionadaId,
  onCrearHijo,
}: NodoLocacionProps) {
  const tieneHijos = locacion.hijos && locacion.hijos.length > 0;
  const estaExpandido = expandidos.has(locacion.id);
  const estaSeleccionada = locacion.id === seleccionadaId;
  
  const esLocacion = locacion.tipo === 'warehouse';
  const Icono = esLocacion ? Building2 : Box;
  
  return (
    <div>
      <div 
        className={`group flex items-center gap-2 py-2 px-2 rounded-md cursor-pointer transition-all ${
          estaSeleccionada 
            ? 'bg-primary text-primary-foreground' 
            : 'hover:bg-muted'
        }`}
        style={{ paddingLeft: `${nivel * 16 + 8}px` }}
        onClick={() => onSeleccionar(locacion)}
      >
        {/* Toggle */}
        {tieneHijos ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpandir(locacion.id);
            }}
            className={`p-0.5 rounded hover:bg-black/10 ${estaSeleccionada ? 'hover:bg-white/20' : ''}`}
          >
            {estaExpandido ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}
        
        {/* Icono */}
        <Icono className={`h-4 w-4 shrink-0 ${
          estaSeleccionada 
            ? '' 
            : esLocacion ? 'text-blue-500' : 'text-amber-500'
        }`} />
        
        {/* Nombre */}
        <span className="flex-1 truncate text-sm font-medium">
          {locacion.nombre}
        </span>
        
        {/* Acciones (solo hover) */}
        <div className={`flex items-center gap-1 ${estaSeleccionada ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
          {esLocacion && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCrearHijo(locacion.id);
              }}
              className={`p-1 rounded hover:bg-black/10 ${estaSeleccionada ? 'hover:bg-white/20' : ''}`}
              title="Agregar sub-locación"
            >
              <FolderPlus className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEliminar(locacion.id, locacion.nombre);
            }}
            className={`p-1 rounded ${
              estaSeleccionada 
                ? 'hover:bg-white/20 text-primary-foreground' 
                : 'hover:bg-destructive/10 text-destructive'
            }`}
            title="Eliminar"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      
      {/* Hijos */}
      {tieneHijos && estaExpandido && (
        <div>
          {locacion.hijos.map((hijo) => (
            <NodoLocacion 
              key={hijo.id} 
              locacion={hijo} 
              nivel={nivel + 1}
              expandidos={expandidos}
              onToggleExpandir={onToggleExpandir}
              onEliminar={onEliminar}
              onSeleccionar={onSeleccionar}
              seleccionadaId={seleccionadaId}
              onCrearHijo={onCrearHijo}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Alias para compatibilidad
export { LocationsDashboard as SedesRecintosDashboard };
