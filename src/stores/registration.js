import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const regionsList = [
  'Region IV-A (CALABARZON)',
  'National Capital Region (NCR)',
  'Region III (Central Luzon)'
]

export const citiesList = [
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

export const barangaysList = [
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
export const referrersList = [
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

export const useRegistrationStore = defineStore('registration', () => {
  const currentStep = ref(1)
  const isModalOpen = ref(false)
  const isSubmitting = ref(false)
  const apiError = ref(null)
  const submittedCode = ref('')
  const resetSignal = ref(0)
  // Full technical detail of the last failed submit, for support/debugging
  const lastSubmitError = ref(null)

  // Reference code for the in-flight application. Reused across retries so a
  // failed-then-retried submit does not hand the applicant a different code
  // each time (and does not fill the backend with near-duplicate rows).
  const pendingReferenceCode = ref('')

  // Documents are transmitted as short filename strings only. The backend's
  // Application table stores these in fixed-width nvarchar columns (~255), so
  // posting a base64 data URI makes SQL Server raise
  // "String or binary data would be truncated" (error 8152/2628) and the whole
  // application is rejected. A previous build exposed a UI toggle for a raw
  // base64 mode; it could only ever fail, so it is gone.
  try {
    localStorage.removeItem('switch_upload_payload_mode')
  } catch (e) {}

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
    applyingFor: 'Residential Fiber',
    city: 'Binangonan',
    barangay: '',
    installationAddress: '',
    landmark: '',
    firstNearestLandmark: '',
    secondNearestLandmark: '',
    
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
    proofOfBilling: '',
    proofOfBillingName: '',
    documentPicture: '',
    documentPictureName: '',

    // Option Features
    expressInstallation: false,

    // Agreement
    termsAndConditionsAgreement: false,
    applicationReferenceCode: '',
    submissionDate: ''
  })

  // Registration Form State with localStorage draft auto-recovery
  // Bump when the form's field set or default values change, so a returning
  // visitor's saved draft can't keep posting values the backend no longer uses.
  const DRAFT_VERSION = 3

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
      if (draft[key] !== undefined && draft[key] !== '') base[key] = draft[key]
    }
    if (!regionsList.includes(base.region)) {
      base.region = 'Region IV-A (CALABARZON)'
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
      draft.proofOfBilling = ''
      draft.documentPicture = ''
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

  // Safe LocalStorage Persist Helper to prevent QuotaExceededError with base64 data
  function saveToLocalStorage() {
    try {
      // Keep only the last 20 confirmed applications; the tracker never needs more.
      const sanitizedApps = submittedApplications.value.slice(0, 20).map(({ payload, ...app }) => app)
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

  function resetForm() {
    currentStep.value = 1
    submittedCode.value = ''
    formData.value = getInitialFormData()
    apiError.value = null
    lastSubmitError.value = null
    pendingReferenceCode.value = ''
    syncSelectedPlan()
    resetSignal.value++
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

  // Column widths probed against the live Application table. SQL Server
  // rejects the entire insert when a value overflows its column, so cap here
  // instead of letting the applicant lose a filled-in form to an HTTP 500.
  const FIELD_LIMITS = {
    firstName: 100,
    middleName: 100,
    lastName: 100,
    emailAddress: 100,
    mobileNumber: 20,
    secondaryMobileNumber: 20,
    region: 100,
    city: 100,
    barangay: 100,
    installationAddress: 255,
    landmark: 255,
    firstNearestLandmark: 255,
    secondNearestLandmark: 255,
    desiredPlan: 100,
    applicablePromo: 100,
    applyingFor: 100,
    referredBy: 150,
    remarks: 255,
    status: 50
  }

  // The backend has been observed taking >13s on a cold connection, so the
  // ceiling is generous. Without one, a stalled request leaves the applicant
  // staring at a spinner with no way to know it failed.
  const SUBMIT_TIMEOUT_MS = 45000

  function cap(key, value) {
    const str = (value === null || value === undefined ? '' : String(value)).trim()
    const limit = FIELD_LIMITS[key]
    return limit ? str.slice(0, limit) : str
  }

  // Documents travel as a short filename only — never a base64 data URI, which
  // the backend's nvarchar columns cannot hold.
  function documentFilename(name, dataUri, fallbackName) {
    if (name && typeof name === 'string' && !name.startsWith('data:')) {
      const clean = name.replace(/^.*[\\\/]/, '').trim()
      if (clean.length > 0) return clean.slice(0, 120)
    }
    const hasUpload = (typeof dataUri === 'string' && dataUri.length > 0) ||
                      (typeof name === 'string' && name.length > 0)
    return hasUpload ? fallbackName : ''
  }

  async function submitApplication() {
    // Guard against a double-click or an impatient second tap queueing a
    // duplicate application while the first request is still open.
    if (isSubmitting.value) {
      return {
        referenceCode: pendingReferenceCode.value,
        delivered: false,
        alreadyRunning: true,
        error: lastSubmitError.value
      }
    }

    isSubmitting.value = true
    apiError.value = null

    const now = new Date()

    // Retrying a failed submit keeps the same reference code: the earlier
    // attempt never created a row, and a fresh code each time would leave the
    // applicant holding a code nobody can find.
    if (!pendingReferenceCode.value) {
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const randomSuffix = Math.floor(10 + Math.random() * 90)
      pendingReferenceCode.value = `SF-${year}${month}${day}-${hours}${minutes}${seconds}-${randomSuffix}`
    }

    const randomCode = pendingReferenceCode.value
    formData.value.applicationReferenceCode = randomCode
    formData.value.submissionDate = now.toISOString()

    const houseFrontVal = documentFilename(
      formData.value.houseFrontName,
      formData.value.houseFrontPicture,
      'house_front_photo.jpg'
    )
    const governmentValidIdVal = documentFilename(
      formData.value.governmentValidIdName,
      formData.value.governmentValidId,
      'government_valid_id.jpg'
    )
    const secondGovernmentValidIdVal = documentFilename(
      formData.value.secondGovernmentValidIdName,
      formData.value.secondGovernmentValidId,
      'second_valid_id.jpg'
    )
    const proofOfBillingVal = documentFilename(
      formData.value.proofOfBillingName,
      formData.value.proofOfBilling,
      'proof_of_billing.pdf'
    )
    const documentPictureVal = documentFilename(
      formData.value.documentPictureName,
      formData.value.documentPicture,
      'supporting_document.pdf'
    )

    const firstNearestLandmarkText = cap('firstNearestLandmark', formData.value.firstNearestLandmark)
    const secondNearestLandmarkText = cap('secondNearestLandmark', formData.value.secondNearestLandmark)
    const landmarkText = cap('landmark', formData.value.landmark || firstNearestLandmarkText)

    const apiPayload = {
      timestamp: formData.value.submissionDate,
      emailAddress: cap('emailAddress', formData.value.emailAddress),
      region: cap('region', formData.value.region),
      city: cap('city', formData.value.city),
      barangay: cap('barangay', formData.value.barangay),
      referredBy: cap('referredBy', formData.value.referredBy),
      firstName: cap('firstName', formData.value.firstName),
      middleName: cap('middleName', formData.value.middleName),
      lastName: cap('lastName', formData.value.lastName),
      mobileNumber: cap('mobileNumber', formData.value.mobileNumber),
      secondaryMobileNumber: cap('secondaryMobileNumber', formData.value.secondaryMobileNumber),
      installationAddress: cap('installationAddress', formData.value.installationAddress),
      landmark: landmarkText,
      // Backend stores the bare plan name ("SwitchConnect Plan"), not the
      // display string with the price appended.
      desiredPlan: cap('desiredPlan', (formData.value.desiredPlan || '').replace(/\s*\(₱[^)]*\)\s*$/, '')),
      proofOfBilling: proofOfBillingVal,
      governmentValidId: governmentValidIdVal,
      secondGovernmentValidId: secondGovernmentValidIdVal,
      houseFrontPicture: houseFrontVal,
      // Backend stores the literal string "Yes, I Agree" if checked, or empty string if unchecked
      termsAndConditionsAgreement: formData.value.termsAndConditionsAgreement ? 'Yes, I Agree' : '',
      firstNearestLandmark: firstNearestLandmarkText,
      secondNearestLandmark: secondNearestLandmarkText,
      applicablePromo: cap('applicablePromo', formData.value.applicablePromo || derivedPromo.value),
      documentPicture: documentPictureVal,
      barangay1: '',
      barangay2: '',
      pictureofstatmentbillingfromotherprovider: '',
      referrersAccountNumber: '',
      // Matches the values already present in the Applications table
      applyingFor: cap('applyingFor', formData.value.applyingFor || 'Residential Fiber'),
      status: 'In Progress',
      visitBy: '',
      visitWith: '',
      visitWithOther: '',
      remarks: cap('remarks', `Online Application ${randomCode}`),
      modifiedBy: '0',
      modifiedDate: '',
      userEmail: cap('emailAddress', formData.value.emailAddress)
    }

    const endpoint = `${API_BASE}/api/Applications`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS)
    let delivered = false

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(apiPayload),
        signal: controller.signal
      })

      if (!response.ok) {
        // The server's body usually carries the real cause (validation errors,
        // column overflow, etc). Read it as text so we keep it even when the
        // response isn't JSON.
        const body = await response.text().catch(() => '')
        const err = new Error(`HTTP ${response.status} ${response.statusText || ''}`.trim())
        err.httpStatus = response.status
        err.responseBody = body
        throw err
      }

      await response.json().catch(() => ({}))
      delivered = true

      // Only a confirmed insert becomes a trackable application.
      submittedApplications.value.unshift({
        referenceCode: randomCode,
        applicantName: `${apiPayload.firstName} ${apiPayload.middleName ? apiPayload.middleName + ' ' : ''}${apiPayload.lastName}`.trim(),
        email: apiPayload.emailAddress,
        mobile: apiPayload.mobileNumber,
        plan: formData.value.desiredPlan,
        city: apiPayload.city,
        barangay: apiPayload.barangay,
        streetAddress: apiPayload.installationAddress,
        expressInstallation: formData.value.expressInstallation,
        date: now.toISOString().split('T')[0],
        status: 'Application Submitted',
        statusStep: 1,
        notes: 'Application logged. Account officer is reviewing your submitted details.',
        delivered: true
      })
      saveToLocalStorage()

      lastSubmitError.value = null
      submittedCode.value = randomCode
      pendingReferenceCode.value = ''
    } catch (err) {
      // Nothing reached the backend, so this must never look like a success.
      // The applicant's answers stay in the auto-saved draft, so retrying does
      // not mean retyping the form.
      const aborted = err.name === 'AbortError'
      const detail = {
        at: new Date().toISOString(),
        referenceCode: randomCode,
        endpoint,
        httpStatus: err.httpStatus ?? null,
        message: aborted
          ? `Timed out after ${Math.round(SUBMIT_TIMEOUT_MS / 1000)}s`
          : (err.message || String(err)),
        likelyCause: aborted
          ? 'The server did not answer in time.'
          : (err.httpStatus
            ? 'Server rejected the request — see responseBody.'
            : 'Request never reached the server (network, CORS, or TLS certificate).'),
        responseBody: (err.responseBody || '').slice(0, 2000),
        payloadSizeKb: Math.round(JSON.stringify(apiPayload).length / 1024)
      }
      lastSubmitError.value = detail

      console.error(
        '[Switch Fiber] Application submit FAILED\n' +
        `  reference : ${detail.referenceCode}\n` +
        `  endpoint  : ${detail.endpoint}\n` +
        `  http      : ${detail.httpStatus ?? '(no response)'}\n` +
        `  message   : ${detail.message}\n` +
        `  cause     : ${detail.likelyCause}\n` +
        `  payload   : ${detail.payloadSizeKb} KB\n` +
        `  body      : ${detail.responseBody || '(empty)'}`
      )

      apiError.value = 'We could not reach our servers, so your application has not been received yet.'
    } finally {
      clearTimeout(timeoutId)
      isSubmitting.value = false
    }

    return {
      referenceCode: randomCode,
      delivered,
      error: lastSubmitError.value
    }
  }

  function findApplicationByCode(code) {
    if (!code) return null
    const cleanCode = code.trim().toUpperCase()
    const found = submittedApplications.value.find(
      app => app.referenceCode?.toUpperCase() === cleanCode && app.delivered !== false
    )
    if (found) return found

    // Built-in Demo Code for previewing the tracker UI
    if (cleanCode === 'SF-2026-8942') {
      return {
        referenceCode: 'SF-2026-8942',
        applicantName: 'Juan Dela Cruz (Demo)',
        mobile: '09171234567',
        plan: 'SwitchConnect Plan (₱799/mo)',
        city: 'Binangonan',
        barangay: 'Bilibiran',
        date: '2026-08-01',
        status: 'Installation Scheduled',
        statusStep: 3,
        notes: 'Account verification completed. Fiber drop cable installation scheduled for tomorrow morning.'
      }
    }

    return null
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
    lastSubmitError,
    submittedApplications,
    submittedCode,
    resetSignal,
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
