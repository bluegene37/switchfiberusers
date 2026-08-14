<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
    
    <!-- Title Banner -->
    <div class="text-center space-y-4 max-w-3xl mx-auto">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-widest">
        <Sparkles class="w-3.5 h-3.5" />
        <span>Unlimited Fiber Internet & MSME Deals</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-extrabold font-heading dark:text-white text-slate-900 tracking-tight">
        Fiber Plans, Business Bundles & Promos
      </h1>
      <p class="dark:text-slate-300 text-slate-600 text-base leading-relaxed">
        Choose the perfect turbo-speed fiber internet plan for your home or enterprise in Rizal. Enjoy 0 data capping, symmetrical speeds, and transparent billing.
      </p>

      <!-- Category Filter Tabs -->
      <div class="flex items-center justify-center gap-2 pt-4 flex-wrap" role="tablist">
        <button
          v-for="tab in planTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          role="tab"
          :aria-selected="activeTab === tab.id"
          class="px-5 py-2.5 rounded-full text-xs font-bold transition-all border flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#ee2824]/40"
          :class="activeTab === tab.id
            ? 'bg-[#ee2824] text-white border-[#ee2824] shadow-lg shadow-[#ee2824]/25'
            : 'dark:bg-slate-900 bg-white dark:text-slate-300 text-slate-700 dark:border-slate-800 border-slate-200 hover:border-[#ee2824]/40'"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Live Pricing Status Indicator for Residential Tab -->
      <div v-if="activeTab === 'residential'" class="flex items-center justify-center gap-2 pt-2" aria-live="polite">
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

    <!-- TAB 1: RESIDENTIAL PLANS MATRIX -->
    <div v-if="activeTab === 'residential'" class="space-y-16">
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
            <h2 class="text-2xl font-bold font-heading dark:text-white text-slate-900">Residential Plan Comparison Matrix</h2>
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

    <!-- TAB 2: MSME SMARTBIZ BUNDLE DEALS -->
    <div v-else-if="activeTab === 'msme'" class="space-y-12">
      <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 dark:bg-amber-500/5 bg-amber-50/70 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div class="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-lg">
          <Briefcase class="w-8 h-8" />
        </div>
        <div class="space-y-1 flex-1">
          <span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
            Business Owners & Entrepreneurs
          </span>
          <h3 class="text-2xl font-bold font-heading dark:text-white text-slate-900">SmartBiz MSME Internet + Device Bundles</h3>
          <p class="text-xs sm:text-sm dark:text-slate-300 text-slate-600 leading-relaxed">
            Level up your business operations in Rizal with high-speed fiber connection + essential workplace gadgets like Laptops, CCTVs, Wi-Fi Mesh, Tablets, and Smartphones.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="bundle in msmeBundles" 
          :key="bundle.title"
          class="glass-card p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-6 flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 relative group"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase">
                {{ bundle.tag }}
              </span>
              <span class="text-xs dark:text-slate-400 text-slate-500 font-mono font-bold">{{ bundle.lockIn }}</span>
            </div>

            <h3 class="text-2xl font-bold font-heading dark:text-white text-slate-900">{{ bundle.title }}</h3>
            
            <div class="space-y-1">
              <div class="flex items-baseline gap-1">
                <span class="text-3xl sm:text-4xl font-extrabold font-heading text-amber-600 dark:text-amber-400">₱{{ bundle.price }}</span>
                <span class="text-xs dark:text-slate-400 text-slate-500">/ month</span>
              </div>
              <p class="text-xs dark:text-slate-300 text-slate-600 font-semibold">{{ bundle.speed }}</p>
            </div>

            <hr class="dark:border-slate-800 border-slate-200" />

            <div class="space-y-2.5">
              <span class="text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider block">Included Gadgets & Perks:</span>
              <ul class="space-y-2 text-xs dark:text-slate-300 text-slate-600">
                <li v-for="(item, idx) in bundle.perks" :key="idx" class="flex items-start gap-2">
                  <CheckCircle2 class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="pt-4">
            <router-link to="/register" class="btn-primary w-full py-3 text-xs bg-amber-600 hover:bg-amber-500 shadow-amber-500/20 text-center flex items-center justify-center gap-2">
              <span>Apply for MSME Bundle</span>
              <ArrowRight class="w-4 h-4" />
            </router-link>
          </div>
        </div>
      </div>

      <!-- MSME Terms & Warranty Callout -->
      <div class="glass-card p-6 sm:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 max-w-4xl mx-auto space-y-3 text-xs dark:text-slate-400 text-slate-600 leading-relaxed">
        <h4 class="font-bold dark:text-white text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck class="w-4 h-4 text-amber-500" />
          <span>SmartBiz Terms & Hardware Coverage</span>
        </h4>
        <p>
          • 24-month lock-in period applies to standard SmartBiz bundle plans. Installation and setup are included with subscription.<br />
          • All hardware items (CCTV, Mesh, Gadgets) carry manufacturer warranty and are covered by a 7-day initial inspection guarantee. Inquire via hotlines <strong>0915-407-7565</strong> / <strong>0917-876-2440</strong>.
        </p>
      </div>
    </div>

    <!-- TAB 3: PROMOS & DISCOUNTS -->
    <div v-else-if="activeTab === 'promos'" class="space-y-12">
      <!-- Back to School Promo Card -->
      <div class="glass-panel p-8 sm:p-12 rounded-3xl border border-sky-500/40 relative overflow-hidden space-y-8 max-w-4xl mx-auto">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="space-y-2 flex-1">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-bold uppercase">
              <Gift class="w-3.5 h-3.5" />
              <span>Special Campaign</span>
            </span>
            <h3 class="text-2xl sm:text-3xl font-extrabold font-heading dark:text-white text-slate-900">
              Get ConnectED: Back to School Promo!
            </h3>
            <p class="text-sm dark:text-slate-300 text-slate-600 leading-relaxed">
              Exclusive discount promo for Parents, Teachers, Educators, and Students residing within Switch Fiber serviceable areas in Rizal!
            </p>
          </div>
          <div class="px-6 py-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center shrink-0">
            <span class="text-3xl font-extrabold text-sky-600 dark:text-sky-400 font-heading block">15% OFF</span>
            <span class="text-xs dark:text-slate-300 text-slate-700 font-bold block">For 6 Billing Cycles</span>
            <span class="text-[10px] text-sky-600 dark:text-sky-400 font-semibold mt-1 block">+ Free Switch Tumbler</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t dark:border-slate-800 border-slate-200">
          <div class="space-y-2 text-xs dark:text-slate-300 text-slate-600">
            <h5 class="font-bold dark:text-white text-slate-900 text-sm">Eligibility & Requirements:</h5>
            <ul class="space-y-1.5 list-disc list-inside">
              <li><strong>Students:</strong> Proof of Enrollment (Official Reg Form / Student ID / Assessment Slip).</li>
              <li><strong>Parents:</strong> Parent Government ID and Child's Proof of Enrollment.</li>
              <li><strong>Educators:</strong> PRC ID or Faculty/School ID.</li>
              <li>Applicants must be 18 years old or older.</li>
            </ul>
          </div>

          <div class="space-y-2 text-xs dark:text-slate-300 text-slate-600">
            <h5 class="font-bold dark:text-white text-slate-900 text-sm">How to Claim & Terms:</h5>
            <ul class="space-y-1.5 list-disc list-inside">
              <li>15% discount reflects on the 1st through 6th billing cycles.</li>
              <li>Claim free Switch tumbler at our Head Office (315 Sampaloc St., Batingan, Binangonan).</li>
              <li>12 months contract period applies. Valid for online & walk-in applications.</li>
            </ul>
          </div>
        </div>

        <div class="pt-2 flex flex-col sm:flex-row gap-4">
          <router-link to="/register" class="btn-primary py-3 px-8 text-xs flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500">
            <Sparkles class="w-4 h-4" />
            <span>Apply Online with Student/Educator Promo</span>
          </router-link>
          <router-link to="/contact" class="btn-secondary py-3 px-6 text-xs text-center">
            <span>Inquire at Office</span>
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles, RotateCw, Wifi, AlertCircle, Home, Briefcase, Gift, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-vue-next'
import PlanCard from '../components/PlanCard.vue'
import { useRegistrationStore } from '../stores/registration'

const router = useRouter()
const registrationStore = useRegistrationStore()

const activeTab = ref('residential')

const planTabs = [
  { id: 'residential', label: 'Residential Fiber Plans', icon: Home },
  { id: 'msme', label: 'MSME SmartBiz Bundles', icon: Briefcase },
  { id: 'promos', label: 'Promos & Back-to-School', icon: Gift }
]

const availablePlans = computed(() => registrationStore.availablePlans)
const isLoading = computed(() => registrationStore.isLoadingPlans)
const plansError = computed(() => registrationStore.plansError)

const msmeBundles = [
  {
    title: 'SmartBiz Starter Bundle',
    price: '1,999',
    speed: 'Up to 200 Mbps Turbo Speed',
    lockIn: '24 Months Lock-in',
    tag: 'SME Entry',
    perks: [
      'Dual-Band Wi-Fi 6 Router',
      'Free 1x Smart Security CCTV Camera',
      '1x High-Range Wi-Fi Mesh Node',
      'Zero Data Capping & Symmetrical Speed',
      'Priority Business Hotline Support'
    ]
  },
  {
    title: 'SmartBiz Pro Bundle',
    price: '2,899',
    speed: 'Up to 350 Mbps Turbo Speed',
    lockIn: '24 Months Lock-in',
    tag: 'Popular for Retail',
    perks: [
      'Dual-Band Wi-Fi 6 High-Capacity Router',
      'Free Android Tablet for POS / Ordering',
      '2x Smart 360° Security CCTV Cameras',
      '2x High-Range Wi-Fi Mesh Nodes',
      'VIP SLA & Dispatch Routing'
    ]
  },
  {
    title: 'SmartBiz Enterprise Bundle',
    price: '3,999',
    speed: 'Up to 500 Mbps Turbo Speed',
    lockIn: '24 Months Lock-in',
    tag: 'Full Office Suite',
    perks: [
      'Enterprise Gateway & Mesh System',
      'Free Laptop / Workstation Device Bundle',
      '4-Camera Complete Security CCTV System',
      'Static IP Configuration Option',
      'Dedicated Account Manager & 24/7 VIP NOC'
    ]
  }
]

function handleSelect(plan) {
  registrationStore.selectPlan(plan)
  router.push({ path: '/register', query: { plan: plan.id } })
}

function refreshPlans() {
  registrationStore.fetchPlans(true)
}
</script>


