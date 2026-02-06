"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/cards/card";
import { Badge } from "@/shared/ui/misc/badge";
import { Button } from "@/shared/ui/buttons/button";
import {
    Cpu,
    Package,
    AlertTriangle,
    Activity,
    Eye,
    ArrowRight,
    RefreshCw,
    Loader2,
    LayoutDashboard,
    Boxes,
} from "lucide-react";
import Link from "next/link";
import { getInventoryStats } from "./actions";
import type { InventoryStats } from "./actions";

export default function AdminInventoryPage() {
    const [stats, setStats] = useState<InventoryStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const s = await getInventoryStats();
            setStats(s);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
                    <p className="text-gray-500">Cargando inventario...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-xl">
                            <LayoutDashboard className="h-7 w-7 text-orange-600" />
                        </div>
                        Inventario
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Panel general del inventario del FabLab
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={loadData} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Actualizar
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-blue-500" />
                            Equipos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats?.totalEquipment || 0}</div>
                        <div className="flex gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                {stats?.availableEquipment || 0} disponibles
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                                {stats?.maintenanceEquipment || 0} mantención
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Package className="h-4 w-4 text-amber-500" />
                            Inventario General
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats?.totalInventoryItems || 0}</div>
                        <div className="flex gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                                {stats?.lowStockItems || 0} stock bajo
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                {stats?.outOfStockItems || 0} agotados
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-500" />
                            Usos Activos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats?.activeUsages || 0}</div>
                        <p className="text-xs text-gray-500 mt-2">Equipos siendo utilizados ahora</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Eye className="h-4 w-4 text-purple-500" />
                            En /tecnologías
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-600">{stats?.visibleInTecnologias || 0}</div>
                        <p className="text-xs text-gray-500 mt-2">Equipos visibles en la web pública</p>
                    </CardContent>
                </Card>
            </div>

            {/* Low Stock Alert */}
            {(stats?.lowStockItems || 0) + (stats?.outOfStockItems || 0) > 0 && (
                <Card className="border-yellow-300 bg-yellow-50/50">
                    <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-yellow-800">
                                    {(stats?.lowStockItems || 0) + (stats?.outOfStockItems || 0)} items requieren atención
                                </p>
                                <p className="text-sm text-yellow-600">
                                    {stats?.lowStockItems || 0} con stock bajo, {stats?.outOfStockItems || 0} agotados
                                </p>
                            </div>
                            <Link href="/admin/inventory/items?tab=inventory">
                                <Button size="sm" variant="outline" className="border-yellow-400 text-yellow-700 hover:bg-yellow-100">
                                    Ver inventario
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Gestión */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Gestión</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                        {/* Equipos */}
                        <Link href="/admin/inventory/items">
                            <Card className="cursor-pointer transition-all hover:shadow-md hover:border-blue-300 group h-full">
                                <CardContent className="flex items-start gap-4 pt-6 pb-6">
                                    <div className="rounded-xl bg-blue-100 p-3 group-hover:bg-blue-200 transition-colors">
                                        <Cpu className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-gray-900">Equipos</h4>
                                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Impresoras 3D, cortadoras láser, CNC, electrónica y más
                                        </p>
                                        <div className="flex gap-2 mt-3">
                                            <Badge className="bg-blue-50 text-blue-600 text-xs">{stats?.totalEquipment || 0} equipos</Badge>
                                            <Badge className="bg-green-50 text-green-600 text-xs">{stats?.availableEquipment || 0} disponibles</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Uso de Equipos */}
                        <Link href="/admin/equipment-usage">
                            <Card className="cursor-pointer transition-all hover:shadow-md hover:border-green-300 group h-full">
                                <CardContent className="flex items-start gap-4 pt-6 pb-6">
                                    <div className="rounded-xl bg-green-100 p-3 group-hover:bg-green-200 transition-colors">
                                        <Activity className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-gray-900">Uso de Equipos</h4>
                                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Registra y gestiona el uso de equipos del FabLab
                                        </p>
                                        <div className="flex gap-2 mt-3">
                                            <Badge className="bg-green-50 text-green-600 text-xs">{stats?.activeUsages || 0} usos activos</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Insumos y Materiales */}
                        <Link href="/admin/inventory/items?tab=inventory">
                            <Card className="cursor-pointer transition-all hover:shadow-md hover:border-amber-300 group h-full">
                                <CardContent className="flex items-start gap-4 pt-6 pb-6">
                                    <div className="rounded-xl bg-amber-100 p-3 group-hover:bg-amber-200 transition-colors">
                                        <Boxes className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-gray-900">Insumos y Materiales</h4>
                                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Filamentos, resinas, componentes, consumibles
                                        </p>
                                        <div className="flex gap-2 mt-3">
                                            <Badge className="bg-amber-50 text-amber-600 text-xs">{stats?.totalInventoryItems || 0} items</Badge>
                                            {(stats?.lowStockItems || 0) > 0 && (
                                                <Badge className="bg-red-50 text-red-600 text-xs">{stats?.lowStockItems || 0} stock bajo</Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Visibilidad Web */}
                        <Link href="/admin/inventory/items">
                            <Card className="cursor-pointer transition-all hover:shadow-md hover:border-purple-300 group h-full">
                                <CardContent className="flex items-start gap-4 pt-6 pb-6">
                                    <div className="rounded-xl bg-purple-100 p-3 group-hover:bg-purple-200 transition-colors">
                                        <Eye className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-gray-900">Visibilidad Web</h4>
                                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Controla qué equipos se muestran en /tecnologías
                                        </p>
                                        <div className="flex gap-2 mt-3">
                                            <Badge className="bg-purple-50 text-purple-600 text-xs">{stats?.visibleInTecnologias || 0} visibles</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                </div>
            </div>
        </div>
    );
}