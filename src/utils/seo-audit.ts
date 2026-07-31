import nodemailer from 'nodemailer';

/**
 * Weekly self-audit: crawls the live site the same way a search engine
 * would, catching broken images/links and sitemap problems before anyone
 * reports them. Auto-fixes the one class of issue that's safe to fix
 * unsupervised (a CMS-driven image field that now 404s gets swapped to a
 * generic real fallback photo) and emails a report for everything else --
 * broken internal links aren't auto-redirected because guessing the
 * intended target wrong would be worse than leaving them broken.
 *
 * Google Search Console's own coverage/sitemap-submission data isn't wired
 * in yet -- that needs a verified GSC property and a service account, which
 * needs the site owner's Google account. This crawl-based audit covers the
 * same practical ground (broken links, broken images, sitemap validity)
 * without that dependency.
 */

const SITE_ORIGIN = 'https://bayansignage.com';
const FALLBACK_IMAGE = `${SITE_ORIGIN}/images/boutique-storefront-fascia-sign.webp`;
const STOCK_HOSTS = ['images.unsplash.com', 'cdn.shopify.com', 'rolanddga.com', 'ubsigns.ca', 'pexels.com', 'pixabay.com'];

type PageResult = { url: string; status: number };
type BrokenImage = { img: string; status: number | string; referencedBy: string[] };
type BrokenLink = { link: string; status: number | string; referencedBy: string[] };

async function getSitemapUrls(): Promise<string[]> {
  const res = await fetch(`${SITE_ORIGIN}/sitemap.xml`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

function extractImages(html: string): string[] {
  return [...new Set([...html.matchAll(/<img[^>]+src=["']([^"']+)["']/g)].map((m) => m[1]))];
}

function extractInternalLinks(html: string): string[] {
  const links = new Set<string>();
  for (const m of html.matchAll(/<a[^>]+href=["']([^"']+)["']/g)) {
    const href = m[1];
    if ((href.startsWith('/') || href.startsWith(SITE_ORIGIN)) && !href.startsWith('/cdn-cgi/')) links.add(href);
  }
  return [...links];
}

async function fetchStatus(url: string): Promise<number | string> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.status;
  } catch (err) {
    return `ERR:${(err as Error).message}`;
  }
}

export type SeoAuditReport = {
  pagesChecked: number;
  brokenPages: PageResult[];
  brokenImages: BrokenImage[];
  brokenLinks: BrokenLink[];
  stockImagesFound: BrokenImage[];
  autoFixed: { field: string; from: string; to: string }[];
  sitemapOk: boolean;
};

export async function runSeoAudit(): Promise<SeoAuditReport> {
  const pageUrls = await getSitemapUrls();
  const sitemapOk = pageUrls.length > 0;

  const brokenPages: PageResult[] = [];
  const allImages = new Map<string, Set<string>>();
  const allLinks = new Map<string, Set<string>>();

  for (const url of pageUrls) {
    const res = await fetch(url);
    if (res.status !== 200) {
      brokenPages.push({ url, status: res.status });
      continue;
    }
    const html = await res.text();
    for (const img of extractImages(html)) {
      if (!allImages.has(img)) allImages.set(img, new Set());
      allImages.get(img)!.add(url);
    }
    for (const link of extractInternalLinks(html)) {
      if (!allLinks.has(link)) allLinks.set(link, new Set());
      allLinks.get(link)!.add(url);
    }
  }

  const brokenImages: BrokenImage[] = [];
  const stockImagesFound: BrokenImage[] = [];
  for (const [img, refs] of allImages) {
    const full = img.startsWith('/') ? SITE_ORIGIN + img : img;
    if (!full.startsWith('http')) continue;
    if (STOCK_HOSTS.some((h) => full.includes(h))) {
      stockImagesFound.push({ img: full, status: 'stock-host', referencedBy: [...refs] });
      continue;
    }
    const status = await fetchStatus(full);
    if (status !== 200) brokenImages.push({ img: full, status, referencedBy: [...refs] });
  }

  const brokenLinks: BrokenLink[] = [];
  for (const [link, refs] of allLinks) {
    const full = link.startsWith('/') ? SITE_ORIGIN + link : link;
    const status = await fetchStatus(full);
    if (status !== 200 && typeof status === 'number' && status >= 400) {
      brokenLinks.push({ link: full, status, referencedBy: [...refs] });
    } else if (typeof status === 'string') {
      brokenLinks.push({ link: full, status, referencedBy: [...refs] });
    }
  }

  const autoFixed = await autoFixBrokenServiceImages(brokenImages);

  return { pagesChecked: pageUrls.length, brokenPages, brokenImages, brokenLinks, stockImagesFound, autoFixed, sitemapOk };
}

/**
 * The only unsupervised auto-fix: a service-page hero/item/related image
 * field that 404s gets swapped to a known-good generic photo so the page
 * never shows a broken image, even though the specific photo is now wrong.
 * That's a strictly better default than a broken <img>, and reversible by
 * re-editing the field in the admin panel.
 */
async function autoFixBrokenServiceImages(brokenImages: BrokenImage[]): Promise<{ field: string; from: string; to: string }[]> {
  const fixed: { field: string; from: string; to: string }[] = [];
  if (brokenImages.length === 0) return fixed;

  const brokenUrls = new Set(brokenImages.map((b) => b.img));

  const pages = await strapi.documents('api::service-page.service-page').findMany({
    populate: { types: { populate: { items: true } }, related: true },
  });

  for (const page of pages) {
    let changed = false;
    const patch: Record<string, unknown> = {};

    if (page.heroImg && brokenUrls.has(page.heroImg)) {
      patch.heroImg = FALLBACK_IMAGE;
      fixed.push({ field: `service-page:${page.slug}.heroImg`, from: page.heroImg, to: FALLBACK_IMAGE });
      changed = true;
    }
    const items = (page.types as { items: { img: string }[] })?.items;
    if (items?.some((i) => brokenUrls.has(i.img))) {
      patch.types = {
        ...(page.types as object),
        items: items.map((i) => (brokenUrls.has(i.img) ? { ...i, img: FALLBACK_IMAGE } : i)),
      };
      for (const i of items) if (brokenUrls.has(i.img)) fixed.push({ field: `service-page:${page.slug}.items`, from: i.img, to: FALLBACK_IMAGE });
      changed = true;
    }
    const related = page.related as { img: string }[] | undefined;
    if (related?.some((r) => brokenUrls.has(r.img))) {
      patch.related = related.map((r) => (brokenUrls.has(r.img) ? { ...r, img: FALLBACK_IMAGE } : r));
      for (const r of related) if (brokenUrls.has(r.img)) fixed.push({ field: `service-page:${page.slug}.related`, from: r.img, to: FALLBACK_IMAGE });
      changed = true;
    }

    if (changed) {
      await strapi.documents('api::service-page.service-page').update({ documentId: page.documentId, data: patch });
    }
  }

  return fixed;
}

function formatReport(report: SeoAuditReport): string {
  const lines: string[] = [];
  lines.push(`Weekly SEO self-audit -- ${new Date().toISOString().slice(0, 10)}`);
  lines.push('');
  lines.push(`Pages checked: ${report.pagesChecked}`);
  lines.push(`Sitemap reachable: ${report.sitemapOk ? 'yes' : 'NO -- check sitemap.xml immediately'}`);
  lines.push('');

  if (report.brokenPages.length) {
    lines.push(`BROKEN PAGES (${report.brokenPages.length}):`);
    report.brokenPages.forEach((p) => lines.push(`  ${p.status}  ${p.url}`));
    lines.push('');
  }

  if (report.autoFixed.length) {
    lines.push(`AUTO-FIXED (${report.autoFixed.length}) -- swapped to a fallback photo, review and pick a proper replacement in the admin panel:`);
    report.autoFixed.forEach((f) => lines.push(`  ${f.field}: ${f.from} -> ${f.to}`));
    lines.push('');
  }

  const stillBrokenImages = report.brokenImages.filter((b) => !report.autoFixed.some((f) => f.from === b.img));
  if (stillBrokenImages.length) {
    lines.push(`BROKEN IMAGES NOT AUTO-FIXED (${stillBrokenImages.length}) -- outside service pages, needs manual fix:`);
    stillBrokenImages.forEach((b) => lines.push(`  ${b.status}  ${b.img}  (on ${b.referencedBy[0]})`));
    lines.push('');
  }

  if (report.stockImagesFound.length) {
    lines.push(`STOCK/PLACEHOLDER IMAGES DETECTED (${report.stockImagesFound.length}) -- someone re-added a stock photo:`);
    report.stockImagesFound.forEach((b) => lines.push(`  ${b.img}  (on ${b.referencedBy[0]})`));
    lines.push('');
  }

  if (report.brokenLinks.length) {
    lines.push(`BROKEN LINKS (${report.brokenLinks.length}) -- not auto-fixed, needs a human to pick the right redirect target:`);
    report.brokenLinks.forEach((b) => lines.push(`  ${b.status}  ${b.link}  (on ${b.referencedBy[0]})`));
    lines.push('');
  }

  if (
    !report.brokenPages.length &&
    !stillBrokenImages.length &&
    !report.brokenLinks.length &&
    !report.stockImagesFound.length
  ) {
    lines.push('No issues found. Site is clean.');
  }

  return lines.join('\n');
}

export async function runSeoAuditAndEmail(): Promise<void> {
  const report = await runSeoAudit();
  const { BREVO_SMTP_HOST, BREVO_SMTP_PORT, BREVO_SMTP_USER, BREVO_SMTP_PASS, LEAD_NOTIFY_EMAIL, LEAD_NOTIFY_FROM } = process.env;

  strapi.log.info(`[seo-audit] pages=${report.pagesChecked} brokenPages=${report.brokenPages.length} brokenImages=${report.brokenImages.length} brokenLinks=${report.brokenLinks.length} autoFixed=${report.autoFixed.length}`);

  if (!BREVO_SMTP_HOST || !BREVO_SMTP_USER || !BREVO_SMTP_PASS || !LEAD_NOTIFY_EMAIL) {
    strapi.log.warn('[seo-audit] Brevo SMTP env vars not configured -- report logged only, no email sent');
    return;
  }

  const hasIssues = report.brokenPages.length || report.brokenImages.length || report.brokenLinks.length || report.stockImagesFound.length;

  const transporter = nodemailer.createTransport({
    host: BREVO_SMTP_HOST,
    port: Number(BREVO_SMTP_PORT ?? 587),
    secure: false,
    auth: { user: BREVO_SMTP_USER, pass: BREVO_SMTP_PASS },
  });

  await transporter.sendMail({
    from: LEAD_NOTIFY_FROM || `"Bayan Signage Website" <${BREVO_SMTP_USER}>`,
    to: LEAD_NOTIFY_EMAIL.split(',').map((e) => e.trim()).filter(Boolean),
    subject: `Weekly SEO audit — ${hasIssues ? 'issues found' : 'all clear'} — bayansignage.com`,
    text: formatReport(report),
  });
}
