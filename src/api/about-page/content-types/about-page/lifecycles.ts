import { revalidateFrontend } from '../../../../utils/revalidate-frontend';

export default {
  async afterUpdate() {
    await revalidateFrontend('about-page');
  },
  async afterCreate() {
    await revalidateFrontend('about-page');
  },
};
