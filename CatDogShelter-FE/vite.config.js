// vite.config.ts / vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // 프론트의 /api → 백엔드로 프록시
      '/user-service': {
        target: 'http://localhost:8000', // ← 스프링 포트에 맞게 수정
        changeOrigin: true,
        // 필요 시 WebSocket 사용하면 ws:true
        // ws: true,
      },
      '/post-service': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
