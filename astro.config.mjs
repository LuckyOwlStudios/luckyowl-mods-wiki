import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeBase from './src/rehype-base.mjs';

// SITE_URL / BASE_PATH are set by the GitHub Pages workflow. With a custom domain,
// set SITE_URL to it (e.g. https://wiki.example.com) and leave BASE_PATH as "/".
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site: process.env.SITE_URL || 'https://luckyowlstudios.github.io',
  base,
  trailingSlash: 'always',
  // sitemap-index.xml for search engines (pages marked noindex are left out)
  integrations: [sitemap({ filter: (page) => !/\/(search|404)\/?$/.test(page) })],
  markdown: { rehypePlugins: [rehypeBase(base)] },
});
