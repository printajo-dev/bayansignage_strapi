import { revalidateFrontend } from '../../../../utils/revalidate-frontend';

export default {
  async afterUpdate() {
    await revalidateFrontend('home');
  },
  async afterCreate() {
    await revalidateFrontend('home');
  },
};
