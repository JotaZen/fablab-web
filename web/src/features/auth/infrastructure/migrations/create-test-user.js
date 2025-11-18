/**
 * Script de ejemplo para crear un usuario de prueba mediante la API pública de Strapi
 * Requisitos: Strapi corriendo en `STRAPI_URL` y permitir registro de usuarios (users-permissions).
 * Uso: node create-test-user.js
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function main() {
  const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'testuser', email: 'test@example.com', password: 'password' }),
  });
  const data = await res.json().catch(() => ({}));
  console.log('Result:', res.status, data);
}

main().catch((e) => { console.error(e); process.exit(1); });
