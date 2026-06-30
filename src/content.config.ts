// Definizione della collezione "blog" (Content Layer API, Astro 6+).
// I post markdown restano in src/content/blog/; il glob loader li enumera.
// Nota: con il glob loader l'identificatore della voce è `entry.id`
// (filename senza estensione), che per i nostri file "YYYY-MM-DD-slug.md"
// coincide con il vecchio `entry.slug` — gli URL /blog/<slug>/ non cambiano.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(120),
    description: z.string().max(220),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
