// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    server: {
        host: true
    },
    vite: {
        server: {
            allowedHosts: ['.trycloudflare.com', 'localhost']
        },
        preview: {
            allowedHosts: ['.trycloudflare.com', 'localhost']
        }
    }
});
