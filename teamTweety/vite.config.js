import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend server
        changeOrigin: true, // Change the origin of the request
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Rewrite paths if needed
      },
    },
  },
});
