import { sendLeadNotificationEmail, sendCustomerConfirmationEmail } from '../../services/notify-email';
import { syncLeadToPerfex } from '../../services/perfex-sync';

export default {
  async afterCreate(event: { result: Record<string, unknown> }) {
    const lead = event.result as {
      id: number;
      documentId: string;
      name: string;
      email: string;
      phone?: string | null;
      message?: string | null;
      serviceInterest?: string | null;
      sourcePage?: string | null;
      formName?: string | null;
    };

    const [emailResult, customerResult, perfexResult] = await Promise.all([
      sendLeadNotificationEmail(lead),
      sendCustomerConfirmationEmail(lead),
      syncLeadToPerfex(lead),
    ]);

    await strapi.documents('api::lead.lead').update({
      documentId: lead.documentId,
      data: {
        emailNotified: emailResult.sent,
        customerNotified: customerResult.sent,
        crmSyncStatus: perfexResult.status,
        crmSyncError: perfexResult.error ?? undefined,
      },
    });

    if (!emailResult.sent && emailResult.error) {
      strapi.log.warn(`[lead ${lead.id}] email notification skipped: ${emailResult.error}`);
    }
    if (!customerResult.sent && customerResult.error) {
      strapi.log.warn(`[lead ${lead.id}] customer confirmation skipped: ${customerResult.error}`);
    }
    if (perfexResult.status === 'failed') {
      strapi.log.error(`[lead ${lead.id}] Perfex sync failed: ${perfexResult.error}`);
    }
  },
};
