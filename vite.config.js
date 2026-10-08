import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
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
