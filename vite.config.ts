import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true
  },
  server: {
    port: 3000
  },
  define: {
    // يجعل مفتاح API متاحاً في المتصفح عبر process.env.API_KEY
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});