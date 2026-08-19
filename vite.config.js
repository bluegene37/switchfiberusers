import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Automatically load variables from .env and .env.local into process.env in local dev
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [
      vue(),
      {
        name: 'send-confirmation-dev-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const cleanUrl = req.url?.split('?')[0]
            if (cleanUrl === '/api/send-confirmation' && req.method === 'POST') {
              let body = ''
              req.on('data', chunk => { body += chunk })
              req.on('end', async () => {
                try {
                  const data = JSON.parse(body || '{}')
                  const { sendConfirmationEmail } = await import('./api/send-confirmation.js')
                  const result = await sendConfirmationEmail(data)
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(result))
                } catch (err) {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: err.message }))
                }
              })
              return
            }
            next()
          })
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: process.env.BACKEND_API_URL || 'https://103.249.198.43:8090',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
