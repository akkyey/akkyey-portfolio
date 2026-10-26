import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://akkyey.dev',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
