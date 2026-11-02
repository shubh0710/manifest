import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // While developing, send /api requests to the Manifest server on port 3000
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  test: {
    // The server has its own tests, run from the server folder
    exclude: [...configDefaults.exclude, 'server/**'],
  },
})