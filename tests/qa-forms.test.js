import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  provincesList,
  fallbackCitiesByProvince,
  coverageBarangaysByCity,
  normalizeCityName,
  samePlace
} from '../src/data/calabarzonLocations.js'
import { referrersList } from '../src/stores/registration.js'

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

  describe('Application Reference Number Generation & Format', () => {
    const generateRefCode = (date = new Date()) => {
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      const rand = Math.floor(1000 + Math.random() * 9000)
      return `SF-${y}${m}${d}-${rand}`
    }

    const REF_REGEX = /^SF-\d{8}-[A-Z0-9]{4}(?:-[A-Z0-9]{2})?$/i

    it('generates standard compliant application reference codes', () => {
      for (let i = 0; i < 20; i++) {
        const code = generateRefCode()
        assert.ok(REF_REGEX.test(code), `Generated code ${code} does not match expected format`)
      }
    })

    it('validates reference code search parser', () => {
      assert.equal(REF_REGEX.test('SF-20260829-1234'), true)
      assert.equal(REF_REGEX.test('SF-20260819-5821-01'), true)
      assert.equal(REF_REGEX.test('INVALID-CODE'), false)
      assert.equal(REF_REGEX.test('SF-1234'), false)
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
    const mapStatus = (status) => {
      const s = String(status || '').toLowerCase()
      if (s.includes('active') || s.includes('installed') || s.includes('connected') || s.includes('completed') || s.includes('done')) {
        return { status: 'Connection Active', step: 4 }
      }
      if (s.includes('schedule') || s.includes('dispatch') || s.includes('install')) {
        return { status: 'Installation Scheduled', step: 3 }
      }
      if (s.includes('review') || s.includes('verif') || s.includes('feasib') || s.includes('survey')) {
        return { status: 'Under Verification', step: 2 }
      }
      return { status: status || 'Application Submitted', step: 1 }
    }

    it('maps upstream API status values to standard 4-stage tracker steps', () => {
      assert.equal(mapStatus('Schedule').step, 3)
      assert.equal(mapStatus('Scheduled').step, 3)
      assert.equal(mapStatus('In Progress').step, 1)
      assert.equal(mapStatus('Under Review').step, 2)
      assert.equal(mapStatus('For Verification').step, 2)
      assert.equal(mapStatus('Active').step, 4)
      assert.equal(mapStatus('Installed').step, 4)
      assert.equal(mapStatus('Unknown').step, 1)
    })
  })
})
