// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/statusline.ts',
      formats: ['es'],
      fileName: (format) => `statusline.js`
    },
    rollupOptions: {
      external: ['child_process', 'fs', 'util', 'path'],
      output: {
        banner: '#!/usr/bin/env node',
      }
    },
    outDir: 'dist',
    target: 'node22',
  },
});