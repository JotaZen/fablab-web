"use client";

import { Badge } from '@/shared/ui/badges/badge';
import { Button } from '@/shared/ui/buttons/button';
import { 
  Power, 
  Gauge, 
  Battery, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { BreakerStatus } from './types';

interface DeviceDataCardsProps {
  status: BreakerStatus;
  onSwitchControl: (value: boolean) => void;
  loading: boolean;
}

export function DeviceDataCards({ status, onSwitchControl, loading }: DeviceDataCardsProps) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
        <Gauge className="w-4 h-4" />
        Datos del Dispositivo
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Switch Principal */}
        <div className="p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-2 mb-3">
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
          )}
          
          {/* Botones de control */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Button
              onClick={() => onSwitchControl(true)}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-xs h-8"
              size="sm"
            >
              <Power className="w-3 h-3 mr-1" />
              ON
            </Button>
            
            <Button
              onClick={() => onSwitchControl(false)}
              disabled={loading}
              variant="destructive"
              className="text-xs h-8"
              size="sm"
            >
              <Power className="w-3 h-3 mr-1" />
              OFF
            </Button>
          </div>
          
          <p className="text-xs text-green-600">✅ Estado real del dispositivo</p>
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
    </div>
  );
}
