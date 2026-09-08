// Shared helpers for reading and rescheduling a job order's installation date.
// Used by the Vercel functions in api/ (server-side enrichment + reschedule)
// and by the registration store (client-side enrichment in local dev).
//
// Upstream JobOrder facts (verified against the live API on 2026-09-08):
// - The scheduled visit lives in `installationDate` ("2026-09-04T00:00:00").
//   Older rows only carry `dateInstalled`, so that is the fallback.
// - There is NO reschedule-reason column. The applicant's reason is appended
//   to `joRemarks` behind a fixed prefix so it can be read back later.
// - PUT /api/JobOrders/{id} is a FULL replace: any field missing from the body
//   is wiped. Never send a partial record.

export const APPLICANT_RESCHEDULE_PREFIX = 'Applicant reschedule'

export const RESCHEDULE_MIN_DAYS_AHEAD = 1
export const RESCHEDULE_MAX_DAYS_AHEAD = 90
export const RESCHEDULE_REASON_MIN = 5
export const RESCHEDULE_REASON_MAX = 300

const YMD = /^(\d{4})-(\d{2})-(\d{2})$/

/** "2026-09-04T00:00:00" | Date | "2026-09-04" -> "2026-09-04", else null */
export function toYmd(value) {
  if (!value) return null
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null
    return value.toISOString().slice(0, 10)
  }
  const str = String(value).trim()
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(str)
  return m ? m[1] : null
}

/** The date a Scheduled job order is booked for, as YYYY-MM-DD, or null. */
export function readScheduledDate(jobOrder) {
  if (!jobOrder || typeof jobOrder !== 'object') return null
  return toYmd(jobOrder.installationDate) || toYmd(jobOrder.dateInstalled) || null
}

function ymdToUtcMs(ymd) {
  const m = YMD.exec(ymd || '')
  if (!m) return NaN
  const ms = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  // Reject impossible dates such as 2026-02-31 (Date.UTC would roll over).
  const check = new Date(ms)
  if (check.getUTCFullYear() !== Number(m[1]) || check.getUTCMonth() !== Number(m[2]) - 1 || check.getUTCDate() !== Number(m[3])) {
    return NaN
  }
  return ms
}

/** Today's date in Manila as YYYY-MM-DD (the backend stores wall-clock dates). */
export function manilaToday(now = Date.now()) {
  return new Date(now + 8 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

/**
 * Validates an applicant reschedule request.
 * Returns { ok: true, newDate, reason } or { ok: false, error }.
 */
export function validateRescheduleRequest(input, now = Date.now()) {
  const newDate = String(input?.newDate ?? '').trim()
  const reason = String(input?.reason ?? '').replace(/\s+/g, ' ').trim()

  if (!YMD.test(newDate)) {
    return { ok: false, error: 'Pick a date in YYYY-MM-DD format.' }
  }
  const target = ymdToUtcMs(newDate)
  if (Number.isNaN(target)) {
    return { ok: false, error: 'That date does not exist. Pick a valid calendar date.' }
  }
  const today = ymdToUtcMs(manilaToday(now))
  const dayMs = 24 * 60 * 60 * 1000
  const daysAhead = Math.round((target - today) / dayMs)
  if (daysAhead < RESCHEDULE_MIN_DAYS_AHEAD) {
    return { ok: false, error: 'Pick a date from tomorrow onwards.' }
  }
  if (daysAhead > RESCHEDULE_MAX_DAYS_AHEAD) {
    return { ok: false, error: `Pick a date within the next ${RESCHEDULE_MAX_DAYS_AHEAD} days.` }
  }
  if (reason.length < RESCHEDULE_REASON_MIN) {
    return { ok: false, error: `Add a short note for our dispatch team, such as why you need the new date (at least ${RESCHEDULE_REASON_MIN} characters).` }
  }
  if (reason.length > RESCHEDULE_REASON_MAX) {
    return { ok: false, error: `Keep your note under ${RESCHEDULE_REASON_MAX} characters.` }
  }
  return { ok: true, newDate, reason }
}

/** Same identifiers the tracker already matches job orders on. */
export function jobOrderMatchesApplication(jobOrder, applicationId) {
  if (!jobOrder || typeof jobOrder !== 'object') return false
  const wanted = String(applicationId ?? '').trim().toUpperCase()
  if (!wanted) return false
  return [jobOrder.accountNo, jobOrder.applicationIdValue, jobOrder.id]
    .map(v => String(v ?? '').trim().toUpperCase())
    .some(v => v && v === wanted)
}

export function isScheduledJobOrder(jobOrder) {
  return String(jobOrder?.status ?? '').toLowerCase().includes('schedul')
}

/** One remark line recording an applicant reschedule. */
export function buildRescheduleRemark({ previousDate, newDate, reason, now = Date.now() }) {
  const stamp = manilaToday(now)
  const from = previousDate || 'unset'
  return `${APPLICANT_RESCHEDULE_PREFIX} ${stamp}: ${from} -> ${newDate}. Reason: ${reason}`
}

export function appendRemark(existing, line) {
  const base = String(existing ?? '').trim()
  return base ? `${base} | ${line}` : line
}

/** Latest applicant-supplied reschedule reason recorded in joRemarks, or null. */
export function extractRescheduleReason(joRemarks) {
  const text = String(joRemarks ?? '')
  if (!text.includes(APPLICANT_RESCHEDULE_PREFIX)) return null
  const entries = text.split(' | ').filter(e => e.startsWith(APPLICANT_RESCHEDULE_PREFIX))
  if (entries.length === 0) return null
  const last = entries[entries.length - 1]
  const idx = last.indexOf('Reason: ')
  if (idx === -1) return null
  const reason = last.slice(idx + 'Reason: '.length).trim()
  return reason || null
}

/**
 * Returns a full replacement record for PUT /api/JobOrders/{id} with only the
 * schedule fields changed. `jobOrder` must be the complete upstream row.
 */
export function buildRescheduledJobOrder(jobOrder, { newDate, reason, now = Date.now() }) {
  const previousDate = readScheduledDate(jobOrder)
  const remark = buildRescheduleRemark({ previousDate, newDate, reason, now })
  return {
    ...jobOrder,
    installationDate: `${newDate}T00:00:00`,
    joRemarks: appendRemark(jobOrder.joRemarks, remark),
    modifiedDate: new Date(now).toISOString().replace(/Z$/, '')
  }
}

/** "2026-09-04" -> "Friday, September 4, 2026" (locale formatting, no TZ shift). */
export function formatScheduledDate(ymd) {
  const ms = ymdToUtcMs(ymd)
  if (Number.isNaN(ms)) return ''
  return new Date(ms).toLocaleDateString('en-PH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  })
}
