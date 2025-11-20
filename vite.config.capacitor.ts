import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/', // <--- THIS IS THE KEY FIX
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/runes/*.jpg'],
      manifest: {
        name: 'Runic Counter',
        short_name: 'Runic Counter',
        start_url: '/', // <--- AND THIS
        display: 'standalone',
        background_color: '#0A1428',
        theme_color: '#0A1428',
        orientation: 'portrait',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})