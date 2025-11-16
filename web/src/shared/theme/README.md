# Theme (shared)

Breve guía sobre los tokens y variables CSS del proyecto.

Ubicación
- `frontend/src/shared/theme/tokens.ts` — fuente de verdad en TypeScript.
- `frontend/src/shared/theme/theme.css` — variables CSS para usar en runtime (importar desde `app/globals.css`).

Uso rápido
- Importa variables en `frontend/app/globals.css`:
  - `@import '@/src/shared/theme/theme.css';`
- Usa en CSS: `background: var(--color-background); color: var(--color-text-primary);`
- Usa en React inline: `style={{ background: 'var(--color-brand-primary)' }}`

Flujo recomendado
1. Edita `tokens.ts` para cambiar valores maestros.
2. Si necesitas sincronizar con Tailwind, genera un JSON desde `tokens.ts` o copia la paleta a `tailwind.config.ts`.
3. Para dark mode, añade `data-theme="dark"` en `html` o `body` en runtime.

Notas
- Mantén nombres semánticos (`brand-primary`, `text-primary`) — facilita refactors.
- Para cambios globales rápidos, preferir variables CSS para evitar rebuilds.
