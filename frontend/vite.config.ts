import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const target = process.env.BACKEND_URL ?? 'http://localhost:4000'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      },
      manifest: {
        short_name: 'Cookbook',
        name: 'Cookbook',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '48x48 32x32 16x16',
            type: 'image/x-icon',
          },
          {
            src: 'logo192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: 'logo512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
        start_url: '.',
        display: 'standalone',
        theme_color: '#000000',
        background_color: '#ffffff',
      },
    }),
  ],
  base: './',
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/graphql': {
        target,
        changeOrigin: true,
      },
    },
  },
})
