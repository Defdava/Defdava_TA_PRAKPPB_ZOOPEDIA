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

      // Manifest PWA (icon, nama, warna, dll)
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

      // WORKBOX – Ini yang bikin bisa OFFLINE 100%
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,woff2,ttf,woff,json}'],
        cleanupOutdatedCaches: true,

        // MAGIC DI SINI: Cache semua request ke Supabase (API + Storage)
        runtimeCaching: [
          // 1. Cache semua API Supabase (REST + Storage metadata)
          {
            urlPattern: ({ url }) => url.origin === 'https://oidlzdozlailawmngruv.supabase.co',
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari
              },
              cacheableResponse: {
                statuses: [0, 200] // 0 = opaque response (Supabase biasanya begini)
              }
            }
          },

          // 2. Cache semua gambar (dari Supabase Storage atau CDN)
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 tahun
              }
            }
          },

          // 3. Cache halaman HTML (untuk navigasi offline)
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache'
            }
          }
        ]
      }
    })
  ],

  base: '/',
  build: {
    outDir: 'dist'
  }
})