import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  extractReferenceCode,
  matchesReferenceCode,
  matchesMobileNumber,
  normalizePhMobile,
  isAuthorized
} from '../api/Applications/[id].js'
import handler from '../api/Applications/[id].js'
import { sanitizeApplicationRecord } from '../api/Applications.js'

// A record shaped like the upstream row the proxy receives.
const record = {
  id: 15445,
  firstName: 'Juan',
  lastName: 'Dela Cruz',
  emailAddress: 'juan@example.com',
  mobileNumber: '09171234567',
  installationAddress: '123 Sample St',
  remarks: 'Online Application SF-20260901-161837-42',
  userEmail: 'staff@internal.example',
  governmentValidId: 'https://drive.google.com/private'
}

describe('Tracker Authorization (api/Applications/[id].js)', () => {
  describe('extractReferenceCode', () => {
    it('pulls the reference code out of the upstream remarks field', () => {
      assert.equal(extractReferenceCode(record), 'SF-20260901-161837-42')
    })

    it('returns null when remarks carries no reference code', () => {
      assert.equal(extractReferenceCode({ remarks: 'Walk-in applicant' }), null)
      assert.equal(extractReferenceCode({}), null)
      assert.equal(extractReferenceCode(null), null)
    })
  })

  describe('matchesReferenceCode', () => {
    it('accepts the exact code', () => {
      assert.equal(matchesReferenceCode(record, 'SF-20260901-161837-42'), true)
    })

    it('accepts a differently-cased code', () => {
      assert.equal(matchesReferenceCode(record, 'sf-20260901-161837-42'), true)
      assert.equal(matchesReferenceCode(record, '  SF-20260901-161837-42  '), true)
    })

    it('rejects a wrong code, so ids alone cannot unlock a record', () => {
      assert.equal(matchesReferenceCode(record, 'SF-20260901-161837-43'), false)
      assert.equal(matchesReferenceCode(record, 'SF-20260101-000000-01'), false)
    })

    it('rejects missing, empty and non-string codes', () => {
      for (const bad of [undefined, null, '', '   ', 0, false, {}, []]) {
        assert.equal(
          matchesReferenceCode(record, bad),
          false,
          `code ${JSON.stringify(bad)} must not authorize a lookup`
        )
      }
    })

    it('rejects a prefix of the real code (no partial match)', () => {
      assert.equal(matchesReferenceCode(record, 'SF-20260901'), false)
      assert.equal(matchesReferenceCode(record, 'SF-20260901-161837-4'), false)
    })

    it('never authorizes a record whose remarks hold no code', () => {
      const noCode = { ...record, remarks: 'Walk-in applicant' }
      assert.equal(matchesReferenceCode(noCode, 'SF-20260901-161837-42'), false)
    })
  })

  describe('matchesMobileNumber', () => {
    it('accepts the primary number in every PH format', () => {
      for (const form of ['09171234567', '639171234567', '+639171234567', '9171234567', '0917 123 4567']) {
        assert.equal(matchesMobileNumber(record, form), true, `${form} should match`)
      }
    })

    it('accepts the secondary contact number on the application', () => {
      const withAlt = { ...record, secondaryMobileNumber: '09281234567' }
      assert.equal(matchesMobileNumber(withAlt, '09281234567'), true)
    })

    it('rejects a different subscriber', () => {
      assert.equal(matchesMobileNumber(record, '09179999999'), false)
      assert.equal(matchesMobileNumber(record, '09171234568'), false)
    })

    it('rejects malformed and empty numbers', () => {
      for (const bad of ['', '   ', 'not-a-number', '12345', undefined, null, {}]) {
        assert.equal(matchesMobileNumber(record, bad), false)
      }
    })

    it('normalizes to the 09xxxxxxxxx form', () => {
      assert.equal(normalizePhMobile('+639171234567'), '09171234567')
      assert.equal(normalizePhMobile('bogus'), null)
    })
  })

  describe('isAuthorized', () => {
    it('unlocks with either the reference code or the mobile number', () => {
      assert.equal(isAuthorized(record, { code: 'SF-20260901-161837-42' }), true)
      assert.equal(isAuthorized(record, { verify: '09171234567' }), true)
    })

    it('refuses when neither proof is supplied — an id alone is never enough', () => {
      assert.equal(isAuthorized(record, {}), false)
      assert.equal(isAuthorized(record, { code: '', verify: '' }), false)
      assert.equal(isAuthorized(record, undefined), false)
    })

    it('refuses when both proofs are wrong', () => {
      assert.equal(
        isAuthorized(record, { code: 'SF-20260101-000000-01', verify: '09179999999' }),
        false
      )
    })
  })

  describe('sanitizeApplicationRecord still strips private fields', () => {
    it('removes document URLs and internal staff email', () => {
      const safe = sanitizeApplicationRecord(record)
      assert.equal(safe.governmentValidId, undefined)
      assert.equal(safe.userEmail, undefined)
      assert.equal(safe.id, 15445)
    })
  })

  describe('handler refuses unproven lookups without touching upstream', () => {
    function mockRes() {
      const res = { statusCode: null, headers: {}, body: null }
      res.setHeader = (k, v) => { res.headers[k] = v }
      res.status = (c) => { res.statusCode = c; return res }
      res.json = (b) => { res.body = b; return res }
      res.end = (b) => { res.body = b; return res }
      return res
    }

    it('returns 404 when neither code nor verify is present', async () => {
      const res = mockRes()
      await handler({ method: 'GET', query: { id: '15445' }, url: '/api/Applications/15445' }, res)

      assert.equal(res.statusCode, 404)
      assert.deepEqual(res.body, { error: 'Not Found' })
      // Same body an unknown id yields, so the endpoint is not an existence oracle.
      assert.equal(res.headers['Cache-Control'], 'no-store')
    })

    it('returns 404 for an empty proof', async () => {
      const res = mockRes()
      await handler(
        { method: 'GET', query: { id: '15445', code: '', verify: '' }, url: '/api/Applications/15445' },
        res
      )
      assert.equal(res.statusCode, 404)
    })
  })
})
