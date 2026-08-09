import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useRegistrationStore = defineStore('registration', () => {
  const currentStep = ref(1)
  const isModalOpen = ref(false)
  const isSubmitting = ref(false)
  const apiError = ref(null)

  // Initial Form State Template
  const getInitialFormData = () => ({
    // Personal Info
    firstName: '',
    middleName: '',
    lastName: '',
    emailAddress: '',
    mobileNumber: '',
    secondaryMobileNumber: '',
    referredBy: '',
    
    // Address Details
    region: 'Region IV-A (CALABARZON)',
    city: 'Binangonan',
    barangay: '',
    installationAddress: '',
    landmark: '',
    
    // Plan
    desiredPlan: 'SwitchConnect Plan (₱799/mo)',
    selectedPlanId: 'connect-799',
    selectedPlanPrice: 799,
    applicablePromo: 'Standard Free Installation',

    // Document File Strings & ID Types
    houseFrontPicture: '',
    houseFrontName: '',
    governmentValidId: '',
    governmentValidIdName: '',
    primaryGovtIdType: 'National ID (Philsys)',
    secondGovernmentValidId: '',
    secondGovernmentValidIdName: '',
    secondaryGovtIdType: '',
    firstNearestLandmark: '',
    firstNearestLandmarkName: '',
    secondNearestLandmark: '',
    secondNearestLandmarkName: '',

    // Option Features
    expressInstallation: false,

    // Agreement & Signature
    termsAndConditionsAgreement: false,
    signatureName: '',
    digitalSignature: '',
    applicationReferenceCode: '',
    submissionDate: ''
  })

  // Registration Form State with localStorage draft auto-recovery
  const getSavedDraft = () => {
    try {
      const saved = localStorage.getItem('switch_registration_draft')
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      return null
    }
  }

  const initialDraft = getSavedDraft()
  const formData = ref(initialDraft ? { ...getInitialFormData(), ...initialDraft } : getInitialFormData())

  // Automatically save form history as user types
  watch(formData, (newVal) => {
    try {
      const draft = { ...newVal }
      // Omit heavy base64 file payloads from draft cache
      draft.houseFrontPicture = ''
      draft.governmentValidId = ''
      draft.secondGovernmentValidId = ''
      draft.firstNearestLandmark = ''
      draft.secondNearestLandmark = ''
      draft.digitalSignature = ''
      localStorage.setItem('switch_registration_draft', JSON.stringify(draft))
    } catch (e) {
      console.warn('Failed to save registration draft history:', e)
    }
  }, { deep: true })

  const availablePlans = [
    {
      id: 'lite-699',
      title: 'SwitchLite Plan',
      price: 699,
      speed: 'Turbo Speed (30 Mbps)',
      lockIn: '1 Year Lock-In',
      tag: 'Best Budget',
      features: ['Unlimited Fiber Internet', 'No Data Cap', 'No Hidden Charges', 'Free Router Unit']
    },
    {
      id: 'connect-799',
      title: 'SwitchConnect Plan',
      price: 799,
      speed: 'Turbo Speed (60 Mbps)',
      lockIn: '1 Year Lock-In',
      tag: 'Most Popular',
      recommended: true,
      features: ['Unlimited Fiber Internet', 'No Data Cap', 'No Hidden Charges', 'Free Dual-Band Router', '24/7 Priority Support']
    },
    {
      id: 'net-999',
      title: 'SwitchNet Plan',
      price: 999,
      speed: 'Turbo Speed (100 Mbps)',
      lockIn: '1 Year Lock-In',
      tag: 'High Performance',
      features: ['Unlimited Fiber Internet', 'No Data Cap', 'No Hidden Charges', 'Free Dual-Band Wi-Fi 6 Router', 'Zero Activation Fee']
    },
    {
      id: 'speed-1299',
      title: 'SwitchSpeed Plan',
      price: 1299,
      speed: 'Turbo Speed (200 Mbps)',
      lockIn: '1 Year Lock-In',
      tag: 'Gamer & Streaming',
      features: ['Unlimited Fiber Internet', 'No Data Cap', 'Ultra-Low Ping Routing', 'Free Wi-Fi Mesh Node included']
    },
    {
      id: 'ultra-1499',
      title: 'SwitchUltra Plan',
      price: 1499,
      speed: 'Turbo Speed (350+ Mbps)',
      lockIn: '1 Year Lock-In',
      tag: 'Ultimate Power',
      features: ['Unlimited Fiber Internet', 'No Data Cap', 'Priority Support Line', '2x Mesh Nodes included', 'Symmetrical Upload/Download']
    }
  ]

  const regionsList = [
    'Region IV-A (CALABARZON)',
    'National Capital Region (NCR)',
    'Region III (Central Luzon)'
  ]

  const citiesList = [
    'Binangonan',
    'Angono',
    'Taytay',
    'Teresa',
    'Cardona',
    'Morong',
    'Baras',
    'Tanay',
    'Antipolo',
    'San Mateo',
    'Rodriguez'
  ]

  const barangaysList = [
    'Batingan',
    'Bilibiran',
    'Calumpang',
    'Darangan',
    'Layunan',
    'Libid',
    'Libis',
    'Lunsad',
    'Macamot',
    'Mahabang Parang (Binangonan)',
    'Mambog',
    'Palangoy',
    'Pag-asa',
    'Pantok',
    'Pila-pila',
    'Tagpos',
    'Tatala',
    'Tayuman'
  ]

  const govtIdTypes = [
    'National ID (Philsys)',
    'LTO Driver’s License',
    'Passport',
    'Unified Multi Purpose (UMID)',
    'SSS ID',
    'Philhealth ID',
    'BIR TIN ID',
    'PRC ID',
    'Postal ID (2019 onwards)',
    'Senior Citizen ID'
  ]

  // Safe LocalStorage Persist Helper to prevent QuotaExceededError with base64 data
  function saveToLocalStorage() {
    try {
      const sanitizedApps = submittedApplications.value.map(app => {
        const copy = { ...app }
        if (copy.digitalSignature && copy.digitalSignature.length > 200) {
          copy.digitalSignature = '[Digital Signature Captured]'
        }
        if (copy.payload) {
          const payloadCopy = { ...copy.payload }
          if (payloadCopy.houseFrontPicture?.length > 200) payloadCopy.houseFrontPicture = '[Uploaded Photo]'
          if (payloadCopy.governmentValidId?.length > 200) payloadCopy.governmentValidId = '[Uploaded ID]'
          if (payloadCopy.secondGovernmentValidId?.length > 200) payloadCopy.secondGovernmentValidId = '[Uploaded ID]'
          if (payloadCopy.firstNearestLandmark?.length > 200) payloadCopy.firstNearestLandmark = '[Uploaded Landmark]'
          if (payloadCopy.secondNearestLandmark?.length > 200) payloadCopy.secondNearestLandmark = '[Uploaded Landmark]'
          copy.payload = payloadCopy
        }
        return copy
      })
      localStorage.setItem('switch_applications', JSON.stringify(sanitizedApps))
    } catch (err) {
      console.warn('LocalStorage quota exceeded, trimming older applications:', err)
      try {
        const trimmedApps = submittedApplications.value.slice(0, 3).map(app => ({
          referenceCode: app.referenceCode,
          applicantName: app.applicantName,
          mobile: app.mobile,
          plan: app.plan,
          city: app.city,
          barangay: app.barangay,
          date: app.date,
          status: app.status,
          statusStep: app.statusStep,
          notes: app.notes
        }))
        localStorage.setItem('switch_applications', JSON.stringify(trimmedApps))
      } catch (err2) {
        console.warn('LocalStorage unavailable or fully restricted, using memory store.', err2)
      }
    }
  }

  // Mock DB in LocalStorage
  let initialApps = []
  try {
    initialApps = JSON.parse(localStorage.getItem('switch_applications') || '[]')
  } catch (err) {
    console.warn('Error reading from localStorage:', err)
  }
  const submittedApplications = ref(initialApps)

  if (submittedApplications.value.length === 0) {
    submittedApplications.value.push({
      referenceCode: 'SF-2026-8942',
      applicantName: 'Juan Dela Cruz',
      mobile: '09171234567',
      plan: 'SwitchConnect Plan (₱799/mo)',
      city: 'Binangonan',
      barangay: 'Bilibiran',
      date: '2026-08-01',
      status: 'Dispatch Scheduled',
      statusStep: 4,
      notes: 'Ocular survey completed. Fiber drop cable installation scheduled for tomorrow morning.'
    })
    saveToLocalStorage()
  }

  function resetForm() {
    currentStep.value = 1
    formData.value = getInitialFormData()
    apiError.value = null
    try {
      localStorage.removeItem('switch_registration_draft')
    } catch (e) {}
  }

  function openModal(planId = null) {
    resetForm()
    if (planId) {
      const plan = availablePlans.find(p => p.id === planId)
      if (plan) {
        formData.value.selectedPlanId = plan.id
        formData.value.desiredPlan = `${plan.title} (₱${plan.price}/mo)`
        formData.value.selectedPlanPrice = plan.price
      }
    }
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
  }

  function nextStep() {
    if (currentStep.value < 5) {
      currentStep.value++
    }
  }

  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  function selectPlan(plan) {
    formData.value.selectedPlanId = plan.id
    formData.value.desiredPlan = `${plan.title} (₱${plan.price}/mo)`
    formData.value.selectedPlanPrice = plan.price
  }

  async function submitApplication() {
    isSubmitting.value = true
    apiError.value = null

    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const randomSuffix = Math.floor(10 + Math.random() * 90)

    const uniqueReferenceCode = `SF-${year}${month}${day}-${hours}${minutes}${seconds}-${randomSuffix}`
    formData.value.applicationReferenceCode = uniqueReferenceCode
    formData.value.submissionDate = now.toISOString()
    const randomCode = uniqueReferenceCode

    // Construct exact JSON API Payload requested by user
    const apiPayload = {
      timestamp: formData.value.submissionDate,
      emailAddress: formData.value.emailAddress,
      region: formData.value.region,
      city: formData.value.city,
      barangay: formData.value.barangay,
      referredBy: formData.value.referredBy || '',
      firstName: formData.value.firstName,
      middleName: formData.value.middleName || '',
      lastName: formData.value.lastName,
      mobileNumber: formData.value.mobileNumber,
      secondaryMobileNumber: formData.value.secondaryMobileNumber || '',
      installationAddress: formData.value.installationAddress,
      landmark: formData.value.landmark || '',
      desiredPlan: formData.value.desiredPlan,
      proofOfBilling: '',
      governmentValidId: formData.value.governmentValidId || '',
      secondGovernmentValidId: formData.value.secondGovernmentValidId || '',
      houseFrontPicture: formData.value.houseFrontPicture || '',
      termsAndConditionsAgreement: formData.value.termsAndConditionsAgreement ? 'true' : 'false',
      firstNearestLandmark: formData.value.firstNearestLandmark || '',
      secondNearestLandmark: formData.value.secondNearestLandmark || '',
      applicablePromo: formData.value.applicablePromo || 'Standard Installation',
      documentPicture: '',
      barangay1: '',
      barangay2: '',
      pictureofstatmentbillingfromotherprovider: '',
      referrersAccountNumber: '',
      applyingFor: 'New Fiber Connection',
      status: 'Pending',
      visitBy: '',
      visitWith: '',
      visitWithOther: '',
      remarks: `Online Application ${randomCode} | ID: ${formData.value.primaryGovtIdType}${formData.value.digitalSignature ? ' | Signed' : ''}`,
      modifiedBy: '0',
      modifiedDate: '',
      userEmail: formData.value.emailAddress
    }

    // Persist locally
    const newApp = {
      referenceCode: randomCode,
      applicantName: `${formData.value.firstName} ${formData.value.middleName ? formData.value.middleName + ' ' : ''}${formData.value.lastName}`,
      email: formData.value.emailAddress,
      mobile: formData.value.mobileNumber,
      plan: formData.value.desiredPlan,
      city: formData.value.city,
      barangay: formData.value.barangay,
      streetAddress: formData.value.installationAddress,
      primaryGovtIdType: formData.value.primaryGovtIdType,
      secondaryGovtIdType: formData.value.secondaryGovtIdType,
      digitalSignature: formData.value.digitalSignature,
      expressInstallation: formData.value.expressInstallation,
      date: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      statusStep: 1,
      notes: 'Application logged. Account officer is reviewing uploaded government IDs and signature.',
      payload: apiPayload
    }

    submittedApplications.value.unshift(newApp)
    saveToLocalStorage()

    // Attempt POST to backend API endpoint
    try {
      const response = await fetch('https://103.249.198.43:8090/api/Applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiPayload)
      })

      if (!response.ok) {
        console.warn('API returned non-OK status:', response.status)
      } else {
        const result = await response.json()
        console.log('API application submitted successfully:', result)
      }
    } catch (err) {
      console.warn('Backend API request encountered network/CORS error, saved locally:', err)
      // Smooth fallback so client registration always completes
    } finally {
      isSubmitting.value = false
    }

    return randomCode
  }

  function findApplicationByCode(code) {
    if (!code) return null
    const cleanCode = code.trim().toUpperCase()
    return submittedApplications.value.find(app => app.referenceCode.toUpperCase() === cleanCode)
  }

  return {
    currentStep,
    isModalOpen,
    isSubmitting,
    apiError,
    formData,
    availablePlans,
    regionsList,
    citiesList,
    barangaysList,
    govtIdTypes,
    submittedApplications,
    resetForm,
    openModal,
    closeModal,
    nextStep,
    prevStep,
    selectPlan,
    submitApplication,
    findApplicationByCode
  }
})
