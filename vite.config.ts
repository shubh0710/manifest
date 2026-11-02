import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // The server has its own tests, run from the server folder
    exclude: [...configDefaults.exclude, 'server/**'],
  },
})