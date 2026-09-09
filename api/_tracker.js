// Application tracker lookup, shared by api/Applications/[id].js and the Vite
// dev middleware.
//
// Upstream facts (verified against the live API on 2026-09-09):
// - GET /api/Applications/{applicationid} answers by the public 21-digit code
//   (Applications.applicationid). It does NOT answer by the row number `id`
//   (404 "Application not found").
// - Every JobOrders row carries `applicationId`, and
//   GET /api/JobOrders/applicationid/{applicationId} returns that single job
//   order (~3 KB, ~65 ms) or 404 "Job order not found". It is the only job
//   order read the tracker makes; the old JobOrders/status list scans (the
//   Activated list alone is ~11 MB of base64 photos) are gone.
// - For online applications the link IS the 21-digit code: Application
//   202609092047231836775 (row 15588) has job order 4108 with
//   applicationId "202609092047231836775". The tracker therefore reads the job
//   order by `applicationid`, never by the row number.
// - Legacy job orders (raised before online applications) carry a short
//   number instead, e.g. job order 1 has applicationId "10928". Those
//   applicants track with that number; Applications/{number} 404s, so the
//   record is built from the job order. Do not treat that number as an
//   Applications row id: matched by applicant name, Applications.id was 4
//   higher than JobOrders.applicationId for 3,126 of 3,156 legacy rows.
//
// A lookup is therefore two small reads: the Application row, then the job
// order by its public code. BillingDetails (~1 MB, cached 5 minutes) is read
// only to promote a Completed job order to Activated once billing has the
// account. jobOrderBelongsTo() still checks phone or name before a job order
// is merged into an Application row, so a mislinked row can never surface
// another applicant's schedule.
import { upstreamJson } from './_proxy.js'
import { sanitizeApplicationRecord } from './Applications.js'
import { sanitizeJobOrderRecord } from './JobOrders/status/[status].js'
import { readScheduledDate, extractRescheduleReason } from '../src/services/jobOrderSchedule.js'

/** Legacy tracking number (job order applicationId before online applications). */
export const APPLICATION_ROW_ID = /^\d{1,12}$/
// Same shape the proxy allowlist accepts for /api/Applications/:id
export const TRACKER_ID = /^[a-zA-Z0-9_-]{1,64}$/

const BILLING_TTL_MS = 5 * 60 * 1000
const ROW_TIMEOUT_MS = 8000
const BILLING_TIMEOUT_MS = 10000

const norm = (v) => String(v ?? '').trim().toUpperCase()
const normName = (v) => String(v ?? '').toLowerCase().replace(/[^a-z0-9ñ]+/gi, ' ').trim()
const phoneKey = (v) => String(v ?? '').replace(/\D/g, '').slice(-10)

/**
 * Whether a job order is really this applicant's. Guards against the
 * mislinked applicationId described in the header: accept the row only when
 * a phone number matches, or both first and last names match.
 */
export function jobOrderBelongsTo(app, row) {
  if (!app || !row) return false
  const appPhones = [app.mobileNumber, app.secondaryMobileNumber].map(phoneKey).filter(p => p.length >= 7)
  const rowPhones = [row.contactNumber, row.secondContactNumber].map(phoneKey).filter(p => p.length >= 7)
  if (appPhones.some(p => rowPhones.includes(p))) return true
  const first = normName(app.firstName)
  const last = normName(app.lastName)
  if (!first || !last) return false
  return first === normName(row.firstName) && last === normName(row.lastName)
}
const statusOf = (v) => String(v ?? '').trim().toLowerCase()
const isActivated = (s) => s.includes('activat') || s.includes('active')
const isCompleted = (s) => s.includes('complet')
const isScheduled = (s) => s.includes('schedul')
const isInternalRemark = (r) => String(r ?? '').startsWith('Online Application')

export function createTrackerLookup({ upstream = upstreamJson, now = Date.now } = {}) {
  const billing = { at: 0, rows: [] }

  /** The job order whose applicationId is `key` (21-digit code or legacy number), or null. */
  async function jobOrderByApplicationId(key) {
    const clean = String(key ?? '').trim()
    if (!TRACKER_ID.test(clean)) return null
    const res = await upstream(`/api/JobOrders/applicationid/${encodeURIComponent(clean)}`, { timeoutMs: ROW_TIMEOUT_MS })
    if (res.status !== 200 || !res.data || typeof res.data !== 'object' || Array.isArray(res.data)) return null
    // The endpoint is keyed by applicationId; never trust a row that claims a
    // different link, whatever the backend answered.
    const linked = String(res.data.applicationId ?? '').trim()
    if (linked && linked !== clean) return null
    return res.data
  }

  async function billingRows() {
    if (billing.rows.length > 0 && now() - billing.at < BILLING_TTL_MS) return billing.rows
    const res = await upstream('/api/BillingDetails', { timeoutMs: BILLING_TIMEOUT_MS })
    if (res.status === 200) {
      const list = Array.isArray(res.data) ? res.data : (res.data?.billingDetails || [])
      if (Array.isArray(list) && list.length > 0) {
        billing.at = now()
        billing.rows = list
      }
    }
    return billing.rows
  }

  /** Copies stage evidence from a job order row onto the application. */
  function applyJobOrder(app, row, { allowCompleted = true } = {}) {
    const safe = sanitizeJobOrderRecord(row) || {}
    const s = statusOf(safe.status)

    if (isActivated(s)) {
      app.status = 'Activated'
      app.jobOrderId = safe.id
      if (safe.dateInstalled) app.dateInstalled = safe.dateInstalled
      if (safe.modifiedDate) app.modifiedDate = safe.modifiedDate
      return true
    }
    if (isCompleted(s)) {
      if (!allowCompleted) return false
      app.status = 'Completed'
      app.jobOrderId = safe.id
      if (safe.modifiedDate) app.modifiedDate = safe.modifiedDate
      if (safe.remarks && !isInternalRemark(safe.remarks)) app.remarks = safe.remarks
      return true
    }
    if (isScheduled(s)) {
      app.status = 'Scheduled'
      app.jobOrderId = safe.id
      app.scheduledDate = readScheduledDate(safe)
      app.rescheduleReason = extractRescheduleReason(safe.joRemarks)
      if (safe.modifiedDate) app.modifiedDate = safe.modifiedDate
      if (safe.remarks && !isInternalRemark(safe.remarks)) app.remarks = safe.remarks
      return true
    }
    return false
  }

  function matchBilling(rows, identifiers) {
    const wanted = identifiers.map(norm).filter(Boolean)
    if (wanted.length === 0) return null
    return rows.find(b => wanted.includes(norm(b.accountNo)) || wanted.includes(norm(b.id))) || null
  }

  function applyBilling(app, b) {
    app.status = 'Activated'
    app.billingId = b.id
    if (b.dateInstalled) app.dateInstalled = b.dateInstalled
    if (b.routerModemSn) app.routerModemSn = b.routerModemSn
    if (b.plan && !app.desiredPlan) app.desiredPlan = b.plan
  }

  /** Completed -> Activated once billing carries the job order's account. */
  async function promoteViaBilling(app, row, extraIdentifiers = []) {
    if (!isCompleted(statusOf(app.status))) return
    const b = matchBilling(await billingRows(), [row.accountNo, ...extraIdentifiers])
    if (b) applyBilling(app, b)
  }

  /**
   * Reconciles an Application row with dispatch (JobOrders) and billing.
   * The backend never advances Application.status past Inprogress/Schedule,
   * so the job order is the only source of truth for stages 2-4.
   */
  async function enrichApplication(app) {
    if (!app || typeof app !== 'object') return app
    const current = statusOf(app.status)
    if (isActivated(current)) return app
    const code = String(app.applicationid ?? app.applicationId ?? '').trim()
    if (!TRACKER_ID.test(code)) return app

    try {
      const row = await jobOrderByApplicationId(code)
      if (!row) return app
      if (!jobOrderBelongsTo(app, row)) {
        console.warn(`[Tracker] job order ${row.id} (applicationId ${row.applicationId}) does not match Application row ${app.id}; ignored`)
        return app
      }
      // A row that says Completed must not jump an application that still
      // says Schedule (rule carried over from the list-based tracker).
      const applied = applyJobOrder(app, row, { allowCompleted: !isScheduled(current) })
      if (applied) await promoteViaBilling(app, row, [app.applicationid, app.applicationId])
    } catch (err) {
      console.warn('[Tracker] enrichment failed:', err?.message || err)
    }
    return app
  }

  function applicationFromJobOrder(row) {
    const safe = sanitizeJobOrderRecord(row) || {}
    const rowId = String(safe.applicationId ?? '').trim()
    const app = {
      id: APPLICATION_ROW_ID.test(rowId) ? Number(rowId) : safe.id,
      applicationid: rowId || safe.accountNo || String(safe.id),
      firstName: safe.firstName || '',
      lastName: safe.lastName || '',
      middleName: safe.middleInitial || '',
      mobileNumber: safe.contactNumber || safe.secondContactNumber || '',
      // JobOrders.emailAddress is the staff member who raised the order; only
      // applicantEmailAddress belongs to the applicant.
      emailAddress: safe.applicantEmailAddress || '',
      desiredPlan: safe.planId || '',
      city: safe.city || '',
      barangay: safe.barangay || '',
      dateTime: safe.timestamp || safe.createdDate || '',
      date: safe.dateInstalled || safe.modifiedDate || '',
      modifiedDate: safe.modifiedDate || '',
      status: safe.status || 'Scheduled',
      remarks: !isInternalRemark(safe.remarks) ? (safe.remarks || '') : '',
      dateInstalled: safe.dateInstalled || ''
    }
    applyJobOrder(app, safe)
    return app
  }

  /**
   * Legacy applicants (before online applications) have no Application row
   * answering to their number; build the tracker record from the job order.
   */
  async function lookupByRowId(identifier) {
    const row = await jobOrderByApplicationId(identifier)
    if (!row) return null
    const app = applicationFromJobOrder(row)
    await promoteViaBilling(app, row)
    return app
  }

  /**
   * GET /api/Applications/{id}  ->  { status, body }
   * Never throws; upstream failures map to 502 with a generic message.
   */
  async function lookupApplication(identifier) {
    const id = String(identifier ?? '').trim()
    if (!TRACKER_ID.test(id)) {
      return { status: 404, body: { error: 'Not Found' } }
    }

    const res = await upstream(`/api/Applications/${encodeURIComponent(id)}`, { timeoutMs: ROW_TIMEOUT_MS })
    if (res.status >= 500) {
      console.error(`[Tracker] upstream ${res.status} on /api/Applications/${id}`)
      return {
        status: 502,
        body: { error: 'Backend Error', message: 'Our records system rejected the request. Please try again shortly.' }
      }
    }

    const data = res.data
    const hasRecord = res.status === 200 && data && typeof data === 'object' && !Array.isArray(data) &&
      (data.id !== undefined || data.firstName || data.desiredPlan)

    if (hasRecord) {
      const app = sanitizeApplicationRecord(data)
      await enrichApplication(app)
      return { status: 200, body: app }
    }

    if (res.status === 200 || res.status === 404 || res.status === 400) {
      if (APPLICATION_ROW_ID.test(id)) {
        try {
          const built = await lookupByRowId(id)
          if (built) return { status: 200, body: sanitizeApplicationRecord(built) }
        } catch (err) {
          console.warn('[Tracker] row id fallback failed:', err?.message || err)
        }
      }
      return { status: 404, body: { error: 'Not Found', message: 'No application or account matched that ID.' } }
    }

    return { status: res.status, body: { error: 'Lookup failed', message: 'Please try again shortly.' } }
  }

  return { lookupApplication, enrichApplication, lookupByRowId }
}

// One shared instance per function instance so warm invocations reuse caches.
export const tracker = createTrackerLookup()
