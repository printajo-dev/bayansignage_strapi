import { revalidateFrontend } from '../../../../utils/revalidate-frontend';

async function revalidateForEntry(event: { result: Record<string, unknown> }) {
  const slug = event.result?.slug as string | undefined;
  const tags = ['service-pages'];
  if (slug) tags.push(`service-page:${slug}`);
  await revalidateFrontend(tags);
}

export default {
  afterCreate: revalidateForEntry,
  afterUpdate: revalidateForEntry,
  afterDelete: revalidateForEntry,
};
