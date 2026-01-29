/**
 * Modal de Detalle de Item
 * 
 * Muestra información completa del item incluyendo:
 * - Datos maestros (catálogo)
 * - Niveles de stock por ubicación
 * - Historial de movimientos (opcional/futuro)
 */

"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Item } from '../../../domain/entities/item';
import type { ItemStock } from '../../../domain/entities/stock';
import { getStockClient } from '../../../infrastructure/vessel/stock.client';
import { getLocationClient } from '../../../infrastructure/vessel/locations.client';
import { getItemsClient } from '../../../infrastructure/vessel/items.client';
import type { Locacion } from '../../../domain/entities/location';
import { formatDateShort } from '@/shared/helpers/date';
import { useUoM } from '../../../presentation/hooks/use-uom';
import { useTaxonomy } from '../../../presentation/hooks/use-taxonomy';
import { useSelectoresItem } from '../../../presentation/hooks/use-selectores-item';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/shared/ui/misc/dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/shared/ui/misc/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/tables/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/inputs/select';
import { Input } from '@/shared/ui/inputs/input';
import { Badge } from '@/shared/ui/badges/badge';
import { Button } from '@/shared/ui/buttons/button';
import {
    Package,
    MapPin,
    History,
    Tag,
    FileText,
    Loader2,
    Box,
    AlertCircle,
    Save,
    Plus,
    X,
    Check,
    Search,
    ChevronRight
} from 'lucide-react';

import type { Termino } from '../../../domain/entities/taxonomy';

// Helper para aplanar categorías con nivel de jerarquía
function aplanarCategoriasConNivel(categorias: Termino[]): (Termino & { displayNivel: number })[] {
    const result: (Termino & { displayNivel: number })[] = [];
    const raices = categorias.filter(c => !c.padreId);

    function agregarConHijos(cat: Termino, nivel: number) {
        result.push({ ...cat, displayNivel: nivel });
        const hijos = categorias.filter(c => c.padreId === cat.id);
        hijos.forEach(hijo => agregarConHijos(hijo, nivel + 1));
    }

    raices.forEach(raiz => agregarConHijos(raiz, 0));
    // Agregar huérfanos
    categorias.forEach(cat => {
        if (!result.find(r => r.id === cat.id)) {
            result.push({ ...cat, displayNivel: cat.nivel || 0 });
        }
    });

    return result;
}

interface DetalleItemModalProps {
    item: Item | null;
    abierto: boolean;
    onCerrar: () => void;
    onRegistrarMovimiento?: (item: Item) => void;
    onItemActualizado?: () => void;  // Callback when item is updated
}

export function DetalleItemModal({
    item,
    abierto,
    onCerrar,
    onRegistrarMovimiento,
    onItemActualizado,
}: DetalleItemModalProps) {
    const [stockItems, setStockItems] = useState<ItemStock[]>([]);
    const [locaciones, setLocaciones] = useState<Locacion[]>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State for inline category editing
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');
    const [marcaSeleccionada, setMarcaSeleccionada] = useState<string>('');
    const [tagsSeleccionados, setTagsSeleccionados] = useState<string[]>([]);
    const [guardandoCategorias, setGuardandoCategorias] = useState(false);
    const [categoriasModificadas, setCategoriasModificadas] = useState(false);
    const [busquedaCategoria, setBusquedaCategoria] = useState('');

    // Hooks for metadata
    const { unidades } = useUoM();
    const { terminos } = useTaxonomy();
    const selectores = useSelectoresItem();

    // Efecto para cargar datos cuando se abre el modal
    useEffect(() => {
        if (abierto && item) {
            cargarDatos();
            // No llamamos cargarTerminos() sin filtros - usamos selectores.categorias/marcas/tags
        }
    }, [abierto, item?.id]);

    // Efecto separado para inicializar estado de categorías DESPUÉS de que selectores cargue
    useEffect(() => {
        if (abierto && item && !selectores.cargando) {
            if (item.terminoIds && item.terminoIds.length > 0) {
                const catIds = selectores.categorias.map(c => c.id);
                const marcaIds = selectores.marcas.map(m => m.id);
                const tagIds = selectores.tags.map(t => t.id);

                setCategoriaSeleccionada(item.terminoIds.find(id => catIds.includes(id)) || '');
                setMarcaSeleccionada(item.terminoIds.find(id => marcaIds.includes(id)) || '');
                setTagsSeleccionados(item.terminoIds.filter(id => tagIds.includes(id)));
            } else {
                setCategoriaSeleccionada('');
                setMarcaSeleccionada('');
                setTagsSeleccionados([]);
            }
            setCategoriasModificadas(false);
        }
    }, [abierto, item?.id, selectores.cargando]);

    const cargarDatos = async () => {
        if (!item) return;

        setCargando(true);
        setError(null);

        try {
            const stockClient = getStockClient();
            const locationClient = getLocationClient();

            // Cargar stock y locaciones en paralelo
            const [stockRes, locsRes] = await Promise.all([
                stockClient.listarItems({ catalogoItemId: item.id }),
                locationClient.listar(),
            ]);

            setStockItems(stockRes);
            setLocaciones(locsRes);
        } catch (err) {
            console.error('Error cargando detalles:', err);
            setError('No se pudo cargar la información de stock.');
        } finally {
            setCargando(false);
        }
    };

    const getNombreLocacion = (id: string) => {
        return locaciones.find(l => l.id === id)?.nombre || id;
    };

    // Helper para UoM
    const getUomDisplay = (id: string) => {
        const uom = unidades.find(u => u.id === id || u.codigo === id);
        return uom ? `${uom.nombre} (${uom.simbolo})` : id;
    };

    // Helper para Terminos
    const getTerminoDisplay = (id: string) => {
        const term = terminos.find(t => t.id === id);
        return term ? term.nombre : id;
    };

    // Handler para cambiar categoría
    const handleCategoriaChange = (value: string) => {
        setCategoriaSeleccionada(value === '__none__' ? '' : value);
        setCategoriasModificadas(true);
    };

    // Handler para cambiar marca
    const handleMarcaChange = (value: string) => {
        setMarcaSeleccionada(value === '__none__' ? '' : value);
        setCategoriasModificadas(true);
    };

    // Toggle tag
    const toggleTag = (tagId: string) => {
        setTagsSeleccionados(prev =>
            prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
        );
        setCategoriasModificadas(true);
    };

    // Guardar categorías
    const guardarCategorias = async () => {
        if (!item) return;

        setGuardandoCategorias(true);
        try {
            const itemsClient = getItemsClient();
            const terminoIds: string[] = [];
            if (categoriaSeleccionada) terminoIds.push(categoriaSeleccionada);
            if (marcaSeleccionada) terminoIds.push(marcaSeleccionada);
            terminoIds.push(...tagsSeleccionados);

            await itemsClient.actualizar(item.id, {
                nombre: item.nombre,
                terminoIds,
            });

            // Al terminar, solo notificamos al padre para que recargue.
            // No modificamos estado local para prevenir desincronización
            onItemActualizado?.();
            onCerrar(); // Cerramos modal para forzar refresco limpio al reabrir
        } catch (err) {
            console.error('Error guardando categorías:', err);
            setError('Error guardando categorías');
        } finally {
            setGuardandoCategorias(false);
        }
    };

    const totalStock = stockItems.reduce((acc, curr) => acc + curr.cantidad, 0);
    const totalReservado = stockItems.reduce((acc, curr) => acc + curr.cantidadReservada, 0);
    const totalDisponible = totalStock - totalReservado;

    if (!item) return null;

    return (
        <Dialog open={abierto} onOpenChange={(open) => !open && onCerrar()}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <Package className="h-6 w-6 text-primary" />
                                {item.nombre}
                            </DialogTitle>
                            <DialogDescription className="mt-1 flex items-center gap-2">
                                <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                                    {item.codigo}
                                </span>
                                {item.uomId && (
                                    <Badge variant="outline" className="text-xs">
                                        {getUomDisplay(item.uomId)}
                                    </Badge>
                                )}
                                <Badge variant={item.estado === 'active' ? 'default' : 'secondary'}>
                                    {item.estado === 'active' ? 'Activo' : item.estado}
                                </Badge>
                            </DialogDescription>
                        </div>
                        {onRegistrarMovimiento && (
                            <Button onClick={() => onRegistrarMovimiento(item)}>
                                Registrar Movimiento
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <Tabs defaultValue="stock" className="mt-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="stock" className="gap-2">
                            <Box className="h-4 w-4" />
                            Stock ({totalDisponible})
                        </TabsTrigger>
                        <TabsTrigger value="categorias" className="gap-2">
                            <Tag className="h-4 w-4" />
                            Categorías
                        </TabsTrigger>
                        <TabsTrigger value="info" className="gap-2">
                            <FileText className="h-4 w-4" />
                            Información
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-2">
                            <History className="h-4 w-4" />
                            Historial
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB: STOCK */}
                    <TabsContent value="stock" className="space-y-4 pt-4">
                        {cargando ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : error ? (
                            <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-md">
                                <AlertCircle className="h-5 w-5" />
                                {error}
                            </div>
                        ) : stockItems.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                                <Box className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No hay stock registrado para este artículo.</p>
                                {onRegistrarMovimiento && (
                                    <Button variant="link" onClick={() => onRegistrarMovimiento(item)}>
                                        Registrar entrada inicial
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ubicación</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead className="text-right">Reservado</TableHead>
                                            <TableHead className="text-right">Disponible</TableHead>
                                            <TableHead className="text-right">Lote / Serie</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stockItems.map((stock) => (
                                            <TableRow key={stock.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        {getNombreLocacion(stock.ubicacionId)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {stock.cantidad}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-orange-600">
                                                    {stock.cantidadReservada > 0 ? stock.cantidadReservada : '-'}
                                                </TableCell>
                                                <TableCell className="text-right font-bold font-mono text-green-600">
                                                    {stock.cantidad - stock.cantidadReservada}
                                                </TableCell>
                                                <TableCell className="text-right text-xs text-muted-foreground">
                                                    {stock.numeroLote && `Lote: ${stock.numeroLote}`}
                                                    {stock.numeroSerie && <div className="block">SN: {stock.numeroSerie}</div>}
                                                    {!stock.numeroLote && !stock.numeroSerie && '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {/* Totales */}
                                        <TableRow className="bg-muted/50 font-medium">
                                            <TableCell>Total General</TableCell>
                                            <TableCell className="text-right">{totalStock}</TableCell>
                                            <TableCell className="text-right">{totalReservado}</TableCell>
                                            <TableCell className="text-right text-green-700">{totalDisponible}</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </TabsContent>

                    {/* TAB: CATEGORÍAS */}
                    <TabsContent value="categorias" className="space-y-4 pt-4">
                        <div className="space-y-6">
                            {/* Header con botón guardar */}
                            {categoriasModificadas && (
                                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                                    <span className="text-sm text-primary font-medium">
                                        Tienes cambios sin guardar
                                    </span>
                                    <Button
                                        size="sm"
                                        onClick={guardarCategorias}
                                        disabled={guardandoCategorias}
                                    >
                                        {guardandoCategorias ? (
                                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4 mr-1" />
                                        )}
                                        Guardar
                                    </Button>
                                </div>
                            )}

                            {/* Categoría */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Categoría</label>
                                <Select
                                    value={categoriaSeleccionada || '__none__'}
                                    onValueChange={handleCategoriaChange}
                                    disabled={selectores.cargando || guardandoCategorias}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sin categoría" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {/* Campo de búsqueda */}
                                        <div className="sticky top-0 p-2 bg-popover border-b">
                                            <div className="relative">
                                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Buscar categoría..."
                                                    value={busquedaCategoria}
                                                    onChange={(e) => setBusquedaCategoria(e.target.value)}
                                                    className="pl-8 h-9"
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        </div>
                                        <SelectItem value="__none__">Sin categoría</SelectItem>
                                        {aplanarCategoriasConNivel(selectores.categorias)
                                            .filter(cat =>
                                                !busquedaCategoria.trim() ||
                                                cat.nombre.toLowerCase().includes(busquedaCategoria.toLowerCase())
                                            )
                                            .map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    <span
                                                        className="flex items-center"
                                                        style={{ paddingLeft: cat.displayNivel * 12 }}
                                                    >
                                                        {cat.displayNivel > 0 && (
                                                            <ChevronRight className="h-3 w-3 mr-1 text-muted-foreground" />
                                                        )}
                                                        {cat.nombre}
                                                        <span className="ml-1 text-xs text-muted-foreground">
                                                            ({cat.conteoItems || 0})
                                                        </span>
                                                    </span>
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Marca */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Marca</label>
                                <Select
                                    value={marcaSeleccionada || '__none__'}
                                    onValueChange={handleMarcaChange}
                                    disabled={selectores.cargando || guardandoCategorias}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sin marca" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__none__">Sin marca</SelectItem>
                                        {selectores.marcas.map(marca => (
                                            <SelectItem key={marca.id} value={marca.id}>
                                                {marca.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Etiquetas */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Etiquetas</label>
                                <div className="flex flex-wrap gap-2 p-4 rounded-lg border-2 border-dashed bg-muted/20 min-h-[80px]">
                                    {selectores.tags.length === 0 ? (
                                        <p className="text-sm text-muted-foreground m-auto">
                                            No hay etiquetas disponibles
                                        </p>
                                    ) : (
                                        selectores.tags.map(tag => (
                                            <Badge
                                                key={tag.id}
                                                variant={tagsSeleccionados.includes(tag.id) ? 'default' : 'outline'}
                                                className="cursor-pointer h-8 px-3"
                                                onClick={() => toggleTag(tag.id)}
                                            >
                                                {tag.nombre}
                                                {tagsSeleccionados.includes(tag.id) && (
                                                    <Check className="h-3 w-3 ml-1" />
                                                )}
                                            </Badge>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB: INFO */}
                    <TabsContent value="info" className="space-y-6 pt-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h4>
                                    <p className="p-3 bg-muted/50 rounded-md text-sm">
                                        {item.descripcion || <span className="text-muted-foreground italic">Sin descripción</span>}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Notas Internas</h4>
                                    <div className="p-3 bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-200/50 dark:border-yellow-900/20 rounded-md flex gap-2">
                                        <FileText className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                                        <p className="text-sm text-foreground/80">
                                            {item.notas || <span className="text-muted-foreground italic">No hay notas registradas.</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="border rounded-md p-4 space-y-3">
                                    <h4 className="text-sm font-medium mb-3">Detalles Técnicos</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="text-muted-foreground">Unidad de Medida:</span>
                                        <span className="font-medium text-right">{item.uomId ? getUomDisplay(item.uomId) : '-'}</span>

                                        <span className="text-muted-foreground">Creado el:</span>
                                        <span className="text-right">{formatDateShort(item.creadoEn)}</span>

                                        <span className="text-muted-foreground">Última actualización:</span>
                                        <span className="text-right">{formatDateShort(item.actualizadoEn)}</span>
                                    </div>
                                </div>

                                {item.terminoIds && item.terminoIds.length > 0 && (
                                    <div className="border rounded-md p-4">
                                        <h4 className="text-sm font-medium mb-3">Etiquetas y Clasificación</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {item.terminoIds.map(id => (
                                                <Badge key={id} variant="secondary" className="text-xs">
                                                    {getTerminoDisplay(id)}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB: HISTORIAL */}
                    <TabsContent value="history" className="pt-4">
                        <div className="text-center py-8 border-2 border-dashed rounded-lg">
                            <History className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">Historial de movimientos disponible próximamente.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
