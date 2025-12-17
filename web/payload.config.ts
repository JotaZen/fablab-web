/**
 * Payload CMS Configuration
 * 
 * Este archivo configura Payload CMS 3.0 embebido en Next.js
 * Usamos PostgreSQL como base de datos y Lexical como editor de texto enriquecido
 */

import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Colecciones
import { Posts } from './src/features/blog/infrastructure/payload/collections/Posts';
import { Media } from './src/features/blog/infrastructure/payload/collections/Media';
import { Categories } from './src/features/blog/infrastructure/payload/collections/Categories';
import { Users } from './src/features/blog/infrastructure/payload/collections/Users';
import { TeamMembers } from './src/features/landing/infrastructure/payload/collections/TeamMembers';
import { EquipoPage } from './src/features/landing/infrastructure/payload/globals/EquipoPage';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// URL de conexión a PostgreSQL
// Formato: postgres://usuario:password@host:puerto/database
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://fablab:fablab_secret_2024@localhost:5432/fablab_blog';

export default buildConfig({
    // URL del admin panel
    admin: {
        user: Users.slug,
        meta: {
            title: 'FabLab CMS',
            description: 'Sistema de gestión de contenidos del FabLab INACAP Los Ángeles',
        },
    },

    // Colecciones del CMS
    collections: [
        Users,
        Posts,
        Media,
        Categories,
        TeamMembers,
    ],

    // Globales del CMS
    globals: [
        EquipoPage,
    ],

    // Secreto para JWT - usar variable de entorno en producción
    secret: process.env.PAYLOAD_SECRET || 'fablab-payload-secret-dev',

    // TypeScript output
    typescript: {
        outputFile: path.resolve(dirname, 'src/features/blog/infrastructure/payload/payload-types.ts'),
    },

    // Base de datos PostgreSQL
    db: postgresAdapter({
        pool: {
            connectionString: DATABASE_URL,
        },
    }),

    // Editor de texto enriquecido Lexical
    editor: lexicalEditor({}),

    // Procesamiento de imágenes con Sharp
    sharp,

    // serverURL solo en producción (en desarrollo se detecta automáticamente)
    ...(process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SERVER_URL
        ? { serverURL: process.env.NEXT_PUBLIC_SERVER_URL }
        : {}),

    // GraphQL API
    graphQL: {
        schemaOutputFile: path.resolve(dirname, 'src/features/blog/infrastructure/payload/generated-schema.graphql'),
    },

    // Rutas del admin de Payload
    routes: {
        admin: '/cms',
        api: '/api/payload',
    },

    // Configuración de upload
    upload: {
        limits: {
            fileSize: 10000000, // 10MB
        },
    },
});
