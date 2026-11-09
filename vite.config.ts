import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { remoteHubPlugin } from './server/remoteHub';

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

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&bull;/g, '•')
    .replace(/&middot;/g, '·')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '…')
    .replace(/&#(\d+);/g, (_, dec) => {
      try { return String.fromCharCode(Number(dec)); } catch { return ''; }
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      try { return String.fromCharCode(parseInt(hex, 16)); } catch { return ''; }
    });
}

function fullyDecodeHtml(str: string): string {
  if (!str) return '';
  let prev = str;
  let curr = decodeHtmlEntities(str);
  while (curr !== prev && curr.includes('&')) {
    prev = curr;
    curr = decodeHtmlEntities(curr);
  }
  return curr;
}

function parseNewsSnippet(rawSnippet: string, mainTitle: string, source: string): string {
  if (!rawSnippet) return '';
  let text = rawSnippet.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  text = fullyDecodeHtml(text);

  // Check for Google News <ol>/<li> structure
  const liMatches = text.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
  if (liMatches.length > 0) {
    const stories = liMatches.map(li => {
      const aMatch = li.match(/<a[^>]*>([\s\S]*?)<\/a>/i);
      const fontMatch = li.match(/<font[^>]*>([\s\S]*?)<\/font>/i);
      const t = aMatch ? fullyDecodeHtml(aMatch[1].replace(/<[^>]+>/g, '').trim()) : '';
      const s = fontMatch ? fullyDecodeHtml(fontMatch[1].replace(/<[^>]+>/g, '').trim()) : '';
      return { title: t, source: s };
    }).filter(s => s.title);

    const related = stories.filter(s => {
      const mt = (mainTitle || '').toLowerCase();
      const st = s.title.toLowerCase();
      return !mt.includes(st) && !st.includes(mt);
    });

    if (related.length > 0) {
      return related.map(r => r.source ? `${r.title} (${r.source})` : r.title).join(' • ');
    } else if (stories.length > 0) {
      const first = stories[0];
      const mt = (mainTitle || '').toLowerCase();
      if (!mt.includes(first.title.toLowerCase())) {
        return first.source ? `${first.title} (${first.source})` : first.title;
      }
    }
  }

  // General HTML: strip style, script, and tags
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
             .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
             .replace(/<[^>]+>/g, ' ');

  text = fullyDecodeHtml(text).replace(/\s+/g, ' ').trim();

  // If text is empty or just duplicate title
  if (!text || text.toLowerCase() === (mainTitle || '').toLowerCase()) {
    return source ? `Reporting and editorial coverage from ${source}.` : '';
  }

  return text;
}

function newsServerPlugin(): Plugin {
  return {
    name: 'news-server',
    configureServer(server) {
      server.middlewares.use('/api/news', async (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405;
          res.end();
          return;
        }

        try {
          const feedUrl = 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en';
          const response = await fetch(feedUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            },
            signal: AbortSignal.timeout(5000),
          });

          if (!response.ok) throw new Error(`RSS feed returned ${response.status}`);
          const xmlText = await response.text();

          const items: Array<{ title: string; source: string; time: string; url: string; snippet: string; summary: string }> = [];
          const itemRegex = /<item>[\s\S]*?<\/item>/g;
          const matches = xmlText.match(itemRegex) || [];

          for (const match of matches.slice(0, 40)) {
            const titleMatch = match.match(/<title>(.*?)<\/title>/);
            const linkMatch = match.match(/<link>(.*?)<\/link>/);
            const pubDateMatch = match.match(/<pubDate>(.*?)<\/pubDate>/);
            const sourceMatch = match.match(/<source[^>]*>(.*?)<\/source>/);
            const descMatch = match.match(/<description>([\s\S]*?)<\/description>/);

            if (titleMatch) {
              let rawTitle = titleMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
              let rawSource = sourceMatch ? sourceMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') : 'News Feed';

              let fullTitle = fullyDecodeHtml(rawTitle.trim());
              let source = fullyDecodeHtml(rawSource.trim());

              if (fullTitle.includes(' - ')) {
                const parts = fullTitle.split(' - ');
                source = parts.pop()?.trim() || source;
                fullTitle = parts.join(' - ').trim();
              }

              const rawDesc = descMatch ? descMatch[1] : '';
              const snippet = parseNewsSnippet(rawDesc, fullTitle, source);

              items.push({
                title: fullTitle,
                source: source,
                time: pubDateMatch ? pubDateMatch[1] : new Date().toISOString(),
                url: linkMatch ? linkMatch[1] : '',
                snippet,
                summary: snippet,
              });
            }
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(items));
        } catch (e) {
          // If network fetch fails, return empty array so client falls back gracefully
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify([]));
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
    remoteHubPlugin(),
    newsServerPlugin(),
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
