// vite.config.js ← COPY-PASTE INI 100%, JANGAN DIUBAH LAGI!
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      // Manifest PWA
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
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },

      // WORKBOX — INI YANG BIKIN 100% OFFLINE (API + GAMBAR SUPABASE)
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,woff2,ttf,json}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,

        runtimeCaching: [
          // 1. SEMUA REQUEST KE SUPABASE (API + STORAGE) → DI-CACHE DULUAN!
          {
            urlPattern: ({ url }) => url.hostname === 'oidlzdozlailawmngruv.supabase.co',
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-all', // API + gambar storage masuk sini semua
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 tahun
              },
              cacheableResponse: {
                statuses: [0, 200, 204], // 0 = opaque (wajib untuk Supabase!)
              },
            },
          },

          // 2. Double protection untuk gambar (biar pasti masuk cache)
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 2000,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },

          // 3. Halaman navigasi (biar SPA tetap jalan offline)
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],

  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})