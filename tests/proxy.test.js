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

describe('LCPNapLocations sanitization', () => {
  const validRow = {
    id: 1503,
    lcpnap: 'CAR LCP 001 NAP 001',
    lcp: 'CAR LCP 001',
    nap: 'NAP 001',
    portTotal: 16,
    coordinates: '14.480371, 121.221994',
    street: 'Hill Domingo',
    barangay: '63',
    city: 'Cardona',
    modifiedBy: 'techhead.isp@switchfiber.ph',
    userEmail: 'techhead.isp@switchfiber.ph',
    image: 'LCP NAP Location_Images/x.jpg',
    image2: 'LCP NAP Location_Images/y.jpg',
    readingImage: 'LCP NAP Location_Images/z.jpg',
    modifiedDate: null,
    region: null
  }

  it('strips staff emails and internal file paths from rows', async () => {
    const { sanitizeNapLocations } = await import('../api/LCPNapLocations.js')
    const [row] = sanitizeNapLocations([validRow])
    assert.ok(row)
    assert.equal(row.lcpnap, 'CAR LCP 001 NAP 001')
    assert.equal(row.coordinates, '14.480371, 121.221994')
    assert.equal(row.userEmail, undefined)
    assert.equal(row.modifiedBy, undefined)
    assert.equal(row.image, undefined)
    assert.equal(row.image2, undefined)
    assert.equal(row.readingImage, undefined)
  })

  it('drops rows with blank, zero or out-of-area coordinates', async () => {
    const { sanitizeNapLocations } = await import('../api/LCPNapLocations.js')
    const rows = sanitizeNapLocations([
      validRow,
      { ...validRow, id: 2, coordinates: '' },
      { ...validRow, id: 3, coordinates: '0, 0' },
      { ...validRow, id: 4, coordinates: 'not-a-coordinate' },
      { ...validRow, id: 5, coordinates: '48.8584, 2.2945' },
      null
    ])
    assert.equal(rows.length, 1)
    assert.equal(rows[0].id, 1503)
  })

  it('returns an empty list when upstream payload is not an array', async () => {
    const { sanitizeNapLocations } = await import('../api/LCPNapLocations.js')
    assert.deepEqual(sanitizeNapLocations({ error: 'oops' }), [])
  })
})
