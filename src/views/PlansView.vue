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
              <th class="py-4 px-4 text-center">SwitchLite</th>
              <th class="py-4 px-4 text-center">SwitchConnect</th>
              <th class="py-4 px-4 text-center text-[#ff6b67]">SwitchNet</th>
              <th class="py-4 px-4 text-center">SwitchSpeed</th>
              <th class="py-4 px-4 text-center">SwitchUltra</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 text-sm text-slate-300">
            <tr>
              <td class="py-4 px-4 font-semibold text-white">Monthly Fee</td>
              <td class="py-4 px-4 text-center font-bold">₱699</td>
              <td class="py-4 px-4 text-center font-bold">₱799</td>
              <td class="py-4 px-4 text-center font-bold text-[#ff6b67]">₱999</td>
              <td class="py-4 px-4 text-center font-bold">₱1,299</td>
              <td class="py-4 px-4 text-center font-bold">₱1,499</td>
            </tr>
            <tr>
              <td class="py-4 px-4 font-semibold text-white">Speed Tier</td>
              <td class="py-4 px-4 text-center">30 Mbps</td>
              <td class="py-4 px-4 text-center">60 Mbps</td>
              <td class="py-4 px-4 text-center text-[#ff6b67] font-bold">100 Mbps</td>
              <td class="py-4 px-4 text-center">200 Mbps</td>
              <td class="py-4 px-4 text-center">350+ Mbps</td>
            </tr>
            <tr>
              <td class="py-4 px-4 font-semibold text-white">Data Cap</td>
              <td class="py-4 px-4 text-center text-emerald-400">Unlimited</td>
              <td class="py-4 px-4 text-center text-emerald-400">Unlimited</td>
              <td class="py-4 px-4 text-center text-emerald-400">Unlimited</td>
              <td class="py-4 px-4 text-center text-emerald-400">Unlimited</td>
              <td class="py-4 px-4 text-center text-emerald-400">Unlimited</td>
            </tr>
            <tr>
              <td class="py-4 px-4 font-semibold text-white">Router Included</td>
              <td class="py-4 px-4 text-center">Standard Wi-Fi</td>
              <td class="py-4 px-4 text-center">Dual-Band ONU</td>
              <td class="py-4 px-4 text-center text-[#ff6b67]">Dual-Band Wi-Fi 6</td>
              <td class="py-4 px-4 text-center">+1 Mesh Node</td>
              <td class="py-4 px-4 text-center">+2 Mesh Nodes</td>
            </tr>
            <tr>
              <td class="py-4 px-4 font-semibold text-white">Lock-In Period</td>
              <td class="py-4 px-4 text-center">1 Year</td>
              <td class="py-4 px-4 text-center">1 Year</td>
              <td class="py-4 px-4 text-center">1 Year</td>
              <td class="py-4 px-4 text-center">1 Year</td>
              <td class="py-4 px-4 text-center">1 Year</td>
            </tr>
            <tr>
              <td class="py-4 px-4 font-semibold text-white">Action</td>
              <td class="py-4 px-4 text-center">
                <button @click="handleSelect(availablePlans[0])" class="btn-secondary text-xs py-1.5 px-3">Apply</button>
              </td>
              <td class="py-4 px-4 text-center">
                <button @click="handleSelect(availablePlans[1])" class="btn-secondary text-xs py-1.5 px-3">Apply</button>
              </td>
              <td class="py-4 px-4 text-center">
                <button @click="handleSelect(availablePlans[2])" class="btn-primary text-xs py-1.5 px-3">Apply</button>
              </td>
              <td class="py-4 px-4 text-center">
                <button @click="handleSelect(availablePlans[3])" class="btn-secondary text-xs py-1.5 px-3">Apply</button>
              </td>
              <td class="py-4 px-4 text-center">
                <button @click="handleSelect(availablePlans[4])" class="btn-secondary text-xs py-1.5 px-3">Apply</button>
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
import { Sparkles } from 'lucide-vue-next'
import PlanCard from '../components/PlanCard.vue'
import { useRegistrationStore } from '../stores/registration'

const router = useRouter()
const registrationStore = useRegistrationStore()
const availablePlans = computed(() => registrationStore.availablePlans)

function handleSelect(plan) {
  registrationStore.openModal(plan.id)
  router.push('/register')
}
</script>
