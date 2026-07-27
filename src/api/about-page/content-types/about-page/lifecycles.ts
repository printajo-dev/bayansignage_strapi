import { revalidateFrontend } from '../../../../utils/revalidate-frontend';

export default {
  async afterUpdate() {
    await revalidateFrontend('about');
  },
  async afterCreate() {
    await revalidateFrontend('about');
  },
};
