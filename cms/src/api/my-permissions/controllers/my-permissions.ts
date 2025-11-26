/**
 * My Permissions Controller
 * 
 * Endpoint personalizado para obtener los permisos del usuario autenticado.
 */

import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * GET /api/my-permissions
   * Devuelve los permisos del usuario autenticado
   */
  async find(ctx) {
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('Debes estar autenticado para ver tus permisos');
    }

    try {
      // Buscar user-permissions del usuario actual
      const userPermissions = await strapi.db.query('api::user-permission.user-permission').findMany({
        where: {
          user: { id: user.id }
        },
        populate: {
          permission: {
            select: ['id', 'permissionId', 'description', 'category']
          }
        }
      });

      // Transformar al formato esperado por el frontend
      const permissions = userPermissions.map((up: any) => ({
        permissionId: up.permission?.permissionId || '',
        scope: up.scope,
        workspaceId: up.workspaceId || null,
        expiresAt: up.expiresAt || null
      })).filter((p: any) => p.permissionId);

      return {
        data: permissions,
        meta: {
          total: permissions.length,
          userId: user.id
        }
      };
    } catch (error) {
      strapi.log.error('Error obteniendo permisos del usuario:', error);
      return ctx.internalServerError('Error al obtener permisos');
    }
  }
});
