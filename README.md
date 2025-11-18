NextJs + Strapi
Fablab

fablabs

Strapi — Mini guía (muy simple)
- **Requisitos**: `Node.js` (>=18), `npm` o `yarn`.
- **Arrancar (local)**:
```
cd cms
npm install
npm run develop
```
- **Panel admin**: abrir `http://localhost:1337/admin` y crear usuario admin.
- **Parar**: `Ctrl+C` en la terminal.

Acceso rápido
- Web admin (Next): `http://localhost:3000/admin` (login sencillo)
- Strapi (CMS): `http://localhost:1337/admin` (panel Strapi)

Para más detalles sobre Strapi y DB revisa `cms/README.md`.

Si ves errores de TypeScript sobre `next/navigation` o JSX:
```bash
cd web
npm install
# En VSCode: 'TypeScript: Restart TS Server' o reinicia el editor
```