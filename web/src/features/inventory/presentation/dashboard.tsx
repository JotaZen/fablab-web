"use client";

import React, { useEffect, useState } from 'react';
import { InventoryClient, MovimientoInventario, Location } from '../infrastructure/inventory-client';

const client = new InventoryClient('http://localhost:8000'); // Cambiar por la URL real

export default function InventoryDashboard() {
    const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const movimientosData = await client.getMovimientos();
                // setMovimientos(movimientosData);

                const locationsData = await client.getLocations();
                setLocations(locationsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-6">Cargando inventario...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-bold">Dashboard de Inventario</h1>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-white p-4 shadow">
                    <h3 className="text-lg font-semibold">Total Movimientos</h3>
                    <p className="text-2xl font-bold text-blue-600">{movimientos.length}</p>
                </div>

                <div className="rounded-lg bg-white p-4 shadow">
                    <h3 className="text-lg font-semibold">Entradas</h3>
                    <p className="text-2xl font-bold text-green-600">
                        {movimientos.filter(m => m.tipoMovimiento === 'entrada').length}
                    </p>
                </div>

                <div className="rounded-lg bg-white p-4 shadow">
                    <h3 className="text-lg font-semibold">Salidas</h3>
                    <p className="text-2xl font-bold text-red-600">
                        {movimientos.filter(m => m.tipoMovimiento === 'salida').length}
                    </p>
                </div>

                <div className="rounded-lg bg-white p-4 shadow">
                    <h3 className="text-lg font-semibold">Locaciones</h3>
                    <p className="text-2xl font-bold text-purple-600">{locations.length}</p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold">Últimos Movimientos</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg bg-white shadow">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Producto</th>
                                <th className="px-4 py-2 text-left">Tipo</th>
                                <th className="px-4 py-2 text-left">Cantidad</th>
                                <th className="px-4 py-2 text-left">Fecha</th>
                                <th className="px-4 py-2 text-left">Usuario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimientos.slice(0, 10).map((mov) => (
                                <tr key={mov.id} className="border-t">
                                    <td className="px-4 py-2">{mov.productoId}</td>
                                    <td className="px-4 py-2">
                                        <span className={`rounded px-2 py-1 text-xs ${mov.tipoMovimiento === 'entrada'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {mov.tipoMovimiento}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">{mov.cantidad}</td>
                                    <td className="px-4 py-2">{new Date(mov.fecha).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">{mov.usuarioId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold">Locaciones Registradas</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg bg-white shadow">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Nombre</th>
                                <th className="px-4 py-2 text-left">Tipo</th>
                                <th className="px-4 py-2 text-left">Dirección ID</th>
                                <th className="px-4 py-2 text-left">Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.map((loc) => (
                                <tr key={loc.id} className="border-t">
                                    <td className="px-4 py-2 font-medium">{loc.name}</td>
                                    <td className="px-4 py-2">
                                        <span className={`rounded px-2 py-1 text-xs ${loc.type === 'warehouse'
                                                ? 'bg-blue-100 text-blue-800'
                                                : loc.type === 'store'
                                                    ? 'bg-green-100 text-green-800'
                                                    : loc.type === 'office'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-purple-100 text-purple-800'
                                            }`}>
                                            {loc.type === 'warehouse' ? 'Almacén' :
                                                loc.type === 'store' ? 'Tienda' :
                                                    loc.type === 'office' ? 'Oficina' : 'Centro Dist.'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">{loc.address_id}</td>
                                    <td className="px-4 py-2">{loc.description || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
