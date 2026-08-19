<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
    
    <!-- Title Header -->
    <div class="text-center space-y-3">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-widest">
        <Lock class="w-3.5 h-3.5" />
        <span>Official Secure Portal</span>
      </div>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading dark:text-white text-slate-900">
        Track Your Fiber Application
      </h1>
      <p class="dark:text-slate-300 text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
        Enter your unique Application Reference Number to check your engineering verification status and technician installation schedule.
      </p>
    </div>

    <!-- Search Input Box Card -->
    <div class="glass-card p-6 sm:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 shadow-xl space-y-5 max-w-2xl mx-auto">
      <div>
        <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-2">
          Application Reference Number <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span>
        </label>
        
        <div class="relative">
          <input
            v-model="inputCode"
            @keyup.enter="handleSearch"
            type="text"
            inputmode="text"
            autocapitalize="characters"
            autocomplete="off"
            placeholder="e.g. SF-20260819-1234-56"
            aria-label="Application reference number"
            class="input-field uppercase font-mono text-lg sm:text-xl py-3.5 pl-4 pr-12 tracking-wide font-bold"
          />
          <button 
            v-if="inputCode" 
            @click="inputCode = ''" 
            type="button" 
            class="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            title="Clear input"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="flex items-center justify-between text-xs dark:text-slate-400 text-slate-500 mt-2">
          <span>Format: <strong class="font-mono text-slate-700 dark:text-slate-300">SF-YYYYMMDD-XXXX</strong></span>
          <span class="text-[11px] text-slate-400">Found in SMS or email receipt</span>
        </div>
      </div>

      <!-- BIG, PROMINENT ACTION BUTTONS ROW -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <button 
          @click="handleSearch" 
          type="button"
          class="sm:col-span-2 btn-primary py-4 px-6 text-base font-extrabold flex items-center justify-center gap-2.5 shadow-lg shadow-[#ee2824]/25 cursor-pointer"
        >
          <Search class="w-5 h-5" />
          <span>Track Application</span>
        </button>

        <button 
          @click="handleReset" 
          type="button"
          class="py-4 px-6 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 hover:text-[#ee2824] dark:hover:text-[#ff6b67] text-base font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          title="Reset tracker and clear search"
        >
          <RotateCcw class="w-5 h-5 text-[#ee2824] dark:text-[#ff6b67]" />
          <span>Reset</span>
        </button>
      </div>

      <!-- Data Privacy Badge -->
      <div class="pt-2 border-t dark:border-slate-800/80 border-slate-200/80 flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 text-center">
        <ShieldCheck class="w-4 h-4 text-emerald-500 shrink-0" />
        <span>Protected under Republic Act No. 10173 (Data Privacy Act of 2012). Personal information is masked.</span>
      </div>
    </div>

    <!-- State 1: Clean Initial Default State (Before Search) -->
    <div v-if="!searched" class="space-y-8 animate-in fade-in duration-300">
      
      <!-- Tracker Informational Steps Guide -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="glass-card p-6 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-3 text-center sm:text-left">
          <div class="w-10 h-10 rounded-2xl bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center font-bold text-base mx-auto sm:mx-0">
            <FileCheck class="w-5 h-5" />
          </div>
          <h4 class="font-bold text-base dark:text-white text-slate-900">1. Enter Reference</h4>
          <p class="text-xs dark:text-slate-400 text-slate-600 leading-relaxed">
            Input the reference code received via SMS or email after submitting your registration.
          </p>
        </div>

        <div class="glass-card p-6 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-3 text-center sm:text-left">
          <div class="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-base mx-auto sm:mx-0">
            <Truck class="w-5 h-5" />
          </div>
          <h4 class="font-bold text-base dark:text-white text-slate-900">2. Dispatch Updates</h4>
          <p class="text-xs dark:text-slate-400 text-slate-600 leading-relaxed">
            Monitor engineering line feasibility, slot confirmation, and assigned field crew dispatch notes.
          </p>
        </div>

        <div class="glass-card p-6 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-3 text-center sm:text-left">
          <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base mx-auto sm:mx-0">
            <Wifi class="w-5 h-5" />
          </div>
          <h4 class="font-bold text-base dark:text-white text-slate-900">3. Fiber Activation</h4>
          <p class="text-xs dark:text-slate-400 text-slate-600 leading-relaxed">
            View live modem signal status, installation sign-off, and account activation confirmation.
          </p>
        </div>
      </div>

      <!-- Help Accordion / FAQ banner -->
      <div class="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border dark:border-slate-800 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <h4 class="font-bold text-sm dark:text-white text-slate-900 flex items-center gap-2">
            <HelpCircle class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
            <span>Need assistance with your reference code?</span>
          </h4>
          <p class="text-xs dark:text-slate-400 text-slate-600">
            If you did not receive an SMS receipt or need to update your contact details, our customer support team is available 24/7.
          </p>
        </div>
        <router-link 
          to="/contact" 
          class="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border dark:border-slate-700 border-slate-300 text-xs font-bold hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          Contact Support
        </router-link>
      </div>

    </div>

    <!-- State 2: Result Application Progress Details -->
    <div v-else-if="searched && foundApp" class="glass-panel p-6 sm:p-10 rounded-3xl border border-[#ee2824]/40 space-y-8 animate-in fade-in duration-300 shadow-2xl">
      
      <!-- Top Summary Card Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b dark:border-slate-800 border-slate-200 pb-6">
        <div>
          <span class="text-xs dark:text-slate-400 text-slate-500 uppercase tracking-widest font-bold block mb-1">
            Application Reference Number
          </span>
          <div class="flex items-center gap-3">
            <h2 class="text-2xl sm:text-3xl font-extrabold font-mono text-[#ee2824] dark:text-[#ff6b67] tracking-wide">
              {{ foundApp.referenceCode }}
            </h2>
            <button 
              @click="copyCode(foundApp.referenceCode)" 
              type="button" 
              class="p-2 rounded-xl border dark:border-slate-700 border-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
              :title="copied ? 'Copied to clipboard' : 'Copy Reference Code'"
            >
              <Check v-if="copied" class="w-4 h-4 text-emerald-500" />
              <Copy v-else class="w-4 h-4" />
            </button>
          </div>
          <!-- Masked PII for public safety -->
          <p class="text-sm font-bold dark:text-slate-200 text-slate-800 mt-1.5 flex items-center gap-2">
            <span>{{ maskName(foundApp.applicantName) }}</span>
            <span class="dark:text-slate-600 text-slate-400">•</span>
            <span class="text-xs dark:text-slate-400 text-slate-600">{{ foundApp.city || foundApp.municipality || 'Rizal' }}</span>
          </p>
        </div>

        <div class="text-left sm:text-right">
          <span class="text-xs dark:text-slate-400 text-slate-500 uppercase font-bold block mb-1">Subscribed Plan</span>
          <span class="text-base font-extrabold dark:text-white text-slate-900 block">{{ foundApp.plan }}</span>
          <span class="block text-xs dark:text-slate-400 text-slate-500 font-medium mt-0.5">Filed on {{ foundApp.date || 'Recent' }}</span>
        </div>
      </div>

      <!-- Stage Timeline Progress Bar -->
      <div>
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-widest">
            Installation Stage Timeline
          </h3>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {{ foundApp.status || 'Active' }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            v-for="(stage, idx) in stages" 
            :key="idx"
            class="p-4 sm:p-5 rounded-2xl border flex flex-col justify-between space-y-3 transition-all"
            :class="[
              foundApp.statusStep > idx + 1 ? 'dark:bg-emerald-500/10 bg-emerald-50/90 dark:border-emerald-500/40 border-emerald-300 dark:text-emerald-300 text-emerald-900 font-bold' :
              foundApp.statusStep === idx + 1 ? 'dark:bg-[#ee2824]/10 bg-rose-50 dark:border-[#ee2824] border-[#ee2824] dark:text-[#ff6b67] text-[#ee2824] font-bold shadow-lg shadow-[#ee2824]/20' :
              'dark:bg-slate-900/60 bg-slate-100 dark:border-slate-800 border-slate-300 dark:text-slate-400 text-slate-700 font-semibold'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-wider">Stage {{ idx + 1 }}</span>
              <CheckCircle2 v-if="foundApp.statusStep > idx + 1" class="w-4 h-4 text-emerald-500" />
              <Clock v-else-if="foundApp.statusStep === idx + 1" class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67] animate-spin" />
            </div>
            <h4 class="font-bold text-sm">{{ stage }}</h4>
          </div>
        </div>
      </div>

      <!-- Current Dispatch Notes -->
      <div class="p-5 sm:p-6 rounded-2xl dark:bg-slate-950 bg-rose-50/70 border dark:border-slate-800 border-[#ee2824]/20 space-y-2 shadow-inner">
        <div class="flex items-center gap-2 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-wider">
          <MessageSquare class="w-4 h-4" />
          <span>Dispatch & Operational Update</span>
        </div>
        <p class="text-sm dark:text-slate-100 text-slate-900 leading-relaxed font-mono font-medium">
          {{ foundApp.notes || 'Your application is currently being processed by Switch Fiber engineering operations.' }}
        </p>
      </div>

      <!-- Masked Security Footer & Big Reset Button -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t dark:border-slate-800 border-slate-200">
        <div class="text-xs dark:text-slate-400 text-slate-500 flex items-center gap-2 text-center sm:text-left">
          <ShieldCheck class="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Sensitive details masked for security under RA 10173.</span>
        </div>

        <button 
          @click="handleReset"
          type="button"
          class="w-full sm:w-auto py-3.5 px-8 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white hover:text-[#ee2824] dark:hover:text-[#ff6b67] text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <RotateCcw class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
          <span>Reset & Search Another Application</span>
        </button>
      </div>

    </div>

    <!-- State 3: Not Found Banner -->
    <div v-else-if="searched && !foundApp" class="glass-card p-8 sm:p-10 rounded-3xl border border-rose-500/30 text-center space-y-5 max-w-xl mx-auto animate-in fade-in duration-300 shadow-xl">
      <div class="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
        <AlertCircle class="w-8 h-8" />
      </div>
      
      <div class="space-y-2">
        <h3 class="text-xl sm:text-2xl font-bold dark:text-white text-slate-900">
          Reference Number Not Found
        </h3>
        <p class="text-sm dark:text-slate-300 text-slate-600">
          No active record was found matching <span class="font-mono font-bold text-[#ee2824] dark:text-[#ff6b67]">{{ inputCode }}</span>.
        </p>
      </div>

      <p class="text-xs dark:text-slate-400 text-slate-500 max-w-md mx-auto leading-relaxed">
        Please check for any typographical errors or refer to the official confirmation SMS / email received upon submitting your application.
      </p>

      <div class="pt-2 flex flex-col sm:flex-row justify-center gap-3">
        <button 
          @click="handleReset" 
          type="button" 
          class="py-3.5 px-8 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white hover:text-[#ee2824] dark:hover:text-[#ff6b67] text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <RotateCcw class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
          <span>Reset & Try Again</span>
        </button>

        <router-link
          to="/contact"
          class="btn-secondary py-3.5 px-6 text-sm font-bold flex items-center justify-center gap-2"
        >
          <span>Contact Hotline</span>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  AlertCircle, 
  RotateCcw, 
  X, 
  Lock, 
  ShieldCheck, 
  FileCheck, 
  Truck, 
  Wifi, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-vue-next'
import { useRegistrationStore } from '../stores/registration'

const route = useRoute()
const router = useRouter()
const registrationStore = useRegistrationStore()

const inputCode = ref('')
const searched = ref(false)
const foundApp = ref(null)
const copied = ref(false)

const stages = [
  'Application Submitted',
  'Under Verification',
  'Installation Scheduled',
  'Connection Active'
]

// PII Data Masking function for Data Privacy Act compliance on public screens
function maskName(name) {
  if (!name) return ''
  return name
    .split(' ')
    .filter(Boolean)
    .map(word => {
      if (word.length <= 2) return word[0] + '*'
      return word[0] + '*'.repeat(Math.max(1, word.length - 2)) + word[word.length - 1]
    })
    .join(' ')
}

function copyCode(code) {
  if (!code) return
  navigator.clipboard.writeText(code).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

function handleSearch() {
  const code = inputCode.value.trim()
  if (!code) return
  searched.value = true
  foundApp.value = registrationStore.findApplicationByCode(code)
}

function handleReset() {
  inputCode.value = ''
  searched.value = false
  foundApp.value = null
  if (route.query.code) {
    router.replace({ path: route.path, query: {} })
  }
}

function loadInitialStatus() {
  const queryCode = route.query.code
  if (queryCode) {
    inputCode.value = queryCode.toString().trim()
    handleSearch()
  } else {
    // Clean default state on initial load
    inputCode.value = ''
    searched.value = false
    foundApp.value = null
  }
}

onMounted(() => {
  loadInitialStatus()
})

watch(() => route.query.code, (newCode) => {
  if (newCode) {
    inputCode.value = newCode.toString().trim()
    handleSearch()
  } else {
    handleReset()
  }
})
</script>
