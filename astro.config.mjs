import { defineConfig } from 'astro/config';
// import sitemap from '@astrojs/sitemap';
// Sitemap temporaneamente disabilitato: bug noto in @astrojs/sitemap@3.2.x con Astro 4
// (Cannot read properties of undefined reading 'reduce').
// Si riattiva quando si aggiorna a @astrojs/sitemap@^3.5.0.

// https://astro.build/config
export default defineConfig({
  // Sostituisci con il tuo dominio quando l'avrai registrato.
  // Se cambia, l'unico file da modificare è questo.
  site: 'https://leonardopegollo.dev',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [
    // sitemap({
    //   changefreq: 'monthly',
    //   priority: 0.7,
    // }),
  ],
});
