# Migraciones (ejemplo) — feature `auth`

Este folder contiene migraciones y scripts de seed/ejemplo pensados para desarrollo local o integración con Strapi en el backend.

Notas:
- En producción, usa las migraciones/seed del backend (Strapi) — estas aquí son solo ejemplos para levantar usuarios en entorno local rápidamente.
- Strapi tiene su propia manera de manejar migraciones y contenidos (Data Transfer, `strapi` CLI, fixtures, etc.).

Ejemplo de uso (script `create-test-user.js`):
- Crea un usuario público (registro) enviando `POST /api/auth/local` al Strapi corriendo en `STRAPI_URL`.
- No crea un admin Strapi (ese debe crearse en el panel de Strapi o mediante la CLI/backoffice).

Si usas PostgreSQL para Strapi, revisa `cms/config/database.ts` y añade las variables de entorno correspondientes en despliegue.
