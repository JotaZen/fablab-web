import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { device_id, commands, config } = body;

    console.log('🔧 TUYA COMMANDS PROXY - Request received:');
    console.log('Device ID:', device_id);
    console.log('Commands:', JSON.stringify(commands, null, 2));
    console.log('Config endpoint:', config.api_endpoint);

    // Validar parámetros
    if (!device_id || !commands || !config) {
      console.log('❌ Missing parameters');
      return NextResponse.json(
        { error: 'Missing device_id, commands, or config' },
        { status: 400 }
      );
    }

    // Validar parámetros de configuración requeridos
    if (!config.access_token || !config.client_id || !config.client_secret) {
      console.log('❌ Missing required config parameters');
      return NextResponse.json(
        { error: 'Missing access_token, client_id, or client_secret in config' },
        { status: 400 }
      );
    }

    // Preparar el body para la API de Tuya
    const requestBody = JSON.stringify({ commands });
    console.log('📤 Request body to Tuya:', requestBody);

    // Generar firma según documentación oficial de Tuya
    const timestamp = Date.now();
    const httpMethod = 'POST';
    const url = `/v1.0/devices/${device_id}/commands`;
    
    // Calcular SHA256 del body
    const contentSha256 = crypto
      .createHash('sha256')
      .update(requestBody, 'utf8')
      .digest('hex');
    
    const optionalSignatureKey = ''; // Vacío para APIs estándar
    
    // stringToSign según documentación oficial
    const stringToSign = `${httpMethod}\n${contentSha256}\n${optionalSignatureKey}\n${url}`;
    
    // Generar nonce (UUID opcional pero recomendado)
    const nonce = crypto.randomUUID().replace(/-/g, '');
    
    // Para General Business API: client_id + access_token + t + nonce + stringToSign
    const str = config.client_id + config.access_token + timestamp.toString() + nonce + stringToSign;
    
    const sign = crypto
      .createHmac('sha256', config.client_secret)
      .update(str)
      .digest('hex')
      .toUpperCase();

    console.log('🔐 Generated signature for commands request (Tuya Official Algorithm)');
    console.log('🔐 Timestamp:', timestamp);
    console.log('🔐 Nonce:', nonce);
    console.log('🔐 StringToSign:', stringToSign);
    console.log('🔐 Generated sign:', sign.substring(0, 16) + '...');

    // Llamar a la API de Tuya usando el proxy del servidor
    const tuyaUrl = `${config.api_endpoint}${url}`;
    console.log('🌐 Calling Tuya URL:', tuyaUrl);
    
    const response = await fetch(tuyaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'access_token': config.access_token,
        'client_id': config.client_id,
        'sign': sign,
        'sign_method': 'HMAC-SHA256',
        'signversion': '2.0',
        't': timestamp.toString(),
        'nonce': nonce,
      },
      body: requestBody,
    });

    console.log('📥 Tuya API Response Status:', response.status);
    console.log('📥 Tuya API Response Headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('📄 Tuya API Response Body:', JSON.stringify(result, null, 2));

    if (!response.ok) {
      console.log('❌ Tuya API Error Response');
      return NextResponse.json(
        { 
          error: result.msg || 'Failed to send commands',
          tuyaResponse: result,
          statusCode: response.status,
          debugInfo: {
            timestamp: timestamp.toString(),
            nonce: nonce,
            signPreview: sign.substring(0, 16) + '...',
            url: url
          }
        },
        { status: response.status }
      );
    }

    console.log('✅ Commands sent successfully');
    return NextResponse.json({
      ...result,
      debugInfo: {
        requestSent: commands,
        timestamp: timestamp,
        responseStatus: response.status,
        signPreview: sign.substring(0, 16) + '...'
      }
    });
  } catch (error) {
    console.error('💥 Proxy error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
