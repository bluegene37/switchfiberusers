import { proxyRequest } from './_proxy.js'

/**
 * Sanitizes application data to prevent leakage of sensitive document URLs
 * (such as private Google Drive attachments) and internal staff emails
 * in accordance with Data Privacy Act (RA 10173).
 */
export function sanitizeApplicationRecord(record) {
  if (!record || typeof record !== 'object') return null
  const {
    proofOfBilling,
    governmentValidId,
    secondGovernmentValidId,
    houseFrontPicture,
    documentPicture,
    pictureOfStatementBillingFromOtherProvider,
    modifiedBy,
    userEmail,
    ...safeRecord
  } = record

  return safeRecord
}

export function sanitizeApplicationData(data) {
  if (Array.isArray(data)) {
    return data.map(sanitizeApplicationRecord).filter(Boolean)
  }
  return sanitizeApplicationRecord(data)
}

export default async function handler(req, res) {
  const queryIndex = req.url.indexOf('?')
  const queryStr = queryIndex !== -1 ? req.url.substring(queryIndex) : ''
  const pathOnly = queryIndex !== -1 ? req.url.substring(0, queryIndex) : req.url
  
  const targetPath = pathOnly.startsWith('/api/Applications')
    ? req.url
    : `/api/Applications${queryStr}`

  return proxyRequest(req, res, targetPath, {
    transform: req.method === 'GET' ? sanitizeApplicationData : null
  })
}
