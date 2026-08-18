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
    // Backend records region as "Rizal"
    region: 'Rizal',
    applyingFor: 'Residential Fiber',
    city: 'Binangonan',
    barangay: '',
    installationAddress: '',
    landmark: '',
    
    // Plan — populated from the live plan list by syncSelectedPlan()
    desiredPlan: '',
    selectedPlanId: '',
    selectedPlanPrice: 0,
    applicablePromo: '',   // derived from the selected plan

    // Document File Strings & ID Types
    houseFrontPicture: '',
    houseFrontName: '',
    governmentValidId: '',
    governmentValidIdName: '',
    secondGovernmentValidId: '',
    secondGovernmentValidIdName: '',
    firstNearestLandmark: '',
    firstNearestLandmarkName: '',
    secondNearestLandmark: '',
    secondNearestLandmarkName: '',

    // Option Features
    expressInstallation: false,

    // Agreement
    termsAndConditionsAgreement: false,
    applicationReferenceCode: '',
    submissionDate: ''
  })

  // Registration Form State with localStorage draft auto-recovery
  // Bump when the form's field set or default values change, so a returning
  // visitor's saved draft can't keep posting values the backend no longer uses
  // (e.g. the old region default of "Region IV-A (CALABARZON)").
  const DRAFT_VERSION = 2

  const getSavedDraft = () => {
    try {
      const saved = localStorage.getItem('switch_registration_draft')
      if (!saved) return null
      const parsed = JSON.parse(saved)
      if (parsed?.__v !== DRAFT_VERSION) {
        localStorage.removeItem('switch_registration_draft')
        return null
      }
      delete parsed.__v
      return parsed
    } catch (e) {
      return null
    }
  }

  const initialDraft = getSavedDraft()

  // Only restore keys the current form actually defines. Without this, fields
  // removed from the form (e.g. the government-ID type pickers) would live on
  // in returning visitors' drafts indefinitely.
  function mergeDraft(draft) {
    const base = getInitialFormData()
    if (!draft) return base
    for (const key of Object.keys(base)) {
      if (draft[key] !== undefined) base[key] = draft[key]
    }
    return base
  }

  const formData = ref(mergeDraft(initialDraft))

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
      draft.__v = DRAFT_VERSION
      localStorage.setItem('switch_registration_draft', JSON.stringify(draft))
    } catch (e) {
      console.warn('Failed to save registration draft history:', e)
    }
  }, { deep: true })

  // Offline fallback used only when the Plans API is unreachable.
  const fallbackPlanSeeds = [
    {
      id: '1',
      rawId: 1,
      slug: 'lite-699',
      title: 'SwitchLite Plan',
      price: 699,
      speed: 'Turbo Speed (50 Mbps)',
      lockIn: '1 Year Lock-In',
      tag: 'Best Budget',
      recommended: false,
      features: ['Unlimited Fiber Internet', 'No Data Cap', 'No Hidden Charges', 'Free Router Unit']
    },
    {
      id: '2',
      rawId: 2,
      slug: 'connect-799',
      title: 'SwitchConnect Plan',
      price: 799,
      speed: 'Turbo Speed (90 Mbps)',
      lockIn: '1 Year Lock-In',
      tag: 'Most Popular',
      recommended: true,
      features: ['Unlimited Fiber Internet', 'No Data Cap', 'No Hidden Charges', 'Free Dual-Band Router', '24/7 Priority Support']
    },
    {
      id: '3',
      rawId: 3,
      slug: 'net-999',
      title: 'SwitchNet Plan',
      price: 999,
      speed: 'Turbo Speed (120 Mbps)',
      lockIn: '1 Year Lock-In',
      tag: 'High Performance',
      recommended: false,
      features: ['Unlimited Fiber Internet', 'No Data Cap', 'No Hidden Charges', 'Free Dual-Band Wi-Fi 6 Router', 'Zero Activation Fee']
    },
    {
      id: '4',
      rawId: 4,
      slug: 'speed-1299',
      title: 'SwitchSpeed Plan',
      price: 1299,
      speed: 'Turbo Speed (150 Mbps)',
      lockIn: '1 Year Lock-In',
      tag: 'Gamer & Streaming',
      recommended: false,
      features: ['Unlimited Fiber Internet', 'No Data Cap', 'Ultra-Low Ping Routing', 'Free Wi-Fi Mesh Node included']
    },
    {
      id: '5',
      rawId: 5,
      slug: 'ultra-1499',
      title: 'SwitchUltra Plan',
      price: 1499,
      speed: 'Turbo Speed (200 Mbps)',
      lockIn: '1 Year Lock-In',
      tag: 'Ultimate Power',
      recommended: false,
      features: ['Unlimited Fiber Internet', 'No Data Cap', 'Priority Support Line', '2x Mesh Nodes included', 'Symmetrical Upload/Download']
    }
  ]

  // Run the fallback plans through the same derivation as API plans so the
  // comparison tables look identical whether or not the API responded.
  const defaultPlans = fallbackPlanSeeds.map(p => ({
    ...p,
    ...deriveComparisonAttributes(p, `${p.features.join(', ')} ${p.speed} ${p.lockIn}`, p.price)
  }))

  const isLoadingPlans = ref(false)
  const plansError = ref(null)
  const plansLastFetched = ref(null)
  const plansList = ref([...defaultPlans])

  // Comparison attributes the /api/Plans payload doesn't expose directly.
  // Derived once here from the API description/price so every screen
  // (plans page, wizard, compare modal) renders the same values, and so a
  // future API field can simply override the fallback.
  function deriveComparisonAttributes(item, desc, price) {
    const haystack = `${item.name || item.title || ''} ${desc}`.toLowerCase()

    const dataCap = item.dataCap || (
      /no data cap|unlimited/.test(haystack) ? 'Unlimited' : 'Fair Use Policy'
    )

    let router = item.router || ''
    if (!router) {
      if (/wi-?fi\s*6|wifi6/.test(haystack)) router = 'Wi-Fi 6 Dual Band'
      else if (/mesh/.test(haystack)) router = 'Wi-Fi 6 Dual Band'
      else router = price >= 1299 ? 'Wi-Fi 6 Dual Band' : 'Dual-Band ONU'
    }

    let mesh = item.mesh || ''
    if (!mesh) {
      const meshMatch = haystack.match(/(\d+)\s*x?\s*mesh|mesh\s*x?\s*(\d+)/)
      if (meshMatch) {
        const count = Number(meshMatch[1] || meshMatch[2])
        mesh = `${count} Node${count > 1 ? 's' : ''}`
      } else if (price >= 1499) mesh = '2 Nodes'
      else if (price >= 1299) mesh = '1 Node'
      else mesh = 'Optional Add-on'
    }

    const support = item.support || (
      /priority support/.test(haystack)
        ? 'Priority 24/7'
        : (price >= 799 ? 'Priority 24/7' : 'Standard 24/7')
    )

    return { dataCap, router, mesh, support }
  }

  function formatApiPlan(item) {
    const rawId = item.id ?? item.Id ?? item.planId ?? item.rawId
    const price = typeof item.amount === 'number' 
      ? item.amount 
      : (typeof item.price === 'number' 
          ? item.price 
          : (parseFloat(item.amount || item.price || item.monthlyFee || 0) || 0))
    const name = (item.name || item.planName || item.title || 'Switch Fiber Plan').trim()
    const desc = (item.description || item.desc || '').trim()

    // Dynamically derive speed string (e.g. "50 Mbps - Turbo-Speed..." -> "Turbo Speed (50 Mbps)")
    let speed = (item.speed || '').trim()
    if (!speed) {
      const speedMatch = (desc + ' ' + name).match(/(\d+\+?\s*(?:Mbps|Gbps|Gb|Mb))/i)
      if (speedMatch) {
        speed = `Turbo Speed (${speedMatch[1]})`
      } else {
        if (price <= 700) speed = 'Turbo Speed (50 Mbps)'
        else if (price <= 850) speed = 'Turbo Speed (90 Mbps)'
        else if (price <= 1100) speed = 'Turbo Speed (120 Mbps)'
        else if (price <= 1350) speed = 'Turbo Speed (150 Mbps)'
        else speed = 'Turbo Speed (200 Mbps)'
      }
    } else if (!speed.toLowerCase().startsWith('turbo speed')) {
      speed = `Turbo Speed (${speed.replace(/[()]/g, '')})`
    }

    // Lock-in period
    let lockIn = (item.lockIn || item.lockInPeriod || '').trim()
    if (!lockIn) {
      if (desc.toLowerCase().includes('lock-in')) {
        const lockMatch = desc.match(/(\d+\s*(?:Year|Yr|Month|Mo)s?\s*Lock-In)/i)
        if (lockMatch) lockIn = lockMatch[1]
      }
      if (!lockIn) lockIn = '1 Year Lock-In'
    }

    // Recommended badge
    const recommended = Boolean(
      item.recommended ||
      item.isRecommended ||
      item.isPopular ||
      desc.toLowerCase().includes('popular') ||
      name.toLowerCase().includes('connect') ||
      price === 799
    )

    // Dynamic Tag assignment
    let tag = (item.tag || item.badge || '').trim()
    if (!tag) {
      if (price <= 700) tag = 'Best Budget'
      else if (price <= 850 || recommended) tag = 'Most Popular'
      else if (price <= 1100) tag = 'High Performance'
      else if (price <= 1350) tag = 'Gamer & Streaming'
      else tag = 'Ultimate Power'
    }

    // Clean features list from description or array
    let features = []
    if (Array.isArray(item.features) && item.features.length > 0) {
      features = item.features.map(f => String(f).trim()).filter(Boolean)
    } else if (desc) {
      const parts = desc.split(',').map(s => s.trim()).filter(Boolean)
      features = parts.map(p => {
        return p.replace(/\s*\(Popular!\)/gi, '').trim()
      }).filter(p => {
        if (!p) return false
        if (p.toLowerCase().includes('lock-in')) return false
        return true
      })
    }

    if (features.length === 0) {
      features = ['Unlimited Fiber Internet', 'No Data Cap', 'No Hidden Charges', 'Free Router Unit']
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.round(price)
    const id = String(rawId || slug)

    return {
      id,
      rawId,
      slug,
      title: name,
      price,
      speed,
      lockIn,
      tag,
      recommended,
      features,
      isActive: item.isActive !== false && item.status !== 'Inactive',
      ...deriveComparisonAttributes(item, desc, price)
    }
  }

  const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

  async function fetchPlans(force = false) {
    isLoadingPlans.value = true
    plansError.value = null
    try {
      const endpoint = `${API_BASE}/api/Plans`
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`)
      }

      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data
          .map(formatApiPlan)
          .filter(p => p.isActive !== false)

        if (formatted.length > 0) {
          plansList.value = formatted
          plansLastFetched.value = new Date().toISOString()
          plansError.value = null
        }
      }
    } catch (err) {
      console.warn('API fetch failed for Plans endpoint, using cached defaults:', err)
      plansError.value = 'Could not sync live plans from backend. Using cached plans.'
    } finally {
      isLoadingPlans.value = false
    }
  }

  // Trigger immediate fetch
  fetchPlans()

  const availablePlans = computed(() => plansList.value)

  function findPlan(identifier) {
    if (identifier === null || identifier === undefined || identifier === '') return null
    if (typeof identifier === 'object' && identifier.id) {
      return findPlan(identifier.id) || identifier
    }
    const key = String(identifier).trim().toLowerCase()
    return plansList.value.find(p => {
      if (String(p.id).toLowerCase() === key) return true
      if (String(p.rawId).toLowerCase() === key) return true
      if (p.slug && p.slug.toLowerCase() === key) return true
      if (p.title && p.title.toLowerCase() === key) return true
      if (p.title && p.title.toLowerCase().replace(/\s+plan$/i, '') === key.replace(/\s+plan$/i, '')) return true
      return false
    }) || null
  }

  // ── Applicable promo ──────────────────────────────────────────────────────
  // The promo is an entitlement tied to the chosen plan, not something the
  // applicant picks. Every value below already exists in the Applications
  // table, so nothing new is introduced into the ops vocabulary.
  //
  // Time-limited campaigns are matched first and are date-gated: an expired
  // campaign can never attach itself to a new application. Add campaigns here
  // with their real published windows.
  const promoCampaigns = [
    // Example of the shape — inactive, kept as the template for the next one.
    // {
    //   promo: 'Free 1st Month Subscription',
    //   startsOn: '2026-09-01',
    //   endsOn: '2026-12-31',
    //   appliesToPlanTitles: ['SwitchNet Plan', 'SwitchSpeed Plan', 'SwitchUltra Plan']
    // }
  ]

  // Baseline entitlement, derived from what the plan itself already includes.
  // Mirrors the inclusions shown on the plan cards so the applicant sees the
  // same promise on the form that they saw on the pricing page.
  function baselinePromoForPlan(plan) {
    if (!plan) return 'Free Installation Promo'
    if (/node/i.test(plan.mesh || '')) return 'Free Mesh Wi-Fi Router'
    if (/wi-?fi\s*6/i.test(plan.router || '')) return 'Free Dual-Band Wi-Fi 6 Router'
    return 'Free Installation Promo'
  }

  function isCampaignActive(c, now = Date.now()) {
    const start = new Date(`${c.startsOn}T00:00:00`).valueOf()
    const end = new Date(`${c.endsOn}T23:59:59`).valueOf()
    return Number.isFinite(start) && Number.isFinite(end) && now >= start && now <= end
  }

  function derivePromoForPlan(plan) {
    if (!plan) return 'Free Installation Promo'
    const campaign = promoCampaigns.find(c =>
      isCampaignActive(c) &&
      (!c.appliesToPlanTitles || c.appliesToPlanTitles.includes(plan.title))
    )
    return campaign ? campaign.promo : baselinePromoForPlan(plan)
  }

  // Read-only in the UI; recomputed whenever the plan changes.
  const derivedPromo = computed(() => derivePromoForPlan(findPlan(formData.value.selectedPlanId)))

  function applyPlanToForm(plan) {
    if (!plan) return
    formData.value.selectedPlanId = String(plan.id)
    formData.value.desiredPlan = `${plan.title} (₱${plan.price}/mo)`
    formData.value.selectedPlanPrice = plan.price
    formData.value.applicablePromo = derivePromoForPlan(plan)
  }

  // Keeps the form's plan in step with the live API list.
  function syncSelectedPlan() {
    if (!plansList.value.length) return
    const current = findPlan(formData.value.selectedPlanId) || (formData.value.desiredPlan ? findPlan(formData.value.desiredPlan) : null)
    if (current) {
      // Refresh the label/price in case the plan was renamed or repriced upstream
      applyPlanToForm(current)
      return
    }
    const fallback = plansList.value.find(p => p.recommended) || plansList.value[0]
    applyPlanToForm(fallback)
  }

  // Reconcile whenever the plan list changes (initial fetch, manual refresh)
  watch(plansList, () => syncSelectedPlan(), { immediate: true })

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

  // Referrer list transcribed from the official Switch Fiber application form.
  // 'None' is the default; the rest are active sales agents / partners.
  const referrersList = [
    "None",
    "SWITCH GAISANO",
    "PRECIOUS GAISANO",
    "Norwina A. Armas",
    "Mariane Talento Puyot",
    "Nicolas Marinay Occidental Jr.",
    "Paula Marie T. Fermanis",
    "Emylinda B. Biasca",
    "Precious Ann Vergonio",
    "Maria Nympha Vergonio",
    "Jonalyn Perez Agsalon",
    "Menandro B. Albao",
    "Vilma S. Divinagracia",
    "Anthony Francis N. Samar",
    "Keanu C. Nido",
    "Severino L. Cervo",
    "Bernadette  Delos Santos",
    "Gladiola Veron Lico",
    "Shania Manalo",
    "Ria Gielen Paclibare",
    "Cheryll Briones",
    "Vea Vianca Delos Reyes",
    "John Rainier Cernero",
    "Mark Paner",
    "Heatherlynn Hernandez",
    "Gibson Lizardo",
    "Elmer Tuyor Jr.",
    "Jordan Cerrero",
    "Carina Añonuevo",
    "Lealyn Bayos",
    "Lhen Ambao",
    "Jennylyn Calle",
    "Dan Onia",
    "Christopher George Cajes",
    "Baltazar Masucol",
    "Jennelyn Rufino",
    "Ofelia Ceñidoza",
    "Rainier Ubana",
    "Jonalyn Delima",
    "Arvin Mateo",
    "Manuel Pangilinan Jr.",
    "Regina Casano",
    "Peter Dominic Ojeda",
    "Reina Jane Ferido",
    "Sygel Landicho",
    "Jennyzell Ceñidoza"
  ]


  // Safe LocalStorage Persist Helper to prevent QuotaExceededError with base64 data
  function saveToLocalStorage() {
    try {
      const sanitizedApps = submittedApplications.value.map(app => {
        const copy = { ...app }
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
      status: 'Installation Scheduled',
      statusStep: 3,
      notes: 'Account verification completed. Fiber drop cable installation scheduled for tomorrow morning.'
    })
    saveToLocalStorage()
  }

  function resetForm() {
    currentStep.value = 1
    formData.value = getInitialFormData()
    apiError.value = null
    syncSelectedPlan()
    try {
      localStorage.removeItem('switch_registration_draft')
    } catch (e) {}
  }

  function openModal(planId = null) {
    resetForm()
    if (planId) {
      selectPlan(planId)
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

  function selectPlan(planOrId) {
    if (!planOrId) return
    const plan = typeof planOrId === 'object' && planOrId.id ? planOrId : findPlan(planOrId)
    if (plan) {
      applyPlanToForm(plan)
    }
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
      // Backend stores the bare plan name ("SwitchConnect Plan"), not the
      // display string with the price appended.
      desiredPlan: (formData.value.desiredPlan || '').replace(/\s*\(₱[^)]*\)\s*$/, '').trim(),
      proofOfBilling: '',
      governmentValidId: formData.value.governmentValidId || '',
      secondGovernmentValidId: formData.value.secondGovernmentValidId || '',
      houseFrontPicture: formData.value.houseFrontPicture || '',
      // Backend stores the literal string "Agreed" — not "true"/"false"
      termsAndConditionsAgreement: formData.value.termsAndConditionsAgreement ? 'Agreed' : '',
      firstNearestLandmark: formData.value.firstNearestLandmark || '',
      secondNearestLandmark: formData.value.secondNearestLandmark || '',
      applicablePromo: formData.value.applicablePromo || derivedPromo.value || '',
      documentPicture: '',
      barangay1: '',
      barangay2: '',
      pictureofstatmentbillingfromotherprovider: '',
      referrersAccountNumber: '',
      // Matches the values already present in the Applications table
      applyingFor: formData.value.applyingFor || 'Residential Fiber',
      status: 'Pending',
      visitBy: '',
      visitWith: '',
      visitWithOther: '',
      remarks: `Online Application ${randomCode}`,
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
      expressInstallation: formData.value.expressInstallation,
      date: new Date().toISOString().split('T')[0],
      status: 'Application Submitted',
      statusStep: 1,
      notes: 'Application logged. Account officer is reviewing uploaded government IDs and signature.',
      payload: apiPayload
    }

    submittedApplications.value.unshift(newApp)
    saveToLocalStorage()

    // Attempt POST to backend API endpoint (proxied via /api/Applications)
    try {
      const endpoint = `${API_BASE}/api/Applications`
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(apiPayload)
      })

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`)
      }
      await response.json().catch(() => ({}))
      newApp.delivered = true
    } catch (err) {
      // The application is kept locally so nothing the applicant typed is lost,
      // but we must NOT report success — previously a failed POST still showed
      // a reference code and confetti while the backend never received it.
      console.warn('Application POST failed; held locally for retry:', err)
      newApp.delivered = false
      newApp.status = 'Not yet submitted'
      newApp.notes = 'Saved on this device only — our server did not confirm receipt. Please contact us with this reference so we can complete it.'
      apiError.value = 'We could not reach our servers, so your application has not been received yet.'
    } finally {
      saveToLocalStorage()
      isSubmitting.value = false
    }

    return { referenceCode: randomCode, delivered: newApp.delivered === true }
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
    isLoadingPlans,
    plansError,
    plansLastFetched,
    fetchPlans,
    findPlan,
    applyPlanToForm,
    apiError,
    formData,
    availablePlans,
    plansList,
    regionsList,
    citiesList,
    barangaysList,
    referrersList,
    derivedPromo,
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
