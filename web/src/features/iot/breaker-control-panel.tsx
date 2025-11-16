"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/cards/card';
import { Button } from '@/shared/ui/buttons/button';
import { Badge } from '@/shared/ui/badges/badge';
import { useTuyaApi, useTuyaConfig } from './use-tuya-api';
import { BreakerStatus, DeviceInfo } from './types';
import { JsonViewer } from '../../shared/ui/texts/json-viewer';
import {
    Power,
    Zap,
    Thermometer,
    AlertTriangle,
    Clock,
    Battery,
    Gauge,
    RefreshCw,
    CheckCircle,
    XCircle,
    Wifi,
    WifiOff,
    Globe,
    Activity,
    Settings
} from 'lucide-react';

export function BreakerControlPanel() {
    const { sendCommand, getDeviceStatus, getDeviceInfo, loading, error } = useTuyaApi();
    const { config, isLoaded } = useTuyaConfig(); // Agregar el config hook
    
    const [status, setStatus] = useState<BreakerStatus | null>(null);
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
    const [lastApiResponse, setLastApiResponse] = useState<Record<string, unknown> | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // SOLO UNA REF PARA PREVENIR DOBLE CARGA - SIN BUCLES
    const hasLoadedOnceRef = useRef(false);

    // Verificar si la configuración es válida
    const isConfigValid = isLoaded && config.access_token && config.client_id && config.client_secret;

    // FUNCIÓN SIMPLE DE REFRESH - SIN USECALLBACK PARA EVITAR DEPENDENCIAS
    const refreshStatus = async () => {
        if (isRefreshing) return;
        
        setIsRefreshing(true);
        try {
            const [newStatus, newDeviceInfo] = await Promise.all([
                getDeviceStatus(),
                getDeviceInfo()
            ]);

            if (newStatus) setStatus(newStatus);
            if (newDeviceInfo) setDeviceInfo(newDeviceInfo);
            
            setLastUpdate(new Date());
            setLastApiResponse({
                type: 'status_update',
                timestamp: new Date().toISOString(),
                deviceInfo: newDeviceInfo,
                status: newStatus
            });
        } catch (err) {
            console.error('Error:', err);
            setLastApiResponse({
                type: 'error',
                timestamp: new Date().toISOString(),
                error: err instanceof Error ? err.message : 'Unknown error'
            });
        } finally {
            setIsRefreshing(false);
        }
    };

    // FUNCIÓN SIMPLE DE CONTROL SWITCH - SIN USECALLBACK
    const handleSwitchControl = async (switchValue: boolean) => {
        if (loading || isRefreshing) return;

        try {
            const switchCommand = [{ code: "switch", value: switchValue }];
            const result = await sendCommand(switchCommand);
            
            setLastApiResponse({
                type: 'switch_control',
                timestamp: new Date().toISOString(),
                action: switchValue ? 'ON' : 'OFF',
                command: switchCommand,
                response: result
            });

            // Refresh después de 2 segundos - UNA SOLA VEZ
            setTimeout(() => {
                refreshStatus();
            }, 2000);
        } catch (err) {
            console.error('Error controlando switch:', err);
            setLastApiResponse({
                type: 'switch_error',
                timestamp: new Date().toISOString(),
                action: switchValue ? 'ON' : 'OFF',
                error: err instanceof Error ? err.message : 'Unknown error'
            });
        }
    };

    // EFECTO SUPER SIMPLE - SOLO SE EJECUTA UNA VEZ AL MONTAR
    useEffect(() => {
        // SI YA CARGÓ UNA VEZ, NO HACER NADA MÁS
        if (hasLoadedOnceRef.current) return;
        
        // MARCAR COMO CARGADO INMEDIATAMENTE PARA EVITAR DOBLE EJECUCIÓN
        hasLoadedOnceRef.current = true;
        
        // FUNCIÓN INTERNA SIMPLE QUE ESPERA LA CONFIG
        const checkAndLoad = () => {
            // SI NO HAY CONFIGURACIÓN VÁLIDA, NO HACER NADA
            if (!isLoaded || !config.access_token || !config.client_id || !config.client_secret) {
                console.log('⚠️ Configuración no válida, esperando...');
                return;
            }
            
            // SI NO HAY FUNCIONES, NO HACER NADA
            if (!getDeviceStatus || !getDeviceInfo) return;
            
            // CARGAR DATOS UNA SOLA VEZ
            refreshStatus();
        };
        
        // VERIFICAR INMEDIATAMENTE
        checkAndLoad();
        
        // TAMBIÉN VERIFICAR CADA 2 SEGUNDOS HASTA QUE TENGA CONFIG (MÁXIMO 10 INTENTOS)
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            if (attempts > 10) {
                clearInterval(interval);
                return;
            }
            
            if (isLoaded && config.access_token && config.client_id && config.client_secret) {
                clearInterval(interval);
                checkAndLoad();
            }
        }, 2000);
        
        // CLEANUP
        return () => {
            clearInterval(interval);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // SIN DEPENDENCIAS - SOLO UNA VEZ AL MONTAR - INTENCIONAL

    return (
        <div className="space-y-4 max-w-6xl mx-auto">
            {/* Status Overview */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                Estado del Breaker y Conectividad
                            </CardTitle>
                            <CardDescription>
                                Monitor del interruptor inteligente y estado de red
                            </CardDescription>
                        </div>
                        <Button
                            onClick={refreshStatus}
                            disabled={loading || isRefreshing}
                            variant="outline"
                            size="sm"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Actualizando...' : 'Actualizar'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Mensaje si la configuración no es válida */}
                    {!isConfigValid && (
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
                            <div className="flex items-center gap-2 mb-2">
                                <Settings className="w-4 h-4" />
                                <span className="font-medium">Configuración requerida</span>
                            </div>
                            <p className="text-sm">
                                Para usar el panel de control, primero configure:
                            </p>
                            <ul className="text-sm mt-2 space-y-1 ml-4">
                                <li>• Client ID y Client Secret</li>
                                <li>• Generar un Access Token válido</li>
                                <li>• Guardar la configuración</li>
                            </ul>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            <AlertTriangle className="w-4 h-4 inline mr-2" />
                            {error}
                        </div>
                    )}

                    {lastUpdate && (
                        <p className="text-xs text-muted-foreground mb-4">
                            Última actualización: {lastUpdate.toLocaleString()}
                        </p>
                    )}

                    {/* Mensaje de inicialización si no hay datos */}
                    {!status && !deviceInfo && !loading && !isRefreshing && (
                        <div className="text-center p-8 bg-muted/30 rounded-lg border-2 border-dashed">
                            <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No hay datos disponibles</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Haz clic en &quot;Inicializar&quot; para cargar los datos del dispositivo
                            </p>
                            <Button 
                                onClick={refreshStatus}
                                disabled={loading || isRefreshing}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Inicializar Panel
                            </Button>
                        </div>
                    )}

                    {/* Estado de carga */}
                    {(loading || isRefreshing) && !status && !deviceInfo && (
                        <div className="text-center p-8">
                            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-600 mb-4" />
                            <p className="text-sm text-muted-foreground">
                                Cargando datos del dispositivo...
                            </p>
                        </div>
                    )}

                    {/* Información de Conectividad - Arriba */}
                    {deviceInfo && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                {deviceInfo.online ? (
                                    <Wifi className="w-4 h-4 text-green-500" />
                                ) : (
                                    <WifiOff className="w-4 h-4 text-red-500" />
                                )}
                                Estado de Conectividad
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {/* Online Status */}
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Activity className="w-4 h-4" />
                                        <span className="text-sm font-medium">Estado</span>
                                    </div>
                                    <Badge variant={deviceInfo.online ? "default" : "destructive"}>
                                        {deviceInfo.online ? (
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                        ) : (
                                            <XCircle className="w-3 h-3 mr-1" />
                                        )}
                                        {deviceInfo.online ? 'En línea' : 'Desconectado'}
                                    </Badge>
                                </div>

                                {/* IP Address */}
                                {deviceInfo.ip && (
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            <span className="text-sm font-medium">IP</span>
                                        </div>
                                        <span className="text-sm font-mono">{deviceInfo.ip}</span>
                                    </div>
                                )}

                                {/* Last Seen */}
                                {deviceInfo.active_time && (
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm font-medium">Última actividad</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(deviceInfo.active_time * 1000).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tarjetas de Datos del Breaker - Abajo */}
                    {status && (
                        <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <Gauge className="w-4 h-4" />
                                Datos del Dispositivo
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {/* Switch Principal */}
                                <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Power className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-900">Interruptor Principal</span>
                                    </div>

                                    {/* Estado actual */}
                                    {status.switch !== undefined ? (
                                        <Badge variant={status.switch ? "default" : "secondary"} className="text-sm px-3 py-1 mb-3">
                                            {status.switch ? (
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                            ) : (
                                                <XCircle className="w-4 h-4 mr-2" />
                                            )}
                                            {status.switch ? 'ENCENDIDO' : 'APAGADO'}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="mb-3">Sin datos</Badge>
                                    )}                                {/* Botones de control */}
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <Button
                                        onClick={() => handleSwitchControl(true)}
                                        disabled={loading || isRefreshing}
                                        className="bg-green-600 hover:bg-green-700 text-xs h-8"
                                        size="sm"
                                    >
                                        <Power className="w-3 h-3 mr-1" />
                                        ON
                                    </Button>
                                    
                                    <Button
                                        onClick={() => handleSwitchControl(false)}
                                        disabled={loading || isRefreshing}
                                        variant="destructive"
                                        className="text-xs h-8"
                                        size="sm"
                                    >
                                        <Power className="w-3 h-3 mr-1" />
                                        OFF
                                    </Button>                                </div>
                                </div>

                                {/* Energía Total */}
                                <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Gauge className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-medium text-green-900">Energía Total</span>
                                    </div>
                                    {status.total_forward_energy !== undefined ? (
                                        <>
                                            <p className="text-3xl font-bold text-green-800">
                                                {(status.total_forward_energy / 100).toFixed(2)}
                                            </p>                                        <p className="text-sm text-green-700 font-medium">kW·h</p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Sin datos</p>
                                    )}
                                </div>

                                {/* Balance de Energía */}
                                <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Battery className="w-5 h-5 text-purple-600" />
                                        <span className="text-sm font-medium text-purple-900">Balance Energía</span>
                                    </div>
                                    {status.balance_energy !== undefined ? (
                                        <>
                                            <p className="text-3xl font-bold text-purple-800">
                                                {(status.balance_energy / 100).toFixed(2)}
                                            </p>                                        <p className="text-sm text-purple-700 font-medium">kW·h</p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Sin datos</p>
                                    )}
                                </div>

                                {/* Temperatura */}
                                <div className="p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Thermometer className="w-5 h-5 text-orange-600" />
                                        <span className="text-sm font-medium text-orange-900">Temperatura</span>
                                    </div>
                                    {status.temp_current !== undefined ? (
                                        <>
                                            <p className="text-3xl font-bold text-orange-800">{status.temp_current}°C</p>                                        <Badge variant={status.temp_current > 50 ? "destructive" : "default"} className="mt-2">
                                            {status.temp_current > 50 ? 'Alta' : 'Normal'}
                                        </Badge>
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Sin sensor de temperatura</p>
                                    )}
                                </div>

                                {/* Corriente de Fuga */}
                                <div className="p-4 border rounded-lg bg-gradient-to-br from-red-50 to-red-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                        <span className="text-sm font-medium text-red-900">Corriente de Fuga</span>
                                    </div>
                                    {status.leakage_current !== undefined ? (
                                        <>
                                            <p className="text-3xl font-bold text-red-800">{status.leakage_current}</p>                                        <p className="text-sm text-red-700 font-medium">mA</p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Sin datos de corriente</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Datos Extendidos del Dispositivo */}
            {status && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Datos Extendidos del Dispositivo
                        </CardTitle>
                        <CardDescription>
                            Información detallada y métricas avanzadas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Corriente de Carga */}
                            {status.charge_energy !== undefined && (
                                <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap className="w-4 h-4 text-yellow-600" />
                                        <span className="text-sm font-medium text-yellow-900">Carga Energía</span>
                                    </div>
                                    <p className="text-2xl font-bold text-yellow-800">{status.charge_energy}</p>
                                </div>
                            )}

                            {/* Contador */}
                            {status.countdown_1 !== undefined && (
                                <div className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-4 h-4 text-cyan-600" />
                                        <span className="text-sm font-medium text-cyan-900">Contador</span>
                                    </div>
                                    <p className="text-2xl font-bold text-cyan-800">{status.countdown_1}</p>
                                    <p className="text-xs text-cyan-600 mt-1">Segundos</p>
                                </div>
                            )}

                            {/* Switch Prepago */}
                            <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border">
                                <div className="flex items-center gap-2 mb-2">
                                    <Power className="w-4 h-4 text-indigo-600" />
                                    <span className="text-sm font-medium text-indigo-900">Prepago</span>
                                </div>
                                <Badge variant={status.switch_prepayment ? "default" : "secondary"}>
                                    {status.switch_prepayment ? 'ACTIVO' : 'INACTIVO'}
                                </Badge>
                            </div>

                            {/* Estado de Fallas */}
                            <div className="p-4 bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg border">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                                    <span className="text-sm font-medium text-rose-900">Fallas</span>
                                </div>
                                {status.fault && status.fault.length > 0 ? (
                                    <Badge variant="destructive">
                                        {status.fault.length} falla(s)
                                    </Badge>
                                ) : (
                                    <Badge variant="default" className="bg-green-600">
                                        Sin fallas
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Información adicional del dispositivo */}
                        {deviceInfo && (
                            <div className="mt-6">
                                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Información del Dispositivo
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                        <div className="text-xs text-muted-foreground">Nombre del dispositivo</div>
                                        <div className="text-sm font-medium">{deviceInfo.name}</div>
                                    </div>
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                        <div className="text-xs text-muted-foreground">Categoría</div>
                                        <div className="text-sm font-medium">{deviceInfo.category}</div>
                                    </div>
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                        <div className="text-xs text-muted-foreground">Producto</div>
                                        <div className="text-sm font-medium">{deviceInfo.product_name}</div>
                                    </div>
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                        <div className="text-xs text-muted-foreground">Dirección IP</div>
                                        <div className="text-sm font-mono">{deviceInfo.ip || 'No disponible'}</div>
                                    </div>
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                        <div className="text-xs text-muted-foreground">Zona horaria</div>
                                        <div className="text-sm font-medium">{deviceInfo.time_zone}</div>
                                    </div>
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                        <div className="text-xs text-muted-foreground">Última actividad</div>
                                        <div className="text-sm font-mono">
                                            {new Date(deviceInfo.active_time * 1000).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Información técnica adicional */}
                        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Configuración de tiempo */}
                            <div className="p-4 bg-muted/30 rounded-lg">
                                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Configuración Temporal
                                </h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Ciclo de tiempo:</span>
                                        <span className="font-mono">{status.cycle_time || 'No configurado'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tiempo aleatorio:</span>
                                        <span className="font-mono">{status.random_time || 'No configurado'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Control de actualización */}
                            <div className="p-4 bg-muted/30 rounded-lg">
                                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Estado de Actualización
                                </h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Última actualización:</span>
                                        <span className="font-mono">{lastUpdate ? lastUpdate.toLocaleTimeString() : 'Nunca'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Estado:</span>
                                        <span className={isRefreshing ? "text-blue-600" : "text-green-600"}>
                                            {isRefreshing ? "� Actualizando..." : "✅ Disponible"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Debug Panel - Datos Crudos */}
            {status && (
                <Card className="border-blue-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                            <Activity className="w-5 h-5" />
                            🔍 Datos Crudos del Dispositivo (Debug)
                        </CardTitle>
                        <CardDescription>
                            Todos los datos recibidos directamente del dispositivo IoT
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {Object.entries(status).map(([key, value]) => (
                                <div key={key} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-blue-900">{key}:</span>
                                        <span className="text-blue-700">
                                            {value !== undefined && value !== null ? String(value) : 'Sin datos'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-blue-600 mt-1">
                                        Tipo: {typeof value} | {value !== undefined ? '✅ Disponible' : '❌ No disponible'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Debug Panel - API Responses */}
            {lastApiResponse && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge variant={
                                (lastApiResponse.type && typeof lastApiResponse.type === 'string' && lastApiResponse.type.includes('error'))
                                    ? 'destructive'
                                    : 'default'
                            }>
                                {String(lastApiResponse.type || 'unknown')}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                {String(lastApiResponse.timestamp || 'no timestamp')}
                            </span>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLastApiResponse(null)}
                        >
                            Limpiar Debug
                        </Button>
                    </div>

                    <JsonViewer
                        data={lastApiResponse}
                        title="Respuesta de API de Tuya"
                        className="w-full"
                    />
                </div>
            )}
        </div>
    );
}
