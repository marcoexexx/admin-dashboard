import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // @ts-ignore  for testing
  test: {
    environment: "jsdom"
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },

  server: {
    https: {
      key: "./key.pem",
      cert: "./cert.pem"
    }
  }
})
