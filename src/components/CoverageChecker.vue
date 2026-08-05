<template>
  <div class="glass-card p-6 md:p-8 rounded-2xl relative border dark:border-slate-800 border-slate-200">
    <div class="max-w-2xl mx-auto text-center space-y-3 mb-6">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-wider">
        <MapPin class="w-3.5 h-3.5" />
        <span>Rizal Fiber Network Serviceability</span>
      </div>
      <h3 class="text-2xl font-bold font-heading dark:text-white text-slate-900">Check Fiber Availability at Your Address</h3>
      <p class="dark:text-slate-400 text-slate-600 text-sm">
        Enter your Barangay or Municipality in Rizal (Binangonan, Angono, Taytay, Teresa, etc.) to check instant coverage.
      </p>
    </div>

    <!-- Search Input Bar -->
    <div class="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 mb-6">
      <div class="relative flex-1">
        <Search class="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input 
          v-model="inputAddress"
          @keyup.enter="handleCheck"
          type="text" 
          placeholder="e.g. Bilibiran, Binangonan or Taytay"
          class="input-field pl-11 pr-4 py-3 text-base"
        />
      </div>
      <button @click="handleCheck" class="btn-primary py-3 px-6 whitespace-nowrap">
        <span>Check Coverage</span>
        <ArrowRight class="w-4 h-4" />
      </button>
    </div>

    <!-- Result Banner -->
    <div v-if="result" class="max-w-xl mx-auto transition-all animate-in fade-in duration-300">
      <div 
        v-if="result.serviceable"
        class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-4"
      >
        <div class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
          <CheckCircle2 class="w-6 h-6" />
        </div>
        <div class="space-y-1">
          <h4 class="font-bold dark:text-emerald-300 text-emerald-700 text-sm">Fiber Internet Available!</h4>
          <p class="text-xs dark:text-slate-300 text-slate-700 leading-relaxed">{{ result.message }}</p>
          <div class="pt-2">
            <router-link to="/register" class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              <span>Proceed to Online Application</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </div>
      </div>

      <div 
        v-else
        class="p-4 rounded-xl bg-[#ee2824]/10 border border-[#ee2824]/30 flex items-start gap-4"
      >
        <div class="w-10 h-10 rounded-full bg-[#ee2824]/20 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center shrink-0">
          <Info class="w-6 h-6" />
        </div>
        <div class="space-y-1">
          <h4 class="font-bold text-[#ee2824] dark:text-[#ff6b67] text-sm">Expansion Request Noted</h4>
          <p class="text-xs dark:text-slate-300 text-slate-700 leading-relaxed">{{ result.message }}</p>
          <div class="pt-2">
            <router-link to="/register" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">
              <span>Submit Address Pre-Registration</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MapPin, Search, ArrowRight, CheckCircle2, Info } from 'lucide-vue-next'
import { useCoverageStore } from '../stores/coverage'

const coverageStore = useCoverageStore()
const inputAddress = ref('')
const result = ref(null)

function handleCheck() {
  if (!inputAddress.value.trim()) return
  result.value = coverageStore.checkAddressServiceability(inputAddress.value)
}
</script>
