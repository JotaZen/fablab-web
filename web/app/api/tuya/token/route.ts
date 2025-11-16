import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { client_id, client_secret, api_endpoint, grant_type = "1" } = body;

    console.log('🔑 TUYA TOKEN PROXY - Request received:');
    console.log('Client ID:', client_id);
    console.log('Client Secret:', client_secret ? `${client_secret.substring(0, 8)}...` : 'not provided');
    console.log('API Endpoint:', api_endpoint);
    console.log('Grant Type:', grant_type);

    // Validar parámetros requeridos
    if (!client_id || !client_secret || !api_endpoint) {
      console.log('❌ Missing required parameters');
      return NextResponse.json(
        { error: 'Missing client_id, client_secret, or api_endpoint' },
        { status: 400 }
      );
    }

    // Construir URL con parámetros de query
    const tokenUrl = new URL(`${api_endpoint}/v1.0/token`);
    tokenUrl.searchParams.append('grant_type', grant_type);
    
    console.log('🌐 Calling Tuya Token URL:', tokenUrl.toString());

    // Preparar headers para la autenticación según documentación oficial de Tuya
    const timestamp = Date.now();
    
    // Para Token Management API:
    // str = client_id + t + nonce + stringToSign
    // sign = HMAC-SHA256(str, secret).toUpperCase()
    
    // Generar nonce (UUID opcional pero recomendado)
    const nonce = crypto.randomUUID().replace(/-/g, '');
    
    // stringToSign para GET /v1.0/token
    const httpMethod = 'GET';
    const contentSha256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'; // SHA256 de body vacío
    const optionalSignatureKey = ''; // Vacío para este endpoint
    const url = `/v1.0/token?grant_type=${grant_type}`;
    
    const stringToSign = `${httpMethod}\n${contentSha256}\n${optionalSignatureKey}\n${url}`;
    
    // Concatenar según algoritmo oficial: client_id + t + nonce + stringToSign
    const str = client_id + timestamp.toString() + nonce + stringToSign;
    
    const sign = crypto
      .createHmac('sha256', client_secret)
      .update(str)
      .digest('hex')
      .toUpperCase();

    console.log('🔐 Generated signature for token request (Tuya Official Algorithm)');
    console.log('🔐 Timestamp:', timestamp);
    console.log('🔐 Nonce:', nonce);
    console.log('🔐 StringToSign:', stringToSign);
    console.log('🔐 Final str for HMAC:', str);
    console.log('🔐 Generated sign:', sign.substring(0, 16) + '...');

    const response = await fetch(tokenUrl.toString(), {
      method: 'GET',
      headers: {
        'client_id': client_id,
        'sign': sign,
        'sign_method': 'HMAC-SHA256',
        't': timestamp.toString(),
        'nonce': nonce,
      },
    });

    console.log('📥 Tuya Token API Response Status:', response.status);
    console.log('📥 Tuya Token API Response Headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('📄 Tuya Token API Response Body:', JSON.stringify(result, null, 2));

    if (!response.ok) {
      console.log('❌ Tuya Token API Error Response');
      console.log('❌ Error details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        result: result,
        requestDetails: {
          url: tokenUrl.toString(),
          client_id: client_id,
          timestamp: timestamp.toString(),
          sign_preview: sign.substring(0, 16) + '...'
        }
      });
      return NextResponse.json(
        { 
          error: result.msg || 'Failed to get token',
          tuyaResponse: result,
          statusCode: response.status,
          debugInfo: {
            clientId: client_id,
            endpoint: api_endpoint,
            timestamp: timestamp.toString(),
            nonce: nonce,
            signMethod: 'HMAC-SHA256',
            stringToSign: stringToSign,
            finalStr: str,
            signPreview: sign.substring(0, 16) + '...'
          }
        },
        { status: response.status }
      );
    }

    console.log('✅ Token obtained successfully');
    
    // Verificar que la respuesta tenga la estructura esperada
    if (!result.result || !result.result.access_token) {
      console.log('❌ Invalid token response structure:', result);
      return NextResponse.json(
        { 
          error: 'Invalid response structure - missing access_token',
          tuyaResponse: result,
          statusCode: 500
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      ...result,
      debugInfo: {
        timestamp: timestamp.toString(),
        responseStatus: response.status,
        tokenExpiry: result.result?.expire_time ? new Date(Date.now() + (result.result.expire_time * 1000)).toISOString() : null,
        tokenPreview: result.result.access_token.substring(0, 16) + '...'
      }
    });
  } catch (error) {
    console.error('💥 Token proxy error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
