import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Ensure environment variables are properly bundled
    envDir: '.',
    sourcemap: true, // Enable sourcemap for debugging
  },
  server: {
    host: true, // Allow external connections for development
  }
})
