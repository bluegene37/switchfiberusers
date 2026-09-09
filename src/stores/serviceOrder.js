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
  const isLookingUp = ref(false)
  const lookupMessage = ref('')
  const lookupStatus = ref(null) // 'success' | 'warning' | 'error' | null
  const error = ref(null)
  const submittedTicket = ref(null)

  // Technical metadata cached from account lookup
  const accountMetadata = ref({})

  const formData = ref({
    accountNumber: '',
    fullName: '',
    contactNumber: '',
    emailAddress: '',
    address: '',
    barangay: '',
    city: 'Binangonan',
    concernCategory: 'No Internet / LOS (Red Light)',
    concernDetails: '',
    priorityLevel: 'Normal'
  })

  function resetForm() {
    formData.value = {
      accountNumber: '',
      fullName: '',
      contactNumber: '',
      emailAddress: '',
      address: '',
      barangay: '',
      city: 'Binangonan',
      concernCategory: 'No Internet / LOS (Red Light)',
      concernDetails: '',
      priorityLevel: 'Normal'
    }
    accountMetadata.value = {}
    lookupMessage.value = ''
    lookupStatus.value = null
    error.value = null
    submittedTicket.value = null
  }

  async function lookupAccount(accountNo) {
    const cleanNo = String(accountNo || formData.value.accountNumber || '').trim()
    if (!cleanNo) {
      lookupMessage.value = 'Please enter an account number to search.'
      lookupStatus.value = 'warning'
      return false
    }

    isLookingUp.value = true
    lookupMessage.value = ''
    lookupStatus.value = null

    try {
      const res = await fetch(`/api/BillingDetails?accountNo=${encodeURIComponent(cleanNo)}`, {
        method: 'GET',
        headers: { Accept: 'application/json' }
      })

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`)
      }

      const data = await res.json()
      const list = Array.isArray(data) ? data : (data?.billingDetails || [])
      const matched = list.find(b => String(b.accountNo || '').trim().toLowerCase() === cleanNo.toLowerCase())

      if (matched) {
        // Auto-fill available subscriber details
        if (matched.fullName) formData.value.fullName = matched.fullName
        if (matched.contactNumber) {
          const rawPhone = String(matched.contactNumber).trim()
          formData.value.contactNumber = rawPhone.startsWith('09') ? rawPhone : (rawPhone.startsWith('9') ? `0${rawPhone}` : rawPhone)
        }
        if (matched.emailAddress) formData.value.emailAddress = matched.emailAddress
        if (matched.address) formData.value.address = matched.address
        if (matched.barangay) formData.value.barangay = matched.barangay
        if (matched.city) formData.value.city = matched.city || 'Binangonan'

        // Save technical details for rich Service Order row
        accountMetadata.value = {
          plan: matched.plan || '',
          provider: matched.provider || '',
          username: matched.username || '',
          connectionType: matched.connectionType || 'Fiber',
          routerModemSn: matched.routerModemSn || '',
          lcp: matched.lcp || '',
          nap: matched.nap || '',
          port: matched.port || '',
          vlan: matched.vlan || '',
          addressCoordinates: matched.addressCoordinates || '',
          dateInstalled: matched.dateInstalled || null
        }

        lookupMessage.value = `Verified subscriber: ${matched.fullName}`
        lookupStatus.value = 'success'
        return true
      } else {
        lookupMessage.value = 'Account number not found. You can still fill out the form manually.'
        lookupStatus.value = 'warning'
        return false
      }
    } catch (err) {
      console.warn('Account lookup error:', err)
      lookupMessage.value = 'Unable to verify account online. Please proceed by entering your details below.'
      lookupStatus.value = 'warning'
      return false
    } finally {
      isLookingUp.value = false
    }
  }

  function validate() {
    error.value = null
    const f = formData.value

    if (!f.fullName.trim() && !f.accountNumber.trim()) {
      error.value = 'Please provide your Full Name or Account Number.'
      return false
    }

    if (!f.fullName.trim()) {
      error.value = 'Please enter your Full Name.'
      return false
    }

    const cleanPhone = f.contactNumber.replace(/\s+/g, '').trim()
    if (!cleanPhone) {
      error.value = 'Please enter your contact number.'
      return false
    }
    if (!PHILIPPINE_MOBILE_REGEX.test(cleanPhone)) {
      error.value = 'Contact number must be an 11-digit Philippine mobile number starting with 09 (e.g., 09151234567).'
      return false
    }

    if (!f.address.trim()) {
      error.value = 'Please enter your service/installation address.'
      return false
    }

    if (!f.concernDetails.trim()) {
      error.value = 'Please provide the details of your concern or complaint.'
      return false
    }

    if (f.emailAddress.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.emailAddress.trim())) {
      error.value = 'Please enter a valid email address.'
      return false
    }

    return true
  }

  async function submitConcern() {
    if (!validate()) return null

    isSubmitting.value = true
    error.value = null

    try {
      const nowIso = new Date().toISOString()
      const f = formData.value
      const meta = accountMetadata.value

      const combinedConcern = f.concernCategory
        ? `${f.concernCategory}`
        : 'Customer Concern'

      const detailedRemarks = f.concernDetails.trim()

      const payload = {
        createdDate: nowIso,
        accountNumber: f.accountNumber.trim() || '',
        fullName: f.fullName.trim(),
        contactNumber: f.contactNumber.replace(/\s+/g, '').trim(),
        emailAddress: f.emailAddress.trim() || '',
        address: f.address.trim(),
        barangay: f.barangay.trim() || '',
        city: f.city.trim() || 'Binangonan',
        concern: combinedConcern,
        connectionRemarks: detailedRemarks,
        supportRemarks: `Category: ${f.concernCategory} | Note: ${detailedRemarks}`,
        priorityLevel: f.priorityLevel || 'Normal',
        supportStatus: 'In Progress',
        visitStatus: 'In Progress',
        requestedBy: f.fullName.trim(),
        userEmail: f.emailAddress.trim() || '',
        modifiedDate: nowIso,
        modifiedBy: 'Online Portal',
        // Optional technical enrichment if available
        plan: meta.plan || '',
        provider: meta.provider || 'SWITCH',
        username: meta.username || '',
        connectionType: meta.connectionType || 'Fiber',
        routerModemSN: meta.routerModemSn || '',
        lcp: meta.lcp || '',
        nap: meta.nap || '',
        port: meta.port || '',
        vlan: meta.vlan || '',
        addressCoordinates: meta.addressCoordinates || '',
        dateInstalled: meta.dateInstalled || null
      }

      const response = await fetch('/api/ServiceOrders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Server returned HTTP ${response.status}`)
      }

      const result = await response.json()
      const generatedId = result?.id || Math.floor(100000 + Math.random() * 900000)

      submittedTicket.value = {
        id: generatedId,
        referenceNo: `SO-${generatedId}`,
        status: 'In Progress',
        fullName: f.fullName.trim(),
        accountNumber: f.accountNumber.trim() || 'N/A',
        contactNumber: f.contactNumber.trim(),
        emailAddress: f.emailAddress.trim() || 'N/A',
        address: f.address.trim(),
        concern: combinedConcern,
        concernDetails: detailedRemarks,
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
    accountMetadata,
    isSubmitting,
    isLookingUp,
    lookupMessage,
    lookupStatus,
    error,
    submittedTicket,
    resetForm,
    lookupAccount,
    validate,
    submitConcern
  }
})
