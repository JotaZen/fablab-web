const strapi = require('@strapi/strapi');

async function fixPermissions() {
    try {
        // Inicializar Strapi
        const app = await strapi.createStrapi({ distDir: './dist' }).load();

        console.log('Strapi loaded successfully.');

        // Buscar rol Authenticated
        const authenticatedRole = await strapi.plugin('users-permissions').service('role').findOne({
            type: 'authenticated'
        });

        if (!authenticatedRole) {
            console.error('Role "Authenticated" not found!');
            process.exit(1);
        }

        console.log(`Found Authenticated role with ID: ${authenticatedRole.id}`);

        // Obtener permisos actuales
        const permissions = authenticatedRole.permissions;

        // Verificar si 'plugin::users-permissions.user.me' está habilitado
        const mePermission = permissions['plugin::users-permissions']?.controllers?.user?.me;

        console.log('Current status of user.me permission:', mePermission ? 'ENABLED' : 'DISABLED');

        // Forzar habilitación
        const pluginStore = strapi.store({
            environment: '',
            type: 'plugin',
            name: 'users-permissions',
        });

        // Re-actualizar rol con el servicio de roles que maneja la lógica de permisos
        // Necesitamos construir el objeto de permisos completo
        /*
          Nota: Strapi guarda los permisos en la tabla up_permissions.
          La API para actualizar roles espera un objeto 'permissions' con la estructura.
        */

        // Vamos a buscar el permiso específico en la DB para estar seguros
        const permissionService = strapi.plugin('users-permissions').service('permission');

        // En Strapi 5, la estructura puede variar levemente, pero el concepto es igual.
        // Vamos a intentar actualizar el rol usando el servicio.

        // Habilitar 'me' en el objeto de permisos
        if (!permissions['plugin::users-permissions']) permissions['plugin::users-permissions'] = {};
        if (!permissions['plugin::users-permissions'].controllers) permissions['plugin::users-permissions'].controllers = {};
        if (!permissions['plugin::users-permissions'].controllers.user) permissions['plugin::users-permissions'].controllers.user = {};

        permissions['plugin::users-permissions'].controllers.user.me = { enabled: true };

        console.log('Updating role permissions...');

        await strapi.plugin('users-permissions').service('role').updateRole(authenticatedRole.id, {
            permissions: permissions
        });

        console.log('Permissions updated successfully.');

        // Verificación
        const updatedRole = await strapi.plugin('users-permissions').service('role').findOne({
            type: 'authenticated'
        });

        const isEnabled = updatedRole.permissions['plugin::users-permissions']?.controllers?.user?.me?.enabled;
        console.log('Verification - user.me enabled:', isEnabled);

        process.exit(0);
    } catch (error) {
        console.error('Error fixing permissions:', error);
        process.exit(1);
    }
}

fixPermissions();
