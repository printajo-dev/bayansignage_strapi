import type { StrapiApp } from '@strapi/strapi/admin';
import { Image } from '@strapi/icons';

export default {
  config: {
    locales: [],
  },
  register(app: StrapiApp) {
    app.customFields.register({
      name: 'image-picker',
      type: 'string',
      intlLabel: { id: 'image-picker.label', defaultMessage: 'Image' },
      intlDescription: {
        id: 'image-picker.description',
        defaultMessage: 'Pick or upload an image from the Media Library',
      },
      icon: Image,
      components: {
        Input: async () => import('./extensions/image-picker/ImagePickerInput'),
      },
    });
  },
};
