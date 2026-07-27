import { revalidateFrontend } from '../../../../utils/revalidate-frontend';

export default {
  async afterUpdate() {
    await revalidateFrontend('quote');
  },
  async afterCreate() {
    await revalidateFrontend('quote');
  },
};
