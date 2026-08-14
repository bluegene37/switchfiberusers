<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
    
    <!-- Title Banner -->
    <div class="text-center space-y-4 max-w-3xl mx-auto">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-widest">
        <Sparkles class="w-3.5 h-3.5" />
        <span>Unlimited Fiber Internet</span>
      </div>
      <h1 class="text-4xl sm:text-5xl font-extrabold font-heading dark:text-white text-slate-900">Fiber Plans & Pricing</h1>
      <p class="dark:text-slate-300 text-slate-600 text-base leading-relaxed">
        Choose the perfect turbo-speed fiber internet plan for your home or business in Rizal. Enjoy 0 data capping, symmetrical speeds, and transparent billing.
      </p>

      <!-- Live Pricing Status Indicator -->
      <div class="flex items-center justify-center gap-2 pt-2" aria-live="polite">
        <span v-if="isLoading" class="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
          <RotateCw class="w-3.5 h-3.5 animate-spin" />
          Checking for the latest pricing...
        </span>
        <span v-else-if="plansError" class="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
          <AlertCircle class="w-3.5 h-3.5" />
          {{ plansError }}
        </span>
        <span v-else class="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
          <Wifi class="w-3.5 h-3.5" />
          Live pricing — updated just now
        </span>
        <button
          @click="refreshPlans"
          :disabled="isLoading"
          title="Refresh plans"
          aria-label="Refresh plans"
          class="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-[#ee2824] dark:hover:text-white transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#ee2824]/40"
        >
          <RotateCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
        </button>
      </div>
    </div>

    <!-- Plans Matrix Grid -->
    <div v-if="availablePlans.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <PlanCard
        v-for="plan in availablePlans"
        :key="plan.id"
        :plan="plan"
        @select="handleSelect"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="glass-card p-10 rounded-3xl border dark:border-slate-800 border-slate-200 text-center space-y-3 max-w-xl mx-auto">
      <AlertCircle class="w-10 h-10 text-amber-500 mx-auto" />
      <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">Plans are temporarily unavailable</h2>
      <p class="text-sm dark:text-slate-400 text-slate-600">
        Please try refreshing, or call our hotline at
        <a href="tel:09154077565" class="text-[#ee2824] dark:text-[#ff6b67] font-bold hover:underline">0915 407 7565</a>
        and we'll walk you through the options.
      </p>
      <button @click="refreshPlans" class="btn-secondary text-sm mx-auto">Try Again</button>
    </div>

    <!-- Detailed Plan Features Comparison Table -->
    <div v-if="availablePlans.length" class="glass-panel p-6 md:p-10 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-6">
      <div class="border-b dark:border-slate-800 border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold font-heading dark:text-white text-slate-900">Plan Comparison Matrix</h2>
          <p class="text-xs dark:text-slate-400 text-slate-500">All plans include free standard installation and ONU Wi-Fi modem.</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <caption class="sr-only">Comparison of Switch Fiber plan pricing, speed, data cap, router and lock-in period</caption>
          <thead>
            <tr class="border-b dark:border-slate-800 border-slate-200 text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
              <th scope="col" class="py-4 px-4">Feature</th>
              <th
                v-for="plan in availablePlans"
                :key="plan.id"
                scope="col"
                class="py-4 px-4 text-center font-bold"
                :class="plan.recommended ? 'text-[#ee2824] dark:text-[#ff6b67]' : 'dark:text-slate-300 text-slate-700'"
              >
                {{ plan.title.replace(' Plan', '') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y dark:divide-slate-800/60 divide-slate-200 text-sm dark:text-slate-300 text-slate-600">
            <tr>
              <th scope="row" class="py-4 px-4 text-left font-semibold dark:text-white text-slate-900">Monthly Fee</th>
              <td
                v-for="plan in availablePlans"
                :key="plan.id"
                class="py-4 px-4 text-center font-bold"
                :class="plan.recommended ? 'text-[#ee2824] dark:text-[#ff6b67]' : ''"
              >
                ₱{{ plan.price }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="py-4 px-4 text-left font-semibold dark:text-white text-slate-900">Speed Tier</th>
              <td
                v-for="plan in availablePlans"
                :key="plan.id"
                class="py-4 px-4 text-center"
                :class="plan.recommended ? 'text-[#ee2824] dark:text-[#ff6b67] font-bold' : ''"
              >
                {{ plan.speed.replace('Turbo Speed ', '').replace('(', '').replace(')', '') }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="py-4 px-4 text-left font-semibold dark:text-white text-slate-900">Data Cap</th>
              <td v-for="plan in availablePlans" :key="plan.id" class="py-4 px-4 text-center text-emerald-600 dark:text-emerald-400">
                {{ plan.dataCap }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="py-4 px-4 text-left font-semibold dark:text-white text-slate-900">Router Included</th>
              <td v-for="plan in availablePlans" :key="plan.id" class="py-4 px-4 text-center">
                {{ plan.router }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="py-4 px-4 text-left font-semibold dark:text-white text-slate-900">Wi-Fi Mesh</th>
              <td v-for="plan in availablePlans" :key="plan.id" class="py-4 px-4 text-center">
                {{ plan.mesh }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="py-4 px-4 text-left font-semibold dark:text-white text-slate-900">Support</th>
              <td v-for="plan in availablePlans" :key="plan.id" class="py-4 px-4 text-center">
                {{ plan.support }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="py-4 px-4 text-left font-semibold dark:text-white text-slate-900">Lock-In Period</th>
              <td v-for="plan in availablePlans" :key="plan.id" class="py-4 px-4 text-center">
                {{ plan.lockIn }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="py-4 px-4 text-left font-semibold dark:text-white text-slate-900">Action</th>
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
  registrationStore.selectPlan(plan)
  router.push({ path: '/register', query: { plan: plan.id } })
}

function refreshPlans() {
  registrationStore.fetchPlans(true)
}
</script>

