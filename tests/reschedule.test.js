import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  APPLICANT_RESCHEDULE_PREFIX,
  readScheduledDate,
  validateRescheduleRequest,
  jobOrderMatchesApplication,
  isScheduledJobOrder,
  buildRescheduledJobOrder,
  extractRescheduleReason,
  formatScheduledDate,
  manilaToday
} from '../src/services/jobOrderSchedule.js'
import { rescheduleJobOrder } from '../api/JobOrders/[id]/reschedule.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Shape of a live Scheduled row (sample IDs, not real customers).
const scheduledRow = {
  id: 4094,
  accountNo: '202609051153198108414',
  applicationIdValue: '',
  firstName: 'ProbeTest',
  lastName: 'Agent',
  status: 'Scheduled',
  installationDate: '2026-09-04T00:00:00',
  dateInstalled: '2026-09-04T00:00:00',
  joRemarks: '',
  remarks: 'Automated probe test',
  assignedEmail: 'staff@switchfiber.ph',
  clientSignature: 'sig.png',
  modifiedDate: '2026-09-06T00:24:15.373'
}

// 2026-09-08 10:00 Manila (UTC+8)
const NOW = Date.UTC(2026, 8, 8, 2, 0, 0)

describe('jobOrderSchedule helpers', () => {
  it('reads installationDate first and falls back to dateInstalled', () => {
    assert.equal(readScheduledDate(scheduledRow), '2026-09-04')
    assert.equal(readScheduledDate({ installationDate: null, dateInstalled: '2026-08-27T00:00:00' }), '2026-08-27')
    assert.equal(readScheduledDate({ installationDate: null, dateInstalled: null }), null)
    assert.equal(readScheduledDate(null), null)
  })

  it('computes Manila calendar day from a UTC instant', () => {
    // 2026-09-08 20:00 UTC is already 2026-09-09 in Manila
    assert.equal(manilaToday(Date.UTC(2026, 8, 8, 20, 0, 0)), '2026-09-09')
    assert.equal(manilaToday(NOW), '2026-09-08')
  })

  it('accepts a valid future date with a reason', () => {
    const r = validateRescheduleRequest({ newDate: '2026-09-15', reason: '  Nobody   home that day ' }, NOW)
    assert.deepEqual(r, { ok: true, newDate: '2026-09-15', reason: 'Nobody home that day' })
  })

  it('rejects malformed, past, same-day, far-future and impossible dates', () => {
    assert.equal(validateRescheduleRequest({ newDate: '15/09/2026', reason: 'valid reason' }, NOW).ok, false)
    assert.equal(validateRescheduleRequest({ newDate: '2026-09-08', reason: 'valid reason' }, NOW).ok, false)
    assert.equal(validateRescheduleRequest({ newDate: '2026-09-01', reason: 'valid reason' }, NOW).ok, false)
    assert.equal(validateRescheduleRequest({ newDate: '2027-01-01', reason: 'valid reason' }, NOW).ok, false)
    assert.equal(validateRescheduleRequest({ newDate: '2026-02-31', reason: 'valid reason' }, NOW).ok, false)
    assert.equal(validateRescheduleRequest({ newDate: '2026-09-09', reason: 'valid reason' }, NOW).ok, true)
  })

  it('requires a reason of sensible length', () => {
    assert.match(validateRescheduleRequest({ newDate: '2026-09-15', reason: 'no' }, NOW).error, /note for our dispatch team/i)
    assert.match(validateRescheduleRequest({ newDate: '2026-09-15', reason: 'x'.repeat(301) }, NOW).error, /under/i)
  })

  it('matches job orders on applicationId (Applications row), accountNo, applicationIdValue or id', () => {
    assert.equal(jobOrderMatchesApplication({ ...scheduledRow, applicationId: '15476' }, '15476'), true)
    assert.equal(jobOrderMatchesApplication({ ...scheduledRow, applicationId: 15476 }, '15476'), true)
    assert.equal(jobOrderMatchesApplication(scheduledRow, '202609051153198108414'), true)
    assert.equal(jobOrderMatchesApplication(scheduledRow, '4094'), true)
    assert.equal(jobOrderMatchesApplication({ ...scheduledRow, applicationIdValue: 'SF-1' }, 'sf-1'), true)
    assert.equal(jobOrderMatchesApplication(scheduledRow, '999'), false)
    assert.equal(jobOrderMatchesApplication(scheduledRow, ''), false)
  })

  it('detects scheduled status loosely', () => {
    assert.equal(isScheduledJobOrder({ status: 'Scheduled' }), true)
    assert.equal(isScheduledJobOrder({ status: 'schedule' }), true)
    assert.equal(isScheduledJobOrder({ status: 'Completed' }), false)
  })

  it('builds a full replacement row that only changes schedule fields', () => {
    const out = buildRescheduledJobOrder(scheduledRow, { newDate: '2026-09-15', reason: 'Nobody home', now: NOW })
    assert.equal(out.installationDate, '2026-09-15T00:00:00')
    assert.equal(out.dateInstalled, '2026-09-04T00:00:00')
    assert.equal(out.clientSignature, 'sig.png')
    assert.equal(out.assignedEmail, 'staff@switchfiber.ph')
    assert.equal(out.joRemarks, `${APPLICANT_RESCHEDULE_PREFIX} 2026-09-08: 2026-09-04 -> 2026-09-15. Reason: Nobody home`)
    assert.ok(out.modifiedDate.startsWith('2026-09-08T02:00:00'))
    assert.equal(Object.keys(out).length, Object.keys(scheduledRow).length)
  })

  it('appends to existing staff remarks and reads back the latest reason', () => {
    const first = buildRescheduledJobOrder({ ...scheduledRow, joRemarks: 'Bring ladder' }, { newDate: '2026-09-15', reason: 'Nobody home', now: NOW })
    assert.ok(first.joRemarks.startsWith('Bring ladder | '))
    assert.equal(extractRescheduleReason(first.joRemarks), 'Nobody home')
    const second = buildRescheduledJobOrder(first, { newDate: '2026-09-20', reason: 'Out of town', now: NOW })
    assert.equal(extractRescheduleReason(second.joRemarks), 'Out of town')
    assert.equal(extractRescheduleReason('Bring ladder'), null)
    assert.equal(extractRescheduleReason(''), null)
  })

  it('formats a YYYY-MM-DD without timezone drift', () => {
    assert.match(formatScheduledDate('2026-09-04'), /Friday/)
    assert.match(formatScheduledDate('2026-09-04'), /September 4, 2026/)
    assert.equal(formatScheduledDate('nope'), '')
  })
})

describe('POST /api/JobOrders/:id/reschedule (rescheduleJobOrder)', () => {
  function fakeUpstream(row, { putStatus = 200 } = {}) {
    const calls = []
    const upstream = async (p, opts = {}) => {
      calls.push({ path: p, method: opts.method || 'GET', body: opts.body })
      if ((opts.method || 'GET') === 'GET') {
        return row ? { status: 200, data: row } : { status: 404, data: null }
      }
      return { status: putStatus, data: putStatus === 200 ? { id: row.id } : null }
    }
    return { upstream, calls }
  }

  it('rewrites installationDate and appends the reason through a full PUT', async () => {
    const { upstream, calls } = fakeUpstream(scheduledRow)
    const res = await rescheduleJobOrder(
      { id: '4094', applicationId: '202609051153198108414', newDate: '2026-09-15', reason: 'Nobody home that day' },
      { upstream, now: NOW }
    )
    assert.equal(res.status, 200)
    assert.equal(res.body.scheduledDate, '2026-09-15')
    assert.equal(res.body.rescheduleReason, 'Nobody home that day')
    assert.equal(calls.length, 2)
    assert.equal(calls[0].method, 'GET')
    assert.equal(calls[0].path, '/api/JobOrders/4094')
    assert.equal(calls[1].method, 'PUT')
    assert.equal(calls[1].path, '/api/JobOrders/4094')
    assert.equal(calls[1].body.id, 4094)
    assert.equal(calls[1].body.installationDate, '2026-09-15T00:00:00')
    assert.equal(calls[1].body.clientSignature, 'sig.png', 'full record must be echoed back')
    // Response never leaks internal columns
    assert.equal(res.body.assignedEmail, undefined)
    assert.equal(res.body.clientSignature, undefined)
  })

  it('accepts ownership through the Applications row number the job order links to', async () => {
    const { upstream, calls } = fakeUpstream({ ...scheduledRow, applicationId: '15476', accountNo: '202609123' })
    const res = await rescheduleJobOrder(
      { id: '4094', applicationId: '202609051153198108414', applicationRecordId: 15476, newDate: '2026-09-15', reason: 'Nobody home that day' },
      { upstream, now: NOW }
    )
    assert.equal(res.status, 200)
    assert.equal(calls.filter(c => c.method === 'PUT').length, 1)

    const wrongRow = await rescheduleJobOrder(
      { id: '4094', applicationId: '202609051153198108414', applicationRecordId: '99999', newDate: '2026-09-15', reason: 'Nobody home that day' },
      { upstream, now: NOW }
    )
    assert.equal(wrongRow.status, 404)
  })

  it('refuses when the application ID does not own the job order', async () => {
    const { upstream, calls } = fakeUpstream(scheduledRow)
    const res = await rescheduleJobOrder(
      { id: '4094', applicationId: '202600000000000000000', newDate: '2026-09-15', reason: 'Nobody home that day' },
      { upstream, now: NOW }
    )
    assert.equal(res.status, 404)
    assert.equal(calls.filter(c => c.method === 'PUT').length, 0)
  })

  it('refuses once the job order is no longer Scheduled', async () => {
    const { upstream, calls } = fakeUpstream({ ...scheduledRow, status: 'Completed' })
    const res = await rescheduleJobOrder(
      { id: '4094', applicationId: '202609051153198108414', newDate: '2026-09-15', reason: 'Nobody home that day' },
      { upstream, now: NOW }
    )
    assert.equal(res.status, 409)
    assert.equal(calls.filter(c => c.method === 'PUT').length, 0)
  })

  it('validates input before touching upstream', async () => {
    const { upstream, calls } = fakeUpstream(scheduledRow)
    const res = await rescheduleJobOrder(
      { id: '4094', applicationId: '202609051153198108414', newDate: '2026-09-01', reason: 'Nobody home that day' },
      { upstream, now: NOW }
    )
    assert.equal(res.status, 400)
    assert.equal(calls.length, 0)

    const bad = await rescheduleJobOrder({ id: 'abc', applicationId: 'x', newDate: '2026-09-15', reason: 'valid reason' }, { upstream, now: NOW })
    assert.equal(bad.status, 400)
  })

  it('reports upstream failures without a stack trace', async () => {
    const { upstream } = fakeUpstream(scheduledRow, { putStatus: 500 })
    const res = await rescheduleJobOrder(
      { id: '4094', applicationId: '202609051153198108414', newDate: '2026-09-15', reason: 'Nobody home that day' },
      { upstream, now: NOW }
    )
    assert.equal(res.status, 502)
    assert.equal(typeof res.body.message, 'string')
  })
})

describe('Tracking screen wiring', () => {
  const statusSource = fs.readFileSync(path.resolve(__dirname, '../src/views/ApplicationStatusView.vue'), 'utf8')
  const storeSource = fs.readFileSync(path.resolve(__dirname, '../src/stores/registration.js'), 'utf8')
  const enrichSource = fs.readFileSync(path.resolve(__dirname, '../api/_tracker.js'), 'utf8')
  const handlerSource = fs.readFileSync(path.resolve(__dirname, '../api/Applications/[id].js'), 'utf8')
  const viteSource = fs.readFileSync(path.resolve(__dirname, '../vite.config.js'), 'utf8')

  it('shows the scheduled installation date and a reschedule form', () => {
    assert.match(statusSource, /foundApp\.scheduledDate/)
    assert.match(statusSource, /formatScheduledDate/)
    assert.match(statusSource, /type="date"/)
    assert.match(statusSource, /Notes for our dispatch team/)
    assert.match(statusSource, /aria-describedby="reschedule-reason-help"/)
    assert.match(statusSource, /rescheduleInstallation/)
  })

  it('exposes scheduledDate from server enrichment and passes it through the store', () => {
    assert.match(enrichSource, /readScheduledDate/)
    assert.match(handlerSource, /_tracker\.js/)
    assert.match(storeSource, /scheduledDate:/)
  })

  it('reads the job order by application row id and never scans the status lists', () => {
    assert.match(enrichSource, /\/api\/JobOrders\/applicationid\/\$\{clean\}/)
    assert.doesNotMatch(enrichSource, /JobOrders\/status\/(Scheduled|Completed|Activated)/)
    assert.doesNotMatch(storeSource, /\?jo=/)
    assert.doesNotMatch(storeSource, /JobOrders\/status\//)
    assert.doesNotMatch(storeSource, /api\/BillingDetails/)
    assert.match(statusSource, /applicationRecordId: foundApp\.value\.id/)
  })

  it('mirrors the reschedule and tracker functions in the Vite dev server', () => {
    assert.match(viteSource, /reschedule/)
    assert.match(viteSource, /Applications\/\[id\]\.js/)
  })
})
