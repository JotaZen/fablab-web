/**
 * Payload CMS Globals
 * 
 * Exporta todas las configuraciones globales.
 * 
 * @example
 * ```typescript
 * import { globals, SiteSettings, LandingConfig } from '@/features/cms/infrastructure/payload/globals';
 * ```
 */

// Configuración del sitio
export { SiteSettings } from './SiteSettings';
export { LandingConfig } from './LandingConfig';

// Páginas
export { EquipoPage } from './EquipoPage';

// Array para usar en payload.config.ts
import { SiteSettings } from './SiteSettings';
import { LandingConfig } from './LandingConfig';
import { EquipoPage } from './EquipoPage';

export const globals = [
    SiteSettings,
    LandingConfig,
    EquipoPage,
];
