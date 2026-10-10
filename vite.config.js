import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

function siteContentPersistencePlugin() {
  return {
    name: 'site-content-persistence',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method === 'POST' && req.url === '/api/save-content') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const filePath = path.resolve(process.cwd(), 'public/loops-site-content.json');
              fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, message: 'Đã lưu vĩnh viễn vào public/loops-site-content.json' }));
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        if (req.method === 'POST' && req.url === '/api/upload-media') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const { filename, base64Data, subDir = 'assets' } = JSON.parse(body);
              if (!filename || !base64Data) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Thiếu filename hoặc base64Data' }));
                return;
              }
              const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
              const buffer = Buffer.from(cleanBase64, 'base64');
              const targetDir = path.resolve(process.cwd(), 'public', subDir);
              if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
              }
              const targetFilePath = path.join(targetDir, filename);
              fs.writeFileSync(targetFilePath, buffer);
              const publicUrl = `/${subDir}/${filename}`;
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, url: publicUrl, filename }));
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), siteContentPersistencePlugin()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        websiteDesign: fileURLToPath(new URL('./services/website-design/index.html', import.meta.url)),
        websiteRental: fileURLToPath(new URL('./services/website-rental/index.html', import.meta.url)),
        pricing: fileURLToPath(new URL('./pricing/index.html', import.meta.url)),
      },
    },
  },
});

