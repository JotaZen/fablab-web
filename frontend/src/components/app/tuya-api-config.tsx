"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTuyaConfig, useTuyaApi } from './use-tuya-api';
import { JsonViewer } from './json-viewer';
import { Settings, Key, Globe, Trash2, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

export function TuyaApiConfig() {
    const { config, saveConfig, clearConfig, isLoaded } = useTuyaConfig();
    const { getToken } = useTuyaApi();
    
    // Inicializar con configuración vacía - NO auto-cargar desde config
    const [tempConfig, setTempConfig] = useState({
        access_token: '',
        client_id: '',
        client_secret: '',
        device_id: 'eb8e6e63110f3332dcipz1',
        api_endpoint: 'https://openapi.tuyaus.com',
        sign_method: 'HMAC-SHA256',
        signversion: '2.0'
    });
    
    const [isSaved, setIsSaved] = useState(false);
    const [tokenLoading, setTokenLoading] = useState(false);
    const [connectivityLoading, setConnectivityLoading] = useState(false);
    const [deviceConnectivity, setDeviceConnectivity] = useState<{
        online: boolean;
        lastCheck: Date;
        deviceInfo?: Record<string, unknown>;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lastTokenResponse, setLastTokenResponse] = useState<Record<string, unknown> | null>(null);

    const handleGetToken = async () => {
        if (!tempConfig.client_id || !tempConfig.client_secret) {
            setError('Client ID y Client Secret son requeridos para obtener el token');
            return;
        }

        setTokenLoading(true);
        setError(null);
        
        try {
            console.log('🔑 Intentando obtener token con:', {
                client_id: tempConfig.client_id,
                client_secret: tempConfig.client_secret.substring(0, 8) + '...',
                api_endpoint: tempConfig.api_endpoint
            });
            
            // Pasar la configuración temporal al hook
            const token = await getToken(tempConfig);
            
            // SOLO actualizar la configuración temporal con el nuevo token
            // NO guardar automáticamente - el usuario debe hacerlo manualmente
            setTempConfig(prev => ({ ...prev, access_token: token }));
            
            // Guardar la respuesta exitosa para debugging
            setLastTokenResponse({
                type: 'token_success',
                timestamp: new Date().toISOString(),
                token: token, // Mostrar el token completo para verificación
                config_used: {
                    client_id: tempConfig.client_id,
                    api_endpoint: tempConfig.api_endpoint
                }
            });
            
            console.log('✅ Token obtenido y guardado exitosamente');
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error obteniendo token';
            console.error('❌ Error obteniendo token:', errorMessage);
            
            // Guardar la respuesta de error para debugging
            setLastTokenResponse({
                type: 'token_error',
                timestamp: new Date().toISOString(),
                error: errorMessage,
                config_used: {
                    client_id: tempConfig.client_id,
                    api_endpoint: tempConfig.api_endpoint
                }
            });
            
            setError(`Error: ${errorMessage}`);
        } finally {
            setTokenLoading(false);
        }
    };

    const handleTestDeviceConnectivity = async () => {
        if (!tempConfig.access_token || !tempConfig.client_id || !tempConfig.client_secret || !tempConfig.device_id) {
            setError('Configuración incompleta. Se requiere access_token, client_id, client_secret y device_id');
            return;
        }

        setConnectivityLoading(true);
        setError(null);
        
        try {
            console.log('🔍 Verificando conectividad del dispositivo...');
            
            // Usar el proxy para obtener información del dispositivo
            const response = await fetch('/api/tuya/device-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    device_id: tempConfig.device_id,
                    config: tempConfig
                }),
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Error verificando conectividad');
            }

            // Verificar si el dispositivo está online
            const isOnline = result.result?.online === true;
            
            setDeviceConnectivity({
                online: isOnline,
                lastCheck: new Date(),
                deviceInfo: result.result
            });

            console.log('✅ Verificación de conectividad completada:', {
                online: isOnline,
                deviceName: result.result?.name,
                deviceId: result.result?.id
            });
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error verificando conectividad';
            console.error('❌ Error verificando conectividad:', errorMessage);
            setError(`Error de conectividad: ${errorMessage}`);
            
            setDeviceConnectivity({
                online: false,
                lastCheck: new Date(),
                deviceInfo: undefined
            });
        } finally {
            setConnectivityLoading(false);
        }
    };

    const handleLoadSaved = () => {
        if (isLoaded) {
            setTempConfig(config);
        }
    };

    const handleSave = () => {
        try {
            saveConfig(tempConfig);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        } catch (error) {
            console.error('Error saving configuration:', error);
            // Aquí podrías mostrar un toast o mensaje de error
        }
    };

    const handleClear = () => {
        clearConfig();
        setTempConfig({
            access_token: '',
            client_id: '',
            client_secret: '',
            device_id: 'eb8e6e63110f3332dcipz1',
            api_endpoint: 'https://openapi.tuyaus.com',
            sign_method: 'HMAC-SHA256',
            signversion: '2.0'
        });
    };

    const handleInputChange = (field: keyof typeof tempConfig) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setTempConfig(prev => ({ ...prev, [field]: e.target.value }));
        };

    const isConfigComplete = tempConfig.access_token && tempConfig.client_id && tempConfig.client_secret;

    // Mostrar indicador de carga si aún no se ha cargado la configuración
    if (!isLoaded) {
        return (
            <Card className="w-full max-w-2xl">
                <CardContent className="flex items-center justify-center p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-sm text-muted-foreground">Cargando configuración...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configuración API Tuya
                </CardTitle>
                <CardDescription>
                    Configure los parámetros de acceso para la API de Tuya IoT.
                    Los datos se guardan localmente en su navegador.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Estado de configuración */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isConfigComplete ? (
                            <Badge variant="default" className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Configuración completa
                            </Badge>
                        ) : (
                            <Badge variant="destructive">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Configuración incompleta
                            </Badge>
                        )}
                    </div>

                    {isLoaded && (config.access_token || config.client_id) && (
                        <Button variant="outline" size="sm" onClick={handleLoadSaved}>
                            Cargar guardada
                        </Button>
                    )}
                </div>

                <Separator />

                {/* Campos de configuración */}
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="access_token" className="flex items-center gap-2">
                                <Key className="w-4 h-4" />
                                Access Token
                            </Label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleGetToken}
                                disabled={tokenLoading || !tempConfig.client_id || !tempConfig.client_secret}
                            >
                                <Key className="w-4 h-4 mr-2" />
                                {tokenLoading ? 'Obteniendo...' : 'Obtener Token'}
                            </Button>
                        </div>
                        <Input
                            id="access_token"
                            type="password"
                            placeholder="Token de acceso de Tuya (o haga clic en 'Obtener Token')"
                            value={tempConfig.access_token}
                            onChange={handleInputChange('access_token')}
                        />
                        {tokenLoading && (
                            <div className="flex items-center gap-2 text-sm text-blue-600">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Obteniendo token de Tuya...
                            </div>
                        )}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700 font-medium">Error:</p>
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}
                        {tempConfig.access_token && !error && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-700 font-medium">✅ Token obtenido exitosamente</p>
                                <p className="text-xs text-green-600 mb-2">
                                    Token: {tempConfig.access_token.substring(0, 32)}...
                                </p>
                                <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>Recuerda guardar la configuración para preservar el token</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="client_id">Client ID</Label>
                        <Input
                            id="client_id"
                            placeholder="ID del cliente Tuya"
                            value={tempConfig.client_id}
                            onChange={handleInputChange('client_id')}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="client_secret">Client Secret</Label>
                        <Input
                            id="client_secret"
                            type="password"
                            placeholder="Secret del cliente Tuya"
                            value={tempConfig.client_secret}
                            onChange={handleInputChange('client_secret')}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="device_id">Device ID</Label>
                        <Input
                            id="device_id"
                            placeholder="ID del dispositivo"
                            value={tempConfig.device_id}
                            onChange={handleInputChange('device_id')}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="api_endpoint" className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            API Endpoint
                        </Label>
                        <Input
                            id="api_endpoint"
                            placeholder="https://openapi.tuyaus.com"
                            value={tempConfig.api_endpoint}
                            onChange={handleInputChange('api_endpoint')}
                        />
                    </div>
                </div>

                <Separator />

                {/* Configuración avanzada */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Configuración Avanzada</h4>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="sign_method">Método de Firma</Label>                <Input
                                id="sign_method"
                                value={tempConfig.sign_method}
                                onChange={handleInputChange('sign_method')}
                                disabled
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="signversion">Versión de Firma</Label>                <Input
                                id="signversion"
                                value={tempConfig.signversion}
                                onChange={handleInputChange('signversion')}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Verificar Conectividad del Dispositivo */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Verificación de Dispositivo</h4>
                    
                    <Button 
                        onClick={handleTestDeviceConnectivity} 
                        disabled={!tempConfig.access_token || !tempConfig.device_id || connectivityLoading}
                        variant="outline"
                        className="w-full"
                    >
                        {connectivityLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Verificando conectividad...
                            </>
                        ) : (
                            <>
                                <Globe className="w-4 h-4 mr-2" />
                                Verificar Conectividad del Dispositivo
                            </>
                        )}
                    </Button>

                    {/* Estado de conectividad */}
                    {deviceConnectivity && (
                        <div className="p-3 border rounded-lg bg-muted/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {deviceConnectivity.online ? (
                                        <Badge variant="default" className="bg-green-500">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Dispositivo Online
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            Dispositivo Offline
                                        </Badge>
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    Última verificación: {deviceConnectivity.lastCheck.toLocaleTimeString()}
                                </span>
                            </div>
                            
                            {deviceConnectivity.deviceInfo && (
                                <div className="mt-2 text-xs">
                                    <p><strong>Nombre:</strong> {String(deviceConnectivity.deviceInfo.name) || 'N/A'}</p>
                                    <p><strong>IP:</strong> {String(deviceConnectivity.deviceInfo.ip) || 'N/A'}</p>
                                    <p><strong>Categoría:</strong> {String(deviceConnectivity.deviceInfo.category) || 'N/A'}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <Separator />

                {/* Botones de acción */}
                <div className="flex gap-3">
                    <Button onClick={handleSave} className="flex-1" disabled={isSaved}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaved ? 'Guardado' : 'Guardar Configuración'}
                    </Button>

                    <Button variant="outline" onClick={handleClear}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Limpiar
                    </Button>
                </div>

        {/* Información adicional */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-1">Información de Seguridad:</p>
          <p className="mb-2">Los datos de configuración se almacenan localmente en su navegador y no se envían a ningún servidor externo excepto a la API de Tuya.</p>
          
          <p className="font-medium mb-1 text-blue-600">🔗 Proxy Server:</p>
          <p>Las llamadas a la API de Tuya se realizan a través de un proxy local (/api/tuya/) para evitar errores de CORS. El servidor Next.js actúa como intermediario seguro.</p>
        </div>
        
        {/* Debug Panel - Token Response */}
        {lastTokenResponse && (
          <div className="space-y-2">
            <JsonViewer 
              data={lastTokenResponse} 
              title="Debug - Respuesta de Token"
              className="w-full"
            />
          </div>
        )}
            </CardContent>
        </Card>
    );
}
