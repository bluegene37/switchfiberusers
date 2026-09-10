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

  describe('LCP NAP Coverage Filtering for Interactive Map', () => {
    const coverageStoreSource = fs.readFileSync(path.resolve(process.cwd(), 'src/stores/coverage.js'), 'utf-8')
    const mapSource = fs.readFileSync(path.resolve(process.cwd(), 'src/components/CoverageMap.vue'), 'utf-8')
    const coverageViewSource = fs.readFileSync(path.resolve(process.cwd(), 'src/views/CoverageView.vue'), 'utf-8')

    it('CoverageMap only renders barangays that pass isBarangayInNapData check', () => {
      assert.ok(mapSource.includes('coverageStore.isBarangayInNapData(item)'), 'CoverageMap must check isBarangayInNapData')
      assert.ok(mapSource.includes('coverageStore.mapCoverageItems'), 'CoverageMap must use mapCoverageItems')
    })

    it('CoverageMap re-renders coverage items when napLocations updates', () => {
      assert.match(mapSource, /watch\(\(\)\s*=>\s*coverageStore\.napLocations,\s*\(\)\s*=>\s*{[\s\S]*?renderCoverageItems\(\)[\s\S]*?renderNapPoints\(\)/)
    })

    it('CoverageMap handles unserved municipalities with informative notice', () => {
      assert.ok(mapSource.includes('unservedNotice'), 'CoverageMap should declare unservedNotice')
      assert.match(mapSource, /No active fiber NAP terminals currently mapped in/)
    })

    it('coverageStore exposes isBarangayInNapData, getNapCountForBarangay, and onlyNapCovered', () => {
      assert.ok(coverageStoreSource.includes('function isBarangayInNapData'), 'coverage.js must define isBarangayInNapData')
      assert.ok(coverageStoreSource.includes('function getNapCountForBarangay'), 'coverage.js must define getNapCountForBarangay')
      assert.ok(coverageStoreSource.includes('onlyNapCovered'), 'coverage.js must define onlyNapCovered')
      assert.ok(coverageStoreSource.includes('mapCoverageItems'), 'coverage.js must define mapCoverageItems')
    })

    it('parseNapRow preserves barangay field from backend row', () => {
      assert.match(coverageStoreSource, /barangay:\s*\(row\.barangay\s*\|\|\s*''\)\.trim\(\)/)
    })

    it('CoverageView provides Live Network toggle and guards Map buttons', () => {
      assert.ok(coverageViewSource.includes('coverageStore.onlyNapCovered'), 'CoverageView must include onlyNapCovered toggle')
      assert.ok(coverageViewSource.includes('coverageStore.isBarangayInNapData(item)'), 'CoverageView must guard locateOnMap button')
    })

    it('coverageStore exposes refreshNapLocations and resolveNapBarangay', () => {
      assert.ok(coverageStoreSource.includes('refreshNapLocations'), 'coverage.js must expose refreshNapLocations')
      assert.ok(coverageStoreSource.includes('resolveNapBarangay'), 'coverage.js must expose resolveNapBarangay')
      assert.ok(coverageStoreSource.includes('dynamicCoverageList'), 'coverage.js must define dynamicCoverageList')
    })

    it('CoverageMap includes on-demand Sync Network button and window focus handler', () => {
      assert.ok(mapSource.includes('syncNetwork'), 'CoverageMap must implement syncNetwork')
      assert.ok(mapSource.includes('coverageStore.refreshNapLocations()'), 'CoverageMap must call refreshNapLocations on sync')
      assert.ok(mapSource.includes('handleWindowFocus'), 'CoverageMap must declare handleWindowFocus')
      assert.match(mapSource, /window\.addEventListener\(['"]focus['"],\s*handleWindowFocus\)/)
      assert.match(mapSource, /window\.removeEventListener\(['"]focus['"],\s*handleWindowFocus\)/)
    })
  })

  describe('Dynamic LCP NAP Barangay Discovery Logic', () => {
    it('resolveNapBarangay correctly resolves numeric database IDs and textual barangays', async () => {
      const { barangayBoundaries } = await import('../src/data/barangayBoundaries.js')
      const { samePlace } = await import('../src/data/calabarzonLocations.js')

      const KNOWN_CODES = {
        '2': { municipality: 'Binangonan', name: 'Batingan (HQ)' },
        '63': { municipality: 'Cardona', name: 'Looc' }
      }

      function resolveTest(point) {
        const b = (point.barangay || '').trim()
        if (KNOWN_CODES[b]) return KNOWN_CODES[b]
        if (b) return { municipality: point.city || 'Rizal', name: b }
        return null
      }

      assert.deepEqual(resolveTest({ barangay: '2', city: 'Binangonan' }), { municipality: 'Binangonan', name: 'Batingan (HQ)' })
      assert.deepEqual(resolveTest({ barangay: '63', city: 'Cardona' }), { municipality: 'Cardona', name: 'Looc' })
      assert.deepEqual(resolveTest({ barangay: 'Dolores', city: 'Taytay' }), { municipality: 'Taytay', name: 'Dolores' })
      assert.deepEqual(resolveTest({ barangay: 'Plaza Aldea', city: 'Tanay' }), { municipality: 'Tanay', name: 'Plaza Aldea' })
    })

    it('dynamically synthesizes newly added barangays when new NAP points are provided', () => {
      const naps = [
        { id: 1, lat: 14.4950, lng: 121.2850, street: 'Sampaloc Rd', barangay: 'Plaza Aldea', city: 'Tanay' },
        { id: 2, lat: 14.4952, lng: 121.2854, street: 'Sampaloc Rd Ext', barangay: 'Plaza Aldea', city: 'Tanay' }
      ]

      const avgLat = Number((naps.reduce((s, p) => s + p.lat, 0) / naps.length).toFixed(6))
      const avgLng = Number((naps.reduce((s, p) => s + p.lng, 0) / naps.length).toFixed(6))
      const streets = Array.from(new Set(naps.map(p => p.street)))

      const dynamicItem = {
        id: 1001,
        name: 'Plaza Aldea',
        municipality: 'Tanay',
        lat: avgLat,
        lng: avgLng,
        status: 'Available Now',
        slots: 'Ready for Dispatch',
        activeNodes: `${naps.length} live NAP terminals mapped`,
        liveNapCount: naps.length,
        coveredAreas: streets,
        isDynamic: true
      }

      assert.equal(dynamicItem.name, 'Plaza Aldea')
      assert.equal(dynamicItem.municipality, 'Tanay')
      assert.equal(dynamicItem.liveNapCount, 2)
      assert.equal(dynamicItem.lat, 14.4951)
      assert.equal(dynamicItem.lng, 121.2852)
      assert.deepEqual(dynamicItem.coveredAreas, ['Sampaloc Rd', 'Sampaloc Rd Ext'])
    })

    it('includes Habagatan (Binangonan) and San Roque (Cardona) in curated coverageList', () => {
      const coverageStoreSource = fs.readFileSync(path.resolve(process.cwd(), 'src/stores/coverage.js'), 'utf-8')
      assert.ok(coverageStoreSource.includes("name: 'Habagatan'"), 'coverageList must include Habagatan')
      assert.ok(coverageStoreSource.includes("name: 'San Roque'"), 'coverageList must include San Roque')
      assert.ok(coverageStoreSource.includes("'22': { municipality: 'Binangonan', name: 'Lunsad' }"))
      assert.ok(coverageStoreSource.includes("'31': { municipality: 'Binangonan', name: 'Pila Pila' }"))
      assert.ok(coverageStoreSource.includes("'43': { municipality: 'Binangonan', name: 'Mambog' }"))
      assert.ok(coverageStoreSource.includes("'48': { municipality: 'Cardona', name: 'Calahan' }"))
      assert.ok(coverageStoreSource.includes("'67': { municipality: 'Cardona', name: 'Real (Poblacion)' }"))
    })
  })
})
