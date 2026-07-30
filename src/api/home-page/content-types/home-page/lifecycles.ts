import { revalidateFrontend } from '../../../../utils/revalidate-frontend';

export default {
  async afterUpdate() {
    await revalidateFrontend('home-page');
  },
  async afterCreate() {
    await revalidateFrontend('home-page');
  },
};
