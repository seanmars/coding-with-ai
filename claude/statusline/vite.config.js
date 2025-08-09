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
      external: ['child_process', 'fs', 'util'],
      output: {
        banner: '#!/usr/bin/env node',
      }
    },
    outDir: 'dist',
    target: 'node22',
  },
});