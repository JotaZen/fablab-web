"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, RefreshCw, Timer, Settings } from "lucide-react";

export function RefreshConfig() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const handleIntervalChange = (interval: number) => {
    setAutoRefreshInterval(interval);
    // Aquí se puede agregar lógica adicional para comunicar con el panel principal
  };

  const handleStopRefresh = () => {
    setAutoRefreshInterval(0);
    setIsRefreshing(false);
  };

  const handleRefreshNow = () => {
    setIsRefreshing(true);
    setLastUpdate(new Date());
    // Simular actualización
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors pb-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <div>
              <CardTitle className="text-base">Control de Actualización</CardTitle>
              <CardDescription className="text-xs">
                Configuración de intervalos automáticos
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={autoRefreshInterval > 0 ? "default" : "secondary"} className="text-xs">
              {autoRefreshInterval > 0 ? `${autoRefreshInterval}s` : 'Manual'}
            </Badge>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4 pt-0">
          {/* Intervalos predefinidos */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Intervalos de Actualización</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[5, 10, 30, 60].map((seconds) => (
                <Button
                  key={seconds}
                  onClick={() => handleIntervalChange(seconds)}
                  variant={autoRefreshInterval === seconds ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {seconds}s
                </Button>
              ))}
            </div>
          </div>

          {/* Controles de acción */}
          <div className="flex gap-2">
            <Button
              onClick={() => handleIntervalChange(0)}
              variant={autoRefreshInterval === 0 ? "default" : "outline"}
              size="sm"
              className="text-xs"
            >
              Manual
            </Button>
            
            {autoRefreshInterval > 0 && (
              <Button
                onClick={handleStopRefresh}
                variant="destructive"
                size="sm"
                className="text-xs"
              >
                Detener
              </Button>
            )}
            
            <Button
              onClick={handleRefreshNow}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="text-xs flex-1"
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Actualizando...' : 'Refrescar Ahora'}
            </Button>
          </div>

          {/* Estado actual */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center p-2 bg-muted/30 rounded">
              <p className="text-muted-foreground mb-1">Estado</p>
              <Badge variant={autoRefreshInterval > 0 ? "default" : "secondary"} className="text-xs">
                {autoRefreshInterval > 0 ? (
                  <span className="text-green-600">🟢 Activo</span>
                ) : (
                  <span className="text-gray-600">🔘 Manual</span>
                )}
              </Badge>
            </div>
            <div className="text-center p-2 bg-muted/30 rounded">
              <p className="text-muted-foreground mb-1">Última actualización</p>
              <p className="font-mono text-xs">
                {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Nunca'}
              </p>
            </div>
          </div>

          {/* Información de estado */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-xs text-blue-700">
              {isRefreshing ? (
                "🔄 Actualizando datos del dispositivo..."
              ) : autoRefreshInterval === 0 ? (
                "Actualización manual - usa el botón de refrescar cuando necesites datos actuales"
              ) : (
                `Actualizando automáticamente cada ${autoRefreshInterval} segundos`
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
