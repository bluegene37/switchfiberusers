import { proxyRequest } from './_proxy.js'

/**
 * Sanitizes BillingDetails records to protect customer privacy and prevent
 * leaking internal credentials, payment balance, and network infrastructure identifiers (RA 10173).
 */
export function sanitizeBillingDetailRecord(record) {
  if (!record || typeof record !== 'object') return null
  const {
    splynxId,
    mikrotikId,
    attachment1,
    attachment2,
    attachment3,
    modifiedBy,
    userEmail,
    accountBalance,
    ip,
    username,
    ...safeRecord
  } = record

  return safeRecord
}

export function sanitizeBillingDetailsData(data) {
  if (!data) return []
  const list = Array.isArray(data) ? data : (data.billingDetails || [])
  return list.map(sanitizeBillingDetailRecord).filter(Boolean)
}

export default async function handler(req, res) {
  const { accountNo, id } = req.query || {}

  return proxyRequest(req, res, '/api/BillingDetails', {
    transform: (data) => {
      const sanitized = sanitizeBillingDetailsData(data)
      if (accountNo || id) {
        const queryTerm = String(accountNo || id).trim().toLowerCase()
        return sanitized.filter(b =>
          String(b.accountNo || '').trim().toLowerCase() === queryTerm ||
          String(b.id || '').trim().toLowerCase() === queryTerm
        )
      }
      return sanitized
    }
  })
}
