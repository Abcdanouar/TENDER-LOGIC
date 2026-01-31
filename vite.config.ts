
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
    // Specifically define the API_KEY to avoid passing the entire process.env object
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});
