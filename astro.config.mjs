import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://akkyey-portfolio.akkyey.workers.dev',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
