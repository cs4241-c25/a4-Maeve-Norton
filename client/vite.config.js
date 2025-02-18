import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://a4-maeve-norton.glitch.me',
    },
  },
  build: {
    outDir: 'dist',
  },
})
