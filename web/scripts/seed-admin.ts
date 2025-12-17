/**
 * Script para crear el usuario administrador inicial en Payload
 * 
 * Ejecutar con: npx ts-node --esm scripts/seed-admin.ts
 * O vía API: curl -X POST http://localhost:3000/api/seed-admin
 */

import { getPayload } from 'payload';
import config from '../payload.config';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@fablab.cl';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'FabLab2024!';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrador';

async function seedAdmin() {
    console.log('🌱 Iniciando seed de usuario administrador...');

    const payload = await getPayload({ config });

    // Verificar si ya existe un usuario
    const existingUsers = await payload.find({
        collection: 'users',
        limit: 1,
    });

    if (existingUsers.docs.length > 0) {
        console.log('⚠️  Ya existe al menos un usuario. Seed cancelado.');
        console.log(`   Usuario existente: ${existingUsers.docs[0].email}`);
        return;
    }

    // Crear usuario administrador
    const admin = await payload.create({
        collection: 'users',
        data: {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            name: ADMIN_NAME,
            role: 'admin',
        },
    });

    console.log('✅ Usuario administrador creado exitosamente!');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('   ⚠️  Cambia la contraseña después del primer login!');

    return admin;
}

// Solo ejecutar si es el módulo principal
seedAdmin()
    .then(() => {
        console.log('🎉 Seed completado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error en seed:', error);
        process.exit(1);
    });
