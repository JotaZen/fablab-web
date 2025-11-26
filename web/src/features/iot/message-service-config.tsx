"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/cards/card";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Label } from "@/shared/ui/labels/label";
import { Separator } from "@/shared/ui/sections/separator";
import { Badge } from "@/shared/ui/badges/badge";
import { MessageSquare, Save, AlertTriangle, CheckCircle, ChevronDown, ChevronRight } from "lucide-react";
import type { MessageServiceConfig } from "./types";

export function MessageServiceConfig() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [config, setConfig] = useState<MessageServiceConfig>({
    enabled: true,
    type: 'MessageQueue',
    encryption: 'AES-ECB',
    effectiveTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    alertMethod: 'No reminder has been set, and messages might accumulate.'
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    // Aquí guardarías la configuración en localStorage o enviarías a la API
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('tuya_message_service_config', JSON.stringify(config));
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    console.log('Message Service Config saved:', config);
  };

  const handleInputChange = (field: keyof MessageServiceConfig, value: string | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors pb-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <div>
              <CardTitle className="text-base">Message Service</CardTitle>
              <CardDescription className="text-sm">
                Configuración de notificaciones IoT
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={config.enabled ? "default" : "secondary"} className="text-xs">
              {config.enabled ? "Activo" : "Inactivo"}
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
          {/* Toggle de habilitación */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="service-enabled" className="text-sm font-medium">Habilitar Servicio</Label>
              <p className="text-xs text-muted-foreground">
                Activar para recibir eventos del dispositivo
              </p>
            </div>
            <input
              id="service-enabled"
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => handleInputChange('enabled', e.target.checked)}
              className="w-5 h-5"
              aria-label="Habilitar Message Service"
            />
          </div>

          <Separator />

          {/* Configuración compacta en grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service-type" className="text-sm">Tipo de Servicio</Label>
              <select
                id="service-type"
                value={config.type}
                onChange={(e) => handleInputChange('type', e.target.value as 'MessageQueue' | 'WebHook')}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Tipo de servicio"
              >
                <option value="MessageQueue">Message Queue</option>
                <option value="WebHook">WebHook</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="encryption-algorithm" className="text-sm">Encriptación</Label>
              <select
                id="encryption-algorithm"
                value={config.encryption}
                onChange={(e) => handleInputChange('encryption', e.target.value as 'AES-ECB' | 'AES-CBC' | 'None')}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Algoritmo de encriptación"
              >
                <option value="AES-ECB">AES-ECB</option>
                <option value="AES-CBC">AES-CBC</option>
                <option value="None">Sin encriptación</option>
              </select>
            </div>
          </div>

          {/* Configuración adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="effective-time" className="text-sm">Tiempo Efectivo</Label>
              <Input
                id="effective-time"
                type="datetime-local"
                value={config.effectiveTime.replace(' ', 'T')}
                onChange={(e) => handleInputChange('effectiveTime', e.target.value.replace('T', ' '))}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alert-method" className="text-sm">Método de Alerta</Label>
              <Input
                id="alert-method"
                placeholder="Configurar método de alerta"
                value={config.alertMethod}
                onChange={(e) => handleInputChange('alertMethod', e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* Estado compacto */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="text-center">
              <p className="text-muted-foreground mb-1">Estado</p>
              <Badge variant={config.enabled ? "default" : "secondary"} className="text-xs">
                {config.enabled ? "Habilitado" : "Deshabilitado"}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground mb-1">Tipo</p>
              <Badge variant="outline" className="text-xs">{config.type}</Badge>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground mb-1">Encriptación</p>
              <Badge variant="outline" className="text-xs">{config.encryption}</Badge>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground mb-1">Vigente</p>
              <Badge variant="outline" className="text-xs">
                {new Date(config.effectiveTime).toLocaleDateString()}
              </Badge>
            </div>
          </div>

          {/* Información importante compacta */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-yellow-800">Configuración Requerida</p>
                <p className="text-xs text-yellow-700 leading-relaxed">
                  Para producción, configure las alertas correctamente para evitar pérdida de mensajes.
                  El servicio utiliza <strong>{config.type}</strong> con encriptación <strong>{config.encryption}</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Botón de guardar compacto */}
          <Button onClick={handleSave} className="w-full" size="sm" disabled={isSaved}>
            <Save className="w-3 h-3 mr-2" />
            {isSaved ? (
              <>
                <CheckCircle className="w-3 h-3 mr-2" />
                Guardado Exitosamente
              </>
            ) : (
              'Guardar Configuración'
            )}
          </Button>

          {/* Info adicional colapsada */}
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer font-medium mb-2 hover:text-foreground transition-colors">
              📋 Información Técnica del Message Service
            </summary>
            <div className="bg-muted/30 p-3 rounded-lg space-y-2 mt-2">
              <p>
                <strong>Message Queue:</strong> Permite recibir eventos en tiempo real del dispositivo IoT, 
                incluyendo cambios de estado, alarmas y notificaciones.
              </p>
              <p>
                <strong>Encriptación AES-ECB:</strong> Los mensajes son encriptados para mayor seguridad 
                durante la transmisión.
              </p>
              <p>
                <strong>Almacenamiento:</strong> La configuración se guarda localmente en su navegador 
                y se sincroniza con la API de Tuya.
              </p>
            </div>
          </details>
        </CardContent>
      )}
    </Card>
  );
}
