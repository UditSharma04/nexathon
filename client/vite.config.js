import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://sharehub-q3oi.onrender.com',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ['leaflet', 'react-leaflet'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
