import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port:5173,
    proxy: {
      // Everything starting with /api goes to backend in dev
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // Optional: remove /api prefix if your backend doesn't expect it
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});