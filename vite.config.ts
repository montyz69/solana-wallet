import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import vercel from 'vite-plugin-vercel';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills(),tailwindcss(), vercel()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define : {
    __APP_ENV__: process.env.VITE_VERCEL_ENV,
  }
})
