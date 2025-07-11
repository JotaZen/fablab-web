"use client";

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTuyaApi } from './use-tuya-api';
import { BreakerStatus, DeviceInfo } from './types';
import { DeviceConnectivityInfo } from './device-connectivity-info';
import { DeviceDataCards } from './device-data-cards';
import { JsonViewer } from './json-viewer';
import { 
  Zap, 
  AlertTriangle, 
  RefreshCw,
  Activity
} from 'lucide-react';

export function BreakerStatusPanel() {
  const { getDeviceStatus, getDeviceInfo, sendCommand, loading, error } = useTuyaApi();
  const [status, setStatus] = useState<BreakerStatus | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastApiResponse, setLastApiResponse] = useState<Record<string, unknown> | null>(null);

  const refreshStatus = useCallback(async () => {
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

  return (
    <div className="space-y-6">
      {/* Panel Principal de Estado */}
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

          {/* Información de Conectividad */}
          {deviceInfo && (
            <DeviceConnectivityInfo deviceInfo={deviceInfo} />
          )}

          {/* Tarjetas de Datos del Breaker */}
          {status && (
            <DeviceDataCards 
              status={status} 
              onSwitchControl={handleSwitchControl}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>

      {/* Panel de Debug Raw Data */}
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
              <span className="text-xs text-muted-foreground">
                Última respuesta API: {String(lastApiResponse.timestamp || 'no timestamp')}
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
