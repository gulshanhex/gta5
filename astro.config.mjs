import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Astro configuration for Cloudflare Workers with Static Assets in public/
// Uses zero D1 and zero R2 bindings — all .glb 3D models & textures are served via Workers Static Assets.
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
    platformProxy: {
      enabled: true,
    },
  }),
  vite: {
    build: {
      target: 'es2022',
      assetsInlineLimit: 0,
    },
  },
});
