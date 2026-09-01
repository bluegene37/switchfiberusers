import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { sendConfirmationSms } from '../api/send-sms.js'
import { sendApplicationSms } from '../src/services/smsService.js'

describe('Notification Services & Handlers', () => {

  describe('api/send-sms.js (sendConfirmationSms)', () => {
    it('rejects requests missing referenceCode or valid Philippine mobile', async () => {
      const res1 = await sendConfirmationSms({})
      assert.equal(res1.success, false)
      assert.match(res1.error, /Missing referenceCode/)

      const res2 = await sendConfirmationSms({ referenceCode: 'SW-12345', recipientNumber: '123' })
      assert.equal(res2.success, false)
      assert.match(res2.error, /Invalid Philippine mobile number/)
    })

    it('gracefully reports unconfigured service when SEMAPHORE_API_KEY is missing', async () => {
      const origKey = process.env.SEMAPHORE_API_KEY
      delete process.env.SEMAPHORE_API_KEY

      const res = await sendConfirmationSms({
        recipientNumber: '09151234567',
        referenceCode: 'SW-12345'
      })

      assert.equal(res.success, false)
      assert.equal(res.skipped, true)
      assert.match(res.error, /SEMAPHORE_API_KEY missing/)

      if (origKey) process.env.SEMAPHORE_API_KEY = origKey
    })
  })


  describe('src/services/smsService.js (sendApplicationSms)', () => {
    it('validates client-side parameters before network fetch', async () => {
      const res = await sendApplicationSms({ recipientNumber: '', referenceCode: '' })
      assert.equal(res.success, false)
      assert.match(res.error, /Missing recipient number or reference code/)
    })
  })
})
