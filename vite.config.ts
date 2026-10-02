import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';
import { handleApiRequest } from './server/api-handler.ts';

function apiMiddlewarePlugin(): Plugin {
  return {
    name: 'ttpvhcc-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          if (req.url && (req.url.startsWith('/api/') || req.url === '/api')) {
            const handled = await handleApiRequest(req, res);
            if (handled) return;
          }
        } catch (err) {
          console.error('API middleware error:', err);
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiMiddlewarePlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('.', import.meta.url)),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
