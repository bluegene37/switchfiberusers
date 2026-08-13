<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
    
    <!-- Title Banner -->
    <div class="text-center space-y-4 max-w-3xl mx-auto">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ff6b67] uppercase tracking-widest">
        <Sparkles class="w-3.5 h-3.5" />
        <span>Unlimited Fiber Internet</span>
      </div>
      <h1 class="text-4xl sm:text-5xl font-extrabold font-heading text-white">Fiber Plans & Pricing</h1>
      <p class="text-slate-300 text-base leading-relaxed">
        Choose the perfect turbo-speed fiber internet plan for your home or business in Rizal. Enjoy 0 data capping, symmetrical speeds, and transparent billing.
      </p>

      <!-- Live API Status Indicator -->
      <div class="flex items-center justify-center gap-2 pt-2">
        <span v-if="isLoading" class="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
          <RotateCw class="w-3.5 h-3.5 animate-spin" />
          Fetching live plans from server...
        </span>
        <span v-else-if="plansError" class="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
          <AlertCircle class="w-3.5 h-3.5" />
          {{ plansError }}
        </span>
        <span v-else class="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
          <Wifi class="w-3.5 h-3.5 animate-pulse" />
          Live API Synced (https://103.249.198.43:8090/api/Plans)
        </span>
        <button 
          @click="refreshPlans" 
          title="Refresh plans from API" 
          class="p-1 text-slate-400 hover:text-white transition-colors"
        >
          <RotateCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
        </button>
      </div>
    </div>

    <!-- Plans Matrix Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <PlanCard 
        v-for="plan in availablePlans" 
        :key="plan.id" 
        :plan="plan" 
        @select="handleSelect"
      />
    </div>

    <!-- Detailed Plan Features Comparison Table -->
    <div class="glass-panel p-6 md:p-10 rounded-3xl border border-slate-800 space-y-6">
      <div class="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold font-heading text-white">Plan Comparison Matrix</h2>
          <p class="text-xs text-slate-400">All plans include free standard installation and ONU Wi-Fi modem.</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th class="py-4 px-4">Feature</th>
              <th 
                v-for="plan in availablePlans" 
                :key="plan.id" 
                class="py-4 px-4 text-center font-bold"
                :class="plan.recommended ? 'text-[#ff6b67]' : 'text-slate-300'"
              >
                {{ plan.title.replace(' Plan', '') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 text-sm text-slate-300">
            <tr>
              <td class="py-4 px-4 font-semibold text-white">Monthly Fee</td>
              <td 
                v-for="plan in availablePlans" 
                :key="plan.id" 
                class="py-4 px-4 text-center font-bold"
                :class="plan.recommended ? 'text-[#ff6b67]' : ''"
              >
                ₱{{ plan.price }}
              </td>
            </tr>
            <tr>
              <td class="py-4 px-4 font-semibold text-white">Speed Tier</td>
              <td 
                v-for="plan in availablePlans" 
                :key="plan.id" 
                class="py-4 px-4 text-center"
                :class="plan.recommended ? 'text-[#ff6b67] font-bold' : ''"
              >
                {{ plan.speed.replace('Turbo Speed ', '').replace('(', '').replace(')', '') }}
              </td>
            </tr>
            <tr>
              <td class="py-4 px-4 font-semibold text-white">Data Cap</td>
              <td v-for="plan in availablePlans" :key="plan.id" class="py-4 px-4 text-center text-emerald-400">
                Unlimited
              </td>
            </tr>
            <tr>
              <td class="py-4 px-4 font-semibold text-white">Router Included</td>
              <td v-for="plan in availablePlans" :key="plan.id" class="py-4 px-4 text-center">
                {{ plan.price >= 1299 ? 'Wi-Fi 6 Dual Band' : 'Dual-Band ONU' }}
              </td>
            </tr>
            <tr>
              <td class="py-4 px-4 font-semibold text-white">Lock-In Period</td>
              <td v-for="plan in availablePlans" :key="plan.id" class="py-4 px-4 text-center">
                {{ plan.lockIn }}
              </td>
            </tr>
            <tr>
              <td class="py-4 px-4 font-semibold text-white">Action</td>
              <td v-for="plan in availablePlans" :key="plan.id" class="py-4 px-4 text-center">
                <button 
                  @click="handleSelect(plan)" 
                  class="text-xs py-1.5 px-3 rounded-xl font-bold transition-all"
                  :class="plan.recommended ? 'btn-primary' : 'btn-secondary'"
                >
                  Apply
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles, RotateCw, Wifi, AlertCircle } from 'lucide-vue-next'
import PlanCard from '../components/PlanCard.vue'
import { useRegistrationStore } from '../stores/registration'

const router = useRouter()
const registrationStore = useRegistrationStore()

const availablePlans = computed(() => registrationStore.availablePlans)
const isLoading = computed(() => registrationStore.isLoadingPlans)
const plansError = computed(() => registrationStore.plansError)

function handleSelect(plan) {
  registrationStore.openModal(plan.id)
  router.push('/register')
}

function refreshPlans() {
  registrationStore.fetchPlans()
}
</script>

