import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(new URL('index.html', import.meta.url).pathname),
      },
    },
  },
  // Ensure public directory files are served correctly
  publicDir: 'public',
});
