<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
    
    <!-- Title Header -->
    <div class="text-center space-y-3">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-widest">
        <Search class="w-3.5 h-3.5" />
        <span>Application Status Tracker</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold font-heading dark:text-white text-slate-900">Track Your Fiber Application</h1>
      <p class="dark:text-slate-300 text-slate-600 text-sm max-w-lg mx-auto">
        Enter the Application Reference Code sent to your mobile SMS or email (e.g. SF-2026-8942) to check your installation schedule.
      </p>
    </div>

    <!-- Search Input Box -->
    <div class="glass-card p-6 md:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-4 max-w-xl mx-auto">
      <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase">Reference Code <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
      <div class="flex flex-col sm:flex-row gap-3">
        <input
          v-model="inputCode"
          @keyup.enter="handleSearch"
          type="text"
          inputmode="text"
          autocapitalize="characters"
          autocomplete="off"
          placeholder="e.g. SF-2026-8942"
          aria-label="Application reference code"
          class="input-field uppercase font-mono text-base sm:text-lg py-3"
        />
        <button @click="handleSearch" class="btn-primary py-3 px-6 whitespace-nowrap shrink-0">
          <span>Search</span>
          <Search class="w-4 h-4" />
        </button>
      </div>

      <div class="text-xs dark:text-slate-400 text-slate-500 flex items-center gap-2">
        <Info class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67] shrink-0" />
        <span>Try searching demo code: <button @click="inputCode = 'SF-2026-8942'; handleSearch()" class="text-[#ee2824] dark:text-[#ff6b67] font-mono underline font-bold">SF-2026-8942</button></span>
      </div>
    </div>

    <!-- Result Application Progress Details -->
    <div v-if="searched && foundApp" class="glass-panel p-6 md:p-10 rounded-3xl border border-[#ee2824]/40 space-y-8 animate-in fade-in duration-300">
      
      <!-- Top Summary Card -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b dark:border-slate-800 border-slate-200 pb-6">
        <div>
          <span class="text-xs dark:text-slate-400 text-slate-500 uppercase tracking-widest font-bold block mb-1">Application Reference</span>
          <h2 class="text-3xl font-extrabold font-mono text-[#ee2824] dark:text-[#ff6b67] tracking-wide">{{ foundApp.referenceCode }}</h2>
          <p class="text-sm font-bold dark:text-slate-200 text-slate-800 mt-1">{{ foundApp.applicantName }} • {{ foundApp.municipality || foundApp.city }}, Rizal</p>
        </div>
        <div class="text-left sm:text-right">
          <span class="text-xs dark:text-slate-400 text-slate-500 uppercase font-bold block mb-1">Subscribed Plan</span>
          <span class="text-base font-bold dark:text-white text-slate-900 block">{{ foundApp.plan }}</span>
          <span class="block text-xs dark:text-slate-400 text-slate-500 font-medium mt-0.5">Logged on {{ foundApp.date }}</span>
        </div>
      </div>

      <!-- Stage Timeline Progress Bar -->
      <div>
        <h3 class="text-xs font-bold dark:text-slate-400 text-slate-700 uppercase tracking-widest mb-6">Installation Stage Timeline</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div 
            v-for="(stage, idx) in stages" 
            :key="idx"
            class="p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all"
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
      <div class="p-5 rounded-2xl dark:bg-slate-950 bg-rose-50/70 border dark:border-slate-800 border-[#ee2824]/20 space-y-2 shadow-inner">
        <div class="flex items-center gap-2 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-wider">
          <MessageSquare class="w-4 h-4" />
          <span>Dispatch & Operational Note</span>
        </div>
        <p class="text-sm dark:text-slate-100 text-slate-900 leading-relaxed font-mono font-medium">{{ foundApp.notes }}</p>
      </div>

    </div>

    <!-- Not Found Banner -->
    <div v-else-if="searched && !foundApp" class="glass-card p-8 rounded-3xl border border-rose-500/30 text-center space-y-3 max-w-xl mx-auto">
      <AlertCircle class="w-10 h-10 text-rose-500 mx-auto" />
      <h3 class="text-xl font-bold dark:text-white text-slate-900">Reference Code Not Found</h3>
      <p class="text-xs dark:text-slate-400 text-slate-600">Please double check the reference code (e.g. SF-2026-8942) or contact our customer hotline for assistance.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Search, Info, CheckCircle2, Clock, MessageSquare, AlertCircle } from 'lucide-vue-next'
import { useRegistrationStore } from '../stores/registration'

const route = useRoute()
const registrationStore = useRegistrationStore()

const inputCode = ref('')
const searched = ref(false)
const foundApp = ref(null)

const stages = [
  'Online Submitted',
  'ID Verification',
  'Ocular Survey',
  'Dispatch Scheduled',
  'Connection Active'
]

function handleSearch() {
  if (!inputCode.value.trim()) return
  searched.value = true
  foundApp.value = registrationStore.findApplicationByCode(inputCode.value)
}

function loadInitialStatus() {
  const queryCode = route.query.code
  if (queryCode) {
    inputCode.value = queryCode.toString().trim()
  } else if (registrationStore.submittedApplications && registrationStore.submittedApplications.length > 0) {
    inputCode.value = registrationStore.submittedApplications[0].referenceCode
  } else {
    inputCode.value = 'SF-2026-8942'
  }
  handleSearch()
}

onMounted(() => {
  loadInitialStatus()
})

watch(() => route.query.code, (newCode) => {
  if (newCode) {
    inputCode.value = newCode.toString().trim()
    handleSearch()
  }
})
</script>
