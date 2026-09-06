import { proxyRequest } from '../../_proxy.js'

/**
 * Sanitizes job order records to prevent leaking installer signature images,
 * technician credentials, and internal attachment links.
 */
export function sanitizeJobOrderRecord(record) {
  if (!record || typeof record !== 'object') return null
  const {
    clientSignature,
    portLabelImage,
    routerReadingImage,
    setupImage,
    signedContractImage,
    speedtestImage,
    boxReadingImage,
    contractLink,
    houseFront,
    assignedEmail,
    ...safeRecord
  } = record

  return safeRecord
}

export function sanitizeJobOrderData(data) {
  if (Array.isArray(data)) {
    return data.map(sanitizeJobOrderRecord).filter(Boolean)
  }
  return sanitizeJobOrderRecord(data)
}

export default async function handler(req, res) {
  const { status } = req.query || {}
  const cleanStatus = status ? encodeURIComponent(status) : ''
  const targetPath = cleanStatus ? `/api/JobOrders/status/${cleanStatus}` : req.url

  return proxyRequest(req, res, targetPath, {
    transform: req.method === 'GET' ? sanitizeJobOrderData : null
  })
}
