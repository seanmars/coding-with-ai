// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/ccstatusline.ts',
      formats: ['es'],
      fileName: (format) => `ccstatusline.js`
    },
    rollupOptions: {
      external: [],
    },
    outDir: 'dist',
  },
});