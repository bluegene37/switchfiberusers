import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  provincesList,
  fallbackCitiesByProvince,
  coverageBarangaysByCity,
  normalizeCityName,
  samePlace
} from '../src/data/calabarzonLocations.js'
import { referrersList, mapApplicationStatus } from '../src/stores/registration.js'

describe('QA Form Validation & Domain Model Integrity', () => {

  describe('Personal Information & Input Boundary Rules', () => {
    const isValidName = (name) => typeof name === 'string' && name.trim().length >= 2 && /^[\p{L}\s.'-]+$/u.test(name.trim())
    const isValidEmail = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    const isValidPhMobile = (mobile) => {
      if (typeof mobile !== 'string') return false
      const clean = mobile.replace(/\D/g, '')
      return clean.length === 11 && clean.startsWith('09')
    }

    it('validates first and last name boundary conditions', () => {
      assert.equal(isValidName('Juan'), true)
      assert.equal(isValidName('Ma. Teresa'), true)
      assert.equal(isValidName('José-Luis'), true)
      assert.equal(isValidName('A'), false, '1-character name must fail')
      assert.equal(isValidName('   '), false, 'Whitespace must fail')
      assert.equal(isValidName('12345'), false, 'Numbers in name must fail')
      assert.equal(isValidName('<script>'), false, 'Script injection in name must fail')
    })

    it('validates Philippine mobile phone number formats', () => {
      assert.equal(isValidPhMobile('09171234567'), true)
      assert.equal(isValidPhMobile('0915-407-7565'), true)
      assert.equal(isValidPhMobile('0922 888 9999'), true)
      assert.equal(isValidPhMobile('08171234567'), false, 'Must start with 09')
      assert.equal(isValidPhMobile('0917123456'), false, '10 digits must fail')
      assert.equal(isValidPhMobile('091712345678'), false, '12 digits must fail')
      assert.equal(isValidPhMobile('abcdefghijk'), false, 'Alpha characters must fail')
    })

    it('validates email format boundaries', () => {
      assert.equal(isValidEmail('juan.delacruz@example.com'), true)
      assert.equal(isValidEmail('applicant+switch@fiber.ph'), true)
      assert.equal(isValidEmail('invalid-email'), false)
      assert.equal(isValidEmail('user@'), false)
      assert.equal(isValidEmail('@domain.com'), false)
      assert.equal(isValidEmail('user @domain.com'), false)
    })
  })

  describe('Location Cascade & Coverage Integrity', () => {
    it('verifies Rizal province contains key operational municipalities', () => {
      const rizalCities = fallbackCitiesByProvince['Rizal']
      assert.ok(Array.isArray(rizalCities))
      assert.ok(rizalCities.includes('Binangonan'))
      assert.ok(rizalCities.includes('Angono'))
      assert.ok(rizalCities.includes('Taytay'))
      assert.ok(rizalCities.includes('Antipolo City'))
    })

    it('verifies Binangonan has coverage barangays registered', () => {
      const binangonanBarangays = coverageBarangaysByCity['Binangonan']
      assert.ok(Array.isArray(binangonanBarangays))
      assert.ok(binangonanBarangays.length > 5)
      assert.ok(binangonanBarangays.includes('Batingan'))
      assert.ok(binangonanBarangays.includes('Darangan'))
      assert.ok(binangonanBarangays.includes('Calumpang'))
    })

    it('verifies city name normalization handles prefixes consistently', () => {
      assert.equal(normalizeCityName('City of Antipolo'), 'Antipolo City')
      assert.equal(normalizeCityName('Binangonan'), 'Binangonan')
      assert.equal(normalizeCityName('City of Calamba'), 'Calamba City')
    })
  })

  describe('Application ID Format & Validation', () => {
    const isValidAppId = (id) => typeof id === 'string' && /^[a-zA-Z0-9_-]{1,40}$/.test(id.trim())
    const isNumericAppId = (id) => typeof id === 'string' && /^\d+$/.test(id.trim())

    it('validates standard database numeric application IDs', () => {
      assert.equal(isNumericAppId('13295'), true)
      assert.equal(isNumericAppId('1'), true)
      assert.equal(isNumericAppId('100045'), true)
      assert.equal(isNumericAppId('SF-1234'), false)
      assert.equal(isNumericAppId(''), false)
    })

    it('validates tracking input parser for various ID formats', () => {
      assert.equal(isValidAppId('13295'), true)
      assert.equal(isValidAppId('2026-8942'), true)
      assert.equal(isValidAppId('DEMO-8942'), true)
      assert.equal(isValidAppId('202609012251532731662'), true)
      assert.equal(isValidAppId(''), false)
      assert.equal(isValidAppId('ID with spaces'), false)
      assert.equal(isValidAppId('<script>'), false)
    })
  })

  describe('Plan Pricing & Promo Derivation Rules', () => {
    const plans = [
      { id: '1', title: 'SwitchLite Plan', price: 699, router: 'Dual-Band ONU', mesh: 'Optional Add-on' },
      { id: '2', title: 'SwitchConnect Plan', price: 799, router: 'Dual-Band ONU', mesh: 'Optional Add-on' },
      { id: '3', title: 'SwitchNet Plan', price: 999, router: 'Wi-Fi 6 Dual Band', mesh: 'Optional Add-on' },
      { id: '4', title: 'SwitchSpeed Plan', price: 1299, router: 'Wi-Fi 6 Dual Band', mesh: '1 Node' },
      { id: '5', title: 'SwitchUltra Plan', price: 1499, router: 'Wi-Fi 6 Dual Band', mesh: '2 Nodes' }
    ]

    const derivePromo = (plan) => {
      if (!plan) return 'Free Installation Promo'
      if (/node/i.test(plan.mesh || '')) return 'Free Mesh Wi-Fi Router'
      if (/wi-?fi\s*6/i.test(plan.router || '')) return 'Free Dual-Band Wi-Fi 6 Router'
      return 'Free Installation Promo'
    }

    it('correctly maps plan hardware inclusions to promotional entitlements', () => {
      assert.equal(derivePromo(plans[0]), 'Free Installation Promo')
      assert.equal(derivePromo(plans[1]), 'Free Installation Promo')
      assert.equal(derivePromo(plans[2]), 'Free Dual-Band Wi-Fi 6 Router')
      assert.equal(derivePromo(plans[3]), 'Free Mesh Wi-Fi Router')
      assert.equal(derivePromo(plans[4]), 'Free Mesh Wi-Fi Router')
    })
  })

  describe('Application Status & Timeline Progression Mapping', () => {
    it('maps InProgress / default to Under Verification and Review (Stage 1)', () => {
      const res1 = mapApplicationStatus('In Progress')
      assert.equal(res1.status, 'Under Verification and Review')
      assert.equal(res1.step, 1)

      const res2 = mapApplicationStatus('InProgress')
      assert.equal(res2.status, 'Under Verification and Review')
      assert.equal(res2.step, 1)

      const res3 = mapApplicationStatus('Under Review')
      assert.equal(res3.status, 'Under Verification and Review')
      assert.equal(res3.step, 1)

      const res4 = mapApplicationStatus(null)
      assert.equal(res4.status, 'Under Verification and Review')
      assert.equal(res4.step, 1)
    })

    it('maps Scheduled to Installation Scheduled (Stage 2)', () => {
      const res1 = mapApplicationStatus('Scheduled')
      assert.equal(res1.status, 'Installation Scheduled')
      assert.equal(res1.step, 2)

      const res2 = mapApplicationStatus('Schedule')
      assert.equal(res2.status, 'Installation Scheduled')
      assert.equal(res2.step, 2)

      const res3 = mapApplicationStatus('Dispatch')
      assert.equal(res3.status, 'Installation Scheduled')
      assert.equal(res3.step, 2)
    })

    it('maps Completed to Installation Completed (Stage 3)', () => {
      const res1 = mapApplicationStatus('Completed')
      assert.equal(res1.status, 'Installation Completed')
      assert.equal(res1.step, 3)

      const res2 = mapApplicationStatus('Installed')
      assert.equal(res2.status, 'Installation Completed')
      assert.equal(res2.step, 3)

      const res3 = mapApplicationStatus('Done')
      assert.equal(res3.status, 'Installation Completed')
      assert.equal(res3.step, 3)
    })

    it('maps Activated to Connection Activated (Stage 4)', () => {
      const res1 = mapApplicationStatus('Activated')
      assert.equal(res1.status, 'Connection Activated')
      assert.equal(res1.step, 4)

      const res2 = mapApplicationStatus('Active')
      assert.equal(res2.status, 'Connection Activated')
      assert.equal(res2.step, 4)

      const res3 = mapApplicationStatus('Connected')
      assert.equal(res3.status, 'Connection Activated')
      assert.equal(res3.step, 4)
    })

    it('correctly maps user case 1 (ID 202609030028571738368) Scheduled status to Stage 2 (Installation Scheduled)', () => {
      // Blaine Ivory Medel: JobOrder #3980 Scheduled
      const res = mapApplicationStatus('Scheduled', '2026-09-03T00:28:57.1876546+08:00', '202609030028571738368')
      assert.equal(res.status, 'Installation Scheduled')
      assert.equal(res.step, 2)
      assert.match(res.notes, /Field technician team has been scheduled/i)
    })

    it('correctly maps user case 2 (ID 202609022108129601933) Completed status to Stage 3 (Installation Completed)', () => {
      // JobOrder #3979 Completed
      const res = mapApplicationStatus('Completed', '2026-09-02T21:08:12.9632238+08:00', '202609022108129601933')
      assert.equal(res.status, 'Installation Completed')
      assert.equal(res.step, 3)
      assert.match(res.notes, /testing completed/i)
    })

    it('correctly maps user case 3 (ID 202609031055503936888) Inprogress to Stage 1 (Under Verification and Review)', () => {
      const res = mapApplicationStatus('Inprogress', '2026-09-03T10:55:50.405419+08:00', '202609031055503936888')
      assert.equal(res.status, 'Under Verification and Review')
      assert.equal(res.step, 1)
      assert.match(res.notes, /feasibility.*document verification/i)
    })

    it('correctly maps active billing account (ID 202609051237540773019) to Stage 4 (Connection Activated)', () => {
      const res = mapApplicationStatus('Active', '2026-09-05T12:55:34.077', '202609051237540773019')
      assert.equal(res.status, 'Connection Activated')
      assert.equal(res.step, 4)
      assert.match(res.notes, /active, provisioned, and operational/i)
    })

    it('correctly maps activated customer (ID 202609051554363299355) to Stage 4 (Connection Activated)', () => {
      // Activated in JobOrders #4101 and BillingDetails #857
      const res = mapApplicationStatus('Activated', '2026-09-05T16:19:35.18', '202609051554363299355')
      assert.equal(res.status, 'Connection Activated')
      assert.equal(res.step, 4)
      assert.match(res.notes, /active, provisioned, and operational/i)
    })
  })
})

