/**
 * Dashboard de Movimientos de Inventario
 * 
 * Diseño compacto y profesional para gestionar movimientos de stock.
 * Flujo: Vista principal con lista + acciones inline
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/cards/card';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/inputs/select';
import {
    ArrowDownUp,
    ArrowDownToLine,
    ArrowUpFromLine,
    ArrowLeftRight,
    Scale,
    Search,
    Package,
    MapPin,
    Calendar,
    Loader2,
    RefreshCw,
    Plus,
} from 'lucide-react';
import { FormularioMovimiento } from '../components/movements/formulario-movimiento';
import { getMovementsClient } from '../../infrastructure/vessel/movements.client';
import { getItemsClient } from '../../infrastructure/vessel/items.client';
import { getLocationClient } from '../../infrastructure/vessel/locations.client';
import type { Movimiento, TipoMovimiento, FiltrosMovimiento } from '../../domain/entities/movement';
import { TIPO_MOVIMIENTO_LABELS, ESTADO_MOVIMIENTO_LABELS } from '../../domain/entities/movement';
import type { Item } from '../../domain/entities/item';
import type { Locacion } from '../../domain/entities/location';

type TipoAccion = 'entrada' | 'salida' | 'transferencia' | 'ajuste' | null;

const TIPOS_MOVIMIENTO = [
    { key: 'entrada' as TipoAccion, label: 'Entrada', icon: ArrowDownToLine, color: 'text-emerald-600', bg: 'bg-emerald-500', bgLight: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200' },
    { key: 'salida' as TipoAccion, label: 'Salida', icon: ArrowUpFromLine, color: 'text-rose-600', bg: 'bg-rose-500', bgLight: 'bg-rose-50 hover:bg-rose-100 border-rose-200' },
    { key: 'transferencia' as TipoAccion, label: 'Transferencia', icon: ArrowLeftRight, color: 'text-blue-600', bg: 'bg-blue-500', bgLight: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
    { key: 'ajuste' as TipoAccion, label: 'Ajuste', icon: Scale, color: 'text-amber-600', bg: 'bg-amber-500', bgLight: 'bg-amber-50 hover:bg-amber-100 border-amber-200' },
];

function getTipoBadge(tipo: TipoMovimiento) {
    const esEntrada = ['receipt', 'return', 'adjustment_in', 'transfer_in', 'production'].includes(tipo);
    const esSalida = ['shipment', 'consumption', 'adjustment_out', 'transfer_out', 'damage', 'expiration', 'installation'].includes(tipo);
    const esReserva = ['reserve', 'release'].includes(tipo);

    if (esEntrada) return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: ArrowDownToLine };
    if (esSalida) return { color: 'bg-rose-100 text-rose-700 border-rose-200', icon: ArrowUpFromLine };
    if (esReserva) return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: ArrowLeftRight };
    return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: ArrowDownUp };
}

export function MovimientosDashboard() {
    const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
    const [items, setItems] = useState<Map<string, Item>>(new Map());
    const [ubicaciones, setUbicaciones] = useState<Map<string, Locacion>>(new Map());
    const [cargando, setCargando] = useState(true);
    const [total, setTotal] = useState(0);

    // Filtros
    const [busqueda, setBusqueda] = useState('');
    const [filtroTipo, setFiltroTipo] = useState<string>('__all__');

    // Modal
    const [accionAbierta, setAccionAbierta] = useState<TipoAccion>(null);

    const movementsClient = getMovementsClient();
    const itemsClient = getItemsClient();
    const locationClient = getLocationClient();

    const cargar = useCallback(async () => {
        setCargando(true);
        try {
            const filtros: FiltrosMovimiento = { limit: 100 };
            if (filtroTipo && filtroTipo !== '__all__') {
                filtros.type = filtroTipo as TipoMovimiento;
            }

            const [result, itemsRes, locsRes] = await Promise.all([
                movementsClient.listar(filtros),
                itemsClient.listar(),
                locationClient.listar(),
            ]);

            setMovimientos(result.data);
            setTotal(result.total);

            const itemsList = Array.isArray(itemsRes) ? itemsRes : (itemsRes.items || []);
            const itemsMap = new Map<string, Item>();
            itemsList.forEach((item: Item) => itemsMap.set(item.id, item));
            setItems(itemsMap);

            const locsMap = new Map<string, Locacion>();
            locsRes.forEach((loc: Locacion) => locsMap.set(loc.id, loc));
            setUbicaciones(locsMap);
        } catch (err) {
            console.error('Error cargando movimientos:', err);
        } finally {
            setCargando(false);
        }
    }, [filtroTipo]);

    useEffect(() => { cargar(); }, [cargar]);

    const handleExito = () => { cargar(); };

    // Filtrar localmente
    const movimientosFiltrados = movimientos.filter(mov => {
        if (!busqueda) return true;
        const item = items.get(mov.itemId);
        const termino = busqueda.toLowerCase();
        return (
            item?.nombre?.toLowerCase().includes(termino) ||
            item?.codigo?.toLowerCase().includes(termino) ||
            mov.reason?.toLowerCase().includes(termino) ||
            mov.referenceId?.toLowerCase().includes(termino)
        );
    });

    // Stats
    const stats = {
        total,
        entradas: movimientos.filter(m => ['receipt', 'return', 'adjustment_in', 'transfer_in', 'production'].includes(m.type)).length,
        salidas: movimientos.filter(m => ['shipment', 'consumption', 'adjustment_out', 'transfer_out', 'damage', 'expiration', 'installation'].includes(m.type)).length,
    };

    return (
        <div className="space-y-4">
            {/* Header compacto */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold flex items-center gap-2">
                        <ArrowDownUp className="h-5 w-5" />
                        Movimientos
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gestión de entradas, salidas y transferencias
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={cargar} disabled={cargando}>
                    <RefreshCw className={`h-4 w-4 mr-1.5 ${cargando ? 'animate-spin' : ''}`} />
                    Actualizar
                </Button>
            </div>

            {/* Acciones + Stats en una fila */}
            <div className="flex gap-3">
                {/* Botones de acción compactos */}
                <div className="flex gap-1.5">
                    {TIPOS_MOVIMIENTO.map((tipo) => {
                        const Icon = tipo.icon;
                        return (
                            <button
                                key={tipo.key}
                                onClick={() => setAccionAbierta(tipo.key)}
                                className={`
                                    flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium
                                    transition-all duration-150 ${tipo.bgLight}
                                `}
                            >
                                <Icon className={`h-4 w-4 ${tipo.color}`} />
                                <span className={tipo.color}>{tipo.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Stats inline */}
                <div className="flex-1 flex items-center justify-end gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-semibold">{stats.total}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <ArrowDownToLine className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="font-medium text-emerald-600">{stats.entradas}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <ArrowUpFromLine className="h-3.5 w-3.5 text-rose-500" />
                        <span className="font-medium text-rose-600">{stats.salidas}</span>
                    </div>
                </div>
            </div>

            {/* Tabla de movimientos */}
            <Card className="border-slate-200">
                <CardHeader className="py-3 px-4 border-b bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Historial de Movimientos
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="pl-7 h-8 w-48 text-sm"
                                />
                            </div>
                            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                                <SelectTrigger className="h-8 w-36 text-sm">
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__all__">Todos</SelectItem>
                                    <SelectItem value="receipt">Recepción</SelectItem>
                                    <SelectItem value="shipment">Envío</SelectItem>
                                    <SelectItem value="consumption">Consumo</SelectItem>
                                    <SelectItem value="transfer_out">Transferencia</SelectItem>
                                    <SelectItem value="adjustment_in">Ajuste (+)</SelectItem>
                                    <SelectItem value="adjustment_out">Ajuste (-)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {cargando ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : movimientosFiltrados.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <ArrowDownUp className="h-10 w-10 mx-auto mb-3 opacity-20" />
                            <p className="font-medium">Sin movimientos</p>
                            <p className="text-sm">Registra tu primer movimiento con los botones de arriba</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/30 hover:bg-slate-50/30">
                                    <TableHead className="w-[100px] text-xs font-medium">Fecha</TableHead>
                                    <TableHead className="w-[120px] text-xs font-medium">Tipo</TableHead>
                                    <TableHead className="text-xs font-medium">Artículo</TableHead>
                                    <TableHead className="w-[80px] text-right text-xs font-medium">Cantidad</TableHead>
                                    <TableHead className="w-[140px] text-xs font-medium">Ubicación</TableHead>
                                    <TableHead className="w-[140px] text-xs font-medium">Referencia</TableHead>
                                    <TableHead className="w-[80px] text-xs font-medium">Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {movimientosFiltrados.map((mov) => {
                                    const item = items.get(mov.itemId);
                                    const ubicacion = ubicaciones.get(mov.locationId);
                                    const esEntrada = ['receipt', 'return', 'adjustment_in', 'transfer_in', 'production'].includes(mov.type);
                                    const tipoBadge = getTipoBadge(mov.type);
                                    const TipoIcon = tipoBadge.icon;

                                    return (
                                        <TableRow key={mov.id} className="hover:bg-slate-50/50">
                                            <TableCell className="py-2.5">
                                                <div className="text-xs">
                                                    <div className="font-medium">
                                                        {new Date(mov.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        {new Date(mov.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-2.5">
                                                <Badge variant="outline" className={`text-xs font-normal ${tipoBadge.color}`}>
                                                    <TipoIcon className="h-3 w-3 mr-1" />
                                                    {TIPO_MOVIMIENTO_LABELS[mov.type]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                                    <div className="min-w-0">
                                                        <div className="font-medium text-sm truncate">
                                                            {item?.nombre || 'Item desconocido'}
                                                        </div>
                                                        {item?.codigo && (
                                                            <div className="text-xs text-muted-foreground font-mono">
                                                                {item.codigo}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-2.5 text-right">
                                                <span className={`font-mono font-semibold ${esEntrada ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {esEntrada ? '+' : '-'}{mov.quantity}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-2.5">
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                                    <span className="truncate">
                                                        {ubicacion?.nombre || mov.locationId?.slice(0, 8) + '...'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-2.5">
                                                <span className="text-xs text-muted-foreground truncate block max-w-[130px]">
                                                    {mov.referenceId || mov.reason || '—'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-2.5">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs font-normal ${mov.status === 'completed'
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : 'bg-slate-50 text-slate-600 border-slate-200'
                                                        }`}
                                                >
                                                    {ESTADO_MOVIMIENTO_LABELS[mov.status]}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Modal de Movimiento */}
            <FormularioMovimiento
                abierto={accionAbierta !== null}
                onCerrar={() => setAccionAbierta(null)}
                onExito={handleExito}
                tipoInicial={accionAbierta === 'entrada' ? 'entrada' :
                    accionAbierta === 'salida' ? 'salida' :
                        accionAbierta === 'transferencia' ? 'transferencia' :
                            accionAbierta === 'ajuste' ? 'ajuste' :
                                undefined}
            />
        </div>
    );
}
