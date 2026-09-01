import { proxyRequest } from '../_proxy.js'
import { sanitizeApplicationData } from '../Applications.js'

export default async function handler(req, res) {
  const { id } = req.query || {}
  const cleanId = id ? encodeURIComponent(id) : ''
  const targetPath = cleanId ? `/api/Applications/${cleanId}` : req.url

  return proxyRequest(req, res, targetPath, {
    transform: req.method === 'GET' ? sanitizeApplicationData : null
  })
}
