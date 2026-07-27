/**
 * Tells the Next.js frontend to drop its cache for the given tag(s), so an
 * edit in Strapi shows up on the live site within seconds -- no polling,
 * no cron, no timed revalidation window.
 */
export async function revalidateFrontend(tags: string | string[]) {
  const url = process.env.FRONTEND_URL;
  const secret = process.env.REVALIDATE_SECRET;

  if (!url || !secret) {
    strapi.log.warn('revalidateFrontend skipped: FRONTEND_URL or REVALIDATE_SECRET not set');
    return;
  }

  const tagList = Array.isArray(tags) ? tags : [tags];

  try {
    const res = await fetch(`${url}/api/revalidate?secret=${encodeURIComponent(secret)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags: tagList }),
    });
    if (!res.ok) {
      strapi.log.warn(`revalidateFrontend: frontend responded ${res.status} for tags ${tagList.join(',')}`);
    }
  } catch (err) {
    strapi.log.warn(`revalidateFrontend: request failed for tags ${tagList.join(',')}: ${(err as Error).message}`);
  }
}
