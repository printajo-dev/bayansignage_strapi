import { factories } from '@strapi/strapi';

/**
 * Turnstile verification lives here, not in the frontend, because the
 * secret key is a Strapi `private` field -- private fields are stripped
 * from every REST response regardless of auth, by design, so the only
 * code that can ever see it is backend code running inside Strapi itself.
 */
async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const global = (await strapi.documents('api::global.global').findFirst({})) as {
    turnstileSiteKey?: string | null;
    turnstileSecretKey?: string | null;
  } | null;

  const secret = global?.turnstileSecretKey;
  if (!secret) return true; // Turnstile not configured -- skip, matches the widget rendering nothing without a site key.
  if (!token) return false;

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });
    const json = (await res.json()) as { success: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}

export default factories.createCoreController('api::lead.lead', ({ strapi }) => ({
  async create(ctx) {
    const body = ctx.request.body as { data?: Record<string, unknown> };
    const turnstileToken = body?.data?.turnstileToken as string | undefined;

    if (!(await verifyTurnstile(turnstileToken))) {
      return ctx.badRequest('Verification failed. Please try again.');
    }

    // turnstileToken isn't a schema field -- strip it before the default
    // create handler validates the payload against the content type.
    if (body?.data && 'turnstileToken' in body.data) {
      delete body.data.turnstileToken;
    }

    // Strapi links this object's prototype to the default core controller,
    // so `super.create` calls the unmodified implementation.
    return super.create(ctx);
  },
}));
