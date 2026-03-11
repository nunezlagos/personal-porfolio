import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  output: 'server',
  server: { port: 3333 },
  // En local (npm run dev) usamos Node para que el admin pueda guardar en src/data/*.json.
  // En build (npm run build) usamos Cloudflare para el deploy.
  adapter: isDev
    ? node({ mode: 'standalone' })
    : cloudflare({
        platformProxy: { enabled: true },
        imageService: 'passthrough',
      }),
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
});
