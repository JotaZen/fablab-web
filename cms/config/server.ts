export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    // En producción: usar `APP_KEYS` en .env. En dev usamos un fallback seguro
    // para evitar que Strapi falle si no se define la variable de entorno.
    keys: env.array('APP_KEYS', ['dev_key_1_change_me', 'dev_key_2_change_me']),
  },
  proxy: true,
});
