/**
 * Script para resetear la contraseña de un usuario
 * 
 * Ejecutar con: npx tsx scripts/reset-password.ts
 */

import { getPayload } from 'payload';
import config from '@payload-config';

// ====== CONFIGURACIÓN ======
// Puedes cambiar estos valores según necesites
const USER_EMAIL = 'miguel.contreras@fablab.cl'; // Cambia por el email correcto
const NEW_PASSWORD = 'Temporal123!'; // Contraseña temporal genérica
// ===========================

async function resetPassword() {
    console.log('🔐 Iniciando reset de contraseña...\n');

    const payload = await getPayload({ config });

    // Buscar usuario por email (o por nombre si no conocemos el email exacto)
    const users = await payload.find({
        collection: 'users',
        where: {
            or: [
                { email: { contains: 'miguel' } },
                { email: { contains: 'contreras' } },
                { name: { contains: 'Miguel' } },
                { name: { contains: 'Contreras' } },
            ],
        },
        limit: 10,
    });

    if (users.docs.length === 0) {
        console.log('❌ No se encontró ningún usuario con ese criterio.');
        console.log('\n📋 Listando todos los usuarios del sistema:\n');
        
        const allUsers = await payload.find({
            collection: 'users',
            limit: 50,
        });

        allUsers.docs.forEach((user: any, index: number) => {
            console.log(`   ${index + 1}. ${user.name || 'Sin nombre'} - ${user.email} (${user.role || 'sin rol'})`);
        });
        
        return;
    }

    console.log('📋 Usuarios encontrados:\n');
    users.docs.forEach((user: any, index: number) => {
        console.log(`   ${index + 1}. ID: ${user.id}`);
        console.log(`      Nombre: ${user.name || 'Sin nombre'}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Rol: ${user.role || 'sin rol'}`);
        console.log('');
    });

    // Si hay solo uno, reseteamos ese
    const targetUser = users.docs[0];
    
    console.log(`🎯 Reseteando contraseña para: ${targetUser.email}\n`);

    // Actualizar contraseña
    await payload.update({
        collection: 'users',
        id: targetUser.id,
        data: {
            password: NEW_PASSWORD,
        },
    });

    console.log('✅ ¡Contraseña reseteada exitosamente!\n');
    console.log('═══════════════════════════════════════');
    console.log(`   Email:    ${targetUser.email}`);
    console.log(`   Password: ${NEW_PASSWORD}`);
    console.log('═══════════════════════════════════════');
    console.log('\n⚠️  Recuerda cambiar la contraseña después de iniciar sesión!\n');
}

resetPassword()
    .then(() => {
        console.log('Script finalizado.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
