import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/products/all': {
        target: 'http://192.168.1.239:5555',
        changeOrigin: true,
      }
    }
  },
})
