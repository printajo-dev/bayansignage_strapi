import nodemailer from 'nodemailer';
import { getNotifyRecipients } from '../../../utils/notify-recipients';

type LeadLike = {
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  serviceInterest?: string | null;
  sourcePage?: string | null;
  formName?: string | null;
};

export async function sendLeadNotificationEmail(lead: LeadLike): Promise<{ sent: boolean; error?: string }> {
  const {
    BREVO_SMTP_HOST,
    BREVO_SMTP_PORT,
    BREVO_SMTP_USER,
    BREVO_SMTP_PASS,
    LEAD_NOTIFY_FROM,
  } = process.env;

  const recipients = await getNotifyRecipients();

  if (!BREVO_SMTP_HOST || !BREVO_SMTP_USER || !BREVO_SMTP_PASS || recipients.length === 0) {
    return { sent: false, error: 'Brevo SMTP not configured or no notify recipients set (admin panel Global Settings or LEAD_NOTIFY_EMAIL env var)' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: BREVO_SMTP_HOST,
      port: Number(BREVO_SMTP_PORT ?? 587),
      secure: false,
      auth: { user: BREVO_SMTP_USER, pass: BREVO_SMTP_PASS },
    });

    await transporter.sendMail({
      from: LEAD_NOTIFY_FROM || `"Bayan Signage Website" <${BREVO_SMTP_USER}>`,
      to: recipients,
      replyTo: lead.email,
      subject: `New lead: ${lead.name}${lead.serviceInterest ? ` — ${lead.serviceInterest}` : ''}`,
      text: [
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        lead.phone ? `Phone: ${lead.phone}` : null,
        lead.serviceInterest ? `Service interest: ${lead.serviceInterest}` : null,
        lead.sourcePage ? `Source page: ${lead.sourcePage}` : null,
        lead.formName ? `Form: ${lead.formName}` : null,
        '',
        lead.message ?? '',
      ]
        .filter(Boolean)
        .join('\n'),
    });

    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : String(err) };
  }
}
