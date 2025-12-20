// Tipos para la API de Tuya IoT
export interface TuyaApiSettings {
  access_token: string;
  client_id: string;
  client_secret: string;
  device_id: string;
  api_endpoint: string;
  sign_method: string;
  signversion: string;
}

export interface DeviceCommand {
  code: string;
  value?: boolean | number | string;
}

export interface DeviceParameter {
  code: string;
  type: 'Boolean' | 'Integer' | 'String' | 'Raw' | 'Enum' | 'Bitmap';
  value?: boolean | number | string | unknown;
  constraints?: {
    unit?: string;
    min?: number;
    max?: number;
    scale?: number;
    step?: number;
    maxlen?: number;
    range?: string[];
    label?: string[];
  };
  description?: string;
}

export interface BreakerStatus {
  switch: boolean;
  switch_prepayment: boolean;
  total_forward_energy: number;
  balance_energy: number;
  charge_energy: number;
  leakage_current: number;
  temp_current: number;
  countdown_1: number;
  fault: string[];
  cycle_time: string;
  random_time: string;
  phase_a?: unknown;
  phase_b?: unknown;
  phase_c?: unknown;
}

export interface DeviceInfo {
  id: string;
  name: string;
  online: boolean;
  ip: string;
  local_key: string;
  category: string;
  product_id: string;
  product_name: string;
  active_time: number;
  update_time: number;
  create_time: number;
  status: BreakerStatus;
  uid: string;
  uuid: string;
  owner_id: string;
  time_zone: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  result: T;
  code?: number;
  msg?: string;
  t: number;
}

// Tipos específicos para respuestas de la API
export interface TuyaDeviceStatusResponse {
  result: Array<{
    code: string;
    value: boolean | number | string;
    type: string;
  }>;
}

export interface TuyaDeviceInfoResponse {
  result: DeviceInfo;
}

export interface TuyaCommandResponse {
  result: boolean;
}

// Estados de carga y errores
export interface ApiState {
  loading: boolean;
  error: string | null;
}

// Configuración extendida
export interface ExtendedTuyaApiSettings extends TuyaApiSettings {
  secret?: string; // Para cálculo de signature en implementación completa
}

// Respuesta del endpoint de token
export interface TokenResponse {
  result: {
    access_token: string;
    expire_time: number;
    refresh_token: string;
    uid: string;
  };
  success: boolean;
  t: number;
}

// Configuración del Message Service
export interface MessageServiceSettings {
  enabled: boolean;
  type: 'MessageQueue' | 'WebHook';
  encryption: 'AES-ECB' | 'AES-CBC' | 'None';
  effectiveTime: string;
  alertMethod: string;
}
