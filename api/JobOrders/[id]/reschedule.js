// Serverless Function: applicant reschedules a Scheduled installation.
// Handles POST /api/JobOrders/:id/reschedule
//   { applicationId, applicationRecordId?, newDate, reason }
// applicationId is the code the applicant tracks with (21-digit public code,
// or an Applications row number); applicationRecordId is the Applications row
// number the tracker resolved, which is how JobOrders.applicationId links back.
//
// The fiber backend has no reschedule endpoint and no reason column; the only
// write path is PUT /api/JobOrders/{id}, which REPLACES the whole row. This
// function therefore reads the full upstream row, changes only the schedule
// fields, and writes the whole row back. The browser never gets raw PUT access.
import { upstreamJson } from '../../_proxy.js'
import { sanitizeJobOrderRecord } from '../status/[status].js'
import {
  validateRescheduleRequest,
  jobOrderMatchesApplication,
  isScheduledJobOrder,
  buildRescheduledJobOrder,
  readScheduledDate,
  extractRescheduleReason
} from '../../../src/services/jobOrderSchedule.js'

const JOB_ORDER_ID = /^\d{1,12}$/
const APPLICATION_ROW_ID = /^\d{1,12}$/

export async function rescheduleJobOrder(input, { upstream = upstreamJson, now = Date.now() } = {}) {
  const id = String(input?.id ?? '').trim()
  const applicationId = String(input?.applicationId ?? '').trim()
  const recordId = String(input?.applicationRecordId ?? '').trim()
  const owners = [applicationId, APPLICATION_ROW_ID.test(recordId) ? recordId : ''].filter(Boolean)

  if (!JOB_ORDER_ID.test(id)) {
    return { status: 400, body: { error: 'Bad Request', message: 'Invalid job order reference.' } }
  }
  if (!applicationId || applicationId.length > 40) {
    return { status: 400, body: { error: 'Bad Request', message: 'Application ID is required.' } }
  }
  const check = validateRescheduleRequest(input, now)
  if (!check.ok) {
    return { status: 400, body: { error: 'Bad Request', message: check.error } }
  }

  const path = `/api/JobOrders/${encodeURIComponent(id)}`
  const current = await upstream(path)
  if (current.status !== 200 || !current.data || typeof current.data !== 'object') {
    return { status: 404, body: { error: 'Not Found', message: 'No installation schedule found for this Application ID.' } }
  }
  const row = current.data
  // Ownership: the caller must present an identifier this job order belongs to.
  if (!owners.some(o => jobOrderMatchesApplication(row, o))) {
    return { status: 404, body: { error: 'Not Found', message: 'No installation schedule found for this Application ID.' } }
  }
  if (!isScheduledJobOrder(row)) {
    return { status: 409, body: { error: 'Conflict', message: 'This installation is no longer in the Scheduled stage and cannot be moved online. Please contact support.' } }
  }

  const updated = buildRescheduledJobOrder(row, { newDate: check.newDate, reason: check.reason, now })
  const put = await upstream(path, { method: 'PUT', body: updated })
  if (put.status < 200 || put.status >= 300) {
    console.error(`Reschedule PUT ${path} failed with upstream ${put.status}`)
    return { status: 502, body: { error: 'Backend Error', message: 'Our records system rejected the new date. Please try again shortly.' } }
  }

  const safe = sanitizeJobOrderRecord(updated) || {}
  return {
    status: 200,
    body: {
      ok: true,
      jobOrderId: safe.id,
      status: safe.status,
      scheduledDate: readScheduledDate(updated),
      previousScheduledDate: readScheduledDate(row),
      rescheduleReason: extractRescheduleReason(updated.joRemarks)
    }
  }
}

function send(res, code, payload) {
  if (typeof res.status === 'function') res.status(code)
  else res.statusCode = code
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS')
    if (typeof res.status === 'function') res.status(204)
    else res.statusCode = 204
    res.end()
    return
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS')
    send(res, 405, { error: 'Method Not Allowed' })
    return
  }

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = null }
  }
  if (!body || typeof body !== 'object') {
    send(res, 400, { error: 'Bad Request', message: 'Expected a JSON body.' })
    return
  }

  const { id } = req.query || {}
  const result = await rescheduleJobOrder({ ...body, id })
  send(res, result.status, result.body)
}
