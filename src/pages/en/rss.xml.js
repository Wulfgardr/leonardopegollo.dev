import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog')).filter((post) => !post.data.draft && post.data.lang === 'en');
  return rss({
    title: 'leonardopegollo.dev · Notes',
    description: 'Working notes on public health, data and local clinical software.',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/en/blog/${post.id}/`,
      })),
    customData: '<language>en-gb</language>',
  });
}
