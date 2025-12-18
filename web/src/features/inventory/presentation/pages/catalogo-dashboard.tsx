"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import { Badge } from '@/shared/ui/badges/badge';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/misc/tabs";
import {
  Settings,
  RefreshCw,
  AlertCircle,
  FolderTree,
  Tag,
  Bookmark,
  Package,
  Loader2,
  Search,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Edit2,
} from 'lucide-react';
import { useTaxonomy } from '../hooks/use-taxonomy';
import { getItemsClient } from '../../infrastructure/vessel/items.client';
import { getStockClient } from '../../infrastructure/vessel/stock.client';
import type { Item } from '../../domain/entities/item';
import type { ItemStock } from '../../domain/entities/stock';
import type { Termino } from '../../domain/entities/taxonomy';
import { useUoM } from '../hooks/use-uom';

// Configuración de vocabularios
const VOCABULARIOS_CONFIG = {
  categorias: { nombre: 'Categorías', slug: 'categorias', icon: FolderTree, singular: 'Categoría' },
  marcas: { nombre: 'Marcas', slug: 'marcas', icon: Tag, singular: 'Marca' },
  etiquetas: { nombre: 'Etiquetas', slug: 'etiquetas', icon: Bookmark, singular: 'Etiqueta' },
} as const;

type TabKey = keyof typeof VOCABULARIOS_CONFIG;

// Interface para nodo del árbol de términos
interface TerminoNodo extends Termino {
  hijos: TerminoNodo[];
}

// Construir árbol de términos
function construirArbolTerminos(terminos: Termino[]): TerminoNodo[] {
  const result: TerminoNodo[] = [];
  const map = new Map<string, TerminoNodo>();

  // Primero crear todos los nodos
  terminos.forEach(t => {
    map.set(t.id, { ...t, hijos: [] });
  });

  // Luego asignar hijos
  terminos.forEach(t => {
    const nodo = map.get(t.id)!;
    if (t.padreId && map.has(t.padreId)) {
      map.get(t.padreId)!.hijos.push(nodo);
    } else {
      result.push(nodo);
    }
  });

  return result;
}

export function CatalogoDashboard() {
  const {
    terminos,
    cargando,
    error,
    cargarTerminos,
    crearTermino,
    actualizarTermino,
    eliminarTermino,
    crearVocabulario,
    limpiarError,
  } = useTaxonomy();

  const [tabActiva, setTabActiva] = useState<TabKey>('categorias');
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [inicializando, setInicializando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Término seleccionado
  const [terminoSeleccionado, setTerminoSeleccionado] = useState<Termino | null>(null);
  const [itemsDelTermino, setItemsDelTermino] = useState<Item[]>([]);
  const [stockDeItems, setStockDeItems] = useState<Map<string, ItemStock[]>>(new Map());
  const [cargandoItems, setCargandoItems] = useState(false);

  // Formulario de crear/editar
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [terminoEditando, setTerminoEditando] = useState<Termino | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [nuevoPadreId, setNuevoPadreId] = useState<string>('');
  const [guardando, setGuardando] = useState(false);

  // Nodos expandidos
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

  const { unidades: uomList } = useUoM();
  const itemsClient = getItemsClient();
  const stockClient = getStockClient();

  // Ref para evitar recrear la función
  const cargarTabRef = useRef<((tab: TabKey) => Promise<void>) | null>(null);

  // Función para cargar - guardada en ref
  cargarTabRef.current = async (tab: TabKey) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setInicializando(true);
    limpiarError();
    setTerminoSeleccionado(null);
    setItemsDelTermino([]);

    const config = VOCABULARIOS_CONFIG[tab];

    try {
      await cargarTerminos({ vocabularioSlug: config.slug });
    } catch (err: any) {
      const esVocabularioNoEncontrado =
        err?.isVocabularyNotFound ||
        err?.code === 'VOCABULARY_NOT_FOUND' ||
        (err?.statusCode === 422 && err?.message?.toLowerCase()?.includes('vocabulary not found'));

      if (esVocabularioNoEncontrado) {
        try {
          await crearVocabulario({ nombre: config.nombre, slug: config.slug });
          limpiarError();
        } catch (createErr: any) {
          const esDuplicado =
            createErr?.code === 'DUPLICATE_VOCABULARY' ||
            createErr?.message?.toLowerCase()?.includes('duplicate') ||
            createErr?.message?.toLowerCase()?.includes('already exists');

          if (!esDuplicado) {
            console.error('[Catálogo] Error creando vocabulario:', createErr);
          }
          limpiarError();
        }
      }
    } finally {
      setInicializando(false);
    }
  };

  useEffect(() => {
    cargarTabRef.current?.(tabActiva);
  }, [tabActiva]);

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  // Obtener todos los IDs de un término y sus descendientes
  const obtenerIdsDescendientes = useCallback((terminoId: string): string[] => {
    const ids: string[] = [terminoId];

    const agregarHijos = (padreId: string) => {
      const hijos = terminos.filter(t => t.padreId === padreId);
      hijos.forEach(hijo => {
        ids.push(hijo.id);
        agregarHijos(hijo.id);
      });
    };

    agregarHijos(terminoId);
    return ids;
  }, [terminos]);

  // Cargar items cuando se selecciona un término (incluye subcategorías)
  const cargarItemsDelTermino = useCallback(async (termino: Termino) => {
    setTerminoSeleccionado(termino);
    setCargandoItems(true);
    setItemsDelTermino([]);
    setStockDeItems(new Map());

    try {
      // Obtener IDs del término seleccionado y todos sus descendientes
      const idsABuscar = obtenerIdsDescendientes(termino.id);

      // Cargar todos los items
      const { items: todosItems } = await itemsClient.listar();

      // Filtrar items que tengan CUALQUIERA de los términos (padre o hijos)
      const itemsFiltrados = todosItems.filter(item =>
        item.terminoIds?.some(tid => idsABuscar.includes(tid))
      );

      setItemsDelTermino(itemsFiltrados);

      // Cargar stock para cada item
      if (itemsFiltrados.length > 0) {
        const stockMap = new Map<string, ItemStock[]>();

        for (const item of itemsFiltrados) {
          try {
            const stockItems = await stockClient.listarItems({
              catalogoItemId: item.id,
            });
            stockMap.set(item.id, stockItems);
          } catch {
            stockMap.set(item.id, []);
          }
        }

        setStockDeItems(stockMap);
      }
    } catch (err) {
      console.error('Error cargando items del término:', err);
    } finally {
      setCargandoItems(false);
    }
  }, [itemsClient, stockClient, obtenerIdsDescendientes]);

  const handleTabChange = (value: string) => {
    setTabActiva(value as TabKey);
    setBusqueda('');
  };

  const handleRefresh = () => {
    cargarTabRef.current?.(tabActiva);
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

  // Abrir formulario para crear
  const abrirCrear = (padreId?: string) => {
    setTerminoEditando(null);
    setNuevoNombre('');
    setNuevaDescripcion('');
    setNuevoPadreId(padreId || '');
    setMostrarFormulario(true);
  };

  // Abrir formulario para editar
  const abrirEditar = (termino: Termino) => {
    setTerminoEditando(termino);
    setNuevoNombre(termino.nombre);
    setNuevaDescripcion(termino.descripcion || '');
    setNuevoPadreId(termino.padreId || '');
    setMostrarFormulario(true);
  };

  // Guardar término
  const handleGuardar = async () => {
    if (!nuevoNombre.trim()) return;

    setGuardando(true);
    const config = VOCABULARIOS_CONFIG[tabActiva];

    try {
      if (terminoEditando) {
        await actualizarTermino(terminoEditando.id, {
          nombre: nuevoNombre.trim(),
          descripcion: nuevaDescripcion.trim() || undefined,
          padreId: nuevoPadreId || undefined,
        });
      } else {
        await crearTermino({
          nombre: nuevoNombre.trim(),
          descripcion: nuevaDescripcion.trim() || undefined,
          padreId: nuevoPadreId || undefined,
          vocabularioSlug: config.slug,
        });
      }

      setMostrarFormulario(false);
      await cargarTerminos({ vocabularioSlug: config.slug });
    } catch (err) {
      console.error('Error guardando término:', err);
    } finally {
      setGuardando(false);
    }
  };

  // Eliminar término
  const handleEliminar = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;

    try {
      await eliminarTermino(id);
      if (terminoSeleccionado?.id === id) {
        setTerminoSeleccionado(null);
        setItemsDelTermino([]);
      }
      await cargarTerminos({ vocabularioSlug: VOCABULARIOS_CONFIG[tabActiva].slug });
    } catch (err) {
      console.error('Error eliminando término:', err);
    }
  };

  const configActivo = VOCABULARIOS_CONFIG[tabActiva];
  const IconActivo = configActivo.icon;

  // Construir árbol filtrado
  const arbolTerminos = useMemo(() => {
    const arbol = construirArbolTerminos(terminos);

    if (!busqueda.trim()) return arbol;

    // Filtrar recursivamente
    const filtrar = (nodos: TerminoNodo[]): TerminoNodo[] => {
      return nodos.reduce<TerminoNodo[]>((acc, nodo) => {
        const coincide = nodo.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const hijosFiltrados = filtrar(nodo.hijos);

        if (coincide || hijosFiltrados.length > 0) {
          acc.push({
            ...nodo,
            hijos: hijosFiltrados.length > 0 ? hijosFiltrados : nodo.hijos,
          });
        }

        return acc;
      }, []);
    };

    return filtrar(arbol);
  }, [terminos, busqueda]);

  // Calcular stock total de un item
  const calcularStockTotal = (itemId: string) => {
    const stocks = stockDeItems.get(itemId) || [];
    return stocks.reduce((acc, s) => ({
      total: acc.total + s.cantidad,
      reservado: acc.reservado + s.cantidadReservada,
      disponible: acc.disponible + s.cantidadDisponible,
    }), { total: 0, reservado: 0, disponible: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catálogo de Productos</h1>
          <p className="text-muted-foreground">
            Gestiona categorías, marcas y etiquetas de los items del FabLab.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMostrarConfig(!mostrarConfig)}
          >
            <Settings className="h-4 w-4 mr-1" />
            Config
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={cargando || inicializando}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${cargando || inicializando ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Config Panel */}
      {mostrarConfig && (
        <Card className="border-dashed mb-6">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Modo:</span>
                <Badge variant="default">Vessel API</Badge>
              </div>
              <span className="text-muted-foreground text-xs">
                {process.env.NEXT_PUBLIC_VESSEL_API_URL || 'http://127.0.0.1:8000'}
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <Badge variant="outline">{configActivo.slug}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Card className="border-destructive bg-destructive/10 mb-6">
          <CardContent className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
            <Button size="sm" variant="ghost" onClick={limpiarError}>
              Cerrar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={tabActiva} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="categorias" className="gap-1.5">
            <FolderTree className="h-4 w-4" />
            Categorías
          </TabsTrigger>
          <TabsTrigger value="marcas" className="gap-1.5">
            <Tag className="h-4 w-4" />
            Marcas
          </TabsTrigger>
          <TabsTrigger value="etiquetas" className="gap-1.5">
            <Bookmark className="h-4 w-4" />
            Etiquetas
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tabActiva} className="space-y-4">
          {inicializando ? (
            <Card className="min-h-[300px] flex items-center justify-center">
              <div className="text-center space-y-2">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Cargando {configActivo.nombre.toLowerCase()}...</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Lista de Términos (lado izquierdo) */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{configActivo.nombre}</CardTitle>
                    <Button size="sm" onClick={() => abrirCrear()}>
                      <Plus className="h-4 w-4 mr-1" />
                      Nuevo
                    </Button>
                  </div>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={`Buscar ${configActivo.singular.toLowerCase()}...`}
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {arbolTerminos.length === 0 ? (
                    <div className="text-center py-12">
                      <IconActivo className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                      <p className="font-medium text-muted-foreground">
                        {busqueda ? 'Sin resultados' : `Sin ${configActivo.nombre.toLowerCase()}`}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {busqueda ? 'Intenta con otro término' : `Crea una ${configActivo.singular.toLowerCase()} para comenzar`}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
                      {arbolTerminos.map((nodo) => (
                        <NodoTermino
                          key={nodo.id}
                          nodo={nodo}
                          nivel={0}
                          expandidos={expandidos}
                          onToggleExpandir={toggleExpandir}
                          onSeleccionar={cargarItemsDelTermino}
                          onEditar={abrirEditar}
                          onEliminar={handleEliminar}
                          onCrearHijo={abrirCrear}
                          seleccionadoId={terminoSeleccionado?.id}
                          icon={IconActivo}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Panel de Items (lado derecho) */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {terminoSeleccionado ? terminoSeleccionado.nombre : 'Items'}
                      </CardTitle>
                      <CardDescription>
                        {terminoSeleccionado
                          ? `${itemsDelTermino.length} items en esta ${configActivo.singular.toLowerCase()}`
                          : `Selecciona una ${configActivo.singular.toLowerCase()} para ver sus items`
                        }
                      </CardDescription>
                    </div>
                    {terminoSeleccionado && (
                      <Badge variant="secondary">
                        {itemsDelTermino.length} items
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!terminoSeleccionado ? (
                    <div className="text-center py-16">
                      <IconActivo className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                      <p className="text-muted-foreground">
                        Selecciona una {configActivo.singular.toLowerCase()} del panel izquierdo
                      </p>
                    </div>
                  ) : cargandoItems ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : itemsDelTermino.length === 0 ? (
                    <div className="text-center py-16">
                      <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                      <p className="font-medium text-muted-foreground">Sin items</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Esta {configActivo.singular.toLowerCase()} no tiene items asociados
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {itemsDelTermino.map((item) => {
                        const stock = calcularStockTotal(item.id);
                        const uom = item.uomId ? uomList.find(u => u.id === item.uomId || u.codigo === item.uomId) : null;
                        const unidadTexto = uom?.simbolo || uom?.nombre || 'un';

                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                          >
                            <div className="rounded-lg bg-primary/10 p-2.5">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                {item.codigo && (
                                  <span className="font-mono text-xs px-1.5 py-0.5 bg-slate-100 rounded">
                                    {item.codigo}
                                  </span>
                                )}
                                <p className="font-medium truncate">{item.nombre}</p>
                              </div>
                              {item.descripcion && (
                                <p className="text-sm text-muted-foreground truncate mt-0.5">
                                  {item.descripcion}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold">
                                {stock.disponible}
                                <span className="text-base font-medium text-muted-foreground ml-1">{unidadTexto}</span>
                              </p>
                              <p className="text-xs text-muted-foreground">disponibles</p>
                            </div>
                            {stock.reservado > 0 && (
                              <Badge variant="outline" className="text-amber-600 border-amber-300">
                                {stock.reservado} reservados
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de crear/editar término */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4">
            <CardHeader>
              <CardTitle>
                {terminoEditando ? `Editar ${configActivo.singular}` : `Nueva ${configActivo.singular}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre *</label>
                <Input
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder={`Nombre de la ${configActivo.singular.toLowerCase()}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descripción</label>
                <Input
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                  placeholder="Descripción opcional"
                />
              </div>
              {tabActiva === 'categorias' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoría padre</label>
                  <select
                    value={nuevoPadreId}
                    onChange={(e) => setNuevoPadreId(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border bg-background"
                  >
                    <option value="">Sin padre (raíz)</option>
                    {terminos.filter(t => t.id !== terminoEditando?.id).map(t => (
                      <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setMostrarFormulario(false)} disabled={guardando}>
                  Cancelar
                </Button>
                <Button onClick={handleGuardar} disabled={!nuevoNombre.trim() || guardando}>
                  {guardando && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                  {terminoEditando ? 'Guardar' : 'Crear'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Componente de nodo del árbol de términos
interface NodoTerminoProps {
  nodo: TerminoNodo;
  nivel: number;
  expandidos: Set<string>;
  onToggleExpandir: (id: string) => void;
  onSeleccionar: (termino: Termino) => void;
  onEditar: (termino: Termino) => void;
  onEliminar: (id: string, nombre: string) => void;
  onCrearHijo: (padreId: string) => void;
  seleccionadoId?: string;
  icon: typeof FolderTree;
}

function NodoTermino({
  nodo,
  nivel,
  expandidos,
  onToggleExpandir,
  onSeleccionar,
  onEditar,
  onEliminar,
  onCrearHijo,
  seleccionadoId,
  icon: Icon,
}: NodoTerminoProps) {
  const tieneHijos = nodo.hijos && nodo.hijos.length > 0;
  const estaExpandido = expandidos.has(nodo.id);
  const estaSeleccionado = nodo.id === seleccionadoId;

  return (
    <div>
      <div
        className={`group flex items-center gap-2 py-2 px-2 rounded-md cursor-pointer transition-all ${estaSeleccionado
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted'
          }`}
        style={{ paddingLeft: `${nivel * 16 + 8}px` }}
        onClick={() => onSeleccionar(nodo)}
      >
        {/* Toggle */}
        {tieneHijos ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpandir(nodo.id);
            }}
            className={`p-0.5 rounded hover:bg-black/10 ${estaSeleccionado ? 'hover:bg-white/20' : ''}`}
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
        <Icon className={`h-4 w-4 shrink-0 ${estaSeleccionado ? '' : 'text-primary'}`} />

        {/* Nombre */}
        <span className="flex-1 truncate text-sm font-medium">
          {nodo.nombre}
        </span>

        {/* Acciones (solo hover) */}
        <div className={`flex items-center gap-1 ${estaSeleccionado ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCrearHijo(nodo.id);
            }}
            className={`p-1 rounded hover:bg-black/10 ${estaSeleccionado ? 'hover:bg-white/20' : ''}`}
            title="Agregar sub-categoría"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditar(nodo);
            }}
            className={`p-1 rounded hover:bg-black/10 ${estaSeleccionado ? 'hover:bg-white/20' : ''}`}
            title="Editar"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEliminar(nodo.id, nodo.nombre);
            }}
            className={`p-1 rounded ${estaSeleccionado
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
          {nodo.hijos.map((hijo) => (
            <NodoTermino
              key={hijo.id}
              nodo={hijo}
              nivel={nivel + 1}
              expandidos={expandidos}
              onToggleExpandir={onToggleExpandir}
              onSeleccionar={onSeleccionar}
              onEditar={onEditar}
              onEliminar={onEliminar}
              onCrearHijo={onCrearHijo}
              seleccionadoId={seleccionadoId}
              icon={Icon}
            />
          ))}
        </div>
      )}
    </div>
  );
}
