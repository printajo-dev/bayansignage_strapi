import { revalidateFrontend } from '../../../../utils/revalidate-frontend';

export default {
  async afterUpdate() {
    await revalidateFrontend('global');
  },
  async afterCreate() {
    await revalidateFrontend('global');
  },
};
