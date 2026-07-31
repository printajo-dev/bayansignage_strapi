import { runSeoAuditAndEmail } from '../src/utils/seo-audit';

export default {
  // Every Monday 03:00 server time -- crawls the live site, auto-fixes
  // broken CMS-driven images, and emails a report of anything else found.
  weeklySeoAudit: {
    task: async () => {
      try {
        await runSeoAuditAndEmail();
      } catch (err) {
        strapi.log.error(`[seo-audit] run failed: ${(err as Error).message}`);
      }
    },
    options: {
      rule: '0 3 * * 1',
    },
  },
};
