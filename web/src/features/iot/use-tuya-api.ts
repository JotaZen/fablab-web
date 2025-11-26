"use client";

import { useState, useEffect } from 'react';
import { TuyaApiConfig, DeviceCommand, BreakerStatus, DeviceInfo, ApiResponse } from './types';

// Configuración por defecto
const DEFAULT_CONFIG: TuyaApiConfig = {
  access_token: '',
  client_id: '',
  client_secret: '',
  device_id: 'eb8e6e63110f3332dcipz1',
  api_endpoint: 'https://openapi.tuyaus.com',
  sign_method: 'HMAC-SHA256',
  signversion: '2.0'
};

// Hook para manejar la configuración de la API de Tuya
export function useTuyaConfig() {
  const [config, setConfig] = useState<TuyaApiConfig>(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar configuración desde localStorage solo una vez al montar
  useEffect(() => {
    let mounted = true;
    
    try {
      if (typeof window === 'undefined') return;
      const savedConfig = window.localStorage.getItem('tuya_api_config');
      if (savedConfig && mounted) {
        const parsed = JSON.parse(savedConfig) as Partial<TuyaApiConfig>;
        setConfig(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Error loading saved config:', error);
      if (mounted) {
        setConfig(DEFAULT_CONFIG);
      }
    } finally {
      if (mounted) {
        setIsLoaded(true);
      }
    }

    return () => {
      mounted = false;
    };
  }, []); // Solo se ejecuta una vez al montar

  // Guardar configuración en localStorage
  const saveConfig = (newConfig: Partial<TuyaApiConfig>) => {
    try {
      const updatedConfig = { ...config, ...newConfig };
      setConfig(updatedConfig);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('tuya_api_config', JSON.stringify(updatedConfig));
      }
      console.log('Configuration saved successfully:', updatedConfig);
    } catch (error) {
      console.error('Error saving config:', error);
      throw new Error('Failed to save configuration');
    }
  };

  const clearConfig = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('tuya_api_config');
      }
      setConfig(DEFAULT_CONFIG);
      console.log('Configuration cleared');
    } catch (error) {
      console.error('Error clearing config:', error);
    }
  };

  return { config, saveConfig, clearConfig, isLoaded };
}

// Hook para realizar llamadas a la API de Tuya
export function useTuyaApi() {
  const { config } = useTuyaConfig();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener token automáticamente
  const getToken = async (customConfig?: Partial<TuyaApiConfig>): Promise<string> => {
    // Usar configuración personalizada o la configuración actual
    const configToUse = customConfig ? { ...config, ...customConfig } : config;
    
    if (!configToUse.client_id || !configToUse.client_secret) {
      throw new Error('Client ID and Client Secret are required to get token');
    }

    console.log('🔑 Getting new access token...');
    console.log('🔑 Using Client ID:', configToUse.client_id);
    console.log('🔑 Using API Endpoint:', configToUse.api_endpoint);

    const response = await fetch('/api/tuya/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: configToUse.client_id,
        client_secret: configToUse.client_secret,
        api_endpoint: configToUse.api_endpoint,
        grant_type: '1'
      }),
    });

    const result = await response.json();
    console.log('🔑 TOKEN - Response from proxy:', result);

    if (!response.ok) {
      console.error('🔑 TOKEN - Error details:', result);
      throw new Error(result.error || result.msg || 'Failed to get access token');
    }

    // Verificar que la respuesta tenga la estructura correcta
    if (!result.result || !result.result.access_token) {
      console.error('🔑 TOKEN - Invalid response structure:', result);
      throw new Error('Invalid token response structure - no access_token found');
    }

    return result.result.access_token;
  };

  const sendCommand = async (commands: DeviceCommand[]): Promise<ApiResponse> => {
    if (!config.access_token || !config.client_id || !config.client_secret) {
      throw new Error('API configuration incomplete - need access_token, client_id, and client_secret');
    }

    setLoading(true);
    setError(null);

    try {
      const timestamp = Date.now();
      
      console.log('🔧 SEND COMMAND - Starting with config:', {
        device_id: config.device_id,
        access_token: config.access_token.substring(0, 16) + '...',
        client_id: config.client_id,
        commands: commands
      });

      // El proxy del servidor maneja la generación de firmas
      const response = await fetch(`/api/tuya/commands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_id: config.device_id,
          commands: commands,
          config: {
            access_token: config.access_token,
            client_id: config.client_id,
            client_secret: config.client_secret,
            api_endpoint: config.api_endpoint,
            sign_method: config.sign_method,
            signversion: config.signversion,
            timestamp: timestamp
          }
        }),
      });

      const result = await response.json();
      console.log('� SEND COMMAND - Response from proxy:', result);

      if (!response.ok) {
        console.error('🔧 SEND COMMAND - Error details:', result);
        throw new Error(result.error || result.msg || 'Failed to send commands');
      }

      console.log('✅ SEND COMMAND - Success:', result);
      return result;
    } catch (err) {
      console.error('❌ SEND COMMAND - Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceInfo = async (): Promise<DeviceInfo> => {
    if (!config.access_token || !config.client_id || !config.client_secret) {
      throw new Error('API configuration incomplete - need access_token, client_id, and client_secret');
    }

    setLoading(true);
    setError(null);

    try {
      const timestamp = Date.now();
      
      console.log('📱 DEVICE INFO - Starting with config:', {
        device_id: config.device_id,
        access_token: config.access_token.substring(0, 16) + '...',
        client_id: config.client_id
      });

      // El proxy del servidor maneja la generación de firmas
      const response = await fetch(`/api/tuya/device-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_id: config.device_id,
          config: {
            access_token: config.access_token,
            client_id: config.client_id,
            client_secret: config.client_secret,
            api_endpoint: config.api_endpoint,
            sign_method: config.sign_method,
            signversion: config.signversion,
            timestamp: timestamp
          }
        }),
      });

      const result = await response.json();
      console.log('📱 DEVICE INFO - Response from proxy:', result);
      
      if (!response.ok) {
        console.error('❌ DEVICE INFO - Error response:', result);
        throw new Error(result.error || result.msg || 'Failed to get device info');
      }

      console.log('✅ DEVICE INFO - Success:', result);
      return result.result;
    } catch (err) {
      console.error('❌ DEVICE INFO - Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceStatus = async (): Promise<BreakerStatus> => {
    if (!config.access_token || !config.client_id || !config.client_secret) {
      throw new Error('API configuration incomplete - need access_token, client_id, and client_secret');
    }

    setLoading(true);
    setError(null);

    try {
      const timestamp = Date.now();
      
      console.log('📊 DEVICE STATUS - Starting with config:', {
        device_id: config.device_id,
        access_token: config.access_token.substring(0, 16) + '...',
        client_id: config.client_id
      });

      // El proxy del servidor maneja la generación de firmas
      const response = await fetch(`/api/tuya/device-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_id: config.device_id,
          config: {
            access_token: config.access_token,
            client_id: config.client_id,
            client_secret: config.client_secret,
            api_endpoint: config.api_endpoint,
            sign_method: config.sign_method,
            signversion: config.signversion,
            timestamp: timestamp
          }
        }),
      });

      const result = await response.json();
      console.log('📊 DEVICE STATUS - Response from proxy:', result);
      
      if (!response.ok) {
        console.error('❌ DEVICE STATUS - Error response:', result);
        throw new Error(result.error || result.msg || 'Failed to get device status');
      }

      // Transformar la respuesta al formato BreakerStatus
      const statusArray = result.result || [];
      console.log('📊 DEVICE STATUS - Raw status array:', statusArray);
      
      // NO usar valores por defecto - solo datos reales del dispositivo
      const status: BreakerStatus = {} as BreakerStatus;

      // Procesar array de estados si existe
      if (Array.isArray(statusArray)) {
        statusArray.forEach((item: { code: string; value: boolean | number | string }) => {
          console.log(`📊 DEVICE STATUS - Processing field: ${item.code} = ${item.value} (${typeof item.value})`);
          (status as unknown as Record<string, unknown>)[item.code] = item.value;
        });
      } else if (typeof result.result === 'object' && result.result !== null) {
        // Si result.result es un objeto, hacer merge directo
        console.log('📊 DEVICE STATUS - Processing object result:', result.result);
        Object.assign(status, result.result);
      }

      console.log('✅ DEVICE STATUS - Processed device status (ONLY REAL DATA):', status);
      console.log('✅ DEVICE STATUS - Temperature from device:', status.temp_current);
      return status;
    } catch (err) {
      console.error('❌ DEVICE STATUS - Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { sendCommand, getDeviceStatus, getDeviceInfo, getToken, loading, error };
}
