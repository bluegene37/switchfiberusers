import { defineStore } from 'pinia'
import { ref } from 'vue'

export const CONCERN_CATEGORIES = [
  'No Internet / LOS (Red Light)',
  'Slow Internet / High Latency',
  'Intermittent / Disconnecting Wi-Fi',
  'Modem / Router Hardware Issue',
  'Billing & Payment Verification',
  'Account Modification / Relocation',
  'Other Concern or Inquiry'
]

export const PHILIPPINE_MOBILE_REGEX = /^(09\d{9})$/

export const useServiceOrderStore = defineStore('serviceOrder', () => {
  const isSubmitting = ref(false)
  const error = ref(null)
  const isApiDown = ref(false)
  const submittedTicket = ref(null)

  const formData = ref({
    emailAddress: ''
  })

  function resetForm() {
    formData.value = {
      emailAddress: ''
    }
    error.value = null
    isApiDown.value = false
    submittedTicket.value = null
  }

  function validate() {
    error.value = null
    const email = (formData.value.emailAddress || '').trim()

    if (!email) {
      error.value = 'Please enter your email address so our support team can contact you.'
      return false
    }

    if (/^\d+$/.test(email)) {
      error.value = 'This looks like an account or phone number. Please enter a valid email address (e.g. subscriber@gmail.com) so we can reach you.'
      return false
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      error.value = 'Please enter a valid email address (e.g. subscriber@gmail.com).'
      return false
    }

    return true
  }

  async function submitConcern() {
    if (!validate()) return null

    isSubmitting.value = true
    error.value = null

    const nowIso = new Date().toISOString()
    const email = formData.value.emailAddress.trim()

    const payload = {
      emailAddress: email,
      fullName: '',
      contactNumber: '',
      address: 'Service Address to be verified with Subscriber',
      concern: 'Direct Email Intake Support Request',
      supportStatus: 'Inprogress',
      visitStatus: '',
      createdDate: nowIso,
      modifiedDate: nowIso,
      modifiedBy: ''
    }

    try {
      let response
      try {
        response = await fetch('/api/ServiceOrders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(payload)
        })
      } catch (networkErr) {
        console.warn('Network error reaching Service Orders API:', networkErr)
        isApiDown.value = true
        error.value = 'We could not connect to our support server due to temporary network interruption. Please try again shortly or call our hotline at 0915-407-7565.'
        return null
      }

      if (!response.ok) {
        if (response.status >= 500 || response.status === 502 || response.status === 503) {
          isApiDown.value = true
          error.value = 'Our support request service is currently undergoing scheduled maintenance. Your request could not be transmitted at this time. Please try again shortly or contact our customer hotline at 0915-407-7565.'
          return null
        }
        const errorData = await response.json().catch(() => ({}))
        error.value = errorData.message || `Server returned HTTP ${response.status}`
        return null
      }

      const result = await response.json().catch(() => ({}))
      const generatedId = result?.id || Math.floor(100000 + Math.random() * 900000)

      submittedTicket.value = {
        id: generatedId,
        status: 'Inprogress',
        emailAddress: email,
        submittedAt: nowIso
      }

      return submittedTicket.value
    } catch (err) {
      console.error('Service Order submission failed:', err)
      error.value = err.message || 'Failed to submit your concern. Please try again or contact our hotlines.'
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    formData,
    isSubmitting,
    error,
    isApiDown,
    submittedTicket,
    resetForm,
    validate,
    submitConcern
  }
})
