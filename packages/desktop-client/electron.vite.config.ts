import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    root: 'src/renderer',
    base: '/',
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer'),
        '@app': resolve('src/renderer/app'),
        '@pages': resolve('src/renderer/pages'),
        '@widgets': resolve('src/renderer/widgets'),
        '@features': resolve('src/renderer/features'),
        '@entities': resolve('src/renderer/entities'),
        '@shared': resolve('src/renderer/shared')
      }
    },
    plugins: [react()]
  }
})
