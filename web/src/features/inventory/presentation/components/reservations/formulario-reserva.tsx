/**
 * Formulario de Reserva de Stock
 * 
 * Modal para crear una nueva reserva de inventario.
 */

"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Label } from '@/shared/ui/labels/label';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/misc/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/inputs/select';
import {
    Loader2,
    CalendarClock,
    Package,
    User,
    Briefcase,
    MapPin,
} from 'lucide-react';
import { useToast } from '@/shared/ui/feedback/toast-provider';
import { getItemsClient } from '../../../infrastructure/vessel/items.client';
import { getLocationClient } from '../../../infrastructure/vessel/locations.client';
import { getStockClient } from '../../../infrastructure/vessel/stock.client';
import { useReservations } from '../../hooks/use-reservations';
import type { Item } from '../../../domain/entities/item';
import type { Locacion } from '../../../domain/entities/location';
import type { ItemStock } from '../../../domain/entities/stock';
import type { EstadoReserva } from '../../../domain/entities/reservation';

interface FormularioReservaProps {
    abierto: boolean;
    onCerrar: () => void;
    onExito?: () => void;
    stockItemId?: string;  // Pre-seleccionar stock item
}

const TIPOS_REFERENCIA = [
    { value: 'proyecto', label: 'Proyecto' },
    { value: 'orden', label: 'Orden de trabajo' },
    { value: 'cliente', label: 'Cliente' },
    { value: 'otro', label: 'Otro' },
];

export function FormularioReserva({
    abierto,
    onCerrar,
    onExito,
    stockItemId: stockItemIdInicial,
}: FormularioReservaProps) {
    // Data
    const [items, setItems] = useState<Item[]>([]);
    const [ubicaciones, setUbicaciones] = useState<Locacion[]>([]);
    const [stockItems, setStockItems] = useState<ItemStock[]>([]);
    const [cargandoData, setCargandoData] = useState(true);

    // Form state
    const [stockItemId, setStockItemId] = useState(stockItemIdInicial || '');
    const [itemId, setItemId] = useState('');
    const [ubicacionId, setUbicacionId] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [reservadoPor, setReservadoPor] = useState('');
    const [tipoReferencia, setTipoReferencia] = useState<string>('');
    const [referenciaNombre, setReferenciaNombre] = useState('');
    const [fechaExpiracion, setFechaExpiracion] = useState('');
    const [notas, setNotas] = useState('');
    const [estado, setEstado] = useState<EstadoReserva>('pendiente');

    const [guardando, setGuardando] = useState(false);

    const toast = useToast();
    const { crear } = useReservations();
    const itemsClient = getItemsClient();
    const locationClient = getLocationClient();
    const stockClient = getStockClient();

    // Cargar datos iniciales
    useEffect(() => {
        if (abierto) cargarDatos();
    }, [abierto]);

    useEffect(() => {
        if (stockItemIdInicial) {
            setStockItemId(stockItemIdInicial);
        }
    }, [stockItemIdInicial]);

    // Cargar stock cuando cambia item
    useEffect(() => {
        if (itemId) {
            cargarStock();
        } else {
            setStockItems([]);
            setStockItemId('');
        }
    }, [itemId]);

    const cargarDatos = async () => {
        setCargandoData(true);
        try {
            const [itemsRes, locsRes] = await Promise.all([
                itemsClient.listar(),
                locationClient.listar(),
            ]);
            const itemsList = Array.isArray(itemsRes) ? itemsRes : (itemsRes.items || []);
            setItems(itemsList);
            setUbicaciones(locsRes);
        } catch (err) {
            console.error('Error cargando datos:', err);
        } finally {
            setCargandoData(false);
        }
    };

    const cargarStock = async () => {
        try {
            const stocks = await stockClient.listarItems({
                catalogoItemId: itemId,
            });
            // Ordenar por disponibilidad descendente
            const sorted = stocks.sort((a, b) => b.cantidadDisponible - a.cantidadDisponible);
            setStockItems(sorted);

            // Auto seleccionar el mejor (o cualquiera si pending)
            if (sorted.length > 0) {
                setStockItemId(sorted[0].id);
            } else {
                setStockItemId('');
            }
        } catch (err) {
            console.error('Error cargando stock:', err);
        }
    };

    const stockSeleccionado = useMemo(() => {
        return stockItems.find(s => s.id === stockItemId);
    }, [stockItems, stockItemId]);

    const disponible = useMemo(() => {
        return stockItems.reduce((acc, curr) => acc + curr.cantidadDisponible, 0);
    }, [stockItems]);

    const cantidadNum = parseFloat(cantidad) || 0;

    // Validación
    const puedeGuardar = useMemo(() => {
        if (!stockItemId) return false;
        if (!cantidad || cantidadNum <= 0) return false;
        if (cantidadNum > disponible) return false;
        if (!reservadoPor.trim()) return false;
        return true;
    }, [stockItemId, cantidad, cantidadNum, disponible, reservadoPor]);

    const resetForm = () => {
        setStockItemId(stockItemIdInicial || '');
        setItemId('');
        setUbicacionId('');
        setCantidad('');
        setReservadoPor('');
        setTipoReferencia('');
        setReferenciaNombre('');
        setFechaExpiracion('');
        setNotas('');
        setStockItems([]);
    };

    const handleSubmit = async () => {
        if (!puedeGuardar) {
            toast.warning('Completa los campos requeridos');
            return;
        }

        setGuardando(true);
        try {
            await crear({
                stockItemId,
                cantidad: cantidadNum,
                reservadoPor: reservadoPor.trim(),
                tipoReferencia: tipoReferencia as 'proyecto' | 'orden' | 'cliente' | 'otro' | undefined,
                referenciaNombre: referenciaNombre.trim() || undefined,
                fechaExpiracion: fechaExpiracion || undefined,
                notas: notas.trim() || undefined,
                estado: estado,
            });

            resetForm();
            onExito?.();
            onCerrar();
        } catch (err: any) {
            // El hook ya maneja el toast de error
            console.error('Error creando reserva:', err);
        } finally {
            setGuardando(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onCerrar();
            setTimeout(resetForm, 200);
        }
    };

    return (
        <Dialog open={abierto} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CalendarClock className="h-5 w-5 text-blue-600" />
                        Nueva Reserva
                    </DialogTitle>
                </DialogHeader>

                {cargandoData ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        {/* Selección de Item */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5">
                                <Package className="h-3.5 w-3.5" />
                                Artículo *
                            </Label>
                            <Select value={itemId} onValueChange={setItemId} disabled={guardando}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {items.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>
                                            {item.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Stock disponible - Totalizado */}
                        {itemId && (
                            <div className="rounded-lg border bg-blue-50/50 p-3">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-sm text-muted-foreground">Stock total disponible</p>
                                    {stockItemId && (
                                        <span className="text-xs text-blue-600 font-medium">
                                            Asignado a: {stockItems.find(s => s.id === stockItemId)?.sku || 'Auto'}
                                        </span>
                                    )}
                                </div>
                                <p className="text-2xl font-bold text-blue-600">{disponible}</p>
                            </div>
                        )}

                        {/* Cantidad */}
                        <div className="space-y-2">
                            <Label>Cantidad a reservar *</Label>
                            <Input
                                type="number"
                                min="0.001"
                                step="0.001"
                                max={disponible}
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                placeholder="0"
                                disabled={guardando || !stockItemId}
                                className="text-xl font-mono"
                            />
                            {cantidadNum > disponible && disponible > 0 && (
                                <p className="text-xs text-destructive">
                                    Cantidad excede disponible ({disponible})
                                </p>
                            )}
                        </div>

                        {/* Reservado por */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" />
                                Reservado por *
                            </Label>
                            <Input
                                value={reservadoPor}
                                onChange={(e) => setReservadoPor(e.target.value)}
                                placeholder="Nombre o ID del usuario"
                                disabled={guardando}
                            />
                        </div>

                        {/* Referencia */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1.5">
                                    <Briefcase className="h-3.5 w-3.5" />
                                    Tipo
                                </Label>
                                <Select value={tipoReferencia} onValueChange={setTipoReferencia} disabled={guardando}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Opcional..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIPOS_REFERENCIA.map((t) => (
                                            <SelectItem key={t.value} value={t.value}>
                                                {t.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Referencia</Label>
                                <Input
                                    value={referenciaNombre}
                                    onChange={(e) => setReferenciaNombre(e.target.value)}
                                    placeholder="Nombre del proyecto..."
                                    disabled={guardando}
                                />
                            </div>
                        </div>

                        {/* Fecha de expiración */}
                        {/* Fecha de expiración */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label>Reservar hasta</Label>
                                <Input
                                    type="datetime-local"
                                    value={fechaExpiracion}
                                    onChange={(e) => setFechaExpiracion(e.target.value)}
                                    disabled={guardando}
                                />
                            </div>
                            {/* Estado Inicial */}
                            <div className="space-y-2">
                                <Label>Estado Inicial</Label>
                                <Select value={estado} onValueChange={(v) => setEstado(v as any)} disabled={guardando}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pendiente">Pendiente (Requiere Aprobación)</SelectItem>
                                        <SelectItem value="activa">Activa (Reserva Directa)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Notas */}
                        <div className="space-y-2">
                            <Label>Notas</Label>
                            <Input
                                value={notas}
                                onChange={(e) => setNotas(e.target.value)}
                                placeholder="Observaciones..."
                                disabled={guardando}
                            />
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="ghost" onClick={onCerrar} disabled={guardando}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={!puedeGuardar || guardando}>
                        {guardando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Reservar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
