import https from 'https'
import http from 'http'
import { URL } from 'url'

const BACKEND_BASE_URL = process.env.BACKEND_API_URL || 'https://103.249.198.43:8090'

// Create HTTPS agent that permits self-signed certificates for upstream backend
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true
})

export async function proxyRequest(req, res, targetPath = null) {
  // Add CORS headers so requests from any client domain work seamlessly
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const rawPath = targetPath || req.url || '/api/Plans'
    const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`
    const targetUrl = new URL(cleanPath, BACKEND_BASE_URL)

    const isHttps = targetUrl.protocol === 'https:'
    const client = isHttps ? https : http

    const headers = {
      'Accept': req.headers['accept'] || 'application/json',
      'Content-Type': req.headers['content-type'] || 'application/json'
    }

    if (req.headers['authorization']) {
      headers['Authorization'] = req.headers['authorization']
    }

    const options = {
      method: req.method,
      agent: isHttps ? httpsAgent : undefined,
      headers
    }

    await new Promise((resolve, reject) => {
      const proxyReq = client.request(targetUrl, options, (proxyRes) => {
        const code = proxyRes.statusCode || 200
        if (typeof res.status === 'function') {
          res.status(code)
        } else {
          res.statusCode = code
        }

        for (const [key, value] of Object.entries(proxyRes.headers)) {
          const lower = key.toLowerCase()
          if (
            lower !== 'transfer-encoding' &&
            lower !== 'content-encoding' &&
            lower !== 'connection'
          ) {
            res.setHeader(key, value)
          }
        }

        proxyRes.pipe(res)
        proxyRes.on('end', resolve)
        proxyRes.on('error', reject)
      })

      proxyReq.on('error', (err) => {
        reject(err)
      })

      // Send request body if provided (for POST / PUT / PATCH)
      if (req.body) {
        const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
        proxyReq.write(payload)
      } else if (req.readable) {
        req.pipe(proxyReq)
        return
      }

      proxyReq.end()
    })
  } catch (error) {
    console.error('Backend proxy error:', error)
    if (!res.headersSent) {
      const errPayload = JSON.stringify({
        error: 'Backend Connection Error',
        message: error.message || 'Unable to connect to backend server',
        target: BACKEND_BASE_URL
      })
      if (typeof res.status === 'function') {
        res.status(502)
      } else {
        res.statusCode = 502
      }
      res.setHeader('Content-Type', 'application/json')
      res.end(errPayload)
    }
  }
}
