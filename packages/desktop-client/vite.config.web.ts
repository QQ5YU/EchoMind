import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  root: 'src/renderer',
  base: './',
  server: {
    host: true,
    port: 5173,
    hmr: {
      overlay: true
    },
    watch: {
      usePolling: true
    }
  },
  resolve: {
    alias: {
      '@renderer': resolve(__dirname, 'src/renderer'),
      '@app': resolve(__dirname, 'src/renderer/app'),
      '@pages': resolve(__dirname, 'src/renderer/pages'),
      '@features': resolve(__dirname, 'src/renderer/features'),
      '@entities': resolve(__dirname, 'src/renderer/entities'),
      '@widgets': resolve('src/renderer/widgets'),
      '@shared': resolve(__dirname, 'src/renderer/shared')
    }
  },
  plugins: [react()]
})