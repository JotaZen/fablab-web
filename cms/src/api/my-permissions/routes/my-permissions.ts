/**
 * My Permissions Routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/my-permissions',
      handler: 'my-permissions.find',
      config: {
        policies: [],
        middlewares: [],
        description: 'Obtiene los permisos del usuario autenticado',
      },
    },
  ],
};
