import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { referrersList } from '../src/stores/registration.js'

describe('Domain Models & Store Utilities', () => {
  describe('referrersList', () => {
    it('contains "None" as the first and default option', () => {
      assert.ok(Array.isArray(referrersList))
      assert.equal(referrersList[0], 'None')
    })

    it('contains active accredited sales agents and partner branches', () => {
      assert.ok(referrersList.length > 20)
      assert.ok(referrersList.includes('SWITCH GAISANO'))
      assert.ok(referrersList.includes('Norwina A. Armas'))
    })
  })

  describe('HeroCoverageCard & Homepage Hero Architecture', () => {
    const heroCardSource = fs.readFileSync(path.resolve(process.cwd(), 'src/components/HeroCoverageCard.vue'), 'utf-8')
    const homeViewSource = fs.readFileSync(path.resolve(process.cwd(), 'src/views/HomeView.vue'), 'utf-8')

    it('mounts HeroCoverageCard in HomeView and removes dummy SpeedTestSim', () => {
      assert.ok(homeViewSource.includes('<HeroCoverageCard />'), 'HomeView should render HeroCoverageCard')
      assert.ok(!homeViewSource.includes('<SpeedTestSim />'), 'HomeView should not render dummy SpeedTestSim')
      assert.ok(!homeViewSource.includes('SpeedTestSim.vue'), 'HomeView should not import SpeedTestSim')
    })

    it('removes redundant secondary CoverageChecker section from HomeView', () => {
      assert.ok(!homeViewSource.includes('<CoverageChecker />'), 'HomeView should not contain redundant secondary CoverageChecker')
    })

    it('HeroCoverageCard provides accessible form controls with explicit labels and IDs', () => {
      assert.ok(heroCardSource.includes('for="hero-municipality-select"'), 'missing label for municipality select')
      assert.ok(heroCardSource.includes('id="hero-municipality-select"'), 'missing id for municipality select')
      assert.ok(heroCardSource.includes('for="hero-barangay-select"'), 'missing label for barangay select')
      assert.ok(heroCardSource.includes('id="hero-barangay-select"'), 'missing id for barangay select')
      assert.ok(heroCardSource.includes('for="hero-street-input"'), 'missing label for street input')
      assert.ok(heroCardSource.includes('id="hero-street-input"'), 'missing id for street input')
    })

    it('HeroCoverageCard enforces 44px touch targets on interactive controls', () => {
      assert.ok(heroCardSource.includes('min-h-[44px]'), 'controls must have min-h-[44px] floor')
    })

    it('HeroCoverageCard pre-fills registrationStore and routes to /register', () => {
      assert.match(heroCardSource, /registrationStore\.formData\.region\s*=\s*'Rizal'/)
      assert.match(heroCardSource, /registrationStore\.formData\.city\s*=/)
      assert.match(heroCardSource, /registrationStore\.formData\.barangay\s*=/)
      assert.match(heroCardSource, /router\.push\('\/register'\)/)
    })
  })
})
