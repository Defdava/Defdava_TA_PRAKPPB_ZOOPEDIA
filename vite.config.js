// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      manifest: {
        name: 'Zoopedia Indonesia',
        short_name: 'Zoopedia',
        description: 'Edukasi & Konservasi Satwa Liar Indonesia',
        theme_color: '#dc2626',
        background_color: '#fef3c7',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,woff2,ttf}'],
        cleanupOutdatedCaches: true
      }
    })
  ],

  base: '/',
  build: {
    outDir: 'dist'
  }
})