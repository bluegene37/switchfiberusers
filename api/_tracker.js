// Application tracker lookup, shared by api/Applications/[id].js and the Vite
// dev middleware.
//
// The fiber backend has no "job order by account number" endpoint. The old
// tracker scanned every JobOrders/status list on each lookup, and then the
// browser downloaded the same lists again to repeat the match. The Activated
// list alone is ~11 MB of base64 photos, so one lookup could move 20+ MB.
//
// The lists are now used only to discover the job order *id*, cheapest source
// first, and the record itself always comes fresh from
// GET /api/JobOrders/{id} (~3 KB, ~50 ms):
//   1. `hint`  - the job order id the browser remembered from a past lookup
//   2. JobOrders/status/Scheduled (~40 KB) and /Completed (~20 KB)
//   3. BillingDetails (~1 MB) - proves Activated; no job order needed
//   4. JobOrders/status/Activated (~11 MB) - last resort. Only a tiny
//      accountNo -> id index is kept, for 15 minutes: a stale index can only
//      delay discovery, never produce a stale status, because the status is
//      read from the per-id row.
import { upstreamJson } from './_proxy.js'
import { sanitizeApplicationRecord } from './Applications.js'
import { sanitizeJobOrderRecord } from './JobOrders/status/[status].js'
import {
  jobOrderMatchesApplication,
  readScheduledDate,
  extractRescheduleReason
} from '../src/services/jobOrderSchedule.js'

export const JOB_ORDER_ID = /^\d{1,12}$/
// Same shape the proxy allowlist accepts for /api/Applications/:id
export const TRACKER_ID = /^[a-zA-Z0-9_-]{1,64}$/

const SMALL_LIST_TTL_MS = 30 * 1000
const BILLING_TTL_MS = 5 * 60 * 1000
const ACTIVATED_INDEX_TTL_MS = 15 * 60 * 1000
const ROW_TIMEOUT_MS = 8000
const SMALL_LIST_TIMEOUT_MS = 10000
const BIG_LIST_TIMEOUT_MS = 25000

const norm = (v) => String(v ?? '').trim().toUpperCase()
const statusOf = (v) => String(v ?? '').trim().toLowerCase()
const isActivated = (s) => s.includes('activat') || s.includes('active')
const isCompleted = (s) => s.includes('complet')
const isScheduled = (s) => s.includes('schedul')
const isInternalRemark = (r) => String(r ?? '').startsWith('Online Application')

export function createTrackerLookup({ upstream = upstreamJson, now = Date.now } = {}) {
  const smallLists = {
    Scheduled: { at: 0, rows: [] },
    Completed: { at: 0, rows: [] }
  }
  const billing = { at: 0, rows: [] }
  const activated = { at: 0, index: new Map() }

  async function jobOrderById(id) {
    const clean = String(id ?? '').trim()
    if (!JOB_ORDER_ID.test(clean)) return null
    const res = await upstream(`/api/JobOrders/${clean}`, { timeoutMs: ROW_TIMEOUT_MS })
    if (res.status !== 200 || !res.data || typeof res.data !== 'object' || Array.isArray(res.data)) return null
    return res.data
  }

  async function smallList(status) {
    const slot = smallLists[status]
    if (slot.rows.length > 0 && now() - slot.at < SMALL_LIST_TTL_MS) return slot.rows
    const res = await upstream(`/api/JobOrders/status/${status}`, { timeoutMs: SMALL_LIST_TIMEOUT_MS })
    if (res.status === 200 && Array.isArray(res.data)) {
      slot.at = now()
      slot.rows = res.data
    }
    return slot.rows
  }

  async function billingRows() {
    if (billing.rows.length > 0 && now() - billing.at < BILLING_TTL_MS) return billing.rows
    const res = await upstream('/api/BillingDetails', { timeoutMs: SMALL_LIST_TIMEOUT_MS })
    if (res.status === 200) {
      const list = Array.isArray(res.data) ? res.data : (res.data?.billingDetails || [])
      if (Array.isArray(list) && list.length > 0) {
        billing.at = now()
        billing.rows = list
      }
    }
    return billing.rows
  }

  async function activatedIndex() {
    if (activated.at > 0 && now() - activated.at < ACTIVATED_INDEX_TTL_MS) return activated.index
    const res = await upstream('/api/JobOrders/status/Activated', { timeoutMs: BIG_LIST_TIMEOUT_MS })
    if (res.status === 200 && Array.isArray(res.data)) {
      const index = new Map()
      for (const row of res.data) {
        if (!row || row.id === undefined || row.id === null) continue
        for (const key of [row.accountNo, row.applicationIdValue, row.id]) {
          const k = norm(key)
          if (k && !index.has(k)) index.set(k, String(row.id))
        }
      }
      activated.at = now()
      activated.index = index
    }
    return activated.index
  }

  /**
   * Fresh job order row for an identifier. `sources` is the discovery order;
   * a hint is always tried first. Resolves to { row, source } or null.
   */
  async function findJobOrder(identifier, { hint = null, sources = ['Scheduled', 'Completed'] } = {}) {
    const wanted = String(identifier ?? '').trim()
    if (!wanted) return null

    if (hint && JOB_ORDER_ID.test(String(hint))) {
      const row = await jobOrderById(hint)
      if (row && jobOrderMatchesApplication(row, wanted)) return { row, source: 'hint' }
    }

    for (const source of sources) {
      let id = null
      let listRow = null
      if (source === 'Activated') {
        id = (await activatedIndex()).get(norm(wanted)) || null
      } else {
        listRow = (await smallList(source)).find(r => jobOrderMatchesApplication(r, wanted)) || null
        id = listRow ? listRow.id : null
      }
      if (id === null || id === undefined) continue

      const row = await jobOrderById(id)
      if (row && jobOrderMatchesApplication(row, wanted)) return { row, source }
      // Per-id read failed (timeout / transient): the list row is at most a
      // cache TTL old and is the same record, so it is still a safe answer.
      if (listRow) return { row: listRow, source: `${source}-list` }
    }
    return null
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

  /**
   * Reconciles an Application row with dispatch (JobOrders) and billing.
   * The backend never advances Application.status past Inprogress/Schedule,
   * so the job order is the only source of truth for stages 2-4.
   */
  async function enrichApplication(app, { hint = null } = {}) {
    if (!app || typeof app !== 'object') return app
    const current = statusOf(app.status)
    if (isActivated(current)) return app

    const appId = String(app.applicationid || app.applicationId || app.id || '').trim()
    if (!appId) return app

    try {
      const found = await findJobOrder(appId, { hint })
      if (found) {
        // A row that says Completed must not jump an application that still
        // says Schedule (rule carried over from the list-based tracker).
        const applied = applyJobOrder(app, found.row, { allowCompleted: !isScheduled(current) })
        if (applied && isCompleted(statusOf(app.status))) {
          const b = matchBilling(await billingRows(), [appId])
          if (b) applyBilling(app, b)
        }
        return app
      }

      const b = matchBilling(await billingRows(), [appId])
      if (b) {
        applyBilling(app, b)
        return app
      }

      const viaActivated = await findJobOrder(appId, { sources: ['Activated'] })
      if (viaActivated) applyJobOrder(app, viaActivated.row)
    } catch (err) {
      console.warn('[Tracker] enrichment failed:', err?.message || err)
    }
    return app
  }

  function applicationFromJobOrder(row) {
    const safe = sanitizeJobOrderRecord(row) || {}
    const app = {
      id: safe.id,
      applicationid: safe.accountNo || String(safe.id),
      firstName: safe.firstName || '',
      lastName: safe.lastName || '',
      middleName: safe.middleInitial || '',
      mobileNumber: safe.contactNumber || safe.secondContactNumber || '',
      emailAddress: safe.applicantEmailAddress || safe.emailAddress || '',
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

  function applicationFromBilling(b) {
    const fullName = String(b.fullName || '').trim()
    return {
      id: b.id,
      applicationid: b.accountNo || String(b.id),
      firstName: fullName ? fullName.split(' ')[0] : '',
      lastName: fullName ? fullName.split(' ').slice(1).join(' ') : '',
      mobileNumber: b.contactNumber || b.secondContactNumber || '',
      emailAddress: b.emailAddress || '',
      desiredPlan: b.plan || '',
      city: b.city || '',
      barangay: b.barangay || '',
      date: b.dateInstalled || b.modifiedDate || '',
      dateTime: b.modifiedDate || b.dateInstalled || '',
      status: 'Activated',
      billingId: b.id,
      dateInstalled: b.dateInstalled || '',
      routerModemSn: b.routerModemSn || ''
    }
  }

  /**
   * Account numbers that predate online applications have no Application
   * row. Build a tracker record straight from dispatch or billing instead.
   */
  async function lookupByAccount(identifier, { hint = null } = {}) {
    const found = await findJobOrder(identifier, { hint })
    if (found) {
      const app = applicationFromJobOrder(found.row)
      if (isCompleted(statusOf(app.status))) {
        const b = matchBilling(await billingRows(), [identifier])
        if (b) applyBilling(app, b)
      }
      return app
    }
    const b = matchBilling(await billingRows(), [identifier])
    if (b) return applicationFromBilling(b)

    const viaActivated = await findJobOrder(identifier, { sources: ['Activated'] })
    if (viaActivated) return applicationFromJobOrder(viaActivated.row)
    return null
  }

  /**
   * GET /api/Applications/{id}?jo={hint}  ->  { status, body }
   * Never throws; upstream failures map to 502 with a generic message.
   */
  async function lookupApplication(identifier, { hint = null } = {}) {
    const id = String(identifier ?? '').trim()
    if (!TRACKER_ID.test(id)) {
      return { status: 404, body: { error: 'Not Found' } }
    }
    const safeHint = hint && JOB_ORDER_ID.test(String(hint)) ? String(hint) : null

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
      await enrichApplication(app, { hint: safeHint })
      return { status: 200, body: app }
    }

    if (res.status === 200 || res.status === 404 || res.status === 400) {
      try {
        const built = await lookupByAccount(id, { hint: safeHint })
        if (built) return { status: 200, body: sanitizeApplicationRecord(built) }
      } catch (err) {
        console.warn('[Tracker] account fallback failed:', err?.message || err)
      }
      return { status: 404, body: { error: 'Not Found', message: 'No application or account matched that ID.' } }
    }

    return { status: res.status, body: { error: 'Lookup failed', message: 'Please try again shortly.' } }
  }

  return { lookupApplication, enrichApplication, findJobOrder, lookupByAccount }
}

// One shared instance per function instance so warm invocations reuse caches.
export const tracker = createTrackerLookup()
