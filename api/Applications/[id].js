// Serverless Function: applicant tracker lookup.
// Handles GET /api/Applications/:id?jo=<jobOrderId hint>
//
// Returns the sanitized Application row reconciled with dispatch and billing.
// The heavy lifting (and the reason this is not a plain proxy) lives in
// api/_tracker.js: the job order is read from GET /api/JobOrders/{id} instead
// of scanning the multi-megabyte status lists on every lookup.
import { tracker, JOB_ORDER_ID } from '../_tracker.js'

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

  const { id, jo } = req.query || {}
  const hint = jo !== undefined && JOB_ORDER_ID.test(String(jo)) ? String(jo) : null

  try {
    const result = await tracker.lookupApplication(String(id ?? ''), { hint })
    send(res, result.status, result.body)
  } catch (error) {
    console.error(`Tracker lookup error on ${req.method} /api/Applications/${id}:`, error)
    send(res, 502, {
      error: 'Backend Connection Error',
      message: 'Unable to reach our records system. Please try again shortly.'
    })
  }
}
