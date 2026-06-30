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
  // La sitemap è generata a mano da src/pages/sitemap.xml.ts, così le rotte
  // restano sotto il nostro controllo: nessuna integrazione @astrojs/sitemap.
  integrations: [],
});
