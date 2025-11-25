import type { Core } from '@strapi/strapi';

// ============================================================
// PERMISOS POR DEFECTO DEL SISTEMA
// ============================================================

interface DefaultPermission {
  permissionId: string;
  description: string;
  category: 'inventory' | 'iot' | 'blog' | 'users' | 'admin' | 'reservations';
}

const DEFAULT_PERMISSIONS: DefaultPermission[] = [
  // INVENTARIO
  { permissionId: 'inventory.items.read', description: 'Ver items del inventario', category: 'inventory' },
  { permissionId: 'inventory.items.create', description: 'Crear items en el inventario', category: 'inventory' },
  { permissionId: 'inventory.items.update', description: 'Editar items del inventario', category: 'inventory' },
  { permissionId: 'inventory.items.delete', description: 'Eliminar items del inventario', category: 'inventory' },
  { permissionId: 'inventory.categories.manage', description: 'Gestionar categorías del inventario', category: 'inventory' },
  { permissionId: 'inventory.loans.read', description: 'Ver préstamos de equipos', category: 'inventory' },
  { permissionId: 'inventory.loans.manage', description: 'Gestionar préstamos de equipos', category: 'inventory' },
  // IOT
  { permissionId: 'iot.devices.read', description: 'Ver estado de dispositivos IoT', category: 'iot' },
  { permissionId: 'iot.devices.control', description: 'Controlar dispositivos IoT', category: 'iot' },
  { permissionId: 'iot.devices.configure', description: 'Configurar dispositivos IoT', category: 'iot' },
  { permissionId: 'iot.logs.read', description: 'Ver logs de dispositivos IoT', category: 'iot' },
  // BLOG
  { permissionId: 'blog.posts.read', description: 'Ver posts del blog', category: 'blog' },
  { permissionId: 'blog.posts.create', description: 'Crear posts en el blog', category: 'blog' },
  { permissionId: 'blog.posts.update', description: 'Editar posts del blog', category: 'blog' },
  { permissionId: 'blog.posts.delete', description: 'Eliminar posts del blog', category: 'blog' },
  { permissionId: 'blog.posts.publish', description: 'Publicar/despublicar posts', category: 'blog' },
  // USUARIOS
  { permissionId: 'users.list.read', description: 'Ver lista de usuarios', category: 'users' },
  { permissionId: 'users.profile.read', description: 'Ver perfiles de usuarios', category: 'users' },
  { permissionId: 'users.profile.update', description: 'Editar perfiles de usuarios', category: 'users' },
  { permissionId: 'users.accounts.create', description: 'Crear cuentas de usuario', category: 'users' },
  { permissionId: 'users.accounts.delete', description: 'Eliminar cuentas de usuario', category: 'users' },
  { permissionId: 'users.permissions.manage', description: 'Gestionar permisos de usuarios', category: 'users' },
  // ADMIN
  { permissionId: 'admin.dashboard.access', description: 'Acceder al panel de administración', category: 'admin' },
  { permissionId: 'admin.settings.read', description: 'Ver configuración del sistema', category: 'admin' },
  { permissionId: 'admin.settings.update', description: 'Modificar configuración del sistema', category: 'admin' },
  { permissionId: 'admin.audit.read', description: 'Ver logs de auditoría', category: 'admin' },
  // RESERVACIONES
  { permissionId: 'reservations.own.read', description: 'Ver mis reservaciones', category: 'reservations' },
  { permissionId: 'reservations.own.create', description: 'Crear mis reservaciones', category: 'reservations' },
  { permissionId: 'reservations.own.cancel', description: 'Cancelar mis reservaciones', category: 'reservations' },
  { permissionId: 'reservations.all.read', description: 'Ver todas las reservaciones', category: 'reservations' },
  { permissionId: 'reservations.all.manage', description: 'Gestionar todas las reservaciones', category: 'reservations' },
];

// ============================================================
// PERFILES POR DEFECTO
// ============================================================

interface DefaultProfile {
  profileId: string;
  name: string;
  description: string;
  permissionIds: string[];
  defaultScope: 'global' | 'workspace' | 'own';
  isSystem: boolean;
}

const DEFAULT_PROFILES: DefaultProfile[] = [
  {
    profileId: 'superadmin',
    name: 'Super Administrador',
    description: 'Acceso completo a todo el sistema',
    permissionIds: DEFAULT_PERMISSIONS.map(p => p.permissionId),
    defaultScope: 'global',
    isSystem: true,
  },
  {
    profileId: 'admin',
    name: 'Administrador',
    description: 'Gestión general del FabLab',
    permissionIds: [
      'admin.dashboard.access', 'admin.settings.read',
      'inventory.items.read', 'inventory.items.create', 'inventory.items.update',
      'inventory.categories.manage', 'inventory.loans.read', 'inventory.loans.manage',
      'iot.devices.read', 'iot.devices.control',
      'blog.posts.read', 'blog.posts.create', 'blog.posts.update', 'blog.posts.delete', 'blog.posts.publish',
      'users.list.read', 'users.profile.read', 'users.profile.update', 'users.accounts.create',
      'reservations.all.read', 'reservations.all.manage',
    ],
    defaultScope: 'global',
    isSystem: true,
  },
  {
    profileId: 'editor',
    name: 'Editor',
    description: 'Gestión de contenido del blog',
    permissionIds: [
      'admin.dashboard.access',
      'blog.posts.read', 'blog.posts.create', 'blog.posts.update', 'blog.posts.publish',
    ],
    defaultScope: 'own',
    isSystem: true,
  },
  {
    profileId: 'inventory_manager',
    name: 'Encargado de Inventario',
    description: 'Gestión completa del inventario',
    permissionIds: [
      'admin.dashboard.access',
      'inventory.items.read', 'inventory.items.create', 'inventory.items.update', 'inventory.items.delete',
      'inventory.categories.manage', 'inventory.loans.read', 'inventory.loans.manage',
    ],
    defaultScope: 'global',
    isSystem: true,
  },
  {
    profileId: 'iot_operator',
    name: 'Operador IoT',
    description: 'Control de dispositivos IoT',
    permissionIds: [
      'admin.dashboard.access',
      'iot.devices.read', 'iot.devices.control', 'iot.logs.read',
    ],
    defaultScope: 'global',
    isSystem: true,
  },
  {
    profileId: 'member',
    name: 'Miembro FabLab',
    description: 'Usuario regular del FabLab',
    permissionIds: [
      'inventory.items.read', 'inventory.loans.read',
      'blog.posts.read',
      'reservations.own.read', 'reservations.own.create', 'reservations.own.cancel',
    ],
    defaultScope: 'own',
    isSystem: true,
  },
];

// ============================================================
// STRAPI LIFECYCLE
// ============================================================

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Solo ejecutar seeds si está habilitado explícitamente
    // Usar: SEED_DATABASE=true npm run develop
    const shouldSeed = process.env.SEED_DATABASE === 'true';
    
    if (!shouldSeed) {
      console.log('💡 Seeds deshabilitados. Usar SEED_DATABASE=true para cargar datos iniciales.');
      return;
    }

    console.log('🚀 FabLab CMS Bootstrap iniciando (SEED_DATABASE=true)...');
    
    // Esperar un poco para que los content-types estén listos
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await seedPermissions(strapi);
    await seedProfiles(strapi);
    
    console.log('✅ FabLab CMS Bootstrap completado');
  },
};

// ============================================================
// SEED FUNCTIONS
// ============================================================

async function seedPermissions(strapi: Core.Strapi): Promise<void> {
  console.log('🔐 Verificando permisos...');

  try {
    let created = 0;
    let existing = 0;

    for (const permission of DEFAULT_PERMISSIONS) {
      const found = await strapi.db?.query('api::permission.permission').findOne({
        where: { permissionId: permission.permissionId },
      });

      if (found) {
        existing++;
        continue;
      }

      await strapi.db?.query('api::permission.permission').create({
        data: {
          permissionId: permission.permissionId,
          description: permission.description,
          category: permission.category,
          isActive: true,
        },
      });
      created++;
    }

    if (created > 0) {
      console.log(`   ✅ Permisos: ${created} creados, ${existing} existentes`);
    } else {
      console.log(`   ✓ Permisos: ${existing} ya existentes`);
    }
  } catch (error) {
    console.log('   ⏳ Content-Type permission aún no disponible');
  }
}

async function seedProfiles(strapi: Core.Strapi): Promise<void> {
  console.log('👥 Verificando perfiles...');

  try {
    let created = 0;
    let existing = 0;

    for (const profile of DEFAULT_PROFILES) {
      const found = await strapi.db?.query('api::profile.profile').findOne({
        where: { profileId: profile.profileId },
      });

      if (found) {
        existing++;
        continue;
      }

      // Obtener IDs de los permisos
      const permissionRecords = await strapi.db?.query('api::permission.permission').findMany({
        where: { permissionId: { $in: profile.permissionIds } },
      });

      await strapi.db?.query('api::profile.profile').create({
        data: {
          profileId: profile.profileId,
          name: profile.name,
          description: profile.description,
          defaultScope: profile.defaultScope,
          isSystem: profile.isSystem,
          permissions: permissionRecords?.map((p: { id: number }) => p.id) || [],
        },
      });
      created++;
    }

    if (created > 0) {
      console.log(`   ✅ Perfiles: ${created} creados, ${existing} existentes`);
    } else {
      console.log(`   ✓ Perfiles: ${existing} ya existentes`);
    }
  } catch (error) {
    console.log('   ⏳ Content-Type profile aún no disponible');
  }
}
