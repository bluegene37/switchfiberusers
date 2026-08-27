import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  PROVINCES,
  provincesList,
  fallbackCitiesByProvince,
  coverageBarangaysByCity,
  normalizeCityName,
  canonicalPlace,
  samePlace
} from '../src/data/calabarzonLocations.js'

describe('CALABARZON Locations Data & Helpers', () => {
  describe('PROVINCES & provincesList', () => {
    it('contains all 5 CALABARZON provinces', () => {
      const expectedProvinces = ['Rizal', 'Cavite', 'Laguna', 'Batangas', 'Quezon']
      assert.deepEqual(provincesList, expectedProvinces)
    })

    it('each province has a valid PSGC code, center coordinates, and zoom level', () => {
      for (const province of provincesList) {
        const data = PROVINCES[province]
        assert.ok(data, `Data missing for ${province}`)
        assert.match(data.psgcCode, /^\d{9}$/, `${province} PSGC code is invalid: ${data.psgcCode}`)
        assert.equal(Array.isArray(data.center), true)
        assert.equal(data.center.length, 2)
        assert.ok(typeof data.center[0] === 'number' && data.center[0] > 0)
        assert.ok(typeof data.center[1] === 'number' && data.center[1] > 0)
        assert.ok(typeof data.zoom === 'number' && data.zoom >= 8)
      }
    })
  })

  describe('fallbackCitiesByProvince', () => {
    it('has city rosters for all 5 provinces', () => {
      for (const province of provincesList) {
        const cities = fallbackCitiesByProvince[province]
        assert.ok(Array.isArray(cities) && cities.length > 0, `No fallback cities for ${province}`)
      }
    })

    it('includes core Rizal municipalities like Binangonan, Angono, and Taytay', () => {
      const rizalCities = fallbackCitiesByProvince.Rizal
      assert.ok(rizalCities.includes('Binangonan'))
      assert.ok(rizalCities.includes('Angono'))
      assert.ok(rizalCities.includes('Taytay'))
      assert.ok(rizalCities.includes('Antipolo City'))
    })
  })

  describe('coverageBarangaysByCity', () => {
    it('contains curated fiber active barangays in Binangonan', () => {
      const binangonanBarangays = coverageBarangaysByCity.Binangonan
      assert.ok(Array.isArray(binangonanBarangays))
      assert.ok(binangonanBarangays.includes('Batingan'))
      assert.ok(binangonanBarangays.includes('Calumpang'))
      assert.ok(binangonanBarangays.includes('Darangan'))
      assert.ok(binangonanBarangays.includes('Layunan'))
      assert.ok(binangonanBarangays.includes('Libis'))
    })
  })

  describe('normalizeCityName', () => {
    it('converts "City of Antipolo" to "Antipolo City"', () => {
      assert.equal(normalizeCityName('City of Antipolo'), 'Antipolo City')
      assert.equal(normalizeCityName('City of Pasig'), 'Pasig City')
    })

    it('preserves already normalized or standard city names', () => {
      assert.equal(normalizeCityName('Binangonan'), 'Binangonan')
      assert.equal(normalizeCityName('Antipolo City'), 'Antipolo City')
    })

    it('handles empty or null values safely', () => {
      assert.equal(normalizeCityName(''), '')
      assert.equal(normalizeCityName(null), '')
      assert.equal(normalizeCityName(undefined), '')
    })
  })

  describe('canonicalPlace & samePlace', () => {
    it('strips parentheses, punctuation, and city prefixes for fuzzy matching', () => {
      assert.equal(canonicalPlace('City of Antipolo'), 'antipolo')
      assert.equal(canonicalPlace('Antipolo City'), 'antipolo')
      assert.equal(canonicalPlace('Batingan (HQ)'), 'batingan')
      assert.equal(canonicalPlace('San Roque (Pob.)'), 'sanroque')
    })

    it('correctly compares matching place variants', () => {
      assert.equal(samePlace('City of Antipolo', 'Antipolo City'), true)
      assert.equal(samePlace('Batingan (HQ)', 'Batingan'), true)
      assert.equal(samePlace('San Roque (Pob.)', 'San Roque'), true)
      assert.equal(samePlace('Taytay', 'Angono'), false)
    })

    it('returns false for empty comparisons', () => {
      assert.equal(samePlace('', ''), false)
      assert.equal(samePlace(null, 'Binangonan'), false)
    })
  })
})
