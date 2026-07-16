type LeadLike = {
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  serviceInterest?: string | null;
  sourcePage?: string | null;
};

/**
 * Pushes a lead into Perfex CRM via its REST API module.
 * Perfex's community "REST API" module expects a POST to {baseUrl}/api/leads
 * with an `authtoken` header. Field names below match that module's
 * expected payload; adjust if your Perfex install uses a different API module.
 */
export async function syncLeadToPerfex(
  lead: LeadLike
): Promise<{ status: 'synced' | 'skipped' | 'failed'; error?: string }> {
  const { PERFEX_API_URL, PERFEX_API_TOKEN } = process.env;

  if (!PERFEX_API_URL || !PERFEX_API_TOKEN) {
    return { status: 'skipped', error: 'Perfex API env vars not configured' };
  }

  try {
    const res = await fetch(`${PERFEX_API_URL.replace(/\/$/, '')}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authtoken: PERFEX_API_TOKEN,
      },
      body: JSON.stringify({
        name: lead.name,
        email: lead.email,
        phonenumber: lead.phone ?? '',
        description: [lead.serviceInterest, lead.sourcePage ? `Source: ${lead.sourcePage}` : null, lead.message]
          .filter(Boolean)
          .join('\n\n'),
        source: 'Website',
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { status: 'failed', error: `Perfex API ${res.status}: ${body.slice(0, 300)}` };
    }

    return { status: 'synced' };
  } catch (err) {
    return { status: 'failed', error: err instanceof Error ? err.message : String(err) };
  }
}
