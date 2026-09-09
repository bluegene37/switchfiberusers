import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  validateServiceOrderPayload,
  sanitizeServiceOrderRecord,
  sanitizeServiceOrdersData
} from '../api/ServiceOrders.js'
import { getAllowedMethods } from '../api/_proxy.js'
import { CONCERN_CATEGORIES, PHILIPPINE_MOBILE_REGEX } from '../src/stores/serviceOrder.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('Service Orders API & Data Handling', () => {
  describe('validateServiceOrderPayload', () => {
    it('rejects null or non-object payloads', () => {
      assert.equal(validateServiceOrderPayload(null).ok, false)
      assert.equal(validateServiceOrderPayload('invalid').ok, false)
      assert.match(validateServiceOrderPayload(null).error, /JSON object/i)
    })

    it('rejects payloads missing both fullName and accountNumber', () => {
      const res = validateServiceOrderPayload({
        contactNumber: '09151234567',
        address: '123 Batingan St',
        concern: 'No internet connection'
      })
      assert.equal(res.ok, false)
      assert.match(res.error, /Full name or Account Number is required/i)
    })

    it('rejects payloads with missing or invalid contact numbers', () => {
      const missing = validateServiceOrderPayload({
        fullName: 'Juan Dela Cruz',
        contactNumber: '',
        address: '123 Batingan St',
        concern: 'Red light on modem'
      })
      assert.equal(missing.ok, false)
      assert.match(missing.error, /Contact number is required/i)

      const short = validateServiceOrderPayload({
        fullName: 'Juan Dela Cruz',
        contactNumber: '12345',
        address: '123 Batingan St',
        concern: 'Red light on modem'
      })
      assert.equal(short.ok, false)
      assert.match(short.error, /valid contact number/i)
    })

    it('rejects payloads with missing address or concern', () => {
      const noAddress = validateServiceOrderPayload({
        fullName: 'Juan Dela Cruz',
        contactNumber: '09151234567',
        address: '   ',
        concern: 'Red light on modem'
      })
      assert.equal(noAddress.ok, false)
      assert.match(noAddress.error, /address is required/i)

      const noConcern = validateServiceOrderPayload({
        fullName: 'Juan Dela Cruz',
        contactNumber: '09151234567',
        address: '123 Batingan St',
        concern: '   '
      })
      assert.equal(noConcern.ok, false)
      assert.match(noConcern.error, /describe your concern/i)
    })

    it('rejects malformed email addresses', () => {
      const badEmail = validateServiceOrderPayload({
        fullName: 'Juan Dela Cruz',
        contactNumber: '09151234567',
        address: '123 Batingan St',
        concern: 'Red light on modem',
        emailAddress: 'notanemail'
      })
      assert.equal(badEmail.ok, false)
      assert.match(badEmail.error, /valid email address/i)
    })

    it('accepts a valid payload with complete details', () => {
      const valid = validateServiceOrderPayload({
        accountNumber: '202311373',
        fullName: 'Aaron James O Vergara',
        contactNumber: '09532666093',
        emailAddress: 'jinkyapacible75@gmail.com',
        address: '281 Cordillera St Villamayor Cpd',
        concern: 'Intermittent Wi-Fi signal during evening hours'
      })
      assert.equal(valid.ok, true)
    })
  })

  describe('sanitizeServiceOrderRecord', () => {
    it('strips internal staff emails, credentials, and tech modified timestamps', () => {
      const raw = {
        id: 888,
        accountNumber: '202311373',
        fullName: 'Aaron James O Vergara',
        contactNumber: '09532666093',
        emailAddress: 'jinkyapacible75@gmail.com',
        address: '281 Cordillera St Villamayor Cpd',
        concern: 'No Internet / LOS',
        supportStatus: 'In Progress',
        visitStatus: 'In Progress',
        assignedEmail: 'technician@switchfiber.ph',
        assignedBy: 'dispatch_admin',
        assignedDate: '2026-09-09T10:00:00',
        techModifiedDate: '2026-09-09T11:00:00',
        userEmail: 'support_staff@switchfiber.ph',
        modifiedBy: 'System Auto-Route',
        splynxId: 99912,
        mikrotikId: 442
      }

      const sanitized = sanitizeServiceOrderRecord(raw)
      assert.equal(sanitized.id, 888)
      assert.equal(sanitized.accountNumber, '202311373')
      assert.equal(sanitized.fullName, 'Aaron James O Vergara')
      assert.equal(sanitized.supportStatus, 'In Progress')
      assert.equal(sanitized.visitStatus, 'In Progress')

      assert.equal(sanitized.assignedEmail, undefined)
      assert.equal(sanitized.assignedBy, undefined)
      assert.equal(sanitized.assignedDate, undefined)
      assert.equal(sanitized.techModifiedDate, undefined)
      assert.equal(sanitized.userEmail, undefined)
      assert.equal(sanitized.modifiedBy, undefined)
      assert.equal(sanitized.splynxId, undefined)
      assert.equal(sanitized.mikrotikId, undefined)
    })

    it('handles arrays and nulls cleanly in sanitizeServiceOrdersData', () => {
      assert.deepEqual(sanitizeServiceOrdersData(null), [])
      assert.equal(sanitizeServiceOrdersData([{ id: 1, assignedEmail: 'x@y.com' }])[0].assignedEmail, undefined)
    })
  })

  describe('Proxy Allowlist Integration', () => {
    it('allows GET and POST for /api/ServiceOrders', () => {
      const allowed = getAllowedMethods('/api/ServiceOrders')
      assert.ok(allowed)
      assert.ok(allowed.includes('GET'))
      assert.ok(allowed.includes('POST'))
    })

    it('allows GET and PUT for specific Service Order IDs (/api/ServiceOrders/:id)', () => {
      const allowed = getAllowedMethods('/api/ServiceOrders/888')
      assert.ok(allowed)
      assert.ok(allowed.includes('GET'))
      assert.ok(allowed.includes('PUT'))
    })
  })

  describe('Store Constants & Validation Rules', () => {
    it('verifies 11-digit Philippine mobile regex requiring 09 prefix', () => {
      assert.equal(PHILIPPINE_MOBILE_REGEX.test('09151234567'), true)
      assert.equal(PHILIPPINE_MOBILE_REGEX.test('09998887777'), true)
      assert.equal(PHILIPPINE_MOBILE_REGEX.test('08151234567'), false)
      assert.equal(PHILIPPINE_MOBILE_REGEX.test('0915123456'), false)
      assert.equal(PHILIPPINE_MOBILE_REGEX.test('091512345678'), false)
      assert.equal(PHILIPPINE_MOBILE_REGEX.test('9151234567'), false)
    })

    it('provides operational concern categories', () => {
      assert.ok(CONCERN_CATEGORIES.length >= 5)
      assert.ok(CONCERN_CATEGORIES.some(c => c.includes('No Internet')))
      assert.ok(CONCERN_CATEGORIES.some(c => c.includes('Slow Internet')))
      assert.ok(CONCERN_CATEGORIES.some(c => c.includes('Billing')))
    })
  })

  describe('UI Component & View Wiring', () => {
    it('embeds ServiceConcernForm inside ContactView.vue hidden by default behind showServiceOrderForm flag', () => {
      const contactViewPath = path.resolve(__dirname, '../src/views/ContactView.vue')
      const content = fs.readFileSync(contactViewPath, 'utf8')

      assert.ok(content.includes('ServiceConcernForm'), 'ContactView must import ServiceConcernForm')
      assert.ok(content.includes('id="concern-form"'), 'ContactView must contain #concern-form anchor section')
      assert.ok(content.includes('showServiceOrderForm'), 'ContactView must guard concern form with showServiceOrderForm')
    })

    it('includes customer support ticket form fields in ServiceConcernForm.vue', () => {
      const formPath = path.resolve(__dirname, '../src/components/ServiceConcernForm.vue')
      const content = fs.readFileSync(formPath, 'utf8')

      assert.ok(content.includes('sf-account-lookup'), 'Form must include Account Number lookup field')
      assert.ok(content.includes('sf-fullname'), 'Form must include Full Name input')
      assert.ok(content.includes('sf-contact'), 'Form must include Contact Number input')
      assert.ok(content.includes('sf-address'), 'Form must include Address input')
      assert.ok(content.includes('sf-category'), 'Form must include Category selector')
      assert.ok(content.includes('sf-details'), 'Form must include Details textarea')
      assert.ok(content.includes('In Progress'), 'Form must explicitly mention In Progress queue status')
      assert.ok(content.includes('submittedTicket'), 'Form must render ticket receipt state upon success')
    })

    it('mirrors /api/ServiceOrders in vite.config.js dev server middleware', () => {
      const vitePath = path.resolve(__dirname, '../vite.config.js')
      const content = fs.readFileSync(vitePath, 'utf8')

      assert.ok(content.includes('SERVICE_ORDERS'), 'vite.config.js must define SERVICE_ORDERS route matcher')
      assert.ok(content.includes('api/ServiceOrders.js'), 'vite.config.js must route to api/ServiceOrders.js in dev')
    })
  })
})
