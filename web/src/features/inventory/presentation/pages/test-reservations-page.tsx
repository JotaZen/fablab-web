"use client";

import { useState } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/cards/card';
import { getStockClient } from '../../infrastructure/vessel/stock.client';
import { getReservationClient } from '../../infrastructure/vessel/reservation.client';
import { getItemsClient } from '../../infrastructure/vessel/items.client';
import { getLocationClient } from '../../infrastructure/vessel/locations.client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { ItemStock } from '../../domain/entities/stock';
import { Reserva } from '../../domain/entities/reservation';

export default function TestReservationsPage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [createdItem, setCreatedItem] = useState<any>(null);
    const [stockItem, setStockItem] = useState<ItemStock | null>(null);
    const [reserva, setReserva] = useState<Reserva | null>(null);

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

    const runTest = async () => {
        setLoading(true);
        setLogs([]);
        setCreatedItem(null);
        setStockItem(null);
        setReserva(null);

        try {
            const itemsClient = getItemsClient();
            const stockClient = getStockClient();
            const reservationClient = getReservationClient();
            const locationClient = getLocationClient();

            // 1. Crear Item en Catálogo
            addLog("1. Creando item de prueba...");
            const timestamp = Date.now();
            const itemSku = `TEST-${timestamp}`;

            // Simulamos item ya existente o creamos uno nuevo si pudiéramos (ItemsClient no tiene create público a veces)
            // Asumiremos que item ya existe o usamos el primero que encontremos, O creamos stock directo con SKU nuevo

            // 2. Crear Stock (Ingreso)
            addLog(`2. Creando ingreso de stock para SKU: ${itemSku}`);
            // Primero necesitamos una ubicación
            const locs = await locationClient.listar();
            if (locs.length === 0) throw new Error("No hay ubicaciones disponibles");
            const locationId = locs[0].id;
            addLog(`Using location: ${locs[0].nombre} (${locationId})`);

            const newStock = await stockClient.crearItem({
                sku: itemSku,
                cantidad: 100,
                ubicacionId: locationId,
                tipoUbicacion: 'warehouse',
                catalogoOrigen: 'test',
                catalogoItemId: `cat-${timestamp}` // Fake
            });
            setStockItem(newStock);
            addLog(`Stock creado: ${newStock.id} - Cantidad: ${newStock.cantidad}`);

            // 3. Reservar
            addLog("3. Intentando reservar 20 unidades...");

            // Aquí está la prueba clave: ¿Usa endpoint de reservation o de item?
            // El cliente usa el endpoint de item
            const nuevaReserva = await reservationClient.crear({
                stockItemId: newStock.id,
                cantidad: 20,
                reservadoPor: "test-user",
                reservadoPorNombre: "Test User", // Importante
                tipoReferencia: "proyecto",
                referenciaNombre: "Proyecto Test",
                notas: "Reserva de prueba automática"
            });

            setReserva(nuevaReserva);
            addLog(`Reserva creada: ${nuevaReserva.id} - Estado: ${nuevaReserva.estado}`);

            // 4. Verificar Stock Post-Reserva
            addLog("4.  stock post-reserva...");
            const updatedStock = await stockClient.obtenerItem(newStock.id);
            if (updatedStock) {
                addLog(`Stock Actualizado -> Total: ${updatedStock.cantidad}, Reservado: ${updatedStock.cantidadReservada}, Disponible: ${updatedStock.cantidadDisponible}`);

                if (updatedStock.cantidadReservada === 20) {
                    addLog("✅ VALIDACIÓN EXITOSA: La cantidad reservada coincide.");
                } else {
                    addLog("❌ ERROR: La cantidad reservada NO coincide.");
                }
            }

            // 5. Aprobar (Simulado - en realidad es validación de estado)
            addLog("5. 'Aprobando' (Verificando estado activa)...");
            if (nuevaReserva.estado === 'activa') {
                addLog("✅ Reserva creada como ACTIVA automáticamente (aprobación implícita en creación si hay stock).");
            } else {
                addLog(`ℹ️ Estado reserva: ${nuevaReserva.estado}`);
            }

            // 6. Consumir (opcional, para cerrar ciclo)
            // addLog("6. Consumiendo reserva...");
            // await reservationClient.consumir(nuevaReserva.id);
            // addLog("Reserva consumida/liberada.");

        } catch (err: any) {
            addLog(`❌ ERROR: ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Test de Flujo de Reservas</h1>

            <Button onClick={runTest} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ejecutar Prueba Completa
            </Button>

            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader><CardTitle>Logs</CardTitle></CardHeader>
                    <CardContent className="h-64 overflow-y-auto font-mono text-sm bg-muted p-4 rounded">
                        {logs.map((log, i) => (
                            <div key={i} className="mb-1">{log}</div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Resultados Datos</CardTitle></CardHeader>
                    <CardContent className="h-64 overflow-y-auto text-xs">
                        {stockItem && (
                            <div className="mb-4">
                                <strong>Stock Item Created:</strong>
                                <pre>{JSON.stringify(stockItem, null, 2)}</pre>
                            </div>
                        )}
                        {reserva && (
                            <div>
                                <strong>Reserva Created:</strong>
                                <pre>{JSON.stringify(reserva, null, 2)}</pre>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
