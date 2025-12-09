/**
 * Dashboard de Reservas
 * 
 * Página principal para gestionar reservas de inventario.
 */

"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/cards/card';
import { Button } from '@/shared/ui/buttons/button';
import { Badge } from '@/shared/ui/badges/badge';
import {
    CalendarClock,
    Plus,
    RefreshCw,
    User,
    Package,
    MapPin,
    Clock,
    Unlock,
    Trash2,
    ChevronRight,
    Undo2,
    Check,
    X,
    Eye,
    AlertCircle,
} from 'lucide-react';
import { useReservations } from '../hooks/use-reservations';
import { FormularioReserva } from '../components/reservations/formulario-reserva';
import type { Reserva, EstadoReserva } from '../../domain/entities/reservation';
import type { Item } from '../../domain/entities/item';
import { ESTADO_RESERVA_LABELS, ESTADO_RESERVA_COLORS, TIPO_REFERENCIA_LABELS } from '../../domain/entities/reservation';
import { DetalleItemModal } from '../components/items/detalle-item-modal';
import { useItems } from '../hooks/use-items';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/tables/table';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/shared/ui/misc/tabs';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/ui/misc/alert-dialog';

// Custom hook for debounce
function useDebounce<T>(value: T, delay: number): [T] {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return [debouncedValue];
}


// === COMPONENTS ===

function PendingPanel() {
    const { reservas, cargando, cargar, aprobar, rechazar } = useReservations();
    const { items, cargar: cargarItems } = useItems();
    const [confirmAprobar, setConfirmAprobar] = useState<Reserva | null>(null);
    const [confirmRechazar, setConfirmRechazar] = useState<Reserva | null>(null);
    const [razonRechazo, setRazonRechazo] = useState('');
    const [procesando, setProcesando] = useState(false);
    const [errorAprobacion, setErrorAprobacion] = useState<string | null>(null);
    const [verItemDetalle, setVerItemDetalle] = useState<Item | null>(null);

    useEffect(() => {
        cargar({ estado: 'pendiente', limite: 50 }); // Load pending on mount
        cargarItems({ porPagina: 100 }); // Load items for detail modal
    }, []);

    const handleVerItem = (stockItemId: string) => {
        const item = items.find(i => i.id === stockItemId);
        if (item) {
            setVerItemDetalle(item);
        }
    };

    const handleAprobar = async () => {
        if (!confirmAprobar) return;
        setProcesando(true);
        setErrorAprobacion(null);
        try {
            await aprobar(confirmAprobar.id);
            setConfirmAprobar(null);
        } catch (err: any) {
            // Show error in dialog instead of just toast
            setErrorAprobacion(err?.message || 'Error al aprobar reserva. Verifique el stock disponible.');
        } finally {
            setProcesando(false);
        }
    };

    const handleRechazar = async () => {
        if (!confirmRechazar) return;
        if (!razonRechazo.trim()) return; // Require reason
        setProcesando(true);
        try {
            await rechazar(confirmRechazar.id, razonRechazo.trim());
            setConfirmRechazar(null);
            setRazonRechazo('');
        } finally {
            setProcesando(false);
        }
    };

    const openAprobarDialog = (r: Reserva) => {
        setErrorAprobacion(null); // Clear previous errors
        setConfirmAprobar(r);
    };

    return (
        <>
            <Card className="h-full flex flex-col shadow-none border-border">
                <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Solicitudes Pendientes
                    </h3>
                    <Badge variant="secondary" className="font-mono">
                        {reservas.length}
                    </Badge>
                </div>
                <CardContent className="flex-1 overflow-auto p-0">
                    {cargando ? (
                        <div className="p-8 flex justify-center"><RefreshCw className="animate-spin text-muted-foreground" /></div>
                    ) : reservas.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">No hay solicitudes pendientes</div>
                    ) : (
                        <div className="divide-y">
                            {reservas.map(r => (
                                <div key={r.id} className="p-4 hover:bg-muted/50 transition-colors flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="font-medium">{r.reservadoPorNombre || r.reservadoPor}</div>
                                        <div className="text-sm text-foreground/80">
                                            Solicita <span className="font-semibold">{r.cantidad}</span> de <span className="font-semibold text-primary">{r.itemNombre}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="bg-muted px-1.5 py-0.5 rounded font-mono">{r.stockItemId.substring(0, 8)}...</span>
                                            <span>•</span>
                                            <span>{new Date(r.fechaReserva).toLocaleDateString()}</span>
                                        </div>
                                        {r.notas && <div className="text-xs italic text-muted-foreground mt-1 bg-muted/30 p-1.5 rounded border">"{r.notas}"</div>}
                                    </div>
                                    <div className="flex items-center gap-1 self-center">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleVerItem(r.stockItemId)} title="Ver item">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200" onClick={() => openAprobarDialog(r)} title="Aprobar">
                                            <Check className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200" onClick={() => setConfirmRechazar(r)} title="Rechazar">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dialog Aprobar */}
            <AlertDialog open={!!confirmAprobar} onOpenChange={(open) => { if (!open) { setConfirmAprobar(null); setErrorAprobacion(null); } }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Aprobación</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-3">
                                <p>
                                    ¿Aprobar reserva de <strong>{confirmAprobar?.cantidad}</strong> unidades de <strong>{confirmAprobar?.itemNombre}</strong> para <strong>{confirmAprobar?.reservadoPorNombre || confirmAprobar?.reservadoPor}</strong>?
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => confirmAprobar && handleVerItem(confirmAprobar.stockItemId)}
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver detalles del item
                                </Button>
                                {errorAprobacion && (
                                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                        <span>{errorAprobacion}</span>
                                    </div>
                                )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={procesando}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAprobar} disabled={procesando} className="bg-green-600 hover:bg-green-700">
                            {procesando ? 'Procesando...' : 'Aprobar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Dialog Rechazar */}
            <AlertDialog open={!!confirmRechazar} onOpenChange={(open) => { if (!open) { setConfirmRechazar(null); setRazonRechazo(''); } }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Rechazar Solicitud</AlertDialogTitle>
                        <AlertDialogDescription>
                            Por favor indica el motivo del rechazo. El solicitante podrá ver esta razón.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <textarea
                            className="w-full p-3 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={3}
                            placeholder="Motivo del rechazo (requerido)..."
                            value={razonRechazo}
                            onChange={(e) => setRazonRechazo(e.target.value)}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={procesando}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRechazar}
                            disabled={procesando || !razonRechazo.trim()}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {procesando ? 'Procesando...' : 'Rechazar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal Detalle Item */}
            <DetalleItemModal
                item={verItemDetalle}
                abierto={!!verItemDetalle}
                onCerrar={() => setVerItemDetalle(null)}
            />
        </>
    );
}

function ActivePanel() {
    const { reservas, cargando, cargar, liberar } = useReservations();
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        cargar({ estado: 'activa', limite: limit, offset: (page - 1) * limit });
    }, [page]);

    const handleLiberar = async (r: Reserva) => {
        if (confirm(`¿Devolver ${r.cantidad} unidades al inventario?`)) {
            await liberar({ reservaId: r.id });
        }
    };

    return (
        <Card className="h-full flex flex-col shadow-none border-border">
            <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                <h3 className="font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Reservas Activas
                </h3>
            </div>
            <CardContent className="flex-1 overflow-auto p-0">
                {cargando && reservas.length === 0 ? (
                    <div className="p-8 flex justify-center"><RefreshCw className="animate-spin text-muted-foreground" /></div>
                ) : reservas.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">No hay reservas activas</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[40%]">Item</TableHead>
                                <TableHead className="w-[30%]">Usuario</TableHead>
                                <TableHead className="text-right w-[15%]">Cant.</TableHead>
                                <TableHead className="text-right w-[15%]">Acción</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reservas.map(r => (
                                <TableRow key={r.id} className="hover:bg-muted/50">
                                    <TableCell>
                                        <div className="font-medium text-sm">{r.itemNombre}</div>
                                        <div className="text-xs font-mono text-muted-foreground">{r.stockItemId.substring(0, 8)}...</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-medium">{r.reservadoPorNombre || r.reservadoPor}</div>
                                        <div className="text-xs text-muted-foreground">{new Date(r.fechaReserva).toLocaleDateString()}</div>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">{r.cantidad}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleLiberar(r)} title="Devolver">
                                            <Undo2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
            <div className="p-2 border-t flex justify-end gap-2 bg-muted/20">
                <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</Button>
                <Button variant="ghost" size="sm" onClick={() => setPage(p => p + 1)} disabled={reservas.length < limit}>Siguiente</Button>
            </div>
        </Card>
    );
}

function HistoryPanel() {
    const { reservas, cargando, cargar } = useReservations();
    const [page, setPage] = useState(1);
    const limit = 20;

    useEffect(() => {
        cargar({ limite: limit, offset: (page - 1) * limit }); // All statuses
    }, [page]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Historial Completo</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Cant.</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reservas.map(r => (
                            <TableRow key={r.id}>
                                <TableCell>{new Date(r.fechaReserva).toLocaleDateString()}</TableCell>
                                <TableCell>{r.reservadoPorNombre || r.reservadoPor}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={ESTADO_RESERVA_COLORS[r.estado]}>
                                        {ESTADO_RESERVA_LABELS[r.estado]}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">{r.cantidad}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="py-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={reservas.length < limit}>Siguiente</Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function ReservasDashboard() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    // We intentionally don't use useReservations here to avoid conflicting states.
    // Each panel manages its own data.

    // BUT we need a way to refresh both panels if a new reservation is created.
    // For now, simplistically, we can just rely on the user refreshing manually or 
    // force a remount. Let's use a key to force remount.
    const [refreshKey, setRefreshKey] = useState(0);
    const handleRefreshAll = () => setRefreshKey(k => k + 1);

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gestión de Reservas</h1>
                    <p className="text-muted-foreground">Administración de solicitudes y préstamos de inventario</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleRefreshAll}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Actualizar Todo
                    </Button>
                    <Button size="sm" onClick={() => setMostrarFormulario(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Reserva
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="gestion" className="flex-1 flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mb-4 shrink-0">
                    <TabsTrigger value="gestion">Gestión Activa</TabsTrigger>
                    <TabsTrigger value="historial">Historial</TabsTrigger>
                </TabsList>

                <TabsContent value="gestion" className="flex-1 min-h-0 mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full min-h-[500px]">
                        <div className="h-full min-h-0 overflow-hidden" key={`pending-${refreshKey}`}>
                            <PendingPanel />
                        </div>
                        <div className="h-full min-h-0 overflow-hidden" key={`active-${refreshKey}`}>
                            <ActivePanel />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="historial" className="mt-0 overflow-auto">
                    <div key={`history-${refreshKey}`}>
                        <HistoryPanel />
                    </div>
                </TabsContent>
            </Tabs>

            <FormularioReserva
                abierto={mostrarFormulario}
                onCerrar={() => setMostrarFormulario(false)}
                onExito={handleRefreshAll}
            />
        </div>
    );
}

