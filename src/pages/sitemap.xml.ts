import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Sitemap generata a mano, per tenere le rotte sotto il nostro controllo
// (niente integrazione @astrojs/sitemap). Enumera le rotte statiche + i post non in bozza.
export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://leonardopegollo.dev')).toString().replace(/\/$/, '');

  const posts = (await getCollection('blog')).filter((p) => !p.data.draft);
  const byId = new Map(posts.map((post) => [post.id, post]));

  type Alternate = { lang: string; href: string };
  type SitemapUrl = { loc: string; lastmod?: string; alternates?: Alternate[] };
  const pageAlternates = (it: string, en: string): Alternate[] => [
    { lang: 'it', href: `${base}${it}` },
    { lang: 'en', href: `${base}${en}` },
    { lang: 'x-default', href: `${base}${it}` },
  ];

  const urls: SitemapUrl[] = [
    { loc: `${base}/`, alternates: pageAlternates('/', '/en') },
    { loc: `${base}/about`, alternates: pageAlternates('/about', '/en/about') },
    { loc: `${base}/blog`, alternates: pageAlternates('/blog', '/en/blog') },
    ...posts.map((post) => {
      const locPath = post.data.lang === 'en' ? `/en/blog/${post.id}` : `/blog/${post.id}`;
      const translation = post.data.translation ? byId.get(post.data.translation) : undefined;
      const translationPath = translation
        ? translation.data.lang === 'en' ? `/en/blog/${translation.id}` : `/blog/${translation.id}`
        : undefined;
      const alternates = translation
        ? [
            { lang: 'it', href: `${base}${post.data.lang === 'it' ? locPath : translationPath}` },
            { lang: 'en', href: `${base}${post.data.lang === 'en' ? locPath : translationPath}` },
            { lang: 'x-default', href: `${base}${post.data.lang === 'it' ? locPath : translationPath}` },
          ]
        : undefined;
      return {
        loc: `${base}${locPath}`,
        lastmod: (post.data.updatedDate ?? post.data.pubDate).toISOString().slice(0, 10),
        alternates,
      };
    }),
  ];

  const escapeXml = (value: string) => value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (url) => `  <url><loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}${
      url.alternates?.map((alternate) => `<xhtml:link rel="alternate" hreflang="${alternate.lang}" href="${escapeXml(alternate.href)}" />`).join('') ?? ''
    }</url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
