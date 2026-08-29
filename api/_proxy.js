import https from 'https'
import http from 'http'
import { URL } from 'url'

const BACKEND_BASE_URL = process.env.BACKEND_API_URL || 'https://103.249.198.50:8090'

// Only the two routes the public site actually calls. Without this allowlist
// the function is an unauthenticated relay into the internal API — anyone
// could reach any upstream path (including reads of applicant records).
const ALLOWED_ROUTES = {
  '/api/Plans': ['GET'],
  '/api/Applications': ['POST']
}

// Upstream serves a self-signed certificate.
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true
})

const UPSTREAM_TIMEOUT_MS = 45000
const MAX_BODY_BYTES = 256 * 1024

function sendJson(res, code, payload) {
  if (res.headersSent) return
  if (typeof res.status === 'function') res.status(code)
  else res.statusCode = code
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

export async function proxyRequest(req, res, targetPath = null) {
  // The SPA and these functions share an origin, so no cross-origin grant is
  // needed. A previous build sent Access-Control-Allow-Origin: * , which let
  // any site on the internet post applications through this endpoint.
  res.setHeader('Vary', 'Origin')
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, POST, OPTIONS')
    if (typeof res.status === 'function') res.status(204)
    else res.statusCode = 204
    res.end()
    return
  }

  const rawPath = targetPath || req.url || '/api/Plans'
  const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`
  const routeKey = cleanPath.split('?')[0].replace(/\/+$/, '') || '/'

  const allowedMethods = ALLOWED_ROUTES[routeKey]
  if (!allowedMethods) {
    sendJson(res, 404, { error: 'Not Found' })
    return
  }
  if (!allowedMethods.includes(req.method)) {
    res.setHeader('Allow', allowedMethods.concat('OPTIONS').join(', '))
    sendJson(res, 405, { error: 'Method Not Allowed' })
    return
  }

  try {
    const targetUrl = new URL(cleanPath, BACKEND_BASE_URL)
    const isHttps = targetUrl.protocol === 'https:'
    const client = isHttps ? https : http

    // Build the outbound body up front so Content-Length is always accurate.
    let payload = null
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (typeof req.body === 'string') {
        payload = req.body
      } else if (req.body && typeof req.body === 'object') {
        payload = JSON.stringify(req.body)
      } else {
        payload = await readRequestBody(req)
      }
      if (payload && Buffer.byteLength(payload) > MAX_BODY_BYTES) {
        sendJson(res, 413, {
          error: 'Payload Too Large',
          message: 'The application data exceeded the size this endpoint accepts.'
        })
        return
      }
    }

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (payload !== null) {
      headers['Content-Length'] = Buffer.byteLength(payload)
    }

    const upstream = await new Promise((resolve, reject) => {
      const proxyReq = client.request(
        targetUrl,
        { method: req.method, agent: isHttps ? httpsAgent : undefined, headers },
        (proxyRes) => {
          const chunks = []
          proxyRes.on('data', (c) => chunks.push(c))
          proxyRes.on('end', () =>
            resolve({
              status: proxyRes.statusCode || 502,
              contentType: proxyRes.headers['content-type'] || 'application/json',
              body: Buffer.concat(chunks).toString('utf8')
            })
          )
          proxyRes.on('error', reject)
        }
      )

      proxyReq.setTimeout(UPSTREAM_TIMEOUT_MS, () => {
        proxyReq.destroy(new Error(`Upstream did not respond within ${UPSTREAM_TIMEOUT_MS}ms`))
      })
      proxyReq.on('error', reject)

      if (payload !== null) proxyReq.write(payload)
      proxyReq.end()
    })

    if (upstream.status >= 500) {
      // Upstream 500s carry raw EF Core / SQL Server stack traces naming the
      // database, tables and columns. Log them, but do not hand them to a
      // browser on a public site.
      console.error(
        `Backend ${upstream.status} on ${req.method} ${routeKey}: ${upstream.body.slice(0, 4000)}`
      )
      sendJson(res, 502, {
        error: 'Backend Error',
        message: 'Our records system rejected the request. Please try again shortly.'
      })
      return
    }

    if (typeof res.status === 'function') res.status(upstream.status)
    else res.statusCode = upstream.status
    res.setHeader('Content-Type', upstream.contentType)
    res.end(upstream.body)
  } catch (error) {
    console.error(`Backend proxy error on ${req.method} ${routeKey}:`, error)
    sendJson(res, 502, {
      error: 'Backend Connection Error',
      message: 'Unable to reach our records system. Please try again shortly.'
    })
  }
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Request body too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}
