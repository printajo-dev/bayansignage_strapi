import { revalidateFrontend } from '../../../../utils/revalidate-frontend';

export default {
  async afterUpdate() {
    await revalidateFrontend('quote-page');
  },
  async afterCreate() {
    await revalidateFrontend('quote-page');
  },
};
