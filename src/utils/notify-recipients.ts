/**
 * Notification recipients are editable in the admin panel (Global Settings
 * -> Lead notify emails) so the site owner can change who gets notified
 * without needing a developer. Falls back to the LEAD_NOTIFY_EMAIL env var
 * if that field is left blank.
 *
 * Cast to `any` here because the `leadNotifyEmails`/`gtmId` fields were
 * just added to the global schema and the generated Strapi types haven't
 * been regenerated yet (`npx strapi ts:generate-types`, requires a live DB
 * connection) -- this still works correctly at runtime, just without
 * type-checking on this one field until that's run.
 */
export async function getNotifyRecipients(): Promise<string[]> {
  const global = (await strapi.documents('api::global.global').findFirst({})) as { leadNotifyEmails?: string | null } | null;
  const fromAdmin = global?.leadNotifyEmails;
  const source = fromAdmin && fromAdmin.trim() ? fromAdmin : process.env.LEAD_NOTIFY_EMAIL ?? '';
  return source.split(',').map((e) => e.trim()).filter(Boolean);
}
