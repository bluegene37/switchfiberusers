import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createTrackerLookup, jobOrderBelongsTo, APPLICATION_ROW_ID, TRACKER_ID } from '../api/_tracker.js'

// Shapes mirror live rows (sample IDs, not real customers).
// Applications.applicationid is the public 21-digit code and is what
// JobOrders.applicationId carries for online applications; Applications.id is
// only the row number.
const APP_ID = '202609030028571738368'
const ROW_ID = 15476
const application = {
  id: ROW_ID,
  applicationid: APP_ID,
  firstName: 'Blaine',
  lastName: 'Sample',
  mobileNumber: '09171234567',
  desiredPlan: 'SwitchLite - P699',
  status: 'Inprogress',
  governmentValidId: 'drive.google.com/private',
  userEmail: 'staff@switchfiber.ph'
}
const scheduledRow = {
  id: 3980,
  applicationId: APP_ID,
  accountNo: '202609123',
  applicationIdValue: '',
  firstName: 'BLAINE',
  lastName: 'Sample',
  contactNumber: '9171234567',
  status: 'Scheduled',
  installationDate: '2026-09-16T00:00:00',
  dateInstalled: '2026-09-05T00:00:00',
  joRemarks: 'Applicant reschedule 2026-09-08: 2026-09-09 -> 2026-09-16. Reason: I will go to manila.',
  remarks: 'Online Application - auto',
  modifiedDate: '2026-09-08T00:24:15.373',
  assignedEmail: 'tech@switchfiber.ph',
  clientSignature: 'data:image/png;base64,AAAA',
  houseFront: 'data:image/jpeg;base64,BBBB'
}
const completedRow = { id: 3975, applicationId: APP_ID, accountNo: '202609123', firstName: 'Blaine', lastName: 'Sample', status: 'Completed', modifiedDate: '2026-09-10T00:00:00', remarks: 'Installed, modem SN 123' }
// Staff-entered application (no public code): job order 1 links to row 10928.
const activatedRow = {
  id: 1,
  applicationId: '10928',
  applicationIdValue: null,
  accountNo: '202308503',
  status: 'Activated',
  firstName: 'Mahater',
  lastName: 'Sample',
  middleInitial: 'S',
  planId: 'SwitchLite - P699',
  city: 'Binangonan',
  barangay: '20',
  contactNumber: '9774435739',
  dateInstalled: '2025-03-11T00:00:00',
  modifiedDate: '2025-03-11T15:28:00',
  remarks: 'LANDMARK;LIKOD NG TAMBAYAN',
  boxReadingImage: 'Job Order_Images/x.jpg',
  assignedEmail: 'tech1@switchfiber.ph',
  emailAddress: 'staff@switchfiber.ph'
}

/** Records every upstream path; `routes` maps path -> { status, data } or a function. */
function fakeUpstream(routes) {
  const calls = []
  const upstream = async (path) => {
    calls.push(path)
    const hit = routes[path]
    if (typeof hit === 'function') return hit()
    return hit || { status: 404, data: null }
  }
  return { upstream, calls }
}

const appRoute = { [`/api/Applications/${APP_ID}`]: { status: 200, data: application } }
const JO_BY_ROW = `/api/JobOrders/applicationid/${APP_ID}`

describe('tracker id patterns', () => {
  it('accepts application row numbers and public application ids only', () => {
    assert.ok(APPLICATION_ROW_ID.test('10928'))
    assert.ok(!APPLICATION_ROW_ID.test('10a928'))
    assert.ok(!APPLICATION_ROW_ID.test(''))
    assert.ok(TRACKER_ID.test(APP_ID))
    assert.ok(TRACKER_ID.test('10928'))
    assert.ok(!TRACKER_ID.test('../JobOrders'))
    assert.ok(!TRACKER_ID.test('a b'))
  })
})

describe('tracker lookup (api/_tracker.js)', () => {
  it('reads the Application row, then its job order by the 21-digit code, and nothing else', async () => {
    const { upstream, calls } = fakeUpstream({ ...appRoute, [JO_BY_ROW]: { status: 200, data: scheduledRow } })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(APP_ID)

    assert.equal(r.status, 200)
    assert.equal(r.body.status, 'Scheduled')
    assert.equal(r.body.id, ROW_ID)
    assert.equal(r.body.applicationid, APP_ID)
    assert.equal(r.body.jobOrderId, 3980)
    assert.equal(r.body.scheduledDate, '2026-09-16')
    assert.equal(r.body.rescheduleReason, 'I will go to manila.')
    assert.deepEqual(calls, [`/api/Applications/${APP_ID}`, JO_BY_ROW])
    // Application privacy fields and job order image fields never reach the browser.
    assert.equal(r.body.governmentValidId, undefined)
    assert.equal(r.body.userEmail, undefined)
    assert.equal(JSON.stringify(r.body).includes('base64'), false)
    assert.equal(JSON.stringify(r.body).includes('tech@switchfiber.ph'), false)
  })

  it('keeps the application at its own stage when no job order is linked yet', async () => {
    const { upstream, calls } = fakeUpstream({ ...appRoute, [JO_BY_ROW]: { status: 404, data: { title: 'Job order not found' } } })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(APP_ID)

    assert.equal(r.status, 200)
    assert.equal(r.body.status, 'Inprogress')
    assert.equal(r.body.jobOrderId, undefined)
    assert.deepEqual(calls, [`/api/Applications/${APP_ID}`, JO_BY_ROW], 'no list or billing scans for a 404')
  })

  it('never reads a job order by the Applications row number', async () => {
    const { upstream, calls } = fakeUpstream({ ...appRoute, [`/api/JobOrders/applicationid/${ROW_ID}`]: { status: 200, data: scheduledRow } })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(APP_ID)
    assert.equal(r.body.status, 'Inprogress')
    assert.ok(!calls.includes(`/api/JobOrders/applicationid/${ROW_ID}`))
  })

  it('leaves an application Inprogress while its job order is still Inprogress', async () => {
    // Live shape: job order 4108 for 202609092047231836775 was created with status Inprogress.
    const { upstream } = fakeUpstream({ ...appRoute, [JO_BY_ROW]: { status: 200, data: { ...scheduledRow, id: 4108, status: 'Inprogress', installationDate: null } } })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(APP_ID)
    assert.equal(r.body.status, 'Inprogress')
    assert.equal(r.body.jobOrderId, undefined)
    assert.equal(r.body.scheduledDate, undefined)
  })

  it('ignores a job order for another applicant even when the backend links it to this code', async () => {
    const stranger = { ...scheduledRow, firstName: 'Rochelle', lastName: 'Cebanico', contactNumber: '9922269573', secondContactNumber: '' }
    const { upstream } = fakeUpstream({ ...appRoute, [JO_BY_ROW]: { status: 200, data: stranger } })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(APP_ID)
    assert.equal(r.body.status, 'Inprogress')
    assert.equal(r.body.jobOrderId, undefined)
    assert.equal(r.body.scheduledDate, undefined)
  })

  it('accepts the job order on a phone match alone, or on first and last name alone', () => {
    const app = { firstName: 'Blaine', lastName: 'Sample', mobileNumber: '09171234567' }
    assert.equal(jobOrderBelongsTo(app, { firstName: 'Typo', lastName: 'Sample', contactNumber: '+63 917 123 4567' }), true)
    assert.equal(jobOrderBelongsTo(app, { firstName: 'Blaine', lastName: 'Sample', contactNumber: '', secondContactNumber: '' }), true)
    assert.equal(jobOrderBelongsTo(app, { firstName: 'Blaine', lastName: 'Sample', contactNumber: '9998887777' }), true)
    assert.equal(jobOrderBelongsTo(app, { firstName: 'Blaine', lastName: 'Other', contactNumber: '9998887777' }), false)
    assert.equal(jobOrderBelongsTo({ id: 1 }, { firstName: '', lastName: '' }), false)
    assert.equal(jobOrderBelongsTo(app, { contactNumber: '4567' }), false, 'short fragments never match')
  })

  it('ignores a job order that links to a different application row', async () => {
    const { upstream } = fakeUpstream({ ...appRoute, [JO_BY_ROW]: { status: 200, data: { ...scheduledRow, applicationId: '99' } } })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(APP_ID)
    assert.equal(r.body.status, 'Inprogress')
    assert.equal(r.body.jobOrderId, undefined)
  })

  it('does not let a Completed row jump an application that still says Schedule', async () => {
    const { upstream } = fakeUpstream({
      [`/api/Applications/${APP_ID}`]: { status: 200, data: { ...application, status: 'Schedule' } },
      [JO_BY_ROW]: { status: 200, data: completedRow }
    })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(APP_ID)
    assert.equal(r.body.status, 'Schedule')
    assert.equal(r.body.jobOrderId, undefined)
  })

  it('upgrades a Completed row to Activated when billing carries the job order account', async () => {
    const { upstream, calls } = fakeUpstream({
      ...appRoute,
      [JO_BY_ROW]: { status: 200, data: completedRow },
      '/api/BillingDetails': { status: 200, data: [{ id: 901, accountNo: '202609123', dateInstalled: '2026-09-11T00:00:00', routerModemSn: 'SN-1' }] }
    })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(APP_ID)
    assert.equal(r.body.status, 'Activated')
    assert.equal(r.body.billingId, 901)
    assert.equal(r.body.routerModemSn, 'SN-1')
    assert.ok(calls.includes('/api/BillingDetails'))
  })

  it('reads Activated straight from the job order and caches billing across Completed lookups', async () => {
    let billingFetches = 0
    const { upstream, calls } = fakeUpstream({
      ...appRoute,
      [JO_BY_ROW]: { status: 200, data: { ...activatedRow, id: 4001, applicationId: APP_ID, firstName: "Blaine", lastName: "Sample", contactNumber: "9171234567" } },
      '/api/Applications/202608099999999999999': { status: 200, data: { ...application, id: 2, applicationid: '202608099999999999999' } },
      '/api/JobOrders/applicationid/202608099999999999999': { status: 200, data: { ...completedRow, applicationId: '202608099999999999999' } },
      '/api/BillingDetails': () => {
        billingFetches++
        return { status: 200, data: [{ id: 1, accountNo: 'other' }] }
      }
    })
    let clock = 1_000_000
    const t = createTrackerLookup({ upstream, now: () => clock })

    const first = await t.lookupApplication(APP_ID)
    assert.equal(first.body.status, 'Activated')
    assert.equal(first.body.jobOrderId, 4001)
    assert.ok(!calls.includes('/api/BillingDetails'), 'an Activated job order needs no billing read')

    await t.lookupApplication('202608099999999999999')
    clock += 60_000
    const again = await t.lookupApplication('202608099999999999999')
    assert.equal(again.body.status, 'Completed')
    assert.equal(billingFetches, 1, 'billing is cached, not re-downloaded per lookup')
  })

  it('builds a record from the job order when an application row number is typed', async () => {
    const { upstream, calls } = fakeUpstream({
      '/api/Applications/10928': { status: 404, data: { title: 'Application not found' } },
      '/api/JobOrders/applicationid/10928': { status: 200, data: activatedRow }
    })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication('10928')
    assert.equal(r.status, 200)
    assert.equal(r.body.id, 10928)
    assert.equal(r.body.applicationid, '10928')
    assert.equal(r.body.firstName, 'Mahater')
    assert.equal(r.body.desiredPlan, 'SwitchLite - P699')
    assert.equal(r.body.city, 'Binangonan')
    assert.equal(r.body.status, 'Activated')
    assert.equal(r.body.jobOrderId, 1)
    assert.equal(r.body.dateInstalled, '2025-03-11T00:00:00')
    assert.deepEqual(calls, ['/api/Applications/10928', '/api/JobOrders/applicationid/10928'])
    const text = JSON.stringify(r.body)
    assert.equal(text.includes('Job Order_Images'), false)
    assert.equal(text.includes('switchfiber.ph'), false)
  })

  it('promotes a Completed row-number lookup through billing', async () => {
    const { upstream } = fakeUpstream({
      '/api/Applications/10928': { status: 404, data: null },
      '/api/JobOrders/applicationid/10928': { status: 200, data: { ...activatedRow, status: 'Completed' } },
      '/api/BillingDetails': { status: 200, data: [{ id: 289, accountNo: '202308503', routerModemSn: 'SN-9' }] }
    })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication('10928')
    assert.equal(r.body.status, 'Activated')
    assert.equal(r.body.billingId, 289)
    assert.equal(r.body.routerModemSn, 'SN-9')
  })

  it('never asks the job order endpoint about a non-numeric unknown identifier', async () => {
    const { upstream, calls } = fakeUpstream({ '/api/Applications/UNKNOWN1': { status: 404, data: null } })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication('UNKNOWN1')
    assert.equal(r.status, 404)
    assert.deepEqual(calls, ['/api/Applications/UNKNOWN1'])
  })

  it('returns 404 when neither source knows a row number', async () => {
    const { upstream, calls } = fakeUpstream({})
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication('999999999')
    assert.equal(r.status, 404)
    assert.deepEqual(calls, ['/api/Applications/999999999', '/api/JobOrders/applicationid/999999999'])
  })

  it('rejects identifiers the proxy allowlist would reject, without calling upstream', async () => {
    const { upstream, calls } = fakeUpstream({})
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication('../JobOrders/1')
    assert.equal(r.status, 404)
    assert.deepEqual(calls, [])
  })

  it('masks upstream 5xx as a generic 502', async () => {
    const { upstream } = fakeUpstream({ [`/api/Applications/${APP_ID}`]: { status: 500, data: { stack: 'SqlException at dbo.Applications' } } })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(APP_ID)
    assert.equal(r.status, 502)
    assert.equal(JSON.stringify(r.body).includes('Sql'), false)
  })

  it('survives a failing job order read and still returns the application', async () => {
    const { upstream } = fakeUpstream({ ...appRoute, [JO_BY_ROW]: () => { throw new Error('socket hang up') } })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(APP_ID)
    assert.equal(r.status, 200)
    assert.equal(r.body.status, 'Inprogress')
  })
})

describe('api/Applications/[id].js handler', () => {
  it('rejects non-GET methods and answers OPTIONS', async () => {
    const { default: handler } = await import('../api/Applications/[id].js')
    const res = () => {
      const headers = {}
      return {
        headers, statusCode: 200, body: '',
        setHeader(k, v) { headers[k.toLowerCase()] = v },
        status(c) { this.statusCode = c; return this },
        end(p) { if (p) this.body = p }
      }
    }
    const post = res()
    await handler({ method: 'POST', query: { id: APP_ID } }, post)
    assert.equal(post.statusCode, 405)

    const opt = res()
    await handler({ method: 'OPTIONS', query: { id: APP_ID } }, opt)
    assert.equal(opt.statusCode, 204)
    assert.equal(opt.headers['allow'], 'GET, OPTIONS')
  })
})
