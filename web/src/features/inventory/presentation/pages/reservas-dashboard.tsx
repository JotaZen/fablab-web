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
} from 'lucide-react';
import { useReservations } from '../hooks/use-reservations';
import { FormularioReserva } from '../components/reservations/formulario-reserva';
import type { Reserva, EstadoReserva } from '../../domain/entities/reservation';
import { ESTADO_RESERVA_LABELS, ESTADO_RESERVA_COLORS, TIPO_REFERENCIA_LABELS } from '../../domain/entities/reservation';

export function ReservasDashboard() {
    const { reservas, cargando, total, cargar, liberar, cancelar } = useReservations();
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [filtroEstado, setFiltroEstado] = useState<EstadoReserva | 'todas'>('activa');

    useEffect(() => {
        cargar(filtroEstado === 'todas' ? {} : { estado: filtroEstado });
    }, [filtroEstado]);

    const handleRefresh = () => {
        cargar(filtroEstado === 'todas' ? {} : { estado: filtroEstado });
    };

    const handleLiberar = async (reserva: Reserva) => {
        if (confirm(`¿Liberar la reserva de ${reserva.cantidad} unidades?`)) {
            await liberar({ reservaId: reserva.id });
        }
    };

    const handleCancelar = async (reserva: Reserva) => {
        if (confirm('¿Cancelar esta reserva?')) {
            await cancelar(reserva.id);
        }
    };

    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-CL', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isExpirando = (reserva: Reserva) => {
        if (!reserva.fechaExpiracion) return false;
        const exp = new Date(reserva.fechaExpiracion);
        const ahora = new Date();
        const diffHoras = (exp.getTime() - ahora.getTime()) / (1000 * 60 * 60);
        return diffHoras > 0 && diffHoras < 24;
    };

    // Estadísticas
    const activas = reservas.filter(r => r.estado === 'activa').length;
    const cantidadReservada = reservas
        .filter(r => r.estado === 'activa')
        .reduce((sum, r) => sum + r.cantidad, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <CalendarClock className="h-6 w-6 text-blue-600" />
                        Reservas
                    </h1>
                    <p className="text-muted-foreground">
                        Gestiona las reservas de stock del inventario
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={cargando}
                    >
                        <RefreshCw className={`h-4 w-4 mr-1 ${cargando ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                    <Button size="sm" onClick={() => setMostrarFormulario(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Nueva Reserva
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Reservas Activas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{activas}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Unidades Reservadas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{cantidadReservada}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Histórico
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-muted-foreground">{total}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 flex-wrap">
                {(['activa', 'liberada', 'consumida', 'expirada', 'todas'] as const).map((estado) => (
                    <Button
                        key={estado}
                        variant={filtroEstado === estado ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFiltroEstado(estado)}
                    >
                        {estado === 'todas' ? 'Todas' : ESTADO_RESERVA_LABELS[estado]}
                    </Button>
                ))}
            </div>

            {/* Lista de Reservas */}
            <Card>
                <CardContent className="p-0">
                    {cargando ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : reservas.length === 0 ? (
                        <div className="text-center py-12">
                            <CalendarClock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">No hay reservas</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => setMostrarFormulario(true)}
                            >
                                Crear primera reserva
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {reservas.map((reserva) => (
                                <div
                                    key={reserva.id}
                                    className="p-4 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        {/* Info principal */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xl font-bold">{reserva.cantidad}</span>
                                                <Badge
                                                    variant="outline"
                                                    className={ESTADO_RESERVA_COLORS[reserva.estado]}
                                                >
                                                    {ESTADO_RESERVA_LABELS[reserva.estado]}
                                                </Badge>
                                                {isExpirando(reserva) && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        ¡Expira pronto!
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3.5 w-3.5" />
                                                    {reserva.reservadoPorNombre || reserva.reservadoPor}
                                                </span>
                                                {reserva.referenciaNombre && (
                                                    <span className="flex items-center gap-1">
                                                        <Package className="h-3.5 w-3.5" />
                                                        {reserva.tipoReferencia && TIPO_REFERENCIA_LABELS[reserva.tipoReferencia]}: {reserva.referenciaNombre}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {formatFecha(reserva.fechaReserva)}
                                                </span>
                                                {reserva.fechaExpiracion && (
                                                    <span className="flex items-center gap-1">
                                                        <ChevronRight className="h-3.5 w-3.5" />
                                                        Hasta: {formatFecha(reserva.fechaExpiracion)}
                                                    </span>
                                                )}
                                            </div>

                                            {reserva.notas && (
                                                <p className="text-xs text-muted-foreground mt-1 italic">
                                                    {reserva.notas}
                                                </p>
                                            )}
                                        </div>

                                        {/* Acciones */}
                                        {reserva.estado === 'activa' && (
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleLiberar(reserva)}
                                                    title="Liberar reserva"
                                                >
                                                    <Unlock className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCancelar(reserva)}
                                                    title="Cancelar reserva"
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal Nueva Reserva */}
            <FormularioReserva
                abierto={mostrarFormulario}
                onCerrar={() => setMostrarFormulario(false)}
                onExito={handleRefresh}
            />
        </div>
    );
}
