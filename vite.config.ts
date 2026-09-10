import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        chunkSizeWarningLimit: 800,
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              'vendor-charts': ['recharts'],
              'vendor-icons': ['lucide-react'],
            }
          }
        }
      },
      test: {
        globals: true,
        environment: 'jsdom',
        include: ['**/*.test.{ts,tsx,js}'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/tests/e2e/**']
      }
    };
});
