import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    proxy: {
      '/user': {  // 👈 Proxy all requests starting with '/user'
        target: 'http://localhost:8000',  // Your Django backend
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
