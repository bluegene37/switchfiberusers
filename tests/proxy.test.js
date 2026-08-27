import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { proxyRequest } from '../api/_proxy.js'

function createMockRes() {
  const headers = {}
  const res = {
    headers,
    statusCode: 200,
    body: '',
    ended: false,
    setHeader(name, val) {
      headers[name.toLowerCase()] = val
    },
    status(code) {
      this.statusCode = code
      return this
    },
    end(payload) {
      if (payload) this.body = payload
      this.ended = true
    },
    json(payload) {
      headers['content-type'] = 'application/json'
      this.body = JSON.stringify(payload)
      this.ended = true
    }
  }
  return res
}

describe('Serverless Backend Proxy (api/_proxy.js)', () => {
  it('handles OPTIONS preflight with 204 status and Allow header', async () => {
    const req = { method: 'OPTIONS', url: '/api/Plans' }
    const res = createMockRes()

    await proxyRequest(req, res, '/api/Plans')

    assert.equal(res.statusCode, 204)
    assert.equal(res.headers['allow'], 'GET, POST, OPTIONS')
    assert.equal(res.headers['cache-control'], 'no-store')
    assert.equal(res.headers['vary'], 'Origin')
  })

  it('rejects disallowed routes with 404', async () => {
    const req = { method: 'GET', url: '/api/SecretInternalEndpoint' }
    const res = createMockRes()

    await proxyRequest(req, res, '/api/SecretInternalEndpoint')

    assert.equal(res.statusCode, 404)
    const json = JSON.parse(res.body)
    assert.equal(json.error, 'Not Found')
  })

  it('rejects disallowed HTTP methods with 405 Method Not Allowed', async () => {
    // /api/Plans only allows GET
    const req = { method: 'DELETE', url: '/api/Plans' }
    const res = createMockRes()

    await proxyRequest(req, res, '/api/Plans')

    assert.equal(res.statusCode, 405)
    assert.equal(res.headers['allow'], 'GET, OPTIONS')
    const json = JSON.parse(res.body)
    assert.equal(json.error, 'Method Not Allowed')
  })

  it('enforces route method restrictions on /api/Applications', async () => {
    // /api/Applications only allows POST
    const req = { method: 'GET', url: '/api/Applications' }
    const res = createMockRes()

    await proxyRequest(req, res, '/api/Applications')

    assert.equal(res.statusCode, 405)
    assert.equal(res.headers['allow'], 'POST, OPTIONS')
  })
})
