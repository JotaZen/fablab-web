/**
 * Tabla de Items del Catálogo (Enhanced)
 * 
 * Muestra la lista de artículos con stock, categorías, y acciones
 */

"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Badge } from '@/shared/ui/badges/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/tables/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/misc/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/inputs/select';
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  Package,
  Loader2,
  Filter,
  X,
  MapPin,
  Tag,
} from 'lucide-react';
import type { Item, EstadoItem } from '../../../domain/entities/item';
import type { ItemStock } from '../../../domain/entities/stock';
import type { Termino } from '../../../domain/entities/taxonomy';
import { ESTADO_ITEM_LABELS } from '../../../domain/labels';
import { getStockClient } from '../../../infrastructure/vessel/stock.client';
import { useTaxonomy } from '../../hooks/use-taxonomy';
import { useUoM } from '../../hooks/use-uom';

interface TablaItemsProps {
  items: Item[];
  cargando: boolean;
  onBuscar: (termino: string) => void;
  onCrear: () => void;
  onEditar: (item: Item) => void;
  onEliminar: (item: Item) => void;
  onVerStock?: (item: Item) => void;
}

const BADGE_VARIANTS: Record<EstadoItem, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'default',
  draft: 'secondary',
  archived: 'outline',
};

interface StockAgregado {
  total: number;
  reservado: number;
  disponible: number;
  ubicaciones: string[];
}

export function TablaItems({
  items,
  cargando,
  onBuscar,
  onCrear,
  onEditar,
  onEliminar,
  onVerStock,
}: TablaItemsProps) {
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>('all');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('all');

  // Stock data
  const [stockData, setStockData] = useState<Map<string, StockAgregado>>(new Map());
  const [cargandoStock, setCargandoStock] = useState(false);

  // Categorías/términos
  const { terminos, cargarTerminos } = useTaxonomy();
  const { unidades } = useUoM();

  // Cargar términos de categorías
  useEffect(() => {
    cargarTerminos({ vocabularioSlug: 'categorias' });
  }, []);

  // Cargar stock para todos los items
  useEffect(() => {
    const cargarStock = async () => {
      if (items.length === 0) return;

      setCargandoStock(true);
      const stockClient = getStockClient();
      const nuevoStock = new Map<string, StockAgregado>();

      try {
        // Cargar todo el stock de una vez
        const todosStockItems = await stockClient.listarItems({});

        // Agrupar por catalog_item_id
        const porItem = new Map<string, ItemStock[]>();
        todosStockItems.forEach(stock => {
          const itemId = stock.catalogoItemId;
          if (itemId) {
            const existing = porItem.get(itemId) || [];
            existing.push(stock);
            porItem.set(itemId, existing);
          }
        });

        // Calcular agregados
        items.forEach(item => {
          const stocks = porItem.get(item.id) || [];
          const ubicaciones = new Set<string>();
          let total = 0, reservado = 0, disponible = 0;

          stocks.forEach(s => {
            total += s.cantidad || 0;
            reservado += s.cantidadReservada || 0;
            disponible += s.cantidadDisponible || (s.cantidad - s.cantidadReservada) || 0;
            // TODO: Obtener nombre de ubicación
            if (s.ubicacionId) ubicaciones.add(s.ubicacionId.slice(0, 8));
          });

          nuevoStock.set(item.id, {
            total,
            reservado,
            disponible,
            ubicaciones: Array.from(ubicaciones),
          });
        });

        setStockData(nuevoStock);
      } catch (err) {
        console.error('Error cargando stock:', err);
      } finally {
        setCargandoStock(false);
      }
    };

    cargarStock();
  }, [items]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar(busqueda);
  };

  // Obtener nombre de término por ID
  const getNombreTermino = (terminoId: string): string => {
    const termino = terminos.find(t => t.id === terminoId);
    return termino?.nombre || '';
  };

  // Obtener símbolo de UoM
  const getUomSimbolo = (uomId?: string): string => {
    if (!uomId) return 'un';
    const uom = unidades.find(u => u.id === uomId || u.codigo === uomId);
    return uom?.simbolo || uom?.nombre || 'un';
  };

  // Items filtrados
  const itemsFiltrados = useMemo(() => {
    return items.filter(item => {
      // Filtro por estado
      if (filtroEstado !== 'all' && item.estado !== filtroEstado) return false;

      // Filtro por categoría
      if (filtroCategoria !== 'all') {
        if (!item.terminoIds?.includes(filtroCategoria)) return false;
      }

      return true;
    });
  }, [items, filtroEstado, filtroCategoria]);

  const hayFiltrosActivos = filtroEstado !== 'all' || filtroCategoria !== 'all';

  const limpiarFiltros = () => {
    setFiltroEstado('all');
    setFiltroCategoria('all');
  };

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y acciones */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <form onSubmit={handleBuscar} className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar artículos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary">
            Buscar
          </Button>
        </form>

        <div className="flex gap-2">
          <Button
            variant={mostrarFiltros ? "secondary" : "outline"}
            size="sm"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filtros
            {hayFiltrosActivos && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                !
              </Badge>
            )}
          </Button>
          <Button onClick={onCrear}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Artículo
          </Button>
        </div>
      </div>

      {/* Panel de Filtros */}
      {mostrarFiltros && (
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Estado:</span>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="archived">Archivado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Categoría:</span>
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {terminos.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hayFiltrosActivos && (
            <Button variant="ghost" size="sm" onClick={limpiarFiltros}>
              <X className="h-4 w-4 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </div>
      )}

      {/* Tabla */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead>Artículo</TableHead>
              <TableHead className="hidden lg:table-cell">Categoría</TableHead>
              <TableHead className="text-right w-[120px]">Stock</TableHead>
              <TableHead className="hidden md:table-cell w-[100px]">Ubicaciones</TableHead>
              <TableHead className="w-[100px]">Estado</TableHead>
              <TableHead className="w-[120px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cargando ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground">Cargando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : itemsFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {hayFiltrosActivos ? 'No hay artículos con estos filtros' : 'No hay artículos'}
                    </span>
                    {!hayFiltrosActivos && (
                      <Button variant="outline" size="sm" onClick={onCrear}>
                        Crear primer artículo
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              itemsFiltrados.map((item) => {
                const stock = stockData.get(item.id);
                const uomSimbolo = getUomSimbolo(item.uomId);
                const categorias = item.terminoIds?.map(getNombreTermino).filter(Boolean) || [];

                return (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-sm">
                      {item.codigo || '-'}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.nombre}</p>
                        {item.descripcion && (
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {item.descripcion}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {categorias.length > 0 ? (
                          categorias.slice(0, 2).map((cat, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {cat}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                        {categorias.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{categorias.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {cargandoStock ? (
                        <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                      ) : stock ? (
                        <div>
                          <p className="font-bold text-lg">
                            {stock.disponible}
                            <span className="text-sm font-normal text-muted-foreground ml-1">
                              {uomSimbolo}
                            </span>
                          </p>
                          {stock.reservado > 0 && (
                            <p className="text-xs text-amber-600">
                              {stock.reservado} reservados
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">0 {uomSimbolo}</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {stock && stock.ubicaciones.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{stock.ubicaciones.length}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={BADGE_VARIANTS[item.estado]}>
                        {ESTADO_ITEM_LABELS[item.estado]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Botón Ver Stock visible */}
                        {onVerStock && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onVerStock(item)}
                            title="Ver detalle de stock"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditar(item)}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onEliminar(item)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Info de resultados */}
      {!cargando && itemsFiltrados.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Mostrando {itemsFiltrados.length} de {items.length} artículo{items.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
