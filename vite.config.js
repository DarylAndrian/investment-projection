import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname)
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          chartjs: ['chart.js'],
          primevue: ['primevue']
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
