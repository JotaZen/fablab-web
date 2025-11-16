# Panel de Control IoT - Breaker Inteligente

Este módulo proporciona una interfaz web completa para controlar y monitorear dispositivos IoT compatibles con la API de Tuya, específicamente diseñado para breakers (interruptores) inteligentes.

## Características

### 🔧 Configuración de API
- **Almacenamiento Local**: Los datos de configuración se guardan en localStorage del navegador
- **Configuración Segura**: Los tokens de acceso se manejan de forma segura
- **Validación**: Verificación de configuración completa antes de permitir operaciones

### 📊 Monitoreo en Tiempo Real
- **Estado del Interruptor**: ON/OFF del dispositivo
- **Consumo de Energía**: Total forward energy en kW·h
- **Temperatura**: Monitor de temperatura del dispositivo
- **Corriente de Fuga**: Detección de fallas eléctricas
- **Actualización Manual**: Botón para refrescar el estado

### 🎛️ Panel de Control
- **Controles Booleanos**: Switch principal, prepago, limpiar energía
- **Configuración Numérica**: Energía a cargar, temporizadores
- **Configuración Avanzada**: Tiempo de ciclo, tiempo aleatorio
- **Envío de Comandos**: Envío de múltiples comandos simultáneamente

## Estructura de Archivos

```
src/components/app/
├── types.ts                 # Interfaces TypeScript para Tuya API
├── use-tuya-api.ts         # Hook para llamadas a la API
├── tuya-api-config.tsx     # Componente de configuración
└── breaker-control-panel.tsx # Panel principal de control
```

## Configuración Inicial

1. **Acceder al Panel**: Navega a `/control-iot`
2. **Configurar API**: 
   - Ingresa tu `access_token` de Tuya
   - Ingresa tu `client_id`
   - Opcionalmente modifica el `device_id` (por defecto: `eb8e6e63110f3332dcipz1`)
3. **Guardar**: Haz clic en "Guardar Configuración"

## Parámetros Soportados

### Comandos de Control (Escritura)
- `switch_prepayment` (Boolean): Activar/desactivar modo prepago
- `clear_energy` (Boolean): Limpiar contador de energía
- `charge_energy` (Integer): Cantidad de energía a cargar (0-999999 kW·h)
- `switch` (Boolean): Interruptor principal
- `countdown_1` (Integer): Temporizador en segundos (0-86400)
- `cycle_time` (String): Configuración de tiempo de ciclo
- `random_time` (String): Configuración de tiempo aleatorio

### Estado del Dispositivo (Lectura)
- `total_forward_energy`: Energía total consumida
- `balance_energy`: Energía restante
- `leakage_current`: Corriente de fuga en mA
- `temp_current`: Temperatura actual en °C
- `fault`: Array de códigos de falla
- `phase_a`, `phase_b`, `phase_c`: Datos de fases eléctricas

## Uso de la API

### Configuración Requerida
```typescript
{
  access_token: "tu_token_de_acceso",
  client_id: "tu_client_id",
  device_id: "eb8e6e63110f3332dcipz1",
  api_endpoint: "https://openapi.tuyaus.com"
}
```

### Endpoints Utilizados
- `GET /v1.0/devices/{device_id}/status` - Obtener estado del dispositivo
- `POST /v1.0/devices/{device_id}/commands` - Enviar comandos al dispositivo

### Ejemplo de Comando
```typescript
const commands = [
  { code: "switch", value: true },
  { code: "charge_energy", value: 100.50 }
];
```

## Seguridad

- **Almacenamiento Local**: Los datos se almacenan solo en tu navegador
- **HTTPS**: Todas las comunicaciones usan HTTPS
- **Sin Logging**: No se registran tokens o datos sensibles
- **Validación**: Validación de entrada en todos los campos

## Desarrollado para FabLab INACAP

Este panel es parte del ecosistema tecnológico del FabLab INACAP, diseñado para demostrar capacidades de IoT y control remoto de dispositivos inteligentes.

---

**⚠️ Importante**: Asegúrate de tener las credenciales correctas de la API de Tuya antes de usar este panel. Las credenciales incorrectas pueden resultar en errores de autenticación.
