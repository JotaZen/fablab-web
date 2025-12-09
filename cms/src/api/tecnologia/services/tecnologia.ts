/**
 * tecnologia service
 */

import { factories } from '@strapi/strapi';

// Cast to satisfy TS until types are regenerated for the new content-type
export default factories.createCoreService('api::tecnologia.tecnologia' as any);
