import { timingSafeEqual } from 'crypto'
import { proxyRequest } from '../_proxy.js'
import { sanitizeApplicationData } from '../Applications.js'

// The upstream application id is a sequential integer, so it is not a secret:
// anyone can walk 1..N and read every applicant's name, email, both mobile
// numbers and home address. A lookup therefore has to prove the caller is the
// applicant (Data Privacy Act, RA 10173). Two proofs are accepted:
//
//   ?code=SF-YYYYMMDD-HHMMSS-NN  the reference code, stored upstream inside
//                                `remarks`, held by applicants from the old flow
//   ?verify=09171234567          the mobile number on the application, which
//                                every applicant knows and no enumerator can guess
//
// Either one unlocks the record; neither one leaks which ids exist.
const REFERENCE_CODE = /SF-\d{8}-\d{6}-[A-Z0-9]+/i
const PH_MOBILE = /^(?:\+?63|0)?(9\d{9})$/

export function extractReferenceCode(record) {
  const match = REFERENCE_CODE.exec(String(record?.remarks ?? ''))
  return match ? match[0].toUpperCase() : null
}

// Mirrors normalizePhMobile in api/send-sms.js: 09171234567, 639171234567,
// +639171234567 and 9171234567 all describe the same subscriber.
export function normalizePhMobile(raw) {
  const digits = String(raw ?? '').replace(/[\s()-]/g, '')
  const match = PH_MOBILE.exec(digits)
  return match ? `0${match[1]}` : null
}

// Constant-time so the endpoint does not leak a secret one character at a time.
function safeEqual(a, b) {
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export function matchesReferenceCode(record, suppliedCode) {
  const expected = extractReferenceCode(record)
  const supplied = String(suppliedCode ?? '').trim().toUpperCase()
  if (!expected || !supplied) return false
  return safeEqual(expected, supplied)
}

export function matchesMobileNumber(record, suppliedMobile) {
  const supplied = normalizePhMobile(suppliedMobile)
  if (!supplied) return false

  // Either number on the application counts — applicants routinely track with
  // the alternate contact they gave.
  return [record?.mobileNumber, record?.secondaryMobileNumber]
    .map(normalizePhMobile)
    .filter(Boolean)
    .some((known) => safeEqual(known, supplied))
}

export function isAuthorized(record, { code, verify } = {}) {
  if (code && matchesReferenceCode(record, code)) return true
  if (verify && matchesMobileNumber(record, verify)) return true
  return false
}

export default async function handler(req, res) {
  const { id, code, verify } = req.query || {}
  const cleanId = id ? encodeURIComponent(id) : ''

  // No proof, no record — answered before we touch upstream, and with the same
  // body an unknown id produces so this never becomes an existence oracle.
  if (!code && !verify) {
    res.setHeader('Vary', 'Origin')
    res.setHeader('Cache-Control', 'no-store')
    res.status(404).json({ error: 'Not Found' })
    return
  }

  const targetPath = cleanId ? `/api/Applications/${cleanId}` : req.url

  return proxyRequest(req, res, targetPath, {
    authorize: (record) => isAuthorized(record, { code, verify }),
    transform: req.method === 'GET' ? sanitizeApplicationData : null
  })
}
