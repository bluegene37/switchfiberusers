import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
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
})
