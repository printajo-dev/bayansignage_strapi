import { revalidateFrontend } from '../../../../utils/revalidate-frontend';

export default {
  async afterUpdate() {
    await revalidateFrontend('navigation');
  },
  async afterCreate() {
    await revalidateFrontend('navigation');
  },
};
