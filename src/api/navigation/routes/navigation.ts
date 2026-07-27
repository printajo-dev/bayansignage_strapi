import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::navigation.navigation', {
  only: ['find', 'update'],
});
