import { defineConfig } from 'vite';
// import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    // PWA 플러그인은 빌드 시에만 활성화 (개발 중 캐싱 문제 방지)
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   manifest: false,
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/.*\.tile\.openstreetmap\.org\/.*/,
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'osm-tiles',
    //           expiration: {
    //             maxEntries: 1000,
    //             maxAgeSeconds: 60 * 60 * 24 * 30,
    //           },
    //         },
    //       },
    //     ],
    //   },
    // }),
  ],
});
