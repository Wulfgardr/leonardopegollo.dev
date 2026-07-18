import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Sitemap generata a mano, per tenere le rotte sotto il nostro controllo
// (niente integrazione @astrojs/sitemap). Enumera le rotte statiche + i post non in bozza.
export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://leonardopegollo.dev')).toString().replace(/\/$/, '');

  const posts = (await getCollection('blog')).filter((p) => !p.data.draft);

  const urls: { loc: string; lastmod?: string }[] = [
    { loc: `${base}/` },
    { loc: `${base}/about` },
    { loc: `${base}/mediflow` },
    { loc: `${base}/blog` },
    ...posts.map((p) => ({
      loc: `${base}/blog/${p.id}`,
      lastmod: (p.data.updatedDate ?? p.data.pubDate).toISOString().slice(0, 10),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
