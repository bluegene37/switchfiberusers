import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Automatically load variables from .env and .env.local into process.env in local dev
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: 3000,
      host: true,
      proxy: {
        // Mirrors the production Vercel functions in api/. The upstream box
        // serves a self-signed certificate, hence secure: false.
        '/api': {
          target: process.env.BACKEND_API_URL || 'https://103.249.198.43:8090',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
