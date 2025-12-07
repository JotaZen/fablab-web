/**
 * Modal de Configuración de Ubicación
 * 
 * Permite configurar capacidad y restricciones de una ubicación
 */

"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Label } from '@/shared/ui/labels/label';
import { Switch } from '@/shared/ui/inputs/switch';
import { Badge } from '@/shared/ui/badges/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/misc/dialog';
import { Loader2, Package, Scale, Ruler, AlertCircle, Trash2 } from 'lucide-react';
import { getLocationCapacityClient } from '../../../infrastructure/vessel/location-capacity.client';
import type { ConfiguracionCapacidad, CrearConfiguracionDTO } from '../../../domain/entities/location-capacity';
import type { Locacion } from '../../../domain/entities/location';

interface ConfiguracionUbicacionModalProps {
    ubicacion: Locacion | null;
    abierto: boolean;
    onCerrar: () => void;
}

export function ConfiguracionUbicacionModal({
    ubicacion,
    abierto,
    onCerrar,
}: ConfiguracionUbicacionModalProps) {
    const [config, setConfig] = useState<ConfiguracionCapacidad | null>(null);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [maxQuantity, setMaxQuantity] = useState<string>('');
    const [maxWeight, setMaxWeight] = useState<string>('');
    const [maxVolume, setMaxVolume] = useState<string>('');
    const [allowMixedLots, setAllowMixedLots] = useState(true);
    const [allowMixedSkus, setAllowMixedSkus] = useState(true);
    const [fifoEnforced, setFifoEnforced] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const client = getLocationCapacityClient();

    // Load config when modal opens
    useEffect(() => {
        if (abierto && ubicacion) {
            loadConfig();
        }
    }, [abierto, ubicacion?.id]);

    const loadConfig = async () => {
        if (!ubicacion) return;

        setCargando(true);
        setError(null);

        try {
            const data = await client.obtener(ubicacion.id);
            setConfig(data);

            // Populate form
            if (data) {
                setMaxQuantity(data.maxQuantity?.toString() || '');
                setMaxWeight(data.maxWeight?.toString() || '');
                setMaxVolume(data.maxVolume?.toString() || '');
                setAllowMixedLots(data.allowMixedLots);
                setAllowMixedSkus(data.allowMixedSkus);
                setFifoEnforced(data.fifoEnforced);
                setIsActive(data.isActive);
            } else {
                // Reset to defaults
                setMaxQuantity('');
                setMaxWeight('');
                setMaxVolume('');
                setAllowMixedLots(true);
                setAllowMixedSkus(true);
                setFifoEnforced(false);
                setIsActive(true);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error cargando configuración');
        } finally {
            setCargando(false);
        }
    };

    const handleGuardar = async () => {
        if (!ubicacion) return;

        setGuardando(true);
        setError(null);

        try {
            const dto: CrearConfiguracionDTO = {
                locationId: ubicacion.id,
                maxQuantity: maxQuantity ? parseInt(maxQuantity) : null,
                maxWeight: maxWeight ? parseFloat(maxWeight) : null,
                maxVolume: maxVolume ? parseFloat(maxVolume) : null,
                allowMixedLots,
                allowMixedSkus,
                fifoEnforced,
                isActive,
            };

            await client.guardar(dto);
            onCerrar();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error guardando configuración');
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = async () => {
        if (!ubicacion || !config) return;
        if (!confirm('¿Eliminar configuración? La ubicación volverá a no tener límites.')) return;

        setGuardando(true);
        try {
            await client.eliminar(ubicacion.id);
            onCerrar();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error eliminando configuración');
        } finally {
            setGuardando(false);
        }
    };

    const tieneConfiguracion = config !== null;

    return (
        <Dialog open={abierto} onOpenChange={(open) => !open && onCerrar()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Configuración de Ubicación
                    </DialogTitle>
                    <DialogDescription>
                        {ubicacion?.nombre} - Define límites y restricciones de inventario
                    </DialogDescription>
                </DialogHeader>

                {cargando ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        {/* Status */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <span className="text-sm font-medium">Estado actual</span>
                            <Badge variant={tieneConfiguracion ? 'default' : 'secondary'}>
                                {tieneConfiguracion ? 'Configurado' : 'Sin límites'}
                            </Badge>
                        </div>

                        {/* Capacidad */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Capacidad Máxima
                            </h4>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="maxQuantity" className="text-xs">Cantidad (unidades)</Label>
                                    <Input
                                        id="maxQuantity"
                                        type="number"
                                        placeholder="∞"
                                        value={maxQuantity}
                                        onChange={(e) => setMaxQuantity(e.target.value)}
                                        disabled={guardando}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxWeight" className="text-xs flex items-center gap-1">
                                        <Scale className="h-3 w-3" /> Peso (kg)
                                    </Label>
                                    <Input
                                        id="maxWeight"
                                        type="number"
                                        step="0.01"
                                        placeholder="∞"
                                        value={maxWeight}
                                        onChange={(e) => setMaxWeight(e.target.value)}
                                        disabled={guardando}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxVolume" className="text-xs flex items-center gap-1">
                                        <Ruler className="h-3 w-3" /> Volumen (m³)
                                    </Label>
                                    <Input
                                        id="maxVolume"
                                        type="number"
                                        step="0.01"
                                        placeholder="∞"
                                        value={maxVolume}
                                        onChange={(e) => setMaxVolume(e.target.value)}
                                        disabled={guardando}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Restricciones */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold">Restricciones de Mezcla</h4>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-sm">Permitir mezclar SKUs</Label>
                                        <p className="text-xs text-muted-foreground">¿Puede contener diferentes productos?</p>
                                    </div>
                                    <Switch
                                        checked={allowMixedSkus}
                                        onCheckedChange={setAllowMixedSkus}
                                        disabled={guardando}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-sm">Permitir mezclar lotes</Label>
                                        <p className="text-xs text-muted-foreground">¿Puede contener diferentes lotes del mismo SKU?</p>
                                    </div>
                                    <Switch
                                        checked={allowMixedLots}
                                        onCheckedChange={setAllowMixedLots}
                                        disabled={guardando}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Políticas */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold">Políticas</h4>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-sm">FIFO estricto</Label>
                                        <p className="text-xs text-muted-foreground">Forzar salida primero-en-primero-fuera</p>
                                    </div>
                                    <Switch
                                        checked={fifoEnforced}
                                        onCheckedChange={setFifoEnforced}
                                        disabled={guardando}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-sm">Configuración activa</Label>
                                        <p className="text-xs text-muted-foreground">Desactivar ignora temporalmente estas reglas</p>
                                    </div>
                                    <Switch
                                        checked={isActive}
                                        onCheckedChange={setIsActive}
                                        disabled={guardando}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    {tieneConfiguracion && (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleEliminar}
                            disabled={guardando || cargando}
                            className="sm:mr-auto"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar límites
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCerrar}
                        disabled={guardando}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleGuardar}
                        disabled={guardando || cargando}
                    >
                        {guardando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Guardar Configuración
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
