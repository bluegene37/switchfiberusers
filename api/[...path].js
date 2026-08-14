import { proxyRequest } from './_proxy.js'

export default async function handler(req, res) {
  // Pass req.url which includes full path e.g. /api/Applications/SF-2026-8942
  return proxyRequest(req, res, req.url)
}
