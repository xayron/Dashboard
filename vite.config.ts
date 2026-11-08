import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function localPhotoServerPlugin(): Plugin {
  return {
    name: 'local-photo-server',
    configureServer(server) {
      server.middlewares.use('/api/photos', (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405;
          res.end();
          return;
        }

        const photosDir = path.resolve(__dirname, 'public/photos');
        if (!fs.existsSync(photosDir)) {
          fs.mkdirSync(photosDir, { recursive: true });
        }

        const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];
        try {
          const files = fs.readdirSync(photosDir).filter(file => {
            const ext = path.extname(file).toLowerCase();
            return validExts.includes(ext) && !file.startsWith('.');
          });

          const photos = files.map((file, i) => {
            const name = path.basename(file, path.extname(file));
            return {
              id: `local-${i}-${file}`,
              url: `/photos/${encodeURIComponent(file)}`,
              title: name.replace(/[-_]/g, ' '),
              location: 'Local Media Share',
              aspectRatio: 1.6,
              orientation: 'landscape',
              credit: 'Local Storage',
            };
          });

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(photos));
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(e) }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localPhotoServerPlugin(),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0', // accessible on local network for kiosk display
    proxy: {
      '/api/finance': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/finance/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        },
      },
    },
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
  },
});
