import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createTrackerLookup, JOB_ORDER_ID, TRACKER_ID } from '../api/_tracker.js'

// Shapes mirror live rows (sample IDs, not real customers).
const APP_ID = '202609030028571738368'
const application = {
  id: 15476,
  applicationid: APP_ID,
  firstName: 'Blaine',
  lastName: 'Sample',
  desiredPlan: 'SwitchLite - P699',
  status: 'Inprogress',
  governmentValidId: 'drive.google.com/private',
  userEmail: 'staff@switchfiber.ph'
}
const scheduledRow = {
  id: 3980,
  accountNo: APP_ID,
  applicationIdValue: '',
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
const activatedRow = { id: 12, accountNo: '202308505', status: 'Activated', dateInstalled: '2023-08-20T00:00:00', modifiedDate: '2023-08-21T00:00:00' }
const completedRow = { id: 3975, accountNo: APP_ID, status: 'Completed', modifiedDate: '2026-09-10T00:00:00', remarks: 'Installed, modem SN 123' }

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
const emptyLists = {
  '/api/JobOrders/status/Scheduled': { status: 200, data: [] },
  '/api/JobOrders/status/Completed': { status: 200, data: [] },
  '/api/BillingDetails': { status: 200, data: [] },
  '/api/JobOrders/status/Activated': { status: 200, data: [] }
}

describe('tracker id patterns', () => {
  it('accepts numeric job order ids and public application ids only', () => {
    assert.ok(JOB_ORDER_ID.test('3980'))
    assert.ok(!JOB_ORDER_ID.test('39a80'))
    assert.ok(!JOB_ORDER_ID.test(''))
    assert.ok(TRACKER_ID.test(APP_ID))
    assert.ok(TRACKER_ID.test('202309248'))
    assert.ok(!TRACKER_ID.test('../JobOrders'))
    assert.ok(!TRACKER_ID.test('a b'))
  })
})

describe('tracker lookup (api/_tracker.js)', () => {
  it('with a valid hint reads only GET /api/JobOrders/{id} and never a status list', async () => {
    const { upstream, calls } = fakeUpstream({
      ...appRoute,
      '/api/JobOrders/3980': { status: 200, data: scheduledRow }
    })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(APP_ID, { hint: '3980' })

    assert.equal(r.status, 200)
    assert.equal(r.body.status, 'Scheduled')
    assert.equal(r.body.jobOrderId, 3980)
    assert.equal(r.body.scheduledDate, '2026-09-16')
    assert.equal(r.body.rescheduleReason, 'I will go to manila.')
    assert.deepEqual(calls, [`/api/Applications/${APP_ID}`, '/api/JobOrders/3980'])
    // Application privacy fields and job order image fields never reach the browser.
    assert.equal(r.body.governmentValidId, undefined)
    assert.equal(r.body.userEmail, undefined)
    assert.equal(JSON.stringify(r.body).includes('base64'), false)
    assert.equal(JSON.stringify(r.body).includes('tech@switchfiber.ph'), false)
  })

  it('ignores a hint that belongs to another applicant', async () => {
    const { upstream, calls } = fakeUpstream({
      ...appRoute,
      ...emptyLists,
      '/api/JobOrders/12': { status: 200, data: activatedRow }
    })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(APP_ID, { hint: '12' })

    assert.equal(r.status, 200)
    assert.equal(r.body.status, 'Inprogress')
    assert.equal(r.body.jobOrderId, undefined)
    assert.ok(calls.includes('/api/JobOrders/12'))
    assert.ok(calls.includes('/api/JobOrders/status/Scheduled'))
  })

  it('without a hint discovers the id in the small Scheduled list, then reads the row by id', async () => {
    const { upstream, calls } = fakeUpstream({
      ...appRoute,
      '/api/JobOrders/status/Scheduled': { status: 200, data: [{ id: 3980, accountNo: APP_ID, status: 'Scheduled', installationDate: '2026-09-09T00:00:00' }] },
      // Fresh row already carries a newer date than the list snapshot.
      '/api/JobOrders/3980': { status: 200, data: scheduledRow }
    })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(APP_ID)

    assert.equal(r.body.status, 'Scheduled')
    assert.equal(r.body.scheduledDate, '2026-09-16')
    assert.equal(r.body.jobOrderId, 3980)
    assert.ok(!calls.includes('/api/JobOrders/status/Activated'), 'must not download the Activated list')
    assert.ok(!calls.includes('/api/BillingDetails'), 'a Scheduled row needs no billing check')
  })

  it('falls back to the list row when the per-id read fails', async () => {
    const listRow = { id: 3980, accountNo: APP_ID, status: 'Scheduled', installationDate: '2026-09-09T00:00:00' }
    const { upstream } = fakeUpstream({
      ...appRoute,
      '/api/JobOrders/status/Scheduled': { status: 200, data: [listRow] },
      '/api/JobOrders/3980': { status: 502, data: null }
    })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(APP_ID)
    assert.equal(r.body.status, 'Scheduled')
    assert.equal(r.body.scheduledDate, '2026-09-09')
  })

  it('does not let a Completed row jump an application that still says Schedule', async () => {
    const { upstream } = fakeUpstream({
      [`/api/Applications/${APP_ID}`]: { status: 200, data: { ...application, status: 'Schedule' } },
      '/api/JobOrders/3975': { status: 200, data: completedRow }
    })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(APP_ID, { hint: '3975' })
    assert.equal(r.body.status, 'Schedule')
    assert.equal(r.body.jobOrderId, undefined)
  })

  it('upgrades a Completed row to Activated when billing already has the account', async () => {
    const { upstream } = fakeUpstream({
      ...appRoute,
      '/api/JobOrders/3975': { status: 200, data: completedRow },
      '/api/BillingDetails': { status: 200, data: [{ id: 901, accountNo: APP_ID, dateInstalled: '2026-09-11T00:00:00', routerModemSn: 'SN-1' }] }
    })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(APP_ID, { hint: '3975' })
    assert.equal(r.body.status, 'Activated')
    assert.equal(r.body.billingId, 901)
    assert.equal(r.body.routerModemSn, 'SN-1')
  })

  it('reads the Activated list only as a last resort and reuses its index across lookups', async () => {
    let activatedFetches = 0
    const { upstream, calls } = fakeUpstream({
      [`/api/Applications/${APP_ID}`]: { status: 200, data: application },
      '/api/Applications/202608099999999999999': { status: 200, data: { ...application, id: 2, applicationid: '202608099999999999999' } },
      '/api/JobOrders/status/Scheduled': { status: 200, data: [] },
      '/api/JobOrders/status/Completed': { status: 200, data: [] },
      '/api/BillingDetails': { status: 200, data: [] },
      '/api/JobOrders/status/Activated': () => {
        activatedFetches++
        return { status: 200, data: [{ ...activatedRow, id: 4001, accountNo: APP_ID, houseFront: 'x'.repeat(1000) }] }
      },
      '/api/JobOrders/4001': { status: 200, data: { ...activatedRow, id: 4001, accountNo: APP_ID } }
    })
    let clock = 1_000_000
    const t = createTrackerLookup({ upstream, now: () => clock })

    const first = await t.lookupApplication(APP_ID)
    assert.equal(first.body.status, 'Activated')
    assert.equal(first.body.jobOrderId, 4001)
    const order = calls.slice()
    assert.ok(order.indexOf('/api/JobOrders/status/Activated') > order.indexOf('/api/BillingDetails'))

    clock += 60_000
    const second = await t.lookupApplication('202608099999999999999')
    assert.equal(second.body.status, 'Inprogress')
    assert.equal(activatedFetches, 1, 'index is cached, not re-downloaded per lookup')
  })

  it('builds a record from dispatch for account numbers without an Application row', async () => {
    const legacy = '202309248'
    const row = { id: 846, accountNo: legacy, status: 'Scheduled', firstName: 'Juan', lastName: 'Dela Cruz', planId: 'SwitchNet - P999', installationDate: '2026-09-20T00:00:00', contactNumber: '09171234567' }
    const { upstream } = fakeUpstream({
      [`/api/Applications/${legacy}`]: { status: 404, data: null },
      '/api/JobOrders/status/Scheduled': { status: 200, data: [row] },
      '/api/JobOrders/846': { status: 200, data: row }
    })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(legacy)
    assert.equal(r.status, 200)
    assert.equal(r.body.applicationid, legacy)
    assert.equal(r.body.firstName, 'Juan')
    assert.equal(r.body.desiredPlan, 'SwitchNet - P999')
    assert.equal(r.body.status, 'Scheduled')
    assert.equal(r.body.jobOrderId, 846)
    assert.equal(r.body.scheduledDate, '2026-09-20')
  })

  it('builds an Activated record from billing when nothing else matches', async () => {
    const legacy = '202311373'
    const { upstream } = fakeUpstream({
      [`/api/Applications/${legacy}`]: { status: 404, data: null },
      ...emptyLists,
      '/api/BillingDetails': { status: 200, data: [{ id: 289, accountNo: legacy, fullName: 'Maria Clara Santos', plan: 'SwitchNet - P999', dateInstalled: '2023-11-20T00:00:00', accountBalance: 1200 }] }
    })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication(legacy)
    assert.equal(r.status, 200)
    assert.equal(r.body.status, 'Activated')
    assert.equal(r.body.firstName, 'Maria')
    assert.equal(r.body.lastName, 'Clara Santos')
    assert.equal(r.body.accountBalance, undefined)
  })

  it('returns 404 when no source knows the identifier', async () => {
    const { upstream } = fakeUpstream({ '/api/Applications/UNKNOWN1': { status: 404, data: null }, ...emptyLists })
    const t = createTrackerLookup({ upstream })
    const r = await t.lookupApplication('UNKNOWN1')
    assert.equal(r.status, 404)
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
})

describe('api/Applications/[id].js handler', () => {
  it('passes the ?jo hint through and rejects non-GET methods', async () => {
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
