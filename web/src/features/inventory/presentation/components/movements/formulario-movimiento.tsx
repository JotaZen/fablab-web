/**
 * Formulario de Movimiento de Stock (v3)
 * 
 * Modal compacto y funcional para registrar movimientos.
 * Diseño limpio sin exceso de padding.
 */

"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Label } from '@/shared/ui/labels/label';
import { Badge } from '@/shared/ui/badges/badge';
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
    ArrowDown,
    ArrowUp,
    ArrowLeftRight,
    Package,
    MapPin,
    Plus,
    Search,
    ArrowRight,
    Scale,
    Minus,
    Building2,
    Truck,
    User,
} from 'lucide-react';
import { getMovementsClient } from '../../../infrastructure/vessel/movements.client';
import { getLocationClient } from '../../../infrastructure/vessel/locations.client';
import { getItemsClient } from '../../../infrastructure/vessel/items.client';
import { getStockClient } from '../../../infrastructure/vessel/stock.client';
import { getLocationCapacityClient } from '../../../infrastructure/vessel/location-capacity.client';
import type { Item, CrearItemDTO } from '../../../domain/entities/item';
import type { Locacion } from '../../../domain/entities/location';
import { useUoM } from '../../hooks/use-uom';
import { FormularioItemCompleto } from '../items/formulario-item-completo';
import { useToast } from '@/shared/ui/feedback/toast-provider';

type TipoMovimiento = 'entrada' | 'salida' | 'transferencia' | 'ajuste';

interface FormularioMovimientoProps {
    abierto: boolean;
    onCerrar: () => void;
    onExito?: () => void;
    itemId?: string;
    locationId?: string;
    tipoInicial?: TipoMovimiento;
}

const TIPOS_CONFIG: Record<TipoMovimiento, {
    label: string;
    icon: typeof ArrowDown;
    color: string;
    bgColor: string;
    borderColor: string;
}> = {
    entrada: {
        label: 'Entrada',
        icon: ArrowDown,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-400',
    },
    salida: {
        label: 'Salida',
        icon: ArrowUp,
        color: 'text-rose-600',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-400',
    },
    transferencia: {
        label: 'Transferencia',
        icon: ArrowLeftRight,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-400',
    },
    ajuste: {
        label: 'Ajuste',
        icon: Scale,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-400',
    },
};

interface StockInfo {
    cantidad: number;
    reservado: number;
    disponible: number;
}

export function FormularioMovimiento({
    abierto,
    onCerrar,
    onExito,
    itemId: itemIdInicial,
    locationId: locationIdInicial,
    tipoInicial,
}: FormularioMovimientoProps) {
    // Data
    const [items, setItems] = useState<Item[]>([]);
    const [ubicaciones, setUbicaciones] = useState<Locacion[]>([]);
    const [cargandoData, setCargandoData] = useState(true);

    // Form state
    const [tipo, setTipo] = useState<TipoMovimiento | null>(tipoInicial || null);
    const [itemId, setItemId] = useState(itemIdInicial || '');
    const [ubicacionOrigenId, setUbicacionOrigenId] = useState(locationIdInicial || '');
    const [ubicacionDestinoId, setUbicacionDestinoId] = useState('');
    const [origenExterno, setOrigenExterno] = useState('');
    const [destinoExterno, setDestinoExterno] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [esPositivo, setEsPositivo] = useState(true);
    const [motivo, setMotivo] = useState('');
    const [referencia, setReferencia] = useState('');
    const [numeroLote, setNumeroLote] = useState('');
    const [busquedaItem, setBusquedaItem] = useState('');

    // Stock info
    const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
    const [cargandoStock, setCargandoStock] = useState(false);
    const [permitirNegativo, setPermitirNegativo] = useState(false);

    // Modal crear item
    const [mostrarCrearItem, setMostrarCrearItem] = useState(false);

    const [guardando, setGuardando] = useState(false);

    const movementsClient = getMovementsClient();
    const locationClient = getLocationClient();
    const itemsClient = getItemsClient();
    const stockClient = getStockClient();
    const capacityClient = getLocationCapacityClient();
    const { unidades } = useUoM();
    const toast = useToast();

    useEffect(() => {
        if (abierto) cargarDatos();
    }, [abierto]);

    useEffect(() => {
        if (itemIdInicial) setItemId(itemIdInicial);
        if (locationIdInicial) setUbicacionOrigenId(locationIdInicial);
        if (tipoInicial) setTipo(tipoInicial);
    }, [itemIdInicial, locationIdInicial, tipoInicial]);


    const ubicacionOrigenStock = useMemo(() => {
        if (tipo === 'salida' || tipo === 'transferencia') return ubicacionOrigenId;
        if (tipo === 'entrada') return ubicacionDestinoId;
        return null;
    }, [tipo, ubicacionOrigenId, ubicacionDestinoId]);

    useEffect(() => {
        if (itemId && ubicacionOrigenStock) {
            cargarStock();
        } else {
            setStockInfo(null);
        }
    }, [itemId, ubicacionOrigenStock]);

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
        if (!ubicacionOrigenStock) return;
        setCargandoStock(true);
        try {
            const stockItems = await stockClient.listarItems({
                catalogoItemId: itemId,
                ubicacionId: ubicacionOrigenStock,
            });
            if (stockItems.length > 0) {
                const stock = stockItems[0];
                setStockInfo({
                    cantidad: stock.cantidad,
                    reservado: stock.cantidadReservada || 0,
                    disponible: stock.cantidadDisponible || stock.cantidad,
                });
            } else {
                setStockInfo({ cantidad: 0, reservado: 0, disponible: 0 });
            }
            const config = await capacityClient.obtener(ubicacionOrigenStock);
            setPermitirNegativo(config?.meta?.allowNegative === true);
        } catch (err) {
            console.error('Error cargando stock:', err);
            setStockInfo(null);
        } finally {
            setCargandoStock(false);
        }
    };

    const resetForm = () => {
        setTipo(tipoInicial || null);
        setItemId(itemIdInicial || '');
        setUbicacionOrigenId(locationIdInicial || '');
        setUbicacionDestinoId('');
        setOrigenExterno('');
        setDestinoExterno('');
        setCantidad('');
        setEsPositivo(true);
        setMotivo('');
        setReferencia('');
        setNumeroLote('');
        setBusquedaItem('');
        setStockInfo(null);
    };

    const handleSubmit = async () => {
        // Validaciones - si falla, mostramos toast y salimos
        if (!tipo) {
            toast.warning('Selecciona el tipo de movimiento');
            return;
        }
        if (!itemId) {
            toast.warning('Selecciona un artículo');
            return;
        }
        if (!cantidad) {
            toast.warning('Ingresa la cantidad');
            return;
        }

        const qty = parseFloat(cantidad);
        if (isNaN(qty) || qty <= 0) {
            toast.warning('La cantidad debe ser mayor a 0');
            return;
        }

        if (tipo === 'entrada' && !ubicacionDestinoId) {
            toast.warning('Selecciona ubicación destino');
            return;
        }
        if (tipo === 'salida' && !ubicacionOrigenId) {
            toast.warning('Selecciona ubicación origen');
            return;
        }
        if (tipo === 'transferencia') {
            if (!ubicacionOrigenId) {
                toast.warning('Selecciona ubicación origen');
                return;
            }
            if (!ubicacionDestinoId) {
                toast.warning('Selecciona ubicación destino');
                return;
            }
            if (ubicacionOrigenId === ubicacionDestinoId) {
                toast.warning('Origen y destino deben ser diferentes');
                return;
            }
        }
        if (tipo === 'ajuste' && !ubicacionOrigenId) {
            toast.warning('Selecciona ubicación');
            return;
        }

        // Validar stock para salidas/transferencias
        if ((tipo === 'salida' || tipo === 'transferencia') && stockInfo && !permitirNegativo && qty > stockInfo.disponible) {
            toast.error(`Stock insuficiente. Disponible: ${stockInfo.disponible}`);
            return;
        }

        setGuardando(true);

        try {
            if (tipo === 'entrada') {
                await movementsClient.recepcion(itemId, ubicacionDestinoId, qty, referencia || undefined, numeroLote || undefined);
            } else if (tipo === 'salida') {
                await movementsClient.consumo(itemId, ubicacionOrigenId, qty, motivo || destinoExterno || undefined);
            } else if (tipo === 'transferencia') {
                await movementsClient.transferir({
                    itemId,
                    sourceLocationId: ubicacionOrigenId,
                    destinationLocationId: ubicacionDestinoId,
                    quantity: qty,
                });
            } else if (tipo === 'ajuste') {
                const cantidadAjuste = esPositivo ? qty : -qty;
                await movementsClient.ajuste({
                    itemId,
                    locationId: ubicacionOrigenId,
                    quantity: cantidadAjuste,
                    reason: motivo || undefined,
                });
            }

            // Éxito
            const tipoLabel = TIPOS_CONFIG[tipo].label;
            toast.success(`${tipoLabel} registrada correctamente`);
            resetForm();
            onExito?.();
            onCerrar();
        } catch (err: any) {
            // Sanitizar errores - no mostrar detalles técnicos
            const statusCode = err?.statusCode || 0;
            let mensaje = 'No se pudo registrar el movimiento. Intenta nuevamente.';

            if (statusCode >= 500) {
                // Error del servidor - mensaje genérico
                mensaje = 'Error del servidor. Por favor intenta más tarde.';
                console.error('[Movimiento] Error 500:', err);
            } else if (statusCode === 400) {
                // Error de validación del backend
                mensaje = 'Datos inválidos. Revisa los campos e intenta nuevamente.';
            } else if (statusCode === 404) {
                mensaje = 'El recurso no fue encontrado.';
            } else if (err?.message && !err.message.includes('Error ')) {
                // Solo mostrar mensaje si no es técnico
                mensaje = err.message;
            }

            toast.error(mensaje);
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

    const handleCrearItem = async (data: CrearItemDTO) => {
        const nuevoItem = await itemsClient.crear(data);
        setItems(prev => [...prev, nuevoItem]);
        setItemId(nuevoItem.id);
        setMostrarCrearItem(false);
    };

    const selectedItem = items.find(i => i.id === itemId);
    const tipoConfig = tipo ? TIPOS_CONFIG[tipo] : null;
    const uomSymbol = selectedItem?.uomId
        ? unidades.find(u => u.codigo === selectedItem.uomId || u.id === selectedItem.uomId)?.simbolo
        : 'un';

    const itemsFiltrados = useMemo(() => {
        if (!busquedaItem.trim()) return items;
        const termino = busquedaItem.toLowerCase();
        return items.filter(item =>
            item.nombre.toLowerCase().includes(termino) ||
            item.codigo?.toLowerCase().includes(termino)
        );
    }, [items, busquedaItem]);

    const cantidadNum = parseFloat(cantidad) || 0;

    // Build hierarchical location options with indentation
    const ubicacionesAnidadas = useMemo(() => {
        const result: { loc: Locacion; level: number }[] = [];
        const addWithChildren = (parentId: string | undefined, level: number) => {
            const children = ubicaciones.filter(l => l.padreId === parentId);
            for (const child of children) {
                result.push({ loc: child, level });
                if (child.tipo === 'warehouse') {
                    addWithChildren(child.id, level + 1);
                }
            }
        };
        // Start with root locations (no parent)
        addWithChildren(undefined, 0);
        // If nothing found (flat list without padreId), just return all at level 0
        if (result.length === 0) {
            return ubicaciones.map(loc => ({ loc, level: 0 }));
        }
        return result;
    }, [ubicaciones]);

    // Validación del formulario
    const validacion = useMemo(() => {
        const errores: string[] = [];

        if (!tipo) errores.push('tipo de movimiento');
        if (!itemId) errores.push('artículo');
        if (!cantidad || cantidadNum <= 0) errores.push('cantidad válida');

        if (tipo === 'entrada' && !ubicacionDestinoId) errores.push('ubicación destino');
        if (tipo === 'salida' && !ubicacionOrigenId) errores.push('ubicación origen');
        if (tipo === 'transferencia') {
            if (!ubicacionOrigenId) errores.push('ubicación origen');
            if (!ubicacionDestinoId) errores.push('ubicación destino');
            if (ubicacionOrigenId && ubicacionDestinoId && ubicacionOrigenId === ubicacionDestinoId) {
                errores.push('ubicaciones diferentes');
            }
        }
        if (tipo === 'ajuste' && !ubicacionOrigenId) errores.push('ubicación');

        // Validar stock para salidas
        if ((tipo === 'salida' || tipo === 'transferencia') && stockInfo && !permitirNegativo && cantidadNum > stockInfo.disponible) {
            errores.push(`stock suficiente (disponible: ${stockInfo.disponible})`);
        }

        return {
            esValido: errores.length === 0,
            errores,
            mensaje: errores.length > 0 ? `Falta: ${errores.join(', ')}` : null
        };
    }, [tipo, itemId, cantidad, cantidadNum, ubicacionOrigenId, ubicacionDestinoId, stockInfo, permitirNegativo]);

    const puedeGuardar = validacion.esValido && !guardando && !cargandoData;

    return (
        <>
            <Dialog open={abierto} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-[600px] p-0 gap-0 max-h-[85vh] flex flex-col overflow-hidden">
                    {/* Header */}
                    <DialogHeader className={`px-5 py-4 border-b flex-shrink-0 ${tipoConfig ? tipoConfig.bgColor : 'bg-slate-50'}`}>
                        <DialogTitle className="flex items-center gap-2.5 text-base">
                            {tipoConfig ? (
                                <div className={`p-1.5 rounded-md ${tipoConfig.bgColor} border ${tipoConfig.borderColor}`}>
                                    <tipoConfig.icon className={`h-4 w-4 ${tipoConfig.color}`} />
                                </div>
                            ) : (
                                <Package className="h-5 w-5 text-slate-500" />
                            )}
                            <span>{tipo ? `Registrar ${tipoConfig?.label}` : 'Nuevo Movimiento'}</span>
                        </DialogTitle>
                    </DialogHeader>

                    {cargandoData ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                            {/* Tipo de movimiento */}
                            {!tipoInicial && (
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500 uppercase">Tipo</Label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {(Object.keys(TIPOS_CONFIG) as TipoMovimiento[]).map((t) => {
                                            const cfg = TIPOS_CONFIG[t];
                                            const Icon = cfg.icon;
                                            const isSelected = tipo === t;
                                            return (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setTipo(t)}
                                                    disabled={guardando}
                                                    className={`
                                                        flex flex-col items-center gap-1 p-2.5 rounded-lg border text-xs font-medium
                                                        transition-all duration-150
                                                        ${isSelected
                                                            ? `${cfg.bgColor} ${cfg.borderColor} ${cfg.color}`
                                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                        }
                                                    `}
                                                >
                                                    <Icon className={`h-4 w-4 ${isSelected ? cfg.color : 'text-slate-400'}`} />
                                                    {cfg.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {tipo && (
                                <>
                                    {/* Artículo */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-medium text-slate-500 uppercase">Artículo</Label>
                                            <button
                                                type="button"
                                                onClick={() => setMostrarCrearItem(true)}
                                                className="text-xs text-primary hover:underline flex items-center gap-0.5"
                                            >
                                                <Plus className="h-3 w-3" /> Nuevo
                                            </button>
                                        </div>
                                        <Select value={itemId} onValueChange={setItemId} disabled={guardando || !!itemIdInicial}>
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Seleccionar artículo..." />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[250px]">
                                                <div className="sticky top-0 p-1.5 bg-popover border-b">
                                                    <div className="relative">
                                                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                                        <Input
                                                            placeholder="Buscar..."
                                                            value={busquedaItem}
                                                            onChange={(e) => setBusquedaItem(e.target.value)}
                                                            className="pl-7 h-8 text-sm"
                                                            onKeyDown={(e) => e.stopPropagation()}
                                                        />
                                                    </div>
                                                </div>
                                                {itemsFiltrados.length === 0 ? (
                                                    <div className="py-4 text-center text-sm text-muted-foreground">
                                                        Sin resultados
                                                    </div>
                                                ) : (
                                                    itemsFiltrados.map((item) => (
                                                        <SelectItem key={item.id} value={item.id}>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-xs px-1.5 py-0.5 bg-slate-100 rounded">
                                                                    {item.codigo || item.id.slice(0, 6)}
                                                                </span>
                                                                <span className="text-sm">{item.nombre}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Cantidad */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-slate-500 uppercase">Cantidad</Label>
                                        <div className={`
                                            flex items-center gap-3 p-3 rounded-lg border-2
                                            ${tipoConfig ? `${tipoConfig.bgColor} ${tipoConfig.borderColor}` : 'bg-slate-50 border-slate-200'}
                                        `}>
                                            {tipo === 'ajuste' && (
                                                <div className="flex gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEsPositivo(true)}
                                                        className={`p-1.5 rounded ${esPositivo ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400'}`}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEsPositivo(false)}
                                                        className={`p-1.5 rounded ${!esPositivo ? 'bg-rose-500 text-white' : 'bg-white text-slate-400'}`}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                            <Input
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={cantidad}
                                                onChange={(e) => setCantidad(e.target.value)}
                                                placeholder="0"
                                                disabled={guardando}
                                                onFocus={(e) => {
                                                    if (!cantidad) setCantidad('1');
                                                    e.target.select();
                                                }}
                                                className={`
                                                    flex-1 h-12 text-center text-2xl font-bold font-mono
                                                    border-0 bg-white/80 focus-visible:ring-0
                                                    ${tipo === 'ajuste' && !esPositivo ? 'text-rose-600' : tipoConfig?.color}
                                                `}
                                            />
                                            <span className={`text-lg font-medium ${tipoConfig?.color || 'text-slate-500'}`}>
                                                {uomSymbol}
                                            </span>
                                        </div>
                                        {cantidadNum > 0 && (
                                            <div className="text-center">
                                                <Badge className={`text-xs ${tipoConfig?.bgColor} ${tipoConfig?.color} border ${tipoConfig?.borderColor}`}>
                                                    {tipo === 'entrada' && `+${cantidad} ${uomSymbol} ingresarán`}
                                                    {tipo === 'salida' && `-${cantidad} ${uomSymbol} saldrán`}
                                                    {tipo === 'transferencia' && `${cantidad} ${uomSymbol} se moverán`}
                                                    {tipo === 'ajuste' && `${esPositivo ? '+' : '-'}${cantidad} ${uomSymbol} ajuste`}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    {/* Ubicaciones */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-slate-500 uppercase">
                                            {tipo === 'ajuste' ? 'Ubicación' : 'Origen → Destino'}
                                        </Label>

                                        {tipo === 'entrada' && (
                                            <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-start">
                                                <Input
                                                    placeholder="Proveedor (opcional)"
                                                    value={origenExterno}
                                                    onChange={(e) => setOrigenExterno(e.target.value)}
                                                    disabled={guardando}
                                                    className="h-10 text-sm"
                                                />
                                                <ArrowRight className="h-4 w-4 text-emerald-500 mt-3" />
                                                <div>
                                                    <Select value={ubicacionDestinoId} onValueChange={setUbicacionDestinoId} disabled={guardando}>
                                                        <SelectTrigger className="h-10">
                                                            <SelectValue placeholder="Bodega destino *" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {ubicacionesAnidadas.map(({ loc, level }) => (
                                                                <SelectItem key={loc.id} value={loc.id}>
                                                                    <div className="flex items-center gap-1.5" style={{ paddingLeft: `${level * 16}px` }}>
                                                                        {loc.tipo === 'warehouse' ? (
                                                                            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                                        ) : (
                                                                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                                                        )}
                                                                        {loc.nombre}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {ubicacionDestinoId && itemId && (
                                                        <div className="mt-1 text-xs text-muted-foreground">
                                                            Stock actual: {stockInfo?.cantidad ?? 0} {uomSymbol}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {tipo === 'salida' && (
                                            <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                                                <div>
                                                    <Select value={ubicacionOrigenId} onValueChange={setUbicacionOrigenId} disabled={guardando}>
                                                        <SelectTrigger className="h-10">
                                                            <SelectValue placeholder="Bodega origen *" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {ubicacionesAnidadas.map(({ loc, level }) => (
                                                                <SelectItem key={loc.id} value={loc.id}>
                                                                    <div className="flex items-center gap-1.5" style={{ paddingLeft: `${level * 16}px` }}>
                                                                        {loc.tipo === 'warehouse' ? (
                                                                            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                                        ) : (
                                                                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                                                        )}
                                                                        {loc.nombre}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {ubicacionOrigenId && itemId && (
                                                        <div className="mt-1 text-xs text-muted-foreground">
                                                            {cargandoStock ? 'Verificando...' :
                                                                stockInfo ? `Disponible: ${stockInfo.disponible} ${uomSymbol}` : 'Sin stock'}
                                                        </div>
                                                    )}
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-rose-500" />
                                                <Input
                                                    placeholder="Cliente/Proyecto (opcional)"
                                                    value={destinoExterno}
                                                    onChange={(e) => setDestinoExterno(e.target.value)}
                                                    disabled={guardando}
                                                    className="h-10 text-sm"
                                                />
                                            </div>
                                        )}

                                        {tipo === 'transferencia' && (
                                            <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                                                <div>
                                                    <Select value={ubicacionOrigenId} onValueChange={setUbicacionOrigenId} disabled={guardando}>
                                                        <SelectTrigger className="h-10">
                                                            <SelectValue placeholder="Desde *" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {ubicacionesAnidadas.map(({ loc, level }) => (
                                                                <SelectItem key={loc.id} value={loc.id}>
                                                                    <div className="flex items-center gap-1.5" style={{ paddingLeft: `${level * 16}px` }}>
                                                                        {loc.tipo === 'warehouse' ? (
                                                                            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                                        ) : (
                                                                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                                                        )}
                                                                        {loc.nombre}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {ubicacionOrigenId && itemId && (
                                                        <div className="mt-1 text-xs text-muted-foreground">
                                                            {cargandoStock ? 'Verificando...' :
                                                                stockInfo ? `Disponible: ${stockInfo.disponible} ${uomSymbol}` : 'Sin stock'}
                                                        </div>
                                                    )}
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-blue-500" />
                                                <Select value={ubicacionDestinoId} onValueChange={setUbicacionDestinoId} disabled={guardando}>
                                                    <SelectTrigger className="h-10">
                                                        <SelectValue placeholder="Hasta *" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ubicacionesAnidadas.filter(({ loc }) => loc.id !== ubicacionOrigenId).map(({ loc, level }) => (
                                                            <SelectItem key={loc.id} value={loc.id}>
                                                                <div className="flex items-center gap-1.5" style={{ paddingLeft: `${level * 16}px` }}>
                                                                    {loc.tipo === 'warehouse' ? (
                                                                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                                    ) : (
                                                                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                                                    )}
                                                                    {loc.nombre}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        {tipo === 'ajuste' && (
                                            <Select value={ubicacionOrigenId} onValueChange={setUbicacionOrigenId} disabled={guardando}>
                                                <SelectTrigger className="h-10">
                                                    <SelectValue placeholder="Seleccionar ubicación *" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ubicacionesAnidadas.map(({ loc, level }) => (
                                                        <SelectItem key={loc.id} value={loc.id}>
                                                            <div className="flex items-center gap-1.5" style={{ paddingLeft: `${level * 16}px` }}>
                                                                {loc.tipo === 'warehouse' ? (
                                                                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                                ) : (
                                                                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                                                )}
                                                                {loc.nombre}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>

                                    {/* Número de Lote (opcional) */}
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground">Número de Lote (opcional)</Label>
                                        <Input
                                            placeholder="LOT-001, BATCH-2024..."
                                            value={numeroLote}
                                            onChange={(e) => setNumeroLote(e.target.value)}
                                            disabled={guardando}
                                            className="h-9 text-sm"
                                        />
                                    </div>

                                    {/* Referencia y Motivo */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">Referencia</Label>
                                            <Input
                                                placeholder="OC-001, FAC-123..."
                                                value={referencia}
                                                onChange={(e) => setReferencia(e.target.value)}
                                                disabled={guardando}
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">Motivo</Label>
                                            <Input
                                                placeholder="Observaciones..."
                                                value={motivo}
                                                onChange={(e) => setMotivo(e.target.value)}
                                                disabled={guardando}
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <DialogFooter className="px-5 py-3 border-t bg-slate-50/50 flex-shrink-0">
                        <Button variant="ghost" onClick={onCerrar} disabled={guardando} size="sm">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!puedeGuardar}
                            size="sm"
                        >
                            {guardando && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                            {tipo ? `Registrar ${tipoConfig?.label}` : 'Seleccionar Tipo'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal crear artículo */}
            <FormularioItemCompleto
                abierto={mostrarCrearItem}
                onCerrar={() => setMostrarCrearItem(false)}
                onGuardar={handleCrearItem}
            />
        </>
    );
}
