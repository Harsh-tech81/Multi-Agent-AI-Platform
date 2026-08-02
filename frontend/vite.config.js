import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import os from 'node:os'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss()],
  cacheDir: resolve(os.tmpdir(), 'cortex-ai-vite-cache'),
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
})
