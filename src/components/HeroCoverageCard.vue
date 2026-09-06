<template>
  <div class="glass-card p-6 sm:p-7 rounded-3xl relative overflow-hidden border border-[#ee2824]/30 shadow-2xl dark:shadow-[#ee2824]/10">
    <!-- Ambient Red Background Glow -->
    <div class="absolute -top-24 -right-24 w-64 h-64 bg-[#ee2824]/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Header & Badge -->
    <div class="flex items-center justify-between gap-2 mb-5">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-wider">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ee2824] opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-[#ee2824]"></span>
        </span>
        <span>Quick Serviceability Check</span>
      </div>
      <span class="text-xs dark:text-slate-400 text-slate-500 font-mono hidden sm:inline-block">Rizal Fiber Grid</span>
    </div>

    <div class="mb-5">
      <h2 class="text-xl sm:text-2xl font-extrabold font-heading dark:text-white text-slate-900 leading-snug">
        Is Your Home <span class="text-gradient-red">Fiber-Ready</span>?
      </h2>
      <p class="dark:text-slate-400 text-slate-600 text-xs sm:text-sm mt-1">
        Select your location in Rizal to check instant line availability and active promos.
      </p>
    </div>

    <!-- Selection Controls -->
    <div class="space-y-3.5 mb-5">
      <!-- Municipality Select -->
      <div>
        <label for="hero-municipality-select" class="block text-xs font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700 mb-1.5">
          Municipality / City
        </label>
        <div class="relative">
          <select
            id="hero-municipality-select"
            v-model="selectedMunicipality"
            @change="handleMunicipalityChange"
            class="input-field py-3 pr-10 text-sm font-medium w-full appearance-none cursor-pointer min-h-[44px]"
            aria-label="Select Municipality in Rizal"
          >
            <option v-for="m in availableMunicipalities" :key="m" :value="m">
              {{ m }} (Rizal)
            </option>
          </select>
          <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown class="w-4 h-4" />
          </div>
        </div>
      </div>

      <!-- Barangay Select -->
      <div>
        <label for="hero-barangay-select" class="block text-xs font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700 mb-1.5">
          Barangay / Area
        </label>
        <div class="relative">
          <select
            id="hero-barangay-select"
            v-model="selectedBarangay"
            class="input-field py-3 pr-10 text-sm font-medium w-full appearance-none cursor-pointer min-h-[44px]"
            aria-label="Select Barangay or Area"
          >
            <option v-for="b in availableBarangays" :key="b.name" :value="b.name">
              {{ b.name }} {{ b.isFiberActive ? '🟢 (Fiber Active)' : '🟡 (Expansion)' }}
            </option>
          </select>
          <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown class="w-4 h-4" />
          </div>
        </div>
      </div>

      <!-- Optional Street / Subdivision Lookup -->
      <div>
        <label for="hero-street-input" class="block text-xs font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700 mb-1.5">
          Subdivision, Street, or Landmark <span class="text-slate-400 font-normal normal-case">(Optional)</span>
        </label>
        <div class="relative">
          <MapPin class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="hero-street-input"
            v-model="customStreet"
            type="text"
            placeholder="e.g. Sta. Ursula Subd., Oliveros St., Block 5"
            class="input-field pl-10 pr-4 py-3 text-sm font-medium w-full min-h-[44px]"
            aria-label="Subdivision, street, or landmark"
          />
        </div>
      </div>
    </div>

    <!-- Status & Results Card -->
    <div 
      v-if="serviceabilityInfo" 
      class="p-4 rounded-2xl mb-5 transition-all duration-300 border"
      :class="serviceabilityInfo.isCovered 
        ? 'bg-emerald-500/10 border-emerald-500/30' 
        : 'bg-amber-500/10 border-amber-500/30'"
    >
      <div class="flex items-start gap-3">
        <div 
          class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          :class="serviceabilityInfo.isCovered 
            ? 'bg-emerald-500/20 text-emerald-500' 
            : 'bg-amber-500/20 text-amber-500'"
        >
          <CheckCircle2 v-if="serviceabilityInfo.isCovered" class="w-5 h-5" />
          <Clock v-else class="w-5 h-5" />
        </div>

        <div class="space-y-1.5 min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span 
              class="text-xs font-extrabold uppercase px-2 py-0.5 rounded-full"
              :class="serviceabilityInfo.isCovered 
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'"
            >
              {{ serviceabilityInfo.isCovered ? 'Active Service Zone' : 'Expansion Queue' }}
            </span>
            <span class="text-xs font-bold dark:text-white text-slate-900 truncate">
              {{ selectedBarangay }}, {{ selectedMunicipality }}
            </span>
          </div>

          <p class="text-xs dark:text-slate-300 text-slate-700 leading-relaxed">
            <span v-if="serviceabilityInfo.isCovered">
              Pure Fiber lines are installed and operational. Enjoy <strong>{{ serviceabilityInfo.speed }}</strong> with <strong>0 Data Cap</strong>.
            </span>
            <span v-else>
              Engineering teams are planning line extension. Pre-register now to speed up deployment to your street!
            </span>
          </p>

          <!-- Covered Areas Chips (if available) -->
          <div v-if="serviceabilityInfo.coveredStreets && serviceabilityInfo.coveredStreets.length" class="pt-1">
            <span class="text-[11px] font-semibold dark:text-slate-400 text-slate-500 block mb-1">
              Confirmed Covered Streets & Subdivisions:
            </span>
            <div class="flex flex-wrap gap-1">
              <span 
                v-for="st in serviceabilityInfo.coveredStreets.slice(0, 3)" 
                :key="st" 
                class="text-[10px] px-2 py-0.5 rounded-md dark:bg-slate-900/80 bg-white/80 border dark:border-slate-800 border-slate-200 dark:text-slate-300 text-slate-700"
              >
                {{ st }}
              </span>
              <span 
                v-if="serviceabilityInfo.coveredStreets.length > 3" 
                class="text-[10px] px-1.5 py-0.5 text-slate-400"
              >
                +{{ serviceabilityInfo.coveredStreets.length - 3 }} more
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <div class="space-y-3">
      <button
        type="button"
        @click="handleApplyForAddress"
        class="btn-primary w-full py-3.5 px-5 text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#ee2824]/25 min-h-[44px]"
      >
        <Sparkles class="w-4 h-4" />
        <span>{{ serviceabilityInfo?.isCovered ? 'Apply for this Address' : 'Pre-Register this Address' }}</span>
        <ArrowRight class="w-4 h-4 ml-auto" />
      </button>

      <div class="flex items-center justify-between text-xs pt-1 dark:text-slate-400 text-slate-500">
        <router-link to="/coverage" class="hover:text-[#ee2824] dark:hover:text-[#ff6b67] inline-flex items-center gap-1 transition-colors">
          <Map class="w-3.5 h-3.5" />
          <span>Rizal Map</span>
        </router-link>
        <router-link to="/status" class="hover:text-[#ee2824] dark:hover:text-[#ff6b67] inline-flex items-center gap-1 transition-colors font-medium">
          <Search class="w-3.5 h-3.5 text-[#ee2824] dark:text-[#ff6b67]" />
          <span>Track Application</span>
        </router-link>
        <span class="inline-flex items-center gap-1 text-emerald-500 font-semibold">
          <Zap class="w-3.5 h-3.5" />
          <span>Free Install</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  MapPin, CheckCircle2, Clock, Sparkles, ArrowRight, 
  ChevronDown, Map, Zap, Search 
} from 'lucide-vue-next'
import { useCoverageStore } from '../stores/coverage'
import { useRegistrationStore } from '../stores/registration'
import { coverageBarangaysByCity, samePlace } from '../data/calabarzonLocations'

const router = useRouter()
const coverageStore = useCoverageStore()
const registrationStore = useRegistrationStore()

// State
const selectedMunicipality = ref('Binangonan')
const selectedBarangay = ref('Batingan (HQ)')
const customStreet = ref('')

// Available Municipalities in Rizal
const availableMunicipalities = computed(() => {
  return [
    'Binangonan',
    'Angono',
    'Taytay',
    'Antipolo',
    'Cardona',
    'Morong',
    'Teresa',
    'Baras',
    'Tanay'
  ]
})

// Barangays for selected municipality
const availableBarangays = computed(() => {
  const mun = selectedMunicipality.value
  const zones = coverageStore.coverageList.filter(z => samePlace(z.municipality, mun))
  
  if (mun === 'Binangonan') {
    // Official active list from coverageStore
    return zones.map(z => ({
      name: z.name,
      isFiberActive: true,
      zone: z
    }))
  }

  // If we have mapped zones for this municipality
  if (zones.length > 0) {
    return zones.map(z => ({
      name: z.name,
      isFiberActive: z.status === 'Available Now' || z.status === 'Active',
      zone: z
    }))
  }

  // Fallback if none mapped in coverageStore yet
  return [
    { name: 'Poblacion', isFiberActive: false, zone: null },
    { name: 'Central Area', isFiberActive: false, zone: null }
  ]
})

// Current Serviceability Info
const serviceabilityInfo = computed(() => {
  const mun = selectedMunicipality.value
  const bName = selectedBarangay.value

  // Look for direct match in coverageList
  const matched = coverageStore.coverageList.find(z => 
    samePlace(z.municipality, mun) && (
      samePlace(z.name, bName) || 
      z.name.toLowerCase().includes(bName.toLowerCase()) || 
      bName.toLowerCase().includes(z.name.toLowerCase())
    )
  )

  if (matched) {
    return {
      isCovered: true,
      speed: matched.speed || 'Up to 500 Mbps',
      nodes: matched.activeNodes || 'Fiber Node Active',
      connectedHomes: matched.connectedHomes || 'Connected Homes',
      coveredStreets: matched.coveredAreas || [],
      zone: matched
    }
  }

  // Check if it's in the curated Binangonan list
  const isBinangonanActive = mun === 'Binangonan' && (
    coverageBarangaysByCity.Binangonan?.some(b => samePlace(b, bName))
  )

  if (isBinangonanActive) {
    return {
      isCovered: true,
      speed: 'Up to 500 Mbps',
      nodes: 'Active Fiber Node',
      connectedHomes: 'Active Coverage',
      coveredStreets: [],
      zone: null
    }
  }

  return {
    isCovered: false,
    speed: 'Up to 500 Mbps planned',
    nodes: 'Under expansion survey',
    connectedHomes: 'Pending Rollout',
    coveredStreets: [],
    zone: null
  }
})

// Handle municipality change
function handleMunicipalityChange() {
  if (availableBarangays.value.length > 0) {
    selectedBarangay.value = availableBarangays.value[0].name
  } else {
    selectedBarangay.value = ''
  }
}

// Handle action button click
function handleApplyForAddress() {
  // Pre-fill registration store form data
  registrationStore.formData.region = 'Rizal'
  registrationStore.formData.city = selectedMunicipality.value
  
  // Clean barangay name from any parentheticals like "(HQ)" or "(Phase 2 & 3)"
  const cleanBarangay = selectedBarangay.value.replace(/\s*\([^)]*\)/g, '').trim()
  registrationStore.formData.barangay = cleanBarangay || selectedBarangay.value
  
  if (customStreet.value.trim()) {
    registrationStore.formData.installationAddress = customStreet.value.trim()
  }

  // Route to the registration wizard
  router.push('/register')
}
</script>
