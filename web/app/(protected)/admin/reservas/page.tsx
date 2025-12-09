"use client";

/**
 * Mis Reservas - Vista para usuarios guest
 * Permite crear nuevas reservas y ver las propias
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import { Button } from '@/shared/ui/buttons/button';
import { Badge } from '@/shared/ui/badges/badge';
import { Input } from '@/shared/ui/inputs/input';
import { Label } from '@/shared/ui/labels/label';
import { Textarea } from '@/shared/ui/inputs/textarea';
import {
    CalendarClock,
    Plus,
    Package,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    Send,
} from 'lucide-react';
import { useAuth } from '@/features/auth';

// Mock data - será reemplazado con API real
const MOCK_MIS_RESERVAS = [
    {
        id: '1',
        item: 'Impresora 3D Prusa',
        cantidad: 1,
        estado: 'pendiente' as const,
        fechaSolicitud: '2025-12-09T10:00:00',
        fechaReserva: '2025-12-12T14:00:00',
        notas: 'Para proyecto de robótica',
    },
    {
        id: '2',
        item: 'Arduino Mega',
        cantidad: 2,
        estado: 'aprobada' as const,
        fechaSolicitud: '2025-12-08T15:30:00',
        fechaReserva: '2025-12-10T09:00:00',
        notas: '',
    },
    {
        id: '3',
        item: 'Cortadora Láser',
        cantidad: 1,
        estado: 'rechazada' as const,
        fechaSolicitud: '2025-12-07T11:00:00',
        fechaReserva: '2025-12-09T16:00:00',
        notas: 'No disponible en esa fecha',
    },
];

const ESTADO_COLORS = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    aprobada: 'bg-green-100 text-green-800',
    rechazada: 'bg-red-100 text-red-800',
};

const ESTADO_LABELS = {
    pendiente: 'Pendiente',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada',
};

export default function MisReservasPage() {
    const { user } = useAuth();
    const [misReservas] = useState(MOCK_MIS_RESERVAS);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [formData, setFormData] = useState({
        item: '',
        cantidad: 1,
        fechaReserva: '',
        notas: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);
        // Mock - simular envío
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEnviando(false);
        setMostrarFormulario(false);
        setFormData({ item: '', cantidad: 1, fechaReserva: '', notas: '' });
        alert('Solicitud de reserva enviada. Recibirás una notificación cuando sea procesada.');
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

    const pendientes = misReservas.filter(r => r.estado === 'pendiente').length;
    const aprobadas = misReservas.filter(r => r.estado === 'aprobada').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <CalendarClock className="h-6 w-6 text-blue-600" />
                        Mis Reservas
                    </h1>
                    <p className="text-muted-foreground">
                        Solicita y consulta tus reservas de equipos del FabLab
                    </p>
                </div>
                <Button onClick={() => setMostrarFormulario(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Nueva Solicitud
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pendientes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{pendientes}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Aprobadas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{aprobadas}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Solicitudes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{misReservas.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Formulario Nueva Solicitud */}
            {mostrarFormulario && (
                <Card className="border-blue-200 bg-blue-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Send className="h-5 w-5" />
                            Nueva Solicitud de Reserva
                        </CardTitle>
                        <CardDescription>
                            Completa el formulario para solicitar una reserva de equipos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="item">Equipo a reservar *</Label>
                                    <Input
                                        id="item"
                                        placeholder="Ej: Impresora 3D, Cortadora Láser..."
                                        value={formData.item}
                                        onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cantidad">Cantidad</Label>
                                    <Input
                                        id="cantidad"
                                        type="number"
                                        min="1"
                                        value={formData.cantidad}
                                        onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fechaReserva">Fecha y hora deseada *</Label>
                                <Input
                                    id="fechaReserva"
                                    type="datetime-local"
                                    value={formData.fechaReserva}
                                    onChange={(e) => setFormData({ ...formData, fechaReserva: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notas">Notas adicionales</Label>
                                <Textarea
                                    id="notas"
                                    placeholder="Describe para qué proyecto necesitas el equipo..."
                                    value={formData.notas}
                                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setMostrarFormulario(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={enviando}>
                                    {enviando ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-1" />
                                            Enviar Solicitud
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Lista de Reservas */}
            <Card>
                <CardHeader>
                    <CardTitle>Historial de Solicitudes</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {misReservas.length === 0 ? (
                        <div className="text-center py-12">
                            <CalendarClock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">No tienes reservas aún</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => setMostrarFormulario(true)}
                            >
                                Hacer tu primera solicitud
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {misReservas.map((reserva) => (
                                <div
                                    key={reserva.id}
                                    className="p-4 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{reserva.item}</span>
                                                <Badge className="text-xs">x{reserva.cantidad}</Badge>
                                                <Badge
                                                    variant="outline"
                                                    className={ESTADO_COLORS[reserva.estado]}
                                                >
                                                    {reserva.estado === 'aprobada' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                                    {reserva.estado === 'rechazada' && <XCircle className="h-3 w-3 mr-1" />}
                                                    {ESTADO_LABELS[reserva.estado]}
                                                </Badge>
                                            </div>

                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    Reserva: {formatFecha(reserva.fechaReserva)}
                                                </span>
                                                <span className="text-xs">
                                                    Solicitado: {formatFecha(reserva.fechaSolicitud)}
                                                </span>
                                            </div>

                                            {reserva.notas && (
                                                <p className="text-xs text-muted-foreground mt-1 italic">
                                                    {reserva.notas}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
