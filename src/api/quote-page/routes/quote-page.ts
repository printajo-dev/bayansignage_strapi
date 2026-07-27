import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::quote-page.quote-page', {
  only: ['find', 'update'],
});
