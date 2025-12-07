export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  // Configuramos CORS en dev para permitir llamadas desde el frontend
  { name: 'strapi::cors', config: { origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true } },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
