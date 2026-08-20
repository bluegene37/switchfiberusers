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
        // Mirrors the notification Vercel functions (api/send-confirmation.js,
        // api/send-sms.js) in local dev. Registered as plugin middleware so it
        // runs before the /api proxy — these routes must never be forwarded to
        // the fiber backend.
        name: 'notification-dev-middleware',
        configureServer(server) {
          const routes = {
            '/api/send-confirmation': async (data) =>
              (await import('./api/send-confirmation.js')).sendConfirmationEmail(data),
            '/api/send-sms': async (data) =>
              (await import('./api/send-sms.js')).sendConfirmationSms(data)
          }

          server.middlewares.use(async (req, res, next) => {
            const cleanUrl = req.url?.split('?')[0]
            const route = routes[cleanUrl]
            if (!route) return next()
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Method Not Allowed. Use POST.' }))
              return
            }

            let body = ''
            req.on('data', chunk => {
              body += chunk
              if (body.length > 64 * 1024) req.destroy()
            })
            req.on('end', async () => {
              try {
                const data = JSON.parse(body || '{}')
                const result = await route(data)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(result))
              } catch (err) {
                console.error(`[${cleanUrl} dev]:`, err)
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Dispatch failed.' }))
              }
            })
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
