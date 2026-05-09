import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default {
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version)
  },
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'KneeFit',
        short_name: 'KneeFit',
        description: 'Knee rehabilitation exercise and pain tracker',
        theme_color: '#0d1b2a',
        background_color: '#0d1b2a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/kneefit-v2/',
        scope: '/kneefit-v2/',
        icons: [
          { src: '/kneefit-v2/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/kneefit-v2/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        navigateFallback: '/kneefit-v2/',
        navigateFallbackAllowlist: [/^\/kneefit-v2\//]
      },
      devOptions: { enabled: false }
    })
  ]
};
