import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If VITE_API_BASE_URL points to obsolete local port 8000, clear it
if (process.env.VITE_API_BASE_URL && process.env.VITE_API_BASE_URL.includes('8000')) {
  process.env.VITE_API_BASE_URL = '';
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  }
})
