// Serverless Function: applicant tracker lookup.
// Handles GET /api/Applications/:id
//
// Returns the sanitized Application row reconciled with dispatch and billing.
// The heavy lifting (and the reason this is not a plain proxy) lives in
// api/_tracker.js: the job order comes from
// GET /api/JobOrders/applicationid/{application row id}, one small read.
import { tracker } from '../_tracker.js'

function send(res, code, payload) {
  if (res.headersSent) return
  if (typeof res.status === 'function') res.status(code)
  else res.statusCode = code
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

export default async function handler(req, res) {
  res.setHeader('Vary', 'Origin')
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, OPTIONS')
    if (typeof res.status === 'function') res.status(204)
    else res.statusCode = 204
    res.end()
    return
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS')
    send(res, 405, { error: 'Method Not Allowed' })
    return
  }

  const { id } = req.query || {}

  try {
    const result = await tracker.lookupApplication(String(id ?? ''))
    send(res, result.status, result.body)
  } catch (error) {
    console.error(`Tracker lookup error on ${req.method} /api/Applications/${id}:`, error)
    send(res, 502, {
      error: 'Backend Connection Error',
      message: 'Unable to reach our records system. Please try again shortly.'
    })
  }
}
