import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { sendConfirmationEmail } from '../api/send-confirmation.js'
import { sendConfirmationSms } from '../api/send-sms.js'
import { sendApplicationEmail } from '../src/services/emailService.js'
import { sendApplicationSms } from '../src/services/smsService.js'

describe('Notification Services & Handlers', () => {
  describe('api/send-confirmation.js (sendConfirmationEmail)', () => {
    it('rejects submissions with missing email or referenceCode', async () => {
      const res1 = await sendConfirmationEmail({})
      assert.equal(res1.success, false)
      assert.match(res1.error, /Missing required recipientEmail or referenceCode/)

      const res2 = await sendConfirmationEmail({ recipientEmail: 'test@example.com' })
      assert.equal(res2.success, false)
      assert.match(res2.error, /Missing required recipientEmail or referenceCode/)

      const res3 = await sendConfirmationEmail({ referenceCode: 'SW-12345' })
      assert.equal(res3.success, false)
      assert.match(res3.error, /Missing required recipientEmail or referenceCode/)
    })

    it('rejects invalid email formats', async () => {
      const res = await sendConfirmationEmail({
        recipientEmail: 'not-an-email',
        referenceCode: 'SW-12345'
      })
      assert.equal(res.success, false)
      assert.match(res.error, /Invalid recipient email address/)
    })

    it('gracefully reports unconfigured service when RESEND_API_KEY is not set', async () => {
      const origKey = process.env.RESEND_API_KEY
      delete process.env.RESEND_API_KEY

      const res = await sendConfirmationEmail({
        recipientEmail: 'applicant@example.com',
        referenceCode: 'SW-12345',
        applicantName: 'Juan Dela Cruz',
        desiredPlan: 'Plan 699'
      })

      assert.equal(res.success, false)
      assert.equal(res.skipped, true)
      assert.match(res.error, /RESEND_API_KEY missing/)

      if (origKey) process.env.RESEND_API_KEY = origKey
    })
  })

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

  describe('src/services/emailService.js (sendApplicationEmail)', () => {
    it('validates client-side parameters before network fetch', async () => {
      const res = await sendApplicationEmail({ recipientEmail: '', referenceCode: '' })
      assert.equal(res.success, false)
      assert.match(res.error, /Missing recipient email or reference code/)
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
