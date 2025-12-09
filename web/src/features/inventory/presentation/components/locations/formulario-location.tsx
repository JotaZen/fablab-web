/**
 * Formulario de Locación de Inventario
 * 
 * Modal simple para crear locaciones de almacenamiento
 */

"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Label } from '@/shared/ui/labels/label';
import { Textarea } from '@/shared/ui/inputs/textarea';
import { Card, CardContent } from '@/shared/ui/cards/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/misc/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/inputs/select';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/shared/ui/misc/dialog';
import {
    Loader2,
    Warehouse,
    Settings,
    Box,
    AlertTriangle,
} from 'lucide-react';
import type { CreateLocationDTO } from '../../../domain/entities/location';

interface FormularioLocationProps {
    abierto: boolean;
    onCerrar: () => void;
    onGuardar: (data: CreateLocationDTO) => Promise<void>;
    cargando?: boolean;
    locacionesPadre?: { id: string; nombre: string }[];
    padreIdPreseleccionado?: string;
}

/** Tipos de locación de inventario */
const TIPOS_LOCACION = [
    { valor: 'warehouse', etiqueta: 'Bodega / Almacén', descripcion: 'Puede contener sub-locaciones' },
    { valor: 'storage_unit', etiqueta: 'Estante / Cajón', descripcion: 'Unidad de almacenamiento' },
];

export function FormularioLocation({
    abierto,
    onCerrar,
    onGuardar,
    cargando = false,
    locacionesPadre = [],
    padreIdPreseleccionado,
}: FormularioLocationProps) {
    // Datos básicos
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState<'warehouse' | 'storage_unit'>('warehouse');
    const [padreId, setPadreId] = useState<string>('__none__');
    const [descripcion, setDescripcion] = useState('');

    // Configuraciones
    const [capacidadMaxima, setCapacidadMaxima] = useState('');
    const [stockMinimo, setStockMinimo] = useState('');
    const [alertaBajoStock, setAlertaBajoStock] = useState(false);

    const [guardando, setGuardando] = useState(false);
    const [tabActiva, setTabActiva] = useState('basico');

    // Reset al abrir
    useEffect(() => {
        if (abierto) {
            setNombre('');
            setTipo('warehouse');
            setPadreId(padreIdPreseleccionado || '__none__');
            setDescripcion('');
            setCapacidadMaxima('');
            setStockMinimo('');
            setAlertaBajoStock(false);
            setTabActiva('basico');
        }
    }, [abierto, padreIdPreseleccionado]);

    const handleSubmit = async () => {
        if (!nombre.trim()) return;

        setGuardando(true);
        try {
            await onGuardar({
                name: nombre.trim(),
                type: tipo,
                parentId: padreId === '__none__' ? undefined : padreId,
                description: descripcion.trim() || undefined,
                meta: {
                    capacidadMaxima: capacidadMaxima ? parseInt(capacidadMaxima, 10) : undefined,
                    stockMinimo: stockMinimo ? parseInt(stockMinimo, 10) : undefined,
                    alertaBajoStock,
                },
            });
            onCerrar();
        } finally {
            setGuardando(false);
        }
    };

    const puedeGuardar = nombre.trim() && !guardando;

    return (
        <Dialog open={abierto} onOpenChange={onCerrar}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Warehouse className="h-5 w-5 text-primary" />
                        Nueva Locación
                    </DialogTitle>
                    <DialogDescription>
                        Crea una nueva ubicación para almacenar inventario
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={tabActiva} onValueChange={setTabActiva} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="basico" className="gap-2">
                            <Box className="h-4 w-4" />
                            Información
                        </TabsTrigger>
                        <TabsTrigger value="config" className="gap-2">
                            <Settings className="h-4 w-4" />
                            Configuración
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB: INFORMACIÓN BÁSICA */}
                    <TabsContent value="basico" className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre *</Label>
                            <Input
                                id="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej: Bodega Principal, Estante A1..."
                                disabled={guardando}
                                className="h-11"
                                autoFocus
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tipo">Tipo</Label>
                            <Select
                                value={tipo}
                                onValueChange={(v) => setTipo(v as 'warehouse' | 'storage_unit')}
                                disabled={guardando}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIPOS_LOCACION.map((t) => (
                                        <SelectItem key={t.valor} value={t.valor}>
                                            {t.etiqueta}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                {tipo === 'warehouse'
                                    ? 'Las bodegas pueden contener sub-locaciones'
                                    : 'Los estantes son unidades finales de almacenamiento'
                                }
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="padre">Ubicar dentro de (Opcional)</Label>
                            <Select
                                value={padreId}
                                onValueChange={setPadreId}
                                disabled={guardando}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar bodega padre..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__none__">Sin ubicación superior (Raíz)</SelectItem>
                                    {locacionesPadre.map((loc) => (
                                        <SelectItem key={loc.id} value={loc.id}>
                                            <div className="flex items-center gap-2">
                                                <Warehouse className="h-4 w-4 text-muted-foreground" />
                                                {loc.nombre}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción (opcional)</Label>
                            <Textarea
                                id="descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Notas sobre esta locación..."
                                rows={2}
                                disabled={guardando}
                            />
                        </div>
                    </TabsContent>

                    {/* TAB: CONFIGURACIÓN */}
                    <TabsContent value="config" className="space-y-4 pt-4">
                        <Card className="border-dashed">
                            <CardContent className="pt-4 space-y-4">
                                {/* Capacidad */}
                                <div className="space-y-2">
                                    <Label htmlFor="capacidad">
                                        Capacidad máxima de items
                                    </Label>
                                    <Input
                                        id="capacidad"
                                        type="number"
                                        value={capacidadMaxima}
                                        onChange={(e) => setCapacidadMaxima(e.target.value)}
                                        placeholder="Sin límite"
                                        disabled={guardando}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Cantidad máxima de items que puede almacenar
                                    </p>
                                </div>

                                {/* Stock mínimo */}
                                <div className="space-y-2">
                                    <Label htmlFor="stockMinimo" className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        Alerta de stock bajo
                                    </Label>
                                    <Input
                                        id="stockMinimo"
                                        type="number"
                                        value={stockMinimo}
                                        onChange={(e) => setStockMinimo(e.target.value)}
                                        placeholder="Cantidad mínima antes de alertar"
                                        disabled={guardando}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Recibirás alerta cuando el stock baje de este nivel
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <p className="text-xs text-muted-foreground text-center">
                            💡 Configuraciones avanzadas cuando el backend las soporte
                        </p>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onCerrar} disabled={guardando}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={!puedeGuardar}>
                        {guardando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Crear Locación
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
