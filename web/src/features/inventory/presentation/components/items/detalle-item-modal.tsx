/**
 * Modal de Detalle de Item
 * 
 * Muestra información completa del item incluyendo:
 * - Datos maestros (catálogo)
 * - Niveles de stock por ubicación
 * - Historial de movimientos (opcional/futuro)
 */

"use client";

import { useState, useEffect } from 'react';
import type { Item } from '../../../domain/entities/item';
import type { ItemStock } from '../../../domain/entities/stock';
import { getStockClient } from '../../../infrastructure/vessel/stock.client';
import { getLocationClient } from '../../../infrastructure/vessel/locations.client';
import type { Locacion } from '../../../domain/entities/location';
import { formatDateShort } from '@/shared/helpers/date';
import { useUoM } from '../../../presentation/hooks/use-uom';
import { useTaxonomy } from '../../../presentation/hooks/use-taxonomy';
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
    AlertCircle
} from 'lucide-react';

interface DetalleItemModalProps {
    item: Item | null;
    abierto: boolean;
    onCerrar: () => void;
    onRegistrarMovimiento?: (item: Item) => void;
}

export function DetalleItemModal({
    item,
    abierto,
    onCerrar,
    onRegistrarMovimiento,
}: DetalleItemModalProps) {
    const [stockItems, setStockItems] = useState<ItemStock[]>([]);
    const [locaciones, setLocaciones] = useState<Locacion[]>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Hooks for metadata
    const { unidades } = useUoM();
    const { terminos, cargarTerminos } = useTaxonomy();

    useEffect(() => {
        if (abierto && item) {
            cargarDatos();
            // Cargar términos para decodificar etiquetas
            cargarTerminos().catch(console.error);
        }
    }, [abierto, item]);

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
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="stock" className="gap-2">
                            <Box className="h-4 w-4" />
                            Stock ({totalDisponible})
                        </TabsTrigger>
                        <TabsTrigger value="info" className="gap-2">
                            <Tag className="h-4 w-4" />
                            Información
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-2" disabled>
                            <History className="h-4 w-4" />
                            Historial (Pronto)
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
                        {/* Contenido futuro */}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
