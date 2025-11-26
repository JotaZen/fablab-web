/**
 * Admin Migration Routes
 * 
 * Rutas protegidas para gestión de migraciones.
 * Solo accesibles por administradores autenticados.
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/admin-migrations/list',
      handler: 'admin-migration.list',
      config: {
        policies: [],
        middlewares: [],
        description: 'Lista todas las migraciones disponibles y su estado',
        tag: {
          name: 'Admin Migration',
          plugin: 'admin',
        },
      },
    },
    {
      method: 'POST',
      path: '/admin-migrations/run',
      handler: 'admin-migration.runAll',
      config: {
        policies: [],
        middlewares: [],
        description: 'Ejecuta todas las migraciones pendientes',
        tag: {
          name: 'Admin Migration',
          plugin: 'admin',
        },
      },
    },
    {
      method: 'POST',
      path: '/admin-migrations/run/:id',
      handler: 'admin-migration.runOne',
      config: {
        policies: [],
        middlewares: [],
        description: 'Ejecuta una migración específica',
        tag: {
          name: 'Admin Migration',
          plugin: 'admin',
        },
      },
    },
    {
      method: 'DELETE',
      path: '/admin-migrations/rollback/:id',
      handler: 'admin-migration.rollback',
      config: {
        policies: [],
        middlewares: [],
        description: 'Revierte una migración específica (requiere confirmación)',
        tag: {
          name: 'Admin Migration',
          plugin: 'admin',
        },
      },
    },
  ],
};
