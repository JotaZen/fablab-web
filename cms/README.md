# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

How to connect a PostgreSQL database (quick)
1. Create a PostgreSQL database and user. Example (local):
```bash
createdb fablab_strapi
createuser fablab_user -P
psql -c "GRANT ALL PRIVILEGES ON DATABASE fablab_strapi TO fablab_user;"
```
2. Create a `.env` in `/cms` and copy values from `.env.example` (don't commit `.env`).
3. Set DB variables in `.env`:
```
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=fablab_strapi
DATABASE_USERNAME=fablab_user
DATABASE_PASSWORD=your_password_here
```
4. Start Strapi:
```bash
cd cms
npm install
npm run build
npm start
```
Strapi se encargará de crear sus tablas al iniciar. Para migraciones más avanzadas utiliza la CLI de Strapi o la funcionalidad de content export/import.

Vulnerabilidades y actualizaciones (rápido)
- Si `npm audit` muestra vulnerabilidades, puedes intentar resolverlas con:
```bash
cd cms
npm audit
npm audit fix
```
- Si la salida sugiere actualizaciones para `@strapi/strapi` o paquetes relacionados, revisa la versión recomendada y actualiza:
```bash
npm install @strapi/strapi@latest
npm update
```
- Si hay vulnerabilidades críticas y `npm audit fix` no las corrige, prueba `npm audit fix --force` **solo** si aceptas posibles cambios mayores.
- Recomendación final: después de actualizar, prueba `npm run build` y `npm start` para verificar que el CMS funcione correctamente.

Configurar `APP_KEYS` (importante)
- Strapi requiere `APP_KEYS` (array de valores) para firmar los cookies de sesión. Puedes añadirlos en `cms/.env` con al menos dos claves separadas por coma:
```
APP_KEYS=key_1_random,key_2_random
```
- Genera claves seguras:
```bash
# Node (bash):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- En desarrollo puedes usar el fallback que hay en `cms/config/server.ts` (no recomendado en producción).

Permitir CORS para el frontend
- Si tu frontend llama directamente a Strapi desde el navegador, añade origen en `cms/config/middlewares.ts` para `strapi::cors` (o configura en `config`):
```ts
export default [
	'strapi::logger',
	'strapi::errors',
	'strapi::security',
	{ name: 'strapi::cors', config: { origin: ['http://localhost:3000'], credentials: true } },
	'strapi::poweredBy',
	'strapi::query',
	'strapi::body',
	'strapi::session',
	'strapi::favicon',
	'strapi::public',
];
```



---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
