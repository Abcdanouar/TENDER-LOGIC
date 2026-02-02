
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true,
    // زيادة الحد لتجنب تحذير "Some chunks are larger than 500 kB"
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // تقسيم المكتبات الكبيرة (مثل Recharts و Gemini SDK) في ملفات منفصلة لتحسين الأداء
        manualChunks: {
          vendor: ['react', 'react-dom', 'recharts', '@google/genai', 'dexie'],
        },
      },
    },
  },
  server: {
    port: 3000
  },
  define: {
    // تمرير مفتاح API من Vercel إلى المتصفح
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});
