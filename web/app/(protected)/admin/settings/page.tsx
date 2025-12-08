"use client";

import { UnidadesMedidaSettings } from '@/features/inventory/presentation/pages/settings/uom-settings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/misc/tabs';
import { Settings, Ruler, Database, Building2, Package } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Settings className="h-6 w-6" />
                    Configuración
                </h1>
                <p className="text-muted-foreground">
                    Configuración del sistema de inventario
                </p>
            </div>

            {/* Tabs de configuración */}
            <Tabs defaultValue="uom" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="uom" className="flex items-center gap-2">
                        <Ruler className="h-4 w-4" />
                        Unidades de Medida
                    </TabsTrigger>
                    <TabsTrigger value="locations" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Ubicaciones
                    </TabsTrigger>
                    <TabsTrigger value="general" className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        General
                    </TabsTrigger>
                </TabsList>

                {/* Tab: Unidades de Medida */}
                <TabsContent value="uom">
                    <Card>
                        <CardHeader>
                            <CardTitle>Unidades de Medida</CardTitle>
                            <CardDescription>
                                Gestiona las unidades de medida disponibles en el sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UnidadesMedidaSettings />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Ubicaciones */}
                <TabsContent value="locations">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuración de Ubicaciones</CardTitle>
                            <CardDescription>
                                Cómo gestionar las ubicaciones de inventario
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Guía de configuración */}
                            <div className="space-y-4">
                                <h4 className="font-medium">¿Cómo configurar una ubicación?</h4>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                    <li>Ve a <strong>Inventario → Locaciones</strong></li>
                                    <li>Selecciona una ubicación de la lista</li>
                                    <li>Haz clic en el botón <strong>"Configurar"</strong></li>
                                    <li>Define capacidades y restricciones</li>
                                </ol>
                            </div>

                            {/* Opciones disponibles */}
                            <div className="space-y-4">
                                <h4 className="font-medium">Opciones de configuración</h4>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-lg border p-4">
                                        <h5 className="font-medium text-sm mb-2">📦 Capacidad Máxima</h5>
                                        <ul className="text-xs text-muted-foreground space-y-1">
                                            <li>• <strong>Cantidad:</strong> Límite de ítems diferentes</li>
                                            <li>• <strong>Peso:</strong> Límite en kilogramos</li>
                                            <li>• <strong>Volumen:</strong> Límite en metros cúbicos</li>
                                        </ul>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <h5 className="font-medium text-sm mb-2">🔒 Restricciones</h5>
                                        <ul className="text-xs text-muted-foreground space-y-1">
                                            <li>• <strong>Mezclar SKUs:</strong> Permitir diferentes productos</li>
                                            <li>• <strong>Mezclar Lotes:</strong> Permitir diferentes lotes</li>
                                            <li>• <strong>FIFO:</strong> Forzar primero-en-primero-fuera</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Tipos de ubicación */}
                            <div className="space-y-4">
                                <h4 className="font-medium">Tipos de ubicación</h4>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                                        <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm">Bodega / Almacén</p>
                                            <p className="text-xs text-muted-foreground">
                                                Ubicación principal que puede contener sub-ubicaciones
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                                        <Package className="h-5 w-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm">Unidad de Almacenamiento</p>
                                            <p className="text-xs text-muted-foreground">
                                                Estante, cajón, repisa - ubicación específica
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: General */}
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuración General</CardTitle>
                            <CardDescription>
                                Opciones generales del módulo de inventario
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-lg border p-4">
                                <h4 className="font-medium mb-2">Conexión API</h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                    El sistema está conectado a Vessel API
                                </p>
                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                    {process.env.NEXT_PUBLIC_VESSEL_API_URL || 'http://127.0.0.1:8000'}
                                </code>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
