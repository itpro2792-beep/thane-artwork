// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';

// Set STATIC_BUILD=true to produce a static site for deployment
// e.g.: STATIC_BUILD=true npx astro build
const isStaticBuild = process.env.STATIC_BUILD === 'true';

// https://astro.build/config
export default defineConfig({
  output: isStaticBuild ? 'static' : 'server',
  ...(isStaticBuild ? {} : {
    adapter: node({ mode: 'standalone' })
  }),
  server: { host: true },

  vite: {
    preview: {
      allowedHosts: ['.trycloudflare.com', 'localhost']
    }
  },

  integrations: isStaticBuild
    ? [react(), markdoc()]
    : [react(), markdoc(), keystatic()]
});