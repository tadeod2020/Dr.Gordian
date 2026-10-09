import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
// `npm run build`         -> versión web normal (Vercel)
// `npm run build:offline` -> versión local sin internet (un solo HTML autocontenido)
export default defineConfig(({ mode }) => {
  const isOffline = mode === 'offline'
  return {
    base: './',
    plugins: isOffline ? [react(), tailwindcss(), viteSingleFile()] : [react(), tailwindcss()],
    build: isOffline ? { outDir: 'dist-offline', emptyOutDir: true } : undefined,
  }
})
