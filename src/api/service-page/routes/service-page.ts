import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::service-page.service-page', {
  only: ['find', 'findOne', 'create', 'update'],
});
