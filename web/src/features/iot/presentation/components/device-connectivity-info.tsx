"use client";

import { Badge } from '@/shared/ui/badges/badge';
import {
  Wifi,
  WifiOff,
  Activity,
  Globe,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { DeviceInfo } from '../../domain/types';

interface DeviceConnectivityInfoProps {
  deviceInfo: DeviceInfo;
}

export function DeviceConnectivityInfo({ deviceInfo }: DeviceConnectivityInfoProps) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
        {deviceInfo.online ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
        Estado de Conectividad
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
  );
}
