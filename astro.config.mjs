import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Sostituisci con il tuo dominio quando l'avrai registrato.
  // Se cambia, l'unico file da modificare è questo.
  site: 'https://leonardopegollo.dev',
  trailingSlash: 'ignore',
  // Precarica i link interni al passaggio del mouse: con le ViewTransitions già
  // attive, la navigazione secondaria risulta praticamente istantanea.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  build: {
    inlineStylesheets: 'auto',
  },
  // Nota: @astrojs/sitemap@3.7.2 va ancora in crash con questa versione di Astro
  // ("Cannot read properties of undefined (reading 'reduce')" in astro:build:done).
  // La sitemap è generata da src/pages/sitemap.xml.ts, sotto il nostro controllo.
  integrations: [],
});
