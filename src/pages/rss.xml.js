import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog')).filter((p) => !p.data.draft);
  return rss({
    title: 'leonardopegollo.dev · Blog',
    description: 'Note di lavoro su sanità pubblica, dati, software clinico locale.',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.slug}/`,
      })),
    customData: '<language>it-it</language>',
  });
}
