"use client";

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTuyaApi } from './use-tuya-api';
import { DeviceCommand, BreakerStatus, DeviceInfo } from './types';
import { JsonViewer } from './json-viewer';
import { 
  Power, 
  Zap, 
  Thermometer, 
  AlertTriangle, 
  Clock, 
  Battery,
  Gauge,
  RefreshCw,
  Send,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  Globe,
  Activity
} from 'lucide-react';

export function BreakerControlPanel() {
  const { sendCommand, getDeviceStatus, getDeviceInfo, loading, error } = useTuyaApi();
  const [status, setStatus] = useState<BreakerStatus | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [lastApiResponse, setLastApiResponse] = useState<Record<string, unknown> | null>(null);
  const [commands, setCommands] = useState<DeviceCommand[]>([
    { code: "switch_prepayment", value: false },
    { code: "clear_energy", value: false },
    { code: "charge_energy", value: 0 },
    { code: "switch", value: false },
    { code: "countdown_1", value: 0 },
    { code: "cycle_time", value: "EwAAAAAAAAAAAA==" },
    { code: "random_time", value: "" }
  ]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Estados para la configuración
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStatus = useCallback(async () => {
    // Prevenir múltiples peticiones concurrentes
    if (isRefreshing) {
      console.log('🔄 Refresh ya en progreso, saltando...');
      return;
    }

    setIsRefreshing(true);
    try {
      const [newStatus, newDeviceInfo] = await Promise.all([
        getDeviceStatus(),
        getDeviceInfo()
      ]);
      
      if (newStatus) {
        setStatus(newStatus);
      }
      
      if (newDeviceInfo) {
        setDeviceInfo(newDeviceInfo);
        setLastApiResponse({
          type: 'status_update',
          timestamp: new Date().toISOString(),
          deviceInfo: newDeviceInfo,
          status: newStatus
        });
      }
      
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching status:', err);
      setLastApiResponse({
        type: 'error',
        timestamp: new Date().toISOString(),
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [getDeviceStatus, getDeviceInfo, isRefreshing]);

  const handleSendCommands = async () => {
    try {
      const result = await sendCommand(commands);
      setLastApiResponse({
        type: 'command_sent',
        timestamp: new Date().toISOString(),
        commands: commands,
        response: result
      });
      
      // Refresh status after sending commands
      setTimeout(() => refreshStatus(), 1000);
    } catch (err) {
      console.error('Error sending commands:', err);
      setLastApiResponse({
        type: 'command_error',
        timestamp: new Date().toISOString(),
        commands: commands,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };

  // Función específica para controlar el switch principal
  const handleSwitchControl = async (switchValue: boolean) => {
    try {
      const switchCommand = [{ code: "switch", value: switchValue }];
      console.log(`🔌 ${switchValue ? 'ENCENDIENDO' : 'APAGANDO'} el dispositivo...`);
      
      const result = await sendCommand(switchCommand);
      setLastApiResponse({
        type: 'switch_control',
        timestamp: new Date().toISOString(),
        action: switchValue ? 'ON' : 'OFF',
        command: switchCommand,
        response: result
      });
      
      // Actualizar el comando en el estado local
      setCommands(prev => 
        prev.map(cmd => 
          cmd.code === 'switch' ? { ...cmd, value: switchValue } : cmd
        )
      );
      
      // Refresh status after sending command
      setTimeout(() => refreshStatus(), 2000);
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

  const updateCommand = (code: string, value: boolean | number | string) => {
    setCommands(prev => 
      prev.map(cmd => 
        cmd.code === code ? { ...cmd, value } : cmd
      )
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Estado del Breaker IoT
              </CardTitle>
              <CardDescription>
                Monitor y control del interruptor inteligente
              </CardDescription>
            </div>
            <Button 
              onClick={refreshStatus} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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

          {status && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Switch Principal */}
              <div className="p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Power className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Interruptor Principal</span>
                </div>
                {status.switch !== undefined ? (
                  <Badge variant={status.switch ? "default" : "secondary"} className="text-sm px-3 py-1">
                    {status.switch ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    {status.switch ? 'ENCENDIDO' : 'APAGADO'}
                  </Badge>
                ) : (
                  <Badge variant="outline">Sin datos</Badge>
                )}
                <p className="text-xs text-green-600 mt-2">✅ Estado real del dispositivo</p>
              </div>

              {/* Energía Total */}
              <div className="p-6 border rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                <div className="flex items-center gap-2 mb-3">
                  <Gauge className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Energía Total</span>
                </div>
                {status.total_forward_energy !== undefined ? (
                  <>
                    <p className="text-3xl font-bold text-green-800">
                      {(status.total_forward_energy / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-green-700 font-medium">kW·h</p>
                    <p className="text-xs text-green-600 mt-2">✅ Valor real: {status.total_forward_energy} (escala ÷100)</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Sin datos</p>
                )}
              </div>

              {/* Balance de Energía */}
              <div className="p-6 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <Battery className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Balance Energía</span>
                </div>
                {status.balance_energy !== undefined ? (
                  <>
                    <p className="text-3xl font-bold text-purple-800">
                      {(status.balance_energy / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-purple-700 font-medium">kW·h</p>
                    <p className="text-xs text-purple-600 mt-2">✅ Valor real: {status.balance_energy} (escala ÷100)</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Sin datos</p>
                )}
              </div>

              {/* Temperatura */}
              <div className="p-6 border rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
                <div className="flex items-center gap-2 mb-3">
                  <Thermometer className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Temperatura</span>
                </div>
                {status.temp_current !== undefined ? (
                  <>
                    <p className="text-3xl font-bold text-orange-800">{status.temp_current}°C</p>
                    <Badge variant={status.temp_current > 50 ? "destructive" : "default"} className="mt-2">
                      {status.temp_current > 50 ? 'Alta' : 'Normal'}
                    </Badge>
                    <p className="text-xs text-orange-600 mt-2">✅ Dato real del dispositivo</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Sin sensor de temperatura</p>
                )}
              </div>

              {/* Corriente de Fuga */}
              <div className="p-6 border rounded-lg bg-gradient-to-br from-red-50 to-red-100">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-900">Corriente de Fuga</span>
                </div>
                {status.leakage_current !== undefined ? (
                  <>
                    <p className="text-3xl font-bold text-red-800">{status.leakage_current}</p>
                    <p className="text-sm text-red-700 font-medium">mA</p>
                    <p className="text-xs text-red-600 mt-2">✅ Dato real del dispositivo</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Sin datos de corriente</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Device Connectivity Info */}
      {deviceInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {deviceInfo.online ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              Estado de Conectividad
            </CardTitle>
            <CardDescription>
              Información de red y conectividad del dispositivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

              {/* Device Model */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">ID del dispositivo</span>
                </div>
                <span className="text-xs font-mono">{deviceInfo.id}</span>
              </div>

              {/* Product Name */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4" />
                  <span className="text-sm font-medium">Nombre</span>
                </div>
                <span className="text-sm">{deviceInfo.name}</span>
              </div>

              {/* Time Zone */}
              {deviceInfo.time_zone && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">Zona horaria</span>
                  </div>
                  <span className="text-sm">{deviceInfo.time_zone}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extended Device Data Panel */}
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
                  <p className="text-xs text-yellow-600 mt-1">✅ Valor real</p>
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
                  <p className="text-xs text-cyan-600 mt-1">✅ Segundos</p>
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
                <p className="text-xs text-indigo-600 mt-1">✅ Estado real</p>
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
                <p className="text-xs text-rose-600 mt-1">✅ Estado real</p>
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

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Control Principal
          </CardTitle>
          <CardDescription>
            Controles rápidos para el dispositivo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Control de Switch Principal */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Control de Energía</h4>
            
            <div className="flex gap-3">
              <Button
                onClick={() => handleSwitchControl(true)}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Power className="w-5 h-5 mr-2" />
                ENCENDER
              </Button>
              
              <Button
                onClick={() => handleSwitchControl(false)}
                disabled={loading}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                <Power className="w-5 h-5 mr-2" />
                APAGAR
              </Button>
            </div>

            {/* Estado actual */}
            {status && (
              <div className="p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estado actual:</span>
                  <Badge variant={status.switch ? "default" : "secondary"} className="ml-2">
                    {status.switch ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        ENCENDIDO
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        APAGADO
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Botón para refrescar estado */}
          <div className="flex gap-3">
            <Button 
              onClick={refreshStatus} 
              disabled={isRefreshing}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Actualizando...' : 'Actualizar Estado'}
            </Button>
            
            {!status && !lastUpdate && (
              <Button 
                onClick={refreshStatus} 
                disabled={isRefreshing}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Activity className="w-4 h-4 mr-2" />
                Inicializar Panel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Control Panel Avanzado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Panel de Control Avanzado
          </CardTitle>
          <CardDescription>
            Configure y envíe comandos al dispositivo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Switch Controls */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Power className="w-4 h-4" />
                Controles de Encendido
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="switch">Interruptor Principal</Label>
                  <Button
                    variant={commands.find(c => c.code === 'switch')?.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateCommand('switch', !commands.find(c => c.code === 'switch')?.value)}
                  >
                    {commands.find(c => c.code === 'switch')?.value ? 'ON' : 'OFF'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="switch_prepayment">Prepago</Label>
                  <Button
                    variant={commands.find(c => c.code === 'switch_prepayment')?.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateCommand('switch_prepayment', !commands.find(c => c.code === 'switch_prepayment')?.value)}
                  >
                    {commands.find(c => c.code === 'switch_prepayment')?.value ? 'ON' : 'OFF'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="clear_energy">Limpiar Energía</Label>
                  <Button
                    variant={commands.find(c => c.code === 'clear_energy')?.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateCommand('clear_energy', !commands.find(c => c.code === 'clear_energy')?.value)}
                  >
                    {commands.find(c => c.code === 'clear_energy')?.value ? 'ON' : 'OFF'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Numeric Controls */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Battery className="w-4 h-4" />
                Configuración Numérica
              </h4>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="charge_energy">Energía a Cargar (kW·h)</Label>
                  <Input
                    id="charge_energy"
                    type="number"
                    min="0"
                    max="999999"
                    step="0.01"
                    value={commands.find(c => c.code === 'charge_energy')?.value as number || 0}
                    onChange={(e) => updateCommand('charge_energy', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="countdown_1" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Contador (segundos)
                  </Label>
                  <Input
                    id="countdown_1"
                    type="number"
                    min="0"
                    max="86400"
                    value={commands.find(c => c.code === 'countdown_1')?.value as number || 0}
                    onChange={(e) => updateCommand('countdown_1', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* String Controls */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Configuración Avanzada</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cycle_time">Tiempo de Ciclo</Label>
                <Input
                  id="cycle_time"
                  value={commands.find(c => c.code === 'cycle_time')?.value as string || ''}
                  onChange={(e) => updateCommand('cycle_time', e.target.value)}
                  placeholder="Base64 encoded time"
                />
              </div>

              <div>
                <Label htmlFor="random_time">Tiempo Aleatorio</Label>
                <Input
                  id="random_time"
                  value={commands.find(c => c.code === 'random_time')?.value as string || ''}
                  onChange={(e) => updateCommand('random_time', e.target.value)}
                  placeholder="Random time configuration"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Send Commands */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {commands.length} comandos preparados para envío
            </div>
            <Button 
              onClick={handleSendCommands} 
              disabled={loading}
              className="min-w-[140px]"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Enviando...' : 'Enviar Comandos'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Debug Panel - Raw Device Data */}
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
