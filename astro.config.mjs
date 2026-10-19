import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://akkyey.pages.dev',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
