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

function getTransporter() {
  const { BREVO_SMTP_HOST, BREVO_SMTP_PORT, BREVO_SMTP_USER, BREVO_SMTP_PASS } = process.env;
  if (!BREVO_SMTP_HOST || !BREVO_SMTP_USER || !BREVO_SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: BREVO_SMTP_HOST,
    port: Number(BREVO_SMTP_PORT ?? 587),
    secure: false,
    auth: { user: BREVO_SMTP_USER, pass: BREVO_SMTP_PASS },
  });
}

export async function sendLeadNotificationEmail(lead: LeadLike): Promise<{ sent: boolean; error?: string }> {
  const transporter = getTransporter();
  const recipients = await getNotifyRecipients();

  if (!transporter || recipients.length === 0) {
    return { sent: false, error: 'Brevo SMTP not configured or no notify recipients set (admin panel Global Settings or LEAD_NOTIFY_EMAIL env var)' };
  }

  try {
    await transporter.sendMail({
      from: process.env.LEAD_NOTIFY_FROM || `"Bayan Signage Website" <${process.env.BREVO_SMTP_USER}>`,
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

/**
 * Auto-reply sent to the person who submitted the form, confirming it was
 * received. Uses Global Settings for company name/phone/WhatsApp so the
 * message stays in sync with whatever's shown on the site, rather than
 * hardcoding them here.
 */
export async function sendCustomerConfirmationEmail(lead: LeadLike): Promise<{ sent: boolean; error?: string }> {
  const transporter = getTransporter();
  if (!transporter) {
    return { sent: false, error: 'Brevo SMTP not configured' };
  }

  try {
    const global = (await strapi.documents('api::global.global').findFirst({})) as {
      name?: string;
      phone?: string;
      whatsappNumber?: string;
      email?: string;
    } | null;

    const companyName = global?.name || 'Bayan Signage';
    const phone = global?.phone;
    const whatsappLink = global?.whatsappNumber ? `https://wa.me/${global.whatsappNumber}` : null;
    const replyToEmail = global?.email || process.env.LEAD_NOTIFY_FROM;

    await transporter.sendMail({
      from: process.env.LEAD_NOTIFY_FROM || `"${companyName}" <${process.env.BREVO_SMTP_USER}>`,
      to: lead.email,
      replyTo: replyToEmail,
      subject: `We've received your request — ${companyName}`,
      text: [
        `Hi ${lead.name.split(' ')[0] || lead.name},`,
        '',
        `Thanks for reaching out to ${companyName}. We've received your request${lead.serviceInterest ? ` about ${lead.serviceInterest}` : ''} and one of our team will be in touch shortly.`,
        '',
        phone ? `If it's urgent, call or WhatsApp us directly: ${phone}` : null,
        whatsappLink ? `WhatsApp: ${whatsappLink}` : null,
        '',
        `— ${companyName}`,
      ]
        .filter((line) => line !== null)
        .join('\n'),
    });

    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : String(err) };
  }
}
