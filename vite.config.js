import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,      // Forces Vite to always use port 5173
    strictPort: true // Tells Vite to fail/stop if 5173 is busy rather than randomly shifting to 5174
  }
})