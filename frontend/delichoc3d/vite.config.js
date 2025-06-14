// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],

  // Let “@/…” resolve to /src/…
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  // Dev-server defaults (optional tweaks)
  server: {
    port: 5173,    // vite dev server port
    open: true     // open browser on `npm run dev`
  },

  // Build options (leave defaults unless you need tweaks)
  build: {
    outDir: 'dist',   // output folder
    sourcemap: false  // set true if you want source-maps
  }
});
