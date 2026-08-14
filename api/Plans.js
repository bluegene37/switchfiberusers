import { proxyRequest } from './_proxy.js'

export default async function handler(req, res) {
  // Extract query parameters if any, e.g. /api/Plans?activeOnly=true
  const queryIndex = req.url.indexOf('?')
  const queryStr = queryIndex !== -1 ? req.url.substring(queryIndex) : ''
  return proxyRequest(req, res, `/api/Plans${queryStr}`)
}
