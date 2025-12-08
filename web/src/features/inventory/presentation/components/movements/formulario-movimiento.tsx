/**
 * Formulario de Movimiento de Stock
 * 
 * Permite registrar entradas, salidas, transferencias y ajustes
 */

"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Label } from '@/shared/ui/labels/label';
import { Textarea } from '@/shared/ui/inputs/textarea';
import { Badge } from '@/shared/ui/badges/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
    ArrowDown,
    ArrowUp,
    ArrowLeftRight,
    AlertCircle,
    Package,
    MapPin,
} from 'lucide-react';
import { getMovementsClient } from '../../../infrastructure/vessel/movements.client';
import { getLocationClient } from '../../../infrastructure/vessel/locations.client';
import { getItemsClient } from '../../../infrastructure/vessel/items.client';
import type { Item } from '../../../domain/entities/item';
import type { Locacion } from '../../../domain/entities/location';
import type { TipoMovimiento } from '../../../domain/entities/movement';
import { useUoM } from '../../hooks/use-uom';

type TipoSimple = 'entrada' | 'salida' | 'transferencia';

interface FormularioMovimientoProps {
    abierto: boolean;
    onCerrar: () => void;
    onExito?: () => void;
    // Pre-selección opcional
    itemId?: string;
    locationId?: string;
    tipoInicial?: TipoSimple;
}

const TIPOS_CONFIG: Record<TipoSimple, {
    label: string;
    icon: typeof ArrowDown;
    color: string;
    movementType: TipoMovimiento;
}> = {
    entrada: { label: 'Entrada', icon: ArrowDown, color: 'text-green-600', movementType: 'receipt' },
    salida: { label: 'Salida', icon: ArrowUp, color: 'text-red-600', movementType: 'consumption' },
    transferencia: { label: 'Transferencia', icon: ArrowLeftRight, color: 'text-blue-600', movementType: 'transfer_out' },
};

export function FormularioMovimiento({
    abierto,
    onCerrar,
    onExito,
    itemId: itemIdInicial,
    locationId: locationIdInicial,
    tipoInicial = 'entrada',
}: FormularioMovimientoProps) {
    // Data
    const [items, setItems] = useState<Item[]>([]);
    const [ubicaciones, setUbicaciones] = useState<Locacion[]>([]);
    const [cargandoData, setCargandoData] = useState(true);

    // Form state
    const [tipo, setTipo] = useState<TipoSimple>(tipoInicial);
    const [itemId, setItemId] = useState(itemIdInicial || '');
    const [locationId, setLocationId] = useState(locationIdInicial || '');
    const [destinationId, setDestinationId] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [motivo, setMotivo] = useState('');

    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const movementsClient = getMovementsClient();
    const locationClient = getLocationClient();
    const itemsClient = getItemsClient();
    const { unidades } = useUoM();

    // Cargar datos al abrir
    useEffect(() => {
        if (abierto) {
            cargarDatos();
        }
    }, [abierto]);

    // Reset cuando cambia itemId/locationId inicial
    useEffect(() => {
        if (itemIdInicial) setItemId(itemIdInicial);
        if (locationIdInicial) setLocationId(locationIdInicial);
        if (tipoInicial) setTipo(tipoInicial);
    }, [itemIdInicial, locationIdInicial, tipoInicial]);

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

    const resetForm = () => {
        setTipo(tipoInicial);
        setItemId(itemIdInicial || '');
        setLocationId(locationIdInicial || '');
        setDestinationId('');
        setCantidad('');
        setMotivo('');
        setError(null);
    };

    const handleSubmit = async () => {
        // Validación
        if (!itemId || !locationId || !cantidad) {
            setError('Completa todos los campos requeridos');
            return;
        }

        const qty = parseFloat(cantidad);
        if (isNaN(qty) || qty <= 0) {
            setError('La cantidad debe ser un número positivo');
            return;
        }

        if (tipo === 'transferencia' && !destinationId) {
            setError('Selecciona la ubicación de destino');
            return;
        }

        setGuardando(true);
        setError(null);

        try {
            if (tipo === 'transferencia') {
                await movementsClient.transferir({
                    itemId,
                    sourceLocationId: locationId,
                    destinationLocationId: destinationId,
                    quantity: qty,
                });
            } else if (tipo === 'entrada') {
                await movementsClient.recepcion(itemId, locationId, qty);
            } else {
                await movementsClient.consumo(itemId, locationId, qty, motivo || undefined);
            }

            resetForm();
            onExito?.();
            onCerrar();
        } catch (err: any) {
            setError(err?.message || 'Error al registrar movimiento');
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

    const tipoConfig = TIPOS_CONFIG[tipo];
    const IconTipo = tipoConfig.icon;

    const selectedItem = items.find(i => i.id === itemId);
    const selectedLocation = ubicaciones.find(l => l.id === locationId);

    // Obtener símbolo de unidad de medida
    const uomSymbol = selectedItem?.uomId
        ? unidades.find(u => u.codigo === selectedItem.uomId || u.id === selectedItem.uomId)?.simbolo
        : '';

    return (
        <Dialog open={abierto} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconTipo className={`h-5 w-5 ${tipoConfig.color}`} />
                        Registrar {tipoConfig.label}
                    </DialogTitle>
                    <DialogDescription>
                        Registra un movimiento de inventario
                    </DialogDescription>
                </DialogHeader>

                {cargandoData ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        {/* Tipo de movimiento */}
                        <div className="space-y-2">
                            <Label>Tipo de Movimiento</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {(Object.keys(TIPOS_CONFIG) as TipoSimple[]).map((t) => {
                                    const cfg = TIPOS_CONFIG[t];
                                    const Icon = cfg.icon;
                                    return (
                                        <Button
                                            key={t}
                                            type="button"
                                            variant={tipo === t ? 'default' : 'outline'}
                                            className="flex flex-col h-auto py-3"
                                            onClick={() => setTipo(t)}
                                            disabled={guardando}
                                        >
                                            <Icon className={`h-5 w-5 mb-1 ${tipo === t ? '' : cfg.color}`} />
                                            <span className="text-xs">{cfg.label}</span>
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Item */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                Artículo *
                            </Label>
                            <Select value={itemId} onValueChange={setItemId} disabled={guardando || !!itemIdInicial}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar artículo..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {items.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs text-muted-foreground">{item.codigo}</span>
                                                <span>{item.nombre}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Ubicación origen */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {tipo === 'transferencia' ? 'Ubicación Origen *' : 'Ubicación *'}
                            </Label>
                            <Select value={locationId} onValueChange={setLocationId} disabled={guardando || !!locationIdInicial}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar ubicación..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {ubicaciones.map((loc) => (
                                        <SelectItem key={loc.id} value={loc.id}>
                                            {loc.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Ubicación destino (solo transferencia) */}
                        {tipo === 'transferencia' && (
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    Ubicación Destino *
                                </Label>
                                <Select value={destinationId} onValueChange={setDestinationId} disabled={guardando}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar destino..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ubicaciones
                                            .filter(loc => loc.id !== locationId)
                                            .map((loc) => (
                                                <SelectItem key={loc.id} value={loc.id}>
                                                    {loc.nombre}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Cantidad */}
                        <div className="space-y-2">
                            <Label>Cantidad {uomSymbol ? `(${uomSymbol})` : '*'} </Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    min="0.001"
                                    step="0.001"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    placeholder="0"
                                    disabled={guardando}
                                    className="pr-12 font-mono text-lg"
                                />
                                {uomSymbol && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                                        {uomSymbol}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Motivo (opcional para salidas) */}
                        {tipo === 'salida' && (
                            <div className="space-y-2">
                                <Label>Motivo (opcional)</Label>
                                <Textarea
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    placeholder="Ej: Consumo para proyecto X"
                                    rows={2}
                                    disabled={guardando}
                                />
                            </div>
                        )}

                        {/* Resumen */}
                        {itemId && locationId && cantidad && (
                            <div className="p-3 rounded-lg bg-muted/50 text-sm">
                                <p className="font-medium mb-1">Resumen:</p>
                                <p>
                                    {tipo === 'entrada' && '📥 '}
                                    {tipo === 'salida' && '📤 '}
                                    {tipo === 'transferencia' && '↔️ '}
                                    <strong>{cantidad} {uomSymbol}</strong> de{' '}
                                    <strong>{selectedItem?.nombre || 'Item'}</strong>
                                    {tipo === 'entrada' && ' ingresarán a '}
                                    {tipo === 'salida' && ' saldrán de '}
                                    {tipo === 'transferencia' && ' se moverán de '}
                                    <strong>{selectedLocation?.nombre || 'Ubicación'}</strong>
                                    {tipo === 'transferencia' && destinationId && (
                                        <> a <strong>{ubicaciones.find(l => l.id === destinationId)?.nombre}</strong></>
                                    )}
                                </p>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onCerrar} disabled={guardando}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={guardando || cargandoData}>
                        {guardando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Registrar {tipoConfig.label}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
