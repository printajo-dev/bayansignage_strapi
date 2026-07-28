import { revalidateFrontend } from '../../../../utils/revalidate-frontend';

async function revalidateForEntry(event: { result: Record<string, unknown> }) {
  const slug = event.result?.slug as string | undefined;
  const tags = ['blog-posts'];
  if (slug) tags.push(`blog-post:${slug}`);
  await revalidateFrontend(tags);
}

export default {
  afterCreate: revalidateForEntry,
  afterUpdate: revalidateForEntry,
  afterDelete: revalidateForEntry,
};
