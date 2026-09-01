import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const vercelConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../vercel.json'), 'utf8')
)

// Vercel applies vercel.json rewrites after the filesystem check (static files
// and exact-path functions) but BEFORE dynamic function routes such as
// api/Applications/[id].js. A bare "/(.*)" SPA fallback therefore swallows
// every /api path that has no exact file behind it, and the tracker lookup
// GET /api/Applications/:id silently returns index.html instead of JSON.
const spaFallback = (vercelConfig.rewrites || []).find(
  (rule) => rule.destination === '/index.html'
)

describe('Vercel Routing (vercel.json)', () => {
  it('declares a SPA fallback rewrite to /index.html', () => {
    assert.ok(spaFallback, 'No rewrite with destination /index.html found')
  })

  it('does not let the SPA fallback swallow API function routes', () => {
    const fallbackPattern = new RegExp(`^${spaFallback.source}$`)

    const apiPaths = [
      '/api/Plans',
      '/api/Applications',
      '/api/Applications/2026-8942',
      '/api/Applications/SF-2026-8942',
      '/api/LCPNapLocations',
      '/api/send-confirmation',
      '/api/send-sms'
    ]

    for (const apiPath of apiPaths) {
      assert.equal(
        fallbackPattern.test(apiPath),
        false,
        `SPA fallback "${spaFallback.source}" must not match ${apiPath}`
      )
    }
  })

  it('still serves the SPA shell for client-side routes', () => {
    const fallbackPattern = new RegExp(`^${spaFallback.source}$`)

    const spaPaths = ['/', '/status', '/register', '/plans', '/help', '/apidocs']

    for (const spaPath of spaPaths) {
      assert.equal(
        fallbackPattern.test(spaPath),
        true,
        `SPA fallback "${spaFallback.source}" must match ${spaPath}`
      )
    }
  })

  it('keeps API responses uncacheable', () => {
    const apiHeaders = (vercelConfig.headers || []).find((h) =>
      h.source.startsWith('/api')
    )
    assert.ok(apiHeaders, 'No /api header rule found')
    assert.ok(
      apiHeaders.headers.some(
        (h) => h.key === 'Cache-Control' && h.value === 'no-store'
      ),
      'API responses must be sent with Cache-Control: no-store'
    )
  })
})
